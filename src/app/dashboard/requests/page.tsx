import { getGameRequests, updateRequestStatus } from './actions'
import { revalidatePath } from 'next/cache'

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  cancelled:'bg-gray-100 text-gray-500',
}

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

function RequestCard({ request, direction }: { request: any; direction: 'incoming' | 'outgoing' }) {
  const otherTeam = direction === 'incoming'
    ? request.requester_team
    : request.recipient_team
  const otherOrg = otherTeam?.organizations

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-semibold text-gray-900">{otherOrg?.name}</span>
            {otherTeam?.age_group && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {otherTeam.age_group}
              </span>
            )}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[request.status] || 'bg-gray-100 text-gray-600'}`}>
              {request.status}
            </span>
          </div>
          {otherOrg?.city && (
            <p className="text-xs text-gray-400">{otherOrg.city}, {otherOrg.state}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-medium text-gray-700">{formatDate(request.proposed_date)}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {request.num_games} game{request.num_games !== 1 ? 's' : ''} · {FORMAT_LABELS[request.game_format] || request.game_format}
          </p>
        </div>
      </div>

      {request.message && (
        <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          &ldquo;{request.message}&rdquo;
        </p>
      )}

      {direction === 'incoming' && request.status === 'pending' && (
        <div className="mt-4 flex gap-2">
          <form action={handleStatusUpdate}>
            <input type="hidden" name="request_id" value={request.id} />
            <input type="hidden" name="status" value="accepted" />
            <button
              type="submit"
              className="bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-green-800 transition-colors"
            >
              Accept
            </button>
          </form>
          <form action={handleStatusUpdate}>
            <input type="hidden" name="request_id" value={request.id} />
            <input type="hidden" name="status" value="declined" />
            <button
              type="submit"
              className="border border-gray-300 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Decline
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default async function RequestsPage() {
  const { incoming, outgoing } = await getGameRequests()
  const pendingCount = incoming.filter((r: any) => r.status === 'pending').length

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Requests
          {pendingCount > 0 && (
            <span className="ml-2 text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
              {pendingCount} pending
            </span>
          )}
        </h1>
        <p className="text-gray-500 mt-1">Incoming and outgoing game requests.</p>
      </div>

      <div className="space-y-8">
        {/* Incoming */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Incoming ({incoming.length})
          </h2>
          {incoming.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400 text-sm">No incoming requests yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incoming.map((r: any) => (
                <RequestCard key={r.id} request={r} direction="incoming" />
              ))}
            </div>
          )}
        </section>

        {/* Outgoing */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Outgoing ({outgoing.length})
          </h2>
          {outgoing.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400 text-sm">You haven&apos;t sent any requests yet.</p>
              <a href="/dashboard/discover" className="mt-3 inline-block text-sm font-medium text-green-700 hover:underline">
                Browse availability →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
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
