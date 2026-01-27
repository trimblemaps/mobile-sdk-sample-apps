import React, { useEffect, useState } from "react";
import {
  NativeModules,
  StyleSheet,
  View,
  Platform,
  Button,
} from "react-native";

import { TrimbleMapsMap } from "./TrimbleMapsMapViewManager";

const TrimbleMapsMapView = NativeModules.TrimbleMapsMapViewModule;

const TrimbleMapsMapViewConstants = TrimbleMapsMapView.getConstants();

export const DotsOnAMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [styleURL, setStyleURL] = useState(null);
  let circleLayerId = "CircleLayerId";
  let circleLayer = "CircleLayer";

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
      createAndAddCircleLayer();
      moveCamera();
      return () => {
        cleanUp();
      };
    }
  }, [mapLoaded]);

  const cleanUp = async () => {
    await TrimbleMapsMapView.removeGeoJsonSource(circleLayer);
    await TrimbleMapsMapView.removeCircleLayer(circleLayerId);
  };

  const createAndAddCircleLayer = async () => {
    try {
      await createCircleLayer();
      await TrimbleMapsMapView.addLayerToStyle(
        circleLayerId,
        TrimbleMapsMapViewConstants.CIRCLE_LAYER
      );
    } catch (e) {
      console.log(e);
    }
  };

  const createCircleLayer = async () => {
    let geojson = require('./assets/tristate.json');
    let geojsonStr = JSON.stringify(geojson);

    await TrimbleMapsMapView.createGeoJsonSource(circleLayer, geojsonStr);
    await TrimbleMapsMapView.addSourceToStyle(circleLayer);

    let circleProperties = {};
    circleProperties[TrimbleMapsMapViewConstants.RADIUS] = 4;
    circleProperties[TrimbleMapsMapViewConstants.COLOR] = "#FFFFFF";
    circleProperties[TrimbleMapsMapViewConstants.STROKE_COLOR] = "#000000";
    circleProperties[TrimbleMapsMapViewConstants.STROKE_WIDTH] = 5.0;

    await TrimbleMapsMapView.createCircleLayerWithProperties(
      circleLayerId,
      circleLayer,
      circleProperties
    );
  };

  const moveCamera = async () => {
    if (Platform.OS === "android") {
      TrimbleMapsMapView.setZoom(13.0);
      TrimbleMapsMapView.setTarget(41.362901, -74.694676);
      TrimbleMapsMapView.buildCameraPosition();
      TrimbleMapsMapView.moveCamera();
    } else {
      await TrimbleMapsMapView.setCenterCoordinateAndZoom(
        41.362901,
        -74.694676,
        13,
        true
      );
    }
  };

  const onMapLoaded = (e) => {
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
