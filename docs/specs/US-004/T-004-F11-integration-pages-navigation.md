# T-004-F11 : Integration de la navigation dans les pages existantes et creation des routes dynamiques

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 12 fevrier 2026 |
| **Statut** | A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-F10 (DocsLayout), T-004-B3 (Configuration navigation), T-004-B4 (Helpers navigation) |
| **Bloque** | T-004-T7 (Tests accessibilite RGAA), T-004-T8 (Tests E2E < 3 clics), T-004-T9 (Protocole test utilisateur) |

---

## 1. Objectif

Integrer la navigation dans les pages existantes et creer les routes dynamiques pour toutes les pages de documentation du site AIAD. Cette tache est le **point de convergence final** de la US-004, qui connecte l'ensemble du systeme de navigation (Header, Sidebar, Breadcrumb, TOC, PrevNextLinks via DocsLayout) aux pages reelles du site. Elle comprend :

- La **creation des Content Collections** pour `framework`, `mode-operatoire` et `annexes` dans `src/content/config.ts`
- La **creation des fichiers MDX placeholder** pour chaque page de documentation (71 pages au total)
- La **creation des routes dynamiques** avec `[...slug].astro` et `getStaticPaths()` pour les 3 sections
- La **creation des pages index** de chaque section (`/framework`, `/mode-operatoire`, `/annexes`)
- La **mise a jour de la page d'accueil** (`src/pages/index.astro`) pour integrer BaseLayout et le Header
- La **connexion du contenu MDX** avec le DocsLayout (headings, metadata, slots)
- La generation de **71 routes statiques** correspondant aux 71 items du `NAVIGATION_TREE`

Cette tache ne cree PAS le contenu redactionnel des pages (qui est un travail de contenu a part entiere). Elle cree des **placeholders MDX valides** avec les frontmatter corrects, permettant de naviguer dans l'arborescence complete du site et de valider l'ensemble du systeme de navigation.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Role |
|-------------|---------|------|
| Astro | 4.x | SSG, Content Collections, file-based routing, `getStaticPaths()` |
| TypeScript | 5.x | Typage strict des props et des schemas |
| Tailwind CSS | 3.x | Utility-first styling |
| Zod | 3.x | Validation des schemas de contenu |

### 2.2 Arborescence cible

```
src/
├── content/
│   ├── config.ts                          <-- MODIFIE (ajout 3 collections)
│   ├── framework/                         <-- NOUVEAU (8 fichiers MDX)
│   │   ├── preambule.mdx
│   │   ├── vision-philosophie.mdx
│   │   ├── ecosysteme.mdx
│   │   ├── artefacts.mdx
│   │   ├── boucles-iteratives.mdx
│   │   ├── synchronisations.mdx
│   │   ├── metriques.mdx
│   │   └── annexes.mdx
│   ├── mode-operatoire/                   <-- NOUVEAU (8 fichiers MDX)
│   │   ├── preambule.mdx
│   │   ├── initialisation.mdx
│   │   ├── planification.mdx
│   │   ├── developpement.mdx
│   │   ├── validation.mdx
│   │   ├── deploiement.mdx
│   │   ├── rituels-amelioration.mdx
│   │   └── annexes.mdx
│   └── annexes/                           <-- NOUVEAU (55 fichiers MDX)
│       ├── templates/
│       │   ├── _index.mdx                 # Index categorie A
│       │   ├── prd.mdx                    # A1
│       │   ├── architecture.mdx           # A2
│       │   ├── agent-guide.mdx            # A3
│       │   ├── specs.mdx                  # A4
│       │   ├── dood.mdx                   # A5
│       │   └── dooud.mdx                  # A6
│       ├── roles/                         # B (6 fiches + _index)
│       ├── boucles/                       # C (5 fiches + _index)
│       ├── rituels/                       # D (5 fiches + _index)
│       ├── metriques/                     # E (2 fiches + _index)
│       ├── agents/                        # F (7 fiches + _index)
│       ├── configuration/                 # G (6 fiches + _index)
│       ├── bonnes-pratiques/              # H (5 fiches + _index)
│       └── ressources/                    # I (4 fiches + _index)
├── pages/
│   ├── index.astro                        <-- MODIFIE (ajout BaseLayout + Header)
│   ├── framework/
│   │   ├── index.astro                    <-- NOUVEAU (page index section)
│   │   └── [...slug].astro               <-- NOUVEAU (route dynamique)
│   ├── mode-operatoire/
│   │   ├── index.astro                    <-- NOUVEAU (page index section)
│   │   └── [...slug].astro               <-- NOUVEAU (route dynamique)
│   └── annexes/
│       ├── index.astro                    <-- NOUVEAU (page index section)
│       └── [...slug].astro               <-- NOUVEAU (route dynamique)
├── layouts/
│   ├── BaseLayout.astro                   # Existant (T-004-F1)
│   └── DocsLayout.astro                   # Existant (T-004-F10)
└── data/
    └── navigation.ts                      # Existant (T-004-B3, source de verite)
```

### 2.3 Position dans l'architecture

```
NAVIGATION_TREE (T-004-B3, source de verite)
│
├── Content Collections (config.ts)
│   ├── framework (type: 'content', 8 MDX)
│   ├── mode-operatoire (type: 'content', 8 MDX)
│   └── annexes (type: 'content', 55 MDX)
│
├── Routes dynamiques (getStaticPaths)
│   ├── /framework/[...slug].astro      → 8 pages
│   ├── /mode-operatoire/[...slug].astro → 8 pages
│   └── /annexes/[...slug].astro        → 46 pages (categories + fiches)
│
├── Pages index
│   ├── /framework/index.astro          → 1 page
│   ├── /mode-operatoire/index.astro    → 1 page
│   └── /annexes/index.astro            → 1 page
│
└── Page d'accueil
    └── /index.astro                    → 1 page (mise a jour)
```

### 2.4 Dependances

#### T-004-F10 (DocsLayout)

Le layout d'assemblage qui recoit le contenu MDX :

```astro
import DocsLayout from '@layouts/DocsLayout.astro'

<DocsLayout title={...} description={...} headings={headings}>
  <Content />
</DocsLayout>
```

#### T-004-B3 (Configuration navigation)

L'arbre `NAVIGATION_TREE` est la source de verite pour les routes. Les `href` des items definissent les URLs cibles :

```typescript
import { NAVIGATION_TREE } from '@/data/navigation'
```

#### T-004-B4 (Helpers navigation)

Les helpers calculent breadcrumbs, prev/next automatiquement depuis l'URL :

```typescript
import { flattenNav, getCurrentSection } from '@/lib/navigation'
```

#### T-004-F1 (BaseLayout)

Le layout racine utilise pour la page d'accueil mise a jour :

```typescript
import BaseLayout from '@layouts/BaseLayout.astro'
```

### 2.5 Conventions suivies

| Convention | Detail |
|-----------|--------|
| Nommage fichiers MDX | kebab-case : `vision-philosophie.mdx`, `boucles-iteratives.mdx` |
| Nommage fichiers pages | kebab-case dans des dossiers en kebab-case |
| Routes dynamiques | `[...slug].astro` avec `getStaticPaths()` |
| Slugs MDX | Le nom du fichier (sans extension) = le slug |
| Index de categorie | `_index.mdx` pour les pages de categorie annexe |
| TypeScript | Mode strict, pas de `any` |
| Formatage | Prettier : pas de semicolons, single quotes, 2 espaces |
| Imports | Alias `@/*` pour `src/*` |

---

## 3. Specifications fonctionnelles

### 3.1 Description generale

La tache T-004-F11 se decompose en **5 sous-taches** :

1. **Extension des Content Collections** : ajouter 3 collections document (MDX) a `config.ts`
2. **Creation des fichiers MDX placeholder** : 71 fichiers avec frontmatter valide
3. **Creation des routes dynamiques** : 3 fichiers `[...slug].astro`
4. **Creation des pages index de section** : 3 fichiers `index.astro`
5. **Mise a jour de la page d'accueil** : integration de BaseLayout et Header

### 3.2 Sous-tache 1 : Extension des Content Collections

#### Schema des collections documentation

Chaque collection (`framework`, `mode-operatoire`, `annexes`) utilise un schema commun :

