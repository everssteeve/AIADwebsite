# G.3 Setup CI/CD

## Pourquoi cette annexe ?

Sans CI/CD, chaque merge est un risque : tests oubliés, bugs en production, régressions silencieuses. Avec du code généré par agents IA, ce risque est amplifié. Cette annexe vous guide pas à pas pour mettre en place un pipeline CI/CD robuste qui valide automatiquement chaque PR et déploie en confiance.

---

## Pipeline CI/CD Complet

### Architecture du Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    PUSH     │────▶│   VALIDATE  │────▶│    TEST     │────▶│    BUILD    │
│   (PR/main) │     │ (lint+type) │     │(unit+integ) │     │  (compile)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
      ┌────────────────────────────────────────────────────────────┤
      ▼                                                            ▼
┌─────────────┐                                              ┌─────────────┐
│   PREVIEW   │◀─────────────── PR ─────────────────────────▶│  SECURITY   │
│  (staging)  │                                              │   (audit)   │
└─────────────┘                                              └─────────────┘
                                                                   │
                              main ─────────────────────────────────┤
                                                                   ▼
                                                             ┌─────────────┐
                                                             │ PRODUCTION  │
                                                             │  (deploy)   │
                                                             └─────────────┘
```

---

## GitHub Actions

### Pipeline Complet

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '9'

jobs:
  # ============================================
  # Validation : Lint + Typecheck
  # ============================================
  validate:
    name: Validate
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

  # ============================================
  # Tests Unitaires
  # ============================================
  test-unit:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: [validate]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run unit tests
        run: pnpm test:unit --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: false

  # ============================================
  # Tests d'Intégration
  # ============================================
  test-integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: [validate]
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run migrations
        run: pnpm db:migrate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test

      - name: Run integration tests
        run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test

  # ============================================
  # Tests E2E
  # ============================================
  test-e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [test-unit]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Build application
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  # ============================================
  # Sécurité
  # ============================================
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Audit dependencies
        run: pnpm audit --audit-level=high
        continue-on-error: true

      - name: Check for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --only-verified

  # ============================================
  # Build
  # ============================================
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [test-unit, test-integration]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          retention-days: 7

  # ============================================
  # Deploy Preview (PR uniquement)
  # ============================================
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    needs: [build, test-e2e]
    if: github.event_name == 'pull_request'
    environment:
      name: preview
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Download build
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Deploy to Vercel
        id: deploy
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  # ============================================
  # Deploy Production (main uniquement)
  # ============================================
  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: [build, test-e2e, security]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Download build
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Configuration Branch Protection

```yaml
# Configurer via Settings > Branches > Add rule

# Règles pour la branche main :
branch_protection:
  branch: main
  required_status_checks:
    strict: true
    contexts:
      - validate
      - test-unit
      - test-integration
      - security
      - build
  required_pull_request_reviews:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
  enforce_admins: true
  allow_force_pushes: false
  allow_deletions: false
```

---

## GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '20'
  PNPM_VERSION: '9'

# Template réutilisable
.node-template: &node-template
  image: node:${NODE_VERSION}
  before_script:
    - corepack enable
    - corepack prepare pnpm@${PNPM_VERSION} --activate
    - pnpm config set store-dir .pnpm-store
    - pnpm install --frozen-lockfile
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - .pnpm-store/

# ============================================
# Validate
# ============================================
lint:
  <<: *node-template
  stage: validate
  script:
    - pnpm lint

typecheck:
  <<: *node-template
  stage: validate
  script:
    - pnpm typecheck

# ============================================
# Test
# ============================================
unit-tests:
  <<: *node-template
  stage: test
  needs: [lint, typecheck]
  script:
    - pnpm test:unit --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

integration-tests:
  <<: *node-template
  stage: test
  needs: [lint, typecheck]
  services:
    - name: postgres:16
      alias: postgres
  variables:
    POSTGRES_DB: test
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
    DATABASE_URL: postgresql://test:test@postgres:5432/test
  script:
    - pnpm db:migrate
    - pnpm test:integration

# ============================================
# Build
# ============================================
build:
  <<: *node-template
  stage: build
  needs: [unit-tests, integration-tests]
  script:
    - pnpm build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

# ============================================
# Deploy
# ============================================
deploy-staging:
  stage: deploy
  needs: [build]
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - echo "Deploying to staging..."
    # Ajouter vos commandes de déploiement
  rules:
    - if: $CI_MERGE_REQUEST_ID

deploy-production:
  stage: deploy
  needs: [build]
  environment:
    name: production
    url: https://example.com
  script:
    - echo "Deploying to production..."
    # Ajouter vos commandes de déploiement
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
  when: manual
```

---

## Configurations Complémentaires

### Lighthouse CI (Performance)

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install and build
        run: |
          pnpm install --frozen-lockfile
          pnpm build

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
```

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "pnpm preview",
      "url": ["http://localhost:4173/"]
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Dependabot (Mises à jour automatiques)

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    groups:
      dev-dependencies:
        patterns:
          - "@types/*"
          - "eslint*"
          - "prettier*"
          - "vitest*"
          - "@playwright/*"
        update-types:
          - "minor"
          - "patch"
      production:
        patterns:
          - "*"
        exclude-patterns:
          - "@types/*"
          - "eslint*"
          - "prettier*"
          - "vitest*"
    commit-message:
      prefix: "chore(deps)"
```

