import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: '#006B3F',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FCD116',
        fontWeight: 700,
        fontSize: 13,
        fontFamily: 'sans-serif',
        letterSpacing: '-0.5px',
      }}
    >
      FD
    </div>,
    { ...size },
  )
}
