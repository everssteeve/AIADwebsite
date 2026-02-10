// tests/unit/data/navigation.test.ts

import { describe, it, expect } from 'vitest'
import {
  NAVIGATION_TREE,
  NAVIGATION_COUNTS,
  FRAMEWORK_NAV,
  MODE_OPERATOIRE_NAV,
  ANNEXES_NAV,
} from '@/data/navigation'
import { navigationTreeSchema } from '@/schemas/navigation'
import type { NavigationItem } from '@/types/navigation'

// ──────────────────────────────────────────────────
// Helpers de test
// ──────────────────────────────────────────────────

/**
 * Collecte récursivement tous les IDs d'un tableau de NavigationItem.
 */
function collectAllIds(items: NavigationItem[]): string[] {
  const ids: string[] = []
  function walk(nodes: NavigationItem[]) {
    for (const node of nodes) {
      ids.push(node.id)
      if (node.children) walk(node.children)
    }
  }
  walk(items)
  return ids
}

/**
 * Collecte récursivement tous les hrefs d'un tableau de NavigationItem.
 */
function collectAllHrefs(items: NavigationItem[]): string[] {
  const hrefs: string[] = []
  function walk(nodes: NavigationItem[]) {
    for (const node of nodes) {
      hrefs.push(node.href)
      if (node.children) walk(node.children)
    }
  }
  walk(items)
  return hrefs
}

/**
 * Compte le nombre total d'items (récursif) dans un tableau de NavigationItem.
 */
function countItems(items: NavigationItem[]): number {
  let count = 0
  function walk(nodes: NavigationItem[]) {
    for (const node of nodes) {
      count++
      if (node.children) walk(node.children)
    }
  }
  walk(items)
  return count
}

// ──────────────────────────────────────────────────
// Tests de validation Zod
// ──────────────────────────────────────────────────

describe('Validation Zod de NAVIGATION_TREE', () => {
  it('passe la validation navigationTreeSchema sans erreur', () => {
    expect(() => navigationTreeSchema.parse({
      framework: FRAMEWORK_NAV,
      modeOperatoire: MODE_OPERATOIRE_NAV,
      annexes: ANNEXES_NAV,
    })).not.toThrow()
  })

  it('NAVIGATION_TREE est le résultat de navigationTreeSchema.parse()', () => {
    const parsed = navigationTreeSchema.parse({
      framework: FRAMEWORK_NAV,
      modeOperatoire: MODE_OPERATOIRE_NAV,
      annexes: ANNEXES_NAV,
    })
    expect(NAVIGATION_TREE.framework).toEqual(parsed.framework)
    expect(NAVIGATION_TREE.modeOperatoire).toEqual(parsed.modeOperatoire)
    expect(NAVIGATION_TREE.annexes).toEqual(parsed.annexes)
  })
})

// ──────────────────────────────────────────────────
// Tests de complétude (compteurs)
// ──────────────────────────────────────────────────

