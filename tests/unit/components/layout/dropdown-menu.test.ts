// tests/unit/components/layout/dropdown-menu.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import DropdownMenu from '@components/layout/DropdownMenu.astro'

// ── Fixtures ────────────────────────────────────────
const FLAT_ITEMS = [
  {
    id: 'fw-preambule',
    label: 'Preambule',
    href: '/framework/preambule',
    section: 'framework' as const,
    order: 1,
    badge: 'essential' as const,
  },
  {
    id: 'fw-vision',
    label: 'Vision & Philosophie',
    href: '/framework/vision-philosophie',
    section: 'framework' as const,
    order: 2,
  },
  {
    id: 'fw-ecosysteme',
    label: 'Ecosysteme',
    href: '/framework/ecosysteme',
    section: 'framework' as const,
    order: 3,
  },
]

const GROUPED_ITEMS = [
  {
    id: 'annexes-a-templates',
    label: 'A - Templates',
    href: '/annexes/templates',
    section: 'annexes' as const,
    order: 1,
    children: [
      {
        id: 'annexe-a1-prd',
        label: 'A1 - PRD',
        href: '/annexes/templates/prd',
        order: 1,
      },
      {
        id: 'annexe-a2-arch',
        label: 'A2 - Architecture',
        href: '/annexes/templates/architecture',
        order: 2,
      },
    ],
  },
  {
    id: 'annexes-b-roles',
    label: 'B - Roles',
    href: '/annexes/roles',
    section: 'annexes' as const,
    order: 2,
    children: [
      {
        id: 'annexe-b1-pm',
        label: 'B1 - Product Manager',
        href: '/annexes/roles/product-manager',
        order: 1,
      },
    ],
  },
]

const EMPTY_ITEMS: never[] = []

// ── Helpers ──────────────────────────────────────────
async function renderDropdown(
  props: Record<string, unknown> = {},
  currentPath: string = '/',
) {
  const container = await AstroContainer.create()
  return container.renderToString(DropdownMenu, {
    props: {
      label: 'Framework',
      section: 'framework',
      items: FLAT_ITEMS,
      href: '/framework',
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML ──────────────────────────────
describe('DropdownMenu — Structure HTML', () => {
  it('T-01 : rend un conteneur avec data-dropdown', async () => {
    const html = await renderDropdown()
    expect(html).toContain('data-dropdown')
  })

  it('T-02 : rend un bouton declencheur avec data-dropdown-trigger', async () => {
    const html = await renderDropdown()
    expect(html).toContain('data-dropdown-trigger')
    expect(html).toContain('<button')
  })

  it('T-03 : le bouton a aria-haspopup="true"', async () => {
    const html = await renderDropdown()
    expect(html).toContain('aria-haspopup="true"')
  })

  it('T-04 : le bouton a aria-expanded="false" par defaut', async () => {
    const html = await renderDropdown()
    expect(html).toContain('aria-expanded="false"')
  })

  it('T-05 : le bouton a aria-controls pointant vers le menu', async () => {
    const html = await renderDropdown()
    expect(html).toContain('aria-controls="dropdown-framework-menu"')
  })

  it('T-06 : le panneau a role="menu"', async () => {
    const html = await renderDropdown()
    expect(html).toContain('role="menu"')
  })

  it('T-07 : le panneau a aria-labelledby pointant vers le bouton', async () => {
    const html = await renderDropdown()
    expect(html).toContain('aria-labelledby="dropdown-framework-button"')
  })

  it('T-08 : le panneau est masque par defaut (classe hidden)', async () => {
    const html = await renderDropdown()
    // Le panneau menu contient la classe "hidden" et l'attribut data-dropdown-menu
    expect(html).toContain('data-dropdown-menu')
    expect(html).toMatch(/role="menu"[^>]*class="[^"]*hidden/)
  })

  it('T-09 : le label du bouton est affiche', async () => {
    const html = await renderDropdown({ label: 'Framework' })
    expect(html).toContain('Framework')
  })

  it('T-10 : le chevron SVG est present avec aria-hidden', async () => {
    const html = await renderDropdown()
    expect(html).toContain('data-dropdown-chevron')
    expect(html).toContain('aria-hidden="true"')
  })
})

// ── Tests mode flat ────────────────────────────────────
describe('DropdownMenu — Mode flat (Framework/ModeOp)', () => {
  it('T-11 : rend les items comme des NavLink avec role="menuitem"', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).toContain('role="menuitem"')
    expect(html).toContain('Preambule')
    expect(html).toContain('Vision &amp; Philosophie')
    expect(html).toContain('Ecosysteme')
  })

  it('T-12 : les items ont tabindex="-1"', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).toContain('tabindex="-1"')
  })

  it('T-13 : les items ont les hrefs corrects', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).toContain('href="/framework/preambule"')
    expect(html).toContain('href="/framework/vision-philosophie"')
    expect(html).toContain('href="/framework/ecosysteme"')
  })

  it('T-14 : le badge est affiche sur les items qui en ont un', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).toContain('Essentiel')
  })

  it('T-15 : pas de role="group" en mode flat', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).not.toContain('role="group"')
  })

  it('T-16 : pas de role="separator" en mode flat', async () => {
    const html = await renderDropdown({ items: FLAT_ITEMS })
    expect(html).not.toContain('role="separator"')
  })
})

