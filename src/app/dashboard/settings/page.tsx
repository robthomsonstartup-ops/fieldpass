import { getOrgProfile, updateOrgProfile } from './actions'
import { BillingSection } from '@/components/BillingSection'
import { redirect } from 'next/navigation'

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  color: '#f0f6ff',
  outline: 'none',
} as const

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(232,241,251,0.45)',
  marginBottom: 6,
  letterSpacing: '0.02em',
  textTransform: 'uppercase' as const,
}

interface PageProps {
  searchParams: Promise<{ error?: string; saved?: string; upgraded?: string }>
}

export default async function SettingsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const result = await getOrgProfile()

  if (!result) redirect('/login')
  const { org, email } = result

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.03em', color: '#f0f6ff', marginBottom: 4 }}>
          Settings
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(232,241,251,0.4)' }}>
          Manage your organization profile.
        </p>
      </div>

      {/* Success / Error banners */}
      {params.saved && (
        <div style={{
          background: 'rgba(29,185,84,0.1)',
          border: '1px solid rgba(29,185,84,0.25)',
          borderRadius: 10, padding: '12px 16px',
          fontSize: 14, color: '#1db954',
          marginBottom: 24,
        }}>
          ✓ Changes saved successfully.
        </div>
      )}
      {params.error && (
        <div style={{
          background: 'rgba(220,38,38,0.1)',
          border: '1px solid rgba(220,38,38,0.25)',
          borderRadius: 10, padding: '12px 16px',
          fontSize: 14, color: '#f87171',
          marginBottom: 24,
        }}>
          {decodeURIComponent(params.error)}
        </div>
      )}

      {/* Account info (read-only) */}
      <div style={{
        background: '#0d1c2e',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, padding: '20px 22px',
        marginBottom: 16,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>Account</h2>
        <div>
          <label style={labelStyle}>Email</label>
          <div style={{
            ...inputStyle,
            color: 'rgba(232,241,251,0.35)',
            cursor: 'not-allowed',
          }}>
            {email}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(232,241,251,0.25)', marginTop: 6 }}>
            Email cannot be changed here. Contact support if needed.
          </p>
        </div>
      </div>

      {/* Org profile form */}
      <form action={updateOrgProfile}>
        <div style={{
          background: '#0d1c2e',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '20px 22px',
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 20 }}>Organization</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Name */}
            <div>
              <label style={labelStyle} htmlFor="name">Organization Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={org?.name ?? ''}
                placeholder="e.g. Top Tier Indiana"
                style={inputStyle}
              />
            </div>

            {/* Contact email */}
            <div>
              <label style={labelStyle} htmlFor="contact_email">Contact Email</label>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={org?.contact_email ?? ''}
                placeholder="coach@example.com"
                style={inputStyle}
              />
              <p style={{ fontSize: 11, color: 'rgba(232,241,251,0.25)', marginTop: 6 }}>
                Shown to other programs when they view your posts.
              </p>
            </div>

            {/* City + State */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12 }}>
              <div>
                <label style={labelStyle} htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={org?.city ?? ''}
                  placeholder="Greenwood"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  maxLength={2}
                  defaultValue={org?.state ?? ''}
                  placeholder="IN"
                  style={{ ...inputStyle, textTransform: 'uppercase' }}
                />
              </div>
            </div>

          </div>

          {/* Submit */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              style={{
                background: '#1db954',
                color: '#07111d',
                fontSize: 14,
                fontWeight: 800,
                borderRadius: 8,
                padding: '10px 24px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>

      {/* Billing */}
      {params.upgraded && (
        <div style={{
          background: 'rgba(29,185,84,0.1)',
          border: '1px solid rgba(29,185,84,0.25)',
          borderRadius: 10, padding: '12px 16px',
          fontSize: 14, color: '#1db954',
          marginTop: 16,
        }}>
          🎉 You&apos;re now on a pro plan. Welcome to FieldPass Pro!
        </div>
      )}
      <BillingSection
        currentPlan={org?.subscription_plan ?? null}
        currentStatus={org?.subscription_status ?? null}
        hasStripeCustomer={!!org?.stripe_customer_id}
      />

    </div>
  )
}
