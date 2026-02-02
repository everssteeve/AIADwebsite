// tests/e2e/value-proposition.spec.ts

import { test, expect } from '@playwright/test'

test.describe('ValueProposition Component - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers une page contenant le composant
    await page.goto('/')
  })

  test('should display value proposition text', async ({ page }) => {
    // Le texte de la value proposition doit être visible
    const valueProp = page.locator('p:has-text("méthodologie")')
    await expect(valueProp).toBeVisible()
  })

  test('should be positioned below the title', async ({ page }) => {
    const h1 = page.locator('h1').first()
    const valueProp = page.locator('p:has-text("méthodologie")').first()

    const h1Box = await h1.boundingBox()
    const valuePropBox = await valueProp.boundingBox()

    expect(valuePropBox?.y).toBeGreaterThan(h1Box?.y ?? 0)
  })

  test('T-14: should not have horizontal overflow on narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 600 })

    const body = page.locator('body')
    const bodyWidth = await body.evaluate((el) => el.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test('should be responsive across breakpoints', async ({ page }) => {
    const valueProp = page.locator('p:has-text("méthodologie")').first()

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(valueProp).toBeVisible()

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(valueProp).toBeVisible()

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(valueProp).toBeVisible()
  })

  test('should respect max-width constraint on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    const valueProp = page.locator('p:has-text("méthodologie")').first()
    const box = await valueProp.boundingBox()

    // max-w-3xl = 48rem = 768px (avec 16px font-size)
    expect(box?.width).toBeLessThanOrEqual(768)
  })
})
