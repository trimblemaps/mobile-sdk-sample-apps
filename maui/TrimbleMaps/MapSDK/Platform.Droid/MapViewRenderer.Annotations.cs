using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using Android.Views;
using Android.Graphics;
using Com.Trimblemaps.Mapsdk.Plugins.Annotation;
using Java.Lang;
using TrimbleMaps.Controls.Forms;
using TrimbleMaps.MapsSDK;
using TrimbleMaps.MapsSDK.Annotations;
using TrimbleMaps.MapsSDK.Platform.Droid.Extensions;
using NxAnnotation = TrimbleMaps.MapsSDK.Annotations.Annotation;
using Microsoft.Maui.Controls.Handlers.Compatibility;
using Microsoft.Maui.Controls.Platform;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.ApplicationModel;
using Object = Java.Lang.Object;
using Boolean = Java.Lang.Boolean;

namespace TrimbleMaps.Controls.MapsSDK.Platform.Droid
{
    public partial class MapViewRenderer : IOnAnnotationClickListener
    {
        SymbolManager symbolManager;
        CircleManager circleManager;
        //MarkerViewManager markerViewManager;      TrimbleMapsSDK does not have a MarkerViewManager

        private void OnAnnotationsCollectionChanged(object sender, NotifyCollectionChangedEventArgs e)
        {
            switch (e.Action)
            {
                case NotifyCollectionChangedAction.Add:
                    AddAnnotations(e.NewItems.Cast<NxAnnotation>().ToArray());
                    break;
                case NotifyCollectionChangedAction.Remove:
                    RemoveAnnotations(e.OldItems.Cast<NxAnnotation>().ToArray());
                    break;
                case NotifyCollectionChangedAction.Reset:
                    RemoveAllAnnotations();
                    AddAnnotations(Element.Annotations.ToList());
                    break;
                case NotifyCollectionChangedAction.Replace:
                    var itemsToRemove = new List<NxAnnotation>();
                    foreach (NxAnnotation annotation in e.OldItems)
                    {
                        itemsToRemove.Add(annotation);
                    }
                    RemoveAnnotations(itemsToRemove.ToArray());

                    var itemsToAdd = new List<NxAnnotation>();
                    foreach (NxAnnotation annotation in e.NewItems)
                    {
                        itemsToRemove.Add(annotation);
                    }
                    AddAnnotations(itemsToAdd.ToArray());
                    break;
            }
        }

        void Element_AnnotationsChanged(object sender, AnnotationChangedEventArgs e)
        {
            if (mapReady)
            {
                RemoveAllAnnotations();
                AddAnnotations(Element?.Annotations?.ToArray());
            }

            if (e.OldAnnotations is INotifyCollectionChanged oldCollection)
            {
                oldCollection.CollectionChanged -= OnAnnotationsCollectionChanged;
            }

            if (e.NewAnnotations is INotifyCollectionChanged newCollection)
            {
                newCollection.CollectionChanged += OnAnnotationsCollectionChanged;
            }
        }

        void RemoveAnnotations(IList<NxAnnotation> annotations)
        {
            if (map == null)
                return;

            for (int i = 0; i < annotations.Count; i++)
            {
                switch (annotations[i])
                {
                    case SymbolAnnotation symbolAnnotation:
                        {
                            if (symbolManager == null) continue;
                            Object symbol = null;
                            try
                            {
                                symbol = new Object(
                                    symbolAnnotation.NativeHandle,
                                    Android.Runtime.JniHandleOwnership.DoNotTransfer
                                    );
                                symbolManager.Delete(symbol);
                            }
                            finally
                            {
                                symbol?.Dispose();
                            }
                        }
                        break;
                    case CircleAnnotation circleAnnotation:
                        {
                            // TODO Android - Map CircleAnnotation
                        }
                        break;
                    case ViewAnnotation viewAnnotation:
                        {
                            // TrimbleMapsSDK does not have a markerViewManager
                            //if (markerViewManager == null)
                            //{
                            //    markerViewManager = new MarkerViewManager(fragment.MapView, map);

                            //    //markerViewManager.

                            //    // TODO Provide values from Forms
                            //    //symbolManager.IconAllowOverlap = Boolean.True;
                            //    //symbolManager.TextAllowOverlap = Boolean.True;
                            //    //symbolManager.AddClickListener(this);
                            //}
                            //if (viewAnnotation.MarkerView != null)
                            //{
                                //AddStyleImage(symbolAnnotation.IconImage);
                            //}

                            //var symbolOptions = symbolAnnotation.ToSymbolOptions();
                            //var marker = new MarkerView(viewAnnotation.Coordinates.ToLatLng(), viewAnnotation.MarkerView.ToAndroid());
                            //markerViewManager.AddMarker(marker);
                            //var symbol = Android.Runtime.Extensions.JavaCast<Symbol>(symbolManager.Create(symbolOptions));
                            //symbolOptions?.Dispose();
                            //symbolAnnotation.Id = symbol.Id.ToString();
                            //symbol?.Dispose();
                        }
                        break;
                }
            }
        }

