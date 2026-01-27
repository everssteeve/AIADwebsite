// src/schemas/stat.ts

/**
 * @module schemas/stat
 * @description Schémas de validation Zod pour les statistiques de la hero section.
 * Implémente les règles métier définies dans US-001.
 *
 * @see {@link ../types/stat.ts} pour les types TypeScript correspondants
 * @see {@link ../../docs/specs/US-001/T-001-B3-modele-donnees-StatItem.md} pour les spécifications
 */

import { z } from 'zod'

/**
 * Messages d'erreur standardisés
 */
export const STAT_ITEM_ERRORS = {
  ID_TOO_SHORT: 'L\'ID doit contenir au moins 3 caractères',
  ID_TOO_LONG: 'L\'ID ne doit pas dépasser 50 caractères',
  ID_INVALID_FORMAT: 'L\'ID ne doit contenir que des minuscules, chiffres et tirets',
  VALUE_TOO_SHORT: 'La valeur doit contenir au moins 1 caractère',
  VALUE_TOO_LONG: 'La valeur ne doit pas dépasser 20 caractères',
  VALUE_NO_DIGIT: 'La valeur doit contenir au moins un chiffre (règle R5)',
  UNIT_TOO_LONG: 'L\'unité ne doit pas dépasser 10 caractères',
  LABEL_TOO_SHORT: 'Le label doit contenir au moins 10 caractères',
  LABEL_TOO_LONG: 'Le label ne doit pas dépasser 100 caractères',
  SOURCE_TOO_SHORT: 'La source doit contenir au moins 5 caractères',
  SOURCE_TOO_LONG: 'La source ne doit pas dépasser 150 caractères',
  SOURCE_URL_INVALID: 'L\'URL de la source doit être valide (règle R6)',
  ORDER_NOT_INTEGER: 'L\'ordre doit être un entier',
  ORDER_NOT_POSITIVE: 'L\'ordre doit être un nombre positif',
  ORDER_NOT_UNIQUE: 'L\'ordre doit être unique par locale pour les statistiques actives (règle R1)',
  MAX_STATS_EXCEEDED: 'Maximum 6 statistiques actives par locale (règle R4)',
  LOCALE_INVALID: 'Le code langue doit contenir exactement 2 caractères',
  DATE_INVALID: 'La date doit être au format ISO 8601',
} as const

/**
 * Schéma de validation pour StatItem.
 * Valide les champs individuels avec les contraintes de longueur et format.
 *
 * @remarks
 * Règles métier implémentées :
 * - **R2** : Le label doit être explicatif (min 10 caractères)
 * - **R3** : La source doit être renseignée (min 5 caractères)
 * - **R5** : La valeur doit contenir au moins un chiffre
 * - **R6** : L'URL de la source doit être valide si fournie
 *
 * Note : Les règles R1 (unicité order) et R4 (max 6 actifs) sont implémentées dans
 * {@link statItemListSchema} car elles nécessitent une validation inter-éléments.
 *
 * @example
 * ```typescript
 * const result = statItemSchema.safeParse({
 *   id: 'stat-productivity',
 *   value: '50%',
 *   label: 'Gain de productivité moyen',
 *   source: 'Étude interne AIAD 2025',
 *   order: 1,
 *   updatedAt: '2026-01-27T10:00:00.000Z'
 * })
 * if (result.success) {
 *   console.log(result.data) // updatedAt est transformé en Date
 * }
 * ```
 */
export const statItemSchema = z.object({
  id: z
    .string()
    .min(3, STAT_ITEM_ERRORS.ID_TOO_SHORT)
    .max(50, STAT_ITEM_ERRORS.ID_TOO_LONG)
    .regex(/^[a-z0-9-]+$/, STAT_ITEM_ERRORS.ID_INVALID_FORMAT),

  value: z
    .string()
    .min(1, STAT_ITEM_ERRORS.VALUE_TOO_SHORT)
    .max(20, STAT_ITEM_ERRORS.VALUE_TOO_LONG)
    .refine(
      (val) => /\d/.test(val),
      STAT_ITEM_ERRORS.VALUE_NO_DIGIT
    ),

  numericValue: z
    .number()
    .optional(),

  unit: z
    .string()
    .max(10, STAT_ITEM_ERRORS.UNIT_TOO_LONG)
    .optional(),

  label: z
    .string()
    .min(10, STAT_ITEM_ERRORS.LABEL_TOO_SHORT)
    .max(100, STAT_ITEM_ERRORS.LABEL_TOO_LONG),

  source: z
    .string()
    .min(5, STAT_ITEM_ERRORS.SOURCE_TOO_SHORT)
    .max(150, STAT_ITEM_ERRORS.SOURCE_TOO_LONG),

  sourceUrl: z
    .string()
    .url(STAT_ITEM_ERRORS.SOURCE_URL_INVALID)
    .optional(),

  order: z
    .number()
    .int(STAT_ITEM_ERRORS.ORDER_NOT_INTEGER)
    .positive(STAT_ITEM_ERRORS.ORDER_NOT_POSITIVE),

  locale: z
    .string()
    .length(2, STAT_ITEM_ERRORS.LOCALE_INVALID)
    .default('fr'),

  isActive: z
    .boolean()
    .default(true),

  highlight: z
    .boolean()
    .default(false),

  updatedAt: z
    .string()
    .datetime()
    .transform((val) => new Date(val)),
})

/**
 * Schéma pour une liste de StatItems avec validation inter-éléments.
 * Vérifie l'unicité des ordres (règle R1) et le maximum de 6 actifs (règle R4).
 *
 * @remarks
 * Règles métier implémentées :
 * - **R1** : L'ordre doit être unique par locale pour les statistiques actives
 * - **R4** : Maximum 6 statistiques actives par locale
 *
 * @example
 * ```typescript
 * const result = statItemListSchema.safeParse([
 *   { id: 'stat-1', value: '50%', label: 'Gain de productivité', source: 'Étude AIAD', order: 1, updatedAt: '2026-01-27T10:00:00.000Z' },
 *   { id: 'stat-2', value: '3x', label: 'Plus rapide que manuel', source: 'Benchmark interne', order: 2, updatedAt: '2026-01-27T10:00:00.000Z' },
 * ])
 * ```
 */
export const statItemListSchema = z.array(statItemSchema)
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
    { message: STAT_ITEM_ERRORS.ORDER_NOT_UNIQUE }
  )
  .refine(
    (items) => {
      const countByLocale = new Map<string, number>()
      for (const item of items) {
        if (!item.isActive) continue
        const count = (countByLocale.get(item.locale) || 0) + 1
        if (count > 6) return false
        countByLocale.set(item.locale, count)
      }
      return true
    },
    { message: STAT_ITEM_ERRORS.MAX_STATS_EXCEEDED }
  )

/**
 * Type inféré du schéma StatItem.
 * Utilisé pour les validations et les tests unitaires.
 *
 * @see {@link StatItem} dans types/stat.ts pour le type d'interface équivalent
 */
export type StatItemSchemaType = z.infer<typeof statItemSchema>

/**
 * Type inféré du schéma StatItemList.
 */
export type StatItemListSchemaType = z.infer<typeof statItemListSchema>
