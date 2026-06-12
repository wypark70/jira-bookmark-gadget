import { useEffect, useMemo, useRef, useState } from 'react'
import type { Bookmark } from '../types'

interface RenderNode {
  id: string
  x: number
  y: number
  r: number
  title: string
  url: string
  hostname: string
}

interface RenderEdge {
  source: string
  target: string
}

function buildGraph(bookmarks: Bookmark[]) {
  const edges: RenderEdge[] = []
  for (let i = 0; i < bookmarks.length; i++) {
    for (let j = i + 1; j < bookmarks.length; j++) {
      if (bookmarks[i].tags.some(t => bookmarks[j].tags.includes(t)))
        edges.push({ source: bookmarks[i].id, target: bookmarks[j].id })
    }
  }
  const connCount: Record<string, number> = {}
  bookmarks.forEach(b => { connCount[b.id] = 0 })
  edges.forEach(e => { connCount[e.source]++; connCount[e.target]++ })
  return { edges, connCount }
}

interface SimNode {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

export default function GraphView({ bookmarks }: { bookmarks: Bookmark[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [renderNodes, setRenderNodes] = useState<RenderNode[]>([])
  const [renderEdges, setRenderEdges] = useState<RenderEdge[]>([])
  const [imgErr, setImgErr] = useState<Set<string>>(new Set())
  const [view, setView] = useState({ tx: 0, ty: 0, scale: 1 })
  const panning = useRef(false)
  const lastPt = useRef({ x: 0, y: 0 })
  const simRef = useRef<SimNode[]>([])
  const dragNode = useRef<string | null>(null)
  const frameRef = useRef(0)
  const didDrag = useRef(false)
  const hostnameMap = useRef<Record<string, string>>({})
  const pinnedNodes = useRef<Set<string>>(new Set())

  const { edges, connCount } = useMemo(() => buildGraph(bookmarks), [bookmarks])
  const edgesRef = useRef(edges)
  edgesRef.current = edges

  function startSim(W: number, H: number, cx: number, cy: number) {
    const nodes = simRef.current
    if (nodes.length === 0) return
    const REP_STR = 3000
    const SPRING_K = 0.005
    const CTR_GRAV = 0.01
    const DAMP = 0.85
    let frame = 0
    const limit = 300

    function tick() {
      frame++
      if (frame > limit) { frameRef.current = 0; return }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          let dx = a.x - b.x
          let dy = a.y - b.y
          let dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 1) dist = 1
          const force = REP_STR / (dist * dist)
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          a.vx += fx
          a.vy += fy
          b.vx -= fx
          b.vy -= fy
        }
      }

      for (const e of edges) {
        const a = nodes.find(n => n.id === e.source)
        const b = nodes.find(n => n.id === e.target)
        if (!a || !b) continue
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const ideal = a.r + b.r + 40
        const disp = dist - ideal
        const fx = (dx / dist) * disp * SPRING_K
        const fy = (dy / dist) * disp * SPRING_K
        a.vx += fx
        a.vy += fy
        b.vx -= fx
        b.vy -= fy
      }

      for (const n of nodes) {
        if (dragNode.current === n.id || pinnedNodes.current.has(n.id)) continue
        n.vx += (cx - n.x) * CTR_GRAV
        n.vy += (cy - n.y) * CTR_GRAV
        n.vx *= DAMP
        n.vy *= DAMP
        n.x += n.vx
        n.y += n.vy
        n.x = Math.max(10, Math.min(W - 10, n.x))
        n.y = Math.max(10, Math.min(H - 10, n.y))
      }

      setRenderNodes(nodes.map(n => ({ id: n.id, x: n.x, y: n.y, r: n.r, title: bookmarks.find(b => b.id === n.id)?.title ?? '', url: bookmarks.find(b => b.id === n.id)?.url ?? '', hostname: hostnameMap.current[n.id] ?? '' })))
      setRenderEdges(edges)
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const W = svg.clientWidth || 800
    const H = svg.clientHeight || 600
    const cx = W / 2
    const cy = H / 2
    const spread = Math.min(W, H) * 0.35

    hostnameMap.current = {}
    bookmarks.forEach(b => { hostnameMap.current[b.id] = new URL(b.url).hostname })

    simRef.current = bookmarks.map(b => ({
      id: b.id,
      x: cx + (Math.random() - 0.5) * spread * 2,
      y: cy + (Math.random() - 0.5) * spread * 2,
      vx: 0,
      vy: 0,
      r: 6 + Math.min(connCount[b.id], 8) * 2,
    }))

    setRenderNodes(simRef.current.map(n => ({ id: n.id, x: n.x, y: n.y, r: n.r, title: bookmarks.find(b => b.id === n.id)?.title ?? '', url: bookmarks.find(b => b.id === n.id)?.url ?? '', hostname: hostnameMap.current[n.id] })))
    setRenderEdges(edges)
    startSim(W, H, cx, cy)
    return () => cancelAnimationFrame(frameRef.current)
  }, [bookmarks, edges, connCount])

