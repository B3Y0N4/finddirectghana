import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: '#006B3F',
        width: '100%',
        height: '100%',
        borderRadius: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <span style={{ color: '#FCD116', fontWeight: 800, fontSize: 64, fontFamily: 'sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>
        FD
      </span>
      <span style={{ color: 'rgba(252,209,22,0.65)', fontSize: 20, fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: 3 }}>
        GHANA
      </span>
    </div>,
    { ...size },
  )
}
