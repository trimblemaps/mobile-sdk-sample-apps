import Foundation
import UIKit
import TrimbleMaps
import TrimbleMapsAccounts
import TrimbleMapsWebservicesClient

class AvoidFavorsViewController: UIViewController, AccountManagerDelegate {

    internal var mapView: TMGLMapView!
    internal var afSetIds: [Int] = []
    internal var assetAFSetIds: [Int] = []
    internal var selectedSetIds: [Int] = []
    internal var isAvoidFavorsVisible: Bool = false
    
    // Bottom buttons
    private var toggleAvoidFavorsButton: UIButton!
    private var filterBySetIdButton: UIButton!
    private var filterbyAssetAFsButton: UIButton!

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

                // Set the map location
                let center = CLLocationCoordinate2D(latitude: 39.987032, longitude: -105.105344)
                self.mapView.setCenter(center, zoomLevel: 13, animated: false)

                // Add the map
                self.view.addSubview(self.mapView)

                // Add the bottom buttons
                self.addBottomButtons()
                
                // Fetch avoid/favors set IDs after account is loaded
                self.fetchAvoidFavorSetIds()
            }
        }
    }

    func addBottomButtons() {
        // Create a container view for the buttons
        let buttonContainer = UIView()
        buttonContainer.translatesAutoresizingMaskIntoConstraints = false
        buttonContainer.backgroundColor = .clear
        self.view.addSubview(buttonContainer)
        
        // Toggle Avoid/Favors button
        toggleAvoidFavorsButton = UIButton(type: .system)
        toggleAvoidFavorsButton.setTitle("Show Avoid/Favors", for: .normal)
        toggleAvoidFavorsButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .semibold)
        toggleAvoidFavorsButton.backgroundColor = UIColor(red: 0.6, green: 0.2, blue: 0.8, alpha: 1.0)
        toggleAvoidFavorsButton.setTitleColor(.white, for: .normal)
        toggleAvoidFavorsButton.layer.cornerRadius = 8
        toggleAvoidFavorsButton.translatesAutoresizingMaskIntoConstraints = false
        toggleAvoidFavorsButton.addTarget(self, action: #selector(toggleAvoidFavorsPressed), for: .touchUpInside)
        buttonContainer.addSubview(toggleAvoidFavorsButton)
        
        // Filter by Set ID button
        filterBySetIdButton = UIButton(type: .system)
        filterBySetIdButton.setTitle("Filter by Set ID", for: .normal)
        filterBySetIdButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .semibold)
        filterBySetIdButton.backgroundColor = UIColor(red: 0.6, green: 0.2, blue: 0.8, alpha: 1.0)
        filterBySetIdButton.setTitleColor(.white, for: .normal)
        filterBySetIdButton.layer.cornerRadius = 8
        filterBySetIdButton.translatesAutoresizingMaskIntoConstraints = false
        filterBySetIdButton.addTarget(self, action: #selector(filterBySetIdPressed), for: .touchUpInside)
        buttonContainer.addSubview(filterBySetIdButton)
        
        // Filter by Asset AFs
        filterbyAssetAFsButton = UIButton(type: .system)
        filterbyAssetAFsButton.setTitle("Filter by Asset AFs", for: .normal)
        filterbyAssetAFsButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .semibold)
        filterbyAssetAFsButton.backgroundColor = UIColor(red: 0.6, green: 0.2, blue: 0.8, alpha: 1.0)
        filterbyAssetAFsButton.setTitleColor(.white, for: .normal)
        filterbyAssetAFsButton.layer.cornerRadius = 8
        filterbyAssetAFsButton.translatesAutoresizingMaskIntoConstraints = false
        filterbyAssetAFsButton.addTarget(self, action: #selector(filterByAssetAFsPressed), for: .touchUpInside)
        buttonContainer.addSubview(filterbyAssetAFsButton)
        
        // Layout constraints
        NSLayoutConstraint.activate([
            // Container constraints
            buttonContainer.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            buttonContainer.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            buttonContainer.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -16),
            buttonContainer.heightAnchor.constraint(equalToConstant: 166), // 50 + 8 spacing + 50 + 8 spacing + 50
            
            // Filter by Asset AFs button
            filterbyAssetAFsButton.trailingAnchor.constraint(equalTo: buttonContainer.trailingAnchor),
            filterbyAssetAFsButton.topAnchor.constraint(equalTo: buttonContainer.topAnchor),
            filterbyAssetAFsButton.heightAnchor.constraint(equalToConstant: 50),
            filterbyAssetAFsButton.widthAnchor.constraint(equalTo: buttonContainer.widthAnchor, multiplier: 0.5),
            
            // Filter button
            filterBySetIdButton.trailingAnchor.constraint(equalTo: buttonContainer.trailingAnchor),
            filterBySetIdButton.topAnchor.constraint(equalTo: filterbyAssetAFsButton.bottomAnchor, constant: 8),
            filterBySetIdButton.bottomAnchor.constraint(equalTo: toggleAvoidFavorsButton.topAnchor, constant: -8),
            filterBySetIdButton.heightAnchor.constraint(equalToConstant: 50),
            filterBySetIdButton.widthAnchor.constraint(equalTo: buttonContainer.widthAnchor, multiplier: 0.5),
            
            // Toggle button
            toggleAvoidFavorsButton.trailingAnchor.constraint(equalTo: buttonContainer.trailingAnchor),
            toggleAvoidFavorsButton.topAnchor.constraint(equalTo: filterBySetIdButton.bottomAnchor, constant: 8),
            toggleAvoidFavorsButton.bottomAnchor.constraint(equalTo: buttonContainer.bottomAnchor),
            toggleAvoidFavorsButton.widthAnchor.constraint(equalTo: buttonContainer.widthAnchor, multiplier: 0.5),
        ])
    }
    
    func fetchAvoidFavorSetIds() {
        let avoidFavorsClient = TMAvoidFavorsClient()
        let options = TMAvoidFavorsOptions(pageSize: 25, pageNumber: 0, key: AccountManager.default.account.apiKey)
        avoidFavorsClient.getAvoidFavorSets(options) { response, error in
            if let response = response, response.totalAFSetCount != 0 {
                DispatchQueue.main.async {
                    self.afSetIds = response.afSets?.map { $0.setID } ?? []
                    // Initially select all set IDs
                    self.selectedSetIds = self.afSetIds
                    print("Fetched \(self.afSetIds.count) Set IDs: \(self.afSetIds)")
                }
            } else {
                print("No avoid/favor sets found in response")
            }
        }
        let assetAvoidFavorsClient = TMAssetAvoidFavorsClient()
        assetAvoidFavorsClient.getAssetAvoidFavorSets(AccountManager.default.account.assetId!) { response, error in
            if let response = response, response.data?.isEmpty == false {
                DispatchQueue.main.async {
                    self.assetAFSetIds = response.data?.map { $0.setId } ?? []
                    print("Fetched \(self.assetAFSetIds.count) Asset AF Set IDs: \(self.assetAFSetIds)")
                }
            } else {
                print("No asset avoid/favor sets found in response")
            }
        }
    }
    
    @objc func toggleAvoidFavorsPressed() {
        isAvoidFavorsVisible.toggle()
        mapView.style?.toggleAvoidFavorsVisibility()
        
        let buttonTitle = isAvoidFavorsVisible ? "Hide Avoid/Favors" : "Show Avoid/Favors"
        toggleAvoidFavorsButton.setTitle(buttonTitle, for: .normal)
    }
    
    @objc func filterBySetIdPressed() {
        showSetIdSelectionDialog()
    }
    
    @objc func filterByAssetAFsPressed() {
        // Enable AF Layer if it is not currently visible
        if (!isAvoidFavorsVisible) {
            isAvoidFavorsVisible = true
            mapView.style?.setAvoidFavorsVisibility(true)
        }
        
        // Apply filter to only show AF Sets for the asset
        if (assetAFSetIds.isEmpty) {
            mapView.style?.setAvoidFavorsFilter([])
            print("No AFs associated with aset, showing all AFs in account")
        } else {
            mapView.style?.setAvoidFavorsFilter(assetAFSetIds as [NSNumber])
            selectedSetIds = assetAFSetIds
        }
    }
    
    func showSetIdSelectionDialog() {
        // Create the dialog view controller
        let dialogVC = SetIdSelectionViewController()
        dialogVC.availableSetIds = afSetIds
        dialogVC.selectedSetIds = selectedSetIds
        dialogVC.onUpdate = { [weak self] selectedIds in
            self?.selectedSetIds = selectedIds
            self?.mapView.style?.setAvoidFavorsVisibility(true)
            self?.mapView.style?.setAvoidFavorsFilter(selectedIds as [NSNumber])
        }
        
        // Present as a modal with custom presentation
        dialogVC.modalPresentationStyle = .overFullScreen
        dialogVC.modalTransitionStyle = .crossDissolve
        present(dialogVC, animated: true)
    }
    
    @objc func backButtonPressed() {
        dismiss(animated: true, completion: nil)
    }
}

