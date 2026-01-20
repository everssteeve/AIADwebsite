# C.1 Phase d'Initialisation

## Pourquoi cette annexe ?

Démarrer un projet AIAD sans une initialisation structurée mène à des équipes désalignées, des artefacts incomplets et des agents IA inefficaces. Cette annexe vous guide jour par jour pour poser des fondations solides en 7 jours maximum.

---

## Jour 1 : Alignement et Vision

### Objectif
Créer une compréhension partagée du projet et rédiger les premiers artefacts fondateurs.

### Activités

#### Kickoff d'Alignement (1-2h)

Réunir toute l'équipe (PM, PE, TL, QA si présent) pour aligner la vision.

```markdown
## Ordre du Jour Kickoff

### 1. Vision Produit (PM présente - 20 min)
- Quel problème résolvons-nous ?
- Pour qui ?
- Quelle est notre proposition de valeur unique ?

### 2. Contexte Technique (Tech Lead présente - 15 min)
- Stack choisie ou imposée
- Contraintes techniques connues
- Dépendances externes

### 3. Premier Outcome (Discussion collective - 25 min)
- Quel résultat mesurable visons-nous en premier ?
- Comment saurons-nous que c'est atteint ?
- Dans quel horizon temporel ?

### 4. Questions et Clarifications (15 min)
- Lever les ambiguïtés
- Identifier les zones d'ombre
```

#### Rédaction du PRD Initial (PM, 2-3h)

Le PRD pose les fondations produit. Version initiale, pas besoin d'être exhaustif.

```markdown
## PRD v0.1 - [Nom du Projet]

### Vision
[Une phrase qui capture l'essence du produit]

### Problème
[Description du problème utilisateur que nous résolvons]

### Outcome Principal
- **Métrique** : [Ex: Taux de conversion checkout > 70%]
- **Horizon** : [Ex: Fin du sprint 3]

### Scope
**In** :
- [Fonctionnalité 1]
- [Fonctionnalité 2]

**Out** :
- [Explicitement exclu 1]
- [Explicitement exclu 2]

### Contraintes
- [Contrainte 1]
- [Contrainte 2]
```

#### Rédaction du Document ARCHITECTURE (Tech Lead, 2-3h)

Documenter les choix techniques et leurs justifications.

```markdown
## ARCHITECTURE v0.1 - [Nom du Projet]

### Stack Technique
| Composant | Choix | Justification |
|-----------|-------|---------------|
| Frontend | [Ex: React] | [Pourquoi ce choix] |
| Backend | [Ex: Node.js] | [Pourquoi ce choix] |
| Database | [Ex: PostgreSQL] | [Pourquoi ce choix] |

### Structure du Projet
```
src/
├── components/    # Composants UI
├── services/      # Logique métier
├── api/           # Endpoints
└── lib/           # Utilitaires
```

### Principes Architecturaux
1. [Principe 1 - Ex: Séparation claire UI/logique]
2. [Principe 2 - Ex: API-first]
3. [Principe 3 - Ex: Tests obligatoires]

### Décisions Notables
| Décision | Alternative rejetée | Raison |
|----------|---------------------|--------|
| [Choix 1] | [Alternative] | [Pourquoi] |
```

### Checklist Fin de Jour 1

- [ ] Kickoff réalisé, équipe alignée
- [ ] PRD v0.1 rédigé et partagé
- [ ] ARCHITECTURE v0.1 rédigée et partagée
- [ ] Repository créé (si nouveau projet)
- [ ] Pas de question bloquante en suspens

---

## Jour 2 : Environnement et Agents

### Objectif
Avoir un environnement de développement fonctionnel avec les agents IA configurés et testés.

### Activités

#### Setup Technique (Tech Lead + PE, 2-3h)

**Nouveau projet :**
```bash
# Initialisation
mkdir mon-projet && cd mon-projet
git init
pnpm init

# Structure de base
mkdir -p src/{components,services,api,lib}
mkdir -p tests/{unit,integration,e2e}

# Configuration
# Copier les configs depuis le template projet
```

**Projet existant :**
```markdown
## Checklist Projet Existant

- [ ] Accès au repo pour tous les membres
- [ ] Clone et install fonctionnent
- [ ] Build et tests passent
- [ ] Documentation existante identifiée
```

#### Création de l'AGENT-GUIDE (Tech Lead, 2-3h)

Le fichier que les agents IA liront pour comprendre le projet.

