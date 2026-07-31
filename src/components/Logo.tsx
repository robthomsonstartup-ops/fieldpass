export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'sm' ? 24 : size === 'lg' ? 40 : 30
  const innerOffset = Math.round(dim * 0.13)
  const innerSize = Math.round(dim * 0.73)

  return (
    <div className="flex items-center gap-[9px]">
      {/* Diamond home-plate mark */}
      <div className="relative flex-shrink-0" style={{ width: dim, height: dim }}>
        <div
          style={{
            position: 'absolute',
            width: innerSize,
            height: innerSize,
            top: innerOffset,
            left: innerOffset,
            background: '#1db954',
            transform: 'rotate(45deg)',
            borderRadius: 3,
          }}
        >
          {/* Inner cutout */}
          <div
            style={{
              position: 'absolute',
              inset: '18%',
              background: '#07111d',
              borderRadius: 2,
            }}
          />
        </div>
      </div>
      {/* Wordmark */}
      <span
        style={{
          fontSize: size === 'sm' ? 15 : size === 'lg' ? 22 : 17,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#f0f6ff',
          lineHeight: 1,
        }}
      >
        Field<span style={{ color: '#1db954' }}>Pass</span>
      </span>
    </div>
  )
}
