# F.5 Agent Performance

## Pourquoi cet agent ?

L'agent Performance analyse le code pour identifier les problèmes de performance, suggère des optimisations et aide au profiling.

---

## Cas d'Usage

| Situation | Utilisation |
|-----------|-------------|
| Performance dégradée | Identifier les causes |
| Code review | Détecter les anti-patterns |
| Optimisation | Suggestions d'amélioration |
| Benchmarking | Analyser les résultats |

---

## Configuration

### System Prompt

```markdown
Tu es un expert en performance applicative. Ton rôle est d'identifier
les problèmes de performance et proposer des optimisations.

## Ce que tu Analyses

### Backend
- Complexité algorithmique
- Requêtes N+1
- Memory leaks
- Blocking operations
- Cache opportunities

### Frontend
- Bundle size
- Render performance
- Memory leaks
- Network waterfall
- Core Web Vitals

### Base de Données
- Queries inefficaces
- Index manquants
- Full table scans
- Connection pooling

## Principes d'Optimisation

1. **Mesurer avant d'optimiser** - Pas d'optimisation prématurée
2. **80/20** - 20% du code cause 80% des problèmes
3. **Trade-offs** - Performance vs Lisibilité vs Maintenabilité
4. **Caching** - La meilleure requête est celle qu'on ne fait pas

## Format de Réponse

### Issue Performance

**Localisation** : fichier:ligne
**Sévérité** : 🔴 Critique / 🟡 Important / 🟢 Mineur
**Impact Estimé** : [Amélioration attendue]

**Problème** : [Description]
**Solution** : [Code optimisé]
**Trade-off** : [Ce qu'on sacrifie si applicable]
```

---

## Utilisation

### Analyse de Code

```markdown
## Prompt : Analyse Performance

Analyse ce code pour identifier les problèmes de performance :

```typescript
[Code à analyser]
```

### Contexte
- Type : [Backend/Frontend/DB]
- Volume de données : [Estimé]
- Fréquence d'appel : [X/sec ou /min]

### Focus
- [ ] Complexité algorithmique
- [ ] Appels réseau/DB
- [ ] Mémoire
- [ ] Rendering (si frontend)
```

### Analyse de Profiling

```markdown
## Prompt : Analyse Profiling

Analyse ces résultats de profiling :

### Données
[Résultats du profiler]

### Contexte
- Outil utilisé : [Chrome DevTools / Node --prof / etc.]
- Scénario : [Ce qui a été mesuré]

### Questions
1. Quels sont les hotspots ?
2. Quelles optimisations prioritaires ?
3. Estimation de gain pour chaque optimisation ?
```

### Optimisation Spécifique

```markdown
## Prompt : Optimiser Query

Optimise cette requête qui prend [X]ms actuellement :

```sql
[Query SQL]
```

### Contexte
- Tables concernées : [Tailles estimées]
- Index existants : [Liste]
- Fréquence : [X/sec]

### Output
- Query optimisée
- Index à créer si nécessaire
- Explication du gain
```

---

## Rapport Type

```markdown
# Rapport Performance - [Module/Feature]

## Résumé

**Problèmes Identifiés** : 5
**Impact Total Estimé** : Amélioration 60%

| Sévérité | Count |
|----------|-------|
| 🔴 Critique | 1 |
| 🟡 Important | 2 |
| 🟢 Mineur | 2 |

---

## Problèmes Détaillés

### 🔴 CRITIQUE : N+1 Query dans TaskList

**Fichier** : src/services/TaskService.ts:45
**Impact** : 50+ queries au lieu de 2

**Code Problématique**
```typescript
async function getTasksWithAssignees(projectId: string) {
  const tasks = await db.tasks.findMany({ where: { projectId } })

  // ❌ N+1 : une query par tâche
  for (const task of tasks) {
    task.assignee = await db.users.findUnique({
      where: { id: task.assigneeId }
    })
  }

  return tasks
}
```

**Solution**
```typescript
async function getTasksWithAssignees(projectId: string) {
  // ✅ Une seule query avec include
  return db.tasks.findMany({
    where: { projectId },
    include: { assignee: true }
  })
}
```

**Gain Estimé** : 50 queries → 1 query, -98% temps de réponse

---

### 🟡 IMPORTANT : Re-renders Excessifs

**Fichier** : src/components/TaskList.tsx
**Impact** : Re-render complet à chaque changement

**Problème**
```tsx
function TaskList({ tasks }) {
  // ❌ Nouvelle fonction à chaque render
  const sortedTasks = tasks.sort((a, b) => a.order - b.order)

  return (
    <div>
      {sortedTasks.map(task => (
        // ❌ Callback recréé à chaque render
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={(data) => updateTask(task.id, data)}
        />
      ))}
    </div>
  )
}
```

**Solution**
```tsx
function TaskList({ tasks }) {
  // ✅ Mémoisation du tri
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.order - b.order),
    [tasks]
  )

  // ✅ Callback stable
  const handleUpdate = useCallback((taskId: string, data: TaskUpdate) => {
    updateTask(taskId, data)
  }, [])

  return (
    <div>
      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}

