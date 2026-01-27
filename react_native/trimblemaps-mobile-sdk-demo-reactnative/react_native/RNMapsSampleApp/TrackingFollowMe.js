import React, { useEffect, useState } from "react";
import {
  NativeModules,
  NativeEventEmitter,
  StyleSheet,
  View,
  Button,
  Platform,
} from "react-native";

import { TrimbleMapsMap } from "./TrimbleMapsMapViewManager";

const TrimbleMapsLocationEngine = NativeModules.TrimbleMapsLocationEngineModule;
const TrimbleMapsLocationEngineConstants = TrimbleMapsLocationEngine?.getConstants();

const TrimbleMapsMapView = NativeModules.TrimbleMapsMapViewModule;
const TrimbleMapsMapViewConstants = TrimbleMapsMapView.getConstants();

export const TrackingFollowMe = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [styleURL, setStyleURL] = useState(null);

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
      if (Platform.OS === "android") {
        const eventEmitter = new NativeEventEmitter();

        let requestLocationUpdatesOnSuccessListener = eventEmitter.addListener(
          "requestLocationUpdatesOnSuccess",
          (event) => {}
        );

        let requestLocationUpdatesOnFailureListener = eventEmitter.addListener(
          "requestLocationUpdatesOnFailure",
          (event) => {
            console.log(event.error);
          }
        );

        setupLocationComponent();

        return () => {
          requestLocationUpdatesOnSuccessListener.remove();
          requestLocationUpdatesOnFailureListener.remove();
        };
      } else if (Platform.OS === "ios") {
        startTracking();
      }
    }
  }, [mapLoaded]);

  const setupLocationComponent = async () => {
    TrimbleMapsMapView.initializeLocationComponent(() => {
      TrimbleMapsMapView.setZoom(15.0);
      TrimbleMapsMapView.buildCameraPosition();
      TrimbleMapsMapView.setCameraPosition();
      TrimbleMapsMapView.activateLocationComponent();
      TrimbleMapsMapView.setLocationComponentEnabled(true);
      TrimbleMapsMapView.setCameraMode(
        TrimbleMapsMapViewConstants.TRACKING_COMPASS
      );
      TrimbleMapsMapView.setRenderMode(TrimbleMapsMapViewConstants.COMPASS);
      TrimbleMapsLocationEngine.getBestLocationEngine();
      startTracking();
    });
  };

  const onMapLoaded = (e) => {
    setMapLoaded(true);
  };

  const startTracking = async () => {
    if (Platform.OS === "ios") {
      TrimbleMapsMapView.setShowsUserLocation(true);
      TrimbleMapsMapView.setShowsUserHeadingIndicator(true);
      TrimbleMapsMapView.setDesiredAccuracy(10);
      TrimbleMapsMapView.setUserTrackingMode(
        TrimbleMapsMapViewConstants.USER_TRACKING_FOLLOW
      );
      TrimbleMapsMapView.setZoom(14, true);
    } else if (Platform.OS === "android") {
      TrimbleMapsLocationEngine.createLocationEngineRequestBuilder(900);
      TrimbleMapsLocationEngine.setPriority(
        TrimbleMapsLocationEngineConstants.PRIORITY_HIGH_ACCURACY
      );
      TrimbleMapsLocationEngine.setMaxWaitTime(4500);
      TrimbleMapsLocationEngine.buildLocationEngineRequest();
      await TrimbleMapsLocationEngine.requestLocationUpdates(() => {});
    }
  };

  const recenter = async () => {
    if (Platform.OS === "ios") {
      TrimbleMapsMapView.setUserTrackingMode(
        TrimbleMapsMapViewConstants.USER_TRACKING_FOLLOW
      );
    } else if (Platform.OS === "android") {
      TrimbleMapsMapView.setCameraMode(
        TrimbleMapsMapViewConstants.TRACKING_COMPASS
      );
      TrimbleMapsLocationEngine.getLastLocation((error, lat, lng) => {
        if (error) {
          console.log("Last location failure:" + error);
        } else {
          TrimbleMapsLocationEngine.createLocationUpdateBuilder();
          TrimbleMapsLocationEngine.location(lat, lng);
          TrimbleMapsLocationEngine.animationDuration(400);
          TrimbleMapsLocationEngine.buildLocationUpdate();
          TrimbleMapsMapView.forceLocationUpdate();
        }
      });
    }
  };

  const onUpdateUserLocation = (e) => {
    console.log(e.nativeEvent);
  };

  const onFailUpdateUserLocation = (e) => {
    console.log(e.nativeEvent);
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
    mapStyle: {
      flex: 1,
    },
  });

  if (!styleURL) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Recenter" onPress={() => recenter()} />
      </View>
      <View style={styles.container}>
        <TrimbleMapsMap
          style={styles.mapStyle}
          styleURL={styleURL}
          onMapLoaded={onMapLoaded}
          onUpdateUserLocation={onUpdateUserLocation}
          onFailUpdateUserLocation={onFailUpdateUserLocation}
        />
      </View>
    </View>
  );
};
