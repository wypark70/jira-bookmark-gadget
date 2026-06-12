import { useState } from 'react'
import type { Bookmark } from '../types'
import TruncatedText from './TruncatedText'

export default function BookmarkIcon({ b, dragId, dropId, onDragStart, onDragOver, onDragEnd, onDrop, onEdit, onRemove }: {
  b: Bookmark
  dragId: string | null
  dropId: string | null
  onDragStart: () => void
  onDragOver: () => void
  onDragEnd: () => void
  onDrop: () => void
  onEdit: (b: Bookmark) => void
  onRemove: (id: string) => void
}) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragOver={e => { e.preventDefault(); onDragOver() }}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`group relative flex flex-col items-center gap-2 rounded-xl border p-4 pt-5 text-center transition-all hover:-translate-y-0.5 ${dragId === b.id ? 'opacity-30' : ''} ${dropId === b.id && dragId ? 'pt-8' : ''}`}
      style={{
        background: 'var(--ds-surface)',
        borderColor: dropId === b.id ? 'var(--ds-border-focused)' : 'var(--ds-border)',
        boxShadow: dropId === b.id ? 'var(--ds-shadow-overlay)' : 'var(--ds-shadow-raised)',
        cursor: 'grab',
        ...(dropId === b.id && dragId ? { borderTopWidth: 3, borderTopColor: 'var(--ds-background-brand-bold)' } : {}),
      }}
    >
      {imgErr ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ background: 'var(--ds-background-neutral)', color: 'var(--ds-text-subtlest)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M2 12l3-3 3 3 4-4 4 4 3-3 3 3" />
          </svg>
        </span>
      ) : (
        <img
          src={`https://www.google.com/s2/favicons?domain=${new URL(b.url).hostname}&sz=64`}
          alt=""
          width="32"
          height="32"
          className="shrink-0 rounded-lg"
          loading="lazy"
          onError={() => setImgErr(true)}
        />
      )}

      <div className="min-w-0 w-full max-w-full">
        <TruncatedText
          text={b.title}
          as="a"
          href={b.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-sm font-semibold no-underline transition hover:underline"
          style={{ color: 'var(--ds-text)' }}
        />
        <TruncatedText
          text={new URL(b.url).hostname}
          className="mt-0.5 block w-full text-xs"
          style={{ color: 'var(--ds-text-subtlest)' }}
        />
      </div>

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
