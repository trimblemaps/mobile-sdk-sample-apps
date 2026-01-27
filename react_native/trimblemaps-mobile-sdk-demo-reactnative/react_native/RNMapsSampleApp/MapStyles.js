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
  const [highlightedButtonId, setHighlightedButtonId] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [styleURL, setStyleURL] = useState(null);
  const [styles, setStyles] = useState({});

  useEffect(() => {
    // Load all style URLs
    Promise.all([
      TrimbleMapsMapView.MobileDay(),
      TrimbleMapsMapView.MobileNight(),
      TrimbleMapsMapView.MobileSatellite(),
    ])
      .then(([mobileDay, mobileNight, mobileSatellite]) => {
        const loadedStyles = {
          MOBILE_DAY: mobileDay,
          MOBILE_NIGHT: mobileNight,
          MOBILE_SATELLITE: mobileSatellite
        };
        setStyles(loadedStyles);
        setStyleURL(mobileDay);
      })
      .catch((error) => {
        console.error("Failed to load styles:", error);
      });
  }, []);

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

  const styleSheet = StyleSheet.create({
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

  const switchStyles = async (buttonId, styleName) => {
    setHighlightedButtonId(buttonId);
    if (styles[styleName]) {
      TrimbleMapsMapView.setStyle(styles[styleName]);
    }
  };

  const BUTTONS = [
    { id: 0, label: "MOBILE_DAY", style: "MOBILE_DAY" },
    { id: 1, label: "MOBILE_NIGHT", style: "MOBILE_NIGHT" },
    { id: 2, label: "MOBILE_SATELLITE", style: "MOBILE_SATELLITE" },
  ];

  if (!styleURL || Object.keys(styles).length === 0) {
    return <View style={styleSheet.container} />;
  }

  return (
    <View style={styleSheet.container}>
      <View style={styleSheet.container}>
        <TrimbleMapsMap
          style={styleSheet.mapStyle}
          styleURL={styleURL}
          onMapLoaded={onMapLoaded}
        />
        <View style={styleSheet.buttonContainer}>
          {BUTTONS.map((button) => (
            <TouchableOpacity
              key={button.id}
              style={[
                styleSheet.button,
                highlightedButtonId === button.id && styleSheet.highlightedButton,
              ]}
              onPress={() => switchStyles(button.id, button.style)}
            >
              <Text style={styleSheet.buttonText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};
