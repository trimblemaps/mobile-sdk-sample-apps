import React, { Component } from "react";
import { StyleSheet, NativeModules, ScrollView } from "react-native";
import CardView from "./components/CardView";

const TrimbleMapsAccountModule = NativeModules.TrimbleMapsAccountModule;
const TrimbleMapsInitializerModule = NativeModules.TrimbleMapsInitializerModule;

const AccountConstants = TrimbleMapsAccountModule?.getConstants();

class Account {
  constructor(apiKey, apiEnvironment, licensedFeatures) {
    this.apiKey = apiKey;
    this.apiEnvironment = apiEnvironment;
    this.licensedFeatures = licensedFeatures;
  }
}

class TrimbleMapsAccountScreen extends Component {
  componentDidMount() {
    this.login();
  }

  constructor(props) {
    super(props);
  }

  async login() {
    if (TrimbleMapsAccountModule != null) {
      var account = new Account(
        "",
        AccountConstants.PROD,
        [AccountConstants.MAPS_SDK, AccountConstants.NAVIGATION_SDK]
      );
      await TrimbleMapsAccountModule.initializeAccount(JSON.stringify(account));
      await TrimbleMapsAccountModule.awaitInitialization(120000);
      await TrimbleMapsAccountModule.isAccountLoaded();
      this.initializeTrimbleMaps();
    } else {
      console.log("Login failed: TrimbleMapsAccountModule is null");
    }
  }

  initializeTrimbleMaps = () => {
    if (TrimbleMapsInitializerModule != null) {
      console.log("Trying to call start");
      TrimbleMapsInitializerModule.startTrimbleMapsInstance();
    }
  };

  render() {
    return (
      <React.Fragment>
        <ScrollView
          style={styles.scrollViewContainer}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <CardView
            title="Basic Map"
            imageSource={require("./images/van_nav_splash.png")}
            onPress={() => this.props.navigation.navigate("BasicMap")}
            fontColor="black"
          />
          <CardView
            title="Data Driven Styling"
            imageSource={require("./images/general_splash.png")}
            onPress={() => this.props.navigation.navigate("DataDrivenStyling")}
            fontColor="white"
          />
          <CardView
            title="Dots On A Map"
            imageSource={require("./images/van_nav_splash.png")}
            onPress={() => this.props.navigation.navigate("DotsOnAMap")}
            fontColor="black"
          />
          <CardView
            title="Geocoding"
            imageSource={require("./images/general_splash.png")}
            onPress={() => this.props.navigation.navigate("Geocoding")}
            fontColor="white"
          />
          <CardView
            title="Lines On A Map"
            imageSource={require("./images/van_nav_splash.png")}
            onPress={() => this.props.navigation.navigate("LinesOnAMap")}
            fontColor="black"
          />
          <CardView
            title="Simple Route"
            imageSource={require("./images/general_splash.png")}
            onPress={() => this.props.navigation.navigate("SimpleRoute")}
            fontColor="white"
          />
          <CardView
            title="Tracking/Follow Me"
            imageSource={require("./images/van_nav_splash.png")}
            onPress={() => this.props.navigation.navigate("TrackingFollowMe")}
            fontColor="black"
          />
          <CardView
            title="Trimble Layers"
            imageSource={require("./images/general_splash.png")}
            onPress={() => this.props.navigation.navigate("TrimbleLayers")}
            fontColor="white"
          />
          <CardView
            title="Map Styles"
            imageSource={require("./images/van_nav_splash.png")}
            onPress={() => this.props.navigation.navigate("MapStyles")}
            fontColor="black"
          />
          <CardView
            title="Reverse Geocoding"
            imageSource={require("./images/general_splash.png")}
            onPress={() => this.props.navigation.navigate("ReverseGeocoding")}
            fontColor="white"
          />
        </ScrollView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollViewContainer: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 20,
  },
  scrollViewContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
});

export default TrimbleMapsAccountScreen;
