// tests/unit/lib/navigation.test.ts

import { describe, it, expect } from 'vitest'
import {
  SECTION_LABELS,
  SECTION_ROOT_HREFS,
  flattenNav,
  getBreadcrumbs,
  getPrevNext,
  getCurrentSection,
  getNavigation,
} from '@/lib/navigation'
import { NAVIGATION_TREE, NAVIGATION_COUNTS } from '@/data/navigation'
import type {
  NavigationTree,
} from '@/types/navigation'

// ──────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────

/** Arbre minimal pour tests isolés */
const minimalTree: NavigationTree = {
  framework: [
    { id: 'fw-1', label: 'Chapitre 1', href: '/framework/chapitre-1', section: 'framework', order: 1 },
    { id: 'fw-2', label: 'Chapitre 2', href: '/framework/chapitre-2', section: 'framework', order: 2 },
  ],
  modeOperatoire: [
    { id: 'mo-1', label: 'Phase 1', href: '/mode-operatoire/phase-1', section: 'mode-operatoire', order: 1 },
  ],
  annexes: [
    {
      id: 'annexes-a', label: 'A - Cat', href: '/annexes/cat-a', section: 'annexes', order: 1,
      children: [
        { id: 'annexe-a1', label: 'A1 - Fiche', href: '/annexes/cat-a/fiche-1', order: 1 },
        { id: 'annexe-a2', label: 'A2 - Fiche', href: '/annexes/cat-a/fiche-2', order: 2 },
      ],
    },
  ],
}

/** Arbre vide */
const emptyTree: NavigationTree = {
  framework: [],
  modeOperatoire: [],
  annexes: [],
}

/** Arbre avec items cachés */
const treeWithHidden: NavigationTree = {
  framework: [
    { id: 'fw-visible', label: 'Visible', href: '/framework/visible', section: 'framework', order: 1 },
    { id: 'fw-hidden', label: 'Caché', href: '/framework/cache', section: 'framework', order: 2, isHidden: true },
    { id: 'fw-after', label: 'Après', href: '/framework/apres', section: 'framework', order: 3 },
  ],
  modeOperatoire: [],
  annexes: [],
}

/** Arbre avec parent caché ayant des enfants */
const treeWithHiddenParent: NavigationTree = {
  framework: [],
  modeOperatoire: [],
  annexes: [
    {
      id: 'hidden-cat', label: 'Catégorie Cachée', href: '/annexes/hidden', section: 'annexes', order: 1,
      isHidden: true,
      children: [
        { id: 'hidden-child', label: 'Enfant', href: '/annexes/hidden/child', order: 1 },
      ],
    },
    {
      id: 'visible-cat', label: 'Catégorie Visible', href: '/annexes/visible', section: 'annexes', order: 2,
      children: [
        { id: 'visible-child', label: 'Enfant Visible', href: '/annexes/visible/child', order: 1 },
      ],
    },
  ],
}

/** Arbre avec order non séquentiel */
const treeUnsorted: NavigationTree = {
  framework: [
    { id: 'fw-c', label: 'C', href: '/framework/c', section: 'framework', order: 3 },
    { id: 'fw-a', label: 'A', href: '/framework/a', section: 'framework', order: 1 },
    { id: 'fw-b', label: 'B', href: '/framework/b', section: 'framework', order: 2 },
  ],
  modeOperatoire: [],
  annexes: [],
}

// ──────────────────────────────────────────────────
// Tests des constantes
// ──────────────────────────────────────────────────