describe('Complétude des données de navigation', () => {
  it('Framework contient exactement 8 chapitres', () => {
    expect(NAVIGATION_TREE.framework).toHaveLength(NAVIGATION_COUNTS.FRAMEWORK_CHAPTERS)
    expect(NAVIGATION_TREE.framework).toHaveLength(8)
  })

  it('Mode Opératoire contient exactement 8 chapitres', () => {
    expect(NAVIGATION_TREE.modeOperatoire).toHaveLength(NAVIGATION_COUNTS.MODE_OPERATOIRE_CHAPTERS)
    expect(NAVIGATION_TREE.modeOperatoire).toHaveLength(8)
  })

  it('Annexes contient exactement 9 catégories', () => {
    expect(NAVIGATION_TREE.annexes).toHaveLength(NAVIGATION_COUNTS.ANNEXES_CATEGORIES)
    expect(NAVIGATION_TREE.annexes).toHaveLength(9)
  })

  it('les catégories d\'annexes contiennent exactement 46 fiches au total', () => {
    const totalFiches = NAVIGATION_TREE.annexes.reduce(
      (count, cat) => count + (cat.children?.length ?? 0),
      0
    )
    expect(totalFiches).toBe(NAVIGATION_COUNTS.ANNEXES_FICHES)
    expect(totalFiches).toBe(46)
  })

  it('le nombre total d\'items dans l\'arbre est 71', () => {
    const total = countItems([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    expect(total).toBe(NAVIGATION_COUNTS.TOTAL_ITEMS)
    expect(total).toBe(71)
  })

  describe('nombre de fiches par catégorie d\'annexe', () => {
    const expectedFiches: Record<string, number> = {
      'annexes-a-templates': 6,
      'annexes-b-roles': 6,
      'annexes-c-boucles': 5,
      'annexes-d-rituels': 5,
      'annexes-e-metriques': 2,
      'annexes-f-agents': 7,
      'annexes-g-configuration': 6,
      'annexes-h-bonnes-pratiques': 5,
      'annexes-i-ressources': 4,
    }

    for (const [categoryId, expectedCount] of Object.entries(expectedFiches)) {
      it(`catégorie ${categoryId} contient ${expectedCount} fiches`, () => {
        const category = NAVIGATION_TREE.annexes.find(c => c.id === categoryId)
        expect(category).toBeDefined()
        expect(category?.children).toHaveLength(expectedCount)
      })
    }
  })
})

// ──────────────────────────────────────────────────
// Tests d'unicité
// ──────────────────────────────────────────────────

describe('Unicité des données', () => {
  it('tous les IDs sont uniques dans tout l\'arbre (71 IDs distincts)', () => {
    const allIds = collectAllIds([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    expect(allIds).toHaveLength(NAVIGATION_COUNTS.TOTAL_ITEMS)
    expect(new Set(allIds).size).toBe(allIds.length)
  })

  it('tous les hrefs sont uniques dans tout l\'arbre', () => {
    const allHrefs = collectAllHrefs([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    expect(new Set(allHrefs).size).toBe(allHrefs.length)
  })

  it('les orders sont uniques parmi les siblings de chaque section', () => {
    // Framework
    const fwOrders = NAVIGATION_TREE.framework.map(i => i.order)
    expect(new Set(fwOrders).size).toBe(fwOrders.length)

    // Mode Opératoire
    const moOrders = NAVIGATION_TREE.modeOperatoire.map(i => i.order)
    expect(new Set(moOrders).size).toBe(moOrders.length)

    // Annexes (catégories)
    const annexeOrders = NAVIGATION_TREE.annexes.map(i => i.order)
    expect(new Set(annexeOrders).size).toBe(annexeOrders.length)

    // Annexes (fiches par catégorie)
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        const ficheOrders = category.children.map(i => i.order)
        expect(new Set(ficheOrders).size).toBe(ficheOrders.length)
      }
    }
  })
})

// ──────────────────────────────────────────────────
// Tests de convention de nommage
// ──────────────────────────────────────────────────

describe('Convention de nommage des IDs', () => {
  it('les IDs Framework commencent par "fw-"', () => {
    for (const item of NAVIGATION_TREE.framework) {
      expect(item.id).toMatch(/^fw-/)
    }
  })

  it('les IDs Mode Opératoire commencent par "mo-"', () => {
    for (const item of NAVIGATION_TREE.modeOperatoire) {
      expect(item.id).toMatch(/^mo-/)
    }
  })

  it('les IDs catégories d\'annexes commencent par "annexes-"', () => {
    for (const item of NAVIGATION_TREE.annexes) {
      expect(item.id).toMatch(/^annexes-/)
    }
  })

  it('les IDs fiches d\'annexes commencent par "annexe-"', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        for (const fiche of category.children) {
          expect(fiche.id).toMatch(/^annexe-/)
        }
      }
    }
  })

  it('tous les IDs respectent le pattern slug-friendly ^[a-z0-9-]+$', () => {
    const allIds = collectAllIds([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    for (const id of allIds) {
      expect(id).toMatch(/^[a-z0-9-]+$/)
    }
  })
})

// ──────────────────────────────────────────────────
// Tests de convention des hrefs
// ──────────────────────────────────────────────────

describe('Convention des hrefs', () => {
  it('tous les hrefs commencent par "/"', () => {
    const allHrefs = collectAllHrefs([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    for (const href of allHrefs) {
      expect(href).toMatch(/^\//)
    }
  })

  it('les hrefs Framework suivent le pattern /framework/{slug}', () => {
    for (const item of NAVIGATION_TREE.framework) {
      expect(item.href).toMatch(/^\/framework\/[a-z0-9-]+$/)
    }
  })

  it('les hrefs Mode Opératoire suivent le pattern /mode-operatoire/{slug}', () => {
    for (const item of NAVIGATION_TREE.modeOperatoire) {
      expect(item.href).toMatch(/^\/mode-operatoire\/[a-z0-9-]+$/)
    }
  })

  it('les hrefs catégories d\'annexes suivent le pattern /annexes/{category}', () => {
    for (const item of NAVIGATION_TREE.annexes) {
      expect(item.href).toMatch(/^\/annexes\/[a-z0-9-]+$/)
    }
  })

  it('les hrefs fiches d\'annexes suivent le pattern /annexes/{category}/{fiche}', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        for (const fiche of category.children) {
          expect(fiche.href).toMatch(/^\/annexes\/[a-z0-9-]+\/[a-z0-9-]+$/)
        }
      }
    }
  })

  it('les hrefs des fiches commencent par le href de leur catégorie parente', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        for (const fiche of category.children) {
          expect(fiche.href.startsWith(category.href + '/')).toBe(true)
        }
      }
    }
  })

  it('aucun href ne contient de protocole externe (://)', () => {
    const allHrefs = collectAllHrefs([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    for (const href of allHrefs) {
      expect(href).not.toContain('://')
    }
  })
})

// ──────────────────────────────────────────────────
// Tests de la propriété section
// ──────────────────────────────────────────────────

describe('Propriété section', () => {
  it('tous les items Framework ont section: "framework"', () => {
    for (const item of NAVIGATION_TREE.framework) {
      expect(item.section).toBe('framework')
    }
  })

  it('tous les items Mode Opératoire ont section: "mode-operatoire"', () => {
    for (const item of NAVIGATION_TREE.modeOperatoire) {
      expect(item.section).toBe('mode-operatoire')
    }
  })

  it('toutes les catégories d\'annexes ont section: "annexes"', () => {
    for (const item of NAVIGATION_TREE.annexes) {
      expect(item.section).toBe('annexes')
    }
  })

  it('les fiches enfants d\'annexes n\'ont pas de section définie (propagée par les helpers)', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        for (const fiche of category.children) {
          expect(fiche.section).toBeUndefined()
        }
      }
    }
  })
})

