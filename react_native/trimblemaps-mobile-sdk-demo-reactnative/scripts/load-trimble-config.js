function loadTrimbleConfig() {
  let apiKey = process.env.TRIMBLE_MAPS_API_KEY;

  if (!apiKey) {
    try {
      const local = require("../trimble.config.local.js");
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
