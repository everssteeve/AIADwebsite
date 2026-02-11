// tests/unit/components/layout/prev-next-links.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import PrevNextLinks from '@components/layout/PrevNextLinks.astro'

// ── Fixtures ─────────────────────────────────────────────

const BOTH_LINKS = {
  prev: { label: 'Ecosysteme', href: '/framework/ecosysteme', section: 'framework' as const },
  next: { label: 'Boucles Iteratives', href: '/framework/boucles-iteratives', section: 'framework' as const },
}

const CROSS_SECTION_LINKS = {
  prev: { label: 'Metriques', href: '/framework/metriques', section: 'framework' as const },
  next: { label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' as const },
}

const PREV_ONLY = {
  prev: { label: 'I3 - Bibliographie', href: '/annexes/ressources/bibliographie', section: 'annexes' as const },
  next: null,
}

const NEXT_ONLY = {
  prev: null,
  next: { label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework' as const },
}

const NO_LINKS = {
  prev: null,
  next: null,
}

const NO_SECTION_LINKS = {
  prev: { label: 'Page A', href: '/page-a' },
  next: { label: 'Page B', href: '/page-b' },
}

// ── Helpers ──────────────────────────────────────────────

async function renderPrevNext(
  props: Record<string, unknown> = {},
  currentPath: string = '/framework/artefacts',
) {
  const container = await AstroContainer.create()
  return container.renderToString(PrevNextLinks, {
    props: {
      links: BOTH_LINKS,
      ...props,
    },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}

// ── Tests rendu conditionnel ─────────────────────────────

describe('PrevNextLinks — Rendu conditionnel', () => {
  it('T-01 : rend le composant quand les deux liens sont presents', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('<nav')
    expect(html).toContain('data-prev-next')
  })

  it('T-02 : rend le composant quand seul prev est present', async () => {
    const html = await renderPrevNext({ links: PREV_ONLY })
    expect(html).toContain('<nav')
    expect(html).toContain('data-prev-next-prev')
    expect(html).not.toContain('data-prev-next-next')
  })

  it('T-03 : rend le composant quand seul next est present', async () => {
    const html = await renderPrevNext({ links: NEXT_ONLY })
    expect(html).toContain('<nav')
    expect(html).toContain('data-prev-next-next')
    expect(html).not.toContain('data-prev-next-prev')
  })

  it('T-04 : ne rend rien quand prev et next sont null', async () => {
    const html = await renderPrevNext({ links: NO_LINKS })
    expect(html).not.toContain('<nav')
    expect(html).not.toContain('data-prev-next')
  })
})

// ── Tests structure HTML ──────────────────────────────────

describe('PrevNextLinks — Structure HTML', () => {
  it('T-05 : genere un element <nav> avec aria-label', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Navigation entre les pages"')
  })

  it('T-06 : contient un lien <a> pour le precedent avec href', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('href="/framework/ecosysteme"')
    expect(html).toContain('data-prev-next-prev')
  })

  it('T-07 : contient un lien <a> pour le suivant avec href', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('href="/framework/boucles-iteratives"')
    expect(html).toContain('data-prev-next-next')
  })

  it('T-08 : le lien precedent affiche le titre de la page', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-prev-title')
    expect(html).toContain('Ecosysteme')
  })

  it('T-09 : le lien suivant affiche le titre de la page', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-next-title')
    expect(html).toContain('Boucles Iteratives')
  })

  it('T-10 : les labels de direction "Precedent" et "Suivant" sont presents', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('Precedent')
    expect(html).toContain('Suivant')
  })
})

// ── Tests fleches SVG ────────────────────────────────────

describe('PrevNextLinks — Fleches', () => {
  it('T-11 : fleche gauche pour le lien precedent (chevron gauche)', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('M15 19l-7-7 7-7')
  })

  it('T-12 : fleche droite pour le lien suivant (chevron droit)', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('M9 5l7 7-7 7')
  })

  it('T-13 : les fleches ont aria-hidden="true"', async () => {
    const html = await renderPrevNext()
    const svgMatches = html.match(/<svg[^>]*>/g) || []
    svgMatches.forEach((svg: string) => {
      expect(svg).toContain('aria-hidden="true"')
    })
  })

  it('T-14 : les fleches ont la bonne taille (h-5 w-5)', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('h-5 w-5')
  })
})

