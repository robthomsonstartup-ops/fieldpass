import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', baseUrl))

  // Get umpire profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: umpires } = await (supabase as any)
    .from('umpires')
    .select('id, stripe_account_id')
    .eq('user_id', user.id)
    .limit(1)

  const umpire = umpires?.[0]
  if (!umpire) {
    return NextResponse.redirect(new URL('/dashboard/umpires/profile', baseUrl))
  }

  let accountId = umpire.stripe_account_id

  if (!accountId) {
    // Create Stripe Express account
    const account = await stripe.accounts.create({
      type: 'express',
      metadata: { umpire_id: umpire.id, user_id: user.id },
    })
    accountId = account.id

    // Save account ID using admin client (bypass RLS)
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any).from('umpires').update({ stripe_account_id: accountId }).eq('id', umpire.id)
  }

  // Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${baseUrl}/api/stripe/connect/onboard`,
    return_url: `${baseUrl}/api/stripe/connect/return`,
    type: 'account_onboarding',
  })

  return NextResponse.redirect(accountLink.url)
}
