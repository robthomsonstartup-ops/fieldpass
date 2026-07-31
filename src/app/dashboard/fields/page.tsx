import { getMyFields } from './actions'
import Link from 'next/link'

export default async function FieldsPage() {
  const fields = await getMyFields()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: '#f0f6ff', letterSpacing: '-0.03em' }}
          >
            My Fields
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--fp-muted)' }}>
            Diamonds and facilities your org has access to.
          </p>
        </div>
        <Link
          href="/dashboard/fields/new"
          style={{
            background: '#1db954',
            color: '#07111d',
            fontSize: 12,
            fontWeight: 800,
            borderRadius: 8,
            padding: '9px 16px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          + Add Field
        </Link>
      </div>

      {fields.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ border: '1px dashed rgba(255,255,255,0.1)' }}
        >
          <div className="text-3xl mb-3">⬡</div>
          <p className="text-sm font-medium" style={{ color: 'var(--fp-muted)' }}>
            No fields added yet.
          </p>
          <p className="text-xs mt-1 mb-5" style={{ color: 'var(--fp-dim)' }}>
            Add diamonds your org has access to — they&apos;ll appear as an option when posting availability.
          </p>
          <Link
            href="/dashboard/fields/new"
            style={{
              display: 'inline-block',
              background: '#1db954',
              color: '#07111d',
              fontSize: 12,
              fontWeight: 800,
              borderRadius: 8,
              padding: '9px 18px',
              textDecoration: 'none',
            }}
          >
            Add your first field →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {fields.map((field: any) => (
            <div
              key={field.id}
              className="rounded-xl p-5"
              style={{
                background: '#0d1c2e',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* Diamond icon */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-lg"
                    style={{
                      width: 40,
                      height: 40,
                      background: 'rgba(29,185,84,0.1)',
                      border: '1px solid rgba(29,185,84,0.2)',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>⬡</span>
                  </div>
                  <div>
                    <p
                      className="font-bold mb-0.5"
                      style={{ fontSize: 15, color: '#f0f6ff' }}
                    >
                      {field.name}
                    </p>
                    {(field.address || field.city) && (
                      <p style={{ fontSize: 12, color: 'var(--fp-dim)' }}>
                        {[field.address, field.city, field.state]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    {field.notes && (
                      <p className="mt-1.5" style={{ fontSize: 12, color: 'var(--fp-dim)' }}>
                        {field.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delete form */}
                <form
                  action={async () => {
                    'use server'
                    const { deleteField } = await import('./actions')
                    await deleteField(field.id)
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs font-medium px-3 py-1.5 rounded-md"
                    style={{
                      background: 'rgba(220,38,38,0.08)',
                      border: '1px solid rgba(220,38,38,0.15)',
                      color: 'rgba(248,113,113,0.7)',
                    }}
                  >
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
