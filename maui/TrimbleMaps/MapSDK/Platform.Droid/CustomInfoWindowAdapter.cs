using Android.Content;
using Com.Trimblemaps.Mapsdk.Annotations;
using static Com.Trimblemaps.Mapsdk.Maps.TrimbleMapsMap;
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.MapsSDK.Platform.Droid
{
    public class CustomInfoWindowAdapter : Java.Lang.Object, IInfoWindowAdapter
    {
        Context _context;
        TrimbleMaps.Controls.Forms.MapView _mapView;
        DataTemplate _dataTemPlate;
        public CustomInfoWindowAdapter(Context context, TrimbleMaps.Controls.Forms.MapView map)
        {
            _context = context;
            _mapView = map;
            _dataTemPlate = map.InfoWindowTemplate;
        }
        public Android.Views.View GetInfoWindow(Marker marker)
        {
            //if (marker.InfoWindow?.View != null)
            //{
            //    return marker.InfoWindow.View;
            //}

            //if (_dataTemPlate == null)
            //    return null;

            ////var bindingContext = _mapView.Annotations?.FirstOrDefault(d => d.Id == marker.Id.ToString());
            //var templateContent = (_dataTemPlate is DataTemplateSelector dataTemplateSelector)
            //    ? dataTemplateSelector.SelectTemplate(bindingContext, _mapView).CreateContent()
            //    : _dataTemPlate.CreateContent();

            //View view = null;

            //switch (templateContent)
            //{
            //    case ViewCell viewCell:
            //        viewCell.BindingContext = bindingContext;
            //        viewCell.Parent = _mapView;
            //        view = viewCell.View;
            //        break;
            //    case View view1:
            //        view1.BindingContext = bindingContext;
            //        view1.Parent = _mapView;
            //        view = view1;
            //        break;
            //    default:
            //        return null;
            //}

            //var renderer = Platform.GetRenderer(view) ?? Platform.CreateRendererWithContext(view, _context);
            //Platform.SetRenderer(view, renderer);

            //var output = new ViewGroupContainer(_context)
            //{
            //    Child = renderer
            //};
            //return output;
            return null;
        }
    }
}