// MARK: - Set ID Selection Dialog
class SetIdSelectionViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    var availableSetIds: [Int] = []
    var selectedSetIds: [Int] = []
    var onUpdate: (([Int]) -> Void)?
    
    private var dialogView: UIView!
    private var tableView: UITableView!
    private var titleLabel: UILabel!
    private var selectAllButton: UIButton!
    private var clearAllButton: UIButton!
    private var cancelButton: UIButton!
    private var updateButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Semi-transparent background
        view.backgroundColor = UIColor.black.withAlphaComponent(0.5)
        
        // Dialog container
        dialogView = UIView()
        dialogView.backgroundColor = .white
        dialogView.layer.cornerRadius = 12
        dialogView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(dialogView)
        
        // Title label
        titleLabel = UILabel()
        titleLabel.text = "Select Set IDs to Display"
        titleLabel.font = .systemFont(ofSize: 18, weight: .semibold)
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        dialogView.addSubview(titleLabel)
        
        // Select All button
        selectAllButton = UIButton(type: .system)
        selectAllButton.setTitle("Select All", for: .normal)
        selectAllButton.titleLabel?.font = .systemFont(ofSize: 14, weight: .semibold)
        selectAllButton.backgroundColor = UIColor(red: 0.6, green: 0.2, blue: 0.8, alpha: 1.0) // Purple
        selectAllButton.setTitleColor(.white, for: .normal)
        selectAllButton.layer.cornerRadius = 8
        selectAllButton.translatesAutoresizingMaskIntoConstraints = false
        selectAllButton.addTarget(self, action: #selector(selectAllPressed), for: .touchUpInside)
        dialogView.addSubview(selectAllButton)
        
        // Clear All button
        clearAllButton = UIButton(type: .system)
        clearAllButton.setTitle("Clear All", for: .normal)
        clearAllButton.titleLabel?.font = .systemFont(ofSize: 14, weight: .semibold)
        clearAllButton.backgroundColor = UIColor(red: 0.6, green: 0.2, blue: 0.8, alpha: 1.0) // Purple
        clearAllButton.setTitleColor(.white, for: .normal)
        clearAllButton.layer.cornerRadius = 8
        clearAllButton.translatesAutoresizingMaskIntoConstraints = false
        clearAllButton.addTarget(self, action: #selector(clearAllPressed), for: .touchUpInside)
        dialogView.addSubview(clearAllButton)
        
        // Table view for set IDs
        tableView = UITableView()
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(SetIdCell.self, forCellReuseIdentifier: "SetIdCell")
        tableView.translatesAutoresizingMaskIntoConstraints = false
        tableView.separatorStyle = .none
        dialogView.addSubview(tableView)
        
        // Cancel button
        cancelButton = UIButton(type: .system)
        cancelButton.setTitle("Cancel", for: .normal)
        cancelButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .semibold)
        cancelButton.backgroundColor = UIColor(red: 0.6, green: 0.2, blue: 0.8, alpha: 1.0) // Purple
        cancelButton.setTitleColor(.white, for: .normal)
        cancelButton.layer.cornerRadius = 8
        cancelButton.translatesAutoresizingMaskIntoConstraints = false
        cancelButton.addTarget(self, action: #selector(cancelPressed), for: .touchUpInside)
        dialogView.addSubview(cancelButton)
        
        // Update button
        updateButton = UIButton(type: .system)
        updateButton.setTitle("Update", for: .normal)
        updateButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .semibold)
        updateButton.backgroundColor = UIColor(red: 0.6, green: 0.2, blue: 0.8, alpha: 1.0) // Purple
        updateButton.setTitleColor(.white, for: .normal)
        updateButton.layer.cornerRadius = 8
        updateButton.translatesAutoresizingMaskIntoConstraints = false
        updateButton.addTarget(self, action: #selector(updatePressed), for: .touchUpInside)
        dialogView.addSubview(updateButton)
        
        setupConstraints()
        
        // Tap outside to dismiss
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(backgroundTapped))
        tapGesture.cancelsTouchesInView = false
        view.addGestureRecognizer(tapGesture)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // Reload table data when view appears
        tableView.reloadData()
    }
    
    func setupConstraints() {
        NSLayoutConstraint.activate([
            // Dialog view - centered with some padding
            dialogView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            dialogView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            dialogView.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: 0.85),
            dialogView.heightAnchor.constraint(equalToConstant: 500),
            
            // Title
            titleLabel.topAnchor.constraint(equalTo: dialogView.topAnchor, constant: 20),
            titleLabel.leadingAnchor.constraint(equalTo: dialogView.leadingAnchor, constant: 16),
            titleLabel.trailingAnchor.constraint(equalTo: dialogView.trailingAnchor, constant: -16),
            
            // Select All button
            selectAllButton.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 16),
            selectAllButton.leadingAnchor.constraint(equalTo: dialogView.leadingAnchor, constant: 16),
            selectAllButton.trailingAnchor.constraint(equalTo: dialogView.centerXAnchor, constant: -8),
            selectAllButton.heightAnchor.constraint(equalToConstant: 44),
            
            // Clear All button
            clearAllButton.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 16),
            clearAllButton.leadingAnchor.constraint(equalTo: dialogView.centerXAnchor, constant: 8),
            clearAllButton.trailingAnchor.constraint(equalTo: dialogView.trailingAnchor, constant: -16),
            clearAllButton.heightAnchor.constraint(equalToConstant: 44),
            
            // Table view
            tableView.topAnchor.constraint(equalTo: selectAllButton.bottomAnchor, constant: 16),
            tableView.leadingAnchor.constraint(equalTo: dialogView.leadingAnchor, constant: 16),
            tableView.trailingAnchor.constraint(equalTo: dialogView.trailingAnchor, constant: -16),
            tableView.bottomAnchor.constraint(equalTo: cancelButton.topAnchor, constant: -16),
            
            // Cancel button
            cancelButton.bottomAnchor.constraint(equalTo: dialogView.bottomAnchor, constant: -16),
            cancelButton.leadingAnchor.constraint(equalTo: dialogView.leadingAnchor, constant: 16),
            cancelButton.trailingAnchor.constraint(equalTo: dialogView.centerXAnchor, constant: -8),
            cancelButton.heightAnchor.constraint(equalToConstant: 44),
            
            // Update button
            updateButton.bottomAnchor.constraint(equalTo: dialogView.bottomAnchor, constant: -16),
            updateButton.leadingAnchor.constraint(equalTo: dialogView.centerXAnchor, constant: 8),
            updateButton.trailingAnchor.constraint(equalTo: dialogView.trailingAnchor, constant: -16),
            updateButton.heightAnchor.constraint(equalToConstant: 44),
        ])
    }
    
    // MARK: - UITableView DataSource
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return availableSetIds.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "SetIdCell", for: indexPath) as! SetIdCell
        let setId = availableSetIds[indexPath.row]
        let isSelected = selectedSetIds.contains(setId)
        cell.configure(with: setId, isSelected: isSelected)
        return cell
    }
    
    // MARK: - UITableView Delegate
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let setId = availableSetIds[indexPath.row]
        
        if let index = selectedSetIds.firstIndex(of: setId) {
            selectedSetIds.remove(at: index)
        } else {
            selectedSetIds.append(setId)
        }
        
        tableView.reloadRows(at: [indexPath], with: .none)
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 50
    }
    
    // MARK: - Actions
    @objc func selectAllPressed() {
        selectedSetIds = availableSetIds
        tableView.reloadData()
    }
    
    @objc func clearAllPressed() {
        selectedSetIds.removeAll()
        tableView.reloadData()
    }
    
    @objc func cancelPressed() {
        dismiss(animated: true)
    }
    
    @objc func updatePressed() {
        onUpdate?(selectedSetIds)
        dismiss(animated: true)
    }
    
    @objc func backgroundTapped(_ gesture: UITapGestureRecognizer) {
        let location = gesture.location(in: view)
        if !dialogView.frame.contains(location) {
            dismiss(animated: true)
        }
    }
}