describe('Constantes de navigation', () => {
  describe('SECTION_LABELS', () => {
    it('contient les 3 sections avec leurs labels français', () => {
      expect(SECTION_LABELS['framework']).toBe('Framework')
      expect(SECTION_LABELS['mode-operatoire']).toBe('Mode Opératoire')
      expect(SECTION_LABELS['annexes']).toBe('Annexes')
    })

    it('contient exactement 3 entrées', () => {
      expect(Object.keys(SECTION_LABELS)).toHaveLength(3)
    })
  })

  describe('SECTION_ROOT_HREFS', () => {
    it('contient les 3 sections avec leurs hrefs racine', () => {
      expect(SECTION_ROOT_HREFS['framework']).toBe('/framework')
      expect(SECTION_ROOT_HREFS['mode-operatoire']).toBe('/mode-operatoire')
      expect(SECTION_ROOT_HREFS['annexes']).toBe('/annexes')
    })

    it('tous les hrefs commencent par /', () => {
      for (const href of Object.values(SECTION_ROOT_HREFS)) {
        expect(href).toMatch(/^\//)
      }
    })

    it('contient exactement 3 entrées', () => {
      expect(Object.keys(SECTION_ROOT_HREFS)).toHaveLength(3)
    })
  })
})

// ──────────────────────────────────────────────────
// Tests de flattenNav
// ──────────────────────────────────────────────────

describe('flattenNav', () => {
  it('T-27: produit exactement 71 items sur NAVIGATION_TREE complet', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    expect(flat).toHaveLength(NAVIGATION_COUNTS.TOTAL_ITEMS)
    expect(flat).toHaveLength(71)
  })

  it('T-29: le premier item est fw-preambule', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    expect(flat[0].id).toBe('fw-preambule')
    expect(flat[0].href).toBe('/framework/preambule')
    expect(flat[0].section).toBe('framework')
    expect(flat[0].depth).toBe(0)
  })

  it('T-28: le dernier item est annexe-i4-communaute', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    expect(flat[flat.length - 1].id).toBe('annexe-i4-communaute')
    expect(flat[flat.length - 1].href).toBe('/annexes/ressources/communaute')
    expect(flat[flat.length - 1].section).toBe('annexes')
    expect(flat[flat.length - 1].depth).toBe(1)
  })

  it('T-01: arbre vide retourne un tableau vide', () => {
    const flat = flattenNav(emptyTree)
    expect(flat).toEqual([])
  })

  it('T-02: les items isHidden sont exclus', () => {
    const flat = flattenNav(treeWithHidden)
    expect(flat).toHaveLength(2)
    expect(flat.map((i) => i.id)).toEqual(['fw-visible', 'fw-after'])
    expect(flat.find((i) => i.id === 'fw-hidden')).toBeUndefined()
  })

  it('T-03: un parent isHidden exclut aussi ses enfants', () => {
    const flat = flattenNav(treeWithHiddenParent)
    expect(flat).toHaveLength(2)
    expect(flat.map((i) => i.id)).toEqual(['visible-cat', 'visible-child'])
    expect(flat.find((i) => i.id === 'hidden-cat')).toBeUndefined()
    expect(flat.find((i) => i.id === 'hidden-child')).toBeUndefined()
  })

  it('T-04: la section est propagée du parent vers les enfants', () => {
    const flat = flattenNav(minimalTree)
    const fiche = flat.find((i) => i.id === 'annexe-a1')
    expect(fiche).toBeDefined()
    expect(fiche!.section).toBe('annexes')
  })

  it('T-05: les items sont triés par order même si l\'arbre ne l\'est pas', () => {
    const flat = flattenNav(treeUnsorted)
    expect(flat.map((i) => i.id)).toEqual(['fw-a', 'fw-b', 'fw-c'])
    expect(flat.map((i) => i.label)).toEqual(['A', 'B', 'C'])
  })

  it('T-06: arbre avec un seul item retourne un tableau avec 1 élément', () => {
    const singleTree: NavigationTree = {
      framework: [{ id: 'fw-only', label: 'Seul', href: '/framework/seul', section: 'framework', order: 1 }],
      modeOperatoire: [],
      annexes: [],
    }
    const flat = flattenNav(singleTree)
    expect(flat).toHaveLength(1)
    expect(flat[0].id).toBe('fw-only')
  })

  it('l\'ordre séquentiel est Framework → Mode Opératoire → Annexes', () => {
    const flat = flattenNav(minimalTree)
    const sections = flat.map((i) => i.section)
    // Framework d'abord
    expect(sections[0]).toBe('framework')
    expect(sections[1]).toBe('framework')
    // Puis Mode Opératoire
    expect(sections[2]).toBe('mode-operatoire')
    // Puis Annexes
    expect(sections[3]).toBe('annexes')
  })

  it('les catégories Annexes apparaissent avant leurs fiches enfants', () => {
    const flat = flattenNav(minimalTree)
    const annexeItems = flat.filter((i) => i.section === 'annexes')
    expect(annexeItems[0].id).toBe('annexes-a')
    expect(annexeItems[0].depth).toBe(0)
    expect(annexeItems[1].id).toBe('annexe-a1')
    expect(annexeItems[1].depth).toBe(1)
    expect(annexeItems[2].id).toBe('annexe-a2')
    expect(annexeItems[2].depth).toBe(1)
  })

  it('le depth des chapitres Framework est 0', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const fwItems = flat.filter((i) => i.section === 'framework')
    for (const item of fwItems) {
      expect(item.depth).toBe(0)
    }
  })

  it('le depth des catégories Annexes est 0 et des fiches est 1', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const annexeItems = flat.filter((i) => i.section === 'annexes')
    for (const item of annexeItems) {
      expect(item.depth === 0 || item.depth === 1).toBe(true)
    }
    // Les catégories (depth 0) commencent par 'annexes-'
    const categories = annexeItems.filter((i) => i.depth === 0)
    for (const cat of categories) {
      expect(cat.id).toMatch(/^annexes-/)
    }
    // Les fiches (depth 1) commencent par 'annexe-'
    const fiches = annexeItems.filter((i) => i.depth === 1)
    for (const fiche of fiches) {
      expect(fiche.id).toMatch(/^annexe-/)
    }
  })

  it('tous les items ont un section défini après aplatissement', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    for (const item of flat) {
      expect(item.section).toBeDefined()
      expect(['framework', 'mode-operatoire', 'annexes']).toContain(item.section)
    }
  })

  it('ne mute pas l\'arbre original', () => {
    const original = JSON.parse(JSON.stringify(minimalTree))
    flattenNav(minimalTree)
    expect(minimalTree).toEqual(original)
  })
})

