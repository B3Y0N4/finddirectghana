import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Find Direct Ghana — Rent Directly from the Owner. No Agents. No Fees.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#004D2C',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Flag accent bar */}
      <div style={{ display: 'flex', height: 8, width: '100%' }}>
        <div style={{ flex: 1, background: '#CC0001' }} />
        <div style={{ flex: 1, background: '#006B3F' }} />
        <div style={{ flex: 1, background: '#FCD116' }} />
      </div>

      {/* Dot pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
        backgroundSize: '28px 28px',
        display: 'flex',
      }} />

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '52px 72px', justifyContent: 'space-between' }}>

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#006B3F',
            border: '2px solid rgba(252,209,22,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FCD116',
            fontWeight: 800,
            fontSize: 20,
            fontFamily: 'sans-serif',
          }}>
            FD
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: 22, fontFamily: 'sans-serif' }}>Find Direct</span>
            <span style={{ color: '#FCD116', fontWeight: 500, fontSize: 13, fontFamily: 'sans-serif', letterSpacing: 3 }}>GHANA</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(252,209,22,0.12)',
            border: '1px solid rgba(252,209,22,0.3)',
            borderRadius: 99,
            padding: '8px 20px',
            width: 'fit-content',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FCD116', display: 'flex' }} />
            <span style={{ color: '#FCD116', fontSize: 15, fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: 1 }}>
              Ghana's First Owner-Direct Rental Platform
            </span>
          </div>

          <span style={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 64,
            fontFamily: 'sans-serif',
            lineHeight: 1.1,
            letterSpacing: '-2px',
          }}>
            Rent directly from<br />
            <span style={{ color: '#FCD116' }}>the owner.</span>
          </span>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Zero Viewing Fees', 'Verified Owners', 'WhatsApp Direct', 'No Commission'].map(tag => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FCD116', display: 'flex' }} />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontFamily: 'sans-serif' }}>{tag}</span>
              </div>
            ))}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16, fontFamily: 'sans-serif' }}>finddirectghana.com</span>
        </div>
      </div>
    </div>,
    { ...size },
  )
}
