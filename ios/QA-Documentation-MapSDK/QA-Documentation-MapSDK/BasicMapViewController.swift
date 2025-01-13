import Foundation
import UIKit
import TrimbleMaps
import TrimbleMapsAccounts

class BasicMapViewController: UIViewController, AccountManagerDelegate {

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

                    let centerCoordinate = CLLocationCoordinate2D(
                    latitude: 40.7128, longitude: -74.0060)
                    let camera = TMGLMapCamera(
                                    lookingAtCenter:centerCoordinate,
                                                    altitude: 500,
                                                    pitch: 15,
                                                    heading: 180)
                    self.mapView.camera = camera

                    // Add the map
                    self.view.addSubview(self.mapView)
                }
            }
        } else {
            // Handle the case where the account is not licensed for Maps SDK
            print("Account is not licensed for Maps SDK")
        }
    }
}

