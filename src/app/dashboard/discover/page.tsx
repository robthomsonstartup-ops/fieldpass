import { getDiscoverFeed, getMyTeams } from './actions'
import Link from 'next/link'

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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function DiscoverPage() {
  const [posts, myTeams] = await Promise.all([
    getDiscoverFeed(),
    getMyTeams(),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
        <p className="text-gray-500 mt-1">Browse open availability from programs near you.</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-500 text-sm">No availability posted by other programs yet.</p>
          <p className="text-gray-400 text-xs mt-2">Check back soon — or invite programs to join FieldPass.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => {
            const team = post.teams
            const org = team?.organizations
            return (
              <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-gray-900">{org?.name}</span>
                      {team?.age_group && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {team.age_group}
                        </span>
                      )}
                    </div>
                    {org?.city && (
                      <p className="text-xs text-gray-400">{org.city}, {org.state}</p>
                    )}
                  </div>
                  {myTeams.length > 0 && (
                    <Link
                      href={`/dashboard/discover/${post.id}/request?myTeam=${myTeams[0].id}&format=${post.game_format}`}
                      className="text-sm font-medium bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 transition-colors whitespace-nowrap"
                    >
                      Request Game
                    </Link>
                  )}
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {formatDate(post.date_start)} – {formatDate(post.date_end)}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                    {FORMAT_LABELS[post.game_format] || post.game_format}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                    {HOST_LABELS[post.host_type] || post.host_type}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                    {post.num_games_desired} game{post.num_games_desired !== 1 ? 's' : ''}
                  </span>
                </div>

                {post.notes && (
                  <p className="mt-3 text-sm text-gray-500 border-t border-gray-100 pt-3">{post.notes}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
