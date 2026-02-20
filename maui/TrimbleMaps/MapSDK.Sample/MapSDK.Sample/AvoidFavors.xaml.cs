using System.Collections;
using System.Collections.ObjectModel;
using System.ComponentModel;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using TrimbleMaps.Controls.Forms;
using TrimbleMaps.MapsSDK;
using Com.Trimblemaps.Account;

namespace TrimbleMaps.MapSDK.Sample
{
    public partial class AvoidFavors : ContentPage
    {
        private bool isLayerVisible = true;
        private bool isDataLoaded = false;
        private List<int> allSetIds = new List<int>();
        private HashSet<int> selectedSetIds = new HashSet<int>();
        private List<int> assetSetIds = new List<int>();
        private ObservableCollection<SetIdItem> setIdItems = new ObservableCollection<SetIdItem>();

        public AvoidFavors()
        {
            InitializeComponent();
            Setup();
            LoadSetIds();
        }

        private void Setup()
        {
            Map.Center = new TrimbleMaps.MapsSDK.LatLng(39.987032, -105.105344);
            Map.ZoomLevel = 13;
            Map.MapStyle = MapStyle.MOBILE_DAY;
            Map.ShowAvoidFavorsLayer = isLayerVisible;
        }

        private async void LoadSetIds()
        {
            var service = AvoidFavorsServiceProvider.Current;
            if (service == null)
            {
                OnSetIdsLoadFailed("Avoid Favors service is not available (platform may not be initialized).");
                return;
            }

            // Load all set IDs for the account
            try
            {
                var ids = await service.LoadAccountSetIdsAsync(
                    pageNumber: 0,
                    pageSize: 25);
                OnSetIdsLoaded(ids != null ? new List<int>(ids) : new List<int>());
            }
            catch (Exception ex)
            {
                OnSetIdsLoadFailed(ex.Message);
            }

            // Load asset-specific set IDs
            try
            {
                var vehicleId = TrimbleMapsAccountManager.Account?.AssetId();
                if (!string.IsNullOrEmpty(vehicleId))
                {
                    var ids = await service.LoadAssetSetIdsAsync(vehicleId);
                    OnAssetSetIdsLoaded(ids != null ? new List<int>(ids) : new List<int>());
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine("AvoidFavors: No asset ID configured on account");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"AvoidFavors: Failed to load asset set IDs: {ex.Message}");
            }
        }

        private void OnSetIdsLoaded(List<int> ids)
        {
            MainThread.BeginInvokeOnMainThread(() =>
            {
                allSetIds = ids;
                isDataLoaded = true;
                FilterBySetIdButton.IsEnabled = true;
                FilterByAssetButton.IsEnabled = true;
                LoadingOverlay.IsVisible = false;
                System.Diagnostics.Debug.WriteLine($"AvoidFavors: Loaded {ids.Count} set IDs: [{string.Join(", ", ids)}]");
            });
        }

        private void OnSetIdsLoadFailed(string error)
        {
            MainThread.BeginInvokeOnMainThread(() =>
            {
                isDataLoaded = false;
                LoadingOverlay.IsVisible = false;
                DisplayAlert("Error Loading Set IDs", error, "OK");
                System.Diagnostics.Debug.WriteLine($"AvoidFavors: Failed to load set IDs: {error}");
            });
        }

        private void OnAssetSetIdsLoaded(List<int> ids)
        {
            MainThread.BeginInvokeOnMainThread(() =>
            {
                assetSetIds = ids;
                System.Diagnostics.Debug.WriteLine($"AvoidFavors: Loaded {ids.Count} asset set IDs: [{string.Join(", ", ids)}]");
            });
        }

        private void OnToggleLayerClicked(object sender, EventArgs e)
        {
            isLayerVisible = !isLayerVisible;
            Map.ShowAvoidFavorsLayer = isLayerVisible;

            if (isLayerVisible)
            {
                // Apply current filter
                if (selectedSetIds.Count == 0)
                {
                    Map.Functions.SetAvoidFavorsFilter(null);
                }
                else
                {
                    Map.Functions.SetAvoidFavorsFilter(new ArrayList(selectedSetIds.ToList()));
                }

                ToggleLayerButton.Text = "HIDE AVOID/FAVORS";
                Toast.Make("Avoid/Favors Layer is enabled", ToastDuration.Short, 14).Show();
            }
            else
            {
                ToggleLayerButton.Text = "SHOW AVOID/FAVORS";
                Toast.Make("Avoid/Favors Layer is disabled", ToastDuration.Short, 14).Show();
            }

            System.Diagnostics.Debug.WriteLine($"AvoidFavors: Layer {(isLayerVisible ? "shown" : "hidden")}");
        }

