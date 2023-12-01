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
const CircleLayerModule = NativeModules.CircleLayerModule;

const StyleConstants = StyleManagerModule?.getConstants();
const CircleConstants = CircleLayerModule?.getConstants();

export const DotsOnAMap = () => {
  const ref = useRef(null);
  const mapViewTag = 1234; // tag for ios view

  const createMapViewFragment = (viewId) => {
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.MapViewManager.Commands.create.toString(),
      [viewId]
    );
  }

  let circleLayerId = "CircleLayerId";
  let circleLayer = "CircleLayer";
  var iosViewId = null;

  const createAndAddCircleLayer = async (viewId) => {
    await StyleManagerModule.addStyle(viewId);
    if (Platform.OS === "android") {
      await GeoJsonSourceModule.createGeoJsonSourceFromUri(
        circleLayer,
        "asset://tristate.json"
      );
    } else {
      await GeoJsonSourceModule.createGeoJsonSourceFromFile(
        circleLayer,
        "tristate"
      );
    }
    await StyleManagerModule.addSourceToStyle(viewId, circleLayer);

    let circleProperties = {};
    circleProperties[CircleConstants.RADIUS] = 4;
    circleProperties[CircleConstants.COLOR] = "#FFFFFF";
    circleProperties[CircleConstants.STROKE_COLOR] = "#000000";
    circleProperties[CircleConstants.STROKE_WIDTH] = 5.0;
    await CircleLayerModule.createCircleLayerWithProperties(
      circleLayerId,
      circleLayer,
      circleProperties
    );
    await StyleManagerModule.addLayerToStyle(
      viewId,
      circleLayerId,
      StyleConstants?.CIRCLE_LAYER
    );
  };

  const drawOnMap = async (viewId) => {
    await MapViewModule.setMapView(String(viewId));
    MapViewModule.getMapAsync(() => {
      MapViewModule.setStyleWithCallback(
        StyleConstants.MOBILE_NIGHT,
        async (mapViewFragmentTag) => {
          createAndAddCircleLayer(String(viewId));

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
        CircleLayerModule.removeCircleLayer(circleLayerId);
        GeoJsonSourceModule.removeGeoJsonSource(circleLayer);
      };
    } else {
      return () => {
        MapViewModule.releaseMap();
        StyleManagerModule.removeStyle(iosViewId);
        CircleLayerModule.removeCircleLayer(circleLayerId);
        GeoJsonSourceModule.removeGeoJsonSource(circleLayer);
      };
    }
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
    // ios on map loaded callback
    iosViewId = e.nativeEvent.tag;
    await MapViewModule.setMapView(iosViewId);
    await createAndAddCircleLayer(iosViewId);

    await CameraPositionModule.latLng(41.36290180612575, -74.6946761628674);
    await CameraPositionModule.target();
    await CameraPositionModule.altitude(1e4);
    await CameraPositionModule.build();
    await MapViewModule.zoomPosition();
  };

  const onMapStyleLoaded = (e) => {
    // ios on mapstyle loaded callback
    console.log("map finished loading style");
  };

  const errorView = <Text>Missing required modules</Text>;
  const defaultView = (
    <View style={styles.container}>
      <View style={styles.container}>
        <MapViewManager
          // ios map view style property
          onMapLoaded={onMapLoaded}
          onMapStyleLoaded={onMapStyleLoaded}
          ref={ref}
          style={
            Platform.OS === "android" ? styles.androidStyle : styles.iOSStyle
          }
          styleURL={StyleConstants?.MOBILE_NIGHT}
          // unique int tag for ios view
          tag={mapViewTag}
        />
      </View>
    </View>
  );

  return loadedRequiredModules() ? defaultView : errorView;
};
