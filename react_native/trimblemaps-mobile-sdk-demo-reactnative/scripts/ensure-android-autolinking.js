const fs = require("node:fs");
const path = require("node:path");

const { loadLocalDependencies } = require("./ios-dependencies/local-config");
const { resolveInstalledPackageRoot } = require("./resolve-local-packages");

const TRIMBLE_PACKAGES = [
  "@trimblemaps/maps-react-native",
  "@trimblemaps/account-react-native",
  "@trimblemaps/plugins-react-native",
  "@trimblemaps/services-react-native",
];

module.exports = function ensureAndroidAutolinking(exampleAppRoot) {
  const workspaceRoot = path.join(exampleAppRoot, "..", "..");
  const autolinkingDir = path.join(
    exampleAppRoot,
    "android/build/generated/autolinking",
  );
  const autolinkingJson = path.join(autolinkingDir, "autolinking.json");

  if (!fs.existsSync(autolinkingJson)) {
    return;
  }

  const clearCache = (reason) => {
    fs.rmSync(autolinkingDir, { recursive: true, force: true });
    console.log(reason);
  };

  try {
    const config = JSON.parse(fs.readFileSync(autolinkingJson, "utf8"));
    const expectedRoot = path.resolve(exampleAppRoot);
    const cachedRoot = path.resolve(config.root ?? "");

    if (cachedRoot !== expectedRoot) {
      clearCache(
        `Cleared stale Android autolinking cache (was ${cachedRoot}, expected ${expectedRoot}).`,
      );
      return;
    }

    const searchPaths = [
      exampleAppRoot,
      workspaceRoot,
    ];
    const { config: localConfig } = loadLocalDependencies(workspaceRoot);
    const hasLocalOverrides = Object.keys(localConfig.packages ?? {}).length > 0;

    if (!hasLocalOverrides) {
      return;
    }

    for (const packageName of TRIMBLE_PACKAGES) {
      const cachedPackageRoot = path.resolve(
        config.dependencies?.[packageName]?.root ?? "",
      );
      const expectedPackageRoot = path.resolve(
        resolveInstalledPackageRoot(workspaceRoot, packageName, searchPaths),
      );

      if (cachedPackageRoot && cachedPackageRoot !== expectedPackageRoot) {
        clearCache(
          `Cleared stale Android autolinking cache for ${packageName} (was ${cachedPackageRoot}, expected ${expectedPackageRoot}).`,
        );
        return;
      }
    }
  } catch {
    clearCache("Cleared invalid Android autolinking cache.");
  }
};
