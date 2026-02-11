// tests/unit/components/layout/table-of-contents.test.ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import TableOfContents from '@components/layout/TableOfContents.astro'

// ── Fixtures ─────────────────────────────────────────────

const SAMPLE_HEADINGS = [
  { depth: 2 as const, text: 'Vision', slug: 'vision' },
  { depth: 3 as const, text: 'Principes fondateurs', slug: 'principes-fondateurs' },
  { depth: 3 as const, text: 'Valeurs cles', slug: 'valeurs-cles' },
  { depth: 2 as const, text: 'Philosophie', slug: 'philosophie' },
  { depth: 3 as const, text: 'Approche iterative', slug: 'approche-iterative' },
  { depth: 4 as const, text: 'Boucle de feedback', slug: 'boucle-de-feedback' },
]

const H2_ONLY_HEADINGS = [
  { depth: 2 as const, text: 'Introduction', slug: 'introduction' },
  { depth: 2 as const, text: 'Methodologie', slug: 'methodologie' },
  { depth: 2 as const, text: 'Conclusion', slug: 'conclusion' },
]

// ── Helpers ──────────────────────────────────────────────

async function renderTOC(
  props: Record<string, unknown> = {},
) {
  const container = await AstroContainer.create()
  return container.renderToString(TableOfContents, {
    props: {
      headings: SAMPLE_HEADINGS,
      ...props,
    },
  })
}

// ── Tests rendu conditionnel ─────────────────────────────

describe('TableOfContents — Rendu conditionnel', () => {
  it('T-01 : ne rend rien quand headings est vide', async () => {
    const html = await renderTOC({ headings: [] })
    expect(html).not.toContain('<nav')
    expect(html).not.toContain('data-toc')
  })

  it('T-02 : ne rend rien quand aucun heading ne passe le filtre', async () => {
    const headings = [{ depth: 1, text: 'H1 titre', slug: 'h1-titre' }]
    const html = await renderTOC({ headings })
    expect(html).not.toContain('<nav')
  })

  it('T-03 : rend le composant quand il y a des headings valides', async () => {
    const html = await renderTOC()
    expect(html).toContain('<nav')
    expect(html).toContain('data-toc')
  })
})

// ── Tests structure HTML ──────────────────────────────────

describe('TableOfContents — Structure HTML', () => {
  it('T-04 : genere un element <nav> avec aria-label', async () => {
    const html = await renderTOC()
    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Table des matieres"')
  })

  it('T-05 : contient une liste <ul> pour les items', async () => {
    const html = await renderTOC()
    expect(html).toContain('<ul')
    expect(html).toContain('</ul>')
  })

  it('T-06 : contient un lien <a> pour chaque heading', async () => {
    const html = await renderTOC()
    expect(html).toContain('href="#vision"')
    expect(html).toContain('href="#principes-fondateurs"')
    expect(html).toContain('href="#philosophie"')
    expect(html).toContain('href="#approche-iterative"')
    expect(html).toContain('href="#boucle-de-feedback"')
  })

  it('T-07 : chaque lien a le data-toc-link avec le slug', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc-link="vision"')
    expect(html).toContain('data-toc-link="principes-fondateurs"')
    expect(html).toContain('data-toc-link="philosophie"')
  })

  it('T-08 : affiche le texte de chaque heading', async () => {
    const html = await renderTOC()
    expect(html).toContain('Vision')
    expect(html).toContain('Principes fondateurs')
    expect(html).toContain('Philosophie')
    expect(html).toContain('Boucle de feedback')
  })
})

// ── Tests titre ───────────────────────────────────────────

describe('TableOfContents — Titre', () => {
  it('T-09 : affiche le titre par defaut "Sur cette page"', async () => {
    const html = await renderTOC()
    expect(html).toContain('Sur cette page')
  })

  it('T-10 : affiche un titre personnalise', async () => {
    const html = await renderTOC({ title: 'Sommaire' })
    expect(html).toContain('Sommaire')
  })

  it('T-11 : le titre a le style uppercase', async () => {
    const html = await renderTOC()
    expect(html).toContain('uppercase')
    expect(html).toContain('tracking-wider')
  })
})

// ── Tests indentation par profondeur ──────────────────────

describe('TableOfContents — Indentation', () => {
  it("T-12 : h2 a l'indentation pl-0", async () => {
    const html = await renderTOC({ headings: [{ depth: 2, text: 'Test', slug: 'test' }] })
    expect(html).toContain('pl-0')
  })

  it("T-13 : h3 a l'indentation pl-4", async () => {
    const html = await renderTOC({ headings: [{ depth: 3, text: 'Test', slug: 'test' }] })
    expect(html).toContain('pl-4')
  })

  it("T-14 : h4 a l'indentation pl-8", async () => {
    const html = await renderTOC({ headings: [{ depth: 4, text: 'Test', slug: 'test' }] })
    expect(html).toContain('pl-8')
  })
})

