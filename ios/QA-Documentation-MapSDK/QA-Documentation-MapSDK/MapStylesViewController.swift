import Foundation
import UIKit
import TrimbleMaps
import TrimbleMapsAccounts

class MapStylesViewController : UIViewController, AccountManagerDelegate {
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
                    // Set the map location
                    let center = CLLocationCoordinate2D(latitude: 40.7584766, longitude: -73.9840227)
                    self.mapView.setCenter(center, zoomLevel: 13, animated: false)
                    // Add the map
                    self.view.addSubview(self.mapView)
                    // Add the style buttons
                    self.addStyleButtons()
                }
            }
        } else {
            // Handle the case where the account is not licensed for Maps SDK
            print("Account is not licensed for Maps SDK")
        }
    }
    private func addButton(title: String, action: Selector) -> UIButton {
        let button = UIButton()
        button.setTitle(title, for: .normal)
        button.titleLabel?.font = .systemFont(ofSize: 12)
        button.contentEdgeInsets = UIEdgeInsets(top: 10, left: 10, bottom: 10, right: 10)
        button.backgroundColor = .gray
        button.layer.borderColor = UIColor.black.cgColor
        button.layer.borderWidth = 0.5
        button.layer.cornerRadius = 10.0
        button.addTarget(self, action: action, for: .touchUpInside)
        button.translatesAutoresizingMaskIntoConstraints = false
        self.mapView.addSubview(button)
        return button
    }
    func addStyleButtons() {
            let dayButton = addButton(title: "MOBILE_DAY", action: #selector(dayButtonPressed))
            let nightButton = addButton(title: "MOBILE_NIGHT", action: #selector(nightButtonPressed))
            let mobileSatelliteButton = addButton(title: "MOBILE_SATELLITE", action: #selector(mobileSatelliteButtonPressed))
            
            NSLayoutConstraint.activate([
                mobileSatelliteButton.bottomAnchor.constraint(equalTo: mapView.bottomAnchor, constant: -5),
                mobileSatelliteButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                
                nightButton.bottomAnchor.constraint(equalTo: mobileSatelliteButton.topAnchor, constant: -5),
                nightButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                nightButton.leadingAnchor.constraint(equalTo: mobileSatelliteButton.leadingAnchor, constant: 0),
                
                dayButton.bottomAnchor.constraint(equalTo: nightButton.topAnchor, constant: -5),
                dayButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                dayButton.leadingAnchor.constraint(equalTo: mobileSatelliteButton.leadingAnchor, constant: 0),
            ])
        }
    @objc func dayButtonPressed() {
        mapView.styleURL = TMGLTrimbleMobileStyle.mobileDayStyleURL
    }
    @objc func nightButtonPressed() {
        mapView.styleURL = TMGLTrimbleMobileStyle.mobileNightStyleURL
    }
    @objc func mobileSatelliteButtonPressed() {
        mapView.styleURL = TMGLTrimbleMobileStyle.mobileSatelliteStyleURL
    }  
}

