'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/database.types'

async function createClient() {
  const cookieStore = await cookies()
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

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

async function getMyTeamIds(supabase: SupabaseClient, userId: string): Promise<string[]> {
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', userId)

  const orgIds = (orgs ?? []).map((o) => o.id)
  if (!orgIds.length) return []

  const { data: teams } = await supabase
    .from('teams')
    .select('id')
    .in('organization_id', orgIds)

  return (teams ?? []).map((t) => t.id)
}

export async function getMyTeams() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: orgs } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', user.id)

  const orgIds = (orgs ?? []).map((o) => o.id)
  if (!orgIds.length) return []

  const { data } = await supabase
    .from('teams')
    .select('id, name, age_group, travel_radius_miles')
    .in('organization_id', orgIds)

  return data ?? []
}

export async function getDiscoverFeed() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const myTeamIds = await getMyTeamIds(supabase, user.id)

  let query = supabase
    .from('availability_posts')
    .select(`
      id,
      date_start,
      date_end,
      game_format,
      host_type,
      num_games_desired,
      notes,
      created_at,
      teams (
        id,
        name,
        age_group,
        play_level,
        organizations (
          name,
          city,
          state
        )
      )
    `)
    .eq('status', 'open')
    .order('date_start', { ascending: true })

  if (myTeamIds.length > 0) {
    query = query.not('team_id', 'in', `(${myTeamIds.join(',')})`)
  }

  const { data } = await query
  return data ?? []
}

export async function sendGameRequest(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const requester_team_id = formData.get('requester_team_id') as string
  const recipient_team_id = formData.get('recipient_team_id') as string
  const availability_post_id = formData.get('availability_post_id') as string
  const proposed_date = formData.get('proposed_date') as string
  const num_games = parseInt(formData.get('num_games') as string) || 2
  const message = formData.get('message') as string
  const game_format = formData.get('game_format') as string

  if (!requester_team_id || !recipient_team_id || !proposed_date) {
    redirect('/dashboard/discover?error=Required+fields+missing')
  }

  // Prevent duplicate pending requests for the same availability post
  if (availability_post_id) {
    const { data: existing } = await supabase
      .from('game_requests')
      .select('id')
      .eq('requester_team_id', requester_team_id)
      .eq('availability_post_id', availability_post_id)
      .eq('status', 'pending')
      .maybeSingle()

    if (existing) {
      redirect('/dashboard/requests?notice=You+already+sent+a+request+for+this+availability')
    }
  }

  const { data: request, error } = await supabase
    .from('game_requests')
    .insert({
      requester_team_id,
      recipient_team_id,
      availability_post_id: availability_post_id || null,
      proposed_date,
      num_games,
      message: message || null,
      game_format,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    redirect(`/dashboard/discover?error=${encodeURIComponent(error.message)}`)
  }

  await supabase
    .from('conversations')
    .insert({
      team_1_id: requester_team_id,
      team_2_id: recipient_team_id,
      game_request_id: request.id,
    })

  revalidatePath('/dashboard/discover')
  redirect('/dashboard/requests')
}
