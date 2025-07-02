import SwiftUI
import SearchUIPlugin
import CoreLocation
import TrimbleMapsNavigation
import TrimbleMapsCoreNavigation
import TrimbleMapsWebservicesClient
import Combine
import TrimbleMapsAccounts
 
struct ContentView: View {
    @StateObject var viewModel = TrimbleMapsMapView.MapViewModel()
    public var routeRequestCallback: TMDirections.RouteCompletionHandler?

    var body: some View {
        if let navigationViewController = viewModel.navigationViewController {
            TrimbleMapsNavigationView(viewModel: viewModel, navigationViewController: navigationViewController)
        }
        if viewModel.isNaviagtionEnded == true {
            Text("Home")
        } else {
            ZStack(alignment: .top) {
                Text("")
                    .onAppear {
                        geocode()
                    }
                    .background(Color.clear)
            }
        }
    }

    private func geocode() {
        viewModel.tripPreviewViewModel.trip.origin = CLLocation(latitude: 40.7128, longitude: -74.0060)
        let destination = CLLocationCoordinate2D(latitude: 40.349542, longitude: -74.660237)
        let geocoder = TMGeocoderClient.shared
        let region = AccountManager.default.region.queryValue
        let options = TMGeocoderParams(query: "\(destination.latitude), \(destination.longitude)")

        geocoder.geocode(options) { result, error in
            // sort results by distance
            if error == nil, let result = result?.locations.first {
                self.viewModel.tripPreviewViewModel.addStop(tripStop: TripStop(location: result))
                self.recalculateRoute()
            }
        }
    }
    
    private func recalculateRoute() {
        let callback: TMDirections.RouteCompletionHandler = { [self] session, result in

            switch result {
            case .success(let routeResponse):
                self.viewModel.updateTrip(trip: viewModel.tripPreviewViewModel.trip, routes: routeResponse.routes!)
            case .failure(let directionsError):
                NSLog("Error recalculating route: \(directionsError)")
            }
        }

        if viewModel.tripPreviewViewModel.trip.status == .Planned {
            viewModel.tripPreviewViewModel.trip.fetchFullRoute(callback: callback)
        } else {
            viewModel.tripPreviewViewModel.trip.fetchRemainingRoute(callback: callback)
        }
    }
}

struct TrimbleMapsMapView: UIViewRepresentable {
    @EnvironmentObject var viewModel: MapViewModel

    let tripStops: [TripStop] = []

    func makeCoordinator() -> Coordinator {
        return Coordinator(viewModel: viewModel)
    }

    func makeUIView(context: Context) -> TMGLMapView {
        viewModel.mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        viewModel.mapView.delegate = context.coordinator
        viewModel.mapView.showsUserLocation = true

        return viewModel.mapView
    }

    func updateUIView(_ uiView: TMGLMapView, context: Context) {}

    class MapViewModel: ObservableObject {
        @Published var tripPreviewViewModel: TripPreviewViewModel = {
            var placeOptions = PlaceOptions()
            placeOptions.maxResults = 10
            let tripPreviewOptions = TripPreviewOptions(placeOptions: placeOptions)
            return TripPreviewViewModel.create(tripPreviewOptions: tripPreviewOptions)
        }()
        @Published var isDynamicTripPreview = false
        @Published var isDynamicSearchMode = false
        @Published var routeOrigin: CLLocationCoordinate2D?
        @Published var routeDestination: CLLocationCoordinate2D?
        @Published var navigationViewController: NavigationViewController?
        @Published var isNaviagtionEnded: Bool = false
        let mapView: TMGLMapView = TMGLMapView(frame: .zero)
        var currentStyle: TMGLStyle?
        private var currentColorScheme: URL?
        @Published var showSpeedLimit: Bool = false
        @Published var showSpeedAlert: Bool = false

        func setShowSpeedLimit(_ show: Bool) {
            showSpeedLimit = show
            if let navigationViewController = navigationViewController {
                navigationViewController.showsSpeedLimits = showSpeedLimit
            }
        }

        func setShowSpeedAlert(_ show: Bool) {
            showSpeedAlert = show
            if let navigationViewController = navigationViewController {
                navigationViewController.showsSpeedAlerts = showSpeedAlert
            }
        }

