using System;
using Com.Trimblemaps.Mapsdk.Offline;
using Microsoft.Maui.ApplicationModel;
namespace TrimbleMaps.MapsSDK.Platform.Droid.Offline
{
    public class ListOfflineRegionsCallback: Java.Lang.Object, OfflineManager.IListOfflineRegionsCallback
    {
        public ListOfflineRegionsCallback()
        {
        }

        public Action<OfflineRegion[]> OnListHandle;
        public Action<string> OnErrorHandle;

        public void OnError(string error)
        {
            OnErrorHandle?.Invoke(error);
        }

        public void OnList(OfflineRegion[] offlineRegions)
        {
            OnListHandle?.Invoke(offlineRegions);
        }
    }
}
