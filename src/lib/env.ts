export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  /** Empty until a key exists; the restaurant form then falls back to a plain coordinates field. */
  googleMapsKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
  googleMapsMapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
}
