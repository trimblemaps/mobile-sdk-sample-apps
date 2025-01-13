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
            let terrainButton = addButton(title: "TERRAIN", action: #selector(terrainButtonPressed))
            let transportationButton = addButton(title: "TRANSPORTATION", action: #selector(transportationButtonPressed))
            let basicButton = addButton(title: "BASIC", action: #selector(basicButtonPressed))
            let dataDarkButton = addButton(title: "DATADARK", action: #selector(dataDarkButtonPressed))
            let dataLightButton = addButton(title: "DATALIGHT", action: #selector(dataLightButtonPressed))
            let defaultButton = addButton(title: "DEFAULT", action: #selector(defaultButtonPressed))
            let mobileDefaultButton = addButton(title: "MOBILE_DEFAULT", action: #selector(mobileDefaultButtonPressed))
            let satelliteButton = addButton(title: "SATELLITE", action: #selector(satelliteButtonPressed))
            
            NSLayoutConstraint.activate([
                satelliteButton.bottomAnchor.constraint(equalTo: mapView.bottomAnchor, constant: -10),
                satelliteButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                
                mobileDefaultButton.bottomAnchor.constraint(equalTo: satelliteButton.topAnchor, constant: -5),
                mobileDefaultButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                mobileDefaultButton.leadingAnchor.constraint(equalTo: satelliteButton.leadingAnchor, constant: 0),
                
                defaultButton.bottomAnchor.constraint(equalTo: mobileDefaultButton.topAnchor, constant: -5),
                defaultButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                defaultButton.leadingAnchor.constraint(equalTo: satelliteButton.leadingAnchor, constant: 0),
                
                dataLightButton.bottomAnchor.constraint(equalTo: defaultButton.topAnchor, constant: -5),
                dataLightButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                dataLightButton.leadingAnchor.constraint(equalTo: satelliteButton.leadingAnchor, constant: 0),
                
                dataDarkButton.bottomAnchor.constraint(equalTo: dataLightButton.topAnchor, constant: -5),
                dataDarkButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                dataDarkButton.leadingAnchor.constraint(equalTo: satelliteButton.leadingAnchor, constant: 0),
                
                basicButton.bottomAnchor.constraint(equalTo: dataDarkButton.topAnchor, constant: -5),
                basicButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                basicButton.leadingAnchor.constraint(equalTo: satelliteButton.leadingAnchor, constant: 0),
                
                transportationButton.bottomAnchor.constraint(equalTo: basicButton.topAnchor, constant: -5),
                transportationButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                transportationButton.leadingAnchor.constraint(equalTo: satelliteButton.leadingAnchor, constant: 0),
                
                terrainButton.bottomAnchor.constraint(equalTo: transportationButton.topAnchor, constant: -5),
                terrainButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                terrainButton.leadingAnchor.constraint(equalTo: satelliteButton.leadingAnchor, constant: 0),
                
                mobileSatelliteButton.bottomAnchor.constraint(equalTo: terrainButton.topAnchor, constant: -5),
                mobileSatelliteButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                mobileSatelliteButton.leadingAnchor.constraint(equalTo: satelliteButton.leadingAnchor, constant: 0),
                
                nightButton.bottomAnchor.constraint(equalTo: mobileSatelliteButton.topAnchor, constant: -5),
                nightButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                nightButton.leadingAnchor.constraint(equalTo: satelliteButton.leadingAnchor, constant: 0),
                
                dayButton.bottomAnchor.constraint(equalTo: nightButton.topAnchor, constant: -5),
                dayButton.trailingAnchor.constraint(equalTo: mapView.trailingAnchor, constant: -10),
                dayButton.leadingAnchor.constraint(equalTo: satelliteButton.leadingAnchor, constant: 0),
            ])
        }
    @objc func dayButtonPressed() {
        mapView.styleURL = TMGLStyle.mobileDayStyleURL
    }
    @objc func nightButtonPressed() {
        mapView.styleURL = TMGLStyle.mobileNightStyleURL
    }
    @objc func mobileSatelliteButtonPressed() {
        mapView.styleURL = TMGLStyle.mobileSatelliteStyleURL
    }
    
    @objc func terrainButtonPressed() {
        mapView.styleURL = TMGLStyle.terrainStyleURL
    }
    
    @objc func transportationButtonPressed() {
        mapView.styleURL = TMGLStyle.transportationStyleURL
    }
    
    @objc func basicButtonPressed() {
        mapView.styleURL = TMGLStyle.basicStyleURL
    }
    
    @objc func dataDarkButtonPressed() {
        mapView.styleURL = TMGLStyle.dataDarkStyleURL
    }
    
    @objc func dataLightButtonPressed() {
        mapView.styleURL = TMGLStyle.dataLightStyleURL
    }
    
    @objc func defaultButtonPressed() {
        mapView.styleURL = TMGLStyle.defaultStyleURL
    }
    
    @objc func mobileDefaultButtonPressed() {
        mapView.styleURL = TMGLStyle.mobileDefaultStyleURL
    }
    
    @objc func satelliteButtonPressed() {
        mapView.styleURL = TMGLStyle.satelliteStyleURL
    }
    
}

