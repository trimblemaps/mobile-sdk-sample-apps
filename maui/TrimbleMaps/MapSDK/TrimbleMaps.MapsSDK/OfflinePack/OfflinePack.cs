﻿using System;
using System.Collections.Generic;

namespace TrimbleMaps.Controls.Forms
{
    public class OfflinePack
    {
        public long Id { get; set; }

        public OfflinePackRegion Region { get; set; }

        public Dictionary<string, string> Info { get; set; }

        public OfflinePackProgress Progress { get; set; }

        public OfflinePackState State { get; set; }

        public IntPtr Handle { get; set; }
    }
}
