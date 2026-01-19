# H.5 Notes d'Apprentissage

## Pourquoi cette annexe ?

Cette annexe compile des learnings issus de projets réels utilisant AIAD, pour raccourcir la courbe d'apprentissage des nouvelles équipes.

---

## Learnings sur les Agents IA

### L1 : Le Contexte est Roi

**Observation**
Les agents produisent du code de bien meilleure qualité quand ils ont
du contexte spécifique au projet.

**Avant (mauvais)**
```
"Crée un composant de filtrage"
→ Output générique, ne suit pas les patterns du projet
```

**Après (bon)**
```
"Crée un composant de filtrage. Voici notre composant Button existant,
notre hook useQuery type, et nos conventions de style Tailwind."
→ Output cohérent avec l'existant
```

**Action**
Investir du temps dans l'AGENT-GUIDE est rentabilisé rapidement.
Un bon AGENT-GUIDE = des heures économisées sur chaque feature.

---

### L2 : Itérer Plutôt que Tout Refaire

**Observation**
Face à un output imparfait, il est plus efficace d'itérer avec feedback
que de reformuler complètement.

**Avant (inefficace)**
```
Prompt 1 → Output pas bon → Nouveau prompt complètement différent
→ Output pas bon → Frustration
```

**Après (efficace)**
```
Prompt 1 → Output 70% bon →
"Bien, mais corrige : 1) le type sur L15, 2) utilise notre Button"
→ Output 95% bon →
"Ajoute le cas où la liste est vide"
→ Output complet
```

**Action**
Considérer les agents comme des juniors talentueux : ils ont besoin
de feedback précis, pas de tout recommencer à chaque erreur.

---

### L3 : Les Tests Comme Spécification

**Observation**
Fournir des tests attendus produit du code plus précis que des
descriptions textuelles.

**Exemple**
```markdown
## Prompt Efficace

Implémente `filterByStatus` pour que ces tests passent :

```typescript
it('returns all when status empty', () => {
  expect(filterByStatus(tasks, [])).toEqual(tasks)
})

it('filters by single status', () => {
  expect(filterByStatus(tasks, ['todo'])).toEqual([task1, task3])
})
```

Les tests définissent le comportement exact.
```

**Action**
Pour les fonctions avec logique précise, écrire les tests d'abord
et les inclure dans le prompt.

---

## Learnings sur le Workflow

### L4 : SPECs Petites > SPECs Grosses

**Observation**
Les SPECs qui prennent plus de 3 jours ont un taux d'échec plus élevé
et des cycles de feedback plus longs.

**Données Projet X**
| Taille SPEC | Taux 1ère validation | Cycle moyen |
|-------------|---------------------|-------------|
| < 1 jour | 90% | 1.2j |
| 1-3 jours | 75% | 2.8j |
| > 3 jours | 50% | 5.5j |

**Action**
Découper systématiquement les features en SPECs de 1-2 jours max.
Une feature = plusieurs SPECs successives.

---

### L5 : Le DoOD Comme Contrat

**Observation**
Quand le DoOD est clair et respecté, les discussions sur "c'est fini ou pas"
disparaissent.

**Avant**
```
PE : "C'est fait"
QA : "Il manque le cas d'erreur"
PE : "Ce n'était pas dans la spec"
QA : "C'est évident pourtant"
→ Frustration, retravail
```

**Après**
```
DoOD :
- [ ] Cas d'erreur géré
- [ ] Test du cas d'erreur

PE : Checklist complète ✅
QA : Vérifie la checklist ✅
→ Pas de surprise
```

**Action**
Le DoOD doit être défini AVANT l'implémentation et jamais modifié après
(sauf découverte majeure documentée).

---

### L6 : La Sync Async > Les Meetings

**Observation**
Les équipes qui utilisent plus de communication asynchrone
(docs, commentaires PR, threads Slack) sont plus productives.

**Pattern Efficace**
```
1. SPEC écrite et partagée (async)
2. Commentaires et questions (async)
3. Clarification rapide si besoin (sync 10 min)
4. Implémentation (async)
5. Review (async)
6. Questions rapides (sync si bloqué)
```

