# H.1 Prompts Efficaces

## Pourquoi cette annexe ?

Le prompting est la compétence centrale du Product Engineer. Un bon prompt produit du code de qualité en une itération. Un mauvais prompt génère des allers-retours frustrants. Cette annexe fournit les patterns éprouvés pour communiquer efficacement avec les agents IA de code.

---

## Anatomie d'un Bon Prompt

### Les 4 Composantes

```
┌─────────────────────────────────────────┐
│ 1. CONTEXTE                             │
│    Projet, stack, fichier concerné      │
│    État actuel du code                  │
├─────────────────────────────────────────┤
│ 2. TÂCHE                                │
│    Objectif clair et spécifique         │
│    Comportement attendu                 │
├─────────────────────────────────────────┤
│ 3. CONTRAINTES                          │
│    Ce qu'il faut respecter              │
│    Ce qu'il ne faut pas faire           │
├─────────────────────────────────────────┤
│ 4. OUTPUT (optionnel)                   │
│    Format attendu                       │
│    Exemples si utile                    │
└─────────────────────────────────────────┘
```

### Principe Clé

Plus le prompt est précis, moins il y a d'itérations. Le temps investi dans la rédaction du prompt est toujours rentabilisé.

---

## Prompts par Type de Tâche

### Création de Fonctionnalité

#### Prompt Faible

```
Ajoute un bouton de suppression
```

**Problèmes** : Pas de contexte, pas de comportement attendu, pas de contraintes techniques.

#### Prompt Efficace

```markdown
## Contexte
Application React + TypeScript. Le composant TaskCard.tsx affiche
une tâche. On utilise TanStack Query pour le data fetching et
notre composant Button de src/components/ui/Button.tsx.

## Tâche
Ajouter un bouton de suppression sur TaskCard avec :
- Confirmation avant suppression (modal ou confirm natif)
- Appel DELETE /api/tasks/:id
- Optimistic update (retirer de la liste immédiatement)
- Rollback si erreur avec toast d'erreur

## Contraintes
- Utiliser le composant Button existant avec variant="danger"
- Utiliser le hook useMutation de TanStack Query
- Suivre les patterns existants dans le fichier

## Comportement attendu
1. Click sur le bouton → modal de confirmation
2. Confirm → tâche disparaît immédiatement de la liste
3. Si API erreur → tâche réapparaît + toast "Erreur de suppression"
```

---

### Correction de Bug

#### Prompt Faible

```
Le formulaire ne marche pas, corrige le bug
```

#### Prompt Efficace

```markdown
## Bug
Le bouton Submit reste disabled après une erreur de validation
même quand l'utilisateur corrige le champ.

## Fichier
src/components/TaskForm.tsx

## Reproduction
1. Entrer un titre > 100 caractères
2. Cliquer Submit → erreur affichée (OK)
3. Corriger le titre (< 100 chars)
4. Le bouton reste grisé (BUG)

## Comportement attendu
Le bouton doit se réactiver dès que le formulaire est valide.

## Hypothèse
Je pense que l'état `hasError` n'est pas réinitialisé quand
les données changent.

## Code actuel
```tsx
const [hasError, setHasError] = useState(false)

const handleSubmit = () => {
  if (title.length > 100) {
    setHasError(true)
    return
  }
  // ...
}

<button disabled={hasError}>Submit</button>
```

Trouve et corrige la cause.
```

---

### Écriture de Tests

#### Prompt Faible

```
Écris des tests pour cette fonction
```

#### Prompt Efficace

```markdown
## Fonction à Tester
```typescript
// src/utils/filterTasks.ts
export function filterTasks(
  tasks: Task[],
  filters: { status?: TaskStatus[]; assignee?: string }
): Task[] {
  return tasks.filter(task => {
    if (filters.status?.length && !filters.status.includes(task.status)) {
      return false
    }
    if (filters.assignee && task.assigneeId !== filters.assignee) {
      return false
    }
    return true
  })
}
```

## Framework
Vitest avec expect assertions

## Cas à Couvrir
1. Happy path : filtre par status fonctionne
2. Happy path : filtre par assignee fonctionne
3. Combinaison : les deux filtres ensemble
4. Edge case : filters vide → retourne tout
5. Edge case : tasks vide → retourne []
6. Edge case : status array vide → retourne tout

## Format Attendu
```typescript
describe('filterTasks', () => {
  it('should ...', () => {
    // Arrange, Act, Assert
  })
})
```
```

