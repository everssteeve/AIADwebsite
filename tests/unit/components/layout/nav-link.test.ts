// tests/unit/components/layout/nav-link.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import NavLink from '@components/layout/NavLink.astro'

// ── Helpers ────────────────────────────────────────────────

async function renderNavLink(
  props: Record<string, unknown> = {},
  currentPath: string = '/',
) {
  const container = await AstroContainer.create()
  return container.renderToString(NavLink, {
    props: {
      href: '/test',
      label: 'Test Link',
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests structure HTML ──────────────────────────────────

describe('NavLink — Structure HTML', () => {
  it('T-01 : genere un element <a>', async () => {
    const html = await renderNavLink()
    expect(html).toContain('<a')
    expect(html).toContain('</a>')
  })

  it('T-02 : le href est present sur le lien', async () => {
    const html = await renderNavLink({ href: '/framework/preambule' })
    expect(html).toContain('href="/framework/preambule"')
  })

  it('T-03 : le label est affiche dans un <span>', async () => {
    const html = await renderNavLink({ label: 'Preambule' })
    expect(html).toContain('<span')
    expect(html).toContain('Preambule')
    expect(html).toContain('truncate')
  })

  it('T-04 : le data-navlink est present', async () => {
    const html = await renderNavLink()
    expect(html).toContain('data-navlink')
  })
})

// ── Tests etat actif ──────────────────────────────────────

describe('NavLink — Etat actif', () => {
  it('T-05 : aria-current="page" quand le href correspond a la page courante (exact)', async () => {
    const html = await renderNavLink(
      { href: '/framework/preambule' },
      '/framework/preambule',
    )
    expect(html).toContain('aria-current="page"')
  })

  it("T-06 : pas d'aria-current quand le href ne correspond pas (exact)", async () => {
    const html = await renderNavLink(
      { href: '/framework/preambule' },
      '/framework/vision-philosophie',
    )
    expect(html).not.toContain('aria-current')
  })

  it("T-07 : actif avec activeMatch=\"prefix\" quand l'URL est enfant", async () => {
    const html = await renderNavLink(
      { href: '/framework', activeMatch: 'prefix' },
      '/framework/preambule',
    )
    expect(html).toContain('aria-current="page"')
  })

  it("T-08 : actif avec activeMatch=\"prefix\" quand l'URL correspond exactement", async () => {
    const html = await renderNavLink(
      { href: '/framework', activeMatch: 'prefix' },
      '/framework',
    )
    expect(html).toContain('aria-current="page"')
  })

  it("T-09 : inactif avec activeMatch=\"prefix\" quand l'URL est dans une autre section", async () => {
    const html = await renderNavLink(
      { href: '/framework', activeMatch: 'prefix' },
      '/mode-operatoire/planification',
    )
    expect(html).not.toContain('aria-current')
  })

  it("T-10 : isActive=true force l'etat actif", async () => {
    const html = await renderNavLink(
      { href: '/framework', isActive: true },
      '/mode-operatoire',
    )
    expect(html).toContain('aria-current="page"')
  })

  it("T-11 : isActive=false force l'etat inactif", async () => {
    const html = await renderNavLink(
      { href: '/framework/preambule', isActive: false },
      '/framework/preambule',
    )
    expect(html).not.toContain('aria-current')
  })
})

// ── Tests trailing slash ──────────────────────────────────

describe('NavLink — Trailing slash', () => {
  it('T-12 : normalise le href avec trailing slash', async () => {
    const html = await renderNavLink(
      { href: '/framework/preambule/' },
      '/framework/preambule',
    )
    expect(html).toContain('aria-current="page"')
  })

  it("T-13 : normalise l'URL courante avec trailing slash", async () => {
    const html = await renderNavLink(
      { href: '/framework/preambule' },
      '/framework/preambule/',
    )
    expect(html).toContain('aria-current="page"')
  })

  it('T-14 : la racine "/" n\'est pas affectee par la normalisation', async () => {
    const html = await renderNavLink({ href: '/' }, '/')
    expect(html).toContain('aria-current="page"')
  })
})

// ── Tests variantes ───────────────────────────────────────

describe('NavLink — Variantes', () => {
  it('T-15 : variante sidebar par defaut', async () => {
    const html = await renderNavLink()
    expect(html).toContain('px-3 py-2')
    expect(html).toContain('text-sm')
  })

  it('T-16 : variante header', async () => {
    const html = await renderNavLink({ variant: 'header' })
    expect(html).toContain('inline-flex')
    expect(html).toContain('font-medium')
  })

  it('T-17 : variante dropdown a w-full', async () => {
    const html = await renderNavLink({ variant: 'dropdown' })
    expect(html).toContain('w-full')
  })

  it('T-18 : variante mobile a un padding plus grand', async () => {
    const html = await renderNavLink({ variant: 'mobile' })
    expect(html).toContain('px-4')
    expect(html).toContain('py-3')
    expect(html).toContain('text-base')
  })

  it('T-19 : variante sidebar active a une bordure gauche', async () => {
    const html = await renderNavLink(
      { href: '/test', variant: 'sidebar' },
      '/test',
    )
    expect(html).toContain('border-l-2')
    expect(html).toContain('border-blue-600')
  })

  it('T-20 : variante header active a un soulignement', async () => {
    const html = await renderNavLink(
      { href: '/test', variant: 'header' },
      '/test',
    )
    expect(html).toContain('border-b-2')
    expect(html).toContain('border-blue-600')
  })

  it('T-21 : variante dropdown active a un fond bleu', async () => {
    const html = await renderNavLink(
      { href: '/test', variant: 'dropdown' },
      '/test',
    )
    expect(html).toContain('bg-blue-50')
    expect(html).toContain('text-blue-700')
  })
})

// ── Tests badge ───────────────────────────────────────────

describe('NavLink — Badge', () => {
  it('T-22 : pas de badge par defaut', async () => {
    const html = await renderNavLink()
    expect(html).not.toContain('Nouveau')
    expect(html).not.toContain('Essentiel')
    expect(html).not.toContain('rounded-full')
  })

  it('T-23 : badge "new" affiche "Nouveau"', async () => {
    const html = await renderNavLink({ badge: 'new' })
    expect(html).toContain('Nouveau')
    expect(html).toContain('bg-green-100')
    expect(html).toContain('text-green-800')
  })

  it('T-24 : badge "essential" affiche "Essentiel"', async () => {
    const html = await renderNavLink({ badge: 'essential' })
    expect(html).toContain('Essentiel')
    expect(html).toContain('bg-amber-100')
    expect(html).toContain('text-amber-800')
  })

  it('T-25 : badge a les classes de style attendues', async () => {
    const html = await renderNavLink({ badge: 'new' })
    expect(html).toContain('text-xs')
    expect(html).toContain('font-medium')
    expect(html).toContain('px-2')
    expect(html).toContain('rounded-full')
  })
})

// ── Tests chevron ─────────────────────────────────────────

describe('NavLink — Chevron', () => {
  it('T-26 : pas de chevron par defaut', async () => {
    const html = await renderNavLink()
    expect(html).not.toContain('<svg')
  })

  it('T-27 : chevron affiche quand hasChildren=true', async () => {
    const html = await renderNavLink({ hasChildren: true })
    expect(html).toContain('<svg')
    expect(html).toContain('aria-hidden="true"')
  })

  it('T-28 : chevron a la classe ml-auto pour etre a droite', async () => {
    const html = await renderNavLink({ hasChildren: true })
    expect(html).toContain('ml-auto')
  })
})

// ── Tests classes et attributs ────────────────────────────

describe('NavLink — Classes et attributs', () => {
  it('T-29 : classe personnalisee ajoutee', async () => {
    const html = await renderNavLink({ class: 'my-custom-class' })
    expect(html).toContain('my-custom-class')
  })

  it('T-30 : focus ring present', async () => {
    const html = await renderNavLink()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })

  it('T-31 : data-section rendu quand section fourni', async () => {
    const html = await renderNavLink({ section: 'framework' })
    expect(html).toContain('data-section="framework"')
  })

  it('T-32 : pas de data-section sans prop section', async () => {
    const html = await renderNavLink()
    // data-section ne doit pas etre rendu ou doit etre vide
    expect(html).not.toMatch(/data-section="[^"]+"/);
  })

  it('T-33 : id rendu quand fourni', async () => {
    const html = await renderNavLink({ id: 'nav-framework' })
    expect(html).toContain('id="nav-framework"')
  })

  it('T-34 : role rendu quand fourni', async () => {
    const html = await renderNavLink({ role: 'menuitem' })
    expect(html).toContain('role="menuitem"')
  })

  it('T-35 : tabindex rendu quand fourni', async () => {
    const html = await renderNavLink({ tabindex: -1 })
    expect(html).toContain('tabindex="-1"')
  })

  it('T-36 : transition-colors presente', async () => {
    const html = await renderNavLink()
    expect(html).toContain('transition-colors')
  })
})

// ── Tests protection XSS ─────────────────────────────────

describe('NavLink — Protection XSS', () => {
  it('T-37 : label avec caracteres HTML est echappe', async () => {
    const html = await renderNavLink({
      label: '<script>alert("xss")</script>',
    })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('T-38 : label avec accents et caracteres speciaux', async () => {
    const html = await renderNavLink({
      label: "Ecosysteme & Architecture — Vue d'ensemble",
    })
    expect(html).toContain('Ecosysteme')
  })
})

// ── Tests badge + chevron combines ────────────────────────

describe('NavLink — Combinaisons', () => {
  it('T-39 : badge et chevron affiches ensemble', async () => {
    const html = await renderNavLink({
      badge: 'essential',
      hasChildren: true,
    })
    expect(html).toContain('Essentiel')
    expect(html).toContain('<svg')
    // Le badge doit apparaitre avant le chevron
    const badgePos = html.indexOf('Essentiel')
    const chevronPos = html.indexOf('<svg')
    expect(badgePos).toBeLessThan(chevronPos)
  })

  it('T-40 : lien actif avec badge', async () => {
    const html = await renderNavLink(
      { href: '/test', badge: 'new' },
      '/test',
    )
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('Nouveau')
  })
})