**Action**
Réserver le synchrone pour les décisions complexes et le débloquage.
Tout le reste peut être async avec un bon processus.

---

## Learnings Techniques

### L7 : Optimistic Updates Partout

**Observation**
L'UX est drastiquement meilleure avec des optimistic updates,
et c'est plus simple qu'on ne le pense avec TanStack Query.

**Pattern**
```typescript
const deleteMutation = useMutation({
  mutationFn: (id) => api.delete(`/tasks/${id}`),
  onMutate: async (id) => {
    // Cancel in-flight queries
    await queryClient.cancelQueries(['tasks'])

    // Snapshot
    const previous = queryClient.getQueryData(['tasks'])

    // Optimistic update
    queryClient.setQueryData(['tasks'], (old) =>
      old.filter((t) => t.id !== id)
    )

    return { previous }
  },
  onError: (_, __, context) => {
    // Rollback
    queryClient.setQueryData(['tasks'], context.previous)
    toast.error('Erreur de suppression')
  },
  onSettled: () => {
    queryClient.invalidateQueries(['tasks'])
  },
})
```

**Action**
Implémenter optimistic updates par défaut pour toutes les mutations.

---

### L8 : Les Types Stricts Sauvent

**Observation**
Les projets en TypeScript strict mode ont moins de bugs en production.

**Données Projet Y**
| Mode | Bugs/mois (prod) | Temps debug |
|------|------------------|-------------|
| any autorisé | 12 | 15h |
| strict mode | 3 | 4h |

**Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

**Action**
Strict mode dès le début. Migrer un projet existant est douloureux.

---

### L9 : Logs Structurés

**Observation**
Les logs non structurés sont inutiles en production. Les logs JSON
permettent de débugger efficacement.

**Avant**
```
console.log('User logged in: ' + userId)
// Impossible à parser, à filtrer, à alerter
```

**Après**
```typescript
logger.info('User logged in', {
  userId,
  method: 'password',
  ip: req.ip,
  duration: loginDuration,
})
// Filtrable, alertable, dashboardable
```

**Action**
Utiliser un logger structuré (pino, winston) dès le début.

---

## Learnings Humains

### L10 : La Review est du Mentoring

**Observation**
Les reviews qui expliquent "pourquoi" en plus de "quoi" accélèrent
la montée en compétence.

**Review Pauvre**
```
"Change this to useMemo"
```

**Review Riche**
```
"Suggère d'utiliser useMemo ici car cette fonction est appelée
à chaque render mais le résultat ne change que quand `items`
change. Ça évite de recalculer inutilement. Voir la doc :
[lien]"
```

**Action**
Prendre 30 secondes de plus pour expliquer le "pourquoi".
ROI énorme sur la montée en compétence.

---

### L11 : Célébrer les Petites Victoires

**Observation**
Les équipes qui célèbrent les livrables (même petits) ont
un meilleur moral et une meilleure rétention.

**Exemples**
- Message dans le channel après chaque feature mergée
- Demo hebdo même pour les petites choses
- "Wins of the week" en rétro

**Action**
Institutionnaliser la célébration des livrables.

---

### L12 : Les Erreurs Sont des Learnings

**Observation**
Les équipes qui font des post-mortems sans blâme progressent plus vite.

**Pattern Post-Mortem**
```markdown
## Incident : [Description]

### Timeline
[Ce qui s'est passé]

### Impact
[Utilisateurs affectés, durée]

### Cause Racine
[Pourquoi c'est arrivé - système, pas personne]

### Ce qu'on a Appris
[Insight]

### Actions Préventives
[Ce qu'on change pour éviter que ça se reproduise]
```

**Action**
Chaque incident significatif = post-mortem blameless.

---

## Template Note d'Apprentissage

```markdown
# Learning : [Titre Court]

## Contexte
[Situation où on a appris ça]

## Observation
[Ce qu'on a constaté]

## Données
[Métriques si disponibles]

## Avant/Après
[Comparaison concrète]

## Action Recommandée
[Ce qu'on recommande de faire]

## Tags
[#agents #workflow #technique #humain]
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
