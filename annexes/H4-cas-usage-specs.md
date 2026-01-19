# H.4 Cas d'Usage SPECs

## Pourquoi cette annexe ?

Cette annexe présente des SPECs réelles commentées pour illustrer les bonnes pratiques de rédaction.

---

## SPEC Complète : Feature Complexe

```markdown
# SPEC-042 : Système de Filtrage Avancé des Tâches

**Statut** : Ready
**Priorité** : P1
**Auteur** : Marie Dupont
**Date** : 2026-01-15
**Outcome lié** : PRD O1 - "Réduire le temps de recherche de tâche de 50%"

---

## Contexte

### Problème
Les utilisateurs avec > 50 tâches passent en moyenne 45 secondes
à trouver une tâche spécifique. Ils utilisent Ctrl+F dans la page
ou scrollent manuellement.

### Données
- 35% des users ont > 50 tâches
- Temps moyen de recherche : 45s
- Demandes de filtrage : 12 tickets support ce mois

### Objectif
Permettre de filtrer les tâches par critères multiples pour
trouver rapidement ce qu'on cherche.

### Utilisateurs Concernés
Tous les utilisateurs avec accès à la liste des tâches.

---

## Spécification Fonctionnelle

### User Stories

**US-1** : En tant qu'utilisateur, je veux filtrer les tâches par statut
afin de voir uniquement celles sur lesquelles je dois travailler.

**Critères d'Acceptation :**
- [ ] Je peux sélectionner un ou plusieurs statuts (À faire, En cours, Terminé)
- [ ] Les statuts sont affichés comme des pills cliquables
- [ ] Le nombre de tâches par statut est affiché
- [ ] Je peux tout désélectionner en un clic (bouton "Réinitialiser")

**US-2** : En tant qu'utilisateur, je veux filtrer par assigné
afin de voir les tâches d'une personne spécifique.

**Critères d'Acceptation :**
- [ ] Dropdown avec tous les membres du projet
- [ ] Option "Moi" en premier
- [ ] Option "Non assigné"
- [ ] Recherche dans le dropdown si > 10 membres

**US-3** : En tant qu'utilisateur, je veux combiner les filtres
afin d'affiner ma recherche.

**Critères d'Acceptation :**
- [ ] Les filtres sont cumulatifs (AND logic)
- [ ] L'URL reflète les filtres actifs (shareable)
- [ ] Les filtres persistent pendant la session

### Règles Métier
1. Par défaut, tous les filtres sont désactivés (tout affiché)
2. Un filtre vide équivaut à "tout"
3. Le compteur de résultats se met à jour en temps réel
4. Les filtres s'appliquent côté client (pas de reload)

### Cas Limites

| Cas | Comportement Attendu |
|-----|---------------------|
| Aucune tâche matchant les filtres | Message "Aucune tâche trouvée" + suggestion de réinitialiser |
| Projet sans tâche | Ne pas afficher les filtres |
| Utilisateur supprimé du projet | Garder ses tâches visibles avec "(Ancien membre)" |
| URL avec filtre invalide | Ignorer le paramètre, afficher tout |

---

## Spécification Technique

### Composants Impactés
- `apps/web/src/features/tasks/TaskList.tsx`
- `apps/web/src/features/tasks/TaskFilters.tsx` (nouveau)
- `apps/web/src/hooks/useTaskFilters.ts` (nouveau)

### API
Pas de changement API - filtrage côté client.

### État

```typescript
interface TaskFilters {
  status: TaskStatus[]  // Multi-select
  assigneeId: string | null  // Single select
}

