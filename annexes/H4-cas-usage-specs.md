# H.4 Cas d'Usage Spécifiques

## Pourquoi cette annexe ?

Le framework AIAD s'adapte à différents contextes : projet legacy, équipe solo, environnement réglementé. Cette annexe fournit des guides d'adaptation pour les situations particulières, avec des recommandations concrètes.

---

## Projet Legacy avec AIAD

### Contexte

Introduire AIAD sur un projet existant, avec dette technique et processus établis.

### Défis

- Code existant sans AGENT-GUIDE
- Tests manquants ou fragiles
- Équipe avec habitudes ancrées
- Architecture non documentée

### Stratégie d'Introduction

#### Phase 1 : Préparation (1-2 semaines)

```markdown
## Actions
1. Créer un AGENT-GUIDE minimaliste
   - Conventions de nommage observées
   - Patterns existants identifiés
   - Zones sensibles documentées

2. Identifier une "zone verte"
   - Partie du code isolée
   - Peu de dépendances
   - Tests existants ou faciles à ajouter

3. Former 1-2 champions
   - PE volontaires et curieux
   - Qui documenteront les learnings
```

#### Phase 2 : Pilote (2-4 semaines)

```markdown
## Actions
1. Commencer par de petites SPECs
   - Bug fixes sur la zone verte
   - Nouvelles features isolées
   - Refactoring local

2. Documenter au fur et à mesure
   - Enrichir l'AGENT-GUIDE
   - Noter les pièges découverts
   - Créer des exemples de prompts

3. Mesurer et ajuster
   - Temps de cycle des SPECs
   - Qualité du code généré
   - Satisfaction de l'équipe
```

#### Phase 3 : Extension (progressive)

```markdown
## Actions
1. Étendre la zone verte
   - Inclure des modules adjacents
   - Former plus de PE

2. Standardiser les rituels
   - Adapter les rituels AIAD existants
   - Ne pas tout changer d'un coup

3. Gérer la dette progressivement
   - Inclure du refactoring dans les SPECs
   - Utiliser les agents pour améliorer les tests
```

### Template AGENT-GUIDE Legacy

```markdown
# AGENT-GUIDE - Projet Legacy

## Contexte Historique
Ce projet a été créé en [année] avec [stack original].
Plusieurs migrations ont eu lieu : [liste].

## Zones du Code

### Zone Verte (OK pour agents)
- `src/features/nouveau-module/` - Code récent, bien testé
- `src/utils/` - Utilitaires avec bons tests

### Zone Orange (Prudence)
- `src/legacy/` - Code ancien, tests fragiles
- Demander review TL avant modifications

### Zone Rouge (Mains humaines uniquement)
- `src/core/billing/` - Facturation, critique business
- `src/auth/` - Authentification, sécurité

## Patterns Historiques
[Documenter les patterns même non-idéaux]
Le projet utilise [pattern X] même si [pattern Y] serait préférable.
Raison : [migration coûteuse / contrainte technique].

## Pièges Connus
- Ne pas toucher à `config/legacy.ts` sans review TL
- Le module `reports` a des effets de bord cachés
- Les tests de `user-service` sont flaky (ticket DEBT-123)
```

### Anti-patterns à Éviter

| Anti-pattern | Pourquoi | Alternative |
|--------------|----------|-------------|
| Tout réécrire d'un coup | Risque énorme, équipe démoralisée | Zones vertes progressives |
| Ignorer la dette | Agents produisent code incohérent | Documenter dans AGENT-GUIDE |
| Forcer l'adoption | Résistance, sabotage passif | Champions volontaires |

---

## Migration vers AIAD

### Contexte

Équipe utilisant une méthodologie classique (Scrum, Kanban) qui souhaite adopter AIAD.

### Défis

- Changement de rôles et responsabilités
- Résistance au changement
- Métriques existantes à adapter

### Plan de Migration en 12 Semaines

#### Semaines 1-4 : Fondations

```markdown
## Semaine 1 : Sensibilisation
- [ ] Présentation AIAD à l'équipe (2h)
- [ ] Identifier les volontaires PE
- [ ] Définir la première SPEC pilote

## Semaine 2 : Préparation
- [ ] Créer PRD pour le pilote
- [ ] Créer ARCHITECTURE doc
- [ ] Créer AGENT-GUIDE initial

## Semaines 3-4 : Premier Cycle
- [ ] Exécuter première SPEC avec PE volontaires
- [ ] Documenter learnings
- [ ] Ajuster le process
```

#### Semaines 5-8 : Expansion

```markdown
## Actions
- Inclure plus de membres dans les cycles AIAD
- Adapter les rituels existants (standup → standup AIAD)
- Commencer à mesurer les nouvelles métriques
- Former officiellement les rôles (PM, PE, QA, TL)
```