```typescript
// A ajouter dans src/content/config.ts

import { z } from 'astro:content'

const docsSchema = z.object({
  /** Titre affiche de la page (h1) */
  title: z.string(),

  /** Description meta SEO */
  description: z.string(),

  /** Ordre de tri dans la section (correspond a NavigationItem.order) */
  order: z.number().int().min(0),

  /** Section parente */
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

  /** Marquer comme essentiel (badge affiché dans la navigation) */
  isEssential: z.boolean().default(false),

  /** Date de derniere mise a jour */
  lastUpdated: z.date().optional(),

  /** Tags de categorisation */
  tags: z.array(z.string()).optional(),

  /** Statut du contenu */
  draft: z.boolean().default(false),
})
```

#### Mise a jour de config.ts

```typescript
// Ajout dans src/content/config.ts

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

export const collections = {
  // Collections existantes (US-001)
  hero: heroCollection,
  benefits: benefitsCollection,
  stats: statsCollection,

  // Nouvelles collections documentation (US-004)
  framework: frameworkCollection,
  'mode-operatoire': modeOperatoireCollection,
  annexes: annexesCollection,
}
```

### 3.3 Sous-tache 2 : Creation des fichiers MDX placeholder

#### Structure du frontmatter MDX

Chaque fichier MDX doit contenir un frontmatter valide conforme au `docsSchema` :

```mdx
---
title: "Preambule"
description: "Introduction au framework AIAD - contexte, objectifs et principes fondateurs."
order: 1
section: "framework"
isEssential: true
draft: true
---

# Preambule

> Cette page est en cours de redaction. Le contenu sera disponible prochainement.

## Vue d'ensemble

Contenu a venir.

## Points cles

Contenu a venir.
```

#### Regles de nommage MDX → URL

La correspondance entre le nom du fichier MDX et l'URL est directe :

| Collection | Fichier MDX | Slug Astro | URL finale |
|------------|------------|------------|------------|
| `framework` | `preambule.mdx` | `preambule` | `/framework/preambule` |
| `framework` | `vision-philosophie.mdx` | `vision-philosophie` | `/framework/vision-philosophie` |
| `mode-operatoire` | `planification.mdx` | `planification` | `/mode-operatoire/planification` |
| `annexes` | `templates/_index.mdx` | `templates/_index` | `/annexes/templates` |
| `annexes` | `templates/prd.mdx` | `templates/prd` | `/annexes/templates/prd` |
| `annexes` | `roles/product-manager.mdx` | `roles/product-manager` | `/annexes/roles/product-manager` |

#### Inventaire complet des fichiers MDX (71 fichiers)

**Framework (8 fichiers) :**

| Fichier | Titre | Order | isEssential |
|---------|-------|-------|-------------|
| `preambule.mdx` | Preambule | 1 | true |
| `vision-philosophie.mdx` | Vision & Philosophie | 2 | false |
| `ecosysteme.mdx` | Ecosysteme | 3 | false |
| `artefacts.mdx` | Artefacts | 4 | false |
| `boucles-iteratives.mdx` | Boucles Iteratives | 5 | false |
| `synchronisations.mdx` | Synchronisations | 6 | false |
| `metriques.mdx` | Metriques | 7 | false |
| `annexes.mdx` | Annexes | 8 | false |

**Mode Operatoire (8 fichiers) :**

| Fichier | Titre | Order | isEssential |
|---------|-------|-------|-------------|
| `preambule.mdx` | Preambule | 0 | true |
| `initialisation.mdx` | Initialisation | 1 | false |
| `planification.mdx` | Planification | 2 | false |
| `developpement.mdx` | Developpement | 3 | false |
| `validation.mdx` | Validation | 4 | false |
| `deploiement.mdx` | Deploiement | 5 | false |
| `rituels-amelioration.mdx` | Rituels & Amelioration | 6 | false |
| `annexes.mdx` | Annexes | 7 | false |

**Annexes (9 index de categorie + 46 fiches = 55 fichiers) :**

Les 9 categories avec leurs fichiers :

| Categorie | Dossier | Index + Fiches | Nb total |
|-----------|---------|----------------|----------|
| A - Templates | `templates/` | `_index.mdx` + 6 fiches | 7 |
| B - Roles | `roles/` | `_index.mdx` + 6 fiches | 7 |
| C - Boucles | `boucles/` | `_index.mdx` + 5 fiches | 6 |
| D - Rituels | `rituels/` | `_index.mdx` + 5 fiches | 6 |
| E - Metriques | `metriques/` | `_index.mdx` + 2 fiches | 3 |
| F - Agents | `agents/` | `_index.mdx` + 7 fiches | 8 |
| G - Configuration | `configuration/` | `_index.mdx` + 6 fiches | 7 |
| H - Bonnes Pratiques | `bonnes-pratiques/` | `_index.mdx` + 5 fiches | 6 |
| I - Ressources | `ressources/` | `_index.mdx` + 4 fiches | 5 |

**Detail des fiches annexes :**

*A - Templates :*
| Fichier | Titre | Order |
|---------|-------|-------|
| `_index.mdx` | A - Templates | 1 |
| `prd.mdx` | A1 - Template PRD | 1 |
| `architecture.mdx` | A2 - Template Architecture | 2 |
| `agent-guide.mdx` | A3 - Template Agent-Guide | 3 |
| `specs.mdx` | A4 - Template Specs | 4 |
| `dood.mdx` | A5 - Template DoOD | 5 |
| `dooud.mdx` | A6 - Template DoOuD | 6 |

*B - Roles :*
| Fichier | Titre | Order |
|---------|-------|-------|
| `_index.mdx` | B - Roles | 2 |
| `product-manager.mdx` | B1 - Product Manager | 1 |
| `product-engineer.mdx` | B2 - Product Engineer | 2 |
| `qa-engineer.mdx` | B3 - QA Engineer | 3 |
| `tech-lead.mdx` | B4 - Tech Lead | 4 |
| `supporters.mdx` | B5 - Supporters | 5 |
| `agents-engineer.mdx` | B6 - Agents Engineer | 6 |

*C - Boucles :*
| Fichier | Titre | Order |
|---------|-------|-------|
| `_index.mdx` | C - Boucles | 3 |
| `phase-initialisation.mdx` | C1 - Phase Initialisation | 1 |
| `boucle-planifier.mdx` | C2 - Boucle Planifier | 2 |
| `boucle-implementer.mdx` | C3 - Boucle Implementer | 3 |
| `boucle-valider.mdx` | C4 - Boucle Valider | 4 |
| `boucle-integrer.mdx` | C5 - Boucle Integrer | 5 |

*D - Rituels :*
| Fichier | Titre | Order |
|---------|-------|-------|
| `_index.mdx` | D - Rituels | 4 |
| `alignment-strategique.mdx` | D1 - Alignment Strategique | 1 |
| `demo-feedback.mdx` | D2 - Demo & Feedback | 2 |
| `tech-review.mdx` | D3 - Tech Review | 3 |
| `retrospective.mdx` | D4 - Retrospective | 4 |
| `standup.mdx` | D5 - Standup | 5 |

*E - Metriques :*
| Fichier | Titre | Order |
|---------|-------|-------|
| `_index.mdx` | E - Metriques | 5 |
| `exemples-dashboards.mdx` | E1 - Exemples Dashboards | 1 |
| `revue-trimestrielle.mdx` | E2 - Revue Trimestrielle | 2 |

*F - Agents :*
| Fichier | Titre | Order |
|---------|-------|-------|
| `_index.mdx` | F - Agents | 6 |
| `agent-security.mdx` | F1 - Agent Security | 1 |
| `agent-quality.mdx` | F2 - Agent Quality | 2 |
| `agent-architecture.mdx` | F3 - Agent Architecture | 3 |
| `agent-documentation.mdx` | F4 - Agent Documentation | 4 |
| `agent-performance.mdx` | F5 - Agent Performance | 5 |
| `agent-code-review.mdx` | F6 - Agent Code Review | 6 |
| `autres-agents.mdx` | F7 - Autres Agents | 7 |

*G - Configuration :*
| Fichier | Titre | Order |
|---------|-------|-------|
| `_index.mdx` | G - Configuration | 7 |
| `configuration-environnement.mdx` | G1 - Configuration Environnement | 1 |
| `installation-agents-ia.mdx` | G2 - Installation Agents IA | 2 |
| `setup-ci-cd.mdx` | G3 - Setup CI/CD | 3 |
| `configuration-permissions.mdx` | G4 - Configuration Permissions | 4 |
| `installation-mcp-plugins.mdx` | G5 - Installation MCP Plugins | 5 |
| `creation-subagents.mdx` | G6 - Creation SubAgents | 6 |

