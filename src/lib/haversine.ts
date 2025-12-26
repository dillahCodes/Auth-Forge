interface Haversine {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
}

export function haversine({ lat1, lat2, lon1, lon2 }: Haversine) {
  const earthRadius = 6371; // in km

  const convertToRadian = (deg: number) => (deg * Math.PI) / 180;

  lat1 = convertToRadian(lat1);
  lat2 = convertToRadian(lat2);
  lon1 = convertToRadian(lon1);
  lon2 = convertToRadian(lon2);

  const deltaLat = lat1 - lat2;
  const deltaLon = lon1 - lon2;

  const q =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));

  const distance = earthRadius * c;
  return Math.ceil(distance * 100) / 100; // in km
}
