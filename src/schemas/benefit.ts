// src/schemas/benefit.ts

/**
 * @module schemas/benefit
 * @description Schémas de validation Zod pour les bénéfices de la hero section.
 * Implémente les règles métier définies dans US-001.
 *
 * @see {@link ../types/benefit.ts} pour les types TypeScript correspondants
 * @see {@link ../../docs/specs/US-001/T-001-B2-modele-donnees-BenefitItem.md} pour les spécifications
 */

import { z } from 'zod'

/**
 * Liste des icônes Lucide valides pour les bénéfices
 */
const BENEFIT_ICONS = [
  'zap',
  'target',
  'wrench',
  'trending-up',
  'shield',
  'handshake',
  'lightbulb',
  'refresh-cw',
  'package',
  'check-circle',
  'rocket',
  'users',
  'code',
  'layers',
  'cpu',
  'globe',
  'lock',
  'star',
  'award',
  'compass',
] as const

/**
 * Schéma de validation pour BenefitItem.
 * Valide les champs individuels avec les contraintes de longueur et format.
 *
 * @remarks
 * Règles métier implémentées :
 * - **R2** : Le titre ne doit pas dépasser 5 mots
 * - **R3** : La description doit se terminer par un point ou point d'exclamation
 * - **R5** : L'icône doit être une icône Lucide valide
 *
 * Note : Les règles R1 (unicité order) et R4 (max 5 actifs) sont implémentées dans
 * {@link benefitItemListSchema} car elles nécessitent une validation inter-éléments.
 *
 * @example
 * ```typescript
 * const result = benefitItemSchema.safeParse({
 *   id: 'benefit-productivity',
 *   icon: 'trending-up',
 *   title: 'Productivité accrue',
 *   description: 'Gagnez 50% de temps sur vos tâches répétitives.',
 *   order: 1,
 *   updatedAt: '2026-01-26T10:00:00.000Z'
 * })
 * if (result.success) {
 *   console.log(result.data) // updatedAt est transformé en Date
 * }
 * ```
 */
export const benefitItemSchema = z.object({
  id: z
    .string()
    .min(3, 'L\'ID doit contenir au moins 3 caractères')
    .max(50, 'L\'ID ne doit pas dépasser 50 caractères')
    .regex(/^[a-z0-9-]+$/, 'L\'ID ne doit contenir que des minuscules, chiffres et tirets'),

  icon: z
    .enum(BENEFIT_ICONS, {
      errorMap: () => ({ message: `L'icône doit être l'une des suivantes : ${BENEFIT_ICONS.join(', ')}` })
    }),

  title: z
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(50, 'Le titre ne doit pas dépasser 50 caractères')
    .refine(
      (val) => val.trim().split(/\s+/).length <= 5,
      'Le titre ne doit pas dépasser 5 mots (règle R2)'
    ),

  description: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(150, 'La description ne doit pas dépasser 150 caractères')
    .refine(
      (val) => /[.!]$/.test(val.trim()),
      'La description doit se terminer par un point ou point d\'exclamation (règle R3)'
    ),

  order: z
    .number()
    .int('L\'ordre doit être un entier')
    .positive('L\'ordre doit être un nombre positif'),

  locale: z
    .string()
    .length(2, 'Le code langue doit contenir exactement 2 caractères')
    .default('fr'),

  isActive: z
    .boolean()
    .default(true),

  ariaLabel: z
    .string()
    .max(100, 'Le label d\'accessibilité ne doit pas dépasser 100 caractères')
    .optional(),

  updatedAt: z
    .string()
    .datetime()
    .transform((val) => new Date(val)),
})

/**
 * Schéma pour une liste de BenefitItems avec validation inter-éléments.
 * Vérifie l'unicité des ordres (règle R1) et le maximum de 5 actifs (règle R4).
 *
 * @remarks
 * Règles métier implémentées :
 * - **R1** : L'ordre doit être unique par locale pour les bénéfices actifs
 * - **R4** : Maximum 5 bénéfices actifs par locale
 *
 * @example
 * ```typescript
 * const result = benefitItemListSchema.safeParse([
 *   { id: 'benefit-1', icon: 'zap', title: 'Titre 1', description: 'Description valide.', order: 1, updatedAt: '2026-01-26T10:00:00.000Z' },
 *   { id: 'benefit-2', icon: 'target', title: 'Titre 2', description: 'Description valide.', order: 2, updatedAt: '2026-01-26T10:00:00.000Z' },
 * ])
 * ```
 */
export const benefitItemListSchema = z.array(benefitItemSchema)
  .refine(
    (items) => {
      const activeByLocale = new Map<string, number[]>()
      for (const item of items) {
        if (!item.isActive) continue
        const orders = activeByLocale.get(item.locale) || []
        if (orders.includes(item.order)) return false
        orders.push(item.order)
        activeByLocale.set(item.locale, orders)
      }
      return true
    },
    { message: 'L\'ordre doit être unique par locale pour les bénéfices actifs (règle R1)' }
  )
  .refine(
    (items) => {
      const countByLocale = new Map<string, number>()
      for (const item of items) {
        if (!item.isActive) continue
        const count = (countByLocale.get(item.locale) || 0) + 1
        if (count > 5) return false
        countByLocale.set(item.locale, count)
      }
      return true
    },
    { message: 'Maximum 5 bénéfices actifs par locale (règle R4)' }
  )

/**
 * Type inféré du schéma BenefitItem.
 * Utilisé pour les validations et les tests unitaires.
 *
 * @see {@link BenefitItem} dans types/benefit.ts pour le type d'interface équivalent
 */
export type BenefitItemSchemaType = z.infer<typeof benefitItemSchema>

/**
 * Type inféré du schéma BenefitItemList.
 */
export type BenefitItemListSchemaType = z.infer<typeof benefitItemListSchema>
