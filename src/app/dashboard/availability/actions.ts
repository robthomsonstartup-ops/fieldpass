'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Database } from '@/lib/database.types'

function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

async function getMyOrgIds(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', userId)
  return (data ?? []).map((o) => o.id)
}

export async function getMyTeams() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const orgIds = await getMyOrgIds(supabase, user.id)
  if (!orgIds.length) return []

  const { data } = await supabase
    .from('teams')
    .select('id, name, age_group')
    .in('organization_id', orgIds)

  return data ?? []
}

export async function getMyAvailabilityPosts() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const orgIds = await getMyOrgIds(supabase, user.id)
  if (!orgIds.length) return []

  const { data: teams } = await supabase
    .from('teams')
    .select('id')
    .in('organization_id', orgIds)

  const teamIds = (teams ?? []).map((t) => t.id)
  if (!teamIds.length) return []

  const { data } = await supabase
    .from('availability_posts')
    .select(`
      id, date_start, date_end, game_format, host_type,
      num_games_desired, notes, status, created_at,
      teams(id, name, age_group)
    `)
    .in('team_id', teamIds)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function createAvailabilityPost(formData: FormData): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const team_id = formData.get('team_id') as string
  const date_start = formData.get('date_start') as string
  const date_end = formData.get('date_end') as string
  const game_format = formData.get('game_format') as string
  const host_type = formData.get('host_type') as string
  const num_games_desired = formData.get('num_games_desired')
  const notes = formData.get('notes') as string

  if (!team_id || !date_start || !date_end || !game_format) {
    redirect('/dashboard/availability/new?error=Required+fields+missing')
  }

  const { error } = await supabase
    .from('availability_posts')
    .insert({
      team_id,
      date_start,
      date_end,
      game_format,
      host_type: host_type || null,
      num_games_desired: num_games_desired ? Number(num_games_desired) : null,
      notes: notes || null,
      status: 'open',
    })

  if (error) {
    redirect(`/dashboard/availability/new?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard/availability')
}

export async function closeAvailabilityPost(postId: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('availability_posts')
    .update({ status: 'closed' })
    .eq('id', postId)

  redirect('/dashboard/availability')
}
