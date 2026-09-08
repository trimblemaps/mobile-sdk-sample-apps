const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.join(__dirname, "..");
const candidateRoots = [
  repoRoot,
  path.join(repoRoot, "apps/documentation-sdk"),
  path.join(repoRoot, "apps/release-candidate-sdk"),
];

const patch = (settingsFile) => {
  const source = fs.readFileSync(settingsFile, "utf8");
  const patched = source.replace(
    /foojay-resolver-convention"\)\.version\("0\.5\.0"\)/,
    'foojay-resolver-convention").version("1.0.0")',
  );

  if (patched !== source) {
    fs.writeFileSync(settingsFile, patched);
    console.log(
      `Patched ${settingsFile} foojay-resolver-convention to 1.0.0 for Gradle 9.`,
    );
  }
};

for (const root of candidateRoots) {
  const settingsFile = path.join(
    root,
    "node_modules/@react-native/gradle-plugin/settings.gradle.kts",
  );
  if (fs.existsSync(settingsFile)) {
    patch(settingsFile);
  }
}
