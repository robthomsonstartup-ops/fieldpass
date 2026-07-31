'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getMyOrgIds(supabase: any, userId: string) {
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', userId)
  return (orgs || []).map((o: any) => o.id)
}

export async function getTeamsForUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const orgIds = await getMyOrgIds(supabase, user.id)
  if (orgIds.length === 0) return []

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, age_group')
    .in('organization_id', orgIds)
    .eq('status', 'active')

  return teams || []
}

export async function getAvailabilityPosts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const orgIds = await getMyOrgIds(supabase, user.id)
  if (orgIds.length === 0) return []

  const { data: teams } = await supabase
    .from('teams')
    .select('id')
    .in('organization_id', orgIds)

  if (!teams || teams.length === 0) return []

  const teamIds = teams.map(t => t.id)

  const { data: posts } = await supabase
    .from('availability_posts')
    .select(`
      id,
      date_start,
      date_end,
      game_format,
      host_type,
      num_games_desired,
      status,
      notes,
      created_at,
      teams (name, age_group)
    `)
    .in('team_id', teamIds)
    .order('created_at', { ascending: false })

  return posts || []
}

export async function createAvailabilityPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const team_id = formData.get('team_id') as string
  const date_start = formData.get('date_start') as string
  const date_end = formData.get('date_end') as string
  const game_format = formData.get('game_format') as string
  const host_type = formData.get('host_type') as string
  const num_games_desired = parseInt(formData.get('num_games_desired') as string) || 2
  const notes = formData.get('notes') as string

  if (!team_id || !date_start || !date_end || !game_format || !host_type) {
    return { error: 'All required fields must be filled in.' }
  }

  if (new Date(date_end) < new Date(date_start)) {
    return { error: 'End date must be after start date.' }
  }

  const { error } = await supabase
    .from('availability_posts')
    .insert({
      team_id,
      date_start,
      date_end,
      game_format,
      host_type,
      num_games_desired,
      notes: notes || null,
      status: 'open',
    })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/availability')
  redirect('/dashboard/availability')
}
