# A.4 Template SPECS

## Pourquoi cette annexe ?

Les SPECS (Spécifications) sont le contrat entre le Product Manager qui définit le besoin et le Product Engineer qui implémente. Elles décrivent précisément ce qu'une fonctionnalité doit faire, pour qui, et comment valider qu'elle fonctionne. Sans SPECS claires, les agents génèrent du code qui ne correspond pas aux attentes.

---

## Structure d'une SPEC

### En-tête Standard

```markdown
# SPEC-[ID] : [Titre de la Fonctionnalité]

**Statut** : Draft | Ready | In Progress | Done
**Priorité** : P0 (critique) | P1 (important) | P2 (normal) | P3 (nice-to-have)
**Auteur** : [Nom]
**Date** : YYYY-MM-DD
**Outcome lié** : [Référence au PRD]
```

**Cycle de vie des statuts** :
- **Draft** : En cours de rédaction, pas encore validée
- **Ready** : Validée par PM, prête à implémenter
- **In Progress** : En cours de développement
- **Done** : Implémentée et validée

### Sections Obligatoires

```markdown
## Contexte
[Pourquoi cette fonctionnalité ? Quel problème résout-elle ?]

## User Stories
[Ce que les utilisateurs veulent faire]

## Critères d'Acceptation
[Comment vérifier que c'est bien fait]

## DoOD
[Checklist de livraison]
```

### Sections Optionnelles

```markdown
## Spécification Technique
[API, modèle de données, composants impactés]

## UI/UX
[Maquettes, états d'interface, interactions]

## Tests
[Scénarios de test manuels et automatisés]

## Cas Limites
[Comportements dans les situations exceptionnelles]
```

---

## Rédaction des User Stories

### Format Standard

```markdown
**US-[N]** : En tant que [persona], je veux [action] afin de [bénéfice].

**Critères d'Acceptation :**
- [ ] [Critère observable et testable 1]
- [ ] [Critère observable et testable 2]
- [ ] [Critère observable et testable 3]
```

### Exemples

```markdown
**US-1** : En tant que membre d'équipe, je veux filtrer les tâches par statut
afin de me concentrer sur mes priorités.

**Critères d'Acceptation :**
- [ ] Je peux sélectionner un ou plusieurs statuts (À faire, En cours, Terminé)
- [ ] La liste se met à jour instantanément sans rechargement
- [ ] Le nombre de tâches par statut est affiché sur chaque filtre
- [ ] Je peux réinitialiser tous les filtres en un clic
- [ ] Mon choix de filtre persiste pendant ma session
```

### Critères d'Acceptation Efficaces

| ✅ Bon critère | ❌ Mauvais critère |
|---------------|-------------------|
| "Le bouton affiche 'Enregistrer' quand le formulaire est valide" | "Le bouton fonctionne" |
| "L'API retourne une erreur 400 si l'email est invalide" | "La validation fonctionne" |
| "La page se charge en moins de 2 secondes" | "La page est rapide" |
| "L'utilisateur voit un toast de confirmation pendant 3 secondes" | "L'utilisateur est informé du succès" |

---

## Niveau de Détail Approprié

### SPEC Minimale (Fonctionnalité Simple)

Pour des fonctionnalités simples et isolées.

```markdown
# SPEC-012 : Bouton de Duplication de Tâche

**Statut** : Ready | **Priorité** : P2 | **Date** : 2026-01-18

## Contexte
Les utilisateurs recréent souvent des tâches similaires. Un bouton de duplication évite la saisie répétitive.

## User Story
**US-1** : En tant que membre, je veux dupliquer une tâche existante afin de gagner du temps sur les tâches récurrentes.

**Critères d'Acceptation :**
- [ ] Bouton "Dupliquer" dans le menu "..." de chaque tâche
- [ ] La copie a le titre "[Copie] Titre original"
- [ ] La copie est en statut "À faire", sans assignation
- [ ] Notification de succès "Tâche dupliquée"

## DoOD
- [ ] Implémenté et fonctionnel
- [ ] Test unitaire ajouté
- [ ] Pas de régression
```

### SPEC Complète (Fonctionnalité Complexe)

Pour des fonctionnalités avec UI complexe, API, et multiples interactions.