        void AddAnnotations(IList<NxAnnotation> annotations)
        {
            if (map == null || annotations == null || annotations.Count == 0)
                return;

            for (int i = 0; i < annotations.Count; i++)
            {
                switch (annotations[i])
                {
                    case SymbolAnnotation symbolAnnotation:
                        {
                            if (symbolManager == null)
                            {
                                symbolManager = new SymbolManager(fragment.MapView, map, mapStyle);

                                // TODO Provide values from Forms
                                symbolManager.IconAllowOverlap = Boolean.True;
                                symbolManager.TextAllowOverlap = Boolean.True;
                                symbolManager.IconIgnorePlacement = Boolean.True;
                                symbolManager.AddClickListener(this);
                            }

                            if (symbolAnnotation.IconImage?.Source != null)
                            {
                                AddStyleImage(symbolAnnotation.IconImage);
                            }

                            var symbolOptions = symbolAnnotation.ToSymbolOptions();
                            var symbol = Android.Runtime.Extensions.JavaCast<Symbol>(symbolManager.Create(symbolOptions));
                            symbolOptions?.Dispose();
                            symbolAnnotation.Id = symbol.Id.ToString();
                            symbol?.Dispose();
                        }
                        break;
                    case ViewAnnotation viewAnnotation:
                        {
                            //if (markerViewManager == null)
                            //{
                            //    markerViewManager = new MarkerViewManager(fragment.MapView, map);
                            //    // add onclick?
                            //}

                            var contentView = viewAnnotation.MarkerView.ToAndroid();
                            var bitmap = ConvertViewToBitmap(contentView);
                            if (symbolManager == null)
                            {
                                symbolManager = new SymbolManager(fragment.MapView, map, mapStyle)
                                {

                                    // TODO Provide values from Forms
                                    IconAllowOverlap = Boolean.True,
                                    TextAllowOverlap = Boolean.True,
                                    IconIgnorePlacement = Boolean.True
                                };
                                symbolManager.AddClickListener(this);

                            }

                            if (bitmap != null)
                            {
                                mapStyle.AddImage(viewAnnotation.Id ?? "tap-annotation-view", bitmap, false);
                            }

                            var symbolOptions = new SymbolOptions()
                                                .WithLatLng(viewAnnotation.Coordinates.ToLatLng());

                            symbolOptions.WithIconImage(viewAnnotation.Id ?? "tap-annotation-view");
                            symbolOptions.WithIconAnchor("bottom");
                            //var symbolOptions = symbolAnnotation.ToSymbolOptions();
                            var symbol = Android.Runtime.Extensions.JavaCast<Symbol>(symbolManager.Create(symbolOptions));
                            symbolOptions?.Dispose();
                            viewAnnotation.Id = symbol.Id.ToString();
                            symbol?.Dispose();
                        }
                        break;
                    case CircleAnnotation circleAnnotation:
                        {
                            // TODO Handle other type of annotation
                        }
                        break;
                }
            }
        }


        private Android.Graphics.Bitmap ConvertViewToBitmap(ViewGroup view)
        {

            Android.Graphics.Bitmap bitmap = Android.Graphics.Bitmap.CreateBitmap(view.MeasuredWidth, view.MeasuredHeight, Android.Graphics.Bitmap.Config.Argb8888);
            Canvas canvas = new Canvas(bitmap);
            canvas.DrawColor(Android.Graphics.Color.Transparent);
            view.Draw(canvas);
            return bitmap;
        }

        void RemoveAllAnnotations()
        {
            symbolManager?.DeleteAll();
        }

        public void OnMarkerClick(object parameter)
        {
            if (!(parameter is Symbol symbol)) return;

            if (Element.DidTapOnMarkerCommand?.CanExecute(symbol.Id.ToString()) == true)
            {
                Element.DidTapOnMarkerCommand.Execute(symbol.Id.ToString());
            }
        }

        public bool OnAnnotationClick(Java.Lang.Object jObj)
        {
            var symbol = jObj as Symbol;
            if (symbol == null) return false;

            if (Element.DidTapOnMarkerCommand?.CanExecute(symbol.Id.ToString()) == true)
            {
                Element.DidTapOnMarkerCommand.Execute(symbol.Id.ToString());
                return true;
            }
            return false;
        }
    }

    public partial class MapViewRenderer : IMapFunctions
    {
        public void UpdateAnnotation(NxAnnotation annotation)
        {
            switch (annotation) {
                case SymbolAnnotation symbolAnnotation:
                    if (symbolManager == null) return;

                    var symbolId = long.Parse(symbolAnnotation.Id);

                    var rawObject = symbolManager.Annotations.Get(symbolId);
                    if (rawObject == null) return;

                    var symbol = Android.Runtime.Extensions.JavaCast<Symbol>(rawObject);
                    if (symbol == null) return;
                    symbol.Update(symbolAnnotation);
                    symbolManager.Update(symbol);

                    symbol?.Dispose();
                    rawObject?.Dispose();
                    break;
                default:
                    break;
            }
        }

        public void AddStyleImage(IconImageSource iconImageSource)
        {
            if (iconImageSource?.Source == null) return;

            var cachedImage = mapStyle.GetImage(iconImageSource.Id);
            if (cachedImage != null) return;

            new System.Threading.Thread(new System.Threading.ThreadStart(() =>
            {
                var bitmap = iconImageSource.Source.GetBitmap(Context);

                if (bitmap == null) return;
                Device.BeginInvokeOnMainThread(() => {
                    mapStyle.AddImage(iconImageSource.Id, bitmap, iconImageSource.IsTemplate);
                    var cachedImage = mapStyle.GetImage(iconImageSource.Id);
                    if (cachedImage != null) return;
                });
            })).Start();
        }
    }
}