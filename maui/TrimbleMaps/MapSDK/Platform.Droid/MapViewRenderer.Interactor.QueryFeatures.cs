using System.IO;
using System.Linq;
using TrimbleMaps.MapsSDK;

using NFeature = GeoJSON.Net.Feature.Feature;
using TrimbleMaps.MapsSDK.Platform.Droid.Extensions;
using Microsoft.Maui.Controls.Handlers.Compatibility;
using Microsoft.Maui.Controls.Platform;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.Graphics;
using Microsoft.Maui.ApplicationModel;
using Microsoft.Maui.Platform;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public partial class MapViewRenderer : IMapFunctions
    {
        public NFeature[] QueryFeatures(LatLng latLng, params string[] layers)
        {
            var point = map.Projection.ToScreenLocation(latLng.ToLatLng());
            var features = map.QueryRenderedFeatures(point, layers);

            return features.Select(f => f.ToFeature(true)).ToArray();
        }

        public RectF ConvertPointFToRectF(PointF point, float width, float height)
        {
            return new RectF(point.X, point.Y, width, height);
        }

        public NFeature[] QueryFeatures(LatLng latLng, float radius, params string[] layers)
        {
            var point = map.Projection.ToScreenLocation(latLng.ToLatLng());
            var region = new RectF(point.X - radius, point.Y - radius, radius * 2, radius * 2);
            var features = map.QueryRenderedFeatures(region, layers);

            point.Dispose();

            return features.Select(f => f.ToFeature(true)).ToArray();
        }

        public NFeature[] QueryFeatures(LatLngBounds bounds, params string[] layers)
        {
            var mpbounds = bounds.ToLatLngBounds();
            var tl = map.Projection.ToScreenLocation(mpbounds.NorthEast);
            var br = map.Projection.ToScreenLocation(mpbounds.NorthEast);
            var region = new RectF(tl.X, tl.Y, br.X - tl.X, br.Y - tl.Y);
            var features = map.QueryRenderedFeatures(region, layers);

            tl.Dispose();
            br.Dispose();

            return features.Select(f => f.ToFeature(true)).ToArray();
        }

        public NFeature[] QueryFeatures(Point point, params string[] layers)
        {
            var xpoint = point.ToPointF();
            var features = map.QueryRenderedFeatures(xpoint, layers);
            
            return features.Select(f => f.ToFeature(true)).ToArray();
        }

        public NFeature[] QueryFeatures(Point point, float radius, params string[] layers)
        {
            var xpoint = point.ToPointF();
            var region = xpoint.ToRectF(radius);
            var features = map.QueryRenderedFeatures(region, layers);

            return features.Select(f => f.ToFeature(true)).ToArray();
        }

        public NFeature[] QueryFeatures(Rect rectangle, params string[] layers)
        {
            var region = rectangle.ToRectF();
            var features = map.QueryRenderedFeatures(region, layers);

            return features.Select(f => f.ToFeature(true)).ToArray();
        }
    }
}