#### Semaines 9-12 : Consolidation

```markdown
## Actions
- Tout le nouveau travail suit AIAD
- Rituels stabilisés
- Dashboards métriques en place
- Rétrospective de migration
```

### Mapping des Rôles

| Rôle Avant | Rôle AIAD | Transition |
|------------|-----------|------------|
| Product Owner | Product Manager | Naturelle, focus outcomes |
| Dev Senior | Product Engineer | Formation prompting + validation |
| Dev Junior | Product Engineer | Formation progressive |
| QA | QA Engineer | Adaptation stratégie test |
| Tech Lead | Tech Lead | Nouvelle focus : governance |
| Scrum Master | (Distribué) | Facilitation par PM ou TL |

### Anti-patterns de Migration

| Anti-pattern | Pourquoi | Alternative |
|--------------|----------|-------------|
| Big Bang | Chaos, perte de productivité | Migration progressive |
| Pas de pilote | Pas de validation avant scale | Commencer petit |
| Ignorer les sceptiques | Sabotage, mauvaise ambiance | Inclure dans le pilote |

---

## Équipe Distribuée

### Contexte

Équipe travaillant sur plusieurs fuseaux horaires avec peu de temps synchrone.

### Défis

- Handoff entre fuseaux horaires
- Communication asynchrone
- Cohérence du contexte agent

### Adaptations Recommandées

#### Communication

```markdown
## Principes
1. Documentation > Réunions
   - Tout dans les SPECs et PRs
   - Pas de décision en réunion sans compte-rendu

2. Overlap intentionnel
   - 2h/jour minimum en commun
   - Utiliser pour les décisions bloquantes uniquement

3. Vidéos async
   - Loom/Vidyard pour les explications complexes
   - Plus efficace que les longs textes
```

#### Rituels Adaptés

| Rituel Standard | Adaptation Distribuée |
|-----------------|----------------------|
| Standup quotidien | Standup async (bot Slack/Teams) |
| Demo hebdo | Enregistrement vidéo + Q&A async |
| Tech Review | Document RFC + commentaires async |
| Rétro | Async 48h + sync 30min conclusions |

#### Template Standup Async

```markdown
## Standup [Date] - [Prénom]

### Hier
- [x] SPEC-042 : Validation des tests (PR #123)
- [x] Review PR #120 de Marie

### Aujourd'hui
- [ ] SPEC-042 : Merge et deploy staging
- [ ] Commencer SPEC-043

### Bloqueurs
[Aucun | Description + mention @personne]

### Note pour [fuseau suivant]
Le deploy staging nécessite la variable ENV_X.
```

#### Contexte Agent Partagé

```markdown
## Bonnes Pratiques
1. AGENT-GUIDE centralisé et versionné
   - Tous les PE utilisent la même version
   - Changements via PR avec review

2. Prompts templates partagés
   - Repository de prompts communs
   - Évite les divergences de style

3. Sessions agent documentées
   - Résumé des décisions prises avec l'agent
   - Partagé dans la PR ou la SPEC
```

---

## Projet Solo

### Contexte

Développeur seul utilisant AIAD pour ses projets personnels ou freelance.

### Défis

- Pas de review par les pairs
- Tendance à prendre des raccourcis
- Charge cognitive de tous les rôles

### Adaptations

#### Rôles Fusionnés

```markdown
## Tu es tout à la fois
PM : Définir les outcomes (simplifié)
PE : Générer et valider le code
QA : Tester (automatisé au maximum)
TL : Décisions architecture

## En pratique
- PRD → Liste de features avec priorité
- SPEC → Issue GitHub avec critères d'acceptation
- Review → L'agent fait une pre-review + toi après 24h
```

#### Process Allégé

```markdown
## Cycle Solo
1. Définir l'outcome (1 phrase)
2. Lister les critères d'acceptation
3. Générer avec l'agent
4. Tester
5. Commiter avec message descriptif
6. Review différée (le lendemain)
```

#### Discipline Personnelle

```markdown
## Règles Strictes
- [ ] Jamais de commit sans test qui passe
- [ ] Toujours relire le code généré
- [ ] Review différée de 24h sur les changements majeurs
- [ ] AGENT-GUIDE même pour projet solo (tu l'oublieras sinon)
```

#### Template SPEC Solo

```markdown
# [Feature courte]

## Outcome
[1 phrase : ce que ça permet]

## Critères d'Acceptation
- [ ] Critère 1
- [ ] Critère 2
- [ ] Test qui valide

## Notes
[Contraintes, décisions prises]
```

---

## Contexte Réglementé

### Contexte

