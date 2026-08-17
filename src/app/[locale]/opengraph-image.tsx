import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'MonkeyMan — Personal Travel Journal from Vietnam';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1f1c',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '560px',
            height: '560px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(127,170,142,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        {/* Subtle glow bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(127,170,142,0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0px',
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          {/* Label */}
          <div
            style={{
              fontSize: '18px',
              letterSpacing: '6px',
              color: '#7faa8e',
              textTransform: 'uppercase',
              marginBottom: '28px',
              fontFamily: 'sans-serif',
            }}
          >
            TRAVEL JOURNAL
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '96px',
              fontWeight: '700',
              color: '#ffffff',
              lineHeight: '1',
              marginBottom: '24px',
              fontFamily: 'serif',
              letterSpacing: '-2px',
            }}
          >
            MonkeyMan
          </div>

          {/* Divider */}
          <div
            style={{
              width: '64px',
              height: '3px',
              background: '#7faa8e',
              marginBottom: '28px',
              display: 'flex',
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: '28px',
              color: '#9ca3a0',
              lineHeight: '1.4',
              marginBottom: '36px',
              fontFamily: 'sans-serif',
              maxWidth: '700px',
            }}
          >
            Personal Travel Journal from Vietnam
          </div>

          {/* URL */}
          <div
            style={{
              fontSize: '20px',
              color: '#4a5550',
              fontFamily: 'sans-serif',
              letterSpacing: '2px',
            }}
          >
            monkeyman.vn
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
