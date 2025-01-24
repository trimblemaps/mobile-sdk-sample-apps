import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white

        let scrollView = UIScrollView()
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)

        let stackView = UIStackView()
        stackView.axis = .vertical
        stackView.spacing = 30
        stackView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(stackView)

        let titleLabel = UILabel()
        titleLabel.text = "QA Documentation Maps SDK"
        titleLabel.font = UIFont.boldSystemFont(ofSize: 18.0)
        titleLabel.textColor = .black
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        stackView.addArrangedSubview(titleLabel)

        let buttons = [
            addButton(image: "van_nav_splash", title: "Basic Map", action: #selector(basicMapButtonTapped)),
            addButton(image: "general_splash", title: "Map Styles", action: #selector(mapStylesButtonTapped)),
            addButton(image: "van_nav_splash", title: "Geocoding", action: #selector(geocodingButtonTapped)),
            addButton(image: "general_splash", title: "Simple Route", action: #selector(simpleRoutingButtonTapped)),
            addButton(image: "van_nav_splash", title: "Tracking", action: #selector(trackingButtonTapped)),
            addButton(image: "general_splash", title: "Trimble Layers", action: #selector(trimbleLayersButtonTapped)),
            addButton(image: "van_nav_splash", title: "Data Driven Styling", action: #selector(dataDrivenStylingButtonTapped)),
            addButton(image: "general_splash", title: "Dots On a Map", action: #selector(dotsOnAMapButtonTapped)),
            addButton(image: "van_nav_splash", title: "Lines On a Map", action: #selector(linesOnAMapButtonTapped)),
            addButton(image: "general_splash", title: "Sample Framing", action: #selector(sampleFramingButtonTapped))
        ]

        for button in buttons {
            stackView.addArrangedSubview(button)
        }

        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: view.frame.width * 0.05), // 5% of the screen width from the leading edge
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -view.frame.width * 0.05), // 5% of the screen width from the trailing edge
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            stackView.topAnchor.constraint(equalTo: scrollView.topAnchor, constant: 20),
            stackView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor, constant: 20),
            stackView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor, constant: -20),
            stackView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor)
        ])


    }

    private func addButton(image: String, title: String, action: Selector) -> UIButton {
        let button = UIButton(type: .custom)
        button.setTitle(title, for: .normal)
        button.titleLabel?.font = UIFont.systemFont(ofSize: 26.0)

        // Set background image from xcassets and resize it
        if let originalImage = UIImage(named: image) {
            let resizedImage = originalImage.resizableImage(withCapInsets: UIEdgeInsets(top: 0, left: 10, bottom: 0, right: 10), resizingMode: .stretch)
            button.setBackgroundImage(resizedImage, for: .normal)
        }

        // Set content mode of the button's image view
        button.imageView?.contentMode = .scaleAspectFit

        button.addTarget(self, action: action, for: .touchUpInside)
        return button
    }

    @objc func basicMapButtonTapped(_ sender: UIButton) {
        let basicMapViewController = BasicMapViewController()
        let navigationController = UINavigationController(rootViewController: basicMapViewController)
        navigationController.modalPresentationStyle = .fullScreen
        present(navigationController, animated: true, completion: nil)
    }
    
    @objc func geocodingButtonTapped(_ sender: UIButton) {
        let geocodingViewController = GeocodingViewController()
        let navigationController = UINavigationController(rootViewController: geocodingViewController)
        navigationController.modalPresentationStyle = .fullScreen
        present(navigationController, animated: true, completion: nil)
    }
    
    @objc func mapStylesButtonTapped(_ sender: UIButton) {
        let mapStylesViewController = MapStylesViewController()
        let navigationController = UINavigationController(rootViewController: mapStylesViewController)
        navigationController.modalPresentationStyle = .fullScreen
        present(navigationController, animated: true, completion: nil)
    }
    
    @objc func simpleRoutingButtonTapped(_ sender: UIButton) {
        let simpleRoutingViewController = SimpleRoutingViewController()
        let navigationController = UINavigationController(rootViewController: simpleRoutingViewController)
        navigationController.modalPresentationStyle = .fullScreen
        present(navigationController, animated: true, completion: nil)
    }
    
    @objc func trackingButtonTapped(_ sender: UIButton) {
        let trackingViewController = TrackingViewController()
        let navigationController = UINavigationController(rootViewController: trackingViewController)
        navigationController.modalPresentationStyle = .fullScreen
        present(navigationController, animated: true, completion: nil)
    }
    
    @objc func trimbleLayersButtonTapped(_ sender: UIButton) {
        let trimbleLayersViewController = TrimbleLayersViewController()
        let navigationController = UINavigationController(rootViewController: trimbleLayersViewController)
        navigationController.modalPresentationStyle = .fullScreen
        present(navigationController, animated: true, completion: nil)
    }
    
    @objc func dataDrivenStylingButtonTapped(_ sender: UIButton) {
        let dataDrivenStylingViewController = DataDrivenStylingViewController()
        let navigationController = UINavigationController(rootViewController: dataDrivenStylingViewController)
        navigationController.modalPresentationStyle = .fullScreen
        present(navigationController, animated: true, completion: nil)
    }
    
    @objc func dotsOnAMapButtonTapped(_ sender: UIButton) {
        let dotsOnAMapButtonViewController = DotsOnAMapViewController()
        let navigationController = UINavigationController(rootViewController: dotsOnAMapButtonViewController)
        navigationController.modalPresentationStyle = .fullScreen
        present(navigationController, animated: true, completion: nil)
    }
    
    @objc func linesOnAMapButtonTapped(_ sender: UIButton) {
        let linesOnAMapButtonViewController = LinesOnAMapViewController()
        let navigationController = UINavigationController(rootViewController: linesOnAMapButtonViewController)
        navigationController.modalPresentationStyle = .fullScreen
        present(navigationController, animated: true, completion: nil)
    }
    
    @objc func sampleFramingButtonTapped(_ sender: UIButton) {
        let sampleFramingButtonViewController = SampleFramingViewController()
        let navigationController = UINavigationController(rootViewController: sampleFramingButtonViewController)
        navigationController.modalPresentationStyle = .fullScreen
        present(navigationController, animated: true, completion: nil)
    }
}


