# C.3 Boucle IMPLÉMENTER - Détails

## Pourquoi cette annexe ?

Cette annexe détaille la boucle IMPLÉMENTER : le workflow d'orchestration des agents IA, les prompt patterns efficaces et les stratégies d'itération.

---

## Vue d'Ensemble

### Objectif de la Boucle
Produire du code fonctionnel et conforme au plan, en orchestrant les agents IA.

### Durée Typique
2 à 8 heures selon la complexité de la SPEC.

### Participant Principal
**Product Engineer** avec support des agents IA.

---

## Workflow d'Orchestration

### Structure d'une Session

```
┌─────────────────────────────────────────────────┐
│ 1. PRÉPARATION (5-10 min)                       │
│    - Ouvrir les fichiers de contexte            │
│    - Relire le plan et la SPEC                  │
│    - Préparer l'environnement                   │
├─────────────────────────────────────────────────┤
│ 2. EXÉCUTION (boucle par tâche)                 │
│    ┌─────────────────────────────────────┐      │
│    │ Prompt → Output → Review → Itération │◄────┤
│    └─────────────────────────────────────┘      │
│                     │                           │
│                     ▼                           │
│    ┌─────────────────────────────────────┐      │
│    │ Test → Commit                        │     │
│    └─────────────────────────────────────┘      │
├─────────────────────────────────────────────────┤
│ 3. VALIDATION INTERMÉDIAIRE                     │
│    - Vérifier l'intégration                     │
│    - Tester le parcours                         │
├─────────────────────────────────────────────────┤
│ 4. CLÔTURE                                      │
│    - Tests complets                             │
│    - Cleanup (logs, TODOs)                      │
│    - Documentation si nécessaire               │
└─────────────────────────────────────────────────┘
```

### Cycle Prompt → Output → Review

```
Prompt
   │
   ▼
Output de l'Agent
   │
   ├── ✅ Correct → Commit
   │
   ├── ⚠️ Partiellement correct
   │      │
   │      ▼
   │   Feedback précis → Nouveau prompt → Itération
   │
   └── ❌ Incorrect
          │
          ▼
       Analyse → Reformulation du prompt → Nouvelle tentative
```

---

## Prompt Patterns

### Pattern 1 : Contexte-Tâche-Contraintes

Le pattern de base pour toute génération.

```markdown
## Contexte
[Ce que l'agent doit savoir sur le projet/fichier/feature]

## Tâche
[Ce que l'agent doit produire - être spécifique]

## Contraintes
[Ce qu'il faut respecter ou éviter]

## Output Attendu
[Format et contenu de la réponse souhaitée]
```

**Exemple :**
```markdown
## Contexte
Application React + TypeScript. Composant TaskList affiche les tâches.
On utilise TanStack Query pour le fetching, Tailwind pour le style.

## Tâche
Ajouter un bouton "Supprimer" sur chaque tâche qui appelle
DELETE /api/tasks/:id avec optimistic update.

## Contraintes
- Utiliser le composant Button existant avec variant="danger"
- Demander confirmation avant suppression
- Afficher un toast en cas d'erreur

## Output Attendu
Le code modifié de TaskList.tsx avec les imports nécessaires.
```

### Pattern 2 : Exemple-basé

Guider l'agent avec un exemple existant.

```markdown
## Tâche
Créer un hook useProjectList similaire à useTaskList.

## Exemple de Référence
```typescript
// useTaskList.ts existant
export function useTaskList(projectId: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => api.get(`/projects/${projectId}/tasks`),
  })
}
```

## Différences pour useProjectList
- Endpoint : /projects (sans paramètre)
- Ajouter un filtre par statut optionnel
- Mêmes patterns sinon
```

### Pattern 3 : Test-First

Définir le comportement via les tests.

```markdown
## Tâche
Implémenter la fonction filterTasks qui satisfait ces tests :

```typescript
describe('filterTasks', () => {
  it('filters by single status', () => {
    const tasks = [
      { id: '1', status: 'todo' },
      { id: '2', status: 'done' },
    ]
    expect(filterTasks(tasks, ['todo'])).toEqual([{ id: '1', status: 'todo' }])
  })

  it('returns all when filter is empty', () => {
    const tasks = [{ id: '1', status: 'todo' }]
    expect(filterTasks(tasks, [])).toEqual(tasks)
  })
})
```

## Contraintes
- Fonction pure
- TypeScript strict
- Pas de mutation des inputs
```

### Pattern 4 : Diff/Modification

Pour modifier du code existant.

```markdown
## Code Actuel
```typescript
export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="p-4 border rounded">
      <h3>{task.title}</h3>
      <span>{task.status}</span>
    </div>
  )
}
```

## Modification Demandée
Ajouter :
1. Badge de priorité (haute = rouge, moyenne = jaune, basse = gris)
2. Date d'échéance avec formatage relatif ("dans 2 jours")

## Contraintes
- Garder la structure existante
- Utiliser les classes Tailwind du projet
- Utiliser date-fns pour le formatage
```

### Pattern 5 : Debug/Fix

Pour corriger un bug.

