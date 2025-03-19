using TrimbleMaps.MapsSDK;

namespace TrimbleMaps.Controls.Forms
{
    public class OfflinePackRegion
    {
        public string StyleURL { get; set; }

        public LatLngBounds Bounds { get; set; }

        public double MaximumZoomLevel { get; set; }

        public double MinimumZoomLevel { get; set; }
    }
}