import { describe, it, expect } from 'vitest'

describe('Annexes — Transformation des slugs', () => {
  const transformSlug = (slug: string) => slug.replace(/\/_index$/, '')

  it('T-31 : transforme templates/_index en templates', () => {
    expect(transformSlug('templates/_index')).toBe('templates')
  })

  it('T-32 : ne modifie pas templates/prd', () => {
    expect(transformSlug('templates/prd')).toBe('templates/prd')
  })

  it('T-33 : transforme roles/_index en roles', () => {
    expect(transformSlug('roles/_index')).toBe('roles')
  })

  it('T-34 : ne modifie pas roles/product-manager', () => {
    expect(transformSlug('roles/product-manager')).toBe('roles/product-manager')
  })

  it('T-35 : gere les 9 categories d\'index', () => {
    const categories = [
      'templates',
      'roles',
      'boucles',
      'rituels',
      'metriques',
      'agents',
      'configuration',
      'bonnes-pratiques',
      'ressources',
    ]
    for (const cat of categories) {
      expect(transformSlug(`${cat}/_index`)).toBe(cat)
    }
  })
})
