// tests/unit/components/layout/mobile-menu.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import MobileMenu from '@components/layout/MobileMenu.astro'
import type { NavigationTree } from '@/types/navigation'

// ── Fixtures ────────────────────────────────────────
const MINIMAL_TREE: NavigationTree = {
  framework: [
    { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', section: 'framework', order: 1, badge: 'essential' as const },
    { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework', order: 2 },
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
        { id: 'annexe-a2-arch', label: 'A2 - Architecture', href: '/annexes/templates/architecture', order: 2 },
      ],
    },
    {
      id: 'annexes-b-roles', label: 'B - Roles', href: '/annexes/roles',
      section: 'annexes', order: 2,
      children: [
        { id: 'annexe-b1-pm', label: 'B1 - Product Manager', href: '/annexes/roles/product-manager', order: 1 },
      ],
    },
  ],
}

const EMPTY_TREE: NavigationTree = {
  framework: [],
  modeOperatoire: [],
  annexes: [],
}

// ── Helpers ──────────────────────────────────────────
async function renderMobileMenu(
  props: Record<string, unknown> = {},
  currentPath: string = '/',
) {
  const container = await AstroContainer.create()
  return container.renderToString(MobileMenu, {
    props: {
      tree: MINIMAL_TREE,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML de base ─────────────────────
describe('MobileMenu — Structure HTML', () => {
  it('T-01 : rend un conteneur avec data-mobile-menu', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu')
  })

  it('T-02 : rend un bouton hamburger avec data-mobile-menu-toggle', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-toggle')
    expect(html).toContain('<button')
  })

  it('T-03 : le bouton hamburger a aria-expanded="false" par defaut', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-expanded="false"')
  })

  it('T-04 : le bouton hamburger a aria-controls pointant vers le panneau', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-controls="mobile-menu-panel"')
  })

  it('T-05 : le bouton hamburger a aria-label="Menu de navigation"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-label="Menu de navigation"')
  })

  it('T-06 : le panneau a role="dialog" et aria-modal="true"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('role="dialog"')
    expect(html).toContain('aria-modal="true"')
  })

  it('T-07 : le panneau a aria-label="Navigation principale"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-label="Navigation principale"')
  })

  it('T-08 : le panneau est masque par defaut (classe hidden)', async () => {
    const html = await renderMobileMenu()
    expect(html).toMatch(/class="[^"]*z-50[^"]*hidden[^"]*"[^>]*data-mobile-menu-panel/)
  })

  it('T-09 : contient le bouton fermer avec aria-label="Fermer le menu"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-label="Fermer le menu"')
    expect(html).toContain('data-mobile-menu-close')
  })

  it('T-10 : contient le backdrop avec data-mobile-menu-backdrop', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-backdrop')
    expect(html).toContain('bg-black/50')
  })
})

// ── Tests icones hamburger/croix ─────────────────────
describe('MobileMenu — Icones', () => {
  it('T-11 : l\'icone hamburger est presente (data-mobile-menu-icon-open)', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-icon-open')
    expect(html).toContain('M4 6h16M4 12h16M4 18h16')
  })

  it('T-12 : l\'icone croix est presente mais masquee (data-mobile-menu-icon-close)', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-icon-close')
    expect(html).toContain('M6 18L18 6M6 6l12 12')
  })

  it('T-13 : l\'icone croix a la classe hidden par defaut', async () => {
    const html = await renderMobileMenu()
    expect(html).toMatch(/class="hidden[^"]*"[^>]*data-mobile-menu-icon-close/)
  })

  it('T-14 : les icones SVG ont aria-hidden="true"', async () => {
    const html = await renderMobileMenu()
    const svgMatches = html.match(/<svg[^>]*data-mobile-menu-icon[^>]*>/g) || []
    svgMatches.forEach((svg: string) => {
      expect(svg).toContain('aria-hidden="true"')
    })
  })
})

