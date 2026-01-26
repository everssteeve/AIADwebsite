# PARTIE 3 : PHASE DE DÉVELOPPEMENT

La phase de développement transforme les SPECS en code fonctionnel. Le Product Engineer orchestre les agents IA pour produire un code de qualité, validé et prêt à intégrer. Cette phase est le cœur de la création de valeur AIAD.

> 📖 Référence : @framework/05-boucles-iteratives.md - Section "Boucle 2 : Implémenter"

> 💡 **CONSEIL**
> Un PE qui orchestre bien produit plus qu'une équipe traditionnelle de cinq développeurs. La clé : toujours fournir le contexte complet à l'agent.

---

## 3.1 Étape : Préparation de la session

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | SPEC validée, AGENT-GUIDE, ARCHITECTURE |
| 📤 **SORTIES** | Contexte prêt pour l'agent IA |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | Phase 2 complète (SPEC prête) |

### 3.1.1 Workflow quotidien type

| Heure | Activité | Durée |
|-------|----------|-------|
| 9h00 | Synchro équipe (standup) | 15 min |
| 9h15 | Revue contexte (PRD, ARCHITECTURE, AGENT-GUIDE) | 15 min |
| 9h30 | Préparation première SPEC | 30 min |
| 10h00 | Session d'implémentation - Fonctionnalité 1 | 2-3h |
| 12h30 | Pause déjeuner | - |
| 14h00 | Session d'implémentation - Fonctionnalité 2 | 2-3h |
| 17h00 | Mise à jour AGENT-GUIDE + commit/push | 30 min |

> 💡 **CONSEIL** : Concentrez les tâches créatives (implémentation) le matin quand l'attention est maximale. Réservez l'après-midi pour les itérations et corrections.

### 3.1.2 Checklist de préparation

Avant chaque session d'implémentation, vérifiez :

| ✓ | Élément | Action |
|---|---------|--------|
| ☐ | Contexte nettoyé | Exécutez `/clear` dans Claude Code |
| ☐ | SPEC accessible | Vérifiez que le fichier SPEC existe et est complet |
| ☐ | AGENT-GUIDE à jour | Relisez les règles spécifiques au projet |
| ☐ | ARCHITECTURE consultée | Rafraîchissez les patterns architecturaux |
| ☐ | Branche créée | `git checkout -b feature/[nom-feature]` |

### 3.1.3 Commandes de préparation

```bash
# Nettoyage du contexte Claude Code
/clear

# Vérification de l'espace contexte disponible
/context

# Création de la branche de travail
git checkout -b feature/T-XXX-nom-tache

# Vérification de l'état du repo
git status
```

---

## 3.2 Étape : Lancement de l'implémentation

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | SPEC, contexte préparé |
| 📤 **SORTIES** | Plan d'implémentation validé par l'agent |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | 3.1 Préparation terminée |

### 3.2.1 Prompt structuré de lancement

Utilisez ce prompt pour démarrer chaque implémentation :

```
Implémente la fonctionnalité suivante :

**SPEC** : @docs/specs/T-XXX-nom-tache.md
**Contexte** : @docs/CLAUDE.md
**Architecture** : @docs/ARCHITECTURE.md

Instructions :
1. Lis la SPEC en entier avant de commencer
2. Crée les fichiers dans l'ordre indiqué
3. Respecte strictement les interfaces TypeScript définies
4. Gère tous les cas d'erreur documentés
5. N'ajoute AUCUNE fonctionnalité non spécifiée

Montre-moi ton plan d'implémentation avant de coder.
```

### 3.2.2 Validation du plan

Avant de laisser l'agent coder, vérifiez que son plan :

| ✓ | Critère | Question |
|---|---------|----------|
| ☐ | Fichiers corrects | Les fichiers listés correspondent-ils à la SPEC ? |
| ☐ | Ordre logique | L'ordre de création respecte-t-il les dépendances ? |
| ☐ | Pas de hors-sujet | L'agent n'ajoute-t-il rien d'extra ? |
| ☐ | Approche cohérente | L'approche respecte-t-elle l'ARCHITECTURE ? |

Si le plan est conforme, répondez :

```
Le plan est correct. Procède à l'implémentation.
```

Si le plan dévie, corrigez immédiatement :

```
Correction sur ton plan :
- [Point 1 à corriger]
- [Point 2 à corriger]

Reprends avec ces ajustements.
```

> ⚠️ **ATTENTION** : Ne laissez jamais l'agent coder un plan incorrect. Corriger un plan prend 2 minutes, corriger du code prend 30 minutes.

---

## 3.3 Étape : Validation continue

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Code généré par l'agent |
| 📤 **SORTIES** | Code vérifié (compile, lint, types) |
| ⏱️ **DURÉE** | En continu pendant l'implémentation |
| 🔗 **DÉPENDANCES** | 3.2 Plan validé |

### 3.3.1 Points de validation

Après chaque bloc de code généré, exécutez les vérifications :