```markdown
## CLAUDE.md (ou AGENT-GUIDE.md)

### Description du Projet
[Nom du projet] - [Description en une ligne]

### Commandes
```bash
pnpm dev      # Lancer le serveur de dev
pnpm build    # Build production
pnpm test     # Lancer les tests
pnpm lint     # Vérifier le code
```

### Structure
```
src/
├── components/   # Composants React (PascalCase.tsx)
├── services/     # Services métier (camelCase.ts)
├── api/          # Routes API (kebab-case.ts)
└── lib/          # Utilitaires partagés
```

### Conventions de Code
- TypeScript strict, pas de `any`
- Composants fonctionnels uniquement
- Tests unitaires pour toute logique métier
- Nommage : PascalCase (composants), camelCase (fonctions)

### Patterns à Suivre
[Exemple de code représentatif du projet]

### Patterns à Éviter
- Pas de `console.log` en production
- Pas de logique dans les composants (extraire dans des hooks)
- Pas de magic numbers (utiliser des constantes)
```

#### Configuration des Agents IA (PE, 1-2h)

```markdown
## Checklist Configuration Agent

### Installation
- [ ] Extension/CLI installé
- [ ] Authentification configurée
- [ ] Modèle sélectionné

### Configuration Projet
- [ ] AGENT-GUIDE créé à la racine
- [ ] Fichiers de contexte identifiés
- [ ] Dossiers exclus configurés (.git, node_modules)

### Test de Validation
- [ ] Demander à l'agent de décrire le projet → Réponse correcte
- [ ] Demander de générer un composant simple → Code conforme
- [ ] Demander de corriger une erreur volontaire → Fix approprié
```

#### Configuration CI/CD (Tech Lead, 1-2h)

```yaml
## Pipeline Minimal (.github/workflows/ci.yml)

name: CI
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

### Checklist Fin de Jour 2

- [ ] Chaque membre peut lancer le projet localement
- [ ] AGENT-GUIDE créé et versionné
- [ ] Agent IA configuré et testé avec succès
- [ ] CI/CD basique opérationnel
- [ ] Premier commit collectif poussé

---

## Jour 3 : Première SPEC

### Objectif
Rédiger et valider la première spécification, définir le DoOD du projet.

### Activités

#### Sélection de la Première Feature (PM + PE, 1h)

Choisir une feature qui permet de valider le workflow sans être trop risquée.

| Critère | Bon Choix | Mauvais Choix |
|---------|-----------|---------------|
| Scope | Limité (1-2 jours) | Trop large |
| Valeur | Visible pour l'utilisateur | Infrastructure invisible |
| Dépendances | Aucune ou résolues | Bloqué par autre chose |
| Risque | Faible | Technologie inconnue |

**Exemples de bonnes premières features :**
- Page d'affichage d'une liste simple
- Formulaire de création basique
- Composant UI réutilisable

#### Rédaction de la SPEC (PE, 2-3h)

```markdown
## SPEC-001 : [Titre de la Feature]

### Contexte
[Pourquoi cette feature ? Quel problème résout-elle ?]

