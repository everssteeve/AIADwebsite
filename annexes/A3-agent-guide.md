# A.3 Template AGENT-GUIDE

## Pourquoi cette annexe ?

L'AGENT-GUIDE est le document qui configure le contexte pour les agents IA. Sans lui, chaque session repart de zéro : l'agent ne connaît ni les conventions du projet, ni la structure du code, ni les patterns à suivre. Un bon AGENT-GUIDE permet aux agents de générer du code cohérent avec l'existant dès la première interaction.

---

## Anatomie d'un AGENT-GUIDE Efficace

### Placement du Fichier

| Outil | Fichier | Emplacement |
|-------|---------|-------------|
| Claude Code | `CLAUDE.md` | Racine du projet |
| Cursor | `.cursorrules` | Racine du projet |
| GitHub Copilot | `.github/copilot-instructions.md` | Dossier `.github` |
| Windsurf | `.windsurfrules` | Racine du projet |

### Structure Recommandée

```markdown
# AGENT-GUIDE

## Projet
[Nom et description en 1-2 lignes]

## Commandes
[Commandes essentielles : dev, test, lint, build]

## Structure
[Arborescence avec descriptions]

## Conventions
[Règles de nommage, style, imports]

## Patterns
[Patterns à suivre avec exemples courts]

## Règles Métier
[Règles importantes du domaine]

## Instructions Agent
[Comportement attendu des agents]
```

---

## Sections Détaillées

### 1. Présentation du Projet

Contexte minimal mais suffisant.

```markdown
# AGENT-GUIDE

## Projet

[Nom du projet] - [Description en une ligne]

### Contexte
[2-3 phrases : pour qui, pourquoi, comment]

### Stack Principale
- **Frontend** : [Technologies principales]
- **Backend** : [Technologies principales]
- **Database** : [Type et nom]
- **Infra** : [Hébergement]
```

**Pourquoi c'est important ?** L'agent calibre ses suggestions selon le contexte. Un MVP solo ≠ une app enterprise.

### 2. Commandes Essentielles

Les commandes que l'agent doit connaître pour vérifier son travail.

```markdown
## Commandes

```bash
# Développement
pnpm dev              # Lancer le serveur de dev

# Qualité
pnpm lint             # Vérification ESLint
pnpm lint:fix         # Auto-fix
pnpm typecheck        # Vérification TypeScript
pnpm test             # Tests unitaires
pnpm test:e2e         # Tests end-to-end

# Build
pnpm build            # Build de production

# Database (si applicable)
pnpm db:migrate       # Appliquer migrations
pnpm db:generate      # Générer migration
```
```

### 3. Structure du Projet

L'arborescence permet à l'agent de savoir où placer le code.

```markdown
## Structure

```
[nom-projet]/
├── src/
│   ├── components/       # Composants UI réutilisables
│   │   ├── ui/           # Primitives (Button, Input...)
│   │   └── features/     # Composants métier
│   ├── features/         # Modules par domaine
│   │   ├── auth/         # Authentification
│   │   ├── tasks/        # Gestion des tâches
│   │   └── projects/     # Gestion des projets
│   ├── hooks/            # Hooks React custom
│   ├── lib/              # Utilitaires et helpers
│   ├── pages/            # Routes/Pages
│   └── services/         # Appels API
├── tests/                # Tests
└── public/               # Assets statiques
```

### Où placer quoi ?
- Nouveau composant UI générique → `src/components/ui/`
- Nouveau composant métier → `src/components/features/` ou `src/features/[domain]/components/`
- Nouveau hook → `src/hooks/` ou `src/features/[domain]/hooks/`
- Nouvelle route API → `src/api/` ou `apps/api/src/routes/`
```

### 4. Conventions de Code

Règles claires pour la cohérence.

