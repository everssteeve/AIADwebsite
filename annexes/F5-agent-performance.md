# F.5 Agent Performance

## Pourquoi cette annexe ?

Le code généré par les agents IA peut contenir des problèmes de performance non évidents : requêtes N+1, re-renders excessifs, algorithmes inefficaces. L'Agent Performance analyse le code et les métriques pour identifier les goulots d'étranglement et proposer des optimisations ciblées. Cette annexe fournit la configuration, les patterns d'analyse et les critères de priorisation.

---

## System Prompt Complet

```markdown
Tu es un expert en performance applicative. Ton rôle est d'identifier les
problèmes de performance et proposer des optimisations concrètes et mesurables.

## Principes d'Optimisation

1. **Mesurer avant d'optimiser** - Pas d'optimisation prématurée
2. **80/20** - 20% du code cause 80% des problèmes
3. **Trade-offs explicites** - Performance vs Lisibilité vs Maintenabilité
4. **Caching** - La meilleure requête est celle qu'on ne fait pas

## Ce que tu Analyses

### Backend
- Complexité algorithmique (O(n), O(n²), etc.)
- Requêtes N+1 et queries inefficaces
- Memory leaks et consommation mémoire
- Blocking operations sur l'event loop
- Opportunités de caching
- Connection pooling et ressources

### Frontend
- Bundle size et code splitting
- Render performance (re-renders inutiles)
- Memory leaks (listeners, subscriptions)
- Network waterfall et prefetch
- Core Web Vitals (LCP, FID, CLS)
- Images et assets non optimisés

### Base de Données
- Queries lentes (EXPLAIN ANALYZE)
- Index manquants ou inutilisés
- Full table scans
- Locks et contention
- Connection pooling

## Format de Rapport

Pour chaque issue :

### [Sévérité] Titre

**Localisation** : fichier:ligne
**Impact Estimé** : [Amélioration attendue en %, ms, etc.]
**Effort** : [Faible/Moyen/Élevé]

**Problème**
Description du problème de performance.

**Métriques Actuelles**
[Données chiffrées si disponibles]

**Solution**
```code
// Code optimisé
```

**Trade-off**
Ce qu'on sacrifie (si applicable).

**Validation**
Comment mesurer l'amélioration.
```

---

## Utilisation par Contexte

### Analyse de Code

```markdown
## Contexte
Analyse ce code pour identifier les problèmes de performance.

## Code
```typescript
[Code à analyser]
```

## Contexte d'Exécution
- Type : Backend / Frontend / Full-stack
- Volume de données : [Estimé ou mesuré]
- Fréquence d'appel : [X/sec ou X/min]
- Contraintes : [Temps de réponse attendu]

## Focus
- [ ] Complexité algorithmique
- [ ] Appels réseau/DB
- [ ] Mémoire
- [ ] Rendering (si frontend)
- [ ] Bundle size
```

### Analyse de Profiling

```markdown
## Contexte
Analyse ces résultats de profiling pour identifier les optimisations.

## Données de Profiling
[Output du profiler : Chrome DevTools, Node --prof, py-spy, etc.]

## Scénario Mesuré
[Description de ce qui a été mesuré]

## Questions
1. Quels sont les hotspots ?
2. Quelles optimisations auraient le plus d'impact ?
3. Estimation de gain pour chaque optimisation ?
```

### Optimisation de Query SQL

```markdown
## Contexte
Optimise cette requête qui prend actuellement [X]ms.

## Query
```sql
[Requête SQL]
```

## EXPLAIN ANALYZE
[Output de EXPLAIN ANALYZE]

## Contexte Table
- Taille : [Nombre de lignes]
- Index existants : [Liste]
- Fréquence d'appel : [X/sec]

## Output Attendu
- Query optimisée
- Index à créer si nécessaire
- Explication du gain attendu
```

---

## Exemples Pratiques

### Exemple 1 : Requête N+1 Détectée

**Input :**
```typescript
async function getTasksWithAssignees(projectId: string) {
  const tasks = await db.tasks.findMany({ where: { projectId } })

  for (const task of tasks) {
    task.assignee = await db.users.findUnique({
      where: { id: task.assigneeId }
    })
  }

  return tasks
}
```

**Output de l'Agent :**

