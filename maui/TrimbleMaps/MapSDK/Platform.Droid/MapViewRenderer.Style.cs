﻿using System;
using System.Collections.Specialized;
using System.Linq;
using Com.Trimblemaps.Account;
using Com.Trimblemaps.Mapsdk.Location;
using TrimbleMaps.Controls.Forms;
using TrimbleMaps.MapsSDK.Platform.Droid.Extensions;
using Sdk = Com.Trimblemaps.Mapsdk;
using Microsoft.Maui.ApplicationModel;
using Microsoft.Maui.Devices.Sensors;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public partial class MapViewRenderer
    {
        Sdk.Maps.Style mapStyle;

        protected virtual void UpdateMapStyle()
        {
            if (Element.MapStyle == null) return;

            if (false == string.IsNullOrEmpty(Element.MapStyle.UrlString)
                && (map.Style == null || false == string.Equals(Element.MapStyle.UrlString, map.Style.Uri,
                    StringComparison.OrdinalIgnoreCase)))
            {
                map.SetStyle(
                    Element.MapStyle.UrlString,
                    new StyleLoadedCallback(new WeakReference<MapViewRenderer>(this)));
            }
            else if (false == string.IsNullOrWhiteSpace(Element.MapStyle.Json))
            {
                var styleBuilder = new Sdk.Maps.Style.Builder().FromJson(Element.MapStyle.Json);
                map.SetStyle(
                    styleBuilder,
                    new StyleLoadedCallback(new WeakReference<MapViewRenderer>(this)));
            }
        }

        class StyleLoadedCallback : Java.Lang.Object, Sdk.Maps.Style.IOnStyleLoaded
        {
            readonly WeakReference<MapViewRenderer> _rendererReference;

            public StyleLoadedCallback(WeakReference<MapViewRenderer> rendererReference)
            {
                _rendererReference = rendererReference;
            }

            public void OnStyleLoaded(Sdk.Maps.Style p0)
            {
                if (_rendererReference.TryGetTarget(out var renderer))
                {
                    renderer.mapStyle = p0;

                    var mapStyle = renderer.Element.MapStyle ?? new MapStyle();
                    mapStyle.UrlString = p0.Uri;

                    renderer.Element.MapStyle = mapStyle;
                    renderer.Element.Functions = renderer;

                    var locationComponent = renderer.map.LocationComponent;
                    var options = new LocationComponentActivationOptions.Builder(renderer.Context, renderer.map.Style);
                    locationComponent.ActivateLocationComponent(options.Build());
                    locationComponent.LocationComponentEnabled = renderer.Element.ShowUserLocation;
                    renderer.UpdateUserLocation();


                    renderer.Element.DidFinishLoadingStyleCommand?.Execute(renderer.Element.MapStyle);

                    renderer.AddAnnotations(renderer.Element.Annotations?.ToArray());
                    if (renderer.Element.Annotations is INotifyCollectionChanged notifyCollection)
                    {
                        notifyCollection.CollectionChanged -= renderer.OnAnnotationsCollectionChanged;
                        notifyCollection.CollectionChanged += renderer.OnAnnotationsCollectionChanged;
                    }

                    renderer.Element.AnnotationsChanged -= renderer.Element_AnnotationsChanged;
                    renderer.Element.AnnotationsChanged += renderer.Element_AnnotationsChanged;
                }
            }
        }
    }
}