```markdown
## Conventions

### Nommage
| Type | Convention | Exemple |
|------|------------|---------|
| Composants React | PascalCase.tsx | `TaskCard.tsx` |
| Hooks | useCamelCase.ts | `useTaskList.ts` |
| Utilitaires | kebab-case.ts | `date-utils.ts` |
| Constants | SCREAMING_SNAKE | `MAX_TASKS` |
| Types/Interfaces | PascalCase | `Task`, `TaskStatus` |

### Style
- Indentation : 2 espaces
- Quotes : single quotes
- Semicolons : non
- Trailing commas : es5
- Ligne max : 100 caractères

### Ordre des Imports
1. React et hooks React
2. Packages externes (npm)
3. Alias internes (`@/...`)
4. Imports relatifs (`./`, `../`)
5. Types (`import type`)

### Exemple
```tsx
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { useTaskFilters } from './hooks/useTaskFilters'
import type { Task } from '@/types'
```
```

### 5. Patterns à Suivre

Montrer le code attendu.

```markdown
## Patterns

### Composant React
```tsx
// ✅ Fonction nommée + export nommé
export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3>{task.title}</h3>
    </div>
  )
}

// ❌ Éviter : export default, arrow function anonyme
export default ({ task }) => <div>{task.title}</div>
```

### Hook Custom
```tsx
// ✅ Préfixe "use", retourne un objet ou tuple
export function useTaskList(projectId: string) {
  const query = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchTasks(projectId),
  })

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  }
}
```

### Appel API
```tsx
// ✅ Utiliser TanStack Query, pas useEffect + fetch
const { data, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
})

// ❌ Éviter : useEffect pour le data fetching
useEffect(() => {
  fetch('/api/tasks').then(...)
}, [])
```

### Validation
```tsx
// ✅ Zod pour validation (partagé front/back)
import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1).max(100),
  status: z.enum(['todo', 'in_progress', 'done']),
})

export type Task = z.infer<typeof taskSchema>
```
```

### 6. Règles Métier

Le domaine que l'agent doit comprendre.

```markdown
## Règles Métier

### Tâches
- Une tâche appartient à exactement un projet
- Une tâche peut être assignée à 0 ou 1 membre
- Statuts possibles : `todo`, `in_progress`, `done`
- Transition autorisée : todo → in_progress → done (pas de retour)
- La suppression est soft delete (`archived_at`)

### Projets
- Un projet a au moins un membre (le créateur)
- Le créateur est automatiquement `admin`
- Rôles : `admin` (tout), `member` (lecture + ses tâches)

### Utilisateurs
- Email unique, case-insensitive
- Authentification via Auth0
- Avatar via Gravatar si non défini
```

### 7. Instructions pour les Agents

Directives explicites de comportement.

```markdown
## Instructions pour les Agents IA

### Avant de Coder
1. Lire le code existant dans les fichiers concernés
2. Vérifier si un composant/hook similaire existe déjà
3. Identifier les types existants à réutiliser
4. Comprendre le flow de données actuel

### Pendant le Code
- Privilégier l'édition à la création de fichiers
- Garder les modifications minimales et focalisées
- Suivre les patterns existants dans le codebase
- Ne pas sur-commenter (le code doit être auto-explicatif)
- Utiliser les alias d'import (`@/`) plutôt que les chemins relatifs profonds

### Après le Code
- Lancer `pnpm typecheck` pour vérifier les types
- Lancer `pnpm lint` pour le style
- Lancer `pnpm test` si des tests existent pour le code modifié
- Vérifier que le nouveau code suit les conventions

### Ce qu'il NE faut PAS faire
- Utiliser `any` (toujours typer explicitement)
- Créer des fichiers inutiles
- Modifier des fichiers non liés à la tâche
- Ajouter des dépendances sans justification
- Laisser des `console.log` de debug
- Ignorer les erreurs TypeScript avec `// @ts-ignore`
```

---

## Exemples Pratiques

### Exemple 1 : AGENT-GUIDE Minimal (Projet Solo)

```markdown
# CLAUDE.md

