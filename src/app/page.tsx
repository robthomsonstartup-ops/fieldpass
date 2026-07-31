import Link from 'next/link'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
]

const FEATURES = [
  { icon: '🔍', title: 'Discover Feed', desc: 'Browse open availability from programs near you. Filter by age group, format, and date.' },
  { icon: '📅', title: 'Post Availability', desc: 'Share your open dates, game format, and diamond. Takes 60 seconds.' },
  { icon: '⚾', title: 'Request Games', desc: 'Send a game request in seconds. Accept or decline right in the app.' },
  { icon: '🏟️', title: 'Fields & Diamonds', desc: 'Save your diamonds with ZIP auto-fill. Link them to availability posts.' },
  { icon: '📧', title: 'Email Notifications', desc: 'Instant alerts when requests arrive or are decided. Never miss a message.' },
  { icon: '📅', title: 'Calendar Invites', desc: 'Automatic .ics invite sent when a game is confirmed. Add to any calendar.' },
]

const STEPS = [
  { num: '01', title: 'Create your program', desc: 'Sign up and add your organization and team. Under 2 minutes.' },
  { num: '02', title: 'Post availability', desc: 'Add your open dates, age group, game format, and your diamond.' },
  { num: '03', title: 'Discover & connect', desc: 'Browse programs, send a request, get notified when they respond.' },
]

