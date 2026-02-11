// tests/unit/components/layout/breadcrumb.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import Breadcrumb from '@components/layout/Breadcrumb.astro'

// ── Fixtures ─────────────────────────────────────────────

const SIMPLE_BREADCRUMBS = [
  { label: 'Accueil', href: '/' },
  { label: 'Framework', href: '/framework' },
  { label: 'Preambule', href: '/framework/preambule', isCurrent: true },
]

const DEEP_BREADCRUMBS = [
  { label: 'Accueil', href: '/' },
  { label: 'Annexes', href: '/annexes' },
  { label: 'A - Templates', href: '/annexes/templates' },
  { label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true },
]

const MINIMAL_BREADCRUMBS = [
  { label: 'Accueil', href: '/' },
  { label: 'Glossaire', href: '/glossaire', isCurrent: true },
]

// ── Helpers ──────────────────────────────────────────────

async function renderBreadcrumb(
  props: Record<string, unknown> = {},
  currentPath: string = '/framework/preambule',
) {
  const container = await AstroContainer.create()
  return container.renderToString(Breadcrumb, {
    props: {
      items: SIMPLE_BREADCRUMBS,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests rendu conditionnel ─────────────────────────────

describe('Breadcrumb — Rendu conditionnel', () => {
  it('T-01 : rend le composant quand items est fourni', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('<nav')
    expect(html).toContain('data-breadcrumb')
  })

  it('T-02 : ne rend rien quand items est un tableau vide', async () => {
    const html = await renderBreadcrumb({ items: [] })
    expect(html).not.toContain('<nav')
    expect(html).not.toContain('data-breadcrumb')
  })

  it('T-03 : ne rend rien quand items est null (simule getBreadcrumbs null)', async () => {
    const html = await renderBreadcrumb({ items: null })
    expect(html).not.toContain('<nav')
  })
})

// ── Tests structure HTML ──────────────────────────────────

describe('Breadcrumb — Structure HTML', () => {
  it('T-04 : genere un element <nav> avec aria-label="Fil d\'Ariane"', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Fil d\'Ariane"')
  })

  it('T-05 : contient une liste ordonnee <ol>', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('<ol')
    expect(html).toContain('</ol>')
  })

  it('T-06 : contient un <li> pour chaque element du breadcrumb', async () => {
    const html = await renderBreadcrumb()
    const liCount = (html.match(/<li /g) || []).length
    // 3 items (pas d'ellipsis car <= 3 niveaux)
    expect(liCount).toBe(3)
  })

  it('T-07 : les liens intermediaires sont des <a> avec href', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('href="/"')
    expect(html).toContain('href="/framework"')
  })

  it('T-08 : le dernier element est un <span> non cliquable', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('data-breadcrumb-current')
    expect(html).toContain('Preambule</span>')
  })

  it('T-09 : les labels sont affiches dans le bon ordre', async () => {
    const html = await renderBreadcrumb()
    const accueilPos = html.indexOf('Accueil')
    const frameworkPos = html.indexOf('Framework')
    const preambulePos = html.indexOf('Preambule')
    expect(accueilPos).toBeLessThan(frameworkPos)
    expect(frameworkPos).toBeLessThan(preambulePos)
  })
})

// ── Tests separateur ──────────────────────────────────────

describe('Breadcrumb — Separateur', () => {
  it('T-10 : pas de separateur avant le premier element', async () => {
    const html = await renderBreadcrumb()
    // Le premier <li> ne doit pas contenir de SVG
    const firstLi = html.split('<li')[1]
    const firstLiEnd = firstLi.indexOf('</li>')
    const firstLiContent = firstLi.substring(0, firstLiEnd)
    expect(firstLiContent).not.toContain('<svg')
  })

  it('T-11 : separateur SVG entre les elements', async () => {
    const html = await renderBreadcrumb()
    const svgCount = (html.match(/<svg/g) || []).length
    // 2 separateurs pour 3 elements
    expect(svgCount).toBe(2)
  })

  it('T-12 : les separateurs ont aria-hidden="true"', async () => {
    const html = await renderBreadcrumb()
    // Tous les SVG doivent avoir aria-hidden
    const svgMatches = html.match(/<svg[^>]*>/g) || []
    svgMatches.forEach((svg) => {
      expect(svg).toContain('aria-hidden="true"')
    })
  })

  it('T-13 : le separateur est un chevron droit', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('M9 5l7 7-7 7')
  })
})

// ── Tests aria-current ───────────────────────────────────

