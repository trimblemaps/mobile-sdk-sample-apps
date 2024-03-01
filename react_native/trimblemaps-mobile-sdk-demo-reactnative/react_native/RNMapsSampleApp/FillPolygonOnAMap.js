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

export const FillPolygonOnAMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  let fillLayerId = "fillLayerId";
  let fillLayer = "fillLayer";

  useEffect(() => {
    if (mapLoaded) {
      createAndAddFillLayer();
      moveCamera();
      return () => {
        cleanUp();
      };
    }
  }, [mapLoaded]);

  const cleanUp = async () => {
    await TrimbleMapsMapView.removeGeoJsonSource(fillLayer);
    await TrimbleMapsMapView.removeFillLayer(fillLayerId);
  };

  const createAndAddFillLayer = async () => {
    let geojson = require("./assets/polygon.json");
    let geojsonStr = JSON.stringify(geojson);

    await TrimbleMapsMapView.createGeoJsonSource(fillLayer, geojsonStr);
    await TrimbleMapsMapView.addSourceToStyle(fillLayer);

    let fillProperties = {};
    fillProperties[TrimbleMapsMapViewConstants.OPACITY] = 0.5;
    fillProperties[TrimbleMapsMapViewConstants.COLOR] = "#000000";
    fillProperties[TrimbleMapsMapViewConstants.OUTLINE_COLOR] = "#000000";

    await TrimbleMapsMapView.createFillLayerWithProperties(
      fillLayerId,
      fillLayer,
      fillProperties
    );
    await TrimbleMapsMapView.addLayerToStyle(
      fillLayerId,
      TrimbleMapsMapViewConstants.FILL_LAYER
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mapStyle: { flex: 1 },
  });

  const moveCamera = async () => {
    if (Platform.OS === "ios") {
      await TrimbleMapsMapView.setCenterCoordinateAndZoom(
        40.355432904,
        -74.459080803,
        13,
        true
      );
    } else if (Platform.OS === "android") {
      await TrimbleMapsMapView.setZoom(13.0);
      await TrimbleMapsMapView.setTarget(40.355432904, -74.459080803);
      await TrimbleMapsMapView.buildCameraPosition();
      await TrimbleMapsMapView.moveCamera();
    }
  };

  const onMapLoaded = (e) => {
    setMapLoaded(true);
  };

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