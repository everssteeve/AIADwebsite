# G.4 Configuration Permissions

## Pourquoi cette annexe ?

Cette annexe définit les droits et accès à configurer pour les agents IA afin d'assurer sécurité et productivité.

---

## Principes de Base

### Principe du Moindre Privilège

Les agents IA ne doivent avoir que les accès nécessaires à leur fonctionnement.

| Accès | Niveau Recommandé |
|-------|-------------------|
| Lecture code source | ✅ Complet |
| Écriture code source | ✅ Complet (dans le projet) |
| Exécution commandes | ⚠️ Limité (liste blanche) |
| Accès réseau | ⚠️ Limité (API documentées) |
| Accès fichiers système | ❌ Aucun |
| Accès secrets | ❌ Aucun direct |

---

## Configuration par Agent

### Claude Code

```bash
# Permissions Claude Code sont configurées via les settings

# Commandes autorisées (exemple)
# ~/.claude-code/allowed-commands.json
{
  "allowedCommands": [
    "pnpm",
    "npm",
    "yarn",
    "git status",
    "git diff",
    "git log",
    "ls",
    "cat",
    "grep"
  ],
  "blockedCommands": [
    "rm -rf",
    "sudo",
    "chmod",
    "curl",  // Sauf domaines autorisés
    "wget"
  ],
  "requireConfirmation": [
    "git push",
    "git commit",
    "pnpm install",
    "npm install"
  ]
}
```

### Cursor

```json
// .cursor/settings.json
{
  "security": {
    "allowedFilePatterns": [
      "src/**/*",
      "tests/**/*",
      "docs/**/*"
    ],
    "blockedFilePatterns": [
      ".env*",
      "*.pem",
      "*.key",
      "**/secrets/**"
    ],
    "allowTerminal": true,
    "terminalAllowedCommands": [
      "pnpm *",
      "npm run *",
      "git *"
    ]
  }
}
```

### GitHub Copilot

```json
// .github/copilot-settings.json
{
  "excludePatterns": [
    "**/.env*",
    "**/secrets/**",
    "**/*.pem",
    "**/*.key",
    "**/credentials*"
  ]
}
```

---

## Gestion des Secrets

### Ne Jamais Exposer aux Agents

```markdown
## Fichiers à Exclure

### Variables d'environnement
- .env
- .env.local
- .env.production

### Credentials
- *.pem
- *.key
- *.p12
- credentials.json
- service-account.json

### Configuration sensible
- secrets/
- .secrets/
- config/production.json (si contient des secrets)
```

### Configuration .gitignore + Agent Ignore

```gitignore
# .gitignore ET .cursorignore / .claude-code-ignore

# Secrets
.env*
!.env.example
*.pem
*.key
secrets/

# Credentials
credentials*.json
service-account*.json
```

### Utilisation de Variables d'Environnement

```typescript
// ✅ Bon : référencer les variables d'environnement
const apiKey = process.env.API_KEY

// ❌ Mauvais : hardcoder ou exposer
const apiKey = "sk-..." // JAMAIS
```

---

## Permissions Système de Fichiers

### Structure Recommandée

```
project/
├── src/           # ✅ Lecture + Écriture
├── tests/         # ✅ Lecture + Écriture
├── docs/          # ✅ Lecture + Écriture
├── public/        # ✅ Lecture + Écriture limitée
├── scripts/       # ⚠️ Lecture seule
├── .env           # ❌ Aucun accès
├── secrets/       # ❌ Aucun accès
└── node_modules/  # ✅ Lecture seule
```

### Implémentation avec Pre-commit Hooks

```bash
#!/bin/bash
# .husky/pre-commit

# Vérifier qu'aucun secret n'est committé
if git diff --cached --name-only | grep -E '\.env|\.pem|\.key|credentials'; then
  echo "❌ Tentative de commit de fichiers sensibles détectée"
  exit 1
fi

# Vérifier les patterns de secrets dans le code
if git diff --cached | grep -E 'sk-[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}'; then
  echo "❌ Secret potentiel détecté dans le diff"
  exit 1
fi
```

