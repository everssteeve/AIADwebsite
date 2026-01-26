# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Site web pour le Framework AIAD (AI-Agent Iterative Development) - une plateforme de documentation statique présentant le framework et son Mode Opératoire.

**État actuel** : Phase de documentation/planification. L'implémentation technique n'a pas encore démarré.

## Ce que tu peux faire maintenant

### Éditer le contenu source (Markdown)
- `framework/` - 8 chapitres théoriques (01-preambule.md à 08-annexes.md)
- `mode opératoire/` - 8 chapitres pratiques (00-preambule.md à 07-annexes.md)
- `annexes/` - 45 fichiers organisés en 9 catégories (A-I)
- `communication/` - Documents de communication (decideur.md, product-manager.md)

### Mettre à jour les documents de planification
- `PRD.md` - Product Requirements Document (user stories, personas, planning)
- `ARCHITECTURE.md` - Architecture technique détaillée (stack, patterns, tests)
- `Cadrage.md` - Document de cadrage initial

### Navigation dans le contenu
Chaque dossier contient :
- `referentiel.md` - Index des fichiers du dossier
- `intention.md` - Objectifs et vision de la section

## Structure des annexes (catégories A-I)

| Cat. | Contenu | Fichiers |
|------|---------|----------|
| A | Templates fondateurs | PRD, Architecture, Agent-Guide, Specs, DoOD, DoOuD |
| B | Rôles détaillés | PM, PE, QA, Tech Lead, Supporters, Agents Engineer |
| C | Boucles AIAD | Initialisation, Planifier, Implémenter, Valider, Intégrer |
| D | Rituels | Alignment, Demo, Tech Review, Rétro, Standup |
| E | Métriques | Dashboards, Revue trimestrielle |
| F | Agents spécialisés | Security, Quality, Architecture, Doc, Perf, Code Review |
| G | Configuration | Environnement, Agents IA, CI/CD, Permissions, MCP, SubAgents |
| H | Bonnes pratiques | Prompts, Patterns, Anti-patterns, Cas d'usage |
| I | Ressources | Troubleshooting, Glossaire, Bibliographie, Communauté |

## Stack technique (pour l'implémentation future)

Voir `ARCHITECTURE.md` pour les détails complets.

| Couche | Technologie |
|--------|-------------|
| Framework | Astro 4.x (SSG) |
| Langage | TypeScript 5.x (strict) |
| Styling | Tailwind CSS 3.x |
| Contenu | MDX + Content Collections |
| Recherche | Pagefind |
| Package Manager | pnpm 8.x |
| Tests | Vitest + Playwright |
| Hosting | Vercel |

## Commandes (après initialisation du projet Astro)

```bash
pnpm dev          # Serveur de développement
pnpm build        # Build + index Pagefind
pnpm preview      # Preview production
pnpm lint         # ESLint
pnpm typecheck    # Astro check + tsc
pnpm test         # Tous les tests
```

## Conventions de code

### Nommage
- Composants : `PascalCase.astro`
- Utilitaires : `kebab-case.ts`
- Contenu : `kebab-case.mdx`

### Formatage
- Pas de semicolons
- Single quotes
- 2 espaces d'indentation
- Trailing commas (es5)
- 100 caractères max par ligne

### Aliases TypeScript
```
@/*           → src/*
@components/* → src/components/*
@layouts/*    → src/layouts/*
@lib/*        → src/lib/*
```

## Règles de contenu

- **Langue** : Français uniquement (MVP)
- **Framework** = théorie, **Mode Opératoire** = pratique
- Créer des liens croisés entre Framework et Mode Opératoire
- Marquer les sections critiques avec le badge "Essentiel"

## Exigences qualité

- Lighthouse > 90, LCP < 2s
- RGAA AA (accessibilité)
- RGESN (éco-conception)

## Style visuel

- Interface claire et minimaliste
- Mode sombre : à définir pour le MVP

## Contraintes et politiques

- NE JAMAIS exposer les clés API au client
- Valider toutes les entrées utilisateur côté serveur
- Pas de données sensibles dans les logs

## Dépendances

- Préférer les composants existants plutôt que d'ajouter de nouvelles bibliothèques UI
- Justifier toute nouvelle dépendance avant de l'ajouter

## Workflow de développement

- À la fin de chaque développement impliquant l'interface graphique, tester avec playwright-skill
- L'interface doit être responsive, fonctionnelle et répondre au besoin développé
- Vérifier l'accessibilité avant de valider une fonctionnalité UI

## Context7

Utilise toujours context7 lorsque tu as besoin de :
- Génération de code
- Étapes de configuration ou d'installation
- Documentation de bibliothèque/API

Cela signifie que tu dois automatiquement utiliser les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation sans que je le demande explicitement.

## Langue

Toutes les spécifications doivent être rédigées en français.