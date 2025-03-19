using System;
using System.Linq;
using Com.Trimblemaps.Mapsdk.Style.Light;
using Com.Trimblemaps.Mapsdk.Utils;
using TrimbleMaps.MapsSDK.Expressions;
using TrimbleMaps.MapsSDK.Layers;
using TrimbleMaps.MapsSDK.Platform.Droid.Extensions;
using Light = TrimbleMaps.MapsSDK.Light;
using Microsoft.Maui.Controls.Handlers.Compatibility;
using Microsoft.Maui.Controls.Platform;
using Microsoft.Maui.Devices.Sensors;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public partial class MapViewRenderer
    {
        public void RemoveLayer(params string[] layerIds)
        {
            for (int i = 0; i < layerIds.Length; i++)
            {
                var native = map.Style.GetLayer(layerIds[i]);

                if (native == null) continue;

                map.Style.RemoveLayer(native);
            }
        }

        public bool AddLayer(params Layer[] layers)
        {
            for (int i = 0; i < layers.Length; i++)
            {
                if (string.IsNullOrWhiteSpace(layers[i].Id)) continue;

                var styleLayer = layers[i] as StyleLayer;

                if (styleLayer == null) continue;

                var source = mapStyle.GetSource(styleLayer.SourceId);

                if (source == null) continue;

                var layer = layers[i].ToNative();

                mapStyle.AddLayer(layer);
            }

            return true;
        }

        public bool AddLayerBelow(Layer layer, string layerId)
        {
            map.Style.AddLayerBelow(layer.ToNative(), layerId);

            return true;
        }

        public bool AddLayerAbove(Layer layer, string layerId)
        {
            map.Style.AddLayerAbove(layer.ToNative(), layerId);

            return true;
        }

        public bool UpdateLayer(Layer layer)
        {
            var nativeLayer = map.Style.GetLayer(layer.Id);

            if (nativeLayer == null) return false;

            layer.UpdateLayer(nativeLayer);

            return true;
        }

        public bool AddLayerAt(Layer layer, int index)
        {
            map.Style.AddLayerAt(layer.ToNative(), index);

            return true;
        }

        public StyleLayer[] GetLayers()
        {
            return map.Style.Layers.Select(x => x.ToForms()).Where(x => x != null).ToArray();
        }

        public void SetLayerVisibility(string[] layerIds, bool isVisible)
        {
            foreach (string layerId in layerIds)
            {
                try
                {
                    Com.Trimblemaps.Mapsdk.Style.Layers.Layer layer = mapStyle.Layers.First(x => x.Id == layerId);
                    if (layer == null)
                        return;

                    var visibility = isVisible ? ExpressionVisibility.VISIBLE : ExpressionVisibility.NONE;
                    layer.SetProperties(
                        Com.Trimblemaps.Mapsdk.Style.Layers.PropertyFactory.Visibility((string)visibility.GetValue())
                    );
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Layer ({layerId}) not found in style.");
                }
            }
        }

        public void SetLayerFilter(string[] layerIds, Expression filter)
        {
            foreach (string layerId in layerIds)
            {
                try
                {
                    Com.Trimblemaps.Mapsdk.Style.Layers.Layer layer = mapStyle.Layers.First(x => x.Id == layerId);
                    if (layer == null)
                        return;
                    switch (layer)
                    {
                        case Com.Trimblemaps.Mapsdk.Style.Layers.CircleLayer c:
                            c.Filter = filter.ToNative();
                            break;
                        case Com.Trimblemaps.Mapsdk.Style.Layers.LineLayer c:
                            c.Filter = filter.ToNative();
                            break;
                        case Com.Trimblemaps.Mapsdk.Style.Layers.SymbolLayer c:
                            c.Filter = filter.ToNative();
                            break;
                        case Com.Trimblemaps.Mapsdk.Style.Layers.FillLayer c:
                            c.Filter = filter.ToNative();
                            break;
                        case Com.Trimblemaps.Mapsdk.Style.Layers.FillExtrusionLayer c:
                            c.Filter = filter.ToNative();
                            break;
                        case Com.Trimblemaps.Mapsdk.Style.Layers.HeatmapLayer c:
                            c.Filter = filter.ToNative();
                            break;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Layer ({layerId}) not found in style.");
                }
            }
        }

        public void UpdateLight(Light light)
        {
            var native = mapStyle.Light;
            if (!string.IsNullOrWhiteSpace(light.Anchor))
            {
                native.Anchor = light.Anchor;
            }

            if (light.Color != null)
            {
                native.Color = ColorUtils.ColorToRgbaString(light.Color.ToInt());
            }

            if (light.ColorTransition != null)
            {
                native.ColorTransition = light.ColorTransition.ToNative();
            }

            if (light.Intensity.HasValue)
            {
                native.Intensity = light.Intensity.Value;
            }

            if (light.IntensityTransition != null)
            {
                native.IntensityTransition = light.IntensityTransition.ToNative();
            }

            if (light.Position.HasValue)
            {
                native.Position = new Com.Trimblemaps.Mapsdk.Style.Light.Position(
                    light.Position.Value.Radial, 
                    light.Position.Value.Azimuthal, 
                    light.Position.Value.Polar);
            }

            if (light.PositionTransition != null)
            {
                native.PositionTransition = light.PositionTransition.ToNative();
            }
        }
    }
}