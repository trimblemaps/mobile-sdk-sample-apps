const fs = require("fs");
const path = require("path");

const { readCartfile } = require("./cartfile");
const { verifyFrameworkBundle } = require("./verify-frameworks");

function verifyCartfileFrameworks(carthageBuild, cartfilePath) {
  if (!fs.existsSync(carthageBuild)) {
    console.log(`Skipping framework verification: missing ${carthageBuild}`);
    return;
  }

  const entries = readCartfile(cartfilePath);
  for (const entry of entries) {
    if (entry.frameworkName === "Polyline") {
      continue;
    }

    const frameworkName = `${entry.frameworkName}.xcframework`;
    verifyFrameworkBundle(path.join(carthageBuild, frameworkName));
    console.log(`Verified ${frameworkName}`);
  }
}

module.exports = {
  verifyCartfileFrameworks,
};
