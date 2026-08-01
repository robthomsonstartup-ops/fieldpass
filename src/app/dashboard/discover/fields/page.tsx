import { getAvailableFields } from '../../fields/actions'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

const FIELD_TYPES = ['Baseball', 'Softball', 'Multipurpose']
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
]

export default async function DiscoverFieldsPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; type?: string }>
}) {
  const sp = await searchParams
  const stateFilter = sp.state?.toUpperCase() ?? ''
  const typeFilter = sp.type ?? ''

  const fields = await getAvailableFields(stateFilter || undefined, typeFilter || undefined)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Link href="/dashboard/discover" style={{ fontSize: 12, color: 'rgba(232,241,251,0.4)', textDecoration: 'none' }}>
              ← Discover
            </Link>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#f0f6ff', letterSpacing: '-0.03em' }}>
            Find Fields
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,241,251,0.4)', marginTop: 4 }}>
            Diamonds available for rent — contact the org directly to book.
          </p>
        </div>
        <Link href="/dashboard/fields" style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(232,241,251,0.6)',
          fontSize: 12, fontWeight: 700, borderRadius: 8,
          padding: '9px 14px', textDecoration: 'none', whiteSpace: 'nowrap',
        }}>List My Fields →</Link>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: 10, marginTop: 20, marginBottom: 24, flexWrap: 'wrap' }}>
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
          {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="submit" style={{
          background: 'var(--org-primary, #1db954)', color: '#fff',
          fontSize: 13, fontWeight: 700, borderRadius: 8,
          padding: '8px 16px', border: 'none', cursor: 'pointer',
        }}>Filter</button>
        {(stateFilter || typeFilter) && (
          <Link href="/dashboard/discover/fields" style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(232,241,251,0.4)',
            fontSize: 13, fontWeight: 600, borderRadius: 8,
            padding: '8px 14px', textDecoration: 'none',
          }}>Clear</Link>
        )}
      </form>

      {fields.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '64px 32px',
          border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 14,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏟️</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(232,241,251,0.4)', marginBottom: 6 }}>
            No fields available{stateFilter ? ` in ${stateFilter}` : ''}{typeFilter ? ` for ${typeFilter}` : ''}.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.25)', marginBottom: 20 }}>
            Be the first — list your diamonds for rent.
          </p>
          <Link href="/dashboard/fields" style={{
            display: 'inline-block',
            background: 'var(--org-primary, #1db954)', color: '#ffffff',
            fontSize: 12, fontWeight: 800, borderRadius: 8,
            padding: '9px 18px', textDecoration: 'none',
          }}>List a field →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.35)', marginBottom: 4 }}>
            {fields.length} field{fields.length !== 1 ? 's' : ''} available
          </p>
          {fields.map((field: any) => {
            const org = field.organizations
            const primary = org?.primary_color ?? '#1db954'
            const secondary = org?.secondary_color ?? '#0d7740'
            const logoUrl = org?.logo_url ?? null
            const orgName = org?.name ?? 'Unknown org'
            const orgInitials = orgName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

            return (
              <div key={field.id} style={{
                background: '#0d1c2e',
                border: '1px solid rgba(255,255,255,0.07)',
                borderLeft: `3px solid ${secondary}`,
                borderRadius: 14,
                padding: '18px 20px',
              }}>
                {/* Org row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                    background: logoUrl ? '#fff' : primary,
                    border: `1px solid ${primary}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', position: 'relative',
                  }}>
                    {logoUrl ? (
                      <Image src={logoUrl} alt={orgName} fill sizes="26px" style={{ objectFit: 'contain', padding: 2 }} />
                    ) : (
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#fff' }}>{orgInitials}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(232,241,251,0.55)' }}>{orgName}</span>
                  {org?.city && (
                    <span style={{ fontSize: 11, color: 'rgba(232,241,251,0.3)' }}>· {org.city}{org.state ? `, ${org.state}` : ''}</span>
                  )}
                </div>

                {/* Field name + details */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f0f6ff', marginBottom: 4 }}>{field.name}</h3>
                    {(field.address || field.city) && (
                      <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.4)', marginBottom: 6 }}>
                        📍 {[field.address, field.city, field.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: field.rental_notes ? 8 : 0 }}>
                      {field.surface_type && (
                        <span style={{
                          fontSize: 11, fontWeight: 600,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 100, padding: '2px 8px', color: 'rgba(232,241,251,0.6)',
                        }}>{field.surface_type}</span>
                      )}
                      {field.field_type && (
                        <span style={{
                          fontSize: 11, fontWeight: 600,
                          background: `${primary}12`,
                          border: `1px solid ${primary}30`,
                          borderRadius: 100, padding: '2px 8px', color: primary,
                        }}>{field.field_type}</span>
                      )}
                    </div>
                    {field.rental_notes && (
                      <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.4)', marginTop: 6 }}>
                        {field.rental_notes}
                      </p>
                    )}
                  </div>

                  {/* Pricing + contact */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#f0f6ff', letterSpacing: '-0.03em', marginBottom: 2 }}>
                      {field.rental_rate_per_day
                        ? `$${(field.rental_rate_per_day / 100).toFixed(0)}`
                        : 'Contact'}
                    </div>
                    {field.rental_rate_per_day && (
                      <div style={{ fontSize: 10, color: 'rgba(232,241,251,0.35)', marginBottom: 8 }}>per day</div>
                    )}
                    {field.rental_contact_email && (
                      <a
                        href={`mailto:${field.rental_contact_email}?subject=Field rental inquiry: ${field.name}`}
                        style={{
                          display: 'inline-block',
                          background: primary,
                          color: '#fff',
                          fontSize: 12, fontWeight: 700,
                          borderRadius: 7, padding: '7px 14px',
                          textDecoration: 'none',
                        }}
                      >
                        Contact →
                      </a>
                    )}
                    {field.rental_contact_phone && !field.rental_contact_email && (
                      <a
                        href={`tel:${field.rental_contact_phone}`}
                        style={{
                          display: 'inline-block',
                          background: primary,
                          color: '#fff',
                          fontSize: 12, fontWeight: 700,
                          borderRadius: 7, padding: '7px 14px',
                          textDecoration: 'none',
                        }}
                      >
                        Call →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
