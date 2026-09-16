import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  TrimbleMaps,
} from "@trimblemaps/maps-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import tristate from "../assets/tristate.json";
import { boundsFromFeatureCollection } from "../geo/boundsFromGeoJSON";

const TRISTATE_DATA = tristate as GeoJSON.FeatureCollection;

export function DotsOnAMapScreen() {
  const cameraRef = useRef<React.ComponentRef<typeof Camera>>(null);
  const [loaded, setLoaded] = useState(false);
  const bounds = useMemo(
    () => boundsFromFeatureCollection(TRISTATE_DATA),
    [],
  );
  const initialCenter = useMemo<[number, number]>(
    () => [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2],
    [bounds],
  );

  useEffect(() => {
    if (!loaded) {
      return;
    }

    cameraRef.current?.fitBounds(bounds, {
      padding: { top: 64, right: 64, bottom: 64, left: 64 },
      duration: 800,
    });
  }, [bounds, loaded]);

  return (
    <View style={styles.container}>
      <Map
        mapStyle={TrimbleMaps.StyleURL.MobileDay}
        style={styles.map}
        onDidFinishLoadingMap={() => setLoaded(true)}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{ center: initialCenter, zoom: 12 }}
        />
        <GeoJSONSource id="dots" data={TRISTATE_DATA}>
          <Layer
            id="dots-circle"
            type="circle"
            paint={{
              "circle-radius": 8,
              "circle-color": "#0063A3",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
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