*H - Bonnes Pratiques :*
| Fichier | Titre | Order |
|---------|-------|-------|
| `_index.mdx` | H - Bonnes Pratiques | 8 |
| `prompts-efficaces.mdx` | H1 - Prompts Efficaces | 1 |
| `patterns-code.mdx` | H2 - Patterns Code | 2 |
| `anti-patterns.mdx` | H3 - Anti-patterns | 3 |
| `cas-usage-specs.mdx` | H4 - Cas d'Usage Specs | 4 |
| `notes-apprentissage.mdx` | H5 - Notes d'Apprentissage | 5 |

*I - Ressources :*
| Fichier | Titre | Order |
|---------|-------|-------|
| `_index.mdx` | I - Ressources | 9 |
| `troubleshooting.mdx` | I1 - Troubleshooting | 1 |
| `glossaire.mdx` | I2 - Glossaire | 2 |
| `bibliographie.mdx` | I3 - Bibliographie | 3 |
| `communaute.mdx` | I4 - Communaute | 4 |

### 3.4 Sous-tache 3 : Routes dynamiques

#### Pattern de route pour Framework et Mode Operatoire

```astro
---
// src/pages/framework/[...slug].astro

import { getCollection } from 'astro:content'
import DocsLayout from '@layouts/DocsLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('framework', ({ data }) => !data.draft)
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }))
}

const { post } = Astro.props
const { Content, headings } = await post.render()
---

<DocsLayout
  title={post.data.title}
  description={post.data.description}
  headings={headings}
>
  <Content />
</DocsLayout>
```

Le meme pattern est applique pour `mode-operatoire/[...slug].astro`.

#### Pattern de route pour les Annexes

Les annexes ont une structure a 2 niveaux (categorie/fiche). Le `[...slug].astro` capture les deux :

```astro
---
// src/pages/annexes/[...slug].astro

import { getCollection } from 'astro:content'
import DocsLayout from '@layouts/DocsLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('annexes', ({ data }) => !data.draft)

  return posts.map((post) => {
    // Transformer le slug : "templates/_index" → "templates", "templates/prd" → "templates/prd"
    const slug = post.slug.replace(/\/_index$/, '')
    return {
      params: { slug },
      props: { post },
    }
  })
}

const { post } = Astro.props
const { Content, headings } = await post.render()
---

<DocsLayout
  title={post.data.title}
  description={post.data.description}
  headings={headings}
>
  <Content />
</DocsLayout>
```

#### Gestion des pages brouillon (draft)

Les pages avec `draft: true` dans leur frontmatter sont **exclues de la generation statique** en production. En developpement (`astro dev`), elles sont accessibles pour previsualisation mais marquees visuellement comme brouillons.

Le filtre est applique dans `getStaticPaths()` :

```typescript
const posts = await getCollection('framework', ({ data }) => !data.draft)
```

> **Note** : Les fichiers MDX placeholder ont `draft: true` par defaut. Pour generer toutes les pages pendant le developpement de la navigation, on peut temporairement les passer a `draft: false` ou retirer le filtre draft.

### 3.5 Sous-tache 4 : Pages index de section

#### Page index Framework (`/framework`)

```astro
---
// src/pages/framework/index.astro

import { getCollection } from 'astro:content'
import DocsLayout from '@layouts/DocsLayout.astro'

const posts = await getCollection('framework', ({ data }) => !data.draft)
const sortedPosts = posts.sort((a, b) => a.data.order - b.data.order)
---

<DocsLayout
  title="Framework AIAD"
  description="Le Framework AIAD definit la theorie, les principes et la methodologie pour developper avec des agents IA."
  showToc={false}
  showPrevNext={false}
>
  <h1>Framework AIAD</h1>
  <p class="text-lg text-gray-600 mb-8">
    Le Framework AIAD definit les fondements theoriques, les roles, les artefacts et les processus
    pour une collaboration efficace entre humains et agents IA.
  </p>

  <div class="grid gap-4">
    {sortedPosts.map((post) => (
      <a
        href={`/framework/${post.slug}`}
        class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
      >
        <h2 class="text-lg font-semibold text-gray-900">{post.data.title}</h2>
        <p class="text-sm text-gray-600 mt-1">{post.data.description}</p>
      </a>
    ))}
  </div>
</DocsLayout>
```

Le meme pattern est applique pour `/mode-operatoire/index.astro` et `/annexes/index.astro` avec les adaptations suivantes :

- **Mode Operatoire** : liste les 8 chapitres du mode operatoire
- **Annexes** : liste les 9 categories (A-I) avec un lien vers chaque page de categorie

#### Page index Annexes (`/annexes`)

```astro
---
// src/pages/annexes/index.astro

import { getCollection } from 'astro:content'
import DocsLayout from '@layouts/DocsLayout.astro'

const posts = await getCollection('annexes', ({ data }) => !data.draft)

// Filtrer les index de categorie (_index) et les trier
const categoryIndexes = posts
  .filter((post) => post.slug.endsWith('/_index'))
  .sort((a, b) => a.data.order - b.data.order)
---

<DocsLayout
  title="Annexes"
  description="Annexes du framework AIAD : templates, roles, boucles, rituels, metriques, agents, configuration, bonnes pratiques et ressources."
  showToc={false}
  showPrevNext={false}
>
  <h1>Annexes</h1>
  <p class="text-lg text-gray-600 mb-8">
    Les annexes fournissent les references detaillees, templates et guides pratiques
    du framework AIAD, organises en 9 categories.
  </p>

  <div class="grid gap-4">
    {categoryIndexes.map((cat) => {
      const slug = cat.slug.replace(/\/_index$/, '')
      return (
        <a
          href={`/annexes/${slug}`}
          class="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <h2 class="text-lg font-semibold text-gray-900">{cat.data.title}</h2>
          <p class="text-sm text-gray-600 mt-1">{cat.data.description}</p>
        </a>
      )
    })}
  </div>
</DocsLayout>
```

### 3.6 Sous-tache 5 : Mise a jour de la page d'accueil

La page d'accueil (`src/pages/index.astro`) est mise a jour pour :

1. **Utiliser BaseLayout** au lieu du HTML brut
2. **Integrer le Header** pour la navigation principale
3. **Conserver le HeroSection** existant

```astro
---
// src/pages/index.astro (mise a jour)

import type { HeroContent, BenefitItem, StatItem } from '@/types'
import BaseLayout from '@layouts/BaseLayout.astro'
import Header from '@components/layout/Header.astro'
import HeroSection from '@components/hero/HeroSection.astro'

const { getCollection } = await import('astro:content')

// ── Chargement des donnees (inchange) ──────────────
const heroEntries = await getCollection('hero')
const heroContent = heroEntries
  .map((entry: { data: unknown }) => entry.data as HeroContent)
  .find((h: HeroContent) => h.isActive !== false && h.locale === 'fr')

const benefitEntries = await getCollection('benefits')
const benefits = (benefitEntries
  .map((entry: { data: unknown }) => entry.data as BenefitItem)
  .filter((b: BenefitItem) => b.isActive !== false && b.locale === 'fr') as BenefitItem[])
  .sort((a: BenefitItem, b: BenefitItem) => a.order - b.order)

const statEntries = await getCollection('stats')
const stats = (statEntries
  .map((entry: { data: unknown }) => entry.data as StatItem)
  .filter((s: StatItem) => s.isActive !== false && s.locale === 'fr') as StatItem[])
  .sort((a: StatItem, b: StatItem) => a.order - b.order)

// ── Metadonnees SEO ────────────────────────────────
const DEFAULT_TITLE = 'AIAD - Framework de developpement avec agents IA'
const DEFAULT_DESCRIPTION = 'AIAD : Le framework pour developper avec des agents IA'

const seoTitle = heroContent?.metadata?.seoTitle || DEFAULT_TITLE
const seoDescription = heroContent?.metadata?.seoDescription || DEFAULT_DESCRIPTION
---

<BaseLayout
  title={seoTitle}
  description={seoDescription}
  ogType="website"
>
  <Header />

  <main>
    <HeroSection
      heroContent={heroContent}
      benefits={benefits}
      stats={stats}
      background="gradient"
    />
  </main>
</BaseLayout>
```

### 3.7 Correspondance NAVIGATION_TREE ↔ Routes

La coherence entre `NAVIGATION_TREE` et les routes generees est critique. Voici la matrice de correspondance :

