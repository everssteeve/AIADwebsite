# C.5 Boucle INTÉGRER - Détails

## Pourquoi cette annexe ?

Cette annexe détaille la boucle INTÉGRER : les Conventional Commits, les stratégies de merge et le processus de release.

---

## Vue d'Ensemble

### Objectif de la Boucle
Intégrer le code validé dans la branche principale de manière sûre et traçable.

### Durée Typique
15 minutes à 1 heure (hors résolution de conflits).

### Participant Principal
**Product Engineer** avec review optionnelle du Tech Lead.

---

## Conventional Commits

### Format Standard

```
<type>(<scope>): <description>

[body optionnel]

[footer optionnel]
```

### Types de Commits

| Type | Usage | Exemple |
|------|-------|---------|
| `feat` | Nouvelle fonctionnalité | `feat(tasks): add delete button` |
| `fix` | Correction de bug | `fix(auth): handle expired tokens` |
| `docs` | Documentation uniquement | `docs(readme): update setup instructions` |
| `style` | Formatage (pas de changement de code) | `style(tasks): fix indentation` |
| `refactor` | Refactoring (pas de feat ni fix) | `refactor(api): extract validation logic` |
| `test` | Ajout ou modification de tests | `test(tasks): add filter edge cases` |
| `chore` | Maintenance (deps, config) | `chore(deps): update react to 18.3` |
| `perf` | Amélioration de performance | `perf(list): virtualize long lists` |

### Scopes Courants

Définir les scopes du projet dans l'AGENT-GUIDE :

```markdown
## Scopes de Commit

- `tasks` : Fonctionnalités liées aux tâches
- `projects` : Fonctionnalités liées aux projets
- `auth` : Authentification et autorisation
- `api` : Backend API
- `ui` : Composants UI génériques
- `db` : Base de données et migrations
- `deps` : Dépendances
```

### Exemples Complets

```bash
# Feature simple
git commit -m "feat(tasks): add status filter"

# Feature avec body explicatif
git commit -m "feat(tasks): add bulk delete action

Allow users to select multiple tasks and delete them at once.
Includes confirmation modal and optimistic updates."

# Fix avec référence issue
git commit -m "fix(tasks): prevent duplicate creation on double-click

Closes #123"

# Breaking change
git commit -m "feat(api)!: change task status enum values

BREAKING CHANGE: Status values changed from 'TODO'/'DONE' to 'todo'/'done'.
Run migration to update existing data."
```

### Règles de Message

| ✅ Bon | ❌ Mauvais |
|--------|-----------|
| `feat(tasks): add filter by assignee` | `added filter` |
| `fix(auth): handle token refresh error` | `fix bug` |
| `refactor(api): extract validation to middleware` | `refactoring` |
| Présent simple, impératif | Passé, description vague |

---

## Stratégies de Merge

### Option 1 : Squash and Merge (Recommandé)

```
feature-branch:  A --- B --- C --- D
                                   │
main:            M ─────────────── S (squash de A+B+C+D)
```

**Quand l'utiliser :**
- Feature branches avec plusieurs commits de travail
- Historique propre souhaité
- Commits intermédiaires pas significatifs

**Configuration GitHub/GitLab :**
```yaml
# .github/settings.yml
repository:
  allow_squash_merge: true
  allow_merge_commit: false
  allow_rebase_merge: false
```

### Option 2 : Rebase and Merge

```
feature-branch:  A --- B --- C
                             │
main:            M --- A' --- B' --- C' (commits réappliqués)
```

**Quand l'utiliser :**
- Chaque commit est significatif et propre
- Besoin de l'historique détaillé
- Équipe familière avec le rebase

### Option 3 : Merge Commit

```
feature-branch:  A --- B --- C
                             │
main:            M ────────── M' (merge commit)
```

**Quand l'utiliser :**
- Besoin de traçabilité des branches
- Équipes avec processus de release formels

### Recommandation AIAD

**Squash and Merge** par défaut car :
- Historique propre (1 commit = 1 feature/fix)
- Message de commit contrôlé au merge
- Pas besoin de maintenir des commits parfaits en cours de dev

---

## Processus d'Intégration

### Étape 1 : Préparation

```markdown
## Checklist Pré-Merge

- [ ] Validation QA passée
- [ ] CI passe (tous les checks verts)
- [ ] PR à jour avec main (rebase si nécessaire)
- [ ] Pas de conflits
- [ ] Description de PR complète
- [ ] Reviewers assignés (si requis)
```

### Étape 2 : Review (si applicable)

