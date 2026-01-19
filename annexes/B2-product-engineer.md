# B.2 Détails Product Engineer

## Pourquoi cette annexe ?

Cette annexe détaille le workflow quotidien du Product Engineer, le rôle central dans AIAD. Elle fournit des patterns d'orchestration des agents IA, des exemples de prompts efficaces et des situations concrètes.

---

## Workflow Quotidien Type

### Début de Journée (15-30 min)

```markdown
1. Revue du contexte
   - Lire les derniers commits/PRs
   - Vérifier les résultats de CI
   - Consulter les messages d'équipe

2. Sélection de la SPEC
   - Choisir la SPEC prioritaire "Ready"
   - Relire les critères d'acceptation
   - Identifier les questions en suspens

3. Préparation de l'environnement
   - S'assurer que l'AGENT-GUIDE est à jour
   - Ouvrir les fichiers de contexte pertinents
   - Lancer le serveur de dev si nécessaire
```

### Session de Travail (2-4h)

```markdown
1. Décomposition
   - Découper la SPEC en tâches atomiques
   - Identifier l'ordre optimal d'exécution
   - Anticiper les points de validation

2. Orchestration des Agents
   - Donner le contexte nécessaire
   - Itérer sur les outputs
   - Valider à chaque étape

3. Intégration Continue
   - Commits atomiques réguliers
   - Tests après chaque changement significatif
   - Review partielle si doute
```

### Fin de Session

```markdown
1. État des lieux
   - Documenter où on en est
   - Lister les points en suspens
   - Mettre à jour le statut de la SPEC

2. Préparation pour la suite
   - Commit WIP si nécessaire
   - Notes pour la prochaine session
```

---

## Patterns d'Orchestration

### Pattern 1 : Contexte → Tâche → Validation

Le pattern de base pour toute interaction avec un agent.

```
┌─────────────────────────────────────────────┐
│ 1. CONTEXTE                                 │
│    - Fichiers pertinents                    │
│    - Contraintes et conventions             │
│    - Ce qui a déjà été fait                 │
├─────────────────────────────────────────────┤
│ 2. TÂCHE                                    │
│    - Objectif clair et spécifique           │
│    - Critères de succès                     │
│    - Limites (ce qu'il ne faut pas faire)   │
├─────────────────────────────────────────────┤
│ 3. VALIDATION                               │
│    - Relire l'output                        │
│    - Tester le code                         │
│    - Itérer si nécessaire                   │
└─────────────────────────────────────────────┘
```

**Exemple :**
```markdown
## Contexte
Je travaille sur une app React + TypeScript. Le fichier TaskList.tsx
affiche une liste de tâches. On utilise TanStack Query pour le data fetching
et Tailwind pour le styling.

## Tâche
Ajouter un bouton "Marquer comme fait" sur chaque item de la liste.
Le bouton doit :
- Appeler l'API PATCH /tasks/:id avec { status: "done" }
- Optimistic update (UI immédiate, rollback si erreur)
- Être désactivé pendant le chargement

## Contraintes
- Suivre les patterns existants dans le fichier
- Réutiliser les composants Button existants
- Ne pas modifier la structure de données actuelle
```

### Pattern 2 : Exploration → Décision → Implémentation

Pour les tâches où le "comment" n'est pas évident.

```markdown
## Étape 1 : Exploration
"Analyse le code actuel de gestion des erreurs dans /src/lib/errors.ts
et /src/hooks/useApi.ts. Résume les patterns utilisés."

[L'agent analyse et résume]

## Étape 2 : Décision
"Voici les options pour gérer les erreurs de notre nouvelle feature :
A) Utiliser le pattern existant ErrorBoundary
B) Créer un hook useErrorHandler spécifique
C) Gérer inline dans le composant

Je choisis l'option A car [raison]."

## Étape 3 : Implémentation
"Implémente la gestion d'erreur avec ErrorBoundary selon le pattern
existant. Voici la spécification : [...]"
```

### Pattern 3 : Test-First

Écrire les tests avant le code pour guider l'agent.

```markdown
## Étape 1 : Écrire le test
"Écris les tests unitaires pour une fonction `filterTasksByStatus(tasks, statuses)`
qui filtre un tableau de tâches selon les statuts sélectionnés.

Cas à tester :
- Filtre par un seul statut
- Filtre par plusieurs statuts
- Retourne tout si statuses est vide
- Gère un tableau de tâches vide"

## Étape 2 : Implémenter pour passer les tests
"Maintenant implémente la fonction filterTasksByStatus pour faire
passer tous les tests."
```

### Pattern 4 : Refactoring Progressif

Pour les modifications de code existant complexe.

```markdown
## Étape 1 : Comprendre
"Explique-moi ce que fait ce code et identifie les problèmes potentiels :
[code actuel]"

## Étape 2 : Plan
"Propose un plan de refactoring en étapes, où chaque étape
garde le code fonctionnel."

## Étape 3 : Exécuter étape par étape
"Implémente l'étape 1 du plan : [description]"
[Tester]
"Implémente l'étape 2 du plan : [description]"
[Tester]
...
```

---

## Prompts Efficaces

### Structure d'un Bon Prompt

```markdown
[CONTEXTE en 2-3 lignes]
[OBJECTIF précis]
[CONTRAINTES ou précisions]
[OUTPUT attendu]
```

### Exemples par Situation

#### Ajouter une Feature

```markdown
Dans notre app Next.js, les utilisateurs peuvent créer des projets.
Actuellement, il n'y a pas de limite.

Ajoute une limite de 5 projets par utilisateur gratuit.
- Vérification côté API (POST /projects)
- Message d'erreur explicite avec lien vers upgrade
- Réutilise le composant Alert existant pour l'UI

Le comportement exact est dans SPEC-042.
```

