import { describe, it, expect } from 'vitest'
import { docsSchema } from '@/schemas/docs'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const CONTENT_DIR = path.resolve('src/content')

/**
 * Valide que tous les fichiers MDX ont un frontmatter conforme au schema.
 */
const collectMdxFiles = (dir: string): string[] => {
  const files: string[] = []
  if (!fs.existsSync(dir)) return files
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectMdxFiles(fullPath))
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath)
    }
  }
  return files
}

const allMdxFiles = [
  ...collectMdxFiles(path.join(CONTENT_DIR, 'framework')),
  ...collectMdxFiles(path.join(CONTENT_DIR, 'mode-operatoire')),
  ...collectMdxFiles(path.join(CONTENT_DIR, 'annexes')),
]

describe('Validation des frontmatter MDX', () => {
  it('T-36 : tous les fichiers MDX existent (au moins 71)', () => {
    expect(allMdxFiles.length).toBeGreaterThanOrEqual(71)
  })

  for (const filePath of allMdxFiles) {
    const relativePath = path.relative(CONTENT_DIR, filePath)

    it(`frontmatter valide pour ${relativePath}`, () => {
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(content)
      const result = docsSchema.safeParse(data)
      expect(
        result.success,
        `Frontmatter invalide dans ${relativePath}: ${JSON.stringify((result as { error?: { issues: unknown[] } }).error?.issues)}`,
      ).toBe(true)
    })
  }
})