### Objectif
[Ce que l'utilisateur pourra faire une fois la feature livrée]

### User Stories

#### US-1 : [Titre]
**En tant que** [type d'utilisateur]
**Je veux** [action]
**Afin de** [bénéfice]

**Critères d'acceptation :**
- [ ] [CA-1 : Critère vérifiable]
- [ ] [CA-2 : Critère vérifiable]

#### US-2 : [Titre]
...

### Cas Limites
| Cas | Comportement Attendu |
|-----|---------------------|
| [Cas 1] | [Comportement] |
| [Cas 2] | [Comportement] |

### Hors Scope
- [Ce qui n'est PAS inclus dans cette SPEC]

### Notes Techniques
[Indications pour l'implémentation si nécessaire]
```

#### Review de la SPEC (Équipe, 1h)

```markdown
## Checklist Review SPEC

### Clarté
- [ ] Chaque user story est compréhensible isolément
- [ ] Les critères d'acceptation sont testables
- [ ] Pas d'ambiguïté sur le comportement attendu

### Complétude
- [ ] Cas nominaux couverts
- [ ] Cas limites identifiés
- [ ] Hors scope explicite

### Faisabilité
- [ ] Réalisable dans le temps imparti
- [ ] Pas de dépendance bloquante
- [ ] Complexité technique maîtrisée
```

#### Définition du DoOD (Équipe, 30min)

Définir les critères de "Done" pour le projet.

```markdown
## DoOD - [Nom du Projet]

### Fonctionnel
- [ ] Tous les critères d'acceptation satisfaits
- [ ] Cas limites gérés

### Code
- [ ] Lint passe sans erreur
- [ ] Typecheck passe sans erreur
- [ ] Pas de TODO ou FIXME laissés

### Tests
- [ ] Tests unitaires écrits (couverture > 80%)
- [ ] Tests passent

### Review
- [ ] Code relu par au moins 1 personne
- [ ] PR approuvée

### Documentation
- [ ] Code auto-documenté (nommage clair)
- [ ] Commentaires si logique complexe
```

### Checklist Fin de Jour 3

- [ ] SPEC-001 rédigée et validée par l'équipe
- [ ] DoOD du projet défini et accepté
- [ ] SPEC statut "Ready"
- [ ] Équipe confiante pour démarrer l'implémentation

---

## Jours 4-5 : Premier Cycle Complet

### Objectif
Exécuter un cycle complet PLANIFIER → IMPLÉMENTER → VALIDER → INTÉGRER.

### Jour 4 : PLANIFIER + IMPLÉMENTER

#### PLANIFIER (PE, 1h)

```markdown
## Plan - SPEC-001

### Décomposition

| # | Tâche | Estimation | Dépend |
|---|-------|------------|--------|
| 1 | [Créer le composant de base] | S | - |
| 2 | [Ajouter la logique métier] | M | 1 |
| 3 | [Connecter à l'API] | S | 2 |
| 4 | [Écrire les tests] | S | 3 |

### Ordre d'Exécution
1 → 2 → 3 → 4 (séquentiel)

### Points de Validation
- Après #2 : Vérifier que la logique fonctionne en isolation
- Après #4 : Tests passent, prêt pour review
```

#### IMPLÉMENTER (PE + Agents, 4-6h)

```markdown
## Session d'Implémentation - SPEC-001

### Préparation
- [ ] Plan relu
- [ ] AGENT-GUIDE ouvert
- [ ] Environnement de dev prêt

### Exécution par Tâche

#### Tâche 1 : [Créer le composant de base]
**Prompt utilisé :**
> [Résumé du prompt]

**Résultat :** ✅ OK en 1 itération
**Commit :** `feat(feature): create base component`

#### Tâche 2 : [Ajouter la logique métier]
**Prompt utilisé :**
> [Résumé du prompt]

**Résultat :** ⚠️ 2 itérations (manquait validation)
**Commit :** `feat(feature): add business logic`

[Continuer pour chaque tâche...]

### Notes de Session
- [Observation sur le workflow]
- [Difficulté rencontrée et solution]
```

### Jour 5 : VALIDER + INTÉGRER

#### VALIDER (QA ou PE, 2-4h)

```markdown
## Validation - SPEC-001

### Tests Automatisés
| Type | Passés | Échoués |
|------|--------|---------|
| Unit | 12 | 0 |
| Integration | 3 | 0 |

### Critères d'Acceptation
| CA | Status | Notes |
|----|--------|-------|
| CA-1 | ✅ | - |
| CA-2 | ✅ | - |

### Cas Limites
| Cas | Status |
|-----|--------|
| [Cas 1] | ✅ |
| [Cas 2] | ✅ |

### DoOD
- [x] Critères d'acceptation satisfaits
- [x] Tests écrits et passent
- [x] Lint et typecheck OK
- [ ] Review effectuée

### Verdict : ✅ Prêt pour Review
```

#### INTÉGRER (PE, 1-2h)

```markdown
## Intégration - SPEC-001

### Checklist Pré-Merge
- [ ] Validation QA passée
- [ ] CI passe
- [ ] Branche à jour avec main
- [ ] Pas de conflits

### Pull Request
**Titre :** feat(feature): implement SPEC-001 - [Titre]

**Description :**
- Implémente [résumé]
- Ajoute [détail]
- Tests inclus

### Post-Merge
- [ ] Branche supprimée
- [ ] SPEC-001 marquée "Done"
- [ ] Déployé en staging (si applicable)
```

### Checklist Fin de Jour 5

- [ ] SPEC-001 implémentée et testée
- [ ] Code mergé dans main
- [ ] CI passe sur main
- [ ] Premier cycle documenté

---

## Jours 6-7 : Consolidation

### Objectif
Apprendre du premier cycle et préparer la suite.

### Activités

#### Rétrospective d'Initialisation (Équipe, 1-2h)

```markdown
## Rétro - Phase d'Initialisation

### Ce qui a bien fonctionné
- [Point positif 1]
- [Point positif 2]

### Ce qui a été difficile
- [Difficulté 1]
- [Difficulté 2]

### Améliorations pour la suite
| Amélioration | Action | Responsable |
|--------------|--------|-------------|
| [Amélioration 1] | [Action concrète] | [Nom] |
| [Amélioration 2] | [Action concrète] | [Nom] |

### Questions Ouvertes
- [Question 1]
```

#### Mise à Jour des Artefacts (2-3h)

Intégrer les apprentissages du premier cycle.

```markdown
## Mises à Jour Post-Premier Cycle

### AGENT-GUIDE
- [ ] Ajout des patterns découverts
- [ ] Clarification des conventions si nécessaire
- [ ] Exemples de code du projet ajoutés

### DoOD
- [ ] Ajustement si critères trop stricts/laxistes
- [ ] Clarification des points ambigus

### ARCHITECTURE
- [ ] Documentation des décisions prises
- [ ] Mise à jour si la structure a évolué
```

#### Lancement du Rythme Normal (PM, 1h)

```markdown
## Transition vers Production

### Backlog de SPECs
| SPEC | Titre | Status | Priorité |
|------|-------|--------|----------|
| SPEC-002 | [Titre] | Draft | Haute |
| SPEC-003 | [Titre] | Draft | Moyenne |
| SPEC-004 | [Titre] | Draft | Basse |

### Cadence Établie
- Durée de cycle cible : [X] jours
- Synchro quotidienne : [Format et horaire]
- Review : [Fréquence]

### Prochaine Priorité
SPEC-002 à passer en "Ready" pour le prochain cycle
```

### Checklist Fin d'Initialisation

- [ ] Premier cycle complet réalisé avec succès
- [ ] Rétrospective effectuée, actions identifiées
- [ ] Artefacts mis à jour avec les apprentissages
- [ ] Backlog alimenté pour les prochains cycles
- [ ] Équipe autonome et confiante pour continuer

---

## Exemples Pratiques

### Exemple : Initialisation Projet E-commerce

**Jour 1 :**
- PRD : "Plateforme de vente en ligne pour artisans locaux"
- Outcome : "10 ventes complétées via la plateforme"
- Stack : Next.js, Prisma, PostgreSQL

**Jour 2 :**
- AGENT-GUIDE avec conventions React/TypeScript
- Agent testé sur génération de composant ProductCard

**Jour 3 :**
- SPEC-001 : "Affichage de la liste des produits"
- 3 user stories, 8 critères d'acceptation

**Jours 4-5 :**
- Implémentation : 6 commits, 4 tâches
- Validation : 15 tests passent, 0 bug

**Jours 6-7 :**
- Rétro : "Agent génère du code propre, mais oublie souvent les tests"
- Action : Ajouter dans l'AGENT-GUIDE "Toujours inclure les tests unitaires"

---

## Anti-patterns

### "Le Kickoff Marathon"

**Symptôme :** Kickoff de 4h+ qui épuise tout le monde
```
❌ Essayer de tout définir le premier jour
```

**Solution :**
```
✅ Kickoff de 2h max
✅ Questions ouvertes traitées les jours suivants
✅ Itérer sur les artefacts plutôt que viser la perfection
```

### "Le PRD Parfait"

**Symptôme :** 3 jours à peaufiner le PRD avant de coder
```
❌ "On ne peut pas commencer sans un PRD complet"
```

**Solution :**
```
✅ PRD v0.1 suffisant pour démarrer
✅ Le PRD évolue avec le projet
✅ Les détails émergent en faisant
```

### "L'Agent Non Testé"

**Symptôme :** Configuration agent bâclée, problèmes découverts en implémentation
```
❌ "L'agent est installé, c'est bon"
```

**Solution :**
```
✅ Test de génération basique AVANT le cycle
✅ Validation que l'AGENT-GUIDE est compris
✅ Ajustements immédiats si output non conforme
```

### "Le Premier Cycle Trop Ambitieux"

**Symptôme :** SPEC-001 trop complexe, premier cycle qui échoue
```
❌ "Autant commencer par quelque chose de significatif"
```

**Solution :**
```
✅ Première feature volontairement simple
✅ L'objectif est de valider le workflow, pas de livrer
✅ La complexité vient après la maîtrise
```

---

## Checklist Récapitulative

```markdown
## Initialisation AIAD - Checklist Complète

### Jour 1 : Alignement
- [ ] Kickoff réalisé
- [ ] PRD v0.1 rédigé
- [ ] ARCHITECTURE v0.1 rédigée
- [ ] Repo créé

### Jour 2 : Environnement
- [ ] Setup technique fonctionnel
- [ ] AGENT-GUIDE créé
- [ ] Agent IA configuré et testé
- [ ] CI/CD basique opérationnel

### Jour 3 : Première SPEC
- [ ] Feature sélectionnée
- [ ] SPEC-001 rédigée et reviewée
- [ ] DoOD défini

### Jours 4-5 : Premier Cycle
- [ ] Plan créé
- [ ] Implémentation terminée
- [ ] Validation passée
- [ ] Code intégré

### Jours 6-7 : Consolidation
- [ ] Rétrospective effectuée
- [ ] Artefacts mis à jour
- [ ] Backlog alimenté
- [ ] Équipe autonome
```

---

*Annexes connexes : [A.1 Template PRD](A1-prd.md) • [A.2 Template ARCHITECTURE](A2-architecture.md) • [A.3 Template AGENT-GUIDE](A3-agent-guide.md) • [C.2 Boucle PLANIFIER](C2-boucle-planifier.md)*
