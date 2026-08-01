import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import { Logo } from '@/components/Logo'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch org brand + pending count in parallel
  let pendingCount = 0
  let orgBrand: { primary_color: string | null; secondary_color: string | null; logo_url: string | null; name: string | null } | null = null

  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: orgs } = await (supabase as any)
      .from('organizations')
      .select('id, name, primary_color, secondary_color, logo_url')
      .eq('user_id', user.id)
      .limit(1)

    const org = orgs?.[0] ?? null
    orgBrand = org

    if (org?.id) {
      const { data: teams } = await supabase
        .from('teams')
        .select('id')
        .eq('organization_id', org.id)
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

  const primary = orgBrand?.primary_color ?? '#1db954'
  const secondary = orgBrand?.secondary_color ?? '#0d7740'
  const logoUrl = orgBrand?.logo_url ?? null
  const orgName = orgBrand?.name ?? null
  const initials = orgName
    ? orgName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? '?')

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '⬡' },
    { href: '/dashboard/availability', label: 'Availability', icon: '📅' },
    { href: '/dashboard/fields', label: 'Fields', icon: '🏟️' },
    { href: '/dashboard/discover', label: 'Discover', icon: '🔍' },
    { href: '/dashboard/requests', label: 'Requests', icon: '📥', badge: pendingCount },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: '#07111d',
        color: '#f0f6ff',
        // Inject org brand as CSS vars — all children inherit
        '--org-primary': primary,
        '--org-secondary': secondary,
      } as React.CSSProperties}
    >

      {/* ── TOP NAV ── */}
      <nav
        className="sticky top-0 z-20 flex items-center justify-between px-5"
        style={{
          height: 56,
          background: 'rgba(7,17,29,0.97)',
          borderBottom: `1px solid ${primary}22`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left: FieldPass logo */}
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

        {/* Right: org logo avatar + sign out */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/settings"
            className="hidden sm:flex items-center justify-center rounded-full overflow-hidden"
            style={{
              width: 32,
              height: 32,
              background: logoUrl ? '#fff' : `linear-gradient(135deg, ${primary}, ${secondary})`,
              flexShrink: 0,
              border: `2px solid ${primary}55`,
              textDecoration: 'none',
              position: 'relative',
            }}
            title={orgName ?? user?.email ?? 'Settings'}
          >
            {logoUrl ? (
              <Image src={logoUrl} alt={orgName ?? 'Logo'} fill sizes="32px" style={{ objectFit: 'contain', padding: 3 }} />
            ) : (
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{initials}</span>
            )}
          </Link>
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
            borderRight: `1px solid ${primary}18`,
          }}
        >
          {/* Org identity card */}
          <div
            style={{
              margin: '0 12px 16px',
              borderRadius: 10,
              padding: '10px 12px',
              background: `${primary}10`,
              border: `1px solid ${primary}25`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {/* Logo or initials */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: logoUrl ? '#fff' : primary,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                border: `1px solid ${primary}40`,
              }}
            >
              {logoUrl ? (
                <Image src={logoUrl} alt={orgName ?? 'Logo'} fill sizes="36px" style={{ objectFit: 'contain', padding: 3 }} />
              ) : (
                <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{initials}</span>
              )}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#f0f6ff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {orgName ?? 'My Program'}
              </p>
              <p style={{ fontSize: 10, color: 'var(--fp-dim)', margin: 0 }}>FieldPass</p>
            </div>
          </div>

          <div className="px-3 flex flex-col gap-0.5">
            <p
              className="text-xs font-semibold uppercase tracking-widest px-2 mb-1.5"
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

          {/* Bottom accent bar */}
          <div style={{ marginTop: 'auto', margin: '16px 12px 0', height: 3, borderRadius: 2, background: `linear-gradient(to right, ${primary}, ${secondary})` }} />
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
          borderTop: `1px solid ${primary}25`,
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
