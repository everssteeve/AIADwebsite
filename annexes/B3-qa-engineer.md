# B.3 Détails QA Engineer

## Pourquoi cette annexe ?

Cette annexe détaille les stratégies de test, l'automatisation et le workflow quotidien du QA Engineer dans un contexte AIAD où le code est majoritairement généré par des agents IA.

---

## Rôle Spécifique en Contexte AIAD

### Différences avec le QA Traditionnel

| QA Traditionnel | QA AIAD |
|-----------------|---------|
| Teste du code humain | Teste du code généré par IA |
| Focus sur les bugs | Focus sur la cohérence et les edge cases |
| Tests manuels fréquents | Automatisation maximale |
| Après le développement | En parallèle du développement |

### Responsabilités Clés

1. **Définir la stratégie de test** par fonctionnalité
2. **Valider les outputs** contre le DoOD
3. **Identifier les patterns de bugs** récurrents des agents
4. **Automatiser** pour réduire le travail répétitif
5. **Former les PE** aux bonnes pratiques de test

---

## Stratégies de Test par Contexte

### Nouvelle Feature

```markdown
## Stratégie : Feature [Nom]

### Tests Unitaires (PE responsable, QA review)
- [ ] Fonctions métier isolées
- [ ] Edge cases identifiés dans la spec
- [ ] Mocks des dépendances externes

### Tests d'Intégration (QA responsable)
- [ ] API endpoints avec DB de test
- [ ] Workflows multi-composants
- [ ] Intégration avec services externes (mocked)

### Tests E2E (QA responsable)
- [ ] Parcours utilisateur principal (happy path)
- [ ] Parcours alternatifs critiques
- [ ] Cas d'erreur utilisateur

### Tests Manuels (QA responsable)
- [ ] Exploration des edge cases non spécifiés
- [ ] Vérification cross-browser (si applicable)
- [ ] Vérification responsive (si applicable)
```

### Bug Fix

```markdown
## Stratégie : Bug Fix [ID]

### Avant le Fix
- [ ] Reproduire le bug manuellement
- [ ] Écrire un test qui échoue (red)

### Après le Fix
- [ ] Test passe (green)
- [ ] Pas de régression (tests existants passent)
- [ ] Test manuel de confirmation
```

### Refactoring

```markdown
## Stratégie : Refactoring [Zone]

### Avant le Refactoring
- [ ] Couverture de tests existante suffisante ?
- [ ] Si non, ajouter des tests caractérisation

### Pendant le Refactoring
- [ ] Tests passent à chaque étape
- [ ] Pas de modification des tests (sauf si API change)

### Après le Refactoring
- [ ] Tous les tests passent
- [ ] Couverture maintenue ou améliorée
- [ ] Test manuel du parcours principal
```

---

## Automatisation

### Pyramide de Tests AIAD

```
          /\
         /  \  E2E (10%)
        /    \  - Parcours critiques uniquement
       /------\
      /        \  Intégration (20%)
     /          \  - API, workflows
    /------------\
   /              \  Unitaires (70%)
  /                \  - Fonctions, composants
 /------------------\
```

### Configuration CI/CD

```yaml
# Exemple GitHub Actions
name: Tests

on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm test:coverage --reporter=json
      - name: Coverage Check
        run: |
          # Fail if coverage drops below threshold
          node scripts/check-coverage.js --min=80

  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:integration

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test:e2e
```

### Scripts d'Automatisation

```typescript
// scripts/check-coverage.js
import { readFileSync } from 'fs'

const coverage = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'))
const threshold = parseInt(process.argv.find(a => a.startsWith('--min='))?.split('=')[1] || '80')

const total = coverage.total.lines.pct

if (total < threshold) {
  console.error(`Coverage ${total}% is below threshold ${threshold}%`)
  process.exit(1)
}

console.log(`Coverage ${total}% meets threshold ${threshold}%`)
```

---

## Patterns de Bugs des Agents IA

### Bugs Récurrents à Surveiller

| Pattern | Description | Prévention |
|---------|-------------|------------|
| **Edge Cases Oubliés** | L'agent ne gère pas null, undefined, empty | Toujours lister les edge cases dans la spec |
| **Over-engineering** | Code trop complexe pour des cas simples | Demander explicitement la simplicité |
| **Incohérence de Style** | Mix de patterns différents | AGENT-GUIDE strict + review |
| **Dépendances Fantômes** | Import de packages non installés | CI avec `pnpm install --frozen-lockfile` |
| **Types Trop Permissifs** | Usage de `any` | `strict: true` dans tsconfig |
| **Tests Triviaux** | Tests qui ne testent rien de significatif | Review des tests par QA |

### Checklist de Review Spécifique IA