        private void OnFilterBySetIdClicked(object sender, EventArgs e)
        {
            // Populate the set ID items for the filter dialog
            setIdItems.Clear();
            foreach (var setId in allSetIds)
            {
                setIdItems.Add(new SetIdItem
                {
                    SetId = setId,
                    IsSelected = selectedSetIds.Contains(setId)
                });
            }
            SetIdListView.ItemsSource = setIdItems;
            FilterOverlay.IsVisible = true;
        }

        private void OnFilterByAssetClicked(object sender, EventArgs e)
        {
            // Enable AF layer if it's not already visible
            if (!isLayerVisible)
            {
                isLayerVisible = true;
                Map.ShowAvoidFavorsLayer = true;
                ToggleLayerButton.Text = "HIDE AVOID/FAVORS";
            }

            // Apply filter to only show AF Sets for the asset
            if (assetSetIds.Count == 0)
            {
                Map.Functions.SetAvoidFavorsFilter(null);
                selectedSetIds.Clear();
                Toast.Make("No AFs associated with asset, showing all AFs in account", ToastDuration.Short, 14).Show();
                System.Diagnostics.Debug.WriteLine("AvoidFavors: No AFs associated with asset, showing all AFs in account");
            }
            else
            {
                Map.Functions.SetAvoidFavorsFilter(new ArrayList(assetSetIds));
                selectedSetIds = new HashSet<int>(assetSetIds);
                Toast.Make($"Showing {assetSetIds.Count} Asset AFs", ToastDuration.Short, 14).Show();
                System.Diagnostics.Debug.WriteLine($"AvoidFavors: Showing Asset AFs: [{string.Join(", ", assetSetIds)}]");
            }
        }

        private void OnSelectAllClicked(object sender, EventArgs e)
        {
            foreach (var item in setIdItems)
            {
                item.IsSelected = true;
            }
        }

        private void OnClearAllClicked(object sender, EventArgs e)
        {
            foreach (var item in setIdItems)
            {
                item.IsSelected = false;
            }
        }

        private void OnSetIdCheckedChanged(object sender, CheckedChangedEventArgs e)
        {
            // The binding handles the state update via SetIdItem.IsSelected
        }

        private void OnUpdateFilterClicked(object sender, EventArgs e)
        {
            selectedSetIds.Clear();
            foreach (var item in setIdItems)
            {
                if (item.IsSelected)
                {
                    selectedSetIds.Add(item.SetId);
                }
            }
            FilterOverlay.IsVisible = false;

            // Apply filter to map
            if (selectedSetIds.Count == 0)
            {
                Map.Functions.SetAvoidFavorsFilter(null);
                System.Diagnostics.Debug.WriteLine("AvoidFavors: Filter cleared - showing all sets");
            }
            else
            {
                Map.Functions.SetAvoidFavorsFilter(new ArrayList(selectedSetIds.ToList()));
                System.Diagnostics.Debug.WriteLine($"AvoidFavors: Filter applied with {selectedSetIds.Count} set IDs: [{string.Join(", ", selectedSetIds)}]");
            }
        }

        private void OnCancelFilterClicked(object sender, EventArgs e)
        {
            FilterOverlay.IsVisible = false;
        }
    }

    // Model for the set ID checkbox list
    public class SetIdItem : INotifyPropertyChanged
    {
        private int _setId;
        private bool _isSelected;

        public int SetId
        {
            get => _setId;
            set
            {
                _setId = value;
                OnPropertyChanged(nameof(SetId));
                OnPropertyChanged(nameof(DisplayText));
            }
        }

        public bool IsSelected
        {
            get => _isSelected;
            set
            {
                _isSelected = value;
                OnPropertyChanged(nameof(IsSelected));
            }
        }

        public string DisplayText => $"Set ID: {SetId}";

        public event PropertyChangedEventHandler PropertyChanged;

        protected void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}
