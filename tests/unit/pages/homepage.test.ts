import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Page d\'accueil — Integration navigation', () => {
  const indexContent = fs.readFileSync(
    path.resolve('src/pages/index.astro'),
    'utf-8',
  )

  it('T-26 : importe BaseLayout', () => {
    expect(indexContent).toContain('BaseLayout')
  })

  it('T-27 : importe Header', () => {
    expect(indexContent).toContain('Header')
  })

  it('T-28 : utilise BaseLayout comme wrapper', () => {
    expect(indexContent).toContain('<BaseLayout')
  })

  it('T-29 : rend le Header', () => {
    expect(indexContent).toContain('<Header')
  })

  it('T-30 : conserve le HeroSection', () => {
    expect(indexContent).toContain('<HeroSection')
  })
})
