# F.3 Agent Architecture

## Pourquoi cette annexe ?

L'architecture d'un projet peut se dégrader progressivement avec le code généré par les agents IA. L'Agent Architecture vérifie la cohérence des patterns, détecte la dette structurelle, valide les propositions de design et aide à maintenir une architecture évolutive. Cette annexe fournit la configuration, les patterns de validation et les critères de décision.

---

## System Prompt Complet

```markdown
Tu es un architecte logiciel expérimenté. Ton rôle est d'analyser l'architecture
du code, identifier les problèmes structurels et conseiller sur les décisions
architecturales.

## Ton Approche

1. Comprendre l'architecture existante et ses contraintes
2. Identifier les incohérences et violations de principes
3. Proposer des améliorations alignées avec les patterns du projet
4. Documenter les décisions avec leur rationale

## Principes Architecturaux

### Séparation des Responsabilités
- Chaque module/classe a une responsabilité unique (SRP)
- Les couches sont clairement séparées (UI, Business, Data)
- Les dépendances vont dans un seul sens (dependency rule)

### Cohérence
- Mêmes patterns utilisés partout pour les mêmes problèmes
- Nommage et structure uniformes entre modules
- Conventions documentées et respectées

### Simplicité
- Pas d'over-engineering ni d'abstractions prématurées
- YAGNI : pas de code pour des besoins hypothétiques
- La bonne abstraction au bon niveau

### Évolutivité
- Code extensible sans modification (OCP)
- Couplage faible entre modules
- Interfaces stables, implémentations interchangeables

## Ce que tu Analyses

### Structure
- Organisation des dossiers et modules
- Responsabilités de chaque couche
- Cohérence de la structure

### Patterns
- Patterns utilisés (Repository, Service, Factory, etc.)
- Cohérence d'application
- Patterns manquants ou mal appliqués

### Dépendances
- Graphe de dépendances entre modules
- Dépendances circulaires
- Direction des dépendances (vers les abstractions)
- Couplage excessif

### Dette Structurelle
- Code au mauvais endroit (responsabilité diffuse)
- Violations de la séparation des couches
- Abstractions cassées ou leaky

## Format de Réponse

### Score Architecture : X/10

**Résumé**
[État général de l'architecture]

**Points Positifs**
- [Pattern bien appliqué]
- [Bonne décision]

**Problèmes Identifiés**
1. [Critique] Description avec impact
2. [Important] Description avec impact

**Recommandations**
- Court terme : [Actions immédiates]
- Moyen terme : [Évolutions planifiées]

**ADR Suggéré** (si décision importante)
[Template ADR rempli]
```

---

## Utilisation par Contexte

### Analyse d'Architecture Existante

```markdown
## Contexte
Analyse l'architecture de ce projet pour identifier les forces et faiblesses.

## Structure Actuelle
```
src/
├── components/
├── services/
├── hooks/
├── utils/
├── types/
└── pages/
```

## Fichiers Représentatifs
[Un exemple de chaque couche]

## Stack Technique
- Framework : [React, Vue, Express, etc.]
- State Management : [Redux, Zustand, Context]
- Data Layer : [Prisma, TypeORM, fetch]

## Questions
1. L'architecture est-elle cohérente ?
2. Quels patterns sont utilisés ? Correctement ?
3. Y a-t-il des problèmes structurels ?
4. Recommandations d'évolution ?
```

### Design Review de Nouvelle Feature

```markdown
## Contexte
Évalue cette proposition d'architecture pour [nom de la feature].

## Proposition
[Description de l'architecture proposée]

## Diagramme
[ASCII art ou description du flow]

## Patterns Existants
[Comment le reste du projet est structuré]

## Contraintes
- Performance : [Exigences]
- Scalabilité : [Volume attendu]
- Intégration : [Systèmes existants]

## Questions
1. Cette approche est-elle cohérente avec l'existant ?
2. Quels risques vois-tu ?
3. Alternatives à considérer ?
4. Impact sur la maintenabilité ?
```

### Analyse de Dépendances

