import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Pages index de section — Existence des fichiers', () => {
  it('T-20 : le fichier framework/index.astro existe', () => {
    const filePath = path.resolve('src/pages/framework/index.astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it('T-21 : le fichier mode-operatoire/index.astro existe', () => {
    const filePath = path.resolve('src/pages/mode-operatoire/index.astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it('T-22 : le fichier annexes/index.astro existe', () => {
    const filePath = path.resolve('src/pages/annexes/index.astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })
})

describe('Routes dynamiques — Existence des fichiers', () => {
  it('T-23 : le fichier framework/[...slug].astro existe', () => {
    const filePath = path.resolve('src/pages/framework/[...slug].astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it('T-24 : le fichier mode-operatoire/[...slug].astro existe', () => {
    const filePath = path.resolve('src/pages/mode-operatoire/[...slug].astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it('T-25 : le fichier annexes/[...slug].astro existe', () => {
    const filePath = path.resolve('src/pages/annexes/[...slug].astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })
})
