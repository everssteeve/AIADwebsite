// src/types/hero.ts

/**
 * Métadonnées SEO optionnelles pour le hero content
 */
export interface HeroMetadata {
  /** Titre SEO alternatif (max 60 caractères) */
  seoTitle?: string
  /** Meta description pour les moteurs de recherche (max 160 caractères) */
  seoDescription?: string
}

/**
 * Représente le contenu principal de la hero section
 *
 * @example
 * ```typescript
 * const hero: HeroContent = {
 *   id: 'hero-main-fr',
 *   title: 'AIAD : Le framework pour développer avec des agents IA',
 *   tagline: 'Structurez votre collaboration avec l\'IA',
 *   valueProposition: 'Une méthodologie éprouvée pour intégrer les agents IA.',
 *   locale: 'fr',
 *   isActive: true,
 *   updatedAt: new Date('2026-01-26'),
 * }
 * ```
 *
 * @see {@link https://docs.example.com/PRD#us-001 | US-001}
 */
export interface HeroContent {
  /**
   * Identifiant unique slug-friendly
   * @pattern ^[a-z0-9-]+$
   * @minLength 3
   * @maxLength 50
   */
  id: string

  /**
   * Titre principal affiché en H1
   * Doit contenir "AIAD" pour la cohérence branding
   * @minLength 10
   * @maxLength 80
   */
  title: string

  /**
   * Accroche courte et percutante sous le titre
   * Ne doit pas répéter le contenu du titre
   * @minLength 10
   * @maxLength 120
   */
  tagline: string

  /**
   * Description de la proposition de valeur principale
   * Doit être une phrase complète (terminer par un point)
   * @minLength 20
   * @maxLength 200
   */
  valueProposition: string

  /**
   * Code langue ISO 639-1
   * @default "fr"
   */
  locale: string

  /**
   * Indique si ce contenu est actif (publié) ou en brouillon
   * @default true
   */
  isActive: boolean

  /**
   * Métadonnées SEO optionnelles
   */
  metadata?: HeroMetadata

  /**
   * Date de dernière modification
   * Utilisée pour le cache busting et l'affichage
   */
  updatedAt: Date
}

/**
 * Type pour la création d'un HeroContent (champs optionnels avec défauts)
 */
export type HeroContentInput = Omit<HeroContent, 'locale' | 'isActive' | 'updatedAt'> & {
  locale?: string
  isActive?: boolean
  updatedAt?: Date
}

/**
 * Type pour la mise à jour partielle d'un HeroContent
 */
export type HeroContentUpdate = Partial<Omit<HeroContent, 'id'>>