---

### Refactoring

#### Prompt Faible

```
Refactorise ce code
```

#### Prompt Efficace

```markdown
## Code à Refactorer
```typescript
function processOrder(order) {
  // 150 lignes avec 15 branches...
}
```

## Objectifs du Refactoring
1. Découper en fonctions plus petites (< 30 lignes chacune)
2. Améliorer la lisibilité
3. Faciliter les tests

## Contraintes
- Garder la même signature publique
- Ne pas changer le comportement
- Chaque étape doit garder les tests passants

## Output Attendu
1. Plan de refactoring (étapes)
2. Code refactoré
3. Explication des changements
```

---

### Documentation

```markdown
## Code à Documenter
```typescript
export async function syncProjectTasks(
  projectId: string,
  options?: { force?: boolean; since?: Date }
): Promise<SyncResult> {
  // Implementation...
}
```

## Type de Documentation
JSDoc complet avec :
- Description de la fonction
- @param avec types et descriptions
- @returns avec description
- @throws si applicable
- @example avec usage typique

## Contexte
Cette fonction est dans notre SDK public, donc la doc sera
lue par des développeurs externes.
```

---

### Exploration de Code

```markdown
## Question
Comment la gestion des erreurs API fonctionne dans ce projet ?

## Ce que je cherche
1. Où sont définies les classes/types d'erreur
2. Comment les erreurs sont propagées
3. Comment elles sont affichées à l'utilisateur
4. Pattern utilisé (ErrorBoundary, try/catch, etc.)

## Fichiers probablement pertinents
- src/lib/api.ts
- src/hooks/useApi.ts
- src/components/ErrorBoundary.tsx

## Output
Explique-moi le flow avec les fichiers et lignes concernés.
```

---

## Patterns Avancés

### Pattern "Step by Step"

Pour les tâches complexes, décomposer en étapes successives.

```markdown
## Tâche Complexe
Implémenter un système de notifications en temps réel.

## Étape 1 (cette demande)
D'abord, montre-moi comment structurer les types et interfaces
pour le système de notifications. Pas d'implémentation encore.

## Étapes suivantes (pour plus tard)
2. Backend : endpoints et WebSocket
3. Frontend : hook useNotifications
4. UI : composant NotificationCenter
```

**Avantage** : Permet de valider l'architecture avant d'investir dans l'implémentation.

---

### Pattern "Show Me First"

Demander une analyse avant l'implémentation.

```markdown
## Avant d'implémenter
Analyse ce code et dis-moi :
1. Les problèmes que tu identifies
2. Les approches possibles pour les résoudre
3. Ta recommandation avec justification

Ensuite je te demanderai d'implémenter.

```typescript
[Code à analyser]
```
```

**Avantage** : Évite de partir dans une mauvaise direction.

---

### Pattern "Like This One"

Utiliser un exemple existant comme référence.

```markdown
## Modèle
Le hook useTaskList.ts est bien structuré :
```typescript
export function useTaskList(projectId: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => api.get(`/projects/${projectId}/tasks`),
  })
}
```

## Demande
Crée un hook useProjectMembers qui suit le même pattern.
- Endpoint : /projects/:id/members
- Même structure de retour
- Ajoute un filtre optionnel par rôle
```

**Avantage** : L'agent réplique les bonnes pratiques existantes.

---

### Pattern "Contraintes d'Abord"

Commencer par les contraintes pour éviter les mauvaises directions.

```markdown
## Contraintes Importantes
- Pas de nouvelle dépendance
- Doit fonctionner avec React 17 (pas de useId)
- Maximum 50 lignes
- Doit être testable (pas de side effects dans le composant)

## Maintenant la Tâche
Avec ces contraintes, implémente un composant Tooltip accessible.
```

**Avantage** : L'agent ne proposera pas de solution incompatible.

