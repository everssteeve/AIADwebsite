# H.5 Notes d'Apprentissage

## Pourquoi cette annexe ?

L'expérience collective accélère la progression individuelle. Cette annexe compile les learnings issus de projets AIAD réels, structurés pour être directement applicables. Chaque learning inclut le contexte, l'observation et l'action recommandée.

---

## Learnings sur les Agents IA

### L1 : Le Contexte Est Roi

**Contexte** : Équipe débutante avec AIAD, prompts génériques.

**Observation** : Les agents produisent du code de bien meilleure qualité quand ils ont du contexte spécifique au projet.

**Avant**
```
"Crée un composant de filtrage"
→ Output générique, ne suit pas les patterns du projet
→ 3-4 itérations pour obtenir quelque chose d'utilisable
```

**Après**
```
"Crée un composant de filtrage. Voici notre composant Button
existant, notre hook useQuery type, et nos conventions Tailwind."
→ Output cohérent avec l'existant dès la première itération
```

**Action** : Investir du temps dans l'AGENT-GUIDE est rentabilisé dès la 3ème SPEC. Un bon AGENT-GUIDE = des heures économisées sur chaque feature.

---

### L2 : Itérer Plutôt que Tout Refaire

**Contexte** : PE frustré par des outputs imparfaits.

**Observation** : Face à un output à 70% satisfaisant, itérer avec feedback précis est plus efficace que reformuler complètement.

**Avant (inefficace)**
```
Prompt 1 → Output pas bon → Nouveau prompt complètement différent
→ Output pas bon → Frustration → Temps perdu
```

**Après (efficace)**
```
Prompt 1 → Output 70% bon →
"Bien, mais corrige : 1) le type sur L15, 2) utilise notre Button"
→ Output 95% bon →
"Ajoute le cas où la liste est vide"
→ Output complet
```

**Action** : Considérer les agents comme des juniors talentueux : ils ont besoin de feedback précis, pas de tout recommencer à chaque erreur.

---

### L3 : Les Tests Comme Spécification

**Contexte** : Difficulté à obtenir des fonctions avec le comportement exact attendu.

**Observation** : Fournir des tests attendus produit du code plus précis que des descriptions textuelles.

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

**Action** : Pour les fonctions avec logique précise, écrire les tests d'abord et les inclure dans le prompt. L'agent implémente pour faire passer les tests.

---

### L4 : Le Context Window a une Limite

**Contexte** : Prompts très longs avec beaucoup de code.

**Observation** : Au-delà d'une certaine taille, la qualité des réponses se dégrade. L'agent "oublie" le début du contexte.

**Données**
| Taille contexte | Qualité output |
|-----------------|----------------|
| < 2000 tokens | Excellente |
| 2000-5000 tokens | Bonne |
| 5000-10000 tokens | Variable |
| > 10000 tokens | Dégradée |

**Action** : Garder les prompts focalisés. Pour les tâches complexes, découper en étapes plutôt que tout donner d'un coup.

---

## Learnings sur le Workflow

### L5 : SPECs Petites > SPECs Grosses

**Contexte** : Projet avec SPECs de tailles variées.

**Observation** : Les SPECs qui prennent plus de 3 jours ont un taux d'échec plus élevé et des cycles de feedback plus longs.

**Données**
| Taille SPEC | Taux 1ère validation | Cycle moyen |
|-------------|---------------------|-------------|
| < 1 jour | 90% | 1.2 jours |
| 1-3 jours | 75% | 2.8 jours |
| > 3 jours | 50% | 5.5 jours |

**Action** : Découper systématiquement les features en SPECs de 1-2 jours max. Une feature = plusieurs SPECs successives.

---

### L6 : Le DoOD Comme Contrat

**Contexte** : Discussions récurrentes sur "c'est fini ou pas".

**Observation** : Quand le DoOD est clair et respecté, les discussions sur la complétude disparaissent.

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

