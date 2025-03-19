using System;
using System.Linq;
using Com.Trimblemaps.Android.Gestures;
using Com.Trimblemaps.Mapsdk.Maps;
using TrimbleMaps.Controls.Forms;
using TrimbleMaps.MapsSDK;
using MapView = Com.Trimblemaps.Mapsdk.Maps.MapView;
using NxLatLng = TrimbleMaps.MapsSDK.LatLng;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public partial class MapViewRenderer : TrimbleMapsMap.IOnMapClickListener, TrimbleMapsMap.IOnMoveListener
    {
        bool cameraBusy;

        protected virtual void AddMapEvents()
        {
            //map.MarkerClick += MarkerClicked;
            //map.InfoWindowClick += InfoWindowClick;
            //map.MapClick += MapClicked;
            map.AddOnMapClickListener(this);
            map.CameraIdle += OnCameraIdle;
            map.CameraMoveStarted += Map_CameraMoveStarted;
            map.CameraMoveCancel += Map_CameraMoveCancel;
            map.CameraMove += Map_CameraMove;
            map.AddOnMoveListener(this);
            fragment.MapView.StyleImageMissing += MapViewOnStyleImageMissing;
        }

        void MapViewOnStyleImageMissing(object sender, MapView.StyleImageMissingEventArgs e)
        {
            if (Element?.StyleImageMissingCommand?.CanExecute(e.P0) == true) {
                Element.StyleImageMissingCommand.Execute(e.P0);
            }
        }

        protected virtual void RemoveMapEvents()
        {
            if (map != null) {
                map.MarkerClick -= MarkerClicked;
                map.InfoWindowClick -= InfoWindowClick;
                map.RemoveOnMapClickListener(this);
                map.CameraIdle -= OnCameraIdle;
                map.CameraMoveStarted -= Map_CameraMoveStarted;
                map.CameraMoveCancel -= Map_CameraMoveCancel;
                map.CameraMove -= Map_CameraMove;
            }

            if (fragment?.MapView != null) {
                fragment.MapView.StyleImageMissing -= MapViewOnStyleImageMissing;
            }
        }

        private void Map_CameraMove(object sender, EventArgs e)
        {
            cameraBusy = true;

            var cameraMovedCommand = Element?.CameraMovedCommand;

            if (cameraMovedCommand?.CanExecute(null) == true) {
                var native = map.CameraPosition;
                var camera = new CameraPosition(
                    native.Target.ToLatLng(),
                    native.Zoom,
                    native.Tilt,
                    native.Bearing);
                cameraMovedCommand.Execute(camera);
            }
        }

        private void Map_CameraMoveCancel(object sender, EventArgs e)
        {
            cameraBusy = false;
        }

        private void Map_CameraMoveStarted(object sender, TrimbleMapsMap.CameraMoveStartedEventArgs e)
        {
            cameraBusy = true;
        }

        private void CameraChange()
        {
            if (map?.SelectedMarkers.Count > 0)
                map.DeselectMarkers();
        }

        private void OnCameraIdle(object sender, EventArgs e)
        {
            cameraBusy = false;
            currentCamera = new NxLatLng(map.CameraPosition.Target.Latitude, map.CameraPosition.Target.Longitude);
            Element.ZoomLevel = map.CameraPosition.Zoom;

            if (!Element.Center.Equals(currentCamera))
            {
                Element.Center = currentCamera;
                var region = map.Projection.GetVisibleRegion(true);
                double northEastLat = region.LatLngBounds.NorthEast.Latitude;
                double northEastLng = region.LatLngBounds.NorthEast.Longitude;
                double southWestLat = region.LatLngBounds.SouthWest.Latitude;
                double southWestLng = region.LatLngBounds.SouthWest.Longitude;
                var bounds = new TrimbleMaps.MapsSDK.LatLngBounds()
                {
                    NorthEast = new NxLatLng(northEastLat, northEastLng),
                    SouthWest = new NxLatLng(southWestLat, southWestLng)
                };
                Element.DidBoundariesChangedCommand?.Execute(bounds);
            }
        }

        void MarkerClicked(object o, TrimbleMapsMap.MarkerClickEventArgs args)
        {
            fragment?.ToggleInfoWindow(map, args.P0);

            if (Element?.Annotations?.Count() > 0) {
                var fm = Element.Annotations.FirstOrDefault(d => d.Id == args.P0.Id.ToString());
                if (fm == null)
                    return;
                Element.DidTapOnMarkerCommand?.Execute(fm);
            }
        }

        void InfoWindowClick(object s, TrimbleMapsMap.InfoWindowClickEventArgs e)
        {
            if (e.P0 != null) {
                Element.DidTapOnCalloutViewCommand?.Execute(e.P0.Id.ToString());
            }
        }

        public bool OnMapClick(Com.Trimblemaps.Mapsdk.Geometry.LatLng p0)
        {
            var point = map.Projection.ToScreenLocation(p0);
            var xfPoint = new Point(point.X, point.Y);
            var xfPosition = new NxLatLng(p0.Latitude, p0.Longitude);
            (NxLatLng, Point) commandParamters = (xfPosition, xfPoint);

            if (Element.DidTapOnMapCommand?.CanExecute(commandParamters) == true) {
                Element.DidTapOnMapCommand.Execute(commandParamters);
            }

            // TODO should return true
            return false;
        }

        void TrimbleMapsMap.IOnMoveListener.OnMove(MoveGestureDetector p0)
        {
        }

        void TrimbleMapsMap.IOnMoveListener.OnMoveBegin(MoveGestureDetector p0)
        {
            Element.UserLocationTracking = UserTracking.None;
            Element.UserMovedRegionCommand?.Execute(null);
        }

        void TrimbleMapsMap.IOnMoveListener.OnMoveEnd(MoveGestureDetector p0)
        {
        }

        //public virtual void OnMapChanged(int p0)
        //{
        //    switch (p0)
        //    {
        //        case MapView.DidFinishLoadingStyle:
        //            var mapStyle = Element.MapStyle;
        //            if (mapStyle == null
        //                || (!string.IsNullOrEmpty(map.StyleUrl) && mapStyle.UrlString != map.StyleUrl))
        //            {
        //                mapStyle = new MapStyle(map.StyleUrl);

        //            }
        //            if (mapStyle.CustomSources != null)
        //            {
        //                var notifiyCollection = Element.MapStyle.CustomSources as INotifyCollectionChanged;
        //                if (notifiyCollection != null)
        //                {
        //                    notifiyCollection.CollectionChanged += OnShapeSourcesCollectionChanged;
        //                }

        //                AddSources(Element.MapStyle.CustomSources.ToList());
        //            }
        //            if (mapStyle.CustomLayers != null)
        //            {
        //                if (Element.MapStyle.CustomLayers is INotifyCollectionChanged notifiyCollection)
        //                {
        //                    notifiyCollection.CollectionChanged += OnLayersCollectionChanged;
        //                }

        //                AddLayers(Element.MapStyle.CustomLayers.ToList());
        //            }
        //            mapStyle.OriginalLayers = map.Layers.Select((arg) =>
        //                                                                new Layer(arg.Id)
        //                                                               ).ToArray();
        //            Element.MapStyle = mapStyle;
        //            Element.DidFinishLoadingStyleCommand?.Execute(mapStyle);
        //            break;
        //        case MapView.DidFinishRenderingMap:
        //            Element.Center = new Position(map.CameraPosition.Target.Latitude, map.CameraPosition.Target.Longitude);
        //            Element.DidFinishRenderingCommand?.Execute(false);
        //            break;
        //        case MapView.DidFinishRenderingMapFullyRendered:
        //            Element.DidFinishRenderingCommand?.Execute(true);
        //            break;
        //        case MapView.RegionDidChange:
        //            Element.RegionDidChangeCommand?.Execute(false);
        //            break;
        //        case MapView.RegionDidChangeAnimated:
        //            Element.RegionDidChangeCommand?.Execute(true);
        //            break;
        //        default:
        //            break;
        //    }
        //}
    }
}