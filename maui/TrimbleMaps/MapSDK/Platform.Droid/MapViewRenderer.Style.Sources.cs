
using System.Threading.Tasks;
using Com.Trimblemaps.Geojson;
using GeoJSON.Net;
using TrimbleMaps.MapsSDK.Platform.Droid.Extensions;
using Newtonsoft.Json;
using NxSource = TrimbleMaps.MapsSDK.Sources.Source;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public partial class MapViewRenderer
    {
        public bool AddSource(params NxSource[] sources)
        {
            for (int i = 0; i < sources.Length; i++)
            { 
                if (string.IsNullOrWhiteSpace(sources[i].Id)) continue;

                mapStyle.AddSource(sources[i].ToSource(Context));
            }

            return true;
        }

        public bool UpdateSource(string sourceId, IGeoJSONObject geoJsonObject)
        {
            if (!(mapStyle.GetSource(sourceId) is Com.Trimblemaps.Mapsdk.Style.Sources.GeoJsonSource source)) return false;

            Task.Run(() =>
            {
                var json = JsonConvert.SerializeObject(geoJsonObject);
                switch (geoJsonObject)
                {
                    case GeoJSON.Net.Feature.Feature feature:
                        var geoJsonFeature = Feature.FromJson(json);
                        Device.InvokeOnMainThreadAsync(() =>
                        {
                            if (!(mapStyle.GetSource(sourceId) is Com.Trimblemaps.Mapsdk.Style.Sources.GeoJsonSource source)) return;
                            source.SetGeoJson(geoJsonFeature);
                        });
                        break;
                    case GeoJSON.Net.Feature.FeatureCollection feature:
                        var geoJsonFeatureCollection = FeatureCollection.FromJson(json);
                        Device.InvokeOnMainThreadAsync(() =>
                        {
                            if (!(mapStyle.GetSource(sourceId) is Com.Trimblemaps.Mapsdk.Style.Sources.GeoJsonSource source)) return;
                            source.SetGeoJson(geoJsonFeatureCollection);
                        });
                        break;
                    default:
                        var geometry = geoJsonObject.ToMapsSDK();
                        if (geometry == null)
                            return;
                        Device.InvokeOnMainThreadAsync(() =>
                        {
                            if (!(mapStyle.GetSource(sourceId) is Com.Trimblemaps.Mapsdk.Style.Sources.GeoJsonSource source)) return;
                            source.SetGeoJson(geometry);
                        });
                        break;
                }
            });

            return true;
        }

        public bool UpdateSource(string sourceId, ImageSource imageSource)
        {
            var source = mapStyle.GetSource(sourceId) as Com.Trimblemaps.Mapsdk.Style.Sources.ImageSource;

            if (source == null) return false;

            // TODO Cache image
            source.SetImage(imageSource.GetBitmap(Context));
            
            return true;
        }
        
        public void RemoveSource(params string[] sourceIds)
        {
            for (int i = 0; i < sourceIds.Length; i++)
            {
                if (string.IsNullOrWhiteSpace(sourceIds[i])) continue;

                map.Style.RemoveSource(sourceIds[i]);
            }
        }

    }
}