**Action** : Le DoOD doit être défini AVANT l'implémentation et jamais modifié après (sauf découverte majeure documentée).

---

### L7 : La Documentation Paie

**Contexte** : Équipe qui minimisait la documentation pour "aller plus vite".

**Observation** : Le temps "économisé" sur la documentation est perdu en onboarding, questions répétées et erreurs évitables.

**Données**
| Documentation | Temps onboarding | Questions/semaine |
|---------------|-----------------|-------------------|
| Minimale | 3 semaines | 15+ |
| Complète | 1 semaine | 2-3 |

**Action** : La documentation n'est pas optionnelle. AGENT-GUIDE, ARCHITECTURE et PRD sont des investissements, pas des coûts.

---

## Learnings Techniques

### L8 : Optimistic Updates Partout

**Contexte** : Application perçue comme "lente" malgré une API rapide.

**Observation** : L'UX est drastiquement meilleure avec des optimistic updates, et c'est plus simple qu'on ne le pense.

**Pattern**
```typescript
const deleteMutation = useMutation({
  mutationFn: (id) => api.delete(`/tasks/${id}`),
  onMutate: async (id) => {
    // Cancel in-flight queries
    await queryClient.cancelQueries(['tasks'])

    // Snapshot pour rollback
    const previous = queryClient.getQueryData(['tasks'])

    // Optimistic update
    queryClient.setQueryData(['tasks'], (old) =>
      old.filter((t) => t.id !== id)
    )

    return { previous }
  },
  onError: (_, __, context) => {
    // Rollback si erreur
    queryClient.setQueryData(['tasks'], context.previous)
    toast.error('Erreur de suppression')
  },
  onSettled: () => {
    queryClient.invalidateQueries(['tasks'])
  },
})
```

**Action** : Implémenter optimistic updates par défaut pour toutes les mutations. Documenter le pattern dans l'AGENT-GUIDE.

---

### L9 : Les Types Stricts Sauvent

**Contexte** : Projet avec TypeScript en mode permissif.

**Observation** : Les projets en TypeScript strict mode ont moins de bugs en production.

**Données**
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

**Action** : Strict mode dès le début du projet. Migrer un projet existant est douloureux mais rentable.

---

### L10 : Logs Structurés

**Contexte** : Debugging difficile en production.

**Observation** : Les logs non structurés sont inutilisables à grande échelle. Les logs JSON permettent de débugger efficacement.

**Avant**
```javascript
console.log('User logged in: ' + userId)
// Impossible à parser, filtrer, alerter
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

**Action** : Utiliser un logger structuré (pino, winston) dès le début. Définir une convention de logging dans l'AGENT-GUIDE.

---

## Learnings Humains

### L11 : La Review est du Mentoring

**Contexte** : Reviews perçues comme une corvée.

**Observation** : Les reviews qui expliquent "pourquoi" en plus de "quoi" accélèrent la montée en compétence de toute l'équipe.

**Review Pauvre**
```
"Change this to useMemo"
```

**Review Riche**
```
"Suggère d'utiliser useMemo ici car cette fonction est appelée
à chaque render mais le résultat ne change que quand `items`
change. Ça évite de recalculer inutilement.
Voir la doc : [lien]"
```

**Action** : Prendre 30 secondes de plus pour expliquer le "pourquoi". ROI énorme sur la montée en compétence.

---

### L12 : Célébrer les Petites Victoires

**Contexte** : Équipe focalisée uniquement sur les problèmes.

**Observation** : Les équipes qui célèbrent les livrables (même petits) ont un meilleur moral et une meilleure rétention.

**Exemples**
- Message dans le channel après chaque feature mergée
- Demo hebdo même pour les petites choses
- "Wins of the week" en rétrospective
- Mention des contributions individuelles

**Action** : Institutionnaliser la célébration des livrables. C'est gratuit et ça change tout.

---

### L13 : Les Erreurs Sont des Learnings

**Contexte** : Incident de production ayant causé un downtime.

**Observation** : Les équipes qui font des post-mortems sans blâme progressent plus vite que celles qui cherchent un coupable.

**Template Post-Mortem**
```markdown
## Incident : [Description]

