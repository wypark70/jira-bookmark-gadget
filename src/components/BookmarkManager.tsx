import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { setGlobalTheme } from '@atlaskit/tokens'

interface Bookmark {
  id: string
  title: string
  url: string
  description: string
  tags: string[]
  createdAt: number
}

const STORAGE_KEY = 'jira-bookmarks'

let _id = 0
function id() { return String(++_id) }
function day(n: number) { return Date.now() - n * 86400000 }

const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: id(), title: 'React Documentation', url: 'https://react.dev', description: 'The library for web and native user interfaces', tags: ['react', 'frontend'], createdAt: day(0) },
  { id: id(), title: 'Next.js', url: 'https://nextjs.org', description: 'The React framework for production', tags: ['react', 'frontend', 'ssr'], createdAt: day(0) },
  { id: id(), title: 'Vue.js', url: 'https://vuejs.org', description: 'The progressive JavaScript framework', tags: ['vue', 'frontend'], createdAt: day(0) },
  { id: id(), title: 'Nuxt', url: 'https://nuxt.com', description: 'The intuitive Vue framework', tags: ['vue', 'frontend', 'ssr'], createdAt: day(0) },
  { id: id(), title: 'Svelte', url: 'https://svelte.dev', description: 'Cybernetically enhanced web apps', tags: ['svelte', 'frontend'], createdAt: day(0) },
  { id: id(), title: 'Angular', url: 'https://angular.dev', description: 'The web development framework for building the future', tags: ['angular', 'frontend'], createdAt: day(0) },
  { id: id(), title: 'SolidJS', url: 'https://www.solidjs.com', description: 'Simple and performant reactivity for building user interfaces', tags: ['solid', 'frontend'], createdAt: day(1) },
  { id: id(), title: 'Astro', url: 'https://astro.build', description: 'The web framework for content-driven websites', tags: ['astro', 'frontend', 'ssr'], createdAt: day(1) },
  { id: id(), title: 'Tailwind CSS', url: 'https://tailwindcss.com', description: 'Utility-first CSS framework', tags: ['css', 'tailwind', 'frontend'], createdAt: day(1) },
  { id: id(), title: 'shadcn/ui', url: 'https://ui.shadcn.com', description: 'Beautifully designed components built with Radix UI and Tailwind', tags: ['react', 'ui', 'tailwind'], createdAt: day(1) },
  { id: id(), title: 'Radix UI', url: 'https://www.radix-ui.com', description: 'Unstyled, accessible UI components', tags: ['react', 'ui', 'accessibility'], createdAt: day(1) },
  { id: id(), title: 'Atlassian Design System', url: 'https://atlassian.design', description: 'Design tokens, components, and guidelines', tags: ['design', 'atlassian', 'ui'], createdAt: day(1) },
  { id: id(), title: 'Storybook', url: 'https://storybook.js.org', description: 'Frontend workshop for building UI components in isolation', tags: ['tools', 'testing', 'ui'], createdAt: day(2) },
  { id: id(), title: 'TypeScript', url: 'https://www.typescriptlang.org', description: 'JavaScript with syntax for types', tags: ['typescript', 'language'], createdAt: day(2) },
  { id: id(), title: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Comprehensive web development documentation', tags: ['docs', 'reference'], createdAt: day(2) },
  { id: id(), title: 'Node.js', url: 'https://nodejs.org', description: 'JavaScript runtime built on Chrome V8', tags: ['node', 'backend', 'runtime'], createdAt: day(2) },
  { id: id(), title: 'Deno', url: 'https://deno.com', description: 'The next-generation JavaScript runtime', tags: ['deno', 'runtime', 'backend'], createdAt: day(2) },
  { id: id(), title: 'Bun', url: 'https://bun.sh', description: 'All-in-one JavaScript runtime & toolkit', tags: ['bun', 'runtime', 'backend'], createdAt: day(2) },
  { id: id(), title: 'Vite', url: 'https://vite.dev', description: 'Next-generation frontend tooling', tags: ['vite', 'build', 'frontend'], createdAt: day(2) },
  { id: id(), title: 'Vitest', url: 'https://vitest.dev', description: 'Blazing fast unit test framework powered by Vite', tags: ['vite', 'testing', 'frontend'], createdAt: day(3) },
  { id: id(), title: 'Playwright', url: 'https://playwright.dev', description: 'Reliable end-to-end testing for modern web apps', tags: ['testing', 'e2e', 'automation'], createdAt: day(3) },
  { id: id(), title: 'Cypress', url: 'https://www.cypress.io', description: 'Fast, easy and reliable testing for anything that runs in a browser', tags: ['testing', 'e2e'], createdAt: day(3) },
  { id: id(), title: 'ESLint', url: 'https://eslint.org', description: 'Find and fix problems in your JavaScript code', tags: ['lint', 'tools'], createdAt: day(3) },
  { id: id(), title: 'Prettier', url: 'https://prettier.io', description: 'Opinionated code formatter', tags: ['format', 'tools'], createdAt: day(3) },
  { id: id(), title: 'Prisma', url: 'https://www.prisma.io', description: 'Next-generation ORM for Node.js and TypeScript', tags: ['orm', 'database', 'backend'], createdAt: day(3) },
  { id: id(), title: 'Drizzle ORM', url: 'https://orm.drizzle.team', description: 'TypeScript ORM with SQL-like query API', tags: ['orm', 'database', 'backend'], createdAt: day(4) },
  { id: id(), title: 'Supabase', url: 'https://supabase.com', description: 'Open-source Firebase alternative with Postgres', tags: ['database', 'backend', 'baas'], createdAt: day(4) },
  { id: id(), title: 'Firebase', url: 'https://firebase.google.com', description: 'Google platform for building and scaling apps', tags: ['backend', 'baas', 'google'], createdAt: day(4) },
  { id: id(), title: 'Vercel', url: 'https://vercel.com', description: 'Develop, preview, and ship your web apps', tags: ['hosting', 'deploy', 'platform'], createdAt: day(4) },
  { id: id(), title: 'Netlify', url: 'https://www.netlify.com', description: 'Ship websites and web apps with ease', tags: ['hosting', 'deploy', 'platform'], createdAt: day(4) },
  { id: id(), title: 'Cloudflare Developers', url: 'https://developers.cloudflare.com', description: 'Cloudflare developer platform and docs', tags: ['cloud', 'cdn', 'platform'], createdAt: day(4) },
  { id: id(), title: 'AWS Documentation', url: 'https://docs.aws.amazon.com', description: 'Amazon Web Services documentation and guides', tags: ['aws', 'cloud', 'docs'], createdAt: day(5) },
  { id: id(), title: 'GitHub', url: 'https://github.com', description: 'Where the world builds software', tags: ['github', 'git', 'platform'], createdAt: day(5) },
  { id: id(), title: 'GitLab', url: 'https://gitlab.com', description: 'DevOps platform delivered as a single application', tags: ['gitlab', 'git', 'ci-cd'], createdAt: day(5) },
  { id: id(), title: 'Docker Hub', url: 'https://hub.docker.com', description: 'Container image registry and documentation', tags: ['docker', 'containers', 'devops'], createdAt: day(5) },
  { id: id(), title: 'Jira REST API', url: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/', description: 'Jira Cloud REST API reference and guides', tags: ['jira', 'api', 'atlassian'], createdAt: day(5) },
  { id: id(), title: 'Confluence API', url: 'https://developer.atlassian.com/cloud/confluence/rest/', description: 'Confluence Cloud REST API reference', tags: ['confluence', 'api', 'atlassian'], createdAt: day(5) },
  { id: id(), title: 'Postman', url: 'https://www.postman.com', description: 'API platform for building and using APIs', tags: ['api', 'testing', 'tools'], createdAt: day(6) },
  { id: id(), title: 'Swagger', url: 'https://swagger.io', description: 'API documentation and design tools', tags: ['api', 'docs', 'tools'], createdAt: day(6) },
  { id: id(), title: 'GraphQL', url: 'https://graphql.org', description: 'A query language for your API', tags: ['graphql', 'api', 'backend'], createdAt: day(6) },
  { id: id(), title: 'Apollo GraphQL', url: 'https://www.apollographql.com', description: 'GraphQL platform for the modern web', tags: ['graphql', 'api', 'frontend'], createdAt: day(6) },
  { id: id(), title: 'tRPC', url: 'https://trpc.io', description: 'End-to-end typesafe APIs with zero schemas', tags: ['trpc', 'api', 'typescript'], createdAt: day(6) },
  { id: id(), title: 'Redis', url: 'https://redis.io', description: 'The open-source, in-memory data store', tags: ['redis', 'database', 'cache'], createdAt: day(6) },
  { id: id(), title: 'PostgreSQL', url: 'https://www.postgresql.org', description: 'The world\'s most advanced open-source database', tags: ['postgres', 'database', 'sql'], createdAt: day(7) },
  { id: id(), title: 'SQLite', url: 'https://www.sqlite.org', description: 'Small, fast, self-contained SQL database engine', tags: ['sqlite', 'database', 'sql'], createdAt: day(7) },
  { id: id(), title: 'MongoDB', url: 'https://www.mongodb.com', description: 'Developer data platform and document database', tags: ['mongodb', 'database', 'nosql'], createdAt: day(7) },
  { id: id(), title: 'Figma', url: 'https://www.figma.com', description: 'Collaborative interface design tool', tags: ['design', 'ui', 'prototyping'], createdAt: day(7) },
  { id: id(), title: 'Excalidraw', url: 'https://excalidraw.com', description: 'Virtual whiteboard for sketching diagrams', tags: ['design', 'diagram', 'tools'], createdAt: day(7) },
  { id: id(), title: 'CodeSandbox', url: 'https://codesandbox.io', description: 'Online code editor for web applications', tags: ['editor', 'sandbox', 'tools'], createdAt: day(7) },
  { id: id(), title: 'StackBlitz', url: 'https://stackblitz.com', description: 'Instant dev environments for the web', tags: ['editor', 'sandbox', 'tools'], createdAt: day(8) },
  { id: id(), title: 'JS Bin', url: 'https://jsbin.com', description: 'Collaborative JavaScript debugging tool', tags: ['editor', 'sandbox', 'tools'], createdAt: day(8) },
  { id: id(), title: 'regex101', url: 'https://regex101.com', description: 'Online regular expression tester and debugger', tags: ['regex', 'tools'], createdAt: day(8) },
  { id: id(), title: 'Can I Use', url: 'https://caniuse.com', description: 'Browser support tables for modern web technologies', tags: ['compatibility', 'browser', 'reference'], createdAt: day(8) },
  { id: id(), title: 'BundlePhobia', url: 'https://bundlephobia.com', description: 'Find the cost of adding a npm package to your bundle', tags: ['performance', 'tools', 'npm'], createdAt: day(8) },
  { id: id(), title: 'npm', url: 'https://www.npmjs.com', description: 'Node package manager and registry', tags: ['npm', 'packages', 'registry'], createdAt: day(8) },
  { id: id(), title: 'OpenAI Platform', url: 'https://platform.openai.com', description: 'OpenAI API reference and developer platform', tags: ['ai', 'llm', 'api'], createdAt: day(9) },
  { id: id(), title: 'Anthropic Claude', url: 'https://docs.anthropic.com', description: 'Claude API documentation and developer guides', tags: ['ai', 'llm', 'api'], createdAt: day(9) },
  { id: id(), title: 'Hugging Face', url: 'https://huggingface.co', description: 'The AI community building the future', tags: ['ai', 'ml', 'models'], createdAt: day(9) },
  { id: id(), title: 'Web.dev by Google', url: 'https://web.dev', description: 'Guides and tools for building modern web experiences', tags: ['performance', 'web', 'guides'], createdAt: day(9) },
  { id: id(), title: 'Node Weekly', url: 'https://nodeweekly.com', description: 'Weekly newsletter covering Node.js news and articles', tags: ['node', 'newsletter'], createdAt: day(10) },
  { id: id(), title: 'React Status', url: 'https://react.statuscode.com', description: 'Weekly roundup of React news and articles', tags: ['react', 'newsletter'], createdAt: day(10) },
]

function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  saveBookmarks(DEFAULT_BOOKMARKS)
  return DEFAULT_BOOKMARKS
}

