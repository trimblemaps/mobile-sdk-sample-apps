
using System.Globalization;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;

namespace TrimbleMaps.Controls
{
    public static class ColorExtensions
    {
        public static string ToHex(this Color color)
        {
            int red = (int)(color.Red * 255);
            int green = (int)(color.Green * 255);
            int blue = (int)(color.Blue * 255);
            int alpha = (int)(color.Alpha * 255);
            return string.Format("#{3:X2}{0:X2}{1:X2}{2:X2}", red, green, blue, alpha);
        }

        public static string ToRGBAString(this Color color)
        {
            int red = (int)(color.Red * 255);
            int green = (int)(color.Green * 255);
            int blue = (int)(color.Blue * 255);
            return string.Format(
                "rgba({0}, {1}, {2}, {3})",
                red, green, blue, color.Alpha.ToString(CultureInfo.InvariantCulture));
        }
    }
}

