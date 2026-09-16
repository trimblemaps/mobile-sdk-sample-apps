const { withMetroShared } = require("../../scripts/metro.shared");
const { getDefaultConfig } = require("@react-native/metro-config");

module.exports = withMetroShared(getDefaultConfig(__dirname), {
  project: __dirname,
});
