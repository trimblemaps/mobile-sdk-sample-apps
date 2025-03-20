using System.Threading.Tasks;
using Android.App;
using Android.Content.PM;
using Android.Runtime;
using Android.OS;
using Microsoft.Maui;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.MapSDK.Sample.Droid
{
    using Com.Trimblemaps.Account.Models;
    using Com.Trimblemaps.Account;
    using Com.Trimblemaps.Mapsdk;
    using System.Collections.Generic;
    using Com.Trimblemaps.Android.Core.Permissions;
    using System.Linq;
    using CommunityToolkit.Maui.Core;
    using CommunityToolkit.Maui.Alerts;

    [Activity(Label = "TrimbleMaps.MapSDK.Sample", Icon = "@mipmap/icon", Theme = "@style/Maui.SplashTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize)]
    public class MainActivity : MauiAppCompatActivity
    {
        OnAccountLoaded _onAccountLoaded;
        PermissionsManager _permissionsManager = null;
        PermissionsListener _permissionsListener = null;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            Platform.Init(this, savedInstanceState);

            _permissionsListener = new PermissionsListener(this);
            _permissionsManager = new PermissionsManager(_permissionsListener);
            _permissionsManager.RequestLocationPermissions(this);

            _onAccountLoaded = new OnAccountLoaded(this);
        }

        private void InitializeTrimbleMaps()
        {
            var apiKey = "<API-KEY HERE>";

            var accountInitOptions = AccountInitializationOptions.InvokeBuilder()
                .Callback(_onAccountLoaded)
                //.Proxy(proxy)
                .Build();

            var account = TrimbleMapsAccount.InvokeBuilder()
                .ApiKey(apiKey)
                .AddLicensedFeature(LicensedFeature.MapsSdk)
                .Build();

            TrimbleMapsAccountManager.Initialize(account, accountInitOptions);
        }

        // On AccountInitializedCallback
        class OnAccountLoaded : Java.Lang.Object, TrimbleMapsAccountManager.IAccountInitializationListener
        {
            MainActivity _parent;
            public OnAccountLoaded(MainActivity parent)
            {
                _parent = parent;
            }

            public void OnAccountStatusChanged(AccountStatus status)
            {
                if (status == AccountStatus.Loaded)
                {
                    MainThread.BeginInvokeOnMainThread(() =>
                    {
                        Microsoft.Maui.Controls.Application.Current.MainPage.Navigation.PushAsync(new MainPage());
                        TrimbleMaps.GetInstance(_parent.Application.ApplicationContext);
                    });
                }
            }

            public void OnAccountStatusFailed(AccountStatus status, string message)
            {

                Toast.Make("Account status failed", ToastDuration.Short, 14).Show();

            }

            public void OnLicensingError(IList<LicensedFeature> p0)
            {

                Toast.Make("License status failed", ToastDuration.Short, 14).Show();

            }
        }

        class PermissionsListener : Java.Lang.Object, IPermissionsListener
        {
            MainActivity _parent;
            public PermissionsListener(MainActivity parent)
            {
                _parent = parent;
            }
            public void OnExplanationNeeded(IList<string> permissionsToExplain)
            {

            }

            public void OnPermissionResult(bool granted)
            {
                if (granted)
                {
                    Task.Run(() => _parent.InitializeTrimbleMaps());
                }
            }
        }

        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Android.Content.PM.Permission[] grantResults)
        {
            Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            if ((int)Build.VERSION.SdkInt >= 23)
            {
                base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
            }

            _permissionsManager.OnRequestPermissionsResult(requestCode, permissions, grantResults.Cast<int>().ToArray());
        }
    }
}