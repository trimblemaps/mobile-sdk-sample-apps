import { Camera, Map, TrimbleMaps } from "@trimblemaps/maps-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LOCATIONS: Array<{ name: string; center: [number, number] }> = [
  { name: "Princeton", center: [-74.6672, 40.3573] },
  { name: "Richmond", center: [-77.436, 37.5407] },
  { name: "Pittsburgh", center: [-79.9959, 40.4406] },
];

export function LocationCyclingScreen() {
  const cameraRef = useRef<React.ComponentRef<typeof Camera>>(null);
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    const location = LOCATIONS[index];
    cameraRef.current?.flyTo({
      center: location.center,
      zoom: 12,
      duration: 600,
    });
  }, [index, loaded]);

  return (
    <View style={styles.container}>
      <Map
        mapStyle={TrimbleMaps.StyleURL.MobileDay}
        style={styles.map}
        onDidFinishLoadingMap={() => setLoaded(true)}
      >
        <Camera ref={cameraRef} initialViewState={{ center: LOCATIONS[0].center, zoom: 12 }} />
      </Map>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIndex((prev) => (prev + 1) % LOCATIONS.length)}
        >
          <Text style={styles.buttonText}>
            Next: {LOCATIONS[(index + 1) % LOCATIONS.length].name}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  button: {
    backgroundColor: "#0063A3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16 },
});