```markdown
# SPEC-007 : Filtrage des Tâches par Statut

**Statut** : Ready
**Priorité** : P1
**Auteur** : Marie Dupont
**Date** : 2026-01-18
**Outcome lié** : PRD - "Réduire le temps de coordination de 30%"

---

## Contexte

### Problème
Les utilisateurs avec plus de 20 tâches ont du mal à identifier rapidement
celles sur lesquelles ils doivent travailler. Ils perdent du temps à scanner
visuellement la liste complète.

### Objectif
Permettre de filtrer la liste par statut pour afficher uniquement
les tâches pertinentes.

### Utilisateurs Concernés
Tous les membres d'un projet (admin et member).

---

## User Stories

### US-1 : Filtrer par un statut
En tant que membre d'équipe, je veux filtrer les tâches par un statut
afin de me concentrer sur une catégorie de tâches.

**Critères d'Acceptation :**
- [ ] Je vois 3 boutons de filtre : "À faire", "En cours", "Terminé"
- [ ] Chaque bouton affiche le nombre de tâches dans ce statut
- [ ] Cliquer sur un bouton filtre la liste pour n'afficher que ce statut
- [ ] Le bouton actif a un style visuel distinct (fond coloré)

### US-2 : Filtrer par plusieurs statuts
En tant que membre d'équipe, je veux combiner plusieurs filtres
afin de voir par exemple "À faire" ET "En cours".

**Critères d'Acceptation :**
- [ ] Je peux activer plusieurs filtres simultanément
- [ ] Les tâches affichées correspondent à au moins un des statuts actifs
- [ ] Tous les boutons actifs ont le style distinct

### US-3 : Réinitialiser les filtres
En tant que membre d'équipe, je veux réinitialiser les filtres
afin de revoir toutes les tâches.

**Critères d'Acceptation :**
- [ ] Un bouton "Tous" ou "Réinitialiser" est visible
- [ ] Cliquer dessus affiche toutes les tâches
- [ ] Tous les boutons de filtre reviennent à l'état inactif

---

## Règles Métier

- Par défaut, aucun filtre n'est actif (toutes les tâches visibles)
- Le filtre est local : il ne se synchronise pas entre appareils
- Le filtre persiste pendant la session (survit au changement de page)
- Le compteur se met à jour en temps réel si une tâche change de statut

---

## Cas Limites

| Situation | Comportement |
|-----------|--------------|
| 0 tâches dans un statut filtré | Message "Aucune tâche avec ce statut" centré |
| Tous les filtres actifs avec 0 résultat | Message + suggestion "Réinitialiser les filtres ?" |
| Changement de projet | Réinitialisation des filtres |
| Nouvelle tâche créée | Visible si son statut correspond au filtre actif |

---

## Spécification Technique

### Composants Impactés
| Fichier | Modification |
|---------|--------------|
| `features/tasks/TaskList.tsx` | Intégration du composant filtre |
| `features/tasks/TaskFilters.tsx` | Nouveau composant |
| `features/tasks/hooks/useTaskFilters.ts` | Nouveau hook |

### État Local
```typescript
interface TaskFiltersState {
  activeStatuses: TaskStatus[] // [] = tous, ['todo', 'in_progress'] = filtré
}
```

### API
Pas de changement API. Filtrage côté client sur les données déjà chargées.

### Dépendances
Aucune nouvelle dépendance requise.

---

## UI/UX

### Maquette Conceptuelle
```
┌──────────────────────────────────────────────────────┐
│  [À faire (12)] [En cours (5)] [Terminé (28)] [Tous] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  □ Tâche 1                                          │
│  □ Tâche 2                                          │
│  □ Tâche 3                                          │
│  ...                                                │
└──────────────────────────────────────────────────────┘
```

### États de l'Interface

| État | Apparence |
|------|-----------|
| **Inactif** | Bouton outline, texte gris |
| **Actif** | Bouton solid, fond primary |
| **Hover** | Légère surbrillance |
| **Désactivé** | Opacity réduite (si 0 tâches) |

### Interactions
| Action | Résultat |
|--------|----------|
| Clic sur filtre inactif | Active le filtre, met à jour la liste |
| Clic sur filtre actif | Désactive le filtre |
| Clic sur "Tous" | Désactive tous les filtres |

### Responsive
- Desktop : Boutons en ligne horizontale
- Mobile : Boutons en scroll horizontal ou dropdown

---

## Tests

### Scénarios de Test Manuel

| ID | Scénario | Préconditions | Actions | Résultat Attendu |
|----|----------|---------------|---------|------------------|
| T1 | Filtre simple | 10 tâches mixtes | Clic "En cours" | Seules tâches "En cours" visibles |
| T2 | Multi-filtre | 10 tâches mixtes | Clic "À faire" + "En cours" | Tâches des 2 statuts visibles |
| T3 | Réinitialiser | Filtre actif | Clic "Tous" | Toutes les tâches visibles |
| T4 | Persistance session | Filtre actif | Navigation autre page + retour | Filtre toujours actif |
| T5 | Zéro résultat | 5 tâches "Terminé" | Clic "À faire" | Message "Aucune tâche" |

### Tests Automatisés Requis

```markdown
### Tests Unitaires
- [ ] `useTaskFilters` : retourne les tâches filtrées correctement
- [ ] `useTaskFilters` : gère les filtres multiples
- [ ] `TaskFilters` : affiche les compteurs corrects

