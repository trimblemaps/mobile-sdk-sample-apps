import SwiftUI
import TrimbleMapsNavigation
import TrimbleMapsCoreNavigation
import TrimbleMapsWebservicesClient

struct TrimbleMapsNavigationView: UIViewControllerRepresentable {
    
    var viewModel: TrimbleMapsMapView.MapViewModel
    let navDelegate = NavDelegate()
    var navigationViewController: NavigationViewController
    
    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }
    
    class Coordinator: NSObject {
        var parent: TrimbleMapsNavigationView
        
        init(parent: TrimbleMapsNavigationView) {
            self.parent = parent
        }
        
        @objc func handleSearch(_ sender: Any) {
            parent.handleSearch()
        }
    }

    func makeUIViewController(context: Context) -> UIViewController {
        navDelegate.viewModel = viewModel
        navigationViewController.delegate = navDelegate
        navigationViewController.automaticallyAdjustsStyleForTimeOfDay = false
        navigationViewController.floatingButtons?.first?.addTarget(self, action: #selector(Coordinator.handleSearch(_:)), for: .touchUpInside)
        
        return navigationViewController
    }
    
    func handleSearch() {
        viewModel.isDynamicSearchMode = true
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        navDelegate.viewModel = viewModel
        navigationViewController.delegate = navDelegate
        navigationViewController.floatingButtons?.first?.addAction(UIAction(handler: { action in
            viewModel.isDynamicSearchMode = true
        }), for: .touchUpInside)
    }
    
    class NavDelegate: NavigationViewControllerDelegate {
        
        var viewModel: TrimbleMapsMapView.MapViewModel! = nil
        
        func navigationViewControllerDidDismiss(_ navigationViewController: NavigationViewController, byCanceling canceled: Bool) {
            // Perform last trip update before ending navigation
            if canceled {
                self.viewModel.tripPreviewViewModel.trip.status = .Canceled
            }
            endNavigation(navigationViewController: navigationViewController)
        }
        
        func endNavigation(navigationViewController: NavigationViewController) {
            navigationViewController.navigationService.stop()
            viewModel.isNaviagtionEnded = true
            navigationViewController.dismiss(animated: true) {
                // Capture the last location before resetting
                var origin = self.viewModel.tripPreviewViewModel.trip.lastRawLocation
                if origin == nil, let routeOrigin = self.viewModel.routeOrigin {
                    origin = CLLocation(latitude: routeOrigin.latitude, longitude: routeOrigin.longitude)
                }

                // Reset the view model and update origin
                self.viewModel.reset()
                if let originCoordinate = origin?.coordinate {
                    self.viewModel.routeOrigin = originCoordinate
                    self.viewModel.tripPreviewViewModel.trip.origin = origin
                }

                // Ensure navigationViewController is cleared
                self.viewModel.navigationViewController = nil
            }
        }
        
        func navigationViewControllerDidOpenTripPreview(_ navigationViewController: NavigationViewController) {
            viewModel.isDynamicTripPreview = true
        }
    }
}
