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
  Button,
  Text,
  Platform,
} from "react-native";

import { MapViewManager } from "./MapViewManager";

const CameraPositionModule = NativeModules.CameraPositionModule;
const MapViewModule = NativeModules.MapViewModule;
const StyleManagerModule = NativeModules.StyleManagerModule;

const StyleConstants = StyleManagerModule?.getConstants();

export const TrimbleLayers = () => {
  const ref = useRef(null);
  const mapViewTag = 123; // only for ios

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
        StyleConstants?.MOBILE_DAY,
        async (mapViewFragmentTag) => {}
      );
      CameraPositionModule.latLng(40.7584766, -73.9840227);
      CameraPositionModule.target();
      CameraPositionModule.zoom(14.0);
      CameraPositionModule.build();
      MapViewModule.zoomPosition();
    });
  };

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

  useEffect(() => {
    if (!loadedRequiredModules()) {
      return;
    }
    const viewId = findNodeHandle(ref.current);
    console.log(String(viewId));

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
        StyleManagerModule.removeStyle(String(viewId));
        MapViewModule.releaseMap();
      };
    } else {
      return () => {
        MapViewModule.releaseMap();
      };
    }
  }, []);

  const toggleTraffic = async () => {
    const updatedStates = [...buttonsStates];
    updatedStates[0] = !updatedStates[0];
    setButtonStates(updatedStates);
    await MapViewModule.toggleTrafficVisibility();
  };

  const toggleBuildings = async () => {
    const updatedStates = [...buttonsStates];
    updatedStates[1] = !updatedStates[1];
    setButtonStates(updatedStates);
    await MapViewModule.toggle3dBuildingVisibility();
  };

  const togglePois = async () => {
    const updatedStates = [...buttonsStates];
    updatedStates[2] = !updatedStates[2];
    setButtonStates(updatedStates);
    await MapViewModule.togglePoiVisibility();
  };

  const toggleWeather = async () => {
    const updatedStates = [...buttonsStates];
    updatedStates[3] = !updatedStates[3];
    setButtonStates(updatedStates);
    await MapViewModule.toggleWeatherVisibility();
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
  });

  const onMapLoaded = async (e) => {
    await MapViewModule.setMapView(mapViewTag);
    await CameraPositionModule.latLng(40.7584766, -73.9840227);
    await CameraPositionModule.target();
    await CameraPositionModule.altitude(1e7);
    await CameraPositionModule.build();
    await MapViewModule.zoomPosition();
  };

  const [buttonsStates, setButtonStates] = useState([
    false,
    false,
    false,
    false,
  ]);

  const errorView = <Text>Missing required modules</Text>;
  const defaultView = (
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
        <MapViewManager
          style={{
            // converts dpi to px, provide desired height
            height: PixelRatio.getPixelSizeForLayoutSize(
              Dimensions.get("window").height
            ),
            // converts dpi to px, provide desired width
            width: PixelRatio.getPixelSizeForLayoutSize(
              Dimensions.get("window").width
            ),
            flex: 1,
          }}
          onMapLoaded={onMapLoaded}
          theme={StyleConstants?.MOBILE_DEFAULT}
          ref={ref}
          tag={mapViewTag}
        />
      </View>
    </View>
  );

  return <>{loadedRequiredModules() ? defaultView : errorView}</>;
};
