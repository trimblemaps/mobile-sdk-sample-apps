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
  ToastAndroid,
  Text,
} from "react-native";
import { GeocodingViewManager } from "./GeocodingViewManager";

const StyleManagerModule = NativeModules.StyleManagerModule;
const TrimbleMapsGeocodingViewModule =
  NativeModules.TrimbleMapsGeocodingViewModule;
const TrimbleMapsGeocodingModule = NativeModules.TrimbleMapsGeocodingModule;

const StyleConstants = StyleManagerModule?.getConstants();

export const ReverseGeocoding = () => {
  const ref = useRef(null);

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

  const loadedRequiredModules = () => {
    if (
      StyleManagerModule == null ||
      TrimbleMapsGeocodingModule == null ||
      TrimbleMapsGeocodingViewModule == null
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
    console.log("Geocoding viewId: " + String(viewId));

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
        <GeocodingViewManager
          style={{
            height: PixelRatio.getPixelSizeForLayoutSize(
              Dimensions.get("window").height
            ),
            width: PixelRatio.getPixelSizeForLayoutSize(
              Dimensions.get("window").width
            ),
          }}
          theme={StyleConstants?.MOBILE_DAY}
          ref={ref}
        />
      </View>
    </View>
  );
  return loadedRequiredModules() ? defaultView : errorView;
};
