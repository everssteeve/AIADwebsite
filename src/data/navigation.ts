// src/data/navigation.ts

/**
 * @module data/navigation
 * @description Configuration de l'arbre de navigation complet du site AIAD.
 *
 * Ce fichier est la source de vérité unique pour la structure de navigation :
 * - Framework AIAD : 8 chapitres
 * - Mode Opératoire : 8 chapitres
 * - Annexes : 9 catégories, 46 fiches
 *
 * Les données sont validées au chargement par `navigationTreeSchema` (T-004-B2)
 * et l'export principal est gelé pour garantir l'immutabilité.
 *
 * @see {@link ../types/navigation.ts} pour les types TypeScript
 * @see {@link ../schemas/navigation.ts} pour les schémas de validation
 * @see {@link ../../docs/specs/US-004/T-004-B3-configuration-navigation.md} pour cette spécification
 */

import type { NavigationItem, NavigationTree } from '@/types/navigation'
import { navigationTreeSchema } from '@/schemas/navigation'

// ──────────────────────────────────────────────────
// Compteurs de validation
// ──────────────────────────────────────────────────

/**
 * Compteurs attendus pour la validation de l'intégrité des données.
 * Utilisés dans les tests unitaires pour vérifier la complétude.
 */
export const NAVIGATION_COUNTS = {
  /** Nombre de chapitres du Framework */
  FRAMEWORK_CHAPTERS: 8,
  /** Nombre de chapitres du Mode Opératoire */
  MODE_OPERATOIRE_CHAPTERS: 8,
  /** Nombre de catégories d'Annexes */
  ANNEXES_CATEGORIES: 9,
  /** Nombre total de fiches d'Annexes (enfants de toutes les catégories) */
  ANNEXES_FICHES: 46,
  /** Nombre total d'items dans l'arbre (chapitres + catégories + fiches) */
  TOTAL_ITEMS: 71,
} as const

// ──────────────────────────────────────────────────
// Framework AIAD (8 chapitres)
// ──────────────────────────────────────────────────

/**
 * Navigation du Framework AIAD (8 chapitres).
 *
 * Correspond aux fichiers `framework/01-preambule.md` à `framework/08-annexes.md`.
 * Aucun chapitre n'a de sous-pages (items feuilles).
 *
 * @remarks
 * Le Préambule est marqué `badge: 'essential'` car c'est le point d'entrée recommandé.
 */
export const FRAMEWORK_NAV: NavigationItem[] = [
  {
    id: 'fw-preambule',
    label: 'Préambule',
    href: '/framework/preambule',
    section: 'framework',
    order: 1,
    badge: 'essential',
  },
  {
    id: 'fw-vision',
    label: 'Vision & Philosophie',
    href: '/framework/vision-philosophie',
    section: 'framework',
    order: 2,
  },
  {
    id: 'fw-ecosysteme',
    label: 'Écosystème',
    href: '/framework/ecosysteme',
    section: 'framework',
    order: 3,
  },
  {
    id: 'fw-artefacts',
    label: 'Artefacts',
    href: '/framework/artefacts',
    section: 'framework',
    order: 4,
  },
  {
    id: 'fw-boucles',
    label: 'Boucles Itératives',
    href: '/framework/boucles-iteratives',
    section: 'framework',
    order: 5,
  },
  {
    id: 'fw-synchronisations',
    label: 'Synchronisations',
    href: '/framework/synchronisations',
    section: 'framework',
    order: 6,
  },
  {
    id: 'fw-metriques',
    label: 'Métriques',
    href: '/framework/metriques',
    section: 'framework',
    order: 7,
  },
  {
    id: 'fw-annexes',
    label: 'Annexes',
    href: '/framework/annexes',
    section: 'framework',
    order: 8,
  },
]

// ──────────────────────────────────────────────────
// Mode Opératoire (8 chapitres)
// ──────────────────────────────────────────────────

/**
 * Navigation du Mode Opératoire (8 chapitres).
 *
 * Correspond aux fichiers `mode opératoire/00-preambule.md` à `07-annexes.md`.
 * L'order commence à 0 (Préambule) pour refléter la numérotation source.
 *
 * @remarks
 * Le Préambule est marqué `badge: 'essential'` car c'est le point d'entrée recommandé.
 */
