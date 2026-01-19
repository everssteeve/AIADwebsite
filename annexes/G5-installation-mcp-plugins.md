# G.5 Installation MCP et Plugins

## Pourquoi cette annexe ?

Cette annexe guide l'installation et la configuration du Model Context Protocol (MCP) et des plugins qui étendent les capacités des agents IA.

---

## Qu'est-ce que MCP ?

Le Model Context Protocol (MCP) est un protocole ouvert qui permet aux agents IA d'interagir avec des outils et sources de données externes de manière standardisée.

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Agent IA      │────▶│   MCP Client    │────▶│   MCP Server    │
│ (Claude, etc.)  │     │   (dans IDE)    │     │ (tools/data)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                              ┌──────────────────────────┤
                              ▼                          ▼
                        ┌──────────┐              ┌──────────┐
                        │ Database │              │ API Ext  │
                        └──────────┘              └──────────┘
```

---

## Installation MCP

### Prérequis

```bash
# Node.js 18+
node --version  # v18.0.0+

# Python 3.10+ (pour certains serveurs MCP)
python3 --version  # 3.10+
```

### Installation de Base

```bash
# Installer le CLI MCP
npm install -g @modelcontextprotocol/cli

# Vérifier l'installation
mcp --version
```

---

## Serveurs MCP Populaires

### MCP Filesystem

Accès sécurisé au système de fichiers.

```bash
# Installation
npm install -g @modelcontextprotocol/server-filesystem

# Configuration
# ~/.config/claude-code/mcp.json
{
  "servers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["--root", "/path/to/project"]
    }
  }
}
```

### MCP GitHub

Interaction avec GitHub (issues, PRs, repos).

```bash
# Installation
npm install -g @modelcontextprotocol/server-github

# Configuration
{
  "servers": {
    "github": {
      "command": "mcp-server-github",
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### MCP PostgreSQL

Requêtes vers une base PostgreSQL.

```bash
# Installation
npm install -g @modelcontextprotocol/server-postgres

# Configuration
{
  "servers": {
    "postgres": {
      "command": "mcp-server-postgres",
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

### MCP Brave Search

Recherche web via Brave.

```bash
# Installation
npm install -g @anthropic-ai/mcp-server-brave-search

# Configuration
{
  "servers": {
    "brave-search": {
      "command": "mcp-server-brave-search",
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    }
  }
}
```

---

## Configuration Complète

### Fichier de Configuration

```json
// ~/.config/claude-code/mcp.json (Linux/Mac)
// %APPDATA%/claude-code/mcp.json (Windows)

{
  "version": "1.0",
  "servers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["--root", "${workspaceFolder}"],
      "capabilities": ["read", "write", "list"]
    },
    "github": {
      "command": "mcp-server-github",
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      },
      "capabilities": ["issues", "prs", "repos"]
    },
    "postgres": {
      "command": "mcp-server-postgres",
      "env": {
        "DATABASE_URL": "${env:DEV_DATABASE_URL}"
      },
      "capabilities": ["query"],
      "readOnly": true
    }
  },
  "security": {
    "allowedDomains": ["github.com", "api.github.com"],
    "requireConfirmation": ["write", "delete", "execute"]
  }
}
```

### Variables d'Environnement

```bash
# ~/.bashrc ou ~/.zshrc
export GITHUB_TOKEN=ghp_...
export DEV_DATABASE_URL=postgresql://...
export BRAVE_API_KEY=...
```

---

## Création de Serveur MCP Custom

### Structure de Base

```typescript
// mcp-server-custom/src/index.ts
import { Server } from '@modelcontextprotocol/server'
import { StdioTransport } from '@modelcontextprotocol/server/transports'

const server = new Server({
  name: 'custom-server',
  version: '1.0.0',
})

// Définir les outils disponibles
server.addTool({
  name: 'search_codebase',
  description: 'Search for patterns in the codebase',
  parameters: {
    type: 'object',
    properties: {
      pattern: { type: 'string', description: 'Search pattern (regex)' },
      fileTypes: { type: 'array', items: { type: 'string' } },
    },
    required: ['pattern'],
  },
  handler: async ({ pattern, fileTypes }) => {
    // Implémentation de la recherche
    const results = await searchCodebase(pattern, fileTypes)
    return { results }
  },
})

