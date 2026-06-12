import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function Tooltip({ text, targetRef, visible }: {
  text: string
  targetRef: React.RefObject<HTMLElement | null>
  visible: boolean
}) {
  const [pos, setPos] = useState({ top: -9999, left: -9999 })
  const prev = useRef(pos)

  useLayoutEffect(() => {
    if (!visible || !targetRef.current) return
    const r = targetRef.current.getBoundingClientRect()
    const fitsBelow = r.bottom + 56 <= innerHeight
    const fitsAbove = r.top >= 124
    const place: 'above' | 'below' = fitsBelow ? 'below' : fitsAbove ? 'above' : 'below'
    const top = place === 'below' ? r.bottom + 6 : r.top - 6
    let cx = r.left + r.width / 2
    const halfW = 140
    if (cx + halfW > innerWidth - 8) cx = innerWidth - 8 - halfW
    else if (cx - halfW < 8) cx = halfW + 8
    if (prev.current.top !== top || prev.current.left !== cx) {
      const next = { top, left: cx }
      prev.current = next
      setPos(next)
    }
  }, [visible, targetRef])

  if (!visible) return null

  return createPortal(
    <div
      className="pointer-events-none fixed rounded-lg px-3 py-1.5 text-xs shadow-xl z-[9999] animate-in fade-in"
      style={{
        background: 'var(--ds-background-neutral-bold)',
        color: 'var(--ds-text-inverse)',
        top: pos.top,
        left: pos.left,
        transform: 'translateX(-50%)',
        minWidth: '10ch',
        maxWidth: '30ch',
        wordBreak: 'break-word',
      }}
    >
      {text}
    </div>,
    document.body
  )
}
