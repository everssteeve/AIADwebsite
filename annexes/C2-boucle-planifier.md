# C.2 Boucle PLANIFIER

## Pourquoi cette annexe ?

Une SPEC mal planifiée génère des allers-retours coûteux, des oublis de dépendances et des agents IA mal dirigés. Cette annexe vous guide pour transformer une SPEC validée en un plan d'exécution clair et actionnable.

---

## Vue d'Ensemble

### Ce que vous allez produire

À la fin de la boucle PLANIFIER, vous aurez :
- Une décomposition en tâches de taille maîtrisable
- Un ordre d'exécution avec dépendances explicites
- Des prompts préparés pour les agents IA
- Des points de validation intermédiaires

### Quand utiliser cette boucle

```
SPEC statut "Ready"
        │
        ▼
   ┌─────────┐
   │PLANIFIER│  ← Vous êtes ici
   └────┬────┘
        │
        ▼
 Plan prêt pour IMPLÉMENTER
```

### Durée typique

| Complexité SPEC | Durée Planification |
|-----------------|---------------------|
| Simple (1-2 user stories) | 15-30 min |
| Moyenne (3-5 user stories) | 30 min - 1h |
| Complexe (6+ user stories) | 1-2h |

---

## Étape 1 : Vérifier que la SPEC est Ready

Avant de planifier, confirmez que la SPEC est complète.

### Checklist SPEC Ready

```markdown
## La SPEC est-elle prête ?

### Complétude
- [ ] Contexte et objectif clairs
- [ ] User stories avec critères d'acceptation
- [ ] Cas limites documentés
- [ ] DoOD défini ou référencé

### Clarté
- [ ] Pas de question ouverte bloquante
- [ ] Comportement attendu sans ambiguïté
- [ ] Priorité validée par le PM

### Faisabilité
- [ ] Dépendances identifiées et disponibles
- [ ] Pas de blocage technique connu
- [ ] Scope réaliste pour un cycle
```

### Que faire si la SPEC n'est pas Ready

| Problème | Action |
|----------|--------|
| Questions ouvertes | Clarifier avec le PM avant de continuer |
| Dépendance manquante | Traiter la dépendance d'abord |
| Scope trop large | Découper en plusieurs SPECs |
| Incertitude technique | Prévoir un spike ou consulter le Tech Lead |

---

## Étape 2 : Analyser la SPEC

Prenez le temps de comprendre ce que la SPEC demande vraiment.

### Template d'Analyse

```markdown
## Analyse SPEC-[XXX] : [Titre]

### Ma compréhension
[Résumé en vos mots de ce que la SPEC demande]

### Composants impactés
| Fichier/Module | Type de modification |
|----------------|---------------------|
| [fichier 1] | Création / Modification / Suppression |
| [fichier 2] | Création / Modification / Suppression |

### Questions identifiées
| Question | Réponse |
|----------|---------|
| [Question 1] | [Réponse ou "À clarifier avec PM"] |
| [Question 2] | [Réponse] |

### Risques techniques
| Risque | Impact | Mitigation |
|--------|--------|------------|
| [Risque 1] | [Haut/Moyen/Bas] | [Comment l'atténuer] |
```

### Exemple d'Analyse

```markdown
## Analyse SPEC-042 : Filtrage des tâches par statut

### Ma compréhension
Ajouter un filtre sur la page de liste des tâches permettant
de n'afficher que les tâches avec un statut donné (todo, in_progress, done).
Le filtre doit persister lors de la navigation.

### Composants impactés
| Fichier/Module | Type de modification |
|----------------|---------------------|
| TaskList.tsx | Modification (ajout du filtre) |
| useTaskFilter.ts | Création (hook pour la logique) |
| types/task.ts | Modification (ajout type FilterState) |
| TaskFilter.tsx | Création (composant UI) |

### Questions identifiées
| Question | Réponse |
|----------|---------|
| Multi-sélection ou sélection unique ? | Multi (confirmé avec PM) |
| Persister où ? | URL params (standard du projet) |

### Risques techniques
| Risque | Impact | Mitigation |
|--------|--------|------------|
| Performance si beaucoup de tâches | Moyen | Filtrer côté serveur si > 100 tâches |
```

---

## Étape 3 : Décomposer en Tâches

