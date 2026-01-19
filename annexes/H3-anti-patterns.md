# H.3 Anti-patterns

## Pourquoi cette annexe ?

Cette annexe documente les erreurs courantes dans les projets AIAD et comment les éviter, avec des exemples concrets.

---

## Anti-patterns de Code

### 1. Le God Component

#### ❌ Anti-pattern

```tsx
// Un composant qui fait tout
function TaskPage() {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('date')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({})
  // ... 50 autres états

  useEffect(() => {
    // Fetch tasks
    // Apply filters
    // Sort
    // 200 lignes de logique
  }, [filters, sortBy])

  // 500 lignes de handlers et rendering
}
```

#### ✅ Solution

```tsx
// Découper en composants et hooks focalisés
function TaskPage() {
  return (
    <TaskProvider>
      <TaskFilters />
      <TaskList />
      <TaskDetailModal />
    </TaskProvider>
  )
}

// Hook dédié
function useTaskList(projectId: string) {
  // Logique de fetch + filtrage
}

// Composant focalisé
function TaskFilters() {
  // Juste les filtres
}
```

---

### 2. Le Any Partout

#### ❌ Anti-pattern

```typescript
function processData(data: any): any {
  const result: any = {}
  data.items.forEach((item: any) => {
    result[item.id] = item.value
  })
  return result
}
```

#### ✅ Solution

```typescript
interface DataItem {
  id: string
  value: number
}

interface ProcessedData {
  [key: string]: number
}

function processData(data: { items: DataItem[] }): ProcessedData {
  return data.items.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.value }),
    {}
  )
}
```

---

### 3. Le N+1 Query

#### ❌ Anti-pattern

```typescript
async function getTasksWithAssignees(projectId: string) {
  const tasks = await db.tasks.findMany({ where: { projectId } })

  // N+1 : une requête par tâche !
  for (const task of tasks) {
    task.assignee = await db.users.findUnique({
      where: { id: task.assigneeId },
    })
  }

  return tasks
}
```

#### ✅ Solution

```typescript
async function getTasksWithAssignees(projectId: string) {
  // Une seule requête avec include
  return db.tasks.findMany({
    where: { projectId },
    include: { assignee: true },
  })
}
```

---

### 4. Le useEffect Data Fetching

#### ❌ Anti-pattern

```tsx
function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  // Race conditions, pas de cache, pas de refetch...
}
```

#### ✅ Solution

```tsx
function TaskList() {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks'),
  })

  // Cache, refetch, race conditions gérés
}
```

---

### 5. Le Prop Drilling Excessif

#### ❌ Anti-pattern

```tsx
function App() {
  const [user, setUser] = useState(null)
  return <Layout user={user} setUser={setUser} />
}

function Layout({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />
}

function Sidebar({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />
}

function UserMenu({ user, setUser }) {
  // Enfin utilisé ici
}
```

#### ✅ Solution

```tsx
// Context pour l'état partagé
const UserContext = createContext(null)

function App() {
  const [user, setUser] = useState(null)
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />
    </UserContext.Provider>
  )
}

function UserMenu() {
  const { user, setUser } = useContext(UserContext)
  // Accès direct
}
```

---

### 6. Les Secrets en Dur

#### ❌ Anti-pattern

```typescript
const API_KEY = 'sk-1234567890abcdef'
const DATABASE_URL = 'postgresql://user:password@localhost/db'

// Committé dans git !
```

#### ✅ Solution

```typescript
const API_KEY = process.env.API_KEY
const DATABASE_URL = process.env.DATABASE_URL

// .env (dans .gitignore)
// API_KEY=sk-...

// .env.example (committé)
// API_KEY=your-api-key-here
```

---

### 7. Le Test Qui Ne Teste Rien

#### ❌ Anti-pattern

```typescript
it('should work', () => {
  const result = myFunction()
  expect(result).toBeDefined() // Ça passe même si le résultat est faux
})

it('should handle data', () => {
  const data = getData()
  expect(data).toEqual(data) // Toujours vrai !
})
```

#### ✅ Solution

```typescript
it('should return sum of numbers', () => {
  const result = sum([1, 2, 3])
  expect(result).toBe(6) // Valeur attendue spécifique
})

it('should handle empty array', () => {
  const result = sum([])
  expect(result).toBe(0) // Edge case
})
```

---

## Anti-patterns de Process