// ── Tests mode grouped ─────────────────────────────────
describe('DropdownMenu — Mode grouped (Annexes)', () => {
  it('T-17 : rend les categories avec role="group"', async () => {
    const html = await renderDropdown({
      items: GROUPED_ITEMS,
      section: 'annexes',
      label: 'Annexes',
      href: '/annexes',
    })
    expect(html).toContain('role="group"')
  })

  it('T-18 : les groupes ont aria-labelledby pointant vers le titre', async () => {
    const html = await renderDropdown({
      items: GROUPED_ITEMS,
      section: 'annexes',
      label: 'Annexes',
      href: '/annexes',
    })
    expect(html).toContain(
      'aria-labelledby="dropdown-annexes-group-annexes-a-templates"',
    )
  })

  it('T-19 : les titres de groupe sont affiches', async () => {
    const html = await renderDropdown({
      items: GROUPED_ITEMS,
      section: 'annexes',
      label: 'Annexes',
      href: '/annexes',
    })
    expect(html).toContain('A - Templates')
    expect(html).toContain('B - Roles')
  })

  it('T-20 : les titres de groupe sont des liens cliquables avec role="menuitem"', async () => {
    const html = await renderDropdown({
      items: GROUPED_ITEMS,
      section: 'annexes',
      label: 'Annexes',
      href: '/annexes',
    })
    expect(html).toContain('data-dropdown-group-link')
    expect(html).toContain('href="/annexes/templates"')
  })

  it('T-21 : les fiches enfants sont rendues', async () => {
    const html = await renderDropdown({
      items: GROUPED_ITEMS,
      section: 'annexes',
      label: 'Annexes',
      href: '/annexes',
    })
    expect(html).toContain('A1 - PRD')
    expect(html).toContain('A2 - Architecture')
    expect(html).toContain('B1 - Product Manager')
  })

  it('T-22 : les fiches sont indentees (pl-2)', async () => {
    const html = await renderDropdown({
      items: GROUPED_ITEMS,
      section: 'annexes',
      label: 'Annexes',
      href: '/annexes',
    })
    expect(html).toContain('pl-2')
  })

  it('T-23 : un separateur est present entre les groupes (sauf avant le premier)', async () => {
    const html = await renderDropdown({
      items: GROUPED_ITEMS,
      section: 'annexes',
      label: 'Annexes',
      href: '/annexes',
    })
    expect(html).toContain('role="separator"')
  })

  it('T-24 : pas de separateur avant le premier groupe', async () => {
    const html = await renderDropdown({
      items: GROUPED_ITEMS,
      section: 'annexes',
      label: 'Annexes',
      href: '/annexes',
    })
    // Le premier group ne doit pas etre precede d'un <hr>
    const firstGroupIndex = html.indexOf('role="group"')
    const firstSepIndex = html.indexOf('role="separator"')
    expect(firstSepIndex).toBeGreaterThan(firstGroupIndex)
  })
})

