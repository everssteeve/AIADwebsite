// src/content/config.ts

import { defineCollection } from 'astro:content'
import { heroContentSchemaWithRefinements } from '@/schemas/hero'
import { benefitItemSchema } from '@/schemas/benefit'
import { statItemSchema } from '@/schemas/stat'
import { docsSchema } from '@/schemas/docs'

// Re-export des schemas pour utilisation externe
export { heroContentSchema, heroContentSchemaWithRefinements } from '@/schemas/hero'
export { benefitItemSchema, benefitItemListSchema } from '@/schemas/benefit'
export { statItemSchema, statItemListSchema } from '@/schemas/stat'
export { docsSchema } from '@/schemas/docs'

// ── Collections US-001 (existantes) ───────────────────

const heroCollection = defineCollection({
  type: 'data',
  schema: heroContentSchemaWithRefinements,
})

const benefitsCollection = defineCollection({
  type: 'data',
  schema: benefitItemSchema,
})

const statsCollection = defineCollection({
  type: 'data',
  schema: statItemSchema,
})

// ── Collections US-004 (nouvelles) ────────────────────

const frameworkCollection = defineCollection({
  type: 'content',
  schema: docsSchema,
})

const modeOperatoireCollection = defineCollection({
  type: 'content',
  schema: docsSchema,
})

const annexesCollection = defineCollection({
  type: 'content',
  schema: docsSchema,
})

// ── Export ─────────────────────────────────────────────

export const collections = {
  hero: heroCollection,
  benefits: benefitsCollection,
  stats: statsCollection,
  framework: frameworkCollection,
  'mode-operatoire': modeOperatoireCollection,
  annexes: annexesCollection,
}
