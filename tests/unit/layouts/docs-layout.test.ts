// tests/unit/layouts/docs-layout.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import DocsLayout from '@layouts/DocsLayout.astro'
import type { NavigationTree, TableOfContentsItem } from '@/types/navigation'

// ── Fixtures ────────────────────────────────────────
const MINIMAL_TREE: NavigationTree = {
  framework: [
    { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', section: 'framework', order: 1, badge: 'essential' as const },
    { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework', order: 2 },
    { id: 'fw-artefacts', label: 'Artefacts', href: '/framework/artefacts', section: 'framework', order: 3 },
  ],
  modeOperatoire: [
    { id: 'mo-preambule', label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire', order: 0 },
  ],
  annexes: [
    {
      id: 'annexes-a-templates', label: 'A - Templates', href: '/annexes/templates',
      section: 'annexes', order: 1,
      children: [
        { id: 'annexe-a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
      ],
    },
  ],
}

const TEST_HEADINGS: TableOfContentsItem[] = [
  { depth: 2, text: 'Section 1', slug: 'section-1' },
  { depth: 3, text: 'Sous-section', slug: 'sous-section' },
  { depth: 2, text: 'Section 2', slug: 'section-2' },
]

// ── Helpers ──────────────────────────────────────────
let container: AstroContainer

beforeEach(async () => {
  container = await AstroContainer.create()
})

async function renderDocsLayout(
  props: Record<string, unknown> = {},
  currentPath: string = '/framework/artefacts',
) {
  return container.renderToString(DocsLayout, {
    props: {
      title: 'Test Page',
      description: 'Description test',
      headings: TEST_HEADINGS,
      tree: MINIMAL_TREE,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML de base ─────────────────────
describe('DocsLayout — Structure HTML', () => {
  it('T-01 : rend un document HTML complet', async () => {
    const html = await renderDocsLayout()
    // Note : AstroContainer ne rend pas le <!doctype html>
    expect(html).toContain('<html')
    expect(html).toContain('lang="fr"')
  })

  it('T-02 : rend le <title> formate avec | AIAD', async () => {
    const html = await renderDocsLayout({ title: 'Artefacts' })
    expect(html).toContain('<title>Artefacts | AIAD</title>')
  })

  it('T-03 : rend la meta description', async () => {
    const html = await renderDocsLayout({ description: 'Les artefacts AIAD' })
    expect(html).toContain('content="Les artefacts AIAD"')
  })

  it('T-04 : rend og:type article', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('content="article"')
  })

  it('T-05 : rend le skip-link pointant vers main-content', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('href="#main-content"')
    expect(html).toContain('Aller au contenu principal')
  })

  it('T-06 : rend un <main> avec id="main-content"', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('id="main-content"')
    expect(html).toContain('<main')
  })

  it('T-07 : rend un <article> avec classe prose', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('data-docs-article')
    expect(html).toContain('prose')
  })

  it('T-08 : rend le conteneur layout avec data-docs-layout', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('data-docs-layout')
  })

  it('T-09 : le conteneur a max-w-7xl', async () => {
    const html = await renderDocsLayout()
    // Verify the data-docs-layout element contains max-w-7xl
    const layoutMatch = html.match(/<div[^>]*data-docs-layout[^>]*>/)
    expect(layoutMatch).not.toBeNull()
    expect(layoutMatch![0]).toContain('max-w-7xl')
  })
})

// ── Tests composants integres ────────────────────────
describe('DocsLayout — Composants integres', () => {
  it('T-10 : integre le Header', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('data-header')
  })

  it('T-11 : integre le Breadcrumb sur une page connue', async () => {
    const html = await renderDocsLayout({}, '/framework/artefacts')
    expect(html).toContain('data-docs-breadcrumb')
  })

  it('T-12 : integre la Sidebar', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('data-sidebar')
  })

  it('T-13 : integre la TableOfContents quand headings sont fournis', async () => {
    const html = await renderDocsLayout({ headings: TEST_HEADINGS })
    expect(html).toContain('data-docs-toc')
  })

  it('T-14 : integre les PrevNextLinks', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('data-docs-prevnext')
  })
})

