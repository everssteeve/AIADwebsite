# G.1 Configuration Environnement

## Pourquoi cette annexe ?

Un environnement mal configuré génère des frictions quotidiennes : imports cassés, styles incohérents, commits anarchiques. Cette annexe vous guide pas à pas pour créer un environnement de développement AIAD opérationnel en moins d'une heure, reproductible par toute l'équipe.

---

## Structure de Projet

### Monorepo (Projets Multi-Apps)

```
project-name/
├── .github/
│   ├── workflows/              # CI/CD pipelines
│   └── PULL_REQUEST_TEMPLATE.md
├── apps/
│   ├── web/                    # Application frontend
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/                    # Application backend
│       ├── src/
│       ├── tests/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── shared/                 # Code partagé (types, utils)
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── docs/
│   ├── PRD.md                  # Product Requirements Document
│   ├── ARCHITECTURE.md         # Documentation architecture
│   └── specs/                  # Spécifications
│       └── SPEC-001.md
├── scripts/                    # Scripts utilitaires
├── .env.example                # Template variables d'environnement
├── CLAUDE.md                   # AGENT-GUIDE
├── package.json                # Config workspace
├── pnpm-workspace.yaml         # Config pnpm workspaces
├── tsconfig.base.json          # Config TypeScript partagée
└── README.md
```

**Quand utiliser** : Plusieurs applications (web + API), code partagé entre apps, équipe > 3 personnes.

### Single App (Projets Simples)

```
project-name/
├── .github/
│   └── workflows/
├── src/
│   ├── components/             # Composants UI
│   ├── features/               # Logique par feature
│   ├── lib/                    # Utilitaires
│   ├── pages/                  # Routes/pages
│   └── types/                  # Types TypeScript
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/                     # Assets statiques
├── docs/
│   ├── PRD.md
│   └── ARCHITECTURE.md
├── .env.example
├── CLAUDE.md
├── package.json
├── tsconfig.json
└── README.md
```

**Quand utiliser** : Application unique, projet solo ou petite équipe, prototype/MVP.

---

## Setup Pas à Pas

### Étape 1 : Créer la Structure

```bash
# Créer et entrer dans le dossier
mkdir project-name && cd project-name

# Initialiser git
git init

# Initialiser pnpm
pnpm init

# Créer la structure de base (monorepo)
mkdir -p .github/workflows apps/web/src apps/web/tests apps/api/src apps/api/tests
mkdir -p packages/shared/src docs/specs scripts

# OU pour single app
mkdir -p .github/workflows src/{components,features,lib,pages,types}
mkdir -p tests/{unit,integration,e2e} public docs
```

### Étape 2 : Configurer pnpm Workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// package.json (racine)
{
  "name": "project-name",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0",
    "prettier": "^3.0.0"
  }
}
```

### Étape 3 : Configurer TypeScript

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

```json
// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../../packages/shared/src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Étape 4 : Configurer ESLint

```javascript
// eslint.config.js (ESLint 9+ flat config)
import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]
```

### Étape 5 : Configurer Prettier

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

```
// .prettierignore
node_modules
dist
build
coverage
.next
.turbo
pnpm-lock.yaml
```

### Étape 6 : Configurer les Git Hooks

```bash
# Installer les dépendances
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional

# Initialiser husky
pnpm exec husky init
```

```bash
# .husky/pre-commit
pnpm lint-staged
```

```bash
# .husky/commit-msg
pnpm exec commitlint --edit $1
```

```json
// package.json (ajouter)
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yaml}": ["prettier --write"]
  }
}
```

```javascript
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf'],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'always', 'lower-case'],
  },
}
```

---

## Variables d'Environnement

### Template .env.example

```bash
# .env.example
# ============================================
# Application
# ============================================
NODE_ENV=development
PORT=3000

# ============================================
# Database
# ============================================
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# ============================================
# Authentication
# ============================================
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d

# ============================================
# External Services
# ============================================
# API_KEY=your-api-key
```

### Sécurisation

```bash
# Ajouter au .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore

# Copier le template pour démarrer
cp .env.example .env
```

---

## Configuration IDE (VS Code)

### Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/.turbo": true
  }
}
```

### Extensions Recommandées

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

---

## Scripts Utilitaires

### Script de Setup Initial

```bash
#!/bin/bash
# scripts/setup.sh

set -e

echo "🚀 Configuration du projet..."

