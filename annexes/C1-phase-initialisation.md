# C.1 Phase d'Initialisation

## Pourquoi cette annexe ?

Cette annexe détaille les 7 premiers jours d'adoption d'AIAD sur un projet. Elle fournit une checklist jour par jour et les critères de succès pour chaque étape.

---

## Vue d'Ensemble

### Durée
4 à 7 jours selon la complexité du projet et la maturité de l'équipe.

### Objectif
À la fin de l'initialisation, l'équipe doit être capable de :
- Exécuter un cycle complet PLANIFIER → IMPLÉMENTER → VALIDER → INTÉGRER
- Utiliser les agents IA de manière productive
- Produire du code conforme aux standards définis

### Participants
- Product Manager
- Product Engineer(s)
- Tech Lead
- QA Engineer (si présent)

---

## Jour 1 : Fondations

### Objectif du Jour
Établir les artefacts fondamentaux du projet.

### Activités

#### 1. Kickoff d'Alignement (1-2h)

```markdown
## Ordre du Jour Kickoff

1. **Vision Produit** (PM présente)
   - Problème adressé
   - Solution proposée
   - Utilisateurs cibles

2. **Contexte Technique** (Tech Lead présente)
   - Stack existante ou choisie
   - Contraintes techniques
   - Dépendances

3. **Outcome Initial** (PM propose, équipe valide)
   - Premier outcome mesurable à atteindre
   - Métriques de succès
   - Horizon temporel

4. **Questions / Clarifications**
```

#### 2. Création du PRD Initial (PM, 2-3h)

```markdown
## PRD - Version Initiale

À minima :
- [ ] Vision en une phrase
- [ ] Outcome principal avec métrique
- [ ] Scope in/out clarifié
- [ ] Contraintes identifiées
```

#### 3. Création du Document ARCHITECTURE (Tech Lead, 2-3h)

```markdown
## ARCHITECTURE - Version Initiale

À minima :
- [ ] Stack technique documentée avec justifications
- [ ] Structure de projet définie
- [ ] Principes architecturaux énoncés
```

### Checklist Fin de Jour 1

- [ ] PRD v0.1 rédigé et partagé
- [ ] ARCHITECTURE v0.1 rédigé et partagé
- [ ] Équipe alignée sur la vision et l'outcome initial
- [ ] Repo créé (si nouveau projet)

---

## Jour 2 : Configuration de l'Environnement

### Objectif du Jour
Avoir un environnement de développement fonctionnel avec les agents IA configurés.

### Activités

#### 1. Setup Technique (Tech Lead + PE, 2-3h)

```markdown
## Setup Projet

### Si nouveau projet
- [ ] Repo initialisé
- [ ] Structure de base créée
- [ ] Dépendances installées
- [ ] Scripts de dev/build/test configurés

### Si projet existant
- [ ] Accès au repo pour tous
- [ ] Environnement local fonctionnel
- [ ] Documentation existante revue
```

#### 2. Création de l'AGENT-GUIDE (Tech Lead, 2-3h)

```markdown
## AGENT-GUIDE - Version Initiale

À minima :
- [ ] Description du projet
- [ ] Commandes principales
- [ ] Structure du projet
- [ ] Conventions de code
- [ ] Instructions pour les agents
```

#### 3. Configuration des Agents IA (PE, 1-2h)

```markdown
## Configuration Agents

- [ ] Agent principal installé/configuré
- [ ] AGENT-GUIDE accessible à l'agent
- [ ] Test de génération basique réussi
- [ ] Intégration IDE fonctionnelle
```

#### 4. Configuration CI/CD (Tech Lead, 1-2h)

```markdown
## CI/CD Basique

- [ ] Pipeline de build configuré
- [ ] Linting automatique
- [ ] Tests automatiques
- [ ] Déploiement staging (si applicable)
```

### Checklist Fin de Jour 2

- [ ] Chaque membre peut lancer le projet localement
- [ ] AGENT-GUIDE créé et testé
- [ ] Agents IA configurés et fonctionnels
- [ ] CI/CD basique opérationnel
- [ ] Premier commit de l'équipe poussé

---

## Jour 3 : Première SPEC

### Objectif du Jour
Rédiger et valider la première spécification.

### Activités

#### 1. Identification de la Première Feature (PM + PE, 1h)

```markdown
## Critères de Sélection - Première Feature

✅ Bon choix :
- Périmètre limité (1-2 jours d'implémentation)
- Valeur utilisateur visible
- Pas de dépendance bloquante
- Permet de tester le workflow complet

❌ Mauvais choix :
- Feature complexe ou incertaine
- Fondation technique sans valeur visible
- Dépend d'éléments non encore en place
```

#### 2. Rédaction de la SPEC (PE, 2-3h)

```markdown
## SPEC-001 - Première Feature

Inclure :
- [ ] Contexte et objectif
- [ ] User stories avec critères d'acceptation
- [ ] Cas limites identifiés
- [ ] Spécification technique si nécessaire
- [ ] DoOD adapté
```

#### 3. Review de la SPEC (Équipe, 1h)

```markdown
## Review SPEC-001

Vérifier :
- [ ] Compréhension partagée du besoin
- [ ] Critères d'acceptation testables
- [ ] Effort estimé réaliste
- [ ] Pas de question bloquante
```

#### 4. Définition du DoOD Initial (Équipe, 30min)

