import React from "react";
import { NativeModules, StyleSheet, View } from "react-native";

import { TrimbleMapsMap } from "./TrimbleMapsMapViewManager";

const TrimbleMapsMapView = NativeModules.TrimbleMapsMapViewModule;
const TrimbleMapsMapViewConstants = TrimbleMapsMapView.getConstants();

export const BasicMap = () => {
  const onMapLoaded = (e) => {
    console.log("Map loaded");
  };

  const onMapStyleLoaded = (e) => {
    console.log("Map Style Loaded");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <TrimbleMapsMap
          style={styles.container}
          onMapLoaded={onMapLoaded}
          onMapStyleLoaded={onMapStyleLoaded}
          styleURL={TrimbleMapsMapViewConstants.MOBILE_NIGHT}
        />
      </View>
    </View>
  );
};
