import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Em produção, este mock será substituído por query ao Supabase
const MOCK_EVENT = {
  name: 'Sounds in da City',
  description:
    'O maior festival de música independente de Florianópolis. Três dias de sons, conexões e experiências únicas.',
  location_name: 'Costa da Lagoa, Florianópolis',
  start_time: '2026-04-15T18:00:00Z',
  interested_count: 247,
}

async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const params = new URLSearchParams({
      family: `${family}:wght@${weight}`,
      display: 'swap',
    })
    const cssRes = await fetch(`https://fonts.googleapis.com/css2?${params}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    const css = await cssRes.text()
    const match = css.match(/src: url\((.+?)\) format/)
    if (!match?.[1]) return null
    return fetch(match[1]).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  })
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  await params // reservado para buscar evento no Supabase em produção

  const [frauncesBold, outfitNormal] = await Promise.all([
    loadGoogleFont('Fraunces', 600),
    loadGoogleFont('Outfit', 400),
  ])

  const fonts = [
    frauncesBold && { name: 'Fraunces', data: frauncesBold, weight: 600 as const, style: 'normal' as const },
    outfitNormal && { name: 'Outfit', data: outfitNormal, weight: 400 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 600 | 400; style: 'normal' }[]

  const event = MOCK_EVENT

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow verde top-left */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(29,255,168,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Glow purple bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Tag Sommar no topo */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Mini logomark lines */}
          <div style={{ display: 'flex', gap: 4 }}>
            <div
              style={{
                width: 48,
                height: 3,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #1DFFA8, #00D4FF, #A855F7)',
                display: 'flex',
              }}
            />
            <div
              style={{
                width: 48,
                height: 3,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #A855F7, #EC4899, #FFB840)',
                display: 'flex',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 28,
              fontFamily: 'Fraunces, serif',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '-1px',
            }}
          >
            sommar
          </div>
        </div>

        {/* Conteúdo central — evento */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '80px 56px 60px',
          }}
        >
          {/* Pill "Evento" */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 18px',
                borderRadius: 100,
                border: '1px solid rgba(29,255,168,0.35)',
                background: 'rgba(29,255,168,0.08)',
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontFamily: 'Outfit, sans-serif',
                  color: '#1DFFA8',
                  letterSpacing: 1,
                  fontWeight: 400,
                }}
              >
                EVENTO
              </div>
            </div>
          </div>

          {/* Nome do evento */}
          <div
            style={{
              fontSize: 72,
              fontFamily: 'Fraunces, serif',
              fontWeight: 600,
              color: '#ffffff',
              letterSpacing: '-2px',
              lineHeight: 1.05,
              marginBottom: 24,
              maxWidth: 900,
            }}
          >
            {event.name}
          </div>

          {/* Descrição curta */}
          <div
            style={{
              fontSize: 26,
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.4,
              maxWidth: 800,
              marginBottom: 40,
            }}
          >
            {event.description}
          </div>

          {/* Meta: data, local, interessados */}
          <div
            style={{
              display: 'flex',
              gap: 32,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontFamily: 'Outfit, sans-serif',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              {formatDate(event.start_time)}
            </div>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex' }} />
            <div
              style={{
                fontSize: 20,
                fontFamily: 'Outfit, sans-serif',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              {event.location_name}
            </div>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex' }} />
            <div
              style={{
                fontSize: 20,
                fontFamily: 'Outfit, sans-serif',
                color: 'rgba(29,255,168,0.8)',
              }}
            >
              {event.interested_count} interessados
            </div>
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
      </div>
    ),
    {
      ...size,
      fonts,
    }
  )
}
