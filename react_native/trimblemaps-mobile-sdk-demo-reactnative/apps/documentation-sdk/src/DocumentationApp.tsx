import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AvoidFavorsScreen } from "./screens/AvoidFavorsScreen";
import { BasicMapScreen } from "./screens/BasicMapScreen";
import { ClickablePointsScreen } from "./screens/ClickablePointsScreen";
import { DataDrivenStylingScreen } from "./screens/DataDrivenStylingScreen";
import { DotsOnAMapScreen } from "./screens/DotsOnAMapScreen";
import { FillPolygonOnAMapScreen } from "./screens/FillPolygonOnAMapScreen";
import { FollowMeScreen } from "./screens/FollowMeScreen";
import { FrameLocationsScreen } from "./screens/FrameLocationsScreen";
import { GeocodingScreen } from "./screens/GeocodingScreen";
import { LinesOnAMapScreen } from "./screens/LinesOnAMapScreen";
import { LocationCyclingScreen } from "./screens/LocationCyclingScreen";
import { MapStylesScreen } from "./screens/MapStylesScreen";
import { ReverseGeocodingScreen } from "./screens/ReverseGeocodingScreen";
import { SimpleRoutingScreen } from "./screens/SimpleRoutingScreen";
import { SymbolsOnAMapScreen } from "./screens/SymbolsOnAMapScreen";
import { TrimbleLayersScreen } from "./screens/TrimbleLayersScreen";

const DOCUMENTATION_EXAMPLES = [
  { title: "Basic Map", screen: "BasicMap" as const },
  { title: "Data Driven Styling", screen: "DataDrivenStyling" as const },
  { title: "Dots On A Map", screen: "DotsOnAMap" as const },
  { title: "Geocoding", screen: "Geocoding" as const },
  { title: "Lines On A Map", screen: "LinesOnAMap" as const },
  { title: "Simple Routing", screen: "SimpleRouting" as const },
  { title: "Tracking / Follow Me", screen: "FollowMe" as const },
  { title: "Trimble Layers", screen: "TrimbleLayers" as const },
  { title: "Map Styles", screen: "MapStyles" as const },
  { title: "Reverse Geocoding", screen: "ReverseGeocoding" as const },
  { title: "Symbols On A Map", screen: "SymbolsOnAMap" as const },
  { title: "Fill Polygon On A Map", screen: "FillPolygonOnAMap" as const },
  { title: "Frame Locations", screen: "FrameLocations" as const },
  { title: "Clickable Points", screen: "ClickablePoints" as const },
  { title: "Location Cycling", screen: "LocationCycling" as const },
  { title: "Avoid Favors", screen: "AvoidFavors" as const },
] as const;

const Stack = createNativeStackNavigator();

const SCREEN_COMPONENTS = {
  BasicMap: BasicMapScreen,
  DataDrivenStyling: DataDrivenStylingScreen,
  DotsOnAMap: DotsOnAMapScreen,
  Geocoding: GeocodingScreen,
  LinesOnAMap: LinesOnAMapScreen,
  SimpleRouting: SimpleRoutingScreen,
  FollowMe: FollowMeScreen,
  TrimbleLayers: TrimbleLayersScreen,
  MapStyles: MapStylesScreen,
  ReverseGeocoding: ReverseGeocodingScreen,
  SymbolsOnAMap: SymbolsOnAMapScreen,
  FillPolygonOnAMap: FillPolygonOnAMapScreen,
  FrameLocations: FrameLocationsScreen,
  ClickablePoints: ClickablePointsScreen,
  LocationCycling: LocationCyclingScreen,
  AvoidFavors: AvoidFavorsScreen,
} as const;

function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <FlatList
      data={DOCUMENTATION_EXAMPLES}
      keyExtractor={(item) => item.screen}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Text style={styles.rowText}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

export function DocumentationApp() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Maps SDK Samples" }}
          />
          {DOCUMENTATION_EXAMPLES.map(({ screen, title }) => (
            <Stack.Screen
              key={screen}
              name={screen}
              component={SCREEN_COMPONENTS[screen]}
              options={{ title }}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#cccccc",
  },
  rowText: { fontSize: 18 },
});
