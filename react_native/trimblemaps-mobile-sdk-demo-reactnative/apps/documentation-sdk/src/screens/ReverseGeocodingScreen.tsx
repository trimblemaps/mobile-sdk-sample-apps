import { Camera, Map, TrimbleMaps } from "@trimblemaps/maps-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { fetchReverseGeocode } from "../utils/fetchReverseGeocode";
import { formatGeocodingLocation } from "../utils/formatGeocodingLocation";

const LAT = 40.3573;
const LON = -74.6672;

export function ReverseGeocodingScreen() {
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!loaded) {
      return;
    }

    fetchReverseGeocode(LAT, LON)
      .then((response) => {
        setResult(formatGeocodingLocation(response.locations?.[0]));
      })
      .catch((error: unknown) => {
        setResult(
          error instanceof Error ? error.message : "Reverse geocoding failed",
        );
      });
  }, [loaded]);

  return (
    <View style={styles.container}>
      <Map
        mapStyle={TrimbleMaps.StyleURL.MobileDay}
        style={styles.map}
        onDidFinishLoadingMap={() => setLoaded(true)}
      >
        <Camera initialViewState={{ center: [LON, LAT], zoom: 14 }} />
      </Map>
      <Text style={styles.status}>{result || "Reverse geocoding…"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  status: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 8,
  },
});
