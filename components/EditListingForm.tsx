'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Upload, X } from 'lucide-react'
import { propertyTypes, neighborhoods } from '@/lib/properties'
import { cn } from '@/lib/utils'
import type { EditableListing } from '@/lib/types'

const features = [
  'Generator', '24h Water', 'Air Conditioning', 'Security',
  'DSTV Ready', 'Balcony', 'Parking', 'Borehole Water',
  'Boys Quarters', 'Garden', 'Garage', 'Swimming Pool',
  'Gym', 'Fiber Internet', 'Tiled Floors', 'Furnished Kitchen',
]

const inputClass = 'w-full px-4 py-3.5 border border-border-col rounded-btn text-sm text-ink focus:outline-none focus:border-ghana-green focus:ring-1 focus:ring-ghana-green bg-white'
const labelClass = 'block text-sm font-semibold text-ink mb-1.5'

interface Props {
  listing: EditableListing
}

export default function EditListingForm({ listing }: Props) {
  const router = useRouter()

  const [form, setForm] = useState({
    title:            listing.title,
    type:             listing.type,
    bedrooms:         String(listing.bedrooms),
    bathrooms:        String(listing.bathrooms),
    furnished:        listing.furnished,
    selectedFeatures: listing.features,
    neighborhood:     listing.neighborhood,
    address:          listing.address,
    price:            String(listing.price_ghs),
    advanceMonths:    String(listing.advance_months),
    priceNegotiable:  listing.price_negotiable,
    description:      listing.description,
    videoUrl:         listing.video_url,
    name:             listing.owner_name,
    phone:            listing.owner_phone,
  })

  const [keepImages,       setKeepImages]       = useState<string[]>(listing.image_urls)
  const [newPhotoFiles,    setNewPhotoFiles]    = useState<File[]>([])
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([])
  const [submitting,       setSubmitting]       = useState(false)
  const [submitError,      setSubmitError]      = useState('')
  const [saved,            setSaved]            = useState(false)

  function set(key: string, value: unknown) {
    setForm(f => ({ ...f, [key]: value }))
    setSaved(false)
  }

  function toggleFeature(f: string) {
    setForm(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(f)
        ? prev.selectedFeatures.filter(x => x !== f)
        : [...prev.selectedFeatures, f],
    }))
    setSaved(false)
  }

  function removeExistingImage(url: string) {
    setKeepImages(prev => prev.filter(u => u !== url))
    setSaved(false)
  }

  function handleNewPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setNewPhotoFiles(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setNewPhotoPreviews(prev => [...prev, ev.target?.result as string])
      reader.readAsDataURL(file)
    })
    setSaved(false)
  }

  function removeNewPhoto(index: number) {
    setNewPhotoFiles(prev => prev.filter((_, i) => i !== index))
    setNewPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const totalPhotos = keepImages.length + newPhotoFiles.length
  const canSubmit = !!(form.title && form.type && form.bedrooms && form.bathrooms && form.neighborhood && form.price && totalPhotos > 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const fd = new FormData()
      fd.append('title',            form.title)
      fd.append('type',             form.type)
      fd.append('bedrooms',         form.bedrooms)
      fd.append('bathrooms',        form.bathrooms)
      fd.append('furnished',        String(form.furnished))
      fd.append('features',         JSON.stringify(form.selectedFeatures))
      fd.append('neighborhood',     form.neighborhood)
      fd.append('address',          form.address)
      fd.append('price',            form.price)
      fd.append('advanceMonths',    form.advanceMonths)
      fd.append('priceNegotiable',  String(form.priceNegotiable))
      fd.append('description',      form.description)
      fd.append('videoUrl',         form.videoUrl)
      fd.append('name',             form.name)
      fd.append('phone',            form.phone)
      fd.append('keepImages',       JSON.stringify(keepImages))
      newPhotoFiles.forEach((f, i) => fd.append(`photo_${i}`, f))

      const res = await fetch(`/api/listings/${listing.slug}`, { method: 'PUT', body: fd })
      if (res.status === 401) {
        setSubmitError('Your session expired — please sign in again.')
        setTimeout(() => router.push(`/auth/login?next=/dashboard/${listing.slug}/edit`), 1800)
        return
      }
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error ?? 'Update failed')

      setKeepImages(json.image_urls ?? keepImages)
      setNewPhotoFiles([])
      setNewPhotoPreviews([])
      setSaved(true)
      router.refresh()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-nav bg-page-bg min-h-screen pb-16">
      <div className="max-w-2xl mx-auto px-4 pt-6">

        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-muted text-sm font-medium hover:text-ink transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to My Listings
        </Link>

        <h1 className="font-display font-bold text-ink text-2xl mb-1">Edit Listing</h1>
        <p className="text-muted text-sm mb-6">{listing.title}</p>

        {saved && (
          <div className="bg-ghana-green-50 border border-ghana-green-100 rounded-card p-3 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-ghana-green flex-shrink-0" />
            <p className="text-ghana-green text-sm font-semibold">Changes saved.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white border border-border-col rounded-card p-5 sm:p-6 space-y-5">
            <h2 className="font-display font-bold text-ink text-lg">Property details</h2>

            <div>
              <label className={labelClass}>Property Type *</label>
              <select className={inputClass} value={form.type} onChange={e => set('type', e.target.value)} required>
                {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Bedrooms *</label>
                <select className={inputClass} value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} required>
                  {['0', '1', '2', '3', '4', '5'].map(b => <option key={b} value={b}>{b === '0' ? 'Studio / 0' : b === '5' ? '5+' : b}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Bathrooms *</label>
                <select className={inputClass} value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} required>
                  {['1', '2', '3', '4'].map(b => <option key={b} value={b}>{b === '4' ? '4+' : b}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Listing Title *</label>
              <input type="text" className={inputClass} value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>

            <div>
              <label className={labelClass}>Description <span className="font-normal text-muted">(optional)</span></label>
              <textarea className={`${inputClass} h-24 resize-none`} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>Features</label>
              <div className="flex flex-wrap gap-2">
                {features.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(f)}
                    className={cn(
                      'px-3 py-2 rounded-btn text-xs font-medium border transition-all duration-150',
                      form.selectedFeatures.includes(f)
                        ? 'bg-ghana-green text-white border-ghana-green'
                        : 'bg-white text-ink border-border-col hover:border-ghana-green/50'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => set('furnished', !form.furnished)}
              className={cn(
                'flex items-center gap-3 w-full p-4 rounded-btn border-2 text-left transition-all duration-150',
                form.furnished ? 'border-ghana-gold bg-ghana-gold-50' : 'border-border-col bg-white'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                form.furnished ? 'border-ghana-gold bg-ghana-gold' : 'border-border-col'
              )}>
                {form.furnished && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={cn('text-sm font-medium', form.furnished ? 'text-ink' : 'text-muted')}>
                This property is fully furnished
              </span>
            </button>
          </div>

          <div className="bg-white border border-border-col rounded-card p-5 sm:p-6 space-y-5">
            <h2 className="font-display font-bold text-ink text-lg">Location</h2>

            <div>
              <label className={labelClass}>Neighborhood *</label>
              <select className={inputClass} value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} required>
                {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Street / Area Description <span className="font-normal text-muted">(optional)</span></label>
              <input type="text" className={inputClass} value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
          </div>

          <div className="bg-white border border-border-col rounded-card p-5 sm:p-6 space-y-5">
            <h2 className="font-display font-bold text-ink text-lg">Price &amp; terms</h2>

            <div>
              <label className={labelClass}>Monthly Rent (GHS) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-semibold select-none">GHS</span>
                <input type="number" inputMode="numeric" className={`${inputClass} pl-14`} value={form.price} onChange={e => set('price', e.target.value)} required min="0" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Advance Payment Required</label>
              <select className={inputClass} value={form.advanceMonths} onChange={e => set('advanceMonths', e.target.value)}>
                {['3', '6', '12', '18', '24'].map(m => <option key={m} value={m}>{m} months advance</option>)}
              </select>
            </div>

            <button
              type="button"
              onClick={() => set('priceNegotiable', !form.priceNegotiable)}
              className={cn(
                'flex items-center gap-3 w-full p-4 rounded-btn border-2 text-left transition-all duration-150',
                form.priceNegotiable ? 'border-ghana-green bg-ghana-green-50' : 'border-border-col bg-white'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                form.priceNegotiable ? 'border-ghana-green bg-ghana-green' : 'border-border-col'
              )}>
                {form.priceNegotiable && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={cn('text-sm font-medium', form.priceNegotiable ? 'text-ghana-green' : 'text-muted')}>
                Price is open to negotiation
              </span>
            </button>
          </div>

          <div className="bg-white border border-border-col rounded-card p-5 sm:p-6 space-y-5">
            <h2 className="font-display font-bold text-ink text-lg">Photos &amp; video</h2>

            {keepImages.length > 0 && (
              <div>
                <p className={labelClass}>Current photos</p>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {keepImages.map(url => (
                    <div key={url} className="relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Property photo" className="h-20 w-28 object-cover rounded-card border border-border-col" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        aria-label="Remove photo"
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink text-white flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label className="block border-2 border-dashed border-border-col hover:border-ghana-green rounded-card p-6 text-center cursor-pointer active:bg-ghana-green-50 transition-colors">
              <Upload className="w-6 h-6 mx-auto mb-2 text-muted" />
              <p className="text-ink font-semibold text-sm">Tap to add more photos</p>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleNewPhotos} />
            </label>

            {newPhotoPreviews.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {newPhotoPreviews.map((src, i) => (
                  <div key={i} className="relative flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`New photo ${i + 1}`} className="h-20 w-28 object-cover rounded-card border border-ghana-green" />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(i)}
                      aria-label="Remove photo"
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-ink text-white flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {totalPhotos === 0 && (
              <p className="text-ghana-red text-xs">At least 1 photo is required.</p>
            )}

            <div>
              <label className={labelClass}>Video walkthrough <span className="font-normal text-muted">(optional)</span></label>
              <input type="url" className={inputClass} placeholder="YouTube, TikTok, or WhatsApp video link" value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} />
            </div>
          </div>

          <div className="bg-white border border-border-col rounded-card p-5 sm:p-6 space-y-5">
            <h2 className="font-display font-bold text-ink text-lg">Contact</h2>

            <div>
              <label className={labelClass}>Your Full Name *</label>
              <input type="text" className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>

            <div>
              <label className={labelClass}>WhatsApp / Phone Number *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-semibold select-none">+233</span>
                <input type="tel" inputMode="numeric" className={`${inputClass} pl-16`} value={form.phone} onChange={e => set('phone', e.target.value)} required />
              </div>
            </div>
          </div>

          {submitError && (
            <div className="bg-ghana-red/10 border border-ghana-red/20 rounded-card p-3">
              <p className="text-ghana-red text-sm">{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full flex items-center justify-center gap-2 bg-ghana-green text-white font-bold text-sm py-3.5 rounded-btn hover:bg-ghana-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
