'use client'

import { useState } from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  color: '#f0f6ff',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--fp-muted)',
  marginBottom: 6,
  letterSpacing: '0.02em',
}

export function ZipLookup() {
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle')

  async function handleZipChange(value: string) {
    setZip(value)
    if (value.length === 5 && /^\d{5}$/.test(value)) {
      setStatus('loading')
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${value}`)
        if (res.ok) {
          const data = await res.json()
          const place = data.places?.[0]
          if (place) {
            setCity(place['place name'])
            setState(place['state abbreviation'])
            setStatus('found')
          } else {
            setStatus('error')
          }
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    } else {
      setStatus('idle')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ZIP */}
      <div>
        <label style={labelStyle}>
          ZIP Code
          {status === 'loading' && (
            <span style={{ marginLeft: 8, color: 'var(--fp-dim)', fontWeight: 400 }}>
              Looking up...
            </span>
          )}
          {status === 'found' && (
            <span style={{ marginLeft: 8, color: '#1db954', fontWeight: 400 }}>
              ✓ Found
            </span>
          )}
          {status === 'error' && (
            <span style={{ marginLeft: 8, color: '#f87171', fontWeight: 400 }}>
              ZIP not found
            </span>
          )}
        </label>
        <input
          type="text"
          name="zip"
          value={zip}
          onChange={(e) => handleZipChange(e.target.value)}
          maxLength={5}
          placeholder="e.g. 46143"
          style={inputStyle}
        />
      </div>

      {/* City + State (auto-filled, still editable) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label style={labelStyle}>City</label>
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Auto-filled from ZIP"
            style={{
              ...inputStyle,
              borderColor: status === 'found' ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.1)',
            }}
          />
        </div>
        <div>
          <label style={labelStyle}>State</label>
          <input
            type="text"
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase())}
            maxLength={2}
            placeholder="IN"
            style={{
              ...inputStyle,
              textTransform: 'uppercase',
              borderColor: status === 'found' ? 'rgba(29,185,84,0.3)' : 'rgba(255,255,255,0.1)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
