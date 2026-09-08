const fs = require("fs");
const path = require("path");

const DEFAULT_FILENAME = "local-dependencies.json";
const EXAMPLE_FILENAME = "local-dependencies.example.json";

function resolveConfigPath(repoRoot) {
  const envPath = process.env.TRIMBLE_LOCAL_DEPENDENCIES;
  if (envPath) {
    return path.isAbsolute(envPath) ? envPath : path.join(repoRoot, envPath);
  }
  return path.join(repoRoot, DEFAULT_FILENAME);
}

function loadLocalDependencies(repoRoot) {
  const configPath = resolveConfigPath(repoRoot);
  if (!fs.existsSync(configPath)) {
    return { configPath, config: { packages: {}, frameworks: {} } };
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    throw new Error(`Failed to parse ${configPath}: ${error.message}`);
  }

  return {
    configPath,
    config: {
      packages: parsed.packages ?? {},
      frameworks: parsed.frameworks ?? {},
    },
  };
}

function resolvePackageRoot(repoRoot, packageName, searchPaths = []) {
  const { config } = loadLocalDependencies(repoRoot);
  const override = config.packages[packageName];
  if (override) {
    const resolved = path.isAbsolute(override)
      ? override
      : path.join(repoRoot, override);
    if (!fs.existsSync(path.join(resolved, "package.json"))) {
      throw new Error(
        `Local package override for ${packageName} is invalid: ${resolved}`,
      );
    }
    return resolved;
  }

  for (const searchPath of searchPaths) {
    const candidate = path.join(searchPath, "node_modules", packageName);
    if (fs.existsSync(path.join(candidate, "package.json"))) {
      return candidate;
    }
  }

  return null;
}

function resolveFrameworkSource(repoRoot, frameworkName, carthageBuild) {
  const { config } = loadLocalDependencies(repoRoot);
  const override = config.frameworks[frameworkName];
  if (override) {
    const resolved = path.isAbsolute(override)
      ? override
      : path.join(repoRoot, override);
    const frameworkPath = resolved.endsWith(".xcframework")
      ? resolved
      : path.join(resolved, frameworkName);
    if (!fs.existsSync(frameworkPath)) {
      throw new Error(
        `Local framework override for ${frameworkName} is invalid: ${frameworkPath}`,
      );
    }
    return frameworkPath;
  }

  const carthagePath = path.join(carthageBuild, frameworkName);
  if (!fs.existsSync(carthagePath)) {
    throw new Error(
      `Missing ${frameworkName} in ${carthageBuild}. Run carthage bootstrap first.`,
    );
  }
  return carthagePath;
}

module.exports = {
  DEFAULT_FILENAME,
  EXAMPLE_FILENAME,
  loadLocalDependencies,
  resolvePackageRoot,
  resolveFrameworkSource,
};
