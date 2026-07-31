import { getDiscoverFeed, getMyTeams } from './actions'
import Link from 'next/link'

const FORMAT_LABELS: Record<string, string> = {
  scrimmage: 'Scrimmage',
  showcase: 'Showcase',
  jamboree: 'Jamboree',
}

const HOST_LABELS: Record<string, string> = {
  hosting: 'Host',
  traveling: 'Travel',
  either: 'Either',
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start + 'T00:00:00')
  const e = new Date(end + 'T00:00:00')
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  if (s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString('en-US', opts)
  }
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`
}

function parseAgeGroup(ageGroup: string): { num: string; suffix: string } {
  const match = ageGroup.match(/^(\d+)(.*)$/)
  if (match) return { num: match[1], suffix: match[2] || 'U' }
  return { num: ageGroup, suffix: '' }
}

export default async function DiscoverPage() {
  const [posts, myTeams] = await Promise.all([
    getDiscoverFeed(),
    getMyTeams(),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="relative overflow-hidden mb-6">
        {/* Subtle green glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -40, right: 0,
            width: 240, height: 180,
            background: 'radial-gradient(ellipse, rgba(29,185,84,0.07) 0%, transparent 70%)',
          }}
        />
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: '#f0f6ff', letterSpacing: '-0.03em' }}
        >
          Discover Teams
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--fp-muted)' }}>
          Browse open availability from programs near you.
        </p>
      </div>

      {/* Feed */}
      {posts.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ border: '1px dashed rgba(255,255,255,0.1)' }}
        >
          <p className="text-sm" style={{ color: 'var(--fp-muted)' }}>
            No availability posted by other programs yet.
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--fp-dim)' }}>
            Check back soon — or invite programs to join FieldPass.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post: any) => {
            const team = post.teams
            const org = team?.organizations
            const ageGroup = team?.age_group ?? ''
            const { num, suffix } = parseAgeGroup(ageGroup)
            const playLevel: string[] = Array.isArray(team?.play_level)
              ? team.play_level
              : team?.play_level
              ? [team.play_level]
              : []

            return (
              <div
                key={post.id}
                className="group rounded-xl transition-all"
                style={{
                  background: '#0d1c2e',
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: '16px 18px',
                  display: 'grid',
                  gridTemplateColumns: '54px 1fr auto',
                  gap: 14,
                  alignItems: 'start',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(29,185,84,0.3)'
                  el.style.background = '#0f2035'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                  el.style.background = '#0d1c2e'
                }}
              >
                {/* Age group block */}
                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 7,
                    paddingTop: 8,
                    paddingBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: '#f0f6ff',
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: 'var(--fp-dim)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginTop: 2,
                    }}
                  >
                    {suffix || 'U'}
                  </span>
                </div>

                {/* Body */}
                <div>
                  {/* Org name */}
                  <div
                    className="flex items-center gap-1.5 mb-0.5"
                    style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', letterSpacing: '-0.01em' }}
                  >
                    {org?.name ?? team?.name ?? 'Unknown Program'}
                  </div>

                  {/* Location */}
                  {org?.city && (
                    <p className="mb-2.5" style={{ fontSize: 12, color: 'var(--fp-dim)' }}>
                      {org.city}, {org.state}
                    </p>
                  )}

                  {/* Meta chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      style={{
                        fontSize: 11, fontWeight: 500,
                        color: 'rgba(232,241,251,0.55)',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 4, padding: '3px 8px',
                      }}
                    >
                      {formatDateRange(post.date_start, post.date_end)}
                    </span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(232,241,251,0.2)', flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: 11, fontWeight: 500,
                        color: 'var(--fp-muted)',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 4, padding: '3px 8px',
                      }}
                    >
                      {FORMAT_LABELS[post.game_format] || post.game_format}
                    </span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(232,241,251,0.2)', flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: 11, fontWeight: 500,
                        color: 'var(--fp-muted)',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 4, padding: '3px 8px',
                      }}
                    >
                      {HOST_LABELS[post.host_type] || post.host_type}
                    </span>
                  </div>

                  {/* Play level */}
                  {playLevel.length > 0 && (
                    <div
                      className="flex items-center gap-1 mt-2"
                      style={{ fontSize: 10, fontWeight: 600, color: 'var(--fp-dim)', letterSpacing: '0.04em' }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#d97706', flexShrink: 0 }} />
                      {playLevel.join(' · ')}
                    </div>
                  )}

                  {post.notes && (
                    <p
                      className="mt-2.5 pt-2.5"
                      style={{
                        fontSize: 12,
                        color: 'var(--fp-dim)',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {post.notes}
                    </p>
                  )}
                </div>

                {/* Action */}
                <div className="flex flex-col items-end gap-2 pt-0.5">
                  {myTeams.length > 0 ? (
                    <Link
                      href={`/dashboard/discover/${post.id}/request?myTeam=${myTeams[0].id}&format=${post.game_format}`}
                      style={{
                        background: '#1db954',
                        color: '#07111d',
                        fontSize: 12,
                        fontWeight: 800,
                        borderRadius: 7,
                        padding: '8px 15px',
                        whiteSpace: 'nowrap',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      Request Game
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/onboarding"
                      style={{
                        background: 'rgba(29,185,84,0.1)',
                        color: '#1db954',
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 7,
                        padding: '8px 12px',
                        whiteSpace: 'nowrap',
                        textDecoration: 'none',
                        display: 'inline-block',
                        border: '1px solid rgba(29,185,84,0.3)',
                      }}
                    >
                      Set up team
                    </Link>
                  )}
                  <span style={{ fontSize: 11, color: 'var(--fp-dim)', whiteSpace: 'nowrap' }}>
                    {post.num_games_desired} game{post.num_games_desired !== 1 ? 's' : ''} open
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
