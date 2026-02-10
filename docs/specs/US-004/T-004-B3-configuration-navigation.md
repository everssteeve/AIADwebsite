# T-004-B3 : Créer la configuration de navigation (arbre hiérarchique)

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.1 |
| **Date** | 10 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dépendances** | T-004-B1 (Types TypeScript navigation), T-004-B2 (Schémas Zod navigation) |
| **Bloque** | T-004-B4 (Helpers navigation), T-004-F3 (DropdownMenu), T-004-F4 (Header), T-004-F5 (MobileMenu), T-004-F9 (Sidebar) |

---

## 1. Objectif

Créer le fichier de configuration de navigation qui définit l'arbre hiérarchique complet du site AIAD, en garantissant :

- **Source de vérité unique** : Un seul fichier centralise toute la structure de navigation (Framework 8 chapitres + Mode Opératoire 8 chapitres + Annexes 9 catégories / 46 fiches)
- **Validation à l'import** : Les données sont validées via le `navigationTreeSchema` Zod (T-004-B2) dès le chargement du module
- **Type-safety** : Le fichier exporte un objet typé `NavigationTree` conforme aux types T-004-B1
- **Maintenabilité** : Structure lisible, commentée, facilement extensible pour l'ajout de nouveaux chapitres ou fiches
- **Cohérence avec le contenu** : Les `href` correspondent aux routes Astro prévues, les `id` suivent la convention slug-friendly

---

## 2. Contexte technique

### 2.1 Architecture cible

D'après [ARCHITECTURE.md](../../ARCHITECTURE.md) et les conventions du projet :

- **Astro 4.x** avec file-based routing (`src/pages/`)
- **TypeScript 5.x** en mode strict
- **Zod 3.x** pour la validation runtime via `navigationTreeSchema` (T-004-B2)
- Types définis dans `src/types/navigation.ts` (T-004-B1)
- Schémas définis dans `src/schemas/navigation.ts` (T-004-B2)

### 2.2 Positionnement dans l'arborescence

```
src/
├── types/
│   └── navigation.ts       # Existant (T-004-B1) — types NavigationItem, NavigationTree
├── schemas/
│   └── navigation.ts       # Existant (T-004-B2) — navigationTreeSchema
├── data/
│   └── navigation.ts       # ← NOUVEAU - Configuration arbre de navigation
└── lib/
    └── navigation.ts       # À venir (T-004-B4) — helpers consommant la config
```

### 2.3 Conventions suivies

Conformément aux données existantes (`src/data/hero-content.ts`, `src/data/benefits.ts`) :

| Convention | Détail |
|-----------|--------|
| Nommage fichier | kebab-case dans `src/data/` |
| Export principal | `const` nommée en SCREAMING_SNAKE_CASE (`NAVIGATION_TREE`) |
| Export secondaires | Constantes intermédiaires pour chaque section (`FRAMEWORK_NAV`, etc.) |
| Validation | Appel `schema.parse()` à l'export pour fail-fast au build |
| JSDoc | `@module`, `@description`, `@remarks`, `@example` sur chaque export |
| Messages d'erreur | En français, via les constantes `NAVIGATION_ERRORS` de T-004-B2 |

### 2.4 Relation avec les fichiers source du contenu

La configuration de navigation fait le mapping entre les fichiers source Markdown et les routes du site :

| Section | Fichiers source | Route pattern | Exemple |
|---------|----------------|---------------|---------|
| Framework | `framework/01-preambule.md` à `08-annexes.md` | `/framework/{slug}` | `/framework/preambule` |
| Mode Opératoire | `mode opératoire/00-preambule.md` à `07-annexes.md` | `/mode-operatoire/{slug}` | `/mode-operatoire/initialisation` |
| Annexes (catégorie) | — (pages index) | `/annexes/{category}` | `/annexes/templates` |
| Annexes (fiche) | `annexes/A1-prd.md`, etc. | `/annexes/{category}/{fiche}` | `/annexes/templates/prd` |

---

## 3. Spécifications fonctionnelles

### 3.1 Inventaire des données à configurer

Le fichier doit définir un `NavigationTree` contenant exactement :

#### 3.1.1 Framework AIAD (8 chapitres)

| Order | ID | Label | Href | Badge |
|-------|----|-------|------|-------|
| 1 | `fw-preambule` | Préambule | `/framework/preambule` | `essential` |
| 2 | `fw-vision` | Vision & Philosophie | `/framework/vision-philosophie` | — |
| 3 | `fw-ecosysteme` | Écosystème | `/framework/ecosysteme` | — |
| 4 | `fw-artefacts` | Artefacts | `/framework/artefacts` | — |
| 5 | `fw-boucles` | Boucles Itératives | `/framework/boucles-iteratives` | — |
| 6 | `fw-synchronisations` | Synchronisations | `/framework/synchronisations` | — |
| 7 | `fw-metriques` | Métriques | `/framework/metriques` | — |
| 8 | `fw-annexes` | Annexes | `/framework/annexes` | — |

#### 3.1.2 Mode Opératoire (8 chapitres)

| Order | ID | Label | Href | Badge |
|-------|----|-------|------|-------|
| 0 | `mo-preambule` | Préambule | `/mode-operatoire/preambule` | `essential` |
| 1 | `mo-initialisation` | Initialisation | `/mode-operatoire/initialisation` | — |
| 2 | `mo-planification` | Planification | `/mode-operatoire/planification` | — |
| 3 | `mo-developpement` | Développement | `/mode-operatoire/developpement` | — |
| 4 | `mo-validation` | Validation | `/mode-operatoire/validation` | — |
| 5 | `mo-deploiement` | Déploiement | `/mode-operatoire/deploiement` | — |
| 6 | `mo-rituels` | Rituels & Amélioration | `/mode-operatoire/rituels-amelioration` | — |
| 7 | `mo-annexes` | Annexes | `/mode-operatoire/annexes` | — |

#### 3.1.3 Annexes (9 catégories, 46 fiches)

**Catégorie A — Templates (6 fiches)**

| Order | ID (catégorie) | ID (fiche) | Label | Href |
|-------|---------------|------------|-------|------|
| 1 | `annexes-a-templates` | — | A - Templates | `/annexes/templates` |
| — | — | `annexe-a1-prd` | A1 - PRD | `/annexes/templates/prd` |
| — | — | `annexe-a2-architecture` | A2 - Architecture | `/annexes/templates/architecture` |
| — | — | `annexe-a3-agent-guide` | A3 - Agent Guide | `/annexes/templates/agent-guide` |
| — | — | `annexe-a4-specs` | A4 - Specs | `/annexes/templates/specs` |
| — | — | `annexe-a5-dood` | A5 - DoOD | `/annexes/templates/dood` |
| — | — | `annexe-a6-dooud` | A6 - DoOuD | `/annexes/templates/dooud` |

