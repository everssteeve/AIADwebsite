# Architecture Technique - Site Web AIAD

**Version :** 1.0
**Date :** 16 janvier 2026
**Statut :** Validé

---

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack technique](#stack-technique)
3. [Structure du projet](#structure-du-projet)
4. [Conventions de code](#conventions-de-code)
5. [Patterns utilisés](#patterns-utilisés)
6. [API et interfaces](#api-et-interfaces)
7. [Base de données](#base-de-données)
8. [Tests](#tests)

---

## Vue d'ensemble

### Description

Le site AIAD est une **plateforme de documentation statique** présentant le Framework AIAD (AI-Agent Iterative Development) et son Mode Opératoire. L'architecture suit une approche **JAMstack** (JavaScript, APIs, Markup) optimisée pour la performance, le SEO et l'accessibilité.

### Principes architecturaux

| Principe | Description |
|----------|-------------|
| **Static-first** | Génération statique à 100%, pas de serveur runtime |
| **Content-driven** | Le contenu MDX pilote la structure du site |
| **Zero JS by default** | JavaScript uniquement où nécessaire (islands) |
| **Progressive enhancement** | Fonctionnel sans JS, enrichi avec JS |
| **Mobile-first** | Design responsive partant du mobile |

### Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           UTILISATEURS                               │
│                    (Desktop, Mobile, Tablette)                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         VERCEL CDN                                   │
│              (Edge Network, Cache, HTTPS, Analytics)                 │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SITE STATIQUE (HTML/CSS/JS)                     │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Pages     │  │ Components  │  │   Assets    │  │  Pagefind   │ │
│  │   (.html)   │  │   (Islands) │  │  (CSS/IMG)  │  │   (Search)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │ Build (SSG)
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                          ASTRO BUILD                                 │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐                   │
│  │  Content Collections │  │    Composants       │                   │
│  │  (MDX Framework +   │  │    Astro/React      │                   │
│  │   Mode Opératoire)  │  │                     │                   │
│  └─────────────────────┘  └─────────────────────┘                   │
└─────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVICES EXTERNES                            │
├──────────────────┬──────────────────┬───────────────────────────────┤
│    Mailchimp     │  Vercel Analytics │        GitHub                 │
│   (Newsletter)   │    (Métriques)    │    (Versioning)               │
└──────────────────┴──────────────────┴───────────────────────────────┘
```

### Flux de données

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Auteur  │────▶│   MDX    │────▶│  Astro   │────▶│   HTML   │
│ (Contenu)│     │ (Source) │     │ (Build)  │     │ (Output) │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │ Pagefind │
                                  │ (Index)  │
                                  └──────────┘
```

---

## Stack technique

### Technologies principales

| Couche | Technologie | Version | Justification |
|--------|-------------|---------|---------------|
| **Framework** | Astro | 4.x | SSG content-first, 0 JS par défaut, MDX natif |
| **Langage** | TypeScript | 5.x | Type safety, meilleure DX, refactoring sûr |
| **Styling** | Tailwind CSS | 3.x | Utility-first, purge auto, responsive natif |
| **Contenu** | MDX | 3.x | Markdown + composants, idéal pour documentation |
| **Recherche** | Pagefind | 1.x | Index statique, < 50kb, < 500ms |
| **Package Manager** | pnpm | 8.x | Rapide, économe en espace, strict |

### Outils de développement

| Outil | Version | Usage |
|-------|---------|-------|
| Node.js | 20.x LTS | Runtime |
| ESLint | 8.x | Linting JavaScript/TypeScript |
| Prettier | 3.x | Formatage du code |
| Husky | 9.x | Git hooks (pre-commit) |
| lint-staged | 15.x | Lint sur fichiers stagés uniquement |

### Infrastructure

| Service | Usage | Tier |
|---------|-------|------|
| **Vercel** | Hébergement, CDN, Preview Deploys | Free |
| **GitHub** | Versioning, CI/CD trigger | Free |
| **Vercel Analytics** | Métriques de trafic | Free |
| **Mailchimp** | Newsletter | Free (< 500 contacts) |

### Dépendances principales

```json
{
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/mdx": "^3.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0",
    "prettier-plugin-astro": "^0.13.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "pagefind": "^1.0.0",
    "playwright": "^1.41.0",
    "vitest": "^1.2.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

---

## Structure du projet

### Arborescence

```
aiad-website/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Pipeline CI/CD
├── .husky/
│   └── pre-commit                 # Hook pre-commit
├── public/
│   ├── fonts/                     # Polices locales (RGESN)
│   ├── images/
│   │   ├── og/                    # Images Open Graph (1200x630)
│   │   └── icons/                 # Favicons, icônes
│   └── templates/                 # Templates téléchargeables
│       ├── prd-template.md
│       ├── architecture-template.md
│       ├── claude-md-template.md
│       └── specs-template.md
├── src/
│   ├── components/
│   │   ├── common/                # Composants réutilisables
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── Badge.astro
│   │   │   └── Tooltip.astro
│   │   ├── layout/                # Composants de structure
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Sidebar.astro
│   │   │   ├── Breadcrumb.astro
│   │   │   ├── TableOfContents.astro
│   │   │   └── MobileMenu.astro
│   │   ├── content/               # Composants pour le contenu
│   │   │   ├── CodeBlock.astro
│   │   │   ├── Callout.astro
│   │   │   ├── Table.astro
│   │   │   └── DownloadButton.astro
│   │   └── search/                # Composants de recherche
│   │       └── SearchDialog.astro # Island (client:load)
│   ├── content/
│   │   ├── config.ts              # Schémas Content Collections
│   │   ├── framework/             # Contenu Framework AIAD
│   │   │   ├── introduction.mdx
│   │   │   ├── partie-1/          # Rôles et responsabilités
│   │   │   │   ├── index.mdx
│   │   │   │   ├── product-owner.mdx
│   │   │   │   ├── tech-lead.mdx
│   │   │   │   ├── product-engineer.mdx
│   │   │   │   ├── qa.mdx
│   │   │   │   ├── devops.mdx
│   │   │   │   └── agents-specialises.mdx
│   │   │   ├── partie-2/          # Artefacts et documentation
│   │   │   ├── partie-3/          # Rituels et workflow
│   │   │   └── partie-4/          # Métriques
│   │   ├── mode-operatoire/       # Contenu Mode Opératoire
│   │   │   ├── partie-0/          # Préambule
│   │   │   ├── partie-1/          # Initialisation
│   │   │   ├── partie-2/          # Planification
│   │   │   ├── partie-3/          # Développement
│   │   │   ├── partie-4/          # Validation
│   │   │   ├── partie-5/          # Déploiement
│   │   │   ├── partie-6/          # Rituels
│   │   │   └── partie-7/          # Annexes
│   │   ├── templates/             # Métadonnées des templates
│   │   │   ├── prd.mdx
│   │   │   ├── architecture.mdx
│   │   │   ├── claude-md.mdx
│   │   │   └── specs.mdx
│   │   └── glossaire/             # Termes du glossaire
│   │       └── *.mdx
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Layout racine (head, scripts)
│   │   ├── PageLayout.astro       # Pages standard
│   │   └── DocsLayout.astro       # Pages documentation (sidebar)
│   ├── pages/
│   │   ├── index.astro            # Page d'accueil
│   │   ├── pour-qui.astro         # Page "Pour qui ?"
│   │   ├── comparaisons.astro     # Comparaisons méthodologies
│   │   ├── glossaire.astro        # Glossaire
│   │   ├── templates/
│   │   │   └── index.astro        # Liste des templates
│   │   ├── framework/
│   │   │   ├── index.astro        # Overview Framework
│   │   │   └── [...slug].astro    # Pages dynamiques Framework
│   │   ├── mode-operatoire/
│   │   │   ├── index.astro        # Overview Mode Opératoire
│   │   │   └── [...slug].astro    # Pages dynamiques
│   │   ├── 404.astro              # Page erreur 404
│   │   ├── robots.txt.ts          # Génération robots.txt
│   │   └── sitemap-index.xml.ts   # Sitemap (via @astrojs/sitemap)
│   ├── styles/
│   │   └── global.css             # Styles globaux (Tailwind base)
│   ├── lib/
│   │   ├── utils.ts               # Fonctions utilitaires
│   │   ├── reading-time.ts        # Calcul temps de lecture
│   │   └── navigation.ts          # Helpers navigation
│   └── types/
│       └── index.ts               # Types TypeScript globaux
├── tests/
│   ├── e2e/                       # Tests Playwright
│   │   ├── navigation.spec.ts
│   │   ├── search.spec.ts
│   │   └── accessibility.spec.ts
│   └── unit/                      # Tests Vitest
│       └── utils.test.ts
├── astro.config.mjs               # Configuration Astro
├── tailwind.config.mjs            # Configuration Tailwind
├── tsconfig.json                  # Configuration TypeScript
├── .eslintrc.cjs                  # Configuration ESLint
├── .prettierrc                    # Configuration Prettier
├── .env.example                   # Variables d'environnement
├── package.json
├── pnpm-lock.yaml
└── README.md
```

### Description des dossiers principaux

| Dossier | Description |
|---------|-------------|
| `src/components/` | Composants Astro réutilisables, organisés par domaine |
| `src/content/` | Contenu MDX géré par Content Collections |
| `src/layouts/` | Templates de mise en page |
| `src/pages/` | Routes du site (file-based routing) |
| `src/lib/` | Fonctions utilitaires et helpers |
| `public/` | Assets statiques servis tels quels |
| `tests/` | Tests E2E et unitaires |

---

## Conventions de code

### Nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| **Fichiers composants** | PascalCase.astro | `SearchDialog.astro` |
| **Fichiers utilitaires** | kebab-case.ts | `reading-time.ts` |
| **Fichiers contenu** | kebab-case.mdx | `product-engineer.mdx` |
| **Dossiers** | kebab-case | `mode-operatoire/` |
| **Variables** | camelCase | `readingTime` |
| **Constantes** | SCREAMING_SNAKE_CASE | `MAX_SEARCH_RESULTS` |
| **Types/Interfaces** | PascalCase | `ContentItem` |
| **CSS classes** | Tailwind utilities | `text-gray-900 dark:text-white` |

### Formatage

Configuration Prettier (`.prettierrc`) :

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

### Imports

Ordre des imports (automatisé par ESLint) :

```typescript
// 1. Modules Node.js natifs
import { readFileSync } from 'node:fs'

// 2. Dépendances externes
import { getCollection } from 'astro:content'

// 3. Alias internes (@/)
import { formatDate } from '@/lib/utils'

// 4. Imports relatifs
import Header from '../components/layout/Header.astro'

// 5. Types (toujours en dernier)
import type { ContentItem } from '@/types'
```

Configuration des alias (`tsconfig.json`) :

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"],
      "@content/*": ["src/content/*"]
    }
  }
}
```

### TypeScript

Mode strict activé (`tsconfig.json`) :

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## Patterns utilisés

### 1. Content Collections (Astro)

Gestion type-safe du contenu MDX avec validation de schéma.

**Définition du schéma** (`src/content/config.ts`) :

```typescript
import { defineCollection, z } from 'astro:content'

const frameworkCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    section: z.enum(['introduction', 'partie-1', 'partie-2', 'partie-3', 'partie-4']),
    readingTime: z.number().optional(),
    tags: z.array(z.string()).optional(),
    lastUpdated: z.date().optional(),
  }),
})

const modeOperatoireCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    section: z.enum(['partie-0', 'partie-1', 'partie-2', 'partie-3', 'partie-4', 'partie-5', 'partie-6', 'partie-7']),
    isEssential: z.boolean().default(false),
    readingTime: z.number().optional(),
    lastUpdated: z.date().optional(),
  }),
})

export const collections = {
  framework: frameworkCollection,
  'mode-operatoire': modeOperatoireCollection,
}
```

**Utilisation** :

```typescript
import { getCollection } from 'astro:content'

const frameworkPosts = await getCollection('framework')
const sortedPosts = frameworkPosts.sort((a, b) => a.data.order - b.data.order)
```

### 2. Layout Composition

Composition de layouts pour éviter la duplication.

```astro
<!-- BaseLayout.astro - Layout racine -->
---
interface Props {
  title: string
  description: string
  ogImage?: string
}

const { title, description, ogImage = '/images/og/default.png' } = Astro.props
---

<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} | AIAD</title>
    <meta name="description" content={description} />
    <meta property="og:image" content={ogImage} />
    <link rel="stylesheet" href="/styles/global.css" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

```astro
<!-- DocsLayout.astro - Étend BaseLayout -->
---
import BaseLayout from './BaseLayout.astro'
import Sidebar from '@components/layout/Sidebar.astro'
import TableOfContents from '@components/layout/TableOfContents.astro'

interface Props {
  title: string
  description: string
  headings: { depth: number; text: string; slug: string }[]
}

const { title, description, headings } = Astro.props
---

<BaseLayout title={title} description={description}>
  <div class="flex">
    <Sidebar />
    <main class="flex-1 px-8 py-12">
      <slot />
    </main>
    <TableOfContents headings={headings} />
  </div>
</BaseLayout>
```

### 3. Island Architecture

JavaScript hydraté uniquement pour les composants interactifs.

```astro
<!-- Page avec island -->
---
import SearchDialog from '@components/search/SearchDialog.astro'
---

<!-- Statique - pas de JS -->
<header>
  <nav>...</nav>

  <!-- Island - hydraté côté client -->
  <SearchDialog client:load />
</header>
```

Directives d'hydratation disponibles :

| Directive | Comportement |
|-----------|--------------|
| `client:load` | Hydrate immédiatement au chargement |
| `client:idle` | Hydrate quand le navigateur est idle |
| `client:visible` | Hydrate quand l'élément est visible |
| `client:media` | Hydrate selon une media query |

### 4. Slot Pattern

Composition flexible des composants.

```astro
<!-- Callout.astro -->
---
interface Props {
  type: 'info' | 'warning' | 'tip'
}

const { type } = Astro.props
const styles = {
  info: 'bg-blue-50 border-blue-500',
  warning: 'bg-amber-50 border-amber-500',
  tip: 'bg-green-50 border-green-500',
}
---

<aside class={`border-l-4 p-4 ${styles[type]}`}>
  <slot name="title" />
  <slot />
</aside>
```

**Utilisation en MDX** :

```mdx
<Callout type="tip">
  <span slot="title">Conseil</span>
  Commencez par lire l'introduction avant de plonger dans les détails.
</Callout>
```

### 5. Dynamic Routes

Génération de pages à partir du contenu.

```astro
<!-- src/pages/framework/[...slug].astro -->
---
import { getCollection } from 'astro:content'
import DocsLayout from '@layouts/DocsLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('framework')
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }))
}

const { post } = Astro.props
const { Content, headings } = await post.render()
---

<DocsLayout title={post.data.title} description={post.data.description} headings={headings}>
  <Content />
</DocsLayout>
```

---

## API et interfaces

### Contrats de données

#### ContentItem (Frontmatter)

```typescript
// src/types/index.ts

export interface BaseContentItem {
  title: string
  description: string
  order: number
  readingTime?: number
  lastUpdated?: Date
  tags?: string[]
}

export interface FrameworkItem extends BaseContentItem {
  section: 'introduction' | 'partie-1' | 'partie-2' | 'partie-3' | 'partie-4'
}

export interface ModeOperatoireItem extends BaseContentItem {
  section: 'partie-0' | 'partie-1' | 'partie-2' | 'partie-3' | 'partie-4' | 'partie-5' | 'partie-6' | 'partie-7'
  isEssential: boolean
}

export interface TemplateItem {
  id: string
  title: string
  description: string
  category: 'framework' | 'mode-operatoire'
  roles: ('product-owner' | 'tech-lead' | 'product-engineer')[]
  formats: ('markdown' | 'pdf')[]
  downloadUrl: string
  previewContent: string
}

export interface GlossaryTerm {
  term: string
  definition: string
  relatedTerms?: string[]
  source: 'framework' | 'mode-operatoire' | 'both'
}
```

#### Navigation

```typescript
export interface NavigationItem {
  label: string
  href: string
  children?: NavigationItem[]
  badge?: 'new' | 'essential'
}

export interface Breadcrumb {
  label: string
  href: string
}

export interface TableOfContentsItem {
  depth: number // 2-4 (h2-h4)
  text: string
  slug: string
}
```

### Formats d'échange

#### Template téléchargeable

Les templates sont servis depuis `/public/templates/` en deux formats :

**Markdown** (`.md`) :
```markdown
# Template PRD

## Section 1
...
```

**PDF** : Généré à partir du Markdown via un script de build.

#### Newsletter (Mailchimp)

Intégration via formulaire HTML embedded :

```html
<form action="https://aiad.us1.list-manage.com/subscribe/post" method="POST">
  <input type="email" name="EMAIL" required />
  <input type="hidden" name="u" value="MAILCHIMP_USER_ID" />
  <input type="hidden" name="id" value="MAILCHIMP_LIST_ID" />
  <button type="submit">S'abonner</button>
</form>
```

---

## Base de données

### Stockage

**Aucune base de données** n'est utilisée pour le MVP/V1.

| Donnée | Stockage | Raison |
|--------|----------|--------|
| Contenu (Framework, Mode Op.) | Fichiers MDX (Git) | Versioning, collaboration, gratuit |
| Templates | Fichiers statiques (Git) | Simplicité, pas de dépendance |
| Progression utilisateur | localStorage | Pas de compte requis (RGPD) |
| Analytics | Vercel Analytics | Service externe, gratuit |
| Newsletter | Mailchimp | Service externe, gratuit |

### localStorage Schema

```typescript
// Clé : 'aiad-progress'
interface UserProgress {
  gettingStarted: {
    completedSteps: number[] // [1, 2, 3]
    lastVisited: string // ISO date
  }
  preferences: {
    theme?: 'light' | 'dark' | 'system'
    fontSize?: 'small' | 'medium' | 'large'
  }
}
```

**Implémentation** :

```typescript
// src/lib/storage.ts

const STORAGE_KEY = 'aiad-progress'

export function getProgress(): UserProgress | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function saveProgress(progress: Partial<UserProgress>): void {
  if (typeof window === 'undefined') return
  const current = getProgress() || {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...progress }))
}

export function markStepComplete(step: number): void {
  const progress = getProgress()
  const steps = progress?.gettingStarted?.completedSteps || []
  if (!steps.includes(step)) {
    saveProgress({
      gettingStarted: {
        completedSteps: [...steps, step],
        lastVisited: new Date().toISOString(),
      },
    })
  }
}
```

### Évolutions futures (post-V1)

Pour l'Assistant IA CoPilot et les fonctionnalités avancées :

| Fonctionnalité | Solution envisagée |
|----------------|-------------------|
| Chatbot IA | Vercel Edge Functions + API Anthropic |
| Comptes utilisateurs | Vercel KV ou Turso (SQLite edge) |
| Forum | GitHub Discussions (externe) |

---

## Tests

### Stratégie de test

| Type | Outil | Couverture cible | Focus |
|------|-------|------------------|-------|
| **E2E** | Playwright | Parcours critiques | Navigation, recherche, accessibilité |
| **Unitaires** | Vitest | 80% | Fonctions utilitaires |
| **Accessibilité** | axe-core + Playwright | 100% pages | RGAA AA |
| **Performance** | Lighthouse CI | Score > 90 | LCP, CLS, FID |

### Organisation des tests

```
tests/
├── e2e/
│   ├── navigation.spec.ts      # Tests navigation < 3 clics
│   ├── search.spec.ts          # Tests recherche < 500ms
│   ├── accessibility.spec.ts   # Tests RGAA (axe-core)
│   ├── templates.spec.ts       # Tests téléchargement
│   └── responsive.spec.ts      # Tests mobile/tablette/desktop
├── unit/
│   ├── utils.test.ts           # Tests fonctions utilitaires
│   ├── reading-time.test.ts    # Tests calcul temps lecture
│   └── navigation.test.ts      # Tests helpers navigation
└── fixtures/
    └── content/                # Contenu MDX de test
```

### Exemples de tests

**Test E2E - Navigation** :

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('accède à une page en moins de 3 clics', async ({ page }) => {
    await page.goto('/')

    // Clic 1 : Menu Framework
    await page.click('nav >> text=Framework')

    // Clic 2 : Partie 1
    await page.click('text=Rôles et responsabilités')

    // Clic 3 : Product Engineer
    await page.click('text=Product Engineer')

    await expect(page).toHaveURL('/framework/partie-1/product-engineer')
    await expect(page.locator('h1')).toContainText('Product Engineer')
  })

  test('breadcrumb permet de remonter', async ({ page }) => {
    await page.goto('/framework/partie-1/product-engineer')

    await page.click('nav[aria-label="Breadcrumb"] >> text=Partie 1')

    await expect(page).toHaveURL('/framework/partie-1')
  })
})
```

**Test E2E - Recherche** :

```typescript
// tests/e2e/search.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Recherche', () => {
  test('trouve des résultats en moins de 500ms', async ({ page }) => {
    await page.goto('/')

    // Ouvre la recherche avec Ctrl+K
    await page.keyboard.press('Control+k')

    const searchInput = page.locator('[data-search-input]')
    await expect(searchInput).toBeFocused()

    const startTime = Date.now()
    await searchInput.fill('Product Engineer')

    // Attend les résultats
    await expect(page.locator('[data-search-results]')).toBeVisible()

    const endTime = Date.now()
    expect(endTime - startTime).toBeLessThan(500)

    // Vérifie qu'il y a des résultats
    const results = page.locator('[data-search-result]')
    await expect(results).toHaveCount({ minimum: 1 })
  })
})
```

**Test Accessibilité** :

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibilité RGAA', () => {
  const pages = [
    '/',
    '/framework',
    '/mode-operatoire',
    '/templates',
    '/glossaire',
  ]

  for (const path of pages) {
    test(`${path} respecte WCAG AA`, async ({ page }) => {
      await page.goto(path)

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()

      expect(results.violations).toEqual([])
    })
  }

  test('navigation au clavier fonctionne', async ({ page }) => {
    await page.goto('/')

    // Tab jusqu'au premier lien
    await page.keyboard.press('Tab')

    // Vérifie que le focus est visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // Vérifie l'outline
    const outline = await focusedElement.evaluate(
      (el) => window.getComputedStyle(el).outline
    )
    expect(outline).not.toBe('none')
  })
})
```

**Test Unitaire** :

```typescript
// tests/unit/reading-time.test.ts
import { describe, it, expect } from 'vitest'
import { calculateReadingTime } from '@/lib/reading-time'

