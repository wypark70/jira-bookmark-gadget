import { useState } from 'react'
import type { Bookmark } from '../types'
import TruncatedText from './TruncatedText'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export default function TimelineView({ bookmarks, onEdit, onRemove }: {
  bookmarks: Bookmark[]
  onEdit: (b: Bookmark) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="absolute bottom-0 left-[19px] top-0 w-px" style={{ background: 'var(--ds-border)' }} />
      {bookmarks
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((b) => <TimelineEntry key={b.id} b={b} onEdit={onEdit} onRemove={onRemove} />)}
    </div>
  )
}

function TimelineEntry({ b, onEdit, onRemove }: {
  b: Bookmark
  onEdit: (b: Bookmark) => void
  onRemove: (id: string) => void
}) {
  const [imgOk, setImgOk] = useState<boolean | null>(null)
  const hostname = new URL(b.url).hostname

  return (
    <div className="group relative flex gap-4 pb-8 pl-0">
      {/* timeline dot + favicon */}
      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className="relative z-10 flex size-[38px] items-center justify-center rounded-full border-2"
          style={{
            background: 'var(--ds-surface)',
            borderColor: 'var(--ds-border)',
          }}
        >
          {imgOk === false ? (
            <span className="flex size-full items-center justify-center rounded-full text-xs font-bold" style={{ background: 'var(--ds-background-brand-subtlest)', color: 'var(--ds-icon-brand)' }}>
              {b.title.charAt(0).toUpperCase()}
            </span>
          ) : (
            <img
              src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
              alt=""
              width="20"
              height="20"
              className={`rounded ${imgOk === null ? 'opacity-0' : ''}`}
              loading="lazy"
              onLoad={e => setImgOk(e.currentTarget.naturalWidth > 16)}
              onError={() => setImgOk(false)}
            />
          )}
        </div>
      </div>

      {/* content card */}
      <div
        className="min-w-0 flex-1 rounded-xl border p-4 transition-all"
        style={{
          background: 'var(--ds-surface)',
          borderColor: 'var(--ds-border)',
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <TruncatedText
                text={b.title}
                as="a"
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-semibold no-underline transition hover:underline"
                style={{ color: 'var(--ds-text)' }}
              />
              <span className="shrink-0 text-[11px]" style={{ color: 'var(--ds-text-subtlest)' }}>
                {timeAgo(b.createdAt)}
              </span>
            </div>
            <TruncatedText
              text={hostname}
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
            className="mt-2 text-xs leading-relaxed"
            style={{ color: 'var(--ds-text-subtle)' }}
          />
        )}

        {b.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
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

        {/* actions */}
        <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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
      </div>
    </div>
  )
}