// ──────────────────────────────────────────────────
// Tests des badges
// ──────────────────────────────────────────────────

describe('Badges de navigation', () => {
  it('le Préambule du Framework a le badge "essential"', () => {
    const preambule = NAVIGATION_TREE.framework.find(i => i.id === 'fw-preambule')
    expect(preambule?.badge).toBe('essential')
  })

  it('le Préambule du Mode Opératoire a le badge "essential"', () => {
    const preambule = NAVIGATION_TREE.modeOperatoire.find(i => i.id === 'mo-preambule')
    expect(preambule?.badge).toBe('essential')
  })

  it('les badges utilisés sont uniquement "new" ou "essential"', () => {
    const allItems = [
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ]
    for (const item of allItems) {
      if (item.badge) {
        expect(['new', 'essential']).toContain(item.badge)
      }
    }
  })
})

// ──────────────────────────────────────────────────
// Tests de la structure hiérarchique
// ──────────────────────────────────────────────────

describe('Structure hiérarchique', () => {
  it('les chapitres Framework n\'ont pas de children', () => {
    for (const item of NAVIGATION_TREE.framework) {
      expect(item.children).toBeUndefined()
    }
  })

  it('les chapitres Mode Opératoire n\'ont pas de children', () => {
    for (const item of NAVIGATION_TREE.modeOperatoire) {
      expect(item.children).toBeUndefined()
    }
  })

  it('toutes les catégories d\'annexes ont des children (fiches)', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      expect(category.children).toBeDefined()
      expect(category.children!.length).toBeGreaterThan(0)
    }
  })

  it('les fiches d\'annexes n\'ont pas de children (profondeur max = 2)', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        for (const fiche of category.children) {
          expect(fiche.children).toBeUndefined()
        }
      }
    }
  })

  it('la profondeur maximale de l\'arbre est 2 (bien sous la limite de 4)', () => {
    function getMaxDepth(items: NavigationItem[], depth: number = 1): number {
      let max = depth
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          const childDepth = getMaxDepth(item.children, depth + 1)
          if (childDepth > max) max = childDepth
        }
      }
      return max
    }
    const maxDepth = getMaxDepth([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    expect(maxDepth).toBe(2)
    expect(maxDepth).toBeLessThanOrEqual(4)
  })
})

// ──────────────────────────────────────────────────
// Tests d'immutabilité
// ──────────────────────────────────────────────────

describe('Immutabilité de NAVIGATION_TREE', () => {
  it('NAVIGATION_TREE est gelé (Object.isFrozen)', () => {
    expect(Object.isFrozen(NAVIGATION_TREE)).toBe(true)
  })

  it('une tentative de mutation directe lève une erreur en mode strict', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (NAVIGATION_TREE as any).framework = []
    }).toThrow()
  })

  it('une tentative d\'ajout de propriété lève une erreur', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (NAVIGATION_TREE as any).newSection = []
    }).toThrow()
  })
})

