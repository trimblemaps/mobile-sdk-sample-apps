using System;
using UIKit;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.MapsSDK.Platform.iOS.Extensions
{
    public static class ThicknessExtensions
    {
        public static UIEdgeInsets ToEdgeInsets(this Thickness thickness)
        {
            return new UIEdgeInsets(
                (nfloat)thickness.Top,
                (nfloat)thickness.Left,
                (nfloat)thickness.Bottom,
                (nfloat)thickness.Right);
        }

        public static Thickness ToEdgeInsets(this UIEdgeInsets insets)
        {
            return new Thickness(
                insets.Top,
                insets.Left,
                insets.Bottom,
                insets.Right);
        }
    }
}
