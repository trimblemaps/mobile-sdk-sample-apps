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

export const DataDrivenStyling = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  let circleLayerId = "CircleLayerId";
  let circleLayer = "CircleLayer";
  let radiusExpressionKey = "radiusExpression";
  let strokeWidthExpressionKey = "strokeWidthExpression";
  let strokeColorExpressionKey = "strokeColorExpression";

  useEffect(() => {
    if (mapLoaded) {
      createAndAddCircleLayer();
      moveCamera();

      return () => {
        cleanup();
      };
    }
  }, [mapLoaded]);

  const cleanup = async () => {
    await TrimbleMapsMapView.removeExpression(radiusExpressionKey);
    await TrimbleMapsMapView.removeExpression(strokeWidthExpressionKey);
    await TrimbleMapsMapView.removeExpression(strokeColorExpressionKey);
    await TrimbleMapsMapView.removeGeoJsonSource(circleLayer);
    await TrimbleMapsMapView.removeCircleLayer(circleLayerId);
  };

  const createAndAddCircleLayer = async () => {
    let geojson = require("./assets/tristate.json");
    let geojsonStr = JSON.stringify(geojson);
    await TrimbleMapsMapView.createGeoJsonSource(circleLayer, geojsonStr);

    await TrimbleMapsMapView.addSourceToStyle(circleLayer);

    let circleProperties = {};
    await TrimbleMapsMapView.interpolate(
      radiusExpressionKey,
      "linear",
      "zoom",
      [12, 1, 22, 10]
    );

    await TrimbleMapsMapView.interpolate(
      strokeWidthExpressionKey,
      "linear",
      "zoom",
      [12, 1, 22, 12]
    );

    await TrimbleMapsMapView.matchColor(
      strokeColorExpressionKey,
      "state",
      TrimbleMapsMapViewConstants.BLACK,
      [
        "PA",
        TrimbleMapsMapViewConstants.GREEN,
        "NY",
        TrimbleMapsMapViewConstants.BLUE,
        "NJ",
        TrimbleMapsMapViewConstants.RED,
      ]
    );
    circleProperties[TrimbleMapsMapViewConstants.RADIUS] = "Expression";
    circleProperties["radiusExpressionKey"] = radiusExpressionKey;
    circleProperties[TrimbleMapsMapViewConstants.COLOR] = "#FFFFFF";
    circleProperties[TrimbleMapsMapViewConstants.STROKE_COLOR] = "Expression";
    circleProperties["strokeColorExpressionKey"] = strokeColorExpressionKey;
    circleProperties[TrimbleMapsMapViewConstants.STROKE_WIDTH] = "Expression";
    circleProperties["strokeWidthExpressionKey"] = strokeWidthExpressionKey;

    await TrimbleMapsMapView.createCircleLayerWithProperties(
      circleLayerId,
      circleLayer,
      circleProperties
    );

    await TrimbleMapsMapView.addLayerToStyle(
      circleLayerId,
      TrimbleMapsMapViewConstants.CIRCLE_LAYER
    );
  };

  const moveCamera = async () => {
    if (Platform.OS === "ios") {
      await TrimbleMapsMapView.setCenterCoordinateAndZoom(
        41.362901,
        -74.694676,
        13,
        true
      );
    } else if (Platform.OS == "android") {
      await TrimbleMapsMapView.setZoom(13.0);
      await TrimbleMapsMapView.setTarget(41.362901, -74.694676);
      await TrimbleMapsMapView.buildCameraPosition();
      await TrimbleMapsMapView.moveCamera();
    }
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