// MARK: - Set ID Table Cell
class SetIdCell: UITableViewCell {
    
    private var checkboxImageView: UIImageView!
    private var setIdLabel: UILabel!
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupViews()
        selectionStyle = .none
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupViews() {
        // Checkbox
        checkboxImageView = UIImageView()
        checkboxImageView.contentMode = .scaleAspectFit
        checkboxImageView.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(checkboxImageView)
        
        // Set ID Label
        setIdLabel = UILabel()
        setIdLabel.font = .systemFont(ofSize: 16)
        setIdLabel.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(setIdLabel)
        
        NSLayoutConstraint.activate([
            checkboxImageView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 8),
            checkboxImageView.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            checkboxImageView.widthAnchor.constraint(equalToConstant: 24),
            checkboxImageView.heightAnchor.constraint(equalToConstant: 24),
            
            setIdLabel.leadingAnchor.constraint(equalTo: checkboxImageView.trailingAnchor, constant: 12),
            setIdLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -8),
            setIdLabel.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
        ])
    }
    
    func configure(with setId: Int, isSelected: Bool) {
        setIdLabel.text = "Set ID: \(setId)"
        
        if isSelected {
            checkboxImageView.image = createCheckboxImage(checked: true)
        } else {
            checkboxImageView.image = createCheckboxImage(checked: false)
        }
    }
    
    private func createCheckboxImage(checked: Bool) -> UIImage? {
        let size = CGSize(width: 24, height: 24)
        let renderer = UIGraphicsImageRenderer(size: size)
        
        return renderer.image { context in
            let rect = CGRect(origin: .zero, size: size)
            let checkboxRect = rect.insetBy(dx: 2, dy: 2)
            
            if checked {
                UIColor(red: 0.0, green: 0.8, blue: 0.8, alpha: 1.0).setFill()
                UIBezierPath(roundedRect: checkboxRect, cornerRadius: 3).fill()
                
                // White checkmark
                UIColor.white.setStroke()
                let checkPath = UIBezierPath()
                checkPath.lineWidth = 2
                checkPath.lineCapStyle = .round
                checkPath.lineJoinStyle = .round
                
                checkPath.move(to: CGPoint(x: 6, y: 12))
                checkPath.addLine(to: CGPoint(x: 10, y: 16))
                checkPath.addLine(to: CGPoint(x: 18, y: 8))
                checkPath.stroke()
            } else {
                // Gray border for unchecked
                UIColor.lightGray.setStroke()
                let borderPath = UIBezierPath(roundedRect: checkboxRect, cornerRadius: 3)
                borderPath.lineWidth = 2
                borderPath.stroke()
            }
        }
    }
}
