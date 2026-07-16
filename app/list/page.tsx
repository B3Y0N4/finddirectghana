'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Home, MapPin, Camera, Phone, CheckCircle, ChevronRight,
  Upload, DollarSign, Shield, ArrowLeft, Star,
} from 'lucide-react'
import { propertyTypes, neighborhoods } from '@/lib/properties'
import { cn } from '@/lib/utils'

const steps = [
  { id: 1, label: 'Property', icon: Home      },
  { id: 2, label: 'Location', icon: MapPin     },
  { id: 3, label: 'Price',    icon: DollarSign },
  { id: 4, label: 'Photos',   icon: Camera     },
  { id: 5, label: 'Contact',  icon: Phone      },
]

const features = [
  'Generator', '24h Water', 'Air Conditioning', 'Security',
  'DSTV Ready', 'Balcony', 'Parking', 'Borehole Water',
  'Boys Quarters', 'Garden', 'Garage', 'Swimming Pool',
  'Gym', 'Fiber Internet', 'Tiled Floors', 'Furnished Kitchen',
]

export default function ListPage() {
  const router = useRouter()
  const [step, setStep]           = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    type: '', bedrooms: '', bathrooms: '', furnished: false,
    selectedFeatures: [] as string[], neighborhood: '', address: '',
    price: '', advanceMonths: '12', priceNegotiable: false,
    title: '', description: '', phone: '', name: '', agreeVerify: false,
  })

  const [cardFront,     setCardFront]     = useState('')
  const [cardBack,      setCardBack]      = useState('')
  const [selfie,        setSelfie]        = useState('')
  const [cardFrontFile, setCardFrontFile] = useState<File | null>(null)
  const [cardBackFile,  setCardBackFile]  = useState<File | null>(null)
  const [selfieFile,    setSelfieFile]    = useState<File | null>(null)
  const [photoFiles,    setPhotoFiles]    = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [videoUrl,      setVideoUrl]      = useState('')
  const [submitting,    setSubmitting]    = useState(false)
  const [submitError,   setSubmitError]   = useState('')

  // Pre-fill name from auth session
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(user => { if (user?.name) set('name', user.name) })
      .catch(() => {})
  }, [])

  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (v: string) => void,
    setFile: (f: File | null) => void,
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    setFile(file)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setPhotoFiles(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setPhotoPreviews(prev => [...prev, ev.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  function set(key: string, value: unknown) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function toggleFeature(f: string) {
    setForm(prev => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(f)
        ? prev.selectedFeatures.filter(x => x !== f)
        : [...prev.selectedFeatures, f],
    }))
  }

  function canProceed() {
    if (step === 1) return !!(form.type && form.bedrooms && form.bathrooms && form.title)
    if (step === 2) return !!form.neighborhood
    if (step === 3) return !!form.price
    if (step === 4) return photoFiles.length >= 3 && videoUrl.trim().length > 0
    if (step === 5) return !!(form.name && form.phone && form.agreeVerify)
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canProceed()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const fd = new FormData()
      fd.append('type',            form.type)
      fd.append('title',           form.title)
      fd.append('description',     form.description)
      fd.append('bedrooms',        form.bedrooms)
      fd.append('bathrooms',       form.bathrooms)
      fd.append('furnished',       String(form.furnished))
      fd.append('features',        JSON.stringify(form.selectedFeatures))
      fd.append('neighborhood',    form.neighborhood)
      fd.append('address',         form.address)
      fd.append('price',           form.price)
      fd.append('advanceMonths',   form.advanceMonths)
      fd.append('priceNegotiable', String(form.priceNegotiable))
      fd.append('name',            form.name)
      fd.append('phone',           form.phone)
      fd.append('videoUrl',        videoUrl)
      photoFiles.forEach((f, i) => fd.append(`photo_${i}`, f))
      if (cardFrontFile) fd.append('cardFront', cardFrontFile)
      if (cardBackFile)  fd.append('cardBack',  cardBackFile)
      if (selfieFile)    fd.append('selfie',    selfieFile)

      const res = await fetch('/api/listings', { method: 'POST', body: fd })
      if (res.status === 401) {
        setSubmitError('Your session expired — please sign in again.')
        setTimeout(() => router.push('/auth/login?next=/list'), 1800)
        return
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Submission failed')
      }
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full px-4 py-3.5 border border-border-col rounded-btn text-sm text-ink focus:outline-none focus:border-ghana-green focus:ring-1 focus:ring-ghana-green bg-white'
  const labelClass = 'block text-sm font-semibold text-ink mb-1.5'

  /* ── SUCCESS SCREEN ──────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="pt-nav min-h-screen bg-page-bg px-4 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-ghana-green flex items-center justify-center mx-auto mb-5 badge-pulse">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display font-bold text-ink text-2xl mb-2">You&apos;re submitted!</h1>
            <p className="text-muted text-sm leading-relaxed">
              Thank you, <strong className="text-ink">{form.name}</strong>. We&apos;ll confirm your listing to <strong className="text-ink">+233{form.phone}</strong> on WhatsApp.
            </p>
          </div>

          <div className="bg-white border border-border-col rounded-card p-5 mb-5">
            <h3 className="font-semibold text-ink text-sm mb-4">What happens next</h3>
            <div className="space-y-4">
              {[
                { n: '1', text: 'Our team reviews your photos and description', time: 'Within 2 hours' },
                { n: '2', text: 'We verify your phone number via WhatsApp',      time: 'Same day'      },
                { n: '3', text: 'Your listing goes live — tenants start contacting you', time: 'Within 24 hours' },
              ].map(({ n, text, time }) => (
                <div key={n} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-ghana-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[10px] font-bold">{n}</span>
                  </div>
                  <div>
                    <p className="text-sm text-ink">{text}</p>
                    <p className="text-xs text-ghana-green font-semibold mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/listings"
              className="flex items-center justify-center w-full bg-ghana-green text-white font-bold text-sm py-4 rounded-btn"
            >
              Browse active listings
            </Link>
            <button
              onClick={() => { setSubmitted(false); setStep(1); }}
              className="text-muted font-medium text-sm py-2 hover:text-ink transition-colors"
            >
              Submit another listing
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── MAIN FORM ───────────────────────────────────────────── */
  return (
    <div className="pt-nav bg-page-bg min-h-screen pb-10">

      {/* Hero */}
      <div className="bg-ghana-green-dark text-white relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-4 pt-9 pb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-ghana-gold-flag/15 border border-ghana-gold-flag/30 rounded-badge px-3 py-1.5 mb-4">
            <Star className="w-3 h-3 text-ghana-gold-flag fill-ghana-gold-flag" />
            <span className="text-ghana-gold-flag text-[11px] font-bold tracking-wider uppercase">100% Free — No Hidden Fees</span>
          </div>
          <h1 className="font-display font-bold text-white text-2xl sm:text-3xl mb-2 leading-snug">
            List your property.<br className="sm:hidden" /> Find your tenant.
          </h1>
          <p className="text-white/55 text-sm mb-5">
            No agent needed. No commission. Real tenants contact you directly on WhatsApp.
          </p>
          <div className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap">
            {['Free to list', 'Live in 24h', '0% commission', 'Direct WhatsApp'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-white/65 text-xs">
                <CheckCircle className="w-3 h-3 text-ghana-gold-flag flex-shrink-0" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">

        {/* Progress bar */}
        <div className="bg-white border border-border-col rounded-card px-4 py-3.5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted font-medium">Step {step} of {steps.length}</span>
            <span className="text-xs font-bold text-ghana-green">{steps[step - 1].label}</span>
          </div>
          <div className="h-1.5 bg-page-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-ghana-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2.5">
            {steps.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => step > s.id && setStep(s.id)}
                className={cn(
                  'text-[10px] font-semibold transition-colors',
                  s.id < step  ? 'text-ghana-green cursor-pointer' :
                  s.id === step ? 'text-ghana-green' :
                                  'text-muted cursor-default'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-border-col rounded-card p-5 sm:p-6 mb-4">

            {/* ── STEP 1: Property ──────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display font-bold text-ink text-lg">Property details</h2>
                  <p className="text-muted text-xs mt-0.5">Tell tenants what you&apos;re offering</p>
                </div>

                <div>
                  <label className={labelClass}>Property Type *</label>
                  <select className={inputClass} value={form.type} onChange={e => set('type', e.target.value)} required>
                    <option value="">Select type...</option>
                    {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Bedrooms *</label>
                    <select className={inputClass} value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} required>
                      <option value="">Select...</option>
                      {['Studio / 0', '1', '2', '3', '4', '5+'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms *</label>
                    <select className={inputClass} value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} required>
                      <option value="">Select...</option>
                      {['1', '2', '3', '4+'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Listing Title *</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Furnished 2-Bedroom in East Legon"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    required
                  />
                  <p className="text-muted text-xs mt-1">This is what tenants see first</p>
                </div>

                <div>
                  <label className={labelClass}>Description <span className="font-normal text-muted">(optional)</span></label>
                  <textarea
                    className={`${inputClass} h-24 resize-none`}
                    placeholder="Describe the property — size, condition, what makes it special..."
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                  />
                </div>

                {/* Feature pills */}
                <div>
                  <label className={labelClass}>Features <span className="font-normal text-muted">(tap to select)</span></label>
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

                {/* Furnished toggle */}
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
            )}

            {/* ── STEP 2: Location ──────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display font-bold text-ink text-lg">Location</h2>
                  <p className="text-muted text-xs mt-0.5">Where is your property?</p>
                </div>

                <div>
                  <label className={labelClass}>Neighborhood *</label>
                  <select className={inputClass} value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} required>
                    <option value="">Select neighborhood...</option>
                    {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Street / Area Description <span className="font-normal text-muted">(optional)</span></label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Near East Legon Police Station, behind Shoprite"
                    value={form.address}
                    onChange={e => set('address', e.target.value)}
                  />
                  <p className="text-muted text-xs mt-1.5">Do not share your full address until you&apos;ve spoken to the tenant.</p>
                </div>

                <div className="bg-ghana-green-50 border border-ghana-green-100 rounded-card p-4 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-ghana-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-ghana-green font-semibold text-sm">Location verified by our team</p>
                    <p className="text-muted text-xs mt-1 leading-relaxed">We&apos;ll confirm your GPS pin after submission. Tenants see an approximate area — exact address only shared with vetted tenants.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Price ─────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display font-bold text-ink text-lg">Price &amp; terms</h2>
                  <p className="text-muted text-xs mt-0.5">Set your real asking price — no agent markup</p>
                </div>

                <div>
                  <label className={labelClass}>Monthly Rent (GHS) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-semibold select-none">GHS</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={`${inputClass} pl-14`}
                      placeholder="e.g. 3500"
                      value={form.price}
                      onChange={e => set('price', e.target.value)}
                      required
                      min="0"
                    />
                  </div>
                  <p className="text-muted text-xs mt-1.5">
                    This is <strong className="text-ink">your actual price</strong>. Be accurate — tenants see exactly what you enter.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Advance Payment Required</label>
                  <select className={inputClass} value={form.advanceMonths} onChange={e => set('advanceMonths', e.target.value)}>
                    {['3', '6', '12', '18', '24'].map(m => <option key={m} value={m}>{m} months advance</option>)}
                  </select>
                </div>

                {/* Negotiable toggle */}
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

                {form.price && (
                  <div className="bg-ghana-green-50 border border-ghana-green-100 rounded-card p-4">
                    <p className="text-ghana-green font-semibold text-sm mb-2">Price summary</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Monthly rent</span>
                        <span className="font-bold text-ink">GHS {Number(form.price).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Advance ({form.advanceMonths} months)</span>
                        <span className="font-bold text-ink">GHS {(Number(form.price) * Number(form.advanceMonths)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 4: Photos ────────────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display font-bold text-ink text-lg">Photos &amp; video</h2>
                  <p className="text-muted text-xs mt-0.5">Good photos get 3× more inquiries</p>
                </div>

                <label className={cn(
                  'block border-2 border-dashed rounded-card p-8 text-center cursor-pointer active:bg-ghana-green-50 transition-colors',
                  photoFiles.length >= 3 ? 'border-ghana-green hover:border-ghana-green' : 'border-border-col hover:border-ghana-green'
                )}>
                  <Upload className={cn('w-8 h-8 mx-auto mb-2.5', photoFiles.length >= 3 ? 'text-ghana-green' : 'text-muted')} />
                  <p className="text-ink font-semibold text-sm mb-1">
                    {photoFiles.length === 0
                      ? 'Tap to upload photos'
                      : photoFiles.length < 3
                        ? `${photoFiles.length} photo${photoFiles.length > 1 ? 's' : ''} — need ${3 - photoFiles.length} more`
                        : `${photoFiles.length} photos — tap to add more`}
                  </p>
                  <p className={cn('text-xs', photoFiles.length >= 3 ? 'text-ghana-green font-semibold' : 'text-muted')}>
                    {photoFiles.length >= 3 ? '✓ Minimum met' : 'At least 3 photos required · JPEG or PNG'}
                  </p>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                </label>

                {photoPreviews.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {photoPreviews.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={src} alt={`Photo ${i + 1}`} className="h-20 w-28 object-cover rounded-card flex-shrink-0 border border-border-col" />
                    ))}
                  </div>
                )}

                <div className="bg-ghana-gold/10 border border-ghana-gold/25 rounded-card p-4">
                  <p className="text-ink font-semibold text-sm mb-2">Photo tips</p>
                  <ul className="text-muted text-xs space-y-1.5 list-disc list-inside leading-relaxed">
                    <li>Take photos in natural daylight</li>
                    <li>Show every room — kitchen and bathroom included</li>
                    <li>Show the compound and entrance</li>
                    <li>Use only your own original photos</li>
                  </ul>
                </div>

                <div>
                  <label className={labelClass}>Video walkthrough *</label>
                  <input
                    type="url"
                    className={inputClass}
                    placeholder="YouTube, TikTok, or WhatsApp video link"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    required
                  />
                  <p className="text-muted text-xs mt-1">Required · A video tour increases inquiries by up to 60%</p>
                </div>
              </div>
            )}

            {/* ── STEP 5: Contact & Verify ──────────────────────────── */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display font-bold text-ink text-lg">Contact &amp; verification</h2>
                  <p className="text-muted text-xs mt-0.5">How tenants will reach you</p>
                </div>

                <div>
                  <label className={labelClass}>Your Full Name *</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="As on your Ghana Card"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>WhatsApp / Phone Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-semibold select-none">+233</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      className={`${inputClass} pl-16`}
                      placeholder="24 XXX XXXX"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-muted text-xs mt-1.5">Tenants contact you on this number. A verification code will be sent first.</p>
                </div>

                {/* Ghana Card — grouped uploads */}
                <div className="border border-border-col rounded-card overflow-hidden">
                  <div className="bg-ghana-green-50 border-b border-ghana-green-100 px-4 py-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-ghana-green flex-shrink-0" />
                    <p className="font-semibold text-ghana-green text-sm flex-1">Ghana Card Verification</p>
                    <span className="text-[10px] font-bold text-ghana-green bg-ghana-green/10 px-2 py-0.5 rounded-badge">Recommended</span>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-muted text-xs leading-relaxed">
                      Verified owners get a <strong className="text-ghana-green">Verified Owner badge</strong> and 80% more inquiries. Data is encrypted and never shown publicly.
                    </p>

                    {[
                      { label: 'Ghana Card — Front', key: 'front', preview: cardFront, setPreview: setCardFront, setFile: setCardFrontFile, capture: 'environment' as const },
                      { label: 'Ghana Card — Back',  key: 'back',  preview: cardBack,  setPreview: setCardBack,  setFile: setCardBackFile,  capture: 'environment' as const },
                      { label: 'Selfie with card',   key: 'selfie',preview: selfie,     setPreview: setSelfie,    setFile: setSelfieFile,    capture: 'user' as const },
                    ].map(({ label, key, preview, setPreview, setFile, capture }) => (
                      <div key={key}>
                        <p className="text-sm font-medium text-ink mb-2">{label}</p>
                        <label className={cn(
                          'flex flex-col items-center justify-center border-2 border-dashed rounded-btn cursor-pointer transition-colors overflow-hidden',
                          preview ? 'border-ghana-green' : 'border-border-col hover:border-ghana-green/50'
                        )}>
                          {preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={preview} alt={label} className="w-full h-32 object-cover" />
                          ) : (
                            <div className="py-6 flex flex-col items-center gap-2">
                              <Upload className="w-5 h-5 text-muted" />
                              <p className="text-sm text-muted">Tap to take photo or upload</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            capture={capture}
                            className="hidden"
                            onChange={e => handleImageUpload(e, setPreview, setFile)}
                          />
                        </label>
                        {preview && (
                          <p className="text-ghana-green text-xs mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Uploaded
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agreement */}
                <label className="flex items-start gap-3 cursor-pointer bg-ghana-green-50 border border-ghana-green-100 rounded-card p-4">
                  <input
                    type="checkbox"
                    checked={form.agreeVerify}
                    onChange={e => set('agreeVerify', e.target.checked)}
                    className="accent-ghana-green mt-0.5 flex-shrink-0 w-4 h-4"
                    required
                  />
                  <span className="text-sm text-muted leading-relaxed">
                    I confirm I am the owner (or authorised agent) of this property. Details are accurate and the price is the actual asking price. Misleading listings will be removed.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="bg-ghana-red/10 border border-ghana-red/20 rounded-card p-3 mb-4">
              <p className="text-ghana-red text-sm">{submitError}</p>
            </div>
          )}

          {/* Navigation */}
          <div className={cn('flex gap-3', step > 1 ? 'justify-between' : 'justify-end')}>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 px-5 py-3.5 border border-border-col text-ink text-sm font-semibold rounded-btn hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => canProceed() && setStep(s => s + 1)}
                disabled={!canProceed()}
                className={cn(
                  'flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-btn transition-colors flex-1 sm:flex-initial',
                  canProceed()
                    ? 'bg-ghana-green text-white hover:bg-ghana-green-dark'
                    : 'bg-border-col text-muted cursor-not-allowed'
                )}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canProceed() || submitting}
                className="flex items-center justify-center gap-2 bg-ghana-green text-white font-bold text-sm px-8 py-3.5 rounded-btn hover:bg-ghana-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial"
              >
                <CheckCircle className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Listing — Free'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
