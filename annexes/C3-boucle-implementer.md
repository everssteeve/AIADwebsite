# C.3 Boucle IMPLÉMENTER

## Pourquoi cette annexe ?

L'implémentation avec des agents IA requiert une orchestration différente du développement traditionnel. Sans méthode, vous risquez du code incohérent, des itérations infinies et une perte de contexte. Cette annexe vous guide pour produire du code de qualité efficacement.

---

## Vue d'Ensemble

### Ce que vous allez faire

Durant la boucle IMPLÉMENTER, vous allez :
- Exécuter les tâches du plan avec l'aide des agents IA
- Itérer sur chaque output jusqu'à satisfaction
- Committer de manière atomique
- Valider les points intermédiaires

### Le Cycle Fondamental

```
┌─────────────────────────────────────────────┐
│              Pour chaque tâche              │
│                                             │
│   ┌──────┐    ┌────────┐    ┌────────┐     │
│   │Prompt│───►│ Output │───►│ Review │     │
│   └──────┘    └────────┘    └───┬────┘     │
│                                 │          │
│              ┌──────────────────┼──────┐   │
│              │                  │      │   │
│              ▼                  ▼      ▼   │
│         ┌────────┐         ┌──────┐  ┌────┐│
│         │Itération│         │Commit│  │Fix ││
│         └────────┘         └──────┘  └────┘│
│                                             │
└─────────────────────────────────────────────┘
```

---

## Étape 1 : Préparer la Session

Avant de commencer à coder, prenez 5-10 minutes pour vous mettre en conditions.

### Checklist de Préparation

```markdown
## Préparation Session - SPEC-[XXX]

### Contexte
- [ ] Plan relu et compris
- [ ] SPEC ouverte pour référence
- [ ] AGENT-GUIDE accessible à l'agent

### Environnement
- [ ] Branche créée et checkout
- [ ] Projet qui compile (pnpm build)
- [ ] Tests qui passent (pnpm test)

### Outils
- [ ] Agent IA connecté et fonctionnel
- [ ] IDE ouvert sur le bon projet
- [ ] Terminal prêt
```

### Créer la Branche

```bash
# S'assurer d'être à jour
git fetch origin
git checkout main
git pull

# Créer la branche de feature
git checkout -b feat/SPEC-042-task-filter
```

---

## Étape 2 : Exécuter le Cycle Prompt-Output-Review

### Structure d'un Bon Prompt

Un prompt efficace contient quatre éléments :

```markdown
## [Contexte]
Ce que l'agent doit savoir sur le projet, le fichier, la feature.

## [Tâche]
Ce que l'agent doit produire - soyez spécifique.

## [Contraintes]
Ce qu'il faut respecter ou éviter.

## [Output Attendu]
Le format et le contenu de la réponse souhaitée.
```

### Exemple Concret

```markdown
## Contexte
Application React + TypeScript. Fichier src/components/TaskList.tsx
affiche une liste de tâches. On utilise TanStack Query pour le fetching
et Tailwind CSS pour le style.

## Tâche
Ajouter un bouton "Supprimer" sur chaque tâche qui :
1. Affiche une icône poubelle
2. Demande confirmation au clic
3. Appelle DELETE /api/tasks/:id
4. Met à jour la liste avec optimistic update

## Contraintes
- Utiliser le composant Button existant avec variant="danger"
- Utiliser le composant ConfirmDialog du projet
- Gérer l'erreur avec un toast

## Output Attendu
Le code modifié de TaskList.tsx avec les imports nécessaires.
```

### Analyser l'Output

Après chaque génération, évaluez l'output :

| Résultat | Action |
|----------|--------|
| **Correct** | Tester → Committer → Passer à la suite |
| **Partiellement correct** | Identifier ce qui manque → Feedback précis → Nouvelle itération |
| **Incorrect** | Analyser pourquoi → Reformuler le prompt → Réessayer |

### Donner du Feedback Efficace