```markdown
## Contexte
Analyse les dépendances entre modules pour identifier les problèmes.

## Graphe de Dépendances
[Output de madge ou outil similaire]

## Modules Critiques
[Modules avec le plus de dépendants]

## Questions
1. Y a-t-il des dépendances circulaires ?
2. Le sens des dépendances est-il correct ?
3. Quels modules sont trop couplés ?
4. Comment améliorer la structure ?
```

---

## Exemples Pratiques

### Exemple 1 : Dépendance Circulaire Détectée

**Input :**
```
Circular dependency detected:
  TaskService.ts → ProjectService.ts → TaskService.ts
```

**Output de l'Agent :**

### 🔴 Critique : Dépendance Circulaire Task ↔ Project

**Analyse du Cycle**

```
TaskService.ts
  └── imports ProjectService pour getProjectTasks()

ProjectService.ts
  └── imports TaskService pour validateProject() qui appelle taskCount()
```

**Impact**
- Problèmes potentiels au build (selon le bundler)
- Impossible de tester TaskService sans ProjectService et vice-versa
- Forte fragilité : modification d'un côté casse l'autre

**Solutions Possibles**

**Option 1 : Extraire dans un service dédié (Recommandé)**

```typescript
// Avant
// TaskService.ts
class TaskService {
  constructor(private projectService: ProjectService) {}
  getProjectTasks(projectId: string) { ... }
}

// ProjectService.ts
class ProjectService {
  constructor(private taskService: TaskService) {}
  validateProject(projectId: string) {
    const taskCount = this.taskService.countByProject(projectId)
    ...
  }
}

// Après
// ProjectTaskService.ts - nouveau service
class ProjectTaskService {
  constructor(
    private taskRepo: TaskRepository,
    private projectRepo: ProjectRepository
  ) {}

  getProjectTasks(projectId: string): Task[] {
    return this.taskRepo.findByProject(projectId)
  }

  getTaskCountForProject(projectId: string): number {
    return this.taskRepo.countByProject(projectId)
  }
}

// ProjectService.ts - simplifié
class ProjectService {
  constructor(private projectTaskService: ProjectTaskService) {}

  validateProject(projectId: string) {
    const taskCount = this.projectTaskService.getTaskCountForProject(projectId)
    ...
  }
}
```

**Option 2 : Injection par interface**

```typescript
// Définir une interface dans un module séparé
// interfaces/ITaskCounter.ts
interface ITaskCounter {
  countByProject(projectId: string): number
}

// TaskService implémente ITaskCounter
// ProjectService dépend de ITaskCounter (pas de TaskService directement)
```

**ADR Suggéré**

```markdown
# ADR-007 : Résolution Dépendance Circulaire Task/Project

## Statut
Proposé

## Contexte
Dépendance circulaire entre TaskService et ProjectService découverte
lors de l'analyse d'architecture. Cause : opérations croisées entre
les deux domaines.

## Décision
Extraire les opérations croisées dans un ProjectTaskService dédié
qui dépend des repositories (pas des services).

## Conséquences
- (+) Élimine la dépendance circulaire
- (+) Améliore la testabilité
- (+) Clarifie les responsabilités
- (-) Un service supplémentaire à maintenir
- (-) Migration progressive nécessaire
```

---

### Exemple 2 : Violation de Couche

**Input :**
```typescript
// src/components/TaskCard.tsx
function TaskCard({ taskId }) {
  const [task, setTask] = useState(null)

  useEffect(() => {
    // ❌ Composant UI qui fait une query SQL directement
    const result = db.query('SELECT * FROM tasks WHERE id = ?', [taskId])
    setTask(result)
  }, [taskId])

  return <div>{task?.title}</div>
}
```

**Output de l'Agent :**

### 🔴 Critique : Violation de Couche - UI accède directement à la DB

**Problème**
Le composant `TaskCard` (couche UI) accède directement à la base de données,
contournant les couches Service et Repository.

