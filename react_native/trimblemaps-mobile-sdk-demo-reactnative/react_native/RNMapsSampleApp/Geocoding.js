import React, { useEffect, useRef } from "react";
import {
  View,
  NativeModules,
  UIManager,
  findNodeHandle,
  NativeEventEmitter,
  PixelRatio,
  Dimensions,
  StyleSheet,
  Text,
  Platform
} from "react-native";
import { GeocodingViewManager } from "./GeocodingViewManager";
import { MapViewManager } from "./MapViewManager";

const StyleManagerModule = NativeModules.StyleManagerModule;
const CameraPositionModule = NativeModules.CameraPositionModule;
const MapViewModule = NativeModules.MapViewModule;
const TrimbleMapsGeocodingViewModule =
  NativeModules.TrimbleMapsGeocodingViewModule;
const TrimbleMapsGeocodingModule = NativeModules.TrimbleMapsGeocodingModule;

const StyleConstants = StyleManagerModule?.getConstants();

export const Geocoding = () => {
  const ref = useRef(null);
  const iosMapViewTag = 123;
  const searchTerm = "1 Independence Way Princeton NJ 08540";
  const eventEmitter = new NativeEventEmitter(TrimbleMapsGeocodingModule);

  const createGeocodingViewFragment = (viewId) =>
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.TrimbleMapsGeocodingViewManager.Commands.create.toString(),
      [viewId]
    );

  const drawOnMap = async (viewId) => {
    await TrimbleMapsGeocodingViewModule.setGeocodingView(String(viewId));
    TrimbleMapsGeocodingViewModule.getMapAsync(() => {
      TrimbleMapsGeocodingViewModule.setStyleWithCallback(
        StyleConstants.MOBILE_DAY,
        async (geocodingViewFragmentTag) => {}
      );
    });
    geocoding();
  };

  useEffect(() => {
    if (!loadedRequiredModules()) {
      return;
    }
    const viewId = findNodeHandle(ref.current);

    if (Platform.OS === "android") {
      const eventEmitter = new NativeEventEmitter();
      let eventListener = eventEmitter.addListener(
        "TrimbleMapsGeocodingViewInitialized",
        (event) => {
          drawOnMap(viewId);
        }
      );

      createGeocodingViewFragment(viewId);
      return () => {
        eventListener.remove();
        StyleManagerModule.removeStyle(String(viewId));
        TrimbleMapsGeocodingViewModule.releaseMap();
      };
    } else {
      let eventListener = eventEmitter.addListener(
        "GeocodeResponseEvent",
        async (event) => {
          if (event.locations.length > 0) {
            let location = JSON.parse(event.locations[0]);
            await CameraPositionModule.latLng(
              parseFloat(location.Coords.Lat),
              parseFloat(location.Coords.Lon)
            );
            await CameraPositionModule.target();
            await CameraPositionModule.altitude(1e4);
            await CameraPositionModule.build();
            await MapViewModule.setMapView(iosMapViewTag);
            await MapViewModule.zoomPosition();
          }
        }
      );

      return () => {
        eventListener.remove();
      };
    }
  }, []);

  const loadedRequiredModules = () => {
    return Platform.OS === "android" ? loadedAndroidModules() : loadedIOSModules();
  };

  const loadedAndroidModules = () => {
    if (
      StyleManagerModule == null ||
      TrimbleMapsGeocodingViewModule == null ||
      TrimbleMapsGeocodingModule == null
    ) {
      return false;
    }
    return true;
  };

  const loadedIOSModules = () => {
    if (StyleManagerModule == null ||
      TrimbleMapsGeocodingModule == null ||
      CameraPositionModule == null ||
      MapViewModule == null) {
      return false;
    }
    return true;
  };

  const geocoding = async () => {
    await TrimbleMapsGeocodingModule.createGeocodingBuilder();
    await TrimbleMapsGeocodingModule.query(
      "1 Independence Way Princeton NJ 08540"
    );
    await TrimbleMapsGeocodingModule.build();
    viewId = findNodeHandle(ref.current);
    zoom = 13.0;
    await TrimbleMapsGeocodingModule.addGeocoding(viewId, zoom);
  };

  const onMapLoaded = async (e) => {
    await TrimbleMapsGeocodingModule.createGeocodingBuilder(searchTerm);
    await TrimbleMapsGeocodingModule.singleSearch();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    androidStyle: {
      height: PixelRatio.getPixelSizeForLayoutSize(
        Dimensions.get("window").height
      ),
      width: PixelRatio.getPixelSizeForLayoutSize(
        Dimensions.get("window").width
      ),
    },
    iosStyle: {
      flex: 1,
    },
  });

  const errorView = <Text>Missing required modules</Text>;
  const defaultView = (
    <View style={styles.container}>
      <View style={styles.container}>
        {Platform.OS === "android" ? (
          <GeocodingViewManager
            style={styles.androidStyle}
            theme={StyleConstants?.MOBILE_DAY}
            ref={ref}
          />
        ) : (
          <MapViewManager
            style={styles.iosStyle}
            ref={ref}
            onMapLoaded={onMapLoaded}
            tag={iosMapViewTag}
          />
        )}
      </View>
    </View>
  );

  return loadedRequiredModules() ? defaultView : errorView;
};
