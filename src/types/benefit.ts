// src/types/benefit.ts

/**
 * Liste des icônes Lucide supportées pour les bénéfices
 */
export const BENEFIT_ICONS = [
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
 * Type union des icônes supportées
 */
export type BenefitIcon = typeof BENEFIT_ICONS[number]

/**
 * Représente un bénéfice clé affiché dans la hero section
 *
 * @example
 * ```typescript
 * const benefit: BenefitItem = {
 *   id: 'benefit-productivity',
 *   icon: 'trending-up',
 *   title: 'Productivité accrue',
 *   description: 'Gagnez 50% de temps sur vos tâches répétitives grâce à l\'automatisation IA.',
 *   order: 1,
 *   locale: 'fr',
 *   isActive: true,
 *   updatedAt: new Date('2026-01-26'),
 * }
 * ```
 *
 * @see {@link https://docs.example.com/PRD#us-001 | US-001}
 */
export interface BenefitItem {
  /**
   * Identifiant unique slug-friendly
   * @pattern ^[a-z0-9-]+$
   * @minLength 3
   * @maxLength 50
   */
  id: string

  /**
   * Identifiant de l'icône Lucide à afficher
   * @see BENEFIT_ICONS pour la liste des icônes supportées
   */
  icon: BenefitIcon

  /**
   * Titre court et accrocheur du bénéfice
   * Doit être concis (2-5 mots maximum)
   * @minLength 5
   * @maxLength 50
   */
  title: string

  /**
   * Description explicative du bénéfice
   * Doit être une phrase complète (terminer par . ou !)
   * @minLength 20
   * @maxLength 150
   */
  description: string

  /**
   * Ordre d'affichage dans la liste des bénéfices
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
   * Indique si ce bénéfice est actif (affiché) ou masqué
   * @default true
   */
  isActive: boolean

  /**
   * Label d'accessibilité pour l'icône (attribut aria-label)
   * Si non fourni, utilise le title par défaut
   * @maxLength 100
   */
  ariaLabel?: string

  /**
   * Date de dernière modification
   */
  updatedAt: Date
}

/**
 * Type pour la création d'un BenefitItem (champs optionnels avec défauts)
 */
export type BenefitItemInput = Omit<BenefitItem, 'locale' | 'isActive' | 'updatedAt' | 'ariaLabel'> & {
  locale?: string
  isActive?: boolean
  ariaLabel?: string
  updatedAt?: Date
}

/**
 * Type pour la mise à jour partielle d'un BenefitItem
 */
export type BenefitItemUpdate = Partial<Omit<BenefitItem, 'id'>>

/**
 * Type pour une liste de bénéfices (utilisé par BenefitsList)
 */
export type BenefitItemList = BenefitItem[]
