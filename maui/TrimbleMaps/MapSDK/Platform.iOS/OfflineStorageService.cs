using System;
using System.Collections.Generic;
using Foundation;
using TrimbleMaps.Controls.Forms;
using MapsSDK;
using System.Threading.Tasks;
using TrimbleMaps.Controls.MapsSDK.Platform.iOS.Extensions;
using System.Linq;
using ObjCRuntime;
using System.IO;
using Microsoft.Maui.ApplicationModel;

[assembly: Xamarin.Forms.Dependency(typeof(TrimbleMaps.Controls.MapsSDK.Platform.iOS.OfflineStorageService))]
namespace TrimbleMaps.Controls.MapsSDK.Platform.iOS
{
    public class OfflineStorageService : NSObject, IOfflineStorageService
    {
        Dictionary<nuint, OfflinePack> tempPacks;

        public event EventHandler<OSSEventArgs> OfflinePackProgressChanged;
        public event EventHandler<OSSErrorEventArgs> OfflinePackGotError;
        public event EventHandler<OSSMaximumMapsSDKTilesReachedEventArgs> MaximumMapsSDKTilesReached;

        public OfflineStorageService()
        {
            NSNotificationCenter.DefaultCenter.AddObserver(MGLOfflinePackKeys.ProgressChangedNotification, OnOfflinePackProgressChanged, null);
            NSNotificationCenter.DefaultCenter.AddObserver(MGLOfflinePackKeys.ErrorNotification, OnOfflinePackError, null);
            NSNotificationCenter.DefaultCenter.AddObserver(MGLOfflinePackKeys.MaximumMapsSDKTilesReachedNotification, OnMaximumMapsSDKTilesReached, null);

            tempPacks = new Dictionary<nuint, OfflinePack>();
        }


        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);