#### Corriger un Bug

```markdown
Bug : le bouton "Sauvegarder" reste disabled après une erreur
même quand l'utilisateur corrige le formulaire.

Fichier : src/components/TaskForm.tsx
Reproduction :
1. Remplir le formulaire avec un titre > 100 chars
2. Soumettre → erreur affichée
3. Corriger le titre
4. Le bouton reste grisé (bug)

Trouve et corrige la cause. Le bouton doit se réactiver
dès que le formulaire redevient valide.
```

#### Écrire des Tests

```markdown
Le hook useTaskFilters dans src/hooks/useTaskFilters.ts
n'a pas de tests.

Écris des tests unitaires avec Vitest qui couvrent :
- Initialisation avec filtres vides
- Toggle d'un statut
- Toggle de plusieurs statuts
- Reset des filtres
- Cas limite : statut invalide ignoré

Suis la structure de tests existante dans le projet.
```

#### Review de Code

```markdown
Review ce code comme si c'était une PR.
Identifie :
- Bugs potentiels
- Problèmes de performance
- Violations des conventions du projet
- Améliorations de lisibilité

Sois concis, priorise les vrais problèmes.

[code]
```

---

## Gestion des Itérations

### Quand l'Output n'est Pas Bon

```markdown
## Feedback Constructif

❌ "C'est pas bon, refais"
✅ "Le code fonctionne mais ne suit pas notre convention.
    Dans notre projet, on utilise [pattern]. Refais en utilisant
    ce pattern, comme dans [fichier exemple]."

❌ "Y'a un bug"
✅ "Quand je teste avec [input], j'obtiens [output actuel]
    au lieu de [output attendu]. Le problème semble venir de [zone]."
```

### Affiner Progressivement

```markdown
## Itération 1
"Implémente la feature X"
→ Output : fonctionne mais code trop complexe

## Itération 2
"Le code fonctionne mais est difficile à lire.
Simplifie en :
- Extrayant la logique de validation dans une fonction séparée
- Utilisant les helpers existants de date-utils.ts"
→ Output : plus simple mais manque un cas

## Itération 3
"Bien, mais il manque le cas où [edge case].
Ajoute la gestion de ce cas avec un test."
→ Output : complet
```

---

## Collaboration avec les Agents Spécialisés

### Agent Code (Principal)

**Usage** : Implémentation, modification, génération de code
```
PE → Agent Code : "Implémente cette feature selon la spec"
Agent Code → PE : Code généré
PE : Review, test, itère
```

### Agent QA

**Usage** : Génération de tests, identification de cas limites
```
PE → Agent QA : "Génère des tests pour cette fonction"
Agent QA → PE : Suite de tests
PE : Exécute, ajoute les tests manquants
```

### Agent Code Review

**Usage** : Review automatisée avant merge
```
PE → Agent Review : "Review cette PR"
Agent Review → PE : Liste de points à vérifier
PE : Adresse les points critiques
```

### Agent Documentation

**Usage** : Génération/mise à jour de documentation
```
PE → Agent Doc : "Documente cette nouvelle API"
Agent Doc → PE : Documentation générée
PE : Vérifie l'exactitude, intègre
```

---

## Anti-patterns du Product Engineer

### 1. "Le PE Copy-Paste"

**Symptôme** : Accepter l'output de l'agent sans review
```
❌ Agent génère du code → Commit direct
```

**Impact** : Bugs, dette technique, code incohérent

**Solution** : Toujours relire et tester
```
✅ Agent génère du code → Review → Test → Itération si nécessaire → Commit
```

### 2. "Le PE Micromanager"

**Symptôme** : Instructions trop détaillées ligne par ligne
```
❌ "Ligne 1 : const x = 1; Ligne 2 : const y = 2; ..."
```

**Impact** : Perte de temps, agents sous-utilisés

**Solution** : Donner l'objectif, laisser l'agent trouver le chemin
```
✅ "Implémente [feature] en suivant le pattern de [fichier exemple]"
```

### 3. "Le PE Sans Contexte"

**Symptôme** : Prompts vagues sans référence au projet
```
❌ "Ajoute un bouton de suppression"
```

**Impact** : Output générique, pas intégré au projet

**Solution** : Toujours donner le contexte projet
```
✅ "Dans TaskCard.tsx, ajoute un bouton de suppression.
    Utilise notre composant Button avec variant='danger'.
    L'API est DELETE /tasks/:id."
```

### 4. "Le PE Tunnel Vision"

**Symptôme** : Focus sur la tâche sans considérer l'impact
```
❌ Ajouter une feature sans vérifier les régressions
```

**Impact** : Bugs en production, dette technique

**Solution** : Toujours tester l'ensemble
```
✅ Après chaque changement : run tests, vérifier les pages liées
```

---

## Checklist Quotidienne

```markdown
## Début de session
- [ ] AGENT-GUIDE à jour ?
- [ ] Contexte de la SPEC compris ?
- [ ] Environnement de dev fonctionnel ?

## Pendant le travail
- [ ] Commits atomiques et réguliers ?
- [ ] Tests après chaque changement significatif ?
- [ ] Code reviewé avant de passer à la suite ?

## Fin de session
- [ ] Tous les tests passent ?
- [ ] Code poussé (pas de travail local non sauvegardé) ?
- [ ] Statut de la SPEC mis à jour ?
- [ ] Notes pour la prochaine session si WIP ?
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
