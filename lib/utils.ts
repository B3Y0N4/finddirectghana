import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PropertyType } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(ghs: number): string {
  return `GHS ${ghs.toLocaleString('en-GH')}`
}

export function propertyTypeLabel(type: PropertyType): string {
  const labels: Record<PropertyType, string> = {
    apartment:        'Apartment',
    house:            'House',
    chamber_and_hall: 'Chamber & Hall',
    studio:           'Studio',
    townhouse:        'Townhouse',
  }
  return labels[type]
}

export function waLink(phone: string, title: string): string {
  const msg = encodeURIComponent(
    `Hi, I saw your property "${title}" on Find Direct Ghana. Is it still available?`
  )
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`
}

export function bedroomLabel(n: number): string {
  if (n === 0) return 'Studio'
  return n === 1 ? '1 Bed' : `${n} Beds`
}
