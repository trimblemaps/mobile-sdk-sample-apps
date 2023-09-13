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
} from "react-native";
import { GeocodingViewManager } from "./GeocodingViewManager";

const StyleManagerModule = NativeModules.StyleManagerModule;
const TrimbleMapsGeocodingViewModule =
  NativeModules.TrimbleMapsGeocodingViewModule;
const TrimbleMapsGeocodingModule = NativeModules.TrimbleMapsGeocodingModule;

const StyleConstants = StyleManagerModule?.getConstants();

export const Geocoding = () => {
  const ref = useRef(null);

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
    console.log("Geocoding viewId: " + String(viewId));

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
  }, []);

  const loadedRequiredModules = () => {
    if (
      StyleManagerModule == null ||
      TrimbleMapsGeocodingViewModule == null ||
      TrimbleMapsGeocodingModule == null
    ) {
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
