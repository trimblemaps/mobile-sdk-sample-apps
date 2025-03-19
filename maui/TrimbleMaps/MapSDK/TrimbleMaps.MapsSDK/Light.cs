using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;

namespace TrimbleMaps.MapsSDK
{
    public class Light
    {
        public LightPosition? Position { get; set; }
        public TransitionOptions PositionTransition { get; set; }

        public Color? Color { get; set; }
        public TransitionOptions ColorTransition { get; set; }

        public string Anchor { get; set; }

        public float? Intensity { get; set; }
        public TransitionOptions IntensityTransition { get; set; }
    }

    public struct LightPosition
    {
        public LightPosition(float radial, float azimuthal, float polar)
        {
            Radial = radial;
            Azimuthal = azimuthal;
            Polar = polar;
        }

        public float Radial { get; set; }
        public float Azimuthal { get; set; }
        public float Polar { get; set; }
    }
}