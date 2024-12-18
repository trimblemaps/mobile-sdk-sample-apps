import Foundation
import UIKit
import TrimbleMaps
import TrimbleMapsAccounts
import RoutePlugin
import TrimbleMapsWebservicesClient

class SimpleRoutingViewController: UIViewController, AccountManagerDelegate, TMGLMapViewDelegate {

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

                // Set the map location
                let center = CLLocationCoordinate2D(latitude: 40.34330490091359, longitude: -74.62327537264328)
                self.mapView.setCenter(center, zoomLevel: 11, animated: false)

                // Add the map
                self.view.addSubview(self.mapView)
            }
        }
    }

    func mapViewDidFinishLoadingMap(_ mapView: TMGLMapView) {
        // Add the route
        self.createSimpleRoute()
    }

    func createSimpleRoute() {
        let origin = CLLocationCoordinate2D(latitude: 40.361202627269634, longitude: -74.59977385874882)
        let destination = CLLocationCoordinate2D(latitude: 40.23296852563686, longitude: -74.77334837439244)

        // Calculate directions with the route plugin
        let routeplugin = RoutePlugin(mapView: mapView)
        let route = Route()

        let waypoints = [
            Waypoint(coordinate: origin, name: "Point 1"),
            Waypoint(coordinate: destination, name: "Point 2"),
        ]

        let options = RouteOptions(waypoints: waypoints)
        options.shapeFormat = .polyline6
        options.routeShapeResolution = .full

        route.routeOptions = options
        route.color = .magenta

        routeplugin.addRoute(route)
    }

}

