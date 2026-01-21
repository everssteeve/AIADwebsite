# H.2 Patterns de Code

## Pourquoi cette annexe ?

Les patterns de code documentés permettent aux agents IA de produire du code cohérent avec l'existant. Cette annexe sert de catalogue de référence : chaque pattern peut être copié dans l'AGENT-GUIDE du projet ou fourni directement dans un prompt pour guider la génération.

---

## Patterns React / TypeScript

### Composant Fonctionnel Standard

```typescript
// src/components/TaskCard.tsx
import { memo } from 'react'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, data: Partial<Task>) => void
  onDelete: (id: string) => void
}

export const TaskCard = memo(function TaskCard({
  task,
  onUpdate,
  onDelete,
}: TaskCardProps) {
  const handleStatusChange = (status: Task['status']) => {
    onUpdate(task.id, { status })
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      {/* Actions */}
    </div>
  )
})
```

**Caractéristiques** :
- Export nommé avec `memo` pour éviter les re-renders inutiles
- Interface de props explicite et typée
- Handlers définis dans le composant si simples
- Nommage clair des fonctions

**Quand l'utiliser** : Composants d'affichage réutilisables, cartes, items de liste.

---

### Hook Custom avec Query

```typescript
// src/hooks/useTaskList.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Task, CreateTaskInput } from '@/types'

export function useTaskList(projectId: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => api.get<Task[]>(`/projects/${projectId}/tasks`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskInput) =>
      api.post<Task>(`/projects/${projectId}/tasks`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) =>
      api.delete(`/projects/${projectId}/tasks/${taskId}`),
    onMutate: async (taskId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] })
      const previous = queryClient.getQueryData<Task[]>(['tasks', projectId])

      queryClient.setQueryData<Task[]>(['tasks', projectId], (old) =>
        old?.filter((t) => t.id !== taskId)
      )

      return { previous }
    },
    onError: (_, __, context) => {
      // Rollback si erreur
      queryClient.setQueryData(['tasks', projectId], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    },
  })

  return {
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createTask: createMutation.mutate,
    deleteTask: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
```

**Caractéristiques** :
- Encapsule toute la logique data d'une entité
- Optimistic update pour l'UX
- Rollback en cas d'erreur
- API de retour claire et typée

**Quand l'utiliser** : Gestion de données avec CRUD, cache et synchronisation serveur.

---

### Composant avec Formulaire

```typescript
// src/components/TaskForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string().min(1, 'Requis').max(100, 'Trop long'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void>
  initialData?: Partial<TaskFormData>
}

export function TaskForm({ onSubmit, initialData }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title">Titre</label>
        <input
          id="title"
          {...register('title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="priority">Priorité</label>
        <select id="priority" {...register('priority')}>
          <option value="low">Basse</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
        </select>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  )
}
```

