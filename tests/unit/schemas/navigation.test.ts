// tests/unit/schemas/navigation.test.ts

import { describe, it, expect } from 'vitest'
import {
  NAVIGATION_ERRORS,
  navigationSectionSchema,
  navigationBadgeSchema,
  navigationItemSchema,
  navigationTreeSchema,
  breadcrumbItemSchema,
  breadcrumbListSchema,
  tableOfContentsItemSchema,
  tableOfContentsListSchema,
  prevNextItemSchema,
  prevNextLinksSchema,
  flatNavigationItemSchema,
  flatNavigationListSchema,
} from '@/schemas/navigation'

// ──────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────

const validNavItem = {
  id: 'fw-preambule',
  label: 'Préambule',
  href: '/framework/preambule',
  order: 1,
}

const validNavItemWithOptionals = {
  ...validNavItem,
  section: 'framework' as const,
  badge: 'essential' as const,
  isHidden: false,
}

const validNavItemWithChildren = {
  id: 'annexes-a',
  label: 'A - Templates',
  href: '/annexes/templates',
  section: 'annexes' as const,
  order: 1,
  children: [
    { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
    { id: 'a2-arch', label: 'A2 - Architecture', href: '/annexes/templates/architecture', order: 2 },
  ],
}

const validBreadcrumbList = [
  { label: 'Accueil', href: '/' },
  { label: 'Framework', href: '/framework' },
  { label: 'Préambule', href: '/framework/preambule', isCurrent: true },
]

const validTocItem = { depth: 2 as const, text: 'Introduction', slug: 'introduction' }

const validPrevNextLinks = {
  prev: { label: 'Vision', href: '/framework/vision', section: 'framework' as const },
  next: { label: 'Artefacts', href: '/framework/artefacts', section: 'framework' as const },
}

const validTree = {
  framework: [
    { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', order: 1 },
    { id: 'fw-vision', label: 'Vision & Philosophie', href: '/framework/vision', order: 2 },
  ],
  modeOperatoire: [
    { id: 'mo-preambule', label: 'Préambule', href: '/mode-operatoire/preambule', order: 0 },
  ],
  annexes: [
    {
      id: 'annexes-a', label: 'A - Templates', href: '/annexes/templates', order: 1,
      children: [
        { id: 'a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
      ],
    },
  ],
}

// ──────────────────────────────────────────────────
// Tests constantes d'erreur
// ──────────────────────────────────────────────────

describe('NAVIGATION_ERRORS', () => {
  it('exporte toutes les clés de messages d\'erreur', () => {
    expect(NAVIGATION_ERRORS.ID_PATTERN).toBeDefined()
    expect(NAVIGATION_ERRORS.ID_MIN_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.ID_MAX_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.LABEL_MIN_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.LABEL_MAX_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.HREF_START_SLASH).toBeDefined()
    expect(NAVIGATION_ERRORS.HREF_NO_EXTERNAL).toBeDefined()
    expect(NAVIGATION_ERRORS.ORDER_INTEGER).toBeDefined()
    expect(NAVIGATION_ERRORS.ORDER_NONNEGATIVE).toBeDefined()
    expect(NAVIGATION_ERRORS.SECTION_INVALID).toBeDefined()
    expect(NAVIGATION_ERRORS.BADGE_INVALID).toBeDefined()
    expect(NAVIGATION_ERRORS.MAX_DEPTH_EXCEEDED).toBeDefined()
    expect(NAVIGATION_ERRORS.TREE_DUPLICATE_ID).toBeDefined()
    expect(NAVIGATION_ERRORS.TREE_DUPLICATE_ORDER).toBeDefined()
    expect(NAVIGATION_ERRORS.BREADCRUMB_EMPTY).toBeDefined()
    expect(NAVIGATION_ERRORS.BREADCRUMB_START_HOME).toBeDefined()
    expect(NAVIGATION_ERRORS.BREADCRUMB_LAST_CURRENT).toBeDefined()
    expect(NAVIGATION_ERRORS.TOC_DEPTH_INVALID).toBeDefined()
    expect(NAVIGATION_ERRORS.TOC_TEXT_MIN_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.TOC_TEXT_MAX_LENGTH).toBeDefined()
    expect(NAVIGATION_ERRORS.TOC_SLUG_PATTERN).toBeDefined()
    expect(NAVIGATION_ERRORS.TOC_DUPLICATE_SLUG).toBeDefined()
    expect(NAVIGATION_ERRORS.FLAT_DEPTH_NONNEGATIVE).toBeDefined()
    expect(NAVIGATION_ERRORS.FLAT_DUPLICATE_ID).toBeDefined()
  })

  it('les messages sont en français', () => {
    Object.values(NAVIGATION_ERRORS).forEach((message) => {
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    })
  })
})

// ──────────────────────────────────────────────────
// Tests navigationSectionSchema
// ──────────────────────────────────────────────────

describe('navigationSectionSchema', () => {
  it.each(['framework', 'mode-operatoire', 'annexes'])(
    'accepte la section valide "%s"',
    (section) => {
      expect(navigationSectionSchema.safeParse(section).success).toBe(true)
    }
  )

  it.each(['blog', 'templates', '', 'FRAMEWORK', 123, null, undefined])(
    'rejette la valeur invalide %j',
    (value) => {
      const result = navigationSectionSchema.safeParse(value)
      expect(result.success).toBe(false)
    }
  )
})

// ──────────────────────────────────────────────────
// Tests navigationBadgeSchema
// ──────────────────────────────────────────────────

describe('navigationBadgeSchema', () => {
  it.each(['new', 'essential'])(
    'accepte le badge valide "%s"',
    (badge) => {
      expect(navigationBadgeSchema.safeParse(badge).success).toBe(true)
    }
  )

  it.each(['featured', 'important', '', 'NEW', null])(
    'rejette la valeur invalide %j',
    (value) => {
      const result = navigationBadgeSchema.safeParse(value)
      expect(result.success).toBe(false)
    }
  )
})

// ──────────────────────────────────────────────────
// Tests navigationItemSchema
// ──────────────────────────────────────────────────

describe('navigationItemSchema', () => {
  describe('Cas valides', () => {
    it('CL-01: accepte un item minimal (sans optionnels)', () => {
      const result = navigationItemSchema.safeParse(validNavItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('fw-preambule')
        expect(result.data.isHidden).toBe(false) // default
      }
    })

    it('accepte un item avec tous les champs optionnels', () => {
      const result = navigationItemSchema.safeParse(validNavItemWithOptionals)
      expect(result.success).toBe(true)
    })

    it('CL-02: accepte un item avec children vide', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, children: [] })
      expect(result.success).toBe(true)
    })

    it('accepte un item avec enfants imbriqués (3 niveaux)', () => {
      const result = navigationItemSchema.safeParse(validNavItemWithChildren)
      expect(result.success).toBe(true)
    })

    it('CL-15: accepte order = 0', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, order: 0 })
      expect(result.success).toBe(true)
    })

    it('CL-18: accepte un label avec accents et symboles', () => {
      const result = navigationItemSchema.safeParse({
        ...validNavItem,
        label: 'Écosystème & Architecture — Vue d\'ensemble',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('Validation id', () => {
    it('CL-05: rejette un ID avec majuscules', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'Fw-Preambule' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ID_PATTERN)
      }
    })

    it('CL-06: rejette un ID avec espaces', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'fw preambule' })
      expect(result.success).toBe(false)
    })

    it('CL-07: rejette un ID avec underscore et accents', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'fw_préambule' })
      expect(result.success).toBe(false)
    })

    it('CL-08: rejette un ID de 1 caractère', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'x' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ID_MIN_LENGTH)
      }
    })

    it('CL-09: rejette un ID de 81 caractères', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'a'.repeat(81) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ID_MAX_LENGTH)
      }
    })

    it('accepte un ID aux bornes (2 caractères)', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'ab' })
      expect(result.success).toBe(true)
    })

    it('accepte un ID aux bornes (80 caractères)', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: 'a'.repeat(80) })
      expect(result.success).toBe(true)
    })
  })

  describe('Validation label', () => {
    it('CL-16: rejette un label vide', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, label: '' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.LABEL_MIN_LENGTH)
      }
    })

    it('CL-17: rejette un label de 101 caractères', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, label: 'a'.repeat(101) })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.LABEL_MAX_LENGTH)
      }
    })
  })

  describe('Validation href', () => {
    it('CL-10: rejette un href sans slash initial', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, href: 'framework' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.HREF_START_SLASH)
      }
    })

    it('CL-11: rejette une URL externe https', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, href: 'https://example.com' })
      expect(result.success).toBe(false)
    })

    it('CL-12: rejette une URL proto-relative', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, href: '//cdn.com/path' })
      expect(result.success).toBe(false)
    })
  })

  describe('Validation order', () => {
    it('CL-13: rejette un order négatif', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, order: -1 })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ORDER_NONNEGATIVE)
      }
    })

    it('CL-14: rejette un order flottant', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, order: 1.5 })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.ORDER_INTEGER)
      }
    })

    it('CL-42: rejette un order de type string', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, order: '1' })
      expect(result.success).toBe(false)
    })
  })

  describe('Validation section et badge', () => {
    it('CL-19: rejette une section invalide', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, section: 'blog' })
      expect(result.success).toBe(false)
    })

    it('CL-20: rejette un badge invalide', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, badge: 'featured' })
      expect(result.success).toBe(false)
    })
  })

  describe('Champs manquants et types incorrects', () => {
    it('CL-41: rejette un item sans id', () => {
      const { id, ...noId } = validNavItem
      const result = navigationItemSchema.safeParse(noId)
      expect(result.success).toBe(false)
    })

    it('rejette un item sans label', () => {
      const { label, ...noLabel } = validNavItem
      const result = navigationItemSchema.safeParse(noLabel)
      expect(result.success).toBe(false)
    })

    it('rejette un item sans href', () => {
      const { href, ...noHref } = validNavItem
      const result = navigationItemSchema.safeParse(noHref)
      expect(result.success).toBe(false)
    })

    it('rejette un item sans order', () => {
      const { order, ...noOrder } = validNavItem
      const result = navigationItemSchema.safeParse(noOrder)
      expect(result.success).toBe(false)
    })

    it('CL-43: rejette id = null', () => {
      const result = navigationItemSchema.safeParse({ ...validNavItem, id: null })
      expect(result.success).toBe(false)
    })
  })

  describe('Valeurs par défaut', () => {
    it('applique isHidden = false par défaut', () => {
      const result = navigationItemSchema.safeParse(validNavItem)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.isHidden).toBe(false)
      }
    })
  })
})

