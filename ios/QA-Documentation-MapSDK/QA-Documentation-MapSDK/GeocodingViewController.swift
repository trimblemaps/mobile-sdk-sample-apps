import Foundation
import UIKit
import TrimbleMaps
import TrimbleMapsAccounts
import TrimbleMapsWebservicesClient

class GeocodingViewController: UIViewController, AccountManagerDelegate, TMGLMapViewDelegate {

    internal var mapView: TMGLMapView!

    override func viewDidLoad() {
        super.viewDidLoad()
        let apiKey =  "Your-API-key-here"
        let account = Account(apiKey: apiKey, region: Region.northAmerica)
        AccountManager.default.account = account
        AccountManager.default.delegate = self
    }

    func stateChanged(newStatus: AccountManagerState) {
        if newStatus == .loaded {
            DispatchQueue.main.async {
                // Create a map view
                self.mapView = TMGLMapView(frame: self.view.bounds)
                self.mapView.delegate = self

                // Add the map
                self.view.addSubview(self.mapView)
            }
        }
    }

    func mapViewDidFinishLoadingMap(_ mapView: TMGLMapView) {
        // Geocode
        self.geocode()
    }

    func geocode() {
        let geocoder = TMGeocoderClient()
        let params = TMGeocoderParams(region: "NA", query: "1 Independence Way Princeton NJ 08540")

        geocoder.geocode(params) { result, error in
            guard let result = result, !result.locations.isEmpty, error == nil else {
                return
            }

            // Zoom to that location
            if let coords = result.locations[0].coords, let lat = Double(coords.lat ?? ""), let lon = Double(coords.lon ?? "") {
                self.mapView.setCenter(CLLocationCoordinate2D(latitude: lat, longitude: lon), zoomLevel: 11, animated: true)
                print("coords: \(lat) \(lon)")
            }

        }
    }

}

