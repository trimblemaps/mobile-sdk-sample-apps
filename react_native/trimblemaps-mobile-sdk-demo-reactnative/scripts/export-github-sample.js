#!/usr/bin/env node
/**
 * Export a documentation-sdk-only tree for mobile-sdk-sample-apps.
 *
 * Usage:
 *   node scripts/export-github-sample.js [outputDir]
 *
 * Default output: ./github-publish/
 */
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const outputRoot = path.resolve(repoRoot, process.argv[2] ?? "github-publish");

const COPY_PATHS = [
  "apps/documentation-sdk",
  "scripts",
  ".yarn/releases",
  ".yarnrc.yml",
  "trimble.config.example.js",
  "local-dependencies.example.json",
  "yarn.lock",
  ".gitignore",
];

const SKIP_DIR_NAMES = new Set(["node_modules", "build", ".gradle", "Pods", "Carthage"]);

function rimraf(target) {
  if (!fs.existsSync(target)) {
    return;
  }
  fs.rmSync(target, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (SKIP_DIR_NAMES.has(path.basename(src))) {
      return;
    }
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function writeGithubPackageJson() {
  const pkg = {
    name: "trimblemaps-mobile-sdk-demo-reactnative",
    private: true,
    workspaces: ["apps/*"],
    scripts: {
      start: "yarn workspace documentation-sdk start",
      android: "yarn workspace documentation-sdk android",
      ios: "yarn workspace documentation-sdk ios",
      "ios:setup": "yarn workspace documentation-sdk ios:setup",
      lint: "yarn workspace documentation-sdk lint",
      postinstall: "node scripts/patch-react-native-gradle-plugin.js",
    },
    packageManager: "yarn@4.10.3",
  };
  fs.writeFileSync(
    path.join(outputRoot, "package.json"),
    `${JSON.stringify(pkg, null, 2)}\n`,
  );
}

function writeGithubGitignore() {
  const content = `node_modules
.yarn/*
!.yarn/releases
local-dependencies.json
.env
trimble.config.local.js
**/TrimbleMapsSecrets.plist
*.log
.DS_Store

apps/documentation-sdk/android/.gradle
apps/documentation-sdk/android/build
apps/documentation-sdk/android/app/build
apps/documentation-sdk/android/app/.cxx
apps/documentation-sdk/ios/Pods
apps/documentation-sdk/ios/build
apps/documentation-sdk/Carthage
apps/documentation-sdk/Cartfile.resolved
`;
  fs.writeFileSync(path.join(outputRoot, ".gitignore"), content);
}

function main() {
  rimraf(outputRoot);
  fs.mkdirSync(outputRoot, { recursive: true });

  for (const relativePath of COPY_PATHS) {
    const src = path.join(repoRoot, relativePath);
    if (!fs.existsSync(src)) {
      throw new Error(`Missing export source: ${relativePath}`);
    }
    copyRecursive(src, path.join(outputRoot, relativePath));
  }

  for (const docName of ["README.github.md", "MIGRATION.md"]) {
    fs.copyFileSync(
      path.join(repoRoot, docName),
      path.join(outputRoot, docName === "README.github.md" ? "README.md" : docName),
    );
  }

  writeGithubPackageJson();
  writeGithubGitignore();

  console.log(`Exported documentation-sdk sample to ${outputRoot}`);
}

main();