### 🔴 Critique : Requête N+1 dans getTasksWithAssignees

**Localisation** : src/services/TaskService.ts:45
**Impact Estimé** : -98% temps de réponse (50 queries → 1)
**Effort** : Faible

**Problème**
Pour N tâches, on exécute N+1 requêtes :
- 1 requête pour récupérer les tâches
- N requêtes pour récupérer chaque assigné

Avec 50 tâches, on fait 51 requêtes au lieu de 1-2.

**Métriques Estimées**
| Tâches | Queries Actuelles | Temps Estimé |
|--------|-------------------|--------------|
| 10 | 11 | ~110ms |
| 50 | 51 | ~510ms |
| 100 | 101 | ~1010ms |

**Code Problématique**
```typescript
for (const task of tasks) {
  task.assignee = await db.users.findUnique({ ... })  // ❌ N queries
}
```

**Solution 1 : Include (Prisma/ORM)**
```typescript
async function getTasksWithAssignees(projectId: string) {
  return db.tasks.findMany({
    where: { projectId },
    include: { assignee: true }  // ✅ 1 query avec JOIN
  })
}
```

**Solution 2 : Batch (si include non disponible)**
```typescript
async function getTasksWithAssignees(projectId: string) {
  const tasks = await db.tasks.findMany({ where: { projectId } })

  // Collecter les IDs uniques
  const assigneeIds = [...new Set(tasks.map(t => t.assigneeId).filter(Boolean))]

  // Une seule query pour tous les assignés
  const assignees = await db.users.findMany({
    where: { id: { in: assigneeIds } }
  })

  // Map pour lookup O(1)
  const assigneeMap = new Map(assignees.map(u => [u.id, u]))

  // Enrichir les tâches
  return tasks.map(task => ({
    ...task,
    assignee: assigneeMap.get(task.assigneeId)
  }))
}
```

**Validation**
```typescript
// Avant : 51 queries, ~500ms
// Après : 1-2 queries, ~10ms
// Vérifier avec : DEBUG=prisma:query pnpm test
```

---

### Exemple 2 : Re-renders Excessifs React

**Input :**
```tsx
function TaskList({ tasks, onUpdate }) {
  const sortedTasks = tasks.sort((a, b) => a.order - b.order)

  return (
    <div>
      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onUpdate={(data) => onUpdate(task.id, data)}
        />
      ))}
    </div>
  )
}
```

**Output de l'Agent :**

### 🟡 Important : Re-renders Excessifs dans TaskList

**Localisation** : src/components/TaskList.tsx
**Impact Estimé** : -70% re-renders inutiles
**Effort** : Faible

**Problèmes Identifiés**

1. **`sort()` mute le tableau original** et crée un nouveau tri à chaque render
2. **Callback inline recréé** à chaque render → TaskCard re-render même si task n'a pas changé

**Code Problématique**
```tsx
// ❌ sort() mute ET nouveau tableau à chaque render
const sortedTasks = tasks.sort((a, b) => a.order - b.order)

// ❌ Nouvelle fonction à chaque render
onUpdate={(data) => onUpdate(task.id, data)}
```

**Solution**
```tsx
import { useMemo, useCallback, memo } from 'react'

function TaskList({ tasks, onUpdate }) {
  // ✅ Mémoiser le tri - ne recalcule que si tasks change
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => a.order - b.order),
    [tasks]
  )

  // ✅ Callback stable
  const handleUpdate = useCallback((taskId: string, data: TaskUpdate) => {
    onUpdate(taskId, data)
  }, [onUpdate])

  return (
    <div>
      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          taskId={task.id}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}

// ✅ Mémoiser le composant enfant
const TaskCard = memo(function TaskCard({ task, taskId, onUpdate }) {
  const handleClick = useCallback(() => {
    onUpdate(taskId, { clicked: true })
  }, [taskId, onUpdate])

  return <div onClick={handleClick}>{task.title}</div>
})
```

**Validation**
```tsx
// Vérifier avec React DevTools Profiler
// Avant : TaskCard re-render à chaque changement parent
// Après : TaskCard re-render uniquement si task change
```

---

### Exemple 3 : Bundle Size

