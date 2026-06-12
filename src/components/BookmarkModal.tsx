import type { Bookmark } from '../types'

export default function BookmarkModal({ editing, form, onClose, onSubmit, onChange }: {
  editing: Bookmark | null
  form: { title: string; url: string; description: string; tags: string }
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onChange: (field: string, value: string) => void
}) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center sm:items-center p-4 animate-in fade-in"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl border shadow-xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0"
        style={{
          background: 'var(--ds-surface-overlay)',
          borderColor: 'var(--ds-border)',
          animation: 'modalIn 0.25s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--ds-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-xl"
              style={{ background: 'var(--ds-background-brand-subtlest)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--ds-icon-brand)' }}>
                {editing ? (
                  <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                ) : (
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                )}
              </svg>
            </div>
            <div>
              <h2
                className="m-0 text-base font-semibold"
                style={{ color: 'var(--ds-text)', fontFamily: 'var(--ds-font-family-heading)' }}
              >
                {editing ? 'Edit bookmark' : 'New bookmark'}
              </h2>
              <p className="m-0 text-xs" style={{ color: 'var(--ds-text-subtlest)' }}>
                {editing ? 'Update the details below' : 'Fill in the details below'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border text-xs transition hover:opacity-80 active:scale-90"
            style={{
              background: 'var(--ds-background-neutral-subtle)',
              borderColor: 'var(--ds-border)',
              color: 'var(--ds-text-subtlest)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4l-8 8M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5 p-6">
          <InputField
            label="Title"
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ds-text-subtlest)' }}>
              <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 6h12" stroke="currentColor" strokeWidth="1.5" />
            </svg>}
            type="text"
            required
            value={form.title}
            onChange={v => onChange('title', v)}
            placeholder="Enter a descriptive name"
          />

          <InputField
            label="URL"
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ds-text-subtlest)' }}>
              <path d="M6 10l4-4M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 2a11.2 11.2 0 013 6 11.2 11.2 0 01-3 6 11.2 11.2 0 01-3-6 11.2 11.2 0 013-6z" stroke="currentColor" strokeWidth="1.5" />
            </svg>}
            type="url"
            required
            value={form.url}
            onChange={v => onChange('url', v)}
            placeholder="https://example.com"
          />

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ds-text-subtlest)' }}>
              Description
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-3 flex items-start">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ds-text-subtlest)' }}>
                  <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <textarea
                value={form.description}
                onChange={e => onChange('description', e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none transition"
                style={{
                  background: 'var(--ds-background-input)',
                  borderColor: 'var(--ds-border-input)',
                  color: 'var(--ds-text)',
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--ds-border-focused)'
                  e.target.style.boxShadow = '0 0 0 3px var(--ds-background-brand-subtlest)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--ds-border-input)'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Optional description or notes"
              />
            </div>
          </div>

          <InputField
            label="Tags"
            icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ds-text-subtlest)' }}>
              <path d="M2 7.5V3a1 1 0 011-1h4.5a1 1 0 01.7.3l5.5 5.5a1 1 0 010 1.4l-4.5 4.5a1 1 0 01-1.4 0l-5.5-5.5A1 1 0 012 7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="5.5" cy="5.5" r="1" fill="currentColor" />
            </svg>}
            type="text"
            value={form.tags}
            onChange={v => onChange('tags', v)}
            placeholder="react, frontend, design"
            hint="Separate tags with commas"
          />

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition active:scale-95"
              style={{
                background: 'var(--ds-background-neutral-subtle)',
                borderColor: 'var(--ds-border)',
                color: 'var(--ds-text-subtle)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition active:scale-95"
              style={{
                background: 'var(--ds-background-brand-bold)',
                borderColor: 'transparent',
                color: 'var(--ds-text-inverse)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--ds-background-brand-bold-hovered)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--ds-background-brand-bold)')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 4L6 11l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {editing ? 'Save changes' : 'Add bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InputField({ label, icon, type, required, value, onChange, placeholder, hint }: {
  label: string
  icon: React.ReactNode
  type: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  placeholder: string
  hint?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ds-text-subtlest)' }}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          {icon}
        </span>
        <input
          type={type}
          required={required}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none transition"
          style={{
            background: 'var(--ds-background-input)',
            borderColor: 'var(--ds-border-input)',
            color: 'var(--ds-text)',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'var(--ds-border-focused)'
            e.target.style.boxShadow = '0 0 0 3px var(--ds-background-brand-subtlest)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--ds-border-input)'
            e.target.style.boxShadow = 'none'
          }}
          placeholder={placeholder}
        />
      </div>
      {hint && (
        <p className="mt-1.5 text-xs" style={{ color: 'var(--ds-text-subtlest)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}