// ── Tests accessibilite ──────────────────────────────────

describe('PrevNextLinks — Accessibilite', () => {
  it('T-15 : le nav a aria-label="Navigation entre les pages"', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('aria-label="Navigation entre les pages"')
  })

  it('T-16 : le lien precedent a un aria-label descriptif', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('aria-label="Precedent : Ecosysteme"')
  })

  it('T-17 : le lien suivant a un aria-label descriptif', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('aria-label="Suivant : Boucles Iteratives"')
  })

  it('T-18 : les liens ont un focus ring', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-500')
    expect(html).toContain('focus:ring-offset-2')
  })
})

// ── Tests cross-section ──────────────────────────────────

describe('PrevNextLinks — Indicateur cross-section', () => {
  it('T-19 : pas d\'indicateur de section quand meme section', async () => {
    const html = await renderPrevNext({ links: BOTH_LINKS }, '/framework/artefacts')
    expect(html).not.toContain('data-prev-next-prev-section')
    expect(html).not.toContain('data-prev-next-next-section')
  })

  it('T-20 : indicateur de section affiche quand cross-section sur next', async () => {
    const html = await renderPrevNext({ links: CROSS_SECTION_LINKS }, '/framework/annexes')
    expect(html).toContain('data-prev-next-next-section')
    expect(html).toContain('Mode')
  })

  it('T-21 : pas d\'indicateur sur prev quand meme section (cross-section next)', async () => {
    const html = await renderPrevNext({ links: CROSS_SECTION_LINKS }, '/framework/annexes')
    expect(html).not.toContain('data-prev-next-prev-section')
  })

  it('T-22 : indicateur affiche le label francais de la section', async () => {
    const html = await renderPrevNext({ links: CROSS_SECTION_LINKS }, '/framework/annexes')
    // Le lien next pointe vers mode-operatoire → label "Mode Operatoire"
    const nextSection = html.match(/data-prev-next-next-section[^>]*>([\s\S]*?)<\/span>/)
    expect(nextSection).not.toBeNull()
  })

  it('T-23 : pas d\'indicateur quand le lien n\'a pas de section', async () => {
    const html = await renderPrevNext({ links: NO_SECTION_LINKS }, '/framework/artefacts')
    expect(html).not.toContain('data-prev-next-prev-section')
    expect(html).not.toContain('data-prev-next-next-section')
  })
})

// ── Tests responsive ─────────────────────────────────────

describe('PrevNextLinks — Responsive', () => {
  it('T-24 : label complet "Precedent" visible sur desktop (hidden md:inline)', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('hidden md:inline')
    expect(html).toContain('Precedent')
  })

  it('T-25 : label abrege "Prec." visible sur mobile (md:hidden)', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('md:hidden')
    expect(html).toContain('Prec.')
  })

  it('T-26 : label complet "Suivant" visible sur desktop', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('Suivant')
  })

  it('T-27 : label abrege "Suiv." visible sur mobile', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('Suiv.')
  })

  it('T-28 : layout flex-col sur mobile, flex-row sur desktop', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('flex-col')
    expect(html).toContain('md:flex-row')
  })
})

// ── Tests styles ─────────────────────────────────────────

describe('PrevNextLinks — Styles', () => {
  it('T-29 : bordure superieure de separation', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('border-t')
    expect(html).toContain('border-gray-200')
  })

  it('T-30 : les liens ont une bordure et des coins arrondis', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('rounded-lg')
    expect(html).toContain('border border-gray-200')
  })

  it('T-31 : hover change la bordure et le fond', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('hover:border-blue-300')
    expect(html).toContain('hover:bg-blue-50/50')
  })

  it('T-32 : hover change la couleur du titre', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('group-hover:text-blue-700')
  })

  it('T-33 : hover change la couleur de la fleche', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('group-hover:text-blue-600')
  })

  it('T-34 : transitions presentes', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('transition-colors')
    expect(html).toContain('duration-150')
  })

  it('T-35 : les titres ont truncate pour les labels longs', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('truncate')
  })

  it('T-36 : labels de direction sont uppercase', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('uppercase')
    expect(html).toContain('tracking-wider')
  })
})

// ── Tests classes et attributs ──────────────────────────

