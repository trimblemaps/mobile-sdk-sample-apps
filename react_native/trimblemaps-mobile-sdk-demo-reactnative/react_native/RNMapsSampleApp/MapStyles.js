import React, { useEffect, useState } from "react";
import {
  NativeModules,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";

import { TrimbleMapsMap } from "./TrimbleMapsMapViewManager";

const TrimbleMapsMapView = NativeModules.TrimbleMapsMapViewModule;
const TrimbleMapsMapViewConstants = TrimbleMapsMapView.getConstants();

export const MapStyles = () => {
  const BUTTONS = [
    { id: 0, label: "MOBILE_DAY", style: TrimbleMapsMapViewConstants.MOBILE_DAY },
    { id: 1, label: "MOBILE_NIGHT", style: TrimbleMapsMapViewConstants.MOBILE_NIGHT },
    { id: 2, label: "MOBILE_SATELLITE", style: TrimbleMapsMapViewConstants.MOBILE_SATELLITE },
    { id: 3, label: "TERRAIN", style: TrimbleMapsMapViewConstants.TERRAIN },
    { id: 4, label: "TRANSPORTATION", style: TrimbleMapsMapViewConstants.TRANSPORTATION },
    { id: 5, label: "BASIC", style: TrimbleMapsMapViewConstants.BASIC },
    { id: 6, label: "DATADARK", style: TrimbleMapsMapViewConstants.MOBILE_DAY },
    { id: 7, label: "DATALIGHT", style: TrimbleMapsMapViewConstants.DATALIGHT },
    { id: 8, label: "DEFAULT", style: TrimbleMapsMapViewConstants.DEFAULT },
    { id: 9, label: "MOBILE_DEFAULT", style: TrimbleMapsMapViewConstants.MOBILE_DEFAULT },
    { id: 10, label: "SATELLITE", style: TrimbleMapsMapViewConstants.SATELLITE },
  ];

  const [highlightedButtonId, setHighlightedButtonId] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapLoaded) {
      if (Platform.OS === "ios") {
        TrimbleMapsMapView.setCenterCoordinateAndZoom(
          40.758476,
          -73.984022,
          13.0,
          true
        );
      } else if (Platform.OS === "android") {
        TrimbleMapsMapView.setZoom(13.0);
        TrimbleMapsMapView.setTarget(40.758476, -73.984022);
        TrimbleMapsMapView.buildCameraPosition();
        TrimbleMapsMapView.moveCamera();
      }
    }
  }, [mapLoaded]);

  const onMapLoaded = (e) => {
    setMapLoaded(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    buttonContainer: {
      position: "absolute",
      bottom: 20,
      alignSelf: "flex-end",
    },
    button: {
      backgroundColor: "#d3d3d3",
      padding: 5,
      borderRadius: 2,
      marginVertical: 5,
      ...Platform.select({
        android: {
          elevation: 2,
        },
      }),
    },
    highlightedButton: {
      backgroundColor: "green",
    },
    buttonText: {
      color: "black",
      textAlign: "center",
      fontSize: 12,
      fontWeight: "500",
    },
    mapStyle: {
      flex: 1,
    },
  });

  const switchStyles = async (buttonId, buttonStyle) => {
    setHighlightedButtonId(buttonId);
    TrimbleMapsMapView.setStyle(buttonStyle);
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <TrimbleMapsMap
          style={styles.mapStyle}
          styleURL={TrimbleMapsMapViewConstants.MOBILE_DAY}
          onMapLoaded={onMapLoaded}
        />
        <View style={styles.buttonContainer}>
          {BUTTONS.map((button) => (
            <TouchableOpacity
              key={button.id}
              style={[
                styles.button,
                highlightedButtonId === button.id && styles.highlightedButton,
              ]}
              onPress={() => switchStyles(button.id, button.style)}
            >
              <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};
