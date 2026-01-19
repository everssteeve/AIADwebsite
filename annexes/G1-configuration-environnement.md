# G.1 Configuration Environnement

## Pourquoi cette annexe ?

Cette annexe fournit les commandes et la structure de projet recommandées pour mettre en place un environnement de développement AIAD.

---

## Structure de Projet Recommandée

### Monorepo (Recommandé)

```
project-name/
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   └── PULL_REQUEST_TEMPLATE.md
├── apps/
│   ├── web/               # Application frontend
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── api/               # Application backend
│       ├── src/
│       ├── tests/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   └── shared/            # Code partagé (types, utils)
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── docs/
│   ├── PRD.md             # Product Requirements Document
│   ├── ARCHITECTURE.md    # Documentation architecture
│   └── specs/             # Spécifications
│       └── SPEC-001.md
├── scripts/               # Scripts utilitaires
├── .env.example           # Template variables d'environnement
├── CLAUDE.md              # AGENT-GUIDE
├── package.json           # Config workspace
├── pnpm-workspace.yaml    # Config pnpm workspaces
├── tsconfig.base.json     # Config TypeScript partagée
└── README.md
```

### Single App (Projets Simples)

```
project-name/
├── .github/
│   └── workflows/
├── src/
│   ├── components/        # Composants UI
│   ├── features/          # Logique par feature
│   ├── lib/               # Utilitaires
│   ├── pages/             # Routes/pages
│   └── types/             # Types TypeScript
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/                # Assets statiques
├── docs/
│   ├── PRD.md
│   └── ARCHITECTURE.md
├── .env.example
├── CLAUDE.md
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup Initial

### 1. Création du Projet

```bash
# Créer le dossier
mkdir project-name && cd project-name

# Initialiser git
git init

# Initialiser pnpm
pnpm init

# Créer la structure de base
mkdir -p .github/workflows apps/web apps/api packages/shared docs/specs scripts
```

### 2. Configuration pnpm Workspaces

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
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  }
}
```

### 3. Configuration TypeScript

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

### 4. Configuration ESLint

```javascript
// eslint.config.js
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

### 5. Configuration Prettier

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

---

## Variables d'Environnement

### Structure

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
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# ============================================
# External Services
# ============================================
# API_KEY=your-api-key

# ============================================
# Feature Flags (optional)
# ============================================
# FEATURE_NEW_UI=false
```

### Gestion des Secrets

```bash
# Ne JAMAIS commiter .env
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore

# Copier le template
cp .env.example .env
```

---

## Git Configuration

### .gitignore

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
.turbo/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/
.nyc_output/

# Misc
*.tsbuildinfo
```

### Git Hooks (Husky + lint-staged)

```bash
# Installation
pnpm add -D husky lint-staged

# Initialiser husky
pnpm exec husky init
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
pnpm lint-staged
```

```bash
# .husky/commit-msg
pnpm exec commitlint --edit $1
```

### Commitlint

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

## Scripts Utilitaires

### Script de Setup

```bash
#!/bin/bash
# scripts/setup.sh

echo "🚀 Setting up project..."

# Vérifier les prérequis
command -v node >/dev/null 2>&1 || { echo "Node.js required"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "pnpm required"; exit 1; }

# Installer les dépendances
echo "📦 Installing dependencies..."
pnpm install

# Copier les fichiers d'environnement
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cp .env.example .env
fi

# Setup la base de données (si applicable)
if [ -f "apps/api/package.json" ]; then
  echo "🗄️ Setting up database..."
  pnpm --filter api db:migrate
fi

echo "✅ Setup complete!"
echo "Run 'pnpm dev' to start development"
```

### Script de Clean

```bash
#!/bin/bash
# scripts/clean.sh

echo "🧹 Cleaning project..."

# Supprimer les builds
rm -rf dist build .next .turbo

# Supprimer les node_modules (optionnel)
read -p "Remove node_modules? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf node_modules apps/*/node_modules packages/*/node_modules
  echo "Removed node_modules"
fi

echo "✅ Clean complete!"
```

---

## Configuration IDE

### VS Code Settings

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
    "prisma.prisma",
    "ms-playwright.playwright"
  ]
}
```

---

## Checklist Setup Complet

```markdown
## Checklist Environnement

### Structure
- [ ] Dossiers créés selon le template
- [ ] pnpm workspace configuré
- [ ] TypeScript configuré (strict mode)

### Qualité
- [ ] ESLint configuré
- [ ] Prettier configuré
- [ ] Git hooks installés (Husky)
- [ ] Commitlint configuré

### Documentation
- [ ] README.md créé
- [ ] CLAUDE.md (AGENT-GUIDE) créé
- [ ] .env.example créé
- [ ] PRD.md initialisé
- [ ] ARCHITECTURE.md initialisé

### Git
- [ ] .gitignore configuré
- [ ] Repo initialisé
- [ ] Premier commit effectué

### IDE
- [ ] VS Code settings
- [ ] Extensions recommandées

### CI/CD (optionnel au setup)
- [ ] GitHub Actions configuré
- [ ] Tests automatiques
- [ ] Deploy preview
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
