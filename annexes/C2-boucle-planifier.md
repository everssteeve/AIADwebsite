# C.2 Boucle PLANIFIER - Détails

## Pourquoi cette annexe ?

Cette annexe détaille la boucle PLANIFIER : le processus complet, les critères d'entrée et de sortie, et les patterns de décomposition efficaces.

---

## Vue d'Ensemble

### Objectif de la Boucle
Transformer une SPEC "Ready" en un plan d'exécution clair pour l'implémentation.

### Durée Typique
30 minutes à 2 heures selon la complexité de la SPEC.

### Participants
- **Product Engineer** : Principal responsable
- **Tech Lead** : Consulté si design complexe
- **Product Manager** : Disponible pour clarifications

---

## Critères d'Entrée

### La SPEC doit être "Ready"

```markdown
## Checklist SPEC Ready

### Complétude
- [ ] Contexte et objectif clairs
- [ ] User stories avec critères d'acceptation
- [ ] Cas limites documentés
- [ ] DoOD défini

### Clarté
- [ ] Pas de question bloquante ouverte
- [ ] Pas d'ambiguïté sur le comportement attendu
- [ ] Priorité validée par le PM

### Faisabilité
- [ ] Dépendances identifiées et disponibles
- [ ] Effort estimé réaliste
- [ ] Pas de blocage technique connu
```

### Si la SPEC n'est pas Ready

| Problème | Action |
|----------|--------|
| Questions ouvertes | Clarifier avec PM avant de planifier |
| Dépendance manquante | Traiter la dépendance d'abord |
| Scope trop large | Découper en plusieurs SPECs |
| Incertitude technique | Design review avec Tech Lead |

---

## Processus de Planification

### Étape 1 : Analyse de la SPEC (10-20 min)

```markdown
## Analyse SPEC-[XXX]

### Compréhension
[Résumé en mes mots de ce que la SPEC demande]

### Composants Impactés
- [Fichier/module 1]
- [Fichier/module 2]

### Questions Identifiées
- [Question 1] → Réponse : [...]
- [Question 2] → Réponse : [...]

### Risques Techniques
- [Risque 1] → Mitigation : [...]
```

### Étape 2 : Décomposition en Tâches (15-30 min)

```markdown
## Décomposition SPEC-[XXX]

### Tâches

| # | Tâche | Type | Estimation | Dépendance |
|---|-------|------|------------|------------|
| 1 | [Description] | [Code/Test/Config] | [XS/S/M] | - |
| 2 | [Description] | [Code/Test/Config] | [XS/S/M] | 1 |
| 3 | [Description] | [Code/Test/Config] | [XS/S/M] | 1 |
| 4 | [Description] | [Code/Test/Config] | [XS/S/M] | 2,3 |

### Légende Estimation
- XS : < 30 min
- S : 30 min - 2h
- M : 2h - 4h
- L : > 4h (à redécouper)
```

### Étape 3 : Ordonnancement (5-10 min)

```markdown
## Ordre d'Exécution

### Séquence
1. [Tâche 1] - Fondation
2. [Tâche 2] - Peut être parallélisée avec 3
3. [Tâche 3] - Peut être parallélisée avec 2
4. [Tâche 4] - Nécessite 2 et 3

### Points de Validation
- Après tâche 1 : Vérifier que [...]
- Après tâche 4 : Test d'intégration
```

### Étape 4 : Préparation des Prompts (10-20 min)