describe('PrevNextLinks — Classes et attributs', () => {
  it('T-37 : classe personnalisee ajoutee au nav', async () => {
    const html = await renderPrevNext({ class: 'my-custom-class' })
    expect(html).toContain('my-custom-class')
  })

  it('T-38 : data-prev-next present sur le nav', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next')
  })

  it('T-39 : data-prev-next-prev present sur le lien precedent', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-prev')
  })

  it('T-40 : data-prev-next-next present sur le lien suivant', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-next')
  })

  it('T-41 : data-prev-next-prev-title present', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-prev-title')
  })

  it('T-42 : data-prev-next-next-title present', async () => {
    const html = await renderPrevNext()
    expect(html).toContain('data-prev-next-next-title')
  })
})

// ── Tests XSS ────────────────────────────────────────────

describe('PrevNextLinks — Protection XSS', () => {
  it('T-43 : label avec HTML est echappe', async () => {
    const links = {
      prev: { label: '<script>alert("xss")</script>', href: '/test' },
      next: null,
    }
    const html = await renderPrevNext({ links })
    // Le contenu textuel (dans le span titre) doit etre echappe par Astro
    const titleContent = html.match(/data-prev-next-prev-title[^>]*>([\s\S]*?)<\/span>/)
    expect(titleContent).not.toBeNull()
    expect(titleContent![1]).toContain('&lt;script&gt;')
    expect(titleContent![1]).not.toContain('<script>')
  })

  it('T-44 : label avec accents et caracteres speciaux', async () => {
    const links = {
      prev: { label: 'Ecosysteme & Architecture — Vue d\'ensemble', href: '/test' },
      next: null,
    }
    const html = await renderPrevNext({ links })
    expect(html).toContain('Ecosysteme')
  })
})

// ── Tests combinaisons ───────────────────────────────────

describe('PrevNextLinks — Combinaisons', () => {
  it('T-45 : prev seulement — placeholder droit present sur desktop', async () => {
    const html = await renderPrevNext({ links: PREV_ONLY })
    expect(html).toContain('data-prev-next-prev')
    expect(html).not.toContain('data-prev-next-next')
    // Un div vide pour le placeholder
    expect(html).toContain('hidden md:block')
  })

  it('T-46 : next seulement — lien aligne a droite via ml-auto', async () => {
    const html = await renderPrevNext({ links: NEXT_ONLY })
    expect(html).toContain('data-prev-next-next')
    expect(html).not.toContain('data-prev-next-prev')
    expect(html).toContain('md:ml-auto')
  })

  it('T-47 : classe personnalisee + liens manuels', async () => {
    const html = await renderPrevNext({
      links: BOTH_LINKS,
      class: 'bg-gray-50 px-4',
    })
    expect(html).toContain('bg-gray-50')
    expect(html).toContain('Ecosysteme')
    expect(html).toContain('Boucles Iteratives')
  })

  it('T-48 : liens sans section definie — pas d\'indicateur cross-section', async () => {
    const html = await renderPrevNext({ links: NO_SECTION_LINKS })
    expect(html).toContain('Page A')
    expect(html).toContain('Page B')
    expect(html).not.toContain('data-prev-next-prev-section')
    expect(html).not.toContain('data-prev-next-next-section')
  })

  it('T-49 : cross-section complet — indicateurs sur les deux liens', async () => {
    const links = {
      prev: { label: 'Annexes', href: '/framework/annexes', section: 'framework' as const },
      next: { label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' as const },
    }
    const html = await renderPrevNext({ links }, '/annexes/templates')
    // La page courante est dans 'annexes', donc :
    // prev.section = 'framework' (different) → indicateur
    // next.section = 'mode-operatoire' (different) → indicateur
    expect(html).toContain('data-prev-next-prev-section')
    expect(html).toContain('data-prev-next-next-section')
  })

  it('T-50 : aria-label adapte au contenu de chaque lien', async () => {
    const links = {
      prev: { label: 'Metriques', href: '/framework/metriques' },
      next: { label: 'Preambule', href: '/mode-operatoire/preambule' },
    }
    const html = await renderPrevNext({ links })
    expect(html).toContain('aria-label="Precedent : Metriques"')
    expect(html).toContain('aria-label="Suivant : Preambule"')
  })
})