```markdown
## DoOD - Projet [Nom]

Version initiale adaptée au contexte :
- [ ] [Critère 1]
- [ ] [Critère 2]
- ...

Note : Ce DoOD sera affiné après les premiers cycles.
```

### Checklist Fin de Jour 3

- [ ] SPEC-001 rédigée et validée
- [ ] DoOD du projet défini
- [ ] SPEC statut "Ready"
- [ ] Équipe prête à implémenter

---

## Jour 4-5 : Premier Cycle Complet

### Objectif
Exécuter le premier cycle PLANIFIER → IMPLÉMENTER → VALIDER → INTÉGRER.

### Jour 4 : PLANIFIER + IMPLÉMENTER

#### PLANIFIER (PE, 1h)

```markdown
## Décomposition SPEC-001

1. [Tâche 1] - estimation
2. [Tâche 2] - estimation
3. [Tâche 3] - estimation

Ordre d'exécution : 1 → 2 → 3
Points d'attention : [...]
```

#### IMPLÉMENTER (PE + Agents, 4-6h)

```markdown
## Session d'Implémentation

### Préparation
- [ ] AGENT-GUIDE relu
- [ ] Contexte de la SPEC en tête
- [ ] Environnement de dev prêt

### Exécution
- [ ] Tâche 1 : prompt → output → review → commit
- [ ] Tâche 2 : prompt → output → review → commit
- [ ] Tâche 3 : prompt → output → review → commit

### Notes
[Observations sur le workflow, les agents, les difficultés]
```

### Jour 5 : VALIDER + INTÉGRER

#### VALIDER (QA ou PE, 2-4h)

```markdown
## Validation SPEC-001

### Tests Automatisés
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent (si applicable)

### Tests Manuels
- [ ] Critères d'acceptation vérifiés
- [ ] Cas limites testés

### DoOD
- [ ] Checklist complète
```

#### INTÉGRER (PE, 1-2h)

```markdown
## Intégration SPEC-001

- [ ] Code reviewé
- [ ] PR créée avec description
- [ ] CI passe
- [ ] Merge effectué
- [ ] Déployé en staging (si applicable)
```

### Checklist Fin Jour 5

- [ ] SPEC-001 implémentée
- [ ] Tests passants
- [ ] Code mergé
- [ ] Premier cycle complet documenté

---

## Jour 6-7 : Consolidation

### Objectif
Affiner le workflow et documenter les apprentissages.

### Activités

#### 1. Rétrospective d'Initialisation (Équipe, 1-2h)

```markdown
## Rétro - Phase d'Initialisation

### Ce qui a bien fonctionné
- [...]
- [...]

### Ce qui a été difficile
- [...]
- [...]

### À améliorer
- [...]
- [...]

### Actions
- [ ] [Action 1] - Responsable : [Nom]
- [ ] [Action 2] - Responsable : [Nom]
```

#### 2. Mise à Jour des Artefacts (2-3h)

```markdown
## Mise à Jour Post-Premier Cycle

### AGENT-GUIDE
- [ ] Ajout des learnings
- [ ] Clarification des conventions si nécessaire
- [ ] Exemples ajoutés si manquants

### DoOD
- [ ] Ajustement si trop strict/laxiste
- [ ] Clarification des critères ambigus

### ARCHITECTURE
- [ ] Mise à jour si décisions prises
- [ ] ADR si décision architecturale
```

#### 3. Lancement du Rythme Normal (PM, 1h)

```markdown
## Transition vers le Rythme Normal

### Backlog de SPECs
- SPEC-002 : [Titre] - Status : Draft
- SPEC-003 : [Titre] - Status : Draft
- SPEC-004 : [Titre] - Status : Draft

### Prochaine Priorité
SPEC-002 à passer en "Ready"

### Cadence Établie
- Cycle cible : [X] jours
- Synchro : [fréquence et format]
```

### Checklist Fin d'Initialisation

- [ ] Premier cycle complet réalisé
- [ ] Rétrospective effectuée
- [ ] Artefacts mis à jour avec les learnings
- [ ] Backlog de SPECs alimenté
- [ ] Équipe autonome pour continuer

---

## Critères de Succès

### L'initialisation est Réussie Si :

| Critère | Indicateur |
|---------|------------|
| Artefacts en place | PRD, ARCHITECTURE, AGENT-GUIDE, première SPEC |
| Workflow validé | Un cycle complet exécuté |
| Agents fonctionnels | Code généré et intégré avec succès |
| Équipe alignée | Pas de question bloquante sur le "comment" |
| Rythme établi | Prochain cycle planifié |

### Signaux d'Alerte

| Signal | Action |
|--------|--------|
| Jour 3 sans PRD ni ARCHITECTURE | Pause pour compléter les fondations |
| Agents ne produisent pas du code utilisable | Revoir l'AGENT-GUIDE, consulter support |
| Premier cycle > 5 jours | Réduire le scope de SPEC-001 |
| Équipe frustrée ou perdue | Rétrospective immédiate |

---

## Templates Jour par Jour

### Daily Check - Initialisation

```markdown
## Daily - Jour [X] Initialisation

### Objectif du Jour
[...]

### Fait Aujourd'hui
- [...]

### Blocages
- [...]

### Demain
- [...]

### Besoin d'Aide
- [...]
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
