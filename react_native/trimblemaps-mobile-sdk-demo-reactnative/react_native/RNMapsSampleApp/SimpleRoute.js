import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  NativeModules,
  NativeEventEmitter,
  PixelRatio,
  Platform,
  StyleSheet,
  UIManager,
  View,
  findNodeHandle,
  Text,
} from "react-native";

import { RouteViewManager } from "./RouteViewManager";
import { MapViewManager } from "./MapViewManager";

const StyleManagerModule = NativeModules.StyleManagerModule;
const RouteViewModule = NativeModules.RouteViewModule;
const DirectionsModule = NativeModules.DirectionsModule;
const RoutingModule = NativeModules.RoutingModule;
const RoutePluginModule = NativeModules.RoutePluginModule;
const CameraPositionModule = NativeModules.CameraPositionModule;
const MapViewModule = NativeModules.MapViewModule;

const StyleConstants = StyleManagerModule?.getConstants();

export const SimpleRoute = () => {
  const ref = useRef(null);
  const iosMapViewTag = 123;

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

    if (Platform.OS === "android") {
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
    } else {
      const eventEmitter = new NativeEventEmitter(RoutePluginModule);
      let eventListener = eventEmitter.addListener(
        "RoutePluginInit",
        async (e) => {
          console.log(e);
          if (e.status === "success") {
            await RoutePluginModule.addRoute("route");
            await MapViewModule.setMapView(iosMapViewTag);

            await CameraPositionModule.latLng(
              40.361202627269634,
              -74.59977385874882
            );
            await CameraPositionModule.target();
            await CameraPositionModule.altitude(1e5);
            await CameraPositionModule.build();
            await MapViewModule.zoomPosition();
          } else {
            console.log("failed");
          }
        }
      );
      return () => {
        eventListener.remove();
      };
    }
  }, []);

  const loadedRequiredModules = () => {
    return Platform.OS === "android"
      ? loadedAndroidModules()
      : loadedIOSModules();
  };

  const loadedAndroidModules = () => {
    if (
      StyleManagerModule == null ||
      RouteViewModule == null ||
      DirectionsModule == null
    ) {
      return false;
    }
    return true;
  };

  const loadedIOSModules = () => {
    return !(
      StyleManagerModule == null ||
      RoutePluginModule == null ||
      CameraPositionModule == null ||
      MapViewModule == null
    );
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

  const onMapStyleLoaded = async (e) => {
    await RoutingModule.initializeRouteOptions([
      [40.361202627269634, -74.59977385874882],
      [40.23296852563686, -74.77334837439244],
    ]);
    await RoutePluginModule.initializeRoutePlugin(iosMapViewTag);
    await RoutePluginModule.setColor("#FF00FF");
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
    iOSStyle: {
      flex: 1,
    },
  });

  const errorView = <Text>Missing required modules</Text>;
  const mapView =
    Platform.OS === "android" ? (
      <RouteViewManager
        style={styles.androidStyle}
        theme={StyleConstants?.MOBILE_DEFAULT}
        ref={ref}
      />
    ) : (
      <MapViewManager
        style={styles.iOSStyle}
        ref={ref}
        tag={iosMapViewTag}
        onMapLoaded={onMapStyleLoaded}
      />
    );
  const defaultView = (
    <View style={styles.container}>
      <View style={styles.container}>{mapView}</View>
    </View>
  );

  return loadedRequiredModules() ? defaultView : errorView;
};