**Catégorie B — Rôles (6 fiches)**

| Order | ID (catégorie) | ID (fiche) | Label | Href |
|-------|---------------|------------|-------|------|
| 2 | `annexes-b-roles` | — | B - Rôles | `/annexes/roles` |
| — | — | `annexe-b1-product-manager` | B1 - Product Manager | `/annexes/roles/product-manager` |
| — | — | `annexe-b2-product-engineer` | B2 - Product Engineer | `/annexes/roles/product-engineer` |
| — | — | `annexe-b3-qa-engineer` | B3 - QA Engineer | `/annexes/roles/qa-engineer` |
| — | — | `annexe-b4-tech-lead` | B4 - Tech Lead | `/annexes/roles/tech-lead` |
| — | — | `annexe-b5-supporters` | B5 - Supporters | `/annexes/roles/supporters` |
| — | — | `annexe-b6-agents-engineer` | B6 - Agents Engineer | `/annexes/roles/agents-engineer` |

**Catégorie C — Boucles (5 fiches)**

| Order | ID (catégorie) | ID (fiche) | Label | Href |
|-------|---------------|------------|-------|------|
| 3 | `annexes-c-boucles` | — | C - Boucles | `/annexes/boucles` |
| — | — | `annexe-c1-initialisation` | C1 - Phase Initialisation | `/annexes/boucles/phase-initialisation` |
| — | — | `annexe-c2-planifier` | C2 - Boucle Planifier | `/annexes/boucles/boucle-planifier` |
| — | — | `annexe-c3-implementer` | C3 - Boucle Implémenter | `/annexes/boucles/boucle-implementer` |
| — | — | `annexe-c4-valider` | C4 - Boucle Valider | `/annexes/boucles/boucle-valider` |
| — | — | `annexe-c5-integrer` | C5 - Boucle Intégrer | `/annexes/boucles/boucle-integrer` |

**Catégorie D — Rituels (5 fiches)**

| Order | ID (catégorie) | ID (fiche) | Label | Href |
|-------|---------------|------------|-------|------|
| 4 | `annexes-d-rituels` | — | D - Rituels | `/annexes/rituels` |
| — | — | `annexe-d1-alignment` | D1 - Alignment Stratégique | `/annexes/rituels/alignment-strategique` |
| — | — | `annexe-d2-demo` | D2 - Demo & Feedback | `/annexes/rituels/demo-feedback` |
| — | — | `annexe-d3-tech-review` | D3 - Tech Review | `/annexes/rituels/tech-review` |
| — | — | `annexe-d4-retrospective` | D4 - Rétrospective | `/annexes/rituels/retrospective` |
| — | — | `annexe-d5-standup` | D5 - Standup | `/annexes/rituels/standup` |

**Catégorie E — Métriques (2 fiches)**

| Order | ID (catégorie) | ID (fiche) | Label | Href |
|-------|---------------|------------|-------|------|
| 5 | `annexes-e-metriques` | — | E - Métriques | `/annexes/metriques` |
| — | — | `annexe-e1-dashboards` | E1 - Exemples Dashboards | `/annexes/metriques/exemples-dashboards` |
| — | — | `annexe-e2-revue` | E2 - Revue Trimestrielle | `/annexes/metriques/revue-trimestrielle` |

**Catégorie F — Agents (7 fiches)**

| Order | ID (catégorie) | ID (fiche) | Label | Href |
|-------|---------------|------------|-------|------|
| 6 | `annexes-f-agents` | — | F - Agents | `/annexes/agents` |
| — | — | `annexe-f1-security` | F1 - Agent Security | `/annexes/agents/agent-security` |
| — | — | `annexe-f2-quality` | F2 - Agent Quality | `/annexes/agents/agent-quality` |
| — | — | `annexe-f3-architecture` | F3 - Agent Architecture | `/annexes/agents/agent-architecture` |
| — | — | `annexe-f4-documentation` | F4 - Agent Documentation | `/annexes/agents/agent-documentation` |
| — | — | `annexe-f5-performance` | F5 - Agent Performance | `/annexes/agents/agent-performance` |
| — | — | `annexe-f6-code-review` | F6 - Agent Code Review | `/annexes/agents/agent-code-review` |
| — | — | `annexe-f7-autres` | F7 - Autres Agents | `/annexes/agents/autres-agents` |

**Catégorie G — Configuration (6 fiches)**

| Order | ID (catégorie) | ID (fiche) | Label | Href |
|-------|---------------|------------|-------|------|
| 7 | `annexes-g-configuration` | — | G - Configuration | `/annexes/configuration` |
| — | — | `annexe-g1-environnement` | G1 - Configuration Environnement | `/annexes/configuration/configuration-environnement` |
| — | — | `annexe-g2-agents-ia` | G2 - Installation Agents IA | `/annexes/configuration/installation-agents-ia` |
| — | — | `annexe-g3-ci-cd` | G3 - Setup CI/CD | `/annexes/configuration/setup-ci-cd` |
| — | — | `annexe-g4-permissions` | G4 - Configuration Permissions | `/annexes/configuration/configuration-permissions` |
| — | — | `annexe-g5-mcp-plugins` | G5 - Installation MCP Plugins | `/annexes/configuration/installation-mcp-plugins` |
| — | — | `annexe-g6-subagents` | G6 - Création SubAgents | `/annexes/configuration/creation-subagents` |

**Catégorie H — Bonnes Pratiques (5 fiches)**

| Order | ID (catégorie) | ID (fiche) | Label | Href |
|-------|---------------|------------|-------|------|
| 8 | `annexes-h-bonnes-pratiques` | — | H - Bonnes Pratiques | `/annexes/bonnes-pratiques` |
| — | — | `annexe-h1-prompts` | H1 - Prompts Efficaces | `/annexes/bonnes-pratiques/prompts-efficaces` |
| — | — | `annexe-h2-patterns` | H2 - Patterns Code | `/annexes/bonnes-pratiques/patterns-code` |
| — | — | `annexe-h3-anti-patterns` | H3 - Anti-Patterns | `/annexes/bonnes-pratiques/anti-patterns` |
| — | — | `annexe-h4-cas-usage` | H4 - Cas d'Usage Specs | `/annexes/bonnes-pratiques/cas-usage-specs` |
| — | — | `annexe-h5-notes` | H5 - Notes Apprentissage | `/annexes/bonnes-pratiques/notes-apprentissage` |

