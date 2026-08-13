// Approximate neighborhood-centroid coordinates — not exact addresses.
// Exact location stays private until a tenant contacts the landlord,
// consistent with the "exact pin shared on WhatsApp after contact" copy
// on the property page. Covers every entry in `neighborhoods` (lib/properties.ts).
export const neighborhoodCoords: Record<string, { lat: number; lng: number }> = {
  'East Legon':          { lat: 5.6494, lng: -0.1602 },
  'Spintex Road':        { lat: 5.6270, lng: -0.1330 },
  'Airport Residential': { lat: 5.6052, lng: -0.1719 },
  'Cantonments':         { lat: 5.5850, lng: -0.1700 },
  'Labone':               { lat: 5.5620, lng: -0.1730 },
  'Osu':                  { lat: 5.5560, lng: -0.1830 },
  'Adenta':               { lat: 5.7080, lng: -0.1670 },
  'Haatso':               { lat: 5.6710, lng: -0.2000 },
  'Madina':               { lat: 5.6820, lng: -0.1670 },
  'Achimota':             { lat: 5.6190, lng: -0.2270 },
  'Tema Community 9':    { lat: 5.6800, lng: -0.0170 },
  'Ashaiman':             { lat: 5.6900, lng: -0.0330 },
  'Dansoman':             { lat: 5.5390, lng: -0.2660 },
  'Kasoa':                { lat: 5.5320, lng: -0.4160 },
}
