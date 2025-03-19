using UIKit;
using Microsoft.Maui.Controls.Handlers.Compatibility;
using Microsoft.Maui.Controls.Platform;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.MapsSDK.Platform.iOS.Extensions
{
    public static class ImageSourceExtensions
    {
        public static UIImage GetImage(this ImageSource source)
        {
            var handler =  Xamarin.Forms.Internals.Registrar.Registered
                .GetHandlerForObject<IImageSourceHandler>(source);

            return handler?
                .LoadImageAsync(source).Result;
        }
    }
}