// ──────────────────────────────────────────────────
// Tests de getBreadcrumbs
// ──────────────────────────────────────────────────

describe('getBreadcrumbs', () => {
  it('T-10: chapitre Framework → 3 éléments', () => {
    const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/framework/preambule')
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(3)
    expect(crumbs![0]).toEqual({ label: 'Accueil', href: '/' })
    expect(crumbs![1]).toEqual({ label: 'Framework', href: '/framework' })
    expect(crumbs![2]).toEqual({ label: 'Préambule', href: '/framework/preambule', isCurrent: true })
  })

  it('T-31: chapitre Mode Opératoire → 3 éléments avec label "Mode Opératoire"', () => {
    const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/mode-operatoire/planification')
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(3)
    expect(crumbs![1]).toEqual({ label: 'Mode Opératoire', href: '/mode-operatoire' })
    expect(crumbs![2]).toEqual({ label: 'Planification', href: '/mode-operatoire/planification', isCurrent: true })
  })

  it('T-12: catégorie Annexe → 3 éléments', () => {
    const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/annexes/templates')
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(3)
    expect(crumbs![0]).toEqual({ label: 'Accueil', href: '/' })
    expect(crumbs![1]).toEqual({ label: 'Annexes', href: '/annexes' })
    expect(crumbs![2]).toEqual({ label: 'A - Templates', href: '/annexes/templates', isCurrent: true })
  })

  it('T-11: fiche Annexe → 4 éléments', () => {
    const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/annexes/templates/prd')
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(4)
    expect(crumbs![0]).toEqual({ label: 'Accueil', href: '/' })
    expect(crumbs![1]).toEqual({ label: 'Annexes', href: '/annexes' })
    expect(crumbs![2]).toEqual({ label: 'A - Templates', href: '/annexes/templates' })
    expect(crumbs![3]).toEqual({ label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true })
  })

  it('le premier élément est toujours Accueil (règle R5)', () => {
    const paths = [
      '/framework/preambule',
      '/mode-operatoire/initialisation',
      '/annexes/agents/agent-security',
    ]
    for (const path of paths) {
      const crumbs = getBreadcrumbs(NAVIGATION_TREE, path)
      expect(crumbs).not.toBeNull()
      expect(crumbs![0]).toEqual({ label: 'Accueil', href: '/' })
    }
  })

  it('le dernier élément a toujours isCurrent: true (règle R13)', () => {
    const paths = [
      '/framework/ecosysteme',
      '/mode-operatoire/validation',
      '/annexes/roles/tech-lead',
    ]
    for (const path of paths) {
      const crumbs = getBreadcrumbs(NAVIGATION_TREE, path)
      expect(crumbs).not.toBeNull()
      expect(crumbs![crumbs!.length - 1].isCurrent).toBe(true)
    }
  })

  it('les éléments intermédiaires n\'ont pas isCurrent: true', () => {
    const crumbs = getBreadcrumbs(NAVIGATION_TREE, '/annexes/templates/prd')
    expect(crumbs).not.toBeNull()
    for (let i = 0; i < crumbs!.length - 1; i++) {
      expect(crumbs![i].isCurrent).toBeUndefined()
    }
  })

  it('T-08: chemin introuvable retourne null', () => {
    expect(getBreadcrumbs(NAVIGATION_TREE, '/page-inexistante')).toBeNull()
    expect(getBreadcrumbs(NAVIGATION_TREE, '/framework/page-qui-nexiste-pas')).toBeNull()
  })

  it('T-07: chemin "/" retourne null (accueil pas dans l\'arbre)', () => {
    expect(getBreadcrumbs(NAVIGATION_TREE, '/')).toBeNull()
  })

  it('T-09: trailing slash est normalisé', () => {
    const withSlash = getBreadcrumbs(NAVIGATION_TREE, '/framework/preambule/')
    const withoutSlash = getBreadcrumbs(NAVIGATION_TREE, '/framework/preambule')
    expect(withSlash).toEqual(withoutSlash)
  })

  it('fonctionne avec un arbre minimal (fixture)', () => {
    const crumbs = getBreadcrumbs(minimalTree, '/annexes/cat-a/fiche-1')
    expect(crumbs).not.toBeNull()
    expect(crumbs).toHaveLength(4)
    expect(crumbs![0].label).toBe('Accueil')
    expect(crumbs![1].label).toBe('Annexes')
    expect(crumbs![2].label).toBe('A - Cat')
    expect(crumbs![3].label).toBe('A1 - Fiche')
    expect(crumbs![3].isCurrent).toBe(true)
  })
})

