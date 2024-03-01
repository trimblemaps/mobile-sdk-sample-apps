import React, { useEffect, useState } from "react";
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { TrimbleMapsMap } from "./TrimbleMapsMapViewManager";

const TrimbleMapsRoute = NativeModules.TrimbleMapsRouteModule;
const TrimbleMapsMapView = NativeModules.TrimbleMapsMapViewModule;

const TrimbleMapsMapViewConstants = TrimbleMapsMapView.getConstants();

export const SimpleRoute = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapLoaded) {
      createRoute();
    }
  }, [mapLoaded]);

  const createRoute = async () => {
    let stops = [
      [40.361202, -74.599773],
      [40.232968, -74.773348],
    ];
    if (Platform.OS === "ios") {
      await TrimbleMapsRoute.createRouteOptions(stops);
      await TrimbleMapsRoute.color(TrimbleMapsMapViewConstants.MAGENTA);
      await TrimbleMapsRoute.generateRoute("testRoute");
    } else if (Platform.OS === "android") {
      await TrimbleMapsRoute.createDirectionsBuilder();
      await TrimbleMapsRoute.origin(40.361202, -74.599773);
      await TrimbleMapsRoute.destination(40.232968, -74.773348);
      await TrimbleMapsRoute.buildDirections();
      await TrimbleMapsRoute.createRouteBuilder();
      await TrimbleMapsRoute.id("testRoute");
      await TrimbleMapsRoute.routeOptions();
      await TrimbleMapsRoute.color(TrimbleMapsMapViewConstants.MAGENTA);
      await TrimbleMapsRoute.buildRoute();
    }
    await TrimbleMapsRoute.addRoute();
    await TrimbleMapsRoute.frameRoute();
  };

  const onMapLoaded = (e) => {
    setMapLoaded(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mapStyle: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <TrimbleMapsMap
          style={styles.mapStyle}
          styleURL={TrimbleMapsMapViewConstants.MOBILE_DAY}
          onMapLoaded={onMapLoaded}
        />
      </View>
    </View>
  );
};
