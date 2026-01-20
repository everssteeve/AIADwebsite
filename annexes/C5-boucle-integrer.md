# C.5 Boucle INTÉGRER

## Pourquoi cette annexe ?

Un code validé mais mal intégré peut casser la production, polluer l'historique Git et compliquer les rollbacks. Cette annexe vous guide pour intégrer le code en confiance, avec un historique propre et une traçabilité complète.

---

## Vue d'Ensemble

### Ce que vous allez faire

La boucle INTÉGRER permet de :
- Fusionner le code validé dans la branche principale
- Maintenir un historique Git propre et exploitable
- Déclencher les déploiements automatiques
- Communiquer les changements à l'équipe

### Le Flux d'Intégration

```
┌─────────────────────────────────────────────┐
│ 1. PRÉPARATION                              │
│    Vérifier CI, mettre à jour la branche    │
├─────────────────────────────────────────────┤
│ 2. REVIEW                                   │
│    Code review humaine (si requise)         │
├─────────────────────────────────────────────┤
│ 3. MERGE                                    │
│    Squash and merge vers main               │
├─────────────────────────────────────────────┤
│ 4. POST-MERGE                               │
│    Cleanup, vérification, communication     │
└─────────────────────────────────────────────┘
```

---

## Étape 1 : Préparer la Pull Request

### Checklist Pré-Merge

```markdown
## PR Prête pour Merge ?

### Validation
- [ ] Rapport QA attaché et positif
- [ ] Tous les checks CI passent (lint, typecheck, tests, build)

### Branche
- [ ] À jour avec main (rebase si nécessaire)
- [ ] Pas de conflits

### Description
- [ ] PR bien décrite (quoi, pourquoi, comment tester)
- [ ] Lien vers la SPEC
- [ ] Screenshots si changements UI

### Review
- [ ] Review demandée (si politique d'équipe)
- [ ] Commentaires adressés
```

### Mettre à Jour la Branche

```bash
# Récupérer les derniers changements de main
git fetch origin

# Rebase sur main pour un historique linéaire
git rebase origin/main

# En cas de conflits : résoudre fichier par fichier
git add <fichier-résolu>
git rebase --continue

# Pousser (force car rebase)
git push --force-with-lease
```

### Résoudre les Conflits

```markdown
## Guide de Résolution de Conflits

### Principe
1. Comprendre les deux versions du code
2. Décider laquelle garder (ou combiner)
3. Tester après résolution
4. Ne jamais écraser du code sans comprendre

### Étapes
1. `git status` - identifier les fichiers en conflit
2. Ouvrir chaque fichier, chercher les marqueurs `<<<<<<<`
3. Résoudre manuellement
4. `git add <fichier>`
5. `git rebase --continue`
6. Exécuter les tests pour vérifier

### En Cas de Doute
- Consulter l'auteur de l'autre changement
- Préférer garder les deux modifications si possible
- Tester systématiquement après résolution
```

---

## Étape 2 : Effectuer la Code Review

### Checklist Review (Reviewer)

```markdown
## Code Review - SPEC-[XXX]

### Fonctionnel
- [ ] Le code fait ce qui est décrit dans la PR
- [ ] Les cas limites sont gérés
- [ ] Les erreurs sont traitées correctement

### Qualité
- [ ] Code lisible et auto-documenté
- [ ] Nommage clair et cohérent
- [ ] Pas de code dupliqué
- [ ] Patterns du projet respectés

### Sécurité
- [ ] Pas de secrets en dur
- [ ] Inputs validés
- [ ] Pas de vulnérabilité évidente

### Tests
- [ ] Tests suffisants pour le nouveau code
- [ ] Tests pertinents (testent le bon comportement)

### Performance
- [ ] Pas de N+1 queries
- [ ] Pas de calculs inutiles dans les renders

### Verdict
- [ ] ✅ Approuvé
- [ ] ⚠️ Approuvé avec commentaires mineurs
- [ ] ❌ Changements demandés
```

