using Microsoft.Maui.Graphics;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.MapsSDK.Platform.Droid.Extensions
{
    public static class AndroidGraphicsExtensions
    {
        public static RectF ToRectF(this PointF point, float radius)
        {
            return new RectF(
                point.X - radius,
                point.Y - radius,
                point.X+radius,
                point.Y+radius
            );
        }

        public static RectF ToRectF(this PointF tl, PointF br)
        {
            return new RectF(
                tl.X,
                tl.Y,
                br.X,
                br.Y
            );
        }

        public static PointF ToPointF(this Point point)
        {
            return new PointF(
                (float)point.X,
                (float)point.Y
            );
        }

        public static RectF ToRectF(this Microsoft.Maui.Graphics.Rect rectangle)
        {
            return new RectF(
                (float)rectangle.Left,
                (float)rectangle.Top,
                (float)rectangle.Right,
                (float)rectangle.Bottom
            );
        }
    }
}