```markdown
## Prompts Préparés

### Tâche 1 : [Nom]
```
[Prompt préparé pour l'agent IA]
- Contexte
- Objectif
- Contraintes
- Output attendu
```

### Tâche 2 : [Nom]
```
[Prompt préparé]
```
```

---

## Patterns de Décomposition

### Pattern 1 : Vertical Slice

Implémenter une fonctionnalité de bout en bout.

```
┌─────────────────────────────────────┐
│ Tâche 1 : API endpoint              │
├─────────────────────────────────────┤
│ Tâche 2 : Logique métier            │
├─────────────────────────────────────┤
│ Tâche 3 : UI composant              │
├─────────────────────────────────────┤
│ Tâche 4 : Intégration + Tests       │
└─────────────────────────────────────┘

Avantage : Valeur livrée à chaque slice
Quand l'utiliser : Features nouvelles, MVP
```

### Pattern 2 : Layer by Layer

Implémenter couche par couche.

```
┌─────────────────────────────────────┐
│ Tâche 1 : Modèle de données         │
├─────────────────────────────────────┤
│ Tâche 2 : Repository/Service        │
├─────────────────────────────────────┤
│ Tâche 3 : API endpoints             │
├─────────────────────────────────────┤
│ Tâche 4 : UI complète               │
└─────────────────────────────────────┘

Avantage : Clarté architecturale
Quand l'utiliser : Refactoring, migration
```

### Pattern 3 : Test-First

Écrire les tests puis l'implémentation.

```
┌─────────────────────────────────────┐
│ Tâche 1 : Tests unitaires (red)     │
├─────────────────────────────────────┤
│ Tâche 2 : Implémentation (green)    │
├─────────────────────────────────────┤
│ Tâche 3 : Refactoring (refactor)    │
├─────────────────────────────────────┤
│ Tâche 4 : Tests d'intégration       │
└─────────────────────────────────────┘

Avantage : Qualité garantie
Quand l'utiliser : Logique complexe, bugs critiques
```

### Pattern 4 : Spike puis Implémentation

Explorer puis implémenter proprement.

```
┌─────────────────────────────────────┐
│ Tâche 1 : Spike/POC (throwaway)     │
├─────────────────────────────────────┤
│ Tâche 2 : Design basé sur spike     │
├─────────────────────────────────────┤
│ Tâche 3 : Implémentation propre     │
├─────────────────────────────────────┤
│ Tâche 4 : Tests                     │
└─────────────────────────────────────┘

Avantage : Réduction de l'incertitude
Quand l'utiliser : Technologie nouvelle, intégration externe
```

---

## Critères de Sortie

### Le Plan est Prêt Quand :

```markdown
## Checklist Plan Prêt

### Décomposition
- [ ] Toutes les tâches identifiées
- [ ] Aucune tâche > 4h (sinon redécouper)
- [ ] Dépendances explicites

### Clarté
- [ ] Chaque tâche est actionnable
- [ ] Output attendu de chaque tâche clair
- [ ] Pas de question bloquante

### Préparation
- [ ] Prompts principaux préparés
- [ ] Fichiers à modifier identifiés
- [ ] Points de validation définis
```

---

## Erreurs Courantes

### 1. Sur-planification

**Symptôme** : Plan détaillé de 20 tâches pour une feature simple
```
❌ 2h de planification pour 4h d'implémentation
```

**Solution** : Planification proportionnelle
```
✅ Feature simple : 3-5 tâches, 15-30 min de planification
✅ Feature complexe : 8-12 tâches, 1-2h de planification
```

### 2. Tâches Trop Grosses

**Symptôme** : "Implémenter la feature" comme unique tâche
```
❌ Tâche 1 : Implémenter tout
```

**Solution** : Découper jusqu'à ce que chaque tâche soit < 4h
```
✅ Tâche 1 : Créer le composant de base
✅ Tâche 2 : Ajouter la logique de validation
✅ Tâche 3 : Connecter à l'API
✅ Tâche 4 : Gérer les états d'erreur
```

### 3. Ignorer les Dépendances

**Symptôme** : Blocage en milieu d'implémentation
```
❌ "Oh, j'ai besoin de la migration DB avant"
```

**Solution** : Identifier les dépendances explicitement
```
✅ Tâche 1 : Migration DB (prérequis)
✅ Tâche 2 : Endpoint API (dépend de 1)
✅ Tâche 3 : Composant UI (dépend de 2)
```

### 4. Pas de Point de Validation

**Symptôme** : Découverte tardive d'un problème
```
❌ Tout implémenter puis tester à la fin
```

**Solution** : Points de validation intermédiaires
```
✅ Après tâche 2 : Vérifier que l'API répond correctement
✅ Après tâche 4 : Test manuel du happy path
```

---

## Template de Plan

```markdown
# Plan - SPEC-[XXX] : [Titre]

## Analyse

### Objectif
[Ce que la SPEC doit accomplir]

### Composants Impactés
- [ ] [Fichier 1]
- [ ] [Fichier 2]

### Dépendances Externes
- [Dépendance 1] : [Statut]

## Tâches

| # | Tâche | Est. | Dépend. |
|---|-------|------|---------|
| 1 | [Description] | [S] | - |
| 2 | [Description] | [M] | 1 |
| 3 | [Description] | [S] | 2 |

## Points de Validation
- Après #1 : [Quoi vérifier]
- Après #3 : [Quoi vérifier]

## Prompts Préparés

### Tâche 1
```
[Prompt]
```

## Risques Identifiés
- [Risque] → [Mitigation]

## Prêt à Implémenter
- [ ] Plan reviewé si complexe
- [ ] Pas de blocage
- [ ] Environnement prêt
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
