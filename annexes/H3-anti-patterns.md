# H.3 Anti-patterns

## Pourquoi cette annexe ?

Connaître les erreurs courantes évite de les reproduire. Cette annexe documente les anti-patterns observés dans les projets AIAD : code, process et usage des agents. Chaque anti-pattern inclut un exemple concret et sa correction.

---

## Anti-patterns de Code

### 1. Le God Component

Un composant qui fait tout : fetch, état, logique, rendu.

#### Anti-pattern

```tsx
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
    // Fetch, filtre, tri... 200 lignes
  }, [filters, sortBy])

  // 500 lignes de handlers et rendering
}
```

**Problèmes** : Impossible à tester, difficile à maintenir, réutilisation nulle.

#### Solution

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

// Hook dédié par responsabilité
function useTaskList(projectId: string) {
  // Logique de fetch + filtrage
}

// Composant focalisé
function TaskFilters() {
  // Juste les filtres
}
```

**Règle** : Un composant > 200 lignes doit être découpé.

---

### 2. Le Any Partout

Utilisation de `any` qui désactive le typage TypeScript.

#### Anti-pattern

```typescript
function processData(data: any): any {
  const result: any = {}
  data.items.forEach((item: any) => {
    result[item.id] = item.value
  })
  return result
}
```

**Problèmes** : Pas d'autocomplétion, pas de détection d'erreurs, dette technique.

#### Solution

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

**Règle** : Chaque `any` doit être justifié par un commentaire expliquant pourquoi le typage est impossible.

---

### 3. Le N+1 Query

Une requête par élément au lieu d'une requête groupée.

#### Anti-pattern

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

**Problèmes** : 100 tâches = 101 requêtes. Performance catastrophique.

#### Solution

```typescript
async function getTasksWithAssignees(projectId: string) {
  // Une seule requête avec include/join
  return db.tasks.findMany({
    where: { projectId },
    include: { assignee: true },
  })
}
```

**Règle** : Toujours utiliser `include`, `join` ou batch loading.

---

### 4. Le useEffect Data Fetching

Utiliser useEffect + useState pour le data fetching.

#### Anti-pattern

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

**Problèmes** : Race conditions, pas de cache, pas de retry, code dupliqué partout.

#### Solution

```tsx
function TaskList() {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks'),
  })

  // Cache, refetch, race conditions gérés automatiquement
}
```

**Règle** : Utiliser TanStack Query, SWR ou équivalent pour le data fetching.

---

### 5. Le Prop Drilling Excessif

Passer des props à travers 4+ niveaux de composants.

#### Anti-pattern

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
  // Enfin utilisé ici, 4 niveaux plus bas
}
```

**Problèmes** : Composants intermédiaires pollués, refactoring difficile.

#### Solution

```tsx
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

**Règle** : Au-delà de 2 niveaux, utiliser un Context ou un store.

---

### 6. Les Secrets en Dur

Clés API ou credentials dans le code source.

#### Anti-pattern

```typescript
const API_KEY = 'sk-1234567890abcdef'
const DATABASE_URL = 'postgresql://user:password@localhost/db'

// Committé dans git !
```

**Problèmes** : Fuite de secrets, compromission possible.

#### Solution

```typescript
const API_KEY = process.env.API_KEY
const DATABASE_URL = process.env.DATABASE_URL

// .env (dans .gitignore)
// API_KEY=sk-...

// .env.example (committé, sans valeurs)
// API_KEY=your-api-key-here
```

**Règle** : Aucun secret dans le code. Variables d'environnement uniquement.

---

### 7. Le Test Qui Ne Teste Rien

Tests qui passent toujours, même si le code est cassé.

#### Anti-pattern

```typescript
it('should work', () => {
  const result = myFunction()
  expect(result).toBeDefined() // Passe même si result est faux
})

it('should handle data', () => {
  const data = getData()
  expect(data).toEqual(data) // Toujours vrai !
})
```

**Problèmes** : Fausse confiance, pas de régression détectée.

#### Solution

```typescript
it('should return sum of numbers', () => {
  const result = sum([1, 2, 3])
  expect(result).toBe(6) // Valeur attendue spécifique
})

it('should return 0 for empty array', () => {
  const result = sum([])
  expect(result).toBe(0) // Edge case avec valeur précise
})
```

**Règle** : Chaque test doit pouvoir échouer si le comportement change.

---

## Anti-patterns de Process

### 8. La SPEC Vague

Spécification sans critères mesurables.

#### Anti-pattern

```markdown
# SPEC-042 : Améliorer l'UX

## Description
Rendre l'application plus facile à utiliser.

## Critères d'Acceptation
- L'UX est meilleure
```

**Problèmes** : Impossible de savoir quand c'est fini, discussions sans fin.

#### Solution

```markdown
# SPEC-042 : Ajouter feedback visuel sur les actions

## Description
L'utilisateur ne sait pas si son action a fonctionné.
Ajouter des toasts de confirmation.

## Critères d'Acceptation
- [ ] Toast success après création de tâche
- [ ] Toast error si l'API échoue
- [ ] Toast auto-dismiss après 3 secondes
- [ ] Accessible (annoncé aux screen readers)
```

**Règle** : Chaque critère d'acceptation doit être vérifiable par un test.

---

### 9. Le Commit Message Inutile

Messages de commit qui n'apportent aucune information.

#### Anti-pattern

```
fix bug
update
wip
asdf
changes
```

**Problèmes** : Historique illisible, recherche de régression impossible.

#### Solution

```
fix(tasks): prevent double submission on create form

