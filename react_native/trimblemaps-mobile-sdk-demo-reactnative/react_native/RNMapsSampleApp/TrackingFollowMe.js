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
  Button,
  Text,
  Platform,
} from "react-native";

import { MapViewManager } from "./MapViewManager";

const CameraPositionModule = NativeModules.CameraPositionModule;
const LocationComponentModule = NativeModules.LocationComponentModule;
const LocationEngineModule = NativeModules.LocationEngineModule;
const LocationEngineRequestModule = NativeModules.LocationEngineRequestModule;
const MapViewModule = NativeModules.MapViewModule;
const StyleManagerModule = NativeModules.StyleManagerModule;

const MapViewConstants = MapViewModule?.getConstants();
const StyleConstants = StyleManagerModule?.getConstants();
const LocationEngineRequestConstants =
  LocationEngineRequestModule?.getConstants();
const LocationComponentConstants = LocationComponentModule?.getConstants();

export const TrackingFollowMe = () => {
  const ref = useRef(null);
  const mapViewTag = 123; // only for ios
  var lat = 0;
  var lon = 0;

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
      setupLocationComponent(viewId);
    });
  };

  const loadedRequiredModules = () => {
    return Platform.OS === "android" ? loadedAndroidModules() : loadedIOSModules();
  };

  const loadedAndroidModules = () => {
    if (
      CameraPositionModule == null ||
      LocationComponentModule == null ||
      LocationEngineModule == null ||
      LocationEngineRequestModule == null ||
      MapViewModule == null ||
      StyleManagerModule == null
    ) {
      return false;
    }
    return true;
  };

  const loadedIOSModules = () => {
    if (
      CameraPositionModule == null ||
      MapViewModule == null ||
      StyleManagerModule == null
    ) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (!loadedRequiredModules()) {
      return;
    }
    if (Platform.OS === "android") {
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
        StyleManagerModule.removeStyle(String(viewId));
        MapViewModule.releaseMap();
      };
    }
  }, []);

  const setupLocationComponent = async () => {
    const viewId = findNodeHandle(ref.current);
    await LocationComponentModule.initializeLocationComponent(
      viewId,
      async () => {
        await CameraPositionModule.zoom(15.0);
        await CameraPositionModule.build();
        await MapViewModule.zoomPosition();
      }
    );
    await LocationComponentModule.activateLocationComponent();
    await LocationComponentModule.setLocationComponentEnabled(true);
    await LocationComponentModule.setCameraMode(
      LocationComponentConstants.TRACKING_COMPASS
    );
    await LocationComponentModule.setRenderMode(
      LocationComponentConstants.COMPASS
    );
    await LocationEngineModule.getBestLocationEngine();
    startTracking();
  };

  const startTracking = async () => {
    await LocationEngineRequestModule.createLocationEngineRequestBuilder(900);
    await LocationEngineRequestModule.setPriority(
      LocationEngineRequestConstants.PRIORITY_HIGH_ACCURACY
    );
    await LocationEngineRequestModule.setMaxWaitTime(4500);
    await LocationEngineRequestModule.build();

    await LocationEngineModule.requestLocationUpdates();
  };

  const recenter = async () => {
    if (Platform.OS === "android") {
      await LocationComponentModule.setCameraMode(
        LocationComponentConstants.TRACKING_COMPASS
      );
      await LocationEngineModule.getLastLocation();
    } else {
      await MapViewModule.setMapView(mapViewTag);
      await MapViewModule.setUserTrackingMode(MapViewConstants.USER_TRACKING_FOLLOW);
    }
  };

  const onMapLoaded = async (e) => {
    console.log(e.nativeEvent);
    let iosViewId = e.nativeEvent.tag;
    await MapViewModule.setMapView(iosViewId);
    await MapViewModule.setShowsUserLocation(true);
    await MapViewModule.setShowsUserHeadingIndicator(true);
    await MapViewModule.setUserTrackingMode(MapViewConstants.USER_TRACKING_FOLLOW);
    await MapViewModule.setDesiredAccuracy(10);
    await MapViewModule.releaseMap();
  };

  const onUpdateUserLocation = async (e) => {
    lat = e.nativeEvent.lat;
    lon = e.nativeEvent.lon;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    buttonContainer: {
      height: "8%",
      justifyContent: "center",
      alignItems: "center",
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

  const errorView = <Text>Missing required modules</Text>;
  const defaultView = (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Recenter" onPress={() => recenter()} />
      </View>
      <View style={styles.container}>
        <MapViewManager
          style={
            Platform.OS === "android" ? styles.androidStyle : styles.iOSStyle
          }
          theme={StyleConstants?.MOBILE_DEFAULT}
          ref={ref}
          onMapLoaded={onMapLoaded}
          onUpdateUserLocation={onUpdateUserLocation}
          tag={mapViewTag}
        />
      </View>
    </View>
  );

  return loadedRequiredModules() ? defaultView : errorView;
};