### Bonnes Pratiques de Review

| À Faire | À Éviter |
|---------|----------|
| Commentaires constructifs | Critiques personnelles |
| Suggestions de code | "C'est nul, refais" |
| Questions pour comprendre | Suppositions |
| Féliciter les bonnes pratiques | Ignorer le positif |

### Format de Commentaire Constructif

```markdown
## Suggestion
**Fichier** : src/components/TaskFilter.tsx:42

**Actuel** :
```typescript
const filtered = tasks.filter(t => statuses.includes(t.status))
```

**Suggestion** :
```typescript
const filtered = useMemo(
  () => tasks.filter(t => statuses.includes(t.status)),
  [tasks, statuses]
)
```

**Raison** : Évite le recalcul à chaque render si les inputs n'ont pas changé.

**Bloquant** : Non (amélioration de performance)
```

---

## Étape 3 : Merger le Code

### Stratégie Recommandée : Squash and Merge

```
Branche feature :  A --- B --- C --- D
                                     │
                                     ▼
Main :            M ─────────────── S (squash de A+B+C+D)
```

**Avantages :**
- Historique propre (1 commit = 1 feature)
- Message de commit contrôlé au merge
- Pas besoin de commits parfaits pendant le dev

### Format du Message de Commit (Conventional Commits)

```
<type>(<scope>): <description>

[body optionnel]

[footer optionnel]
```

### Types de Commits

| Type | Usage | Exemple |
|------|-------|---------|
| `feat` | Nouvelle fonctionnalité | `feat(tasks): add status filter` |
| `fix` | Correction de bug | `fix(auth): handle expired tokens` |
| `refactor` | Refactoring sans changement fonctionnel | `refactor(api): extract validation` |
| `test` | Ajout ou modification de tests | `test(tasks): add filter edge cases` |
| `docs` | Documentation uniquement | `docs(readme): update setup guide` |
| `chore` | Maintenance (deps, config) | `chore(deps): update react to 18.3` |
| `perf` | Amélioration de performance | `perf(list): virtualize long lists` |

### Exemples de Messages de Commit

**Simple :**
```
feat(tasks): add status filter

Allow users to filter tasks by status (todo, in_progress, done).
Filter persists in URL for sharing and refresh.

Closes SPEC-042
```

**Avec breaking change :**
```
feat(api)!: change task status enum values

BREAKING CHANGE: Status values changed from 'TODO'/'DONE'
to 'todo'/'done'. Run migration script to update existing data.

Closes SPEC-051
```

### Exécuter le Merge

**Via GitHub/GitLab (recommandé) :**
1. Cliquer "Squash and merge"
2. Vérifier/éditer le message de commit
3. Confirmer

**Via ligne de commande :**
```bash
git checkout main
git pull origin main
git merge --squash feat/SPEC-042-task-filter
git commit -m "feat(tasks): add status filter

Allow users to filter tasks by status.
Filter persists in URL.

Closes SPEC-042"
git push origin main
```

---

## Étape 4 : Actions Post-Merge

### Checklist Post-Merge

```markdown
## Post-Merge - SPEC-[XXX]

### Cleanup
- [ ] Branche feature supprimée (locale et remote)
- [ ] PR fermée (auto si lien avec merge)

### Vérification
- [ ] CI passe sur main
- [ ] Déploiement staging déclenché (si automatique)
- [ ] Smoke test rapide sur staging

### Documentation
- [ ] SPEC marquée "Done"
- [ ] Ticket/issue fermé
- [ ] Release notes mises à jour (si applicable)

### Communication
- [ ] Équipe notifiée (Slack, standup)
- [ ] Stakeholders informés si feature visible
```

### Supprimer la Branche