### Tests d'Intégration
- [ ] Le composant TaskList affiche uniquement les tâches filtrées

### Tests E2E
- [ ] Parcours complet : filtrer → vérifier → réinitialiser
```

---

## DoOD

### Fonctionnel
- [ ] Tous les critères d'acceptation validés
- [ ] Cas limites gérés
- [ ] Responsive testé (mobile + desktop)

### Qualité
- [ ] Typecheck passe
- [ ] Lint passe
- [ ] Tests ajoutés et passants

### Accessibilité
- [ ] Navigation clavier fonctionnelle (Tab + Enter)
- [ ] Labels ARIA sur les boutons de filtre
- [ ] Focus visible

### Performance
- [ ] Pas de re-render inutile de la liste
- [ ] Filtrage instantané (< 100ms)

### Review
- [ ] Code reviewé
- [ ] Pas de régression sur les fonctionnalités existantes
```

---

## Exemples Pratiques

### Exemple 1 : SPEC API Backend

```markdown
# SPEC-015 : API de Création de Projet

**Statut** : Ready | **Priorité** : P1 | **Date** : 2026-01-20

## Contexte
Permettre aux utilisateurs de créer de nouveaux projets via l'API.

## User Story
**US-1** : En tant qu'utilisateur authentifié, je veux créer un projet
afin d'organiser mes tâches par contexte.

**Critères d'Acceptation :**
- [ ] Endpoint POST /api/projects
- [ ] Le créateur est automatiquement admin du projet
- [ ] Retourne le projet créé avec son ID
- [ ] Erreur 401 si non authentifié
- [ ] Erreur 400 si nom invalide (vide ou > 100 caractères)

## Spécification Technique

### Endpoint
```
POST /api/projects
Content-Type: application/json
Authorization: Bearer {token}
```

### Request Body
```json
{
  "name": "string (1-100 chars, required)",
  "description": "string (0-500 chars, optional)"
}
```

### Responses

**201 Created**
```json
{
  "id": "uuid",
  "name": "Mon Projet",
  "description": "Description optionnelle",
  "createdAt": "2026-01-20T10:00:00Z",
  "members": [
    { "userId": "uuid", "role": "admin" }
  ]
}
```

**400 Bad Request**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Le nom doit contenir entre 1 et 100 caractères",
  "field": "name"
}
```

**401 Unauthorized**
```json
{
  "error": "UNAUTHORIZED",
  "message": "Token invalide ou expiré"
}
```

### Modèle de Données
```sql
INSERT INTO projects (id, name, description, created_at)
VALUES (uuid, name, description, now());

INSERT INTO project_members (project_id, user_id, role)
VALUES (project_id, current_user_id, 'admin');
```

## Tests Automatisés
- [ ] Test création réussie avec données valides
- [ ] Test erreur 400 avec nom vide
- [ ] Test erreur 400 avec nom > 100 caractères
- [ ] Test erreur 401 sans token
- [ ] Test que le créateur est admin

## DoOD
- [ ] Endpoint implémenté et documenté (OpenAPI)
- [ ] Validation Zod ajoutée
- [ ] Tests passants
- [ ] Pas de régression
```

### Exemple 2 : SPEC Migration de Données

```markdown
# SPEC-018 : Migration Soft Delete des Tâches

**Statut** : Ready | **Priorité** : P1 | **Date** : 2026-01-20

## Contexte
Actuellement, supprimer une tâche la supprime définitivement.
On veut passer en soft delete pour permettre la récupération.

## Objectif
Ajouter une colonne `archived_at` et modifier le comportement de suppression.

## Spécification Technique

### Migration Base de Données
```sql
ALTER TABLE tasks ADD COLUMN archived_at TIMESTAMP NULL;
CREATE INDEX idx_tasks_archived_at ON tasks(archived_at);
```

### Changements Code

**Suppression (DELETE /api/tasks/:id)**
Avant :
```sql
DELETE FROM tasks WHERE id = :id
```
Après :
```sql
UPDATE tasks SET archived_at = NOW() WHERE id = :id
```

**Liste (GET /api/tasks)**
```sql
SELECT * FROM tasks WHERE archived_at IS NULL
```

