import React, { useEffect, useRef } from "react";
import {
  View,
  NativeModules,
  UIManager,
  findNodeHandle,
  NativeEventEmitter,
  PixelRatio,
  Platform,
  Dimensions,
  StyleSheet,
  ToastAndroid,
  Text,
  Alert,
} from "react-native";
import { GeocodingViewManager } from "./GeocodingViewManager";
import { MapViewManager } from "./MapViewManager";

const StyleManagerModule = NativeModules.StyleManagerModule;
const TrimbleMapsGeocodingViewModule =
  NativeModules.TrimbleMapsGeocodingViewModule;
const TrimbleMapsGeocodingModule = NativeModules.TrimbleMapsGeocodingModule;

const StyleConstants = StyleManagerModule?.getConstants();

export const ReverseGeocoding = () => {
  const ref = useRef(null);
  const iosMapViewTag = 123;

  const createGeocodingViewFragment = (viewId) =>
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.TrimbleMapsGeocodingViewManager.Commands.create.toString(),
      [viewId]
    );

  const reverseGeocoding = (viewId) =>
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.TrimbleMapsGeocodingViewManager.Commands.reverse_geocoding.toString(),
      [viewId]
    );

  const drawOnMap = async (viewId) => {
    await TrimbleMapsGeocodingViewModule.setGeocodingView(String(viewId));
    TrimbleMapsGeocodingViewModule.getMapAsync(() => {
      TrimbleMapsGeocodingViewModule.setStyleWithCallback(
        StyleConstants?.MOBILE_DAY,
        async (geocodingViewFragmentTag) => {}
      );

      TrimbleMapsGeocodingViewModule.addOnMapClickListener();
    });
  };

  const loadedAndroidModules = () => {
    if (
      StyleManagerModule == null ||
      TrimbleMapsGeocodingModule == null ||
      TrimbleMapsGeocodingViewModule == null
    ) {
      return false;
    }
    return true;
  };

  const loadedIOSModules = () => {
    if (StyleManagerModule === null || TrimbleMapsGeocodingModule == null) {
      return false;
    }
    return true;
  };

  const loadedRequiredModules = () => {
    return Platform.OS === "android" ? loadedAndroidModules() : loadedIOSModules();
  };

  useEffect(() => {
    if (!loadedRequiredModules()) {
      return;
    }
    const viewId = findNodeHandle(ref.current);
    console.log("Geocoding viewId: " + String(viewId));

    if (Platform.OS === "android") {
      const eventEmitter = new NativeEventEmitter();
      let eventListener = eventEmitter.addListener(
        "TrimbleMapsGeocodingViewInitialized",
        (event) => {
          drawOnMap(viewId);
        }
      );

      let onMapClickListener = eventEmitter.addListener("onMapClick", (event) => {
        TrimbleMapsGeocodingModule.createGeocodingBuilder();
        TrimbleMapsGeocodingModule.queryLatLng(event.lat, event.lng);
        TrimbleMapsGeocodingModule.build();
        reverseGeocoding(viewId);
      });

      let onResponseSuccessListener = eventEmitter.addListener(
        "onResponseSuccess",
        (event) => {
          ToastAndroid.show(event.address, ToastAndroid.SHORT);
        }
      );

      let onResponseFailureListener = eventEmitter.addListener(
        "onResponseFailure",
        (event) => {
          ToastAndroid.show(event.error, ToastAndroid.SHORT);
        }
      );

      createGeocodingViewFragment(viewId);
      return () => {
        eventListener.remove();
        onMapClickListener.remove();
        onResponseSuccessListener.remove();
        onResponseFailureListener.remove();
        StyleManagerModule.removeStyle(String(viewId));
        TrimbleMapsGeocodingViewModule.releaseMap();
      };
    } else {
      const eventEmitter = new NativeEventEmitter(TrimbleMapsGeocodingModule);
      let eventListener = eventEmitter.addListener(
        "GeocodeResponseEvent",
        async (event) => {
          if (event.locations.length > 0) {
            let location = JSON.parse(event.locations[0]);
            Alert.alert(location.ShortString);
          }
        }
      );

      return () => {
        eventListener.remove();
      };
    }
  }, []);

  const onMapLoaded = async (e) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(ref.current),
      UIManager.getViewManagerConfig("MapView").Commands.addTapGesture,
      []
    );
  };

  const onTapGesture = async (e) => {
    await TrimbleMapsGeocodingModule.createGeocodingBuilder(`${e.nativeEvent.latitude}, ${e.nativeEvent.longitude}`);
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
            onTapGesture={onTapGesture}
            tag={iosMapViewTag}
          />
        )}
      </View>
    </View>
  );
  return loadedRequiredModules() ? defaultView : errorView;
};
