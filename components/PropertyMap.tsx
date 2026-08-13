import { MapPin } from 'lucide-react'
import { neighborhoodCoords } from '@/lib/neighborhoodCoords'

interface Props {
  neighborhood: string
  city: string
}

export default function PropertyMap({ neighborhood, city }: Props) {
  const coords = neighborhoodCoords[neighborhood]

  if (!coords) {
    return (
      <div className="bg-ghana-green-50 border border-ghana-green-100 rounded-card h-48 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-ghana-green mx-auto mb-2" />
          <p className="font-semibold text-ink text-sm">{neighborhood}, {city}</p>
          <p className="text-muted text-xs mt-1">Exact pin shared on WhatsApp after contact</p>
        </div>
      </div>
    )
  }

  const { lat, lng } = coords
  const delta = 0.012
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`

  return (
    <div className="rounded-card overflow-hidden border border-border-col">
      <iframe
        title={`Map of ${neighborhood}, ${city}`}
        src={src}
        className="w-full h-48 border-0"
        loading="lazy"
      />
      <div className="bg-ghana-green-50 px-3 py-2 text-center">
        <p className="text-muted text-xs">Approximate area — exact pin shared on WhatsApp after contact</p>
      </div>
    </div>
  )
}