| NAVIGATION_TREE href | Route dynamique | Collection | Slug MDX |
|---------------------|-----------------|------------|----------|
| `/framework/preambule` | `framework/[...slug]` | `framework` | `preambule` |
| `/framework/vision-philosophie` | `framework/[...slug]` | `framework` | `vision-philosophie` |
| `/mode-operatoire/preambule` | `mode-operatoire/[...slug]` | `mode-operatoire` | `preambule` |
| `/mode-operatoire/initialisation` | `mode-operatoire/[...slug]` | `mode-operatoire` | `initialisation` |
| `/annexes/templates` | `annexes/[...slug]` | `annexes` | `templates/_index` |
| `/annexes/templates/prd` | `annexes/[...slug]` | `annexes` | `templates/prd` |
| `/annexes/roles/product-manager` | `annexes/[...slug]` | `annexes` | `roles/product-manager` |

> **Regle** : Pour chaque `NavigationItem.href` dans `NAVIGATION_TREE`, il DOIT exister un fichier MDX correspondant dans la collection appropriee. Sinon, la page retournera une erreur 404 au build.

### 3.8 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Titre de page unique | Chaque page a un `<title>` unique via DocsLayout | 8.5 |
| Langue | `<html lang="fr">` via BaseLayout | 8.3 |
| Landmarks | Herite de DocsLayout : main, nav, aside | 12.6 |
| Skip-link | Herite de BaseLayout → `#main-content` | 12.7 |
| Navigation | Breadcrumb + Sidebar + Header sur toutes les pages docs | 12.2 |
| Titres hierarchiques | Chaque page a un `<h1>` unique, headings MDX ordonnes | 9.1 |
| Focus visible | Herite des composants de navigation | 10.7 |

### 3.9 SEO

| Aspect | Implementation |
|--------|----------------|
| `<title>` | `{title} \| AIAD` via BaseLayout |
| `<meta description>` | Description unique par page (frontmatter) |
| Open Graph | `og:type=article` pour docs, `og:type=website` pour accueil |
| JSON-LD BreadcrumbList | Genere automatiquement par DocsLayout |
| URLs canoniques | Basees sur la structure de fichiers |
| Sitemap | Genere automatiquement par `@astrojs/sitemap` |

### 3.10 Enhancement progressif

Sans JavaScript :
- Toutes les pages de documentation sont accessibles (statique HTML)
- La navigation fonctionne via les liens `<a>` standards
- Le breadcrumb et les liens prev/next sont statiques
- Le Header rend les liens principaux de navigation
- **Le site est entierement navigable sans JavaScript**

---

## 4. Specifications techniques

### 4.1 Schema Zod pour les collections documentation

```typescript
// src/schemas/docs.ts (nouveau fichier)

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
```

### 4.2 Mise a jour de `src/content/config.ts`

```typescript
// src/content/config.ts (version mise a jour)

import { defineCollection } from 'astro:content'
import { heroContentSchemaWithRefinements } from '@/schemas/hero'
import { benefitItemSchema } from '@/schemas/benefit'
import { statItemSchema } from '@/schemas/stat'
import { docsSchema } from '@/schemas/docs'

// Re-exports existants
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
```

### 4.3 Route dynamique Framework

```astro
---
// src/pages/framework/[...slug].astro

import { getCollection } from 'astro:content'
import DocsLayout from '@layouts/DocsLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('framework', ({ data }) => {
    // En dev, inclure les drafts ; en prod, les exclure
    if (import.meta.env.PROD) return !data.draft
    return true
  })

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }))
}

type Post = Awaited<ReturnType<typeof getCollection<'framework'>>>[number]

interface Props {
  post: Post
}

const { post } = Astro.props
const { Content, headings } = await post.render()
---

<DocsLayout
  title={post.data.title}
  description={post.data.description}
  headings={headings}
>
  <Content />
</DocsLayout>
```

### 4.4 Route dynamique Mode Operatoire

```astro
---
// src/pages/mode-operatoire/[...slug].astro

import { getCollection } from 'astro:content'
import DocsLayout from '@layouts/DocsLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('mode-operatoire', ({ data }) => {
    if (import.meta.env.PROD) return !data.draft
    return true
  })

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }))
}

type Post = Awaited<ReturnType<typeof getCollection<'mode-operatoire'>>>[number]

interface Props {
  post: Post
}

const { post } = Astro.props
const { Content, headings } = await post.render()
---

<DocsLayout
  title={post.data.title}
  description={post.data.description}
  headings={headings}
>
  <Content />
</DocsLayout>
```

### 4.5 Route dynamique Annexes

```astro
---
// src/pages/annexes/[...slug].astro

import { getCollection } from 'astro:content'
import DocsLayout from '@layouts/DocsLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('annexes', ({ data }) => {
    if (import.meta.env.PROD) return !data.draft
    return true
  })

  return posts.map((post) => {
    // Transformer les slugs "_index" en slug de categorie
    // "templates/_index" → "templates"
    // "templates/prd" → "templates/prd"
    const slug = post.slug.replace(/\/_index$/, '')

    return {
      params: { slug },
      props: { post },
    }
  })
}

type Post = Awaited<ReturnType<typeof getCollection<'annexes'>>>[number]

interface Props {
  post: Post
}

const { post } = Astro.props
const { Content, headings } = await post.render()
---

<DocsLayout
  title={post.data.title}
  description={post.data.description}
  headings={headings}
>
  <Content />
</DocsLayout>
```

### 4.6 Template de fichier MDX placeholder

```mdx
---
title: "{TITRE}"
description: "{DESCRIPTION}"
order: {ORDER}
section: "{SECTION}"
isEssential: {true|false}
draft: true
---

# {TITRE}

> Cette page est en cours de redaction. Le contenu sera disponible prochainement.

## Vue d'ensemble

Contenu a venir.

## Points cles

Contenu a venir.
```

Ce template garantit :
- Un frontmatter valide conforme au `docsSchema`
- Au moins 2 headings `h2` pour que la TableOfContents ait du contenu a afficher
- Un contenu minimal lisible en mode brouillon
- Le `draft: true` pour indiquer que le contenu est un placeholder

### 4.7 Data attributes

| Attribut | Element | Page | Usage |
|----------|---------|------|-------|
| `data-page-framework` | `<div>` racine | Pages framework | Selecteur pour tests E2E |
| `data-page-mode-operatoire` | `<div>` racine | Pages mode operatoire | Selecteur pour tests E2E |
| `data-page-annexes` | `<div>` racine | Pages annexes | Selecteur pour tests E2E |
| `data-section-index` | `<div>` racine | Pages index | Selecteur pour tests E2E |
| `data-section-card` | `<a>` | Cartes d'index | Selecteur pour tests E2E |

> **Note** : Les data attributes des composants de navigation (Header, Sidebar, Breadcrumb, etc.) sont herites via DocsLayout.

---

## 5. Design et Style

### 5.1 Pages index de section

Les pages index presentent la liste des chapitres ou categories sous forme de cartes cliquables :

| Element | Style Tailwind | Detail |
|---------|---------------|--------|
| Grille des cartes | `grid gap-4` | Empilement vertical avec espacement |
| Carte | `block p-4 border border-gray-200 rounded-lg` | Bordure subtile, coins arrondis |
| Carte hover | `hover:border-blue-300 hover:bg-blue-50 transition-colors` | Feedback visuel au survol |
| Titre de carte | `text-lg font-semibold text-gray-900` | Titre proéminent |
| Description de carte | `text-sm text-gray-600 mt-1` | Description secondaire |
| Introduction | `text-lg text-gray-600 mb-8` | Texte introductif avec marge basse |

