const fs = require("fs");
const path = require("path");

const REPO_PACKAGE_NAME = "trimblemaps-react-native-mobile-sdk-demo";

function findRepoRoot(startDir = __dirname) {
  let dir = path.resolve(startDir);
  const { root } = path.parse(dir);

  while (dir !== root) {
    const packageJsonPath = path.join(dir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const pkg = require(packageJsonPath);
      if (pkg.name === REPO_PACKAGE_NAME) {
        return dir;
      }
    }
    dir = path.dirname(dir);
  }

  throw new Error(
    `Could not find ${REPO_PACKAGE_NAME} repo root from ${startDir}`,
  );
}

function loadTrimbleConfig() {
  const repoRoot = findRepoRoot();
  let apiKey = process.env.TRIMBLE_MAPS_API_KEY;

  if (!apiKey) {
    try {
      const local = require(path.join(repoRoot, "trimble.config.local.js"));
      apiKey = local.apiKey;
    } catch {
      // optional gitignored override
    }
  }

  if (!apiKey) {
    throw new Error(
      "Missing Trimble Maps API key. Set TRIMBLE_MAPS_API_KEY or create trimble.config.local.js at the repo root (see trimble.config.example.js).",
    );
  }

  return { apiKey };
}

module.exports = loadTrimbleConfig;
module.exports.findRepoRoot = findRepoRoot;
