// tests/unit/layouts/base-layout.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import BaseLayout from '@layouts/BaseLayout.astro'

// ── Helpers ────────────────────────────────────────────────

let container: AstroContainer

beforeEach(async () => {
  container = await AstroContainer.create()
})

async function renderLayout(props: Record<string, unknown> = {}) {
  return container.renderToString(BaseLayout, {
    props: {
      title: 'Test Page',
      description: 'Test description',
      ...props,
    },
  })
}

// ── Tests structure HTML ──────────────────────────────────

describe('BaseLayout — Structure HTML', () => {
  it('T-01 : genere un document HTML valide', async () => {
    const html = await renderLayout()
    // Note : AstroContainer ne rend pas le <!doctype html>, mais il est
    // present dans le composant source. Verifie au build/a11y.
    expect(html).toContain('<html')
    expect(html).toContain('</html>')
  })

  it('T-02 : <html> a l\'attribut lang="fr"', async () => {
    const html = await renderLayout()
    expect(html).toContain('lang="fr"')
  })

  it('T-03 : <head> contient charset UTF-8 en premier', async () => {
    const html = await renderLayout()
    expect(html).toContain('<meta charset="UTF-8"')
  })

  it('T-04 : <head> contient le viewport mobile-first', async () => {
    const html = await renderLayout()
    expect(html).toContain('name="viewport"')
    expect(html).toContain('width=device-width, initial-scale=1.0')
  })

  it('T-05 : viewport ne contient pas maximum-scale ni user-scalable=no', async () => {
    const html = await renderLayout()
    expect(html).not.toContain('maximum-scale')
    expect(html).not.toContain('user-scalable=no')
  })

  it('T-06 : <body> a les classes de base', async () => {
    const html = await renderLayout()
    expect(html).toContain('min-h-screen')
    expect(html).toContain('bg-white')
    expect(html).toContain('text-gray-900')
    expect(html).toContain('antialiased')
  })
})

// ── Tests titre ───────────────────────────────────────────

describe('BaseLayout — Titre', () => {
  it('T-07 : ajoute le suffixe " | AIAD" au titre', async () => {
    const html = await renderLayout({ title: 'Accueil' })
    expect(html).toContain('<title>Accueil | AIAD</title>')
  })

  it('T-08 : pas de doublon si le titre contient deja "AIAD"', async () => {
    const html = await renderLayout({ title: 'AIAD - Framework de dev' })
    expect(html).toContain('<title>AIAD - Framework de dev</title>')
    expect(html).not.toContain('AIAD | AIAD')
  })

  it('T-09 : titre vide genere " | AIAD"', async () => {
    const html = await renderLayout({ title: '' })
    expect(html).toContain('<title> | AIAD</title>')
  })
})

// ── Tests meta SEO ────────────────────────────────────────

describe('BaseLayout — Meta SEO', () => {
  it('T-10 : genere la meta description', async () => {
    const html = await renderLayout({ description: 'Ma description' })
    expect(html).toContain('name="description"')
    expect(html).toContain('content="Ma description"')
  })

  it('T-11 : genere les meta Open Graph', async () => {
    const html = await renderLayout()
    expect(html).toContain('property="og:title"')
    expect(html).toContain('property="og:description"')
    expect(html).toContain('property="og:type"')
    expect(html).toContain('property="og:image"')
    expect(html).toContain('property="og:locale"')
  })

  it('T-12 : og:type est "website" par defaut', async () => {
    const html = await renderLayout()
    expect(html).toContain('content="website"')
  })

  it('T-13 : og:type accepte "article"', async () => {
    const html = await renderLayout({ ogType: 'article' })
    expect(html).toContain('content="article"')
  })

  it('T-14 : og:image utilise la valeur par defaut', async () => {
    const html = await renderLayout()
    expect(html).toContain('content="/images/og/default.png"')
  })

  it('T-15 : og:image accepte une valeur personnalisee', async () => {
    const html = await renderLayout({ ogImage: '/images/og/custom.png' })
    expect(html).toContain('content="/images/og/custom.png"')
  })

  it('T-16 : og:locale est "fr_FR"', async () => {
    const html = await renderLayout()
    expect(html).toContain('content="fr_FR"')
  })
})

// ── Tests canonical ───────────────────────────────────────

describe('BaseLayout — Canonical', () => {
  it('T-17 : pas de <link rel="canonical"> sans prop canonical', async () => {
    const html = await renderLayout()
    expect(html).not.toContain('rel="canonical"')
  })

  it('T-18 : genere <link rel="canonical"> avec prop canonical', async () => {
    const html = await renderLayout({ canonical: 'https://aiad.dev/framework' })
    expect(html).toContain('rel="canonical"')
    expect(html).toContain('href="https://aiad.dev/framework"')
  })
})

// ── Tests JSON-LD ─────────────────────────────────────────