// URL params: ?status=todo,in_progress&assignee=user-123
```

### Performance
- Filtrage en mémoire (max 500 tâches par projet)
- useMemo pour éviter recalcul inutile
- Debounce sur le champ de recherche (si ajouté plus tard)

---

## UI/UX

### Maquette

```
┌──────────────────────────────────────────────────────────┐
│ Filtres                                    [Réinitialiser]│
│                                                           │
│ Statut:  [● À faire (12)] [○ En cours (5)] [○ Terminé (8)]│
│                                                           │
│ Assigné: [▼ Tous les membres          ]                   │
│                                                           │
│ 12 tâches affichées                                       │
├──────────────────────────────────────────────────────────┤
│ [Liste des tâches filtrées]                               │
└──────────────────────────────────────────────────────────┘
```

### États de l'Interface

| État | Description |
|------|-------------|
| Default | Tous les filtres inactifs, pills en outline |
| Filtered | Filtres actifs en solid, compteur mis à jour |
| Empty Result | Message centré, bouton réinitialiser visible |
| Loading | Skeleton sur la liste (pas les filtres) |

### Interactions
- Clic sur status pill → toggle le filtre
- Clic sur dropdown → ouvre la liste
- Clic hors dropdown → ferme sans changer
- Clic "Réinitialiser" → tous les filtres désactivés
- Navigation browser back → restaure les filtres précédents

### Accessibilité
- Navigation clavier : Tab entre les filtres, Espace pour toggle
- Aria-labels : "Filtrer par statut", "12 tâches sur 25 affichées"
- Focus visible sur tous les éléments interactifs

---

## Tests

### Scénarios de Test

| ID | Scénario | Préconditions | Actions | Résultat Attendu |
|----|----------|---------------|---------|------------------|
| T1 | Filtre par status unique | Liste avec tâches mixtes | Clic "En cours" | Seules les tâches "En cours" |
| T2 | Multi-filtre status | Liste avec tâches mixtes | Clic "À faire" + "En cours" | Tâches des deux statuts |
| T3 | Filtre par assigné | Liste avec tâches assignées | Sélectionner "Alice" | Tâches d'Alice seulement |
| T4 | Combinaison | Liste variée | Status="À faire" + Assigné="Moi" | Mes tâches à faire |
| T5 | Réinitialiser | Filtres actifs | Clic "Réinitialiser" | Toutes les tâches |
| T6 | URL sync | Page fraîche | Accéder avec ?status=todo | Filtre "À faire" actif |
| T7 | Empty state | Filtres actifs | Filtrer sans résultat | Message "Aucune tâche" |

### Tests Automatisés Requis
- [ ] Unit : `useTaskFilters` - tous les cas de filtrage
- [ ] Unit : `TaskFilters` - rendering et interactions
- [ ] E2E : Parcours complet de filtrage

---

## DoOD

- [ ] Toutes les user stories implémentées
- [ ] Critères d'acceptation vérifiés
- [ ] Tests unitaires passants (hook + composant)
- [ ] Test E2E du parcours principal
- [ ] Navigation clavier fonctionnelle
- [ ] Code reviewé
- [ ] Pas de régression sur la liste existante
- [ ] URL sync fonctionne (partage de lien filtré)

---

## Notes

### Hors Scope (v2)
- Recherche texte dans les tâches
- Filtre par date d'échéance
- Sauvegarde des filtres favoris
- Filtre par tags/labels

### Questions Résolues
- Q: Filtrage serveur ou client ? → Client (volume ok, réactivité meilleure)
- Q: Persister les filtres ? → Session seulement, pas localStorage

### Risques
- Si > 500 tâches, performance à réévaluer → Monitorer en prod
```

**Ce qui rend cette SPEC efficace :**
- Contexte avec données quantifiées
- User stories avec critères testables
- Cas limites anticipés
- Maquette ASCII claire
- Tests définis en amont
- Scope explicite (in et out)

---

## SPEC Minimale : Feature Simple

```markdown
# SPEC-043 : Bouton de Duplication de Tâche

**Statut** : Ready
**Priorité** : P2
**Date** : 2026-01-16

---

## Objectif
Permettre de dupliquer une tâche en un clic pour créer rapidement
des tâches similaires.

## Comportement
1. Bouton "Dupliquer" dans le menu (...) de chaque tâche
2. Crée une copie avec titre "[Copie] {titre original}"
3. Copie : titre, description, priorité, tags
4. Ne copie pas : assigné, dates, statut (défaut: À faire)
5. La copie apparaît en haut de la liste
6. Toast de confirmation

## Cas Limites
- Titre > 97 chars : tronquer avant d'ajouter "[Copie] "

## DoOD
- [ ] Fonctionnalité implémentée
- [ ] Test du happy path
- [ ] Pas de régression
```

