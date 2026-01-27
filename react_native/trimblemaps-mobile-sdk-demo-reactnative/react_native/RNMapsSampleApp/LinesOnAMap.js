import React, { useEffect, useState } from "react";
import {
  NativeModules,
  StyleSheet,
  View,
  Platform,
} from "react-native";

import { TrimbleMapsMap } from "./TrimbleMapsMapViewManager";

const TrimbleMapsMapView = NativeModules.TrimbleMapsMapViewModule;
const TrimbleMapsMapViewConstants = TrimbleMapsMapView.getConstants();

export const LinesOnAMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [styleURL, setStyleURL] = useState(null);
  let lineLayerId = "LineLayerId";
  let lineId = "LineId";

  useEffect(() => {
    // Load the style URL
    TrimbleMapsMapView.MobileDay()
      .then((style) => {
        setStyleURL(style);
      })
      .catch((error) => {
        console.error("Failed to load style:", error);
      });
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      createAndAddLineLayer();
      moveCamera();
      return () => {
        cleanUp();
      };
    }
  }, [mapLoaded]);

  const cleanUp = async () => {
    await TrimbleMapsMapView.removeGeoJsonSource(lineId);
    await TrimbleMapsMapView.removeLineLayer(lineLayerId);
  };

  const createAndAddLineLayer = async () => {
    let geojson = require("./assets/lines.json");
    let geojsonStr = JSON.stringify(geojson);

    await TrimbleMapsMapView.createGeoJsonSource(lineId, geojsonStr);
    await TrimbleMapsMapView.addSourceToStyle(lineId);

    let lineProperties = {};
    lineProperties[TrimbleMapsMapViewConstants.WIDTH] = 4;
    lineProperties[TrimbleMapsMapViewConstants.COLOR] = "#0000FF";
    lineProperties[TrimbleMapsMapViewConstants.OPACITY] = 0.5;

    await TrimbleMapsMapView.createLineLayerWithProperties(
      lineLayerId,
      lineId,
      lineProperties
    );
    await TrimbleMapsMapView.addLayerToStyle(
      lineLayerId,
      TrimbleMapsMapViewConstants.LINE_LAYER
    );
  };

  const moveCamera = async () => {
    if (Platform.OS === "ios") {
      await TrimbleMapsMapView.setCenterCoordinateAndZoom(
        40.609028,
        -97.738,
        2.5,
        true
      );
    } else if (Platform.OS === "android") {
      await TrimbleMapsMapView.setZoom(2.5);
      await TrimbleMapsMapView.setTarget(40.609028, -97.738);
      await TrimbleMapsMapView.buildCameraPosition();
      await TrimbleMapsMapView.moveCamera();
    }
  };

  const onMapLoaded = () => {
    setMapLoaded(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mapStyle: { flex: 1 },
  });

  if (!styleURL) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <TrimbleMapsMap
          style={styles.mapStyle}
          styleURL={styleURL}
          onMapLoaded={onMapLoaded}
        />
      </View>
    </View>
  );
};