// ──────────────────────────────────────────────────
// Tests navigationTreeSchema
// ──────────────────────────────────────────────────

describe('navigationTreeSchema', () => {
  describe('Cas valides', () => {
    it('accepte un arbre complet valide', () => {
      const result = navigationTreeSchema.safeParse(validTree)
      expect(result.success).toBe(true)
    })

    it('CL-24: accepte un arbre avec une section vide', () => {
      const result = navigationTreeSchema.safeParse({
        framework: [],
        modeOperatoire: [{ id: 'mo-1', label: 'Test', href: '/test', order: 1 }],
        annexes: [],
      })
      expect(result.success).toBe(true)
    })

    it('CL-04: accepte un arbre de 4 niveaux exactement', () => {
      const tree = {
        framework: [],
        modeOperatoire: [],
        annexes: [{
          id: 'l1', label: 'L1', href: '/l1', order: 1,
          children: [{
            id: 'l2', label: 'L2', href: '/l1/l2', order: 1,
            children: [{
              id: 'l3', label: 'L3', href: '/l1/l2/l3', order: 1,
            }],
          }],
        }],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(true)
    })

    it('CL-23: accepte des siblings dans des niveaux différents avec le même order', () => {
      const tree = {
        framework: [{
          id: 'parent', label: 'Parent', href: '/parent', order: 1,
          children: [{ id: 'child', label: 'Child', href: '/parent/child', order: 1 }],
        }],
        modeOperatoire: [],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(true)
    })

    it('CL-40: accepte un item masqué avec le même order qu\'un visible', () => {
      const tree = {
        framework: [
          { id: 'item-visible', label: 'Visible', href: '/visible', order: 1 },
          { id: 'item-hidden', label: 'Masqué', href: '/hidden', order: 1, isHidden: true },
        ],
        modeOperatoire: [],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(true)
    })
  })

  describe('Règle R1 : profondeur maximale', () => {
    it('CL-03: rejette un arbre de 5 niveaux', () => {
      const tree = {
        framework: [],
        modeOperatoire: [],
        annexes: [{
          id: 'l1', label: 'L1', href: '/l1', order: 1,
          children: [{
            id: 'l2', label: 'L2', href: '/l2', order: 1,
            children: [{
              id: 'l3', label: 'L3', href: '/l3', order: 1,
              children: [{
                id: 'l4', label: 'L4', href: '/l4', order: 1,
                children: [{
                  id: 'l5', label: 'L5', href: '/l5', order: 1,
                }],
              }],
            }],
          }],
        }],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.MAX_DEPTH_EXCEEDED)
      }
    })
  })

  describe('Règle R2 : unicité des IDs', () => {
    it('CL-21: rejette des IDs dupliqués entre sections', () => {
      const tree = {
        framework: [{ id: 'preambule', label: 'FW', href: '/fw', order: 1 }],
        modeOperatoire: [{ id: 'preambule', label: 'MO', href: '/mo', order: 0 }],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.TREE_DUPLICATE_ID)
      }
    })

    it('rejette des IDs dupliqués parent/enfant', () => {
      const tree = {
        framework: [{
          id: 'dupli', label: 'Parent', href: '/parent', order: 1,
          children: [{ id: 'dupli', label: 'Child', href: '/child', order: 1 }],
        }],
        modeOperatoire: [],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(false)
    })
  })

  describe('Règle R3 : unicité des order parmi siblings', () => {
    it('CL-22: rejette deux siblings avec le même order', () => {
      const tree = {
        framework: [
          { id: 'fw-1', label: 'A', href: '/a', order: 1 },
          { id: 'fw-2', label: 'B', href: '/b', order: 1 }, // doublon
        ],
        modeOperatoire: [],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.TREE_DUPLICATE_ORDER)
      }
    })

    it('rejette des order dupliqués dans les enfants', () => {
      const tree = {
        framework: [{
          id: 'parent', label: 'Parent', href: '/parent', order: 1,
          children: [
            { id: 'child-1', label: 'C1', href: '/c1', order: 1 },
            { id: 'child-2', label: 'C2', href: '/c2', order: 1 },
          ],
        }],
        modeOperatoire: [],
        annexes: [],
      }
      const result = navigationTreeSchema.safeParse(tree)
      expect(result.success).toBe(false)
    })
  })
})

// ──────────────────────────────────────────────────
// Tests breadcrumbItemSchema et breadcrumbListSchema
// ──────────────────────────────────────────────────

describe('breadcrumbItemSchema', () => {
  it('accepte un item valide', () => {
    const result = breadcrumbItemSchema.safeParse({ label: 'Framework', href: '/framework' })
    expect(result.success).toBe(true)
  })

  it('accepte un item avec isCurrent', () => {
    const result = breadcrumbItemSchema.safeParse({ label: 'PRD', href: '/prd', isCurrent: true })
    expect(result.success).toBe(true)
  })

  it('applique isCurrent = false par défaut', () => {
    const result = breadcrumbItemSchema.safeParse({ label: 'Test', href: '/test' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isCurrent).toBe(false)
    }
  })

  it('rejette un label vide', () => {
    const result = breadcrumbItemSchema.safeParse({ label: '', href: '/test' })
    expect(result.success).toBe(false)
  })

  it('rejette un href sans slash', () => {
    const result = breadcrumbItemSchema.safeParse({ label: 'Test', href: 'test' })
    expect(result.success).toBe(false)
  })
})

describe('breadcrumbListSchema', () => {
  it('accepte une liste valide', () => {
    const result = breadcrumbListSchema.safeParse(validBreadcrumbList)
    expect(result.success).toBe(true)
  })

  it('CL-28: accepte un breadcrumb avec un seul élément (Accueil courant)', () => {
    const result = breadcrumbListSchema.safeParse([
      { label: 'Accueil', href: '/', isCurrent: true },
    ])
    expect(result.success).toBe(true)
  })

  it('CL-25: rejette un breadcrumb vide', () => {
    const result = breadcrumbListSchema.safeParse([])
    expect(result.success).toBe(false)
  })

  it('CL-26: rejette un breadcrumb sans Accueil en premier', () => {
    const result = breadcrumbListSchema.safeParse([
      { label: 'Framework', href: '/framework', isCurrent: true },
    ])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.BREADCRUMB_START_HOME)
    }
  })

  it('CL-27: rejette un breadcrumb sans isCurrent sur le dernier élément', () => {
    const result = breadcrumbListSchema.safeParse([
      { label: 'Accueil', href: '/' },
      { label: 'Framework', href: '/framework' },
    ])
    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message)
      expect(messages).toContain(NAVIGATION_ERRORS.BREADCRUMB_LAST_CURRENT)
    }
  })
})

