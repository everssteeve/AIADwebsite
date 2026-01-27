// src/types/stat.ts

/**
 * Liste des unités communes pour les statistiques
 */
export const STAT_UNITS = [
  '%',      // Pourcentage
  'x',      // Multiplicateur
  'h',      // Heures
  'j',      // Jours
  'min',    // Minutes
  's',      // Secondes
  'k',      // Milliers
  'M',      // Millions
  '+',      // Plus de
  '',       // Sans unité
] as const

/**
 * Type union des unités supportées
 */
export type StatUnit = typeof STAT_UNITS[number]

/**
 * Représente une statistique chiffrée affichée dans la hero section
 *
 * @example
 * ```typescript
 * const stat: StatItem = {
 *   id: 'stat-productivity',
 *   value: '50%',
 *   numericValue: 50,
 *   unit: '%',
 *   label: 'Gain de productivité moyen',
 *   source: 'Étude interne AIAD 2025',
 *   sourceUrl: 'https://aiad.dev/studies/productivity',
 *   order: 1,
 *   locale: 'fr',
 *   isActive: true,
 *   highlight: true,
 *   updatedAt: new Date('2026-01-27'),
 * }
 * ```
 *
 * @see {@link https://docs.example.com/PRD#us-001 | US-001}
 */
export interface StatItem {
  /**
   * Identifiant unique slug-friendly
   * @pattern ^[a-z0-9-]+$
   * @minLength 3
   * @maxLength 50
   */
  id: string

  /**
   * Valeur affichée de la statistique (ex: "50%", "3x", "100+")
   * Doit contenir au moins un chiffre
   * @minLength 1
   * @maxLength 20
   */
  value: string

  /**
   * Valeur numérique pour tri et comparaison
   * Permet de trier les stats par importance
   */
  numericValue?: number

  /**
   * Unité de mesure affichée
   * @maxLength 10
   */
  unit?: StatUnit | string

  /**
   * Description courte et explicative de la statistique
   * @minLength 10
   * @maxLength 100
   */
  label: string

  /**
   * Attribution de la source de la statistique
   * Requis pour la crédibilité
   * @minLength 5
   * @maxLength 150
   */
  source: string

  /**
   * URL de la source pour vérification
   * Optionnel mais recommandé
   */
  sourceUrl?: string

  /**
   * Ordre d'affichage dans la liste des statistiques
   * Doit être unique par locale
   * @minimum 1
   */
  order: number

  /**
   * Code langue ISO 639-1
   * @default "fr"
   */
  locale: string

  /**
   * Indique si cette statistique est active (affichée) ou masquée
   * @default true
   */
  isActive: boolean

  /**
   * Indique si cette statistique doit être mise en avant visuellement
   * @default false
   */
  highlight: boolean

  /**
   * Date de dernière modification
   */
  updatedAt: Date
}

/**
 * Type pour la création d'un StatItem (champs optionnels avec défauts)
 */
export type StatItemInput = Omit<StatItem, 'locale' | 'isActive' | 'highlight' | 'updatedAt' | 'numericValue' | 'unit' | 'sourceUrl'> & {
  locale?: string
  isActive?: boolean
  highlight?: boolean
  numericValue?: number
  unit?: StatUnit | string
  sourceUrl?: string
  updatedAt?: Date
}

/**
 * Type pour la mise à jour partielle d'un StatItem
 */
export type StatItemUpdate = Partial<Omit<StatItem, 'id'>>

/**
 * Type pour une liste de statistiques (utilisé par StatsRow)
 */
export type StatItemList = StatItem[]
