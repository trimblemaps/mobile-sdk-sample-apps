using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;

namespace TrimbleMaps.MapsSDK
{
    public class IconImageSource
    {
        public string Id { set; get; }

        public ImageSource Source { get; set; }

        /// <summary>
        /// The flag indicating image is an SDF or template image
        /// </summary>
        public bool IsTemplate { get; set; }

        public static implicit operator IconImageSource(string id)
        {
            return new IconImageSource
            {
                Id = id,
            };
        }

        public static implicit operator IconImageSource(ImageSource source)
        {
            return new IconImageSource
            {
                Source = source,
                Id = (source as FileImageSource)?.File ?? source.Id.ToString()
            };
        }
    }
}

namespace TrimbleMaps.MapsSDK.Annotations
{
    public class SymbolAnnotation : Annotation
    {
        public LatLng Coordinates { get; set; }

        public float? IconOpacity { get; set; }

        public float? IconSize { get; set; }

        public float? IconHaloBlur { get; set; }

        public float? IconHaloWidth { get; set; }

        public IconImageSource IconImage { get; set; }

        public float? IconRotate { get; set; }

        public float[] IconOffset { get; set; }

        public string IconAnchor { get; set; }

        public string TextField { get; set; }

        public string[] TextFont { get; set; }

        public string TextJustify { get; set; }

        public string TextAnchor { get; set; }

        public string TextTransform { get; set; }

        public Color? TextColor { get; set; }

        public Color? TextHaloColor { get; set; }

        public Color? IconColor { get; set; }

        public Color? IconHaloColor { get; set; }

        public float? TextSize { get; set; }

        public float? TextMaxWidth { get; set; }

        public float? TextLetterSpacing { get; set; }

        public float? TextRadialOffset { get; set; }

        public float? TextRotate { get; set; }

        public float[] TextOffset { get; set; }

        public float? TextOpacity { get; set; }

        public float? TextHaloBlur { get; set; }

        public float? TextHaloWidth { get; set; }

        public float? SymbolSortKey { get; set; }

        public bool? IsDraggable { get; set; }
    }
}
