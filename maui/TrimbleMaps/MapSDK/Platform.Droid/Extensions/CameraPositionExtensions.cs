﻿using Microsoft.Maui.ApplicationModel;
namespace TrimbleMaps.MapsSDK.Platform.Droid.Extensions
{
    using NxCameraPosition = CameraPosition;
    using Com.Trimblemaps.Mapsdk.Camera;
    using TrimbleMaps.Controls.MapsSDK.Platform.Droid;

    public static class CameraPositionExtensions
    {
        public static CameraPosition ToNative(this NxCameraPosition cameraPosition)
        {
            var builder = new CameraPosition.Builder();

            if (cameraPosition.Bearing.HasValue)
            {
                builder.Bearing(cameraPosition.Bearing.Value);
            }

            if (cameraPosition.Target.HasValue)
            {
                builder.Target(cameraPosition.Target.Value.ToLatLng());
            }

            if (cameraPosition.Tilt.HasValue)
            {
                builder.Tilt(cameraPosition.Tilt.Value);
            }

            if (cameraPosition.Zoom.HasValue)
            {
                builder.Zoom(cameraPosition.Zoom.Value);
            }

            return builder.Build();
        }
    }
}

