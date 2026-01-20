# B.2 Product Engineer

## Pourquoi cette annexe ?

Le Product Engineer est le rôle central d'AIAD : il orchestre les agents IA pour transformer les specs en code fonctionnel. Cette annexe détaille le workflow quotidien, les techniques de prompting, et la progression de compétence du débutant à l'expert.

---

## Workflow Quotidien

### Structure d'une Journée Type

```
08:30 ─── PRÉPARATION (30 min) ───────────────────────────────
         │
         ├── Lire les derniers commits et résultats CI
         ├── Vérifier les messages d'équipe
         └── Sélectionner la SPEC prioritaire "Ready"
         │
09:00 ─── SESSION DE TRAVAIL #1 (2-3h) ───────────────────────
         │
         ├── Décomposer la SPEC en tâches atomiques
         ├── Orchestrer les agents (Contexte → Tâche → Validation)
         ├── Commits atomiques après chaque étape validée
         └── Tests après chaque changement significatif
         │
12:00 ─── PAUSE ──────────────────────────────────────────────
         │
13:00 ─── SESSION DE TRAVAIL #2 (2-3h) ───────────────────────
         │
         ├── Continuer l'implémentation
         ├── Review et itération sur les outputs
         └── Intégration et tests
         │
16:00 ─── CLÔTURE (30 min) ───────────────────────────────────
         │
         ├── Tous les tests passent ?
         ├── Code poussé (pas de WIP local)
         ├── Statut SPEC mis à jour
         └── Notes pour demain si WIP
```

### Checklist de Session

```markdown
## Début de Session
- [ ] AGENT-GUIDE ouvert et à jour ?
- [ ] SPEC relue avec critères d'acceptation ?
- [ ] Environnement de dev fonctionnel (serveur, tests) ?
- [ ] Contexte clair pour les agents ?

## Pendant le Travail
- [ ] Commits atomiques réguliers (1 commit = 1 changement logique)
- [ ] Tests après chaque changement significatif
- [ ] Output de l'agent reviewé avant intégration
- [ ] Questions au PM si ambiguïté business

## Fin de Session
- [ ] Tous les tests passent ?
- [ ] Code poussé sur la branche ?
- [ ] Statut SPEC mis à jour ?
- [ ] Notes pour prochaine session si incomplet ?
```

---

## Pattern Principal : Contexte → Tâche → Validation

Le pattern de base pour toute interaction avec un agent IA.

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CONTEXTE                                                 │
│    • Fichiers pertinents du projet                          │
│    • Conventions et patterns à suivre                       │
│    • Ce qui a déjà été fait                                 │
├─────────────────────────────────────────────────────────────┤
│ 2. TÂCHE                                                    │
│    • Objectif clair et spécifique                           │
│    • Critères de succès mesurables                          │
│    • Limites explicites (ce qu'il ne faut PAS faire)        │
├─────────────────────────────────────────────────────────────┤
│ 3. VALIDATION                                               │
│    • Relire l'output (comprendre, pas juste copier)         │
│    • Tester le code généré                                  │
│    • Itérer si nécessaire                                   │
└─────────────────────────────────────────────────────────────┘
```

### Exemple Concret

```markdown
## Contexte
App React + TypeScript. Le fichier TaskList.tsx affiche une liste de tâches.
On utilise TanStack Query pour le data fetching et Tailwind pour le styling.
Voir le pattern dans src/components/UserList.tsx pour référence.

## Tâche
Ajouter un bouton "Marquer comme fait" sur chaque item de la liste.
Le bouton doit :
- Appeler l'API PATCH /tasks/:id avec { status: "done" }
- Optimistic update (UI immédiate, rollback si erreur)
- Être désactivé pendant le loading

## Contraintes
- Suivre les patterns existants de TaskList.tsx
- Réutiliser le composant Button du design system
- Ne pas modifier la structure de données Task
```

---

## Patterns d'Orchestration Avancés

### Pattern 1 : Exploration → Décision → Implémentation

Pour les tâches où le "comment" n'est pas évident.

```markdown
## Étape 1 : Exploration
"Analyse le code actuel de gestion des erreurs dans src/lib/errors.ts
et src/hooks/useApi.ts. Résume les patterns utilisés."

→ [L'agent analyse et résume]

## Étape 2 : Décision (PE décide, pas l'agent)
Options identifiées :
A) Utiliser ErrorBoundary existant
B) Créer un hook useErrorHandler
C) Gérer inline dans le composant

→ Je choisis A car cohérent avec l'existant.

## Étape 3 : Implémentation
"Implémente la gestion d'erreur avec ErrorBoundary
selon le pattern de src/components/UserSection.tsx."
```

### Pattern 2 : Test-First

Écrire les tests avant le code pour guider l'agent.

```markdown
## Étape 1 : Écrire le test
"Écris les tests unitaires pour une fonction filterTasksByStatus(tasks, statuses)
qui filtre un tableau de tâches selon les statuts sélectionnés.