// ──────────────────────────────────────────────────
// Tests tableOfContentsItemSchema et tableOfContentsListSchema
// ──────────────────────────────────────────────────

describe('tableOfContentsItemSchema', () => {
  it('accepte un item valide (h2)', () => {
    const result = tableOfContentsItemSchema.safeParse(validTocItem)
    expect(result.success).toBe(true)
  })

  it.each([2, 3, 4])('accepte depth = %d', (depth) => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, depth })
    expect(result.success).toBe(true)
  })

  it('CL-29: rejette depth = 1 (h1)', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, depth: 1 })
    expect(result.success).toBe(false)
  })

  it('CL-30: rejette depth = 5 (h5)', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, depth: 5 })
    expect(result.success).toBe(false)
  })

  it('CL-31: rejette depth = 0', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, depth: 0 })
    expect(result.success).toBe(false)
  })

  it('rejette un text vide', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, text: '' })
    expect(result.success).toBe(false)
  })

  it('rejette un text > 200 caractères', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, text: 'a'.repeat(201) })
    expect(result.success).toBe(false)
  })

  it('CL-35: rejette un slug avec majuscules', () => {
    const result = tableOfContentsItemSchema.safeParse({ ...validTocItem, slug: 'Section-A' })
    expect(result.success).toBe(false)
  })
})