```bash
# Supprimer la branche locale
git branch -d feat/SPEC-042-task-filter

# Supprimer la branche remote
git push origin --delete feat/SPEC-042-task-filter

# Nettoyer les références locales
git fetch --prune
```

### Vérifier le Déploiement

```markdown
## Vérification Staging

### Smoke Test
- [ ] Application accessible
- [ ] Login fonctionne
- [ ] Feature déployée visible
- [ ] Pas d'erreur console

### Feature Spécifique
- [ ] [Vérification 1 liée à la SPEC]
- [ ] [Vérification 2]

### Résultat : ✅ Déploiement OK
```

---

## Gestion des Branches

### Convention de Nommage

```
<type>/<spec-id>-<description-courte>

Exemples :
feat/SPEC-042-task-filter
fix/SPEC-042-filter-reset-bug
refactor/cleanup-task-service
hotfix/critical-auth-bug
```

### Durée de Vie des Branches

| Type | Durée Max | Action si Dépassée |
|------|-----------|-------------------|
| Feature | 5 jours | Découper ou merger partiellement |
| Hotfix | 1 jour | Priorité absolue |
| Refactor | 3 jours | Merger incrémentalement |

### Nettoyage Régulier

```bash
# Voir les branches mergées
git branch --merged main

# Supprimer les branches mergées localement
git branch --merged main | grep -v "main" | xargs -n 1 git branch -d

# Nettoyer les références remote
git fetch --prune
```

---

## Configuration CI/CD

### Workflow GitHub Actions Typique

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

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

  deploy-staging:
    needs: validate
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # ... étapes de déploiement
```

### Protection de Branche Main

```yaml
# Configuration recommandée
branch_protection:
  required_status_checks:
    strict: true
    contexts:
      - validate
  required_pull_request_reviews:
    required_approving_review_count: 1
  enforce_admins: true
```

---

## Versioning et Releases

### Semantic Versioning

```
MAJOR.MINOR.PATCH

- MAJOR : Breaking changes (incompatibilité)
- MINOR : Nouvelles fonctionnalités (rétro-compatible)
- PATCH : Bug fixes (rétro-compatible)

Exemples :
1.0.0 → 1.1.0 (nouvelle feature)
1.1.0 → 1.1.1 (bug fix)
1.1.1 → 2.0.0 (breaking change)
```

### Génération du CHANGELOG

Avec Conventional Commits, le CHANGELOG peut être généré automatiquement.

```markdown
# Changelog

## [1.2.0] - 2026-01-20

