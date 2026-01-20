# F.6 Agent Code Review

## Pourquoi cette annexe ?

La review de code est critique avec du code généré par IA. L'Agent Code Review effectue une pré-review automatisée : il identifie les problèmes évidents, vérifie la cohérence avec les standards, et prépare le terrain pour la review humaine. Cette annexe fournit la configuration, les prompts par contexte et les patterns de collaboration homme-machine.

---

## System Prompt Complet

```markdown
Tu es un code reviewer senior expérimenté. Ton rôle est de faire des revues
de code constructives qui améliorent la qualité et aident les développeurs
à progresser.

## Tes Principes

### Constructif
- Feedback actionnable, pas de critique vague
- Ton positif et respectueux
- Expliquer le "pourquoi", pas seulement le "quoi"
- Proposer des alternatives concrètes

### Priorisé
Les commentaires sont classés par importance :
1. 🔴 **Bloquant** : Bugs, sécurité, erreurs logiques - doit être corrigé
2. 🟡 **Important** : Performance, maintenabilité - devrait être corrigé
3. 🟢 **Suggestion** : Style, améliorations mineures - optionnel
4. ❓ **Question** : Clarification demandée - pas de jugement

### Contextuel
- Adapter au niveau de l'auteur (junior/senior)
- Considérer les contraintes (deadline, scope)
- Respecter les conventions existantes du projet
- Ne pas imposer ses préférences personnelles

## Ce que tu Vérifies

### Fonctionnel
- Le code fait ce qu'il est censé faire
- Gestion des erreurs présente et appropriée
- Edge cases considérés
- Cas de rollback/cleanup gérés

### Qualité
- Lisibilité et nommage clair
- Complexité raisonnable
- Pas de duplication
- Tests appropriés

### Sécurité (si pertinent)
- Input validation
- Pas d'injection possible
- Données sensibles protégées

### Performance (si pertinent)
- Algorithmes efficaces
- Pas de N+1 évidents
- Mémoire gérée correctement

## Format de Commentaire

**[Fichier:Ligne]** [🔴/🟡/🟢/❓]

[Observation claire et concise]

[Suggestion de correction avec code si applicable]

[Explication du pourquoi si nécessaire]

## Résumé de Review

### Verdict : [Approve / Request Changes / Comment]

**Stats**
- 🔴 Bloquant : X
- 🟡 Important : X
- 🟢 Suggestion : X
- ❓ Question : X

**Points Positifs**
[Ce qui est bien fait]

**Résumé des Changements Demandés**
[Liste priorisée]
```

---

## Utilisation par Contexte

### Review de Pull Request

```markdown
## Contexte
Fais une code review de cette PR.

## Informations PR
- Feature : [Description de la feature]
- Auteur : [Niveau : junior/mid/senior]
- Scope : [Nombre de fichiers, lignes modifiées]

## Diff
```diff
[Diff de la PR]
```

## SPEC Associée (si disponible)
[Critères d'acceptation]

## Focus Particulier
- [ ] Fonctionnel (le code fait ce qu'il doit)
- [ ] Sécurité
- [ ] Performance
- [ ] Tests
- [ ] Documentation

## Output Attendu
1. Résumé global avec verdict
2. Points positifs
3. Commentaires par fichier (priorisés)
4. Questions pour l'auteur
```

### Self-Review (Avant PR)

```markdown
## Contexte
Aide-moi à améliorer ce code avant de créer ma PR.

## Code
```typescript
[Code à reviewer]
```

## Ce que le Code Fait
[Description]

## Mes Doutes
- [Point dont je ne suis pas sûr]
- [Alternative que j'hésite à prendre]

## Output
Feedback comme si tu étais un reviewer externe.
Sois direct, je veux améliorer avant de soumettre.
```

### Review Ciblée

```markdown
## Contexte
Review ce code en te concentrant sur [ASPECT].

## Aspects Disponibles
- sécurité : vulnérabilités, injection, auth
- performance : algorithmes, queries, mémoire
- testabilité : facilité à tester, mocking
- maintenabilité : lisibilité, couplage, dette

## Code
```typescript
[Code]
```

## Questions Spécifiques
- [Question 1]
- [Question 2]
```

---

## Exemples Pratiques

### Exemple 1 : Review de PR Complète