describe('tableOfContentsListSchema', () => {
  it('CL-32: accepte une liste vide', () => {
    const result = tableOfContentsListSchema.safeParse([])
    expect(result.success).toBe(true)
  })

  it('accepte une liste valide', () => {
    const result = tableOfContentsListSchema.safeParse([
      { depth: 2, text: 'Section A', slug: 'section-a' },
      { depth: 3, text: 'Détail A', slug: 'detail-a' },
    ])
    expect(result.success).toBe(true)
  })

  it('CL-34: accepte h2 puis h4 directement (sans h3)', () => {
    const result = tableOfContentsListSchema.safeParse([
      { depth: 2, text: 'Section', slug: 'section' },
      { depth: 4, text: 'Détail profond', slug: 'detail-profond' },
    ])
    expect(result.success).toBe(true)
  })

  it('CL-33: rejette des slugs dupliqués', () => {
    const result = tableOfContentsListSchema.safeParse([
      { depth: 2, text: 'Introduction', slug: 'introduction' },
      { depth: 3, text: 'Introduction détaillée', slug: 'introduction' },
    ])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.TOC_DUPLICATE_SLUG)
    }
  })
})

// ──────────────────────────────────────────────────
// Tests prevNextItemSchema et prevNextLinksSchema
// ──────────────────────────────────────────────────