describe('calculateReadingTime', () => {
  it('calcule le temps de lecture en minutes', () => {
    const content = 'Lorem ipsum '.repeat(200) // ~400 mots
    const time = calculateReadingTime(content)

    expect(time).toBe(2) // 200 mots/min
  })

  it('retourne 1 minute minimum', () => {
    const content = 'Court texte.'
    const time = calculateReadingTime(content)

    expect(time).toBe(1)
  })

  it('ignore le code dans le calcul', () => {
    const content = `
      Introduction.
      \`\`\`javascript
      const x = 1;
      const y = 2;
      \`\`\`
      Conclusion.
    `
    const time = calculateReadingTime(content)

    expect(time).toBe(1) // Seul le texte compte
  })
})
```

### Configuration CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm build
      - run: pnpm test:e2e

  lighthouse:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
```

### Scripts npm

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pnpm pagefind",
    "preview": "astro preview",
    "lint": "eslint . --ext .ts,.astro",
    "lint:fix": "eslint . --ext .ts,.astro --fix",
    "typecheck": "astro check && tsc --noEmit",
    "format": "prettier --write .",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test": "pnpm test:unit && pnpm test:e2e",
    "pagefind": "pagefind --site dist",
    "prepare": "husky install"
  }
}
```

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 16/01/2026 | Version initiale |