// ✅ Mémoiser le composant enfant
const TaskCard = memo(function TaskCard({ task, onUpdate }) {
  // ...
})
```

**Gain Estimé** : -70% re-renders inutiles

---

### 🟡 IMPORTANT : Bundle Size

**Problème** : Import complet de lodash

```typescript
// ❌ Importe tout lodash (70kb)
import _ from 'lodash'
const result = _.groupBy(data, 'category')
```

**Solution**
```typescript
// ✅ Import spécifique (4kb)
import groupBy from 'lodash/groupBy'
const result = groupBy(data, 'category')

// Ou natif si possible
const result = Object.groupBy(data, item => item.category)
```

**Gain** : -66kb bundle size

---

### 🟢 MINEUR : Index Manquant

**Table** : tasks
**Query Lente** : `SELECT * FROM tasks WHERE status = ? AND project_id = ?`

**Solution**
```sql
CREATE INDEX idx_tasks_status_project ON tasks(status, project_id);
```

**Gain Estimé** : Query 50ms → 5ms

---

## Plan d'Optimisation

### Priorité 1 (Cette Semaine)
1. [ ] Fix N+1 query TaskService
2. [ ] Ajouter index tasks

### Priorité 2 (Ce Mois)
3. [ ] Optimiser re-renders TaskList
4. [ ] Tree-shaking lodash

### Métriques de Suivi
| Métrique | Avant | Cible |
|----------|-------|-------|
| API /tasks p95 | 800ms | 100ms |
| Bundle size | 450kb | 350kb |
| LCP | 2.8s | 2.0s |
```

---

## Checklists

### Backend Performance

```markdown
## Checklist Backend

### Database
- [ ] Pas de N+1 queries
- [ ] Index sur colonnes filtrées
- [ ] Pagination implémentée
- [ ] Connection pooling configuré

### API
- [ ] Réponses paginées
- [ ] Compression activée
- [ ] Cache headers appropriés
- [ ] Pas de calculs bloquants

### Async
- [ ] Operations longues en background
- [ ] Timeouts configurés
- [ ] Circuit breakers pour services externes
```

### Frontend Performance

```markdown
## Checklist Frontend

### Bundle
- [ ] Code splitting par route
- [ ] Tree shaking effectif
- [ ] Lazy loading des images
- [ ] Preload des ressources critiques

### Rendering
- [ ] Mémoisation appropriée
- [ ] Virtualisation des longues listes
- [ ] Debounce/throttle des events fréquents
- [ ] Pas de layout thrashing

### Network
- [ ] Cache API (TanStack Query, SWR)
- [ ] Prefetch des pages probables
- [ ] Optimistic updates
```

---

## Outils Recommandés

```markdown
## Stack Performance

### Profiling
- Chrome DevTools Performance
- React DevTools Profiler
- Node.js --prof
- Clinic.js

### Monitoring
- Lighthouse CI
- Web Vitals
- APM (Datadog, NewRelic)

### Database
- EXPLAIN ANALYZE
- pg_stat_statements
- Query plan visualizers

### Bundle
- webpack-bundle-analyzer
- source-map-explorer
- bundlephobia
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