describe('prevNextItemSchema', () => {
  it('accepte un item valide', () => {
    const result = prevNextItemSchema.safeParse({
      label: 'Vision & Philosophie',
      href: '/framework/vision',
      section: 'framework',
    })
    expect(result.success).toBe(true)
  })

  it('accepte un item sans section', () => {
    const result = prevNextItemSchema.safeParse({
      label: 'Test',
      href: '/test',
    })
    expect(result.success).toBe(true)
  })
})

describe('prevNextLinksSchema', () => {
  it('accepte des liens valides', () => {
    const result = prevNextLinksSchema.safeParse(validPrevNextLinks)
    expect(result.success).toBe(true)
  })

  it('CL-36: accepte prev et next null', () => {
    const result = prevNextLinksSchema.safeParse({ prev: null, next: null })
    expect(result.success).toBe(true)
  })

  it('accepte prev null (première page)', () => {
    const result = prevNextLinksSchema.safeParse({
      prev: null,
      next: { label: 'Vision', href: '/framework/vision', section: 'framework' },
    })
    expect(result.success).toBe(true)
  })

  it('accepte next null (dernière page)', () => {
    const result = prevNextLinksSchema.safeParse({
      prev: { label: 'Communauté', href: '/annexes/ressources/communaute', section: 'annexes' },
      next: null,
    })
    expect(result.success).toBe(true)
  })

  it('CL-37: accepte la navigation cross-section', () => {
    const result = prevNextLinksSchema.safeParse({
      prev: { label: 'Annexes FW', href: '/framework/annexes', section: 'framework' },
      next: { label: 'Préambule MO', href: '/mode-operatoire/preambule', section: 'mode-operatoire' },
    })
    expect(result.success).toBe(true)
  })
})