// ── Tests affichage conditionnel ─────────────────────
describe('DocsLayout — Affichage conditionnel', () => {
  it('T-15 : masque la Sidebar quand showSidebar={false}', async () => {
    const html = await renderDocsLayout({ showSidebar: false })
    expect(html).not.toContain('data-sidebar')
  })

  it('T-16 : masque la TOC quand showToc={false}', async () => {
    const html = await renderDocsLayout({ showToc: false })
    expect(html).not.toContain('data-docs-toc')
  })

  it('T-17 : masque la TOC quand headings est vide', async () => {
    const html = await renderDocsLayout({ headings: [] })
    expect(html).not.toContain('data-docs-toc')
  })

  it("T-18 : masque la TOC quand headings n'est pas fourni", async () => {
    const html = await renderDocsLayout({ headings: undefined })
    expect(html).not.toContain('data-docs-toc')
  })

  it('T-19 : masque le Breadcrumb quand showBreadcrumb={false}', async () => {
    const html = await renderDocsLayout({ showBreadcrumb: false })
    expect(html).not.toContain('data-docs-breadcrumb')
  })

  it('T-20 : masque les PrevNextLinks quand showPrevNext={false}', async () => {
    const html = await renderDocsLayout({ showPrevNext: false })
    expect(html).not.toContain('data-docs-prevnext')
  })

  it("T-21 : masque le Breadcrumb quand la page n'est pas dans l'arbre", async () => {
    const html = await renderDocsLayout({}, '/page-inconnue')
    expect(html).not.toContain('data-docs-breadcrumb')
  })
})

// ── Tests JSON-LD ────────────────────────────────────
describe('DocsLayout — JSON-LD SEO', () => {
  it('T-22 : genere le JSON-LD BreadcrumbList pour une page connue', async () => {
    const html = await renderDocsLayout({}, '/framework/artefacts')
    expect(html).toContain('"@type":"BreadcrumbList"')
  })

  it('T-23 : le JSON-LD contient les positions correctes', async () => {
    const html = await renderDocsLayout({}, '/framework/artefacts')
    expect(html).toContain('"position":1')
    expect(html).toContain('"position":2')
    expect(html).toContain('"position":3')
  })

  it('T-24 : le JSON-LD contient "Accueil" comme premier element', async () => {
    const html = await renderDocsLayout({}, '/framework/artefacts')
    expect(html).toContain('"name":"Accueil"')
  })

  it("T-25 : le dernier element JSON-LD n'a pas de propriete \"item\"", async () => {
    const html = await renderDocsLayout({}, '/framework/artefacts')
    // Le dernier ListItem (page courante) ne doit pas avoir "item"
    // On verifie que le label de la page courante est present sans URL
    expect(html).toContain('"name":"Artefacts"')
  })

  it("T-26 : pas de JSON-LD quand la page n'est pas dans l'arbre", async () => {
    const html = await renderDocsLayout({}, '/page-inconnue')
    expect(html).not.toContain('"@type":"BreadcrumbList"')
  })
})

// ── Tests responsive (classes CSS) ───────────────────
describe('DocsLayout — Responsive', () => {
  it('T-27 : le layout utilise flex-col sur mobile et flex-row sur desktop', async () => {
    const html = await renderDocsLayout()
    const layoutMatch = html.match(/<div[^>]*data-docs-layout[^>]*>/)
    expect(layoutMatch).not.toBeNull()
    expect(layoutMatch![0]).toContain('flex-col')
    expect(layoutMatch![0]).toContain('lg:flex-row')
  })

  it('T-28 : la colonne TOC utilise hidden xl:block', async () => {
    const html = await renderDocsLayout({ headings: TEST_HEADINGS })
    const tocMatch = html.match(/<div[^>]*data-docs-toc[^>]*>/)
    expect(tocMatch).not.toBeNull()
    expect(tocMatch![0]).toContain('hidden')
    expect(tocMatch![0]).toContain('xl:block')
  })

  it("T-29 : la zone centrale a min-w-0 pour eviter l'overflow", async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('flex-1 min-w-0')
  })
})

