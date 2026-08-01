'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
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
              cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}

export async function getAvailableUmpires(state?: string, gameType?: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('umpires')
    .select('id, name, city, state, bio, certifications, experience_years, rate_per_game, game_types, age_groups, travel_radius_miles, stripe_onboarded, available')
    .eq('available', true)
    .order('created_at', { ascending: false })

  if (state) query = query.eq('state', state.toUpperCase())
  if (gameType) query = query.contains('game_types', [gameType.toLowerCase()])

  const { data } = await query
  return data ?? []
}

export async function getMyUmpireProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('umpires')
    .select('*')
    .eq('user_id', user.id)
    .limit(1)

  return data?.[0] ?? null
}

export async function upsertUmpireProfile(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim() || user.email
  const phone = (formData.get('phone') as string)?.trim() || null
  const city = (formData.get('city') as string)?.trim() || null
  const state = (formData.get('state') as string)?.trim() || null
  const bio = (formData.get('bio') as string)?.trim() || null
  const experience_years = parseInt(formData.get('experience_years') as string) || 0
  const rate_str = formData.get('rate_per_game') as string
  const rate_per_game = rate_str ? Math.round(parseFloat(rate_str) * 100) : 0
  const travel_radius_miles = parseInt(formData.get('travel_radius_miles') as string) || 30

  // Multi-select checkboxes
  const game_types = formData.getAll('game_types').map(v => v.toString())
  const age_groups = formData.getAll('age_groups').map(v => v.toString())
  const certifications = (formData.get('certifications') as string)?.split(',').map(s => s.trim()).filter(Boolean) ?? []

  if (!name || !rate_per_game) {
    redirect('/dashboard/umpires/profile?error=Name+and+rate+are+required')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('umpires')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  const payload = {
    user_id: user.id,
    name, email, phone, city, state, bio,
    experience_years, rate_per_game, travel_radius_miles,
    game_types, age_groups, certifications,
  }

  if (existing?.[0]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('umpires').update(payload).eq('id', existing[0].id)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('umpires').insert(payload)
  }

  redirect('/dashboard/umpires/profile?saved=1')
}

export async function toggleUmpireAvailability(available: boolean): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('umpires')
    .update({ available })
    .eq('user_id', user.id)

  redirect('/dashboard/umpires/profile')
}

export async function bookUmpire(umpireId: string, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orgs } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
  const org_id = orgs?.[0]?.id
  if (!org_id) redirect('/dashboard/onboarding')

  const game_date = formData.get('game_date') as string
  const game_format = (formData.get('game_format') as string) || null
  const age_group = (formData.get('age_group') as string) || null
  const location = (formData.get('location') as string)?.trim() || null
  const message = (formData.get('message') as string)?.trim() || null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ump } = await (supabase as any)
    .from('umpires')
    .select('rate_per_game, stripe_account_id, stripe_onboarded')
    .eq('id', umpireId)
    .single()

  if (!ump) redirect('/dashboard/discover/umpires')

  // If umpire not on Stripe, just create request (contact-based)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('umpire_requests').insert({
    umpire_id: umpireId,
    org_id,
    game_date,
    game_format,
    age_group,
    location,
    message,
    rate_agreed: ump.rate_per_game,
    status: 'pending',
    payment_status: ump.stripe_onboarded ? 'pending_payment' : 'contact',
  })

  redirect('/dashboard/discover/umpires?booked=1')
}

export async function getMyUmpireRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ump } = await (supabase as any)
    .from('umpires')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  if (!ump?.[0]) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('umpire_requests')
    .select('id, game_date, game_format, age_group, location, message, status, rate_agreed, payment_status, created_at, organizations(name)')
    .eq('umpire_id', ump[0].id)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function respondToUmpireRequest(requestId: string, status: 'accepted' | 'declined'): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('umpire_requests')
    .update({ status })
    .eq('id', requestId)

  redirect('/dashboard/umpires/profile')
}