**Catégorie I — Ressources (4 fiches)**

| Order | ID (catégorie) | ID (fiche) | Label | Href |
|-------|---------------|------------|-------|------|
| 9 | `annexes-i-ressources` | — | I - Ressources | `/annexes/ressources` |
| — | — | `annexe-i1-troubleshooting` | I1 - Troubleshooting | `/annexes/ressources/troubleshooting` |
| — | — | `annexe-i2-glossaire` | I2 - Glossaire | `/annexes/ressources/glossaire` |
| — | — | `annexe-i3-bibliographie` | I3 - Bibliographie | `/annexes/ressources/bibliographie` |
| — | — | `annexe-i4-communaute` | I4 - Communauté | `/annexes/ressources/communaute` |

### 3.2 Compteurs de validation

| Section | Chapitres/catégories | Fiches enfants | Total items |
|---------|---------------------|---------------|-------------|
| Framework | 8 | 0 | 8 |
| Mode Opératoire | 8 | 0 | 8 |
| Annexes | 9 | 46 | 55 |
| **Total** | **25** | **46** | **71** |

### 3.3 Règles métier

| ID | Règle | Implémentation | Validation |
|----|-------|----------------|------------|
| R-B3-01 | Chaque `id` doit être unique dans tout l'arbre (71 IDs distincts) | Convention de nommage : `fw-`, `mo-`, `annexes-`, `annexe-` | `navigationTreeSchema` (R2) |
| R-B3-02 | Chaque `href` doit correspondre à une route Astro existante ou prévue | Convention `/section/slug` | Vérification manuelle + tests E2E (T-004-T8) |
| R-B3-03 | Les `order` doivent être uniques parmi les siblings de chaque section | Order séquentiel 1-8 / 0-7 / 1-9 | `navigationTreeSchema` (R3) |
| R-B3-04 | Les fiches d'une catégorie d'annexe ont un `order` séquentiel 1..N | Order 1 à 6/5/7 selon la catégorie | `navigationTreeSchema` (R3) |
| R-B3-05 | L'arbre ne dépasse pas 3 niveaux de profondeur (section → catégorie → fiche) | Max depth = 2 dans les données (bien sous le max de 4) | `navigationTreeSchema` (R1) |
| R-B3-06 | Les items Framework et Mode Opératoire n'ont pas de `children` | Chapitres = feuilles | Structure des données |
| R-B3-07 | Seules les catégories d'Annexes ont des `children` | 9 catégories avec 2 à 7 fiches chacune | Structure des données |
| R-B3-08 | La propriété `section` est définie uniquement au niveau 1 (chapitres/catégories) | `section: 'framework'`, `section: 'mode-operatoire'`, `section: 'annexes'` | Convention dans les données |
| R-B3-09 | La validation Zod est exécutée au moment de l'export (fail-fast) | `navigationTreeSchema.parse(rawTree)` | Erreur au build si données invalides |
| R-B3-10 | L'export est un objet gelé (`Object.freeze`) pour éviter les mutations | `Object.freeze(NAVIGATION_TREE)` | Immutabilité runtime |

### 3.4 Convention de nommage des IDs

| Préfixe | Usage | Exemple |
|---------|-------|---------|
| `fw-` | Chapitre Framework | `fw-preambule`, `fw-vision` |
| `mo-` | Chapitre Mode Opératoire | `mo-preambule`, `mo-initialisation` |
| `annexes-{lettre}-` | Catégorie d'annexe | `annexes-a-templates`, `annexes-b-roles` |
| `annexe-{lettre}{n}-` | Fiche d'annexe | `annexe-a1-prd`, `annexe-b2-product-engineer` |

### 3.5 Convention des URLs (href)

| Pattern | Usage | Exemple |
|---------|-------|---------|
| `/framework/{slug}` | Chapitre Framework | `/framework/preambule` |
| `/mode-operatoire/{slug}` | Chapitre Mode Opératoire | `/mode-operatoire/initialisation` |
| `/annexes/{category}` | Page index catégorie | `/annexes/templates` |
| `/annexes/{category}/{fiche}` | Fiche d'annexe | `/annexes/templates/prd` |

---

## 4. Spécifications techniques

### 4.1 Constantes de comptage (pour assertions dans les tests)

```typescript
// src/data/navigation.ts

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
```

### 4.2 Configuration Framework

```typescript
import type { NavigationItem } from '@/types/navigation'

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
```

### 4.3 Configuration Mode Opératoire

```typescript
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
```

### 4.4 Configuration Annexes

```typescript
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
```

### 4.5 Export principal validé

```typescript
import type { NavigationTree } from '@/types/navigation'
import { navigationTreeSchema } from '@/schemas/navigation'

/**
 * Arbre de navigation complet validé, servant de source de vérité unique.
 *
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
 * - R1 : Profondeur ≤ 4 niveaux ✅
 * - R2 : 71 IDs uniques ✅
 * - R3 : `order` unique parmi les siblings ✅
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
```

### 4.6 Export barrel

```typescript
// src/data/navigation.ts - exports résumé

export { NAVIGATION_COUNTS }    // Compteurs pour les tests
export { FRAMEWORK_NAV }        // Section Framework (8 chapitres)
export { MODE_OPERATOIRE_NAV }  // Section Mode Opératoire (8 chapitres)
export { ANNEXES_NAV }          // Section Annexes (9 catégories, 46 fiches)
export { NAVIGATION_TREE }      // Arbre complet validé et gelé (export principal)
```

### 4.7 Fichier complet attendu