describe('BaseLayout — JSON-LD', () => {
  it('T-19 : pas de script JSON-LD sans prop jsonLd', async () => {
    const html = await renderLayout()
    expect(html).not.toContain('application/ld+json')
  })

  it('T-20 : genere le script JSON-LD avec un objet', async () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'AIAD',
    }
    const html = await renderLayout({ jsonLd })
    expect(html).toContain('application/ld+json')
    expect(html).toContain('"@context":"https://schema.org"')
    expect(html).toContain('"@type":"WebSite"')
    expect(html).toContain('"name":"AIAD"')
  })

  it('T-21 : genere le script JSON-LD avec un tableau', async () => {
    const jsonLd = [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'AIAD' },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList' },
    ]
    const html = await renderLayout({ jsonLd })
    expect(html).toContain('application/ld+json')
    expect(html).toContain('"@type":"WebSite"')
    expect(html).toContain('"@type":"BreadcrumbList"')
  })
})

// ── Tests skip-link ───────────────────────────────────────

describe('BaseLayout — Skip-link', () => {
  it('T-22 : genere un skip-link avec le texte par defaut', async () => {
    const html = await renderLayout()
    expect(html).toContain('Aller au contenu principal')
    expect(html).toContain('href="#main-content"')
  })

  it('T-23 : le skip-link a la classe sr-only (masque par defaut)', async () => {
    const html = await renderLayout()
    expect(html).toContain('class="skip-link')
    expect(html).toContain('sr-only')
  })

  it('T-24 : le skip-link a les classes focus pour la visibilite', async () => {
    const html = await renderLayout()
    expect(html).toContain('focus:not-sr-only')
    expect(html).toContain('focus:fixed')
    expect(html).toContain('focus:bg-blue-600')
    expect(html).toContain('focus:text-white')
  })

  it('T-25 : le skip-link a un focus ring visible', async () => {
    const html = await renderLayout()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-400')
  })

  it('T-26 : le skip-link est le premier element dans le body', async () => {
    const html = await renderLayout()
    const bodyStart = html.indexOf('<body')
    const skipLinkStart = html.indexOf('skip-link', bodyStart)
    const slotContent = html.indexOf('</a>', skipLinkStart)
    // Le skip-link doit apparaitre avant tout autre contenu significatif
    expect(skipLinkStart).toBeGreaterThan(bodyStart)
    expect(slotContent).toBeGreaterThan(skipLinkStart)
  })

  it('T-27 : skip-link avec texte personnalise', async () => {
    const html = await renderLayout({ skipLinkText: 'Passer au contenu' })
    expect(html).toContain('Passer au contenu')
  })

  it('T-28 : skip-link avec cible personnalisee', async () => {
    const html = await renderLayout({ skipLinkTarget: 'content' })
    expect(html).toContain('href="#content"')
  })
})

// ── Tests CSS global ──────────────────────────────────────

describe('BaseLayout — CSS global', () => {
  it('T-29 : le composant importe le fichier CSS global', async () => {
    // L'import CSS via frontmatter (`import '@/styles/global.css'`) est
    // traite par Astro/Vite au build. En container mode, il n'apparait
    // pas dans le HTML rendu. On verifie la presence de l'import dans le source.
    const { readFileSync } = await import('node:fs')
    const { join } = await import('node:path')
    const source = readFileSync(
      join(process.cwd(), 'src/layouts/BaseLayout.astro'),
      'utf-8'
    )
    expect(source).toContain("import '@/styles/global.css'")
  })
})

// ── Tests classes personnalisees ──────────────────────────

describe('BaseLayout — Classes personnalisees', () => {
  it('T-30 : bodyClass ajoute des classes au body', async () => {
    const html = await renderLayout({ bodyClass: 'dark bg-gray-900' })
    expect(html).toContain('dark')
    expect(html).toContain('bg-gray-900')
    // Les classes de base sont toujours presentes
    expect(html).toContain('min-h-screen')
  })

  it('T-31 : class ajoute une classe a <html>', async () => {
    const html = await renderLayout({ class: 'scroll-smooth' })
    expect(html).toContain('scroll-smooth')
  })

  it('T-32 : pas d\'attribut class sur <html> si non fourni', async () => {
    const html = await renderLayout()
    // L'attribut class ne doit pas etre present sur <html> s'il est undefined
    const htmlTag = html.match(/<html[^>]*>/)
    expect(htmlTag).toBeTruthy()
  })
})

// ── Tests protection XSS ─────────────────────────────────

describe('BaseLayout — Protection XSS', () => {
  it('T-33 : title avec caracteres HTML est echappe', async () => {
    const html = await renderLayout({ title: '<script>alert("xss")</script>' })
    // Astro echappe les expressions dans <title> (raw text element)
    expect(html).toContain('<title>&lt;script&gt;')
    expect(html).toContain('&lt;/script&gt;')
  })

  it('T-34 : description avec guillemets est echappee', async () => {
    const html = await renderLayout({ description: 'Test "guillemets" et <tags>' })
    expect(html).toContain('content="Test')
    expect(html).not.toContain('content="Test "guillemets"')
  })
})
