import { useState } from 'react'
import type { Bookmark } from '../types'
import TruncatedText from './TruncatedText'

export default function BookmarkCard({ b, dragId, dropId, onDragStart, onDragOver, onDragEnd, onDrop, onEdit, onRemove }: {
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
      className={`group relative flex flex-col rounded-xl border p-4 transition-all hover:-translate-y-0.5 ${dragId === b.id ? 'opacity-30' : ''} ${dropId === b.id && dragId ? 'pt-7' : ''}`}
      style={{
        background: 'var(--ds-surface)',
        borderColor: dropId === b.id ? 'var(--ds-border-focused)' : 'var(--ds-border)',
        boxShadow: dropId === b.id ? 'var(--ds-shadow-overlay)' : 'var(--ds-shadow-raised)',
        cursor: 'grab',
        ...(dropId === b.id && dragId ? { borderTopWidth: 3, borderTopColor: 'var(--ds-background-brand-bold)' } : {}),
      }}
    >
      <div className="flex items-start gap-3">
        {imgErr ? (
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded" style={{ background: 'var(--ds-background-neutral)', color: 'var(--ds-text-subtlest)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M2 12l3-3 3 3 4-4 4 4 3-3 3 3" />
            </svg>
          </span>
        ) : (
          <img
            src={`https://www.google.com/s2/favicons?domain=${new URL(b.url).hostname}&sz=32`}
            alt=""
            width="20"
            height="20"
            className="mt-0.5 shrink-0 rounded"
            loading="lazy"
            onError={() => setImgErr(true)}
          />
        )}
        <div className="min-w-0 flex-1">
          <TruncatedText
            text={b.title}
            as="a"
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-semibold no-underline transition hover:underline"
            style={{ color: 'var(--ds-text)' }}
          />
          <TruncatedText
            text={new URL(b.url).hostname}
            className="mt-0.5 text-xs"
            style={{ color: 'var(--ds-text-subtlest)' }}
          />
        </div>
      </div>

      {b.description && (
        <TruncatedText
          text={b.description}
          as="p"
          lines={2}
          className="flex-1 text-xs leading-relaxed"
          style={{ color: 'var(--ds-text-subtle)' }}
        />
      )}

      {b.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1 pt-2">
          {b.tags.map(t => (
            <span
              key={t}
              className="inline-block rounded-md px-2 py-0.5 text-[11px] font-medium"
              style={{
                background: 'var(--ds-background-neutral)',
                color: 'var(--ds-text-subtle)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(b)}
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
          onClick={() => onRemove(b.id)}
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
    </article>
  )
}
