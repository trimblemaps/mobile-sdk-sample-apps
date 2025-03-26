using TrimbleMaps.Controls.Forms;
using TrimbleMaps.MapsSDK;
using TrimbleMaps.MapsSDK.Annotations;

namespace TrimbleMaps.MapSDK.Sample
{

    public partial class HazardIcon : ContentPage
    {
        const string HAZARD_ICON = "usps_hazard";

        public HazardIcon()
        {
            InitializeComponent();
            Setup();
        }

        private void Setup()
        {
            Map.Center = new TrimbleMaps.MapsSDK.LatLng(40.7135, -74.0066);
            Map.ZoomLevel = 10;
            Map.MapStyle = MapStyle.MOBILE_DAY;
            Map.Show3dBuildingLayer = true;

            Map.DidFinishLoadingStyleCommand = new Command<MapStyle>(DidFinishLoadingStyle);
            Map.DidTapOnMarkerCommand = new Command<string>(DidTapOnMarker);
        }

        public void DidFinishLoadingStyle(MapStyle style)
        {
            Map.Functions.AddStyleImage(new IconImageSource()
            {
                Id = HAZARD_ICON,
                Source = ImageSource.FromResource("MapSDK.Sample.Resources.Images.hazard.png")
            });

            var symbol = GetSymbol(new TrimbleMaps.MapsSDK.LatLng(40.7135, -74.0066));

            Map.Annotations = new[] { symbol };
        }

        private void DidTapOnMarker(string id)
        {
            var symbol = Map.Annotations.FirstOrDefault(x => x.Id == id) as SymbolAnnotation;

            if (symbol == null) return;

            var coords = symbol.Coordinates;

            var position = new CameraPosition
            {
                Target = symbol.Coordinates,
                Zoom = 19.0
            };

            Map.Functions.AnimateCamera(position, 300);
        }

        private SymbolAnnotation GetSymbol(TrimbleMaps.MapsSDK.LatLng point)
        {

            return new SymbolAnnotation
            {
                Coordinates = point,
                IconImage = HAZARD_ICON,
                IconSize = 0.6f,
                TextField = "Hazard",
                TextOffset = new[] { 0f, -1.6f },
                TextColor = Color.FromRgb(255, 0, 0),
                TextAnchor = "Bottom",
                TextSize = 16f,
                Id = Guid.NewGuid().ToString()
            };
        }
    }
}