// ──────────────────────────────────────────────────
// Tests de l'ordre de tri
// ──────────────────────────────────────────────────

describe('Ordre de tri des items', () => {
  it('les chapitres Framework sont ordonnés de 1 à 8', () => {
    const orders = NAVIGATION_TREE.framework.map(i => i.order)
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('les chapitres Mode Opératoire sont ordonnés de 0 à 7', () => {
    const orders = NAVIGATION_TREE.modeOperatoire.map(i => i.order)
    expect(orders).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
  })

  it('les catégories d\'annexes sont ordonnées de 1 à 9', () => {
    const orders = NAVIGATION_TREE.annexes.map(i => i.order)
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('les fiches de chaque catégorie sont ordonnées séquentiellement à partir de 1', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children && category.children.length > 0) {
        const orders = category.children.map(i => i.order)
        const expected = Array.from({ length: orders.length }, (_, i) => i + 1)
        expect(orders).toEqual(expected)
      }
    }
  })
})

// ──────────────────────────────────────────────────
// Tests de correspondance avec le contenu source
// ──────────────────────────────────────────────────

describe('Correspondance avec le contenu source (US-004 §3)', () => {
  it('les labels Framework correspondent aux titres des chapitres', () => {
    const expectedLabels = [
      'Préambule',
      'Vision & Philosophie',
      'Écosystème',
      'Artefacts',
      'Boucles Itératives',
      'Synchronisations',
      'Métriques',
      'Annexes',
    ]
    const actualLabels = NAVIGATION_TREE.framework.map(i => i.label)
    expect(actualLabels).toEqual(expectedLabels)
  })

  it('les labels Mode Opératoire correspondent aux titres des chapitres', () => {
    const expectedLabels = [
      'Préambule',
      'Initialisation',
      'Planification',
      'Développement',
      'Validation',
      'Déploiement',
      'Rituels & Amélioration',
      'Annexes',
    ]
    const actualLabels = NAVIGATION_TREE.modeOperatoire.map(i => i.label)
    expect(actualLabels).toEqual(expectedLabels)
  })

  it('les labels catégories d\'annexes correspondent (A à I)', () => {
    const expectedLabels = [
      'A - Templates',
      'B - Rôles',
      'C - Boucles',
      'D - Rituels',
      'E - Métriques',
      'F - Agents',
      'G - Configuration',
      'H - Bonnes Pratiques',
      'I - Ressources',
    ]
    const actualLabels = NAVIGATION_TREE.annexes.map(i => i.label)
    expect(actualLabels).toEqual(expectedLabels)
  })
})

// ──────────────────────────────────────────────────
// Tests des constantes NAVIGATION_COUNTS
// ──────────────────────────────────────────────────

describe('Constantes NAVIGATION_COUNTS', () => {
  it('FRAMEWORK_CHAPTERS vaut 8', () => {
    expect(NAVIGATION_COUNTS.FRAMEWORK_CHAPTERS).toBe(8)
  })

  it('MODE_OPERATOIRE_CHAPTERS vaut 8', () => {
    expect(NAVIGATION_COUNTS.MODE_OPERATOIRE_CHAPTERS).toBe(8)
  })

  it('ANNEXES_CATEGORIES vaut 9', () => {
    expect(NAVIGATION_COUNTS.ANNEXES_CATEGORIES).toBe(9)
  })

  it('ANNEXES_FICHES vaut 46', () => {
    expect(NAVIGATION_COUNTS.ANNEXES_FICHES).toBe(46)
  })

  it('TOTAL_ITEMS vaut 71 (8 + 8 + 9 + 46)', () => {
    expect(NAVIGATION_COUNTS.TOTAL_ITEMS).toBe(71)
    expect(NAVIGATION_COUNTS.TOTAL_ITEMS).toBe(
      NAVIGATION_COUNTS.FRAMEWORK_CHAPTERS +
      NAVIGATION_COUNTS.MODE_OPERATOIRE_CHAPTERS +
      NAVIGATION_COUNTS.ANNEXES_CATEGORIES +
      NAVIGATION_COUNTS.ANNEXES_FICHES
    )
  })

  it('les compteurs sont cohérents avec les données réelles', () => {
    expect(NAVIGATION_TREE.framework).toHaveLength(NAVIGATION_COUNTS.FRAMEWORK_CHAPTERS)
    expect(NAVIGATION_TREE.modeOperatoire).toHaveLength(NAVIGATION_COUNTS.MODE_OPERATOIRE_CHAPTERS)
    expect(NAVIGATION_TREE.annexes).toHaveLength(NAVIGATION_COUNTS.ANNEXES_CATEGORIES)
  })
})
