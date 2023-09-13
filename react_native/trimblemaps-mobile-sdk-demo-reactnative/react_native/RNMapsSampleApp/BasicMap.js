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
} from "react-native";

import { MapViewManager } from "./MapViewManager";

const MapViewModule = NativeModules.MapViewModule;
const StyleManagerModule = NativeModules.StyleManagerModule;

const StyleConstants = StyleManagerModule?.getConstants();

export const BasicMap = () => {
  const ref = useRef(null);

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
    });
  };

  useEffect(() => {
    if (MapViewModule == null || StyleManagerModule == null) {
      return;
    }
    const viewId = findNodeHandle(ref.current);

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
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  const errorView = <Text>Missing required modules</Text>;
  const defaultView = (
    <View style={styles.container}>
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
          }}
          theme={StyleConstants?.MOBILE_DEFAULT}
          ref={ref}
        />
      </View>
    </View>
  );

  return MapViewModule != null || StyleManagerModule != null
    ? defaultView
    : errorView;
};