**Input :**
```typescript
import _ from 'lodash'
import moment from 'moment'

const grouped = _.groupBy(data, 'category')
const formatted = moment(date).format('YYYY-MM-DD')
```

**Output de l'Agent :**

### 🟡 Important : Bundle Size - Imports Non Optimisés

**Impact Estimé** : -150kb bundle size
**Effort** : Faible

**Analyse**

| Import | Taille Ajoutée | Utilisé |
|--------|----------------|---------|
| lodash (full) | ~70kb | groupBy uniquement |
| moment | ~80kb | format uniquement |

**Solutions**

```typescript
// ❌ Avant : Import complet
import _ from 'lodash'  // 70kb
import moment from 'moment'  // 80kb

// ✅ Après : Imports spécifiques
import groupBy from 'lodash/groupBy'  // ~2kb

// ✅ Après : Alternative native ou légère
// Pour groupBy, natif en ES2024+ :
const grouped = Object.groupBy(data, item => item.category)

// Pour dates, utiliser date-fns (~2kb par fonction) ou natif :
import { format } from 'date-fns'  // ~2kb
const formatted = format(date, 'yyyy-MM-dd')

// Ou natif (0kb) :
const formatted = date.toISOString().split('T')[0]
```

**Validation**
```bash
# Analyser le bundle
npx webpack-bundle-analyzer dist/stats.json

# Ou avec vite
npx vite-bundle-visualizer
```

---

## Rapport Type

```markdown
# Rapport Performance - [Module] - [Date]

## Résumé Exécutif

**Problèmes Identifiés** : 5
**Impact Total Estimé** : -60% temps de réponse API, -40% bundle size

| Sévérité | Count | Impact |
|----------|-------|--------|
| 🔴 Critique | 1 | Bloquant pour prod |
| 🟡 Important | 2 | Amélioration significative |
| 🟢 Mineur | 2 | Nice to have |

---

## Métriques Actuelles vs Cibles

| Métrique | Actuel | Cible | Status |
|----------|--------|-------|--------|
| API /tasks p95 | 850ms | < 200ms | ❌ |
| Bundle size | 450kb | < 300kb | ❌ |
| LCP | 2.8s | < 2.5s | ⚠️ |
| FID | 50ms | < 100ms | ✅ |

---

## Problèmes Détaillés

### 🔴 CRITIQUE : N+1 Query - TaskService

[Détail comme exemple 1...]

**Action** : Corriger avant prochain déploiement

### 🟡 IMPORTANT : Re-renders - TaskList

[Détail comme exemple 2...]

**Action** : Sprint courant

### 🟡 IMPORTANT : Bundle Size - Lodash + Moment

[Détail comme exemple 3...]

**Action** : Sprint courant

---

## Plan d'Optimisation

### Priorité 1 (Bloquant)
| Action | Effort | Gain Estimé |
|--------|--------|-------------|
| Fix N+1 TaskService | 2h | -95% temps response |

### Priorité 2 (Cette semaine)
| Action | Effort | Gain Estimé |
|--------|--------|-------------|
| Memoization TaskList | 1h | -70% re-renders |
| Tree-shake lodash | 1h | -70kb bundle |
| Remplacer moment | 2h | -80kb bundle |

### Priorité 3 (Backlog)
| Action | Effort | Gain Estimé |
|--------|--------|-------------|
| Lazy load images | 4h | -30% LCP |
| Code splitting routes | 4h | -40% initial bundle |

---

## Métriques de Suivi

Après implémentation, mesurer :

| Métrique | Avant | Après | Delta |
|----------|-------|-------|-------|
| API /tasks p95 | 850ms | ? | ? |
| Bundle size | 450kb | ? | ? |
| Lighthouse Perf | 72 | ? | ? |
```

---

## Checklists

### Backend Performance

```markdown
## Checklist Backend

### Database
- [ ] Pas de N+1 queries (vérifier avec query logging)
- [ ] Index sur colonnes filtrées/triées
- [ ] Pagination implémentée (pas de SELECT * sans LIMIT)
- [ ] Connection pooling configuré
- [ ] Queries > 100ms identifiées et optimisées

### API
- [ ] Réponses paginées pour les listes
- [ ] Compression gzip/brotli activée
- [ ] Cache headers appropriés (ETag, Cache-Control)
- [ ] Pas de calculs bloquants sur l'event loop

### Async
- [ ] Operations longues en background jobs
- [ ] Timeouts configurés sur les appels externes
- [ ] Circuit breakers pour services critiques
- [ ] Rate limiting en place
```

