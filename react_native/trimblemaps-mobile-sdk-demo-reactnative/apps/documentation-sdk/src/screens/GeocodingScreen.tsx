import { Camera, Map, TrimbleMaps } from "@trimblemaps/maps-react-native";
import { geocode } from "@trimblemaps/services-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { formatGeocodingLocation } from "../utils/formatGeocodingLocation";

const SEARCH_TERM = "1 Independence Way Princeton NJ 08540";

export function GeocodingScreen() {
  const cameraRef = useRef<React.ComponentRef<typeof Camera>>(null);
  const [loaded, setLoaded] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (!loaded) {
      return;
    }

    geocode(SEARCH_TERM)
      .then((response) => {
        const location = response.locations?.[0];
        if (!location?.coords) {
          setResult("No results");
          return;
        }
        const { lat, lon } = location.coords;
        setResult(formatGeocodingLocation(location));
        cameraRef.current?.flyTo({
          center: [lon, lat],
          zoom: 13,
          duration: 500,
        });
      })
      .catch((error: unknown) => {
        setResult(error instanceof Error ? error.message : "Geocoding failed");
      });
  }, [loaded]);

  return (
    <View style={styles.container}>
      <Map
        mapStyle={TrimbleMaps.StyleURL.MobileDay}
        style={styles.map}
        onDidFinishLoadingMap={() => setLoaded(true)}
      >
        <Camera ref={cameraRef} initialViewState={{ center: [-74.65, 40.35], zoom: 10 }} />
      </Map>
      <Text style={styles.status}>{result || "Geocoding…"}</Text>
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
