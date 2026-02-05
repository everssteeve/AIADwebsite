// tests/unit/components/cta-button.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import CTAButton from '@components/common/CTAButton.astro'

describe('CTAButton Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  const defaultProps = {
    text: 'Explorer le Framework',
    href: '/framework',
  }

  describe('Rendu de base', () => {
    it('CTA-00: devrait rendre comme <a> par défaut', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('<a')
      expect(result).toContain('href=')
    })

    it('CTA-00b: devrait rendre le texte dans un <span>', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toMatch(/<span[^>]*>Explorer le Framework<\/span>/)
    })

    it('CTA-01: devrait rendre l\'icône arrow par défaut (SVG avec aria-hidden)', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('<svg')
      expect(result).toContain('aria-hidden="true"')
    })

    it('CTA-02: devrait avoir un seul <a> ou <button>', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      const aCount = (result.match(/<a/g) || []).length
      const buttonCount = (result.match(/<button/g) || []).length

      expect(aCount + buttonCount).toBe(1)
    })
  })

  describe('Props: variant', () => {
    it('CTA-03: devrait appliquer variant primary par défaut', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('bg-blue-600')
      expect(result).toContain('text-white')
      expect(result).toContain('hover:bg-blue-700')
    })

    it('CTA-04: devrait appliquer variant secondary', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, variant: 'secondary' },
      })

      expect(result).toContain('bg-gray-100')
      expect(result).toContain('text-gray-900')
    })

    it('CTA-05: devrait appliquer variant outline', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, variant: 'outline' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('border-2')
      expect(result).toContain('border-blue-600')
    })

    it('CTA-06: devrait appliquer variant ghost', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, variant: 'ghost' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).not.toContain('border-2')
    })
  })

  describe('Props: size', () => {
    it('CTA-07: devrait appliquer size lg par défaut', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('md:text-lg')
      expect(result).toContain('md:px-8')
      expect(result).toContain('md:py-4')
    })

    it('CTA-08: devrait appliquer size md', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, size: 'md' },
      })

      expect(result).toContain('text-base')
      expect(result).toContain('px-6')
      expect(result).toContain('py-3')
    })

    it('CTA-09: devrait appliquer size sm', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, size: 'sm' },
      })

      expect(result).toContain('text-sm')
      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
    })
  })

  describe('Props: as et type', () => {
    it('CTA-10: devrait rendre un <button> quand as="button"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'button' },
      })

      expect(result).toContain('<button')
      expect(result).not.toContain('<a')
    })

    it('CTA-11: devrait appliquer type="submit" sur <button>', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'button', type: 'submit' },
      })

      expect(result).toContain('type="submit"')
    })

    it('CTA-12: devrait ignorer type sur <a>', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'link', type: 'submit' },
      })

      expect(result).not.toContain('type="submit"')
    })
  })

  describe('Props: icon', () => {
    it('CTA-13: devrait rendre l\'icône external avec le SVG path M10 6H6', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, icon: 'external' },
      })

      expect(result).toContain('M10 6H6')
    })

    it('CTA-14: devrait ne pas rendre de SVG quand icon="none"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, icon: 'none' },
      })

      expect(result).not.toContain('<svg')
    })

    it('CTA-15: devrait rendre le SVG avant le span quand iconPosition="left"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, iconPosition: 'left' },
      })

      const svgIndex = result.indexOf('<svg')
      const spanMatch = result.match(/<span[^>]*>/)
      const spanIndex = spanMatch ? result.indexOf(spanMatch[0]) : -1

      expect(svgIndex).toBeGreaterThan(-1)
      expect(spanIndex).toBeGreaterThan(-1)
      expect(svgIndex).toBeLessThan(spanIndex)
    })

    it('CTA-16: devrait rendre le SVG après le span par défaut (iconPosition="right")', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      const svgIndex = result.indexOf('<svg')
      const spanEndIndex = result.indexOf('</span>')

      expect(svgIndex).toBeGreaterThan(spanEndIndex)
    })
  })

  describe('Props: newTab', () => {
    it('CTA-17: devrait ne pas ajouter target="_blank" quand newTab=false', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, newTab: false },
      })

      expect(result).not.toContain('target="_blank"')
    })

    it('CTA-18: devrait ajouter target="_blank" et rel="noopener noreferrer" quand newTab=true', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, newTab: true },
      })

      expect(result).toContain('target="_blank"')
      expect(result).toContain('rel="noopener noreferrer"')
    })
  })

  describe('Props: disabled', () => {
    it('CTA-19: devrait appliquer les styles disabled et aria-disabled sur un lien', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, disabled: true },
      })

      expect(result).toContain('opacity-50')
      expect(result).toContain('cursor-not-allowed')
      expect(result).toContain('aria-disabled="true"')
    })

    it('CTA-20: devrait appliquer l\'attribut disabled sur un bouton', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'button', disabled: true },
      })

      expect(result).toContain('disabled')
    })
  })

  describe('Props: fullWidth', () => {
    it('CTA-21: devrait ajouter w-full quand fullWidth=true', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, fullWidth: true },
      })

      expect(result).toContain('w-full')
    })

    it('CTA-22: devrait ne pas avoir w-full par défaut (fullWidth=false)', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).not.toContain('w-full')
    })
  })

  describe('Props: ariaLabel', () => {
    it('CTA-23: devrait appliquer aria-label quand fourni', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, ariaLabel: 'Accéder à la documentation' },
      })

      expect(result).toContain('aria-label="Accéder à la documentation"')
    })

    it('CTA-24: devrait ne pas avoir aria-label quand non fourni', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).not.toContain('aria-label=')
    })
  })

  describe('Props: class', () => {
    it('CTA-25: devrait préserver les classes par défaut avec une classe custom', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('inline-flex')
      expect(result).toContain('rounded-lg')
      expect(result).toContain('my-custom-class')
    })
  })

  describe('Styling: Classes Tailwind', () => {
    it('CTA-26: devrait avoir les classes de base inline-flex items-center justify-center', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('inline-flex')
      expect(result).toContain('items-center')
      expect(result).toContain('justify-center')
    })

    it('CTA-27: devrait avoir rounded-lg', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('rounded-lg')
    })

    it('CTA-28: devrait avoir transition-all duration-200', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('transition-all')
      expect(result).toContain('duration-200')
    })

    it('CTA-29: devrait avoir les classes focus ring', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('focus:ring-2')
      expect(result).toContain('focus:ring-offset-2')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('CTA-CL-01: devrait gérer un texte long (50 caractères)', async () => {
      const longText = 'Explorez toutes les fonctionnalités du framework!'
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: longText },
      })

      expect(result).toContain(longText)
    })

    it('CTA-CL-02: devrait gérer un texte court (2 caractères)', async () => {
      const shortText = 'OK'
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: shortText },
      })

      expect(result).toContain(shortText)
    })

    it('CTA-CL-03: devrait utiliser href="#" par défaut quand href est vide', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { text: 'Test', href: '' },
      })

      expect(result).toContain('href="#"')
    })

    it('CTA-CL-04: devrait utiliser href="#" par défaut quand href est undefined', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { text: 'Test' },
      })

      expect(result).toContain('href="#"')
    })

    it('CTA-CL-05: devrait gérer les caractères spéciaux dans le texte', async () => {
      const specialText = 'Découvrir l\'IA & plus'
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: specialText },
      })

      expect(result).toContain('&#39;')
      expect(result).toContain('&amp;')
    })

    it('CTA-CL-06: devrait échapper l\'injection HTML dans le texte', async () => {
      const xssText = 'Test <script>alert(\'xss\')</script>'
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: xssText },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })
  })
})
