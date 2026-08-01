import { getMyUmpireProfile, getMyUmpireRequests, upsertUmpireProfile, toggleUmpireAvailability, respondToUmpireRequest } from '../actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const AGE_GROUPS = ['8U','10U','12U','14U','16U','18U','Adult']
const GAME_TYPES = ['Baseball','Softball']
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
  padding: '8px 12px',
  fontSize: 13,
  color: '#f0f6ff',
  outline: 'none',
  width: '100%',
} as const

const labelStyle = {
  fontSize: 11, color: 'rgba(232,241,251,0.4)',
  display: 'block', marginBottom: 4,
} as const

export default async function UmpireProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const sp = await searchParams
  const profile = await getMyUmpireProfile()
  const requests = await getMyUmpireRequests()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#f0f6ff', letterSpacing: '-0.03em' }}>
            My Umpire Profile
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,241,251,0.4)', marginTop: 4 }}>
            {profile ? 'Manage your profile and game requests.' : 'Create your profile to start getting booked.'}
          </p>
        </div>
        <Link href="/dashboard/discover/umpires" style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(232,241,251,0.6)',
          fontSize: 12, fontWeight: 700, borderRadius: 8,
          padding: '9px 14px', textDecoration: 'none',
        }}>Browse Umpires →</Link>
      </div>

      {sp.saved && (
        <div style={{
          background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.3)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          fontSize: 13, fontWeight: 600, color: '#1db954',
        }}>✓ Profile saved successfully.</div>
      )}
      {sp.error && (
        <div style={{
          background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          fontSize: 13, fontWeight: 600, color: '#f87171',
        }}>{sp.error}</div>
      )}

      {/* Availability toggle */}
      {profile && (
        <div style={{
          background: '#0d1c2e',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff' }}>
              {profile.available ? '🟢 Currently Available' : '🔴 Not Available'}
            </p>
            <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.4)', marginTop: 2 }}>
              {profile.available ? 'You appear in the umpire directory.' : 'Hidden from the directory.'}
            </p>
          </div>
          <form action={toggleUmpireAvailability.bind(null, !profile.available)}>
            <button type="submit" style={{
              background: profile.available ? 'rgba(220,38,38,0.12)' : 'rgba(29,185,84,0.12)',
              border: `1px solid ${profile.available ? 'rgba(220,38,38,0.3)' : 'rgba(29,185,84,0.3)'}`,
              color: profile.available ? '#f87171' : '#1db954',
              fontSize: 12, fontWeight: 700, borderRadius: 8,
              padding: '8px 16px', cursor: 'pointer',
            }}>
              {profile.available ? 'Go Unavailable' : 'Go Available'}
            </button>
          </form>
        </div>
      )}

      {/* Profile form */}
      <div style={{
        background: '#0d1c2e',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, padding: '22px 22px', marginBottom: 20,
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,241,251,0.35)', marginBottom: 18 }}>
          Profile Info
        </p>
        <form action={upsertUmpireProfile}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Full Name *</label>
              <input name="name" required type="text" defaultValue={profile?.name ?? ''} placeholder="John Smith" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input name="email" type="email" defaultValue={profile?.email ?? ''} placeholder="john@example.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input name="phone" type="tel" defaultValue={profile?.phone ?? ''} placeholder="(555) 000-0000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input name="city" type="text" defaultValue={profile?.city ?? ''} placeholder="Indianapolis" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <select name="state" defaultValue={profile?.state ?? ''} style={inputStyle}>
                <option value="">Select…</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Rate Per Game ($) *</label>
              <input name="rate_per_game" type="number" min="0" step="5" required
                defaultValue={profile?.rate_per_game ? profile.rate_per_game / 100 : ''}
                placeholder="50" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Years Experience</label>
              <input name="experience_years" type="number" min="0"
                defaultValue={profile?.experience_years ?? 0} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Travel Radius (miles)</label>
              <input name="travel_radius_miles" type="number" min="0" step="5"
                defaultValue={profile?.travel_radius_miles ?? 30} style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Certifications <span style={{ opacity: 0.5 }}>(comma-separated, e.g. BBO, OHSAA)</span></label>
              <input name="certifications" type="text"
                defaultValue={profile?.certifications?.join(', ') ?? ''}
                placeholder="BBO, OHSAA, NASO" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Bio</label>
              <textarea name="bio" rows={3}
                defaultValue={profile?.bio ?? ''}
                placeholder="Tell orgs about your experience and style..."
                style={{ ...inputStyle, resize: 'vertical' as const }} />
            </div>

            {/* Game types */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ ...labelStyle, marginBottom: 10 }}>Game Types</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {GAME_TYPES.map(gt => {
                  const checked = profile?.game_types?.includes(gt.toLowerCase()) ?? false
                  return (
                    <label key={gt} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input type="checkbox" name="game_types" value={gt.toLowerCase()} defaultChecked={checked} />
                      <span style={{ fontSize: 13, color: '#f0f6ff' }}>{gt}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Age groups */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ ...labelStyle, marginBottom: 10 }}>Age Groups</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {AGE_GROUPS.map(ag => {
                  const checked = profile?.age_groups?.includes(ag) ?? false
                  return (
                    <label key={ag} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input type="checkbox" name="age_groups" value={ag} defaultChecked={checked} />
                      <span style={{ fontSize: 13, color: '#f0f6ff' }}>{ag}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button type="submit" style={{
              background: 'var(--org-primary, #1db954)', color: '#fff',
              fontSize: 13, fontWeight: 800, borderRadius: 8,
              padding: '10px 24px', border: 'none', cursor: 'pointer',
            }}>
              {profile ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Stripe Connect */}
      {profile && (
        <div style={{
          background: '#0d1c2e',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '18px 22px', marginBottom: 20,
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,241,251,0.35)', marginBottom: 10 }}>
            Payments (Stripe)
          </p>
          {profile.stripe_onboarded ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, background: 'rgba(29,185,84,0.12)',
                border: '1px solid rgba(29,185,84,0.25)', color: '#1db954',
                borderRadius: 100, padding: '3px 10px',
              }}>✓ Connected</span>
              <span style={{ fontSize: 12, color: 'rgba(232,241,251,0.4)' }}>Orgs can pay you directly through FieldPass.</span>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: 'rgba(232,241,251,0.5)', marginBottom: 12 }}>
                Connect Stripe to accept payments from orgs. FieldPass takes a 10% platform fee per booking.
              </p>
              <a href="/api/stripe/connect/onboard" style={{
                display: 'inline-block',
                background: '#635bff', color: '#fff',
                fontSize: 13, fontWeight: 700, borderRadius: 8,
                padding: '9px 18px', textDecoration: 'none',
              }}>Connect with Stripe →</a>
            </div>
          )}
        </div>
      )}

      {/* Incoming requests */}
      {requests.length > 0 && (
        <div style={{
          background: '#0d1c2e',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '18px 22px',
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,241,251,0.35)', marginBottom: 16 }}>
            Game Requests
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {requests.map((req: any) => {
              const statusColor = req.status === 'accepted' ? '#1db954' : req.status === 'declined' ? '#f87171' : '#d97706'
              const gameDate = new Date(req.game_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
              return (
                <div key={req.id} style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>
                          {req.organizations?.name ?? 'Unknown org'}
                        </span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                          background: `${statusColor}18`, color: statusColor,
                          border: `1px solid ${statusColor}40`,
                          borderRadius: 100, padding: '2px 7px',
                        }}>{req.status}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.45)', marginBottom: 2 }}>
                        {gameDate} · {[req.game_format, req.age_group, req.location].filter(Boolean).join(' · ')}
                      </p>
                      {req.message && (
                        <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.35)', fontStyle: 'italic', marginTop: 4 }}>
                          &ldquo;{req.message}&rdquo;
                        </p>
                      )}
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#f0f6ff', marginTop: 6 }}>
                        ${(req.rate_agreed / 100).toFixed(0)} agreed rate
                        {req.payment_status !== 'unpaid' && (
                          <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(232,241,251,0.4)', marginLeft: 8 }}>
                            · {req.payment_status}
                          </span>
                        )}
                      </p>
                    </div>
                    {req.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <form action={respondToUmpireRequest.bind(null, req.id, 'accepted')}>
                          <button type="submit" style={{
                            background: 'rgba(29,185,84,0.12)',
                            border: '1px solid rgba(29,185,84,0.3)',
                            color: '#1db954', fontSize: 12, fontWeight: 700,
                            borderRadius: 7, padding: '6px 12px', cursor: 'pointer',
                          }}>Accept</button>
                        </form>
                        <form action={respondToUmpireRequest.bind(null, req.id, 'declined')}>
                          <button type="submit" style={{
                            background: 'rgba(220,38,38,0.08)',
                            border: '1px solid rgba(220,38,38,0.2)',
                            color: '#f87171', fontSize: 12, fontWeight: 700,
                            borderRadius: 7, padding: '6px 12px', cursor: 'pointer',
                          }}>Decline</button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
