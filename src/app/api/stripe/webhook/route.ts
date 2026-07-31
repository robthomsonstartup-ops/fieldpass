import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

// Use service role to bypass RLS in webhook
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function planFromPriceId(priceId: string): string {
  const map: Record<string, string> = {
    [process.env.STRIPE_PRICE_INDIVIDUAL_MONTHLY ?? '']: 'individual',
    [process.env.STRIPE_PRICE_INDIVIDUAL_YEARLY ?? '']: 'individual',
    [process.env.STRIPE_PRICE_ORG_MONTHLY ?? '']: 'organization',
    [process.env.STRIPE_PRICE_ORG_YEARLY ?? '']: 'organization',
  }
  return map[priceId] ?? 'individual'
}

async function syncSubscription(sub: Stripe.Subscription) {
  const orgId = sub.metadata?.org_id
  if (!orgId) return

  const priceId = sub.items.data[0]?.price?.id ?? ''
  const plan = planFromPriceId(priceId)
  const status = sub.status // active | past_due | canceled | etc.

  const supabase = adminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('organizations')
    .update({
      subscription_status: status,
      subscription_plan: plan,
      stripe_subscription_id: sub.id,
    })
    .eq('id', orgId)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await syncSubscription(event.data.object as Stripe.Subscription)
      break
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const orgId = sub.metadata?.org_id
      if (orgId) {
        const supabase = adminClient()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('organizations')
          .update({ subscription_status: 'canceled', subscription_plan: null })
          .eq('id', orgId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

// Stripe sends raw body — disable Next.js body parsing
export const config = { api: { bodyParser: false } }
