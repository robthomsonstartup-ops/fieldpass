import { sendGameRequest } from '../../actions'
import { createClient } from '@/lib/supabase/server'

async function getPostDetails(postId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('availability_posts')
    .select(`
      id, date_start, date_end, game_format, host_type, num_games_desired,
      teams (
        id, name, age_group,
        organizations (name, city, state)
      )
    `)
    .eq('id', postId)
    .single()
  return data
}

export default async function RequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ postId: string }>
  searchParams: Promise<{ myTeam?: string; format?: string }>
}) {
  const { postId } = await params
  const { myTeam, format } = await searchParams

  const post = await getPostDetails(postId)
  if (!post) return <div className="p-10 text-gray-500">Post not found.</div>

  const team = post.teams as any
  const org = team?.organizations

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Request a Game</h1>
        <p className="text-gray-500 mt-1">Send a game request to <span className="font-medium text-gray-700">{org?.name || 'this program'}</span></p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-sm text-gray-600">
        {org?.name && <p><span className="font-medium">{org.name}</span> {team?.age_group && `· ${team.age_group}`}</p>}
        {org?.city && <p className="mt-0.5">{org.city}, {org.state}</p>}
        <p className="mt-1 text-gray-500">
          Available: {new Date(post.date_start + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(post.date_end + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <form action={sendGameRequest} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
        <input type="hidden" name="requester_team_id" value={myTeam || ''} />
        <input type="hidden" name="recipient_team_id" value={team?.id || ''} />
        <input type="hidden" name="availability_post_id" value={post.id} />
        <input type="hidden" name="game_format" value={format || post.game_format} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proposed date</label>
          <input
            type="date"
            name="proposed_date"
            required
            min={post.date_start}
            max={post.date_end}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-400 mt-1">Must fall within their availability window</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of games</label>
          <input
            type="number"
            name="num_games"
            defaultValue={post.num_games_desired ?? undefined}
            min={1}
            max={10}
            className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-gray-400">(optional)</span></label>
          <textarea
            name="message"
            rows={4}
            placeholder="Introduce your program, share field details, ask questions..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Send request
          </button>
          <a
            href="/dashboard/discover"
            className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
