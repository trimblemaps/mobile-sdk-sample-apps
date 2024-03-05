import React, { useEffect } from "react";
import { StyleSheet, NativeModules, NativeEventEmitter, ScrollView, Platform } from "react-native";
import CardView from "./components/CardView";

const TrimbleMapsModule = NativeModules.TrimbleMapsModule;

const TrimbleMapsConstants = TrimbleMapsModule?.getConstants();

class Account {
  constructor(apiKey, apiEnvironment, licensedFeatures) {
    this.apiKey = apiKey;
    this.apiEnvironment = apiEnvironment;
    this.licensedFeatures = licensedFeatures;
  }
}

export const TrimbleMapsAccountScreen = (props) => {
  const defaultTimeout = 30;
  useEffect(() => {
    const login = async () => {
      if (TrimbleMapsModule != null) {
        var account = new Account(
          "API_KEY",
          TrimbleMapsConstants.PROD,
          [TrimbleMapsConstants.MAPS_SDK, TrimbleMapsConstants.NAVIGATION_SDK]
        );
        await TrimbleMapsModule.initializeAccount(account);
        // In seconds, how long to wait before terminating account initialization
        await TrimbleMapsModule.awaitInitialization(defaultTimeout);
        initializeTrimbleMaps();
      } else {
        console.log("Login failed: TrimbleMapsAccountModule is null");
      }
    };

    const eventEmitter = new NativeEventEmitter(TrimbleMapsModule);
    let accountInitListener = eventEmitter.addListener(
      TrimbleMapsConstants.EVENT_ACC_STATE_CHANGED,
      (event) => {
        if (event.status === TrimbleMapsConstants.LOADED) {
          console.log("account loaded");
        } else if (event.status === TrimbleMapsConstants.LOADING) {
          console.log("account loading");
        } else {
          console.log("account needs load");
        }
      }
    );
    login();
    return () => {
      accountInitListener.remove();
    };
  }, []);

  const initializeTrimbleMaps = () => {
    if (TrimbleMapsModule != null && Platform.OS == "android") {
      console.log("Trying to call start");
      TrimbleMapsModule.startTrimbleMapsInstance();
    }
  };

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

  return (
    <React.Fragment>
      <ScrollView
        style={styles.scrollViewContainer}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <CardView
          title="Basic Map"
          imageSource={require("./images/van_nav_splash.png")}
          onPress={() => props.navigation.navigate("BasicMap")}
          fontColor="black"
        />
        <CardView
          title="Data Driven Styling"
          imageSource={require("./images/general_splash.png")}
          onPress={() => props.navigation.navigate("DataDrivenStyling")}
          fontColor="white"
        />
        <CardView
          title="Dots On A Map"
          imageSource={require("./images/van_nav_splash.png")}
          onPress={() => props.navigation.navigate("DotsOnAMap")}
          fontColor="black"
        />
        <CardView
          title="Geocoding"
          imageSource={require("./images/general_splash.png")}
          onPress={() => props.navigation.navigate("Geocoding")}
          fontColor="white"
        />
        <CardView
          title="Lines On A Map"
          imageSource={require("./images/van_nav_splash.png")}
          onPress={() => props.navigation.navigate("LinesOnAMap")}
          fontColor="black"
        />
        <CardView
          title="Simple Route"
          imageSource={require("./images/general_splash.png")}
          onPress={() => props.navigation.navigate("SimpleRoute")}
          fontColor="white"
        />
        <CardView
          title="Tracking/Follow Me"
          imageSource={require("./images/van_nav_splash.png")}
          onPress={() => props.navigation.navigate("TrackingFollowMe")}
          fontColor="black"
        />
        <CardView
          title="Trimble Layers"
          imageSource={require("./images/general_splash.png")}
          onPress={() => props.navigation.navigate("TrimbleLayers")}
          fontColor="white"
        />
        <CardView
          title="Map Styles"
          imageSource={require("./images/van_nav_splash.png")}
          onPress={() => props.navigation.navigate("MapStyles")}
          fontColor="black"
        />
        <CardView
          title="Reverse Geocoding"
          imageSource={require("./images/general_splash.png")}
          onPress={() => props.navigation.navigate("ReverseGeocoding")}
          fontColor="white"
        />
        <CardView
          title="Symbols On A Map"
          imageSource={require("./images/van_nav_splash.png")}
          onPress={() => props.navigation.navigate("SymbolsOnAMap")}
          fontColor="black"
        />
        <CardView
          title="Fill Polygon On A Map"
          imageSource={require("./images/general_splash.png")}
          onPress={() => props.navigation.navigate("FillPolygonOnAMap")}
          fontColor="white"
        />
      </ScrollView>
    </React.Fragment>
  );
};