// ── Tests IDs et aria ──────────────────────────────────
describe('DropdownMenu — IDs et ARIA', () => {
  it('T-25 : IDs generes automatiquement a partir de la section', async () => {
    const html = await renderDropdown({ section: 'framework' })
    expect(html).toContain('id="dropdown-framework"')
    expect(html).toContain('id="dropdown-framework-button"')
    expect(html).toContain('id="dropdown-framework-menu"')
  })

  it('T-26 : IDs personnalises quand id est fourni', async () => {
    const html = await renderDropdown({ id: 'custom-dropdown' })
    expect(html).toContain('id="custom-dropdown"')
    expect(html).toContain('id="custom-dropdown-button"')
    expect(html).toContain('id="custom-dropdown-menu"')
  })

  it('T-27 : data-dropdown-section contient la section', async () => {
    const html = await renderDropdown({ section: 'mode-operatoire' })
    expect(html).toContain('data-dropdown-section="mode-operatoire"')
  })

  it('T-28 : le bouton a un id unique pour aria-labelledby', async () => {
    const html = await renderDropdown()
    const buttonIdVal = 'dropdown-framework-button'
    expect(html).toContain(`id="${buttonIdVal}"`)
    expect(html).toContain(`aria-labelledby="${buttonIdVal}"`)
  })
})

// ── Tests noscript fallback ────────────────────────────
describe('DropdownMenu — Enhancement progressif', () => {
  it('T-29 : contient un <noscript> avec un lien fallback', async () => {
    const html = await renderDropdown({ href: '/framework' })
    expect(html).toContain('<noscript>')
    expect(html).toContain('href="/framework"')
  })

  it('T-30 : le lien noscript affiche le label', async () => {
    const html = await renderDropdown({
      label: 'Framework',
      href: '/framework',
    })
    // Le noscript contient un <a> avec le label
    const noscriptMatch = html.match(/<noscript>([\s\S]*?)<\/noscript>/)
    expect(noscriptMatch).not.toBeNull()
    expect(noscriptMatch![1]).toContain('Framework')
  })
})

// ── Tests styles ─────────────────────────────────────
describe('DropdownMenu — Styles', () => {
  it('T-31 : le bouton a un focus ring', async () => {
    const html = await renderDropdown()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })

  it('T-32 : le panneau est positionne en absolu', async () => {
    const html = await renderDropdown()
    expect(html).toContain('absolute')
    expect(html).toContain('top-full')
    expect(html).toContain('z-50')
  })

  it('T-33 : le panneau a une ombre et une bordure', async () => {
    const html = await renderDropdown()
    expect(html).toContain('shadow-lg')
    expect(html).toContain('border-gray-200')
  })

  it('T-34 : le panneau a une largeur de w-64', async () => {
    const html = await renderDropdown()
    expect(html).toContain('w-64')
  })

  it('T-35 : le conteneur a la classe relative pour le positionnement', async () => {
    const html = await renderDropdown()
    expect(html).toContain('relative')
  })

  it('T-36 : le chevron a une transition pour la rotation', async () => {
    const html = await renderDropdown()
    expect(html).toContain('transition-transform')
    expect(html).toContain('duration-200')
  })

  it('T-37 : les titres de groupe sont en uppercase et petite taille', async () => {
    const html = await renderDropdown({
      items: GROUPED_ITEMS,
      section: 'annexes',
      label: 'Annexes',
      href: '/annexes',
    })
    expect(html).toContain('uppercase')
    expect(html).toContain('tracking-wider')
    expect(html).toContain('text-xs')
    expect(html).toContain('font-semibold')
  })
})

// ── Tests classes et attributs ──────────────────────
describe('DropdownMenu — Classes et attributs', () => {
  it('T-38 : classe personnalisee ajoutee au conteneur', async () => {
    const html = await renderDropdown({ class: 'ml-4' })
    expect(html).toContain('ml-4')
  })

  it('T-39 : data-dropdown-menu present sur le panneau', async () => {
    const html = await renderDropdown()
    expect(html).toContain('data-dropdown-menu')
  })

  it('T-40 : data-dropdown-trigger present sur le bouton', async () => {
    const html = await renderDropdown()
    expect(html).toContain('data-dropdown-trigger')
  })
})

