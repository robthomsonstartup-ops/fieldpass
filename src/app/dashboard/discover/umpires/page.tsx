import { getAvailableUmpires, bookUmpire } from '../../umpires/actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
]

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 7,
  padding: '7px 10px',
  fontSize: 12,
  color: '#f0f6ff',
  outline: 'none',
  width: '100%',
} as const

export default async function DiscoverUmpiresPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; type?: string; book?: string; booked?: string }>
}) {
  const sp = await searchParams
  const stateFilter = sp.state?.toUpperCase() ?? ''
  const typeFilter = sp.type ?? ''
  const bookingUmpireId = sp.book ?? null

  const umpires = await getAvailableUmpires(stateFilter || undefined, typeFilter || undefined)
  const bookingUmpire = bookingUmpireId ? umpires.find((u: any) => u.id === bookingUmpireId) ?? null : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <div style={{ marginBottom: 4 }}>
            <Link href="/dashboard/discover" style={{ fontSize: 12, color: 'rgba(232,241,251,0.4)', textDecoration: 'none' }}>
              ← Discover
            </Link>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#f0f6ff', letterSpacing: '-0.03em' }}>
            Find Umpires
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,241,251,0.4)', marginTop: 4 }}>
            Certified umpires available in your area.
          </p>
        </div>
        <Link href="/dashboard/umpires/profile" style={{
          background: 'var(--org-primary, #1db954)',
          color: '#fff',
          fontSize: 12, fontWeight: 700, borderRadius: 8,
          padding: '9px 14px', textDecoration: 'none', whiteSpace: 'nowrap',
        }}>My Umpire Profile →</Link>
      </div>

      {sp.booked && (
        <div style={{
          background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.3)',
          borderRadius: 10, padding: '12px 16px', margin: '16px 0',
          fontSize: 13, fontWeight: 600, color: '#1db954',
        }}>✓ Request sent! The umpire will respond soon.</div>
      )}

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: 10, marginTop: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <select name="state" defaultValue={stateFilter} style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, padding: '8px 12px',
          color: stateFilter ? '#f0f6ff' : 'rgba(232,241,251,0.35)',
          fontSize: 13, outline: 'none', cursor: 'pointer',
        }}>
          <option value="">All States</option>
          {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="type" defaultValue={typeFilter} style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, padding: '8px 12px',
          color: typeFilter ? '#f0f6ff' : 'rgba(232,241,251,0.35)',
          fontSize: 13, outline: 'none', cursor: 'pointer',
        }}>
          <option value="">All Types</option>
          <option value="baseball">Baseball</option>
          <option value="softball">Softball</option>
        </select>
        <button type="submit" style={{
          background: 'var(--org-primary, #1db954)', color: '#fff',
          fontSize: 13, fontWeight: 700, borderRadius: 8,
          padding: '8px 16px', border: 'none', cursor: 'pointer',
        }}>Filter</button>
        {(stateFilter || typeFilter) && (
          <Link href="/dashboard/discover/umpires" style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(232,241,251,0.4)',
            fontSize: 13, fontWeight: 600, borderRadius: 8,
            padding: '8px 14px', textDecoration: 'none',
          }}>Clear</Link>
        )}
      </form>

      {/* Booking modal panel */}
      {bookingUmpire && (
        <div style={{
          background: '#0d1c2e',
          border: '1px solid rgba(99,91,255,0.3)',
          borderRadius: 14, padding: '22px 22px', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#f0f6ff' }}>
              Book {bookingUmpire.name} — ${(bookingUmpire.rate_per_game / 100).toFixed(0)}/game
            </p>
            <Link href="/dashboard/discover/umpires" style={{
              fontSize: 12, color: 'rgba(232,241,251,0.4)', textDecoration: 'none',
            }}>✕ Cancel</Link>
          </div>
          <form action={bookUmpire.bind(null, bookingUmpire.id)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)', display: 'block', marginBottom: 4 }}>Game Date *</label>
                <input name="game_date" type="date" required style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)', display: 'block', marginBottom: 4 }}>Game Format</label>
                <select name="game_format" style={inputStyle}>
                  <option value="">Select…</option>
                  <option>Regular Season</option>
                  <option>Tournament</option>
                  <option>Scrimmage</option>
                  <option>Showcase</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)', display: 'block', marginBottom: 4 }}>Age Group</label>
                <select name="age_group" style={inputStyle}>
                  <option value="">Any</option>
                  {['8U','10U','12U','14U','16U','18U','Adult'].map(ag => <option key={ag}>{ag}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)', display: 'block', marginBottom: 4 }}>Location</label>
                <input name="location" type="text" placeholder="Field name or address" style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)', display: 'block', marginBottom: 4 }}>Message <span style={{ opacity: 0.5 }}>optional</span></label>
                <textarea name="message" rows={2} placeholder="Any details for the umpire..."
                  style={{ ...inputStyle, resize: 'vertical' as const }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
              <button type="submit" style={{
                background: '#635bff', color: '#fff',
                fontSize: 13, fontWeight: 800, borderRadius: 8,
                padding: '10px 22px', border: 'none', cursor: 'pointer',
              }}>Send Request</button>
              <p style={{ fontSize: 11, color: 'rgba(232,241,251,0.3)' }}>
                Agreed rate: ${(bookingUmpire.rate_per_game / 100).toFixed(0)}/game · 10% FieldPass fee applies
              </p>
            </div>
          </form>
        </div>
      )}

      {umpires.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '64px 32px',
          border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 14,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚾</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(232,241,251,0.4)', marginBottom: 6 }}>
            No umpires available{stateFilter ? ` in ${stateFilter}` : ''}.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.25)', marginBottom: 20 }}>
            Are you an umpire? Create a profile and start earning.
          </p>
          <Link href="/dashboard/umpires/profile" style={{
            display: 'inline-block',
            background: 'var(--org-primary, #1db954)', color: '#ffffff',
            fontSize: 12, fontWeight: 800, borderRadius: 8,
            padding: '9px 18px', textDecoration: 'none',
          }}>Create umpire profile →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.35)', marginBottom: 4 }}>
            {umpires.length} umpire{umpires.length !== 1 ? 's' : ''} available
          </p>
          {umpires.map((ump: any) => (
            <div key={ump.id} style={{
              background: '#0d1c2e',
              border: `1px solid ${bookingUmpireId === ump.id ? 'rgba(99,91,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 14, padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  {/* Name + rate */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(99,91,255,0.15)',
                      border: '1px solid rgba(99,91,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 800, color: '#c4c0ff',
                    }}>
                      {ump.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 800, color: '#f0f6ff', marginBottom: 1 }}>{ump.name}</p>
                      <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.4)' }}>
                        {[ump.city, ump.state].filter(Boolean).join(', ')}
                        {ump.travel_radius_miles ? ` · ${ump.travel_radius_miles}mi radius` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: ump.bio ? 8 : 0 }}>
                    {ump.experience_years > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '2px 8px', color: 'rgba(232,241,251,0.6)' }}>
                        {ump.experience_years}yr exp
                      </span>
                    )}
                    {(ump.game_types ?? []).map((gt: string) => (
                      <span key={gt} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(99,91,255,0.12)', border: '1px solid rgba(99,91,255,0.25)', borderRadius: 100, padding: '2px 8px', color: '#c4c0ff' }}>
                        {gt}
                      </span>
                    ))}
                    {(ump.age_groups ?? []).map((ag: string) => (
                      <span key={ag} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '2px 8px', color: 'rgba(232,241,251,0.5)' }}>
                        {ag}
                      </span>
                    ))}
                    {(ump.certifications ?? []).map((cert: string) => (
                      <span key={cert} style={{ fontSize: 11, fontWeight: 700, background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: 100, padding: '2px 8px', color: '#d97706' }}>
                        {cert}
                      </span>
                    ))}
                  </div>

                  {ump.bio && (
                    <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.4)', marginTop: 8, lineHeight: 1.5 }}>
                      {ump.bio.length > 120 ? ump.bio.slice(0, 120) + '…' : ump.bio}
                    </p>
                  )}
                </div>

                {/* Rate + Book */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#f0f6ff', letterSpacing: '-0.03em' }}>
                    ${(ump.rate_per_game / 100).toFixed(0)}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(232,241,251,0.35)', marginBottom: 10 }}>per game</div>
                  <Link href={`/dashboard/discover/umpires?book=${ump.id}${stateFilter ? `&state=${stateFilter}` : ''}${typeFilter ? `&type=${typeFilter}` : ''}`} style={{
                    display: 'inline-block',
                    background: '#635bff', color: '#fff',
                    fontSize: 12, fontWeight: 700,
                    borderRadius: 7, padding: '7px 14px',
                    textDecoration: 'none',
                  }}>
                    Book →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
