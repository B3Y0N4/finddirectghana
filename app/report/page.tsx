'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { AlertTriangle, CheckCircle, Flag } from 'lucide-react'

const ISSUE_TYPES = [
  { value: 'fake',        label: 'Fake listing — property does not exist'        },
  { value: 'fraud',       label: 'Fraud — owner asked for money upfront illegally'},
  { value: 'wrong_price', label: 'Wrong price — listed price does not match reality'},
  { value: 'unresponsive',label: 'Unresponsive owner — number is wrong or dead'  },
  { value: 'wrong_photos',label: 'Wrong photos — images are not of this property'},
  { value: 'already_rented', label: 'Already rented — listing is outdated'       },
  { value: 'other',       label: 'Other issue'                                   },
]

const inputClass = 'w-full px-4 py-3 border border-border-col rounded-btn text-sm text-ink focus:outline-none focus:border-ghana-green focus:ring-1 focus:ring-ghana-green bg-white'
const labelClass = 'block text-sm font-medium text-ink mb-1.5'

export default function ReportPage() {
  const [form, setForm] = useState({ url: '', issueType: '', description: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="pt-nav min-h-screen flex items-center justify-center bg-page-bg px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-ghana-green flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display font-bold text-ink text-2xl mb-3">Report Received</h1>
          <p className="text-muted leading-relaxed mb-6">
            Thank you for helping keep Find Direct Ghana safe. Our team investigates every report within 24 hours. Listings confirmed as fraudulent are permanently removed and the owner is banned.
          </p>
          <div className="bg-ghana-green-50 border border-ghana-green-100 rounded-card p-4 text-left">
            <p className="font-semibold text-ghana-green text-sm mb-2">What happens next</p>
            <ol className="space-y-1.5 text-sm text-muted list-decimal list-inside">
              <li>Our team reviews the listing and your report</li>
              <li>We attempt to contact the owner for clarification</li>
              <li>If confirmed, the listing is removed within 24 hours</li>
              <li>Repeat offenders are permanently banned</li>
            </ol>
          </div>
          <button
            onClick={() => { setSubmitted(false); setForm({ url: '', issueType: '', description: '', phone: '' }) }}
            className="mt-6 text-ghana-green font-semibold text-sm hover:underline"
          >
            Submit another report
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-nav bg-page-bg min-h-screen">

      {/* Header */}
      <div className="bg-white border-b border-border-col">
        <div className="max-w-content mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ghana-red/10 flex items-center justify-center flex-shrink-0">
              <Flag className="w-5 h-5 text-ghana-red" />
            </div>
            <div>
              <h1 className="font-display font-bold text-ink text-xl">Report a Listing</h1>
              <p className="text-muted text-sm mt-0.5">Help us remove fake, fraudulent, or misleading listings.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Trust note */}
        <div className="bg-amber-50 border border-amber-200 rounded-card p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">Your report matters</p>
            <p className="text-amber-800/80 text-xs mt-0.5 leading-relaxed">
              Every report is reviewed by a real person within 24 hours. False reports made maliciously may result in action against the reporting account. Your contact number is kept confidential.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-border-col rounded-card p-6">

          <div>
            <label className={labelClass}>Listing URL or property name *</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. finddirectghana.com/property/furnished-2bed-east-legon"
              value={form.url}
              onChange={e => set('url', e.target.value)}
              required
            />
            <p className="text-muted text-xs mt-1.5">Copy the URL from the property page, or describe the listing title.</p>
          </div>

          <div>
            <label className={labelClass}>What is the issue? *</label>
            <div className="space-y-2">
              {ISSUE_TYPES.map(t => (
                <label key={t.value} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="issueType"
                    value={t.value}
                    checked={form.issueType === t.value}
                    onChange={() => set('issueType', t.value)}
                    className="accent-ghana-green w-4 h-4 flex-shrink-0"
                    required
                  />
                  <span className="text-sm text-ink/80 group-hover:text-ink leading-snug">{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Describe the problem *</label>
            <textarea
              className={`${inputClass} h-28 resize-none`}
              placeholder="What did you see that raised your concern? Be as specific as possible — dates, amounts, what the owner said..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Your phone number (optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">+233</span>
              <input
                type="tel"
                className={`${inputClass} pl-14`}
                placeholder="24 XXX XXXX"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
              />
            </div>
            <p className="text-muted text-xs mt-1.5">We may contact you if we need more details. Kept confidential.</p>
          </div>

          <button
            type="submit"
            disabled={!form.url || !form.issueType || !form.description}
            className="w-full flex items-center justify-center gap-2 bg-ghana-red text-white font-bold text-sm py-3.5 rounded-btn hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Flag className="w-4 h-4" />
            Submit Report
          </button>
        </form>

      </div>
    </div>
  )
}
