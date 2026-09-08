const assert = require("node:assert/strict");
const test = require("node:test");

const {
  mergeCartfileEntries,
  parseCartfile,
  assertNoPrivateOverlap,
} = require("./cartfile");
const { loadLocalDependencies } = require("./local-config");

test("mergeCartfileEntries deduplicates identical entries", () => {
  const entry = parseCartfile(
    'binary "https://example.com/TrimbleMaps.json" == 2.1.1',
  );
  const merged = mergeCartfileEntries([entry, entry]);
  assert.equal(merged.length, 1);
});

test("mergeCartfileEntries rejects conflicting framework versions", () => {
  const first = parseCartfile(
    'binary "https://example.com/TrimbleMaps.json" == 2.1.1',
  );
  const second = parseCartfile(
    'binary "https://other.example.com/TrimbleMaps.json" == 2.2.0',
  );
  assert.throws(
    () => mergeCartfileEntries([first, second]),
    /Cartfile conflict/,
  );
});

test("assertNoPrivateOverlap rejects shared frameworks", () => {
  const generated = parseCartfile(
    'binary "https://example.com/TrimbleMaps.json" == 2.1.1',
  );
  const privateEntries = parseCartfile(
    'binary "https://example.com/TrimbleMaps.json" == 2.2.0',
  );
  const privatePath = "/tmp/Cartfile.private-test";
  require("node:fs").writeFileSync(
    privatePath,
    privateEntries.map((entry) => entry.line).join("\n"),
  );
  assert.throws(
    () => assertNoPrivateOverlap(generated, privatePath),
    /overlaps generated Cartfile/,
  );
  require("node:fs").unlinkSync(privatePath);
});

test("loadLocalDependencies defaults to empty maps", () => {
  const { config } = loadLocalDependencies("/tmp/does-not-exist-repo");
  assert.deepEqual(config.packages, {});
  assert.deepEqual(config.frameworks, {});
});

test("checkGeneratedCartfile validates syntax when packages are unavailable", () => {
  const fs = require("node:fs");
  const os = require("node:os");
  const path = require("node:path");
  const { checkGeneratedCartfile } = require("./cartfile");

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cartfile-check-"));
  const outputPath = path.join(tempDir, "Cartfile");
  fs.writeFileSync(
    outputPath,
    'binary "https://example.com/TrimbleMaps.json" == 2.1.1\n',
  );

  checkGeneratedCartfile({
    outputPath,
    privateCartfilePath: path.join(tempDir, "missing-private"),
    mergedEntries: null,
    headerLines: [],
  });

  fs.rmSync(tempDir, { recursive: true, force: true });
});
