import { TrimbleMaps } from "@trimblemaps/maps-react-native";

import { MapScreenShell } from "../components/MapScreenShell";

export function BasicMapScreen() {
  return <MapScreenShell mapStyle={TrimbleMaps.StyleURL.MobileDay} />;
}
