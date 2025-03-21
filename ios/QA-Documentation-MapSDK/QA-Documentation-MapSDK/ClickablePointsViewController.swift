import Foundation
import UIKit
import MapKit
import TrimbleMaps
import TrimbleMapsAccounts

class ClickablePointsViewController: UIViewController, AccountManagerDelegate, TMGLMapViewDelegate {
    
    internal var mapView: TMGLMapView!
    
    private let SOURCE_ID = "tristatepoints"
    private let LAYER_ID = "tristatepoints"
    private let ICON_ID = "ic_location"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let apiKey =  "Your-API-key-here"
        let account = Account(apiKey: apiKey, region: Region.northAmerica)
        AccountManager.default.account = account
        AccountManager.default.delegate = self
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Back", style: .plain, target: self, action: #selector(backButtonPressed))
    }
    
    func stateChanged(newStatus: AccountManagerState) {
        if newStatus == .loaded {
            DispatchQueue.main.async {
                // Create a map view
                self.mapView = TMGLMapView(frame: self.view.bounds)
                self.mapView.delegate = self

                // Set the map location
                let center = CLLocationCoordinate2D(latitude: 41.36290180612575, longitude: -74.6946761628674)
                self.mapView.setCenter(center, zoomLevel: 13, animated: false)

                // Add the map
                self.view.addSubview(self.mapView)
            }
        }
    }
    
    func mapViewDidFinishLoadingMap(_ mapView: TMGLMapView) {
        // In this example a .json file is being used as the source

        let filePath = Bundle.main.path(forResource: "tristate", ofType: "json")!
        let fileUrl = URL(fileURLWithPath: filePath)

        // Create a source and add it to the style. Important to note, sources are linked to styles.
        // If you change the style you may need to re-add your source and layers
        let shapeSource = TMGLShapeSource(identifier: SOURCE_ID, url: fileUrl, options: .none)
        mapView.style?.addSource(shapeSource)
        
        // Add the icon image to the style
        if let image = UIImage(named: ICON_ID) {
            mapView.style?.setImage(image, forName: ICON_ID)
        }

        // Create a SymbolLayer to display the icons
        let symbolLayer = TMGLSymbolStyleLayer(identifier: LAYER_ID, source: shapeSource)
        symbolLayer.iconImageName = NSExpression(forConstantValue: ICON_ID)
        
        // add the layer
        mapView.style?.addLayer(symbolLayer)
        
        // Add tap gesture recognizer
        let tapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(handleMapTap(_:)))
        mapView.addGestureRecognizer(tapGestureRecognizer)
    }
    
    @objc func handleMapTap(_ sender: UITapGestureRecognizer) {
        let point = sender.location(in: mapView)
        let coordinate = mapView.convert(point, toCoordinateFrom: mapView)

        let features = mapView.visibleFeatures(at: point, styleLayerIdentifiers: Set([LAYER_ID]))
        if let feature = features.first as? TMGLPointFeature, let properties = feature.attributes as? [String: Any] {
            let state = properties["state"] as? String ?? "Unknown"
            let coordinates = feature.coordinate
            let message = "Coordinates: \(coordinates.longitude), \(coordinates.latitude)\nState: \(state)"
            showAlert(message: message)
        }
    }
    
    func showAlert(message: String) {
        let alert = UIAlertController(title: "Location Info", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        present(alert, animated: true, completion: nil)
    }

    @objc func backButtonPressed() {
        dismiss(animated: true, completion: nil)
    }
}
