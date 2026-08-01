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
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

export async function getMyFields() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: orgs } = await supabase
    .from('organizations')
    .select('id')
    .eq('user_id', user.id)

  const orgIds = (orgs ?? []).map((o) => o.id)
  if (!orgIds.length) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('fields')
    .select('id, name, address, city, state, notes, created_at, available_for_rent, surface_type, field_type, rental_rate_per_day, rental_contact_email, rental_contact_phone, rental_notes')
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function toggleFieldRental(fieldId: string, formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const available_for_rent = formData.get('available_for_rent') === 'true'
  const surface_type = (formData.get('surface_type') as string) || null
  const field_type = (formData.get('field_type') as string) || null
  const rental_rate_str = formData.get('rental_rate_per_day') as string
  const rental_rate_per_day = rental_rate_str ? Math.round(parseFloat(rental_rate_str) * 100) : null
  const rental_contact_email = (formData.get('rental_contact_email') as string)?.trim() || null
  const rental_contact_phone = (formData.get('rental_contact_phone') as string)?.trim() || null
  const rental_notes = (formData.get('rental_notes') as string)?.trim() || null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('fields')
    .update({ available_for_rent, surface_type, field_type, rental_rate_per_day, rental_contact_email, rental_contact_phone, rental_notes })
    .eq('id', fieldId)

  redirect('/dashboard/fields')
}

export async function getAvailableFields(state?: string, fieldType?: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('fields')
    .select(`
      id, name, address, city, state, notes,
      surface_type, field_type, rental_rate_per_day,
      rental_contact_email, rental_contact_phone, rental_notes,
      organizations ( name, city, state, logo_url, primary_color, secondary_color )
    `)
    .eq('available_for_rent', true)
    .order('created_at', { ascending: false })

  if (state) query = query.eq('state', state.toUpperCase())
  if (fieldType) query = query.eq('field_type', fieldType)

  const { data } = await query
  return data ?? []
}

export async function createField(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const notes = formData.get('notes') as string

  if (!name) {
    redirect('/dashboard/fields/new?error=Field+name+is+required')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).rpc('create_field_for_user', {
    p_name: name,
    p_address: address || null,
    p_city: city || null,
    p_state: state || 'IN',
    p_notes: notes || null,
  })

  if (error) {
    redirect(`/dashboard/fields/new?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard/fields')
}

export async function deleteField(fieldId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('fields').delete().eq('id', fieldId)
  redirect('/dashboard/fields')
}
