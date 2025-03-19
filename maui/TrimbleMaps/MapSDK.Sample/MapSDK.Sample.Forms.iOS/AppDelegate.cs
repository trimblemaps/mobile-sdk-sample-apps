using Foundation;
using Microsoft.Maui;
using Microsoft.Maui.Hosting;

namespace TrimbleMaps.MapSDK.Sample.Forms.iOS;

// TODO: Platform specific bootstrapping code should be migrated from AppDelegate.cs.original to AppDelegate.cs or MauiProgram.cs.
// See iOS App Lifecycle: https://learn.microsoft.com/dotnet/maui/fundamentals/app-lifecycle#ios

[Register(nameof(AppDelegate))]
public class AppDelegate : MauiUIApplicationDelegate
{
    protected override MauiApp CreateMauiApp() => MauiProgram.CreateMauiApp();
}
