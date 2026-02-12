import { describe, it, expect } from 'vitest'
import { docsSchema } from '@/schemas/docs'

describe('docsSchema — Validation', () => {
  it('T-01 : accepte un frontmatter valide minimal', () => {
    const result = docsSchema.safeParse({
      title: 'Preambule',
      description: 'Introduction au framework AIAD.',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(true)
  })

  it('T-02 : accepte un frontmatter complet avec tous les champs', () => {
    const result = docsSchema.safeParse({
      title: 'Preambule',
      description: 'Introduction au framework AIAD.',
      order: 1,
      section: 'framework',
      isEssential: true,
      lastUpdated: '2026-02-12',
      tags: ['introduction', 'fondamentaux'],
      draft: true,
    })
    expect(result.success).toBe(true)
  })

  it('T-03 : rejette un frontmatter sans title', () => {
    const result = docsSchema.safeParse({
      description: 'Description.',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-04 : rejette un frontmatter sans description', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-05 : rejette un frontmatter sans order', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: 'Description.',
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-06 : rejette un frontmatter sans section', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: 'Description.',
      order: 1,
    })
    expect(result.success).toBe(false)
  })

  it('T-07 : rejette une section invalide', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: 'Description.',
      order: 1,
      section: 'invalide',
    })
    expect(result.success).toBe(false)
  })

  it('T-08 : rejette un order negatif', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: 'Description.',
      order: -1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-09 : rejette un order decimal', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: 'Description.',
      order: 1.5,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-10 : valide toutes les sections autorisees', () => {
    const sections = [
      'framework',
      'mode-operatoire',
      'annexes-templates',
      'annexes-roles',
      'annexes-boucles',
      'annexes-rituels',
      'annexes-metriques',
      'annexes-agents',
      'annexes-configuration',
      'annexes-bonnes-pratiques',
      'annexes-ressources',
    ]
    for (const section of sections) {
      const result = docsSchema.safeParse({
        title: 'Titre',
        description: 'Description.',
        order: 1,
        section,
      })
      expect(result.success).toBe(true)
    }
  })

  it('T-11 : les valeurs par defaut sont appliquees (isEssential, draft)', () => {
    const result = docsSchema.parse({
      title: 'Titre',
      description: 'Description.',
      order: 1,
      section: 'framework',
    })
    expect(result.isEssential).toBe(false)
    expect(result.draft).toBe(false)
  })

  it('T-12 : coerce lastUpdated en Date', () => {
    const result = docsSchema.parse({
      title: 'Titre',
      description: 'Description.',
      order: 1,
      section: 'framework',
      lastUpdated: '2026-02-12',
    })
    expect(result.lastUpdated).toBeInstanceOf(Date)
  })

  it('T-13 : rejette un title vide', () => {
    const result = docsSchema.safeParse({
      title: '',
      description: 'Description.',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-14 : rejette une description vide', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: '',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-15 : rejette un title trop long (> 200 caracteres)', () => {
    const result = docsSchema.safeParse({
      title: 'A'.repeat(201),
      description: 'Description.',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })
})