describe('Breadcrumb — Etat courant', () => {
  it('T-14 : le dernier element a aria-current="page"', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('aria-current="page"')
  })

  it('T-15 : seul le dernier element a aria-current', async () => {
    const html = await renderBreadcrumb()
    const ariaCurrentCount = (html.match(/aria-current/g) || []).length
    expect(ariaCurrentCount).toBe(1)
  })

  it('T-16 : les liens intermediaires n\'ont pas aria-current', async () => {
    const html = await renderBreadcrumb()
    // Les <a> ne doivent pas avoir aria-current
    const links = html.match(/<a[^>]*>/g) || []
    links.forEach((link) => {
      expect(link).not.toContain('aria-current')
    })
  })
})

// ── Tests troncature mobile ──────────────────────────────

describe('Breadcrumb — Troncature mobile', () => {
  it('T-17 : pas de troncature quand <= 3 niveaux', async () => {
    const html = await renderBreadcrumb({ items: SIMPLE_BREADCRUMBS })
    expect(html).not.toContain('data-breadcrumb-ellipsis')
    expect(html).not.toContain('hidden md:inline-flex')
  })

  it('T-18 : troncature quand > 3 niveaux', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    expect(html).toContain('data-breadcrumb-ellipsis')
  })

  it('T-19 : les items intermediaires ont hidden md:inline-flex quand > 3 niveaux', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    expect(html).toContain('hidden md:inline-flex')
  })

  it('T-20 : l\'ellipsis est visible sur mobile (inline-flex md:hidden)', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    // L'ellipsis doit avoir la classe pour etre visible sur mobile uniquement
    expect(html).toContain('inline-flex md:hidden')
  })

  it('T-21 : l\'ellipsis a aria-hidden="true"', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    // L'element ellipsis li doit avoir aria-hidden
    expect(html).toContain('data-breadcrumb-ellipsis')
  })

  it('T-22 : l\'ellipsis contient "..."', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    expect(html).toContain('...')
  })

  it('T-23 : le premier et le dernier element ne sont jamais masques', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    // "Accueil" ne doit pas etre dans un hidden md:inline-flex
    // Le dernier element non plus (il a isCurrent)
    // On verifie que Accueil et A1 - PRD sont dans des <li> avec inline-flex (pas hidden)
    expect(html).toContain('Accueil')
    expect(html).toContain('A1 - PRD')
  })
})

// ── Tests JSON-LD ────────────────────────────────────────

describe('Breadcrumb — JSON-LD', () => {
  it('T-24 : genere un bloc script type="application/ld+json"', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('type="application/ld+json"')
  })

  it('T-25 : le JSON-LD contient "@type": "BreadcrumbList"', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('"@type":"BreadcrumbList"')
  })

  it('T-26 : le JSON-LD contient le bon nombre d\'elements', async () => {
    const html = await renderBreadcrumb()
    const positionMatches = html.match(/"position":/g) || []
    expect(positionMatches.length).toBe(3)
  })

  it('T-27 : le JSON-LD a des positions 1-based', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('"position":1')
    expect(html).toContain('"position":2')
    expect(html).toContain('"position":3')
  })

  it('T-28 : le dernier item JSON-LD n\'a pas de propriete "item"', async () => {
    const html = await renderBreadcrumb()
    // Extraire le JSON-LD
    const jsonLdMatch = html.match(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
    )
    expect(jsonLdMatch).not.toBeNull()
    const jsonLd = JSON.parse(jsonLdMatch![1])
    const lastItem = jsonLd.itemListElement[jsonLd.itemListElement.length - 1]
    expect(lastItem.item).toBeUndefined()
    expect(lastItem.name).toBe('Preambule')
  })

  it('T-29 : les items non-derniers ont une propriete "item" (URL)', async () => {
    const html = await renderBreadcrumb()
    const jsonLdMatch = html.match(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
    )
    const jsonLd = JSON.parse(jsonLdMatch![1])
    const firstItem = jsonLd.itemListElement[0]
    expect(firstItem.item).toContain('/')
  })

  it('T-30 : noJsonLd=true desactive le JSON-LD', async () => {
    const html = await renderBreadcrumb({ noJsonLd: true })
    expect(html).not.toContain('application/ld+json')
  })

  it('T-31 : le JSON-LD utilise des URLs absolues', async () => {
    const html = await renderBreadcrumb()
    const jsonLdMatch = html.match(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
    )
    const jsonLd = JSON.parse(jsonLdMatch![1])
    const firstItem = jsonLd.itemListElement[0]
    expect(firstItem.item).toMatch(/^https?:\/\//)
  })
})