Transformer la SPEC en tâches atomiques et estimables.

### Règles de Décomposition

| Règle | Pourquoi |
|-------|----------|
| Une tâche = un commit potentiel | Permet des commits atomiques |
| Taille max : 4h | Au-delà, redécouper |
| Output clair | Savoir quand c'est "fait" |
| Dépendances explicites | Éviter les blocages |

### Échelle d'Estimation

| Taille | Durée | Exemple |
|--------|-------|---------|
| XS | < 30 min | Ajouter un type, renommer une variable |
| S | 30 min - 2h | Créer un composant simple, écrire des tests |
| M | 2h - 4h | Implémenter une logique métier complète |
| L | > 4h | **À redécouper obligatoirement** |

### Template de Décomposition

```markdown
## Décomposition SPEC-[XXX]

| # | Tâche | Type | Est. | Dépend |
|---|-------|------|------|--------|
| 1 | [Description claire de la tâche] | [Code/Test/Config] | [XS/S/M] | - |
| 2 | [Description] | [Type] | [Taille] | 1 |
| 3 | [Description] | [Type] | [Taille] | 1 |
| 4 | [Description] | [Type] | [Taille] | 2, 3 |
```

### Exemple de Décomposition

```markdown
## Décomposition SPEC-042 : Filtrage des tâches

| # | Tâche | Type | Est. | Dépend |
|---|-------|------|------|--------|
| 1 | Créer le type FilterState dans types/task.ts | Code | XS | - |
| 2 | Créer le hook useTaskFilter avec logique de filtrage | Code | S | 1 |
| 3 | Créer le composant TaskFilter (UI des checkboxes) | Code | S | 1 |
| 4 | Intégrer TaskFilter dans TaskList | Code | S | 2, 3 |
| 5 | Ajouter la persistance URL avec useSearchParams | Code | S | 4 |
| 6 | Écrire les tests pour useTaskFilter | Test | S | 2 |
| 7 | Écrire les tests pour TaskFilter | Test | S | 3 |
```

---

## Étape 4 : Choisir un Pattern de Décomposition

Selon le type de feature, certains patterns sont plus adaptés.

### Pattern 1 : Vertical Slice

Implémenter une fonctionnalité de bout en bout à chaque étape.

```
┌─────────────────────────────────┐
│ Tâche 1 : Endpoint API          │
├─────────────────────────────────┤
│ Tâche 2 : Logique métier        │
├─────────────────────────────────┤
│ Tâche 3 : Composant UI          │
├─────────────────────────────────┤
│ Tâche 4 : Intégration + Tests   │
└─────────────────────────────────┘
```

**Quand l'utiliser :**
- Features nouvelles avec UI et backend
- MVP et prototypes
- Quand on veut valider rapidement

**Avantage :** Valeur livrée incrémentalement

### Pattern 2 : Layer by Layer

Implémenter couche par couche (données → logique → UI).

```
┌─────────────────────────────────┐
│ Tâche 1 : Modèle de données     │
├─────────────────────────────────┤
│ Tâche 2 : Repository/Service    │
├─────────────────────────────────┤
│ Tâche 3 : API endpoints         │
├─────────────────────────────────┤
│ Tâche 4 : Composants UI         │
└─────────────────────────────────┘
```

**Quand l'utiliser :**
- Refactoring de grande ampleur
- Migrations de données
- Changements architecturaux

**Avantage :** Clarté des responsabilités

### Pattern 3 : Test-First (TDD)

Écrire les tests d'abord, puis l'implémentation.

```
┌─────────────────────────────────┐
│ Tâche 1 : Écrire les tests (red)│
├─────────────────────────────────┤
│ Tâche 2 : Implémenter (green)   │
├─────────────────────────────────┤
│ Tâche 3 : Refactorer            │
├─────────────────────────────────┤
│ Tâche 4 : Tests d'intégration   │
└─────────────────────────────────┘
```

**Quand l'utiliser :**
- Logique métier complexe
- Corrections de bugs critiques
- Algorithmes sensibles

**Avantage :** Comportement garanti par les tests

### Pattern 4 : Spike + Implémentation

Explorer d'abord avec du code jetable, puis implémenter proprement.

