using TrimbleMaps.MapsSDK;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;

namespace TrimbleMaps.Controls.Forms
{
    partial class MapView
    {
        public static readonly BindableProperty CenterProperty = BindableProperty.Create(
            nameof(Center),
            typeof(LatLng),
            typeof(MapView),
            default(LatLng),
            BindingMode.TwoWay);
        public LatLng Center
        {
            get => (LatLng)GetValue(CenterProperty);
            set => SetValue(CenterProperty, value);
        }

        public static readonly BindableProperty ZoomLevelProperty = BindableProperty.Create(
            nameof(ZoomLevel),
            typeof(double?),
            typeof(MapView),
            null,
            BindingMode.TwoWay);
        public double? ZoomLevel
        {
            get => (double?)GetValue(ZoomLevelProperty);
            set => SetValue(ZoomLevelProperty, value);
        }

        public static readonly BindableProperty PitchProperty = BindableProperty.Create(
            nameof(Pitch),
            typeof(double),
            typeof(MapView),
            0.0,
            BindingMode.TwoWay);
        public double Pitch
        {
            get => (double)GetValue(PitchProperty);
            set => SetValue(PitchProperty, value);
        }

        public static readonly BindableProperty HeadingProperty = BindableProperty.Create(
            nameof(Heading),
            typeof(double),
            typeof(MapView),
            default(double),
            BindingMode.OneWay
        );

        public double Heading
        {
            get => (double) GetValue(HeadingProperty);
            set => SetValue(HeadingProperty, value);
        }

        public static readonly BindableProperty ContentInsetProperty = BindableProperty.Create(
            nameof(ContentInset),
            typeof(Thickness),
            typeof(MapView),
            default(Thickness),
            BindingMode.TwoWay);
        public Thickness ContentInset
        {
            get => (Thickness)GetValue(ContentInsetProperty);
            set => SetValue(ContentInsetProperty, value);
        }
    }
}