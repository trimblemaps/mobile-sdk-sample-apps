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
const CircleLayerModule = NativeModules.CircleLayerModule;

const StyleConstants = StyleManagerModule?.getConstants();
const CircleConstants = CircleLayerModule?.getConstants();

export const DotsOnAMap = () => {
  const ref = useRef(null);

  const createMapViewFragment = (viewId) =>
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.MapViewManager.Commands.create.toString(),
      [viewId]
    );

  let circleLayerId = "CircleLayerId";
  let circleLayer = "CircleLayer";

  const drawOnMap = async (viewId) => {
    await MapViewModule.setMapView(String(viewId));
    MapViewModule.getMapAsync(() => {
      MapViewModule.setStyleWithCallback(
        StyleConstants.MOBILE_NIGHT,
        async (mapViewFragmentTag) => {
          await StyleManagerModule.addStyle(String(viewId));
          await GeoJsonSourceModule.createGeoJsonSourceFromUri(
            circleLayer,
            "asset://tristate.json"
          );
          await StyleManagerModule.addSourceToStyle(
            String(viewId),
            circleLayer
          );

          let circleProperties = {};
          circleProperties[CircleConstants.RADIUS] = 4;
          circleProperties[CircleConstants.COLOR] = "#FFFFFF";
          circleProperties[CircleConstants.STROKE_COLOR] = "#FF0000";
          circleProperties[CircleConstants.STROKE_WIDTH] = 5.0;

          await CircleLayerModule.createCircleLayerWithProperties(
            circleLayerId,
            circleLayer,
            circleProperties
          );

          await StyleManagerModule.addLayerToStyle(
            String(viewId),
            circleLayerId,
            StyleConstants.CIRCLE_LAYER
          );

          await CameraPositionModule.latLng(
            41.36290180612575,
            -74.6946761628674
          );
          await CameraPositionModule.target();
          await CameraPositionModule.zoom(13.0);
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
      GeoJsonSourceModule.removeGeoJsonSource(String(viewId));
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
      CircleLayerModule == null
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
