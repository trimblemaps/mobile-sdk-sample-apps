using MapsSDK;
using TrimbleMaps.Controls.Forms;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.MapsSDK.Platform.iOS.Extensions
{
    public static class UserTrackingExtensions
    {

        public static MGLUserTrackingMode ToNative(this UserTracking tracking)
        {
            return tracking switch
            {
                UserTracking.None => MGLUserTrackingMode.None,
                UserTracking.Tracking => MGLUserTrackingMode.Follow,
                UserTracking.TrackingWithCompass => MGLUserTrackingMode.FollowWithHeading,
                UserTracking.TrackingWithCourse => MGLUserTrackingMode.FollowWithCourse,
            };
        }
    }
}
