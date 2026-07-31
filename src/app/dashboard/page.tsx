import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if onboarding is done
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id, name, city, state')
    .eq('user_id', user!.id)

  const hasOnboarded = orgs && orgs.length > 0
  const org = orgs?.[0]

  // Get team count
  let teamCount = 0
  if (hasOnboarded) {
    const orgIds = orgs.map((o) => o.id)
    const { count } = await supabase
      .from('teams')
      .select('id', { count: 'exact', head: true })
      .in('organization_id', orgIds)
    teamCount = count ?? 0
  }

  // Get pending request count
  let pendingIncoming = 0
  if (hasOnboarded) {
    const orgIds = orgs!.map((o) => o.id)
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
      pendingIncoming = count ?? 0
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-extrabold tracking-tight"
          style={{ color: '#f0f6ff', letterSpacing: '-0.03em' }}
        >
          {hasOnboarded ? `Welcome back${org?.name ? `, ${org.name}` : ''}` : 'Welcome to FieldPass'}
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--fp-muted)' }}>
          Signed in as {user?.email}
        </p>
      </div>

      {hasOnboarded ? (
        /* ── Onboarded: summary dashboard ── */
        <div className="flex flex-col gap-4">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div
              className="rounded-xl p-5"
              style={{ background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--fp-dim)' }}>
                Organization
              </p>
              <p className="text-base font-bold" style={{ color: '#f0f6ff' }}>{org?.name}</p>
              {org?.city && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--fp-dim)' }}>
                  {org.city}, {org.state}
                </p>
              )}
            </div>

            <div
              className="rounded-xl p-5"
              style={{ background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--fp-dim)' }}>
                Teams
              </p>
              <p className="text-2xl font-black" style={{ color: '#f0f6ff', letterSpacing: '-0.03em' }}>
                {teamCount}
              </p>
            </div>

            {pendingIncoming > 0 ? (
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(217,119,6,0.07)',
                  border: '1px solid rgba(217,119,6,0.2)',
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#d97706' }}>
                  Pending
                </p>
                <p className="text-2xl font-black" style={{ color: '#d97706', letterSpacing: '-0.03em' }}>
                  {pendingIncoming}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(217,119,6,0.7)' }}>requests</p>
              </div>
            ) : (
              <div
                className="rounded-xl p-5"
                style={{ background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--fp-dim)' }}>
                  Pending
                </p>
                <p className="text-2xl font-black" style={{ color: '#f0f6ff', letterSpacing: '-0.03em' }}>0</p>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--fp-dim)' }}>
              Quick actions
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/availability/new"
                style={{
                  background: '#1db954',
                  color: '#07111d',
                  fontSize: 13,
                  fontWeight: 800,
                  borderRadius: 8,
                  padding: '10px 18px',
                  textDecoration: 'none',
                }}
              >
                + Post Availability
              </Link>
              <Link
                href="/dashboard/discover"
                style={{
                  background: 'rgba(29,185,84,0.1)',
                  color: '#1db954',
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 8,
                  padding: '10px 18px',
                  textDecoration: 'none',
                  border: '1px solid rgba(29,185,84,0.3)',
                }}
              >
                Discover Teams →
              </Link>
              {pendingIncoming > 0 && (
                <Link
                  href="/dashboard/requests"
                  style={{
                    background: 'rgba(217,119,6,0.1)',
                    color: '#d97706',
                    fontSize: 13,
                    fontWeight: 700,
                    borderRadius: 8,
                    padding: '10px 18px',
                    textDecoration: 'none',
                    border: '1px solid rgba(217,119,6,0.3)',
                  }}
                >
                  View {pendingIncoming} Pending Request{pendingIncoming !== 1 ? 's' : ''} →
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Not onboarded: prompt to complete ── */
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl p-6"
            style={{ background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--fp-dim)' }}>
              Get started
            </p>
            <p className="text-lg font-bold mb-1" style={{ color: '#f0f6ff' }}>
              Complete your profile
            </p>
            <p className="text-sm mb-5" style={{ color: 'var(--fp-muted)' }}>
              Create your organization and team to start finding games and posting availability.
            </p>
            <Link
              href="/dashboard/onboarding"
              style={{
                display: 'inline-block',
                background: '#1db954',
                color: '#07111d',
                fontSize: 13,
                fontWeight: 800,
                borderRadius: 8,
                padding: '10px 18px',
                textDecoration: 'none',
              }}
            >
              Start onboarding →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
