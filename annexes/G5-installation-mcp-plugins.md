# G.5 Installation MCP et Plugins

## Pourquoi cette annexe ?

Les agents IA sont puissants mais limités à leur contexte de base. Le Model Context Protocol (MCP) leur permet d'interagir avec vos bases de données, APIs, et outils externes de manière standardisée et sécurisée. Cette annexe vous guide pas à pas pour installer, configurer et créer des serveurs MCP qui décuplent les capacités de vos agents.

---

## Comprendre MCP

### Qu'est-ce que MCP ?

Le **Model Context Protocol** (MCP) est un protocole ouvert qui permet aux agents IA de :
- Accéder à des sources de données externes (DB, APIs, fichiers)
- Utiliser des outils spécialisés (recherche, manipulation de données)
- Exécuter des actions dans des systèmes tiers

### Architecture

```
┌─────────────────┐                    ┌─────────────────┐
│                 │                    │                 │
│   Agent IA      │◀──── MCP ────────▶│  MCP Server     │
│  (Claude Code)  │    Protocol        │   (Tools)       │
│                 │                    │                 │
└─────────────────┘                    └────────┬────────┘
                                                │
                              ┌─────────────────┼─────────────────┐
                              │                 │                 │
                              ▼                 ▼                 ▼
                        ┌──────────┐     ┌──────────┐     ┌──────────┐
                        │ Database │     │   API    │     │  Files   │
                        │ (Postgres)│     │ (GitHub) │     │ (Local)  │
                        └──────────┘     └──────────┘     └──────────┘
```

### Composants

| Composant | Rôle |
|-----------|------|
| **MCP Client** | Intégré dans l'agent (Claude Code, Cursor) |
| **MCP Server** | Expose des outils et ressources |
| **Tools** | Actions que l'agent peut exécuter |
| **Resources** | Données que l'agent peut lire |

---

## Installation

### Prérequis

```bash
# Node.js 18+ requis
node --version  # v18.0.0 ou supérieur

# Python 3.10+ (pour certains serveurs MCP)
python3 --version  # 3.10 ou supérieur

# pnpm ou npm
pnpm --version
```

### Installation du CLI MCP

```bash
# Installer le CLI MCP globalement
npm install -g @modelcontextprotocol/cli

# Vérifier l'installation
mcp --version

# Voir l'aide
mcp --help
```

---

## Serveurs MCP Populaires

### MCP Filesystem (Accès Fichiers)

Accès sécurisé au système de fichiers local.

```bash
# Installation
npm install -g @modelcontextprotocol/server-filesystem

# Test
mcp-server-filesystem --help
```

**Configuration :**

```json
// Ajouter à la config MCP de Claude Code
{
  "servers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["--root", "/path/to/project"],
      "capabilities": ["read", "write", "list"]
    }
  }
}
```

**Cas d'usage** : Navigation dans le projet, lecture de fichiers de config, exploration de la structure.

### MCP GitHub (Issues, PRs, Repos)

Interaction avec l'API GitHub.

```bash
# Installation
npm install -g @modelcontextprotocol/server-github
```

**Configuration :**

```json
{
  "servers": {
    "github": {
      "command": "mcp-server-github",
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      },
      "capabilities": ["issues", "pull_requests", "repositories"]
    }
  }
}
```

**Cas d'usage** : Créer des issues, lister les PRs, récupérer des informations de repo.

### MCP PostgreSQL (Requêtes DB)

Exécuter des requêtes SQL sur PostgreSQL.

```bash
# Installation
npm install -g @modelcontextprotocol/server-postgres
```

**Configuration :**

```json
{
  "servers": {
    "postgres": {
      "command": "mcp-server-postgres",
      "env": {
        "DATABASE_URL": "${env:DEV_DATABASE_URL}"
      },
      "capabilities": ["query"],
      "readOnly": true  // Recommandé pour la sécurité
    }
  }
}
```

**Cas d'usage** : Explorer le schéma, requêter des données de dev, générer des migrations.

### MCP Brave Search (Recherche Web)

Recherche web via l'API Brave Search.

```bash
# Installation
npm install -g @anthropic-ai/mcp-server-brave-search
```

**Configuration :**

```json
{
  "servers": {
    "brave-search": {
      "command": "mcp-server-brave-search",
      "env": {
        "BRAVE_API_KEY": "${env:BRAVE_API_KEY}"
      }
    }
  }
}
```

**Cas d'usage** : Rechercher de la documentation, trouver des solutions à des erreurs.

---

## Configuration Complète

### Fichier de Configuration MCP

