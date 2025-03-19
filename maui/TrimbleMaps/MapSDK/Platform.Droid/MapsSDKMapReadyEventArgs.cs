using System;
using Sdk = Com.Trimblemaps.Mapsdk;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public class MapsSDKMapReadyEventArgs : EventArgs
    {
        public Sdk.Maps.TrimbleMapsMap Map { get; private set; }
        public Sdk.Maps.MapView MapView { get; private set; }
        public MapsSDKMapReadyEventArgs(Sdk.Maps.TrimbleMapsMap map, Sdk.Maps.MapView mapview)
        {
            MapView = mapview;
            Map = map;
        }
    }
}
