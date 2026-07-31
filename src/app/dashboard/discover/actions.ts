'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getMyTeams() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: orgs } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', user.id)

  const orgIds = (orgs || []).map((o: any) => o.id)
  if (orgIds.length === 0) return []

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, age_group, travel_radius_miles')
    .in('organization_id', orgIds)

  return teams || []
}

export async function getDiscoverFeed() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Get all of the current user's team IDs to exclude their own posts
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', user.id)

  const myTeamIds: string[] = []
  if (orgs && orgs.length > 0) {
    const orgIds = orgs.map((o: any) => o.id)
    const { data: myTeams } = await supabase
      .from('teams')
      .select('id')
      .in('organization_id', orgIds)
    if (myTeams) myTeamIds.push(...myTeams.map(t => t.id))
  }

  // Fetch all open availability posts from other teams
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

  const { data: posts } = await query
  return posts || []
}

export async function sendGameRequest(formData: FormData) {
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
    return { error: 'Required fields missing.' }
  }

  // Insert game request
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

  if (error) return { error: error.message }

  // Create a conversation thread
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
