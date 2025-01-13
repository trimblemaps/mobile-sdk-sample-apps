import Foundation
import UIKit
import TrimbleMaps
import TrimbleMapsAccounts

class LinesOnAMapViewController: UIViewController, AccountManagerDelegate, TMGLMapViewDelegate {

    internal var mapView: TMGLMapView!

    let SOURCE_ID = "tristatepoints"
    let LAYER_ID = "tristatepoints"

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
                    self.mapView.delegate = self

                    // Set the map location
                    let center = CLLocationCoordinate2D(latitude: 40.60902838712187, longitude: -97.73800045737227)
                    self.mapView.setCenter(center, zoomLevel: 2.5, animated: false)

                    // Add the map
                    self.view.addSubview(self.mapView)
                }
            }
        } else {
            // Handle the case where the account is not licensed for Maps SDK
            print("Account is not licensed for Maps SDK")
        }
    }

    func mapViewDidFinishLoadingMap(_ mapView: TMGLMapView) {
        // In this example a .json file is being used as the source

        let filePath = Bundle.main.path(forResource: "lines", ofType: "json")!
        let fileUrl = URL(fileURLWithPath: filePath)

        // Create a source and add it to the style. Important to note, sources are linked to styles.
        // If you change the style you may need to re-add your source and layers
        let shapeSource = TMGLShapeSource(identifier: SOURCE_ID, url: fileUrl, options: .none)
        mapView.style?.addSource(shapeSource)

        // Create a LineLayer to display our source information.
        let lineLayer = TMGLLineStyleLayer(identifier: LAYER_ID, source: shapeSource)
        lineLayer.lineWidth = NSExpression(forConstantValue: 6)
        lineLayer.lineColor = NSExpression(forConstantValue: UIColor.blue)
        lineLayer.lineOpacity = NSExpression(forConstantValue: 0.8)

        // add the layer
        mapView.style?.addLayer(lineLayer)
    }

}
