using System;
using static Com.Trimblemaps.Mapsdk.Maps.TrimbleMapsMap;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public class CancelableCallback: Java.Lang.Object, ICancelableCallback
    {
        public Action FinishHandler;
        public Action CancelHandler;

        public CancelableCallback()
        {
        }

        public void OnCancel()
        {
            CancelHandler?.Invoke();
        }

        public void OnFinish()
        {
            FinishHandler?.Invoke();
        }
    }
}
