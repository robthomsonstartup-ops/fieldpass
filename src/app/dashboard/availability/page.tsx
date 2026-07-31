import { getAvailabilityPosts } from './actions'
import Link from 'next/link'

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-green-100 text-green-800',
  filled: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-500',
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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function AvailabilityPage() {
  const posts = await getAvailabilityPosts()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Availability</h1>
          <p className="text-gray-500 mt-1">Your posted availability windows.</p>
        </div>
        <Link
          href="/dashboard/availability/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Post New
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-500 text-sm">No availability posted yet.</p>
          <Link
            href="/dashboard/availability/new"
            className="mt-4 inline-block text-sm font-medium text-green-700 hover:underline"
          >
            Post your first availability →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {(post.teams as any)?.name}
                    </span>
                    {(post.teams as any)?.age_group && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {(post.teams as any).age_group}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(post.date_start)} – {formatDate(post.date_end)}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[post.status] || 'bg-gray-100 text-gray-600'}`}>
                  {post.status}
                </span>
              </div>

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
          ))}
        </div>
      )}
    </div>
  )
}
