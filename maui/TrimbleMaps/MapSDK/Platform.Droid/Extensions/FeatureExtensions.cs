using Com.Trimblemaps.Geojson;

using NFeature = GeoJSON.Net.Feature.Feature;
using Newtonsoft.Json;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public static class FeatureExtensions
    {
        public static NFeature ToFeature(this Feature feature, bool shouldDispose = false)
        {
            if (feature == null)
            {
                return null;
            }

            if (feature.Properties() == null || feature.Properties().Size() == 0)
            {
                feature.AddBooleanProperty("___TrimbleMaps_temporary_fix___", new Java.Lang.Boolean(false));
            }

            var json = feature.ToJson();

            if (shouldDispose) feature.Dispose();

            return JsonConvert.DeserializeObject<NFeature>(json);
        }
    }
}