// ──────────────────────────────────────────────────
// Tests de getPrevNext
// ──────────────────────────────────────────────────

describe('getPrevNext', () => {
  it('T-13: première page du site → prev: null', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/framework/preambule')
    expect(result.prev).toBeNull()
    expect(result.next).not.toBeNull()
    expect(result.next!.label).toBe('Vision & Philosophie')
    expect(result.next!.href).toBe('/framework/vision-philosophie')
    expect(result.next!.section).toBe('framework')
  })

  it('T-14: dernière page du site → next: null', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/annexes/ressources/communaute')
    expect(result.next).toBeNull()
    expect(result.prev).not.toBeNull()
    expect(result.prev!.label).toBe('I3 - Bibliographie')
    expect(result.prev!.href).toBe('/annexes/ressources/bibliographie')
    expect(result.prev!.section).toBe('annexes')
  })

  it('page au milieu d\'une section → prev et next définis', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/framework/artefacts')
    expect(result.prev).not.toBeNull()
    expect(result.prev!.label).toBe('Écosystème')
    expect(result.prev!.section).toBe('framework')
    expect(result.next).not.toBeNull()
    expect(result.next!.label).toBe('Boucles Itératives')
    expect(result.next!.section).toBe('framework')
  })

  it('T-15: transition Framework → Mode Opératoire', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/mode-operatoire/preambule')
    expect(result.prev).not.toBeNull()
    expect(result.prev!.href).toBe('/framework/annexes')
    expect(result.prev!.section).toBe('framework')
    expect(result.next).not.toBeNull()
    expect(result.next!.section).toBe('mode-operatoire')
  })

  it('T-16: transition Mode Opératoire → Annexes', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/annexes/templates')
    expect(result.prev).not.toBeNull()
    expect(result.prev!.href).toBe('/mode-operatoire/annexes')
    expect(result.prev!.section).toBe('mode-operatoire')
    expect(result.next).not.toBeNull()
    expect(result.next!.section).toBe('annexes')
  })

  it('T-30: dernier Mode Opératoire → next est première catégorie Annexes', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/mode-operatoire/annexes')
    expect(result.next).not.toBeNull()
    expect(result.next!.href).toBe('/annexes/templates')
    expect(result.next!.label).toBe('A - Templates')
    expect(result.next!.section).toBe('annexes')
  })

  it('T-17: chemin introuvable retourne { prev: null, next: null }', () => {
    const result = getPrevNext(NAVIGATION_TREE, '/page-inexistante')
    expect(result.prev).toBeNull()
    expect(result.next).toBeNull()
  })

  it('T-18: trailing slash est normalisé', () => {
    const withSlash = getPrevNext(NAVIGATION_TREE, '/framework/artefacts/')
    const withoutSlash = getPrevNext(NAVIGATION_TREE, '/framework/artefacts')
    expect(withSlash).toEqual(withoutSlash)
  })

  it('chaque lien prev/next a un section défini', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    for (const item of flat) {
      const result = getPrevNext(NAVIGATION_TREE, item.href)
      if (result.prev) {
        expect(result.prev.section).toBeDefined()
      }
      if (result.next) {
        expect(result.next.section).toBeDefined()
      }
    }
  })

  it('fonctionne avec un arbre minimal (fixture)', () => {
    const result = getPrevNext(minimalTree, '/mode-operatoire/phase-1')
    expect(result.prev).not.toBeNull()
    expect(result.prev!.href).toBeDefined()
    expect(result.next).not.toBeNull()
  })
})

