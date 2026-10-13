const NUMBER = String.raw`-?\d+(?:\.\d+)?`
const PAIR = new RegExp(String.raw`^\s*(${NUMBER})\s*,\s*(${NUMBER})\s*$`)

// Google Maps copies "10.7769, 106.7009" on right-click; the BE only takes plain numbers.
export function parseCoordinates(text: string) {
  const match = PAIR.exec(text)
  if (!match) return null
  const latitude = Number(match[1])
  const longitude = Number(match[2])
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null
  return { latitude, longitude }
}

/** The text `parseCoordinates` reads back, rounded to about 10 cm. */
export const formatCoordinates = ({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) => `${Number(latitude.toFixed(6))}, ${Number(longitude.toFixed(6))}`