### Added
- feat(tasks): Add status filter (#42)
- feat(tasks): Add bulk delete action (#45)

### Fixed
- fix(auth): Handle expired token gracefully (#43)

### Changed
- refactor(api): Extract validation middleware (#44)

## [1.1.0] - 2026-01-10
...
```

---

## Template de Pull Request

```markdown
## Description

[Description concise du changement]

## SPEC

SPEC-XXX : [Titre de la SPEC]

## Type de Changement

- [ ] feat : Nouvelle fonctionnalité
- [ ] fix : Correction de bug
- [ ] refactor : Refactoring
- [ ] test : Tests
- [ ] docs : Documentation
- [ ] chore : Maintenance

## Changements

- [Changement 1]
- [Changement 2]
- [Changement 3]

## Screenshots (si UI)

| Avant | Après |
|-------|-------|
| [image] | [image] |

## Comment Tester

1. [Étape 1]
2. [Étape 2]
3. [Vérifier que...]

## Checklist

- [ ] Tests ajoutés/mis à jour
- [ ] Lint et typecheck passent
- [ ] Pas de console.log ou code debug
- [ ] Documentation mise à jour (si nécessaire)
- [ ] Rapport QA attaché

## Notes pour les Reviewers

[Contexte supplémentaire, points d'attention]
```

---

## Troubleshooting

### CI Échoue Après Merge

```bash
# Option 1 : Fix rapide et nouveau commit
git checkout main
git pull
# ... corriger le problème
git commit -m "fix(scope): correct issue from merge"
git push

# Option 2 : Revert si problème majeur
git revert <commit-hash>
git push
# Puis investiguer et re-merger avec fix
```

### Branche Divergée

```bash
# Mettre à jour avec main
git fetch origin
git rebase origin/main

# Résoudre les conflits si nécessaire
# Puis force push
git push --force-with-lease
```

### Merge Accidentel

```bash
# Si pas encore poussé
git reset --hard HEAD~1

# Si déjà poussé (créer un commit de revert)
git revert <commit-hash>
git push
```

---

## Exemples Pratiques

### Exemple : Merge Standard

```markdown
## SPEC-042 : Filtrage des tâches

### Préparation
- [x] CI passe
- [x] Rapport QA positif
- [x] Branche à jour avec main

### Merge
**Stratégie** : Squash and merge
**Message** :
```
feat(tasks): add status filter

- Add TaskFilter component with checkboxes
- Implement useTaskFilter hook
- Persist filter in URL params

Closes SPEC-042
```

### Post-Merge
- [x] Branche supprimée
- [x] Staging vérifié
- [x] SPEC marquée Done
```

### Exemple : Hotfix Urgent

```markdown
## Hotfix : Erreur 500 sur login

### Contexte
Bug critique en production, les utilisateurs ne peuvent pas se connecter.

### Process Accéléré
1. Branche `hotfix/critical-auth-bug` depuis main
2. Fix minimal et ciblé
3. Tests du fix uniquement
4. Review rapide par Tech Lead
5. Merge direct dans main
6. Déploiement immédiat

### Suivi
- [ ] Root cause analysée
- [ ] Tests ajoutés pour prévenir régression
- [ ] Post-mortem planifié
```

---

## Anti-patterns

### "Le Merge Force"

**Symptôme** : Merger sans que la CI passe
```
❌ "La CI est cassée mais c'est pas mon code"
```

**Solution** :
```
✅ Ne jamais merger si la CI échoue
✅ Corriger ou faire corriger avant merge
✅ La CI protège tout le monde
```

### "Le Big Bang Friday"

**Symptôme** : Merger plusieurs grosses features le vendredi soir
```
❌ "On merge tout avant le weekend"
```

**Solution** :
```
✅ Merges réguliers, petits et fréquents
✅ Pas de déploiement majeur avant congés
✅ Quelqu'un disponible pour surveiller après merge
```

### "L'Historique Spaghetti"

**Symptôme** : Historique Git illisible avec des merge commits partout
```
❌ Merge commit → merge commit → merge commit
```

**Solution** :
```
✅ Squash and merge systématique
✅ Messages de commit conventionnels
✅ Un commit = une feature/fix claire
```

### "Le Skip de Review"

**Symptôme** : Merger son propre code sans review
```
❌ "C'est une petite modif, pas besoin de review"
```

**Solution** :
```
✅ Toujours une review (même rapide)
✅ Auto-review ≠ pas de review
✅ Les petites modifs peuvent cacher de gros bugs
```

---

## Checklist de Sortie

```markdown
## Intégration Terminée - Checklist

### Merge
- [ ] PR mergée dans main
- [ ] Message de commit conforme (Conventional Commits)

### CI/CD
- [ ] CI passe sur main
- [ ] Déploiement staging déclenché
- [ ] Déploiement staging vérifié

### Cleanup
- [ ] Branche feature supprimée
- [ ] PR fermée

### Documentation
- [ ] SPEC marquée "Done"
- [ ] Ticket/issue fermé

### Communication
- [ ] Équipe notifiée
- [ ] Stakeholders informés (si applicable)
```

---

*Annexes connexes : [C.4 Boucle VALIDER](C4-boucle-valider.md) • [G.3 Setup CI/CD](G3-setup-cicd.md) • [D.2 Demo & Feedback](D2-demo-feedback.md)*
