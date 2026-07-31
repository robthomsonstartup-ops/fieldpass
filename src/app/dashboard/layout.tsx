import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import { Logo } from '@/components/Logo'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get pending request count for badge
  let pendingCount = 0
  if (user) {
    const { data: orgs } = await supabase
      .from('organizations')
      .select('id')
      .eq('user_id', user.id)
    const orgIds = (orgs ?? []).map((o) => o.id)
    if (orgIds.length > 0) {
      const { data: teams } = await supabase
        .from('teams')
        .select('id')
        .in('organization_id', orgIds)
      const teamIds = (teams ?? []).map((t) => t.id)
      if (teamIds.length > 0) {
        const { count } = await supabase
          .from('game_requests')
          .select('id', { count: 'exact', head: true })
          .in('recipient_team_id', teamIds)
          .eq('status', 'pending')
        pendingCount = count ?? 0
      }
    }
  }

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : '??'

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '⬡' },
    { href: '/dashboard/availability', label: 'Availability', icon: '📅' },
    { href: '/dashboard/discover', label: 'Discover', icon: '🔍' },
    { href: '/dashboard/requests', label: 'Requests', icon: '📥', badge: pendingCount },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07111d', color: '#f0f6ff' }}>

      {/* ── TOP NAV ── */}
      <nav
        className="sticky top-0 z-20 flex items-center justify-between px-5"
        style={{
          height: 56,
          background: 'rgba(7,17,29,0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left: logo */}
        <Link href="/dashboard">
          <Logo />
        </Link>

        {/* Center: nav links (desktop only) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ color: 'var(--fp-muted)' }}
            >
              {link.label}
              {link.badge ? (
                <span
                  className="flex items-center justify-center text-white font-bold"
                  style={{
                    fontSize: 10,
                    background: '#dc2626',
                    borderRadius: 10,
                    minWidth: 16,
                    height: 16,
                    padding: '0 4px',
                  }}
                >
                  {link.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </div>

        {/* Right: avatar + sign out */}
        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center justify-center rounded-full text-xs font-bold"
            style={{
              width: 30,
              height: 30,
              background: 'linear-gradient(135deg, #1db954, #0d7740)',
              color: '#07111d',
            }}
            title={user?.email}
          >
            {initials}
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{
                color: 'var(--fp-muted)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      {/* ── BODY: sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (desktop only) */}
        <aside
          className="hidden md:flex flex-col flex-shrink-0 py-5"
          style={{
            width: 200,
            background: '#07111d',
            borderRight: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="px-3 flex flex-col gap-0.5">
            <p
              className="text-xs font-semibold uppercase tracking-widest px-2 mb-1.5 mt-1"
              style={{ color: 'var(--fp-dim)' }}
            >
              My team
            </p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: 'var(--fp-muted)' }}
              >
                <span className="w-4 text-center text-sm">{link.icon}</span>
                {link.label}
                {link.badge ? (
                  <span
                    className="ml-auto flex items-center justify-center text-white font-bold"
                    style={{
                      fontSize: 10,
                      background: '#dc2626',
                      borderRadius: 10,
                      minWidth: 16,
                      height: 16,
                      padding: '0 4px',
                    }}
                  >
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 md:hidden flex items-center justify-around z-20"
        style={{
          height: 64,
          background: 'rgba(7,17,29,0.98)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="relative flex flex-col items-center gap-1 px-3 py-2"
            style={{ color: 'var(--fp-dim)' }}
          >
            <span className="text-lg leading-none">{link.icon}</span>
            <span className="text-[10px] font-medium">{link.label}</span>
            {link.badge ? (
              <span
                className="absolute top-1 right-1 flex items-center justify-center text-white font-bold"
                style={{
                  fontSize: 9,
                  background: '#dc2626',
                  borderRadius: 10,
                  minWidth: 14,
                  height: 14,
                  padding: '0 3px',
                }}
              >
                {link.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    </div>
  )
}
