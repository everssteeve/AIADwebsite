# G.2 Installation Agents IA

## Pourquoi cette annexe ?

Les agents IA sont le moteur de productivité du framework AIAD. Un agent mal configuré génère du code incohérent, ignore vos conventions, et crée plus de travail qu'il n'en économise. Cette annexe vous guide pas à pas pour installer et configurer les principaux agents du marché, avec les réglages optimisés pour AIAD.

---

## Vue d'Ensemble des Agents

| Agent | Type | Forces | Cas d'usage AIAD |
|-------|------|--------|------------------|
| **Claude Code** | CLI | Contexte large (200k), agentic, édition multi-fichiers | Tâches complexes, refactoring |
| **Cursor** | IDE | Intégration native, édition inline fluide | Développement quotidien |
| **GitHub Copilot** | Extension | Omniprésent, autocomplétion rapide | Autocomplétion, snippets |
| **Aider** | CLI | Git-aware, pair programming | Modifications ciblées |
| **Continue** | Extension | Open source, multi-modèles | Alternative flexible |

**Recommandation AIAD** : Claude Code pour les tâches agentic + Cursor comme IDE principal.

---

## Claude Code

### Installation

```bash
# Via npm (installation globale)
npm install -g @anthropic-ai/claude-code

# Vérifier l'installation
claude --version

# OU exécution directe sans installation
npx @anthropic-ai/claude-code
```

### Configuration de la Clé API

```bash
# Option 1 : Variable d'environnement (recommandé)
export ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# Ajouter à votre shell (~/.bashrc, ~/.zshrc)
echo 'export ANTHROPIC_API_KEY=sk-ant-api03-xxxxx' >> ~/.zshrc

# Option 2 : Lors du premier lancement
claude
# L'outil demandera la clé si non configurée
```

### Configuration Projet : CLAUDE.md

Claude Code charge automatiquement le fichier `CLAUDE.md` à la racine du projet.

```markdown
# CLAUDE.md

## Project Overview
TaskFlow - Application de gestion de tâches collaborative.
Architecture moderne avec React frontend et Node.js API.

## Tech Stack
- Frontend: React 18, TypeScript, Tailwind CSS, Vite
- Backend: Node.js 20, Express, Prisma, PostgreSQL
- Testing: Vitest (unit), Playwright (E2E)

## Commands
```bash
pnpm dev          # Start dev server (frontend + backend)
pnpm test         # Run all tests
pnpm test:unit    # Unit tests only
pnpm build        # Production build
pnpm db:migrate   # Run database migrations
```

## Code Conventions
- Functional components with hooks (no class components)
- Named exports only (no default exports)
- Zod for all input validation
- Error handling: Result pattern, no throwing in services

## File Structure
- src/features/[feature]/ - Feature modules
- src/components/ui/ - Reusable UI components
- src/lib/ - Utilities and helpers

## Instructions
- Always run tests after modifications
- Follow existing patterns in the codebase
- Use TypeScript strict mode
- Write tests for new functionality
```

### Utilisation Quotidienne

```bash
# Démarrer dans le projet
cd my-project
claude

# Commandes utiles dans Claude Code
/help              # Aide
/clear             # Vider le contexte
/compact           # Compacter l'historique
/cost              # Voir les coûts de la session
```

---

## Cursor

### Installation