**Impact**
- Logique métier non réutilisable
- Impossible de changer de source de données
- Tests difficiles (besoin d'une vraie DB)
- Pas de gestion d'erreur centralisée
- Pas de cache possible

**Architecture Actuelle (Problématique)**
```
┌─────────────────┐
│   TaskCard.tsx  │ ──────────────────┐
│      (UI)       │                   │
└─────────────────┘                   │
                                      ▼
                              ┌──────────────┐
                              │   Database   │
                              └──────────────┘
```

**Architecture Cible**
```
┌─────────────────┐
│   TaskCard.tsx  │
│      (UI)       │
└────────┬────────┘
         │ useTask(id)
         ▼
┌─────────────────┐
│   useTask.ts    │
│     (Hook)      │
└────────┬────────┘
         │ taskService.getById(id)
         ▼
┌─────────────────┐
│  TaskService.ts │
│    (Service)    │
└────────┬────────┘
         │ taskRepo.findById(id)
         ▼
┌─────────────────┐
│   TaskRepo.ts   │
│  (Repository)   │
└────────┬────────┘
         │ SQL
         ▼
┌─────────────────┐
│    Database     │
└─────────────────┘
```

**Code Corrigé**

```typescript
// src/hooks/useTask.ts
export function useTask(taskId: string) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getById(taskId)
  })
}

// src/services/TaskService.ts
class TaskService {
  async getById(taskId: string): Promise<Task> {
    const task = await this.taskRepo.findById(taskId)
    if (!task) throw new TaskNotFoundError(taskId)
    return task
  }
}

// src/components/TaskCard.tsx
function TaskCard({ taskId }) {
  const { data: task, isLoading, error } = useTask(taskId)

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />

  return <div>{task.title}</div>
}
```

---

## Rapport Type

```markdown
# Analyse Architecture - [Projet] - [Date]

## Score Global : 7/10

### Résumé
Architecture globalement saine avec une bonne séparation des couches.
Points d'attention sur 2 dépendances circulaires et quelques violations
de la règle de dépendance dans les composants UI.

---

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                         PAGES                                │
│                    (routing, layout)                         │
├─────────────────────────────────────────────────────────────┤
│                       FEATURES                               │
│             (components, hooks, local state)                 │
├──────────────────┬──────────────────┬───────────────────────┤
│    SERVICES      │     STORES       │        API            │
│   (business)     │   (global state) │    (data fetch)       │
├──────────────────┴──────────────────┴───────────────────────┤
│                          LIB                                 │
│               (utilities, helpers, types)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Patterns Identifiés

| Pattern | Usage | Cohérence | Verdict |
|---------|-------|-----------|---------|
| Feature-based | Structure | 9/10 | ✅ |
| Custom Hooks | State/Logic | 8/10 | ✅ |
| Service Layer | Business | 7/10 | ⚠️ Incohérent |
| Repository | Data | Non utilisé | ❌ À considérer |

---

## Problèmes Identifiés

### 🔴 Critique : 2 Dépendances Circulaires

[Détail comme dans l'exemple 1...]

### 🟡 Important : Violations de Couche

- `TaskCard.tsx:15` - Query directe
- `UserProfile.tsx:23` - Appel API sans service
- `Settings.tsx:45` - LocalStorage dans le composant

### 🟢 Mineur : Inconsistance de Nommage

Services : mix de `*Service`, `*Manager`, `*Handler`
→ Standardiser sur `*Service`

---

## Recommandations

### Court Terme (ce sprint)
1. Résoudre les dépendances circulaires
2. Corriger les violations de couche critiques
3. Documenter les patterns dans AGENT-GUIDE

### Moyen Terme (ce quarter)
1. Introduire le pattern Repository
2. Standardiser le nommage
3. Ajouter des lint rules pour les dépendances

### Architecture Cible

```
src/
├── features/
│   └── [feature]/
│       ├── components/     # UI uniquement
│       ├── hooks/          # Logic + state
│       ├── api.ts          # Appels API de la feature
│       └── types.ts        # Types locaux
├── services/               # Business logic partagée
├── repositories/           # Data access
├── lib/                    # Utilities pures
└── pages/                  # Routing
```

---

## Métriques de Suivi

| Métrique | Actuel | Cible |
|----------|--------|-------|
| Dépendances circulaires | 2 | 0 |
| Violations de couche | 5 | 0 |
| Coverage des services | 65% | 90% |
| Profondeur max modules | 8 | 5 |
```

---

## Intégration CI/CD

### GitHub Actions

```yaml
name: Architecture Checks

on: [push, pull_request]

jobs:
  architecture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci

      # Vérifier les dépendances circulaires
      - name: Check circular dependencies
        run: npx madge --circular --extensions ts src/

      # Vérifier les limites d'import
      - name: Check import boundaries
        run: npx eslint . --rule '@typescript-eslint/no-restricted-imports: error'

      # Vérifier la structure des dossiers
      - name: Validate folder structure
        run: npx folderslint
```

### Configuration ESLint pour Boundaries

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'import/no-restricted-paths': ['error', {
      zones: [
        // UI ne peut pas importer de services directement
        {
          target: './src/components',
          from: './src/services',
          message: 'Components should use hooks, not services directly'
        },
        // Services ne peuvent pas importer de UI
        {
          target: './src/services',
          from: './src/components',
          message: 'Services should not depend on UI'
        }
      ]
    }]
  }
}
```

---

## Anti-patterns

### ❌ Over-engineering préventif

**Problème** : Créer des abstractions "au cas où" on en aurait besoin.

```typescript
// ❌ Mauvais : Factory + Strategy + Observer pour un CRUD simple
interface ITaskFactory { ... }
interface ITaskStrategy { ... }
class TaskFactoryImpl implements ITaskFactory { ... }

