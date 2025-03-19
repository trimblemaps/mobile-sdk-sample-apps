using Com.Trimblemaps.Mapsdk.Style.Expressions;
using Newtonsoft.Json;
using NxExpressions = TrimbleMaps.MapsSDK.Expressions;
using Microsoft.Maui.ApplicationModel;
namespace TrimbleMaps.MapsSDK.Platform.Droid.Extensions
{
    public static class ExpressionExtensions
    {
        public static Expression ToNative(this NxExpressions.Expression expression)
        {
            var json = JsonConvert.SerializeObject(expression.ToArray());
            return Expression.Raw(json);
        }
    }
}