### 5.2 Maquette page index Framework

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER                                                           │
├──────────────────────────────────────────────────────────────────┤
│  Accueil > Framework                                     (Breadcrumb)│
├────────────┬─────────────────────────────────────────────────────┤
│  SIDEBAR   │  # Framework AIAD                                    │
│            │                                                      │
│  Framework │  Le Framework AIAD definit les fondements theoriques,│
│  ├ Preamb. │  les roles, les artefacts et les processus...        │
│  ├ Vision  │                                                      │
│  ├ Ecosy.  │  ┌───────────────────────────────────────────────┐   │
│  ├ Artef.  │  │  Preambule                                      │   │
│  ├ Boucles │  │  Introduction au framework AIAD...               │   │
│  ├ Synchro │  └───────────────────────────────────────────────┘   │
│  ├ Metriq. │  ┌───────────────────────────────────────────────┐   │
│  └ Annexes │  │  Vision & Philosophie                           │   │
│            │  │  Les principes directeurs...                     │   │
│  Mode Op.  │  └───────────────────────────────────────────────┘   │
│  └ ...     │  ┌───────────────────────────────────────────────┐   │
│            │  │  Ecosysteme                                      │   │
│  Annexes   │  │  L'ecosysteme des roles et outils...             │   │
│  └ ...     │  └───────────────────────────────────────────────┘   │
│            │  ...                                                 │
├────────────┴─────────────────────────────────────────────────────┤
│  (Pas de PrevNextLinks sur les pages index)                       │
└──────────────────────────────────────────────────────────────────┘
```

### 5.3 Maquette page de contenu MDX

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER                                                           │
├──────────────────────────────────────────────────────────────────┤
│  Accueil > Framework > Preambule                        (Breadcrumb)│
├────────────┬─────────────────────────────────┬───────────────────┤
│  SIDEBAR   │  # Preambule                     │  TABLE DES        │
│            │                                  │  MATIERES         │
│  Framework │  > Cette page est en cours de    │                   │
│  ├ Preamb. │  redaction...                    │  • Vue d'ensemble │
│  ├ Vision  │                                  │  • Points cles    │
│  ├ Ecosy.  │  ## Vue d'ensemble               │                   │
│  └ ...     │  Contenu a venir.                │                   │
│            │                                  │                   │
│  Mode Op.  │  ## Points cles                  │                   │
│  └ ...     │  Contenu a venir.                │                   │
│            │                                  │                   │
│  Annexes   │                                  │                   │
│  └ ...     │                                  │                   │
│            ├──────────────────────────────────┤                   │
│            │  ← (pas de precedent)            │                   │
│            │       Suivant : Vision & Phil. → │                   │
├────────────┴──────────────────────────────────┴───────────────────┤
│  (Footer eventuel)                                                 │
└──────────────────────────────────────────────────────────────────┘
```

### 5.4 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Layouts | Reutilise DocsLayout (3 colonnes) et BaseLayout |
| Cartes index | Style coherent avec les composants existants (bordure, hover) |
| Couleurs | Palette gris/bleu coherente avec Header, Sidebar |
| Transitions | `transition-colors` coherent avec NavLink, Breadcrumb |
| Responsive | Herite du responsive DocsLayout (1/2/3 colonnes) |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | Page Framework standard (ex: `/framework/preambule`) | Rendu complet avec DocsLayout, breadcrumb, sidebar, TOC, prev/next | Haute |
| CL-02 | Page Mode Operatoire standard | Meme comportement que Framework | Haute |
| CL-03 | Page Annexe de categorie (ex: `/annexes/templates`) | Rendu avec DocsLayout, liste des fiches de la categorie | Haute |
| CL-04 | Page Annexe fiche (ex: `/annexes/templates/prd`) | Rendu complet avec DocsLayout, breadcrumb 4 niveaux | Haute |
| CL-05 | Page index Framework (`/framework`) | Liste des chapitres, pas de TOC ni PrevNext | Haute |
| CL-06 | Page index Mode Operatoire (`/mode-operatoire`) | Liste des chapitres, pas de TOC ni PrevNext | Haute |
| CL-07 | Page index Annexes (`/annexes`) | Liste des 9 categories, pas de TOC ni PrevNext | Haute |
| CL-08 | Page d'accueil mise a jour (`/`) | Header visible, HeroSection conservee, BaseLayout | Haute |
| CL-09 | URL inexistante (ex: `/framework/inexistant`) | Erreur 404 d'Astro (page non generee par `getStaticPaths`) | Haute |
| CL-10 | URL avec trailing slash (ex: `/framework/preambule/`) | Redirige ou normalise via la configuration Astro `trailingSlash` | Haute |
| CL-11 | Fichier MDX avec `draft: true` en production | Page non generee (exclue de `getStaticPaths`) | Haute |
| CL-12 | Fichier MDX avec `draft: true` en dev | Page accessible et navigable | Haute |
| CL-13 | Fichier MDX sans headings h2 | TOC vide, DocsLayout masque la colonne TOC | Moyenne |
| CL-14 | Fichier MDX avec beaucoup de headings (> 20) | TOC scrollable, pas d'impact layout | Moyenne |
| CL-15 | Slug d'annexe `_index` transforme correctement | `templates/_index` → URL `/annexes/templates` | Haute |
| CL-16 | Breadcrumb correct sur page annexe profonde | `Accueil > Annexes > A - Templates > A1 - PRD` | Haute |
| CL-17 | PrevNext correct a la frontiere des sections | Dernier item Framework → premier item Mode Operatoire | Haute |
| CL-18 | PrevNext sur le premier item (Preambule Framework) | `prev = null`, `next = Vision & Philosophie` | Haute |
| CL-19 | PrevNext sur le dernier item (I4 Communaute) | `prev = I3 Bibliographie`, `next = null` | Haute |
| CL-20 | Tous les items du NAVIGATION_TREE ont une page correspondante | Build Astro reussit sans erreur 404 interne | Haute |
| CL-21 | Frontmatter invalide dans un fichier MDX | Erreur de build Astro avec message clair (validation Zod) | Haute |
| CL-22 | Caracteres speciaux dans les titres MDX | Echappe par Astro dans `<title>`, meta, JSON-LD | Haute |
| CL-23 | Page d'accueil sans hero content (collection vide) | Rendu gracieux (HeroSection gere les props manquantes) | Moyenne |
| CL-24 | Mobile : pages index | 1 colonne, cartes empilees, sidebar masquee | Haute |
| CL-25 | Mobile : pages de contenu | 1 colonne, TOC collapsible, sidebar masquee | Haute |
| CL-26 | Navigation clavier sur pages index | Tab entre les cartes, Enter pour naviguer | Haute |
| CL-27 | Ordre des pages dans la sidebar correspond a l'ordre MDX | `order` du frontmatter coherent avec `NAVIGATION_TREE` | Haute |

### 6.2 Strategie de fallback

```
Build Astro echoue ?
├── Fichier MDX manquant pour un href du NAVIGATION_TREE
│   → Erreur 404 au build, corrigee en creant le fichier MDX
├── Frontmatter invalide
│   → Erreur Zod claire, corrigee dans le frontmatter
└── Collection non definie
    → Erreur Astro, corrigee en ajoutant la collection dans config.ts

Route non trouvee ?
├── URL non couverte par getStaticPaths
│   → Page 404 d'Astro (comportement attendu)
├── Slug _index mal transforme
│   → Verifier la regex replace dans getStaticPaths
└── Trailing slash
    → Configurer trailingSlash dans astro.config.mjs

Page d'accueil cassee ?
├── Hero content manquant
│   → HeroSection gere les props manquantes (existant US-001)
├── Header non rendu
│   → BaseLayout + Header comme wrapper minimum
└── Collections data non trouvees
    → Les collections existantes (hero, benefits, stats) restent inchangees
```

---

## 7. Exemples entree/sortie

### 7.1 Route dynamique Framework — Page Preambule

**Fichier MDX :** `src/content/framework/preambule.mdx`

```mdx
---
title: "Preambule"
description: "Introduction au framework AIAD - contexte, objectifs et principes fondateurs."
order: 1
section: "framework"
isEssential: true
draft: true
---

# Preambule

> Cette page est en cours de redaction. Le contenu sera disponible prochainement.

## Vue d'ensemble

Le framework AIAD (AI-Agent Iterative Development) propose une approche structuree pour integrer des agents IA dans le processus de developpement logiciel.

## Points cles

- Collaboration humain-agent structuree
- Boucles iteratives definies
- Roles et responsabilites clairs
```

**URL generee :** `/framework/preambule`

**Sortie HTML (structure simplifiee) :**

```html
<!doctype html>
<html lang="fr">
  <head>
    <title>Preambule | AIAD</title>
    <meta name="description" content="Introduction au framework AIAD..." />
    <meta property="og:type" content="article" />
    <script type="application/ld+json">
      {"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Accueil","item":"https://aiad.dev/"},
        {"@type":"ListItem","position":2,"name":"Framework","item":"https://aiad.dev/framework"},
        {"@type":"ListItem","position":3,"name":"Preambule"}
      ]}
    </script>
  </head>
  <body>
    <a href="#main-content">Aller au contenu principal</a>
    <header data-header><!-- Header avec Framework, Mode Op, Annexes --></header>
    <div data-docs-breadcrumb>
      <nav aria-label="Fil d'Ariane">
        <ol>
          <li><a href="/">Accueil</a></li>
          <li><a href="/framework">Framework</a></li>
          <li aria-current="page">Preambule</li>
        </ol>
      </nav>
    </div>
    <div data-docs-layout>
      <aside data-sidebar><!-- Sidebar avec sections --></aside>
      <div>
        <main id="main-content" data-docs-main>
          <article class="prose prose-gray max-w-none" data-docs-article>
            <h1>Preambule</h1>
            <blockquote>Cette page est en cours de redaction...</blockquote>
            <h2 id="vue-densemble">Vue d'ensemble</h2>
            <p>Le framework AIAD...</p>
            <h2 id="points-cles">Points cles</h2>
            <ul>...</ul>
          </article>
        </main>
        <div data-docs-prevnext>
          <nav aria-label="Navigation entre les pages">
            <!-- prev = null (premiere page) -->
            <a href="/framework/vision-philosophie">Vision & Philosophie →</a>
          </nav>
        </div>
      </div>
      <div data-docs-toc>
        <aside aria-label="Sur cette page">
          <a href="#vue-densemble">Vue d'ensemble</a>
          <a href="#points-cles">Points cles</a>
        </aside>
      </div>
    </div>
  </body>
</html>
```

