
using Microsoft.Maui.Controls.Compatibility;
using Microsoft.Maui.Controls;
using Microsoft.Maui;

namespace TrimbleMaps.MapsSDK.Annotations
{
    public class ViewAnnotation : Annotation
    {
        public LatLng Coordinates { get; set; }

        private View _markerView;
        public View MarkerView {
            get { return _markerView; }
            set
            {
                _markerView = value;
                MarkerView.BindingContext = this;
            }
        }

        //public LayoutAlignment Alignment { get; set; } = LayoutAlignment.Center;

        public ViewAnnotation()
        {
            //MarkerView.BindingContext = this;
        }
    }
}