1. Télécharger depuis [cursor.com](https://cursor.com)
2. Installer l'application
3. Ouvrir Settings > Models > Configurer les API keys

### Configuration Projet : .cursorrules

```markdown
# .cursorrules

## Project Context
TaskFlow - Task management application.
Modern React + Node.js stack with TypeScript.

## Tech Stack
- React 18 + TypeScript + Tailwind
- Node.js + Express + Prisma
- Testing: Vitest + Playwright

## Coding Style
- Functional components only
- Named exports (no default)
- Zod validation on all inputs
- Result pattern for errors

## Rules
1. Always read existing code before modifying
2. Follow existing patterns strictly
3. Write tests for new functionality
4. Use TypeScript strict mode
5. No any types

## File Patterns
- Components: src/components/[Name]/index.tsx
- Features: src/features/[feature]/[Feature].tsx
- Services: src/services/[name].service.ts
- Types: src/types/[domain].ts
```

### Raccourcis Essentiels

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Chat avec contexte | Ctrl + L | Cmd + L |
| Edit inline | Ctrl + K | Cmd + K |
| Accepter suggestion | Tab | Tab |
| Rejeter suggestion | Esc | Esc |
| Ajouter fichier au contexte | Ctrl + Shift + L | Cmd + Shift + L |

### Workflow Recommandé

1. **Ouvrir le projet** dans Cursor (`.cursorrules` chargé automatiquement)
2. **Sélectionner le code** pertinent dans l'éditeur
3. **Cmd/Ctrl + L** pour ouvrir le chat avec contexte
4. **Décrire la modification** souhaitée
5. **Review** le code proposé
6. **Appliquer** ou itérer

---

## GitHub Copilot

### Installation

**VS Code :**
1. Ouvrir Extensions (Ctrl/Cmd + Shift + X)
2. Rechercher "GitHub Copilot"
3. Installer
4. Se connecter avec un compte GitHub (licence requise)

**JetBrains :**
1. Settings > Plugins > Marketplace
2. Rechercher "GitHub Copilot"
3. Installer et redémarrer

### Configuration

```json
// .vscode/settings.json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "markdown": true,
    "plaintext": false
  }
}
```

### Instructions Personnalisées

```markdown
# .github/copilot-instructions.md

## Project: TaskFlow

### Stack
- React 18, TypeScript, Tailwind CSS
- Node.js, Express, Prisma

### Conventions
- Functional components with hooks
- Named exports only
- Zod for validation
- Result pattern for errors

### Patterns to Follow
- Use existing components from src/components/ui
- Services return Promise<Result<T, E>>
- All API calls go through src/lib/api-client.ts

### Avoid
- Class components
- Default exports
- Any types
- Direct fetch() calls
```

### Utilisation Efficace

```typescript
// Copilot fonctionne mieux avec des commentaires descriptifs

// Créer une fonction qui filtre les tâches par statut et date
// Input: tasks (Task[]), status (TaskStatus), dateRange ({from, to})
// Output: tâches filtrées triées par date décroissante
// Gérer le cas où dateRange est undefined (retourner toutes les tâches du statut)
function filterTasksByStatusAndDate(
  // Copilot complète ici
```

---

## Aider

### Installation

```bash
# Via pipx (recommandé - isolation)
pipx install aider-chat

# OU via pip
pip install aider-chat

# Vérifier
aider --version
```

### Configuration

```bash
# Clé API
export ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
# OU
export OPENAI_API_KEY=sk-xxxxx
```

```yaml
# ~/.aider.conf.yml
model: claude-sonnet-4-20250514
auto-commits: true
dirty-commits: false
attribute-author: true
attribute-committer: false
```

### Utilisation

```bash
# Démarrer dans le projet
cd my-project
aider

# Avec fichiers spécifiques
aider src/services/TaskService.ts src/types/task.ts

# Mode watch (recharge automatique)
aider --watch
```

### Commandes Aider

| Commande | Action |
|----------|--------|
| `/add <file>` | Ajouter un fichier au contexte |
| `/drop <file>` | Retirer un fichier du contexte |
| `/ls` | Lister les fichiers en contexte |
| `/diff` | Voir les changements |
| `/undo` | Annuler le dernier changement |
| `/commit` | Committer les changements |
| `/help` | Aide |

---

## Continue

### Installation

**VS Code :**
1. Extensions > Rechercher "Continue"
2. Installer
3. Configuration dans `~/.continue/config.json`

### Configuration Multi-Modèles

```json
// ~/.continue/config.json
{
  "models": [
    {
      "title": "Claude Sonnet",
      "provider": "anthropic",
      "model": "claude-sonnet-4-20250514",
      "apiKey": "sk-ant-..."
    },
    {
      "title": "GPT-4",
      "provider": "openai",
      "model": "gpt-4-turbo",
      "apiKey": "sk-..."
    }
  ],
  "tabAutocompleteModel": {
    "title": "Codestral",
    "provider": "mistral",
    "model": "codestral-latest",
    "apiKey": "..."
  },
  "customCommands": [
    {
      "name": "review",
      "prompt": "Review ce code pour bugs, sécurité et améliorations :\n\n{{{ input }}}"
    },
    {
      "name": "test",
      "prompt": "Écris des tests complets pour :\n\n{{{ input }}}"
    }
  ]
}
```

### Raccourcis

| Action | Raccourci |
|--------|-----------|
| Ouvrir chat | Ctrl/Cmd + L |
| Edit sélection | Ctrl/Cmd + I |
| Action rapide | Ctrl/Cmd + Shift + L |

---

## Comparaison et Choix

### Matrice de Décision

| Critère | Claude Code | Cursor | Copilot | Aider | Continue |
|---------|-------------|--------|---------|-------|----------|
| Contexte large | ★★★ | ★★ | ★ | ★★ | ★★ |
| Intégration IDE | ★ | ★★★ | ★★★ | ★ | ★★★ |
| Tâches agentic | ★★★ | ★★ | ★ | ★★ | ★ |
| Autocomplétion | ★ | ★★★ | ★★★ | ★ | ★★ |
| Multi-fichiers | ★★★ | ★★ | ★ | ★★★ | ★ |
| Open source | ✗ | ✗ | ✗ | ✓ | ✓ |

### Configurations Recommandées

**Setup Optimal AIAD :**
- Claude Code pour tâches complexes et agentic
- Cursor comme IDE principal

**Setup Budget :**
- Aider (CLI) + Continue avec mix de modèles
- Codestral pour autocomplétion (gratuit)

**Setup Enterprise :**
- GitHub Copilot (souvent inclus dans les licences)
- Claude Code pour les tâches complexes

---

## Exemples Pratiques

### Exemple 1 : Premier Setup Claude Code

```bash
# 1. Installer
npm install -g @anthropic-ai/claude-code

# 2. Configurer la clé
export ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# 3. Créer le CLAUDE.md
cat > CLAUDE.md << 'EOF'
# CLAUDE.md

## Project Overview
Mon premier projet AIAD.

## Tech Stack
- React, TypeScript, Vite

## Commands
pnpm dev    # Development
pnpm build  # Production

## Instructions
- Follow existing code patterns
- Write tests for new code
EOF

# 4. Lancer
claude
```

### Exemple 2 : Configuration Cursor + CLAUDE.md

```bash
# Créer .cursorrules à partir du CLAUDE.md
cat CLAUDE.md | sed 's/# CLAUDE.md/# .cursorrules/' > .cursorrules

# Ajouter des règles spécifiques Cursor
cat >> .cursorrules << 'EOF'

## Cursor-specific Rules
- Always show diffs before applying
- Prefer small, focused changes
- Ask before modifying multiple files
EOF
```

---

## Anti-patterns

### ❌ Pas d'AGENT-GUIDE

**Problème** : L'agent génère du code qui ne suit pas vos conventions. Chaque génération est incohérente.

**Solution** : Toujours créer CLAUDE.md / .cursorrules avec stack, conventions, et instructions.

### ❌ Contexte trop large

```bash
# MAUVAIS : tout le projet en contexte
aider $(find . -name "*.ts")
```

**Problème** : L'agent est noyé, les réponses sont lentes et imprécises.

**Solution** : Ajouter uniquement les fichiers pertinents pour la tâche.

### ❌ Prompts vagues

```
# MAUVAIS
"Améliore ce code"

# BON
"Refactorise TaskService.createTask() pour :
1. Valider l'input avec Zod
2. Retourner un Result<Task, ValidationError>
3. Ajouter les tests unitaires"
```

### ❌ Pas de review du code généré

**Problème** : Le code généré contient des bugs, des failles de sécurité, ou ne suit pas les patterns.

**Solution** : Toujours relire, tester, et valider avant de committer.

### ❌ Dépendance à un seul agent

**Problème** : Si l'API est down ou le modèle change, vous êtes bloqué.

**Solution** : Maîtriser au moins deux agents (ex: Claude Code + Aider).

---

## Troubleshooting

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| "API key invalid" | Clé mal configurée | Vérifier `echo $ANTHROPIC_API_KEY` |
| Contexte non chargé | Fichier mal nommé | Vérifier le nom exact (CLAUDE.md, .cursorrules) |
| Suggestions incohérentes | AGENT-GUIDE incomplet | Ajouter plus de contexte et exemples |
| Rate limiting | Trop de requêtes | Utiliser un modèle moins cher pour le draft |
| Code non conforme | Instructions floues | Préciser les conventions dans l'AGENT-GUIDE |

### Vérification de l'Installation

```bash
# Claude Code
claude --version
echo $ANTHROPIC_API_KEY | head -c 15

# Aider
aider --version
aider --check-api-key

# Vérifier les fichiers de config
cat CLAUDE.md
cat .cursorrules
cat .github/copilot-instructions.md
```

---

## Checklist Installation Agent

```markdown
## Checklist Installation Agent IA

### Prérequis
- [ ] Node.js 18+ installé
- [ ] Clé API obtenue (Anthropic/OpenAI)
- [ ] Clé API configurée en variable d'environnement

### Installation
- [ ] Agent installé (claude/aider/continue)
- [ ] Version vérifiée
- [ ] Premier lancement réussi

### Configuration Projet
- [ ] CLAUDE.md créé
- [ ] .cursorrules créé (si Cursor)
- [ ] .github/copilot-instructions.md créé (si Copilot)
- [ ] Stack documentée
- [ ] Conventions documentées
- [ ] Commandes documentées

### Validation
- [ ] Agent charge le contexte projet
- [ ] Génération de code respecte les conventions
- [ ] L'équipe sait utiliser l'agent
```

---

*Voir aussi : [G.1 Configuration Environnement](G1-configuration-environnement.md) · [A.3 Template AGENT-GUIDE](A3-agent-guide.md) · [H.1 Prompts Efficaces](H1-prompts-efficaces.md)*