## Projet
TimeTracker - App de suivi du temps pour freelances.

### Stack
- React 18 + TypeScript
- Tailwind CSS
- Supabase (auth + DB + API)

## Commandes
```bash
pnpm dev          # Dev server
pnpm lint         # ESLint
pnpm typecheck    # TypeScript
```

## Structure
```
src/
├── components/   # UI components
├── hooks/        # Custom hooks
├── lib/          # Supabase client, utils
├── pages/        # Routes
└── types/        # TypeScript types
```

## Conventions
- Composants : PascalCase.tsx
- Hooks : useCamelCase.ts
- 2 espaces, single quotes, no semicolons

## Instructions Agent
- Lire avant de modifier
- Éditer > Créer
- Lancer typecheck après modification
```

### Exemple 2 : AGENT-GUIDE Complet (Équipe)

```markdown
# CLAUDE.md

## Projet

TaskFlow - Application collaborative de gestion de tâches.

### Contexte
MVP pour équipes de 3-10 personnes. Focus sur la simplicité et la performance.
Architecture full-stack TypeScript, monorepo.

### Stack
- **Frontend** : React 18 + TypeScript + Tailwind + TanStack Query
- **Backend** : Node.js + Hono + Drizzle ORM
- **Database** : PostgreSQL
- **Infra** : Vercel (front) + Railway (back)

## Commandes

```bash
# Développement
pnpm dev              # Front + back en parallèle
pnpm dev:web          # Front seul (port 3000)
pnpm dev:api          # Back seul (port 8080)

# Qualité
pnpm lint             # ESLint tous les packages
pnpm typecheck        # TypeScript strict
pnpm test             # Vitest
pnpm test:e2e         # Playwright

# Build & Deploy
pnpm build            # Build production
pnpm db:migrate       # Appliquer migrations
pnpm db:generate      # Générer migration
pnpm db:studio        # Drizzle Studio (DB GUI)
```

## Structure

```
taskflow/
├── apps/
│   ├── web/                    # React SPA
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/         # Button, Input, Modal...
│   │   │   │   └── features/   # TaskCard, ProjectList...
│   │   │   ├── features/       # Modules par domaine
│   │   │   │   ├── auth/
│   │   │   │   ├── tasks/
│   │   │   │   └── projects/
│   │   │   ├── hooks/          # useDebounce, useLocalStorage...
│   │   │   ├── lib/            # api-client, utils
│   │   │   └── routes/         # Pages
│   │   └── tests/
│   └── api/                    # Backend Hono
│       ├── src/
│       │   ├── routes/         # /tasks, /projects, /auth
│       │   ├── services/       # Business logic
│       │   ├── db/             # Schema Drizzle, migrations
│       │   ├── middleware/     # Auth, logging
│       │   └── lib/            # Utils
│       └── tests/
└── packages/
    └── shared/                 # Code partagé front/back
        ├── types/              # Task, Project, User...
        └── validations/        # Schemas Zod
```

### Où placer le nouveau code ?
| Type de code | Emplacement |
|--------------|-------------|
| Composant UI générique | `apps/web/src/components/ui/` |
| Composant métier | `apps/web/src/features/[domain]/components/` |
| Hook partagé | `apps/web/src/hooks/` |
| Hook spécifique feature | `apps/web/src/features/[domain]/hooks/` |
| Route API | `apps/api/src/routes/` |
| Logique métier backend | `apps/api/src/services/` |
| Type partagé | `packages/shared/types/` |
| Schema de validation | `packages/shared/validations/` |

## Conventions

### Nommage
| Type | Convention | Exemple |
|------|------------|---------|
| Composant | PascalCase.tsx | `TaskCard.tsx` |
| Hook | useCamelCase.ts | `useTaskList.ts` |
| Utilitaire | kebab-case.ts | `date-utils.ts` |
| Route API | kebab-case.ts | `task-routes.ts` |
| Constante | SCREAMING_SNAKE | `MAX_TASKS` |
| Type | PascalCase | `Task` (pas `ITask`) |

