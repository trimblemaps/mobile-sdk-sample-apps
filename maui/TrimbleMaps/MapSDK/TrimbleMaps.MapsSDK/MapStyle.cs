using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace TrimbleMaps.Controls.Forms
{
    public abstract class NotifyableObject : INotifyPropertyChanged, INotifyPropertyChanging
    {
        public event PropertyChangedEventHandler PropertyChanged;
        public event System.ComponentModel.PropertyChangingEventHandler PropertyChanging;

        protected void SetProperty<T>(ref T currentValue, T newValue, [CallerMemberName] string propertyName = null)
        {
            if (Equals(currentValue, newValue)) return;

            PropertyChanging?.Invoke(this, new System.ComponentModel.PropertyChangingEventArgs(propertyName));
            currentValue = newValue;
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    public class MapStyle : NotifyableObject
    {
        public static readonly MapStyle MOBILE_DEFAULT = new MapStyle("trimblemaps://styles/mobiledefault")
        {
            Name = "Mobile Default"
        };

        public static readonly MapStyle MOBILE_DAY = new MapStyle("trimblemaps://styles/mobileday")
        {
            Name = "Mobile Day"
        };

        public static readonly MapStyle MOBILE_NIGHT = new MapStyle("trimblemaps://styles/mobilenight")
        {
            Name = "Mobile Night"
        };

        public static readonly MapStyle MOBILE_SATELLITE = new MapStyle("trimblemaps://styles/mobilesatellite")
        {
            Name = "Mobile Satellite"
        };

        public static readonly MapStyle DEFAULT = new MapStyle("trimblemaps://styles/default")
        {
            Name = "Default"
        };

        public static readonly MapStyle TRANSPORTATION = new MapStyle("trimblemaps://styles/transportation")
        {
            Name = "Transportation"
        };

        public static readonly MapStyle SATELLITE = new MapStyle("trimblemaps://styles/satellite")
        {
            Name = "Satellite"
        };

        public static readonly MapStyle TERRAIN = new MapStyle("trimblemaps://styles/terrain")
        {
            Name = "Terrain"
        };

        public static readonly MapStyle BASIC = new MapStyle("trimblemaps://styles/basic")
        {
            Name = "Basic"
        };

        public static readonly MapStyle DATALIGHT = new MapStyle("trimblemaps://styles/datalight")
        {
            Name = "Datalight"
        };

        public static readonly MapStyle DATADARK = new MapStyle("trimblemaps://styles/datadark")
        {
            Name = "Datadark"
        };


        public string Id { get; set; }

        public string Name { get; set; }

        public string Owner { get; set; }

        public double[] Center { get; set; }

        public string UrlString { get; set; }

        public string Json { get; set; }

        public MapStyle() {}

        public MapStyle(string id, string name, double[] center = null, string owner = null)
        {
            Id = id;
            Name = name;
            Center = center;
            Owner = owner;
            
            UrlString = "trimblemaps://styles/" + Owner + "/" + Id;
        }

        public MapStyle(string urlString)
        {
            if (urlString.StartsWith("trimblemaps://"))
            {
                UpdateIdAndOwner(urlString);
            }

            UrlString = urlString;
        }

        //The bool, "flag", is to differentiate setting the Json parameter from the UrlString
        public MapStyle(string mapJson, bool flag)
        {
            Json = mapJson;
        }

        void UpdateIdAndOwner(string urlString)
        {
            if (!string.IsNullOrEmpty(urlString))
            {
                var segments = (new Uri(urlString)).Segments;
                if (string.IsNullOrEmpty(Id) && segments.Length != 0)
                {
                    Id = segments[segments.Length - 1].Trim('/');
                }
                if (string.IsNullOrEmpty(Owner) && segments.Length > 1)
                {
                    Owner = segments[segments.Length - 2].Trim('/');
                }
            }
        }

        public static implicit operator MapStyle(string url)
        {
            return new MapStyle(url);
        }
    }
}