// ── Tests sections accordeon ─────────────────────────
describe('MobileMenu — Sections accordeon', () => {
  it('T-15 : rend 3 sections (Framework, Mode Operatoire, Annexes)', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-section="framework"')
    expect(html).toContain('data-mobile-menu-section="mode-operatoire"')
    expect(html).toContain('data-mobile-menu-section="annexes"')
  })

  it('T-16 : chaque section a un bouton avec data-mobile-menu-section-toggle', async () => {
    const html = await renderMobileMenu()
    const toggleCount = (html.match(/data-mobile-menu-section-toggle/g) || []).length
    expect(toggleCount).toBe(3)
  })

  it('T-17 : chaque section a un panneau avec role="region"', async () => {
    const html = await renderMobileMenu()
    const regionCount = (html.match(/data-mobile-menu-section-panel/g) || []).length
    expect(regionCount).toBe(3)
  })

  it('T-18 : les boutons de section ont aria-controls pointant vers leur panneau', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-controls="mobile-menu-section-framework-panel"')
    expect(html).toContain('aria-controls="mobile-menu-section-mode-operatoire-panel"')
    expect(html).toContain('aria-controls="mobile-menu-section-annexes-panel"')
  })

  it('T-19 : les panneaux de section ont aria-labelledby pointant vers leur bouton', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('aria-labelledby="mobile-menu-section-framework-button"')
  })

  it('T-20 : les labels de section sont affiches', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('Framework')
    expect(html).toContain('Mode Operatoire')
    expect(html).toContain('Annexes')
  })

  it('T-21 : les chevrons de section sont presents', async () => {
    const html = await renderMobileMenu()
    const chevronCount = (html.match(/data-mobile-menu-section-chevron/g) || []).length
    expect(chevronCount).toBe(3)
  })

  it('T-22 : les separateurs sont presents entre les sections', async () => {
    const html = await renderMobileMenu()
    const separatorCount = (html.match(/role="separator"/g) || []).length
    expect(separatorCount).toBe(2)
  })
})

// ── Tests section active ─────────────────────────────
describe('MobileMenu — Section active', () => {
  it('T-23 : la section Framework est depliee quand l\'URL commence par /framework', async () => {
    const html = await renderMobileMenu({}, '/framework/preambule')
    // aria-expanded comes before data-section in rendered HTML
    expect(html).toMatch(/aria-expanded="true"[^>]*data-section="framework"/)
  })

  it('T-24 : les autres sections sont repliees quand Framework est active', async () => {
    const html = await renderMobileMenu({}, '/framework/preambule')
    expect(html).toMatch(/aria-expanded="false"[^>]*data-section="mode-operatoire"/)
    expect(html).toMatch(/aria-expanded="false"[^>]*data-section="annexes"/)
  })

  it('T-25 : la section Mode Operatoire est depliee quand l\'URL commence par /mode-operatoire', async () => {
    const html = await renderMobileMenu({}, '/mode-operatoire/preambule')
    expect(html).toMatch(/aria-expanded="true"[^>]*data-section="mode-operatoire"/)
  })

  it('T-26 : toutes les sections sont repliees sur la page d\'accueil', async () => {
    const html = await renderMobileMenu({}, '/')
    expect(html).toMatch(/aria-expanded="false"[^>]*data-section="framework"/)
    expect(html).toMatch(/aria-expanded="false"[^>]*data-section="mode-operatoire"/)
    expect(html).toMatch(/aria-expanded="false"[^>]*data-section="annexes"/)
  })

  it('T-27 : le chevron de la section active est tourne (rotate-180)', async () => {
    const html = await renderMobileMenu({}, '/framework/preambule')
    // Le chevron dans la section framework doit avoir rotate-180
    const fwSection = html.split('data-section="framework"')[1]?.split('data-mobile-menu-section="')[0] || ''
    expect(fwSection).toContain('rotate-180')
  })
})

