import { describe, it, expect } from 'vitest'
import { NAVIGATION_TREE } from '@/data/navigation'
import { flattenNav } from '@/lib/navigation'
import fs from 'node:fs'
import path from 'node:path'

const CONTENT_DIR = path.resolve('src/content')

/**
 * Verifie que chaque item du NAVIGATION_TREE a un fichier MDX correspondant.
 * Ce test garantit la coherence entre la source de verite (navigation)
 * et le contenu genere (fichiers MDX).
 */
describe('Coherence NAVIGATION_TREE / fichiers MDX', () => {
  const flatItems = flattenNav(NAVIGATION_TREE)

  it('T-16 : tous les items Framework ont un fichier MDX correspondant', () => {
    const frameworkItems = flatItems.filter((item) => item.section === 'framework')
    for (const item of frameworkItems) {
      const slug = item.href.replace('/framework/', '')
      const filePath = path.join(CONTENT_DIR, 'framework', `${slug}.mdx`)
      expect(fs.existsSync(filePath), `Fichier manquant : ${filePath}`).toBe(true)
    }
  })

  it('T-17 : tous les items Mode Operatoire ont un fichier MDX correspondant', () => {
    const moItems = flatItems.filter((item) => item.section === 'mode-operatoire')
    for (const item of moItems) {
      const slug = item.href.replace('/mode-operatoire/', '')
      const filePath = path.join(CONTENT_DIR, 'mode-operatoire', `${slug}.mdx`)
      expect(fs.existsSync(filePath), `Fichier manquant : ${filePath}`).toBe(true)
    }
  })

  it('T-18 : tous les items Annexes ont un fichier MDX correspondant', () => {
    const annexeItems = flatItems.filter((item) => item.section === 'annexes')
    for (const item of annexeItems) {
      const slug = item.href.replace('/annexes/', '')
      // Les categories (profondeur 1) utilisent _index.mdx
      // Les fiches (profondeur 2) utilisent le slug directement
      const segments = slug.split('/')
      let filePath: string
      if (segments.length === 1) {
        // Categorie → _index.mdx
        filePath = path.join(CONTENT_DIR, 'annexes', segments[0], '_index.mdx')
      } else {
        // Fiche → slug.mdx
        filePath = path.join(CONTENT_DIR, 'annexes', `${slug}.mdx`)
      }
      expect(fs.existsSync(filePath), `Fichier manquant : ${filePath}`).toBe(true)
    }
  })

  it('T-19 : le nombre total de fichiers MDX correspond au nombre d\'items', () => {
    const expectedCount = flatItems.length // 71 items
    let actualCount = 0
    const countMdx = (dir: string) => {
      if (!fs.existsSync(dir)) return
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.isDirectory()) {
          countMdx(path.join(dir, entry.name))
        } else if (entry.name.endsWith('.mdx')) {
          actualCount++
        }
      }
    }
    countMdx(path.join(CONTENT_DIR, 'framework'))
    countMdx(path.join(CONTENT_DIR, 'mode-operatoire'))
    countMdx(path.join(CONTENT_DIR, 'annexes'))
    expect(actualCount).toBe(expectedCount)
  })
})