### 8. Le SPEC Vague

#### ❌ Anti-pattern

```markdown
# SPEC-042 : Améliorer l'UX

## Description
Rendre l'application plus facile à utiliser.

## Critères d'Acceptation
- L'UX est meilleure
```

#### ✅ Solution

```markdown
# SPEC-042 : Ajouter feedback visuel sur les actions

## Description
L'utilisateur ne sait pas si son action a fonctionné.
Ajouter des toasts de confirmation.

## Critères d'Acceptation
- Toast success après création de tâche
- Toast error si l'API échoue
- Toast auto-dismiss après 3 secondes
- Accessible (annoncé aux screen readers)
```

---

### 9. Le Commit Message Inutile

#### ❌ Anti-pattern

```
fix bug
update
wip
asdf
changes
```

#### ✅ Solution

```
fix(tasks): prevent double submission on create form

The submit button was not disabled during API call,
allowing users to click multiple times and create
duplicate tasks.

Closes #123
```

---

### 10. Le Review Rubber Stamp

#### ❌ Anti-pattern

```
LGTM 👍
```
(Sans vraiment lire le code)

#### ✅ Solution

```markdown
## Review Summary

### ✅ Approved with minor comments

**Ce qui est bien :**
- Bonne séparation des responsabilités
- Tests complets

**Suggestions (non bloquantes) :**
- L15: Pourrait utiliser `useMemo` ici pour éviter recalcul
- L42: Typo dans le message d'erreur

**Question :**
- L30: Pourquoi ce timeout de 5000ms ? Peut-on le configurer ?
```

---

### 11. La Dette Technique Ignorée

#### ❌ Anti-pattern

```
// TODO: fix this later
// HACK: temporary workaround
// FIXME: this is broken

// ... oubliés pendant 2 ans
```

#### ✅ Solution

```typescript
// TODO(DEBT-042): Extract validation to separate function
// Context: Duplicate validation logic with UserForm
// Effort: S (30min)
// Impact: Medium (maintenance)
```

Et créer un ticket de dette technique avec suivi.

---

### 12. Le Test Flaky Ignoré

#### ❌ Anti-pattern

```typescript
it.skip('flaky test - skip for now', () => {
  // Ignoré depuis 6 mois
})
```

#### ✅ Solution

```typescript
// Option 1 : Fixer le test
it('should load data', async () => {
  // Utiliser waitFor au lieu de setTimeout
  await waitFor(() => {
    expect(screen.getByText('Data')).toBeInTheDocument()
  })
})

// Option 2 : Supprimer si non pertinent
// (avec commentaire expliquant pourquoi)
```

---

## Anti-patterns Agent IA

### 13. Le Prompt Vague

#### ❌ Anti-pattern

```
Améliore ce code
```

#### ✅ Solution

```
Refactorise cette fonction pour :
1. Réduire la complexité cyclomatique de 15 à < 10
2. Extraire la validation en fonction séparée
3. Ajouter la gestion des erreurs pour le cas X

Contraintes : garder la même signature publique.
```

---

### 14. Le Copy-Paste Aveugle

#### ❌ Anti-pattern

```
Agent génère du code → Copier → Coller → Commiter

// Sans relire ni comprendre
```

#### ✅ Solution

```
Agent génère du code
    ↓
Relire et comprendre
    ↓
Tester localement
    ↓
Adapter si nécessaire
    ↓
Commiter
```

---

### 15. L'Over-reliance sur l'Agent

#### ❌ Anti-pattern

```
"L'agent dit que c'est bon, donc ça doit être bon"
```

#### ✅ Solution

- L'agent est un outil, pas l'expert final
- Toujours valider avec tests et review
- Comprendre le code généré
- Challenger les suggestions si elles semblent incorrectes

---

## Checklist Anti-patterns

```markdown
## Revue Anti-patterns (à chaque PR)

### Code
- [ ] Pas de composant > 300 lignes
- [ ] Pas de `any` non justifié
- [ ] Pas de N+1 queries
- [ ] Pas de secrets en dur
- [ ] Pas de useEffect pour data fetching

### Tests
- [ ] Assertions spécifiques (pas juste toBeDefined)
- [ ] Edge cases couverts
- [ ] Pas de tests flaky

### Process
- [ ] SPEC claire et mesurable
- [ ] Commit messages descriptifs
- [ ] Review substantive (pas juste LGTM)
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
