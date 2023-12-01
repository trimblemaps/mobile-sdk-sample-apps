import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "react-native-splash-screen";
import TrimbleMapsAccountScreen from "./TrimbleMapsAccountScreen";
import { BasicMap } from "./BasicMap";
import { DataDrivenStyling } from "./DataDrivenStyling";
import { DotsOnAMap } from "./DotsOnAMap";
import { LinesOnAMap } from "./LinesOnAMap";
import { MapStyles } from "./MapStyles";
import { SimpleRoute } from "./SimpleRoute";
import { Geocoding } from "./Geocoding";
import { TrackingFollowMe } from "./TrackingFollowMe";
import { TrimbleLayers } from "./TrimbleLayers";
import { ReverseGeocoding } from "./ReverseGeocoding";

const App = (props) => {
  const [locationPermission, setLocationPermission] = useState("");

  useEffect(() => {
    if (Platform.OS === "android") {
      checkLocationPermission();
    }
    SplashScreen.hide();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonPositive: "OK",
          buttonNegative: "Cancel",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setLocationPermission("granted");
      } else {
        setLocationPermission("denied");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: Platform.OS !== "android"}}>
        <Stack.Screen
          name="Home"
          component={TrimbleMapsAccountScreen}
          options={{ title: "Home", headerShown: true}}
        />
        <Stack.Screen
          name="BasicMap"
          component={BasicMap}
          options={{ title: "Basic Map" }}
        />
        <Stack.Screen
          name="DataDrivenStyling"
          component={DataDrivenStyling}
          options={{ title: "Data Driven Styling" }}
        />
        <Stack.Screen
          name="DotsOnAMap"
          component={DotsOnAMap}
          options={{ title: "Dots On A Map" }}
        />
        <Stack.Screen
          name="Geocoding"
          component={Geocoding}
          options={{ title: "Geocoding" }}
        />
        <Stack.Screen
          name="LinesOnAMap"
          component={LinesOnAMap}
          options={{ title: "Lines On A Map" }}
        />
        <Stack.Screen
          name="SimpleRoute"
          component={SimpleRoute}
          options={{ title: "Simple Route" }}
        />
        <Stack.Screen
          name="TrackingFollowMe"
          component={TrackingFollowMe}
          options={{ title: "Tracking/Follow Me" }}
        />
        <Stack.Screen
          name="TrimbleLayers"
          component={TrimbleLayers}
          options={{ title: "Trimble Layers" }}
        />
        <Stack.Screen
          name="MapStyles"
          component={MapStyles}
          options={{ title: "Map Styles" }}
        />
        <Stack.Screen
          name="ReverseGeocoding"
          component={ReverseGeocoding}
          options={{ title: "Reverse Geocoding" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
