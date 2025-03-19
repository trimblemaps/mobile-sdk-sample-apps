﻿using System;
using Com.Trimblemaps.Mapsdk.Offline;
using Microsoft.Maui.ApplicationModel;
namespace TrimbleMaps.MapsSDK.Platform.Droid.Offline
{
    public class CreateOfflineRegionCallback: Java.Lang.Object, OfflineManager.ICreateOfflineRegionCallback
    {
        public CreateOfflineRegionCallback(Action<OfflineRegion> onCreateHandle, Action<string> onErrorHandle)
        {
            this.OnCreateHandle = onCreateHandle;
            this.OnErrorHandle = onErrorHandle;
        }

        public CreateOfflineRegionCallback(IntPtr handle, Android.Runtime.JniHandleOwnership ownership)
            : base(handle, ownership)
        {
        }

        public Action<OfflineRegion> OnCreateHandle { get; set; }
        public Action<string> OnErrorHandle { get; set; }

		public void OnCreate(OfflineRegion offlineRegion)
        {
            OnCreateHandle?.Invoke(offlineRegion);
        }

        public void OnError(string error)
        {
            OnErrorHandle?.Invoke(error);
        }
    }
}