**Caractéristiques** :
- Validation Zod avec schéma réutilisable
- Type inféré du schéma (pas de duplication)
- Gestion des états loading et erreurs
- Accessibilité (labels, messages d'erreur)

**Quand l'utiliser** : Formulaires avec validation complexe.

---

## Patterns API (Node.js)

### Route avec Validation (Hono)

```typescript
// src/routes/tasks.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { taskService } from '@/services/task.service'
import { authMiddleware } from '@/middleware/auth'

const app = new Hono()

const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  projectId: z.string().uuid(),
})

app.use('*', authMiddleware)

// GET /tasks
app.get('/', async (c) => {
  const userId = c.get('userId')
  const tasks = await taskService.findByUser(userId)
  return c.json({ data: tasks })
})

// POST /tasks
app.post('/', zValidator('json', createTaskSchema), async (c) => {
  const userId = c.get('userId')
  const data = c.req.valid('json')

  const task = await taskService.create({
    ...data,
    createdBy: userId,
  })

  return c.json({ data: task }, 201)
})

// GET /tasks/:id
app.get('/:id', async (c) => {
  const userId = c.get('userId')
  const taskId = c.req.param('id')

  const task = await taskService.findById(taskId)

  if (!task) {
    return c.json({ error: 'Task not found' }, 404)
  }

  if (!taskService.canAccess(task, userId)) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  return c.json({ data: task })
})

// DELETE /tasks/:id
app.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const taskId = c.req.param('id')

  const task = await taskService.findById(taskId)

  if (!task) {
    return c.json({ error: 'Task not found' }, 404)
  }

  if (!taskService.canDelete(task, userId)) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  await taskService.delete(taskId)
  return c.body(null, 204)
})

export default app
```

**Caractéristiques** :
- Validation Zod intégrée au framework
- Vérification des permissions systématique
- Codes HTTP appropriés (201, 204, 403, 404)
- Séparation route/service

**Quand l'utiliser** : APIs REST avec authentification.

---

### Service Layer

```typescript
// src/services/task.service.ts
import { db } from '@/db'
import { tasks, type Task, type NewTask } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const taskService = {
  async findById(id: string): Promise<Task | null> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id))
    return task ?? null
  },

  async findByUser(userId: string): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.createdBy, userId))
      .orderBy(tasks.createdAt)
  },

  async create(data: NewTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(data).returning()
    return task
  },

  async update(id: string, data: Partial<NewTask>): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning()
    return task
  },

  async delete(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id))
  },

  // Méthodes de permission
  canAccess(task: Task, userId: string): boolean {
    return task.createdBy === userId
  },

  canEdit(task: Task, userId: string): boolean {
    return task.createdBy === userId
  },

  canDelete(task: Task, userId: string): boolean {
    return task.createdBy === userId
  },
}
```

**Caractéristiques** :
- Une méthode par opération CRUD
- Types explicites pour entrées/sorties
- Logique de permission centralisée
- Pas de logique HTTP (séparation des responsabilités)

**Quand l'utiliser** : Toute entité métier avec persistance.

---

## Patterns Tests

### Test Unitaire avec Factory

```typescript
// tests/unit/filterTasks.test.ts
import { describe, it, expect } from 'vitest'
import { filterTasks } from '@/utils/filterTasks'
import type { Task } from '@/types'

// Factory pour créer des données de test
const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: 'Test Task',
  status: 'todo',
  priority: 'medium',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

describe('filterTasks', () => {
  describe('filtre par status', () => {
    it('filtre par status unique', () => {
      const tasks = [
        createTask({ id: '1', status: 'todo' }),
        createTask({ id: '2', status: 'done' }),
        createTask({ id: '3', status: 'todo' }),
      ]

      const result = filterTasks(tasks, { status: ['todo'] })

      expect(result).toHaveLength(2)
      expect(result.every((t) => t.status === 'todo')).toBe(true)
    })

    it('filtre par multiples status', () => {
      const tasks = [
        createTask({ id: '1', status: 'todo' }),
        createTask({ id: '2', status: 'in_progress' }),
        createTask({ id: '3', status: 'done' }),
      ]

      const result = filterTasks(tasks, { status: ['todo', 'in_progress'] })

      expect(result).toHaveLength(2)
    })
  })

  describe('cas limites', () => {
    it('retourne tableau vide si tasks vide', () => {
      expect(filterTasks([], { status: ['todo'] })).toEqual([])
    })

    it('retourne tout si pas de filtre', () => {
      const tasks = [createTask({ id: '1' }), createTask({ id: '2' })]
      expect(filterTasks(tasks, {})).toHaveLength(2)
    })
  })
})
```

**Caractéristiques** :
- Factory pour créer des données de test cohérentes
- Structure describe/it hiérarchique
- Tests des cas limites séparés
- Assertions spécifiques (pas juste `toBeDefined`)

**Quand l'utiliser** : Tests de fonctions pures, utilitaires.

---

### Test d'Intégration API

```typescript
// tests/integration/tasks.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { app } from '@/app'
import { db } from '@/db'
import { tasks, users } from '@/db/schema'
import { createTestUser, generateAuthToken } from '../helpers'

describe('Tasks API', () => {
  let authToken: string
  let userId: string

  beforeEach(async () => {
    const user = await createTestUser()
    userId = user.id
    authToken = generateAuthToken(user)
  })

  afterEach(async () => {
    await db.delete(tasks)
    await db.delete(users)
  })

  describe('POST /tasks', () => {
    it('crée une tâche', async () => {
      const response = await app.request('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'Nouvelle tâche',
          priority: 'high',
          projectId: 'project-1',
        }),
      })

      expect(response.status).toBe(201)
      const { data } = await response.json()
      expect(data.title).toBe('Nouvelle tâche')
      expect(data.createdBy).toBe(userId)
    })

    it('retourne 400 si données invalides', async () => {
      const response = await app.request('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title: '' }),
      })

      expect(response.status).toBe(400)
    })

    it('retourne 401 sans authentification', async () => {
      const response = await app.request('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Task' }),
      })

      expect(response.status).toBe(401)
    })
  })
})
```

**Caractéristiques** :
- Setup/teardown pour isolation des tests
- Tests des cas happy path, erreur et authentification
- Vérification des codes HTTP et du body

**Quand l'utiliser** : Tests d'endpoints API avec base de données.

---

## Patterns Utilitaires

### API Client avec Gestion d'Erreurs

```typescript
// src/lib/api.ts
const BASE_URL = import.meta.env.VITE_API_URL

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      error.code ?? 'UNKNOWN_ERROR',
      error.message ?? 'Une erreur est survenue'
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const token = localStorage.getItem('auth_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

export const api = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: getHeaders(),
    })
    return handleResponse<T>(response)
  },

  async post<T>(path: string, data?: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleResponse<T>(response)
  },

  async patch<T>(path: string, data: unknown): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<T>(response)
  },

  async delete(path: string): Promise<void> {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<void>(response)
  },
}
```

**Caractéristiques** :
- Classe d'erreur typée avec code et status
- Gestion automatique du token
- Typage générique des réponses
- Support du 204 No Content

**Quand l'utiliser** : Communication avec une API REST.

---

## Anti-patterns Associés

| Pattern | Anti-pattern à Éviter |
|---------|----------------------|
| Hook custom | useEffect + useState pour le fetch |
| Service layer | Logique métier dans les routes |
| Factory test | Données de test en dur répétées |
| API client typé | fetch brut avec any |

Voir [H.3 Anti-patterns](H3-anti-patterns.md) pour les détails.

---

## Checklist

```markdown
## Vérification Pattern

### Structure
- [ ] Le pattern est dans le bon fichier/dossier
- [ ] Le nommage suit les conventions du projet
- [ ] Les imports sont ordonnés correctement

### Typage
- [ ] Pas de `any` non justifié
- [ ] Interfaces explicites pour les props/params
- [ ] Types exportés si réutilisables

### Tests
- [ ] Le code est testable (pas de side effects cachés)
- [ ] Les cas limites sont identifiables
```

---

## Résumé

| Contexte | Pattern Recommandé |
|----------|-------------------|
| Composant d'affichage | Functional + memo |
| Data fetching | Hook custom + TanStack Query |
| Formulaire | react-hook-form + Zod |
| API endpoint | Route + Service séparés |
| Persistance | Service layer |
| Test unitaire | Factory + describe/it |
| Client HTTP | API wrapper typé |

---

*Liens connexes : [H.1 Prompts Efficaces](H1-prompts-efficaces.md) · [H.3 Anti-patterns](H3-anti-patterns.md) · [A.3 Template AGENT-GUIDE](A3-template-agent-guide.md)*
