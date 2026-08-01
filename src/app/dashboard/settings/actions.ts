'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getOrgProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: org } = await (supabase as any)
    .from('organizations')
    .select('id, name, city, state, contact_email, stripe_customer_id, subscription_status, subscription_plan, primary_color, secondary_color')
    .eq('user_id', user.id)
    .single()

  return { org, email: user.email }
}

export async function updateOrgProfile(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = (formData.get('name') as string)?.trim()
  const city = (formData.get('city') as string)?.trim()
  const state = (formData.get('state') as string)?.trim().toUpperCase()
  const contact_email = (formData.get('contact_email') as string)?.trim()
  const primary_color = (formData.get('primary_color') as string)?.trim() || null
  const secondary_color = (formData.get('secondary_color') as string)?.trim() || null

  if (!name) {
    redirect('/dashboard/settings?error=Organization+name+is+required')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('organizations')
    .update({ name, city: city || null, state: state || null, contact_email: contact_email || null, primary_color, secondary_color })
    .eq('user_id', user.id)

  if (error) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard/settings?saved=1')
}