**Ce qui rend cette SPEC efficace malgré sa brièveté :**
- Comportement précis en 6 points
- Cas limite identifié
- DoOD adapté à la taille

---

## SPEC Bug Fix

```markdown
# SPEC-044 : Fix - Formulaire reste disabled après erreur

**Statut** : Ready
**Priorité** : P0 (Bug bloquant)
**Date** : 2026-01-17

---

## Bug
Le bouton Submit du formulaire de création de tâche reste
grisé après une erreur de validation, même quand l'utilisateur
corrige le champ.

## Reproduction
1. Ouvrir le formulaire de création
2. Entrer un titre > 100 caractères
3. Cliquer Submit → Erreur affichée (OK)
4. Corriger le titre (< 100 chars)
5. Le bouton reste grisé (BUG)

## Comportement Attendu
Le bouton se réactive dès que le formulaire est valide.

## Cause Probable
`hasError` state n'est pas réinitialisé quand les données changent.

## Fichier
`src/components/TaskForm.tsx`

## DoOD
- [ ] Bug corrigé
- [ ] Test qui reproduit le bug (échoue avant, passe après)
- [ ] Pas de régression sur la création normale
```

---

## SPEC Refactoring

```markdown
# SPEC-045 : Refactoring - Extraire la logique de filtrage

**Statut** : Ready
**Priorité** : P2
**Date** : 2026-01-18

---

## Contexte
La logique de filtrage est dupliquée dans 3 composants :
- TaskList.tsx (ligne 45-80)
- ArchiveList.tsx (ligne 30-65)
- SearchResults.tsx (ligne 55-90)

## Objectif
Extraire dans un hook réutilisable `useFilteredItems`.

## Contraintes
- Signature générique (fonctionne avec Task, Project, etc.)
- Comportement identique à l'existant
- Tous les tests existants doivent passer sans modification

## Approche Proposée
```typescript
function useFilteredItems<T>(
  items: T[],
  filters: FilterConfig<T>
): T[]
```

## DoOD
- [ ] Hook créé et documenté
- [ ] 3 composants migrés
- [ ] Tests existants passent
- [ ] Pas de changement de comportement visible
```

---

## Template Vierge Commenté

```markdown
# SPEC-XXX : [Titre Descriptif]
# Le titre doit décrire ce que la SPEC accomplit, pas juste le sujet

**Statut** : [Draft | Ready | In Progress | Done]
**Priorité** : [P0 | P1 | P2]  # P0 = critique, P2 = nice to have
**Auteur** : [Nom]
**Date** : [YYYY-MM-DD]
**Outcome lié** : [Référence PRD si applicable]

---

## Contexte
# Pourquoi cette SPEC existe. Le problème, pas la solution.

### Problème
[Décrire le problème utilisateur ou technique]

### Données
[Métriques, feedback, evidence qui justifient]

### Objectif
[Ce qu'on veut accomplir - orienté valeur]

---

## Spécification Fonctionnelle
# Le QUOI - ce que ça fait

### User Stories
[Format : En tant que X, je veux Y, afin de Z]
[Critères d'acceptation testables pour chaque]

### Règles Métier
[Les règles qui gouvernent le comportement]

### Cas Limites
[Tableau des edge cases et comportements attendus]

---

## Spécification Technique
# Le COMMENT à haut niveau - pas l'implémentation détaillée

### Composants Impactés
[Fichiers à créer/modifier]

### API
[Changements d'API si applicable]

### Données
[Changements de modèle si applicable]

---

## UI/UX
# Si applicable

### Maquette
[ASCII art ou lien Figma]

### États
[Les différents états de l'interface]

### Accessibilité
[Exigences a11y]

---

## Tests
[Scénarios et tests requis]

---

## DoOD
[Checklist de validation]

---

## Notes
# Tout ce qui n'entre pas ailleurs

### Hors Scope
[Ce qu'on ne fait PAS]

### Questions
[Questions ouvertes ou résolues]

### Risques
[Risques identifiés]
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
