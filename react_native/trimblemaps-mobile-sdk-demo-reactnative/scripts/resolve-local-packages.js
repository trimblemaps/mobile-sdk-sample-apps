const fs = require("fs");
const { createRequire } = require("module");
const path = require("path");

const { resolvePackageRoot } = require("./ios-dependencies/local-config");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildExtraNodeModules(repoRoot, packageNames, searchPaths) {
  const extraNodeModules = {};
  for (const packageName of packageNames) {
    const packageRoot = resolvePackageRoot(repoRoot, packageName, searchPaths);
    if (packageRoot) {
      extraNodeModules[packageName] = packageRoot;
    }
  }
  return extraNodeModules;
}

function collectPeerDependencyNames(packageRoot) {
  const packageJsonPath = path.join(packageRoot, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return [];
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  return packageJson.peerDependencies
    ? Object.keys(packageJson.peerDependencies)
    : [];
}

function resolveDependencyDir(fromDir, moduleName) {
  const packageJsonPath = path.join(fromDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  try {
    const require = createRequire(packageJsonPath);
    return path.dirname(require.resolve(`${moduleName}/package.json`));
  } catch {
    return null;
  }
}

/**
 * Pin shared runtime deps to the example app / monorepo root and block nested
 * copies inside local package overrides (prevents duplicate React instances).
 */
function buildLocalPackageMetroConfig({
  project,
  repoRoot,
  localPackagePaths,
}) {
  const peerNames = new Set([
    "react",
    "react-native",
    // Babel injects these when bundling local package source (see "source" export).
    "@babel/runtime",
  ]);

  for (const packageRoot of localPackagePaths) {
    for (const peerName of collectPeerDependencyNames(packageRoot)) {
      peerNames.add(peerName);
    }
  }

  const pinnedNodeModules = {};
  for (const moduleName of peerNames) {
    const resolvedDir =
      resolveDependencyDir(project, moduleName) ??
      resolveDependencyDir(repoRoot, moduleName);

    if (resolvedDir) {
      pinnedNodeModules[moduleName] = resolvedDir;
    }
  }

  const blockList = [];
  for (const packageRoot of localPackagePaths) {
    for (const moduleName of peerNames) {
      const nestedPath = path.join(packageRoot, "node_modules", moduleName);
      if (!fs.existsSync(nestedPath)) {
        continue;
      }

      if (!pinnedNodeModules[moduleName]) {
        continue;
      }

      if (pinnedNodeModules[moduleName] === nestedPath) {
        continue;
      }

      blockList.push(new RegExp(`^${escapeRegex(nestedPath)}[\\/\\\\]`));
    }
  }

  return { pinnedNodeModules, blockList };
}

function resolveInstalledPackageRoot(repoRoot, packageName, searchPaths) {
  const override = resolvePackageRoot(repoRoot, packageName, searchPaths);
  if (override) {
    return override;
  }

  for (const searchPath of searchPaths) {
    try {
      const packageJsonPath = require.resolve(`${packageName}/package.json`, {
        paths: [searchPath],
      });
      return path.dirname(packageJsonPath);
    } catch {
      // continue
    }
  }

  throw new Error(`Unable to resolve ${packageName}`);
}

module.exports = {
  buildExtraNodeModules,
  buildLocalPackageMetroConfig,
  resolveInstalledPackageRoot,
};
