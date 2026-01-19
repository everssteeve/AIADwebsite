# G.2 Installation Agents IA

## Pourquoi cette annexe ?

Cette annexe fournit les instructions d'installation et de configuration des principaux agents IA du marché pour une utilisation dans le cadre AIAD.

---

## Vue d'Ensemble des Agents

| Agent | Type | Points Forts |
|-------|------|--------------|
| Claude Code | CLI | Agentic, contexte large, édition de fichiers |
| Cursor | IDE | Intégration native, édition inline |
| GitHub Copilot | Extension | Omniprésent, autocomplétion rapide |
| Aider | CLI | Git-aware, pair programming |
| Continue | Extension | Open source, flexible |

---

## Claude Code

### Installation

```bash
# Via npm (global)
npm install -g @anthropic-ai/claude-code

# Ou via npx (sans installation)
npx @anthropic-ai/claude-code
```

### Configuration

```bash
# Configurer la clé API
export ANTHROPIC_API_KEY=sk-ant-...

# Ou via fichier de config
echo "ANTHROPIC_API_KEY=sk-ant-..." >> ~/.claude-code/config
```

### Usage avec AIAD

```bash
# Dans le dossier du projet (avec CLAUDE.md)
claude-code

# Le CLAUDE.md est automatiquement chargé comme contexte
```

### CLAUDE.md Template

```markdown
# CLAUDE.md

## Project Overview
[Description du projet]

## Tech Stack
- [Technologies]

## Commands
```bash
pnpm dev        # Development
pnpm test       # Tests
pnpm build      # Build
```

## Code Conventions
- [Conventions]

## Instructions
- [Instructions spécifiques pour l'agent]
```

---

## Cursor

### Installation

