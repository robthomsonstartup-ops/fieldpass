import { getMyTeams, createAvailabilityPost } from '../actions'

interface PageProps {
  searchParams: { error?: string }
}

export default async function NewAvailabilityPostPage({ searchParams }: PageProps) {
  const teams = await getMyTeams()
  const error = searchParams?.error

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Post Availability</h1>
        <p className="text-gray-600 mt-1">Let other teams know when your team is available to play.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {decodeURIComponent(error)}
        </div>
      )}

      {teams.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">You need to add a team before posting availability.</p>
          <a href="/dashboard/teams/new" className="mt-4 inline-block text-blue-600 hover:underline">
            Add a team →
          </a>
        </div>
      ) : (
        <form action={createAvailabilityPost} className="space-y-6 bg-white border border-gray-200 rounded-lg p-6">
          <div>
            <label htmlFor="team_id" className="block text-sm font-medium text-gray-700 mb-1">
              Team <span className="text-red-500">*</span>
            </label>
            <select
              id="team_id"
              name="team_id"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.age_group})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date_start" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date_start"
                name="date_start"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="date_end" className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date_end"
                name="date_end"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="game_format" className="block text-sm font-medium text-gray-700 mb-1">
              Game Format <span className="text-red-500">*</span>
            </label>
            <select
              id="game_format"
              name="game_format"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select format</option>
              <option value="7v7">7v7</option>
              <option value="9v9">9v9</option>
              <option value="11v11">11v11</option>
              <option value="any">Any</option>
            </select>
          </div>

          <div>
            <label htmlFor="host_type" className="block text-sm font-medium text-gray-700 mb-1">
              Hosting Preference
            </label>
            <select
              id="host_type"
              name="host_type"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No preference</option>
              <option value="home">We'll host</option>
              <option value="away">We'll travel</option>
              <option value="neutral">Neutral site</option>
            </select>
          </div>

          <div>
            <label htmlFor="num_games_desired" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Games Desired
            </label>
            <input
              type="number"
              id="num_games_desired"
              name="num_games_desired"
              min="1"
              max="10"
              placeholder="e.g. 2"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Any additional details..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Post Availability
            </button>
            <a
              href="/dashboard/availability"
              className="flex-1 text-center border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </a>
          </div>
        </form>
      )}
    </div>
  )
}
