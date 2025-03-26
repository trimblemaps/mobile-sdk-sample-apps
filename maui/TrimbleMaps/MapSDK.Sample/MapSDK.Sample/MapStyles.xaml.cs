using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using TrimbleMaps.Controls.Forms;

namespace TrimbleMaps.MapSDK.Sample
{
    public partial class MapStyles : ContentPage
    {
        public MapStyles()
        {
            InitializeComponent();
            Setup();
        }

        private void Setup()
        {
            Map.Center = new TrimbleMaps.MapsSDK.LatLng(40.7584766, -73.9840227);
            Map.ZoomLevel = 13;
            Map.MapStyle = MapStyle.MOBILE_DAY;
        }

        private void OnClickChangeStyle(object sender, EventArgs e)
        {
            if (sender is Button button && button.CommandParameter is string page)
            {
                switch (page)
                {
                    case "MOBILE_DAY":
                        Map.MapStyle = MapStyle.MOBILE_DAY;
                        Toast.Make("MOBILE_DAY is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "MOBILE_NIGHT":
                        Map.MapStyle = MapStyle.MOBILE_NIGHT;
                        Toast.Make("MOBILE_NIGHT is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "MOBILE_SATELLITE":
                        Map.MapStyle = MapStyle.MOBILE_SATELLITE;
                        Toast.Make("MOBILE_SATELLITE is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "TERRAIN":
                        Map.MapStyle = MapStyle.TERRAIN;
                        Toast.Make("TERRAIN is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "TRANSPORTANTION":
                        Map.MapStyle = MapStyle.TRANSPORTATION;
                        Toast.Make("TRANSPORTATION is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "BASIC":
                        Map.MapStyle = MapStyle.BASIC;
                        Toast.Make("BASIC is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "DATADARK":
                        Map.MapStyle = MapStyle.DATADARK;
                        Toast.Make("DATADARK is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "DATALIGHT":
                        Map.MapStyle = MapStyle.DATALIGHT;
                        Toast.Make("DATALIGHT is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "SATELLITE":
                        Map.MapStyle = MapStyle.SATELLITE;
                        Toast.Make("SATELLITE is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "DEFAULT":
                        Map.MapStyle = MapStyle.DEFAULT;
                        Toast.Make("DEFAULT is enabled", ToastDuration.Short, 14).Show();
                        break;
                    case "MOBILE_DEFAULT":
                        Map.MapStyle = MapStyle.MOBILE_DEFAULT;
                        Toast.Make("MOBILE_DEFAULT is enabled", ToastDuration.Short, 14).Show();
                        break;
                }
            }
        }
    }
}