The submit button was not disabled during API call,
allowing users to click multiple times and create
duplicate tasks.

Closes #123
```

**Règle** : Format `type(scope): description` + contexte si utile.

---

### 10. La Review Rubber Stamp

Approuver sans vraiment lire le code.

#### Anti-pattern

```
LGTM 👍
```

**Problèmes** : Bugs non détectés, mauvaises pratiques acceptées.

#### Solution

```markdown
## Review Summary

### Approved avec commentaires mineurs

**Points positifs :**
- Bonne séparation des responsabilités
- Tests complets

**Suggestions (non bloquantes) :**
- L15: Utiliser `useMemo` pour éviter le recalcul
- L42: Typo dans le message d'erreur

**Question :**
- L30: Pourquoi ce timeout de 5000ms ?
```

**Règle** : Une review doit avoir au moins 1 commentaire substantiel ou une explication de ce qui a été vérifié.

---

### 11. La Dette Technique Ignorée

TODOs et FIXMEs qui s'accumulent sans suivi.

#### Anti-pattern

```typescript
// TODO: fix this later
// HACK: temporary workaround
// FIXME: this is broken

// ... oubliés pendant 2 ans
```

**Problèmes** : Dette qui s'accumule, surprises en production.

#### Solution

```typescript
// TODO(DEBT-042): Extract validation to separate function
// Context: Duplicate validation logic with UserForm
// Effort: S (30min)
// Impact: Medium (maintenance)
```

Et créer un ticket de dette technique avec suivi.

**Règle** : Chaque TODO doit avoir un ticket associé ou une date d'expiration.

---

### 12. Le Test Flaky Ignoré

Tests instables qu'on skip au lieu de corriger.

#### Anti-pattern

```typescript
it.skip('flaky test - skip for now', () => {
  // Ignoré depuis 6 mois
})
```

**Problèmes** : Couverture de test réduite, problèmes réels masqués.

#### Solution

```typescript
// Option 1 : Fixer le test
it('should load data', async () => {
  // Utiliser waitFor au lieu de setTimeout
  await waitFor(() => {
    expect(screen.getByText('Data')).toBeInTheDocument()
  })
})

// Option 2 : Supprimer si non pertinent
// Avec commentaire expliquant pourquoi
```

**Règle** : Un test skip doit avoir un ticket associé ou être supprimé sous 2 semaines.

---

## Anti-patterns Agent IA

### 13. Le Prompt Vague

Demandes imprécises qui génèrent du code générique.

#### Anti-pattern

```
Améliore ce code
```

**Problèmes** : Output imprévisible, itérations multiples.

#### Solution

```
Refactorise cette fonction pour :
1. Réduire la complexité cyclomatique de 15 à < 10
2. Extraire la validation en fonction séparée
3. Ajouter la gestion des erreurs pour le cas X

Contraintes : garder la même signature publique.
```

**Règle** : Un prompt doit avoir un objectif mesurable.

---

### 14. Le Copy-Paste Aveugle

Copier le code généré sans le comprendre ni le tester.

#### Anti-pattern

```
Agent génère du code → Copier → Coller → Commiter
(Sans relire ni comprendre)
```

**Problèmes** : Bugs, failles de sécurité, code incohérent.

#### Solution

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

**Règle** : Ne jamais commiter du code qu'on ne pourrait pas expliquer.

---

### 15. L'Over-reliance sur l'Agent

Faire confiance aveuglément à l'agent.

#### Anti-pattern

```
"L'agent dit que c'est bon, donc ça doit être bon"
```

**Problèmes** : Les agents font des erreurs, hallucinent parfois.

#### Solution

- L'agent est un outil, pas l'expert final
- Toujours valider avec tests et review
- Comprendre le code généré
- Challenger les suggestions incorrectes

**Règle** : L'humain reste responsable du code livré.

---

## Exemples Pratiques

### Détection en Code Review

| Signal d'alarme | Anti-pattern probable |
|-----------------|----------------------|
| Fichier > 300 lignes | God Component |
| `any` sans commentaire | Any Partout |
| Boucle avec await | N+1 Query |
| useEffect + useState + fetch | useEffect Data Fetching |
| Props passées 3+ fois | Prop Drilling |
| String ressemblant à une clé | Secrets en Dur |

### Détection en Process Review

| Signal d'alarme | Anti-pattern probable |
|-----------------|----------------------|
| "Qu'est-ce que tu entends par..." | SPEC Vague |
| `git log` illisible | Commit Messages |
| Reviews < 2 min | Rubber Stamp |
| `grep -r TODO | wc -l` > 50 | Dette Ignorée |
| `it.skip` dans les tests | Tests Flaky |

---

## Checklist

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
- [ ] Cas limites couverts
- [ ] Pas de tests skip sans ticket

### Process
- [ ] SPEC avec critères mesurables
- [ ] Commit messages descriptifs
- [ ] Review substantive
```

---

## Résumé

| Catégorie | Anti-patterns Critiques |
|-----------|------------------------|
| **Code** | God Component, Any Partout, N+1 Query |
| **Process** | SPEC Vague, Rubber Stamp Review |
| **Agent** | Prompt Vague, Copy-Paste Aveugle |

---

*Liens connexes : [H.1 Prompts Efficaces](H1-prompts-efficaces.md) · [H.2 Patterns de Code](H2-patterns-code.md) · [B.2 Product Engineer](B2-product-engineer.md)*