Cas à tester :
- Filtre par un seul statut → retourne uniquement ce statut
- Filtre par plusieurs statuts → retourne tous les statuts demandés
- statuses vide → retourne tout
- tasks vide → retourne []"

## Étape 2 : Implémenter
"Implémente filterTasksByStatus pour faire passer tous les tests."
```

### Pattern 3 : Refactoring Progressif

Pour les modifications de code existant complexe.

```markdown
## Étape 1 : Comprendre
"Explique ce que fait ce code et identifie les problèmes potentiels :
[code actuel]"

## Étape 2 : Planifier
"Propose un plan de refactoring en étapes, où chaque étape
garde le code fonctionnel et les tests passants."

## Étape 3 : Exécuter pas à pas
"Implémente l'étape 1 : [description]"
→ Tester
"Implémente l'étape 2 : [description]"
→ Tester
...
```

### Pattern 4 : Décomposition en Couches

Pour les features qui touchent plusieurs couches.

```markdown
## Couche 1 : Données
"Ajoute le type TypeScript et le schéma Zod pour TaskFilter.
Voir le pattern dans src/types/user.ts."

→ Valider, commit

## Couche 2 : API/Logic
"Crée le hook useTaskFilters qui gère le state des filtres.
Voir le pattern dans src/hooks/useUserFilters.ts."

→ Valider, commit

## Couche 3 : UI
"Crée le composant TaskFilters qui utilise useTaskFilters.
Voir le pattern dans src/components/UserFilters.tsx."

→ Valider, commit
```

---

## Exemples de Prompts par Situation

### Ajouter une Feature

```markdown
Dans notre app Next.js, les utilisateurs peuvent créer des projets.
Actuellement, il n'y a pas de limite.

Ajoute une limite de 5 projets par utilisateur gratuit :
- Vérification côté API (POST /projects) avant création
- Retourner erreur 403 avec message explicite si limite atteinte
- Côté UI, afficher une Alert avec lien vers upgrade
- Réutiliser le composant Alert de src/components/ui

Voir la logique de vérification similaire dans src/api/teams.ts.
```

### Corriger un Bug

```markdown
Bug : le bouton "Sauvegarder" reste disabled après une erreur
même quand l'utilisateur corrige le formulaire.

Fichier : src/components/TaskForm.tsx

Reproduction :
1. Remplir le formulaire avec titre > 100 chars
2. Soumettre → erreur affichée (correct)
3. Corriger le titre (< 100 chars)
4. Bouton reste grisé (BUG)

Trouve la cause et corrige. Le bouton doit se réactiver
dès que le formulaire redevient valide.
```

### Écrire des Tests

```markdown
Le hook useTaskFilters (src/hooks/useTaskFilters.ts) n'a pas de tests.

Écris des tests unitaires avec Vitest couvrant :
- Initialisation avec filtres vides
- Toggle d'un statut unique
- Toggle de plusieurs statuts
- Reset des filtres
- Edge case : statut invalide ignoré silencieusement

Suis la structure de tests/hooks/useUserFilters.test.ts.
```

### Review de Code

```markdown
Review ce code comme une PR. Identifie :
- Bugs potentiels
- Problèmes de performance
- Violations des patterns du projet (voir AGENT-GUIDE)
- Améliorations de lisibilité

Priorise les vrais problèmes. Ignore le cosmétique.

[code]
```

---

## Gestion des Itérations

### Quand l'Output n'est Pas Bon

| Situation | ❌ Feedback Inefficace | ✅ Feedback Efficace |
|-----------|------------------------|----------------------|
| Code incorrect | "C'est pas bon, refais" | "Quand je teste avec X, j'obtiens Y au lieu de Z. Le problème semble être dans [zone]." |
| Mauvais pattern | "Utilise pas ça" | "Dans notre projet, on utilise [pattern]. Voir [fichier exemple]." |
| Incomplet | "Il manque des trucs" | "Il manque : 1) cas null, 2) validation input, 3) test du edge case X" |

### Itération Constructive

```markdown
## Itération 1
Prompt : "Implémente la feature X"
Output : Fonctionne mais code complexe

## Itération 2
"Le code fonctionne mais est difficile à lire.
Simplifie en :
- Extrayant la logique de validation dans validateTask()
- Utilisant les helpers de src/lib/date-utils.ts
- Réduisant les niveaux d'imbrication"
Output : Plus simple mais manque un cas

## Itération 3
"Bien. Ajoute la gestion du cas où task.assignee est null.
Dans ce cas, afficher 'Non assigné' au lieu de crasher."
Output : Complet ✓
```

---

## Collaboration avec les Agents Spécialisés

| Agent | Quand l'Utiliser | Comment l'Utiliser |
|-------|------------------|-------------------|
| **Agent Principal** | Implémentation code | Contexte → Tâche → Validation |
| **Agent QA** | Génération de tests | "Génère les tests pour [fonction]" |
| **Agent Review** | Pré-review avant PR | "Review cette PR, focus sur [X]" |
| **Agent Doc** | Documentation | "Documente cette API en suivant [template]" |

### Workflow Multi-Agents

```
SPEC Ready
    │
    ▼
