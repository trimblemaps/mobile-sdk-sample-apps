import { Camera, Map, TrimbleMaps } from "@trimblemaps/maps-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

const PRINCETON: [number, number] = [-74.6672, 40.3573];

export function FrameLocationsScreen() {
  const cameraRef = useRef<React.ComponentRef<typeof Camera>>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    cameraRef.current?.fitBounds(
      [-77.436, 37.5407, -74.6672, 40.3573],
      {
        padding: { top: 64, right: 64, bottom: 64, left: 64 },
        duration: 800,
      },
    );
  }, [loaded]);

  return (
    <View style={styles.container}>
      <Map
        mapStyle={TrimbleMaps.StyleURL.MobileDay}
        style={styles.map}
        onDidFinishLoadingMap={() => setLoaded(true)}
      >
        <Camera ref={cameraRef} initialViewState={{ center: PRINCETON, zoom: 8 }} />
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
