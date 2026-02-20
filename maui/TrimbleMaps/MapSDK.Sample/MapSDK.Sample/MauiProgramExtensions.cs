using Android.App;
using Android.Runtime;
using CommunityToolkit.Maui;
using Microsoft.Maui.Handlers;
using TrimbleMaps.Controls.Forms;
using TrimbleMaps.Controls.MapsSDK.Platform.Droid;
using TrimbleMaps.MapSDK.Sample;
using MapsSDK = TrimbleMaps.MapsSDK;

namespace MapSDK.Sample;

public static class MauiProgramExtensions
{
    public static MauiApp UseSharedMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .ConfigureMauiHandlers(handlers =>
            {
                handlers.AddHandler(typeof(MapView), typeof(MapViewRenderer));
                handlers.AddHandler(typeof(Image), typeof(ImageHandler));
            });

        builder.Services.AddSingleton<MapsSDK.IAvoidFavorsService, AvoidFavorsServiceImplementation>();

        var app = builder.Build();
        MapsSDK.AvoidFavorsServiceProvider.Current = app.Services.GetService<MapsSDK.IAvoidFavorsService>();
        return app;
    }
}

[Application]
public class MainApplication : MauiApplication
{
    public MainApplication(IntPtr handle, JniHandleOwnership ownership)
        : base(handle, ownership)
    {
    }

    protected override MauiApp CreateMauiApp() => MauiProgramExtensions.UseSharedMauiApp();
}
