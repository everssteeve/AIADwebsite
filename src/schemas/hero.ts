// src/schemas/hero.ts

/**
 * @module schemas/hero
 * @description Schémas de validation Zod pour le contenu Hero de la page d'accueil.
 * Implémente les règles métier définies dans US-001.
 *
 * @see {@link ../types/hero.ts} pour les types TypeScript correspondants
 * @see {@link ../../docs/specs/US-001/T-001-B1-modele-donnees-HeroContent.md} pour les spécifications
 */

import { z } from 'zod'

/**
 * Schéma de validation pour les métadonnées SEO optionnelles.
 *
 * @example
 * ```typescript
 * const metadata = {
 *   seoTitle: 'AIAD - Framework IA',
 *   seoDescription: 'Découvrez AIAD, le framework pour développer avec des agents IA.'
 * }
 * heroMetadataSchema.parse(metadata)
 * ```
 */
export const heroMetadataSchema = z.object({
  seoTitle: z
    .string()
    .max(60, 'Le titre SEO ne doit pas dépasser 60 caractères')
    .optional(),
  seoDescription: z
    .string()
    .max(160, 'La meta description ne doit pas dépasser 160 caractères')
    .optional(),
})

/**
 * Schéma de validation pour HeroContent.
 * Valide les champs individuels avec les contraintes de longueur et format.
 *
 * @remarks
 * Règles métier implémentées :
 * - **R1** : Le titre doit contenir "AIAD" (cohérence branding)
 * - **R3** : La proposition de valeur doit se terminer par un point
 *
 * Note : La règle R2 (non-répétition tagline/title) est implémentée dans
 * {@link heroContentSchemaWithRefinements} car elle nécessite une validation inter-champs.
 *
 * @example
 * ```typescript
 * const result = heroContentSchema.safeParse({
 *   id: 'hero-main-fr',
 *   title: 'AIAD : Le framework pour développer avec des agents IA',
 *   tagline: 'Structurez votre collaboration avec l\'IA',
 *   valueProposition: 'Une méthodologie éprouvée pour intégrer les agents IA.',
 *   updatedAt: '2026-01-26T10:00:00.000Z'
 * })
 * if (result.success) {
 *   console.log(result.data) // updatedAt est transformé en Date
 * }
 * ```
 */
export const heroContentSchema = z.object({
  id: z
    .string()
    .min(3, 'L\'ID doit contenir au moins 3 caractères')
    .max(50, 'L\'ID ne doit pas dépasser 50 caractères')
    .regex(/^[a-z0-9-]+$/, 'L\'ID ne doit contenir que des minuscules, chiffres et tirets'),

  title: z
    .string()
    .min(10, 'Le titre doit contenir au moins 10 caractères')
    .max(80, 'Le titre ne doit pas dépasser 80 caractères')
    .refine(
      (val) => val.includes('AIAD'),
      'Le titre doit contenir "AIAD" (règle R1)'
    ),

  tagline: z
    .string()
    .min(10, 'La tagline doit contenir au moins 10 caractères')
    .max(120, 'La tagline ne doit pas dépasser 120 caractères'),

  valueProposition: z
    .string()
    .min(20, 'La proposition de valeur doit contenir au moins 20 caractères')
    .max(200, 'La proposition de valeur ne doit pas dépasser 200 caractères')
    .refine(
      (val) => val.trim().endsWith('.'),
      'La proposition de valeur doit se terminer par un point (règle R3)'
    ),

  locale: z
    .string()
    .length(2, 'Le code langue doit contenir exactement 2 caractères')
    .default('fr'),

  isActive: z
    .boolean()
    .default(true),

  metadata: heroMetadataSchema.optional(),

  updatedAt: z
    .string()
    .datetime()
    .transform((val) => new Date(val)),
})

/**
 * Schéma HeroContent avec validation inter-champs (raffinements).
 * Étend {@link heroContentSchema} avec la règle R2.
 *
 * @remarks
 * **Règle R2** : La tagline ne doit pas trop répéter le titre.
 *
 * Algorithme de détection :
 * 1. Extrait les mots significatifs (> 3 caractères) du titre et de la tagline
 * 2. Calcule le chevauchement entre les deux ensembles
 * 3. Rejette si plus de 50% des mots significatifs de la tagline sont dans le titre
 *
 * Cette approche évite les faux positifs avec les mots courts comme "le", "de", "avec".
 *
 * @example
 * ```typescript
 * // Valide : tagline différente du titre
 * heroContentSchemaWithRefinements.parse({
 *   id: 'hero-fr',
 *   title: 'AIAD : Le framework pour les agents IA',
 *   tagline: 'Structurez votre collaboration intelligente',
 *   valueProposition: 'Une méthodologie éprouvée.',
 *   updatedAt: '2026-01-26T10:00:00.000Z'
 * })
 *
 * // Invalide : tagline répète trop le titre
 * heroContentSchemaWithRefinements.parse({
 *   id: 'hero-fr',
 *   title: 'AIAD : Le framework pour les agents IA',
 *   tagline: 'Le framework pour les agents IA en entreprise', // Erreur !
 *   valueProposition: 'Une méthodologie éprouvée.',
 *   updatedAt: '2026-01-26T10:00:00.000Z'
 * })
 * ```
 */
export const heroContentSchemaWithRefinements = heroContentSchema.refine(
  (data) => {
    // Filtrer les mots significatifs (> 3 chars) pour éviter les faux positifs avec "le", "de", etc.
    const titleWords = new Set(
      data.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
    )
    const taglineSignificantWords = data.tagline
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)

    // Si pas assez de mots significatifs dans la tagline, on accepte
    if (taglineSignificantWords.length === 0) return true

    const overlap = taglineSignificantWords.filter((w) => titleWords.has(w))
    return overlap.length < taglineSignificantWords.length * 0.5
  },
  {
    message: 'La tagline ne doit pas trop répéter le titre (règle R2)',
    path: ['tagline'],
  }
)

/**
 * Type inféré du schéma HeroContent (sans raffinements inter-champs).
 * Utilisé pour les validations partielles ou les tests unitaires.
 *
 * @see {@link HeroContent} dans types/hero.ts pour le type d'interface équivalent
 */
export type HeroContentSchemaType = z.infer<typeof heroContentSchema>

/**
 * Type inféré du schéma HeroContent avec tous les raffinements.
 * Type recommandé pour la validation complète en production.
 */
export type HeroContentSchemaWithRefinementsType = z.infer<typeof heroContentSchemaWithRefinements>
