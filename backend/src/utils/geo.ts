export interface GeoPoint {
  lat: number;
  lng: number;
}

export function parseLocation(location: string): GeoPoint {
  const [lat, lng] = location.split(',').map(Number);
  return { lat, lng };
}

export function formatLocation(point: GeoPoint): string {
  return `${point.lat},${point.lng}`;
}

export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371;
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function isWithinRadius(point1: GeoPoint, point2: GeoPoint, radiusKm: number): boolean {
  return calculateDistance(point1, point2) <= radiusKm;
}