```typescript
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

export const NAVIGATION_COUNTS = {
  FRAMEWORK_CHAPTERS: 8,
  MODE_OPERATOIRE_CHAPTERS: 8,
  ANNEXES_CATEGORIES: 9,
  ANNEXES_FICHES: 46,
  TOTAL_ITEMS: 71,
} as const

// ──────────────────────────────────────────────────
// Framework AIAD (8 chapitres)
// ──────────────────────────────────────────────────

export const FRAMEWORK_NAV: NavigationItem[] = [
  // ... (cf. section 4.2)
]

// ──────────────────────────────────────────────────
// Mode Opératoire (8 chapitres)
// ──────────────────────────────────────────────────

export const MODE_OPERATOIRE_NAV: NavigationItem[] = [
  // ... (cf. section 4.3)
]

// ──────────────────────────────────────────────────
// Annexes (9 catégories, 46 fiches)
// ──────────────────────────────────────────────────

export const ANNEXES_NAV: NavigationItem[] = [
  // ... (cf. section 4.4)
]

// ──────────────────────────────────────────────────
// Export principal validé
// ──────────────────────────────────────────────────

const rawNavigationTree: NavigationTree = {
  framework: FRAMEWORK_NAV,
  modeOperatoire: MODE_OPERATOIRE_NAV,
  annexes: ANNEXES_NAV,
}

export const NAVIGATION_TREE: Readonly<NavigationTree> = Object.freeze(
  navigationTreeSchema.parse(rawNavigationTree)
)
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas limites identifiés

| ID | Cas limite | Comportement attendu | Responsable |
|----|------------|---------------------|-------------|
| CL-01 | ID dupliqué dans l'arbre (ex: `fw-preambule` utilisé deux fois) | ❌ `ZodError` au build : `TREE_DUPLICATE_ID` | `navigationTreeSchema` (T-004-B2) |
| CL-02 | Deux siblings avec le même `order` (ex: deux chapitres Framework avec `order: 1`) | ❌ `ZodError` au build : `TREE_DUPLICATE_ORDER` | `navigationTreeSchema` (T-004-B2) |
| CL-03 | `href` ne commençant pas par `/` (ex: `framework/preambule`) | ❌ `ZodError` au build : `HREF_START_SLASH` | `navigationItemSchema` (T-004-B2) |
| CL-04 | `id` avec majuscules (ex: `FW-Preambule`) | ❌ `ZodError` au build : `ID_PATTERN` | `navigationItemSchema` (T-004-B2) |
| CL-05 | `label` vide (`""`) | ❌ `ZodError` au build : `LABEL_MIN_LENGTH` | `navigationItemSchema` (T-004-B2) |
| CL-06 | `order` négatif (ex: `-1`) | ❌ `ZodError` au build : `ORDER_NONNEGATIVE` | `navigationItemSchema` (T-004-B2) |
| CL-07 | Catégorie d'annexe avec `children: []` (pas de fiches) | ✅ Accepté structurellement, mais constitue une anomalie de données | Test d'avertissement |
| CL-08 | Ajout d'un nouveau chapitre Framework (9ème) | ✅ Ajout dans `FRAMEWORK_NAV` + mise à jour `NAVIGATION_COUNTS` | Maintenabilité |
| CL-09 | Ajout d'une nouvelle catégorie d'Annexes (J) | ✅ Ajout dans `ANNEXES_NAV` + mise à jour `NAVIGATION_COUNTS` | Maintenabilité |
| CL-10 | Ajout d'une fiche dans une catégorie existante | ✅ Ajout dans `children` + mise à jour `NAVIGATION_COUNTS.ANNEXES_FICHES` | Maintenabilité |
| CL-11 | Mutation de `NAVIGATION_TREE` après import | ❌ `TypeError` (objet gelé via `Object.freeze`) | `Object.freeze()` |
| CL-12 | Label avec caractères spéciaux (accents, `&`, apostrophes) | ✅ Accepté : `'Rituels & Amélioration'`, `'Cas d\'Usage Specs'` | UTF-8, HTML encoding au render |
| CL-13 | `href` avec URL externe (`https://...`) | ❌ `ZodError` au build : `HREF_NO_EXTERNAL` | `navigationItemSchema` (T-004-B2) |
| CL-14 | Profondeur > 2 dans les annexes (ex: fiche avec des enfants) | ✅ Structurellement possible mais non prévu. Max depth = 2, bien sous la limite de 4 | `navigationTreeSchema` (R1) |
| CL-15 | `section` défini sur une fiche enfant d'annexe | ✅ Accepté mais non recommandé (convention : `section` au niveau 1 uniquement) | Convention documentée |
| CL-16 | Import du module échoue (données invalides) | ❌ L'application ne démarre pas — fail-fast au build Astro | `navigationTreeSchema.parse()` |
| CL-17 | `badge` sur une fiche d'annexe enfant | ✅ Accepté : utile pour marquer `'new'` sur une fiche récemment ajoutée | Structure des données |

### 5.2 Stratégie de gestion d'erreurs

| Scénario | Stratégie | Détail |
|----------|-----------|--------|
| Données invalides au build | **Fail-fast** | `navigationTreeSchema.parse()` lève une `ZodError` au chargement du module, bloquant le build Astro |
| Données invalides en dev | **Erreur visible** | L'erreur Zod est affichée dans la console du serveur de développement avec le message en français |
| Mutation runtime | **Object.freeze** | `NAVIGATION_TREE` est gelé, toute tentative de modification lève un `TypeError` |
| Désynchronisation routes | **Tests E2E** | Les tests T-004-T8 vérifient que chaque `href` correspond à une route accessible |

---

## 6. Exemples entrée/sortie

### 6.1 Import et utilisation de l'arbre complet

```typescript
// Dans un composant Astro (Header, Sidebar, etc.)
import { NAVIGATION_TREE } from '@/data/navigation'

// Accès aux chapitres Framework
const frameworkChapters = NAVIGATION_TREE.framework
// → NavigationItem[] (8 éléments)

// Premier chapitre
console.log(frameworkChapters[0])
// → { id: 'fw-preambule', label: 'Préambule', href: '/framework/preambule', section: 'framework', order: 1, badge: 'essential' }

// Nombre de catégories d'annexes
console.log(NAVIGATION_TREE.annexes.length)
// → 9
```

### 6.2 Accès aux fiches d'une catégorie d'annexe

```typescript
import { NAVIGATION_TREE } from '@/data/navigation'

// Catégorie A - Templates
const templates = NAVIGATION_TREE.annexes.find(cat => cat.id === 'annexes-a-templates')

console.log(templates?.label)
// → 'A - Templates'

console.log(templates?.children?.length)
// → 6

console.log(templates?.children?.[0])
// → { id: 'annexe-a1-prd', label: 'A1 - PRD', href: '/annexes/templates/prd', order: 1 }
```

### 6.3 Utilisation des compteurs pour les tests

```typescript
import { NAVIGATION_TREE, NAVIGATION_COUNTS } from '@/data/navigation'

// Vérification de complétude
expect(NAVIGATION_TREE.framework).toHaveLength(NAVIGATION_COUNTS.FRAMEWORK_CHAPTERS)
// → 8 === 8 ✅

expect(NAVIGATION_TREE.modeOperatoire).toHaveLength(NAVIGATION_COUNTS.MODE_OPERATOIRE_CHAPTERS)
// → 8 === 8 ✅

expect(NAVIGATION_TREE.annexes).toHaveLength(NAVIGATION_COUNTS.ANNEXES_CATEGORIES)
// → 9 === 9 ✅

// Comptage des fiches
const totalFiches = NAVIGATION_TREE.annexes.reduce(
  (count, cat) => count + (cat.children?.length ?? 0),
  0
)
expect(totalFiches).toBe(NAVIGATION_COUNTS.ANNEXES_FICHES)
// → 46 === 46 ✅
```

