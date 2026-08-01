import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

const card = {
  background: '#0d1c2e',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 14,
  padding: '20px 22px',
} as const

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  color: 'rgba(232,241,251,0.35)',
  marginBottom: 12,
  display: 'block',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: orgs } = await (supabase as any)
    .from('organizations')
    .select('id, name, city, state, primary_color, secondary_color, logo_url')
    .eq('user_id', user!.id)

  const hasOrg = orgs && orgs.length > 0
  const org = orgs?.[0]
  const orgIds = (orgs ?? []).map((o: any) => o.id)

  const primary: string = org?.primary_color ?? '#1db954'
  const secondary: string = org?.secondary_color ?? '#0d7740'
  const logoUrl: string | null = org?.logo_url ?? null
  const orgName: string = org?.name ?? ''

  // Teams
  const { data: teams } = hasOrg
    ? await supabase.from('teams').select('id, name, age_group').in('organization_id', orgIds)
    : { data: [] }
  const teamIds = (teams ?? []).map((t: any) => t.id)

  // Fields count
  const { count: fieldCount } = hasOrg
    ? await supabase.from('fields').select('id', { count: 'exact', head: true }).in('organization_id', orgIds)
    : { count: 0 }

  // Pending incoming requests
  const { count: pendingIncoming } = teamIds.length > 0
    ? await supabase
        .from('game_requests')
        .select('id', { count: 'exact', head: true })
        .in('recipient_team_id', teamIds)
        .eq('status', 'pending')
    : { count: 0 }

  // Recent availability posts (last 3)
  const { data: recentPosts } = teamIds.length > 0
    ? await supabase
        .from('availability_posts')
        .select('id, date_start, date_end, game_format, status, teams(name, age_group)')
        .in('team_id', teamIds)
        .order('created_at', { ascending: false })
        .limit(3)
    : { data: [] }

  // Recent incoming requests (last 3)
  const { data: recentRequests } = teamIds.length > 0
    ? await supabase
        .from('game_requests')
        .select('id, status, created_at, requester_team_id, teams!game_requests_requester_team_id_fkey(name, organizations(name))')
        .in('recipient_team_id', teamIds)
        .order('created_at', { ascending: false })
        .limit(3)
    : { data: [] }

  // Setup checklist
  const hasAvailability = (recentPosts ?? []).length > 0
  const setupDone = hasOrg && (teams ?? []).length > 0 && (fieldCount ?? 0) > 0 && hasAvailability
  const setupSteps = [
    { done: hasOrg, label: 'Create your organization', href: '/dashboard/onboarding' },
    { done: (teams ?? []).length > 0, label: 'Add a team', href: '/dashboard/onboarding' },
    { done: (fieldCount ?? 0) > 0, label: 'Add a diamond', href: '/dashboard/fields/new' },
    { done: hasAvailability, label: 'Post your first availability', href: '/dashboard/availability/new' },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '36px 20px 48px' }}>

      {/* Header — logo + greeting */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
        {logoUrl && (
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: '#fff',
            border: `2px solid ${primary}40`,
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative',
          }}>
            <Image src={logoUrl} alt={orgName} fill sizes="56px" style={{ objectFit: 'contain', padding: 4 }} />
          </div>
        )}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.03em', color: '#f0f6ff', marginBottom: 3 }}>
            {hasOrg ? `${greeting}, ${orgName}` : `${greeting} 👋`}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,241,251,0.35)' }}>{user?.email}</p>
        </div>
      </div>

      {/* Pending alert */}
      {(pendingIncoming ?? 0) > 0 && (
        <Link href="/dashboard/requests" style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
          <div style={{
            background: 'rgba(217,119,6,0.08)',
            border: '1px solid rgba(217,119,6,0.3)',
            borderRadius: 12, padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: '#d97706', color: '#07111d',
                fontSize: 12, fontWeight: 900,
                borderRadius: '50%', width: 24, height: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{pendingIncoming}</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#d97706' }}>
                {pendingIncoming === 1 ? 'Game request waiting' : 'Game requests waiting'} for your response
              </span>
            </div>
            <span style={{ fontSize: 13, color: '#d97706' }}>Review →</span>
          </div>
        </Link>
      )}

      {/* Stat cards */}
      {hasOrg && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Teams', value: (teams ?? []).length },
            { label: 'Diamonds', value: fieldCount ?? 0 },
            { label: 'Posts', value: (recentPosts ?? []).length === 3 ? '3+' : recentPosts?.length ?? 0 },
          ].map((s) => (
            <div key={s.label} style={{ ...card, borderTop: `3px solid ${primary}` }}>
              <span style={labelStyle}>{s.label}</span>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#f0f6ff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Setup checklist */}
      {!setupDone && (
        <div style={{ ...card, marginBottom: 16 }}>
          <span style={labelStyle}>Getting started</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {setupSteps.map((step) => (
              <Link key={step.label} href={step.done ? '#' : step.href} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: step.done ? primary : 'rgba(255,255,255,0.06)',
                    border: step.done ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11,
                  }}>
                    {step.done && <span style={{ color: '#fff', fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: step.done ? 'rgba(232,241,251,0.35)' : '#f0f6ff',
                    textDecoration: step.done ? 'line-through' : 'none',
                  }}>
                    {step.label}
                  </span>
                  {!step.done && (
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: primary }}>→</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ ...card, marginBottom: 16 }}>
        <span style={labelStyle}>Quick actions</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/dashboard/availability/new" style={{
            background: primary, color: '#ffffff',
            fontSize: 13, fontWeight: 800, borderRadius: 8,
            padding: '9px 18px', textDecoration: 'none',
          }}>+ Post Availability</Link>
          <Link href="/dashboard/discover" style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${secondary}50`,
            color: secondary, fontSize: 13, fontWeight: 700,
            borderRadius: 8, padding: '9px 18px', textDecoration: 'none',
          }}>Discover Teams →</Link>
          <Link href="/dashboard/fields/new" style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: 'rgba(232,241,251,0.5)', fontSize: 13, fontWeight: 600,
            borderRadius: 8, padding: '9px 18px', textDecoration: 'none',
          }}>+ Add Diamond</Link>
        </div>
      </div>

      {/* Recent availability posts */}
      {(recentPosts ?? []).length > 0 && (
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ ...labelStyle, marginBottom: 0 }}>Recent availability</span>
            <Link href="/dashboard/availability" style={{ fontSize: 12, color: primary, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(recentPosts ?? []).map((post: any) => {
              const from = new Date(post.date_start + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              const to = new Date(post.date_end + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              const isOpen = post.status === 'open'
              return (
                <div key={post.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 8,
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 2 }}>
                      {post.teams?.name ?? 'Unknown team'} · {post.game_format}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(232,241,251,0.35)' }}>{from} – {to}</div>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                    borderRadius: 100, padding: '3px 8px',
                    background: isOpen ? `${primary}18` : 'rgba(255,255,255,0.05)',
                    color: isOpen ? primary : 'rgba(232,241,251,0.35)',
                    border: `1px solid ${isOpen ? primary + '40' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                    {post.status}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent incoming requests */}
      {(recentRequests ?? []).length > 0 && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ ...labelStyle, marginBottom: 0 }}>Recent requests</span>
            <Link href="/dashboard/requests" style={{ fontSize: 12, color: primary, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(recentRequests ?? []).map((req: any) => {
              const statusColor = req.status === 'accepted' ? primary : req.status === 'declined' ? '#f87171' : '#d97706'
              const requesterName = req.teams?.organizations?.name ?? req.teams?.name ?? 'Unknown'
              return (
                <div key={req.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>
                    from {requesterName}
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                    borderRadius: 100, padding: '3px 8px',
                    background: `${statusColor}18`,
                    color: statusColor,
                    border: `1px solid ${statusColor}40`,
                  }}>
                    {req.status}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Not onboarded CTA */}
      {!hasOrg && (
        <div style={{ ...card, textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚾</div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#f0f6ff', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Let&apos;s get you set up
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(232,241,251,0.4)', marginBottom: 24 }}>
            Create your organization and team to start finding games.
          </p>
          <Link href="/dashboard/onboarding" style={{
            background: primary, color: '#ffffff',
            fontSize: 14, fontWeight: 800, borderRadius: 9,
            padding: '12px 28px', textDecoration: 'none', display: 'inline-block',
          }}>Start Setup →</Link>
        </div>
      )}

    </div>
  )
}
