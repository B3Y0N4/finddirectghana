'use client'

import { useState } from 'react'
import {
  Home, MapPin, Camera, Phone, CheckCircle, ChevronRight,
  Upload, DollarSign, Shield,
} from 'lucide-react'
import { propertyTypes, neighborhoods } from '@/lib/properties'

const steps = [
  { id: 1, label: 'Property Details', icon: <Home className="w-4 h-4" /> },
  { id: 2, label: 'Location',         icon: <MapPin className="w-4 h-4" /> },
  { id: 3, label: 'Price & Terms',    icon: <DollarSign className="w-4 h-4" /> },
  { id: 4, label: 'Photos & Video',   icon: <Camera className="w-4 h-4" /> },
  { id: 5, label: 'Contact & Verify', icon: <Phone className="w-4 h-4" /> },
]

const features = [
  'Generator', '24h Water', 'Air Conditioning', 'Security',
  'DSTV Ready', 'Balcony', 'Parking', 'Borehole Water',
  'Boys Quarters', 'Garden', 'Garage', 'Swimming Pool',
  'Gym', 'Fiber Internet', 'Tiled Floors', 'Furnished Kitchen',
]

export default function ListPage() {
  const [step, setStep]           = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    type: '',
    bedrooms: '',
    bathrooms: '',
    furnished: false,
    selectedFeatures: [] as string[],
    neighborhood: '',
    address: '',
    price: '',
    advanceMonths: '12',
    priceNegotiable: false,
    title: '',
    description: '',
    phone: '',
    name: '',
    agreeVerify: false,
  })

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass = 'w-full px-4 py-3 border border-border-col rounded-btn text-sm text-ink focus:outline-none focus:border-ghana-green focus:ring-1 focus:ring-ghana-green bg-white'
  const labelClass = 'block text-sm font-medium text-ink mb-1.5'

  if (submitted) {
    return (
      <div className="pt-nav min-h-screen flex items-center justify-center bg-page-bg px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-ghana-green flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display font-bold text-ink text-2xl mb-3">Listing Submitted!</h1>
          <p className="text-muted leading-relaxed mb-6">
            Thank you, <strong>{form.name}</strong>. Your listing is under review and will be live within a few hours. We&apos;ll send a confirmation to your WhatsApp number.
          </p>
          <div className="bg-ghana-green-50 border border-ghana-green-100 rounded-card p-4 text-left mb-6">
            <h3 className="font-semibold text-ghana-green text-sm mb-2">What happens next?</h3>
            <ol className="space-y-1.5 text-sm text-muted list-decimal list-inside">
              <li>Our team reviews your photos and description</li>
              <li>We verify your phone number via SMS</li>
              <li>Your listing goes live and starts receiving inquiries</li>
            </ol>
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(1); }}
            className="text-ghana-green font-semibold text-sm hover:underline"
          >
            Submit another listing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-nav bg-page-bg min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-border-col">
        <div className="max-w-content mx-auto px-4 lg:px-8 py-6">
          <h1 className="font-display font-bold text-ink text-2xl">List Your Property</h1>
          <p className="text-muted text-sm mt-1">100% free. Reach serious tenants directly. No agent needed.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <div className="flex items-center mb-8 overflow-x-auto no-scrollbar">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-shrink-0">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className="flex items-center gap-2"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                  s.id < step ? 'bg-ghana-green text-white' :
                  s.id === step ? 'bg-ghana-green text-white ring-4 ring-ghana-green/20' :
                  'bg-border-col text-muted'
                }`}>
                  {s.id < step ? <CheckCircle className="w-4 h-4" /> : s.id}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap hidden sm:block ${s.id === step ? 'text-ghana-green' : 'text-muted'}`}>
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className={`h-px w-6 sm:w-10 mx-2 flex-shrink-0 ${s.id < step ? 'bg-ghana-green' : 'bg-border-col'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-border-col rounded-card p-6 mb-4">

            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h2 className="font-display font-semibold text-ink text-lg mb-5">Property Details</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Property Type *</label>
                    <select className={inputClass} value={form.type} onChange={e => set('type', e.target.value)} required>
                      <option value="">Select type...</option>
                      {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                    <label className={labelClass}>Title (what tenants will see) *</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Furnished 2-Bedroom Apartment in East Legon"
                      value={form.title}
                      onChange={e => set('title', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      className={`${inputClass} h-28 resize-none`}
                      placeholder="Describe the property honestly — size, condition, key features, what makes it special..."
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Features & Amenities</label>
                    <div className="grid grid-cols-2 gap-2">
                      {features.map(f => (
                        <label key={f} className="flex items-center gap-2 cursor-pointer text-sm text-ink">
                          <input
                            type="checkbox"
                            checked={form.selectedFeatures.includes(f)}
                            onChange={() => toggleFeature(f)}
                            className="accent-ghana-green"
                          />
                          {f}
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-ink">
                    <input type="checkbox" checked={form.furnished} onChange={e => set('furnished', e.target.checked)} className="accent-ghana-green" />
                    This property is fully furnished
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h2 className="font-display font-semibold text-ink text-lg mb-5">Location</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Neighborhood *</label>
                    <select className={inputClass} value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} required>
                      <option value="">Select neighborhood...</option>
                      {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Street / Area Description</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. Near East Legon Police Station, behind Shoprite"
                      value={form.address}
                      onChange={e => set('address', e.target.value)}
                    />
                    <p className="text-muted text-xs mt-1.5">Exact GPS pin will be confirmed before listing goes live. Do not share your full address until you&apos;ve spoken to the tenant.</p>
                  </div>
                  <div className="bg-ghana-green-50 border border-ghana-green-100 rounded-card p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-ghana-green font-semibold text-sm">Location verification</p>
                        <p className="text-muted text-xs mt-1">After submission, our team will contact you to drop a GPS pin on the map. This pin is shown to tenants as an approximate location — exact address only shared with vetted tenants.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <h2 className="font-display font-semibold text-ink text-lg mb-5">Price & Terms</h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Monthly Rent (GHS) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">GHS</span>
                      <input
                        type="number"
                        className={`${inputClass} pl-14`}
                        placeholder="e.g. 3500"
                        value={form.price}
                        onChange={e => set('price', e.target.value)}
                        required
                        min="0"
                      />
                    </div>
                    <p className="text-muted text-xs mt-1.5">This is <strong>your actual price</strong> — the price tenants will see. No agent will add a markup. Please be accurate.</p>
                  </div>
                  <div>
                    <label className={labelClass}>Advance Payment Required</label>
                    <select className={inputClass} value={form.advanceMonths} onChange={e => set('advanceMonths', e.target.value)}>
                      {['3', '6', '12', '18', '24'].map(m => <option key={m} value={m}>{m} months advance</option>)}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={form.priceNegotiable}
                      onChange={e => set('priceNegotiable', e.target.checked)}
                      className="accent-ghana-green"
                    />
                    Price is open to negotiation
                  </label>
                  {form.price && (
                    <div className="bg-ghana-green-50 border border-ghana-green-100 rounded-card p-4">
                      <p className="text-ghana-green font-semibold text-sm mb-1">Price summary</p>
                      <p className="text-ink text-sm">Monthly: <strong>GHS {Number(form.price).toLocaleString()}</strong></p>
                      <p className="text-ink text-sm">Advance ({form.advanceMonths} months): <strong>GHS {(Number(form.price) * Number(form.advanceMonths)).toLocaleString()}</strong></p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>
                <h2 className="font-display font-semibold text-ink text-lg mb-2">Photos & Video</h2>
                <p className="text-muted text-sm mb-5">High-quality photos get 3× more inquiries. Include all rooms, exterior, and compound.</p>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border-col rounded-card p-8 text-center hover:border-ghana-green transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted mx-auto mb-3" />
                    <p className="text-ink font-medium text-sm mb-1">Tap to upload photos</p>
                    <p className="text-muted text-xs">Upload 5–20 original photos (JPEG, PNG · max 10MB each)</p>
                    <p className="text-muted text-xs mt-1">Photos must be your own — no stock photos or watermarked images</p>
                  </div>
                  <div>
                    <label className={labelClass}>Video walkthrough (optional)</label>
                    <input
                      type="url"
                      className={inputClass}
                      placeholder="YouTube, TikTok, or WhatsApp video link"
                    />
                    <p className="text-muted text-xs mt-1">A video walkthrough increases your inquiry rate by up to 60%</p>
                  </div>
                  <div className="bg-ghana-gold/10 border border-ghana-gold/30 rounded-card p-4">
                    <p className="text-ink font-semibold text-sm mb-1.5">Photo guidelines</p>
                    <ul className="text-muted text-xs space-y-1 list-disc list-inside">
                      <li>Natural daylight photos are best</li>
                      <li>Show every room — including kitchen and bathroom</li>
                      <li>Show the compound and entrance</li>
                      <li>Do not use photos from other listings</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div>
                <h2 className="font-display font-semibold text-ink text-lg mb-5">Contact & Verification</h2>
                <div className="space-y-5">
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
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">+233</span>
                      <input
                        type="tel"
                        className={`${inputClass} pl-14`}
                        placeholder="24 XXX XXXX"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        required
                      />
                    </div>
                    <p className="text-muted text-xs mt-1.5">We will send a verification code to this number. This is the number tenants will use to contact you.</p>
                  </div>

                  {/* Verification info */}
                  <div className="space-y-3">
                    <div className="bg-white border border-border-col rounded-card p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-ink text-sm">Ghana Card Verification (Recommended)</p>
                          <p className="text-muted text-xs mt-1">Verified owners receive a <span className="text-ghana-green font-semibold">Verified Owner badge</span> which increases inquiries by up to 80%. You can submit your Ghana Card after your listing is reviewed.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={form.agreeVerify}
                      onChange={e => set('agreeVerify', e.target.checked)}
                      className="accent-ghana-green mt-0.5 flex-shrink-0"
                      required
                    />
                    <span>I confirm that I am the owner (or authorised agent) of this property, the listing details are accurate, and the price shown is the actual asking price. I understand that misleading listings will be removed.</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-3 border border-border-col text-ink text-sm font-medium rounded-btn hover:bg-white transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 bg-ghana-green text-white font-semibold text-sm px-6 py-3 rounded-btn hover:bg-ghana-green-dark transition-colors"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!form.agreeVerify}
                className="flex items-center gap-2 bg-ghana-green text-white font-semibold text-sm px-8 py-3 rounded-btn hover:bg-ghana-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Submit Listing — Free
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
