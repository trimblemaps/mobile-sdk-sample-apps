import type { LngLatBounds } from "@trimblemaps/maps-react-native";

function extendBounds(
  bounds: LngLatBounds,
  lng: number,
  lat: number,
): LngLatBounds {
  return [
    Math.min(bounds[0], lng),
    Math.min(bounds[1], lat),
    Math.max(bounds[2], lng),
    Math.max(bounds[3], lat),
  ];
}

function boundsFromCoordinateList(
  bounds: LngLatBounds,
  coordinates: GeoJSON.Position | GeoJSON.Position[] | GeoJSON.Position[][] | GeoJSON.Position[][][],
): LngLatBounds {
  if (typeof coordinates[0] === "number") {
    const [lng, lat] = coordinates as GeoJSON.Position;
    return extendBounds(bounds, lng, lat);
  }

  let next = bounds;
  for (const coordinate of coordinates as GeoJSON.Position[]) {
    next = boundsFromCoordinateList(next, coordinate);
  }
  return next;
}

function boundsFromGeometry(
  bounds: LngLatBounds,
  geometry: GeoJSON.Geometry,
): LngLatBounds {
  switch (geometry.type) {
    case "Point":
      return boundsFromCoordinateList(bounds, geometry.coordinates);
    case "MultiPoint":
    case "LineString":
      return boundsFromCoordinateList(bounds, geometry.coordinates);
    case "MultiLineString":
    case "Polygon":
      return boundsFromCoordinateList(bounds, geometry.coordinates);
    case "MultiPolygon":
      return boundsFromCoordinateList(bounds, geometry.coordinates);
    case "GeometryCollection":
      return geometry.geometries.reduce(
        (next, child) => boundsFromGeometry(next, child),
        bounds,
      );
    default:
      return bounds;
  }
}

export function boundsFromFeatureCollection(
  collection: GeoJSON.FeatureCollection,
): LngLatBounds {
  let bounds: LngLatBounds = [
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  for (const feature of collection.features) {
    if (feature.geometry) {
      bounds = boundsFromGeometry(bounds, feature.geometry);
    }
  }

  if (!Number.isFinite(bounds[0])) {
    throw new Error("Feature collection has no coordinates");
  }

  return bounds;
}
