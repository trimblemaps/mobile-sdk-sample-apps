using System;
using Android.Content;
using Com.Trimblemaps.Mapsdk;
using Com.Trimblemaps.Mapsdk.Camera;
using Com.Trimblemaps.Mapsdk.Geometry;
using Com.Trimblemaps.Mapsdk.Maps;
using TrimbleMaps.Controls.Forms;
using MapView = TrimbleMaps.Controls.Forms.MapView;
using View = Android.Views.View;
using NxLatLng = TrimbleMaps.MapsSDK.LatLng;
using TrimbleMaps.MapsSDK.Platform.Droid.Extensions;
using AndroidX.AppCompat.App;
using Java.Util;
using Microsoft.Maui.Controls.Handlers.Compatibility;
using Microsoft.Maui.Controls.Platform;
using Microsoft.Maui.ApplicationModel;
using Microsoft.Maui.Platform;
using Style = Com.Trimblemaps.Mapsdk.Maps.Style;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public partial class MapViewRenderer : ViewRenderer<MapView, View>, IOnMapReadyCallback
    {
        protected TrimbleMapsMap map;
        protected MapViewFragment fragment;
        NxLatLng currentCamera;
        bool mapReady;

        public MapViewRenderer(Context context) : base(context)
        {
        }

        protected override void OnElementChanged(ElementChangedEventArgs<MapView> e)
        {
            base.OnElementChanged(e);
            if (e.OldElement != null)
            {
                e.OldElement.DidFinishLoadingStyleCommand?.Execute(null);
                e.OldElement.AnnotationsChanged -= Element_AnnotationsChanged;
                e.OldElement.Functions = null;

                if (map != null)
                {
                    RemoveMapEvents();
                }
            }

            if (e.NewElement == null)
                return;

            if (Control == null)
            {
                var activity = (AppCompatActivity) Context;
                var view = new Android.Widget.FrameLayout(activity)
                {
                    Id = GenerateViewId()
                };

                SetNativeControl(view);

                fragment = MapViewFragment.Create(Element, Context);

                activity.GetFragmentManager()
                    .BeginTransaction()
                    .Replace(view.Id, fragment)
                    .CommitAllowingStateLoss();

                fragment.GetMapAsync(this);
                currentCamera = new NxLatLng();
            }
        }

        protected override void Dispose(bool disposing)
        {
            Element.DidFinishLoadingStyleCommand?.Execute(null);
            RemoveMapEvents();
            Element.Functions = null;

            if (fragment != null)
            {
                if (fragment.StateSaved)
                {
                    var activity = (AppCompatActivity) Context;
                    var fm = activity.GetFragmentManager();

                    fm.BeginTransaction()
                        .Remove(fragment)
                        .CommitAllowingStateLoss();
                }

                fragment.Dispose();
                fragment = null;
            }

            base.Dispose(disposing);
        }

        private void FocustoLocation(LatLng latLng, bool bAnimate = true)
        {
            if (map == null || mapReady == false)
            {
                return;
            }

            if (currentCamera.Lat == latLng.Latitude && currentCamera.Long == latLng.Longitude)
                return;

            var builder = new CameraPosition.Builder()
                .Target(latLng);

            if (Element.ZoomLevel.HasValue &&
                Math.Abs(Element.ZoomLevel.Value - map.CameraPosition.Zoom) > double.Epsilon)
            {
                builder.Zoom(Element.ZoomLevel.Value);
            }

            builder.Padding(Element.ContentInset.Left,
                Element.ContentInset.Top,
                Element.ContentInset.Right,
                Element.ContentInset.Bottom);

            if(bAnimate)
            {
                map.AnimateCamera(CameraUpdateFactory.NewCameraPosition(builder.Build()), 1000);
            }
            else
            {
                map.AnimateCamera(CameraUpdateFactory.NewCameraPosition(builder.Build()));
            }
        }

        protected override void OnElementPropertyChanged(object sender,
            System.ComponentModel.PropertyChangedEventArgs e)
        {
            base.OnElementPropertyChanged(sender, e);

            if (e.PropertyName == MapView.VisibleBoundsProperty.PropertyName)
            {
                OnMapRegionChanged();
            }
            else if (e.PropertyName == MapView.CenterProperty.PropertyName)
            {
                FocustoLocation(Element.Center.ToLatLng());
            }
            else if (e.PropertyName == MapView.ContentInsetProperty.PropertyName)
            {
                UpdateContentInset();
            }
            else if (e.PropertyName == MapView.MapStyleProperty.PropertyName && map != null)
            {
                UpdateMapStyle();
            }
            else if (e.PropertyName == MapView.PitchEnabledProperty.PropertyName)
            {
                if (map != null)
                {
                    map.UiSettings.TiltGesturesEnabled = Element.PitchEnabled;
                }
            }
            else if (e.PropertyName == MapView.PitchProperty.PropertyName)
            {
                map?.AnimateCamera(CameraUpdateFactory.TiltTo(Element.Pitch));
            }
            else if (e.PropertyName == MapView.RotateEnabledProperty.PropertyName)
            {
                if (map != null)
                {
                    map.UiSettings.RotateGesturesEnabled = Element.RotateEnabled;
                }
            }
            else if (e.PropertyName == MapView.RotatedDegreeProperty.PropertyName)
            {
                map?.AnimateCamera(CameraUpdateFactory.BearingTo(Element.RotatedDegree));
            }
            else if (e.PropertyName == MapView.ZoomLevelProperty.PropertyName && map != null)
            {
                if (Element.ZoomLevel.HasValue == false)
                {
                    return;
                }

                var dif = Math.Abs(map.CameraPosition.Zoom - Element.ZoomLevel.Value);
                if (dif >= double.Epsilon && cameraBusy == false)
                {
                    map.AnimateCamera(CameraUpdateFactory.ZoomTo(Element.ZoomLevel.Value));
                }
            }
            else if (e.PropertyName == MapView.AnnotationsProperty.PropertyName)
            {
            }
            else if (e.PropertyName == MapView.RenderTextureModeProperty.PropertyName)
            {
                // TODO Set RenderTextureModeProperty
            }
            else if (e.PropertyName == MapView.RenderTextureTranslucentSurfaceProperty.PropertyName)
            {
                // TODO Set RenderTextureTranslucentSurfaceProperty
            }
            else if (e.PropertyName == MapView.ShowUserLocationProperty.PropertyName)
            {
                var locationComponent = map.LocationComponent;
                locationComponent.LocationComponentEnabled = Element.ShowUserLocation;
            }
            else if (e.PropertyName == MapView.UserLocationTrackingProperty.PropertyName)
            {
                UpdateUserLocation();
            }
            else if (e.PropertyName == MapView.ShowTrafficLayerProperty.PropertyName)
            {
                map?.SetTrafficVisibility(Element.ShowTrafficLayer);
            }
            else if (e.PropertyName == MapView.ShowWeatherAlertLayerProperty.PropertyName)
            {
                map?.SetWeatherAlertVisibility(Element.ShowWeatherAlertLayer);
            }
            else if (e.PropertyName == MapView.ShowWeatherRadarLayerProperty.PropertyName)
            {
                map?.SetWeatherRadarVisibility(Element.ShowWeatherRadarLayer);
            }
            else if (e.PropertyName == MapView.ShowRoadSurfaceLayerProperty.PropertyName)
            {
                map?.SetRoadSurfaceVisibility(Element.ShowRoadSurfaceLayer);
            }
            else if (e.PropertyName == MapView.Show3dBuildingLayerProperty.PropertyName)
            {
                map?.Set3dBuildingVisibility(Element.Show3dBuildingLayer);
            }
            else if (e.PropertyName == MapView.ShowPoiLayerProperty.PropertyName)
            {
                map?.SetPoiVisibility(Element.ShowPoiLayer);
            }
            else if (e.PropertyName == MapView.ShowTruckRestrictionsLayerProperty.PropertyName)
            {
                map?.SetTruckRestrictionsVisibility(Element.ShowTruckRestrictionsLayer);
            }
            else if (e.PropertyName == MapView.ShowAddressLayerProperty.PropertyName)
            {
                map?.SetAddressVisibility(Element.ShowAddressLayer);
            }
        }

        private void UpdateUserLocation()
        {
            var locationComponent = map.LocationComponent;
            locationComponent.RenderMode = Element.UserLocationTracking.ToRenderMode();

            if (Element.UserLocationTracking != UserTracking.None)
                locationComponent.SetCameraMode(Element.UserLocationTracking.ToCameraMode(), 400, new Java.Lang.Double(16.0), new Java.Lang.Double(0.0), null, null);
            else
                locationComponent.CameraMode = Element.UserLocationTracking.ToCameraMode();
        }

        protected virtual void UpdateContentInset(bool animated = true)
        {
            if (map == null || Element == null || mapReady == false) return;

            var builder = new CameraPosition.Builder()
                .Padding(Element.ContentInset.Left,
                    Element.ContentInset.Top,
                    Element.ContentInset.Right,
                    Element.ContentInset.Bottom);

            map.AnimateCamera(CameraUpdateFactory.NewCameraPosition(builder.Build()), animated ? 300 : 0);
        }

        void OnMapRegionChanged()
        {
            //if (false == Element.VisibleBounds.IsEmpty())
            //{
            //    map?.AnimateCamera(CameraUpdateFactory.NewLatLngBounds(
            //        LatLngBounds.From(
            //            Element.VisibleBounds.NorthEast.Lat,
            //            Element.VisibleBounds.NorthEast.Long,
            //            Element.VisibleBounds.SouthWest.Lat,
            //            Element.VisibleBounds.SouthWest.Long
            //        ), 0));
            //}
        }

        public void OnMapReady(TrimbleMapsMap MapsSDK)
        {
            map = MapsSDK;
            mapReady = true;

            AddMapEvents();

            if (Element.MapStyle == null)
            {
                Element.MapStyle = new MapStyle(Style.Default);
            }
            else
            {
                UpdateMapStyle();
            }

            FocustoLocation(Element.Center.ToLatLng(), false);

            map?.SetTrafficVisibility(Element.ShowTrafficLayer);
            map?.SetWeatherAlertVisibility(Element.ShowWeatherAlertLayer);
            map?.SetWeatherRadarVisibility(Element.ShowWeatherRadarLayer);
            map?.SetRoadSurfaceVisibility(Element.ShowRoadSurfaceLayer);
            map?.Set3dBuildingVisibility(Element.Show3dBuildingLayer);
            map?.SetPoiVisibility(Element.ShowPoiLayer);
            map?.SetTruckRestrictionsVisibility(Element.ShowTruckRestrictionsLayer);
            map?.SetAddressVisibility(Element.ShowAddressLayer);
        }

        // Implement property mapping methods here
        private static void MapUserLocation(MapViewRenderer handler, MapView mapView)
        {
            // Implement mapping logic
        }

        private static void MapShowUserLocation(MapViewRenderer handler, MapView mapView)
        {
            // Implement mapping logic
        }

        private static void MapUserLocationTracking(MapViewRenderer handler, MapView mapView)
        {
            // Implement mapping logic
        }

        private static void MapRotatedDegree(MapViewRenderer handler, MapView mapView)
        {
            // Implement mapping logic
        }

        private static void MapMapStyle(MapViewRenderer handler, MapView mapView)
        {
            // Implement mapping logic
        }

        private static void MapVisibleBounds(MapViewRenderer handler, MapView mapView)
        {
            // Implement mapping logic
        }

        private static void MapInfoWindowTemplate(MapViewRenderer handler, MapView mapView)
        {
            // Implement mapping logic
        }

        private static void MapFunctions(MapViewRenderer handler, MapView mapView)
        {
            // Implement mapping logic
        }
    }
}