'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendRequestDecisionEmail } from '@/lib/email'
import { generateICS } from '@/lib/ics'

export async function getGameRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { incoming: [], outgoing: [] }

  // Get ALL orgs for this user (a user may have more than one)
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', user.id)

  const orgIds = (orgs || []).map(o => o.id)
  if (orgIds.length === 0) return { incoming: [], outgoing: [] }

  // Get all teams across all orgs
  const { data: myTeams } = await supabase
    .from('teams')
    .select('id')
    .in('organization_id', orgIds)

  const myTeamIds = (myTeams || []).map(t => t.id)
  if (myTeamIds.length === 0) return { incoming: [], outgoing: [] }

  // Fetch incoming and outgoing requests
  const { data: incoming } = await supabase
    .from('game_requests')
    .select('id, status, proposed_date, num_games, game_format, message, created_at, requester_team_id, recipient_team_id')
    .in('recipient_team_id', myTeamIds)
    .order('created_at', { ascending: false })

  const { data: outgoing } = await supabase
    .from('game_requests')
    .select('id, status, proposed_date, num_games, game_format, message, created_at, requester_team_id, recipient_team_id')
    .in('requester_team_id', myTeamIds)
    .order('created_at', { ascending: false })

  // Collect all team IDs to look up
  const allTeamIds = new Set<string>()
  ;[...(incoming || []), ...(outgoing || [])].forEach(r => {
    allTeamIds.add(r.requester_team_id)
    allTeamIds.add(r.recipient_team_id)
  })

  if (allTeamIds.size === 0) return { incoming: [], outgoing: [] }

  // Fetch teams + orgs in one query
  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, age_group, organizations(name, city, state)')
    .in('id', Array.from(allTeamIds))

  const teamMap: Record<string, any> = {}
  ;(teams || []).forEach(t => { teamMap[t.id] = t })

  const enrich = (requests: any[]) =>
    requests.map(r => ({
      ...r,
      requester_team: teamMap[r.requester_team_id] || null,
      recipient_team: teamMap[r.recipient_team_id] || null,
    }))

  return {
    incoming: enrich(incoming || []),
    outgoing: enrich(outgoing || []),
  }
}

export async function updateRequestStatus(requestId: string, status: 'accepted' | 'declined') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Fetch request details for email + ICS
  const { data: req } = await supabase
    .from('game_requests')
    .select('requester_team_id, recipient_team_id, proposed_date, game_format, num_games')
    .eq('id', requestId)
    .single()

  const { error } = await supabase
    .from('game_requests')
    .update({ status })
    .eq('id', requestId)

  if (error) return { error: error.message }

  // Send email to the requester (they get the decision)
  if (req) {
    try {
      const { data: requesterTeam } = await supabase
        .from('teams')
        .select('name, organizations(name, user_id)')
        .eq('id', req.requester_team_id)
        .single()

      const { data: recipientTeam } = await supabase
        .from('teams')
        .select('name, organizations(name)')
        .eq('id', req.recipient_team_id)
        .single()

      const requesterOrg = (requesterTeam?.organizations as any)
      const requesterUserId = requesterOrg?.user_id

      if (requesterUserId) {
        const { data: { user: requesterUser } } = await supabase.auth.admin.getUserById(requesterUserId)
        if (requesterUser?.email) {
          let icsString: string | undefined

          if (status === 'accepted') {
            icsString = generateICS({
              uid: requestId,
              title: `Game vs ${(recipientTeam?.organizations as any)?.name ?? 'Opponent'}`,
              description: `${req.num_games} game ${req.game_format} — confirmed via FieldPass`,
              date: req.proposed_date,
            })
          }

          await sendRequestDecisionEmail({
            recipientEmail: requesterUser.email,
            recipientOrgName: requesterOrg?.name ?? '',
            otherOrgName: (recipientTeam?.organizations as any)?.name ?? '',
            decision: status,
            proposedDate: req.proposed_date,
            icsAttachment: icsString,
          })
        }
      }
    } catch (e) {
      console.error('[updateRequestStatus] email error:', e)
    }
  }

  revalidatePath('/dashboard/requests')
  return { success: true }
}