```markdown
## Checklist Review

### Automatique (CI)
- [ ] Lint
- [ ] Typecheck
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Tests E2E

### Manuelle (Reviewer)
- [ ] Code lisible et maintenable
- [ ] Pas de problème de sécurité évident
- [ ] Patterns du projet respectés
- [ ] Tests suffisants
```

### Étape 3 : Résolution de Conflits

```bash
# Mettre à jour la branche avec main
git fetch origin
git rebase origin/main

# Résoudre les conflits fichier par fichier
# Pour chaque fichier en conflit :
git add <fichier-résolu>

# Continuer le rebase
git rebase --continue

# Pousser (force car rebase)
git push --force-with-lease
```

**Règles de résolution :**
- En cas de doute, consulter l'auteur de l'autre changement
- Tester après résolution
- Ne jamais écraser du code sans comprendre

### Étape 4 : Merge

```bash
# Via l'interface GitHub/GitLab (recommandé)
# ou en ligne de commande :

git checkout main
git merge --squash feature-branch
git commit -m "feat(scope): description

Corps du message avec détails.

Closes #XXX"
git push origin main
```

### Étape 5 : Post-Merge

```markdown
## Checklist Post-Merge

- [ ] Branche feature supprimée
- [ ] Déploiement automatique déclenché (si CI/CD)
- [ ] Vérification en staging
- [ ] Ticket/SPEC mis à jour (status: Done)
- [ ] Communication si feature visible
```

---

## Template de Pull Request

```markdown
## Description

[Description concise de ce que fait cette PR]

## Lien SPEC

SPEC-XXX : [Titre]

## Type de Changement

- [ ] feat : Nouvelle fonctionnalité
- [ ] fix : Correction de bug
- [ ] refactor : Refactoring
- [ ] docs : Documentation
- [ ] test : Tests
- [ ] chore : Maintenance

## Changements

- [Changement 1]
- [Changement 2]
- [Changement 3]

## Screenshots (si UI)

[Avant/Après si applicable]

## Tests

- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration ajoutés (si applicable)
- [ ] Tests manuels effectués

## Checklist

- [ ] Code auto-reviewé
- [ ] Pas de console.log ou code debug
- [ ] Pas de secrets exposés
- [ ] Documentation mise à jour (si nécessaire)

## Notes pour les Reviewers

[Instructions ou contexte pour la review]
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
```

### Durée de Vie des Branches

| Type | Durée Max | Action si Dépassée |
|------|-----------|-------------------|
| Feature | 5 jours | Découper ou merger partiellement |
| Hotfix | 1 jour | Priorité absolue |
| Refactor | 3 jours | Merger incrémentalement |

### Nettoyage

```bash
# Supprimer les branches mergées localement
git branch --merged | grep -v "main" | xargs -n 1 git branch -d

# Supprimer les références aux branches distantes supprimées
git fetch --prune
```

---

## Release et Versioning

### Semantic Versioning

```
MAJOR.MINOR.PATCH

- MAJOR : Breaking changes
- MINOR : Nouvelles fonctionnalités (backward compatible)
- PATCH : Bug fixes
```

### Génération de CHANGELOG

Avec Conventional Commits, le CHANGELOG peut être généré automatiquement :

```bash
# Avec standard-version
npx standard-version

# Ou avec release-please
# (configuré dans GitHub Actions)
```

### Template CHANGELOG

```markdown
# Changelog

## [1.2.0] - 2026-01-18

### Added
- feat(tasks): Filter tasks by status (#42)
- feat(tasks): Bulk delete action (#45)

### Fixed
- fix(auth): Handle expired token gracefully (#43)

### Changed
- refactor(api): Extract validation middleware (#44)

## [1.1.0] - 2026-01-10

...
```

---

## CI/CD Integration

### Workflow Typique

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
      # ... deploy steps
```

### Protection de Branche

```yaml
# Configuration recommandée pour main
branch_protection:
  required_status_checks:
    strict: true
    contexts:
      - validate
  required_pull_request_reviews:
    required_approving_review_count: 1
  enforce_admins: true
  restrictions: null
```

---

## Troubleshooting

### Conflit de Merge

```bash
# Voir les fichiers en conflit
git status

# Après résolution manuelle
git add <fichiers>
git rebase --continue
# ou
git merge --continue
```

### CI qui Échoue Après Merge

```bash
# Revert rapide si nécessaire
git revert <commit-hash>
git push

# Puis investiguer et re-merger avec fix
```

### Branche Divergée

```bash
# Si la branche a divergé de main
git fetch origin
git rebase origin/main

# Résoudre les conflits
# Puis force push
git push --force-with-lease
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