export const MODE_OPERATOIRE_NAV: NavigationItem[] = [
  {
    id: 'mo-preambule',
    label: 'Préambule',
    href: '/mode-operatoire/preambule',
    section: 'mode-operatoire',
    order: 0,
    badge: 'essential',
  },
  {
    id: 'mo-initialisation',
    label: 'Initialisation',
    href: '/mode-operatoire/initialisation',
    section: 'mode-operatoire',
    order: 1,
  },
  {
    id: 'mo-planification',
    label: 'Planification',
    href: '/mode-operatoire/planification',
    section: 'mode-operatoire',
    order: 2,
  },
  {
    id: 'mo-developpement',
    label: 'Développement',
    href: '/mode-operatoire/developpement',
    section: 'mode-operatoire',
    order: 3,
  },
  {
    id: 'mo-validation',
    label: 'Validation',
    href: '/mode-operatoire/validation',
    section: 'mode-operatoire',
    order: 4,
  },
  {
    id: 'mo-deploiement',
    label: 'Déploiement',
    href: '/mode-operatoire/deploiement',
    section: 'mode-operatoire',
    order: 5,
  },
  {
    id: 'mo-rituels',
    label: 'Rituels & Amélioration',
    href: '/mode-operatoire/rituels-amelioration',
    section: 'mode-operatoire',
    order: 6,
  },
  {
    id: 'mo-annexes',
    label: 'Annexes',
    href: '/mode-operatoire/annexes',
    section: 'mode-operatoire',
    order: 7,
  },
]

// ──────────────────────────────────────────────────
// Annexes (9 catégories, 46 fiches)
// ──────────────────────────────────────────────────

/**
 * Navigation des Annexes (9 catégories, 46 fiches).
 *
 * Chaque catégorie est un `NavigationItem` avec des `children` (fiches).
 * Les catégories sont ordonnées de A (1) à I (9).
 * Les fiches au sein de chaque catégorie sont ordonnées séquentiellement (1, 2, 3...).
 *
 * @remarks
 * C'est la seule section avec des `children` (profondeur 2).
 * Les `section` des fiches enfants ne sont PAS définis (propagé par les helpers).
 */
