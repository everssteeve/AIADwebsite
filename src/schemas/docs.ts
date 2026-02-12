// src/schemas/docs.ts

import { z } from 'astro:content'

/**
 * Schema Zod pour les collections de documentation (framework, mode-operatoire, annexes).
 *
 * Utilise par les 3 collections dans src/content/config.ts.
 */
export const docsSchema = z.object({
  /** Titre affiche dans le <h1> et le <title> */
  title: z.string().min(1).max(200),

  /** Description meta SEO (max 160 caracteres recommande) */
  description: z.string().min(1).max(300),

  /** Ordre de tri dans la section (entier >= 0) */
  order: z.number().int().min(0),

  /** Section parente pour le filtrage */
  section: z.enum([
    'framework',
    'mode-operatoire',
    'annexes-templates',
    'annexes-roles',
    'annexes-boucles',
    'annexes-rituels',
    'annexes-metriques',
    'annexes-agents',
    'annexes-configuration',
    'annexes-bonnes-pratiques',
    'annexes-ressources',
  ]),

  /** Marquer comme page essentielle (badge dans la navigation) */
  isEssential: z.boolean().default(false),

  /** Date de derniere mise a jour */
  lastUpdated: z.coerce.date().optional(),

  /** Tags de categorisation */
  tags: z.array(z.string()).optional(),

  /** Page en brouillon (exclue de la generation en production) */
  draft: z.boolean().default(false),
})

/** Type TypeScript infere du schema */
export type DocsMetadata = z.infer<typeof docsSchema>
