import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Sommar. A pessoa certa está ao seu lado.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const params = new URLSearchParams({
    family: `${family}:wght@${weight}`,
    display: 'swap',
  })
  const cssRes = await fetch(`https://fonts.googleapis.com/css2?${params}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })
  const css = await cssRes.text()
  const match = css.match(/src: url\((.+?)\) format/)
  if (!match?.[1]) throw new Error(`Font URL not found for ${family}`)
  return fetch(match[1]).then((r) => r.arrayBuffer())
}

export default async function Image() {
  const frauncesBold = await loadGoogleFont('Fraunces', 600).catch(() => null)
  const outfitLight = await loadGoogleFont('Outfit', 300).catch(() => null)

  const fonts = [
    frauncesBold && { name: 'Fraunces', data: frauncesBold, weight: 600 as const, style: 'normal' as const },
    outfitLight && { name: 'Outfit', data: outfitLight, weight: 300 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 600 | 300; style: 'normal' }[]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow verde top-left */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -80,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(29,255,168,0.22) 0%, rgba(0,212,255,0.08) 50%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Glow purple bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -80,
            width: 520,
            height: 520,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(236,72,153,0.08) 50%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Glow coral sutil ao centro */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: '15%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,61,0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Conteúdo central */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            padding: '0 80px',
          }}
        >
          {/* Linhas sinusoidais — representação do logomark */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 200,
                height: 5,
                borderRadius: 3,
                background:
                  'linear-gradient(90deg, #1DFFA8 0%, #00D4FF 50%, #A855F7 100%)',
                display: 'flex',
              }}
            />
            <div
              style={{
                width: 200,
                height: 5,
                borderRadius: 3,
                background:
                  'linear-gradient(90deg, #A855F7 0%, #EC4899 50%, #FFB840 100%)',
                display: 'flex',
              }}
            />
          </div>

          {/* Wordmark */}
          <div
            style={{
              fontSize: 128,
              fontWeight: 600,
              fontFamily: 'Fraunces, serif',
              color: '#ffffff',
              letterSpacing: '-5px',
              lineHeight: 1,
              marginBottom: 28,
            }}
          >
            sommar
          </div>

          {/* Tagline principal */}
          <div
            style={{
              fontSize: 34,
              fontWeight: 300,
              fontFamily: 'Outfit, sans-serif',
              color: 'rgba(255,255,255,0.80)',
              textAlign: 'center',
              lineHeight: 1.35,
              letterSpacing: '-0.5px',
              marginBottom: 16,
            }}
          >
            A pessoa certa está ao seu lado.
          </div>

          {/* Sub-tagline */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              fontFamily: 'Outfit, sans-serif',
              color: 'rgba(255,255,255,0.42)',
              textAlign: 'center',
              letterSpacing: 0,
            }}
          >
            Conexão humana real, facilitada por IA, nos eventos que você ama.
          </div>
        </div>

        {/* Linha gradiente na base */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              'linear-gradient(90deg, #1DFFA8 0%, #00D4FF 25%, #A855F7 60%, #EC4899 80%, #FFB840 100%)',
            display: 'flex',
          }}
        />

        {/* Domínio */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 48,
            fontSize: 18,
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: 1,
          }}
        >
          sommar.app
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  )
}
