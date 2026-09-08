const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function listSimulatorBinary(xcframeworkPath) {
  const entries = fs.readdirSync(xcframeworkPath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.includes("simulator")) {
      continue;
    }
    const frameworkDir = path.join(
      xcframeworkPath,
      entry.name,
      `${path.basename(xcframeworkPath, ".xcframework")}.framework`,
    );
    const binaryPath = path.join(
      frameworkDir,
      path.basename(xcframeworkPath, ".xcframework"),
    );
    if (fs.existsSync(binaryPath)) {
      return binaryPath;
    }
  }
  return null;
}

function readUndefinedSymbols(binaryPath) {
  try {
    const output = execSync(`nm -u "${binaryPath}" 2>/dev/null`, {
      encoding: "utf8",
    });
    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function verifyFrameworkBundle(xcframeworkPath) {
  if (!fs.existsSync(xcframeworkPath)) {
    throw new Error(`Missing XCFramework: ${xcframeworkPath}`);
  }

  const binaryPath = listSimulatorBinary(xcframeworkPath);
  if (!binaryPath) {
    throw new Error(`Missing simulator slice in ${xcframeworkPath}`);
  }

  return {
    xcframeworkPath,
    binaryPath,
    undefinedSymbols: readUndefinedSymbols(binaryPath),
  };
}

function verifyRequiredExports(binaryPath, requiredSymbolSubstrings) {
  let exported;
  try {
    exported = execSync(`nm -gU "${binaryPath}" 2>/dev/null`, {
      encoding: "utf8",
    });
  } catch (error) {
    throw new Error(
      `Failed to inspect exports for ${binaryPath}: ${error.message}`,
    );
  }

  for (const required of requiredSymbolSubstrings) {
    if (!exported.includes(required)) {
      throw new Error(`Missing required export in ${binaryPath}: ${required}`);
    }
  }
}

module.exports = {
  listSimulatorBinary,
  verifyFrameworkBundle,
  verifyRequiredExports,
};
