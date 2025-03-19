using TrimbleMaps.MapsSDK;
using Microsoft.Maui.Controls.Handlers.Compatibility;
using Microsoft.Maui.Controls.Platform;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public partial class MapViewRenderer
    {

        public void ToggleTrafficLayer()
        {
            if (map == null) return;
            map.ToggleTrafficVisibility();
        }

        public void ToggleWeatherAlertLayer()
        {
            if (map == null) return;
            map.ToggleWeatherAlertVisibility();
        }

        public void ToggleWeatherRadarLayer()
        {
            if (map == null) return;
            map.ToggleWeatherRadarVisibility();
        }

        public void ToggleRoadSurfaceLayer()
        {
            if (map == null) return;
            map.ToggleRoadSurfaceVisibility();
        }

        public void Toggle3dBuildingLayer()
        {
            if (map == null) return;
            map.Toggle3dBuildingVisibility();
        }

        public void TogglePoiLayer()
        {
            if (map == null) return;
            map.TogglePoiVisibility();
        }

        public void ToggleTruckRestrictionsLayer()
        {
            if (map == null) return;
            map.ToggleTruckRestrictionsVisibility();
        }

        public void ToggleAddressLayer()
        {
            if (map == null) return;
            map.ToggleAddressVisibility();
        }

    }

}