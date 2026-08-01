'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'

interface Props {
  orgId: string
  currentLogoUrl: string | null
  currentPrimary: string | null
  currentSecondary: string | null
  onColorsExtracted?: (primary: string, secondary: string) => void
}

// ─── Color extraction from canvas ────────────────────────────────────────────

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

function colorDistance(a: [number, number, number], b: [number, number, number]) {
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2)
}

function isNearWhite(r: number, g: number, b: number) {
  return r > 200 && g > 200 && b > 200
}

function isNearBlack(r: number, g: number, b: number) {
  return r < 40 && g < 40 && b < 40
}

// Skip grays / low-saturation neutrals
function isNeutral(r: number, g: number, b: number) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return (max - min) < 40 // small spread = gray/beige/neutral
}

function extractDominantColors(imgEl: HTMLImageElement): [string, string] {
  const canvas = document.createElement('canvas')
  const size = 64 // downsample for speed
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(imgEl, 0, 0, size, size)

  const { data } = ctx.getImageData(0, 0, size, size)
  const buckets: Map<string, { count: number; r: number; g: number; b: number }> = new Map()

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3]
    if (a < 128) continue // skip transparent
    if (isNearWhite(r, g, b)) continue
    if (isNearBlack(r, g, b)) continue
    if (isNeutral(r, g, b)) continue

    // Quantize to 32-step buckets
    const qr = Math.round(r / 32) * 32
    const qg = Math.round(g / 32) * 32
    const qb = Math.round(b / 32) * 32
    const key = `${qr},${qg},${qb}`

    const existing = buckets.get(key)
    if (existing) {
      existing.count++
      existing.r += r; existing.g += g; existing.b += b
    } else {
      buckets.set(key, { count: 1, r, g, b })
    }
  }

  // Sort by frequency
  const sorted = [...buckets.values()]
    .sort((a, b) => b.count - a.count)
    .map((v) => ({
      count: v.count,
      color: [Math.round(v.r/v.count), Math.round(v.g/v.count), Math.round(v.b/v.count)] as [number, number, number],
    }))

  if (sorted.length === 0) return ['#1e2d5e', '#c8102e']

  const primary = sorted[0].color
  // Find secondary: most frequent color sufficiently different from primary
  const secondary = sorted.find(
    (c) => colorDistance(c.color, primary) > 60
  )?.color ?? primary

  return [rgbToHex(...primary), rgbToHex(...secondary)]
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OrgLogoUpload({ orgId, currentLogoUrl, currentPrimary, currentSecondary, onColorsExtracted }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentLogoUrl)
  const [primary, setPrimary] = useState(currentPrimary ?? '#1e2d5e')
  const [secondary, setSecondary] = useState(currentSecondary ?? '#c8102e')
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'extracting' | 'uploading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setErrorMsg('Please choose an image file.'); return }
    if (file.size > 4 * 1024 * 1024) { setErrorMsg('Image must be under 4 MB.'); return }

    setErrorMsg(null)
    setUploading(true)

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // ── 1. Extract colors ──
    setStatus('extracting')
    const [p, s] = await new Promise<[string, string]>((resolve) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(extractDominantColors(img))
      img.onerror = () => resolve(['#1e2d5e', '#c8102e'])
      img.src = objectUrl
    })
    setPrimary(p)
    setSecondary(s)
    onColorsExtracted?.(p, s)

    // ── 2. Upload + save via server API (service role, bypasses RLS) ──
    setStatus('uploading')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('primary_color', p)
      fd.append('secondary_color', s)
      const uploadRes = await fetch('/api/upload/logo', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error ?? 'Upload failed')

      setPreview(uploadData.url)
      setStatus('done')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed.')
      setStatus('error')
    } finally {
      setUploading(false)
    }
  }, [orgId, onColorsExtracted])

  const statusLabel = {
    idle: preview ? 'Change Logo' : 'Upload Logo',
    extracting: '✦ Reading colors…',
    uploading: 'Saving…',
    done: '✓ Done',
    error: 'Try again',
  }[status]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        {/* Logo preview circle */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          title="Click to upload logo"
          style={{
            width: 80,
            height: 80,
            borderRadius: 14,
            border: preview ? `2px solid ${primary}` : '2px dashed rgba(255,255,255,0.15)',
            background: preview ? '#fff' : 'rgba(255,255,255,0.03)',
            cursor: 'pointer',
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 4,
          }}
        >
          {preview ? (
            <Image src={preview} alt="Org logo" fill sizes="80px" style={{ objectFit: 'contain', padding: 4 }} />
          ) : (
            <span style={{ fontSize: 28 }}>🖼</span>
          )}
        </button>

        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              background: status === 'done' ? 'rgba(29,185,84,0.15)' : primary,
              color: status === 'done' ? '#1db954' : '#ffffff',
              border: status === 'done' ? '1px solid rgba(29,185,84,0.3)' : 'none',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 8,
              padding: '9px 18px',
              cursor: uploading ? 'default' : 'pointer',
              display: 'block',
              marginBottom: 6,
              opacity: uploading ? 0.7 : 1,
            }}
          >
            {statusLabel}
          </button>
          <p style={{ fontSize: 11, color: 'rgba(232,241,251,0.25)', margin: 0 }}>
            Upload logo · colors extracted automatically
          </p>
        </div>
      </div>

      {/* Auto-extracted color swatches */}
      {status !== 'idle' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'rgba(232,241,251,0.35)' }}>Extracted:</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['Primary', primary], ['Secondary', secondary]].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: color, border: '1px solid rgba(255,255,255,0.15)' }} />
                <span style={{ fontSize: 10, color: 'rgba(232,241,251,0.4)', fontFamily: 'monospace' }}>{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {errorMsg && (
        <p style={{ fontSize: 12, color: '#f87171', marginTop: 6 }}>{errorMsg}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }}
      />
    </div>
  )
}
