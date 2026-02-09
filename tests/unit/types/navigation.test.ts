// tests/unit/types/navigation.test.ts

import { describe, it, expect, expectTypeOf } from 'vitest'
import {
  NAVIGATION_SECTIONS,
  NAVIGATION_BADGES,
  MAX_NAVIGATION_DEPTH,
  TOC_HEADING_DEPTHS,
} from '@/types/navigation'
import type {
  NavigationItem,
  NavigationItemInput,
  NavigationItemUpdate,
  NavigationTree,
  NavigationSection,
  NavigationBadge,
  BreadcrumbItem,
  BreadcrumbList,
  TableOfContentsItem,
  TableOfContentsList,
  TOCHeadingDepth,
  PrevNextItem,
  PrevNextLinks,
  FlatNavigationItem,
  FlatNavigationList,
} from '@/types/navigation'

// ──────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────

const validNavigationItem: NavigationItem = {
  id: 'fw-preambule',
  label: 'Préambule',
  href: '/framework/preambule',
  section: 'framework',
  order: 1,
}

const validNavigationItemWithChildren: NavigationItem = {
  id: 'annexes-a-templates',
  label: 'A - Templates',
  href: '/annexes/templates',
  section: 'annexes',
  order: 1,
  badge: 'new',
  children: [
    { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
    { id: 'a2-arch', label: 'A2 - Architecture', href: '/annexes/templates/architecture', order: 2 },
  ],
}

const validBreadcrumb: BreadcrumbItem = {
  label: 'Framework',
  href: '/framework',
}

const validTocItem: TableOfContentsItem = {
  depth: 2,
  text: 'Contexte du projet',
  slug: 'contexte-du-projet',
}

const validPrevNextItem: PrevNextItem = {
  label: 'Vision & Philosophie',
  href: '/framework/vision-philosophie',
  section: 'framework',
}

// ──────────────────────────────────────────────────
// Tests des constantes
// ──────────────────────────────────────────────────

describe('Constantes de navigation', () => {
  describe('NAVIGATION_SECTIONS', () => {
    it('contient exactement 3 sections', () => {
      expect(NAVIGATION_SECTIONS).toHaveLength(3)
    })

    it('contient framework, mode-operatoire et annexes', () => {
      expect(NAVIGATION_SECTIONS).toContain('framework')
      expect(NAVIGATION_SECTIONS).toContain('mode-operatoire')
      expect(NAVIGATION_SECTIONS).toContain('annexes')
    })

    it('est un tuple readonly (as const)', () => {
      // Vérifie que le tableau ne peut pas être modifié
      expect(Object.isFrozen(NAVIGATION_SECTIONS)).toBe(true)
    })
  })

  describe('NAVIGATION_BADGES', () => {
    it('contient exactement 2 badges', () => {
      expect(NAVIGATION_BADGES).toHaveLength(2)
    })

    it('contient new et essential', () => {
      expect(NAVIGATION_BADGES).toContain('new')
      expect(NAVIGATION_BADGES).toContain('essential')
    })
  })

  describe('MAX_NAVIGATION_DEPTH', () => {
    it('vaut 4', () => {
      expect(MAX_NAVIGATION_DEPTH).toBe(4)
    })
  })

  describe('TOC_HEADING_DEPTHS', () => {
    it('contient exactement 3 niveaux', () => {
      expect(TOC_HEADING_DEPTHS).toHaveLength(3)
    })

    it('contient les niveaux 2, 3 et 4', () => {
      expect(TOC_HEADING_DEPTHS).toContain(2)
      expect(TOC_HEADING_DEPTHS).toContain(3)
      expect(TOC_HEADING_DEPTHS).toContain(4)
    })

    it('ne contient pas le niveau 1 (h1)', () => {
      expect(TOC_HEADING_DEPTHS).not.toContain(1)
    })
  })
})

// ──────────────────────────────────────────────────
// Tests de typage (compile-time)
// ──────────────────────────────────────────────────

describe('Types de navigation (compile-time)', () => {
  describe('NavigationSection', () => {
    it('accepte les valeurs valides', () => {
      expectTypeOf<'framework'>().toMatchTypeOf<NavigationSection>()
      expectTypeOf<'mode-operatoire'>().toMatchTypeOf<NavigationSection>()
      expectTypeOf<'annexes'>().toMatchTypeOf<NavigationSection>()
    })
  })

  describe('NavigationBadge', () => {
    it('accepte les valeurs valides', () => {
      expectTypeOf<'new'>().toMatchTypeOf<NavigationBadge>()
      expectTypeOf<'essential'>().toMatchTypeOf<NavigationBadge>()
    })
  })

  describe('TOCHeadingDepth', () => {
    it('accepte 2, 3 et 4', () => {
      expectTypeOf<2>().toMatchTypeOf<TOCHeadingDepth>()
      expectTypeOf<3>().toMatchTypeOf<TOCHeadingDepth>()
      expectTypeOf<4>().toMatchTypeOf<TOCHeadingDepth>()
    })
  })

  describe('NavigationItem', () => {
    it('a les champs obligatoires id, label, href et order', () => {
      expectTypeOf<NavigationItem>().toHaveProperty('id')
      expectTypeOf<NavigationItem>().toHaveProperty('label')
      expectTypeOf<NavigationItem>().toHaveProperty('href')
      expectTypeOf<NavigationItem>().toHaveProperty('order')
    })

    it('a les champs optionnels section, children, badge et isHidden', () => {
      expectTypeOf(validNavigationItem.section).toEqualTypeOf<NavigationSection | undefined>()
      expectTypeOf(validNavigationItem.children).toEqualTypeOf<NavigationItem[] | undefined>()
      expectTypeOf(validNavigationItem.badge).toEqualTypeOf<NavigationBadge | undefined>()
      expectTypeOf(validNavigationItem.isHidden).toEqualTypeOf<boolean | undefined>()
    })

    it('est récursif via children', () => {
      const nested: NavigationItem = {
        ...validNavigationItem,
        children: [
          {
            ...validNavigationItem,
            id: 'child',
            children: [{ ...validNavigationItem, id: 'grandchild' }],
          },
        ],
      }
      expect(nested.children?.[0]?.children?.[0]?.id).toBe('grandchild')
    })
  })

  describe('NavigationTree', () => {
    it('a les 3 sections obligatoires', () => {
      expectTypeOf<NavigationTree>().toHaveProperty('framework')
      expectTypeOf<NavigationTree>().toHaveProperty('modeOperatoire')
      expectTypeOf<NavigationTree>().toHaveProperty('annexes')
    })

    it('chaque section contient un tableau de NavigationItem', () => {
      const tree: NavigationTree = {
        framework: [validNavigationItem],
        modeOperatoire: [{ ...validNavigationItem, id: 'mo-1' }],
        annexes: [validNavigationItemWithChildren],
      }
      expectTypeOf(tree.framework).toEqualTypeOf<NavigationItem[]>()
      expectTypeOf(tree.modeOperatoire).toEqualTypeOf<NavigationItem[]>()
      expectTypeOf(tree.annexes).toEqualTypeOf<NavigationItem[]>()
    })
  })

  describe('BreadcrumbItem', () => {
    it('a les champs obligatoires label et href', () => {
      expectTypeOf<BreadcrumbItem>().toHaveProperty('label')
      expectTypeOf<BreadcrumbItem>().toHaveProperty('href')
    })

    it('a le champ optionnel isCurrent', () => {
      expectTypeOf(validBreadcrumb.isCurrent).toEqualTypeOf<boolean | undefined>()
    })
  })

  describe('TableOfContentsItem', () => {
    it('a les champs obligatoires depth, text et slug', () => {
      expectTypeOf<TableOfContentsItem>().toHaveProperty('depth')
      expectTypeOf<TableOfContentsItem>().toHaveProperty('text')
      expectTypeOf<TableOfContentsItem>().toHaveProperty('slug')
    })

    it('depth est de type TOCHeadingDepth', () => {
      expectTypeOf(validTocItem.depth).toEqualTypeOf<TOCHeadingDepth>()
    })
  })

  describe('PrevNextItem', () => {
    it('a les champs obligatoires label et href', () => {
      expectTypeOf<PrevNextItem>().toHaveProperty('label')
      expectTypeOf<PrevNextItem>().toHaveProperty('href')
    })

    it('a le champ optionnel section', () => {
      expectTypeOf(validPrevNextItem.section).toEqualTypeOf<NavigationSection | undefined>()
    })
  })

  describe('PrevNextLinks', () => {
    it('a les champs prev et next qui peuvent être null', () => {
      const links: PrevNextLinks = { prev: null, next: null }
      expectTypeOf(links.prev).toEqualTypeOf<PrevNextItem | null>()
      expectTypeOf(links.next).toEqualTypeOf<PrevNextItem | null>()
    })
  })

  describe('FlatNavigationItem', () => {
    it('a les champs obligatoires id, label, href et depth', () => {
      expectTypeOf<FlatNavigationItem>().toHaveProperty('id')
      expectTypeOf<FlatNavigationItem>().toHaveProperty('label')
      expectTypeOf<FlatNavigationItem>().toHaveProperty('href')
      expectTypeOf<FlatNavigationItem>().toHaveProperty('depth')
    })

    it('a le champ optionnel section', () => {
      const flat: FlatNavigationItem = {
        id: 'test',
        label: 'Test',
        href: '/test',
        depth: 0,
      }
      expectTypeOf(flat.section).toEqualTypeOf<NavigationSection | undefined>()
    })
  })
})

// ──────────────────────────────────────────────────
// Tests des types utilitaires
// ──────────────────────────────────────────────────

describe('Types utilitaires', () => {
  describe('NavigationItemInput', () => {
    it('requiert id, label, href et order', () => {
      const input: NavigationItemInput = {
        id: 'test',
        label: 'Test',
        href: '/test',
        order: 1,
      }
      expect(input).toBeDefined()
    })

    it('accepte section, children, badge et isHidden en optionnel', () => {
      const input: NavigationItemInput = {
        id: 'test',
        label: 'Test',
        href: '/test',
        order: 1,
        section: 'framework',
        badge: 'new',
        isHidden: false,
        children: [
          { id: 'child', label: 'Child', href: '/child', order: 1 },
        ],
      }
      expect(input.section).toBe('framework')
    })
  })

  describe('NavigationItemUpdate', () => {
    it('rend tous les champs sauf id optionnels', () => {
      const update: NavigationItemUpdate = { label: 'Nouveau label' }
      expect(update.label).toBe('Nouveau label')
    })

    it('ne contient pas le champ id', () => {
      const update: NavigationItemUpdate = {}
      expectTypeOf(update).not.toHaveProperty('id')
    })
  })

  describe('BreadcrumbList', () => {
    it('est un alias pour BreadcrumbItem[]', () => {
      const list: BreadcrumbList = [
        { label: 'Accueil', href: '/' },
        { label: 'Framework', href: '/framework', isCurrent: true },
      ]
      expectTypeOf(list).toEqualTypeOf<BreadcrumbItem[]>()
    })
  })

  describe('TableOfContentsList', () => {
    it('est un alias pour TableOfContentsItem[]', () => {
      const list: TableOfContentsList = [validTocItem]
      expectTypeOf(list).toEqualTypeOf<TableOfContentsItem[]>()
    })
  })

  describe('FlatNavigationList', () => {
    it('est un alias pour FlatNavigationItem[]', () => {
      const list: FlatNavigationList = [
        { id: 'test', label: 'Test', href: '/test', depth: 0 },
      ]
      expectTypeOf(list).toEqualTypeOf<FlatNavigationItem[]>()
    })
  })
})

// ──────────────────────────────────────────────────
// Tests des cas limites (structure)
// ──────────────────────────────────────────────────

describe('Cas limites (structure)', () => {
  it('T-01: NavigationItem sans children est valide', () => {
    const leaf: NavigationItem = {
      id: 'leaf',
      label: 'Page',
      href: '/page',
      order: 1,
    }
    expect(leaf.children).toBeUndefined()
  })

  it('T-02: NavigationItem avec children vide est valide', () => {
    const emptyChildren: NavigationItem = {
      id: 'empty',
      label: 'Section',
      href: '/section',
      order: 1,
      children: [],
    }
    expect(emptyChildren.children).toEqual([])
  })

  it('T-12: label avec caractères spéciaux (accents, &)', () => {
    const special: NavigationItem = {
      id: 'special',
      label: 'Écosystème & Architecture — Vue d\'ensemble',
      href: '/ecosysteme',
      order: 1,
    }
    expect(special.label).toContain('É')
    expect(special.label).toContain('&')
    expect(special.label).toContain('—')
  })

  it('T-13: BreadcrumbItem sans isCurrent', () => {
    const crumb: BreadcrumbItem = {
      label: 'Framework',
      href: '/framework',
    }
    expect(crumb.isCurrent).toBeUndefined()
  })

  it('T-14: Breadcrumb avec un seul élément', () => {
    const homeBreadcrumb: BreadcrumbList = [
      { label: 'Accueil', href: '/', isCurrent: true },
    ]
    expect(homeBreadcrumb).toHaveLength(1)
    expect(homeBreadcrumb[0].isCurrent).toBe(true)
  })

  it('T-17: TOC vide (page sans headings)', () => {
    const emptyToc: TableOfContentsList = []
    expect(emptyToc).toHaveLength(0)
  })

  it('T-18: TOC avec h2 puis h4 directement (sans h3)', () => {
    const gappedToc: TableOfContentsList = [
      { depth: 2, text: 'Section', slug: 'section' },
      { depth: 4, text: 'Détail', slug: 'detail' },
    ]
    expect(gappedToc[0].depth).toBe(2)
    expect(gappedToc[1].depth).toBe(4)
  })

  it('T-19: PrevNextLinks avec les deux liens null', () => {
    const isolated: PrevNextLinks = { prev: null, next: null }
    expect(isolated.prev).toBeNull()
    expect(isolated.next).toBeNull()
  })

  it('T-20: Navigation cross-section', () => {
    const crossSection: PrevNextLinks = {
      prev: { label: 'Annexes', href: '/framework/annexes', section: 'framework' },
      next: { label: 'Préambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' },
    }
    expect(crossSection.prev?.section).toBe('framework')
    expect(crossSection.next?.section).toBe('mode-operatoire')
    expect(crossSection.prev?.section).not.toBe(crossSection.next?.section)
  })

  it('T-21: FlatNavigationItem depth = 0 (racine section)', () => {
    const rootItem: FlatNavigationItem = {
      id: 'fw-preambule',
      label: 'Préambule',
      href: '/framework/preambule',
      section: 'framework',
      depth: 0,
    }
    expect(rootItem.depth).toBe(0)
  })

  it('T-22: NavigationItem masqué avec children', () => {
    const hiddenParent: NavigationItem = {
      id: 'hidden-parent',
      label: 'Section masquée',
      href: '/hidden',
      order: 99,
      isHidden: true,
      children: [
        { id: 'hidden-child', label: 'Enfant', href: '/hidden/child', order: 1 },
      ],
    }
    expect(hiddenParent.isHidden).toBe(true)
    expect(hiddenParent.children).toHaveLength(1)
  })

  it('T-23: NavigationTree avec section vide', () => {
    const partialTree: NavigationTree = {
      framework: [],
      modeOperatoire: [{ id: 'mo-1', label: 'Test', href: '/mo/test', order: 1 }],
      annexes: [],
    }
    expect(partialTree.framework).toHaveLength(0)
    expect(partialTree.modeOperatoire).toHaveLength(1)
  })

  it('NavigationItem 3 niveaux de profondeur (structure valide)', () => {
    const deepItem: NavigationItem = {
      id: 'level-0',
      label: 'Niveau 0',
      href: '/level-0',
      order: 1,
      children: [
        {
          id: 'level-1',
          label: 'Niveau 1',
          href: '/level-0/level-1',
          order: 1,
          children: [
            {
              id: 'level-2',
              label: 'Niveau 2',
              href: '/level-0/level-1/level-2',
              order: 1,
            },
          ],
        },
      ],
    }
    expect(deepItem.children?.[0]?.children?.[0]?.id).toBe('level-2')
  })
})