# Vérifier les prérequis
command -v node >/dev/null 2>&1 || { echo "❌ Node.js requis"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm requis. Installez avec: npm install -g pnpm"; exit 1; }

# Vérifier la version de Node
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Node.js 18+ requis (version actuelle: $(node -v))"
  exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
pnpm install

# Créer le fichier .env si absent
if [ ! -f .env ]; then
  echo "📝 Création du fichier .env..."
  cp .env.example .env
  echo "⚠️  Pensez à configurer vos variables d'environnement dans .env"
fi

# Setup les git hooks
echo "🪝 Configuration des git hooks..."
pnpm exec husky install

echo "✅ Setup terminé !"
echo ""
echo "Prochaines étapes :"
echo "  1. Configurez vos variables dans .env"
echo "  2. Lancez 'pnpm dev' pour démarrer"
```

### Script de Nettoyage

```bash
#!/bin/bash
# scripts/clean.sh

echo "🧹 Nettoyage du projet..."

# Supprimer les builds
rm -rf dist build .next .turbo coverage

# Supprimer le cache
rm -rf .eslintcache .prettiercache

# Optionnel : supprimer node_modules
if [ "$1" = "--all" ]; then
  echo "📦 Suppression des node_modules..."
  rm -rf node_modules apps/*/node_modules packages/*/node_modules
  echo "✅ Relancez 'pnpm install' pour réinstaller"
fi

echo "✅ Nettoyage terminé !"
```

---

## Exemples Pratiques

### Exemple 1 : Setup Projet React + Vite

```bash
# Créer le projet
pnpm create vite@latest my-app --template react-ts
cd my-app

# Ajouter les outils de qualité
pnpm add -D eslint prettier husky lint-staged @commitlint/cli @commitlint/config-conventional

# Créer la documentation AIAD
mkdir docs
touch docs/PRD.md docs/ARCHITECTURE.md CLAUDE.md

# Initialiser les hooks
pnpm exec husky init
```

### Exemple 2 : Setup Projet Node.js API

```bash
# Initialiser
mkdir my-api && cd my-api
pnpm init

# Installer les dépendances
pnpm add express zod
pnpm add -D typescript @types/node @types/express tsx vitest

# Structure
mkdir -p src/{routes,services,middleware} tests docs

# TypeScript
echo '{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "dist"
  },
  "include": ["src"]
}' > tsconfig.json
```

---

## Anti-patterns

### ❌ Pas de TypeScript strict

```json
// MAUVAIS
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false
  }
}
```

**Problème** : Les agents génèrent du code non typé, les erreurs passent en production.

**Solution** : Toujours `"strict": true`.

### ❌ Pas de formatage automatique

**Problème** : Chaque commit mélange changements de code et changements de formatage. Les diffs sont illisibles.

**Solution** : Prettier + format on save + lint-staged.

### ❌ Secrets dans le repo

```bash
# MAUVAIS - .env committé
DATABASE_URL=postgresql://prod-user:real-password@prod-server:5432/prod
```

**Problème** : Les secrets sont exposés à tous les contributeurs et dans l'historique git.

**Solution** : .env dans .gitignore, .env.example avec des valeurs fictives.

### ❌ Structure de dossiers anarchique

```
# MAUVAIS
src/
├── utils.ts
├── helpers.ts
├── functions.ts
├── stuff.ts
└── misc.ts
```

**Problème** : Impossible de naviguer, les agents ne comprennent pas où placer le code.

**Solution** : Structure par feature ou par couche, documentée dans CLAUDE.md.

### ❌ Pas de git hooks

**Problème** : Du code non formaté, non linté, avec des messages de commit anarchiques arrive dans le repo.

**Solution** : Husky + lint-staged + commitlint.

---

## Checklist Setup Complet

```markdown
## Checklist Environnement AIAD

### Structure
- [ ] Dossiers créés selon le template (monorepo ou single app)
- [ ] pnpm workspace configuré (si monorepo)
- [ ] README.md avec instructions de setup

### TypeScript
- [ ] tsconfig.json avec strict: true
- [ ] Path aliases configurés (@/*)
- [ ] Declaration maps pour le debug

### Qualité de Code
- [ ] ESLint configuré
- [ ] Prettier configuré
- [ ] Format on save activé dans l'IDE

### Git
- [ ] .gitignore complet
- [ ] Husky installé
- [ ] lint-staged configuré
- [ ] commitlint configuré
- [ ] Premier commit effectué

### Documentation AIAD
- [ ] CLAUDE.md (AGENT-GUIDE) créé
- [ ] docs/PRD.md initialisé
- [ ] docs/ARCHITECTURE.md initialisé
- [ ] .env.example créé

### IDE
- [ ] .vscode/settings.json configuré
- [ ] .vscode/extensions.json avec recommandations

### Scripts
- [ ] scripts/setup.sh fonctionnel
- [ ] pnpm dev lance le projet
- [ ] pnpm build produit un build
- [ ] pnpm test lance les tests
```

---

*Voir aussi : [G.2 Installation Agents IA](G2-installation-agents-ia.md) · [G.3 Setup CI/CD](G3-setup-ci-cd.md) · [A.3 Template AGENT-GUIDE](A3-agent-guide.md)*
