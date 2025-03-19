using TrimbleMaps.MapsSDK;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public partial class MapViewRenderer
    {
        public LatLngBounds GetVisibleBounds()
        {
            var region = map.Projection.GetVisibleRegion(true);
            if (region != null)
            {
                var bounds = new LatLngBounds()
                {
                    NorthEast = new LatLng(region.LatLngBounds.NorthEast.Latitude, region.LatLngBounds.NorthEast.Longitude),
                    SouthWest = new LatLng(region.LatLngBounds.SouthWest.Latitude, region.LatLngBounds.SouthWest.Longitude)
                };

                return bounds;
            }
            else
            {
                return new LatLngBounds();
            }
        }
    }
}