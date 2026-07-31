import { getMyTeams, createAvailabilityPost, getMyFields } from '../actions'
import Link from 'next/link'

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

export default async function NewAvailabilityPostPage({ searchParams }: PageProps) {
  const params = await searchParams
  const error = params?.error

  const [teams, fields] = await Promise.all([getMyTeams(), getMyFields()])

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: '#f0f6ff', letterSpacing: '-0.03em' }}
        >
          Post Availability
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--fp-muted)' }}>
          Let other teams know when your team is available to play.
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

      {teams.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-sm" style={{ color: 'var(--fp-muted)' }}>
            You need to complete onboarding before posting availability.
          </p>
          <Link
            href="/dashboard/onboarding"
            style={{
              display: 'inline-block',
              marginTop: 12,
              fontSize: 12,
              fontWeight: 600,
              color: '#1db954',
              textDecoration: 'none',
            }}
          >
            Complete onboarding →
          </Link>
        </div>
      ) : (
        <form
          action={createAvailabilityPost}
          className="flex flex-col gap-5 rounded-xl p-6"
          style={{ background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Team */}
          <div>
            <label style={labelStyle}>
              Team <span style={{ color: '#1db954' }}>*</span>
            </label>
            <select name="team_id" required style={inputStyle}>
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.age_group})
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>
                Start Date <span style={{ color: '#1db954' }}>*</span>
              </label>
              <input type="date" name="date_start" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>
                End Date <span style={{ color: '#1db954' }}>*</span>
              </label>
              <input type="date" name="date_end" required style={inputStyle} />
            </div>
          </div>

          {/* Game format */}
          <div>
            <label style={labelStyle}>
              Game Format <span style={{ color: '#1db954' }}>*</span>
            </label>
            <select name="game_format" required style={inputStyle}>
              <option value="">Select format</option>
              <option value="scrimmage">Scrimmage</option>
              <option value="showcase">Showcase</option>
              <option value="jamboree">Jamboree</option>
            </select>
          </div>

          {/* Host type */}
          <div>
            <label style={labelStyle}>Hosting Preference</label>
            <select name="host_type" style={inputStyle}>
              <option value="">No preference</option>
              <option value="hosting">We&apos;ll host</option>
              <option value="traveling">We&apos;ll travel</option>
              <option value="either">Either</option>
            </select>
          </div>

          {/* Field / Diamond */}
          <div>
            <label style={labelStyle}>
              Field / Diamond
              {fields.length === 0 && (
                <Link
                  href="/dashboard/fields/new"
                  style={{ marginLeft: 8, color: '#1db954', fontWeight: 600, textDecoration: 'none' }}
                >
                  + Add a field
                </Link>
              )}
            </label>
            {fields.length > 0 ? (
              <select name="field_id" style={inputStyle}>
                <option value="">No specific field / TBD</option>
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}{f.city ? ` — ${f.city}, ${f.state}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'var(--fp-dim)',
                }}
              >
                No fields added yet.{' '}
                <Link
                  href="/dashboard/fields/new"
                  style={{ color: '#1db954', textDecoration: 'none', fontWeight: 600 }}
                >
                  Add a field →
                </Link>
              </div>
            )}
          </div>

          {/* Number of games */}
          <div>
            <label style={labelStyle}>Number of Games Desired</label>
            <input
              type="number"
              name="num_games_desired"
              min="1"
              max="10"
              placeholder="e.g. 2"
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Any additional details..."
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
              Post Availability
            </button>
            <Link
              href="/dashboard/availability"
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
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
