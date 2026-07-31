import { getMyAvailabilityPosts } from './actions'
import Link from 'next/link'

const STATUS_STYLES: Record<string, React.CSSProperties> = {
  open:      { background: 'rgba(29,185,84,0.12)', color: '#1db954', border: '1px solid rgba(29,185,84,0.25)' },
  filled:    { background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' },
  cancelled: { background: 'rgba(255,255,255,0.05)', color: 'var(--fp-dim)', border: '1px solid rgba(255,255,255,0.08)' },
}

const FORMAT_LABELS: Record<string, string> = {
  scrimmage: 'Scrimmage',
  showcase: 'Showcase',
  jamboree: 'Jamboree',
}

const HOST_LABELS: Record<string, string> = {
  hosting: 'Hosting',
  traveling: 'Traveling',
  either: 'Either',
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default async function AvailabilityPage() {
  const posts = await getMyAvailabilityPosts()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: '#f0f6ff', letterSpacing: '-0.03em' }}
          >
            My Availability
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--fp-muted)' }}>
            Your posted availability windows.
          </p>
        </div>
        <Link
          href="/dashboard/availability/new"
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
          + Post New
        </Link>
      </div>

      {posts.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl"
          style={{ border: '1px dashed rgba(255,255,255,0.1)' }}
        >
          <p className="text-sm" style={{ color: 'var(--fp-muted)' }}>
            No availability posted yet.
          </p>
          <Link
            href="/dashboard/availability/new"
            style={{
              display: 'inline-block',
              marginTop: 12,
              fontSize: 12,
              fontWeight: 600,
              color: '#1db954',
              textDecoration: 'none',
            }}
          >
            Post your first availability →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post: any) => {
            const team = post.teams as any
            const statusStyle = STATUS_STYLES[post.status] ?? STATUS_STYLES.cancelled

            return (
              <div
                key={post.id}
                className="rounded-xl p-5"
                style={{
                  background: '#0d1c2e',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="font-bold"
                        style={{ fontSize: 14, color: '#f0f6ff' }}
                      >
                        {team?.name}
                      </span>
                      {team?.age_group && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: 'var(--fp-dim)',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 4,
                            padding: '1px 7px',
                          }}
                        >
                          {team.age_group}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--fp-muted)' }}>
                      {formatDate(post.date_start)} – {formatDate(post.date_end)}
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold capitalize px-2.5 py-1 rounded-full flex-shrink-0"
                    style={statusStyle}
                  >
                    {post.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    FORMAT_LABELS[post.game_format] || post.game_format,
                    HOST_LABELS[post.host_type] || post.host_type,
                    `${post.num_games_desired} game${post.num_games_desired !== 1 ? 's' : ''}`,
                  ].map((chip) => (
                    <span
                      key={chip}
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--fp-muted)',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 4,
                        padding: '3px 9px',
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {post.notes && (
                  <p
                    className="mt-3 pt-3"
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
            )
          })}
        </div>
      )}
    </div>
  )
}
