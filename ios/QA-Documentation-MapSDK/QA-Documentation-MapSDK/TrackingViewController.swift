import Foundation
import UIKit
import TrimbleMaps
import TrimbleMapsAccounts
import TrimbleMapsWebservicesClient

class TrackingViewController: UIViewController, AccountManagerDelegate {

    internal var mapView: TMGLMapView!

    override func viewDidLoad() {
        super.viewDidLoad()

        let apiKey =  "Your-API-key-here"
        let account = Account(apiKey: apiKey, region: Region.northAmerica)
        AccountManager.default.account = account
        AccountManager.default.delegate = self
    }

    func stateChanged(newStatus: AccountManagerState) {
        if AccountManager.default.isLicensed(licensedFeature: .mapsSdk) {
            if newStatus == .loaded {
                DispatchQueue.main.async {
                    // Create a map view
                    self.mapView = TMGLMapView(frame: self.view.bounds)

                    // Add the map
                    self.view.addSubview(self.mapView)

                    // Start tracking the user
                    self.mapView.userTrackingMode = .followWithHeading
                    self.mapView.showsUserLocation = true
                    self.mapView.showsUserHeadingIndicator = true
                }
            }
        } else {
            // Handle the case where the account is not licensed for Maps SDK
            print("Account is not licensed for Maps SDK")
        }
    }

    func mapView(_ mapView: TMGLMapView, didUpdate userLocation: TMGLUserLocation?) {
        guard let coord = userLocation?.coordinate else {
            return
        }

        mapView.setCenter(coord, animated: true)
    }
}

