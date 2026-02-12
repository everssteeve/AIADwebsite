// tests/unit/components/layout/sidebar.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import Sidebar from '@components/layout/Sidebar.astro'
import type { NavigationTree } from '@/types/navigation'

// ── Fixtures ────────────────────────────────────────
const MINIMAL_TREE: NavigationTree = {
  framework: [
    { id: 'fw-preambule', label: 'Preambule', href: '/framework/preambule', section: 'framework', order: 1, badge: 'essential' as const },
    { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework', order: 2 },
    { id: 'fw-ecosysteme', label: 'Ecosysteme', href: '/framework/ecosysteme', section: 'framework', order: 3 },
  ],
  modeOperatoire: [
    { id: 'mo-preambule', label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire', order: 0 },
    { id: 'mo-init', label: 'Initialisation', href: '/mode-operatoire/initialisation', section: 'mode-operatoire', order: 1 },
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
async function renderSidebar(
  props: Record<string, unknown> = {},
  currentPath: string = '/',
) {
  const container = await AstroContainer.create()
  return container.renderToString(Sidebar, {
    props: {
      tree: MINIMAL_TREE,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML de base ─────────────────────
describe('Sidebar — Structure HTML', () => {
  it('T-01 : rend un <aside> avec data-sidebar', async () => {
    const html = await renderSidebar()
    expect(html).toContain('data-sidebar')
    expect(html).toContain('<aside')
  })

  it('T-02 : rend aria-label "Navigation des documents" sur le aside', async () => {
    const html = await renderSidebar()
    expect(html).toContain('aria-label="Navigation des documents"')
  })

  it('T-03 : rend un <nav> avec aria-label "Sections de documentation"', async () => {
    const html = await renderSidebar()
    expect(html).toContain('aria-label="Sections de documentation"')
    expect(html).toContain('<nav')
  })

  it('T-04 : rend les 3 sections (framework, mode-operatoire, annexes)', async () => {
    const html = await renderSidebar()
    expect(html).toContain('data-sidebar-section="framework"')
    expect(html).toContain('data-sidebar-section="mode-operatoire"')
    expect(html).toContain('data-sidebar-section="annexes"')
  })

  it('T-05 : chaque section a un bouton avec data-sidebar-section-toggle', async () => {
    const html = await renderSidebar()
    const toggleCount = (html.match(/data-sidebar-section-toggle/g) || []).length
    expect(toggleCount).toBe(3)
  })

  it('T-06 : chaque section a un panneau avec data-sidebar-section-panel', async () => {
    const html = await renderSidebar()
    const panelCount = (html.match(/data-sidebar-section-panel/g) || []).length
    expect(panelCount).toBe(3)
  })

  it('T-07 : les boutons section ont aria-expanded', async () => {
    const html = await renderSidebar()
    expect(html).toMatch(/aria-expanded[^>]*data-sidebar-section-toggle/)
  })

  it('T-08 : les boutons section ont aria-controls pointant vers le panneau', async () => {
    const html = await renderSidebar()
    expect(html).toContain('aria-controls="sidebar-section-framework-panel"')
    expect(html).toContain('aria-controls="sidebar-section-mode-operatoire-panel"')
    expect(html).toContain('aria-controls="sidebar-section-annexes-panel"')
  })

  it('T-09 : les panneaux section ont role="region"', async () => {
    const html = await renderSidebar()
    const regionCount = (html.match(/role="region"/g) || []).length
    expect(regionCount).toBeGreaterThanOrEqual(3)
  })

  it('T-10 : les panneaux section ont aria-labelledby pointant vers le bouton', async () => {
    const html = await renderSidebar()
    expect(html).toContain('aria-labelledby="sidebar-section-framework-button"')
    expect(html).toContain('aria-labelledby="sidebar-section-mode-operatoire-button"')
    expect(html).toContain('aria-labelledby="sidebar-section-annexes-button"')
  })

  it('T-11 : les labels des sections sont affiches', async () => {
    const html = await renderSidebar()
    expect(html).toContain('Framework')
    expect(html).toContain('Mode Operatoire')
    expect(html).toContain('Annexes')
  })

  it('T-12 : rend des separateurs entre les sections', async () => {
    const html = await renderSidebar()
    expect(html).toContain('role="separator"')
  })

  it('T-13 : la sidebar est masquee sur mobile (hidden lg:block)', async () => {
    const html = await renderSidebar()
    expect(html).toMatch(/class="[^"]*hidden lg:block/)
  })

  it('T-14 : la sidebar a une largeur de w-64', async () => {
    const html = await renderSidebar()
    expect(html).toMatch(/class="[^"]*w-64/)
  })

  it('T-15 : la sidebar est sticky', async () => {
    const html = await renderSidebar()
    expect(html).toMatch(/class="[^"]*sticky/)
  })
})

// ── Tests items de navigation ─────────────────────────
describe('Sidebar — Items de navigation', () => {
  it('T-16 : rend les items Framework en NavLink sidebar', async () => {
    const html = await renderSidebar()
    expect(html).toContain('href="/framework/preambule"')
    expect(html).toContain('href="/framework/vision-philosophie"')
    expect(html).toContain('href="/framework/ecosysteme"')
  })

  it('T-17 : rend les items Mode Operatoire en NavLink sidebar', async () => {
    const html = await renderSidebar()
    expect(html).toContain('href="/mode-operatoire/preambule"')
    expect(html).toContain('href="/mode-operatoire/initialisation"')
  })

  it('T-18 : rend les categories Annexes avec data-sidebar-category', async () => {
    const html = await renderSidebar()
    expect(html).toContain('data-sidebar-category="annexes-a-templates"')
    expect(html).toContain('data-sidebar-category="annexes-b-roles"')
  })

  it('T-19 : rend les fiches Annexes en NavLink sidebar', async () => {
    const html = await renderSidebar()
    expect(html).toContain('href="/annexes/templates/prd"')
    expect(html).toContain('href="/annexes/templates/architecture"')
    expect(html).toContain('href="/annexes/roles/product-manager"')
  })

  it('T-20 : les categories Annexes ont un bouton depliable', async () => {
    const html = await renderSidebar()
    const catToggleCount = (html.match(/data-sidebar-category-toggle/g) || []).length
    expect(catToggleCount).toBe(2) // 2 categories dans la fixture
  })

  it('T-21 : les categories Annexes ont un panneau depliable', async () => {
    const html = await renderSidebar()
    const catPanelCount = (html.match(/data-sidebar-category-panel/g) || []).length
    expect(catPanelCount).toBe(2)
  })

  it('T-22 : les items sont tries par order', async () => {
    const html = await renderSidebar()
    const preambuleIdx = html.indexOf('Preambule')
    const visionIdx = html.indexOf('Vision &amp; Philosophie')
    const ecosystemeIdx = html.indexOf('Ecosysteme')
    expect(preambuleIdx).toBeLessThan(visionIdx)
    expect(visionIdx).toBeLessThan(ecosystemeIdx)
  })

  it('T-23 : rend le badge essential sur le Preambule Framework', async () => {
    const html = await renderSidebar()
    expect(html).toContain('Essentiel')
  })
})

// ── Tests section active ──────────────────────────────
describe('Sidebar — Section active', () => {
  it('T-24 : section Framework depliee sur /framework/preambule', async () => {
    const html = await renderSidebar({}, '/framework/preambule')
    // Le bouton Framework doit avoir aria-expanded="true"
    expect(html).toMatch(/aria-expanded="true"[^>]*data-section="framework"/)
    // Son panneau ne doit pas etre hidden
    expect(html).toMatch(/id="sidebar-section-framework-panel"[^>]*data-sidebar-section-panel/)
  })

  it('T-25 : section Mode Operatoire depliee sur /mode-operatoire/initialisation', async () => {
    const html = await renderSidebar({}, '/mode-operatoire/initialisation')
    expect(html).toMatch(/aria-expanded="true"[^>]*data-section="mode-operatoire"/)
  })

  it('T-26 : section Annexes depliee sur /annexes/templates/prd', async () => {
    const html = await renderSidebar({}, '/annexes/templates/prd')
    expect(html).toMatch(/aria-expanded="true"[^>]*data-section="annexes"/)
  })

  it('T-27 : categorie A - Templates depliee sur /annexes/templates/prd', async () => {
    const html = await renderSidebar({}, '/annexes/templates/prd')
    // Le bouton de la categorie A doit avoir aria-expanded="true"
    expect(html).toMatch(/data-sidebar-category="annexes-a-templates"[\s\S]*?aria-expanded="true"/)
  })

  it('T-28 : aucune section depliee sur la page d\'accueil', async () => {
    const html = await renderSidebar({}, '/')
    // Tous les boutons section doivent avoir aria-expanded="false"
    const expandedTrueCount = (html.match(/aria-expanded="true"[^>]*data-sidebar-section-toggle/g) || []).length
    expect(expandedTrueCount).toBe(0)
  })

  it('T-29 : sections non actives fermees sur /framework/preambule', async () => {
    const html = await renderSidebar({}, '/framework/preambule')
    expect(html).toMatch(/aria-expanded="false"[^>]*data-section="mode-operatoire"/)
    expect(html).toMatch(/aria-expanded="false"[^>]*data-section="annexes"/)
  })

  it('T-30 : categorie B - Roles fermee sur /annexes/templates/prd', async () => {
    const html = await renderSidebar({}, '/annexes/templates/prd')
    expect(html).toMatch(/data-sidebar-category="annexes-b-roles"[\s\S]*?aria-expanded="false"/)
  })
})

// ── Tests props optionnelles ──────────────────────────
describe('Sidebar — Props optionnelles', () => {
  it('T-31 : classe personnalisee ajoutee au conteneur', async () => {
    const html = await renderSidebar({ class: 'border-r-2' })
    expect(html).toContain('border-r-2')
  })

  it('T-32 : id personnalise utilise comme base', async () => {
    const html = await renderSidebar({ id: 'docs-nav' })
    expect(html).toContain('id="docs-nav"')
    expect(html).toContain('id="docs-nav-section-framework-button"')
    expect(html).toContain('id="docs-nav-section-framework-panel"')
  })

  it('T-33 : id par defaut est "sidebar"', async () => {
    const html = await renderSidebar()
    expect(html).toContain('id="sidebar"')
  })

  it('T-34 : arbre custom override le NAVIGATION_TREE', async () => {
    const customTree: NavigationTree = {
      framework: [{ id: 'custom-item', label: 'Custom', href: '/custom', section: 'framework', order: 1 }],
      modeOperatoire: [],
      annexes: [],
    }
    const html = await renderSidebar({ tree: customTree })
    expect(html).toContain('Custom')
    expect(html).toContain('href="/custom"')
  })

  it('T-35 : arbre vide rend les sections sans items', async () => {
    const html = await renderSidebar({ tree: EMPTY_TREE })
    // Les boutons section sont rendus mais les panneaux sont vides
    expect(html).toContain('data-sidebar-section-toggle')
  })
})

// ── Tests protection XSS ──────────────────────────────
describe('Sidebar — Protection XSS', () => {
  it('T-36 : les labels sont echappes', async () => {
    const xssTree: NavigationTree = {
      framework: [{ id: 'xss', label: '<script>alert("xss")</script>', href: '/test', order: 1 }],
      modeOperatoire: [],
      annexes: [],
    }
    const html = await renderSidebar({ tree: xssTree })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })
})
