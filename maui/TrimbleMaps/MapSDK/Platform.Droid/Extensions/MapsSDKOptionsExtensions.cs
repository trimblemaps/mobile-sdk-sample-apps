using Android.Content;
using Com.Trimblemaps.Mapsdk.Constants;
using Com.Trimblemaps.Mapsdk.Maps;
using Microsoft.Maui.Controls.Handlers.Compatibility;
using Microsoft.Maui.Controls.Platform;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.ApplicationModel;
using Microsoft.Maui.Platform;
using Microsoft.Maui.Controls.Compatibility.Platform.Android;

namespace TrimbleMaps.MapsSDK.Platform.Droid.Extensions
{
    public static class MapsSDKOptionsExtensions
    {
        public static int[] ToArray(this Thickness thickness, Context context)
        {
            return new int[]
            {
                (int) context.ToPixels(thickness.Left),
                (int) context.ToPixels(thickness.Top),
                (int) context.ToPixels(thickness.Right),
                (int) context.ToPixels(thickness.Bottom),
            };
        }

        public static TrimbleMapsMapOptions CreateOptions(
            this TrimbleMaps.Controls.Forms.MapView element,
            Context context)
        {
            var MapsSDKMapOptions = new TrimbleMapsMapOptions();
            
            if (string.IsNullOrWhiteSpace(element.ApiBaseUri))
            {
                MapsSDKMapOptions.InvokeApiBaseUri(element.ApiBaseUri);
            }

            MapsSDKMapOptions.InvokeCamera(element.Camera.ToNative())
                .InvokeZoomGesturesEnabled(element.ZoomEnabled) //, true));
                .InvokeScrollGesturesEnabled(element.ScrollEnabled) //, true));
                .InvokeRotateGesturesEnabled(element.RotateEnabled) //, true));
                .InvokeTiltGesturesEnabled(element.PitchEnabled) //, true));
                .InvokeDoubleTapGesturesEnabled(element.DoubleTapEnabled) // , true));
                .InvokeQuickZoomGesturesEnabled(element.QuickZoomEnabled) //, true));
                .InvokeMaxZoomPreference(element.ZoomMaxLevel ?? TrimbleMapsConstants.MaximumZoom)
                .InvokeMinZoomPreference(element.ZoomMinLevel ?? TrimbleMapsConstants.MinimumZoom)
                .InvokeCompassEnabled(element.CompassEnabled) //, true));
                .InvokeCompassGravity((int)element.CompassGravity) // Gravity.TOP | Gravity.END));
                .CompassMargins(element.CompassMargin.ToArray(context)) //FOUR_DP
                .CompassFadesWhenFacingNorth(element.CompassFadeFacingNorth); //, true));

            var compassDrawableName = (element.CompassDrawable as FileImageSource)?.File.Split('.')[0]
                                      ?? "trimblemaps_compass_icon";
            var compassDrawableId =
                context.Resources.GetIdentifier(compassDrawableName, "drawable", context.PackageName);
            if (compassDrawableId > 0)
            {
                var compassDrawable = context.Resources.GetDrawable(compassDrawableId, context.Theme);
                MapsSDKMapOptions.InvokeCompassImage(compassDrawable);
            }

            MapsSDKMapOptions.InvokeLogoEnabled(element.LogoEnabled) //, true));
                .InvokeLogoGravity((int)element.LogoGravity) //, Gravity.BOTTOM | Gravity.START));
                .LogoMargins(element.LogoMargin.ToArray(context)); //FOUR_DP

            MapsSDKMapOptions.LocalIdeographFontFamilyEnabled(element.LocalIdeographFontFamilyEnabled)
                .InvokeLocalIdeographFontFamily(element.LocalIdeographFontFamilies ??
                                                new[] { TrimbleMapsConstants.DefaultFont}) //, true);
                .InvokePixelRatio(element.PixelRatio) //, 0);
                .InvokeForegroundLoadColor(111111) //, LIGHT_GRAY)
                .InvokeCrossSourceCollisions(element.CrossSourceCollisions); //, true)
            return MapsSDKMapOptions;
        }
    }
}