import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  NativeModules,
  NativeEventEmitter,
  Platform,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { TrimbleMapsMap } from "./TrimbleMapsMapViewManager";

const TrimbleMapsMapView = NativeModules.TrimbleMapsMapViewModule;
const TrimbleMapsGeocoding = NativeModules.TrimbleMapsGeocoding;
const TrimbleMapsMapViewConstants = TrimbleMapsMapView.getConstants();

export const ReverseGeocoding = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const reverseTrimbleMapsGeocoding = async (event) => {
      if (Platform.OS === "android") {
        TrimbleMapsGeocoding.createGeocodingBuilder();
        TrimbleMapsGeocoding.queryLatLng(event.getLatitude, event.getLongitude);
        TrimbleMapsGeocoding.buildGeocoding();
        TrimbleMapsGeocoding.geocode(geocodeCallback);
      } else if (Platform.OS === "ios") {
        await TrimbleMapsGeocoding.createGeocodingParams(
          `${event.getLatitude}, ${event.getLongitude}`
        );
        await TrimbleMapsGeocoding.geocode(geocodeCallback);
      }
    };

    const eventEmitter = new NativeEventEmitter(TrimbleMapsMapView);
    let onMapClickListener = eventEmitter.addListener(
      "onMapClick",
      reverseTrimbleMapsGeocoding
    );

    TrimbleMapsMapView.addOnMapClickListener();

    return () => {
      onMapClickListener.remove();
    };
  }, [mapLoaded]);

  const geocodeCallback = (error, results) => {
    if (error) {
      console.log(error);
    } else {
      var resultStr = "No Results";
      if (results.length > 0) {
        const firstResult = JSON.parse(results[0]);
        resultStr = firstResult.ShortString;
      }
      if (Platform.OS === "android") {
        ToastAndroid.show(resultStr, ToastAndroid.SHORT);
      }
      if (Platform.OS === "ios") {
        Alert.alert(resultStr);
      }
    }
  };

  const onMapLoaded = (e) => {
    setMapLoaded(true);
  };

  const onTapGesture = async (e) => {
    // another way you can specify tap call back for iOS
    console.log("Tap Gesture callback");
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
          onTapGesture={onTapGesture}
        />
      </View>
    </View>
  );
};
