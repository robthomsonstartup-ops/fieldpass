'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const AGE_GROUPS = [
  '6U','7U','8U','9U','10U','11U','12U','13U','14U','15U','16U','17U','18U',
]

const FORMATS = [
  { value: 'scrimmage', label: 'Scrimmage' },
  { value: 'showcase', label: 'Showcase' },
  { value: 'jamboree', label: 'Jamboree' },
]

const selectStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  color: '#f0f6ff',
  cursor: 'pointer',
  outline: 'none',
  minWidth: 120,
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  color: '#f0f6ff',
  outline: 'none',
  minWidth: 130,
}

export function DiscoverFilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const ageGroup = searchParams.get('age') ?? ''
  const gameFormat = searchParams.get('format') ?? ''
  const dateFrom = searchParams.get('from') ?? ''
  const dateTo = searchParams.get('to') ?? ''

  const hasFilters = ageGroup || gameFormat || dateFrom || dateTo

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  const clearAll = () => router.push(pathname)

  return (
    <div
      className="flex flex-wrap items-center gap-2 mb-5"
      style={{
        padding: '12px 14px',
        background: '#0d1c2e',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10,
      }}
    >
      {/* Age group */}
      <select
        value={ageGroup}
        onChange={(e) => updateParam('age', e.target.value)}
        style={selectStyle}
      >
        <option value="">All Ages</option>
        {AGE_GROUPS.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      {/* Format */}
      <select
        value={gameFormat}
        onChange={(e) => updateParam('format', e.target.value)}
        style={selectStyle}
      >
        <option value="">All Formats</option>
        {FORMATS.map((f) => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>

      {/* Date from */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--fp-dim)', whiteSpace: 'nowrap' }}>From</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => updateParam('from', e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Date to */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--fp-dim)', whiteSpace: 'nowrap' }}>To</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => updateParam('to', e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            color: 'var(--fp-muted)',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      )}
    </div>
  )
}
