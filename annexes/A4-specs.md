# A.4 Template SPECS

## Pourquoi ce template ?

Les SPECS (Spécifications) décrivent précisément ce qu'une fonctionnalité doit faire. Elles servent de contrat entre le Product Manager qui définit le besoin et le Product Engineer qui orchestre l'implémentation via les agents IA.

**Responsable principal** : Product Engineer (rédaction), Product Manager (validation)

---

## Structure d'une SPEC

### 1. En-tête

```markdown
# SPEC-[ID] : [Titre de la Fonctionnalité]

**Statut** : [Draft | Ready | In Progress | Done]
**Priorité** : [P0 | P1 | P2]
**Auteur** : [Nom]
**Date** : [YYYY-MM-DD]
**Outcome lié** : [Référence au PRD]
```

### 2. Contexte

```markdown
## Contexte

### Problème
[Quel problème utilisateur cette fonctionnalité résout]

### Objectif
[Ce que la fonctionnalité doit accomplir]

### Utilisateurs Concernés
[Qui va utiliser cette fonctionnalité]
```

### 3. Spécification Fonctionnelle

```markdown
## Spécification Fonctionnelle

### User Stories

**US-1** : En tant que [persona], je veux [action] afin de [bénéfice].

**Critères d'Acceptation :**
- [ ] [Critère 1]
- [ ] [Critère 2]
- [ ] [Critère 3]

**US-2** : En tant que [persona], je veux [action] afin de [bénéfice].

**Critères d'Acceptation :**
- [ ] [Critère 1]
- [ ] [Critère 2]

### Règles Métier
- [Règle 1]
- [Règle 2]
- [Règle 3]

### Cas Limites
| Cas | Comportement Attendu |
|-----|---------------------|
| [Cas 1] | [Comportement] |
| [Cas 2] | [Comportement] |
```

### 4. Spécification Technique

```markdown
## Spécification Technique

### Composants Impactés
- [Composant/fichier 1]
- [Composant/fichier 2]

### API (si applicable)
```
[Méthode] [Endpoint]

Request:
{
  "field1": "type",
  "field2": "type"
}

Response (200):
{
  "field1": "type"
}

Response (4xx):
{
  "error": "string"
}
```

### Modèle de Données (si applicable)
[Description des changements de schéma]

### Dépendances
- [Dépendance 1]
- [Dépendance 2]
```

### 5. UI/UX (si applicable)

```markdown
## UI/UX

### Maquettes
[Lien vers Figma/screenshots ou description textuelle]

### États de l'Interface
| État | Description |
|------|-------------|
| Default | [Description] |
| Loading | [Description] |
| Empty | [Description] |
| Error | [Description] |
| Success | [Description] |

### Interactions
- [Interaction 1 : ex. "Clic sur le bouton → ouvre modal"]
- [Interaction 2]
```

### 6. Tests

```markdown
## Tests

### Scénarios de Test
| ID | Scénario | Préconditions | Actions | Résultat Attendu |
|----|----------|---------------|---------|------------------|
| T1 | [Nom] | [Conditions] | [Steps] | [Résultat] |
| T2 | [Nom] | [Conditions] | [Steps] | [Résultat] |

### Tests Automatisés Requis
- [ ] [Test unitaire 1]
- [ ] [Test d'intégration 1]
- [ ] [Test E2E 1]
```

### 7. Definition of Output Done (DoOD)

```markdown
## DoOD

- [ ] Code implémenté et fonctionnel
- [ ] Tests passants (unit + intégration)
- [ ] Code reviewé
- [ ] Documentation mise à jour (si nécessaire)
- [ ] Pas de régression sur les fonctionnalités existantes
- [ ] Accessible (clavier, lecteur d'écran)
- [ ] Performance acceptable (LCP < Xs)
```

---

## Exemple Complet

