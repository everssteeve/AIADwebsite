# F.6 Agent Code Review

## Pourquoi cet agent ?

L'agent Code Review effectue des revues automatisées du code, identifie les problèmes et suggère des améliorations avant la review humaine.

---

## Cas d'Usage

| Situation | Utilisation |
|-----------|-------------|
| PR automatique | Review systématique en CI |
| Pré-review | Préparer la review humaine |
| Self-review | Vérifier son propre code |
| Learning | Comprendre les bonnes pratiques |

---

## Configuration

### System Prompt

```markdown
Tu es un code reviewer senior expérimenté. Ton rôle est de faire des
revues de code constructives qui améliorent la qualité et aident les
développeurs à progresser.

## Tes Principes

### Constructif
- Feedback actionnable
- Ton positif et respectueux
- Expliquer le pourquoi
- Proposer des alternatives

### Priorisé
1. 🔴 Bloquant : Bugs, sécurité, erreurs
2. 🟡 Important : Performance, maintenabilité
3. 🟢 Suggestion : Style, améliorations mineures

### Contextuel
- Adapter au niveau de l'auteur
- Considérer les contraintes du projet
- Respecter les conventions existantes

## Ce que tu Vérifies

### Fonctionnel
- Le code fait ce qu'il est censé faire
- Gestion des erreurs
- Edge cases couverts

### Qualité
- Lisibilité
- Nommage
- Complexité
- DRY

### Sécurité
- Input validation
- Injection possibles
- Données sensibles

### Performance
- Algorithmes efficaces
- Pas de N+1
- Mémoire

### Tests
- Couverture appropriée
- Tests pertinents
- Cas limites testés

## Format de Commentaire

**[Fichier:Ligne]** [🔴/🟡/🟢]
[Observation]
[Suggestion avec code si applicable]
```

---

## Utilisation

### Review de PR

```markdown
## Prompt : Code Review PR

Fais une code review de cette PR :

### Contexte
- Feature : [Description]
- Auteur : [Niveau junior/mid/senior]
- Contraintes : [Deadline, etc.]

### Fichiers Modifiés
[Diff des fichiers]

### SPEC Associée
[Résumé des critères d'acceptation]

### Output Attendu
Review structurée avec :
1. Résumé global
2. Commentaires par fichier
3. Questions pour l'auteur
4. Verdict (Approve / Request Changes / Comment)
```

### Self-Review

```markdown
## Prompt : Self-Review

Aide-moi à améliorer ce code avant de créer ma PR :

```typescript
[Code à reviewer]
```

### Ce que le code fait
[Description]

### Mes doutes
- [Point dont je ne suis pas sûr]
- [Alternative que j'hésite à prendre]

### Output
Feedback comme si tu étais un reviewer externe.
```

### Review Ciblée

```markdown
## Prompt : Review Focus [Aspect]

Review ce code en te concentrant sur [la sécurité / la performance / etc.] :

```typescript
[Code]
```

### Contexte
[Informations pertinentes]

### Questions Spécifiques
- [Question 1]
- [Question 2]
```

---

## Rapport Type

```markdown
# Code Review - PR #234

## Résumé

**Feature** : Ajout du filtrage des tâches par statut
**Fichiers** : 5 modifiés, +180 -45
**Verdict** : 🟡 Approve with Comments

### Stats
| Type | Count |
|------|-------|
| 🔴 Bloquant | 0 |
| 🟡 Important | 3 |
| 🟢 Suggestion | 5 |
| ❓ Question | 2 |

---

## Points Positifs 👍

- Bonne séparation de la logique dans un hook dédié
- Tests complets des cas principaux
- Naming clair et consistant

---

## Commentaires par Fichier

### src/hooks/useTaskFilter.ts

**[L12]** 🟡 Important
```typescript
const [filters, setFilters] = useState<string[]>([])
```
Le type pourrait être plus strict. Considère utiliser un type union :
```typescript
type TaskStatus = 'todo' | 'in_progress' | 'done'
const [filters, setFilters] = useState<TaskStatus[]>([])
```
Cela évite les erreurs de typo et améliore l'autocomplétion.

---

**[L25-30]** 🟢 Suggestion
```typescript
const filteredTasks = tasks.filter(task => {
  if (filters.length === 0) return true
  return filters.includes(task.status)
})
```
Peut être simplifié :
```typescript
const filteredTasks = filters.length === 0
  ? tasks
  : tasks.filter(task => filters.includes(task.status))