### 6.4 Tentative de mutation (bloquée)

```typescript
import { NAVIGATION_TREE } from '@/data/navigation'

// ❌ TypeError: Cannot assign to read only property 'framework' of object '#<Object>'
NAVIGATION_TREE.framework = []

// ❌ TypeError: Cannot add property newField, object is not extensible
;(NAVIGATION_TREE as any).newField = 'test'
```

### 6.5 Erreur de validation au build (données invalides)

```typescript
// Si on avait un ID dupliqué dans les données :
// id: 'fw-preambule' utilisé deux fois
// → ZodError: Chaque ID de navigation doit être unique dans tout l'arbre (règle R2)

// Si on avait un href invalide :
// href: 'framework/preambule' (sans slash initial)
// → ZodError: Le chemin doit commencer par '/'
```

### 6.6 Utilisation avec les helpers (T-004-B4, usage futur)

```typescript
import { NAVIGATION_TREE } from '@/data/navigation'
import { flattenNav, getBreadcrumbs, getPrevNext } from '@/lib/navigation'

// Aplatir l'arbre pour la navigation séquentielle
const flatNav = flattenNav(NAVIGATION_TREE)
// → FlatNavigationItem[] (71 éléments, sans les catégories dont seules les fiches comptent)

// Générer le breadcrumb pour une page
const breadcrumbs = getBreadcrumbs(NAVIGATION_TREE, '/annexes/templates/prd')
// → [
//     { label: 'Accueil', href: '/' },
//     { label: 'Annexes', href: '/annexes' },
//     { label: 'A - Templates', href: '/annexes/templates' },
//     { label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true },
//   ]

// Obtenir les liens prev/next
const prevNext = getPrevNext(NAVIGATION_TREE, '/framework/artefacts')
// → {
//     prev: { label: 'Écosystème', href: '/framework/ecosysteme', section: 'framework' },
//     next: { label: 'Boucles Itératives', href: '/framework/boucles-iteratives', section: 'framework' },
//   }
```

---

## 7. Tests

### 7.1 Fichier de test

**Emplacement :** `tests/unit/data/navigation.test.ts`

### 7.2 Suite de tests

