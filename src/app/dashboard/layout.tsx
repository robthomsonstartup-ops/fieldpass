import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: brand + nav links */}
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-green-700 font-bold text-lg tracking-tight">
                Fieldpass
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/availability"
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Availability
                </Link>
                <Link
                  href="/dashboard/discover"
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Discover
                </Link>
                <Link
                  href="/dashboard/requests"
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Requests
                </Link>
              </div>
            </div>

            {/* Right: user email + sign out */}
            <div className="flex items-center gap-4">
              {user?.email && (
                <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
              )}
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  )
}