// ── Tests items de navigation ────────────────────────
describe('MobileMenu — Items de navigation', () => {
  it('T-28 : les items Framework sont rendus comme des NavLink', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('href="/framework/preambule"')
    expect(html).toContain('Preambule')
    expect(html).toContain('Vision &amp; Philosophie')
  })

  it('T-29 : les items ont data-navlink (via NavLink)', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-navlink')
  })

  it('T-30 : le badge est affiche sur les items qui en ont un', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('Essentiel')
  })

  it('T-31 : les items Mode Operatoire sont rendus', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('href="/mode-operatoire/preambule"')
  })
})

// ── Tests Annexes (sous-accordeon) ───────────────────
describe('MobileMenu — Annexes sous-accordeon', () => {
  it('T-32 : les categories Annexes sont rendues avec data-mobile-menu-category', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-category="annexes-a-templates"')
    expect(html).toContain('data-mobile-menu-category="annexes-b-roles"')
  })

  it('T-33 : les categories ont des boutons toggle avec data-mobile-menu-category-toggle', async () => {
    const html = await renderMobileMenu()
    const toggleCount = (html.match(/data-mobile-menu-category-toggle/g) || []).length
    expect(toggleCount).toBe(2)
  })

  it('T-34 : les categories ont des panneaux avec role="region"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-category-panel')
  })

  it('T-35 : les labels de categorie sont affiches', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('A - Templates')
    expect(html).toContain('B - Roles')
  })

  it('T-36 : les fiches enfants sont rendues', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('A1 - PRD')
    expect(html).toContain('A2 - Architecture')
    expect(html).toContain('B1 - Product Manager')
  })

  it('T-37 : les fiches ont les bons hrefs', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('href="/annexes/templates/prd"')
    expect(html).toContain('href="/annexes/templates/architecture"')
    expect(html).toContain('href="/annexes/roles/product-manager"')
  })

  it('T-38 : la categorie active est depliee quand l\'URL correspond', async () => {
    const html = await renderMobileMenu({}, '/annexes/templates/prd')
    // Le bouton de la categorie A doit avoir aria-expanded="true"
    expect(html).toMatch(/data-mobile-menu-category="annexes-a-templates"[\s\S]*?aria-expanded="true"/)
  })

  it('T-39 : les categories inactives sont repliees', async () => {
    const html = await renderMobileMenu({}, '/annexes/templates/prd')
    // Le panneau B doit avoir la classe hidden
    expect(html).toMatch(/class="pl-4 hidden"[^>]*id="mobile-menu-category-annexes-b-roles-panel"/)
  })

  it('T-40 : les chevrons de categorie sont presents', async () => {
    const html = await renderMobileMenu()
    const chevronCount = (html.match(/data-mobile-menu-category-chevron/g) || []).length
    expect(chevronCount).toBe(2)
  })
})

// ── Tests responsive ─────────────────────────────────
describe('MobileMenu — Responsive', () => {
  it('T-41 : le conteneur racine a la classe lg:hidden', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('lg:hidden')
  })

  it('T-42 : l\'overlay a z-50 pour etre au-dessus du contenu', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('z-50')
  })

  it('T-43 : le panneau a max-w-sm', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('max-w-sm')
  })
})

// ── Tests lien accueil ───────────────────────────────
describe('MobileMenu — Lien accueil', () => {
  it('T-44 : le lien accueil est present avec data-mobile-menu-home', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('data-mobile-menu-home')
  })

  it('T-45 : le lien accueil pointe vers "/"', async () => {
    const html = await renderMobileMenu()
    // href comes before data-mobile-menu-home in rendered HTML
    expect(html).toMatch(/href="\/"[^>]*data-mobile-menu-home/)
  })

  it('T-46 : le lien accueil contient le texte "Accueil"', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('Accueil')
  })
})