```typescript
// tests/unit/data/navigation.test.ts

import { describe, it, expect } from 'vitest'
import {
  NAVIGATION_TREE,
  NAVIGATION_COUNTS,
  FRAMEWORK_NAV,
  MODE_OPERATOIRE_NAV,
  ANNEXES_NAV,
} from '@/data/navigation'
import { navigationTreeSchema } from '@/schemas/navigation'
import type { NavigationItem, NavigationTree } from '@/types/navigation'

// ──────────────────────────────────────────────────
// Helpers de test
// ──────────────────────────────────────────────────

/**
 * Collecte récursivement tous les IDs d'un tableau de NavigationItem.
 */
function collectAllIds(items: NavigationItem[]): string[] {
  const ids: string[] = []
  function walk(nodes: NavigationItem[]) {
    for (const node of nodes) {
      ids.push(node.id)
      if (node.children) walk(node.children)
    }
  }
  walk(items)
  return ids
}

/**
 * Collecte récursivement tous les hrefs d'un tableau de NavigationItem.
 */
function collectAllHrefs(items: NavigationItem[]): string[] {
  const hrefs: string[] = []
  function walk(nodes: NavigationItem[]) {
    for (const node of nodes) {
      hrefs.push(node.href)
      if (node.children) walk(node.children)
    }
  }
  walk(items)
  return hrefs
}

/**
 * Compte le nombre total d'items (récursif) dans un tableau de NavigationItem.
 */
function countItems(items: NavigationItem[]): number {
  let count = 0
  function walk(nodes: NavigationItem[]) {
    for (const node of nodes) {
      count++
      if (node.children) walk(node.children)
    }
  }
  walk(items)
  return count
}

// ──────────────────────────────────────────────────
// Tests de validation Zod
// ──────────────────────────────────────────────────

describe('Validation Zod de NAVIGATION_TREE', () => {
  it('passe la validation navigationTreeSchema sans erreur', () => {
    expect(() => navigationTreeSchema.parse({
      framework: FRAMEWORK_NAV,
      modeOperatoire: MODE_OPERATOIRE_NAV,
      annexes: ANNEXES_NAV,
    })).not.toThrow()
  })

  it('NAVIGATION_TREE est le résultat de navigationTreeSchema.parse()', () => {
    const parsed = navigationTreeSchema.parse({
      framework: FRAMEWORK_NAV,
      modeOperatoire: MODE_OPERATOIRE_NAV,
      annexes: ANNEXES_NAV,
    })
    expect(NAVIGATION_TREE.framework).toEqual(parsed.framework)
    expect(NAVIGATION_TREE.modeOperatoire).toEqual(parsed.modeOperatoire)
    expect(NAVIGATION_TREE.annexes).toEqual(parsed.annexes)
  })
})

// ──────────────────────────────────────────────────
// Tests de complétude (compteurs)
// ──────────────────────────────────────────────────

describe('Complétude des données de navigation', () => {
  it('Framework contient exactement 8 chapitres', () => {
    expect(NAVIGATION_TREE.framework).toHaveLength(NAVIGATION_COUNTS.FRAMEWORK_CHAPTERS)
    expect(NAVIGATION_TREE.framework).toHaveLength(8)
  })

  it('Mode Opératoire contient exactement 8 chapitres', () => {
    expect(NAVIGATION_TREE.modeOperatoire).toHaveLength(NAVIGATION_COUNTS.MODE_OPERATOIRE_CHAPTERS)
    expect(NAVIGATION_TREE.modeOperatoire).toHaveLength(8)
  })

  it('Annexes contient exactement 9 catégories', () => {
    expect(NAVIGATION_TREE.annexes).toHaveLength(NAVIGATION_COUNTS.ANNEXES_CATEGORIES)
    expect(NAVIGATION_TREE.annexes).toHaveLength(9)
  })

  it('les catégories d\'annexes contiennent exactement 46 fiches au total', () => {
    const totalFiches = NAVIGATION_TREE.annexes.reduce(
      (count, cat) => count + (cat.children?.length ?? 0),
      0
    )
    expect(totalFiches).toBe(NAVIGATION_COUNTS.ANNEXES_FICHES)
    expect(totalFiches).toBe(46)
  })

  it('le nombre total d\'items dans l\'arbre est 71', () => {
    const total = countItems([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    expect(total).toBe(NAVIGATION_COUNTS.TOTAL_ITEMS)
    expect(total).toBe(71)
  })

  describe('nombre de fiches par catégorie d\'annexe', () => {
    const expectedFiches: Record<string, number> = {
      'annexes-a-templates': 6,
      'annexes-b-roles': 6,
      'annexes-c-boucles': 5,
      'annexes-d-rituels': 5,
      'annexes-e-metriques': 2,
      'annexes-f-agents': 7,
      'annexes-g-configuration': 6,
      'annexes-h-bonnes-pratiques': 5,
      'annexes-i-ressources': 4,
    }

    for (const [categoryId, expectedCount] of Object.entries(expectedFiches)) {
      it(`catégorie ${categoryId} contient ${expectedCount} fiches`, () => {
        const category = NAVIGATION_TREE.annexes.find(c => c.id === categoryId)
        expect(category).toBeDefined()
        expect(category?.children).toHaveLength(expectedCount)
      })
    }
  })
})

// ──────────────────────────────────────────────────
// Tests d'unicité
// ──────────────────────────────────────────────────

describe('Unicité des données', () => {
  it('tous les IDs sont uniques dans tout l\'arbre (71 IDs distincts)', () => {
    const allIds = collectAllIds([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    expect(allIds).toHaveLength(NAVIGATION_COUNTS.TOTAL_ITEMS)
    expect(new Set(allIds).size).toBe(allIds.length)
  })

  it('tous les hrefs sont uniques dans tout l\'arbre', () => {
    const allHrefs = collectAllHrefs([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    expect(new Set(allHrefs).size).toBe(allHrefs.length)
  })

  it('les order sont uniques parmi les siblings de chaque section', () => {
    // Framework
    const fwOrders = NAVIGATION_TREE.framework.map(i => i.order)
    expect(new Set(fwOrders).size).toBe(fwOrders.length)

    // Mode Opératoire
    const moOrders = NAVIGATION_TREE.modeOperatoire.map(i => i.order)
    expect(new Set(moOrders).size).toBe(moOrders.length)

    // Annexes (catégories)
    const annexeOrders = NAVIGATION_TREE.annexes.map(i => i.order)
    expect(new Set(annexeOrders).size).toBe(annexeOrders.length)

    // Annexes (fiches par catégorie)
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        const ficheOrders = category.children.map(i => i.order)
        expect(new Set(ficheOrders).size).toBe(ficheOrders.length)
      }
    }
  })
})

// ──────────────────────────────────────────────────
// Tests de convention de nommage
// ──────────────────────────────────────────────────

describe('Convention de nommage des IDs', () => {
  it('les IDs Framework commencent par "fw-"', () => {
    for (const item of NAVIGATION_TREE.framework) {
      expect(item.id).toMatch(/^fw-/)
    }
  })

  it('les IDs Mode Opératoire commencent par "mo-"', () => {
    for (const item of NAVIGATION_TREE.modeOperatoire) {
      expect(item.id).toMatch(/^mo-/)
    }
  })

  it('les IDs catégories d\'annexes commencent par "annexes-"', () => {
    for (const item of NAVIGATION_TREE.annexes) {
      expect(item.id).toMatch(/^annexes-/)
    }
  })

  it('les IDs fiches d\'annexes commencent par "annexe-"', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        for (const fiche of category.children) {
          expect(fiche.id).toMatch(/^annexe-/)
        }
      }
    }
  })

  it('tous les IDs respectent le pattern slug-friendly ^[a-z0-9-]+$', () => {
    const allIds = collectAllIds([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    for (const id of allIds) {
      expect(id).toMatch(/^[a-z0-9-]+$/)
    }
  })
})

// ──────────────────────────────────────────────────
// Tests de convention des hrefs
// ──────────────────────────────────────────────────

describe('Convention des hrefs', () => {
  it('tous les hrefs commencent par "/"', () => {
    const allHrefs = collectAllHrefs([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    for (const href of allHrefs) {
      expect(href).toMatch(/^\//)
    }
  })

  it('les hrefs Framework suivent le pattern /framework/{slug}', () => {
    for (const item of NAVIGATION_TREE.framework) {
      expect(item.href).toMatch(/^\/framework\/[a-z0-9-]+$/)
    }
  })

  it('les hrefs Mode Opératoire suivent le pattern /mode-operatoire/{slug}', () => {
    for (const item of NAVIGATION_TREE.modeOperatoire) {
      expect(item.href).toMatch(/^\/mode-operatoire\/[a-z0-9-]+$/)
    }
  })

  it('les hrefs catégories d\'annexes suivent le pattern /annexes/{category}', () => {
    for (const item of NAVIGATION_TREE.annexes) {
      expect(item.href).toMatch(/^\/annexes\/[a-z0-9-]+$/)
    }
  })

  it('les hrefs fiches d\'annexes suivent le pattern /annexes/{category}/{fiche}', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        for (const fiche of category.children) {
          expect(fiche.href).toMatch(/^\/annexes\/[a-z0-9-]+\/[a-z0-9-]+$/)
        }
      }
    }
  })

  it('les hrefs des fiches commencent par le href de leur catégorie parente', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        for (const fiche of category.children) {
          expect(fiche.href.startsWith(category.href + '/')).toBe(true)
        }
      }
    }
  })

  it('aucun href ne contient de protocole externe (://)', () => {
    const allHrefs = collectAllHrefs([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    for (const href of allHrefs) {
      expect(href).not.toContain('://')
    }
  })
})

// ──────────────────────────────────────────────────
// Tests de la propriété section
// ──────────────────────────────────────────────────

describe('Propriété section', () => {
  it('tous les items Framework ont section: "framework"', () => {
    for (const item of NAVIGATION_TREE.framework) {
      expect(item.section).toBe('framework')
    }
  })

  it('tous les items Mode Opératoire ont section: "mode-operatoire"', () => {
    for (const item of NAVIGATION_TREE.modeOperatoire) {
      expect(item.section).toBe('mode-operatoire')
    }
  })

  it('toutes les catégories d\'annexes ont section: "annexes"', () => {
    for (const item of NAVIGATION_TREE.annexes) {
      expect(item.section).toBe('annexes')
    }
  })

  it('les fiches enfants d\'annexes n\'ont pas de section définie (propagée par les helpers)', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        for (const fiche of category.children) {
          expect(fiche.section).toBeUndefined()
        }
      }
    }
  })
})

// ──────────────────────────────────────────────────
// Tests des badges
// ──────────────────────────────────────────────────

describe('Badges de navigation', () => {
  it('le Préambule du Framework a le badge "essential"', () => {
    const preambule = NAVIGATION_TREE.framework.find(i => i.id === 'fw-preambule')
    expect(preambule?.badge).toBe('essential')
  })

  it('le Préambule du Mode Opératoire a le badge "essential"', () => {
    const preambule = NAVIGATION_TREE.modeOperatoire.find(i => i.id === 'mo-preambule')
    expect(preambule?.badge).toBe('essential')
  })

  it('les badges utilisés sont uniquement "new" ou "essential"', () => {
    const allItems = [
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ]
    for (const item of allItems) {
      if (item.badge) {
        expect(['new', 'essential']).toContain(item.badge)
      }
    }
  })
})

// ──────────────────────────────────────────────────
// Tests de la structure hiérarchique
// ──────────────────────────────────────────────────

describe('Structure hiérarchique', () => {
  it('les chapitres Framework n\'ont pas de children', () => {
    for (const item of NAVIGATION_TREE.framework) {
      expect(item.children).toBeUndefined()
    }
  })

  it('les chapitres Mode Opératoire n\'ont pas de children', () => {
    for (const item of NAVIGATION_TREE.modeOperatoire) {
      expect(item.children).toBeUndefined()
    }
  })

  it('toutes les catégories d\'annexes ont des children (fiches)', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      expect(category.children).toBeDefined()
      expect(category.children!.length).toBeGreaterThan(0)
    }
  })

  it('les fiches d\'annexes n\'ont pas de children (profondeur max = 2)', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children) {
        for (const fiche of category.children) {
          expect(fiche.children).toBeUndefined()
        }
      }
    }
  })

  it('la profondeur maximale de l\'arbre est 2 (bien sous la limite de 4)', () => {
    function getMaxDepth(items: NavigationItem[], depth: number = 1): number {
      let max = depth
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          const childDepth = getMaxDepth(item.children, depth + 1)
          if (childDepth > max) max = childDepth
        }
      }
      return max
    }
    const maxDepth = getMaxDepth([
      ...NAVIGATION_TREE.framework,
      ...NAVIGATION_TREE.modeOperatoire,
      ...NAVIGATION_TREE.annexes,
    ])
    expect(maxDepth).toBe(2)
    expect(maxDepth).toBeLessThanOrEqual(4)
  })
})

// ──────────────────────────────────────────────────
// Tests d'immutabilité
// ──────────────────────────────────────────────────

describe('Immutabilité de NAVIGATION_TREE', () => {
  it('NAVIGATION_TREE est gelé (Object.isFrozen)', () => {
    expect(Object.isFrozen(NAVIGATION_TREE)).toBe(true)
  })

  it('une tentative de mutation directe lève une erreur en mode strict', () => {
    expect(() => {
      ;(NAVIGATION_TREE as any).framework = []
    }).toThrow()
  })

  it('une tentative d\'ajout de propriété lève une erreur', () => {
    expect(() => {
      ;(NAVIGATION_TREE as any).newSection = []
    }).toThrow()
  })
})

// ──────────────────────────────────────────────────
// Tests de l'ordre de tri
// ──────────────────────────────────────────────────

describe('Ordre de tri des items', () => {
  it('les chapitres Framework sont ordonnés de 1 à 8', () => {
    const orders = NAVIGATION_TREE.framework.map(i => i.order)
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('les chapitres Mode Opératoire sont ordonnés de 0 à 7', () => {
    const orders = NAVIGATION_TREE.modeOperatoire.map(i => i.order)
    expect(orders).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
  })

  it('les catégories d\'annexes sont ordonnées de 1 à 9', () => {
    const orders = NAVIGATION_TREE.annexes.map(i => i.order)
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('les fiches de chaque catégorie sont ordonnées séquentiellement à partir de 1', () => {
    for (const category of NAVIGATION_TREE.annexes) {
      if (category.children && category.children.length > 0) {
        const orders = category.children.map(i => i.order)
        const expected = Array.from({ length: orders.length }, (_, i) => i + 1)
        expect(orders).toEqual(expected)
      }
    }
  })
})

// ──────────────────────────────────────────────────
// Tests de correspondance avec le contenu source
// ──────────────────────────────────────────────────

describe('Correspondance avec le contenu source (US-004 §3)', () => {
  it('les labels Framework correspondent aux titres des chapitres', () => {
    const expectedLabels = [
      'Préambule',
      'Vision & Philosophie',
      'Écosystème',
      'Artefacts',
      'Boucles Itératives',
      'Synchronisations',
      'Métriques',
      'Annexes',
    ]
    const actualLabels = NAVIGATION_TREE.framework.map(i => i.label)
    expect(actualLabels).toEqual(expectedLabels)
  })

  it('les labels Mode Opératoire correspondent aux titres des chapitres', () => {
    const expectedLabels = [
      'Préambule',
      'Initialisation',
      'Planification',
      'Développement',
      'Validation',
      'Déploiement',
      'Rituels & Amélioration',
      'Annexes',
    ]
    const actualLabels = NAVIGATION_TREE.modeOperatoire.map(i => i.label)
    expect(actualLabels).toEqual(expectedLabels)
  })

  it('les labels catégories d\'annexes correspondent (A à I)', () => {
    const expectedLabels = [
      'A - Templates',
      'B - Rôles',
      'C - Boucles',
      'D - Rituels',
      'E - Métriques',
      'F - Agents',
      'G - Configuration',
      'H - Bonnes Pratiques',
      'I - Ressources',
    ]
    const actualLabels = NAVIGATION_TREE.annexes.map(i => i.label)
    expect(actualLabels).toEqual(expectedLabels)
  })
})

// ──────────────────────────────────────────────────
// Tests des constantes NAVIGATION_COUNTS
// ──────────────────────────────────────────────────

describe('Constantes NAVIGATION_COUNTS', () => {
  it('FRAMEWORK_CHAPTERS vaut 8', () => {
    expect(NAVIGATION_COUNTS.FRAMEWORK_CHAPTERS).toBe(8)
  })

  it('MODE_OPERATOIRE_CHAPTERS vaut 8', () => {
    expect(NAVIGATION_COUNTS.MODE_OPERATOIRE_CHAPTERS).toBe(8)
  })

  it('ANNEXES_CATEGORIES vaut 9', () => {
    expect(NAVIGATION_COUNTS.ANNEXES_CATEGORIES).toBe(9)
  })

  it('ANNEXES_FICHES vaut 46', () => {
    expect(NAVIGATION_COUNTS.ANNEXES_FICHES).toBe(46)
  })

  it('TOTAL_ITEMS vaut 71 (8 + 8 + 9 + 46)', () => {
    expect(NAVIGATION_COUNTS.TOTAL_ITEMS).toBe(71)
    expect(NAVIGATION_COUNTS.TOTAL_ITEMS).toBe(
      NAVIGATION_COUNTS.FRAMEWORK_CHAPTERS +
      NAVIGATION_COUNTS.MODE_OPERATOIRE_CHAPTERS +
      NAVIGATION_COUNTS.ANNEXES_CATEGORIES +
      NAVIGATION_COUNTS.ANNEXES_FICHES
    )
  })

  it('les compteurs sont cohérents avec les données réelles', () => {
    expect(NAVIGATION_TREE.framework).toHaveLength(NAVIGATION_COUNTS.FRAMEWORK_CHAPTERS)
    expect(NAVIGATION_TREE.modeOperatoire).toHaveLength(NAVIGATION_COUNTS.MODE_OPERATOIRE_CHAPTERS)
    expect(NAVIGATION_TREE.annexes).toHaveLength(NAVIGATION_COUNTS.ANNEXES_CATEGORIES)
  })
})
```