// ── Tests styles par profondeur ──────────────────────────

describe('TableOfContents — Styles par profondeur', () => {
  it('T-15 : h2 a le style text-sm font-medium text-gray-700', async () => {
    const html = await renderTOC({ headings: [{ depth: 2, text: 'Test', slug: 'test' }] })
    expect(html).toContain('font-medium')
    expect(html).toContain('text-gray-700')
  })

  it('T-16 : h3 a le style text-sm text-gray-600', async () => {
    const html = await renderTOC({ headings: [{ depth: 3, text: 'Test', slug: 'test' }] })
    expect(html).toContain('text-gray-600')
  })

  it('T-17 : h4 a le style text-xs text-gray-500', async () => {
    const html = await renderTOC({ headings: [{ depth: 4, text: 'Test', slug: 'test' }] })
    expect(html).toContain('text-xs')
    expect(html).toContain('text-gray-500')
  })
})

// ── Tests positionnement sticky ──────────────────────────

describe('TableOfContents — Positionnement', () => {
  it('T-18 : le container desktop est sticky', async () => {
    const html = await renderTOC()
    expect(html).toContain('sticky')
    expect(html).toContain('top-24')
  })

  it('T-19 : le container desktop a un max-height et overflow', async () => {
    const html = await renderTOC()
    expect(html).toContain('max-h-[calc(100vh-8rem)]')
    expect(html).toContain('overflow-y-auto')
  })

  it('T-20 : le container desktop est cache en mobile (hidden lg:block)', async () => {
    const html = await renderTOC()
    expect(html).toContain('hidden lg:block')
  })
})

// ── Tests version mobile ─────────────────────────────────

describe('TableOfContents — Mobile', () => {
  it('T-21 : le container mobile est visible sous lg (lg:hidden)', async () => {
    const html = await renderTOC()
    expect(html).toContain('lg:hidden')
  })

  it('T-22 : le bouton toggle a aria-expanded="false" par defaut', async () => {
    const html = await renderTOC()
    expect(html).toContain('aria-expanded="false"')
  })

  it('T-23 : le bouton toggle a aria-controls="toc-mobile-list"', async () => {
    const html = await renderTOC()
    expect(html).toContain('aria-controls="toc-mobile-list"')
  })

  it("T-24 : la liste mobile a l'attribut hidden par defaut", async () => {
    const html = await renderTOC()
    expect(html).toContain('id="toc-mobile-list"')
    // La liste mobile a l'attribut hidden
    expect(html).toMatch(/id="toc-mobile-list"[^>]*hidden/)
  })

  it('T-25 : le bouton toggle a data-toc-toggle', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc-toggle')
  })

  it('T-26 : le chevron a data-toc-chevron', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc-chevron')
  })

  it('T-27 : le bouton toggle affiche le titre', async () => {
    const html = await renderTOC()
    // Le bouton contient le titre par defaut
    const mobileSection = html.split('lg:hidden')[1]
    expect(mobileSection).toContain('Sur cette page')
  })
})

// ── Tests filtrage des profondeurs ─────────────────────

describe('TableOfContents — Filtrage profondeurs', () => {
  it('T-28 : maxDepth=3 exclut les h4', async () => {
    const html = await renderTOC({ maxDepth: 3 })
    expect(html).not.toContain('Boucle de feedback')
    expect(html).toContain('Vision')
    expect(html).toContain('Principes fondateurs')
  })

  it('T-29 : maxDepth=2 ne garde que les h2', async () => {
    const html = await renderTOC({ maxDepth: 2 })
    expect(html).toContain('Vision')
    expect(html).toContain('Philosophie')
    expect(html).not.toContain('Principes fondateurs')
    expect(html).not.toContain('Boucle de feedback')
  })

  it('T-30 : minDepth=3 exclut les h2', async () => {
    const html = await renderTOC({ minDepth: 3 })
    expect(html).not.toContain('>Vision<')
    expect(html).toContain('Principes fondateurs')
    expect(html).toContain('Boucle de feedback')
  })

  it('T-31 : minDepth > maxDepth ne rend rien', async () => {
    const html = await renderTOC({ minDepth: 4, maxDepth: 2 })
    expect(html).not.toContain('<nav')
  })

  it('T-32 : les headings h1 sont toujours exclus', async () => {
    const headings = [
      { depth: 1, text: 'Titre H1', slug: 'titre-h1' },
      { depth: 2, text: 'Section', slug: 'section' },
    ]
    const html = await renderTOC({ headings })
    expect(html).not.toContain('Titre H1')
    expect(html).toContain('Section')
  })
})