// ──────────────────────────────────────────────────
// Tests de getCurrentSection
// ──────────────────────────────────────────────────

describe('getCurrentSection', () => {
  it('T-21: "/framework" retourne "framework"', () => {
    expect(getCurrentSection('/framework')).toBe('framework')
  })

  it('"/framework/preambule" retourne "framework"', () => {
    expect(getCurrentSection('/framework/preambule')).toBe('framework')
  })

  it('"/mode-operatoire/initialisation" retourne "mode-operatoire"', () => {
    expect(getCurrentSection('/mode-operatoire/initialisation')).toBe('mode-operatoire')
  })

  it('"/annexes/templates/prd" retourne "annexes"', () => {
    expect(getCurrentSection('/annexes/templates/prd')).toBe('annexes')
  })

  it('T-19: "/" retourne null', () => {
    expect(getCurrentSection('/')).toBeNull()
  })

  it('T-20: "/glossaire" retourne null', () => {
    expect(getCurrentSection('/glossaire')).toBeNull()
  })

  it('T-22: chemin vide retourne null', () => {
    expect(getCurrentSection('')).toBeNull()
  })

  it('T-23: trailing slash est normalisé', () => {
    expect(getCurrentSection('/framework/')).toBe('framework')
    expect(getCurrentSection('/mode-operatoire/')).toBe('mode-operatoire')
    expect(getCurrentSection('/annexes/')).toBe('annexes')
  })

  it('"/pour-qui" retourne null', () => {
    expect(getCurrentSection('/pour-qui')).toBeNull()
  })

  it('"/comparaisons" retourne null', () => {
    expect(getCurrentSection('/comparaisons')).toBeNull()
  })
})

// ──────────────────────────────────────────────────
// Tests de getNavigation
// ──────────────────────────────────────────────────

