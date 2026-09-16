#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const {
  renderCartfile,
  resolvePackageCartfile,
  checkGeneratedCartfile,
} = require("./ios-dependencies/cartfile");

const repoRoot = path.resolve(__dirname, "..");
const appName = process.argv.find((arg) => arg.startsWith("--app="))?.slice(6)
  ?? process.env.DEMO_APP
  ?? "documentation-sdk";
const appRoot = path.join(repoRoot, "apps", appName);
const outputPath = path.join(appRoot, "Cartfile");
const checkOnly = process.argv.includes("--check");
const headerLines = [
  `# Effective Cartfile for trimblemaps-mobile-sdk-demo-reactnative (${appName}).`,
];

const packageSpecs = [
  { name: "@trimblemaps/plugins-react-native" },
  { name: "@trimblemaps/maps-react-native" },
  { name: "@trimblemaps/account-react-native" },
  { name: "@trimblemaps/services-react-native" },
];

const searchPaths = [appRoot, repoRoot];

function loadMergedEntries() {
  const entryGroups = packageSpecs.map((packageSpec) =>
    resolvePackageCartfile(repoRoot, packageSpec, searchPaths),
  );
  const merged = new Map();
  for (const entries of entryGroups) {
    for (const entry of entries) {
      if (!merged.has(entry.frameworkName)) {
        merged.set(entry.frameworkName, entry);
      }
    }
  }
  return [...merged.values()].sort((a, b) =>
    a.frameworkName.localeCompare(b.frameworkName),
  );
}

let mergedEntries = null;
try {
  mergedEntries = loadMergedEntries();
} catch (error) {
  if (!checkOnly) {
    throw error;
  }
}

if (checkOnly) {
  try {
    checkGeneratedCartfile({
      outputPath,
      mergedEntries,
      headerLines,
    });
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

const resolvedPath = path.join(appRoot, "Cartfile.resolved");
if (fs.existsSync(resolvedPath)) {
  fs.unlinkSync(resolvedPath);
}

fs.writeFileSync(outputPath, renderCartfile(mergedEntries, headerLines));
console.log(`Wrote ${outputPath}`);
