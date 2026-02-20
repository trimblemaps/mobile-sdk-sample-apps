using System.Collections.ObjectModel;

namespace TrimbleMaps.MapSDK.Sample
{
    public partial class MainPage : ContentPage
    {
        public ObservableCollection<NavigationItem> NavigationItems { get; set; }


        public double DeviceWidth;
        public MainPage()
        {
            InitializeComponent();
            NavigationPage.SetHasBackButton(this, false);
            DeviceDisplay.MainDisplayInfoChanged += OnMainDisplayInfoChanged;
            DeviceWidth = DeviceDisplay.MainDisplayInfo.Width / DeviceDisplay.MainDisplayInfo.Density;
            updateNavigationItems();

            BindingContext = this;
        }

        private void updateNavigationItems()
        {
            NavigationItems = new ObservableCollection<NavigationItem>
                        {
                            new NavigationItem{
                                Title ="Base layer",
                                TargetPage = typeof(MapSDK.Sample.BaseLayer),
                                ImageSource =  ImageSource.FromResource("MapSDK.Sample.Resources.Images.baselayerimage.png"),
                                screenWidth = DeviceWidth
                            },
                            new NavigationItem{
                                Title ="Dots on Map layer",
                                TargetPage = typeof(MapSDK.Sample.DotsOnMapLayer),
                                ImageSource =  ImageSource.FromResource("MapSDK.Sample.Resources.Images.baselayerimage.png"),
                                screenWidth = DeviceWidth
                            },
                            new NavigationItem{
                                Title ="Hazard icon on Map layer",
                                TargetPage = typeof(MapSDK.Sample.HazardIcon),
                                ImageSource =  ImageSource.FromResource("MapSDK.Sample.Resources.Images.baselayerimage.png"),
                                screenWidth = DeviceWidth
                            },
                            new NavigationItem{
                                Title ="Map Styles",
                                TargetPage = typeof(MapSDK.Sample.MapStyles),
                                ImageSource =  ImageSource.FromResource("MapSDK.Sample.Resources.Images.general_splash.png"),
                                screenWidth = DeviceWidth
                            },
                            new NavigationItem{
                                Title ="Trimble Layers",
                                TargetPage = typeof(MapSDK.Sample.TrimbleLayers),
                                ImageSource =  ImageSource.FromResource("MapSDK.Sample.Resources.Images.general_splash.png"),
                                screenWidth = DeviceWidth
                            },
                            new NavigationItem{
                                Title ="Avoid Favors",
                                TargetPage = typeof(MapSDK.Sample.AvoidFavors),
                                ImageSource =  ImageSource.FromResource("MapSDK.Sample.Resources.Images.general_splash.png"),
                                screenWidth = DeviceWidth
                            }
                        };
        }

        private void OnMainDisplayInfoChanged(object sender, DisplayInfoChangedEventArgs e)
        {
            DeviceWidth = e.DisplayInfo.Width / e.DisplayInfo.Density;
            updateNavigationItems();
        }
    }

    public class NavigationItem
    {
        public string Title { get; set; }
        public Type TargetPage { get; set; }

        public Command NavigateCommand => new Command(async (parameter) =>
        {
            if (parameter is Type pageType)
            {
                var page = (Page)Activator.CreateInstance(pageType);
                await Application.Current.MainPage.Navigation.PushAsync(page);
            }
        });

        public ImageSource ImageSource { get; internal set; }
        public double screenWidth { get; internal set; }
    }
}
