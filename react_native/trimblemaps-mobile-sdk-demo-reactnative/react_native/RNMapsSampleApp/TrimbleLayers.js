import React, { useEffect, useState } from "react";
import {
  NativeModules,
  StyleSheet,
  View,
  Button,
  Platform,
} from "react-native";

import { TrimbleMapsMap } from "./TrimbleMapsMapViewManager";

const TrimbleMapsMapView = NativeModules.TrimbleMapsMapViewModule;

export const TrimbleLayers = () => {
  const [styleURL, setStyleURL] = useState(null);

  useEffect(() => {
    // Load the style URL
    TrimbleMapsMapView.MobileDay()
      .then((style) => {
        setStyleURL(style);
      })
      .catch((error) => {
        console.error("Failed to load style:", error);
      });

    if (Platform.OS === "ios") {
      TrimbleMapsMapView.setCenterCoordinateAndZoom(
        40.758476,
        -73.984022,
        14,
        true
      );
    } else if (Platform.OS === "android") {
      TrimbleMapsMapView.setZoom(14.0);
      TrimbleMapsMapView.setTarget(40.758476, -73.984022);
      TrimbleMapsMapView.buildCameraPosition();
      TrimbleMapsMapView.moveCamera();
    }
  }, []);

  const toggleTraffic = async () => {
    TrimbleMapsMapView.toggleTrafficVisibility();
    const updatedStates = [...buttonsStates];
    updatedStates[0] = !updatedStates[0];
    setButtonStates(updatedStates);
  };

  const toggleBuildings = async () => {
    const updatedStates = [...buttonsStates];
    updatedStates[1] = !updatedStates[1];
    setButtonStates(updatedStates);
    TrimbleMapsMapView.toggle3dBuildingVisibility();
  };

  const togglePois = async () => {
    const updatedStates = [...buttonsStates];
    updatedStates[2] = !updatedStates[2];
    setButtonStates(updatedStates);
    TrimbleMapsMapView.togglePoiVisibility();
  };

  const toggleWeather = async () => {
    const updatedStates = [...buttonsStates];
    updatedStates[3] = !updatedStates[3];
    setButtonStates(updatedStates);
    TrimbleMapsMapView.toggleWeatherAlertVisibility();
    TrimbleMapsMapView.toggleWeatherRadarVisibility();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    buttonContainer: {
      height: "8%",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      zIndex: 2,
    },
    androidButtonContainer: {
      position: "absolute",
      height: "8%",
      alignItems: "center",
      alignSelf: "center",
      flexDirection: "row",
      zIndex: 2,
    },
    androidButtonSpacer: {
      width: 10,
    },
    mapStyle: {
      flex: 1,
    },
  });

  const [buttonsStates, setButtonStates] = useState([
    false,
    false,
    false,
    false,
  ]);

  if (!styleURL) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          color={buttonsStates[0] ? "green" : ""}
          title="Traffic"
          onPress={() => toggleTraffic()}
        />
        <Button
          color={buttonsStates[1] ? "green" : ""}
          title="Buildings"
          onPress={() => toggleBuildings()}
        />
        <Button
          color={buttonsStates[2] ? "green" : ""}
          title="POIs"
          onPress={() => togglePois()}
        />
        <Button
          color={buttonsStates[3] ? "green" : ""}
          title="Weather"
          onPress={() => toggleWeather()}
        />
      </View>
      <View style={styles.container}>
        <TrimbleMapsMap
          style={styles.mapStyle}
          styleURL={styleURL}
        />
      </View>
    </View>
  );
};