describe('getNavigation', () => {
  it('T-24: sans arguments retourne NAVIGATION_TREE', () => {
    const nav = getNavigation()
    expect(nav.framework).toHaveLength(8)
    expect(nav.modeOperatoire).toHaveLength(8)
    expect(nav.annexes).toHaveLength(9)
  })

  it('T-25: filtré sur "framework" ne retourne que Framework', () => {
    const nav = getNavigation(NAVIGATION_TREE, 'framework')
    expect(nav.framework).toHaveLength(8)
    expect(nav.modeOperatoire).toHaveLength(0)
    expect(nav.annexes).toHaveLength(0)
  })

  it('filtré sur "mode-operatoire" ne retourne que Mode Opératoire', () => {
    const nav = getNavigation(NAVIGATION_TREE, 'mode-operatoire')
    expect(nav.framework).toHaveLength(0)
    expect(nav.modeOperatoire).toHaveLength(8)
    expect(nav.annexes).toHaveLength(0)
  })

  it('T-26: filtré sur "annexes" ne retourne que Annexes', () => {
    const nav = getNavigation(NAVIGATION_TREE, 'annexes')
    expect(nav.framework).toHaveLength(0)
    expect(nav.modeOperatoire).toHaveLength(0)
    expect(nav.annexes).toHaveLength(9)
  })

  it('avec un arbre custom, retourne cet arbre', () => {
    const nav = getNavigation(minimalTree)
    expect(nav.framework).toHaveLength(2)
    expect(nav.modeOperatoire).toHaveLength(1)
    expect(nav.annexes).toHaveLength(1)
  })

  it('le filtrage retourne les mêmes items (pas de copie partielle)', () => {
    const nav = getNavigation(NAVIGATION_TREE, 'framework')
    expect(nav.framework).toBe(NAVIGATION_TREE.framework)
  })

  it('ne mute pas l\'arbre original', () => {
    const original = { ...minimalTree }
    getNavigation(minimalTree, 'framework')
    expect(minimalTree.framework).toBe(original.framework)
    expect(minimalTree.modeOperatoire).toBe(original.modeOperatoire)
    expect(minimalTree.annexes).toBe(original.annexes)
  })
})

// ──────────────────────────────────────────────────
// Tests d'intégration sur NAVIGATION_TREE complet
// ──────────────────────────────────────────────────

describe('Intégration sur NAVIGATION_TREE complet', () => {
  it('flattenNav produit des IDs tous uniques', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const ids = flat.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('flattenNav produit des hrefs tous uniques', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const hrefs = flat.map((i) => i.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('chaque item de flattenNav a un breadcrumb valide', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    for (const item of flat) {
      const crumbs = getBreadcrumbs(NAVIGATION_TREE, item.href)
      expect(crumbs).not.toBeNull()
      expect(crumbs!.length).toBeGreaterThanOrEqual(3)
      expect(crumbs![0].label).toBe('Accueil')
      expect(crumbs![crumbs!.length - 1].isCurrent).toBe(true)
      expect(crumbs![crumbs!.length - 1].href).toBe(item.href)
    }
  })

  it('chaque item de flattenNav a un getPrevNext cohérent', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    for (let i = 0; i < flat.length; i++) {
      const result = getPrevNext(NAVIGATION_TREE, flat[i].href)
      if (i === 0) {
        expect(result.prev).toBeNull()
      } else {
        expect(result.prev).not.toBeNull()
        expect(result.prev!.href).toBe(flat[i - 1].href)
      }
      if (i === flat.length - 1) {
        expect(result.next).toBeNull()
      } else {
        expect(result.next).not.toBeNull()
        expect(result.next!.href).toBe(flat[i + 1].href)
      }
    }
  })

  it('getCurrentSection est cohérent avec le section de flattenNav', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    for (const item of flat) {
      const section = getCurrentSection(item.href)
      expect(section).toBe(item.section)
    }
  })

  it('la séquence des 8 premiers items est le Framework complet', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const first8 = flat.slice(0, 8)
    expect(first8.every((i) => i.section === 'framework')).toBe(true)
    expect(first8[0].label).toBe('Préambule')
    expect(first8[7].label).toBe('Annexes')
  })

  it('les items 8-15 sont le Mode Opératoire complet', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const mo = flat.slice(8, 16)
    expect(mo.every((i) => i.section === 'mode-operatoire')).toBe(true)
    expect(mo[0].label).toBe('Préambule')
    expect(mo[7].label).toBe('Annexes')
  })

  it('les items 16+ sont les Annexes (catégories + fiches)', () => {
    const flat = flattenNav(NAVIGATION_TREE)
    const annexes = flat.slice(16)
    expect(annexes.every((i) => i.section === 'annexes')).toBe(true)
    expect(annexes).toHaveLength(55) // 9 catégories + 46 fiches
  })
})
