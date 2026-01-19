# PARTIE 0 : PRÉAMBULE

Cette partie introductive fournit toutes les définitions, matrices et vues d'ensemble nécessaires pour comprendre et appliquer le mode opératoire.

## 0.1 Glossaire complet

### 0.1.1 Termes AIAD

| Terme | Définition |
|-------|------------|
| AIAD | AI-Agent Iterative Development. Framework méthodologique pour le développement logiciel assisté par agents IA. |
| Product Owner (PO) | Gardien de la vision produit. Responsable du PRD et de la validation d'acceptation. |
| Tech Lead | Garant de la cohérence technique. Responsable du document ARCHITECTURE. |
| Product Engineer (PE) | Rôle pivot. Orchestre l'agent IA pour implémenter les fonctionnalités. |
| QA Engineer | Garant de la qualité. Définit la stratégie de tests. |
| DevOps Engineer | Assure la fluidité du pipeline de livraison. |
| PRD | Product Requirement Document. Capture la vision produit. |
| ARCHITECTURE | Document de référence technique du projet. |
| AGENT-GUIDE | Document de configuration de l'agent IA (CLAUDE.md). |
| SPECS | Spécifications techniques détaillées pour une tâche. |
| Itération | Cycle de développement court (1-2 semaines). |
| User Story | Description d'une fonctionnalité du point de vue utilisateur. |

### 0.1.2 Termes Claude Code

| Terme | Définition |
|-------|------------|
| Claude Code | Agent IA de codage Anthropic qui s'exécute dans le terminal. |
| CLAUDE.md | Fichier de configuration contextuelle de Claude Code. |
| MCP | Model Context Protocol. Permet à Claude d'accéder à des outils externes. |
| SubAgent | Agent IA spécialisé invoqué pour des tâches spécifiques. |
| Skill | Compétence que Claude active automatiquement selon les besoins. |
| Hook | Commande shell automatique à un moment précis du workflow. |
| /clear | Commande pour nettoyer le contexte (recommandé avant chaque tâche). |
| /context | Commande pour afficher l'utilisation du contexte (tokens). |
| /rewind | Commande pour annuler les dernières actions de Claude. |
| Plan Mode | Mode de planification (Shift+Tab) pour itérer avant implémentation. |

## 0.2 Matrice RACI

La matrice RACI définit qui fait quoi : R (Réalise), A (Approuve), C (Consulté), I (Informé).

### 0.2.1 Phase d'Initialisation

| Activité | PO | TL | PE | QA | DevOps |
|----------|----|----|----|----|--------|
| Cadrage initial | R/A | C | I | I | I |
| Rédaction PRD | R/A | C | C | I | I |
| Document ARCHITECTURE | I | R/A | C | I | C |
| Setup environnement | I | C | C | I | R/A |
| Création CLAUDE.md | I | C | R/A | I | I |

### 0.2.2 Phase de Développement

| Activité | PO | TL | PE | QA | DevOps |
|----------|----|----|----|----|--------|
| Orchestration agent IA | I | I | R/A | I | I |
| Validation code | I | C | R/A | C | I |
| Génération tests | I | I | R | A/C | I |
| Revue de code | I | A | R | C | I |

## 0.3 Vue d'ensemble du processus

Le processus AIAD s'organise en 5 phases principales :

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   PHASE 1    │────▶│   PHASE 2    │────▶│   PHASE 3    │
│INITIALISATION│     │ PLANIFICATION│     │DÉVELOPPEMENT │
│  (3-7 jours) │     │  (2-4 heures)│     │(80% itération)│
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                     ┌──────────────┐     ┌──────▼───────┐
                     │   PHASE 5    │◀────│   PHASE 4    │
                     │ DÉPLOIEMENT  │     │  VALIDATION  │
                     └──────────────┘     └──────────────┘
```

### 0.3.1 Chronologie type

| Phase | Durée | Livrables clés |
|-------|-------|----------------|
| Initialisation | 3-7 jours | PRD, ARCHITECTURE, CLAUDE.md |
| Planification | 2-4 heures | Sprint backlog, SPECS |
| Développement | 80% du sprint | Code, tests |
| Validation | Variable | Rapport QA, acceptation PO |
| Déploiement | 0.5-1 jour | Application en production |

## 0.4 Configuration des postes par rôle

### 0.4.1 Product Engineer (rôle principal)

| Catégorie | Outil | Utilisation |
|-----------|-------|-------------|
| Terminal | Warp (obligatoire) | Exécution Claude Code |
| IDE | VS Code / Cursor | Visualisation code |
| Claude Code | Installation complète | Orchestration agent IA |
| MCP | Context7, Playwright | Extensions Claude Code |
| Git | GitHub/GitLab | Versioning |
