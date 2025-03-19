
using TrimbleMaps.MapsSDK;
using TrimbleMaps.MapsSDK.Annotations;
using System;
using System.Collections.Generic;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;

namespace TrimbleMaps.Controls.Forms
{
    public partial class MapView : View
    {
        public static BindableProperty ShowTrafficLayerProperty = BindableProperty.Create(
            nameof(ShowTrafficLayer),
            typeof(bool),
            typeof(MapView),
            default(bool),
            BindingMode.OneWay
        );
        public bool ShowTrafficLayer
        {
            get { return (bool)GetValue(ShowTrafficLayerProperty); }
            set { SetValue(ShowTrafficLayerProperty, value); }
        }

        public static BindableProperty ShowWeatherAlertLayerProperty = BindableProperty.Create(
            nameof(ShowWeatherAlertLayer),
            typeof(bool),
            typeof(MapView),
            default(bool),
            BindingMode.OneWay
        );
        public bool ShowWeatherAlertLayer
        {
            get { return (bool)GetValue(ShowWeatherAlertLayerProperty); }
            set { SetValue(ShowWeatherAlertLayerProperty, value); }
        }

        public static BindableProperty ShowWeatherRadarLayerProperty = BindableProperty.Create(
            nameof(ShowWeatherRadarLayer),
            typeof(bool),
            typeof(MapView),
            default(bool),
            BindingMode.OneWay
        );
        public bool ShowWeatherRadarLayer
        {
            get { return (bool)GetValue(ShowWeatherRadarLayerProperty); }
            set { SetValue(ShowWeatherRadarLayerProperty, value); }
        }

        public static BindableProperty ShowRoadSurfaceLayerProperty = BindableProperty.Create(
            nameof(ShowRoadSurfaceLayer),
            typeof(bool),
            typeof(MapView),
            default(bool),
            BindingMode.OneWay
        );
        public bool ShowRoadSurfaceLayer
        {
            get { return (bool)GetValue(ShowRoadSurfaceLayerProperty); }
            set { SetValue(ShowRoadSurfaceLayerProperty, value); }
        }

        public static BindableProperty Show3dBuildingLayerProperty = BindableProperty.Create(
            nameof(Show3dBuildingLayer),
            typeof(bool),
            typeof(MapView),
            default(bool),
            BindingMode.OneWay
        );
        public bool Show3dBuildingLayer
        {
            get { return (bool)GetValue(Show3dBuildingLayerProperty); }
            set { SetValue(Show3dBuildingLayerProperty, value); }
        }

        public static BindableProperty ShowPoiLayerProperty = BindableProperty.Create(
            nameof(ShowPoiLayer),
            typeof(bool),
            typeof(MapView),
            default(bool),
            BindingMode.OneWay
        );
        public bool ShowPoiLayer
        {
            get { return (bool)GetValue(ShowPoiLayerProperty); }
            set { SetValue(ShowPoiLayerProperty, value); }
        }

        public static BindableProperty ShowTruckRestrictionsLayerProperty = BindableProperty.Create(
            nameof(ShowTruckRestrictionsLayer),
            typeof(bool),
            typeof(MapView),
            default(bool),
            BindingMode.OneWay
        );
        public bool ShowTruckRestrictionsLayer
        {
            get { return (bool)GetValue(ShowTruckRestrictionsLayerProperty); }
            set { SetValue(ShowTruckRestrictionsLayerProperty, value); }
        }

        public static BindableProperty ShowAddressLayerProperty = BindableProperty.Create(
            nameof(ShowAddressLayer),
            typeof(bool),
            typeof(MapView),
            default(bool),
            BindingMode.OneWay
        );
        public bool ShowAddressLayer
        {
            get { return (bool)GetValue(ShowAddressLayerProperty); }
            set { SetValue(ShowAddressLayerProperty, value); }
        }
    }
}