---

## Exemples Pratiques

### Prompt Complet pour une Feature

```markdown
## Contexte
Projet : app de gestion de tâches (TaskFlow)
Stack : Next.js 14, TypeScript, TanStack Query, Tailwind, Prisma
Fichier : src/features/tasks/components/TaskCard.tsx

L'utilisateur voit une liste de tâches. Chaque carte affiche
titre, status et assigné. On veut ajouter la priorité.

## Tâche
Ajouter un indicateur de priorité visuel sur TaskCard :
- Badge coloré (high=rouge, medium=jaune, low=vert)
- Position : coin supérieur droit
- Tooltip au hover avec le label

## Contraintes
- Utiliser le composant Badge de src/components/ui/Badge.tsx
- Utiliser les couleurs du design system (voir tailwind.config)
- Le composant TaskCard ne doit pas dépasser 80 lignes

## Fichiers de Référence
```tsx
// src/components/ui/Badge.tsx
export function Badge({ variant, children }) { ... }
// variants: 'success' | 'warning' | 'danger' | 'info'
```

## Comportement Attendu
- Tâche high → Badge rouge "Haute" avec tooltip "Priorité haute"
- Tâche medium → Badge jaune "Moyenne"
- Tâche low → Badge vert "Basse"
- Pas de priorité → Pas de badge affiché
```

---

## Anti-patterns

### Trop Vague

| Mauvais | Pourquoi | Bon |
|---------|----------|-----|
| "Améliore ce code" | Pas de critère | "Réduis la complexité cyclomatique de 15 à < 10" |
| "Fais quelque chose pour la performance" | Pas de métrique | "Ajoute du caching sur cet appel API fait 10x/page" |
| "Ajoute des tests" | Pas de scope | "Ajoute des tests pour les cas d'erreur de cette fonction" |

### Trop de Contexte

```markdown
❌ [500 lignes de code pour une question sur 5 lignes]

✅ [Code pertinent uniquement]
   "Voici le fichier complet si tu en as besoin : [lien]"
```

### Multiples Tâches en Une

```markdown
❌ "Ajoute la feature X, corrige le bug Y, et refactorise Z"

✅ Faire une demande à la fois
✅ Ou explicitement : "En 3 parties distinctes..."
```

### Assumer la Solution

```markdown
❌ "Utilise Redux pour gérer cet état"
   (Peut-être pas la meilleure solution)

✅ "J'ai besoin de partager cet état entre 3 composants.
    Quelle approche recommandes-tu ? (Context, Zustand, prop drilling...)"
```

### Oublier les Contraintes du Projet

```markdown
❌ "Crée un modal de confirmation"
   (L'agent va créer un nouveau composant)

✅ "Crée un modal de confirmation en utilisant notre
    composant Modal de src/components/ui/Modal.tsx"
```

---

## Checklist

```markdown
## Avant d'Envoyer un Prompt

### Contenu
- [ ] Le contexte projet/fichier est fourni
- [ ] L'objectif est clair et spécifique
- [ ] Les contraintes techniques sont mentionnées
- [ ] Le comportement attendu est décrit

### Structure
- [ ] C'est une seule tâche (pas plusieurs mélangées)
- [ ] Le code inclus est le minimum nécessaire
- [ ] Les fichiers de référence sont indiqués si utile

### Qualité
- [ ] Un junior comprendrait ce qu'on attend
- [ ] Il n'y a pas d'ambiguïté sur le résultat
- [ ] Les patterns du projet sont mentionnés
```

---

## Résumé

| Principe | Application |
|----------|-------------|
| **Contexte** | Toujours inclure projet, stack, fichier |
| **Spécificité** | Objectif mesurable, comportement décrit |
| **Contraintes** | Ce qu'il faut respecter ET éviter |
| **Référence** | Montrer les patterns existants à suivre |
| **Une chose à la fois** | Découper les tâches complexes |

---

*Liens connexes : [H.2 Patterns de Code](H2-patterns-code.md) · [H.3 Anti-patterns](H3-anti-patterns.md) · [B.2 Product Engineer](B2-product-engineer.md)*