// Définir les ressources disponibles
server.addResource({
  uri: 'codebase://structure',
  name: 'Codebase Structure',
  description: 'Overview of the codebase structure',
  handler: async () => {
    const structure = await getCodebaseStructure()
    return { content: structure }
  },
})

// Démarrer le serveur
const transport = new StdioTransport()
server.connect(transport)
```

### Package.json

```json
{
  "name": "mcp-server-custom",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "mcp-server-custom": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/server": "^1.0.0"
  }
}
```

---

## Plugins IDE

### VS Code Extensions MCP

```json
// .vscode/extensions.json
{
  "recommendations": [
    "anthropic.claude-code",
    "mcp.mcp-tools"
  ]
}
```

### Configuration VS Code

```json
// .vscode/settings.json
{
  "mcp.servers": {
    "project-tools": {
      "command": "./scripts/mcp-server.js",
      "args": []
    }
  },
  "mcp.autoConnect": true,
  "mcp.showNotifications": true
}
```

---

## Cas d'Usage AIAD

### Serveur MCP pour Projet AIAD

```typescript
// scripts/mcp-aiad-server.ts
import { Server } from '@modelcontextprotocol/server'

const server = new Server({
  name: 'aiad-tools',
  version: '1.0.0',
})

// Outil : Lister les SPECs
server.addTool({
  name: 'list_specs',
  description: 'List all SPEC files with their status',
  handler: async () => {
    const specs = await globSpecs('docs/specs/*.md')
    return specs.map(s => ({
      id: s.id,
      title: s.title,
      status: s.status,
      priority: s.priority,
    }))
  },
})

// Outil : Obtenir les métriques
server.addTool({
  name: 'get_metrics',
  description: 'Get current AIAD metrics',
  handler: async () => {
    return {
      cycleTime: await getCycleTime(),
      coverage: await getCoverage(),
      openSpecs: await countSpecs('in_progress'),
    }
  },
})

// Ressource : PRD
server.addResource({
  uri: 'aiad://prd',
  name: 'Product Requirements Document',
  handler: async () => {
    const prd = await readFile('docs/PRD.md')
    return { content: prd }
  },
})

// Ressource : Architecture
server.addResource({
  uri: 'aiad://architecture',
  name: 'Architecture Document',
  handler: async () => {
    const arch = await readFile('docs/ARCHITECTURE.md')
    return { content: arch }
  },
})
```

---

## Troubleshooting

### Problèmes Courants

| Problème | Solution |
|----------|----------|
| Serveur ne démarre pas | Vérifier les chemins et permissions |
| Token non reconnu | Vérifier les variables d'environnement |
| Timeout sur les requêtes | Augmenter le timeout dans la config |
| Permission denied | Vérifier les capabilities configurées |

### Debug

```bash
# Démarrer le serveur en mode debug
DEBUG=mcp:* mcp-server-filesystem --root /project

# Tester la connexion
mcp test-connection filesystem

# Voir les logs
tail -f ~/.config/claude-code/logs/mcp.log
```

### Vérification

```bash
# Lister les serveurs configurés
mcp list-servers

# Tester un outil spécifique
mcp test-tool filesystem list_directory --path /project

# Vérifier les capabilities
mcp check-capabilities
```

---

## Checklist Installation MCP

```markdown
## Checklist MCP

### Installation
- [ ] CLI MCP installé
- [ ] Serveurs nécessaires installés
- [ ] Configuration créée

### Sécurité
- [ ] Tokens dans variables d'environnement
- [ ] readOnly pour DB de prod
- [ ] requireConfirmation pour actions sensibles

### Test
- [ ] Connexion testée
- [ ] Outils fonctionnels
- [ ] Logs vérifiés

### Documentation
- [ ] Serveurs documentés dans CLAUDE.md
- [ ] Équipe formée
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