**Feedback vague (inefficace) :**
```
❌ "Ce n'est pas ce que je veux"
❌ "Il y a des erreurs"
❌ "Corrige ça"
```

**Feedback précis (efficace) :**
```
✅ "Le code ne gère pas le cas où la liste est vide.
    Ajoute un état empty avec le message 'Aucune tâche'."

✅ "Le type est incorrect ligne 15.
    TaskStatus devrait être 'todo' | 'done', pas string."

✅ "La fonction handleDelete est correcte mais il manque
    l'appel à invalidateQueries après la mutation."
```

---

## Étape 3 : Patterns de Prompting par Situation

### Pattern : Création de Composant

```markdown
## Contexte
Projet React + TypeScript + Tailwind.
Composants existants : Button, Input, Card (dans src/components/ui/).

## Tâche
Créer un composant TaskFilter qui affiche des checkboxes
pour filtrer par statut (todo, in_progress, done).

## Contraintes
- Props : selectedStatuses: string[], onChange: (statuses: string[]) => void
- Utiliser les composants UI existants
- Style cohérent avec le design system

## Output
Le fichier src/components/TaskFilter.tsx complet.
```

### Pattern : Modification de Code Existant

```markdown
## Code Actuel
```typescript
// src/components/TaskCard.tsx
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
2. Date d'échéance formatée ("dans 2 jours")

## Contraintes
- Garder la structure existante
- Utiliser date-fns pour le formatage
- Utiliser les classes Tailwind du projet
```

### Pattern : Correction de Bug

```markdown
## Bug
Le formulaire se soumet même quand il y a des erreurs de validation.

## Comportement Actuel
1. Remplir un email invalide
2. Cliquer "Envoyer"
3. Le formulaire se soumet quand même

## Comportement Attendu
Le formulaire ne doit pas se soumettre si la validation échoue.

## Code Concerné
```typescript
// TaskForm.tsx ligne 45-52
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const errors = validate(formData)
  setErrors(errors)
  onSubmit(formData)  // <- soumission inconditionnelle
}
```

## Fix Attendu
Vérifier qu'il n'y a pas d'erreurs avant d'appeler onSubmit.
```

### Pattern : Génération de Tests

```markdown
## Code à Tester
```typescript
// src/utils/filterTasks.ts
export function filterTasks(
  tasks: Task[],
  statuses: TaskStatus[]
): Task[] {
  if (statuses.length === 0) return tasks
  return tasks.filter(t => statuses.includes(t.status))
}
```

## Cas à Couvrir
1. Filtrer par un seul statut
2. Filtrer par plusieurs statuts
3. Retourner tout si filtre vide
4. Gérer une liste de tâches vide

## Contraintes
- Utiliser Vitest
- Pas de mock nécessaire
- Tests descriptifs en français
```

---

## Étape 4 : Gérer les Itérations

### Stratégie d'Affinement Progressif

Quand l'output est proche mais pas parfait :

```
Itération 1 : Output fonctionnel mais incomplet
      │
      ▼
Feedback : "Ajoute la gestion du cas d'erreur réseau"
      │
      ▼
Itération 2 : Gestion d'erreur ajoutée, mais message générique
      │
      ▼
Feedback : "Affiche le message d'erreur de l'API si disponible"
      │
      ▼
Itération 3 : Complet ✅
```

### Stratégie de Découpage

Quand l'output est trop complexe ou incorrect :

```
Prompt initial trop ambitieux → Output incorrect
      │
      ▼
Découper en sous-tâches plus simples
      │
      ├── "D'abord, crée juste l'interface TypeScript"
      │         → Output OK ✅
      │
      ├── "Maintenant, implémente la logique de base"
      │         → Output OK ✅
      │
      └── "Enfin, ajoute la gestion des erreurs"
                → Output OK ✅
