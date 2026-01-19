# G.3 Setup CI/CD

## Pourquoi cette annexe ?

Cette annexe fournit des configurations CI/CD prêtes à l'emploi pour intégrer les pratiques AIAD dans votre pipeline de déploiement.

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
  PNPM_VERSION: '8'

jobs:
  # ============================================
  # Lint et Typecheck
  # ============================================
  lint:
    name: Lint & Typecheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

  # ============================================
  # Tests
  # ============================================
  test:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Unit Tests
        run: pnpm test:unit

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  # ============================================
  # Integration Tests
  # ============================================
  test-integration:
    name: Integration Tests
    runs-on: ubuntu-latest
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
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Run Migrations
        run: pnpm db:migrate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test

      - name: Integration Tests
        run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test

  # ============================================
  # E2E Tests
  # ============================================
  test-e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Install Playwright
        run: pnpm exec playwright install --with-deps

      - name: Build
        run: pnpm build

      - name: E2E Tests
        run: pnpm test:e2e

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  # ============================================
  # Security
  # ============================================
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Audit Dependencies
        run: pnpm audit --audit-level=high

      - name: Detect Secrets
        uses: trufflesecurity/trufflehog@main
        with:
          extra_args: --only-verified

  # ============================================
  # Build
  # ============================================
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  # ============================================
  # Deploy Preview (PR only)
  # ============================================
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    needs: [build]
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4

      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  # ============================================
  # Deploy Production (main only)
  # ============================================
  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: [build, test-e2e, security]
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4

      - uses: actions/download-artifact@v4
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

### Branch Protection

```yaml
# Configurer via l'API GitHub ou l'interface
# Settings > Branches > Add rule

# Règles recommandées pour main:
required_status_checks:
  strict: true
  contexts:
    - lint
    - test
    - test-integration
    - security
    - build

required_pull_request_reviews:
  required_approving_review_count: 1
  dismiss_stale_reviews: true

restrictions: null
enforce_admins: true
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
  PNPM_VERSION: '8'

.node-template: &node-template
  image: node:${NODE_VERSION}
  before_script:
    - corepack enable
    - corepack prepare pnpm@${PNPM_VERSION} --activate
    - pnpm install --frozen-lockfile
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
      - .pnpm-store/

# ============================================
# Validate Stage
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
# Test Stage
# ============================================
unit-tests:
  <<: *node-template
  stage: test
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
  services:
    - postgres:16
  variables:
    DATABASE_URL: postgresql://postgres:postgres@postgres:5432/test
    POSTGRES_DB: test
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  script:
    - pnpm db:migrate
    - pnpm test:integration

# ============================================
# Build Stage
# ============================================
build:
  <<: *node-template
  stage: build
  script:
    - pnpm build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

# ============================================
# Deploy Stage
# ============================================
deploy-staging:
  stage: deploy
  needs: [build]
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - echo "Deploy to staging"
  only:
    - merge_requests

deploy-production:
  stage: deploy
  needs: [build, unit-tests, integration-tests]
  environment:
    name: production
    url: https://example.com
  script:
    - echo "Deploy to production"
  only:
    - main
  when: manual
```

---

## Configurations Spécifiques

### Lighthouse CI

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

      - name: Build
        run: pnpm build

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
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

### Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      dev-dependencies:
        patterns:
          - "@types/*"
          - "eslint*"
          - "prettier*"
          - "vitest*"
        update-types:
          - "minor"
          - "patch"
      production-dependencies:
        patterns:
          - "*"
        exclude-patterns:
          - "@types/*"
          - "eslint*"
          - "prettier*"
          - "vitest*"
```

### Release Please

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

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

## Checklist CI/CD

```markdown
## Checklist Setup CI/CD

### Pipeline de Base
- [ ] Lint automatique
- [ ] Typecheck automatique
- [ ] Tests unitaires
- [ ] Build vérifié

### Tests Avancés
- [ ] Tests d'intégration
- [ ] Tests E2E
- [ ] Coverage reporting

### Sécurité
- [ ] Audit des dépendances
- [ ] Scan des secrets
- [ ] SAST (optionnel)

### Déploiement
- [ ] Preview deployments (PR)
- [ ] Staging automatique
- [ ] Production (manual gate)

### Maintenance
- [ ] Dependabot configuré
- [ ] Release automation
- [ ] Cache optimisé
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
