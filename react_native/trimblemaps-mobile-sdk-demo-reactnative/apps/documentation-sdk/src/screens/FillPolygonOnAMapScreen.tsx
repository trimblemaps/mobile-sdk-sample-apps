import {
  Camera,
  GeoJSONSource,
  Layer,
  Map,
  TrimbleMaps,
} from "@trimblemaps/maps-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import polygon from "../assets/polygon.json";
import { boundsFromFeatureCollection } from "../geo/boundsFromGeoJSON";

const POLYGON_DATA = polygon as GeoJSON.FeatureCollection;

export function FillPolygonOnAMapScreen() {
  const cameraRef = useRef<React.ComponentRef<typeof Camera>>(null);
  const [loaded, setLoaded] = useState(false);
  const bounds = useMemo(
    () => boundsFromFeatureCollection(POLYGON_DATA),
    [],
  );
  const initialCenter = useMemo<[number, number]>(
    () => [(-74.459080803 + -74.447028963) / 2, (40.355432904 + 40.351557156) / 2],
    [],
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
          initialViewState={{ center: initialCenter, zoom: 13 }}
        />
        <GeoJSONSource id="fill-polygon" data={POLYGON_DATA}>
          <Layer
            id="fill-polygon-layer"
            type="fill"
            paint={{
              "fill-color": "#000000",
              "fill-opacity": 0.5,
              "fill-outline-color": "#000000",
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