```markdown
## Review Code Généré par IA

### Cohérence
- [ ] Suit les patterns du projet ?
- [ ] Nomenclature conforme à l'AGENT-GUIDE ?
- [ ] Pas de mix de styles (ex: callbacks vs async/await) ?

### Complétude
- [ ] Tous les cas de la spec couverts ?
- [ ] Gestion des erreurs présente ?
- [ ] Edge cases gérés (null, empty, invalid input) ?

### Sécurité
- [ ] Inputs validés ?
- [ ] Pas de secrets en dur ?
- [ ] Pas de vulnérabilité évidente ?

### Performance
- [ ] Pas de N+1 queries ?
- [ ] Pas de calculs inutiles dans les renders ?
- [ ] Pas de fuites mémoire évidentes ?
```

---

## Workflow Quotidien

### En Parallèle du Développement

```
PE commence SPEC-042
        │
        ├── QA prépare la stratégie de test
        │
PE livre première itération
        │
        ├── QA review le code + tests unitaires
        │
PE intègre le feedback
        │
        ├── QA écrit/exécute tests d'intégration
        │
PE finalise
        │
        ├── QA exécute tests E2E + validation DoOD
        │
        └── ✓ Output validé
```

### Rapport de Validation

```markdown
## Rapport QA - SPEC-042

**Date** : 2026-01-18
**QA Engineer** : Alice Martin
**Statut** : ✅ Validé / ⚠️ Validé avec réserves / ❌ Rejeté

### Tests Automatisés
| Type | Passés | Échoués | Skipped |
|------|--------|---------|---------|
| Unit | 45 | 0 | 2 |
| Integration | 12 | 0 | 0 |
| E2E | 3 | 0 | 0 |

### Couverture
- Avant : 82%
- Après : 84%

### Tests Manuels
| Scénario | Résultat | Notes |
|----------|----------|-------|
| Happy path | ✅ | - |
| Erreur réseau | ✅ | Message clair affiché |
| Mobile | ⚠️ | Bouton légèrement tronqué sur iPhone SE |

### DoOD Checklist
- [x] Critères d'acceptation satisfaits
- [x] Tests passants
- [x] Code reviewé
- [x] Pas de régression
- [ ] Accessibilité *(non vérifié - hors scope)*

### Recommandation
Validé. Le bug mobile mineur peut être adressé dans un fix ultérieur.

### Bugs Identifiés
- **BUG-123** : Bouton tronqué sur écrans < 320px (P2)
```

---

## Outils et Techniques

### Test Data Management

```typescript
// tests/fixtures/tasks.ts
export const taskFixtures = {
  empty: [],

  single: [
    { id: '1', title: 'Task 1', status: 'todo' }
  ],

  mixed: [
    { id: '1', title: 'Task 1', status: 'todo' },
    { id: '2', title: 'Task 2', status: 'in_progress' },
    { id: '3', title: 'Task 3', status: 'done' },
  ],

  withEdgeCases: [
    { id: '1', title: '', status: 'todo' }, // titre vide
    { id: '2', title: 'A'.repeat(1000), status: 'todo' }, // titre très long
    { id: '3', title: '<script>alert("xss")</script>', status: 'todo' }, // XSS attempt
  ]
}
```

### Snapshot Testing (avec précaution)

```typescript
// Pour les composants stables uniquement
import { render } from '@testing-library/react'
import { TaskCard } from './TaskCard'

test('TaskCard renders correctly', () => {
  const { container } = render(
    <TaskCard task={{ id: '1', title: 'Test', status: 'todo' }} />
  )
  expect(container).toMatchSnapshot()
})

// ⚠️ Éviter pour :
// - Composants en évolution rapide
// - Composants avec dates/IDs dynamiques
// - Listes avec ordre non déterministe
```

### Visual Regression Testing

```typescript
// playwright/visual.spec.ts
import { test, expect } from '@playwright/test'

test('task list visual regression', async ({ page }) => {
  await page.goto('/tasks')
  await page.waitForSelector('[data-testid="task-list"]')

  await expect(page).toHaveScreenshot('task-list.png', {
    maxDiffPixels: 100, // tolérance pour anti-aliasing
  })
})
```

---

## Anti-patterns du QA

### 1. "Le QA Bottleneck"

**Symptôme** : Tout passe par le QA avant de merger
```
❌ File d'attente de PRs en "waiting for QA"
```

**Solution** : Automatiser et déléguer
```
✅ Tests automatisés bloquants en CI
✅ PE responsable des tests unitaires
✅ QA focus sur l'intégration et E2E
```

### 2. "Le QA Détaché"

**Symptôme** : QA découvre les features à la fin
```
❌ "Je n'étais pas au courant de cette spec"
```

**Solution** : Intégration dès la planification
```
✅ QA review les specs avant Ready
✅ QA participe à l'estimation (effort de test)
```

### 3. "Les Tests Fragiles"

**Symptôme** : Tests qui échouent aléatoirement
```
❌ "Ce test est flaky, on le skip"
```

**Solution** : Traiter les tests flaky comme des bugs
```
✅ Identifier la cause (timing, data, env)
✅ Fixer ou supprimer (pas de skip permanent)
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
