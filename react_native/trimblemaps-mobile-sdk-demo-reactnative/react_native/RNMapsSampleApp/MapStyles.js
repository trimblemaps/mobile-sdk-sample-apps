import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  NativeModules,
  NativeEventEmitter,
  PixelRatio,
  StyleSheet,
  UIManager,
  View,
  findNodeHandle,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";

import { MapViewManager } from "./MapViewManager";

const CameraPositionModule = NativeModules.CameraPositionModule;
const MapViewModule = NativeModules.MapViewModule;
const StyleManagerModule = NativeModules.StyleManagerModule;

const StyleConstants = StyleManagerModule?.getConstants();

export const MapStyles = () => {
  const ref = useRef(null);
  const mapViewTag = 1234; // map view id for ios

  const BUTTONS = [
    { id: 0, label: "MOBILE_DAY", style: StyleConstants?.MOBILE_DAY },
    { id: 1, label: "MOBILE_NIGHT", style: StyleConstants?.MOBILE_NIGHT },
    {
      id: 2,
      label: "MOBILE_SATELLITE",
      style: StyleConstants?.MOBILE_SATELLITE,
    },
    { id: 3, label: "TERRAIN", style: StyleConstants?.TERRAIN },
    { id: 4, label: "TRANSPORTATION", style: StyleConstants?.TRANSPORTATION },
    { id: 5, label: "BASIC", style: StyleConstants?.BASIC },
    { id: 6, label: "DATADARK", style: StyleConstants?.DATADARK },
    { id: 7, label: "DATALIGHT", style: StyleConstants?.DATALIGHT },
    { id: 8, label: "DEFAULT", style: StyleConstants?.DEFAULT },
    { id: 9, label: "MOBILE_DEFAULT", style: StyleConstants?.MOBILE_DEFAULT },
    { id: 10, label: "SATELLITE", style: StyleConstants?.SATELLITE },
  ];

  const [highlightedButtonId, setHighlightedButtonId] = useState(0);

  const createMapViewFragment = (viewId) =>
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.MapViewManager.Commands.create.toString(),
      [viewId]
    );

  const drawOnMap = async (viewId) => {
    await MapViewModule.setMapView(String(viewId));
    MapViewModule.getMapAsync(() => {
      MapViewModule.setStyleWithCallback(
        StyleConstants.MOBILE_DAY,
        async (mapViewFragmentTag) => {}
      );

      CameraPositionModule.latLng(40.7584766, -73.9840227);
      CameraPositionModule.target();
      CameraPositionModule.zoom(13.0);
      CameraPositionModule.build();
      MapViewModule.zoomPosition();
    });
  };

  useEffect(() => {
    if (!loadedRequiredModules()) {
      return;
    }
    const viewId = findNodeHandle(ref.current);
    if (Platform.OS === "android") {
      const eventEmitter = new NativeEventEmitter();
      let eventListener = eventEmitter.addListener(
        "MapViewInitialized",
        (event) => {
          drawOnMap(viewId);
        }
      );

      createMapViewFragment(viewId);
      return () => {
        eventListener.remove();
        MapViewModule.releaseMap();
        StyleManagerModule.removeStyle(String(viewId));
      };
    } else {
      return () => {
        MapViewModule.releaseMap();
      };
    }
  }, []);

  const loadedRequiredModules = () => {
    if (
      CameraPositionModule == null ||
      MapViewModule == null ||
      StyleManagerModule == null
    ) {
      return false;
    }
    return true;
  };

  const onMapLoaded = async (e) => {
    // ios on map loaded callback
    let tag = e.nativeEvent.tag;
    await MapViewModule.setMapView(tag);
    await CameraPositionModule.latLng(40.7584766, -73.9840227);
    await CameraPositionModule.target();
    await CameraPositionModule.altitude(1e4);
    await CameraPositionModule.build();
    await MapViewModule.zoomPosition();
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
    androidStyle: {
      // converts dpi to px, provide desired height
      height: PixelRatio.getPixelSizeForLayoutSize(
        Dimensions.get("window").height
      ),
      // converts dpi to px, provide desired width
      width: PixelRatio.getPixelSizeForLayoutSize(
        Dimensions.get("window").width
      ),
    },
    iOSStyle: {
      flex: 1,
    },
  });

  const switchStyles = async (buttonId, buttonStyle) => {
    setHighlightedButtonId(buttonId);
    if (Platform.OS === "android") {
      MapViewModule.getMapAsync(() => {
        MapViewModule.setStyle(buttonStyle);
      });
    } else {
      MapViewModule.setStyle(buttonStyle);
    }
  };

  const errorView = <Text>Missing required modules</Text>;
  const defaultView = (
    <View style={styles.container}>
      <View style={styles.container}>
        <MapViewManager
          onMapLoaded={onMapLoaded}
          style={
            Platform.OS === "android" ? styles.androidstyle : styles.iOSStyle
          }
          theme={StyleConstants?.MOBILE_DAY}
          ref={ref}
          tag={mapViewTag}
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
  return loadedRequiredModules() ? defaultView : errorView;
};