| Vérification | Commande | Critère de succès |
|--------------|----------|-------------------|
| Compilation | `npm run build` | 0 erreur |
| Types | `npx tsc --noEmit` | 0 erreur |
| Linting | `npm run lint` | 0 erreur/warning bloquant |
| Fichiers | `ls -la [chemin]` | Fichiers créés aux bons endroits |

### 3.3.2 Checklist de validation continue

| ✓ | Élément | Vérification |
|---|---------|--------------|
| ☐ | Le code compile | `npm run build` passe |
| ☐ | Les fichiers sont au bon endroit | Vérification manuelle des chemins |
| ☐ | Les imports sont corrects | Pas d'erreurs TypeScript |
| ☐ | Le linting passe | `npm run lint` sans erreur |
| ☐ | La logique correspond à la SPEC | Relecture rapide |

### 3.3.3 Prompt de revue de code

Si vous identifiez des problèmes, demandez une correction :

```
J'ai identifié ces problèmes dans le code généré :

1. [Problème 1 - ex: "L'import de UserService est manquant"]
2. [Problème 2 - ex: "Le cas d'erreur 404 n'est pas géré"]
3. [Problème 3 - ex: "Le type de retour ne correspond pas à l'interface"]

Corrige ces points en respectant la SPEC @docs/specs/T-XXX.md
```

---

## 3.4 Étape : Génération des tests

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Code implémenté, SPEC |
| 📤 **SORTIES** | Tests unitaires et d'intégration |
| ⏱️ **DURÉE** | 30-60 min |
| 🔗 **DÉPENDANCES** | 3.3 Code validé |

### 3.4.1 Prompt pour générer les tests

```
Génère les tests pour le code que tu viens de créer.

**SPEC de référence** : @docs/specs/T-XXX-nom-tache.md
**Fichiers à tester** :
- @apps/api/src/services/[service].ts
- @apps/api/src/routes/[route].ts

**Conventions** :
- Framework : [Jest/Vitest selon CLAUDE.md]
- Structure : describe/it avec assertions claires
- Couverture : Tous les scénarios de la SPEC section "Tests attendus"

**Scénarios à couvrir** :
1. Cas nominal (données valides)
2. Cas limites documentés dans la SPEC
3. Cas d'erreur (validation, autorisation, etc.)
```

### 3.4.2 Exécution des tests

```bash
# Exécution des tests unitaires
npm run test

# Exécution avec couverture
npm run test:coverage

# Exécution d'un fichier spécifique
npm run test -- [chemin/fichier.test.ts]
```

### 3.4.3 Objectifs de couverture

| Type de code | Couverture minimale |
|--------------|---------------------|
| Backend (services, routes) | > 80% |
| Frontend (composants, hooks) | > 70% |
| Utilitaires | > 90% |

> ⚠️ **ATTENTION** : Si les tests échouent, ne passez pas à l'étape suivante. Corrigez d'abord.

---

## 3.5 Étape : Itération et correction

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Problèmes identifiés |
| 📤 **SORTIES** | Code corrigé et fonctionnel |
| ⏱️ **DURÉE** | Variable (max 3 itérations) |
| 🔗 **DÉPENDANCES** | 3.3 ou 3.4 |

### 3.5.1 Règle des 3 itérations

| Itération | Action |
|-----------|--------|
| 1 | Correction directe avec prompt précis |
| 2 | Reformulation du problème avec plus de contexte |
| 3 | Analyse approfondie : la SPEC est-elle correcte ? |
| > 3 | **STOP** - Escalade requise |

> ⚠️ **ESCALADE** : Si vous corrigez la même erreur plus de 3 fois, arrêtez et analysez la cause racine. Impliquez le Tech Lead si nécessaire.

### 3.5.2 Prompt de correction

```
J'ai identifié ces problèmes :

1. [Problème 1 - description précise]
2. [Problème 2 - description précise]

Contexte :
- SPEC : @docs/specs/T-XXX.md
- Erreur observée : [message d'erreur exact]
- Comportement attendu : [ce qui devrait se passer]

Corrige en respectant strictement la SPEC.
```

### 3.5.3 Commande de retour arrière

Si l'agent s'est engagé dans une mauvaise direction :

```
/rewind
```

Cette commande permet de revenir à un état précédent du contexte.

### 3.5.4 Quand ajouter une règle au AGENT-GUIDE

Si vous corrigez la même erreur plusieurs fois **sur des tâches différentes**, ajoutez une règle au AGENT-GUIDE :

```markdown
## Règles spécifiques

### [Catégorie]
- [Règle à ajouter, ex: "Toujours utiliser le type UUID de Prisma, jamais string"]
```

---

## 3.6 Étape : Revue de code

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer (+ Tech Lead si critique) |
| 📥 **ENTRÉES** | Code complet avec tests |
| 📤 **SORTIES** | Code validé techniquement |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | 3.4 Tests passent |

### 3.6.1 Self-review avec l'agent

