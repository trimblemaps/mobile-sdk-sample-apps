#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const {
  resolveFrameworkSource,
  resolvePackageRoot,
} = require("../../../scripts/ios-dependencies/local-config");

const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "../..");
const carthageBuild = path.join(appRoot, "Carthage", "Build");
const searchPaths = [appRoot, repoRoot];

const mapsPackageRoot = resolvePackageRoot(
  repoRoot,
  "@trimblemaps/maps-react-native",
  searchPaths,
);
const accountPackageRoot = resolvePackageRoot(
  repoRoot,
  "@trimblemaps/account-react-native",
  searchPaths,
);
const pluginsPackageRoot = resolvePackageRoot(
  repoRoot,
  "@trimblemaps/plugins-react-native",
  searchPaths,
);

if (!mapsPackageRoot || !accountPackageRoot || !pluginsPackageRoot) {
  console.error(
    "Missing TrimbleMaps packages. Run yarn install from the repo root first.",
  );
  process.exit(1);
}

const mapsFrameworkTargets = [path.join(mapsPackageRoot, "ios/Frameworks")];
const accountFrameworkTargets = [path.join(accountPackageRoot, "ios/Frameworks")];
const pluginFrameworkTargets = [path.join(pluginsPackageRoot, "ios/Frameworks")];

const mapsFrameworks = [
  "TrimbleMaps.xcframework",
  "TrimbleMapsAccounts.xcframework",
  "TrimbleMapsMobileEvents.xcframework",
];
const pluginFrameworks = [
  "RoutePlugin.xcframework",
  "SearchUIPlugin.xcframework",
  "TrimbleMapsMultiplatformUI.xcframework",
  "TrimbleMapsWebservicesClient.xcframework",
  "Turf.xcframework",
  "Polyline.xcframework",
];

function uniqueDirs(dirs) {
  return [...new Set(dirs)];
}

function linkFramework(name, targetDir) {
  const source = resolveFrameworkSource(repoRoot, name, carthageBuild);
  const target = path.join(targetDir, name);
  try {
    const stat = fs.lstatSync(target);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(target);
    } else {
      fs.rmSync(target, { recursive: true, force: true });
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
  const relativeSource = path.relative(targetDir, source);
  fs.symlinkSync(relativeSource, target);
  console.log(`Linked ${target} -> ${relativeSource}`);
}

for (const dir of uniqueDirs(mapsFrameworkTargets)) {
  fs.mkdirSync(dir, { recursive: true });
  for (const name of mapsFrameworks) {
    linkFramework(name, dir);
  }
}

for (const dir of uniqueDirs(accountFrameworkTargets)) {
  fs.mkdirSync(dir, { recursive: true });
  linkFramework("TrimbleMapsAccounts.xcframework", dir);
}

for (const dir of uniqueDirs(pluginFrameworkTargets)) {
  fs.mkdirSync(dir, { recursive: true });
  for (const name of pluginFrameworks) {
    linkFramework(name, dir);
  }
}

const config = require("../../../scripts/load-trimble-config")();
const secretsPlistPath = path.join(
  appRoot,
  "ios/TrimbleMapsReactNativeExample/TrimbleMapsSecrets.plist",
);
const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>apiKey</key>
  <string>${config.apiKey}</string>
</dict>
</plist>
`;
fs.writeFileSync(secretsPlistPath, plist);
console.log(`Wrote ${secretsPlistPath}`);
