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
                }
            }
        }
    }
}