### 7.3 Matrice de couverture

| Aspect testé | Nb tests | Focus |
|-------------|----------|-------|
| Validation Zod | 2 | Schéma parse sans erreur, cohérence avec l'export |
| Complétude (compteurs) | 14 | 8+8+9 chapitres, 46 fiches, 71 total, fiches par catégorie |
| Unicité | 3 | IDs uniques, hrefs uniques, orders uniques par siblings |
| Convention nommage IDs | 5 | Préfixes `fw-`, `mo-`, `annexes-`, `annexe-`, pattern slug |
| Convention hrefs | 7 | Patterns par section, cohérence parent/enfant, pas d'externe |
| Propriété section | 4 | `framework`, `mode-operatoire`, `annexes`, enfants sans section |
| Badges | 3 | Préambules `essential`, valeurs autorisées |
| Structure hiérarchique | 5 | Framework/MO sans children, Annexes avec children, profondeur max |
| Immutabilité | 3 | `Object.isFrozen`, mutation directe, ajout propriété |
| Ordre de tri | 4 | Framework 1-8, MO 0-7, Annexes 1-9, fiches séquentielles |
| Correspondance contenu | 3 | Labels Framework, MO, Annexes vs titres source |
| Constantes NAVIGATION_COUNTS | 6 | Chaque compteur + cohérence avec données |
| **Total** | **59** | |

