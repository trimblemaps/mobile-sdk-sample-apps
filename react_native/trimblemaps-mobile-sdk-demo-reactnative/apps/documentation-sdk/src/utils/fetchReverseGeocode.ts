import { Platform } from "react-native";
import {
  geocode,
  reverseGeocode,
  type GeocodingResult,
} from "@trimblemaps/services-react-native";

/**
 * Reverse geocode a coordinate. On iOS the dedicated reverseGeocode native
 * path can return empty payloads; legacy RNMapsSampleApp used coordinate
 * string geocode there instead.
 */
export async function fetchReverseGeocode(
  lat: number,
  lon: number,
): Promise<GeocodingResult> {
  if (Platform.OS === "ios") {
    return geocode(`${lat}, ${lon}`, { maxResults: 1 });
  }

  return reverseGeocode(lat, lon, { maxResults: 1 });
}
