import { getMyFields, toggleFieldRental, deleteField } from './actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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

const SURFACE_TYPES = ['Grass', 'Turf', 'Dirt', 'Artificial']
const FIELD_TYPES = ['Baseball', 'Softball', 'Multipurpose']

export default async function FieldsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields: any[] = await getMyFields()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#f0f6ff', letterSpacing: '-0.03em' }}>
            My Fields
          </h1>
          <p style={{ fontSize: 13, color: 'var(--fp-muted)', marginTop: 4 }}>
            Diamonds your org owns or has access to.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/dashboard/discover/fields" style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(232,241,251,0.6)',
            fontSize: 12, fontWeight: 700, borderRadius: 8,
            padding: '9px 14px', textDecoration: 'none',
          }}>Find Fields →</Link>
          <Link href="/dashboard/fields/new" style={{
            background: 'var(--org-primary, #1db954)',
            color: '#ffffff',
            fontSize: 12, fontWeight: 800, borderRadius: 8,
            padding: '9px 16px', textDecoration: 'none',
          }}>+ Add Field</Link>
        </div>
      </div>

      {fields.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 32px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 14 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⬡</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--fp-muted)', marginBottom: 6 }}>No fields added yet.</p>
          <p style={{ fontSize: 12, color: 'var(--fp-dim)', marginBottom: 20 }}>Add diamonds your org has access to.</p>
          <Link href="/dashboard/fields/new" style={{
            display: 'inline-block',
            background: 'var(--org-primary, #1db954)',
            color: '#ffffff',
            fontSize: 12, fontWeight: 800, borderRadius: 8,
            padding: '9px 18px', textDecoration: 'none',
          }}>Add your first field →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fields.map((field) => (
            <div key={field.id} style={{
              background: '#0d1c2e',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              overflow: 'hidden',
            }}>
              {/* Field header */}
              <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    background: field.available_for_rent ? 'rgba(29,185,84,0.12)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${field.available_for_rent ? 'rgba(29,185,84,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>⬡</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff' }}>{field.name}</p>
                      {field.available_for_rent && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                          background: 'rgba(29,185,84,0.12)', color: '#1db954',
                          border: '1px solid rgba(29,185,84,0.25)',
                          borderRadius: 100, padding: '2px 7px',
                        }}>FOR RENT</span>
                      )}
                    </div>
                    {(field.address || field.city) && (
                      <p style={{ fontSize: 12, color: 'var(--fp-dim)', marginTop: 2 }}>
                        {[field.address, field.city, field.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {field.surface_type && (
                      <p style={{ fontSize: 11, color: 'var(--fp-dim)', marginTop: 2 }}>
                        {field.surface_type} · {field.field_type ?? 'Baseball'}
                        {field.rental_rate_per_day ? ` · $${(field.rental_rate_per_day / 100).toFixed(0)}/day` : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remove — standalone form, not nested */}
                <form action={deleteField.bind(null, field.id)}>
                  <button type="submit" style={{
                    background: 'rgba(220,38,38,0.08)',
                    border: '1px solid rgba(220,38,38,0.15)',
                    color: 'rgba(248,113,113,0.7)',
                    fontSize: 11, fontWeight: 600, borderRadius: 6,
                    padding: '5px 10px', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>Remove</button>
                </form>
              </div>

              {/* List for Rent section */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 18px', background: 'rgba(0,0,0,0.15)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(232,241,251,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                  List for Rent
                </p>

                {/* UPDATE form — sets available_for_rent: true */}
                <form action={toggleFieldRental.bind(null, field.id)}>
                  <input type="hidden" name="available_for_rent" value="true" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)', display: 'block', marginBottom: 4 }}>Surface</label>
                      <select name="surface_type" defaultValue={field.surface_type ?? ''} style={{ ...inputStyle, fontSize: 12 }}>
                        <option value="">Select…</option>
                        {SURFACE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)', display: 'block', marginBottom: 4 }}>Field Type</label>
                      <select name="field_type" defaultValue={field.field_type ?? ''} style={{ ...inputStyle, fontSize: 12 }}>
                        <option value="">Select…</option>
                        {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)', display: 'block', marginBottom: 4 }}>Rate/Day ($) <span style={{ opacity: 0.5 }}>optional</span></label>
                      <input name="rental_rate_per_day" type="number" min="0" step="5"
                        defaultValue={field.rental_rate_per_day ? field.rental_rate_per_day / 100 : ''}
                        placeholder="e.g. 150" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)', display: 'block', marginBottom: 4 }}>Contact Email</label>
                      <input name="rental_contact_email" type="email"
                        defaultValue={field.rental_contact_email ?? ''}
                        placeholder="fields@example.com" style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)', display: 'block', marginBottom: 4 }}>Notes</label>
                      <input name="rental_notes" type="text"
                        defaultValue={field.rental_notes ?? ''}
                        placeholder="Lights available, no metal cleats, etc." style={inputStyle} />
                    </div>
                  </div>
                  <button type="submit" style={{
                    background: 'var(--org-primary, #1db954)',
                    color: '#fff', fontSize: 12, fontWeight: 700,
                    borderRadius: 7, padding: '7px 16px', border: 'none', cursor: 'pointer',
                  }}>
                    {field.available_for_rent ? 'Update Listing' : 'List for Rent'}
                  </button>
                </form>

                {/* REMOVE LISTING — separate form, not nested */}
                {field.available_for_rent && (
                  <form action={toggleFieldRental.bind(null, field.id)} style={{ display: 'inline', marginLeft: 8 }}>
                    <input type="hidden" name="available_for_rent" value="false" />
                    <button type="submit" style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(232,241,251,0.5)',
                      fontSize: 12, fontWeight: 600,
                      borderRadius: 7, padding: '7px 14px', cursor: 'pointer',
                    }}>Remove Listing</button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