```
┌─────────────────────────────────┐
│ Tâche 1 : Spike/POC (jetable)   │
├─────────────────────────────────┤
│ Tâche 2 : Design basé sur spike │
├─────────────────────────────────┤
│ Tâche 3 : Implémentation propre │
├─────────────────────────────────┤
│ Tâche 4 : Tests                 │
└─────────────────────────────────┘
```

**Quand l'utiliser :**
- Technologie nouvelle ou inconnue
- Intégration avec API externe
- Forte incertitude technique

**Avantage :** Réduction du risque avant investissement

---

## Étape 5 : Définir l'Ordre d'Exécution

### Identifier les Dépendances

```markdown
## Graphe de Dépendances - SPEC-042

        ┌───┐
        │ 1 │  Type FilterState
        └─┬─┘
          │
    ┌─────┴─────┐
    ▼           ▼
  ┌───┐       ┌───┐
  │ 2 │       │ 3 │  Hook + Composant (parallèle possible)
  └─┬─┘       └─┬─┘
    │           │
    └─────┬─────┘
          ▼
        ┌───┐
        │ 4 │  Intégration
        └─┬─┘
          │
          ▼
        ┌───┐
        │ 5 │  Persistance URL
        └───┘

Tests (6, 7) : parallèles avec 4-5
```

### Définir les Points de Validation

Moments où vous vérifiez que tout fonctionne avant de continuer.

```markdown
## Points de Validation

| Après tâche | Vérification |
|-------------|--------------|
| #2 | Hook retourne les bonnes tâches filtrées (test manuel rapide) |
| #4 | Filtre fonctionne visuellement dans l'UI |
| #5 | Rafraîchir la page conserve le filtre |
| #7 | Tous les tests passent |
```

---

## Étape 6 : Préparer les Prompts

Rédiger les prompts principaux à l'avance économise du temps en implémentation.

### Template de Prompt

```markdown
## Prompt - Tâche [#]

### Contexte
[Ce que l'agent doit savoir sur le projet et cette tâche]

### Tâche
[Ce que l'agent doit produire - être spécifique]

### Contraintes
- [Contrainte 1]
- [Contrainte 2]

### Output attendu
[Format et contenu de la réponse]
```

### Exemple de Prompts Préparés

```markdown
## Prompt - Tâche #2 : Hook useTaskFilter

### Contexte
Application React + TypeScript avec TanStack Query.
Composant TaskList affiche des tâches avec l'interface Task { id, title, status }.
Status possible : 'todo' | 'in_progress' | 'done'.

### Tâche
Créer un hook useTaskFilter qui :
- Prend une liste de tâches et un tableau de statuts à filtrer
- Retourne les tâches correspondant aux statuts sélectionnés
- Retourne toutes les tâches si le filtre est vide

### Contraintes
- TypeScript strict (pas de any)
- Fonction pure, pas de mutation
- Mémoriser le résultat avec useMemo

### Output attendu
Le fichier src/hooks/useTaskFilter.ts complet avec types exportés.
```

```markdown
## Prompt - Tâche #3 : Composant TaskFilter

### Contexte
Application React + TypeScript + Tailwind CSS.
Utilise les composants du projet : Checkbox (avec label prop).

### Tâche
Créer un composant TaskFilter qui affiche 3 checkboxes :
- "À faire" (todo)
- "En cours" (in_progress)
- "Terminé" (done)

### Contraintes
- Utiliser le composant Checkbox existant
- Props : selectedStatuses, onFilterChange
- Style Tailwind cohérent avec le reste de l'app

### Output attendu
Le fichier src/components/TaskFilter.tsx
```

---

## Template Complet de Plan

```markdown
# Plan - SPEC-[XXX] : [Titre]

## Analyse

### Objectif
[Ce que la SPEC accomplit une fois terminée]

### Composants Impactés
| Fichier | Modification |
|---------|--------------|
| [fichier] | [type] |

### Dépendances Externes
| Dépendance | Statut |
|------------|--------|
| [dep] | [Disponible/À traiter] |

## Décomposition

| # | Tâche | Type | Est. | Dépend |
|---|-------|------|------|--------|
| 1 | [description] | [type] | [taille] | - |
| 2 | [description] | [type] | [taille] | 1 |

## Ordre d'Exécution

1 → 2 → 3 (séquentiel)
ou
1 → (2 | 3) → 4 (2 et 3 parallèles)

## Points de Validation

| Après | Vérification |
|-------|--------------|
| #X | [quoi vérifier] |

## Prompts Préparés

### Tâche #1
[Prompt]

### Tâche #2
[Prompt]

## Risques Identifiés

| Risque | Mitigation |
|--------|------------|
| [risque] | [action] |

## Prêt à Implémenter

- [ ] Plan relu et validé
- [ ] Pas de blocage identifié
- [ ] Environnement prêt
```

