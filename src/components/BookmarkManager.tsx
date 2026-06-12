import { useEffect, useState } from 'react'
import { setGlobalTheme } from '@atlaskit/tokens'
import type { Bookmark, ViewMode } from '../types'
import BookmarkCard from './BookmarkCard'
import BookmarkIcon from './BookmarkIcon'
import BookmarkModal from './BookmarkModal'
import ThemeToggle from './ThemeToggle'

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
  { id: id(), title: 'Atlassian Developer', url: 'https://developer.atlassian.com', description: 'Official Atlassian developer documentation and guides', tags: ['atlassian', 'docs', 'plugin'], createdAt: day(10) },
  { id: id(), title: 'Forge Platform', url: 'https://developer.atlassian.com/platform/forge/', description: 'Build cloud apps for Atlassian products with Forge', tags: ['atlassian', 'forge', 'serverless'], createdAt: day(10) },
  { id: id(), title: 'Forge UI Kit', url: 'https://developer.atlassian.com/platform/forge/ui-kit/', description: 'Forge UI components for building Atlassian apps', tags: ['atlassian', 'forge', 'ui'], createdAt: day(10) },
  { id: id(), title: 'Atlassian Connect', url: 'https://developer.atlassian.com/cloud/jira/platform/about-connect/', description: 'Build cloud apps for Jira and Confluence via Connect', tags: ['atlassian', 'connect', 'api'], createdAt: day(10) },
  { id: id(), title: 'Forge CLI', url: 'https://developer.atlassian.com/platform/forge/forge-cli/', description: 'Command-line tool for Forge app development', tags: ['atlassian', 'forge', 'cli'], createdAt: day(10) },
  { id: id(), title: 'Atlassian Design', url: 'https://atlassian.design', description: 'Atlassian Design System, tokens, and component guidelines', tags: ['atlassian', 'design', 'ui'], createdAt: day(11) },
  { id: id(), title: 'Jira REST API', url: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/', description: 'Jira Cloud REST API v3 reference', tags: ['jira', 'api', 'atlassian'], createdAt: day(11) },
  { id: id(), title: 'Jira Platform', url: 'https://developer.atlassian.com/cloud/jira/platform/', description: 'Jira Cloud development platform overview', tags: ['jira', 'platform', 'atlassian'], createdAt: day(11) },
  { id: id(), title: 'Confluence REST API', url: 'https://developer.atlassian.com/cloud/confluence/rest/', description: 'Confluence Cloud REST API reference', tags: ['confluence', 'api', 'atlassian'], createdAt: day(11) },
  { id: id(), title: 'Jira Frontend', url: 'https://developer.atlassian.com/cloud/jira/platform/about-jira-frontend/', description: 'Build UI extensions for Jira Cloud', tags: ['jira', 'frontend', 'atlassian'], createdAt: day(11) },
  { id: id(), title: 'JSM Developers', url: 'https://developer.atlassian.com/cloud/jira/service-desk/', description: 'Jira Service Management developer docs', tags: ['jsm', 'service-desk', 'atlassian'], createdAt: day(11) },
  { id: id(), title: 'Bitbucket Cloud REST', url: 'https://developer.atlassian.com/cloud/bitbucket/rest/', description: 'Bitbucket Cloud REST API reference', tags: ['bitbucket', 'api', 'atlassian'], createdAt: day(11) },
  { id: id(), title: 'Forge Custom UI', url: 'https://developer.atlassian.com/platform/forge/custom-ui/', description: 'Build Forge apps with custom UI using React', tags: ['atlassian', 'forge', 'react'], createdAt: day(11) },
  { id: id(), title: 'Atlassian Community', url: 'https://community.developer.atlassian.com', description: 'Atlassian developer community forums', tags: ['atlassian', 'community', 'forum'], createdAt: day(11) },
  { id: id(), title: 'Forge Troubleshooting', url: 'https://developer.atlassian.com/platform/forge/troubleshooting/', description: 'Common Forge issues and solutions', tags: ['atlassian', 'forge', 'troubleshoot'], createdAt: day(12) },
  { id: id(), title: 'Atlassian SDK', url: 'https://developer.atlassian.com/server/framework/atlassian-sdk/', description: 'Atlassian SDK for server/data-center plugin development', tags: ['atlassian', 'sdk', 'server'], createdAt: day(12) },
  { id: id(), title: 'Jira Server REST', url: 'https://docs.atlassian.com/software/jira/docs/api/REST/latest/', description: 'Jira Server REST API documentation', tags: ['jira', 'api', 'server'], createdAt: day(12) },
  { id: id(), title: 'Atlassian Plugin SDK', url: 'https://developer.atlassian.com/server/framework/atlassian-sdk/atlassian-plugin-sdk/', description: 'SDK for developing server/data-center plugins', tags: ['atlassian', 'plugin', 'sdk'], createdAt: day(12) },
  { id: id(), title: 'Marketplace Publisher', url: 'https://developer.atlassian.com/marketplace/', description: 'Publish and manage apps on Atlassian Marketplace', tags: ['atlassian', 'marketplace', 'publish'], createdAt: day(12) },
  { id: id(), title: 'Test Broken Favicon', url: 'https://thisdomaindoesnotexist123456789.com', description: 'This domain does not exist – tests favicon fallback avatar', tags: ['test'], createdAt: day(12) },
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

  function handleFormChange(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ds-surface-sunken)' }}>
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
            </button>
          </div>
        </div>
      </header>

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
              <BookmarkCard
                key={b.id}
                b={b}
                dragId={dragId}
                dropId={dropId}
                onDragStart={() => { setDragId(b.id); setDropId(null) }}
                onDragOver={() => setDropId(b.id)}
                onDragEnd={() => { setDragId(null); setDropId(null) }}
                onDrop={() => moveBookmark(b.id)}
                onEdit={openEdit}
                onRemove={remove}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
            {filtered.map(b => (
              <BookmarkIcon
                key={b.id}
                b={b}
                dragId={dragId}
                dropId={dropId}
                onDragStart={() => { setDragId(b.id); setDropId(null) }}
                onDragOver={() => setDropId(b.id)}
                onDragEnd={() => { setDragId(null); setDropId(null) }}
                onDrop={() => moveBookmark(b.id)}
                onEdit={openEdit}
                onRemove={remove}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <BookmarkModal
          editing={editing}
          form={form}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          onChange={handleFormChange}
        />
      )}

      <ThemeToggle
        colorMode={colorMode}
        onToggle={() => setColorMode(m => m === 'light' ? 'dark' : 'light')}
      />
    </div>
  )
}
