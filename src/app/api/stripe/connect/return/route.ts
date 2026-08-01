import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', baseUrl))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: umpires } = await (supabase as any)
    .from('umpires')
    .select('id, stripe_account_id')
    .eq('user_id', user.id)
    .limit(1)

  const umpire = umpires?.[0]
  if (!umpire?.stripe_account_id) {
    return NextResponse.redirect(new URL('/dashboard/umpires/profile', baseUrl))
  }

  // Check if fully onboarded
  const account = await stripe.accounts.retrieve(umpire.stripe_account_id)
  const onboarded = account.details_submitted && !account.requirements?.currently_due?.length

  if (onboarded) {
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any).from('umpires').update({ stripe_onboarded: true }).eq('id', umpire.id)
  }

  return NextResponse.redirect(new URL('/dashboard/umpires/profile?saved=1', baseUrl))
}
