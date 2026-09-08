import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  TrimbleMaps,
} from "@trimblemaps/maps-react-native";
import { StyleSheet, View } from "react-native";

import lines from "../assets/lines.json";

export function LinesOnAMapScreen() {
  return (
    <View style={styles.container}>
      <Map mapStyle={TrimbleMaps.StyleURL.MobileDay} style={styles.map}>
        <Camera initialViewState={{ center: [-98, 39], zoom: 4 }} />
        <GeoJSONSource id="lines" data={lines as GeoJSON.FeatureCollection}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              "line-color": "#0063A3",
              "line-width": 3,
            }}
          />
        </GeoJSONSource>
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