```

### Quand Arrêter et Recommencer

| Signal d'Alerte | Action |
|-----------------|--------|
| 3+ itérations sans progrès | Reformuler complètement le prompt |
| L'agent ne comprend pas le contexte | Fournir plus de contexte ou un exemple concret |
| Output toujours hors sujet | Vérifier l'AGENT-GUIDE, simplifier la demande |
| Bug récurrent malgré les corrections | Écrire un test qui échoue, demander le fix |

---

## Étape 5 : Committer de Manière Atomique

### Règle d'Or

**Un commit = une tâche complète = un état fonctionnel**

### Format de Commit (Conventional Commits)

```bash
git commit -m "feat(tasks): add status filter component"
git commit -m "feat(tasks): implement filter logic in useTaskFilter hook"
git commit -m "test(tasks): add tests for filterTasks utility"
git commit -m "fix(tasks): handle empty filter case"
```

### Workflow de Commit

```bash
# 1. Vérifier ce qui a changé
git status
git diff

# 2. Vérifier que tout fonctionne
pnpm lint
pnpm typecheck
pnpm test

# 3. Ajouter et committer
git add src/components/TaskFilter.tsx
git commit -m "feat(tasks): add TaskFilter component"

# 4. Pousser régulièrement
git push origin feat/SPEC-042-task-filter
```

### Ne Pas Faire

```bash
# ❌ Commit de travail vague
git commit -m "WIP"
git commit -m "fix stuff"
git commit -m "updates"

# ❌ Gros commit avec tout
git commit -m "implement entire feature"
```

---

## Étape 6 : Valider les Points Intermédiaires

### Après Chaque Tâche

```markdown
## Validation Tâche #[X]

### Fonctionnel
- [ ] Le code fait ce qui est attendu
- [ ] Pas de régression visible

### Technique
- [ ] Lint passe
- [ ] Typecheck passe
- [ ] Tests passent (si existants)

### Commit
- [ ] Changements commités
- [ ] Message de commit descriptif
```

### Après une Série de Tâches

```markdown
## Point de Validation Intermédiaire

### Intégration
- [ ] Les composants fonctionnent ensemble
- [ ] Le parcours utilisateur est cohérent

### État du Code
- [ ] Pas de TODO laissés
- [ ] Pas de console.log oubliés
- [ ] Pas de code commenté

### Prochaine Étape
[Tâche suivante à exécuter]
```

---

## Template de Session d'Implémentation

```markdown
# Session - SPEC-[XXX] : [Titre]

## Préparation
- [x] Plan relu
- [x] Branche créée : feat/SPEC-XXX-description
- [x] Environnement prêt

## Exécution

### Tâche #1 : [Description]
**Prompt :** [Résumé du prompt utilisé]
**Itérations :** 1
**Résultat :** ✅
**Commit :** `abc1234` - feat(scope): description
**Notes :** -

### Tâche #2 : [Description]
**Prompt :** [Résumé]
**Itérations :** 2
**Résultat :** ✅
**Commit :** `def5678` - feat(scope): description
**Notes :** A nécessité une clarification sur le format de date

### Tâche #3 : [Description]
**Prompt :** [Résumé]
**Itérations :** 3
**Résultat :** ⚠️ (partiellement - TODO restant)
**Commit :** `ghi9012` - feat(scope): description
**Notes :** La gestion d'erreur réseau n'est pas complète,
            à finaliser avec l'API réelle

## Validation Finale
- [x] Tous les tests passent
- [x] Lint OK
- [x] Typecheck OK
- [ ] Point de validation #2 vérifié manuellement

## Observations pour la Rétro
- L'agent génère bien les hooks mais oublie souvent les types stricts
- Les prompts avec exemples de code donnent de meilleurs résultats
```

---

## Exemples Pratiques

### Exemple : Implémentation d'un Filtre

**Tâche :** Créer un hook de filtrage de tâches

**Session :**

```markdown
### Itération 1

**Prompt :**
Créer un hook useTaskFilter qui filtre les tâches par statut.
Input : tasks, selectedStatuses. Output : tâches filtrées.