### 7.2 Route dynamique Annexes — Page categorie Templates

**Fichier MDX :** `src/content/annexes/templates/_index.mdx`

```mdx
---
title: "A - Templates"
description: "Templates fondateurs du framework AIAD : PRD, Architecture, Agent-Guide, Specs, DoOD, DoOuD."
order: 1
section: "annexes-templates"
draft: true
---

# A - Templates

> Cette page est en cours de redaction.

## Vue d'ensemble

Les templates fondateurs du framework AIAD...

## Points cles

- 6 templates essentiels
```

**URL generee :** `/annexes/templates` (le `_index` est supprime du slug)

**Breadcrumb :** `Accueil > Annexes > A - Templates`

### 7.3 Page index Framework

**URL :** `/framework`

**Rendu :** Liste des 8 chapitres sous forme de cartes cliquables, sans TOC ni PrevNext.

### 7.4 Page d'accueil mise a jour

**URL :** `/`

**Rendu :** BaseLayout + Header (navigation globale) + HeroSection (existant). Le Header permet de naviguer vers `/framework`, `/mode-operatoire`, `/annexes`.

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/pages/framework-routes.test.ts` | Unitaire | Vitest |
| `tests/unit/pages/mode-operatoire-routes.test.ts` | Unitaire | Vitest |
| `tests/unit/pages/annexes-routes.test.ts` | Unitaire | Vitest |
| `tests/unit/pages/section-indexes.test.ts` | Unitaire | Vitest |
| `tests/unit/pages/homepage.test.ts` | Unitaire | Vitest |
| `tests/unit/schemas/docs-schema.test.ts` | Unitaire | Vitest |
| `tests/unit/content/navigation-content-sync.test.ts` | Unitaire | Vitest |

### 8.2 Tests unitaires — Schema docs

```typescript
// tests/unit/schemas/docs-schema.test.ts
import { describe, it, expect } from 'vitest'
import { docsSchema } from '@/schemas/docs'

describe('docsSchema — Validation', () => {
  it('T-01 : accepte un frontmatter valide minimal', () => {
    const result = docsSchema.safeParse({
      title: 'Preambule',
      description: 'Introduction au framework AIAD.',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(true)
  })

  it('T-02 : accepte un frontmatter complet avec tous les champs', () => {
    const result = docsSchema.safeParse({
      title: 'Preambule',
      description: 'Introduction au framework AIAD.',
      order: 1,
      section: 'framework',
      isEssential: true,
      lastUpdated: '2026-02-12',
      tags: ['introduction', 'fondamentaux'],
      draft: true,
    })
    expect(result.success).toBe(true)
  })

  it('T-03 : rejette un frontmatter sans title', () => {
    const result = docsSchema.safeParse({
      description: 'Description.',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-04 : rejette un frontmatter sans description', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-05 : rejette un frontmatter sans order', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: 'Description.',
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-06 : rejette un frontmatter sans section', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: 'Description.',
      order: 1,
    })
    expect(result.success).toBe(false)
  })

  it('T-07 : rejette une section invalide', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: 'Description.',
      order: 1,
      section: 'invalide',
    })
    expect(result.success).toBe(false)
  })

  it('T-08 : rejette un order negatif', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: 'Description.',
      order: -1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-09 : rejette un order decimal', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: 'Description.',
      order: 1.5,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-10 : valide toutes les sections autorisees', () => {
    const sections = [
      'framework', 'mode-operatoire',
      'annexes-templates', 'annexes-roles', 'annexes-boucles',
      'annexes-rituels', 'annexes-metriques', 'annexes-agents',
      'annexes-configuration', 'annexes-bonnes-pratiques', 'annexes-ressources',
    ]
    for (const section of sections) {
      const result = docsSchema.safeParse({
        title: 'Titre',
        description: 'Description.',
        order: 1,
        section,
      })
      expect(result.success).toBe(true)
    }
  })

  it('T-11 : les valeurs par defaut sont appliquees (isEssential, draft)', () => {
    const result = docsSchema.parse({
      title: 'Titre',
      description: 'Description.',
      order: 1,
      section: 'framework',
    })
    expect(result.isEssential).toBe(false)
    expect(result.draft).toBe(false)
  })

  it('T-12 : coerce lastUpdated en Date', () => {
    const result = docsSchema.parse({
      title: 'Titre',
      description: 'Description.',
      order: 1,
      section: 'framework',
      lastUpdated: '2026-02-12',
    })
    expect(result.lastUpdated).toBeInstanceOf(Date)
  })

  it('T-13 : rejette un title vide', () => {
    const result = docsSchema.safeParse({
      title: '',
      description: 'Description.',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-14 : rejette une description vide', () => {
    const result = docsSchema.safeParse({
      title: 'Titre',
      description: '',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })

  it('T-15 : rejette un title trop long (> 200 caracteres)', () => {
    const result = docsSchema.safeParse({
      title: 'A'.repeat(201),
      description: 'Description.',
      order: 1,
      section: 'framework',
    })
    expect(result.success).toBe(false)
  })
})
```

### 8.3 Tests unitaires — Coherence NAVIGATION_TREE / Contenu

```typescript
// tests/unit/content/navigation-content-sync.test.ts
import { describe, it, expect } from 'vitest'
import { NAVIGATION_TREE } from '@/data/navigation'
import { flattenNav } from '@/lib/navigation'
import fs from 'node:fs'
import path from 'node:path'

const CONTENT_DIR = path.resolve('src/content')

/**
 * Verifie que chaque item du NAVIGATION_TREE a un fichier MDX correspondant.
 * Ce test garantit la coherence entre la source de verite (navigation)
 * et le contenu genere (fichiers MDX).
 */
describe('Coherence NAVIGATION_TREE / fichiers MDX', () => {
  const flatItems = flattenNav(NAVIGATION_TREE)

  it('T-16 : tous les items Framework ont un fichier MDX correspondant', () => {
    const frameworkItems = flatItems.filter((item) => item.section === 'framework')
    for (const item of frameworkItems) {
      const slug = item.href.replace('/framework/', '')
      const filePath = path.join(CONTENT_DIR, 'framework', `${slug}.mdx`)
      expect(fs.existsSync(filePath), `Fichier manquant : ${filePath}`).toBe(true)
    }
  })

  it('T-17 : tous les items Mode Operatoire ont un fichier MDX correspondant', () => {
    const moItems = flatItems.filter((item) => item.section === 'mode-operatoire')
    for (const item of moItems) {
      const slug = item.href.replace('/mode-operatoire/', '')
      const filePath = path.join(CONTENT_DIR, 'mode-operatoire', `${slug}.mdx`)
      expect(fs.existsSync(filePath), `Fichier manquant : ${filePath}`).toBe(true)
    }
  })

  it('T-18 : tous les items Annexes ont un fichier MDX correspondant', () => {
    const annexeItems = flatItems.filter((item) => item.section === 'annexes')
    for (const item of annexeItems) {
      const slug = item.href.replace('/annexes/', '')
      // Les categories (profondeur 1) utilisent _index.mdx
      // Les fiches (profondeur 2) utilisent le slug directement
      const segments = slug.split('/')
      let filePath: string
      if (segments.length === 1) {
        // Categorie → _index.mdx
        filePath = path.join(CONTENT_DIR, 'annexes', segments[0], '_index.mdx')
      } else {
        // Fiche → slug.mdx
        filePath = path.join(CONTENT_DIR, 'annexes', `${slug}.mdx`)
      }
      expect(fs.existsSync(filePath), `Fichier manquant : ${filePath}`).toBe(true)
    }
  })

  it('T-19 : le nombre total de fichiers MDX correspond au nombre d\'items', () => {
    const expectedCount = flatItems.length // 71 items
    // Compter les fichiers MDX
    let actualCount = 0
    const countMdx = (dir: string) => {
      if (!fs.existsSync(dir)) return
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.isDirectory()) {
          countMdx(path.join(dir, entry.name))
        } else if (entry.name.endsWith('.mdx')) {
          actualCount++
        }
      }
    }
    countMdx(path.join(CONTENT_DIR, 'framework'))
    countMdx(path.join(CONTENT_DIR, 'mode-operatoire'))
    countMdx(path.join(CONTENT_DIR, 'annexes'))
    expect(actualCount).toBe(expectedCount)
  })
})
```

### 8.4 Tests unitaires — Pages index

```typescript
// tests/unit/pages/section-indexes.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import fs from 'node:fs'
import path from 'node:path'

