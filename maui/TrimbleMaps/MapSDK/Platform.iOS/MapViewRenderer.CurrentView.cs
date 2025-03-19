using TrimbleMaps.MapsSDK;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.iOS
{
    public partial class MapViewRenderer
    {
        public LatLngBounds GetVisibleBounds()
        {
            return map.VisibleCoordinateBounds.ToLatLngBounds();
        }
    }
}