### Timeline
[Ce qui s'est passé, heure par heure]

### Impact
[Utilisateurs affectés, durée, conséquences]

### Cause Racine
[Pourquoi c'est arrivé - système, pas personne]

### Ce qu'on a Appris
[Insight principal]

### Actions Préventives
[Ce qu'on change pour éviter que ça se reproduise]
```

**Action** : Chaque incident significatif = post-mortem blameless dans les 48h.

---

### L14 : L'Async par Défaut

**Contexte** : Équipe avec beaucoup de réunions.

**Observation** : Les équipes qui utilisent plus de communication asynchrone (docs, commentaires PR, threads) sont plus productives.

**Pattern**
```
1. SPEC écrite et partagée (async)
2. Commentaires et questions (async)
3. Clarification rapide si besoin (sync 10 min max)
4. Implémentation (async)
5. Review (async)
6. Questions rapides (sync si bloqué)
```

**Action** : Réserver le synchrone pour les décisions complexes et le débloquage urgent. Tout le reste peut être async avec un bon processus.

---

## Template Note d'Apprentissage

Pour capitaliser vos propres learnings :

```markdown
# Learning : [Titre Court]

**Date** : [YYYY-MM-DD]
**Auteur** : [Nom]
**Projet** : [Nom du projet]

## Contexte
[Situation où on a appris ça - 1-2 phrases]

## Observation
[Ce qu'on a constaté - factuel]

## Données
[Métriques si disponibles, sinon exemples concrets]

## Avant/Après
[Comparaison concrète du changement]

## Action Recommandée
[Ce qu'on recommande de faire - actionnable]

## Tags
#agents #workflow #technique #humain #[autre]
```

---

## Exemples Pratiques

### Capitalisation en Équipe

```markdown
## Processus de Capitalisation

1. Chaque incident/découverte → Note d'apprentissage
2. Review en rétro mensuelle
3. Les meilleurs learnings → AGENT-GUIDE ou docs
4. Partage cross-équipes trimestriel
```

### Catégorisation

| Tag | Type de Learning |
|-----|-----------------|
| #agents | Prompting, comportement agents |
| #workflow | Process, rituels, organisation |
| #technique | Code, architecture, outils |
| #humain | Collaboration, communication |

---

## Anti-patterns

| Anti-pattern | Pourquoi | Alternative |
|--------------|----------|-------------|
| Garder les learnings pour soi | Équipe ne progresse pas | Partager systématiquement |
| Ne documenter que les échecs | Vision négative | Documenter aussi les succès |
| Documentation trop longue | Personne ne lit | Format standardisé, concis |
| Pas de suivi des actions | Learnings inutiles | Actions trackées et suivies |

---

## Checklist

```markdown
## Capitalisation d'un Learning

### Capture
- [ ] Contexte clairement décrit
- [ ] Observation factuelle (pas d'opinion)
- [ ] Données ou exemples concrets

### Format
- [ ] Template standard utilisé
- [ ] Longueur raisonnable (< 1 page)
- [ ] Tags appropriés

### Partage
- [ ] Partagé avec l'équipe
- [ ] Action recommandée claire
- [ ] Intégré dans la documentation si pertinent
```

---

## Résumé

| Catégorie | Learnings Clés |
|-----------|----------------|
| **Agents** | Contexte, itération, tests comme spec |
| **Workflow** | SPECs petites, DoOD strict, documentation |
| **Technique** | Optimistic updates, strict mode, logs structurés |
| **Humain** | Review = mentoring, célébration, async par défaut |

---

*Liens connexes : [H.1 Prompts Efficaces](H1-prompts-efficaces.md) · [H.3 Anti-patterns](H3-anti-patterns.md) · [D.4 Rétrospective](D4-retrospective.md)*