### Style
- 2 espaces d'indentation
- Single quotes
- Pas de semicolons
- Trailing commas (es5)
- Ligne max : 100 caractères

### Imports (dans cet ordre)
```tsx
// 1. React
import { useState, useEffect } from 'react'

// 2. Externes
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// 3. Alias internes
import { Button } from '@/components/ui/Button'
import { taskSchema } from '@shared/validations'

// 4. Relatifs
import { TaskCard } from './components/TaskCard'
import { useTaskFilters } from './hooks/useTaskFilters'

// 5. Types (en dernier)
import type { Task, TaskStatus } from '@shared/types'
```

## Patterns

### Composant React
```tsx
// ✅ Pattern standard
import type { Task } from '@shared/types'

interface TaskCardProps {
  task: Task
  onComplete?: (id: string) => void
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <h3 className="font-medium">{task.title}</h3>
      {onComplete && (
        <Button onClick={() => onComplete(task.id)}>
          Terminer
        </Button>
      )}
    </div>
  )
}
```

### Data Fetching
```tsx
// ✅ TanStack Query pour tout le data fetching
export function useTaskList(projectId: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => api.tasks.list(projectId),
    staleTime: 5 * 60 * 1000, // 5 min
  })
}

// ❌ Pas de useEffect pour le fetch
useEffect(() => {
  fetch('/api/tasks')... // NON
}, [])
```

### Mutations
```tsx
// ✅ Optimistic updates avec TanStack Query
export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => api.tasks.complete(taskId),
    onMutate: async (taskId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previous = queryClient.getQueryData(['tasks'])
      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map(t => t.id === taskId ? { ...t, status: 'done' } : t)
      )
      return { previous }
    },
    onError: (err, taskId, context) => {
      queryClient.setQueryData(['tasks'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
```

### Route API (Hono)
```tsx
// ✅ Pattern standard pour une route
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { taskSchema } from '@shared/validations'
import { TaskService } from '../services/task-service'

const app = new Hono()

app.post(
  '/',
  zValidator('json', taskSchema),
  async (c) => {
    const data = c.req.valid('json')
    const task = await TaskService.create(data)
    return c.json(task, 201)
  }
)

export default app
```

## Règles Métier

### Tâches
- Appartient à exactement 1 projet
- Assignée à 0 ou 1 membre
- Statuts : `todo` | `in_progress` | `done`
- Soft delete via `archived_at`
- Titre : 1-100 caractères

### Projets
- Minimum 1 membre (créateur)
- Créateur = admin automatiquement
- Rôles : `admin`, `member`
- Soft delete via `archived_at`

### Permissions
| Action | admin | member |
|--------|-------|--------|
| Créer tâche | ✅ | ✅ |
| Voir tâches | ✅ | ✅ |
| Modifier toute tâche | ✅ | ❌ |
| Modifier sa tâche | ✅ | ✅ |
| Supprimer projet | ✅ | ❌ |
| Inviter membres | ✅ | ❌ |

## Instructions pour les Agents IA

### Avant de Coder
1. Lire les fichiers concernés avec Read
2. Chercher si un composant/hook similaire existe (Grep/Glob)
3. Identifier les types à réutiliser dans `packages/shared/`
4. Comprendre le flow de données

### Règles de Développement
- **Éditer > Créer** : Préférer modifier l'existant
- **Minimal diff** : Changer uniquement ce qui est nécessaire
- **Patterns existants** : Suivre le style du code voisin
- **Pas de over-engineering** : YAGNI

### Après le Code
```bash
pnpm typecheck    # Obligatoire
pnpm lint         # Obligatoire
pnpm test         # Si tests concernés
```