Environnement avec contraintes de conformité : RGPD, santé, finance, etc.

### Défis

- Traçabilité des décisions
- Contrôle du code généré
- Audit des processus

### Adaptations Obligatoires

#### Traçabilité

```markdown
## Exigences
1. Chaque génération de code documentée
   - Prompt utilisé
   - Output obtenu
   - Modifications apportées

2. Chaîne de responsabilité claire
   - PE qui a généré
   - Reviewer qui a validé
   - Date et contexte

3. Versioning strict
   - Tous les artefacts dans git
   - Tags sur les releases
```

#### Template Trace Agent

```markdown
## Trace Génération - [SPEC-XXX]

**Date** : [YYYY-MM-DD HH:MM]
**PE** : [Nom]
**Agent** : [Claude/GPT/etc] [Version]

### Prompt
```
[Prompt exact utilisé]
```

### Output Brut
```
[Code généré sans modification]
```

### Modifications Humaines
- Ligne X : [Modification et raison]
- Ligne Y : [Modification et raison]

### Validation
- [ ] Review par [Nom] le [Date]
- [ ] Tests de sécurité passés
- [ ] Conformité [RGPD/autre] vérifiée
```

#### Revue Spécifique

```markdown
## Checklist Conformité

### RGPD
- [ ] Pas de données personnelles en dur
- [ ] Consentement géré si applicable
- [ ] Droit à l'oubli implémenté si applicable

### Sécurité
- [ ] Pas d'injection possible
- [ ] Authentification/autorisation correcte
- [ ] Secrets non exposés

### Audit
- [ ] Logs suffisants pour traçabilité
- [ ] Actions utilisateur tracées si requis
```

#### Restrictions Agent

```markdown
## Zones Interdites aux Agents
- Code de chiffrement (implémentation humaine obligatoire)
- Gestion des tokens d'authentification
- Requêtes SQL sur données sensibles
- Configuration des accès

## Zones Autorisées avec Review Renforcée
- UI de formulaires avec données personnelles
- Validation de données utilisateur
- Logs (sans données sensibles)
```

---

## Exemples Pratiques

### Migration d'un Projet E-commerce

```markdown
## Contexte
- Projet Magento legacy
- 5 développeurs
- 200k lignes de code

## Approche
1. Zone verte : Nouveau module de wishlist
2. AGENT-GUIDE créé à partir de l'existant
3. 2 PE formés en 2 semaines
4. Extension progressive sur 3 mois

## Résultat
- 40% de productivité sur les nouvelles features
- Dette technique stable (pas d'augmentation)
- Équipe satisfaite après adaptation initiale
```

### Startup Solo Devenue Équipe

```markdown
## Contexte
- Fondateur technique solo pendant 18 mois
- Recrutement de 2 devs
- Process AIAD solo à adapter

## Adaptations
1. Documenter l'AGENT-GUIDE existant
2. Ajouter les rituels collaboratifs
3. Instituer la review croisée
4. Former les nouveaux comme PE

## Leçons
- La documentation solo était insuffisante
- Les patterns implicites ont dû être explicités
- L'onboarding a pris 3 semaines
```

---

## Anti-patterns

| Contexte | Anti-pattern | Alternative |
|----------|--------------|-------------|
| Legacy | Ignorer l'existant | Documenter, même le mauvais |
| Migration | Forcer l'adoption | Champions volontaires |
| Distribué | Tout en sync | Async par défaut |
| Solo | Pas de discipline | Règles strictes auto-imposées |
| Réglementé | Confiance aveugle | Traçabilité systématique |

---

## Checklist

```markdown
## Avant d'Adopter AIAD dans un Contexte Spécifique

### Évaluation
- [ ] Contraintes identifiées (legacy, réglementé, etc.)
- [ ] Équipe consultée et volontaires identifiés
- [ ] Zone pilote définie

### Préparation
- [ ] AGENT-GUIDE adapté au contexte
- [ ] Rituels adaptés documentés
- [ ] Formation planifiée

### Suivi
- [ ] Métriques de succès définies
- [ ] Points de checkpoint planifiés
- [ ] Plan de rollback si échec
```

---

## Résumé

| Contexte | Clé de Succès |
|----------|---------------|
| **Legacy** | Zones vertes progressives |
| **Migration** | 12 semaines, pas de big bang |
| **Distribué** | Async par défaut, documentation forte |
| **Solo** | Discipline et review différée |
| **Réglementé** | Traçabilité exhaustive |

---

*Liens connexes : [C.1 Phase d'Initialisation](C1-phase-initialisation.md) · [H.5 Notes d'Apprentissage](H5-notes-apprentissage.md) · [A.3 Template AGENT-GUIDE](A3-template-agent-guide.md)*