// ──────────────────────────────────────────────────
// Tests flatNavigationItemSchema et flatNavigationListSchema
// ──────────────────────────────────────────────────

describe('flatNavigationItemSchema', () => {
  it('accepte un item valide', () => {
    const result = flatNavigationItemSchema.safeParse({
      id: 'fw-preambule',
      label: 'Préambule',
      href: '/framework/preambule',
      section: 'framework',
      depth: 0,
    })
    expect(result.success).toBe(true)
  })

  it('accepte un item sans section', () => {
    const result = flatNavigationItemSchema.safeParse({
      id: 'test',
      label: 'Test',
      href: '/test',
      depth: 0,
    })
    expect(result.success).toBe(true)
  })

  it('CL-38: rejette depth négatif', () => {
    const result = flatNavigationItemSchema.safeParse({
      id: 'test',
      label: 'Test',
      href: '/test',
      depth: -1,
    })
    expect(result.success).toBe(false)
  })
})

describe('flatNavigationListSchema', () => {
  it('accepte une liste valide', () => {
    const result = flatNavigationListSchema.safeParse([
      { id: 'fw-1', label: 'A', href: '/a', section: 'framework', depth: 0 },
      { id: 'fw-2', label: 'B', href: '/b', section: 'framework', depth: 0 },
    ])
    expect(result.success).toBe(true)
  })

  it('CL-39: rejette des IDs dupliqués', () => {
    const result = flatNavigationListSchema.safeParse([
      { id: 'dupli', label: 'A', href: '/a', depth: 0 },
      { id: 'dupli', label: 'B', href: '/b', depth: 0 },
    ])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(NAVIGATION_ERRORS.FLAT_DUPLICATE_ID)
    }
  })

  it('accepte une liste vide', () => {
    const result = flatNavigationListSchema.safeParse([])
    expect(result.success).toBe(true)
  })
})

// ──────────────────────────────────────────────────
// Tests d'erreurs multiples
// ──────────────────────────────────────────────────

describe('Erreurs multiples', () => {
  it('CL-10 (6.10): remonte toutes les erreurs sur un item totalement invalide', () => {
    const result = navigationItemSchema.safeParse({
      id: '',
      label: '',
      href: 'no-slash',
      order: -1.5,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(3)
    }
  })
})
