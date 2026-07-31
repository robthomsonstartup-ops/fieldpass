import { getTeamsForUser, createAvailabilityPost } from '../actions'
import { redirect } from 'next/navigation'

export default async function NewAvailabilityPage() {
  const teams = await getTeamsForUser()

  if (teams.length === 0) {
    redirect('/dashboard/onboarding')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Post Availability</h1>
        <p className="text-gray-500 mt-1">Let other programs know when you&apos;re available to play.</p>
      </div>

      <form action={createAvailabilityPost} className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">

        {/* Team selector */}
        {teams.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
            <select
              name="team_id"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name} {team.age_group ? `(${team.age_group})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {teams.length === 1 && (
          <input type="hidden" name="team_id" value={teams[0].id} />
        )}

        {/* Date range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
            <input
              type="date"
              name="date_start"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
            <input
              type="date"
              name="date_end"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Game format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Game format</label>
          <select
            name="game_format"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select format</option>
            <option value="scrimmage">Scrimmage</option>
            <option value="showcase">Showcase</option>
            <option value="jamboree">Jamboree</option>
          </select>
        </div>

        {/* Host type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">We are...</label>
          <div className="flex gap-4">
            {[
              { value: 'hosting', label: 'Hosting' },
              { value: 'traveling', label: 'Traveling' },
              { value: 'either', label: 'Either' },
            ].map(opt => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="host_type"
                  value={opt.value}
                  required
                  className="accent-green-600"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Number of games */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Games desired</label>
          <input
            type="number"
            name="num_games_desired"
            defaultValue={2}
            min={1}
            max={10}
            className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400">(optional)</span></label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Field location, preferred times, any other details..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Post availability
          </button>
          <a
            href="/dashboard/availability"
            className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
