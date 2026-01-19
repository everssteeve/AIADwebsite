# H.2 Patterns de Code

## Pourquoi cette annexe ?

Cette annexe présente des patterns de code recommandés par contexte technique, avec des exemples concrets utilisables comme références pour les agents IA.

---

## Patterns React

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
      {/* ... */}
    </div>
  )
})
```

**Points Clés :**
- Export nommé avec `memo` pour éviter les re-renders inutiles
- Types explicites pour les props
- Handlers définis dans le composant si simple
- Nommage clair

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
      // Rollback
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

### Composant avec Formulaire

```typescript
// src/components/TaskForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string().min(1, 'Required').max(100, 'Too long'),
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
        <label htmlFor="title">Title</label>
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
        <label htmlFor="priority">Priority</label>
        <select id="priority" {...register('priority')}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

---

## Patterns API (Node.js)

### Route avec Validation

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

const updateTaskSchema = createTaskSchema.partial()

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

// PATCH /tasks/:id
app.patch('/:id', zValidator('json', updateTaskSchema), async (c) => {
  const userId = c.get('userId')
  const taskId = c.req.param('id')
  const data = c.req.valid('json')

  const task = await taskService.findById(taskId)

  if (!task) {
    return c.json({ error: 'Task not found' }, 404)
  }

  if (!taskService.canEdit(task, userId)) {
    return c.json({ error: 'Forbidden' }, 403)
  }

  const updated = await taskService.update(taskId, data)
  return c.json({ data: updated })
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

### Service Layer

```typescript
// src/services/task.service.ts
import { db } from '@/db'
import { tasks, type Task, type NewTask } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

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

  async findByProject(projectId: string): Promise<Task[]> {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(tasks.order)
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

---

## Patterns Tests

### Test Unitaire

```typescript
// tests/unit/filterTasks.test.ts
import { describe, it, expect } from 'vitest'
import { filterTasks } from '@/utils/filterTasks'
import type { Task } from '@/types'

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
  describe('status filter', () => {
    it('should filter tasks by single status', () => {
      const tasks = [
        createTask({ id: '1', status: 'todo' }),
        createTask({ id: '2', status: 'done' }),
        createTask({ id: '3', status: 'todo' }),
      ]

      const result = filterTasks(tasks, { status: ['todo'] })

      expect(result).toHaveLength(2)
      expect(result.every((t) => t.status === 'todo')).toBe(true)
    })

    it('should filter tasks by multiple statuses', () => {
      const tasks = [
        createTask({ id: '1', status: 'todo' }),
        createTask({ id: '2', status: 'in_progress' }),
        createTask({ id: '3', status: 'done' }),
      ]

      const result = filterTasks(tasks, { status: ['todo', 'in_progress'] })

      expect(result).toHaveLength(2)
      expect(result.map((t) => t.status)).toEqual(['todo', 'in_progress'])
    })

    it('should return all tasks when status filter is empty', () => {
      const tasks = [
        createTask({ id: '1', status: 'todo' }),
        createTask({ id: '2', status: 'done' }),
      ]

      const result = filterTasks(tasks, { status: [] })

      expect(result).toHaveLength(2)
    })
  })

  describe('edge cases', () => {
    it('should return empty array when tasks is empty', () => {
      const result = filterTasks([], { status: ['todo'] })
      expect(result).toEqual([])
    })

    it('should return all tasks when no filters provided', () => {
      const tasks = [createTask({ id: '1' }), createTask({ id: '2' })]

      const result = filterTasks(tasks, {})

      expect(result).toHaveLength(2)
    })
  })
})
```

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
    // Setup test user
    const user = await createTestUser()
    userId = user.id
    authToken = generateAuthToken(user)
  })

  afterEach(async () => {
    // Cleanup
    await db.delete(tasks)
    await db.delete(users)
  })

  describe('POST /tasks', () => {
    it('should create a task', async () => {
      const response = await app.request('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: 'New Task',
          priority: 'high',
          projectId: 'project-1',
        }),
      })

      expect(response.status).toBe(201)

      const { data } = await response.json()
      expect(data.title).toBe('New Task')
      expect(data.priority).toBe('high')
      expect(data.createdBy).toBe(userId)
    })

    it('should return 400 for invalid data', async () => {
      const response = await app.request('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: '', // Invalid: empty
        }),
      })

      expect(response.status).toBe(400)
    })

    it('should return 401 without auth', async () => {
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

---

## Patterns Utilitaires

### API Client

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
      error.message ?? 'An error occurred'
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

---

*Retour aux [Annexes](../framework/08-annexes.md)*
