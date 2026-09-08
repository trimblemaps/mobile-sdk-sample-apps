import { Camera, Map, TrimbleMaps } from "@trimblemaps/maps-react-native";
import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  mapStyle?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  children?: ReactNode;
  mapProps?: React.ComponentProps<typeof Map>;
};

export function MapScreenShell({
  mapStyle = TrimbleMaps.StyleURL.MobileDay,
  initialCenter = [-74.006, 40.7128],
  initialZoom = 12,
  children,
  mapProps,
}: Props) {
  return (
    <View style={styles.container}>
      <Map mapStyle={mapStyle} style={styles.map} {...mapProps}>
        <Camera
          initialViewState={{
            center: initialCenter,
            zoom: initialZoom,
          }}
        />
        {children}
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
