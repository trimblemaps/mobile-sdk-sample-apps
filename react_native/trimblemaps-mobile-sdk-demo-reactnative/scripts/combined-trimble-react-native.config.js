const fs = require("node:fs");
const path = require("node:path");

const {
  resolveInstalledPackageRoot,
} = require("./resolve-local-packages");
const { loadLocalDependencies } = require("./ios-dependencies/local-config");

const TRIMBLE_PACKAGES = [
  "@trimblemaps/maps-react-native",
  "@trimblemaps/account-react-native",
  "@trimblemaps/plugins-react-native",
  "@trimblemaps/services-react-native",
];

/**
 * Autolinking config for apps that combine maps, plugins, account, and services.
 *
 * - reactNativePath prefers the app workspace install, then falls back to a
 *   hoisted workspace-root install when present.
 * - Trimble package roots are overridden only when local-dependencies.json is
 *   present; otherwise CocoaPods/Metro resolve published npm installs normally.
 * - Services iOS autolinking is disabled because its vendored XCFrameworks overlap
 *   with maps/plugins; the app Podfile adds TrimbleMapsServicesReactNative manually.
 */
module.exports = function createCombinedTrimbleReactNativeConfig(appDir) {
  const workspaceRoot = path.join(appDir, "..", "..");
  const searchPaths = [
    appDir,
    workspaceRoot,
  ];
  const { config: localConfig } = loadLocalDependencies(workspaceRoot);
  const hasLocalPackageOverrides =
    Object.keys(localConfig.packages ?? {}).length > 0;

  const reactNativeCandidates = [
    path.join(appDir, "node_modules/react-native"),
    path.join(workspaceRoot, "node_modules/react-native"),
  ];
  const reactNativePath = reactNativeCandidates.find((candidate) =>
    fs.existsSync(path.join(candidate, "package.json")),
  );
  if (!reactNativePath) {
    throw new Error(
      `Unable to find react-native under ${reactNativeCandidates.join(" or ")}. Run yarn install from the repo root.`,
    );
  }

  const dependencies = {
    "@trimblemaps/services-react-native": {
      platforms: {
        ios: null,
        android: {},
      },
    },
  };

  if (hasLocalPackageOverrides) {
    for (const packageName of TRIMBLE_PACKAGES) {
      if (packageName === "@trimblemaps/services-react-native") {
        dependencies[packageName] = {
          root: resolveInstalledPackageRoot(
            workspaceRoot,
            packageName,
            searchPaths,
          ),
          platforms: {
            ios: null,
            android: {},
          },
        };
        continue;
      }

      dependencies[packageName] = {
        root: resolveInstalledPackageRoot(
          workspaceRoot,
          packageName,
          searchPaths,
        ),
        platforms: {
          ios: {},
          android: {},
        },
      };
    }
  }

  return {
    reactNativePath,
    project: {
      ios: {
        automaticPodsInstallation: true,
      },
    },
    dependencies,
  };
};
