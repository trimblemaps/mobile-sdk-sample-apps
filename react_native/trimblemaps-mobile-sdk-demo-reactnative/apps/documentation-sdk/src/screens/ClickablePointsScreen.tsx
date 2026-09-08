import { Map, TrimbleMaps, type PressEvent } from "@trimblemaps/maps-react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export function ClickablePointsScreen() {
  const [press, setPress] = useState<PressEvent | null>(null);

  return (
    <View style={styles.container}>
      <Map
        mapStyle={TrimbleMaps.StyleURL.MobileDay}
        style={styles.map}
        onPress={(event) => setPress(event.nativeEvent)}
      />
      <Text style={styles.status}>
        {press
          ? `Lng: ${press.lngLat[0].toFixed(4)}, Lat: ${press.lngLat[1].toFixed(4)}`
          : "Tap the map"}
      </Text>
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
