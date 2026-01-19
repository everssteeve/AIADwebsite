# F.3 Agent Architecture

## Pourquoi cet agent ?

L'agent Architecture vérifie la cohérence des patterns, détecte la dette technique structurelle et aide à maintenir une architecture propre.

---

## Cas d'Usage

| Situation | Utilisation |
|-----------|-------------|
| Design review | Valider une proposition d'architecture |
| Détection dette | Identifier les problèmes structurels |
| Migration | Planifier et valider des changements |
| Onboarding | Expliquer l'architecture existante |

---

## Configuration

### System Prompt

```markdown
Tu es un architecte logiciel expérimenté. Ton rôle est d'analyser et
conseiller sur l'architecture du code : patterns, structure, cohérence.

## Ton Approche

1. Comprendre l'architecture existante
2. Identifier les incohérences et problèmes
3. Proposer des améliorations alignées avec les principes du projet

## Principes Clés

### Séparation des Responsabilités
- Chaque module a une responsabilité unique
- Les couches sont clairement séparées (UI, Business, Data)
- Les dépendances vont dans un sens (clean architecture)

### Cohérence
- Patterns utilisés de manière consistante
- Nommage et structure uniformes
- Conventions respectées partout

### Simplicité
- Pas d'over-engineering
- Abstraction au bon niveau
- YAGNI (You Aren't Gonna Need It)

### Évolutivité
- Code extensible sans modification
- Couplage faible
- Interfaces stables

## Ce que tu Analyses

### Structure
- Organisation des dossiers
- Modules et leurs responsabilités
- Dépendances entre modules

### Patterns
- Patterns utilisés (Repository, Service, etc.)
- Cohérence d'utilisation
- Patterns manquants ou mal appliqués

### Dépendances
- Graphe de dépendances
- Dépendances circulaires
- Couplage excessif

### Dette Structurelle
- Code au mauvais endroit
- Violations de la séparation des couches
- Abstractions cassées
```

---

## Utilisation

### Analyse d'Architecture

```markdown
## Prompt : Analyse Architecture

Analyse l'architecture du projet suivant :

### Structure Actuelle
```
src/
├── components/
├── services/
├── hooks/
├── utils/
├── types/
└── pages/
```

### Fichiers Clés
[Exemples de fichiers représentatifs de chaque couche]

### Questions
1. L'architecture est-elle cohérente ?
2. Quels patterns sont utilisés ?
3. Y a-t-il des problèmes structurels ?
4. Recommandations d'amélioration ?
```

### Design Review

```markdown
## Prompt : Design Review

Évalue cette proposition d'architecture pour [Feature] :

### Proposition
[Description de l'architecture proposée]

### Diagramme
[Schéma si disponible]

### Contexte
- Projet : [Description]
- Contraintes : [...]
- Patterns existants : [...]

### Questions à Adresser
1. Cette approche est-elle cohérente avec l'existant ?
2. Quels risques vois-tu ?
3. Alternatives à considérer ?
4. Impact sur la maintenabilité ?
```

### Détection Dépendances Circulaires

```markdown
## Prompt : Analyse Dépendances

Analyse les dépendances entre ces modules :

### Modules
[Liste des fichiers/modules]

### Imports
[Graphe d'imports si disponible]

### Questions
1. Y a-t-il des dépendances circulaires ?
2. Le sens des dépendances est-il correct ?
3. Quels modules sont trop couplés ?
4. Comment améliorer la structure ?
```

---

## Rapport Type

```markdown
# Analyse Architecture - [Projet]

## Vue d'Ensemble

### Diagramme de Haut Niveau
```
┌─────────────────────────────────────────────────────────┐
│                        PAGES                             │
│                    (routing, layout)                     │
├─────────────────────────────────────────────────────────┤
│                      FEATURES                            │
│          (components, hooks, business logic)             │
├──────────────────┬──────────────────┬───────────────────┤
│    SERVICES      │     STORES       │      API          │
│   (business)     │   (state mgmt)   │   (data fetch)    │
├──────────────────┴──────────────────┴───────────────────┤
│                         LIB                              │
│              (utilities, helpers, types)                 │
└─────────────────────────────────────────────────────────┘
```

### Score de Santé : 7/10

---

## Patterns Identifiés

| Pattern | Usage | Cohérence |
|---------|-------|-----------|
| Feature-based structure | ✅ | 8/10 |
| Service layer | ✅ | 7/10 |
| Custom hooks | ✅ | 9/10 |
| Repository pattern | ❌ | N/A |

### Observations
- ✅ Bonne séparation UI/Logic via hooks
- ⚠️ Services parfois appelés directement depuis les composants
- ⚠️ Certaines features ont des structures différentes

---

## Problèmes Identifiés

### 🔴 Critique : Dépendance Circulaire

**Modules** : `TaskService` ↔ `ProjectService`

```
TaskService.ts imports ProjectService
    └── getProjectTasks()

