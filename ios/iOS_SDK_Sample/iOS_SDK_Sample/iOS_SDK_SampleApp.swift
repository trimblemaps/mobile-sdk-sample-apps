import SwiftUI
import TrimbleMapsAccounts

@main
struct iOS_SDK_SampleApp: App {
    var isInitialized = false
    @ObservedObject var delegate = AccountDelegate()

    var body: some Scene {
        WindowGroup {
            if delegate.initialized {
                ContentView() // Show ContentView once initialization is complete
            } else {
                ProgressView("Initializing...") // Show a loading indicator during initialization
                    .onAppear {
                        initialize()
                    }
            }
        }
    }
    
    func initialize() {
        let region: Region = .northAmerica
        let apiEnvironment: APIEnvironment = .production
        var apiKey: String = "Your-API-Key"
        var assetId: String = "Your-Asset-ID"
        var companyId: String = "Your-Company-ID"
        var externalAccountId: String = "Your-External-Account-ID"
        var partnerId: String = "Your-Partner-ID"
        var vehicleId: String = "Your-Vehicle-ID"
        var driverId: String = "Your-Driver-ID"
        var deviceId: String = "Your-Device-ID"
        
        AccountManager.default.delegate = delegate
        let account: Account = Account(apiKey: apiKey,
                                       region: region,
                                       apiEnvironment: apiEnvironment,
                                       assetId: assetId,
                                       companyId: companyId,
                                       externalAccountId: externalAccountId,
                                       partnerId: partnerId,
                                       vehicleId: vehicleId,
                                       driverId: driverId,
                                       deviceId: deviceId)
        
        AccountManager.default.account = account
    }
    
    class AccountDelegate: AccountManagerDelegate, ObservableObject {
        @Published var initialized = false

        func stateChanged(newStatus: AccountManagerState) {
            if AccountManager.default.isLicensed(licensedFeature: .navigationSdk) {
                if newStatus == .loaded {
                    DispatchQueue.main.async {
                        self.initialized = true
                    }
                }
            } else {
				// Handle the case where the account is not licensed for Navigation SDK
				print("Account is not licensed for Navigation SDK")
            }
        }
    }
}