### 7.4 Commandes de test

```bash
# Exécuter les tests de ce fichier uniquement
pnpm test:unit -- data/navigation

# Avec couverture
pnpm test:unit -- data/navigation --coverage

# Vérification TypeScript (compilation des types)
pnpm typecheck
```

---

## 8. Critères d'acceptation

- [x] **CA-01** : Le fichier `src/data/navigation.ts` est créé avec la structure complète
- [x] **CA-02** : `FRAMEWORK_NAV` contient exactement 8 chapitres avec les IDs, labels, hrefs et orders corrects
- [x] **CA-03** : `MODE_OPERATOIRE_NAV` contient exactement 8 chapitres avec les IDs, labels, hrefs et orders corrects
- [x] **CA-04** : `ANNEXES_NAV` contient exactement 9 catégories avec leurs 46 fiches enfants
- [x] **CA-05** : `NAVIGATION_TREE` est exporté comme résultat de `navigationTreeSchema.parse()`
- [x] **CA-06** : `NAVIGATION_TREE` est gelé via `Object.freeze()` (immutabilité)
- [x] **CA-07** : `NAVIGATION_COUNTS` est exporté avec les 5 compteurs corrects (8, 8, 9, 46, 71)
- [x] **CA-08** : Tous les IDs suivent la convention de nommage (`fw-`, `mo-`, `annexes-`, `annexe-`)
- [x] **CA-09** : Tous les hrefs suivent les patterns de route (`/framework/`, `/mode-operatoire/`, `/annexes/`)
- [x] **CA-10** : Les 71 IDs sont tous uniques dans l'arbre
- [x] **CA-11** : Les 71 hrefs sont tous uniques dans l'arbre
- [x] **CA-12** : Le Préambule Framework et le Préambule Mode Opératoire ont le badge `'essential'`
- [x] **CA-13** : La documentation JSDoc est présente sur chaque export et sur le module
- [x] **CA-14** : Tous les tests passent (59 tests passants)
- [x] **CA-15** : TypeScript compile sans erreur (aucune erreur dans les fichiers T-004-B3)
- [x] **CA-16** : ESLint passe sans warning (`pnpm lint`)

---

## 9. Definition of Done

- [x] Code implémenté selon les spécifications (sections 4.1 à 4.7)
- [x] 71 items de navigation définis (8 + 8 + 9 + 46)
- [x] Validation Zod exécutée au chargement du module (fail-fast)
- [x] Tests unitaires écrits et passants (59 tests, section 7.2)
- [x] Couverture de tests ≥ 90% sur `src/data/navigation.ts`
- [x] TypeScript compile sans erreur (`pnpm typecheck`)
- [x] ESLint passe sans warning (`pnpm lint`)
- [ ] Code reviewé par un pair
- [x] Documentation JSDoc complète sur tous les exports

---

## 10. Références

| Document | Lien |
|----------|------|
| User Story US-004 | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Types navigation (T-004-B1) | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| Schémas Zod (T-004-B2) | [T-004-B2-schemas-zod-navigation.md](./T-004-B2-schemas-zod-navigation.md) |
| Types implémentés | [src/types/navigation.ts](../../../src/types/navigation.ts) |
| Schémas implémentés | [src/schemas/navigation.ts](../../../src/schemas/navigation.ts) |
| Inventaire contenu | [spec-US-004.md §3](./spec-US-004.md#3-inventaire-du-contenu-à-naviguer) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 10/02/2026 | Création initiale : 71 items (8+8+9+46), 17 cas limites, 60 tests, conventions ID/href/section |
| 1.1 | 10/02/2026 | Implémentation terminée : `src/data/navigation.ts` + `tests/unit/data/navigation.test.ts` (59 tests passants), tous les CA validés |
