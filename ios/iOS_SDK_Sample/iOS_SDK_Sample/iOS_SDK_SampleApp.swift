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
        var apiKey: String = "Your-API-Key"
        
        
        AccountManager.default.delegate = delegate
        let account: Account = Account(apiKey: apiKey,
                                       region: region)
        
        AccountManager.default.account = account
    }
    
    class AccountDelegate: AccountManagerDelegate, ObservableObject {
        @Published var initialized = false

        func stateChanged(newStatus: AccountManagerState) {
            
            if newStatus == .loaded {
                DispatchQueue.main.async {
                    self.initialized = true
                }
            }
        }
    }
}

