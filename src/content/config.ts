// src/content/config.ts

import { defineCollection } from 'astro:content'
import { heroContentSchemaWithRefinements } from '@/schemas/hero'
import { benefitItemSchema } from '@/schemas/benefit'
import { statItemSchema } from '@/schemas/stat'

// Re-export des schémas pour utilisation externe
export { heroContentSchema, heroContentSchemaWithRefinements } from '@/schemas/hero'
export { benefitItemSchema, benefitItemListSchema } from '@/schemas/benefit'
export { statItemSchema, statItemListSchema } from '@/schemas/stat'

/**
 * Collection Content pour les hero contents
 */
const heroCollection = defineCollection({
  type: 'data',
  schema: heroContentSchemaWithRefinements,
})

/**
 * Collection Content pour les benefits
 */
const benefitsCollection = defineCollection({
  type: 'data',
  schema: benefitItemSchema,
})

/**
 * Collection Content pour les stats
 */
const statsCollection = defineCollection({
  type: 'data',
  schema: statItemSchema,
})

export const collections = {
  hero: heroCollection,
  benefits: benefitsCollection,
  stats: statsCollection,
}