ProjectService.ts imports TaskService
    └── validateProject() calls taskService.countByProject()
```

**Impact** : Problèmes de build, difficile à tester isolément

**Solution** :
```typescript
// Extraire la logique partagée
// src/services/ProjectTaskService.ts
export class ProjectTaskService {
  constructor(
    private taskRepo: TaskRepository,
    private projectRepo: ProjectRepository
  ) {}

  countTasksForProject(projectId: string) { ... }
  getProjectWithTasks(projectId: string) { ... }
}
```

### 🟡 Important : Violation de Couche

**Fichier** : `src/components/TaskCard.tsx:45`

```typescript
// Composant UI qui accède directement à la DB
const task = await db.query('SELECT * FROM tasks WHERE id = ?', [id])
```

**Problème** : Le composant bypasse la couche service

**Solution** :
```typescript
// Via le service
const task = await taskService.findById(id)
```

### 🟡 Important : God Service

**Fichier** : `src/services/TaskService.ts`

**Problème** : 1500 lignes, 45 méthodes, responsabilités mélangées

**Recommandation** : Découper en services focalisés
```
TaskService.ts (1500 lines)
    ↓
├── TaskCrudService.ts (CRUD basique)
├── TaskAssignmentService.ts (assignation)
├── TaskFilterService.ts (recherche/filtrage)
└── TaskExportService.ts (export/import)
```

---

## Recommandations

### Court Terme
1. **Casser la dépendance circulaire** (bloquant)
   - Créer ProjectTaskService
   - Refactorer les appels

2. **Fixer les violations de couche**
   - Audit des composants
   - Enforcer via lint rule

### Moyen Terme
3. **Découper TaskService**
   - Identifier les bounded contexts
   - Migration progressive

4. **Standardiser la structure features**
   - Créer un template
   - Documenter dans AGENT-GUIDE

### Architecture Cible

```
src/
├── features/
│   └── [feature]/
│       ├── components/     # UI
│       ├── hooks/          # Logic
│       ├── services/       # Business
│       ├── types.ts        # Types
│       └── index.ts        # Public API
├── shared/
│   ├── components/         # UI partagés
│   ├── hooks/              # Hooks partagés
│   └── lib/                # Utilities
├── services/               # Services globaux
└── pages/                  # Routing
```

---

## ADR Suggéré

### ADR-XXX : Résolution Dépendance Circulaire Task/Project

**Contexte**
Dépendance circulaire entre TaskService et ProjectService créant des
problèmes de build et testabilité.

**Décision**
Extraire les opérations croisées dans un ProjectTaskService dédié.

**Conséquences**
- (+) Plus de dépendance circulaire
- (+) Meilleure testabilité
- (-) Un service supplémentaire
- (-) Migration à planifier
```

---

## Intégration CI

```yaml
# .github/workflows/architecture.yml
name: Architecture Checks

on: [push, pull_request]

jobs:
  architecture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Vérifier les dépendances circulaires
      - name: Check circular dependencies
        run: npx madge --circular src/

      # Vérifier les limites d'import
      - name: Check import boundaries
        run: npx eslint --rule 'import/no-restricted-paths: error'

      # Vérifier la structure
      - name: Check folder structure
        run: npx folderslint
```

---

## Bonnes Pratiques

### Quand Utiliser l'Agent Architecture

| Moment | Scope | Automatique |
|--------|-------|-------------|
| Design review | Nouvelle feature | Manuel |
| PR avec refactor | Zone concernée | Semi-auto |
| Quarterly | Full codebase | Manuel |
| Post-incident | Zone concernée | Manuel |

### Documentation Architecture

```markdown
## À Maintenir

1. **ARCHITECTURE.md** : Décisions et principes
2. **ADRs** : Décisions importantes
3. **Diagrammes** : Mis à jour à chaque changement majeur
4. **AGENT-GUIDE** : Section architecture pour les agents
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
