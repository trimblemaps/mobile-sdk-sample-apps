using TrimbleMaps.Controls.MapsSDK.Platform.Droid;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.MapsSDK.Platform.Droid.Extensions
{
    public static class LatLngQuadExtensions
    {
        public static Com.Trimblemaps.Mapsdk.Geometry.LatLngQuad ToNative(this LatLngQuad quad)
        {
            return new Com.Trimblemaps.Mapsdk.Geometry.LatLngQuad(
                quad.TopLeft.ToLatLng(),
                quad.TopRight.ToLatLng(),
                quad.BottomRight.ToLatLng(),
                quad.BottomLeft.ToLatLng()
                );
        }
    }
}