describe('Pages index de section — Existence des fichiers', () => {
  it('T-20 : le fichier framework/index.astro existe', () => {
    const filePath = path.resolve('src/pages/framework/index.astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it('T-21 : le fichier mode-operatoire/index.astro existe', () => {
    const filePath = path.resolve('src/pages/mode-operatoire/index.astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it('T-22 : le fichier annexes/index.astro existe', () => {
    const filePath = path.resolve('src/pages/annexes/index.astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })
})

describe('Routes dynamiques — Existence des fichiers', () => {
  it('T-23 : le fichier framework/[...slug].astro existe', () => {
    const filePath = path.resolve('src/pages/framework/[...slug].astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it('T-24 : le fichier mode-operatoire/[...slug].astro existe', () => {
    const filePath = path.resolve('src/pages/mode-operatoire/[...slug].astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it('T-25 : le fichier annexes/[...slug].astro existe', () => {
    const filePath = path.resolve('src/pages/annexes/[...slug].astro')
    expect(fs.existsSync(filePath)).toBe(true)
  })
})
```

### 8.5 Tests unitaires — Page d'accueil mise a jour

```typescript
// tests/unit/pages/homepage.test.ts
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Page d\'accueil — Integration navigation', () => {
  const indexContent = fs.readFileSync(
    path.resolve('src/pages/index.astro'),
    'utf-8',
  )

  it('T-26 : importe BaseLayout', () => {
    expect(indexContent).toContain('BaseLayout')
  })

  it('T-27 : importe Header', () => {
    expect(indexContent).toContain('Header')
  })

  it('T-28 : utilise BaseLayout comme wrapper', () => {
    expect(indexContent).toContain('<BaseLayout')
  })

  it('T-29 : rend le Header', () => {
    expect(indexContent).toContain('<Header')
  })

  it('T-30 : conserve le HeroSection', () => {
    expect(indexContent).toContain('<HeroSection')
  })
})
```

### 8.6 Tests unitaires — Validation des slugs annexes

```typescript
// tests/unit/pages/annexes-routes.test.ts
import { describe, it, expect } from 'vitest'

describe('Annexes — Transformation des slugs', () => {
  const transformSlug = (slug: string) => slug.replace(/\/_index$/, '')

  it('T-31 : transforme templates/_index en templates', () => {
    expect(transformSlug('templates/_index')).toBe('templates')
  })

  it('T-32 : ne modifie pas templates/prd', () => {
    expect(transformSlug('templates/prd')).toBe('templates/prd')
  })

  it('T-33 : transforme roles/_index en roles', () => {
    expect(transformSlug('roles/_index')).toBe('roles')
  })

  it('T-34 : ne modifie pas roles/product-manager', () => {
    expect(transformSlug('roles/product-manager')).toBe('roles/product-manager')
  })

  it('T-35 : gere les 9 categories d\'index', () => {
    const categories = [
      'templates', 'roles', 'boucles', 'rituels', 'metriques',
      'agents', 'configuration', 'bonnes-pratiques', 'ressources',
    ]
    for (const cat of categories) {
      expect(transformSlug(`${cat}/_index`)).toBe(cat)
    }
  })
})
```

### 8.7 Tests de build — Verification complete

```typescript
// tests/unit/content/build-validation.test.ts
import { describe, it, expect } from 'vitest'
import { docsSchema } from '@/schemas/docs'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const CONTENT_DIR = path.resolve('src/content')

/**
 * Valide que tous les fichiers MDX ont un frontmatter conforme au schema.
 */
describe('Validation des frontmatter MDX', () => {
  const collectMdxFiles = (dir: string): string[] => {
    const files: string[] = []
    if (!fs.existsSync(dir)) return files
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...collectMdxFiles(fullPath))
      } else if (entry.name.endsWith('.mdx')) {
        files.push(fullPath)
      }
    }
    return files
  }

  const allMdxFiles = [
    ...collectMdxFiles(path.join(CONTENT_DIR, 'framework')),
    ...collectMdxFiles(path.join(CONTENT_DIR, 'mode-operatoire')),
    ...collectMdxFiles(path.join(CONTENT_DIR, 'annexes')),
  ]

  it('T-36 : tous les fichiers MDX existent (au moins 71)', () => {
    expect(allMdxFiles.length).toBeGreaterThanOrEqual(71)
  })

  for (const filePath of allMdxFiles) {
    const relativePath = path.relative(CONTENT_DIR, filePath)

    it(`T-37+ : frontmatter valide pour ${relativePath}`, () => {
      const content = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(content)
      const result = docsSchema.safeParse(data)
      expect(result.success, `Frontmatter invalide dans ${relativePath}: ${JSON.stringify(result.error?.issues)}`).toBe(true)
    })
  }
})
```

### 8.8 Resume des tests

| # | Categorie | Nombre | Description |
|---|-----------|--------|-------------|
| T-01 → T-15 | Schema docsSchema | 15 | Validation, rejet, valeurs par defaut, sections, types |
| T-16 → T-19 | Coherence nav/contenu | 4 | Sync NAVIGATION_TREE ↔ fichiers MDX, comptage |
| T-20 → T-25 | Existence des fichiers | 6 | Pages index, routes dynamiques |
| T-26 → T-30 | Page d'accueil | 5 | Imports BaseLayout/Header, rendu |
| T-31 → T-35 | Slugs annexes | 5 | Transformation _index, categories |
| T-36 → T-37+ | Validation frontmatter | 72+ | Existence et validite de chaque MDX |
| **Total** | | **107+** | |

> **Note** : Le nombre exact de tests T-37+ depend du nombre de fichiers MDX (71 fichiers = 71 tests de frontmatter, plus le test de comptage T-36).

### 8.9 Assertions cles

| Test | Assertion | Criticite |
|------|-----------|-----------|
| T-01 | Schema accepte un frontmatter minimal valide | Bloquant |
| T-07 | Schema rejette une section invalide | Bloquant |
| T-10 | Toutes les sections enum sont valides | Bloquant |
| T-16 | Chaque item Framework a un fichier MDX | Bloquant |
| T-17 | Chaque item Mode Operatoire a un fichier MDX | Bloquant |
| T-18 | Chaque item Annexes a un fichier MDX | Bloquant |
| T-19 | Nombre total de fichiers MDX = 71 | Bloquant |
| T-26 | Page d'accueil importe BaseLayout | Bloquant |
| T-27 | Page d'accueil importe Header | Bloquant |
| T-31 | Slug `_index` transforme correctement | Bloquant |
| T-36 | Au moins 71 fichiers MDX existent | Bloquant |
| T-37+ | Chaque frontmatter est valide | Bloquant |

---

## 9. Criteres d'acceptation

| ID | Critere | Verifie par |
|----|---------|-------------|
| CA-01 | Le fichier `src/schemas/docs.ts` est cree avec le schema `docsSchema` | T-01 a T-15 |
| CA-02 | Le fichier `src/content/config.ts` est mis a jour avec 3 nouvelles collections | Verification fichier |
| CA-03 | 8 fichiers MDX sont crees dans `src/content/framework/` | T-16 |
| CA-04 | 8 fichiers MDX sont crees dans `src/content/mode-operatoire/` | T-17 |
| CA-05 | 55 fichiers MDX sont crees dans `src/content/annexes/` (9 _index + 46 fiches) | T-18, T-19 |
| CA-06 | Tous les frontmatter MDX sont valides (schema `docsSchema`) | T-36, T-37+ |
| CA-07 | Le fichier `src/pages/framework/[...slug].astro` est cree | T-23 |
| CA-08 | Le fichier `src/pages/mode-operatoire/[...slug].astro` est cree | T-24 |
| CA-09 | Le fichier `src/pages/annexes/[...slug].astro` est cree | T-25 |
| CA-10 | Le fichier `src/pages/framework/index.astro` est cree | T-20 |
| CA-11 | Le fichier `src/pages/mode-operatoire/index.astro` est cree | T-21 |
| CA-12 | Le fichier `src/pages/annexes/index.astro` est cree | T-22 |
| CA-13 | La page d'accueil utilise BaseLayout et Header | T-26 a T-30 |
| CA-14 | Les slugs `_index` des annexes sont transformes correctement | T-31 a T-35 |
| CA-15 | Chaque item du NAVIGATION_TREE correspond a une route generee | T-16 a T-19 |
| CA-16 | Les pages docs utilisent DocsLayout avec headings | Verification visuelle |
| CA-17 | Les pages index utilisent DocsLayout avec `showToc={false}` et `showPrevNext={false}` | Verification visuelle |
| CA-18 | Le build Astro reussit (`pnpm build`) | CI |
| CA-19 | TypeScript compile sans erreur (`pnpm typecheck`) | CI |
| CA-20 | ESLint passe sans warning (`pnpm lint`) | CI |
| CA-21 | Les 107+ tests passent (`pnpm test:unit`) | CI |

---

## 10. Definition of Done

- [ ] Fichier `src/schemas/docs.ts` cree avec le schema `docsSchema`
- [ ] Fichier `src/content/config.ts` mis a jour avec les 3 collections `framework`, `mode-operatoire`, `annexes`
- [ ] 8 fichiers MDX placeholder crees dans `src/content/framework/`
- [ ] 8 fichiers MDX placeholder crees dans `src/content/mode-operatoire/`
- [ ] 55 fichiers MDX placeholder crees dans `src/content/annexes/` (9 sous-dossiers avec `_index.mdx` + fiches)
- [ ] Chaque fichier MDX a un frontmatter valide conforme au `docsSchema`
- [ ] Les titres, descriptions et orders des MDX correspondent au `NAVIGATION_TREE`
- [ ] Fichier `src/pages/framework/[...slug].astro` cree avec `getStaticPaths()`
- [ ] Fichier `src/pages/mode-operatoire/[...slug].astro` cree avec `getStaticPaths()`
- [ ] Fichier `src/pages/annexes/[...slug].astro` cree avec `getStaticPaths()` et transformation `_index`
- [ ] Fichier `src/pages/framework/index.astro` cree (liste des chapitres)
- [ ] Fichier `src/pages/mode-operatoire/index.astro` cree (liste des chapitres)
- [ ] Fichier `src/pages/annexes/index.astro` cree (liste des 9 categories)
- [ ] Fichier `src/pages/index.astro` mis a jour (BaseLayout + Header + HeroSection)
- [ ] Le build Astro reussit sans erreur (`pnpm build`)
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Les 107+ tests unitaires passent (`pnpm test:unit`)
- [ ] La navigation fonctionne entre toutes les pages (verification manuelle)
- [ ] Les breadcrumbs sont corrects sur chaque page
- [ ] Les liens prev/next sont corrects aux frontieres des sections
- [ ] La page d'accueil affiche le Header de navigation
- [ ] Le responsive est correct (1/2/3 colonnes) sur les pages docs
- [ ] 0 JS client supplementaire (les routes sont 100% statiques)

---

## 11. Notes d'implementation

### 11.1 Ordre d'implementation recommande

1. **Creer `src/schemas/docs.ts`** avec le schema Zod
2. **Mettre a jour `src/content/config.ts`** pour ajouter les 3 collections
3. **Creer les dossiers de contenu** : `src/content/framework/`, `src/content/mode-operatoire/`, `src/content/annexes/` (avec les 9 sous-dossiers)
4. **Creer les 71 fichiers MDX placeholder** avec les frontmatter corrects
5. **Creer les 3 routes dynamiques** `[...slug].astro`
6. **Creer les 3 pages index** de section
7. **Mettre a jour la page d'accueil** avec BaseLayout + Header
8. **Verifier le build** (`pnpm build`)
9. **Ecrire les tests**
10. **Verification visuelle** de la navigation

### 11.2 Points d'attention

| Point | Detail |
|-------|--------|
| **Coherence slugs/hrefs** | Les slugs des fichiers MDX doivent correspondre exactement aux `href` du `NAVIGATION_TREE` (sans le prefixe de section). Toute incoherence provoquera une page 404 ou un lien mort. |
| **Transformation `_index`** | Les fichiers `_index.mdx` dans les annexes servent de page de categorie. Le slug `templates/_index` doit etre transforme en `templates` dans `getStaticPaths()` pour correspondre a l'URL `/annexes/templates`. |
| **Draft en dev vs prod** | Les fichiers MDX avec `draft: true` sont accessibles en `astro dev` mais exclus en `astro build`. Pour valider la navigation complete, utiliser `astro dev` ou passer temporairement `draft: false`. |
| **Astro Content Collections cache** | Apres avoir cree les fichiers MDX, il peut etre necessaire de redemarrer le serveur de dev ou supprimer le cache `.astro/` pour que les collections soient detectees. |
| **gray-matter pour les tests** | Les tests de validation des frontmatter utilisent `gray-matter` pour parser les fichiers MDX. Cette dependance doit etre ajoutee en devDependency si elle n'est pas deja presente. |
| **Ordre dans les pages index** | Les pages index trient les items par `order` du frontmatter. Cet ordre doit etre coherent avec le `NAVIGATION_TREE` pour une experience coherente. |
| **Performance du build** | 71 pages MDX + les pages existantes. Le build devrait rester rapide (< 30s) car les pages sont des placeholders legers. |
| **Astro config `trailingSlash`** | Verifier la configuration `trailingSlash` dans `astro.config.mjs` pour eviter les problemes de routage. La valeur recommandee est `'never'` pour des URLs propres. |

### 11.3 Script d'aide a la generation des fichiers MDX

Pour faciliter la creation des 71 fichiers MDX, un script Node.js peut etre utilise :

```typescript
// scripts/generate-mdx-placeholders.ts (optionnel, aide a l'implementation)

import { NAVIGATION_TREE } from '../src/data/navigation'
import { flattenNav } from '../src/lib/navigation'
import fs from 'node:fs'
import path from 'node:path'

const CONTENT_DIR = path.resolve('src/content')

function generateFrontmatter(item: { label: string; href: string; section?: string; order?: number; badge?: string }) {
  const section = detectSection(item)
  return `---
title: "${item.label}"
description: "${item.label} - Documentation AIAD."
order: ${item.order ?? 0}
section: "${section}"
isEssential: ${item.badge === 'essential'}
draft: true
---

# ${item.label}

> Cette page est en cours de redaction. Le contenu sera disponible prochainement.

## Vue d'ensemble

Contenu a venir.

## Points cles

Contenu a venir.
`
}

// ... logique de detection de section et creation des fichiers
```

> **Note** : Ce script est un outil d'aide, pas un livrable. Les fichiers MDX peuvent aussi etre crees manuellement.

### 11.4 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| Contenu redactionnel | Remplacer les placeholders par le vrai contenu du framework et du mode operatoire | Non definie |
| Migration Markdown existant | Migrer les fichiers markdown existants (`/framework/`, `/mode operatoire/`, `/annexes/`) vers les Content Collections MDX | Non definie |
| Page 404 personnalisee | Creer une page 404 avec navigation et suggestions | Non definie |
| Footer global | Ajouter un footer avec liens utiles et copyright | Non definie |
| Recherche Pagefind | Integrer Pagefind pour la recherche dans le contenu | US ulterieure |
| Mode sombre | Variantes de couleurs pour le dark mode | Non definie |

---

## 12. References

| Ressource | Lien |
|-----------|------|
| US-004 Spec | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| T-004-B1 Types navigation | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| T-004-B3 Configuration navigation | [T-004-B3-configuration-navigation.md](./T-004-B3-configuration-navigation.md) |
| T-004-B4 Helpers navigation | [T-004-B4-helpers-navigation.md](./T-004-B4-helpers-navigation.md) |
| T-004-F1 BaseLayout | [T-004-F1-composant-BaseLayout.md](./T-004-F1-composant-BaseLayout.md) |
| T-004-F10 DocsLayout | [T-004-F10-layout-DocsLayout.md](./T-004-F10-layout-DocsLayout.md) |
| Astro Content Collections | https://docs.astro.build/en/guides/content-collections/ |
| Astro Dynamic Routes | https://docs.astro.build/en/guides/routing/#dynamic-routes |
| Astro getStaticPaths | https://docs.astro.build/en/reference/api-reference/#getstaticpaths |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 12/02/2026 | Creation initiale — integration navigation, routes dynamiques, 71 fichiers MDX placeholder, 3 pages index, mise a jour accueil, schema docs, 107+ tests |