// ── Tests accessibilite ──────────────────────────────────

describe('TableOfContents — Accessibilite', () => {
  it('T-33 : le nav a aria-label="Table des matieres"', async () => {
    const html = await renderTOC()
    expect(html).toContain('aria-label="Table des matieres"')
  })

  it('T-34 : les liens ont un focus ring', async () => {
    const html = await renderTOC()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })

  it('T-35 : la bordure gauche de guidage est presente', async () => {
    const html = await renderTOC()
    expect(html).toContain('border-l')
    expect(html).toContain('border-gray-200')
  })

  it('T-36 : chaque item est dans un <li>', async () => {
    const html = await renderTOC()
    const liCount = (html.match(/<li/g) || []).length
    // 6 headings x 2 (desktop + mobile) = 12
    expect(liCount).toBe(SAMPLE_HEADINGS.length * 2)
  })
})

// ── Tests classes et attributs ──────────────────────────

describe('TableOfContents — Classes et attributs', () => {
  it('T-37 : classe personnalisee ajoutee au nav', async () => {
    const html = await renderTOC({ class: 'my-custom-class' })
    expect(html).toContain('my-custom-class')
  })

  it('T-38 : data-toc present sur le nav', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc')
  })

  it('T-39 : data-toc-list present sur la liste desktop', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc-list')
  })

  it('T-40 : transition-colors presente sur les liens', async () => {
    const html = await renderTOC()
    expect(html).toContain('transition-colors')
  })

  it('T-41 : les liens ont border-transparent par defaut', async () => {
    const html = await renderTOC()
    expect(html).toContain('border-transparent')
  })
})

// ── Tests XSS ────────────────────────────────────────────

describe('TableOfContents — Protection XSS', () => {
  it('T-42 : heading avec HTML est echappe', async () => {
    const headings = [
      { depth: 2 as const, text: '<script>alert("xss")</script>', slug: 'xss-test' },
    ]
    const html = await renderTOC({ headings })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('T-43 : heading avec accents et caracteres speciaux', async () => {
    const headings = [
      { depth: 2 as const, text: "Ecosysteme & Architecture — Vue d'ensemble", slug: 'ecosysteme' },
    ]
    const html = await renderTOC({ headings })
    expect(html).toContain('Ecosysteme')
  })
})

// ── Tests script client ──────────────────────────────────
// Note : Astro Container extrait les <script> du rendu HTML (bundling separe).
// Les tests T-44 a T-46 verifient le fichier source directement.

const componentSource = readFileSync(
  resolve('src/components/layout/TableOfContents.astro'),
  'utf-8',
)

describe('TableOfContents — Script client', () => {
  it('T-44 : le script est present dans le fichier source', () => {
    expect(componentSource).toContain('<script>')
    expect(componentSource).toContain('initTableOfContents')
  })

  it('T-45 : le script reference IntersectionObserver', () => {
    expect(componentSource).toContain('IntersectionObserver')
  })

  it('T-46 : le script reference scrollIntoView', () => {
    expect(componentSource).toContain('scrollIntoView')
  })

  it('T-47 : le script gere le toggle mobile', async () => {
    const html = await renderTOC()
    expect(html).toContain('data-toc-toggle')
    expect(html).toContain('aria-expanded')
  })
})

// ── Tests combinaisons ───────────────────────────────────

describe('TableOfContents — Combinaisons', () => {
  it('T-48 : uniquement des h2 rend sans indentation', async () => {
    const html = await renderTOC({ headings: H2_ONLY_HEADINGS })
    expect(html).toContain('pl-0')
    expect(html).not.toContain('pl-4')
    expect(html).not.toContain('pl-8')
  })

  it('T-49 : titre personnalise apparait dans desktop et mobile', async () => {
    const html = await renderTOC({ title: 'Sommaire' })
    const occurrences = (html.match(/Sommaire/g) || []).length
    // Au moins 2 : une fois dans desktop, une fois dans le bouton mobile
    expect(occurrences).toBeGreaterThanOrEqual(2)
  })

  it('T-50 : le nombre de liens correspond au nombre de headings filtres', async () => {
    const html = await renderTOC()
    const linkCount = (html.match(/data-toc-link="/g) || []).length
    // 6 headings x 2 (desktop + mobile)
    expect(linkCount).toBe(SAMPLE_HEADINGS.length * 2)
  })
})