---

## Permissions Réseau

### Domaines Autorisés

```json
// Configuration proxy/firewall pour les agents
{
  "allowedDomains": [
    "api.anthropic.com",
    "api.openai.com",
    "api.github.com",
    "registry.npmjs.org",
    "raw.githubusercontent.com"
  ],
  "blockedDomains": [
    "*" // Tout sauf la liste blanche
  ]
}
```

### Accès API Externe

```markdown
## Règles d'Accès API

### Autorisé
- APIs de documentation (MDN, devdocs)
- Package registries (npm, pypi)
- APIs du projet (avec tokens de dev)

### Interdit
- APIs de production avec vraies données
- Services de paiement
- APIs admin/backoffice

### Avec Confirmation
- APIs tierces non documentées
- Endpoints POST/PUT/DELETE
```

---

## Audit et Logging

### Logging des Actions

```typescript
// Exemple de middleware de logging pour les actions des agents
interface AgentAction {
  timestamp: Date
  agent: string
  action: 'read' | 'write' | 'execute' | 'network'
  target: string
  result: 'success' | 'blocked' | 'error'
  details?: string
}

function logAgentAction(action: AgentAction) {
  console.log(JSON.stringify({
    ...action,
    timestamp: action.timestamp.toISOString()
  }))

  // Alerter si action sensible
  if (action.result === 'blocked') {
    alertSecurityTeam(action)
  }
}
```

### Revue Périodique

```markdown
## Checklist Revue Permissions (Mensuelle)

### Accès Fichiers
- [ ] Patterns d'exclusion à jour
- [ ] Pas de nouveaux fichiers sensibles non exclus
- [ ] Permissions de dossiers correctes

### Commandes
- [ ] Liste blanche toujours pertinente
- [ ] Pas de nouvelle commande dangereuse autorisée
- [ ] Commandes avec confirmation fonctionnent

### Réseau
- [ ] Domaines autorisés toujours nécessaires
- [ ] Pas de nouveau domaine suspect
- [ ] Logs réseau vérifiés

### Secrets
- [ ] Rotation des clés API si nécessaire
- [ ] Pas de secret exposé dans les logs
- [ ] .env.example à jour (sans vrais secrets)
```

---

## Configuration par Environnement

### Développement

```json
{
  "environment": "development",
  "permissions": {
    "fileSystem": {
      "read": ["**/*"],
      "write": ["src/**", "tests/**", "docs/**"],
      "exclude": [".env*", "secrets/**"]
    },
    "commands": {
      "allowed": ["*"],
      "blocked": ["sudo", "rm -rf /"],
      "requireConfirmation": []
    },
    "network": {
      "allowed": ["*"],
      "blocked": []
    }
  }
}
```

### CI/CD

```json
{
  "environment": "ci",
  "permissions": {
    "fileSystem": {
      "read": ["**/*"],
      "write": ["dist/**", "coverage/**"],
      "exclude": []
    },
    "commands": {
      "allowed": [
        "pnpm install",
        "pnpm build",
        "pnpm test",
        "pnpm lint"
      ],
      "blocked": ["*"],
      "requireConfirmation": []
    },
    "network": {
      "allowed": [
        "registry.npmjs.org",
        "api.github.com"
      ],
      "blocked": ["*"]
    }
  }
}
```

### Production (Agents désactivés)

```json
{
  "environment": "production",
  "permissions": {
    "aiAgents": {
      "enabled": false,
      "reason": "Pas d'agents IA en production"
    }
  }
}
```

---

## Checklist Sécurité

```markdown
## Checklist Sécurité Agents IA

### Configuration Initiale
- [ ] Fichiers sensibles exclus
- [ ] Liste blanche de commandes définie
- [ ] Domaines réseau limités
- [ ] Logging activé

### Opérationnel
- [ ] Pre-commit hooks en place
- [ ] Scan de secrets dans CI
- [ ] Revue périodique planifiée

### Réponse aux Incidents
- [ ] Procédure de révocation d'accès
- [ ] Contacts d'urgence définis
- [ ] Logs conservés pour investigation
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
