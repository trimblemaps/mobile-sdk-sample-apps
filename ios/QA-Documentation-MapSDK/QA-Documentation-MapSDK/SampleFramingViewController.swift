import Foundation
import UIKit
import TrimbleMaps
import TrimbleMapsAccounts

class SampleFramingViewController: UIViewController, AccountManagerDelegate, TMGLMapViewDelegate {

    internal var mapView: TMGLMapView!
    private var coordinatesList: [[CLLocationCoordinate2D]] = []
    private var currentIndex = 0

    let SOURCE_ID = "tristatepoints"
    let LAYER_ID = "tristatepoints"

    override func viewDidLoad() {
        super.viewDidLoad()
        let apiKey =  "Your-API-key-here"
        let account = Account(apiKey: apiKey, region: Region.northAmerica)
        AccountManager.default.account = account
        AccountManager.default.delegate = self
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Back", style: .plain, target: self, action: #selector(backButtonPressed))
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Frame", style: .plain, target: self, action: #selector(frameButtonPressed))

        // Set the view's background color
        self.view.backgroundColor = .white

        // Load the coordinates from the JSON file
        loadCoordinates()
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

    @objc func moveCamera() {
        guard !coordinatesList.isEmpty else {
            print("No coordinates available")
            return
        }

        // Get the current set of coordinates
        let pointList = coordinatesList[currentIndex]

        // Calculate the bounding box
        guard let boundingBox = calculateBoundingBox(for: pointList) else {
            print("Failed to calculate bounding box")
            return
        }

        // Update the view to the set of lines
        mapView.setVisibleCoordinateBounds(boundingBox, edgePadding: .zero, animated: true, completionHandler: nil)

        // Update the index to the next set of coordinates
        currentIndex = (currentIndex + 1) % coordinatesList.count
    }

    func loadCoordinates() {
        // Load the JSON file
        guard let filePath = Bundle.main.path(forResource: "lines", ofType: "json"),
              let data = try? Data(contentsOf: URL(fileURLWithPath: filePath)),
              let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
              let features = json["features"] as? [[String: Any]] else {
            print("Failed to load or parse lines.json")
            return
        }

        // Extract coordinates
        for feature in features {
            if let geometry = feature["geometry"] as? [String: Any],
               let coordinates = geometry["coordinates"] as? [[Double]] {
                var pointList = [CLLocationCoordinate2D]()
                for coordinate in coordinates {
                    let point = CLLocationCoordinate2D(latitude: coordinate[1], longitude: coordinate[0])
                    pointList.append(point)
                }
                coordinatesList.append(pointList)
            }
        }
    }

    func calculateBoundingBox(for points: [CLLocationCoordinate2D]) -> TMGLCoordinateBounds? {
        guard !points.isEmpty else { return nil }

        var minLat = points[0].latitude
        var maxLat = points[0].latitude
        var minLon = points[0].longitude
        var maxLon = points[0].longitude

        for point in points {
            if point.latitude < minLat { minLat = point.latitude }
            if point.latitude > maxLat { maxLat = point.latitude }
            if point.longitude < minLon { minLon = point.longitude }
            if point.longitude > maxLon { maxLon = point.longitude }
        }

        let sw = CLLocationCoordinate2D(latitude: minLat, longitude: minLon)
        let ne = CLLocationCoordinate2D(latitude: maxLat, longitude: maxLon)

        return TMGLCoordinateBounds(sw: sw, ne: ne)
    }
    
    @objc func backButtonPressed() {
        dismiss(animated: true, completion: nil)
    }
    
    @objc func frameButtonPressed() {
        moveCamera()
    }
}
