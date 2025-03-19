using Microsoft.Maui.Graphics;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;

namespace TrimbleMaps.MapsSDK.Layers
{
    public class BackgroundLayer : StyleLayer
    {
        public Color BackgroundColor { get; set; } = Colors.White;

        public BackgroundLayer(string id, string sourceId) : base(id, sourceId)
        {
        }
    }
}