        func setStyleUrl(_ styleUrl: URL) {
            currentColorScheme = styleUrl
            mapView.styleURL = styleUrl
            tripPreviewViewModel.tripPreviewMapModel.navigationMapView.styleURL = styleUrl
            if styleUrl == TMGLStyle.mobileDayStyleURL {
                navigationViewController?.styleManager.applyStyle(type: StyleType.day)
            } else {
                navigationViewController?.styleManager.applyStyle(type: StyleType.night)
            }
        }

        func reset() {
            tripPreviewViewModel = TripPreviewViewModel.create(tripPreviewOptions: tripPreviewViewModel.tripPreviewOptions)
            tripPreviewViewModel.tripPreviewMapModel.navigationMapView.styleURL = currentColorScheme
            routeOrigin = nil
            routeDestination = nil
            navigationViewController = nil
            currentStyle = nil
        }

        func updateTrip(trip: TrimbleMapsTrip, routes: [Route]) {
            let routeIndex = 0
            if let navigationViewController = navigationViewController {
                navigationViewController.update(newTrip: trip, newRoutes: routes)
                return
            }

            let routeOptions = try! trip.fullTripRouteOptions()

            let styles: [Style] = [TrimbleDayStyle()]
            let routeRefreshOptions = RouteRefreshOptions(isRouteRefreshEnabled: true,
                                                          refreshInterval: 60,
                                                          requestFasterRoute: true,
                                                          automaticAcceptFasterRoute: true)

            var simulate: SimulationMode = SimulationMode(rawValue: SimulationMode.always.rawValue)!

            let simulationMode: SimulationMode = simulate

            let navigationService = TrimbleMapsNavigationService(route: routes[routeIndex],
                                                                 routeIndex: routeIndex,
                                                                 routeOptions: routeOptions,
                                                                 routeRefreshOptions: routeRefreshOptions,
                                                                 simulating: simulationMode)

            var speechSynthesizer: SpeechSynthesizing = SystemSpeechSynthesizer()
            speechSynthesizer = BeepingSpeechSynthesizer(speechSynthesizer)

            let routeVoiceController = RouteVoiceController(navigationService: navigationService, speechSynthesizer: speechSynthesizer)

            let navigationOptions = NavigationOptions(styles: styles,
                                                      navigationService: navigationService,
                                                      voiceController: routeVoiceController,
                                                      showTripPreviewButton: true)

            let navigationViewController = NavigationViewController(trip: trip,
                                                                    for: routes[routeIndex],
                                                                    routeIndex: routeIndex,
                                                                    routeOptions: routeOptions,
                                                                    navigationOptions: navigationOptions)

            navigationViewController.routeLineTracksTraversal = true

            if currentColorScheme == TMGLStyle.mobileDayStyleURL {
                navigationViewController.styleManager.applyStyle(type: StyleType.day)
            } else {
                navigationViewController.styleManager.applyStyle(type: StyleType.night)
            }
            navigationViewController.showsSpeedLimits = showSpeedLimit
            navigationViewController.showsSpeedAlerts = showSpeedAlert

            self.navigationViewController = navigationViewController
        }
    }
    
    
    class Coordinator: NSObject, TMGLMapViewDelegate {

        let viewModel: MapViewModel

        init(viewModel: MapViewModel) {
            self.viewModel = viewModel
        }

        func mapView(_ mapView: TMGLMapView, viewFor annotation: TMGLAnnotation) -> TMGLAnnotationView? {
            return nil
        }

        func mapView(_ mapView: TMGLMapView, annotationCanShowCallout annotation: TMGLAnnotation) -> Bool {
            return true
        }

        func mapView(_ mapView: TMGLMapView, didFinishLoading style: TMGLStyle) {
            viewModel.currentStyle = style
        }

        func mapView(_ mapView: TMGLMapView, didUpdate userLocation: TMGLUserLocation?) {
            guard let location = userLocation?.location else { return }

            // update the trip
            viewModel.tripPreviewViewModel.trip.origin = location

            // after that just update the origin silently
            let centerOnOrigin = viewModel.routeOrigin == nil
            viewModel.routeOrigin = location.coordinate
            if centerOnOrigin {
                viewModel.mapView.setCenter(location.coordinate, zoomLevel: 9, animated: false)
            }
        }

    }
}