// ✅ Bon : Simple et direct
class TaskService {
  async create(data: CreateTaskDto): Promise<Task> {
    return this.repo.create(data)
  }
}
```

**Solution** : YAGNI. Ajouter de la complexité quand le besoin est réel.

### ❌ Abstractions fuyantes (Leaky Abstractions)

**Problème** : L'implémentation technique fuit à travers les couches.

```typescript
// ❌ Mauvais : Le composant connaît les détails Prisma
const { data } = useQuery(() => prisma.task.findMany({
  include: { assignee: true }
}))

// ✅ Bon : Abstraction propre
const { data } = useTasks({ includeAssignee: true })
```

### ❌ God Services

**Problème** : Un service qui fait tout, impossible à maintenir.

**Solution** : Découper par domaine métier ou par use case.

### ❌ Ignorer la documentation d'architecture

**Problème** : Pas de trace des décisions, chacun réinvente.

**Solution** : ADRs pour les décisions importantes, ARCHITECTURE.md à jour.

### ❌ Forcer un pattern partout

**Problème** : Appliquer Repository même pour un simple fetch de config.

**Solution** : Adapter le niveau d'abstraction au besoin réel.

---

## Checklist Agent Architecture

### Avant Analyse
- [ ] Structure du projet accessible
- [ ] Contexte technique (stack, contraintes)
- [ ] Patterns existants documentés
- [ ] Historique des décisions (ADRs)

### Pendant Analyse
- [ ] Identifier les couches et leurs responsabilités
- [ ] Vérifier la cohérence des patterns
- [ ] Détecter les dépendances problématiques
- [ ] Évaluer la séparation des responsabilités

### Après Analyse
- [ ] Problèmes priorisés avec impact
- [ ] Solutions concrètes proposées
- [ ] ADR rédigé si décision importante
- [ ] Lint rules suggérées pour prévenir la régression

---

## Template ADR

```markdown
# ADR-XXX : [Titre de la Décision]

## Statut
[Proposé | Accepté | Déprécié | Remplacé par ADR-YYY]

## Contexte
[Pourquoi cette décision est nécessaire ? Quel problème résout-on ?]

## Options Considérées

### Option 1 : [Nom]
- (+) Avantage
- (-) Inconvénient

### Option 2 : [Nom]
- (+) Avantage
- (-) Inconvénient

## Décision
[Quelle option choisie et pourquoi]

## Conséquences

### Positives
- [Bénéfice 1]
- [Bénéfice 2]

### Négatives
- [Coût 1]
- [Risque 1]

### Neutres
- [Changement à faire]

## Plan d'Implémentation
1. [Étape 1]
2. [Étape 2]
```

---

*Voir aussi : [F.2 Agent Quality](./F2-agent-quality.md) • [B.4 Tech Lead](./B4-tech-lead.md) • [A.2 Template Architecture](./A2-architecture.md)*