1. Télécharger depuis [cursor.com](https://cursor.com)
2. Installer l'application
3. Configurer les API keys dans Settings

### Configuration AIAD

```markdown
# .cursorrules (à la racine du projet)

## Project Context
[Description du projet]

## Tech Stack
- [Technologies]

## Coding Style
- [Conventions]

## Rules
- Always read existing code before modifying
- Follow existing patterns
- Write tests for new functionality
```

### Raccourcis Utiles

| Action | Raccourci |
|--------|-----------|
| Chat avec contexte | Cmd/Ctrl + L |
| Edit inline | Cmd/Ctrl + K |
| Generate code | Cmd/Ctrl + Shift + K |
| Accept suggestion | Tab |

### Usage Recommandé

```markdown
## Workflow Cursor + AIAD

1. Ouvrir le projet dans Cursor
2. .cursorrules chargé automatiquement
3. Sélectionner le code pertinent
4. Cmd+L pour chat avec contexte
5. Décrire la modification souhaitée
6. Review et appliquer
```

---

## GitHub Copilot

### Installation

```bash
# VS Code
# 1. Installer l'extension "GitHub Copilot"
# 2. Se connecter avec un compte GitHub (avec licence)

# JetBrains
# 1. Installer le plugin "GitHub Copilot"
# 2. Se connecter
```

### Configuration

```json
// .vscode/settings.json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": false,
    "markdown": true
  },
  "github.copilot.advanced": {
    "length": 500,
    "temperature": 0.1
  }
}
```

### Instructions Personnalisées

```markdown
# .github/copilot-instructions.md

## Project: [Name]

### Tech Stack
- [Technologies]

### Conventions
- [Coding conventions]

### Patterns
- [Patterns to follow]

### Avoid
- [Anti-patterns]
```

### Usage avec AIAD

```markdown
## Best Practices Copilot + AIAD

1. Copilot pour l'autocomplétion rapide
2. Commentaires descriptifs pour guider
3. Nommer clairement les fonctions/variables
4. Utiliser Copilot Chat pour les questions

## Exemple
// Créer une fonction qui filtre les tâches par statut
// Input: tasks (Task[]), statuses (string[])
// Output: tâches filtrées
// Gérer le cas où statuses est vide (retourner tout)
function filterTasksByStatus(

[Copilot complète]
```

---

## Aider

### Installation

```bash
# Via pip
pip install aider-chat

# Ou via pipx (recommandé)
pipx install aider-chat
```

### Configuration

```bash
# Configurer l'API key
export ANTHROPIC_API_KEY=sk-ant-...

# Ou OpenAI
export OPENAI_API_KEY=sk-...

# Fichier de config
# ~/.aider.conf.yml
model: claude-3-opus-20240229
auto-commits: true
dirty-commits: false
```

### Usage

```bash
# Démarrer dans le projet
cd project-name
aider

# Avec des fichiers spécifiques
aider src/services/TaskService.ts src/types/task.ts

# Mode watch (auto-reload)
aider --watch
```

### Commandes Aider

| Commande | Action |
|----------|--------|
| `/add file` | Ajouter un fichier au contexte |
| `/drop file` | Retirer un fichier du contexte |
| `/diff` | Voir les changements |
| `/undo` | Annuler le dernier changement |
| `/commit` | Committer les changements |

### Intégration AIAD

```markdown
## Workflow Aider + AIAD

1. Aider lit automatiquement le README et les conventions
2. Commencer par ajouter les fichiers pertinents
3. Décrire la modification en langage naturel
4. Aider propose des modifications
5. Review dans le diff
6. Accepter ou itérer
7. Auto-commit avec message conventionnel
```

---

## Continue

### Installation

```bash
# VS Code
# 1. Installer l'extension "Continue"
# 2. Configurer dans ~/.continue/config.json

# JetBrains
# 1. Installer le plugin "Continue"
```

### Configuration

```json
// ~/.continue/config.json
{
  "models": [
    {
      "title": "Claude 3 Opus",
      "provider": "anthropic",
      "model": "claude-3-opus-20240229",
      "apiKey": "sk-ant-..."
    },
    {
      "title": "GPT-4",
      "provider": "openai",
      "model": "gpt-4-turbo-preview",
      "apiKey": "sk-..."
    }
  ],
  "tabAutocompleteModel": {
    "title": "Codestral",
    "provider": "mistral",
    "model": "codestral-latest"
  },
  "customCommands": [
    {
      "name": "review",
      "prompt": "Review this code for bugs, security issues, and improvements:\n\n{{{ input }}}"
    },
    {
      "name": "test",
      "prompt": "Write comprehensive tests for:\n\n{{{ input }}}"
    }
  ]
}
```

### Usage

| Action | Raccourci |
|--------|-----------|
| Open chat | Cmd/Ctrl + L |
| Edit selection | Cmd/Ctrl + I |
| Quick action | Cmd/Ctrl + Shift + L |

---

## Comparaison et Choix

### Matrice de Décision

| Critère | Claude Code | Cursor | Copilot | Aider |
|---------|-------------|--------|---------|-------|
| Contexte large | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐ |
| Intégration IDE | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| Agentic tasks | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐ |
| Autocomplétion | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| Prix | $$$ | $$ | $ | $$$ |
| Open source | ❌ | ❌ | ❌ | ✅ |

### Recommandations AIAD

```markdown
## Configuration Recommandée

### Setup Principal
- **Claude Code** pour les tâches complexes et agentic
- **Cursor** comme IDE principal

### Alternative Budget
- **Aider** pour le CLI
- **Continue** avec modèles mix (Opus pour complex, Codestral pour autocomplete)

### Enterprise
- **GitHub Copilot** (souvent déjà inclus)
- Complémenter avec Claude Code pour les tâches complexes
```

---

## Troubleshooting

### Problèmes Courants

| Problème | Solution |
|----------|----------|
| API key non reconnue | Vérifier les variables d'environnement |
| Contexte non chargé | Vérifier le nom du fichier (CLAUDE.md, .cursorrules) |
| Suggestions incorrectes | Améliorer l'AGENT-GUIDE |
| Rate limiting | Utiliser un modèle moins cher pour le draft |
| Code généré incohérent | Fournir plus d'exemples dans l'AGENT-GUIDE |

### Vérification de l'Installation

```bash
# Claude Code
claude-code --version
echo $ANTHROPIC_API_KEY | head -c 10

# Aider
aider --version
aider --check-api-key

# Vérifier la config Cursor
cat .cursorrules

# Vérifier Copilot instructions
cat .github/copilot-instructions.md
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
