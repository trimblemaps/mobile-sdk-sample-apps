using TrimbleMaps.Controls.Forms;
using TrimbleMaps.MapsSDK.Layers;
using TrimbleMaps.MapsSDK.Sources;

namespace TrimbleMaps.MapSDK.Sample
{
    public partial class DotsOnMapLayer : ContentPage
    {
        const string SOURCE_ID = "tristatepoints";
        const string LAYER_ID = "tristatepoints";

        public TrimbleMaps.MapsSDK.Sources.Source source { get; private set; }

        public DotsOnMapLayer()
        {
            InitializeComponent();
            Setup();
        }

        private void Setup()
        {
            Map.Center = new TrimbleMaps.MapsSDK.LatLng(41.36290180612575, -74.6946761628674);
            Map.ZoomLevel = 13;
            Map.MapStyle = MapStyle.MOBILE_NIGHT;

            Map.DidFinishLoadingStyleCommand = new Command<MapStyle>(DidFinishLoadingStyleAsync);
        }

        private async void DidFinishLoadingStyleAsync(MapStyle style)
        {
            try
            {
                source = new GeoJsonSource(SOURCE_ID, "dots.json") { IsLocal = true };
                Map.Functions.AddSource(source);
                CircleLayer circleLayer = new CircleLayer(SOURCE_ID, LAYER_ID);
                circleLayer.CircleRadius = 4;
                circleLayer.CircleStrokeColor = Color.FromRgb(255, 0, 0);
                circleLayer.CircleStrokeWidth = 5;
                circleLayer.CircleColor = Color.FromRgb(255, 255, 255);
                // Add the CircleLayer to the map
                Map.Functions.AddLayer(circleLayer);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error loading GeoJSON: {e.Message}");
            }
        }
    }
}
