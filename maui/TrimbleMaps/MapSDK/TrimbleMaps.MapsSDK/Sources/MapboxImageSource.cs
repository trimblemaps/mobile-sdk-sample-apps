namespace TrimbleMaps.MapsSDK.Sources
{
    public class MapsSDKImageSource : Source
    {
        public Microsoft.Maui.Controls.ImageSource Source { get; private set; }

        public LatLngQuad Coordinates { get;  private set; }

        public MapsSDKImageSource(string id, LatLngQuad coordinates, Microsoft.Maui.Controls.ImageSource source)
        {
            Id = id;
            Coordinates = coordinates;
            Source = source;
        }
    }
}