export const ANNEXES_NAV: NavigationItem[] = [
  // ── Catégorie A : Templates (6 fiches) ──
  {
    id: 'annexes-a-templates',
    label: 'A - Templates',
    href: '/annexes/templates',
    section: 'annexes',
    order: 1,
    children: [
      { id: 'annexe-a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 },
      { id: 'annexe-a2-architecture', label: 'A2 - Architecture', href: '/annexes/templates/architecture', order: 2 },
      { id: 'annexe-a3-agent-guide', label: 'A3 - Agent Guide', href: '/annexes/templates/agent-guide', order: 3 },
      { id: 'annexe-a4-specs', label: 'A4 - Specs', href: '/annexes/templates/specs', order: 4 },
      { id: 'annexe-a5-dood', label: 'A5 - DoOD', href: '/annexes/templates/dood', order: 5 },
      { id: 'annexe-a6-dooud', label: 'A6 - DoOuD', href: '/annexes/templates/dooud', order: 6 },
    ],
  },

  // ── Catégorie B : Rôles (6 fiches) ──
  {
    id: 'annexes-b-roles',
    label: 'B - Rôles',
    href: '/annexes/roles',
    section: 'annexes',
    order: 2,
    children: [
      { id: 'annexe-b1-product-manager', label: 'B1 - Product Manager', href: '/annexes/roles/product-manager', order: 1 },
      { id: 'annexe-b2-product-engineer', label: 'B2 - Product Engineer', href: '/annexes/roles/product-engineer', order: 2 },
      { id: 'annexe-b3-qa-engineer', label: 'B3 - QA Engineer', href: '/annexes/roles/qa-engineer', order: 3 },
      { id: 'annexe-b4-tech-lead', label: 'B4 - Tech Lead', href: '/annexes/roles/tech-lead', order: 4 },
      { id: 'annexe-b5-supporters', label: 'B5 - Supporters', href: '/annexes/roles/supporters', order: 5 },
      { id: 'annexe-b6-agents-engineer', label: 'B6 - Agents Engineer', href: '/annexes/roles/agents-engineer', order: 6 },
    ],
  },

  // ── Catégorie C : Boucles (5 fiches) ──
  {
    id: 'annexes-c-boucles',
    label: 'C - Boucles',
    href: '/annexes/boucles',
    section: 'annexes',
    order: 3,
    children: [
      { id: 'annexe-c1-initialisation', label: 'C1 - Phase Initialisation', href: '/annexes/boucles/phase-initialisation', order: 1 },
      { id: 'annexe-c2-planifier', label: 'C2 - Boucle Planifier', href: '/annexes/boucles/boucle-planifier', order: 2 },
      { id: 'annexe-c3-implementer', label: 'C3 - Boucle Implémenter', href: '/annexes/boucles/boucle-implementer', order: 3 },
      { id: 'annexe-c4-valider', label: 'C4 - Boucle Valider', href: '/annexes/boucles/boucle-valider', order: 4 },
      { id: 'annexe-c5-integrer', label: 'C5 - Boucle Intégrer', href: '/annexes/boucles/boucle-integrer', order: 5 },
    ],
  },

  // ── Catégorie D : Rituels (5 fiches) ──
  {
    id: 'annexes-d-rituels',
    label: 'D - Rituels',
    href: '/annexes/rituels',
    section: 'annexes',
    order: 4,
    children: [
      { id: 'annexe-d1-alignment', label: 'D1 - Alignment Stratégique', href: '/annexes/rituels/alignment-strategique', order: 1 },
      { id: 'annexe-d2-demo', label: 'D2 - Demo & Feedback', href: '/annexes/rituels/demo-feedback', order: 2 },
      { id: 'annexe-d3-tech-review', label: 'D3 - Tech Review', href: '/annexes/rituels/tech-review', order: 3 },
      { id: 'annexe-d4-retrospective', label: 'D4 - Rétrospective', href: '/annexes/rituels/retrospective', order: 4 },
      { id: 'annexe-d5-standup', label: 'D5 - Standup', href: '/annexes/rituels/standup', order: 5 },
    ],
  },

  // ── Catégorie E : Métriques (2 fiches) ──
  {
    id: 'annexes-e-metriques',
    label: 'E - Métriques',
    href: '/annexes/metriques',
    section: 'annexes',
    order: 5,
    children: [
      { id: 'annexe-e1-dashboards', label: 'E1 - Exemples Dashboards', href: '/annexes/metriques/exemples-dashboards', order: 1 },
      { id: 'annexe-e2-revue', label: 'E2 - Revue Trimestrielle', href: '/annexes/metriques/revue-trimestrielle', order: 2 },
    ],
  },

  // ── Catégorie F : Agents (7 fiches) ──
  {
    id: 'annexes-f-agents',
    label: 'F - Agents',
    href: '/annexes/agents',
    section: 'annexes',
    order: 6,
    children: [
      { id: 'annexe-f1-security', label: 'F1 - Agent Security', href: '/annexes/agents/agent-security', order: 1 },
      { id: 'annexe-f2-quality', label: 'F2 - Agent Quality', href: '/annexes/agents/agent-quality', order: 2 },
      { id: 'annexe-f3-architecture', label: 'F3 - Agent Architecture', href: '/annexes/agents/agent-architecture', order: 3 },
      { id: 'annexe-f4-documentation', label: 'F4 - Agent Documentation', href: '/annexes/agents/agent-documentation', order: 4 },
      { id: 'annexe-f5-performance', label: 'F5 - Agent Performance', href: '/annexes/agents/agent-performance', order: 5 },
      { id: 'annexe-f6-code-review', label: 'F6 - Agent Code Review', href: '/annexes/agents/agent-code-review', order: 6 },
      { id: 'annexe-f7-autres', label: 'F7 - Autres Agents', href: '/annexes/agents/autres-agents', order: 7 },
    ],
  },

  // ── Catégorie G : Configuration (6 fiches) ──
  {
    id: 'annexes-g-configuration',
    label: 'G - Configuration',
    href: '/annexes/configuration',
    section: 'annexes',
    order: 7,
    children: [
      { id: 'annexe-g1-environnement', label: 'G1 - Configuration Environnement', href: '/annexes/configuration/configuration-environnement', order: 1 },
      { id: 'annexe-g2-agents-ia', label: 'G2 - Installation Agents IA', href: '/annexes/configuration/installation-agents-ia', order: 2 },
      { id: 'annexe-g3-ci-cd', label: 'G3 - Setup CI/CD', href: '/annexes/configuration/setup-ci-cd', order: 3 },
      { id: 'annexe-g4-permissions', label: 'G4 - Configuration Permissions', href: '/annexes/configuration/configuration-permissions', order: 4 },
      { id: 'annexe-g5-mcp-plugins', label: 'G5 - Installation MCP Plugins', href: '/annexes/configuration/installation-mcp-plugins', order: 5 },
      { id: 'annexe-g6-subagents', label: 'G6 - Création SubAgents', href: '/annexes/configuration/creation-subagents', order: 6 },
    ],
  },

  // ── Catégorie H : Bonnes Pratiques (5 fiches) ──
  {
    id: 'annexes-h-bonnes-pratiques',
    label: 'H - Bonnes Pratiques',
    href: '/annexes/bonnes-pratiques',
    section: 'annexes',
    order: 8,
    children: [
      { id: 'annexe-h1-prompts', label: 'H1 - Prompts Efficaces', href: '/annexes/bonnes-pratiques/prompts-efficaces', order: 1 },
      { id: 'annexe-h2-patterns', label: 'H2 - Patterns Code', href: '/annexes/bonnes-pratiques/patterns-code', order: 2 },
      { id: 'annexe-h3-anti-patterns', label: 'H3 - Anti-Patterns', href: '/annexes/bonnes-pratiques/anti-patterns', order: 3 },
      { id: 'annexe-h4-cas-usage', label: 'H4 - Cas d\'Usage Specs', href: '/annexes/bonnes-pratiques/cas-usage-specs', order: 4 },
      { id: 'annexe-h5-notes', label: 'H5 - Notes Apprentissage', href: '/annexes/bonnes-pratiques/notes-apprentissage', order: 5 },
    ],
  },

  // ── Catégorie I : Ressources (4 fiches) ──
  {
    id: 'annexes-i-ressources',
    label: 'I - Ressources',
    href: '/annexes/ressources',
    section: 'annexes',
    order: 9,
    children: [
      { id: 'annexe-i1-troubleshooting', label: 'I1 - Troubleshooting', href: '/annexes/ressources/troubleshooting', order: 1 },
      { id: 'annexe-i2-glossaire', label: 'I2 - Glossaire', href: '/annexes/ressources/glossaire', order: 2 },
      { id: 'annexe-i3-bibliographie', label: 'I3 - Bibliographie', href: '/annexes/ressources/bibliographie', order: 3 },
      { id: 'annexe-i4-communaute', label: 'I4 - Communauté', href: '/annexes/ressources/communaute', order: 4 },
    ],
  },
]

// ──────────────────────────────────────────────────
// Export principal validé
// ──────────────────────────────────────────────────

/**
 * Assemblage non validé (interne) avant passage au schéma Zod.
 */
const rawNavigationTree: NavigationTree = {
  framework: FRAMEWORK_NAV,
  modeOperatoire: MODE_OPERATOIRE_NAV,
  annexes: ANNEXES_NAV,
}

/**
 * Arbre de navigation complet du site AIAD.
 *
 * Validé par `navigationTreeSchema.parse()` au chargement du module :
 * - R1 : Profondeur ≤ 4 niveaux
 * - R2 : 71 IDs uniques
 * - R3 : `order` unique parmi les siblings
 *
 * Gelé via `Object.freeze()` pour garantir l'immutabilité runtime.
 *
 * @throws {ZodError} Si les données de navigation sont invalides (fail-fast au build)
 *
 * @example
 * ```typescript
 * import { NAVIGATION_TREE } from '@/data/navigation'
 *
 * // Accès aux chapitres Framework
 * NAVIGATION_TREE.framework.forEach(chapter => {
 *   console.log(chapter.label, chapter.href)
 * })
 *
 * // Accès aux fiches d'une catégorie d'annexe
 * const templates = NAVIGATION_TREE.annexes[0]
 * templates.children?.forEach(fiche => {
 *   console.log(fiche.label, fiche.href)
 * })
 * ```
 */
export const NAVIGATION_TREE: Readonly<NavigationTree> = Object.freeze(
  navigationTreeSchema.parse(rawNavigationTree)
)
