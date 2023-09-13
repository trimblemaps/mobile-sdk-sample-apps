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

const CameraPositionModule = NativeModules.CameraPositionModule;
const MapViewModule = NativeModules.MapViewModule;
const StyleManagerModule = NativeModules.StyleManagerModule;
const GeoJsonSourceModule = NativeModules.GeoJsonSourceModule;
const LineLayerModule = NativeModules.LineLayerModule;

const StyleConstants = StyleManagerModule?.getConstants();
const LineConstants = LineLayerModule?.getConstants();

export const LinesOnAMap = () => {
  const ref = useRef(null);

  const createMapViewFragment = (viewId) =>
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.MapViewManager.Commands.create.toString(),
      [viewId]
    );

  let lineLayerId = "LineLayerId";
  let lineId = "LineId";

  const drawOnMap = async (viewId) => {
    await MapViewModule.setMapView(String(viewId));
    MapViewModule.getMapAsync(() => {
      MapViewModule.setStyleWithCallback(
        StyleConstants.MOBILE_DAY,
        async (mapViewFragmentTag) => {
          await StyleManagerModule.addStyle(String(viewId));
          await GeoJsonSourceModule.createGeoJsonSourceFromUri(
            lineId,
            "asset://lines.json"
          );

          await StyleManagerModule.addSourceToStyle(String(viewId), lineId);

          let lineProperties = {};
          lineProperties[LineConstants.WIDTH] = 4;
          lineProperties[LineConstants.COLOR] = "#0000FF";
          lineProperties[LineConstants.OPACITY] = 0.5;

          await LineLayerModule.createLineLayerWithProperties(
            lineLayerId,
            lineId,
            lineProperties
          );

          await StyleManagerModule.addLayerToStyle(
            String(viewId),
            lineLayerId,
            StyleConstants.LINE_LAYER
          );

          await CameraPositionModule.latLng(
            40.60902838712187,
            -97.73800045737227
          );
          await CameraPositionModule.target();
          await CameraPositionModule.zoom(2.5);
          await CameraPositionModule.build();
          await MapViewModule.zoomPosition();
        }
      );
    });
  };

  useEffect(() => {
    if (!loadedRequiredModules()) {
      return;
    }
    const viewId = findNodeHandle(ref.current);
    console.log(String(viewId));

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
      LineLayerModule.removeLineLayer(String(viewId));
      StyleManagerModule.removeStyle(String(viewId));
      MapViewModule.releaseMap();
    };
  }, []);

  const loadedRequiredModules = () => {
    if (
      CameraPositionModule == null ||
      MapViewModule == null ||
      StyleManagerModule == null ||
      GeoJsonSourceModule == null ||
      LineLayerModule == null
    ) {
      return false;
    }
    return true;
  };

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
  return loadedRequiredModules() ? defaultView : errorView;
};
