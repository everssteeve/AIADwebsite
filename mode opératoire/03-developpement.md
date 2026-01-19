# PARTIE 3 : PHASE DE DÉVELOPPEMENT

Le Product Engineer orchestre l'agent IA pour implémenter les SPECS, une fonctionnalité à la fois.

## 3.1 Workflow quotidien

| Heure | Activité | Durée |
|-------|----------|-------|
| 9h00 | Synchro équipe | 15 min |
| 9h15 | Revue contexte (PRD, ARCHITECTURE) | 15 min |
| 9h30 | Préparation première SPEC | 45 min |
| 10h30 | Session Claude Code - Tâche 1 | 90 min |
| 12h00 | Validation et tests | 30 min |
| 14h00 | Session Claude Code - Tâche 2 | 90 min |
| 15h30 | Revue de code | 30 min |
| 16h00 | Mise à jour CLAUDE.md | 15 min |
| 16h15 | Git commit/push | 15 min |

## 3.2 Cycle d'une fonctionnalité

### 3.2.1 Étape 1 : Lancement

```bash
# 1. TOUJOURS nettoyer le contexte
/clear

# 2. Vérifier l'espace disponible
/context

# 3. Prompt structuré
Implémente la fonctionnalité :

**SPEC** : @docs/specs/T-001-2-route-post-tasks.md
**Contexte** : @CLAUDE.md
**Architecture** : @docs/ARCHITECTURE.md

Instructions :
1. Lis la SPEC en entier
2. Crée les fichiers dans l'ordre indiqué
3. Gère tous les cas d'erreur
4. N'ajoute PAS de fonctionnalités non spécifiées

Montre ton plan avant de coder.
```

### 3.2.2 Étape 2 : Validation

```markdown
# Checklist validation
☐ Le code compile (npm run build)
☐ Les fichiers sont au bon endroit
☐ Les imports sont corrects
☐ Le linting passe (npm run lint)
☐ La logique correspond à la SPEC

# Si problèmes, demander une revue
Revois le code avec l'agent code-reviewer :
@apps/api/src/services/taskService.ts
```

### 3.2.3 Étape 3 : Correction

```
# Prompt de correction
J'ai identifié ces problèmes :
1. [Problème 1]
2. [Problème 2]

Corrige en respectant la SPEC @docs/specs/T-001-2.md

# Si trop de problèmes
/rewind

# Limite : 3 itérations max
# Si toujours bloqué : revoir la SPEC ou escalader
```

### 3.2.4 Étape 4 : Tests

```bash
# Génération des tests
Génère les tests pour @apps/api/src/services/taskService.ts
selon les scénarios de @docs/specs/T-001-2.md

Utilise Jest et les conventions de @CLAUDE.md

# Exécution
npm run test

# Couverture
npm run test:coverage
# Cible : > 80% backend, > 70% frontend
```

### 3.2.5 Étape 5 : Revue

```
# Revue automatique
Revue de code avec l'agent code-reviewer :
@apps/api/src/services/taskService.ts
@apps/api/src/__tests__/taskService.test.ts

# Impliquer Tech Lead si :
# - Changement d'architecture
# - Nouvelle dépendance
# - Code complexe (> 200 lignes)
```

### 3.2.6 Étape 6 : Documentation

```
# Mise à jour documentation
Mets à jour la doc pour la nouvelle fonctionnalité :
1. Ajoute l'endpoint dans @docs/API.md
2. Documente les fonctions complexes avec JSDoc
```

### 3.2.7 Étape 7 : Merge

```bash
# Commandes Git
git status
git add .
git commit -m "feat(api): add POST /api/tasks endpoint

- Create task with title, description, deadline
- Add validation and error handling
- Add unit tests

Closes #123"

git push origin feature/create-task

# Nettoyage pour la prochaine tâche
/clear
```

## 3.3 Gestion des problèmes

| Problème | Cause | Solution |
|----------|-------|----------|
| Code hors sujet | SPEC ambiguë | Reformuler avec exemples |
| Boucle infinie | Tâche trop complexe | Découper davantage |
| Erreurs TypeScript | Types manquants | Demander de typer |
| Tests échouent | Mock incorrect | Vérifier les mocks |

> ⚠️ **ATTENTION**
> Si vous corrigez la même erreur plusieurs fois, ajoutez une règle dans CLAUDE.md.