            NSNotificationCenter.DefaultCenter.RemoveObserver(this);
            packsObservingToken?.Dispose();
            packsObservingToken = null;
            getPacksTask?.SetCanceled();
        }

        private void OnOfflinePackError(NSNotification notification)
        {

            MGLOfflinePack pack = notification.Object as MGLOfflinePack;
            NSError error = notification.UserInfo[MGLOfflinePackKeys.UserInfoKeyError] as NSError;
            OfflinePack formsPack;
            var hash = pack.GetNativeHash();
            if (tempPacks.ContainsKey(hash))
            {
                formsPack = tempPacks[hash];
                formsPack.State = (OfflinePackState)pack.State;
                tempPacks.Remove(hash);
            }
            else
            {
                formsPack = pack.ToFormsPack();
            }
            OfflinePackGotError?.Invoke(this, new OSSErrorEventArgs()
            {
                OfflinePack = formsPack,
                ErrorMessage = error.LocalizedFailureReason
            });
        }

        private void OnMaximumMapsSDKTilesReached(NSNotification notification)
        {
            MGLOfflinePack pack = notification.Object as MGLOfflinePack;

            var maximumCount = notification.UserInfo[MGLOfflinePackKeys.UserInfoKeyMaximumCount] as NSNumber;
            var hash = pack.GetNativeHash();
            OfflinePack formsPack;
            if (tempPacks.ContainsKey(hash))
            {
                formsPack = tempPacks[hash];
                formsPack.State = (OfflinePackState)pack.State;
                tempPacks.Remove(hash);
            }
            else
            {
                formsPack = pack.ToFormsPack();
            }

            MaximumMapsSDKTilesReached?.Invoke(this, new OSSMaximumMapsSDKTilesReachedEventArgs()
            {
                OfflinePack = formsPack,
                MaximumCount = maximumCount.UInt64Value
            });
        }

        private void OnOfflinePackProgressChanged(NSNotification notification)
        {
            MGLOfflinePack pack = notification.Object as MGLOfflinePack;
            var hash = pack.GetNativeHash();
            var completed = pack.State == MGLOfflinePackState.Complete || (pack.Progress.countOfResourcesExpected == pack.Progress.countOfResourcesCompleted);
            OfflinePack formsPack;
            if (tempPacks.ContainsKey(hash))
            {
                formsPack = tempPacks[hash];
                formsPack.Progress = pack.Progress.ToFormsProgress();
                formsPack.State = (OfflinePackState)pack.State;
                if (completed)
                {
                    tempPacks.Remove(hash);
                }
            }
            else
            {
                formsPack = pack.ToFormsPack();
                if (!completed)
                {
                    tempPacks.Add(hash, formsPack);
                }
            }
            OfflinePackProgressChanged?.Invoke(this, new OSSEventArgs()
            {
                OfflinePack = formsPack
            });
        }

        public Task<OfflinePack> DownloadMap(OfflinePackRegion formsRegion, Dictionary<string, string> packInfo)
        {
            var tsc = new TaskCompletionSource<OfflinePack>();
            var region = new MGLTilePyramidOfflineRegion(
                new NSUrl(formsRegion.StyleURL),
                formsRegion.Bounds.ToNative(),
                formsRegion.MinimumZoomLevel,
                formsRegion.MaximumZoomLevel);
            NSData context = null;
            if (packInfo != null)
            {
                var keys = new List<NSString>();
                var values = new List<NSString>();
                foreach (string key in packInfo.Keys)
                {
                    keys.Add((NSString)key);
                    values.Add((NSString)packInfo[key]);
                }
                var userInfo = NSDictionary.FromObjectsAndKeys(values.ToArray(), keys.ToArray());
                context = NSKeyedArchiver.ArchivedDataWithRootObject(userInfo);
            }

            MGLOfflineStorage.SharedOfflineStorage.AddPackForRegion(region, context, (pack, error) =>
            {
                if (error != null)
                {
                    System.Diagnostics.Debug.WriteLine("Couldn't create offline pack: " + error.LocalizedFailureReason);
                    tsc.TrySetResult(null);
                }
                else
                {
                    pack.Resume();
                    var formsPack = pack.ToFormsPack();
                    tempPacks.Add(pack.GetNativeHash(), formsPack);
                    tsc.TrySetResult(formsPack);
                }
            });

            return tsc.Task;
        }

        IDisposable packsObservingToken;
        TaskCompletionSource<OfflinePack[]> getPacksTask;
        public Task<OfflinePack[]> GetPacks()
        {
            var tsc = new TaskCompletionSource<OfflinePack[]>();
            var sharedStorage = MGLOfflineStorage.SharedOfflineStorage;
            var packs = sharedStorage.Packs;
            if (packs == null)
            {
                /*
                 * This property is set to nil, indicating that the receiver does not yet know the existing packs, 
                 * for an undefined amount of time starting from the moment the shared offline storage object is initialized 
                 * until the packs are fetched from the database. After that point, this property is always non-nil,
                 * but it may be empty to indicate that no packs are present. 
                 * To detect when the shared offline storage object has finished loading its packs property,
                 * observe KVO change notifications on the packs key path. The initial load results in an NSKeyValueChangeSetting change.
                */
                getPacksTask = tsc;
                packsObservingToken = sharedStorage.AddObserver("packs", NSKeyValueObservingOptions.Initial | NSKeyValueObservingOptions.New, (obj) =>
                {
                    var allPacks = sharedStorage.Packs;
                    if (allPacks != null)
                    {
                        getPacksTask?.SetResult(allPacks?.Select((arg) => arg.ToFormsPack()).ToArray());
                        packsObservingToken?.Dispose();
                        packsObservingToken = null;
                        getPacksTask = null;
                    }
                });
            }
            else
            {
                tsc.SetResult(packs.Select((arg) => arg.ToFormsPack()).ToArray());
            }
            return tsc.Task;
        }

        public Task<bool> RemovePack(OfflinePack pack)
        {
            var tsc = new TaskCompletionSource<bool>();
            try
            {
                var mbPack = Runtime.GetNSObject<MGLOfflinePack>(pack.Handle);
                MGLOfflineStorage.SharedOfflineStorage.RemovePack(mbPack, (error) =>
                {
                    if (error == null)
                    {
                        tsc.TrySetResult(true);
                    }
                    else
                    {
                        System.Diagnostics.Debug.WriteLine("Removing offline pack failed: " + error.LocalizedFailureReason);
                        tsc.TrySetResult(false);
                    }
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("[Exception]: " + ex.Message);
                tsc.TrySetResult(false);
            }
            return tsc.Task;
        }

        public Task<bool> Resume(OfflinePack pack)
        {
            try
            {
                var mbPack = Runtime.GetNSObject<MGLOfflinePack>(pack.Handle);
                mbPack.Resume();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("[Exception]: " + ex.Message);
                return Task.FromResult(false);
            }
        }

        public Task<bool> SuspendPack(OfflinePack pack)
        {
            try
            {
                var mbPack = Runtime.GetNSObject<MGLOfflinePack>(pack.Handle);
                mbPack.Suspend();
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("[TrimbleMaps.MapsSDK] Suspend offline pack failed: " + ex.Message);
                return Task.FromResult(false);
            }
        }

        public void RequestPackProgress(OfflinePack pack)
        {
            try
            {
                var mbPack = Runtime.GetNSObject<MGLOfflinePack>(pack.Handle);
                mbPack.RequestProgress();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("[TrimbleMaps.MapsSDK] Request progress of offline pack failed: " + ex.Message);
            }
        }


        // must handle here
        async Task<bool> IOfflineStorageService.Resume(OfflinePack pack)
        {
            if (pack == null) return false;
            var mbPack = Runtime.GetNSObject<MGLOfflinePack>(pack.Handle);
            if (mbPack.State == MGLOfflinePackState.Invalid || mbPack.State == MGLOfflinePackState.Unknown) return false;
            mbPack.Resume();
            if (mbPack.State == MGLOfflinePackState.Active) return true;
            return true;
        }

        async Task<bool> IOfflineStorageService.SuspendPack(OfflinePack pack)
        {
            if (pack == null) return false;
            var mbPack = Runtime.GetNSObject<MGLOfflinePack>(pack.Handle);
            if (mbPack.State == MGLOfflinePackState.Invalid || mbPack.State == MGLOfflinePackState.Unknown) return false;
            mbPack.Suspend();
            if (mbPack.State == MGLOfflinePackState.Inactive) return true;
            return true;
        }

        public Task<bool> Sideload(string filePath)
        {
            var exists = NSFileManager.DefaultManager.FileExists(filePath);

            if (exists == false) {
                return Task.FromResult(true);
            }

            var tcs = new TaskCompletionSource<bool>();

            var tempPath = Path.Combine(NSFileManager.DefaultManager.GetTemporaryDirectory().AbsoluteString, Guid.NewGuid().ToString());

            NSFileManager.DefaultManager.Copy(
                NSUrl.FromString(filePath.StartsWith("file://", StringComparison.OrdinalIgnoreCase) ? filePath : "file://" + filePath),
                NSUrl.FromString(tempPath),
                out var err
                );

            if (err != null)
            {
                return Task.FromException<bool>(new Exception(err.DebugDescription));
            }

            MGLOfflineStorage.SharedOfflineStorage.AddContentsOfURL(
                NSUrl.FromString(tempPath),
                (NSUrl fileUrl, MGLOfflinePack[] packages, NSError error) =>
                {
                    if (error != null)
                    {
                        tcs.TrySetException(new Exception(error.UserInfo.DebugDescription));
                        return;
                    }
                    tcs.TrySetResult(true);
                });

            return tcs.Task;
        }
    }
}