[Agent Principal] ──► Code généré
    │
    ▼
[PE Review] ──► Validé ? ──Non──► [Agent Principal] itération
    │
   Oui
    │
    ▼
[Agent QA] ──► Tests générés
    │
    ▼
[PE Exécute Tests] ──► Passent ? ──Non──► Fix
    │
   Oui
    │
    ▼
[Agent Review] ──► Points à vérifier
    │
    ▼
[PE Adresse Points] ──► PR Ready
```

---

## Anti-patterns

### 1. Le PE Copy-Paste

**Symptôme** : Accepter l'output de l'agent sans review.

```
❌ Agent génère → Commit direct → Bug en prod
```

**Impact** : Bugs, dette technique, code incohérent, responsabilité non assumée.

**Correction** :
```
✅ Agent génère → Lire et comprendre → Tester → Itérer si besoin → Commit
```

### 2. Le PE Micromanager

**Symptôme** : Instructions trop détaillées, ligne par ligne.

```
❌ "Ligne 1 : const x = 1; Ligne 2 : const y = 2; Ligne 3 : return x + y;"
```

**Impact** : Agent sous-utilisé, plus lent qu'écrire soi-même.

**Correction** :
```
✅ "Crée une fonction qui calcule X en suivant le pattern de [fichier]"
```

### 3. Le PE Sans Contexte

**Symptôme** : Prompts vagues sans référence au projet.

```
❌ "Ajoute un bouton de suppression"
```

**Impact** : Output générique, non intégré au projet, incohérent.

**Correction** :
```
✅ "Dans TaskCard.tsx, ajoute un bouton de suppression.
   Utilise notre Button avec variant='danger'.
   L'API est DELETE /tasks/:id.
   Voir le pattern dans UserCard.tsx."
```

### 4. Le PE Tunnel Vision

**Symptôme** : Focus sur la tâche sans considérer l'impact global.

```
❌ Feature ajoutée sans vérifier les régressions
❌ Tests de la feature passent, mais autres tests cassés
```

**Impact** : Bugs en production, dette technique invisible.

**Correction** :
```
✅ Après chaque changement : run tous les tests
✅ Vérifier les pages/composants liés
✅ Commit message décrit l'impact
```

---

## Progression de Compétence

### Niveau 1 : Débutant

**Caractéristiques** :
- Suit les patterns documentés
- Une tâche à la fois
- Demande validation fréquente

**Focus** :
- Maîtriser le pattern Contexte → Tâche → Validation
- Apprendre l'AGENT-GUIDE par coeur
- Commits atomiques systématiques

### Niveau 2 : Intermédiaire

**Caractéristiques** :
- Anticipe les edge cases
- Décompose les SPECs en tâches
- Itère efficacement avec les agents

**Focus** :
- Patterns d'orchestration avancés
- Prompts plus sophistiqués
- Moins d'itérations pour le même résultat

### Niveau 3 : Expert

**Caractéristiques** :
- Optimise les prompts pour le projet
- Crée des subagents spécialisés
- Forme les autres PE

**Focus** :
- Contribuer à l'AGENT-GUIDE
- Identifier les patterns réutilisables
- Améliorer la vélocité de l'équipe

---

## Outils

### Template de Notes de Session

```markdown
## Session [Date] - SPEC-XXX

### Objectif
[Ce que je voulais accomplir]

### Accompli
- [x] [Tâche 1]
- [x] [Tâche 2]
- [ ] [Tâche 3 - WIP]

### Blocages Rencontrés
- [Blocage 1] → Résolu par [solution]
- [Blocage 2] → En attente de [qui/quoi]

### Prompts Efficaces
[Prompt qui a bien marché - à réutiliser]

### Pour Demain
- [ ] Finir [tâche WIP]
- [ ] Tester [edge case]
```

---

## Checklist

### Avant Chaque Prompt
- [ ] Contexte suffisant (fichiers, patterns, contraintes) ?
- [ ] Objectif clair et spécifique ?
- [ ] Exemple de référence fourni si pattern existant ?

### Avant Chaque Commit
- [ ] Code compris (pas juste copié) ?
- [ ] Tests passent ?
- [ ] Pas de régression sur l'existant ?
- [ ] Message de commit descriptif ?

### Avant de Marquer une SPEC Done
- [ ] Tous les critères d'acceptation satisfaits ?
- [ ] Tests unitaires et d'intégration présents ?
- [ ] Code reviewé (self-review au minimum) ?
- [ ] Pas de TODO/FIXME laissés ?

---

*Annexes connexes : [A.3 Template AGENT-GUIDE](A3-agent-guide.md) • [H.1 Prompts Efficaces](H1-prompts-efficaces.md) • [B.6 Agents Engineer](B6-agents-engineer.md)*
