using System.Collections.Generic;
using Android.Views;
using AViews = Android.Views;
using APlatform = Microsoft.Maui.Controls.Compatibility.Platform.Android.Platform;
using Application = Android.App.Application;
using Microsoft.Maui.Controls.Compatibility.Platform.Android;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.Graphics;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.MapsSDK.Platform.Droid.Extensions
{
    public static class ViewExtensions
    {
        public static AViews.ViewGroup ToAndroid(this Microsoft.Maui.Controls.View view)
        {
            if (APlatform.GetRenderer(view) == null)
                APlatform.SetRenderer(view, APlatform.CreateRendererWithContext(view, Application.Context));
            var vRenderer = APlatform.GetRenderer(view);
            var androidView = vRenderer.View;
            var viewGroup = vRenderer;
            var size = view.Measure(double.PositiveInfinity, double.PositiveInfinity);
            view.Layout(new Rect(0, 0, size.Request.Width, size.Request.Height));
            vRenderer.Tracker.UpdateLayout();
            var layoutParams = new ViewGroup.LayoutParams((int)size.Request.Width, (int)size.Request.Height);
            androidView.LayoutParameters = layoutParams;
            androidView.Layout(0, 0, (int)size.Request.Width, (int)size.Request.Height);
            return (AViews.ViewGroup)androidView;
        }

        public static List<Android.Views.View> GetAllChildView(this ViewGroup v)
        {
            List<Android.Views.View> result = new List<Android.Views.View>();
            ViewGroup viewGroup = (ViewGroup)v;
            for (int i = 0; i < viewGroup.ChildCount; i++)
            {
                Android.Views.View child = viewGroup.GetChildAt(i);
                List<Android.Views.View> viewArrayList = new List<Android.Views.View>();
                viewArrayList.Add(v);
                viewArrayList.AddRange(GetAllChildView((ViewGroup) child));
                result.AddRange(viewArrayList);
            }
            return result;
        }
    }
}