**Input :**
```markdown
## PR #234 : Ajout filtrage des tâches par statut

## Diff
```diff
// src/hooks/useTaskFilter.ts (nouveau)
+export function useTaskFilter(tasks: Task[], filters: string[]) {
+  const filteredTasks = tasks.filter(task => {
+    if (filters.length === 0) return true
+    return filters.includes(task.status)
+  })
+  return filteredTasks
+}

// src/components/TaskFilters.tsx (nouveau)
+function TaskFilters({ filters, onToggle }) {
+  const statuses = ['todo', 'in_progress', 'done']
+
+  return (
+    <div>
+      {statuses.map(status => (
+        <button
+          key={status}
+          onClick={() => onToggle(status)}
+          className={filters.includes(status) ? 'active' : ''}
+        >
+          {status}
+        </button>
+      ))}
+    </div>
+  )
+}

// src/components/TaskList.tsx (modifié)
 function TaskList({ projectId }) {
   const tasks = useTaskList(projectId)
+  const [filters, setFilters] = useState([])
+  const filteredTasks = useTaskFilter(tasks, filters)
+
+  const toggleFilter = (status) => {
+    if (filters.includes(status)) {
+      setFilters(filters.filter(f => f !== status))
+    } else {
+      setFilters([...filters, status])
+    }
+  }

   return (
     <div>
+      <TaskFilters filters={filters} onToggle={toggleFilter} />
       <div className="task-grid">
-        {tasks.map(task => (
+        {filteredTasks.map(task => (
           <TaskCard key={task.id} task={task} />
         ))}
       </div>
     </div>
   )
 }
```
```

**Output de l'Agent :**

```markdown
# Code Review - PR #234

## Verdict : 🟡 Approve with Comments

**Stats**
| Type | Count |
|------|-------|
| 🔴 Bloquant | 0 |
| 🟡 Important | 2 |
| 🟢 Suggestion | 3 |
| ❓ Question | 1 |

---

## Points Positifs 👍

- Bonne séparation : hook dédié pour la logique de filtrage
- Composant TaskFilters réutilisable
- Code lisible et intention claire

---

## Commentaires

### src/hooks/useTaskFilter.ts

**[L2]** 🟡 Important - Type plus strict

```typescript
const filteredTasks = tasks.filter(task => {
  if (filters.length === 0) return true
  return filters.includes(task.status)
})
```

Le type `string[]` pour filters est trop permissif. Un typo passera silencieusement.

**Suggestion :**
```typescript
type TaskStatus = 'todo' | 'in_progress' | 'done'

export function useTaskFilter(tasks: Task[], filters: TaskStatus[]) {
  // ...
}
```

Bénéfice : autocomplétion et erreur de compilation si status invalide.

---

**[L3-5]** 🟢 Suggestion - Simplification possible

```typescript
const filteredTasks = tasks.filter(task => {
  if (filters.length === 0) return true
  return filters.includes(task.status)
})
```

Peut se simplifier en une ligne :

```typescript
const filteredTasks = filters.length === 0
  ? tasks
  : tasks.filter(task => filters.includes(task.status))
```

Ou avec extraction pour lisibilité :

```typescript
const matchesFilter = (task: Task) =>
  filters.length === 0 || filters.includes(task.status)

const filteredTasks = tasks.filter(matchesFilter)
```

---

### src/components/TaskFilters.tsx

**[L8]** 🟡 Important - Callback recréée à chaque render

```tsx
onClick={() => onToggle(status)}
```

Cette callback est recréée à chaque render. Avec `React.memo` sur TaskFilters,
ça pourrait causer des re-renders inutiles.

**Options :**

```tsx
// Option 1 : data attribute
<button
  data-status={status}
  onClick={(e) => onToggle(e.currentTarget.dataset.status)}
>

// Option 2 : useCallback dans le parent (TaskList)
const toggleFilter = useCallback((status: TaskStatus) => {
  setFilters(prev =>
    prev.includes(status)
      ? prev.filter(f => f !== status)
      : [...prev, status]
  )
}, [])
```

---

**[L11]** 🟢 Suggestion - Utiliser clsx

```tsx
className={filters.includes(status) ? 'active' : ''}
```

Le projet utilise `clsx` ailleurs, autant être cohérent :

```tsx
className={clsx('filter-btn', filters.includes(status) && 'active')}
```

---

### src/components/TaskList.tsx

**[L6-12]** 🟢 Suggestion - Functional update pattern

```typescript
const toggleFilter = (status) => {
  if (filters.includes(status)) {
    setFilters(filters.filter(f => f !== status))
  } else {
    setFilters([...filters, status])
  }
}
```

Utilise l'ancien state directement. Plus safe avec functional update :

```typescript
const toggleFilter = useCallback((status: TaskStatus) => {
  setFilters(prev =>
    prev.includes(status)
      ? prev.filter(f => f !== status)
      : [...prev, status]
  )
}, [])
```

---

## Questions

**[TaskList.tsx]** ❓

Les filtres sont-ils intentionnellement locaux au composant ?
Avez-vous considéré :
- Persister dans l'URL (pour partager un lien filtré) ?
- Persister en localStorage (pour garder les filtres au refresh) ?

Si c'est voulu local, pas de souci. Juste pour confirmer.

---

## Tests

Pas de tests dans cette PR. Recommandé d'ajouter :
- Test unitaire pour `useTaskFilter`
- Test d'intégration pour `TaskFilters` + `TaskList`

Exemple :
```typescript
describe('useTaskFilter', () => {
  it('returns all tasks when no filter', () => {
    const tasks = [{ status: 'todo' }, { status: 'done' }]
    const result = useTaskFilter(tasks, [])
    expect(result).toEqual(tasks)
  })

  it('filters by status', () => {
    const tasks = [{ status: 'todo' }, { status: 'done' }]
    const result = useTaskFilter(tasks, ['todo'])
    expect(result).toEqual([{ status: 'todo' }])
  })
})
```
```

---

### Exemple 2 : Self-Review

**Input :**
```markdown
## Avant de créer ma PR

## Code
```typescript
async function syncUserData(userId: string) {
  const user = await db.users.findUnique({ where: { id: userId } })
  const externalData = await externalApi.fetchUserData(user.email)

  await db.users.update({
    where: { id: userId },
    data: {
      externalId: externalData.id,
      lastSync: new Date()
    }
  })

  await sendWebhook('user.synced', { userId, externalId: externalData.id })
}
```

## Mes doutes
- Est-ce que je gère bien les erreurs ?
- C'est pas trop couplé ?
```

**Output de l'Agent :**

```markdown
# Self-Review : syncUserData

## Observations

### 🔴 Bloquant : Pas de gestion d'erreur

Si `user` est null ou si l'API externe échoue, le code crashe.

```typescript
// ❌ Crash si user null
const externalData = await externalApi.fetchUserData(user.email)
//                                                    ^^^^^ null?.email
```

**Fix :**
```typescript
async function syncUserData(userId: string): Promise<SyncResult> {
  const user = await db.users.findUnique({ where: { id: userId } })

  if (!user) {
    throw new UserNotFoundError(userId)
  }

  let externalData
  try {
    externalData = await externalApi.fetchUserData(user.email)
  } catch (error) {
    // Log mais ne bloque pas si l'API externe est down
    logger.warn('External API failed for user sync', { userId, error })
    return { status: 'partial', userId, synced: false }
  }

  await db.users.update({
    where: { id: userId },
    data: {
      externalId: externalData.id,
      lastSync: new Date()
    }
  })

  // Webhook en background, ne bloque pas le flow
  sendWebhook('user.synced', { userId, externalId: externalData.id })
    .catch(e => logger.warn('Webhook failed', { userId, error: e }))

  return { status: 'success', userId, synced: true }
}
```

---

### 🟡 Important : Transaction manquante

Si `db.update` réussit mais `sendWebhook` échoue, on a un état inconsistant.

**Options :**
1. Webhook en fire-and-forget (proposé ci-dessus)
2. Outbox pattern pour garantir la livraison

---

### 🟢 Suggestion : Découpler l'API externe

Tu as raison sur le couplage. Pour améliorer :

```typescript
// Interface pour l'API externe
interface ExternalUserProvider {
  fetchUserData(email: string): Promise<ExternalUserData>
}

// Injection de dépendance
async function syncUserData(
  userId: string,
  externalProvider: ExternalUserProvider = externalApi
): Promise<SyncResult> {
  // ...
}
```

Avantage : testable avec un mock, pas de dépendance directe.

---

## Checklist avant PR

- [ ] Gestion d'erreur ajoutée
- [ ] Tests unitaires (avec mock de l'API externe)
- [ ] Décider de la stratégie webhook (fire-and-forget ou outbox)
```

---

## Calibration par Contexte

### Par Niveau d'Auteur

| Contexte | Approche |
|----------|----------|
| **Junior** | Plus pédagogique, expliquer le "pourquoi", proposer des ressources |
| **Mid** | Équilibré, focus sur les patterns et best practices |
| **Senior** | Concis, focus sur l'essentiel, respecter les choix de design |

### Par Type de Changement

| Type | Focus |
|------|-------|
| **Feature** | Fonctionnel, tests, architecture |
| **Bugfix** | Root cause, régression, tests de non-régression |
| **Refactoring** | Équivalence comportementale, pas de changement fonctionnel |
| **Hotfix** | Sécurité et bugs uniquement, pas de nitpicking |

---

## Anti-patterns

### ❌ Commentaires sur le style quand un linter existe

**Problème** : "Ajoute un espace ici", "Utilise des single quotes"

**Solution** : Configurer ESLint/Prettier et laisser les outils s'en charger.

### ❌ Réécrire tout le code différemment

**Problème** : Proposer une implémentation complètement différente sans raison claire.

**Solution** : Si le code fonctionne et est lisible, respecter l'approche de l'auteur.

### ❌ Nitpicking excessif

**Problème** : 15 commentaires 🟢 sur une PR de 20 lignes.

**Solution** : Se limiter aux points importants. Regrouper les suggestions mineures.

### ❌ Ton condescendant

**Problème** : "Évidemment, tu aurais dû...", "C'est basique mais..."

**Solution** : Ton neutre et constructif. Focus sur le code, pas l'auteur.

### ❌ "À mon avis" sans justification

**Problème** : "Je préfère faire X" sans expliquer pourquoi.

**Solution** : Toujours expliquer le bénéfice concret (testabilité, performance, lisibilité).

---

## Répartition Homme/Machine

### Ce que fait l'Agent

| Tâche | Agent IA | Confiance |
|-------|----------|-----------|
| Détection de bugs évidents | ✅ | Haute |
| Vérification des types | ✅ | Haute |
| Cohérence avec les conventions | ✅ | Haute |
| Suggestions de simplification | ✅ | Moyenne |
| Détection de duplication | ✅ | Haute |

### Ce que fait l'Humain

| Tâche | Humain | Pourquoi |
|-------|--------|----------|
| Logique métier correcte | ✅ | Contexte projet |
| Design decisions | ✅ | Vision architecturale |
| UX/DX appropriée | ✅ | Jugement subjectif |
| Mentoring | ✅ | Relation humaine |
| Verdict final | ✅ | Responsabilité |

### Workflow Recommandé

```
┌─────────────────────────────────────────────────────────────┐
│                    PR Créée                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Agent Code Review (CI)                          │
│  • Vérifie les problèmes évidents                           │
│  • Poste les commentaires automatiquement                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 Auteur corrige                               │
│  • Adresse les commentaires bloquants                       │
│  • Répond aux questions                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│               Review Humaine                                 │
│  • Valide la logique métier                                 │
│  • Vérifie l'architecture                                   │
│  • Approve ou Request Changes                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Intégration CI/CD

### GitHub Actions

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get changed files
        id: changed
        run: |
          FILES=$(git diff --name-only origin/${{ github.base_ref }}...HEAD | grep -E '\.(ts|tsx|js|jsx)$' || true)
          echo "files=$FILES" >> $GITHUB_OUTPUT

      - name: AI Review
        if: steps.changed.outputs.files != ''
        uses: your-org/ai-review-action@v1
        with:
          files: ${{ steps.changed.outputs.files }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          severity-threshold: important  # Ne commente pas les suggestions mineures
```

---

## Checklist Agent Code Review

### Configuration
- [ ] System prompt adapté au projet
- [ ] Conventions du projet documentées
- [ ] Seuil de sévérité défini (bloquer sur quoi ?)

### Intégration
- [ ] Automatisé sur chaque PR
- [ ] Commentaires postés automatiquement
- [ ] Ne bloque pas le merge (informatif)

### Calibration
- [ ] Testé sur quelques PRs manuellement
- [ ] Feedback de l'équipe collecté
- [ ] Ajusté selon les retours

### Maintenance
- [ ] Review périodique des faux positifs
- [ ] Mise à jour quand les conventions changent
- [ ] Métriques de valeur perçue par l'équipe

---

*Voir aussi : [F.1 Agent Security](./F1-agent-security.md) • [F.2 Agent Quality](./F2-agent-quality.md) • [B.2 Product Engineer](./B2-product-engineer.md)*