export default function HomePage() {
  return (
    <div style={{ background: '#07111d', minHeight: '100vh', color: '#f0f6ff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(7,17,29,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
      }}>
        {/* Logo */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: '#1db954',
            transform: 'rotate(45deg)',
            borderRadius: 3,
            flexShrink: 0,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: '22%',
              background: '#07111d',
            }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.03em', color: '#f0f6ff' }}>
            Field<span style={{ color: '#1db954' }}>Pass</span>
          </span>
        </a>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} style={{
              fontSize: 13, fontWeight: 500,
              color: 'rgba(232,241,251,0.55)',
              textDecoration: 'none',
              display: 'none',
            }}
              className="md-show"
            >{l.label}</a>
          ))}
          <Link href="/login" style={{
            fontSize: 13, fontWeight: 600,
            color: 'rgba(232,241,251,0.55)',
            textDecoration: 'none',
          }}>Sign in</Link>
          <Link href="/signup" style={{
            background: '#1db954', color: '#07111d',
            fontSize: 13, fontWeight: 800,
            borderRadius: 8, padding: '8px 16px',
            textDecoration: 'none',
          }}>Get Started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        maxWidth: 900, margin: '0 auto',
        padding: '100px 24px 80px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(29,185,84,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(29,185,84,0.1)',
          border: '1px solid rgba(29,185,84,0.25)',
          borderRadius: 100, padding: '5px 14px',
          fontSize: 12, fontWeight: 700, color: '#1db954',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          marginBottom: 32,
        }}>
          ⚾ Youth Baseball Marketplace
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 84px)',
          fontWeight: 900, letterSpacing: '-0.04em',
          lineHeight: 1.05, margin: '0 0 28px',
          color: '#f0f6ff',
        }}>
          Find Your Next<br />
          <span style={{ color: '#1db954' }}>Game.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          color: 'rgba(232,241,251,0.5)',
          maxWidth: 560, margin: '0 auto 44px',
          lineHeight: 1.6,
        }}>
          FieldPass connects youth baseball programs. Post availability, discover opponents, and book games — all in one place.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{
            background: '#1db954', color: '#07111d',
            fontSize: 16, fontWeight: 800,
            borderRadius: 10, padding: '14px 32px',
            textDecoration: 'none', display: 'inline-block',
          }}>
            Get Started Free →
          </Link>
          <Link href="/login" style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(232,241,251,0.7)',
            fontSize: 16, fontWeight: 600,
            borderRadius: 10, padding: '14px 32px',
            textDecoration: 'none', display: 'inline-block',
          }}>
            Sign In
          </Link>
        </div>

        {/* Social proof */}
        <p style={{ marginTop: 28, fontSize: 12, color: 'rgba(232,241,251,0.25)' }}>
          Free to start · No credit card required
        </p>
      </section>

      {/* ── Mock app preview ── */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: '#0d1c2e',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
        }}>
          {/* Browser bar */}
          <div style={{
            background: 'rgba(7,17,29,0.97)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {['#ef4444','#f59e0b','#1db954'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
            <div style={{
              flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 6,
              padding: '4px 12px', fontSize: 11, color: 'rgba(232,241,251,0.25)',
              marginLeft: 8,
            }}>
              fieldpass-nine.vercel.app/dashboard/discover
            </div>
          </div>
          {/* Mock nav */}
          <div style={{
            background: 'rgba(7,17,29,0.97)', borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '0 20px', display: 'flex', alignItems: 'center', gap: 24, height: 52,
          }}>
            <span style={{ fontWeight: 900, fontSize: 15, color: '#f0f6ff' }}>Field<span style={{ color: '#1db954' }}>Pass</span></span>
            {['Dashboard','Availability','Fields','Discover','Requests'].map(n => (
              <span key={n} style={{ fontSize: 12, color: n === 'Discover' ? '#f0f6ff' : 'rgba(232,241,251,0.35)', fontWeight: n === 'Discover' ? 600 : 400 }}>{n}</span>
            ))}
          </div>
          {/* Mock cards */}
          <div style={{ padding: '20px 20px 8px' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f6ff', marginBottom: 14, letterSpacing: '-0.02em' }}>Discover Teams</div>
            {[
              { age: '16', org: 'Top Tier Indiana', meta: 'Aug 12 · Scrimmage · Host · 3 games open', field: 'Center Grove LL Diamond 1' },
              { age: '14', org: 'Circle City Elite', meta: 'Aug 19 · Showcase · Either · 2 games open', field: null },
              { age: '12', org: 'Indy Storm Baseball', meta: 'Aug 24 · Scrimmage · Travel · 4 games open', field: 'Southport LL Field 2' },
            ].map((card, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '48px 1fr auto',
                gap: 12, alignItems: 'start',
                background: '#0d1c2e',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '14px 16px',
                marginBottom: 8,
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 6, textAlign: 'center', padding: '6px 0',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#f0f6ff', lineHeight: 1 }}>{card.age}</div>
                  <div style={{ fontSize: 8, fontWeight: 600, color: 'rgba(232,241,251,0.3)', letterSpacing: '0.05em' }}>U</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 3 }}>{card.org}</div>
                  <div style={{ fontSize: 11, color: 'rgba(232,241,251,0.4)' }}>{card.meta}</div>
                  {card.field && (
                    <div style={{ fontSize: 10, color: 'rgba(29,185,84,0.7)', marginTop: 4 }}>⬡ {card.field}</div>
                  )}
                </div>
                <div style={{
                  background: '#1db954', color: '#07111d',
                  fontSize: 11, fontWeight: 800,
                  borderRadius: 7, padding: '7px 14px',
                  whiteSpace: 'nowrap', cursor: 'pointer',
                }}>Request Game</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1db954', marginBottom: 12 }}>
            How It Works
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#f0f6ff', margin: 0 }}>
            Three steps to your next game.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{
              background: '#0d1c2e',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '28px 24px',
            }}>
              <div style={{
                fontSize: 32, fontWeight: 900, color: '#1db954',
                letterSpacing: '-0.04em', marginBottom: 16,
                opacity: 0.8,
              }}>{step.num}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#f0f6ff', marginBottom: 10 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(232,241,251,0.45)', lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{
        maxWidth: 900, margin: '0 auto', padding: '80px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1db954', marginBottom: 12 }}>
            Features
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#f0f6ff', margin: 0 }}>
            Everything a program needs.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: '#0d1c2e',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '24px 22px',
            }}>
              <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(232,241,251,0.45)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{
        maxWidth: 900, margin: '0 auto', padding: '80px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1db954', marginBottom: 12 }}>
            Pricing
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#f0f6ff', margin: 0 }}>
            Simple. Transparent.
          </h2>
          <p style={{ marginTop: 16, fontSize: 16, color: 'rgba(232,241,251,0.45)' }}>Start free. Upgrade when you're ready.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {/* Free */}
          <div style={{
            background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: '32px 28px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(232,241,251,0.45)', marginBottom: 16 }}>Free</div>
            <div style={{ fontSize: 44, fontWeight: 900, color: '#f0f6ff', letterSpacing: '-0.03em', lineHeight: 1 }}>$0</div>
            <div style={{ fontSize: 12, color: 'rgba(232,241,251,0.3)', marginTop: 4, marginBottom: 24 }}>forever</div>
            {['Post availability','Browse discover feed','Basic requests'].map(f => (
              <div key={f} style={{ fontSize: 13, color: 'rgba(232,241,251,0.45)', marginBottom: 8, display: 'flex', gap: 8 }}>
                <span style={{ color: 'rgba(29,185,84,0.5)' }}>✓</span> {f}
              </div>
            ))}
            <Link href="/signup" style={{
              display: 'block', textAlign: 'center', marginTop: 28,
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 0',
              fontSize: 13, fontWeight: 700, color: 'rgba(232,241,251,0.6)',
              textDecoration: 'none',
            }}>Get Started</Link>
          </div>

          {/* Individual */}
          <div style={{
            background: '#0d1c2e',
            border: '2px solid #1db954',
            borderRadius: 16, padding: '32px 28px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
              background: '#1db954', color: '#07111d',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
              padding: '3px 12px', borderRadius: 100,
            }}>POPULAR</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1db954', marginBottom: 16 }}>Individual</div>
            <div style={{ fontSize: 44, fontWeight: 900, color: '#f0f6ff', letterSpacing: '-0.03em', lineHeight: 1 }}>$29</div>
            <div style={{ fontSize: 12, color: 'rgba(232,241,251,0.3)', marginTop: 4 }}>/month</div>
            <div style={{ fontSize: 11, color: '#1db954', marginTop: 6, marginBottom: 24 }}>or $249/yr — save 29%</div>
            {['Unlimited requests','Email notifications','Calendar invites','Verified badge'].map(f => (
              <div key={f} style={{ fontSize: 13, color: 'rgba(232,241,251,0.6)', marginBottom: 8, display: 'flex', gap: 8 }}>
                <span style={{ color: '#1db954' }}>✓</span> {f}
              </div>
            ))}
            <Link href="/signup" style={{
              display: 'block', textAlign: 'center', marginTop: 28,
              background: '#1db954', borderRadius: 8, padding: '11px 0',
              fontSize: 13, fontWeight: 800, color: '#07111d',
              textDecoration: 'none',
            }}>Start Free Trial</Link>
          </div>

          {/* Organization */}
          <div style={{
            background: '#0d1c2e', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: '32px 28px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#d97706', marginBottom: 16 }}>Organization</div>
            <div style={{ fontSize: 44, fontWeight: 900, color: '#f0f6ff', letterSpacing: '-0.03em', lineHeight: 1 }}>$79</div>
            <div style={{ fontSize: 12, color: 'rgba(232,241,251,0.3)', marginTop: 4 }}>/month</div>
            <div style={{ fontSize: 11, color: '#d97706', marginTop: 6, marginBottom: 24 }}>or $699/yr — save 26%</div>
            {['Everything in Individual','Multiple teams','Analytics dashboard','Priority support'].map(f => (
              <div key={f} style={{ fontSize: 13, color: 'rgba(232,241,251,0.45)', marginBottom: 8, display: 'flex', gap: 8 }}>
                <span style={{ color: '#d97706' }}>✓</span> {f}
              </div>
            ))}
            <Link href="/signup" style={{
              display: 'block', textAlign: 'center', marginTop: 28,
              border: '1px solid rgba(217,119,6,0.3)', borderRadius: 8, padding: '11px 0',
              fontSize: 13, fontWeight: 700, color: '#d97706',
              textDecoration: 'none',
            }}>Get Started</Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{
        maxWidth: 900, margin: '0 auto 80px', padding: '0 24px',
      }}>
        <div style={{
          background: '#0d1c2e',
          border: '1px solid rgba(29,185,84,0.2)',
          borderRadius: 20, padding: '56px 40px',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 280, height: 280,
            background: 'radial-gradient(ellipse, rgba(29,185,84,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{ fontSize: 'clamp(26px, 4.5vw, 44px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 16px', color: '#f0f6ff' }}>
            Ready to find your next game?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(232,241,251,0.45)', margin: '0 0 32px' }}>
            Join youth baseball programs already using FieldPass.
          </p>
          <Link href="/signup" style={{
            background: '#1db954', color: '#07111d',
            fontSize: 16, fontWeight: 800,
            borderRadius: 10, padding: '14px 36px',
            textDecoration: 'none', display: 'inline-block',
          }}>
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
        maxWidth: 900, margin: '0 auto',
      }}>
        <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: '-0.03em', color: '#f0f6ff' }}>
          Field<span style={{ color: '#1db954' }}>Pass</span>
        </span>
        <span style={{ fontSize: 12, color: 'rgba(232,241,251,0.25)' }}>
          © 2026 FieldPass · Youth Baseball Marketplace
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/login" style={{ fontSize: 12, color: 'rgba(232,241,251,0.35)', textDecoration: 'none' }}>Sign In</Link>
          <Link href="/signup" style={{ fontSize: 12, color: 'rgba(232,241,251,0.35)', textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </footer>

    </div>
  )
}
