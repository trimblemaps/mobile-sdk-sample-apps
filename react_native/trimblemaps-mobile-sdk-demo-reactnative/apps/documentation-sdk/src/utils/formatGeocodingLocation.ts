import type { TrimbleMapsLocation } from "@trimblemaps/services-react-native";

export function formatGeocodingLocation(
  location: TrimbleMapsLocation | undefined,
): string {
  if (!location) {
    return "No results";
  }

  if (location.placeName?.trim()) {
    return location.placeName;
  }

  if (location.siteName?.trim()) {
    return location.siteName;
  }

  const address = location.address;
  if (address) {
    const street = [address.streetNumber, address.street]
      .filter(Boolean)
      .join(" ")
      .trim();
    const locality = [address.city, address.state, address.zip]
      .filter(Boolean)
      .join(" ")
      .trim();
    const formatted = [street, locality].filter(Boolean).join(", ");
    if (formatted) {
      return formatted;
    }
    if (address.name?.trim()) {
      return address.name;
    }
  }

  if (location.coords) {
    return `${location.coords.lat.toFixed(5)}, ${location.coords.lon.toFixed(5)}`;
  }

  return "No address found";
}
