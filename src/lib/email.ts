/**
 * FieldPass email notifications via Resend
 * Set RESEND_API_KEY in your Vercel environment variables.
 */

const FROM = 'FieldPass <notifications@fieldpass.app>'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fieldpass-nine.vercel.app'

interface SendOptions {
  to: string
  subject: string
  html: string
}

async function send({ to, subject, html }: SendOptions) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set — skipping email to', to)
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[email] Resend error:', err)
    }
  } catch (err) {
    console.error('[email] fetch error:', err)
  }
}

function emailWrap(content: string) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#07111d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#0d1c2e;border-radius:12px;border:1px solid rgba(255,255,255,0.07);overflow:hidden;">
    <div style="padding:24px 28px 16px;border-bottom:1px solid rgba(255,255,255,0.07);">
      <span style="font-size:18px;font-weight:900;color:#f0f6ff;letter-spacing:-0.03em;">Field<span style="color:#1db954;">Pass</span></span>
    </div>
    <div style="padding:24px 28px;">
      ${content}
    </div>
    <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.07);">
      <p style="margin:0;font-size:11px;color:rgba(232,241,251,0.3);">
        You received this because you use FieldPass. <a href="${BASE_URL}" style="color:rgba(29,185,84,0.7);text-decoration:none;">Open app →</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

const btn = (text: string, url: string) =>
  `<a href="${url}" style="display:inline-block;margin-top:20px;padding:11px 22px;background:#1db954;color:#07111d;font-size:13px;font-weight:800;border-radius:8px;text-decoration:none;">${text}</a>`

const muted = (text: string) =>
  `<p style="margin:8px 0 0;font-size:13px;color:rgba(232,241,251,0.45);">${text}</p>`

const heading = (text: string) =>
  `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#f0f6ff;">${text}</p>`

export async function sendNewRequestEmail({
  recipientEmail,
  recipientOrgName,
  requesterOrgName,
  requesterTeamName,
  proposedDate,
  gameFormat,
}: {
  recipientEmail: string
  recipientOrgName: string
  requesterOrgName: string
  requesterTeamName: string
  proposedDate: string
  gameFormat: string
}) {
  const date = new Date(proposedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  await send({
    to: recipientEmail,
    subject: `New game request from ${requesterOrgName}`,
    html: emailWrap(`
      ${heading(`You have a new game request`)}
      <p style="margin:0 0 4px;font-size:14px;color:#f0f6ff;font-weight:600;">${requesterOrgName}</p>
      ${muted(`Team: ${requesterTeamName}`)}
      ${muted(`Proposed date: ${date}`)}
      ${muted(`Format: ${gameFormat.charAt(0).toUpperCase() + gameFormat.slice(1)}`)}
      ${btn('View Request', `${BASE_URL}/dashboard/requests`)}
    `),
  })
}

export async function sendRequestDecisionEmail({
  recipientEmail,
  recipientOrgName,
  otherOrgName,
  decision,
  proposedDate,
  icsAttachment,
}: {
  recipientEmail: string
  recipientOrgName: string
  otherOrgName: string
  decision: 'accepted' | 'declined'
  proposedDate: string
  icsAttachment?: string
}) {
  const date = new Date(proposedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const isAccepted = decision === 'accepted'
  const subject = isAccepted
    ? `${otherOrgName} accepted your game request!`
    : `${otherOrgName} declined your game request`

  const body = isAccepted
    ? `
      ${heading('Your game request was accepted! 🎉')}
      <p style="margin:0 0 4px;font-size:14px;color:#f0f6ff;font-weight:600;">${otherOrgName}</p>
      ${muted(`Date: ${date}`)}
      ${icsAttachment ? muted('A calendar invite is attached.') : ''}
      ${btn('View in FieldPass', `${BASE_URL}/dashboard/requests`)}
    `
    : `
      ${heading('Game request declined')}
      <p style="margin:0 0 4px;font-size:14px;color:#f0f6ff;">${otherOrgName} wasn't able to make it work this time.</p>
      ${muted(`Date: ${date}`)}
      ${btn('Find other teams', `${BASE_URL}/dashboard/discover`)}
    `

  const emailPayload: any = {
    to: recipientEmail,
    subject,
    html: emailWrap(body),
  }

  // Attach ICS if provided
  if (isAccepted && icsAttachment) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('[email] RESEND_API_KEY not set — skipping email')
      return
    }
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM,
          to: recipientEmail,
          subject,
          html: emailWrap(body),
          attachments: [{
            filename: 'game.ics',
            content: Buffer.from(icsAttachment).toString('base64'),
          }],
        }),
      })
      if (!res.ok) console.error('[email] Resend error:', await res.text())
    } catch (err) {
      console.error('[email] fetch error:', err)
    }
    return
  }

  await send(emailPayload)
}
