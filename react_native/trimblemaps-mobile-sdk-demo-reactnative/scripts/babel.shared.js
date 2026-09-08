module.exports = function withBabelShared(preset) {
  return {
    presets: [preset],
    plugins: [
      "@babel/plugin-transform-export-namespace-from",
      "react-native-worklets/plugin",
    ],
  };
};

module.exports.withBabelShared = module.exports;
