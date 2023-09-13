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

import { RouteViewManager } from "./RouteViewManager";

const StyleManagerModule = NativeModules.StyleManagerModule;
const RouteViewModule = NativeModules.RouteViewModule;
const DirectionsModule = NativeModules.DirectionsModule;

const StyleConstants = StyleManagerModule?.getConstants();

export const SimpleRoute = () => {
  const ref = useRef(null);

  const createRouteViewFragment = (viewId) =>
    UIManager.dispatchViewManagerCommand(
      viewId,
      UIManager.RouteViewManager.Commands.create.toString(),
      [viewId]
    );

  const drawOnMap = async (viewId) => {
    await RouteViewModule.setRouteView(String(viewId));
    RouteViewModule.getMapAsync(() => {
      RouteViewModule.setStyleWithCallback(
        StyleConstants.MOBILE_DAY,
        async (routeViewFragmentTag) => {}
      );
      createAndFrameRoute(viewId);
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
      "RouteViewInitialized",
      (event) => {
        drawOnMap(viewId);
      }
    );

    createRouteViewFragment(viewId);
    return () => {
      eventListener.remove();
      StyleManagerModule.removeStyle(String(viewId));
      RouteViewModule.releaseMap();
    };
  }, []);

  const loadedRequiredModules = () => {
    if (
      StyleManagerModule == null ||
      RouteViewModule == null ||
      DirectionsModule == null
    ) {
      return false;
    }
    return true;
  };

  const routeCallback = async (result) => {
    console.log(result);
  };

  const createAndFrameRoute = async (viewId) => {
    await DirectionsModule.createDirectionsBuilder();
    await DirectionsModule.origin(40.361202627269634, -74.59977385874882);
    await DirectionsModule.destination(40.23296852563686, -74.77334837439244);
    await DirectionsModule.build();
    await RouteViewModule.createRouteBuilder();
    await RouteViewModule.id("testRoute");
    await RouteViewModule.routeOptions();
    await RouteViewModule.requestCallback(routeCallback);
    await RouteViewModule.color(StyleConstants.MAGENTA);
    await RouteViewModule.build();
    await RouteViewModule.addRoute(viewId);
    await RouteViewModule.frameRoute();
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
        <RouteViewManager
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
