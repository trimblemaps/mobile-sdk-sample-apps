import { Camera, Map, TrimbleMaps } from "@trimblemaps/maps-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { fetchAvoidFavorSets } from "../utils/fetchAvoidFavorSets";

export function AvoidFavorsScreen() {
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!loaded) {
      return;
    }

    fetchAvoidFavorSets({ pageSize: 10, pageNumber: 1 })
      .then((result) => {
        const count = result.afSets?.length ?? 0;
        const total = result.totalAFSetCount ?? count;
        setStatus(
          count > 0
            ? `Loaded ${count} avoid/favor set(s)`
            : `No avoid/favor sets for this account (${total} total)`,
        );
      })
      .catch((error: unknown) => {
        const message =
          typeof error === "string"
            ? error
            : error instanceof Error
              ? error.message
              : error &&
                  typeof error === "object" &&
                  "message" in error &&
                  typeof (error as { message?: unknown }).message === "string"
                ? (error as { message: string }).message
                : "Avoid/favor request failed";
        setStatus(message);
      });
  }, [loaded]);

  return (
    <View style={styles.container}>
      <Map
        mapStyle={TrimbleMaps.StyleURL.MobileDay}
        style={styles.map}
        onDidFinishLoadingMap={() => setLoaded(true)}
      >
        <Camera initialViewState={{ center: [-74.006, 40.7128], zoom: 10 }} />
      </Map>
      <Text style={styles.status}>
        {status || "Loading avoid/favor sets…"}
      </Text>
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