### Composants Impactés
- `db/schema.ts` : Ajout colonne
- `db/migrations/` : Nouvelle migration
- `services/task-service.ts` : Modifier delete et list

## Tests
- [ ] Suppression met `archived_at` au lieu de DELETE
- [ ] Liste ne retourne pas les tâches archivées
- [ ] API de restauration (future SPEC)

## DoOD
- [ ] Migration créée et testée en local
- [ ] Tests existants passent
- [ ] Pas de données perdues
```

---

## Anti-patterns

### ❌ La SPEC Vague

**Symptôme** :
```markdown
## User Story
L'utilisateur peut filtrer les tâches.

## Critères
- Le filtre fonctionne
- L'UX est bonne
```

**Problème** : Impossible de valider. Chacun a sa propre interprétation.

**Solution** : Critères observables et testables avec des valeurs concrètes.

---

### ❌ La SPEC Technique

**Symptôme** :
```markdown
## Implémentation
1. Créer un hook useTaskFilters avec useState
2. Ajouter un useEffect pour persister dans sessionStorage
3. Utiliser Array.filter pour filtrer les tâches
```

**Problème** : La SPEC décrit le "comment" au lieu du "quoi". L'agent n'a plus de marge.

**Solution** : Décrire le comportement attendu, pas l'implémentation. L'agent choisit le "comment".

---

### ❌ La SPEC Sans Cas Limites

**Symptôme** : Seulement le happy path est documenté.

**Problème** : Les bugs apparaissent dans les cas limites non prévus.

**Solution** : Toujours une section "Cas Limites" ou "Edge Cases".

---

### ❌ La SPEC Orpheline

**Symptôme** : SPEC sans lien avec un outcome du PRD.

**Problème** : On construit des features sans savoir si elles apportent de la valeur.

**Solution** : Chaque SPEC doit référencer un outcome. "Pourquoi on fait ça ?"

---

## Template Prêt à Copier

```markdown
# SPEC-[ID] : [Titre]

**Statut** : Draft
**Priorité** : P[0-3]
**Auteur** : [Nom]
**Date** : YYYY-MM-DD
**Outcome lié** : [Référence PRD]

---

## Contexte

### Problème


### Objectif


### Utilisateurs Concernés


---

## User Stories

### US-1 :
En tant que [persona], je veux [action] afin de [bénéfice].

**Critères d'Acceptation :**
- [ ]
- [ ]
- [ ]

---

## Règles Métier

-
-

---

## Cas Limites

| Situation | Comportement |
|-----------|--------------|
|  |  |

---

## Spécification Technique (optionnel)

### Composants Impactés
| Fichier | Modification |
|---------|--------------|
|  |  |

### API (si applicable)

### Modèle de Données (si applicable)

---

## UI/UX (optionnel)

### Maquette


### États de l'Interface
| État | Apparence |
|------|-----------|
|  |  |

---

## Tests

### Tests Automatisés Requis
- [ ]
- [ ]

---

## DoOD

### Fonctionnel
- [ ] Tous les critères d'acceptation validés
- [ ] Cas limites gérés

### Qualité
- [ ] Typecheck passe
- [ ] Lint passe
- [ ] Tests ajoutés et passants

### Review
- [ ] Code reviewé
- [ ] Pas de régression
```

---

## Checklist de Validation

Avant de passer une SPEC en "Ready" :

- [ ] Le contexte explique clairement le "pourquoi"
- [ ] Chaque User Story a des critères d'acceptation testables
- [ ] Les cas limites sont documentés
- [ ] Le DoOD est défini et réaliste
- [ ] Un lien vers l'outcome du PRD existe
- [ ] La SPEC est compréhensible par quelqu'un qui ne connaît pas le projet
- [ ] Niveau de détail adapté à la complexité (pas de sur-spécification)

---

## Workflow des SPECS

```
┌─────────┐     ┌─────────┐     ┌─────────────┐     ┌──────┐
│  Draft  │────►│  Ready  │────►│ In Progress │────►│ Done │
└─────────┘     └─────────┘     └─────────────┘     └──────┘
     │               │                  │
     ▼               ▼                  ▼
  Rédaction      Validation         Implémentation
  PM + PE           PM               PE + Agents
```

**Responsabilités** :
- **Draft** : PE rédige, PM complète le contexte
- **Ready** : PM valide que ça correspond au besoin
- **In Progress** : PE implémente avec les agents
- **Done** : QA valide les critères d'acceptation

---

*Annexes connexes : [A.1 Template PRD](./A1-prd.md) • [A.5 Template DoOD](./A5-dood.md) • [B.1 Product Manager](./B1-product-manager.md) • [B.2 Product Engineer](./B2-product-engineer.md)*
