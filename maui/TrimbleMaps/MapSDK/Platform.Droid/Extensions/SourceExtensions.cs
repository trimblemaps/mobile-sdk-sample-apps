using Android.Content;
using NxSource = TrimbleMaps.MapsSDK.Sources.Source;
using NxRasterSource = TrimbleMaps.MapsSDK.Sources.RasterSource;
using NxRasterDemSource = TrimbleMaps.MapsSDK.Sources.RasterDemSource;
using NxGeojsonSource = TrimbleMaps.MapsSDK.Sources.GeoJsonSource;
using NxVectorSource = TrimbleMaps.MapsSDK.Sources.VectorSource;
using NxImageSource = TrimbleMaps.MapsSDK.Sources.MapsSDKImageSource;
using NxGeoJsonOptions = TrimbleMaps.MapsSDK.Sources.GeoJsonOptions;
using NxTileSet = TrimbleMaps.MapsSDK.Sources.TileSet;
using Com.Trimblemaps.Mapsdk.Style.Sources;
using Newtonsoft.Json;
using Com.Trimblemaps.Geojson;
using ImageSource = Com.Trimblemaps.Mapsdk.Style.Sources.ImageSource;
using GeoJSON.Net;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.MapsSDK.Platform.Droid.Extensions
{
    public static class SourceExtensions
    {
        public static Source ToSource(this NxSource source, Context context)
        {
            switch (source)
            {
                case NxGeojsonSource geojsonSource:
                    var options = geojsonSource.Options.ToOptions();
                    if (geojsonSource.Data != null)
                    {
                        var json = JsonConvert.SerializeObject(geojsonSource.Data);
                        switch (geojsonSource.Data)
                        {
                            case GeoJSON.Net.Feature.FeatureCollection featureCollection:
                                {
                                    var MapsSDKFeatureCollection = FeatureCollection.FromJson(json);
                                    return new GeoJsonSource(geojsonSource.Id, MapsSDKFeatureCollection, options);
                                }
                            case GeoJSON.Net.Feature.Feature feature:
                                {
                                    var MapsSDKFeature = Feature.FromJson(json);
                                    return new GeoJsonSource(geojsonSource.Id, MapsSDKFeature, geojsonSource.Options.ToOptions());
                                }
                            default:
                                var geometry = geojsonSource.Data.ToMapsSDK();
                                if (geometry == null)
                                    return null;
                                var mbsource = new GeoJsonSource(geojsonSource.Id, geometry, options);
                                return mbsource;
                        }
                    }

                    if (string.IsNullOrWhiteSpace(geojsonSource.Url))
                    {
                        return new GeoJsonSource(geojsonSource.Id);
                    }

                    if (false == geojsonSource.IsLocal)
                    {
                        return new GeoJsonSource(geojsonSource.Id, new Java.Net.URL(geojsonSource.Url), geojsonSource.Options.ToOptions());
                    }

                    var localUrl = geojsonSource.Url.StartsWith("asset://", System.StringComparison.OrdinalIgnoreCase)
                        ? new Java.Net.URI(geojsonSource.Url)
                        : new Java.Net.URI("asset://" + geojsonSource.Url);

                    return new GeoJsonSource(geojsonSource.Id, localUrl, geojsonSource.Options.ToOptions());

                case NxRasterSource rasterSource:
                    if (rasterSource.TileSet != null)
                    {
                        var tileSet = rasterSource.TileSet.ToNative();

                        return rasterSource.TileSize.HasValue
                            ? new RasterSource(rasterSource.Id, tileSet, rasterSource.TileSize.Value)
                            : new RasterSource(rasterSource.Id, tileSet);
                    }

                    return rasterSource.TileSize.HasValue
                            ? new RasterSource(rasterSource.Id, rasterSource.ConfigurationURL, rasterSource.TileSize.Value)
                            : new RasterSource(rasterSource.Id, rasterSource.ConfigurationURL);
                case NxRasterDemSource rasterDemSource:
                    if (rasterDemSource.TileSet != null)
                    {
                        var tileSet = rasterDemSource.TileSet.ToNative();

                        return rasterDemSource.TileSize.HasValue
                            ? new RasterDemSource(rasterDemSource.Id, tileSet, rasterDemSource.TileSize.Value)
                            : new RasterDemSource(rasterDemSource.Id, tileSet);
                    }

                    return rasterDemSource.TileSize.HasValue
                        ? new RasterDemSource(rasterDemSource.Id, rasterDemSource.Url, rasterDemSource.TileSize.Value)
                        : new RasterDemSource(rasterDemSource.Id, rasterDemSource.Url);
                case NxVectorSource vectorSource:
                    //TODO VectorSource Add other options
                    return new VectorSource(vectorSource.Id, vectorSource.Url);
                case NxImageSource imageSource:
                    return new ImageSource(imageSource.Id, imageSource.Coordinates.ToNative(), imageSource.Source.GetBitmap(context));
            }

            return null;
        }

        public static TileSet ToNative(this NxTileSet tileSet)
        {
            return new TileSet(tileSet.TileJson, tileSet.Tiles);
        }
    }

    public static class GeoJsonOptionsExtensions
    {
        public static GeoJsonOptions ToOptions(this NxGeoJsonOptions nxoptions)
        {
            var options = new GeoJsonOptions();
            if (nxoptions == null) return options;

            //var options = new GeoJsonOptions();
            if (nxoptions.Buffer.HasValue)
            {
                options.WithBuffer(nxoptions.Buffer.Value);
            }
            if (nxoptions.Cluster.HasValue)
            {
                options.WithCluster(nxoptions.Cluster.Value);
            }
            if (nxoptions.ClusterMaxZoom.HasValue)
            {
                options.WithClusterMaxZoom(nxoptions.ClusterMaxZoom.Value);
            }
            if (nxoptions.ClusterRadius.HasValue)
            {
                options.WithClusterRadius(nxoptions.ClusterRadius.Value);
            }
            if (nxoptions.LineMetrics.HasValue)
            {
                options.WithLineMetrics(nxoptions.LineMetrics.Value);
            }
            if (nxoptions.MaxZoom.HasValue)
            {
                options.WithMaxZoom(nxoptions.MaxZoom.Value);
            }
            if (nxoptions.MinZoom.HasValue)
            {
                options.WithMinZoom(nxoptions.MinZoom.Value);
            }
            if (nxoptions.Tolerance.HasValue)
            {
                options.WithTolerance(nxoptions.Tolerance.Value);
            }
            return options;
        }
    }


    public static class GeometryExtensions
    {
        public static IGeometry ToMapsSDK(this IGeoJSONObject geometry)
        {
            var json = JsonConvert.SerializeObject(geometry);
            switch (geometry)
            {
                case GeoJSON.Net.Geometry.LineString l:
                    return LineString.FromJson(json);
                case GeoJSON.Net.Geometry.MultiLineString ml:
                    return MultiLineString.FromJson(json);
                case GeoJSON.Net.Geometry.Point p:
                    return Com.Trimblemaps.Geojson.Point.FromJson(json);
                case GeoJSON.Net.Geometry.MultiPoint mp:
                    return MultiPoint.FromJson(json);
                case GeoJSON.Net.Geometry.Polygon poly:
                    return Polygon.FromJson(json);
                case GeoJSON.Net.Geometry.MultiPolygon mPoly:
                    return MultiPolygon.FromJson(json);
            }
            return null;
        }
    }
}