// ── Tests IDs et ARIA ────────────────────────────────
describe('MobileMenu — IDs et ARIA', () => {
  it('T-47 : IDs generes automatiquement a partir de l\'id par defaut', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('id="mobile-menu"')
    expect(html).toContain('id="mobile-menu-toggle"')
    expect(html).toContain('id="mobile-menu-panel"')
    expect(html).toContain('id="mobile-menu-close"')
  })

  it('T-48 : IDs personnalises quand id est fourni', async () => {
    const html = await renderMobileMenu({ id: 'custom-menu' })
    expect(html).toContain('id="custom-menu"')
    expect(html).toContain('id="custom-menu-toggle"')
    expect(html).toContain('id="custom-menu-panel"')
  })
})

// ── Tests styles ─────────────────────────────────────
describe('MobileMenu — Styles', () => {
  it('T-49 : le bouton hamburger a un focus ring', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })

  it('T-50 : le panneau a shadow-xl', async () => {
    const html = await renderMobileMenu()
    expect(html).toContain('shadow-xl')
  })
})

// ── Tests classes et attributs ───────────────────────
describe('MobileMenu — Classes et attributs', () => {
  it('T-51 : classe personnalisee ajoutee au conteneur', async () => {
    const html = await renderMobileMenu({ class: 'ml-2' })
    expect(html).toContain('ml-2')
  })

  it('T-52 : le backdrop a aria-hidden="true"', async () => {
    const html = await renderMobileMenu()
    expect(html).toMatch(/data-mobile-menu-backdrop[^>]*aria-hidden="true"/)
  })
})

// ── Tests tri des items ──────────────────────────────
describe('MobileMenu — Tri des items', () => {
  it('T-53 : les items Framework sont tries par order', async () => {
    const html = await renderMobileMenu()
    const preambuleIndex = html.indexOf('Preambule')
    const visionIndex = html.indexOf('Vision')
    expect(preambuleIndex).toBeLessThan(visionIndex)
  })

  it('T-54 : les fiches Annexes sont triees par order dans les categories', async () => {
    const html = await renderMobileMenu()
    const a1Index = html.indexOf('A1 - PRD')
    const a2Index = html.indexOf('A2 - Architecture')
    expect(a1Index).toBeLessThan(a2Index)
  })
})

// ── Tests XSS ────────────────────────────────────────
describe('MobileMenu — Protection XSS', () => {
  it('T-55 : label avec HTML est echappe', async () => {
    const xssTree: NavigationTree = {
      framework: [{ id: 'xss', label: '<script>alert("xss")</script>', href: '/test', order: 1 }],
      modeOperatoire: [],
      annexes: [],
    }
    const html = await renderMobileMenu({ tree: xssTree })
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
  resolve(__dirname, '../../../../src/components/layout/MobileMenu.astro'),
  'utf-8',
)

describe('MobileMenu — Script client', () => {
  it('T-56 : un <script> est present dans le source du composant', () => {
    expect(COMPONENT_SOURCE).toContain('<script>')
  })

  it('T-57 : le script reference data-mobile-menu pour l\'initialisation', () => {
    expect(COMPONENT_SOURCE).toContain('[data-mobile-menu]')
  })

  it('T-58 : le script gere Escape', () => {
    expect(COMPONENT_SOURCE).toContain('Escape')
  })

  it('T-59 : le script gere le focus trap (Tab)', () => {
    expect(COMPONENT_SOURCE).toContain('Tab')
    expect(COMPONENT_SOURCE).toContain('shiftKey')
  })

  it('T-60 : le script gere le verrouillage du scroll', () => {
    expect(COMPONENT_SOURCE).toContain('overflow')
    expect(COMPONENT_SOURCE).toContain('hidden')
  })
})

// ── Tests arbre vide ─────────────────────────────────
describe('MobileMenu — Arbre vide', () => {
  it('T-61 : rend le bouton hamburger meme avec un arbre vide', async () => {
    const html = await renderMobileMenu({ tree: EMPTY_TREE })
    expect(html).toContain('data-mobile-menu-toggle')
  })

  it('T-62 : le lien accueil est toujours present avec un arbre vide', async () => {
    const html = await renderMobileMenu({ tree: EMPTY_TREE })
    expect(html).toContain('data-mobile-menu-home')
  })
})
