import React, { useEffect, useState } from "react";
import {Alert, ToastAndroid, NativeModules, StyleSheet, View, Button, Platform, Image} from "react-native";

import { TrimbleMapsMap } from "./TrimbleMapsMapViewManager";

const TrimbleMapsMapView = NativeModules.TrimbleMapsMapViewModule;
const TrimbleMapsMapViewConstants = TrimbleMapsMapView.getConstants();
const TrimbleMapsRoute = NativeModules.TrimbleMapsRouteModule;

export const MultiStopRouting = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  let symbolLayerId = "SymbolLayerId";
  let symbolLayer = "SymbolLayer";
  let imageId = "main_activity_alk_logo";

  useEffect(() => {
    if (mapLoaded) {
      createRoute();

      return () => {
        cleanUp();
      };
    }
  }, [mapLoaded]);

  const cleanUp = async () => {
    await TrimbleMapsMapView.removeGeoJsonSource(symbolLayer);
    await TrimbleMapsMapView.removeSymbolLayer(symbolLayerId);
  };

  const createAndAddSymbolLayer = async () => {
    try {
      let geojson = require("./assets/tristate.json");
      let geojsonStr = JSON.stringify(geojson);

      await TrimbleMapsMapView.createGeoJsonSource(symbolLayer, geojsonStr);
      await TrimbleMapsMapView.addSourceToStyle(symbolLayer);

      const img = require("./images/main_activity_alk_logo.png");
      let resolvedImg = Image.resolveAssetSource(img);
      await TrimbleMapsMapView.addImageToStyle(imageId, resolvedImg.uri);

      let symbolProperties = {};
      symbolProperties[TrimbleMapsMapViewConstants.ICON_IMAGE] = imageId;
      symbolProperties[TrimbleMapsMapViewConstants.ICON_SIZE] = 1.0;
      symbolProperties[TrimbleMapsMapViewConstants.ICON_ALLOW_OVERLAP] = true;
      await TrimbleMapsMapView.createSymbolLayerWithProperties(
        symbolLayerId,
        symbolLayer,
        symbolProperties
      );
      await TrimbleMapsMapView.addLayerToStyle(
        symbolLayerId,
        TrimbleMapsMapViewConstants.SYMBOL_LAYER
      );
    } catch (e) {
      console.log(e);
    }
  };

  const createRoute = async () => {
      let stops = [
        [41.369863, -74.68954],
        [41.36892, -74.687882],
        [41.349811, -74.687007],
        [41.36056, -74.68222],
        [41.364475, -74.704292]
      ];
      if (Platform.OS === "ios") {
        await TrimbleMapsRoute.createRouteOptions(stops);
        await TrimbleMapsRoute.color(TrimbleMapsMapViewConstants.MAGENTA);
        await TrimbleMapsRoute.generateRoute("testRoute");
      } else if (Platform.OS === "android") {
        await TrimbleMapsRoute.createDirectionsBuilder();
        let myStops = [
          [-74.68954, 41.369863],
          [-74.687882, 41.36892],
          [-74.687007, 41.349811],
          [-74.68222, 41.36056],
          [-74.704292, 41.364475]
        ]
        await TrimbleMapsRoute.waypoints(myStops);
        await TrimbleMapsRoute.buildDirections();
        await TrimbleMapsRoute.createRouteBuilder();
        await TrimbleMapsRoute.id("testRoute");
        await TrimbleMapsRoute.routeOptions();
        await TrimbleMapsRoute.color(TrimbleMapsMapViewConstants.MAGENTA);
        await TrimbleMapsRoute.buildRoute();
      }
      await TrimbleMapsRoute.addRoute();
      await TrimbleMapsRoute.frameRoute();
      createAndAddSymbolLayer();
    };

  const recenter = async () => {
    if (Platform.OS === "ios") {
      await TrimbleMapsMapView.setCenterCoordinateAndZoom(
        41.36290180612575,
        -74.6946761628674,
        13,
        true
      );
    } else if (Platform.OS === "android") {
      await TrimbleMapsMapView.setZoom(13.0);
      await TrimbleMapsMapView.setTarget(41.36290180612575, -74.6946761628674);
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
    buttonContainer: {
        height: "8%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: 2,
        alignSelf: "center",
      },
    mapStyle: { flex: 1 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Recenter" onPress={() => recenter()} />
      </View>
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