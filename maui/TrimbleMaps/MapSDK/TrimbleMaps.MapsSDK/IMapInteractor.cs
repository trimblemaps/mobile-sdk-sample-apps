using System.Threading.Tasks;
using GeoJSON.Net;
using TrimbleMaps.MapsSDK.Annotations;
using TrimbleMaps.MapsSDK.Expressions;
using TrimbleMaps.MapsSDK.Layers;
using NFeature = GeoJSON.Net.Feature.Feature;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.Graphics;

namespace TrimbleMaps.MapsSDK
{
    public partial interface IMapFunctions
    {
        /**
         *  TrimbleMapsSDK does not have a seperate plugin for Buildings or Traffic, they are already built into the Maps
         */

        void ToggleTrafficLayer();

        void ToggleWeatherAlertLayer();

        void ToggleWeatherRadarLayer();

        void ToggleRoadSurfaceLayer();

        void Toggle3dBuildingLayer();

        void TogglePoiLayer();

        void ToggleTruckRestrictionsLayer();

        void ToggleAddressLayer();
    }

    public partial interface IMapFunctions
    {
        void AddStyleImage(IconImageSource source);
        void AnimateCamera(ICameraUpdate cameraPosition, int durationInMillisecond);
    }

    public partial interface IMapFunctions
    {
        bool AddSource(params Sources.Source[] sources);
        bool UpdateSource(string sourceId, IGeoJSONObject featureCollection);
        bool UpdateSource(string sourceId, ImageSource featureCollection);
        void RemoveSource(params string[] sourceIds);

        bool AddLayer(params Layers.Layer[] layers);
        bool AddLayerBelow(Layers.Layer layer, string layerId);
        bool AddLayerAbove(Layers.Layer layer, string layerId);
        bool AddLayerAt(Layers.Layer layer, int index);
        bool UpdateLayer(Layers.Layer layer);
        void RemoveLayer(params string[] layerIds);

        StyleLayer[] GetLayers();
        void SetLayerVisibility(string[] layerIds, bool isVisible);
        void SetLayerFilter(string[] layerIds, Expression filter);
    }

    public partial interface IMapFunctions
    {
        LatLngBounds GetVisibleBounds();
    }

    public partial interface IMapFunctions
    {
        Task<byte[]> TakeSnapshotAsync(LatLngBounds bounds = default);

        NFeature[] QueryFeatures(LatLng latLng, params string[] layers);
        NFeature[] QueryFeatures(LatLng latLng, float radius, params string[] layers);
        NFeature[] QueryFeatures(LatLngBounds bounds, params string[] layers);

        NFeature[] QueryFeatures(Point position, params string[] layers);
        NFeature[] QueryFeatures(Point position, float radius, params string[] layers);
        NFeature[] QueryFeatures(Rect rectangle, params string[] layers);
        void UpdateLight(Light light);
        void UpdateAnnotation(Annotation annotation);
    }
}
