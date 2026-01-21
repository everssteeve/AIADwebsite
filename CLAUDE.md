# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Site web pour le Framework AIAD (AI-Agent Iterative Development) - une plateforme de documentation statique présentant le framework et son Mode Opératoire. **Actuellement en phase de documentation/planification, l'implémentation n'a pas encore démarré.**

## Current Repository State

Ce repository contient la **documentation source** et les **documents de planification** pour le futur site web:

### Content (Source pour le site)
- `framework/` - Framework AIAD théorique (8 chapitres, 01 à 08)
- `mode opératoire/` - Guide pratique opérationnel (8 chapitres, 00 à 07)
- `annexes/` - 45+ fichiers organisés par catégorie (A-I):
  - **A**: Templates (PRD, Architecture, Agent-Guide, Specs, DOOD, DOOUD)
  - **B**: Rôles AIAD (Product Manager, Product Engineer, QA, Tech Lead, etc.)
  - **C**: Phases et boucles itératives
  - **D**: Rituels et synchronisations
  - **E**: Métriques et dashboards
  - **F**: Agents spécialisés (Security, Quality, Architecture, etc.)
  - **G**: Configuration et installation
  - **H**: Bonnes pratiques et patterns
  - **I**: Troubleshooting, glossaire, bibliographie
- `communication/` - Documents de communication (décideur, product manager)

### Planning Documents
- `PRD.md` - Product Requirements Document complet
- `ARCHITECTURE.md` - Architecture technique planifiée
- `Cadrage.md` - Document de cadrage initial

### Cross-references
Chaque dossier contient un `referentiel.md` servant d'index des fichiers et `intention.md` décrivant les objectifs de la section.

## Planned Tech Stack (for implementation)

When implementation starts, the project will use:

- **Framework**: Astro 4.x (SSG, content-first, MDX natif)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 3.x
- **Content**: MDX via Astro Content Collections
- **Search**: Pagefind (index statique)
- **Package Manager**: pnpm 8.x
- **Testing**: Vitest (unit), Playwright (E2E)
- **Hosting**: Vercel

## Planned Commands (post-implementation)

```bash
pnpm dev              # Start dev server
pnpm build            # Build + generate Pagefind index
pnpm preview          # Preview production build
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint fix
pnpm typecheck        # Astro check + tsc
pnpm format           # Prettier format
pnpm test:unit        # Run Vitest
pnpm test:e2e         # Run Playwright
pnpm test             # Run all tests
```

## Planned Architecture

### Content Collections Structure
```
src/content/
├── framework/     # Théorie AIAD (from framework/)
├── mode-operatoire/ # Pratique (from mode opératoire/)
└── annexes/       # Resources (from annexes/)
```

### Key Patterns
- **Content Collections**: Type-safe MDX with Zod schema in `src/content/config.ts`
- **Dynamic Routes**: `[...slug].astro` for content pages
- **Island Architecture**: Interactive components with `client:load`/`client:idle`
- **Layout Composition**: DocsLayout extends BaseLayout

## Code Conventions (for implementation)

### Naming
- Components: PascalCase.astro
- Utilities: kebab-case.ts
- Content: kebab-case.mdx
- Constants: SCREAMING_SNAKE_CASE

### Formatting
- No semicolons
- Single quotes
- 2 space indent
- Trailing commas (es5)
- 100 char line width

### Path Aliases
```
@/* → src/*
@components/* → src/components/*
@layouts/* → src/layouts/*
@lib/* → src/lib/*
@content/* → src/content/*
```

## Quality Requirements

- **Performance**: Lighthouse > 90, LCP < 2s
- **Accessibility**: RGAA AA, keyboard navigation, 4.5:1 contrast
- **SEO**: Semantic HTML, meta tags, sitemap, Open Graph
- **Eco-design**: RGESN compliance, WebP images, lazy loading

## Content Guidelines

- French language only (MVP)
- Framework = théorie, Mode Opératoire = pratique
- Cross-link between Framework and Mode Opératoire sections
- Badge "Essentiel" on critical sections