**Output :** Hook créé mais sans mémo

**Feedback :** Ajoute useMemo pour éviter les recalculs inutiles

### Itération 2

**Output :** Hook avec useMemo, mais type any utilisé

**Feedback :** Remplace any par les types Task et TaskStatus

### Itération 3

**Output :** ✅ Correct

**Commit :** feat(tasks): add useTaskFilter hook with proper typing
```

### Exemple : Correction de Bug avec TDD

**Tâche :** Corriger un bug de soumission de formulaire

**Session :**

```markdown
### Itération 1

**Prompt :**
Écris un test qui vérifie que handleSubmit n'appelle pas
onSubmit quand il y a des erreurs de validation.

**Output :** Test écrit

### Itération 2

**Prompt :**
Le test échoue. Corrige handleSubmit pour qu'il vérifie
les erreurs avant d'appeler onSubmit.

**Output :** Fix appliqué, test passe ✅

**Commits :**
- test(form): add test for validation blocking submit
- fix(form): prevent submit when validation fails
```

---

## Anti-patterns

### "Le Copy-Paste Aveugle"

**Symptôme :** Coller l'output sans le lire ni le tester
```
❌ Agent génère → Coller → Passer à la suite
```

**Solution :**
```
✅ Agent génère → Lire le code → Tester → Comprendre → Commit
```

### "Le Prompt Roman"

**Symptôme :** Prompts de 500 mots avec trop de détails
```
❌ [Prompt interminable avec chaque détail imaginable]
```

**Solution :**
```
✅ Prompt concis avec le contexte nécessaire
✅ Ajouter du contexte seulement si l'output n'est pas bon
✅ Utiliser des exemples plutôt que des descriptions
```

### "L'Itération Infinie"

**Symptôme :** 10 itérations sur le même prompt sans progrès
```
❌ "Corrige" → "Non, corrige mieux" → "Toujours pas bon"...
```

**Solution :**
```
✅ Après 3 itérations sans succès : reformuler ou découper
✅ Écrire un test qui définit le comportement attendu
✅ Fournir un exemple de code similaire qui fonctionne
```

### "Le Big Bang Commit"

**Symptôme :** Un seul commit avec toute l'implémentation
```
❌ git commit -m "implement feature"  # 500 lignes changées
```

**Solution :**
```
✅ Commit après chaque tâche du plan
✅ Chaque commit laisse le code dans un état fonctionnel
✅ Facilite la review et le debugging
```

### "Le Contexte Perdu"

**Symptôme :** L'agent ne comprend plus le projet après plusieurs échanges
```
❌ "Tu as oublié qu'on utilise TypeScript"
```

**Solution :**
```
✅ Rappeler le contexte clé en début de prompt
✅ Référencer l'AGENT-GUIDE si l'agent dévie
✅ Inclure des extraits de code existant pour montrer les patterns
```

---

## Checklist de Fin de Session

```markdown
## Fin de Session - Checklist

### Code
- [ ] Toutes les tâches du plan exécutées
- [ ] Chaque tâche commitée séparément
- [ ] Pas de TODO non documenté
- [ ] Pas de console.log ou code debug

### Qualité
- [ ] pnpm lint passe
- [ ] pnpm typecheck passe
- [ ] pnpm test passe

### Git
- [ ] Tous les commits poussés
- [ ] Branche à jour avec origin

### Documentation
- [ ] Notes de session complétées
- [ ] Difficultés documentées pour la rétro

### Prochaine Étape
- [ ] Prêt pour VALIDER
- [ ] ou : Tâches restantes identifiées
```

---

*Annexes connexes : [C.2 Boucle PLANIFIER](C2-boucle-planifier.md) • [C.4 Boucle VALIDER](C4-boucle-valider.md) • [H.1 Prompts Efficaces](H1-prompts-efficaces.md) • [B.2 Product Engineer](B2-product-engineer.md)*
