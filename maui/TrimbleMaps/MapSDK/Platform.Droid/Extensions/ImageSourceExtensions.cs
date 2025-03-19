using Android.Content;
using Android.Graphics;
using Microsoft.Maui.Controls.Handlers.Compatibility;
using Microsoft.Maui.Controls.Platform;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.ApplicationModel;
using Microsoft.Maui.Controls.Compatibility.Platform.Android;

namespace TrimbleMaps.MapsSDK.Platform.Droid.Extensions
{
    public static class ImageSourceExtensions
    {
        public static Bitmap GetBitmap(this ImageSource source, Context context)
        {
            if (source == null)
                throw new ArgumentNullException(nameof(source));

            if (context == null)
                throw new ArgumentNullException(nameof(context));

            IImageSourceHandler handler = source switch
            {
                StreamImageSource => new StreamImagesourceHandler(),
                _ => throw new InvalidOperationException($"No handler found for {source.GetType()}")
            };

            try
            {
                return Task.Run(() => handler.LoadImageAsync(source, context)).Result;
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                throw new InvalidOperationException("Failed to load image", ex);
            }
        }
    }
}