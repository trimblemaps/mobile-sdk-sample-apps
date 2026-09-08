# Trimble Maps React Native — Maps SDK Demo

React Native sample app demonstrating **16** Trimble Maps SDK features using published `@trimblemaps/*` packages. This replaces the legacy `RNMapsSampleApp` that used `NativeModules` and a monolithic native bridge.

Built on **React Native 0.85**, New Architecture, TypeScript.

| | |
|---|---|
| Bundle ID | `com.trimblemaps.reactnative.documentation` |


## Requirements

- Node 20+
- Yarn 4 (`corepack enable`)
- Android SDK
- iOS (optional): Xcode, Carthage, Ruby/Bundler for CocoaPods
- Trimble Maps API key

## Credentials (repo root)

The API key is configured **once at the repository root** — the app under `apps/documentation-sdk` contains no credential files.

`@trimblemaps/*` npm packages and Android Maven artifacts resolve from the public Trimble JFrog registry (`trimblemaps.jfrog.io`). No Artifactory login is required for `yarn install` or Android builds. iOS Carthage binaries use the same public host (see `apps/documentation-sdk/Cartfile`).

**Do not commit** `trimble.config.local.js` or generated `TrimbleMapsSecrets.plist`.

### Trimble Maps API key

```bash
export TRIMBLE_MAPS_API_KEY=your_key
```

Or create a gitignored local override:

```bash
cp trimble.config.example.js trimble.config.local.js
# set apiKey in trimble.config.local.js
```

`yarn ios:setup` writes `TrimbleMapsSecrets.plist` from this key (plist is gitignored).

## Install

```bash
yarn install
```

## Run

### Android

```bash
yarn start          # Metro in one terminal
yarn android        # build and launch
```

### iOS (first time)

```bash
yarn ios:setup      # Carthage + CocoaPods + secrets plist
yarn start
yarn ios
```

## Sample screens (16)

1. Basic Map  
2. Data Driven Styling  
3. Dots On A Map  
4. Geocoding  
5. Lines On A Map  
6. Simple Routing  
7. Tracking / Follow Me  
8. Trimble Layers  
9. Map Styles  
10. Reverse Geocoding  
11. Symbols On A Map  
12. Fill Polygon On A Map  
13. Frame Locations  
14. Clickable Points  
15. Location Cycling  
16. Avoid Favors  

## Repository layout

```
apps/documentation-sdk/   # React Native app (16 samples)
scripts/                  # Metro, Cartfile, credential loader
.yarnrc.yml               # public @trimblemaps npm scope
trimble.config.example.js # API key template
```
