// tests/unit/components/cta-button.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import CTAButton from '@components/common/CTAButton.astro'

describe('CTAButton Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base
  const defaultProps = {
    text: 'Explorer le Framework',
    href: '/framework',
  }

  describe('Rendu de base', () => {
    it('T-00: should render as anchor tag by default', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('<a')
      expect(result).toContain('</a>')
      expect(result).toContain('href="/framework"')
    })

    it('T-00b: should render text inside span', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      // Astro peut ajouter des attributs data-* au span
      expect(result).toMatch(/<span[^>]*>Explorer le Framework<\/span>/)
    })

    it('should render arrow icon by default', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('<svg')
      expect(result).toContain('aria-hidden="true"')
    })

    it('should have only one anchor or button tag', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      const aCount = (result.match(/<a/g) || []).length
      const buttonCount = (result.match(/<button/g) || []).length

      expect(aCount + buttonCount).toBe(1)
    })
  })

  describe('Props: variant', () => {
    it('should apply primary variant classes by default', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('bg-blue-600')
      expect(result).toContain('text-white')
      expect(result).toContain('hover:bg-blue-700')
    })

    it('should apply secondary variant classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, variant: 'secondary' },
      })

      expect(result).toContain('bg-gray-100')
      expect(result).toContain('text-gray-900')
      expect(result).toContain('hover:bg-gray-200')
    })

    it('should apply outline variant classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, variant: 'outline' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('text-blue-600')
      expect(result).toContain('border-2')
      expect(result).toContain('border-blue-600')
    })

    it('should apply ghost variant classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, variant: 'ghost' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('text-blue-600')
      expect(result).not.toContain('border-2')
    })
  })

  describe('Props: size', () => {
    it('should apply lg size classes by default', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('md:text-lg')
      expect(result).toContain('md:px-8')
      expect(result).toContain('md:py-4')
    })

    it('should apply md size classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, size: 'md' },
      })

      expect(result).toContain('text-base')
      expect(result).toContain('px-6')
      expect(result).toContain('py-3')
      expect(result).not.toContain('md:px-8')
    })

    it('should apply sm size classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, size: 'sm' },
      })

      expect(result).toContain('text-sm')
      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
    })
  })

  describe('Props: as', () => {
    it('T-07: should render as button when as="button"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'button' },
      })

      expect(result).toContain('<button')
      expect(result).toContain('</button>')
      expect(result).not.toContain('<a')
      expect(result).not.toContain('href=')
    })

    it('should apply type attribute when as="button"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'button', type: 'submit' },
      })

      expect(result).toContain('type="submit"')
    })

    it('T-08: should ignore type attribute when as="link"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'link', type: 'submit' },
      })

      expect(result).not.toContain('type="submit"')
    })
  })

  describe('Props: icon', () => {
    it('should render arrow icon by default', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('M17 8l4 4')
    })

    it('should render external icon when icon="external"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, icon: 'external' },
      })

      expect(result).toContain('M10 6H6')
    })

    it('should not render icon when icon="none"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, icon: 'none' },
      })

      expect(result).not.toContain('<svg')
    })
  })

  describe('Props: iconPosition', () => {
    it('T-21: should render icon before text when iconPosition="left"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, iconPosition: 'left' },
      })

      const svgIndex = result.indexOf('<svg')
      // Astro peut ajouter des attributs data-* au span
      const spanMatch = result.match(/<span[^>]*>/)
      const spanIndex = spanMatch ? result.indexOf(spanMatch[0]) : -1

      expect(svgIndex).toBeGreaterThan(-1)
      expect(spanIndex).toBeGreaterThan(-1)
      expect(svgIndex).toBeLessThan(spanIndex)
    })

    it('should render icon after text by default (iconPosition="right")', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      const svgIndex = result.indexOf('<svg')
      const spanEndIndex = result.indexOf('</span>')

      expect(svgIndex).toBeGreaterThan(spanEndIndex)
    })
  })

  describe('Props: newTab', () => {
    it('T-05: should not add target="_blank" when newTab=false', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, newTab: false },
      })

      expect(result).not.toContain('target="_blank"')
    })

    it('T-06: should add target="_blank" and rel="noopener noreferrer" when newTab=true', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, newTab: true },
      })

      expect(result).toContain('target="_blank"')
      expect(result).toContain('rel="noopener noreferrer"')
    })
  })

  describe('Props: disabled', () => {
    it('T-09: should apply disabled styles and aria-disabled for link', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, disabled: true },
      })

      expect(result).toContain('opacity-50')
      expect(result).toContain('cursor-not-allowed')
      expect(result).toContain('pointer-events-none')
      expect(result).toContain('aria-disabled="true"')
      expect(result).not.toContain('href="/framework"')
    })

    it('T-10: should apply disabled attribute for button', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'button', disabled: true },
      })

      expect(result).toContain('disabled')
      expect(result).toContain('opacity-50')
    })
  })

  describe('Props: fullWidth', () => {
    it('T-15: should apply w-full class when fullWidth=true', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, fullWidth: true },
      })

      expect(result).toContain('w-full')
    })

    it('should not apply w-full class when fullWidth=false', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, fullWidth: false },
      })

      expect(result).not.toContain('w-full')
    })
  })

  describe('Props: ariaLabel', () => {
    it('T-18: should apply aria-label when provided', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, ariaLabel: 'Accéder à la documentation' },
      })

      expect(result).toContain('aria-label="Accéder à la documentation"')
    })

    it('should not have aria-label when not provided', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).not.toContain('aria-label=')
    })
  })

  describe('Props: class', () => {
    it('T-14: should apply custom class', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })

    it('should preserve default classes when adding custom class', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, class: 'mt-8' },
      })

      expect(result).toContain('inline-flex')
      expect(result).toContain('rounded-lg')
      expect(result).toContain('mt-8')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('T-01: should handle long text (50 chars)', async () => {
      const longText = 'Explorez toutes les fonctionnalités du framework'
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: longText },
      })

      expect(result).toContain(longText)
    })

    it('T-02: should handle short text (2 chars)', async () => {
      const shortText = 'OK'
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: shortText },
      })

      expect(result).toContain(shortText)
    })

    it('T-03: should use # as default href when href is empty', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { text: 'Test', href: '' },
      })

      // Empty href defaults to '#' via the default value
      expect(result).toContain('href="#"')
    })

    it('T-04: should use # as default href when href is undefined', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { text: 'Test' },
      })

      expect(result).toContain('href="#"')
    })

    it('T-16: should handle special characters in text', async () => {
      const specialText = 'Découvrir l\'IA & plus'
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: specialText },
      })

      expect(result).toContain('Découvrir l&#39;IA')
      expect(result).toContain('&amp;')
    })

    it('T-17: should escape HTML injection in text', async () => {
      const xssText = 'Test <script>alert(\'xss\')</script>'
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: xssText },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })
  })

  describe('Styling: Base classes', () => {
    it('should have inline-flex for layout', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('inline-flex')
      expect(result).toContain('items-center')
      expect(result).toContain('justify-center')
    })

    it('should have rounded-lg for border radius', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('rounded-lg')
    })

    it('should have transition classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('transition-all')
      expect(result).toContain('duration-200')
    })

    it('should have focus ring classes for accessibility', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('focus:outline-none')
      expect(result).toContain('focus:ring-2')
      expect(result).toContain('focus:ring-offset-2')
    })
  })
})