### Frontend Performance

```markdown
## Checklist Frontend

### Bundle
- [ ] Code splitting par route
- [ ] Tree shaking effectif (pas d'imports *)
- [ ] Dependencies analysées (bundlephobia)
- [ ] Preload des ressources critiques

### Rendering
- [ ] Mémoisation appropriée (useMemo, useCallback, memo)
- [ ] Virtualisation des longues listes (>100 items)
- [ ] Debounce/throttle des events fréquents
- [ ] Pas de layout thrashing

### Assets
- [ ] Images optimisées (WebP, srcset)
- [ ] Lazy loading des images below-the-fold
- [ ] Fonts avec font-display: swap
- [ ] SVG optimisés ou icon font

### Network
- [ ] Cache API (TanStack Query, SWR, Apollo)
- [ ] Prefetch des pages probables
- [ ] Optimistic updates où pertinent
- [ ] Service Worker pour offline
```

---

## Anti-patterns

### ❌ Optimisation prématurée

**Problème** : Optimiser sans données, basé sur des suppositions.

**Solution** : Toujours mesurer d'abord (profiler, métriques), puis optimiser les vrais goulots.

### ❌ Micro-optimisations

**Problème** : Passer du temps sur des gains négligeables.

```typescript
// ❌ Gain négligeable
const len = arr.length
for (let i = 0; i < len; i++) { ... }

// Le vrai problème est probablement ailleurs
// Focus sur : N+1, bundle size, algorithmes O(n²)
```

### ❌ Sacrifier la lisibilité pour 5%

**Problème** : Code illisible pour un gain marginal.

**Solution** : Accepter les trade-offs raisonnables. Un code maintenable avec 200ms est souvent préférable à un code cryptique avec 190ms.

### ❌ Cache sans invalidation

**Problème** : Données stale servies aux utilisateurs.

**Solution** : Toujours définir une stratégie d'invalidation avec le cache.

### ❌ Ajouter des index partout

**Problème** : Trop d'index ralentit les écritures et consomme du disque.

**Solution** : Index uniquement sur les colonnes filtrées/triées fréquemment. Analyser les query patterns réels.

---

## Checklist Agent Performance

### Avant Analyse
- [ ] Métriques actuelles disponibles (p50, p95, p99)
- [ ] Code source accessible
- [ ] Contexte d'exécution connu (volume, fréquence)
- [ ] Contraintes définies (SLA, budget temps)

### Pendant Analyse
- [ ] Identifier les hotspots (80/20)
- [ ] Estimer l'impact de chaque optimisation
- [ ] Évaluer l'effort requis
- [ ] Considérer les trade-offs

### Après Analyse
- [ ] Prioriser par ROI (impact/effort)
- [ ] Fournir du code optimisé testable
- [ ] Définir les métriques de validation
- [ ] Documenter les trade-offs acceptés

---

## Outils Recommandés

### Profiling

| Outil | Usage |
|-------|-------|
| Chrome DevTools Performance | Frontend profiling |
| React DevTools Profiler | React renders |
| Node.js --prof | Backend Node.js |
| Clinic.js | Node.js diagnostics |
| py-spy | Python profiling |

### Monitoring

| Outil | Usage |
|-------|-------|
| Lighthouse CI | Web Vitals en CI |
| Datadog / NewRelic | APM production |
| Sentry Performance | Transactions tracking |

### Bundle

| Outil | Usage |
|-------|-------|
| webpack-bundle-analyzer | Visualiser le bundle |
| source-map-explorer | Analyser par fichier |
| bundlephobia.com | Taille des packages |

### Database

| Outil | Usage |
|-------|-------|
| EXPLAIN ANALYZE | Query plan PostgreSQL |
| pg_stat_statements | Queries fréquentes |
| Prisma Query Events | Debug ORM |

---

*Voir aussi : [F.2 Agent Quality](./F2-agent-quality.md) • [F.6 Agent Code Review](./F6-agent-code-review.md) • [C.3 Boucle Implémenter](./C3-boucle-implementer.md)*
