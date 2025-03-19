using Com.Trimblemaps.Mapsdk.Geometry;
using NxLatLng = TrimbleMaps.MapsSDK.LatLng;
using NxLatLngBounds = TrimbleMaps.MapsSDK.LatLngBounds;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public static class PositionExtensions
    {
        public static LatLng ToLatLng(this NxLatLng pos)
        {
            return new LatLng(pos.Lat, pos.Long);
        }

        public static NxLatLng ToLatLng(this LatLng pos)
        {
            return new NxLatLng(pos.Latitude, pos.Longitude);
        }

        public static LatLngBounds ToLatLngBounds(this NxLatLngBounds pos)
        {
            return LatLngBounds.From(pos.NorthEast.Lat, pos.NorthEast.Long, pos.SouthWest.Lat, pos.SouthWest.Long);
        }
    }
}
