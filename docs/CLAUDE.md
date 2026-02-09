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
pnpm dev              # Serveur de développement
pnpm build            # Build + index Pagefind
pnpm preview          # Preview production
pnpm lint             # ESLint
pnpm typecheck        # Astro check + tsc
pnpm test             # Tous les tests
pnpm test:unit        # Tests unitaires (Vitest)
pnpm test:a11y        # Tests accessibilité (Playwright + axe-core)
pnpm test:a11y:headed # Tests a11y avec navigateur visible
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

## 📚 Documentation de Référence

| Document | Chemin |
|----------|--------|
| PRD | @docs/PRD.md |
| Architecture | @docs/ARCHITECTURE.md |
| SPECs index | @docs/specs/_index.md |
| US-001 (en cours) | @docs/specs/US-001/spec.md |

### SPECs US-001 détaillées

| Tâche | Fichier |
|-------|---------|
| T-001-B1 HeroContent | @docs/specs/US-001/T-001-B1-modele-donnees-HeroContent.md |
| T-001-B2 BenefitItem | @docs/specs/US-001/T-001-B2-modele-donnees-BenefitItem.md |
| T-001-B3 StatItem | @docs/specs/US-001/T-001-B3-modele-donnees-StatItem.md |
| T-001-B4 Hero JSON (fr) | @docs/specs/US-001/T-001-B4-donnees-JSON-hero-content-francais.md |
| T-001-F1 HeroTitle | @docs/specs/US-001/T-001-F1-composant-HeroTitle.md |
| T-001-F2 ValueProposition | @docs/specs/US-001/T-001-F2-composant-ValueProposition.md |
| T-001-F3 CTAButton | @docs/specs/US-001/T-001-F3-composant-CTAButton.md |
| T-001-B5 Benefits JSON (fr) | @docs/specs/US-001/T-001-B5-donnees-JSON-benefices-cles.md |
| T-001-B6 Stats JSON (fr) | @docs/specs/US-001/T-001-B6-donnees-JSON-statistiques-chiffrees.md |
| T-001-F4 BenefitCard | @docs/specs/US-001/T-001-F4-composant-BenefitCard.md |
| T-001-F5 BenefitsList | @docs/specs/US-001/T-001-F5-composant-BenefitsList.md |
| T-001-F6 StatDisplay | @docs/specs/US-001/T-001-F6-composant-StatDisplay.md |
| T-001-F7 StatsRow | @docs/specs/US-001/T-001-F7-composant-StatsRow.md |
| T-001-F8 HeroSection | @docs/specs/US-001/T-001-F8-composant-HeroSection.md |
| T-001-F9 Intégration accueil | @docs/specs/US-001/T-001-F9-integration-page-accueil.md |
| T-001-T1 Tests schémas Zod | @docs/specs/US-001/T-001-T1-tests-unitaires-schemas-zod.md |
| T-001-T2 Tests composants | @docs/specs/US-001/T-001-T2-tests-unitaires-composants.md |
| T-001-T3 Tests intégration HeroSection | @docs/specs/US-001/T-001-T3-tests-integration-HeroSection.md |
| T-001-T4 Tests accessibilité HeroSection | @docs/specs/US-001/T-001-T4-tests-accessibilite-hero-section.md |