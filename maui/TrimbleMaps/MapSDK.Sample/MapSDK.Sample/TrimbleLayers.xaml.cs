using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using TrimbleMaps.Controls.Forms;
using TrimbleMaps.MapsSDK;
namespace TrimbleMaps.MapSDK.Sample
{
    public partial class TrimbleLayers : ContentPage
    {
        public TrimbleLayers()
        {
            InitializeComponent();
            Setup();
        }

        private void Setup()
        {
            Map.Center = new TrimbleMaps.MapsSDK.LatLng(40.74304499593169, -73.98917577717128);
            Map.ZoomLevel = 4;
            Map.MapStyle = MapStyle.MOBILE_DAY;
        }

        private void OnClickChangeStyle(object sender, EventArgs e)
        {
            ResetMapLayer();

            if (sender is Button button && button.CommandParameter is string page)
            {
                switch (page)
                {
                    case "traffic":
                        Map.Functions.AnimateCamera(new CameraPosition(new TrimbleMaps.MapsSDK.LatLng(40.74304499593169, -73.98917577717128), 15, 0, 0), 100);
                        Map.Functions.ToggleRoadSurfaceLayer();
                        Map.Functions.ToggleTrafficLayer();
                        Map.ShowTrafficLayer = true;
                        Toast.Make("Traffic Layer is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "3d_buildings":
                        Map.Functions.AnimateCamera(new CameraPosition(new TrimbleMaps.MapsSDK.LatLng(40.74304499593169, -73.98917577717128), 15, 60, 0), 100);
                        Map.Functions.Toggle3dBuildingLayer();
                        Map.Show3dBuildingLayer = true;
                        Toast.Make("3D Building Layer is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "pois":
                        Map.Functions.AnimateCamera(new CameraPosition(new TrimbleMaps.MapsSDK.LatLng(40.372447878728025, -74.48960455530846), 16, 0, 0), 100);
                        Map.Functions.TogglePoiLayer();
                        Map.ShowPoiLayer = true;
                        Toast.Make("POI Layer is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "weather":
                        Map.Functions.AnimateCamera(new CameraPosition(new TrimbleMaps.MapsSDK.LatLng(40.372447878728025, -74.48960455530846), 4, 0, 0), 100);
                        Map.Functions.ToggleWeatherRadarLayer();
                        Map.ShowWeatherRadarLayer = true;
                        Toast.Make("Weather Radar Layer is enabled", ToastDuration.Short, 14).Show();
                        break;
                }
            }
        }

        private void ResetMapLayer()
        {

            Map.Functions.AnimateCamera(new CameraPosition(new TrimbleMaps.MapsSDK.LatLng(40.372447878728025, -74.48960455530846), 15, 0, 0), 100);
            if (Map.ShowTrafficLayer)
            {
                Map.Functions.ToggleTrafficLayer();
                Map.ShowTrafficLayer = false;
            }
            if (Map.Show3dBuildingLayer)
            {
                Map.Functions.Toggle3dBuildingLayer();
                Map.Show3dBuildingLayer = false;

            }
            if (Map.ShowPoiLayer)
            {
                Map.Functions.TogglePoiLayer();
                Map.ShowPoiLayer = false;
            }
            if (Map.ShowWeatherRadarLayer)
            {
                Map.Functions.ToggleWeatherRadarLayer();
                Map.ShowWeatherRadarLayer = false;
            }
        }
    }
}