```json
// Linux/Mac: ~/.config/claude-code/mcp.json
// Windows: %APPDATA%/claude-code/mcp.json

{
  "version": "1.0",
  "servers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["--root", "${workspaceFolder}"],
      "capabilities": ["read", "list"],
      "description": "Accès au système de fichiers du projet"
    },
    "github": {
      "command": "mcp-server-github",
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      },
      "capabilities": ["issues", "pull_requests"],
      "description": "Interaction avec GitHub"
    },
    "postgres-dev": {
      "command": "mcp-server-postgres",
      "env": {
        "DATABASE_URL": "${env:DEV_DATABASE_URL}"
      },
      "capabilities": ["query"],
      "readOnly": true,
      "description": "Base de données de développement (lecture seule)"
    }
  },
  "security": {
    "allowedDomains": [
      "github.com",
      "api.github.com"
    ],
    "requireConfirmation": [
      "write",
      "delete",
      "execute"
    ]
  }
}
```

### Variables d'Environnement

```bash
# ~/.bashrc ou ~/.zshrc

# GitHub
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Database (DEV uniquement)
export DEV_DATABASE_URL=postgresql://dev:dev@localhost:5432/myapp_dev

# Brave Search (optionnel)
export BRAVE_API_KEY=BSA_xxxxxxxxxxxxxxxxxxxx
```

---

## Création d'un Serveur MCP Custom

### Structure du Projet

```
mcp-server-myproject/
├── src/
│   └── index.ts          # Point d'entrée
├── package.json
├── tsconfig.json
└── README.md
```

### Implémentation de Base

```typescript
// src/index.ts
import { Server } from '@modelcontextprotocol/server'
import { StdioTransport } from '@modelcontextprotocol/server/transports'

// Créer le serveur
const server = new Server({
  name: 'myproject-tools',
  version: '1.0.0',
  description: 'Outils spécifiques au projet'
})

// Définir un outil
server.addTool({
  name: 'list_specs',
  description: 'Liste toutes les SPECs du projet avec leur statut',
  parameters: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['draft', 'ready', 'in_progress', 'done'],
        description: 'Filtrer par statut (optionnel)'
      }
    }
  },
  handler: async ({ status }) => {
    // Implémentation
    const specs = await listSpecs(status)
    return {
      content: specs.map(s => ({
        id: s.id,
        title: s.title,
        status: s.status,
        assignee: s.assignee
      }))
    }
  }
})

// Définir une ressource
server.addResource({
  uri: 'project://prd',
  name: 'Product Requirements Document',
  description: 'Le PRD du projet',
  handler: async () => {
    const content = await readFile('docs/PRD.md', 'utf-8')
    return { content }
  }
})

// Démarrer le serveur
const transport = new StdioTransport()
server.connect(transport)

// Helpers
async function listSpecs(status?: string) {
  // Implémentation réelle : lire les fichiers SPEC-*.md
  // Retourner les specs filtrées
}
```

### Package.json

```json
{
  "name": "mcp-server-myproject",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "mcp-server-myproject": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/server": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "tsx": "^4.0.0"
  }
}
```

### Enregistrer le Serveur

```json
// Ajouter à mcp.json
{
  "servers": {
    "myproject": {
      "command": "mcp-server-myproject",
      "description": "Outils spécifiques à mon projet"
    }
  }
}
```

---

## Exemples Pratiques

### Exemple 1 : Serveur MCP pour AIAD

```typescript
// mcp-server-aiad/src/index.ts
import { Server } from '@modelcontextprotocol/server'
import { StdioTransport } from '@modelcontextprotocol/server/transports'
import { readFile, readdir } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'

const server = new Server({
  name: 'aiad-tools',
  version: '1.0.0'
})

// Outil : Lister les SPECs
server.addTool({
  name: 'list_specs',
  description: 'Liste les SPECs avec leur statut et priorité',
  parameters: {
    type: 'object',
    properties: {
      status: { type: 'string', description: 'Filtrer par statut' }
    }
  },
  handler: async ({ status }) => {
    const specsDir = 'docs/specs'
    const files = await readdir(specsDir)
    const specs = []

    for (const file of files.filter(f => f.endsWith('.md'))) {
      const content = await readFile(join(specsDir, file), 'utf-8')
      const { data } = matter(content)
      if (!status || data.status === status) {
        specs.push({
          id: file.replace('.md', ''),
          title: data.title,
          status: data.status,
          priority: data.priority
        })
      }
    }

    return { content: specs }
  }
})

// Outil : Obtenir les métriques
server.addTool({
  name: 'get_metrics',
  description: 'Retourne les métriques AIAD du projet',
  handler: async () => {
    // Calculer les métriques
    const specs = await readdir('docs/specs')
    const inProgress = specs.filter(f => /* ... */).length
    const done = specs.filter(f => /* ... */).length

    return {
      content: {
        specsTotal: specs.length,
        specsInProgress: inProgress,
        specsDone: done,
        velocity: done / 7 // specs/semaine
      }
    }
  }
})

// Ressource : PRD
server.addResource({
  uri: 'aiad://prd',
  name: 'PRD',
  handler: async () => {
    const content = await readFile('docs/PRD.md', 'utf-8')
    return { content }
  }
})

// Ressource : Architecture
server.addResource({
  uri: 'aiad://architecture',
  name: 'Architecture',
  handler: async () => {
    const content = await readFile('docs/ARCHITECTURE.md', 'utf-8')
    return { content }
  }
})

// Démarrer
const transport = new StdioTransport()
server.connect(transport)
```

