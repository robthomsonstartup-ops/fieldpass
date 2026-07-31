import { getGameRequests, updateRequestStatus } from './actions'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

const FORMAT_LABELS: Record<string, string> = {
  scrimmage: 'Scrimmage',
  showcase: 'Showcase',
  jamboree: 'Jamboree',
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

async function handleStatusUpdate(formData: FormData) {
  'use server'
  const requestId = formData.get('request_id') as string
  const status = formData.get('status') as 'accepted' | 'declined'
  await updateRequestStatus(requestId, status)
  revalidatePath('/dashboard/requests')
}

function RequestCard({
  request,
  direction,
}: {
  request: any
  direction: 'incoming' | 'outgoing'
}) {
  const otherTeam =
    direction === 'incoming' ? request.requester_team : request.recipient_team
  const otherOrg = otherTeam?.organizations

  const isAccepted = request.status === 'accepted'
  const isDeclined = request.status === 'declined'
  const isPending = request.status === 'pending'

  // Card border/bg based on status
  const cardStyle: React.CSSProperties = isAccepted
    ? {
        background: 'rgba(29,185,84,0.06)',
        border: '1px solid rgba(29,185,84,0.18)',
      }
    : isDeclined
    ? {
        background: 'rgba(220,38,38,0.04)',
        border: '1px solid rgba(220,38,38,0.12)',
      }
    : direction === 'incoming' && isPending
    ? {
        background: 'rgba(217,119,6,0.06)',
        border: '1px solid rgba(217,119,6,0.2)',
      }
    : {
        background: '#0d1c2e',
        border: '1px solid rgba(255,255,255,0.07)',
      }

  const statusDotColor = isAccepted
    ? '#1db954'
    : isDeclined
    ? '#dc2626'
    : direction === 'incoming'
    ? '#d97706'
    : 'rgba(232,241,251,0.3)'

  return (
    <div className="rounded-xl p-4" style={cardStyle}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: org + meta */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Status dot */}
          <div
            className="flex-shrink-0 rounded-full mt-1.5"
            style={{ width: 8, height: 8, background: statusDotColor }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span
                className="font-bold"
                style={{ fontSize: 14, color: '#f0f6ff' }}
              >
                {otherOrg?.name ?? otherTeam?.name ?? 'Unknown Program'}
              </span>
              {otherTeam?.age_group && (
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
                  {otherTeam.age_group}
                </span>
              )}
            </div>
            {otherOrg?.city && (
              <p style={{ fontSize: 11, color: 'var(--fp-dim)' }}>
                {otherOrg.city}, {otherOrg.state}
              </p>
            )}
          </div>
        </div>

        {/* Right: date + games */}
        <div className="text-right shrink-0">
          <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>
            {formatDate(request.proposed_date)}
          </p>
          <p style={{ fontSize: 11, color: 'var(--fp-dim)', marginTop: 2 }}>
            {request.num_games} game{request.num_games !== 1 ? 's' : ''} ·{' '}
            {FORMAT_LABELS[request.game_format] || request.game_format}
          </p>
        </div>
      </div>

      {/* Message */}
      {request.message && (
        <p
          className="mt-3 rounded-lg px-3 py-2"
          style={{
            fontSize: 12,
            color: 'var(--fp-muted)',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          &ldquo;{request.message}&rdquo;
        </p>
      )}

      {/* Next action */}
      <div className="mt-3 flex items-center gap-2">
        {direction === 'incoming' && isPending && (
          <>
            <form action={handleStatusUpdate}>
              <input type="hidden" name="request_id" value={request.id} />
              <input type="hidden" name="status" value="accepted" />
              <button
                type="submit"
                className="text-xs font-bold px-3 py-1.5 rounded-md transition-colors"
                style={{
                  background: 'rgba(29,185,84,0.15)',
                  border: '1px solid rgba(29,185,84,0.35)',
                  color: '#1db954',
                }}
              >
                Accept
              </button>
            </form>
            <form action={handleStatusUpdate}>
              <input type="hidden" name="request_id" value={request.id} />
              <input type="hidden" name="status" value="declined" />
              <button
                type="submit"
                className="text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--fp-muted)',
                }}
              >
                Decline
              </button>
            </form>
          </>
        )}

        {direction === 'outgoing' && isPending && (
          <p style={{ fontSize: 11, color: 'var(--fp-dim)' }}>
            Waiting for their response...
          </p>
        )}

        {isAccepted && (
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1db954' }}>
            ✓ Game confirmed for {formatDate(request.proposed_date)}
          </p>
        )}

        {isDeclined && direction === 'outgoing' && (
          <Link
            href="/dashboard/discover"
            style={{ fontSize: 11, fontWeight: 600, color: 'var(--fp-muted)', textDecoration: 'none' }}
          >
            Find another team →
          </Link>
        )}

        {isDeclined && direction === 'incoming' && (
          <p style={{ fontSize: 11, color: 'var(--fp-dim)' }}>Request declined</p>
        )}
      </div>
    </div>
  )
}

export default async function RequestsPage() {
  const { incoming, outgoing } = await getGameRequests()
  const pendingCount = incoming.filter((r: any) => r.status === 'pending').length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: '#f0f6ff', letterSpacing: '-0.03em' }}
          >
            Requests
          </h1>
          {pendingCount > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(217,119,6,0.15)', color: '#d97706', border: '1px solid rgba(217,119,6,0.25)' }}
            >
              {pendingCount} pending
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: 'var(--fp-muted)' }}>
          Incoming and outgoing game requests.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Incoming */}
        <section>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-3"
            style={{ color: 'var(--fp-dim)' }}
          >
            Incoming ({incoming.length})
            <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          </p>
          {incoming.length === 0 ? (
            <div
              className="text-center py-10 rounded-xl"
              style={{ border: '1px dashed rgba(255,255,255,0.08)' }}
            >
              <p style={{ fontSize: 13, color: 'var(--fp-dim)' }}>No incoming requests yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {incoming.map((r: any) => (
                <RequestCard key={r.id} request={r} direction="incoming" />
              ))}
            </div>
          )}
        </section>

        {/* Outgoing */}
        <section>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-3"
            style={{ color: 'var(--fp-dim)' }}
          >
            Outgoing ({outgoing.length})
            <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          </p>
          {outgoing.length === 0 ? (
            <div
              className="text-center py-10 rounded-xl"
              style={{ border: '1px dashed rgba(255,255,255,0.08)' }}
            >
              <p style={{ fontSize: 13, color: 'var(--fp-dim)' }}>
                You haven&apos;t sent any requests yet.
              </p>
              <Link
                href="/dashboard/discover"
                style={{ display: 'inline-block', marginTop: 12, fontSize: 12, fontWeight: 600, color: '#1db954', textDecoration: 'none' }}
              >
                Browse availability →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {outgoing.map((r: any) => (
                <RequestCard key={r.id} request={r} direction="outgoing" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