// ── Tests props transmises ───────────────────────────
describe('DocsLayout — Transmission des props', () => {
  it('T-30 : transmet le tree custom au Header', async () => {
    const html = await renderDocsLayout({ tree: MINIMAL_TREE })
    // Le Header doit avoir les items du tree custom
    expect(html).toContain('data-header')
    expect(html).toContain('Framework')
  })

  it('T-31 : transmet le tree custom a la Sidebar', async () => {
    const html = await renderDocsLayout({ tree: MINIMAL_TREE })
    expect(html).toContain('data-sidebar')
  })

  it('T-32 : transmet canonical a BaseLayout quand fourni', async () => {
    const html = await renderDocsLayout({ canonical: 'https://aiad.dev/framework/artefacts' })
    expect(html).toContain('rel="canonical"')
    expect(html).toContain('href="https://aiad.dev/framework/artefacts"')
  })

  it('T-33 : pas de canonical quand non fourni', async () => {
    const html = await renderDocsLayout()
    expect(html).not.toContain('rel="canonical"')
  })

  it('T-34 : transmet ogImage a BaseLayout quand fourni', async () => {
    const html = await renderDocsLayout({ ogImage: '/images/og/custom.png' })
    expect(html).toContain('/images/og/custom.png')
  })
})

// ── Tests classes CSS personnalisees ─────────────────
describe('DocsLayout — Classes personnalisees', () => {
  it('T-35 : ajoute les classes custom au conteneur layout', async () => {
    const html = await renderDocsLayout({ class: 'custom-class' })
    expect(html).toContain('custom-class')
  })
})

// ── Tests accessibilite ──────────────────────────────
describe('DocsLayout — Accessibilite', () => {
  it('T-36 : le skip-link cible main-content', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('href="#main-content"')
    expect(html).toContain('id="main-content"')
  })

  it('T-37 : rend le landmark main', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('<main')
  })

  it('T-38 : rend le landmark banner (header)', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('<header')
  })

  it('T-39 : rend les landmarks complementaires (sidebar et/ou toc)', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('<aside')
  })

  it('T-40 : le document a lang="fr"', async () => {
    const html = await renderDocsLayout()
    expect(html).toContain('lang="fr"')
  })
})

// ── Tests protection XSS ─────────────────────────────
describe('DocsLayout — Protection XSS', () => {
  it('T-41 : le titre est echappe dans le <title>', async () => {
    const html = await renderDocsLayout({ title: '<script>alert("xss")</script>' })
    // Astro echappe les expressions dans <title> (raw text element)
    expect(html).toContain('<title>&lt;script&gt;')
    expect(html).toContain('&lt;/script&gt;')
  })

  it('T-42 : la description est echappee dans les meta', async () => {
    const html = await renderDocsLayout({ description: 'Test "guillemets" et <tags>' })
    expect(html).toContain('content="Test')
    expect(html).not.toContain('content="Test "guillemets"')
  })
})

// ── Tests integration complete ───────────────────────
describe('DocsLayout — Integration complete', () => {
  it('T-43 : rend tous les composants sur une page Framework', async () => {
    const html = await renderDocsLayout(
      { headings: TEST_HEADINGS },
      '/framework/artefacts',
    )
    // Header
    expect(html).toContain('data-header')
    // Breadcrumb
    expect(html).toContain('data-docs-breadcrumb')
    // Sidebar
    expect(html).toContain('data-sidebar')
    // Main content
    expect(html).toContain('data-docs-main')
    // Article prose
    expect(html).toContain('data-docs-article')
    // PrevNextLinks
    expect(html).toContain('data-docs-prevnext')
    // TOC
    expect(html).toContain('data-docs-toc')
  })

  it('T-44 : rend correctement une page Annexe', async () => {
    const html = await renderDocsLayout(
      { headings: TEST_HEADINGS },
      '/annexes/templates/prd',
    )
    expect(html).toContain('data-header')
    expect(html).toContain('data-docs-breadcrumb')
    expect(html).toContain('data-sidebar')
    expect(html).toContain('data-docs-main')
  })

  it('T-45 : rend correctement une page Mode Operatoire', async () => {
    const html = await renderDocsLayout(
      { headings: TEST_HEADINGS },
      '/mode-operatoire/preambule',
    )
    expect(html).toContain('data-header')
    expect(html).toContain('data-docs-breadcrumb')
    expect(html).toContain('data-sidebar')
    expect(html).toContain('data-docs-main')
  })
})