// ── Tests tri des items ─────────────────────────────
describe('DropdownMenu — Tri des items', () => {
  it('T-41 : les items sont tries par order', async () => {
    const unsortedItems = [
      {
        id: 'fw-c',
        label: 'C - Troisieme',
        href: '/c',
        order: 3,
        section: 'framework' as const,
      },
      {
        id: 'fw-a',
        label: 'A - Premier',
        href: '/a',
        order: 1,
        section: 'framework' as const,
      },
      {
        id: 'fw-b',
        label: 'B - Deuxieme',
        href: '/b',
        order: 2,
        section: 'framework' as const,
      },
    ]
    const html = await renderDropdown({ items: unsortedItems })
    const indexA = html.indexOf('A - Premier')
    const indexB = html.indexOf('B - Deuxieme')
    const indexC = html.indexOf('C - Troisieme')
    expect(indexA).toBeLessThan(indexB)
    expect(indexB).toBeLessThan(indexC)
  })

  it('T-42 : les fiches enfants sont triees par order dans les groupes', async () => {
    const unsortedGrouped = [
      {
        id: 'cat-a',
        label: 'Cat A',
        href: '/a',
        section: 'annexes' as const,
        order: 1,
        children: [
          { id: 'f2', label: 'Fiche 2', href: '/a/2', order: 2 },
          { id: 'f1', label: 'Fiche 1', href: '/a/1', order: 1 },
        ],
      },
    ]
    const html = await renderDropdown({
      items: unsortedGrouped,
      section: 'annexes',
      label: 'Annexes',
      href: '/annexes',
    })
    const indexF1 = html.indexOf('Fiche 1')
    const indexF2 = html.indexOf('Fiche 2')
    expect(indexF1).toBeLessThan(indexF2)
  })
})

// ── Tests items vides ──────────────────────────────
describe('DropdownMenu — Items vides', () => {
  it('T-43 : rend le bouton meme avec une liste vide', async () => {
    const html = await renderDropdown({ items: EMPTY_ITEMS })
    expect(html).toContain('data-dropdown-trigger')
    expect(html).toContain('Framework')
  })

  it('T-44 : le panneau menu est present meme avec une liste vide', async () => {
    const html = await renderDropdown({ items: EMPTY_ITEMS })
    expect(html).toContain('data-dropdown-menu')
  })
})

// ── Tests XSS ────────────────────────────────────────
describe('DropdownMenu — Protection XSS', () => {
  it('T-45 : label avec HTML est echappe', async () => {
    const html = await renderDropdown({
      label: '<script>alert("xss")</script>',
    })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })
})

// ── Tests script client ──────────────────────────────
// Note: Astro Container API strips <script> tags during SSR rendering.
// We read the source file directly to verify the script content.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const COMPONENT_SOURCE = readFileSync(
  resolve(__dirname, '../../../../src/components/layout/DropdownMenu.astro'),
  'utf-8',
)

describe('DropdownMenu — Script client', () => {
  it('T-46 : un <script> est present dans le source du composant', () => {
    expect(COMPONENT_SOURCE).toContain('<script>')
  })

  it('T-47 : le script reference data-dropdown pour l\'initialisation', () => {
    expect(COMPONENT_SOURCE).toContain('[data-dropdown]')
  })

  it('T-48 : le script gere ArrowDown et ArrowUp', () => {
    expect(COMPONENT_SOURCE).toContain('ArrowDown')
    expect(COMPONENT_SOURCE).toContain('ArrowUp')
  })

  it('T-49 : le script gere Escape', () => {
    expect(COMPONENT_SOURCE).toContain('Escape')
  })

  it('T-50 : le script gere le clic exterieur', () => {
    expect(COMPONENT_SOURCE).toContain('click')
    expect(COMPONENT_SOURCE).toContain('contains')
  })
})