```markdown
# SPEC-007 : Filtrage des Tâches par Statut

**Statut** : Ready
**Priorité** : P1
**Auteur** : Marie Dupont
**Date** : 2026-01-18
**Outcome lié** : PRD - "Réduire le temps de coordination de 30%"

## Contexte

### Problème
Les utilisateurs avec plus de 20 tâches ont du mal à trouver rapidement les tâches sur lesquelles ils doivent travailler.

### Objectif
Permettre de filtrer la liste des tâches par statut pour voir uniquement les tâches pertinentes.

### Utilisateurs Concernés
Tous les membres d'un projet.

## Spécification Fonctionnelle

### User Stories

**US-1** : En tant que membre d'équipe, je veux filtrer les tâches par statut afin de me concentrer sur mes tâches en cours.

**Critères d'Acceptation :**
- [ ] Je peux sélectionner un ou plusieurs statuts à afficher
- [ ] Le filtre persiste pendant ma session
- [ ] Le nombre de tâches par statut est affiché
- [ ] Je peux réinitialiser le filtre en un clic

### Règles Métier
- Par défaut, tous les statuts sont affichés
- Les statuts disponibles sont : À faire, En cours, Terminé
- Le filtre est local (pas de sync entre devices)

### Cas Limites
| Cas | Comportement Attendu |
|-----|---------------------|
| Aucune tâche dans le statut filtré | Afficher un message "Aucune tâche" |
| Toutes les tâches filtrées | Afficher le message + suggestion de réinitialiser |

## Spécification Technique

### Composants Impactés
- `apps/web/src/features/tasks/TaskList.tsx`
- `apps/web/src/features/tasks/TaskFilters.tsx` (nouveau)
- `apps/web/src/hooks/useTaskFilters.ts` (nouveau)

### API
Pas de changement API - filtrage côté client.

### Dépendances
Aucune nouvelle dépendance.

## UI/UX

### Maquettes
Barre de filtres au-dessus de la liste :
```
[○ À faire (12)] [○ En cours (5)] [○ Terminé (28)] [Réinitialiser]
```

### États de l'Interface
| État | Description |
|------|-------------|
| Default | Tous les filtres actifs (pills en outline) |
| Filtered | Filtres sélectionnés en solid, autres en outline |
| Empty | Message centré "Aucune tâche avec ce filtre" |

### Interactions
- Clic sur un statut → toggle le filtre
- Clic sur "Réinitialiser" → tous les statuts affichés

## Tests

### Scénarios de Test
| ID | Scénario | Préconditions | Actions | Résultat Attendu |
|----|----------|---------------|---------|------------------|
| T1 | Filtrer par "En cours" | Liste avec tâches mixtes | Clic sur "En cours" | Seules les tâches "En cours" affichées |
| T2 | Multi-filtre | Liste avec tâches mixtes | Clic "À faire" + "En cours" | Tâches "À faire" et "En cours" affichées |
| T3 | Réinitialiser | Filtre actif | Clic "Réinitialiser" | Toutes les tâches affichées |

### Tests Automatisés Requis
- [ ] Unit: useTaskFilters retourne les bonnes tâches filtrées
- [ ] Unit: TaskFilters affiche les bons compteurs
- [ ] E2E: Parcours complet de filtrage

## DoOD

- [ ] Code implémenté et fonctionnel
- [ ] Tests passants (unit + E2E)
- [ ] Code reviewé
- [ ] Navigation clavier fonctionnelle
- [ ] Pas de régression sur la liste de tâches
```

---

## Niveaux de Détail

### SPEC Minimale (Petite fonctionnalité)

Pour les fonctionnalités simples, une version allégée suffit :

```markdown
# SPEC-008 : Bouton de Duplication de Tâche

**Statut** : Ready | **Priorité** : P2 | **Date** : 2026-01-18

## Objectif
Permettre de dupliquer une tâche existante en un clic.

## Comportement
- Bouton "Dupliquer" dans le menu contextuel de la tâche
- Crée une copie avec le titre "[Copie] Titre original"
- La copie est assignée à personne, statut "À faire"
- Notification de succès

## DoOD
- [ ] Implémenté et testé
- [ ] Pas de régression
```

### SPEC Complète (Fonctionnalité complexe)

Utiliser la structure complète pour les fonctionnalités avec :
- Plusieurs user stories
- Changements d'API ou de modèle de données
- Interactions UI complexes
- Impacts sur d'autres fonctionnalités

---

## Conseils d'Utilisation

### Rédaction Efficace

1. **Commencer par le "pourquoi"** : Le contexte aide à prendre les bonnes décisions
2. **Être spécifique** : "Le bouton est bleu" vs "Le bouton utilise la couleur primary"
3. **Documenter les cas limites** : C'est là que les bugs se cachent

### Erreurs Courantes

- **SPEC trop vague** : "L'utilisateur peut filtrer" n'est pas une spec
- **SPEC trop technique** : La spec décrit le "quoi", pas le "comment" d'implémentation
- **Oublier les états d'erreur** : Toujours spécifier ce qui se passe quand ça échoue

### Workflow

1. **Draft** : PM et PE collaborent sur la spec
2. **Ready** : Spec validée, prête pour implémentation
3. **In Progress** : En cours de développement
4. **Done** : Implémentée et validée

---

*Retour aux [Annexes](../framework/08-annexes.md)*
