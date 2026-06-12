import { useLayoutEffect, useRef, useState } from 'react'
import Tooltip from './Tooltip'

export default function TruncatedText({ text, className, as: Tag = 'span', lines, ...props }: {
  text: string
  className?: string
  as?: 'span' | 'p' | 'a'
  lines?: number
  [key: string]: unknown
}) {
  const textRef = useRef<HTMLElement>(null)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const [truncated, setTruncated] = useState(false)
  const [hovered, setHovered] = useState(false)

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    setTruncated(lines ? el.scrollHeight > el.clientHeight : el.scrollWidth > el.clientWidth)
  })

  const lineClamp = lines ? `line-clamp-${lines}` : ''

  return (
    <span ref={wrapRef} className="flex w-full min-w-0" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Tag ref={textRef as never} className={`min-w-0 ${className} ${lineClamp || 'truncate'}`} {...props}>
        {text}
      </Tag>
      <Tooltip text={text} targetRef={wrapRef} visible={truncated && hovered} />
    </span>
  )
}
