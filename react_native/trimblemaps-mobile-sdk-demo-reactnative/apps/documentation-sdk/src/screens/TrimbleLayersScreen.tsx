import {
  Camera,
  Map,
  TrimbleMaps,
  type TruckRestrictionsFilter,
} from "@trimblemaps/maps-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FEATURES = [
  { key: "showsTraffic", label: "Traffic" },
  { key: "showsWeatherRadar", label: "Weather" },
  { key: "shows3dBuildings", label: "3D" },
  { key: "showsPoi", label: "POI" },
  { key: "showsTruckRestrictions", label: "Truck" },
] as const;

type FeatureKey = (typeof FEATURES)[number]["key"];

const SAMPLE_FILTER: TruckRestrictionsFilter = {
  categories: ["hazmat"],
};

export function TrimbleLayersScreen() {
  const [enabled, setEnabled] = useState<Record<FeatureKey, boolean>>({
    showsTraffic: true,
    showsWeatherRadar: false,
    shows3dBuildings: false,
    showsPoi: false,
    showsTruckRestrictions: false,
  });

  return (
    <View style={styles.container}>
      <Map
        mapStyle={TrimbleMaps.StyleURL.MobileDay}
        style={styles.map}
        showsTraffic={enabled.showsTraffic}
        showsWeatherRadar={enabled.showsWeatherRadar}
        shows3dBuildings={enabled.shows3dBuildings}
        showsPoi={enabled.showsPoi}
        showsTruckRestrictions={enabled.showsTruckRestrictions}
        truckRestrictionsFilter={
          enabled.showsTruckRestrictions ? SAMPLE_FILTER : null
        }
      >
        <Camera initialViewState={{ center: [-74.006, 40.7128], zoom: 14, pitch: 45 }} />
      </Map>
      <View style={styles.toggles}>
        {FEATURES.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[styles.toggle, enabled[key] && styles.toggleOn]}
            onPress={() =>
              setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))
            }
          >
            <Text style={[styles.toggleLabel, enabled[key] && styles.toggleLabelOn]}>
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
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
  },
  toggle: {
    margin: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  toggleOn: { backgroundColor: "#0063A3" },
  toggleLabel: { fontSize: 13, color: "#333" },
  toggleLabelOn: { color: "white" },
});
