import { useEffect, useState } from 'react'
import type { Bookmark } from '../types'

export default function VisualTileView({ bookmarks, dragId, dropId, onDragStart, onDragOver, onDragEnd, onDrop, onEdit, onRemove, onVisit }: {
  bookmarks: Bookmark[]
  dragId: string | null
  dropId: string | null
  onDragStart: (id: string) => void
  onDragOver: (id: string) => void
  onDragEnd: () => void
  onDrop: (id: string) => void
  onEdit: (b: Bookmark) => void
  onRemove: (id: string) => void
  onVisit: (id: string) => void
}) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
      {bookmarks.map(b => (
        <VisualTile
          key={b.id}
          b={b}
          dragging={dragId === b.id}
          droptarget={dropId === b.id && !!dragId}
          onDragStart={() => onDragStart(b.id)}
          onDragOver={() => onDragOver(b.id)}
          onDragEnd={onDragEnd}
          onDrop={() => onDrop(b.id)}
          onEdit={() => onEdit(b)}
          onRemove={() => onRemove(b.id)}
          onVisit={() => onVisit(b.id)}
        />
      ))}
    </div>
  )
}

function VisualTile({ b, dragging, droptarget, onDragStart, onDragOver, onDragEnd, onDrop, onEdit, onRemove, onVisit }: {
  b: Bookmark
  dragging: boolean
  droptarget: boolean
  onDragStart: () => void
  onDragOver: () => void
  onDragEnd: () => void
  onDrop: () => void
  onEdit: () => void
  onRemove: () => void
  onVisit: () => void
}) {
  const hostname = new URL(b.url).hostname
  const faviconSrc = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
  const [ogUrl, setOgUrl] = useState<string | null>(null)
  const [imgOk, setImgOk] = useState<'loading' | 'ok' | 'fail'>('loading')

  useEffect(() => {
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(b.url)}`)
      .then(r => r.json())
      .then(data => {
        const url = data?.data?.image?.url
        if (url && typeof url === 'string') setOgUrl(url)
      })
      .catch(() => {})
  }, [b.url])

  const src = ogUrl || faviconSrc

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={e => { e.preventDefault(); onDragOver() }}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`group mb-4 break-inside-avoid overflow-hidden rounded-xl border transition-all ${dragging ? 'opacity-30' : ''} ${droptarget ? 'pt-7' : ''}`}
      style={{
        background: 'var(--ds-surface)',
        borderColor: droptarget ? 'var(--ds-border-focused)' : 'var(--ds-border)',
        boxShadow: droptarget ? 'var(--ds-shadow-overlay)' : 'var(--ds-shadow-raised)',
        cursor: 'grab',
        ...(droptarget ? { borderTopWidth: 3, borderTopColor: 'var(--ds-background-brand-bold)' } : {}),
      }}
    >
      <a
        href={b.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline hover:-translate-y-0.5 transition-transform"
        onClick={onVisit}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ background: 'var(--ds-background-neutral)' }}>
          <img
            src={src}
            alt=""
            className="size-full object-cover"
            loading="lazy"
            onLoad={e => {
              if (!ogUrl && e.currentTarget.naturalWidth <= 16) { setImgOk('fail'); return }
              setImgOk('ok')
            }}
            onError={() => {
              if (ogUrl) { setOgUrl(null); setImgOk('loading'); return }
              setImgOk('fail')
            }}
          />
          {imgOk === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-8 animate-pulse rounded-full" style={{ background: 'var(--ds-skeleton)' }} />
            </div>
          )}
          {imgOk === 'fail' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-2xl text-2xl font-bold" style={{ background: 'var(--ds-background-brand-subtlest)', color: 'var(--ds-icon-brand)' }}>
                {b.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="truncate text-sm font-semibold" style={{ color: 'var(--ds-text)' }}>
            {b.title}
          </p>
          <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--ds-text-subtlest)' }}>
            {hostname}
          </p>
        </div>
      </a>

      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md border text-xs transition active:scale-90"
          style={{
            background: 'var(--ds-surface)',
            borderColor: 'var(--ds-border)',
            color: 'var(--ds-text-subtle)',
          }}
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M11.5 1.5l3 3L5 14H2v-3l9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md border text-xs transition active:scale-90"
          style={{
            background: 'var(--ds-surface)',
            borderColor: 'var(--ds-border)',
            color: 'var(--ds-text-danger)',
          }}
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M5 4V2.5A1.5 1.5 0 016.5 1h3A1.5 1.5 0 0111 2.5V4M13 4v9.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 13.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
