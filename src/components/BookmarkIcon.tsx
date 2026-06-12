import { useState } from 'react'
import type { Bookmark } from '../types'
import TruncatedText from './TruncatedText'

export default function BookmarkIcon({ b, dragId, dropId, onDragStart, onDragOver, onDragEnd, onDrop, onEdit, onRemove, onVisit }: {
  b: Bookmark
  dragId: string | null
  dropId: string | null
  onDragStart: () => void
  onDragOver: () => void
  onDragEnd: () => void
  onDrop: () => void
  onEdit: (b: Bookmark) => void
  onRemove: (id: string) => void
  onVisit: (id: string) => void
}) {
  const [imgOk, setImgOk] = useState<boolean | null>(null)

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragOver={e => { e.preventDefault(); onDragOver() }}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`group relative flex flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center transition-all hover:-translate-y-0.5 ${dragId === b.id ? 'opacity-30' : ''} ${dropId === b.id && dragId ? 'pt-7' : ''} aspect-square`}
      style={{
        background: 'var(--ds-surface)',
        borderColor: dropId === b.id ? 'var(--ds-border-focused)' : 'var(--ds-border)',
        boxShadow: dropId === b.id ? 'var(--ds-shadow-overlay)' : 'var(--ds-shadow-raised)',
        cursor: 'grab',
        ...(dropId === b.id && dragId ? { borderTopWidth: 3, borderTopColor: 'var(--ds-background-brand-bold)' } : {}),
      }}
    >
      <a
        href={b.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 w-full text-center no-underline"
        style={{ color: 'inherit' }}
        onClick={() => onVisit(b.id)}
      >
        {imgOk === false ? (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold" style={{ background: 'var(--ds-background-brand-subtlest)', color: 'var(--ds-icon-brand)' }}>
            {b.title.charAt(0).toUpperCase()}
          </span>
        ) : (
          <img
            src={`https://www.google.com/s2/favicons?domain=${new URL(b.url).hostname}&sz=48`}
            alt=""
            width="24"
            height="24"
            className={`shrink-0 rounded-md ${imgOk === null ? 'opacity-0' : ''}`}
            loading="lazy"
            onLoad={e => setImgOk(e.currentTarget.naturalWidth > 16)}
            onError={() => setImgOk(false)}
          />
        )}

        <div className="min-w-0 w-full max-w-full">
          <TruncatedText
            text={b.title}
            className="block w-full text-[11px] font-semibold leading-tight no-underline transition hover:underline"
            style={{ color: 'var(--ds-text)' }}
          />
        </div>
      </a>

      <div className="absolute right-1.5 top-1.5 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(b)}
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-xs transition hover:opacity-80 active:scale-90"
          style={{ color: 'var(--ds-text-subtle)' }}
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M11.5 1.5l3 3L5 14H2v-3l9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onRemove(b.id)}
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-xs transition hover:opacity-80 active:scale-90"
          style={{ color: 'var(--ds-text-danger)' }}
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M5 4V2.5A1.5 1.5 0 016.5 1h3A1.5 1.5 0 0111 2.5V4M13 4v9.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 13.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </article>
  )
}
