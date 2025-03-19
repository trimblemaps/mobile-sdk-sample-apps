using System;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Com.Trimblemaps.Mapsdk.Annotations;
using Com.Trimblemaps.Mapsdk.Utils;
using Com.Trimblemaps.Mapsdk.Maps;
using TrimbleMaps.MapsSDK.Platform.Droid.Extensions;
using Microsoft.Maui.ApplicationModel;
using View = Android.Views.View;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public class MapViewFragment : SupportMapFragment
    {
        public static MapViewFragment Create(TrimbleMaps.Controls.Forms.MapView mapView, Context context)
        {
            var mapOptions = mapView.CreateOptions(context);

            return new MapViewFragment {Arguments = MapFragmentUtils.CreateFragmentArgs(mapOptions)};
        }
        
        public MapView MapView { get; private set; }

        public bool StateSaved { get; private set; }

        public MapViewFragment(IntPtr javaReference, JniHandleOwnership transfer)
            : base(javaReference, transfer)
        {
        }

        public MapViewFragment() : base() { }
        
        public override void OnViewCreated(View view, Bundle savedInstanceState)
        {
            base.OnViewCreated(view, savedInstanceState);

            MapView = view as MapView;
        }


        public override void OnDestroyView()
        {
            base.OnDestroyView();
        }

        public override void OnResume()
        {
            base.OnResume();
        }

        public override void OnSaveInstanceState(Bundle outState)
        {
            base.OnSaveInstanceState(outState);
        }

        internal void ToggleInfoWindow(TrimbleMapsMap MapsSDKMap, Marker marker)
        {
            if (marker.IsInfoWindowShown)
            {
                MapsSDKMap.DeselectMarker(marker);
            }
            else
            {
                MapsSDKMap.SelectMarker(marker);
            }
        }
    }
}
