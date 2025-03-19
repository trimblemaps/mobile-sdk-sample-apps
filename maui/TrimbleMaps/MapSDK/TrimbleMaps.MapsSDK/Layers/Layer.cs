namespace TrimbleMaps.MapsSDK.Layers
{
    public class Layer
    {
        public string Id { get; set; }

        public float MinZoom { get; set; } = float.NegativeInfinity;

        public float MaxZoom { get; set; } = float.PositiveInfinity;

        public Expressions.Expression Filter { get; set; }

        public Expressions.Expression Visibility { get; set; }

        public Layer(string id)
        {
            Id = id;
        }
    }

    public class StyleLayer : Layer
    {
        public string SourceId
        {
            get;
            private set;
        }

        public string SourceLayer { get; set; }

        public StyleLayer(string id, string sourceId) : base(id)
        {
            SourceId = sourceId;
        }
    }
}