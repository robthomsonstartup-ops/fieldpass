import { createField } from '../actions'
import { ZipLookup } from '@/components/ZipLookup'

interface PageProps {
  searchParams: Promise<{ error?: string }>
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  color: '#f0f6ff',
  outline: 'none',
}

const labelStyle = {
  display: 'block' as const,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--fp-muted)',
  marginBottom: 6,
  letterSpacing: '0.02em',
}

export default async function NewFieldPage({ searchParams }: PageProps) {
  const params = await searchParams
  const error = params?.error

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: '#f0f6ff', letterSpacing: '-0.03em' }}
        >
          Add a Field
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--fp-muted)' }}>
          Add a diamond your org has access to. It will appear as an option when posting availability.
        </p>
      </div>

      {error && (
        <div
          className="mb-5 rounded-lg px-4 py-3 text-sm"
          style={{
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.2)',
            color: '#f87171',
          }}
        >
          {decodeURIComponent(error)}
        </div>
      )}

      <form
        action={createField}
        className="flex flex-col gap-5 rounded-xl p-6"
        style={{ background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Field name */}
        <div>
          <label style={labelStyle}>
            Field / Diamond Name <span style={{ color: '#1db954' }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Center Grove LL Diamond 1"
            style={inputStyle}
          />
        </div>

        {/* Address */}
        <div>
          <label style={labelStyle}>Street Address</label>
          <input
            type="text"
            name="address"
            placeholder="e.g. 2701 S Morgantown Rd"
            style={inputStyle}
          />
        </div>

        {/* ZIP → City + State */}
        <ZipLookup />

        {/* Notes */}
        <div>
          <label style={labelStyle}>Notes</label>
          <textarea
            name="notes"
            rows={3}
            placeholder="e.g. Lights available, 60/90 diamond, parking on south side..."
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            style={{
              flex: 1,
              background: '#1db954',
              color: '#07111d',
              fontSize: 13,
              fontWeight: 800,
              borderRadius: 8,
              padding: '11px 0',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Add Field
          </button>
          <a
            href="/dashboard/fields"
            style={{
              flex: 1,
              textAlign: 'center' as const,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--fp-muted)',
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 8,
              padding: '11px 0',
              textDecoration: 'none',
              display: 'block',
            }}
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