```markdown
## Bug
Le formulaire se soumet même quand il y a des erreurs de validation.

## Comportement Actuel
1. Remplir un email invalide
2. Cliquer "Envoyer"
3. ❌ Le formulaire se soumet quand même

## Comportement Attendu
Le formulaire ne doit pas se soumettre si validation échoue.

## Code Concerné
```typescript
// TaskForm.tsx ligne 45-60
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const errors = validate(formData)
  setErrors(errors)
  // BUG: manque le check ici
  onSubmit(formData)
}
```

## Fix Attendu
Ajouter la vérification des erreurs avant onSubmit.
```

---

## Stratégies d'Itération

### Itération par Affinement

```
Itération 1 : Output fonctionnel mais imparfait
     │
     ▼
Feedback : "Le code fonctionne mais utilise `any`.
           Ajoute les types stricts."
     │
     ▼
Itération 2 : Types ajoutés mais manque un cas
     │
     ▼
Feedback : "Bien, mais gère aussi le cas où la liste est vide."
     │
     ▼
Itération 3 : Complet ✅
```

### Itération par Découpage

Si l'output est trop complexe ou incorrect :

```
Prompt initial trop ambitieux
     │
     ▼
Découper en sous-tâches
     │
     ├── Sous-tâche A : "D'abord, crée juste l'interface"
     │        │
     │        ▼
     │   Output A ✅
     │
     ├── Sous-tâche B : "Maintenant, implémente la logique"
     │        │
     │        ▼
     │   Output B ✅
     │
     └── Sous-tâche C : "Enfin, ajoute la gestion d'erreurs"
              │
              ▼
         Output C ✅
```

### Quand Abandonner et Recommencer

| Signal | Action |
|--------|--------|
| 3+ itérations sans progrès | Reformuler complètement le prompt |
| Agent ne comprend pas le contexte | Donner plus de contexte ou un exemple |
| Output totalement hors sujet | Vérifier l'AGENT-GUIDE, simplifier la demande |
| Bug récurrent | Écrire un test qui échoue, demander le fix |

---

## Gestion du Contexte

### Contexte Fichier

```markdown
## Fichiers à Considérer

### Fichier Principal
[Contenu du fichier à modifier]

### Fichiers Liés (pour contexte)
- types.ts : [Types pertinents]
- utils.ts : [Fonctions utilisées]

### Patterns du Projet
[Exemple de code similaire dans le projet]
```

### Contexte Projet

```markdown
## Stack
- React 18 + TypeScript
- TanStack Query pour le data fetching
- Tailwind CSS pour le styling
- Zod pour la validation

## Conventions
- Composants fonctionnels
- Hooks pour la logique réutilisable
- Services pour les appels API
```

### Contexte SPEC

```markdown
## Référence SPEC
SPEC-042 : Filtrage des tâches

## Critères d'Acceptation Pertinents
- CA-1 : [Description]
- CA-2 : [Description]

## Cas Limites à Gérer
- [Cas 1]
- [Cas 2]
```

---

## Bonnes Pratiques

### Commits Atomiques

```bash
# Après chaque tâche complète
git add [fichiers modifiés]
git commit -m "feat(tasks): add delete button with optimistic update"

# Pas de "WIP" commits sauf fin de journée
```

### Tests Continus

```bash
# Après chaque modification significative
pnpm test --watch [fichier]

# Avant de passer à la tâche suivante
pnpm test
pnpm typecheck
```

### Review Continue

```markdown
## Checklist Review (pour chaque output)

### Fonctionnel
- [ ] Le code fait ce qui est demandé
- [ ] Les cas limites sont gérés

### Qualité
- [ ] Suit les patterns du projet
- [ ] Pas de code mort ou commenté
- [ ] Nommage cohérent

### Sécurité
- [ ] Inputs validés
- [ ] Pas de secrets en dur
```

---

## Anti-patterns

### 1. "Le Copy-Paste Aveugle"

```
❌ Agent génère → Coller sans lire → Passer à la suite
```

**Solution :**
```
✅ Agent génère → Lire le code → Tester → Comprendre → Commit
```

### 2. "Le Prompt Roman"

```
❌ Prompt de 500 mots avec tous les détails imaginables
```

**Solution :**
```
✅ Prompt concis avec le contexte nécessaire
✅ Ajouter du contexte si l'output n'est pas bon
```

### 3. "L'Itération Infinie"

```
❌ 10 itérations sur le même prompt sans progrès
```

**Solution :**
```
✅ Après 3 itérations sans succès : reformuler ou découper
✅ Écrire un test qui définit le comportement attendu
```

### 4. "Le Big Bang Commit"

```
❌ Implémenter toute la feature puis faire un seul commit
```

**Solution :**
```
✅ Commit après chaque tâche du plan
✅ Chaque commit doit laisser le code fonctionnel
```

---

## Template de Session

```markdown
# Session Implémentation - SPEC-[XXX]

## Préparation
- [ ] Plan relu
- [ ] Environnement prêt
- [ ] AGENT-GUIDE ouvert

## Exécution

### Tâche 1 : [Nom]
- Prompt : [résumé]
- Itérations : [1/2/3]
- Résultat : [✅/⚠️/❌]
- Commit : [hash]

### Tâche 2 : [Nom]
- Prompt : [résumé]
- Itérations : [1/2/3]
- Résultat : [✅/⚠️/❌]
- Commit : [hash]

## Validation
- [ ] Tests passent
- [ ] Typecheck OK
- [ ] Lint OK

## Notes
- [Observation 1]
- [Difficulté rencontrée]
- [Learning pour prochaine fois]
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
