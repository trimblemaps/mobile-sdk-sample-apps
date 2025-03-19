using System;
using Foundation;
using MapsSDK;
using TrimbleMaps.Controls.Forms;
using TrimbleMaps.Controls.MapsSDK.Platform.iOS;
using UIKit;
using Microsoft.Maui.Controls.Handlers.Compatibility;
using Microsoft.Maui.Controls.Platform;
using Microsoft.Maui.ApplicationModel;

// TODO Xamarin.Forms.ExportRendererAttribute is not longer supported. For more details see https://github.com/dotnet/maui/wiki/Using-Custom-Renderers-in-.NET-MAUI
[assembly: Xamarin.Forms.ExportRenderer(typeof(MapView), typeof(MapViewRenderer))]

namespace TrimbleMaps.Controls.MapsSDK.Platform.iOS
{
    public partial class MapViewRenderer : ViewRenderer<MapView, MGLMapView>, IMGLMapViewDelegate,
        IUIGestureRecognizerDelegate
    {
        protected virtual void UpdateMapStyle()
        {
            if (Element.MapStyle == null)
            {
                Element.MapStyle = new MapStyle(MGLStyle.StreetsStyleURL.AbsoluteString);
                return;
            }

            if (!string.IsNullOrEmpty(Element.MapStyle.UrlString)
                && !string.Equals(
                    Element.MapStyle.UrlString,
                    map.StyleURL.AbsoluteString, StringComparison.OrdinalIgnoreCase))
            {
                NSUrl url;

                if (Element.MapStyle.UrlString.StartsWith("asset://"))
                {
                    var resourceName = Element.MapStyle.UrlString.Replace("asset://", string.Empty);
                    url = NSUrl.FromFilename(resourceName);
                }
                else
                {
                    url = NSUrl.FromFilename(Element.MapStyle.UrlString);
                }

                map.StyleURL = url;
            }
            else if (!string.IsNullOrWhiteSpace(Element.MapStyle.Json))
            {
                // TODO iOS - Not support loading from JSON
            }
        }

        MGLStyle mapStyle;

        [Export("mapView:didFinishLoadingStyle:"),]
        public void DidFinishLoadingStyle(MGLMapView mapView, MGLStyle style)
        {
            mapView.AttributionButton.Hidden = !Element.AttributionEnabled;
            mapView.LogoView.Hidden = !Element.LogoEnabled;

            var emapStyle = Element.MapStyle ?? new MapStyle();
            emapStyle.UrlString = mapView.StyleURL.AbsoluteString;
            emapStyle.Name = style.Name;
            Element.MapStyle = emapStyle;

            mapStyle = style;
            Element.Functions = this;

            Element.DidFinishLoadingStyleCommand?.Execute(emapStyle);
        }
    }
}