### Release Automatique

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v4
        with:
          release-type: node
          package-name: my-project
```

---

## Exemples Pratiques

### Exemple 1 : Setup Minimal pour Projet Solo

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

### Exemple 2 : Ajout de Tests E2E à un Pipeline Existant

```yaml
# Ajouter ce job au workflow existant
test-e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  needs: [test-unit]
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v3
      with:
        version: 9
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'pnpm'
    - run: pnpm install --frozen-lockfile
    - run: pnpm exec playwright install --with-deps chromium
    - run: pnpm build
    - run: pnpm test:e2e
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: e2e-report
        path: playwright-report/
```

### Exemple 3 : Déploiement Conditionnel

```yaml
deploy:
  runs-on: ubuntu-latest
  needs: [build, test-e2e]
  # Déployer seulement si :
  # - C'est un push sur main
  # - Tous les tests passent
  # - Pas de [skip deploy] dans le message
  if: |
    github.ref == 'refs/heads/main' &&
    !contains(github.event.head_commit.message, '[skip deploy]')
  steps:
    - name: Deploy
      run: echo "Deploying..."
```

---

## Anti-patterns

### ❌ Pas de cache des dépendances

```yaml
# MAUVAIS - Installation complète à chaque run
steps:
  - run: pnpm install
```

**Problème** : Pipeline lent, coûts élevés, timeout fréquents.

**Solution** : Utiliser le cache pnpm/npm natif de `actions/setup-node`.

### ❌ Tests séquentiels au lieu de parallèles

```yaml
# MAUVAIS
jobs:
  all-tests:
    steps:
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:unit
      - run: pnpm test:integration
      - run: pnpm test:e2e
```

**Problème** : Pipeline inutilement long.

**Solution** : Jobs parallèles avec dépendances explicites (`needs`).

### ❌ Pas de branch protection

**Problème** : Des PR peuvent être mergées sans que les tests passent.

**Solution** : Configurer les required status checks sur main.

### ❌ Secrets en clair dans le workflow

```yaml
# MAUVAIS
env:
  API_KEY: "sk-real-api-key-here"
```

**Problème** : Secrets exposés dans l'historique git.

**Solution** : Utiliser les secrets GitHub/GitLab (`${{ secrets.API_KEY }}`).

### ❌ Pas de fail-fast sur les tests

```yaml
# MAUVAIS - Continue même si un test échoue
- run: pnpm test || true
```

**Problème** : Les erreurs passent inaperçues, le code buggé est déployé.

**Solution** : Laisser les commandes échouer et bloquer le pipeline.

### ❌ Deploy automatique sans gate

```yaml
# MAUVAIS - Deploy prod automatique
deploy-production:
  if: github.ref == 'refs/heads/main'
  # Pas de "when: manual" ou d'environment protection
```

**Problème** : Chaque push sur main va en production sans validation humaine.

**Solution** : Ajouter `when: manual` (GitLab) ou environment protection rules (GitHub).

---

## Troubleshooting

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| Pipeline timeout | Tests trop longs ou boucle infinie | Ajouter des timeouts explicites, optimiser les tests |
| Cache non utilisé | Clé de cache incorrecte | Vérifier que `pnpm-lock.yaml` est committé |
| Playwright échoue | Browsers non installés | Ajouter `playwright install --with-deps` |
| DB non accessible | Service pas prêt | Ajouter health checks avec retry |
| Secrets non disponibles | Mauvais scope | Vérifier les permissions du token |

### Debug d'un Workflow

```yaml
# Ajouter pour debugger
- name: Debug info
  run: |
    echo "Event: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
    echo "SHA: ${{ github.sha }}"
    env

- name: Debug avec SSH (temporaire)
  uses: mxschmitt/action-tmate@v3
  if: failure()
```

---

## Checklist CI/CD

```markdown
## Checklist Setup CI/CD AIAD

### Pipeline de Base
- [ ] Workflow fichier créé (.github/workflows/ci.yml)
- [ ] Lint automatique
- [ ] Typecheck automatique
- [ ] Tests unitaires
- [ ] Build vérifié

### Tests Avancés
- [ ] Tests d'intégration avec DB
- [ ] Tests E2E avec Playwright
- [ ] Coverage reporting (Codecov)

### Sécurité
- [ ] Audit des dépendances (pnpm audit)
- [ ] Scan des secrets (TruffleHog)
- [ ] Secrets dans GitHub/GitLab Secrets

### Déploiement
- [ ] Preview deployments pour les PR
- [ ] Deploy staging automatique
- [ ] Deploy production avec gate manuel
- [ ] Rollback possible

### Protection
- [ ] Branch protection sur main
- [ ] Required status checks configurés
- [ ] Required reviews (au moins 1)

### Maintenance
- [ ] Dependabot/Renovate configuré
- [ ] Release automation (release-please)
- [ ] Cache des dépendances optimisé
```

---

*Voir aussi : [G.1 Configuration Environnement](G1-configuration-environnement.md) · [G.4 Configuration Permissions](G4-configuration-permissions.md) · [C.5 Boucle INTÉGRER](C5-boucle-integrer.md)*