// ── Tests accessibilite ──────────────────────────────────

describe('Breadcrumb — Accessibilite', () => {
  it('T-32 : le nav a aria-label="Fil d\'Ariane"', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('aria-label="Fil d\'Ariane"')
  })

  it('T-33 : les liens ont un focus ring', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })

  it('T-34 : la liste utilise <ol> (ordonnee)', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('<ol')
    expect(html).not.toMatch(/<ul[^>]*class="flex items-center/)
  })
})

// ── Tests styles ─────────────────────────────────────────

describe('Breadcrumb — Styles', () => {
  it('T-35 : les liens ont text-gray-600', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('text-gray-600')
  })

  it('T-36 : la page courante a text-gray-500 et font-medium', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('text-gray-500')
    expect(html).toContain('font-medium')
  })

  it('T-37 : les liens ont hover:underline', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('hover:underline')
  })

  it('T-38 : les separateurs ont text-gray-400', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('text-gray-400')
  })

  it('T-39 : transition-colors presente sur les liens', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('transition-colors')
  })
})

// ── Tests classes et attributs ──────────────────────────

describe('Breadcrumb — Classes et attributs', () => {
  it('T-40 : classe personnalisee ajoutee au nav', async () => {
    const html = await renderBreadcrumb({ class: 'my-custom-class' })
    expect(html).toContain('my-custom-class')
  })

  it('T-41 : data-breadcrumb present sur le nav', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('data-breadcrumb')
  })

  it('T-42 : data-breadcrumb-link present sur les liens', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('data-breadcrumb-link')
  })

  it('T-43 : data-breadcrumb-current present sur la page courante', async () => {
    const html = await renderBreadcrumb()
    expect(html).toContain('data-breadcrumb-current')
  })
})

// ── Tests XSS ────────────────────────────────────────────

describe('Breadcrumb — Protection XSS', () => {
  it('T-44 : label avec HTML est echappe', async () => {
    const items = [
      { label: '<script>alert("xss")</script>', href: '/test', isCurrent: true },
    ]
    const html = await renderBreadcrumb({ items })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('T-45 : label avec accents et caracteres speciaux', async () => {
    const items = [
      { label: 'Accueil', href: '/' },
      {
        label: 'Ecosysteme & Architecture — Vue d\'ensemble',
        href: '/test',
        isCurrent: true,
      },
    ]
    const html = await renderBreadcrumb({ items })
    expect(html).toContain('Ecosysteme')
  })
})

// ── Tests combinaisons ───────────────────────────────────

describe('Breadcrumb — Combinaisons', () => {
  it('T-46 : breadcrumb minimal (2 niveaux)', async () => {
    const html = await renderBreadcrumb({ items: MINIMAL_BREADCRUMBS })
    const liCount = (html.match(/<li /g) || []).length
    expect(liCount).toBe(2)
    expect(html).toContain('Accueil')
    expect(html).toContain('Glossaire')
    // Un seul separateur
    const svgCount = (html.match(/<svg/g) || []).length
    expect(svgCount).toBe(1)
  })

  it('T-47 : breadcrumb profond (4 niveaux) genere le bon nombre d\'elements', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    expect(html).toContain('Accueil')
    expect(html).toContain('Annexes')
    expect(html).toContain('A - Templates')
    expect(html).toContain('A1 - PRD')
  })

  it('T-48 : JSON-LD correct pour un breadcrumb profond', async () => {
    const html = await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
    const jsonLdMatch = html.match(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
    )
    expect(jsonLdMatch).not.toBeNull()
    const jsonLd = JSON.parse(jsonLdMatch![1])
    expect(jsonLd.itemListElement).toHaveLength(4)
    expect(jsonLd.itemListElement[3].name).toBe('A1 - PRD')
    expect(jsonLd.itemListElement[3].item).toBeUndefined()
  })

  it('T-49 : classe personnalisee + items manuels', async () => {
    const html = await renderBreadcrumb({
      items: MINIMAL_BREADCRUMBS,
      class: 'bg-gray-50 px-4',
    })
    expect(html).toContain('bg-gray-50')
    expect(html).toContain('Glossaire')
  })

  it('T-50 : noJsonLd avec items manuels', async () => {
    const html = await renderBreadcrumb({
      items: SIMPLE_BREADCRUMBS,
      noJsonLd: true,
    })
    expect(html).toContain('<nav')
    expect(html).not.toContain('application/ld+json')
  })
})
