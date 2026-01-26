// src/content/config.ts

import { defineCollection } from 'astro:content'
import { heroContentSchemaWithRefinements } from '@/schemas/hero'

// Re-export des schémas pour utilisation externe
export { heroContentSchema, heroContentSchemaWithRefinements } from '@/schemas/hero'

/**
 * Collection Content pour les hero contents
 */
const heroCollection = defineCollection({
  type: 'data',
  schema: heroContentSchemaWithRefinements,
})

export const collections = {
  hero: heroCollection,
}
