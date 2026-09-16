import { Camera, Map, TrimbleMaps } from "@trimblemaps/maps-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const STYLES = [
  { label: "Day", value: TrimbleMaps.StyleURL.MobileDay },
  { label: "Night", value: TrimbleMaps.StyleURL.MobileNight },
  { label: "Satellite", value: TrimbleMaps.StyleURL.MobileSatellite },
] as const;

export function MapStylesScreen() {
  const [styleUrl, setStyleUrl] = useState(TrimbleMaps.StyleURL.MobileDay);

  return (
    <View style={styles.container}>
      <Map mapStyle={styleUrl} style={styles.map}>
        <Camera initialViewState={{ center: [-74.006, 40.7128], zoom: 12 }} />
      </Map>
      <View style={styles.toggles}>
        {STYLES.map(({ label, value }) => (
          <TouchableOpacity
            key={label}
            style={[styles.toggle, styleUrl === value && styles.toggleOn]}
            onPress={() => setStyleUrl(value)}
          >
            <Text
              style={[
                styles.toggleLabel,
                styleUrl === value && styles.toggleLabelOn,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  toggles: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
  },
  toggle: {
    margin: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  toggleOn: { backgroundColor: "#0063A3" },
  toggleLabel: { fontSize: 14, color: "#333" },
  toggleLabelOn: { color: "white" },
});