```
Ou avec une extraction de fonction pour la lisibilité :
```typescript
const matchesFilter = (task: Task) =>
  filters.length === 0 || filters.includes(task.status)

const filteredTasks = tasks.filter(matchesFilter)
```

---

### src/components/TaskFilters.tsx

**[L8]** 🟡 Important
```typescript
onClick={() => onToggle(status)}
```
Cette callback est recréée à chaque render. Avec une liste de filtres qui grandit, ça peut impacter les performances :
```typescript
// Option 1 : useCallback dans le parent
const handleToggle = useCallback((status: TaskStatus) => {
  // ...
}, [])

// Option 2 : Passer le status comme data attribute
<button
  data-status={status}
  onClick={handleToggle}
/>
// puis dans handleToggle: e.currentTarget.dataset.status
```

---

**[L15]** 🟢 Suggestion
```typescript
className={`filter-btn ${isActive ? 'active' : ''}`}
```
Le projet utilise clsx ailleurs, autant être consistant :
```typescript
className={clsx('filter-btn', isActive && 'active')}
```

---

### src/components/TaskList.tsx

**[L34]** ❓ Question
```typescript
const tasks = useTaskList(projectId)
const filteredTasks = useTaskFilter(tasks, filters)
```
Y a-t-il une raison de ne pas combiner ces hooks ? Ça éviterait de passer `tasks` en prop :
```typescript
const { tasks, filteredTasks, filters, setFilters } = useProjectTasks(projectId)
```
Peut-être que la séparation est intentionnelle pour la réutilisabilité ?

---

### tests/useTaskFilter.test.ts

**[L45]** 🟡 Important
Il manque un test pour le cas où `filters` contient un statut invalide. Le code actuel le gère silencieusement (pas de match), mais ce serait bien de documenter ce comportement via un test :
```typescript
it('should ignore invalid status in filters', () => {
  const tasks = [{ status: 'todo' }]
  const result = filterTasks(tasks, ['invalid' as any])
  expect(result).toEqual([])
})
```

---

## Questions

1. **Performance** : Avez-vous testé avec une grande liste de tâches (1000+) ? Le filtre côté client reste viable à cette échelle ?

2. **UX** : Les filtres sont-ils persistés quelque part (URL, localStorage) ? Ce serait pratique pour partager un lien filtré.

---

## Verdict

✅ **Approve with Comments**

Le code est fonctionnel et bien structuré. Les points soulevés sont des améliorations, pas des blocages. Je recommande d'adresser les points 🟡 avant merge ou de créer des issues de suivi.
```

---

## Intégration CI

```yaml
# .github/workflows/review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get changed files
        id: changed
        run: |
          echo "files=$(git diff --name-only origin/${{ github.base_ref }}...HEAD | tr '\n' ' ')" >> $GITHUB_OUTPUT

      - name: AI Review
        uses: your-org/ai-review-action@v1
        with:
          files: ${{ steps.changed.outputs.files }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          # Post comments on PR
```

---

## Bonnes Pratiques

### Calibration du Review

| Contexte | Approche |
|----------|----------|
| Junior dev | Plus pédagogique, expliquer le "pourquoi" |
| Senior dev | Plus concis, focus sur l'essentiel |
| Hotfix | Focus sécurité et bugs uniquement |
| Refactoring | Focus architecture et cohérence |

### Ce qu'il ne Faut PAS

- Commentaires sur le style quand un linter existe
- Nitpicking excessif
- Réécrire tout le code différemment
- Ton condescendant

### Complémentarité avec Review Humaine

```markdown
## Répartition

### Agent IA
- Vérifications systématiques
- Consistance avec le codebase
- Problèmes évidents
- First pass rapide

### Reviewer Humain
- Logique métier
- Design decisions
- Contexte projet
- Mentoring
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
