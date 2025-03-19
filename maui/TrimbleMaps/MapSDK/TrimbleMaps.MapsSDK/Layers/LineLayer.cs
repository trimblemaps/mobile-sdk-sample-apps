﻿using TrimbleMaps.MapsSDK.Expressions;

namespace TrimbleMaps.MapsSDK.Layers
{
    public class LineLayer : StyleLayer
    {
        public Expression LineBlur { get; set; }
        public TransitionOptions LineBlurTransition { get; set; }

        public Expression LineCap { get; set; }

        public Expression LineColor { get; set; }
        public TransitionOptions LineColorTransition { get; set; }

        public Expression LineDasharray { get; set; }
        public TransitionOptions LineDasharrayTransition { get; set; }

        public Expression LineGapWidth { get; set; }
        public TransitionOptions LineGapWidthTransition { get; set; }

        public Expression LineGradient { get; set; }
        public Expression LineJoin { get; set; }

        public Expression LineOpacity { get; set; }
        public TransitionOptions LineOpacityTransition { get; set; }

        public Expression LineWidth { get; set; }
        public TransitionOptions LineWidthTransition { get; set; }

        public LineLayer(string id, string sourceId) : base(id, sourceId) { }
    }
}
