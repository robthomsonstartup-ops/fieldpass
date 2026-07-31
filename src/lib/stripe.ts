import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export const PLANS = {
  individual_monthly: {
    priceId: process.env.STRIPE_PRICE_INDIVIDUAL_MONTHLY!,
    name: 'Individual',
    amount: 2900,
    interval: 'month',
  },
  individual_yearly: {
    priceId: process.env.STRIPE_PRICE_INDIVIDUAL_YEARLY!,
    name: 'Individual',
    amount: 24900,
    interval: 'year',
  },
  org_monthly: {
    priceId: process.env.STRIPE_PRICE_ORG_MONTHLY!,
    name: 'Organization',
    amount: 7900,
    interval: 'month',
  },
  org_yearly: {
    priceId: process.env.STRIPE_PRICE_ORG_YEARLY!,
    name: 'Organization',
    amount: 69900,
    interval: 'year',
  },
} as const

export type PlanKey = keyof typeof PLANS
