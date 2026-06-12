import { useLayoutEffect, useRef, useState } from 'react'

export default function TruncatedText({ text, className, as: Tag = 'span', lines, ...props }: {
  text: string
  className?: string
  as?: 'span' | 'p' | 'a'
  lines?: number
  [key: string]: unknown
}) {
  const ref = useRef<HTMLElement>(null)
  const [truncated, setTruncated] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [pos, setPos] = useState<{ place: 'above' | 'below'; left: number }>({ place: 'below', left: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setTruncated(lines ? el.scrollHeight > el.clientHeight : el.scrollWidth > el.clientWidth)
  })

  useLayoutEffect(() => {
    if (!truncated || !hovered || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const fitsBelow = r.bottom + 56 <= innerHeight
    const fitsAbove = r.top >= 124
    const farRight = r.left + r.width / 2 + 120
    const left = farRight > innerWidth - 8 ? -(farRight - innerWidth + 8) : 0
    const place = fitsBelow ? 'below' : fitsAbove ? 'above' : 'below'
    if (pos.place !== place || pos.left !== left) {
      setPos({ place, left })
    }
  }, [truncated, hovered, pos.place, pos.left])

  const lineClamp = lines ? `line-clamp-${lines}` : ''

  return (
    <span className="relative flex w-full min-w-0" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Tag ref={ref as never} className={`min-w-0 ${className} ${lineClamp || 'truncate'}`} {...props}>
        {text}
      </Tag>
      {truncated && hovered && (
        <div
          className="pointer-events-none absolute z-50 animate-in fade-in rounded-lg px-3 py-1.5 text-xs shadow-xl"
          style={{
            background: 'var(--ds-background-neutral-bold)',
            color: 'var(--ds-text-inverse)',
            ...(pos.place === 'below'
              ? { top: '100%', marginTop: '6px' }
              : { bottom: '100%', marginBottom: '6px' }
            ),
            left: pos.left < 0 ? `calc(50% - ${Math.abs(pos.left)}px)` : '50%',
            transform: 'translateX(-50%)',
            minWidth: '28ch',
            maxWidth: 'min(560px, 85vw)',
            wordBreak: 'break-word',
          }}
        >
          {text}
        </div>
      )}
    </span>
  )
}