### Exemple 2 : Configuration Projet Complète

```json
// .config/mcp.json (à la racine du projet)
{
  "version": "1.0",
  "servers": {
    "project-files": {
      "command": "mcp-server-filesystem",
      "args": ["--root", "."],
      "capabilities": ["read", "list"]
    },
    "aiad-tools": {
      "command": "./scripts/mcp-server.js"
    },
    "github": {
      "command": "mcp-server-github",
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## Anti-patterns

### ❌ Accès base de données de production

```json
// MAUVAIS
{
  "servers": {
    "postgres": {
      "env": {
        "DATABASE_URL": "${env:PROD_DATABASE_URL}"  // JAMAIS
      }
    }
  }
}
```

**Problème** : L'agent peut lire/écrire des données de production.

**Solution** : Toujours utiliser une base de données de dev, avec `readOnly: true`.

### ❌ Tokens avec trop de permissions

```bash
# MAUVAIS - Token avec accès admin
GITHUB_TOKEN=ghp_admin_token_with_all_permissions
```

**Problème** : L'agent peut effectuer des actions critiques.

**Solution** : Créer un token spécifique avec les permissions minimales.

### ❌ Pas de validation des inputs

```typescript
// MAUVAIS
server.addTool({
  name: 'execute_sql',
  handler: async ({ query }) => {
    return await db.query(query)  // Injection SQL possible
  }
})
```

**Solution** : Valider et sanitizer tous les inputs, utiliser des requêtes paramétrées.

### ❌ Serveur sans description

```json
// MAUVAIS
{
  "servers": {
    "tool1": { "command": "some-server" }
  }
}
```

**Problème** : L'agent ne sait pas quand utiliser ce serveur.

**Solution** : Toujours ajouter une description claire.

### ❌ Pas de gestion des erreurs

```typescript
// MAUVAIS
server.addTool({
  handler: async () => {
    const data = await fetchData()
    return { content: data }
  }
})
```

**Solution** : Toujours envelopper dans try/catch avec messages clairs.

---

## Troubleshooting

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| Serveur ne démarre pas | Chemin incorrect ou permissions | Vérifier le chemin et `chmod +x` |
| "Token invalid" | Variable d'environnement manquante | Vérifier `echo $GITHUB_TOKEN` |
| Timeout sur les requêtes | Serveur trop lent | Augmenter le timeout, optimiser le handler |
| "Permission denied" | Capabilities insuffisantes | Ajouter les capabilities nécessaires |
| Outil non disponible | Serveur non connecté | Vérifier la config et redémarrer |

### Debug

```bash
# Démarrer en mode debug
DEBUG=mcp:* mcp-server-myproject

# Tester la connexion
mcp test-connection myproject

# Lister les outils disponibles
mcp list-tools

# Tester un outil
mcp call myproject list_specs '{"status": "ready"}'

# Voir les logs
tail -f ~/.config/claude-code/logs/mcp.log
```

### Vérification

```bash
# Lister les serveurs configurés
mcp list-servers

# Vérifier les capabilities
mcp check-capabilities myproject

# Tester une ressource
mcp get-resource myproject "aiad://prd"
```

---

## Checklist Installation MCP

```markdown
## Checklist MCP

### Installation
- [ ] Node.js 18+ installé
- [ ] CLI MCP installé (`npm install -g @modelcontextprotocol/cli`)
- [ ] Serveurs MCP nécessaires installés

### Configuration
- [ ] mcp.json créé
- [ ] Variables d'environnement configurées
- [ ] Descriptions ajoutées pour chaque serveur

### Sécurité
- [ ] Tokens avec permissions minimales
- [ ] Base de données en readOnly
- [ ] Pas de credentials de production
- [ ] Confirmation requise pour actions sensibles

### Test
- [ ] Chaque serveur démarre correctement
- [ ] Outils testés individuellement
- [ ] Ressources accessibles

### Documentation
- [ ] Serveurs documentés dans CLAUDE.md
- [ ] Équipe formée sur l'utilisation
- [ ] README du serveur custom créé
```

---

*Voir aussi : [G.2 Installation Agents IA](G2-installation-agents-ia.md) · [G.6 Création de Subagents](G6-creation-subagents.md) · [B.6 Agents Engineer](B6-agents-engineer.md)*
