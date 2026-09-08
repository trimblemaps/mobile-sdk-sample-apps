import {
  Camera,
  GeoJSONSource,
  Images,
  Layer,
  Map,
  TrimbleMaps,
} from "@trimblemaps/maps-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import tristate from "../assets/tristate.json";
import { boundsFromFeatureCollection } from "../geo/boundsFromGeoJSON";

const TRISTATE_DATA = tristate as GeoJSON.FeatureCollection;
const MARKER_ICON = "marker-icon";

export function SymbolsOnAMapScreen() {
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
        <Images
          images={{
            [MARKER_ICON]: require("../assets/images/marker.png"),
          }}
        />
        <GeoJSONSource id="symbols" data={TRISTATE_DATA}>
          <Layer
            id="symbols-layer"
            type="symbol"
            layout={{
              "icon-image": MARKER_ICON,
              "icon-size": 1,
              "icon-allow-overlap": true,
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
