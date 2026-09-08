import {
  Camera,
  Map,
  TrimbleMaps,
  UserLocation,
} from "@trimblemaps/maps-react-native";
import { StyleSheet, View } from "react-native";

export function FollowMeScreen() {
  return (
    <View style={styles.container}>
      <Map mapStyle={TrimbleMaps.StyleURL.MobileDay} style={styles.map}>
        <Camera trackUserLocation="default" zoom={16} />
        <UserLocation accuracy heading />
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
