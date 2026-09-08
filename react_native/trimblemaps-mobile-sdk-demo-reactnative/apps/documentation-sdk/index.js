const React = require("react");
const { AppRegistry } = require("react-native");
const { AccountBootstrap } = require("./src/AccountBootstrap");
const { DocumentationApp } = require("./src/DocumentationApp");
const appConfig = require("../../scripts/load-trimble-config")();
const { name: appName } = require("./app.json");

function Root() {
  return React.createElement(
    AccountBootstrap,
    { apiKey: appConfig.apiKey },
    React.createElement(DocumentationApp),
  );
}

AppRegistry.registerComponent(appName, () => Root);
