import { createRoutePlugin } from "@trimblemaps/plugins-react-native";
import { Camera, Map, TrimbleMaps } from "@trimblemaps/maps-react-native";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const ROUTE = {
  id: "simple-route",
  color: "#0063A3",
  routeOptions: {
    origin: { latitude: 40.361202, longitude: -74.599773 },
    destination: { latitude: 40.232968, longitude: -74.773348 },
  },
};

export function SimpleRoutingScreen() {
  const mapRef = useRef<React.ComponentRef<typeof Map>>(null);
  const [status, setStatus] = useState("");

  const addRoute = useCallback(async () => {
    if (!mapRef.current) {
      return;
    }
    try {
      const plugin = createRoutePlugin(mapRef.current);
      await plugin.addRoute(ROUTE);
      await plugin.frameRoute(ROUTE.id);
      setStatus("Route displayed");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Route failed");
    }
  }, []);

  return (
    <View style={styles.container}>
      <Map
        ref={mapRef}
        mapStyle={TrimbleMaps.StyleURL.MobileDay}
        style={styles.map}
        onDidFinishLoadingMap={addRoute}
      >
        <Camera
          initialViewState={{
            center: [-74.68, 40.3],
            zoom: 10,
          }}
        />
      </Map>
      <Text style={styles.status}>{status || "Loading route…"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  status: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
  },
});
