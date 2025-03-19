using System;
using Com.Trimblemaps.Mapsdk.Offline;
using Microsoft.Maui.ApplicationModel;
namespace TrimbleMaps.MapsSDK.Platform.Droid.Offline
{
    public class OfflineRegionObserver: Java.Lang.Object, OfflineRegion.IOfflineRegionObserver
    {
        public OfflineRegionObserver(Action<OfflineRegionStatus> statusHandle, 
                                     Action<OfflineRegionError>  errorHandle,
                                     Action<long> tileCountLimitExceededHanle)
        {
            this.OnStatusChangedHandle = statusHandle;
            this.OnErrorHandle = errorHandle;
            this.OnMapsSDKTileCountLimitExceededHandle = tileCountLimitExceededHanle;
        }

        internal Action<long> OnMapsSDKTileCountLimitExceededHandle { get; set; }
        internal Action<OfflineRegionError> OnErrorHandle { get; set; }
        internal Action<OfflineRegionStatus> OnStatusChangedHandle { get; set; }

        public void TileCountLimitExceeded(long p0)
        {
            OnMapsSDKTileCountLimitExceededHandle?.Invoke(p0);
        }

        public void OnError(OfflineRegionError offlineRegionError)
        {
            OnErrorHandle?.Invoke(offlineRegionError);
        }

        public void OnStatusChanged(OfflineRegionStatus offlineRegionStatus)
        {
            OnStatusChangedHandle?.Invoke(offlineRegionStatus);
        }
    }
}