```
Revue de code pour les fichiers suivants :

**Fichiers** :
- @[chemin/fichier1.ts]
- @[chemin/fichier2.ts]
- @[chemin/fichier.test.ts]

**Critères de revue** :
1. Respect des conventions du CLAUDE.md
2. Pas de code mort ou commenté
3. Gestion d'erreurs appropriée
4. Types TypeScript complets (pas de any)
5. Tests couvrant les cas critiques

Liste les améliorations nécessaires, le cas échéant.
```

### 3.6.2 Critères d'implication du Tech Lead

Impliquez le Tech Lead pour une revue manuelle si :

| Condition | Raison |
|-----------|--------|
| Changement d'architecture | Impact sur les patterns existants |
| Nouvelle dépendance externe | Décision structurante |
| Code complexe (> 200 lignes dans un fichier) | Risque de dette technique |
| Modification de schéma DB | Impact données existantes |
| Code touchant la sécurité | Risque de vulnérabilité |

---

## 3.7 Étape : Finalisation

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Code revu et approuvé |
| 📤 **SORTIES** | Commit local prêt, documentation à jour |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | 3.6 Revue terminée |

### 3.7.1 Mise à jour de la documentation

```
Mets à jour la documentation pour la fonctionnalité implémentée :

1. Ajoute l'endpoint dans @docs/API.md (si applicable)
2. Documente les fonctions complexes avec JSDoc
3. Mets à jour le CHANGELOG.md

Conventions : @CLAUDE.md
```

### 3.7.2 Commit structuré

Utilisez le format Conventional Commits :

```bash
git status
git add .
git commit -m "feat(api): add POST /api/tasks endpoint

- Create task with title, description, deadline
- Add validation with Zod schema
- Add unit tests with 85% coverage

Closes #123
Spec: T-007-4"
```

### 3.7.3 Types de commit

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `refactor` | Refactoring sans changement fonctionnel |
| `test` | Ajout ou modification de tests |
| `docs` | Documentation uniquement |
| `chore` | Maintenance (deps, config, etc.) |

### 3.7.4 Push et nettoyage

```bash
# Push de la branche
git push origin feature/T-XXX-nom-tache

# Nettoyage du contexte pour la prochaine tâche
/clear
```

---

## 3.8 Checklist de fin d'implémentation

| ✓ | Élément | Vérification |
|---|---------|--------------|
| ☐ | Code compile | `npm run build` passe |
| ☐ | Types valides | `npx tsc --noEmit` passe |
| ☐ | Linting OK | `npm run lint` passe |
| ☐ | Tests passent | `npm run test` passe |
| ☐ | Couverture suffisante | > 80% backend, > 70% frontend |
| ☐ | SPEC respectée | Relecture croisée code/SPEC |
| ☐ | Documentation à jour | API.md, JSDoc si nécessaire |
| ☐ | Commit effectué | Message respectant Conventional Commits |
| ☐ | Branche poussée | `git push` effectué |
| ☐ | AGENT-GUIDE mis à jour | Nouvelles règles si applicable |

> ⚠️ **ATTENTION**
> Ne passez pas à la phase de validation (Partie 4) si cette checklist n'est pas complète à 100%.

---

## Problèmes courants

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| Code hors sujet | SPEC ambiguë ou agent n'a pas lu | Reformuler le prompt avec `Lis d'abord @docs/specs/...` |
| Boucle infinie de corrections | Tâche trop complexe | Découper en sous-tâches, créer des SPECS plus petites |
| Erreurs TypeScript | Types manquants dans la SPEC | Enrichir la section "Interface technique" de la SPEC |
| Tests échouent | Mocks incorrects ou incomplets | Vérifier les mocks, demander à l'agent de les corriger |
| Agent ignore les instructions | Contexte pollué | Exécuter `/clear` et relancer avec prompt complet |
| Code ne respecte pas l'architecture | ARCHITECTURE non référencée | Ajouter explicitement `@ARCHITECTURE.md` dans le prompt |

> ⚠️ **ESCALADE** : Si vous êtes bloqué plus de 2 heures sur le même problème, impliquez le Tech Lead.

---

## Indicateurs de succès

| Indicateur | Cible | Mesure |
|------------|-------|--------|
| Code correct du premier coup | > 70% | % de tâches sans correction majeure |
| Ratio code généré / manuel | > 80/20 | Estimation PE |
| Couverture de tests | > 80% backend, > 70% frontend | `npm run test:coverage` |
| Temps par fonctionnalité | 2h - 3 jours | Selon complexité SPEC |
| Itérations de correction | < 3 | Comptage par tâche |

---

*Version 1.0 - Janvier 2026*

> 📖 Références Framework utilisées :
> - @framework/05-boucles-iteratives.md (Boucle 2 : Implémenter)
> - @framework/03-ecosysteme.md (Responsabilité PE)
> - @framework/04-artefacts.md (AGENT-GUIDE, SPECS)
