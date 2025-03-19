using Com.Trimblemaps.Mapsdk.Location.Modes;
using TrimbleMaps.Controls.Forms;
using Microsoft.Maui.ApplicationModel;
using Microsoft.Maui.Devices.Sensors;

namespace TrimbleMaps.MapsSDK.Platform.Droid.Extensions
{
    public static class UserTrackingExtensions
    {

        public static int ToCameraMode(this UserTracking tracking)
        {
            return tracking switch
            {
                UserTracking.None => CameraMode.None,
                UserTracking.Tracking => CameraMode.Tracking,
                UserTracking.TrackingWithCompass => CameraMode.TrackingGps,
                UserTracking.TrackingWithCourse => CameraMode.TrackingGpsNorth,
            };

        }

        public static int ToRenderMode(this UserTracking tracking)
        {
            return tracking switch
            {
                UserTracking.None => RenderMode.Normal,
                UserTracking.Tracking => RenderMode.Normal,
                UserTracking.TrackingWithCompass => RenderMode.Compass,
                UserTracking.TrackingWithCourse => RenderMode.Gps,
            };
        }
    }
}