function saveBookmarks(bookmarks: Bookmark[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
}

type ViewMode = 'card' | 'icon'

function loadViewMode(): ViewMode {
  try {
    const raw = localStorage.getItem('jira-bookmarks-view')
    if (raw === 'card' || raw === 'icon') return raw
  } catch { /* ignore */ }
  return 'card'
}

function saveViewMode(mode: ViewMode) {
  localStorage.setItem('jira-bookmarks-view', mode)
}

function TruncatedText({ text, className, as: Tag = 'span', lines, ...props }: {
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

export default function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>(loadViewMode)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Bookmark | null>(null)
  const [form, setForm] = useState({ title: '', url: '', description: '', tags: '' })
  const [dragId, setDragId] = useState<string | null>(null)
  const [dropId, setDropId] = useState<string | null>(null)

  function moveBookmark(id: string) {
    if (!dragId || dragId === id) return
    setBookmarks(prev => {
      const from = prev.findIndex(b => b.id === dragId)
      const to = prev.findIndex(b => b.id === id)
      if (from === -1 || to === -1) return prev
      const copy = [...prev]
      const [moved] = copy.splice(from, 1)
      copy.splice(to, 0, moved)
      return copy
    })
    setDragId(null)
    setDropId(null)
  }

  const [colorMode, setColorMode] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('jira-bookmarks-theme')
      if (saved === 'light' || saved === 'dark') return saved
    } catch { /* ignore */ }
    return 'light'
  })

  useEffect(() => {
    setGlobalTheme({ colorMode })
    localStorage.setItem('jira-bookmarks-theme', colorMode)
  }, [colorMode])

  useEffect(() => {
    if (bookmarks.length > 0) saveBookmarks(bookmarks)
  }, [bookmarks])

  useEffect(() => {
    saveViewMode(viewMode)
  }, [viewMode])

  const filtered = bookmarks.filter(b => {
    const q = search.toLowerCase()
    return (
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.tags.some(t => t.toLowerCase().includes(q))
    )
  })

  function openAdd() {
    setEditing(null)
    setForm({ title: '', url: '', description: '', tags: '' })
    setShowModal(true)
  }

  function openEdit(b: Bookmark) {
    setEditing(b)
    setForm({
      title: b.title,
      url: b.url,
      description: b.description,
      tags: b.tags.join(', '),
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.url.trim()) return

    const tags = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    if (editing) {
      setBookmarks(prev =>
        prev.map(b =>
          b.id === editing.id
            ? { ...b, title: form.title.trim(), url: form.url.trim(), description: form.description.trim(), tags }
            : b,
        ),
      )
    } else {
      const bm: Bookmark = {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        url: form.url.trim(),
        description: form.description.trim(),
        tags,
        createdAt: Date.now(),
      }
      setBookmarks(prev => [bm, ...prev])
    }
    setShowModal(false)
  }

  function remove(id: string) {
    if (confirm('Delete this bookmark?')) {
      setBookmarks(prev => prev.filter(b => b.id !== id))
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ds-surface-sunken)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b px-4 py-3"
        style={{
          background: 'var(--ds-surface)',
          borderColor: 'var(--ds-border)',
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <h1
            className="m-0 text-lg font-semibold tracking-tight"
            style={{ color: 'var(--ds-text)', fontFamily: 'var(--ds-font-family-heading)' }}
          >
            Bookmarks
          </h1>

          <div className="flex flex-1 items-center gap-2 sm:max-w-md">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ds-text-subtlest)' }}>
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition"
                style={{
                  background: 'var(--ds-background-input)',
                  borderColor: 'var(--ds-border)',
                  color: 'var(--ds-text)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--ds-border-focused)')}
                onBlur={e => (e.target.style.borderColor = 'var(--ds-border)')}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode(m => m === 'card' ? 'icon' : 'card')}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border text-xs transition active:scale-90"
              style={{
                background: 'var(--ds-background-neutral-subtle)',
                borderColor: 'var(--ds-border)',
                color: 'var(--ds-text-subtlest)',
              }}
              title={viewMode === 'card' ? 'Icon view' : 'Card view'}
            >
              {viewMode === 'card' ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={openAdd}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition active:scale-95"
              style={{
                background: 'var(--ds-background-brand-bold)',
                borderColor: 'transparent',
                color: 'var(--ds-text-inverse)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--ds-background-brand-bold-hovered)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--ds-background-brand-bold)')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="mb-4 flex size-16 items-center justify-center rounded-2xl"
              style={{ background: 'var(--ds-background-neutral)' }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--ds-text-subtlest)' }}>
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-base font-medium" style={{ color: 'var(--ds-text)' }}>
              {search ? 'No bookmarks match your search' : 'No bookmarks yet'}
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--ds-text-subtlest)' }}>
              {search ? 'Try a different search term' : 'Click "Add" to create your first bookmark'}
            </p>
          </div>
        ) : viewMode === 'card' ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(b => (
              <article
                key={b.id}
                draggable
                onDragStart={() => { setDragId(b.id); setDropId(null) }}
                onDragOver={e => { e.preventDefault(); setDropId(b.id) }}
                onDragEnd={() => { setDragId(null); setDropId(null) }}
                onDrop={() => moveBookmark(b.id)}
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
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${new URL(b.url).hostname}&sz=32`}
                    alt=""
                    width="20"
                    height="20"
                    className="mt-0.5 shrink-0 rounded"
                    loading="lazy"
                  />
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

                <div
                  className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <button
                    type="button"
                    onClick={() => openEdit(b)}
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
                    onClick={() => remove(b.id)}
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
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filtered.map(b => (
              <article
                key={b.id}
                draggable
                onDragStart={() => { setDragId(b.id); setDropId(null) }}
                onDragOver={e => { e.preventDefault(); setDropId(b.id) }}
                onDragEnd={() => { setDragId(null); setDropId(null) }}
                onDrop={() => moveBookmark(b.id)}
                className={`group relative flex flex-col items-center gap-2 rounded-xl border p-4 pt-5 text-center transition-all hover:-translate-y-0.5 ${dragId === b.id ? 'opacity-30' : ''} ${dropId === b.id && dragId ? 'pt-8' : ''}`}
                style={{
                  background: 'var(--ds-surface)',
                  borderColor: dropId === b.id ? 'var(--ds-border-focused)' : 'var(--ds-border)',
                  boxShadow: dropId === b.id ? 'var(--ds-shadow-overlay)' : 'var(--ds-shadow-raised)',
                  cursor: 'grab',
                  ...(dropId === b.id && dragId ? { borderTopWidth: 3, borderTopColor: 'var(--ds-background-brand-bold)' } : {}),
                }}
              >
                <img
                  src={`https://www.google.com/s2/favicons?domain=${new URL(b.url).hostname}&sz=64`}
                  alt=""
                  width="32"
                  height="32"
                  className="shrink-0 rounded-lg"
                  loading="lazy"
                />

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
                    onClick={() => openEdit(b)}
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
                    onClick={() => remove(b.id)}
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
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-20 flex items-end justify-center sm:items-center p-4 animate-in fade-in"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowModal(false)}
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
            {/* Header */}
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
                onClick={() => setShowModal(false)}
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ds-text-subtlest)' }}>
                  Title
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ds-text-subtlest)' }}>
                      <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M2 6h12" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
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
                    placeholder="Enter a descriptive name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ds-text-subtlest)' }}>
                  URL
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ds-text-subtlest)' }}>
                      <path d="M6 10l4-4M8 14A6 6 0 108 2a6 6 0 000 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 2a11.2 11.2 0 013 6 11.2 11.2 0 01-3 6 11.2 11.2 0 01-3-6 11.2 11.2 0 013-6z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                  <input
                    type="url"
                    required
                    value={form.url}
                    onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
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
                    placeholder="https://example.com"
                  />
                </div>
              </div>

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
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
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

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--ds-text-subtlest)' }}>
                  Tags
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ds-text-subtlest)' }}>
                      <path d="M2 7.5V3a1 1 0 011-1h4.5a1 1 0 01.7.3l5.5 5.5a1 1 0 010 1.4l-4.5 4.5a1 1 0 01-1.4 0l-5.5-5.5A1 1 0 012 7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      <circle cx="5.5" cy="5.5" r="1" fill="currentColor" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
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
                    placeholder="react, frontend, design"
                  />
                </div>
                <p className="mt-1.5 text-xs" style={{ color: 'var(--ds-text-subtlest)' }}>
                  Separate tags with commas
                </p>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
      )}

      <button
        type="button"
        onClick={() => setColorMode(m => m === 'light' ? 'dark' : 'light')}
        className="fixed bottom-4 right-4 z-50 inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border shadow-lg transition active:scale-90"
        style={{
          background: 'var(--ds-surface-overlay)',
          borderColor: 'var(--ds-border)',
          color: 'var(--ds-text-subtle)',
        }}
        title={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      >
        {colorMode === 'light' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </button>
    </div>
  )
}
