import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  NativeModules,
  NativeEventEmitter,
  PixelRatio,
  StyleSheet,
  UIManager,
  View,
  findNodeHandle,
  Text,
  Platform,
} from "react-native";

import { MapViewManager } from "./MapViewManager";

const MapViewModule = NativeModules.MapViewModule;
const StyleManagerModule = NativeModules.StyleManagerModule;

const StyleConstants = StyleManagerModule?.getConstants();

export const BasicMap = () => {
  const ref = useRef(null);
  const mapViewTag = 1234; // for ios only

  const createMapViewFragment = (viewId) => {
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.MapViewManager.Commands.create.toString(),
      [viewId]
    );
  };

  const drawOnMap = async (viewId) => {
    await MapViewModule.setMapView(String(viewId));
    MapViewModule.getMapAsync(() => {
      MapViewModule.setStyleWithCallback(
        StyleConstants.MOBILE_DAY,
        async (mapViewFragmentTag) => {}
      );
    });
  };

  useEffect(() => {
    if (MapViewModule == null || StyleManagerModule == null) {
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
      return () => {};
    }
  }, []);

  const onMapLoaded = async (e) => {
    // adding tap gesture
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(ref.current),
      UIManager.getViewManagerConfig('MapView').Commands
        .addTapGesture,
      [],
    );
    console.log("Map loaded");
  };

  const onMapStyleLoaded = (e) => {
    console.log("Map Style Loaded");
  };

  const onTapGesture = (e) => {
    console.log("Tap detected");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    iOSStyle: { flex: 1 },
  });
  const errorView = <Text>Missing required modules</Text>;
  const defaultView = (
    <View style={styles.container}>
      <View style={styles.container}>
        <MapViewManager
          onMapLoaded={onMapLoaded}
          onMapStyleLoaded={onMapStyleLoaded}
          onTapGesture={onTapGesture}
          ref={ref}
          // unique int tag for ios views
          style={
            Platform.OS === "android" ? styles.androidStyle : styles.iOSStyle
          }
          // ios map view style property
          styleURL={StyleConstants?.MOBILE_DEFAULT}
          tag={mapViewTag}
        />
      </View>
    </View>
  );

  return MapViewModule != null || StyleManagerModule != null
    ? defaultView
    : errorView;
};
