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

const CameraPositionModule = NativeModules.CameraPositionModule;
const MapViewModule = NativeModules.MapViewModule;
const StyleManagerModule = NativeModules.StyleManagerModule;
const GeoJsonSourceModule = NativeModules.GeoJsonSourceModule;
const LineLayerModule = NativeModules.LineLayerModule;

const StyleConstants = StyleManagerModule?.getConstants();
const LineConstants = LineLayerModule?.getConstants();

export const LinesOnAMap = () => {
  const ref = useRef(null);
  const mapViewTag = 1234; // tag for ios map view

  const createMapViewFragment = (viewId) => {
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.MapViewManager.Commands.create.toString(),
      [viewId]
    );
  };

  let lineLayerId = "LineLayerId";
  let lineId = "LineId";
  var iosViewId = null;

  const createAndAddLineLayer = async (viewId) => {
    await StyleManagerModule.addStyle(viewId);
    if (Platform.OS === "android") {
      await GeoJsonSourceModule.createGeoJsonSourceFromUri(lineId, "asset://lines.json");
    } else {
      await GeoJsonSourceModule.createGeoJsonSourceFromFile(lineId, "lines");
    }

    await StyleManagerModule.addSourceToStyle(viewId, lineId);

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
      viewId,
      lineLayerId,
      StyleConstants.LINE_LAYER
    );
  };

  const drawOnMap = async (viewId) => {
    await MapViewModule.setMapView(String(viewId));
    MapViewModule.getMapAsync(() => {
      MapViewModule.setStyleWithCallback(
        StyleConstants.MOBILE_DAY,
        async (mapViewFragmentTag) => {
          await createAndAddLineLayer(String(viewId));

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

    if (Platform.OS === "android") {
      console.log("android being called?");
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
        LineLayerModule.removeLineLayer(lineId);
        GeoJsonSourceModule.removeGeoJsonSource(lineLayerId);
      };
    } else {
      return () => {
        MapViewModule.releaseMap();
        StyleManagerModule.removeStyle(iosViewId);
        LineLayerModule.removeLineLayer(lineId);
        GeoJsonSourceModule.removeGeoJsonSource(lineLayerId);
      };
    }
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

  const onMapLoaded = async (e) => {
    // for ios on map loaded callback
    iosViewId = e.nativeEvent.tag;
    await MapViewModule.setMapView(iosViewId);
    await createAndAddLineLayer(iosViewId);
    await CameraPositionModule.latLng(40.60902838712187, -97.73800045737227);
    await CameraPositionModule.target();
    await CameraPositionModule.altitude(1e7);
    await CameraPositionModule.build();
    await MapViewModule.zoomPosition();
  };

  const onMapStyleLoaded = (e) => {
    // for ios on mapstyle loaded callback
    console.log("map finished loading style");
  };

  const errorView = <Text>Missing required modules</Text>;
  const defaultView = (
    <View style={styles.container}>
      <View style={styles.container}>
        <MapViewManager
          style={
            Platform.OS === "android" ? styles.androidStyle : styles.iOSStyle
          }
          theme={StyleConstants?.MOBILE_DEFAULT}
          onMapLoaded={onMapLoaded}
          onMapStyleLoaded={onMapStyleLoaded}
          ref={ref}
          tag={mapViewTag}
        />
      </View>
    </View>
  );
  return loadedRequiredModules() ? defaultView : errorView;
};