---

## Exemples Pratiques

### Exemple : Feature CRUD Simple

**SPEC :** Ajouter la suppression de tâches

```markdown
## Décomposition

| # | Tâche | Est. | Dépend |
|---|-------|------|--------|
| 1 | Ajouter endpoint DELETE /api/tasks/:id | S | - |
| 2 | Créer mutation useMutation pour delete | S | 1 |
| 3 | Ajouter bouton Delete sur TaskCard | XS | 2 |
| 4 | Ajouter modal de confirmation | S | 3 |
| 5 | Implémenter optimistic update | S | 4 |
| 6 | Tests API et composant | S | 5 |

## Ordre : 1 → 2 → 3 → 4 → 5 → 6
```

### Exemple : Refactoring

**SPEC :** Extraire la logique de validation dans un service

```markdown
## Décomposition

| # | Tâche | Est. | Dépend |
|---|-------|------|--------|
| 1 | Créer ValidationService avec interface | S | - |
| 2 | Migrer validation TaskForm | S | 1 |
| 3 | Migrer validation UserForm | S | 1 |
| 4 | Migrer validation ProjectForm | S | 1 |
| 5 | Supprimer l'ancien code de validation | XS | 2,3,4 |
| 6 | Tests du service | M | 1 |

## Ordre : 1 → (2 | 3 | 4 | 6) → 5
(migrations parallèles après création du service)
```

---

## Anti-patterns

### "La Sur-planification"

**Symptôme :** Plan de 20 tâches pour une feature simple
```
❌ 2h de planification pour 4h d'implémentation
```

**Solution :**
```
✅ Planification proportionnelle au scope
✅ Feature simple : 3-5 tâches
✅ Feature complexe : 8-12 tâches max
```

### "La Tâche Fourre-tout"

**Symptôme :** "Implémenter la feature" comme unique tâche
```
❌ Tâche 1 : Implémenter tout
```

**Solution :**
```
✅ Découper jusqu'à ce que chaque tâche soit < 4h
✅ Une tâche = un commit = un test possible
```

### "Les Dépendances Implicites"

**Symptôme :** Blocage en milieu d'implémentation
```
❌ "Oh, j'ai besoin de la migration DB d'abord"
```

**Solution :**
```
✅ Lister explicitement toutes les dépendances
✅ Les traiter AVANT de commencer le plan
✅ Si une dépendance est découverte : mettre à jour le plan
```

### "Le Plan Figé"

**Symptôme :** Suivre le plan même quand il ne correspond plus à la réalité
```
❌ "Le plan dit de faire X, donc je fais X"
```

**Solution :**
```
✅ Le plan est un guide, pas un contrat
✅ Ajuster si on découvre de nouvelles informations
✅ Documenter les écarts pour la rétro
```

---

## Checklist de Sortie

Avant de passer à IMPLÉMENTER, validez :

```markdown
## Plan Prêt - Checklist

### Décomposition
- [ ] Toutes les tâches identifiées
- [ ] Aucune tâche > 4h
- [ ] Dépendances explicites

### Clarté
- [ ] Chaque tâche est actionnable
- [ ] Output attendu clair pour chaque tâche
- [ ] Pas de question bloquante

### Préparation
- [ ] Prompts principaux rédigés
- [ ] Fichiers à modifier identifiés
- [ ] Points de validation définis

### Environnement
- [ ] Branche créée depuis main à jour
- [ ] Environnement de dev fonctionnel
- [ ] AGENT-GUIDE accessible
```

---

*Annexes connexes : [A.4 Template SPECS](A4-specs.md) • [C.1 Phase d'Initialisation](C1-phase-initialisation.md) • [C.3 Boucle IMPLÉMENTER](C3-boucle-implementer.md) • [H.1 Prompts Efficaces](H1-prompts-efficaces.md)*
