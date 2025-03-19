using System;
using CoreGraphics;
using MapsSDK;
using TrimbleMaps.Controls.Forms;
using TrimbleMaps.Controls.MapsSDK.Platform.iOS;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.MapsSDK.Platform.iOS.Extensions
{
    public static class MapsSDKOptionsExtensions
    {
        public static MGLMapCamera ToNative(this CameraPosition cameraPosition, CGSize size)
        {
            var heading = cameraPosition.Bearing ?? 0;
            var centerCoordinate = cameraPosition.Target ?? LatLng.Zero;
            var pitch = (nfloat)(cameraPosition.Tilt ?? 0);
            var altitude = 0.0;

            // TODO iOS Convert Zoom to Altitude
            if (cameraPosition.Zoom.HasValue) {
                var result = MapsSDKIndependentFunction.MGLAltitudeForZoomLevel(
                    cameraPosition.Zoom.Value,
                    (nfloat)(cameraPosition.Tilt ?? 0),
                    cameraPosition.Target?.Lat ?? 0,
                    size);
                altitude = result;
            }

            var camera = MGLMapCamera.CameraLookingAtCenterCoordinateAndAltitude(
                centerCoordinate.ToCLCoordinate(),
                altitude,
                pitch,
                heading
                );

            return camera;
        }

        public static MGLMapCamera ToNative(this CameraBounds cameraBounds, MGLMapView map)
        {
            var camera = map.CameraThatFitsCoordinateBounds(
                cameraBounds.Bounds.ToNative(),
                cameraBounds.Padding.ToEdgeInsets()
                );

            var heading = cameraBounds.Bearing ?? camera.Heading;
            var pitch = (nfloat)(cameraBounds.Tilt ?? camera.Pitch);

            var result = MGLMapCamera.CameraLookingAtCenterCoordinateAndAltitude(
                camera.CenterCoordinate,
                camera.Altitude,
                pitch,
                heading
                );

            return result;
        }

        public static CGPoint ToPoint(this Thickness thickness)
        {
            // TODO iOS - Attribution/Compass margin only has x,y
            return new CGPoint(thickness.Left, thickness.Top);
        }

        public static MGLOrnamentPosition ToOrnamentPosition(this Gravity gravity)
        {
            switch (gravity) {
                case Gravity.Bottom | Gravity.Left:
                case Gravity.Bottom | Gravity.Start:
                    return MGLOrnamentPosition.BottomLeft;
                case Gravity.Bottom | Gravity.Right:
                case Gravity.Bottom | Gravity.End:
                    return MGLOrnamentPosition.BottomRight;
                case Gravity.Top | Gravity.Left:
                case Gravity.Top | Gravity.Start:
                    return MGLOrnamentPosition.TopLeft;
                case Gravity.Top | Gravity.Right:
                case Gravity.Top | Gravity.End:
                    return MGLOrnamentPosition.TopRight;
            }

            return default(MGLOrnamentPosition);
        }
    }
}