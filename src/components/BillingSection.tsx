'use client'

import { useState } from 'react'

const PLANS = [
  { key: 'individual_monthly', label: 'Individual', price: '$29/mo', sub: 'or $249/yr' },
  { key: 'org_monthly', label: 'Organization', price: '$79/mo', sub: 'or $699/yr' },
] as const

interface Props {
  currentPlan: string | null
  currentStatus: string | null
  hasStripeCustomer: boolean
}

export function BillingSection({ currentPlan, currentStatus, hasStripeCustomer }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  const isActive = currentStatus === 'active'

  async function startCheckout(planKey: string) {
    setLoading(planKey)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planKey }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(null)
  }

  async function openPortal() {
    setLoading('portal')
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(null)
  }

  const btn = (style: React.CSSProperties) => ({
    fontSize: 13, fontWeight: 700, borderRadius: 8,
    padding: '9px 18px', border: 'none', cursor: 'pointer',
    ...style,
  })

  return (
    <div style={{
      background: '#0d1c2e',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '20px 22px',
      marginTop: 16,
    }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 4 }}>Plan &amp; Billing</h2>

      {/* Current plan status */}
      {isActive ? (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
              background: 'rgba(29,185,84,0.12)', color: '#1db954',
              border: '1px solid rgba(29,185,84,0.25)',
              borderRadius: 100, padding: '2px 8px',
            }}>ACTIVE</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', textTransform: 'capitalize' }}>
              {currentPlan} plan
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(232,241,251,0.35)', marginBottom: 16 }}>
            Manage your subscription, update payment method, or cancel anytime.
          </p>
          <button
            onClick={openPortal}
            disabled={loading === 'portal'}
            style={btn({
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(232,241,251,0.7)',
            })}
          >
            {loading === 'portal' ? 'Loading…' : 'Manage Billing →'}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'rgba(232,241,251,0.4)', marginBottom: 16 }}>
            You&apos;re on the free plan. Upgrade to unlock email notifications, calendar invites, and more.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {PLANS.map((plan) => (
              <div key={plan.key} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 12, padding: '16px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 2 }}>{plan.label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#1db954', letterSpacing: '-0.03em', marginBottom: 2 }}>
                  {plan.price}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(232,241,251,0.3)', marginBottom: 14 }}>{plan.sub}</div>
                <button
                  onClick={() => startCheckout(plan.key)}
                  disabled={!!loading}
                  style={btn({
                    width: '100%',
                    background: '#1db954',
                    color: '#07111d',
                  })}
                >
                  {loading === plan.key ? 'Loading…' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>

          {hasStripeCustomer && (
            <button
              onClick={openPortal}
              disabled={!!loading}
              style={btn({
                background: 'transparent',
                border: 'none',
                color: 'rgba(232,241,251,0.35)',
                padding: '4px 0',
                fontSize: 12,
              })}
            >
              {loading === 'portal' ? 'Loading…' : 'Manage previous billing →'}
            </button>
          )}
        </div>
      )}

      {/* Pro features list */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(232,241,251,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          Pro features
        </p>
        {[
          'Email notifications on new requests',
          'Calendar invites (.ics) on accepted games',
          'Verified badge on your profile',
          'Unlimited game requests',
        ].map((f) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ color: isActive ? '#1db954' : 'rgba(255,255,255,0.15)', fontSize: 12 }}>
              {isActive ? '✓' : '○'}
            </span>
            <span style={{ fontSize: 12, color: isActive ? 'rgba(232,241,251,0.55)' : 'rgba(232,241,251,0.25)' }}>
              {f}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
