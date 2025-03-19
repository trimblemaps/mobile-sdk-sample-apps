using System.Threading.Tasks;
using GeoJSON.Net;
using MapsSDK;
using TrimbleMaps.MapsSDK;
using TrimbleMaps.MapsSDK.Platform.iOS.Extensions;
using TrimbleMaps.MapsSDK.Sources;
using UIKit;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.iOS
{
    public partial class MapViewRenderer : IMapFunctions
    {
        public void AddStyleImage(IconImageSource iconImageSource)
        {
            if (iconImageSource.Source == null) return;
            
            var cachedImage = mapStyle.ImageForName(iconImageSource.Id);
            if (cachedImage != null) return;

            new System.Threading.Thread(new System.Threading.ThreadStart(() =>
            {
                var image = iconImageSource.Source.GetImage();

                if (image == null) return;

                Device.BeginInvokeOnMainThread(() => {
                    image = new UIImage(image.CGImage, UIScreen.MainScreen.Scale, image.Orientation);

                    if (iconImageSource.IsTemplate)
                        image = image.ImageWithRenderingMode(UIImageRenderingMode.AlwaysTemplate);

                    mapStyle.SetImage(image, iconImageSource.Id);
                });
            })).Start();
        }

        public bool AddSource(params Source[] sources)
        {
            for (int i = 0; i < sources.Length; i++)
            {
                if (string.IsNullOrWhiteSpace(sources[i].Id)) continue;

                var src = sources[i].ToSource();
                map.Style.AddSource(src);
            }

            return true;
        }

        public bool UpdateSource(string sourceId, IGeoJSONObject featureCollection)
        {
            if (!(mapStyle.SourceWithIdentifier(sourceId) is MGLShapeSource source)) return false;

            Task.Run(() =>
            {
                var shape = featureCollection.ToShape();
                Device.InvokeOnMainThreadAsync(() =>
                {
                    if (!(mapStyle.SourceWithIdentifier(sourceId) is MGLShapeSource source)) return;
                    source.Shape = shape;
                });
            });

            return true;
        }

        public bool UpdateSource(string sourceId, ImageSource imageSource)
        {
            var source = mapStyle.SourceWithIdentifier(sourceId) as MGLImageSource;

            if (source == null) return false;

            source.Image = imageSource.GetImage();
            
            return true;
        }

        public void RemoveSource(params string[] sourceIds)
        {
            for (int i = 0; i < sourceIds.Length; i++)
            {
                if (string.IsNullOrWhiteSpace(sourceIds[i])) continue;

                var source = map.Style.SourceWithIdentifier(sourceIds[i]) as MGLSource;

                if (source == null) continue;

                map.Style.RemoveSource(source);
            }
        }
    }
}