### Interdits
- `any` (utiliser `unknown` + type guard si nécessaire)
- `// @ts-ignore` ou `// @ts-expect-error` sans explication
- `console.log` laissé dans le code
- Création de fichiers sans nécessité
- Modification de fichiers hors scope de la tâche
- Dépendances ajoutées sans justification
```

---

## Anti-patterns

### ❌ Guide Trop Verbeux

**Symptôme** : 2000 lignes de documentation exhaustive.

**Problème** : Les agents ont une limite de contexte. Trop d'info = info diluée.

**Solution** : Maximum 300-400 lignes. Aller à l'essentiel.

---

### ❌ Guide Pas à Jour

**Symptôme** : Le guide décrit une structure `src/pages/` mais le projet utilise App Router Next.js.

**Problème** : L'agent génère du code pour la mauvaise architecture.

**Solution** : Mise à jour à chaque changement de structure ou de convention. Check en Tech Review.

---

### ❌ Conventions Sans Exemples

**Symptôme** :
```markdown
## Conventions
- Utiliser des composants fonctionnels
- Suivre les bonnes pratiques React
```

**Problème** : Trop vague. L'agent interprète à sa manière.

**Solution** :
```markdown
## Conventions
```tsx
// ✅ Composant standard
export function TaskCard({ task }: TaskCardProps) {
  return <div>{task.title}</div>
}

// ❌ Éviter
export default function({ task }) { ... }
```
```

---

### ❌ Trop Restrictif

**Symptôme** : Liste de 50 règles strictes, tous les cas couverts.

**Problème** : L'agent n'a pas de marge pour s'adapter aux cas non prévus.

**Solution** : Documenter les patterns principaux, laisser de la flexibilité pour le reste.

---

## Template Prêt à Copier

```markdown
# CLAUDE.md

## Projet

[Nom] - [Description en une ligne]

### Contexte
[2-3 phrases sur le projet]

### Stack
- **Frontend** :
- **Backend** :
- **Database** :
- **Infra** :

---

## Commandes

```bash
# Développement
pnpm dev

# Qualité
pnpm lint
pnpm typecheck
pnpm test

# Build
pnpm build
```

---

## Structure

```
src/
├── components/
├── features/
├── hooks/
├── lib/
└── pages/
```

---

## Conventions

### Nommage
| Type | Convention | Exemple |
|------|------------|---------|

### Style
- Indentation :
- Quotes :
- Semicolons :

### Imports
1. React
2. Externes
3. Internes (@/)
4. Relatifs
5. Types

---

## Patterns

### Composant
```tsx

```

### Hook
```tsx

```

---

## Règles Métier

### [Domaine 1]
-
-

---

## Instructions Agent

### Avant de Coder
1. Lire le code existant
2. Chercher si similaire existe

### Après le Code
- `pnpm typecheck`
- `pnpm lint`

### Interdit
- `any`
- `console.log` en production
```

---

## Checklist de Validation

Avant de considérer l'AGENT-GUIDE comme prêt :

- [ ] Contexte projet clair en moins de 5 lignes
- [ ] Commandes essentielles listées et à jour
- [ ] Structure des dossiers reflète le code actuel
- [ ] Conventions de nommage avec exemples
- [ ] Au moins 2-3 patterns de code illustrés
- [ ] Instructions agent explicites (avant/après/interdit)
- [ ] Document < 400 lignes (concision)
- [ ] Testé : l'agent génère-t-il du code cohérent ?

---

## Évolution du Guide

| Quand | Action |
|-------|--------|
| Nouvelle convention | Mise à jour immédiate |
| Changement de stack | Mise à jour immédiate |
| Tech Review | Vérification cohérence guide/code |
| Nouveau membre équipe | Test du guide avec questions |

L'AGENT-GUIDE est un document vivant. Un guide obsolète est pire qu'un guide absent.

---

*Annexes connexes : [A.2 Template ARCHITECTURE](./A2-architecture.md) • [B.2 Product Engineer](./B2-product-engineer.md) • [B.6 Agents Engineer](./B6-agents-engineer.md)*