  const highlightSet = useMemo(() => {
    if (!hovered) return new Set<string>()
    const s = new Set<string>([hovered])
    for (const e of edgesRef.current) {
      if (e.source === hovered) s.add(e.target)
      if (e.target === hovered) s.add(e.source)
    }
    return s
  }, [hovered])

  const panRef = useRef({ tx: 0, ty: 0, scale: 1 })

  function screenToGraph(sx: number, sy: number) {
    const p = panRef.current
    return { x: (sx - p.tx) / p.scale, y: (sy - p.ty) / p.scale }
  }

  function onWheel(e: React.WheelEvent) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const p = panRef.current
    const oldScale = p.scale
    const factor = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.max(0.2, Math.min(5, oldScale * factor))
    p.tx = mx - (mx - p.tx) * (newScale / oldScale)
    p.ty = my - (my - p.ty) * (newScale / oldScale)
    p.scale = newScale
    setView({ tx: p.tx, ty: p.ty, scale: p.scale })
  }

  function onNodeMouseDown(e: React.MouseEvent, id: string) {
    if (e.button !== 0) return
    e.stopPropagation()
    dragNode.current = id
    didDrag.current = false
    lastPt.current = { x: e.clientX, y: e.clientY }
    const node = simRef.current.find(n => n.id === id)
    if (node) { node.vx = 0; node.vy = 0 }
  }

  function onMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return
    panning.current = true
    lastPt.current = { x: e.clientX, y: e.clientY }
  }

  function onMouseMove(e: React.MouseEvent) {
    const dn = dragNode.current
    if (dn) {
      const dx = e.clientX - lastPt.current.x
      const dy = e.clientY - lastPt.current.y
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.current = true
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const g = screenToGraph(e.clientX - rect.left, e.clientY - rect.top)
      const node = simRef.current.find(n => n.id === dn)
      if (node) {
        node.x = Math.max(10, Math.min(8000, g.x))
        node.y = Math.max(10, Math.min(6000, g.y))
        setRenderNodes(simRef.current.map(n => ({ id: n.id, x: n.x, y: n.y, r: n.r, title: bookmarks.find(b => b.id === n.id)?.title ?? '', url: bookmarks.find(b => b.id === n.id)?.url ?? '', hostname: hostnameMap.current[n.id] ?? '' })))
      }
      return
    }
    if (!panning.current) return
    const dx = e.clientX - lastPt.current.x
    const dy = e.clientY - lastPt.current.y
    lastPt.current = { x: e.clientX, y: e.clientY }
    const p = panRef.current
    p.tx += dx
    p.ty += dy
    setView({ tx: p.tx, ty: p.ty, scale: p.scale })
  }

  function onMouseUp() {
    if (dragNode.current) {
      const did = didDrag.current
      const id = dragNode.current
      dragNode.current = null
      if (did) {
        pinnedNodes.current = new Set(pinnedNodes.current).add(id)
        const svg = svgRef.current
        if (svg) {
          const W = svg.clientWidth || 800
          const H = svg.clientHeight || 600
          cancelAnimationFrame(frameRef.current)
          startSim(W, H, W / 2, H / 2)
        }
      }
    }
    panning.current = false
  }

  function resetGraph() {
    cancelAnimationFrame(frameRef.current)
    pinnedNodes.current = new Set()
    setView({ tx: 0, ty: 0, scale: 1 })
    const svg = svgRef.current
    if (!svg) return
    const W = svg.clientWidth || 800
    const H = svg.clientHeight || 600
    const cx = W / 2
    const cy = H / 2
    const spread = Math.min(W, H) * 0.35
    simRef.current.forEach(n => {
      n.x = cx + (Math.random() - 0.5) * spread * 2
      n.y = cy + (Math.random() - 0.5) * spread * 2
      n.vx = 0
      n.vy = 0
    })
    setRenderNodes(simRef.current.map(n => ({ id: n.id, x: n.x, y: n.y, r: n.r, title: bookmarks.find(b => b.id === n.id)?.title ?? '', url: bookmarks.find(b => b.id === n.id)?.url ?? '', hostname: hostnameMap.current[n.id] ?? '' })))
    startSim(W, H, cx, cy)
  }

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        className="h-[600px] w-full rounded-xl cursor-grab"
        style={{ background: 'var(--ds-surface)' }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
      <g transform={`translate(${view.tx}, ${view.ty}) scale(${view.scale})`}>
        {renderEdges.map(e => {
          const a = renderNodes.find(n => n.id === e.source)
          const b = renderNodes.find(n => n.id === e.target)
          if (!a || !b) return null
          const hl = highlightSet.has(e.source) && highlightSet.has(e.target)
          return (
            <line
              key={`${e.source}-${e.target}`}
              x1={a.x} y1={a.y}
              x2={b.x} y2={b.y}
              stroke={hl ? 'var(--ds-icon-brand)' : 'var(--ds-border)'}
              strokeWidth={hl ? 2 : 1}
              opacity={hovered ? (hl ? 0.8 : 0.15) : 0.3}
            />
          )
        })}
        {renderNodes.map(n => {
          const hl = highlightSet.has(n.id)
          const err = imgErr.has(n.id)
          const groupOpacity = hovered && !hl ? 0.2 : 1
          return (
            <g
              key={n.id}
              opacity={groupOpacity}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              onMouseDown={e => onNodeMouseDown(e, n.id)}
              onClick={e => { if (didDrag.current) e.preventDefault() }}
              style={{ cursor: 'pointer' }}
            >
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => {
                  if (didDrag.current) {
                    e.preventDefault()
                  }
                  e.stopPropagation()
                }}
              >
                <circle
                  cx={n.x} cy={n.y} r={n.r}
                  fill="var(--ds-background-neutral)"
                  stroke={hl ? 'var(--ds-icon-brand)' : 'var(--ds-border)'}
                  strokeWidth={hl ? 2 : 1.5}
                />
                <foreignObject x={n.x - n.r} y={n.y - n.r} width={n.r * 2} height={n.r * 2}>
                  <div
                    style={{
                      width: '100%', height: '100%', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden', pointerEvents: 'none',
                    }}
                  >
                    {err ? (
                      <span style={{ fontWeight: 700, fontSize: n.r * 0.7, color: 'var(--ds-text-subtle)', userSelect: 'none' }}>
                        {n.title.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${n.hostname}&sz=64`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={() => setImgErr(prev => new Set(prev).add(n.id))}
                      />
                    )}
                  </div>
                </foreignObject>
              </a>
              {hl && (
                <text
                  x={n.x} y={n.y + n.r + 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--ds-text-subtlest)"
                  pointerEvents="none"
                >
                  {n.title}
                </text>
              )}
            </g>
          )
        })}
      </g>
      </svg>
      <button
        type="button"
        onClick={resetGraph}
        className="absolute right-2 top-2 inline-flex size-7 cursor-pointer items-center justify-center rounded-md border text-xs transition hover:opacity-80 active:scale-90"
        style={{
          background: 'var(--ds-background-neutral-subtle)',
          borderColor: 'var(--ds-border)',
          color: 'var(--ds-text-subtlest)',
        }}
        title="Reset graph"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M2 8a6 6 0 0111.33-3M14 2v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 8a6 6 0 01-11.33 3M2 14v-3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
