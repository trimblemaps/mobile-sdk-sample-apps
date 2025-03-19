using MapsSDK;
using TrimbleMaps.Controls.Forms;
using Microsoft.Maui.ApplicationModel;

namespace TrimbleMaps.Controls.MapsSDK.Platform.iOS.Extensions
{
    public static class OfflinePackProgressExtensions
    {
        public static OfflinePackProgress ToFormsProgress(this MGLOfflinePackProgress progress) {
            var formsProgress = new OfflinePackProgress()
            {
                CountOfBytesCompleted = progress.countOfBytesCompleted,
                CountOfTilesCompleted = progress.countOfTilesCompleted,
                CountOfResourcesExpected = progress.countOfResourcesExpected,
                CountOfResourcesCompleted = progress.countOfResourcesCompleted,
                CountOfTileBytesCompleted = progress.countOfTileBytesCompleted,
                MaximumResourcesExpected = progress.maximumResourcesExpected
            };
            return formsProgress;
        }
    }
}
