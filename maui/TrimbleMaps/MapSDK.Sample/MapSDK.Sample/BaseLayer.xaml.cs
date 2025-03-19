using TrimbleMaps.Controls.Forms;

namespace TrimbleMaps.MapSDK.Sample
{
    public partial class BaseLayer : ContentPage
    {
        public BaseLayer()
        {
            InitializeComponent();
            Setup();
        }

        private void Setup()
        {
            Map.Center = new TrimbleMaps.MapsSDK.LatLng(40.7135, -74.0066);
            Map.ZoomLevel = 10;
            Map.MapStyle = MapStyle.MOBILE_DAY;
        }
    }
}
