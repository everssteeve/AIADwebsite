# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Site web pour le Framework AIAD (AI-Agent Iterative Development) - une plateforme de documentation statique présentant le framework et son Mode Opératoire. Architecture JAMstack optimisée pour performance, SEO et accessibilité.

## Tech Stack

- **Framework**: Astro 4.x (SSG, content-first, MDX natif)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 3.x (utility-first)
- **Content**: MDX 3.x via Astro Content Collections
- **Search**: Pagefind (index statique)
- **Package Manager**: pnpm 8.x
- **Testing**: Vitest (unit), Playwright (E2E)
- **Hosting**: Vercel (static deployment)

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Build + generate Pagefind index
pnpm preview          # Preview production build
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint fix
pnpm typecheck        # Astro check + tsc
pnpm format           # Prettier format
pnpm test:unit        # Run Vitest
pnpm test:unit:watch  # Vitest watch mode
pnpm test:e2e         # Run Playwright
pnpm test:e2e:ui      # Playwright UI mode
pnpm test             # Run all tests
```

## Architecture

### Content Structure

Two main content collections in `src/content/`:
- **framework/**: AIAD Framework (4 parties - théorie)
- **mode-operatoire/**: Mode Opératoire (7 parties - pratique)

Each MDX file has typed frontmatter (title, description, order, section).

### Key Directories

- `src/components/`: Astro components (common/, layout/, content/, search/)
- `src/content/`: MDX content managed by Content Collections
- `src/layouts/`: BaseLayout, PageLayout, DocsLayout
- `src/pages/`: File-based routing, dynamic routes with [...slug].astro
- `src/lib/`: Utility functions (utils.ts, reading-time.ts, navigation.ts)
- `public/templates/`: Downloadable template files (PRD, ARCHITECTURE, CLAUDE.md, SPECS)

### Patterns

- **Content Collections**: Type-safe MDX with Zod schema validation in `src/content/config.ts`
- **Layout Composition**: DocsLayout extends BaseLayout
- **Island Architecture**: Interactive components use `client:load` or `client:idle` directives
- **Dynamic Routes**: `[...slug].astro` generates pages from content collections

## Code Conventions

### Naming
- Components: PascalCase.astro (`SearchDialog.astro`)
- Utilities: kebab-case.ts (`reading-time.ts`)
- Content: kebab-case.mdx (`product-engineer.mdx`)
- Constants: SCREAMING_SNAKE_CASE

### Formatting
- No semicolons
- Single quotes
- 2 space indent
- Trailing commas (es5)
- 100 char line width

### Imports Order
1. Node.js native modules
2. External dependencies
3. Internal aliases (@/)
4. Relative imports
5. Types (last)

### Path Aliases
```
@/* → src/*
@components/* → src/components/*
@layouts/* → src/layouts/*
@lib/* → src/lib/*
@content/* → src/content/*
```

## Quality Requirements

- **Performance**: Lighthouse > 90 all metrics, LCP < 2s
- **Accessibility**: RGAA AA compliance, keyboard navigation, 4.5:1 contrast
- **SEO**: Semantic HTML, meta tags, sitemap, Open Graph
- **Eco-design**: RGESN compliance, optimized images (WebP), lazy loading

## Content Guidelines

- French language only (MVP)
- Framework content is theoretical, Mode Opératoire is practical
- Cross-link between Framework and Mode Opératoire sections
- Include reading time on documentation pages
- Badge "Essentiel" on critical sections
