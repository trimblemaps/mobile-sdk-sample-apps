const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.join(__dirname, "..");
const candidateRoots = [
  path.join(repoRoot, "apps/documentation-sdk"),
  path.join(repoRoot, "apps/release-candidate-sdk"),
];

const brokenRepositoriesBlock = `repositories {
    mavenCentral()
    google()
    trimbleMavenRepositories()
}`;

const fixedRepositoriesBlock = `repositories {
    mavenCentral()
    google()
    maven {
        url "https://trimblemaps.jfrog.io/artifactory/android"
    }
}`;

for (const root of candidateRoots) {
  const buildGradle = path.join(
    root,
    "node_modules/@trimblemaps/account-react-native/android/build.gradle",
  );

  if (!fs.existsSync(buildGradle)) {
    continue;
  }

  const source = fs.readFileSync(buildGradle, "utf8");
  if (!source.includes("trimbleMavenRepositories()")) {
    continue;
  }

  const patched = source.replace(
    brokenRepositoriesBlock,
    fixedRepositoriesBlock,
  );

  if (patched === source) {
    throw new Error(
      `Expected trimbleMavenRepositories() block in ${buildGradle}, but pattern did not match.`,
    );
  }

  fs.writeFileSync(buildGradle, patched);
  console.log(
    `Patched ${buildGradle} to use inline Trimble Maven repository for Gradle 9.`,
  );
}
