import React, { useEffect, useState } from "react";
import {
  View,
  NativeModules,
  StyleSheet,
  Platform,
} from "react-native";

import { TrimbleMapsMap } from "./TrimbleMapsMapViewManager";

const TrimbleMapsMapView = NativeModules.TrimbleMapsMapViewModule;
const TrimbleMapsGeocoding = NativeModules.TrimbleMapsGeocoding;
const TrimbleMapsMapViewConstants = TrimbleMapsMapView.getConstants();

export const Geocoding = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const searchTerm = "1 Independence Way Princeton NJ 08540";

  useEffect(() => {
    const geocodeCallback = (error, results) => {
      if (error) {
        console.log(error);
      } else {
        const firstResult = JSON.parse(results[0]);
        console.log(results[0]);
        const lat = parseFloat(firstResult.Coords.Lat);
        const lon = parseFloat(firstResult.Coords.Lon);
        moveCameraAndZoom(lat, lon, 13);
      }
    };

    if (Platform.OS === "ios" && mapLoaded) {
      TrimbleMapsGeocoding.createGeocodingParams(searchTerm);
      TrimbleMapsGeocoding.geocode(geocodeCallback);
    } else if (Platform.OS === "android") {
      TrimbleMapsGeocoding.createGeocodingBuilder();
      TrimbleMapsGeocoding.query(searchTerm);
      TrimbleMapsGeocoding.buildGeocoding();
      TrimbleMapsGeocoding.geocode(geocodeCallback);
    }
  }, [mapLoaded]);

  const moveCameraAndZoom = async (lat, lon, zoom) => {
    if (Platform.OS === "ios") {
      await TrimbleMapsMapView.setCenterCoordinateAndZoom(lat, lon, zoom, true);
    } else {
      TrimbleMapsMapView.setZoom(13.0);
      TrimbleMapsMapView.setTarget(lat, lon);
      TrimbleMapsMapView.buildCameraPosition();
      TrimbleMapsMapView.animateCamera();
    }
  };

  const onMapLoaded = (e) => {
    console.log("map loaded");
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