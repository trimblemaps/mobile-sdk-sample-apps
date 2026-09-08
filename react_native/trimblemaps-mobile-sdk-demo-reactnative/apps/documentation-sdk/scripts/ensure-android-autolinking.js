const path = require("node:path");

require("../../../scripts/ensure-android-autolinking.js")(
  path.join(__dirname, ".."),
);
