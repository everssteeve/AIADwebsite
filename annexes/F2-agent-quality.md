# F.2 Agent Quality

## Pourquoi cette annexe ?

La qualité du code généré par les agents IA varie. L'Agent Quality évalue la couverture de tests, la lisibilité, la maintenabilité et le respect des standards. Il identifie les zones à risque et génère des tests pertinents. Cette annexe fournit la configuration, les métriques cibles et les patterns d'utilisation.

---

## System Prompt Complet

```markdown
Tu es un expert en qualité logicielle. Ton rôle est d'analyser le code
pour évaluer et améliorer sa qualité : tests, lisibilité, maintenabilité.

## Ton Approche

1. Analyser le code selon les critères de qualité définis
2. Identifier les problèmes concrets avec leur localisation
3. Proposer des améliorations actionnables avec exemples
4. Générer des tests si demandé

## Critères d'Évaluation

### Testabilité (30%)
- Couverture de code (lines, branches, functions)
- Qualité des tests (pas juste quantité)
- Tests pertinents (happy path, edge cases, error cases)
- Testabilité du code (injection de dépendances, fonctions pures)

### Lisibilité (25%)
- Nommage clair et cohérent (variables, fonctions, classes)
- Fonctions courtes et focalisées (< 50 lignes)
- Complexité cyclomatique raisonnable (< 10)
- Code auto-documenté (intention claire sans commentaires)

### Maintenabilité (25%)
- DRY (Don't Repeat Yourself) - pas de duplication > 3 lignes
- Principes SOLID respectés
- Couplage faible entre modules
- Cohésion forte au sein des modules

### Standards (20%)
- Conventions du projet respectées
- Formatage cohérent (lint rules)
- Pas de code mort (imports, variables, fonctions)
- Gestion d'erreurs appropriée

## Seuils par Zone

| Zone | Coverage | Complexité Max | Duplication |
|------|----------|----------------|-------------|
| Business Logic | > 90% | 8 | 0 |
| API/Controllers | > 80% | 10 | 0 |
| UI Components | > 70% | 6 | < 3 patterns |
| Utilities | > 95% | 5 | 0 |
| Config/Setup | > 50% | 15 | Acceptable |

## Anti-patterns à Détecter

- God classes/functions (> 500 lignes, > 10 responsabilités)
- Feature envy (méthode qui utilise plus une autre classe que la sienne)
- Primitive obsession (données métier sous forme de primitifs)
- Long parameter lists (> 4 paramètres)
- Magic numbers/strings (valeurs en dur sans constante)
- Shotgun surgery (un changement nécessite des modifications partout)
- Dead code (code jamais exécuté)

## Format de Réponse

### Score Global : X/10

**Résumé**
[1-2 phrases sur l'état général]

**Points Forts**
- [Point positif 1]
- [Point positif 2]

**Axes d'Amélioration Prioritaires**
1. [Critique] Description + localisation
2. [Important] Description + localisation

**Détails par Critère**
[Analyse détaillée avec code snippets]

**Actions Recommandées**
- Court terme : [...]
- Moyen terme : [...]
```

---

## Utilisation par Contexte

### Analyse de Couverture

```markdown
## Contexte
Analyse la couverture de tests pour identifier les gaps critiques.

## Rapport de Couverture Actuel
[Coller l'output de c8/istanbul/coverage]

## Code Source
[Fichiers à analyser]

## Questions
1. Quelles parties critiques (business logic) ne sont pas testées ?
2. Y a-t-il des branches non couvertes dans du code à risque ?
3. Quels tests auraient le meilleur ROI ?

## Output Attendu
- Analyse gap par gap avec priorité
- Tests recommandés avec squelette de code
- Estimation de l'effort
```

### Génération de Tests

```markdown
## Contexte
Génère des tests complets pour la fonction/module suivant.

## Code à Tester
```typescript
[Code source]
```

## Framework de Test
[Vitest / Jest / pytest / etc.]

## Dépendances à Mocker
[Services, APIs, DB, etc.]

## Couverture Attendue
- Happy path (cas nominal)
- Edge cases (null, undefined, empty, limites)
- Error cases (exceptions, rejets)
- Boundary cases (min, max, overflow)

## Format des Tests
- describe/it ou test avec noms descriptifs
- Assertions claires (expect + matcher précis)
- Setup/teardown si nécessaire
- Mocks explicites et réinitialisés
```

### Review Qualité de PR

```markdown
## Contexte
Review la qualité du code dans cette PR.

## Diff
[Code modifié]

## Checklist de Review
- [ ] Nommage clair et cohérent
- [ ] Fonctions courtes et focalisées (< 50 lignes)
- [ ] Pas de duplication de code
- [ ] Tests ajoutés pour le nouveau code
- [ ] Gestion d'erreurs appropriée
- [ ] Pas de TODO sans ticket associé
- [ ] Pas de console.log/print de debug
- [ ] Types corrects (pas de any)

## Output
Score /10 avec justification par critère et suggestions concrètes.
```

---

## Exemples Pratiques

### Exemple 1 : Analyse de Couverture

**Input :**
```
File                 | % Stmts | % Branch | % Funcs | % Lines
---------------------|---------|----------|---------|--------
services/            |   72.5  |   58.3   |   80.0  |   71.2
  TaskService.ts     |   62.1  |   45.0   |   70.0  |   60.5
  UserService.ts     |   85.3  |   75.0   |   90.0  |   84.2
  AuthService.ts     |   68.9  |   52.0   |   80.0  |   67.8
```

**Output de l'Agent :**

### Score Coverage : 6/10

**Analyse**

| Service | Score | Verdict | Priorité |
|---------|-------|---------|----------|
| TaskService | 62% | ❌ Insuffisant | 🔴 Critique |
| AuthService | 69% | ⚠️ Limite | 🟠 High |
| UserService | 85% | ✅ Acceptable | 🟢 OK |

**Gaps Critiques Identifiés**

### TaskService.ts - Coverage branches 45%

Les branches non couvertes sont probablement dans la logique conditionnelle.

**Hypothèse basée sur le code type :**
```typescript
// Ces branches ne sont probablement pas testées :
if (task.status === 'archived') { ... }  // Cas rare
if (task.assignee && task.assignee.isAdmin) { ... }  // Combinaison
try { ... } catch (e) { ... }  // Error paths
```

**Tests Prioritaires à Ajouter**

```typescript
describe('TaskService', () => {
  describe('updateTask', () => {
    it('should handle archived task update attempt', async () => {
      const archivedTask = createTask({ status: 'archived' })
      await expect(taskService.updateTask(archivedTask.id, { title: 'New' }))
        .rejects.toThrow('Cannot update archived task')
    })

    it('should allow admin to force update', async () => {
      const task = createTask({ assignee: adminUser })
      const result = await taskService.updateTask(task.id, { force: true })
      expect(result.updated).toBe(true)
    })

    it('should handle database error gracefully', async () => {
      vi.spyOn(db, 'update').mockRejectedValue(new Error('DB unavailable'))
      await expect(taskService.updateTask('123', {}))
        .rejects.toThrow('Service temporarily unavailable')
    })
  })
})
```

**Estimation Effort**
- TaskService : 4h pour atteindre 85%
- AuthService : 2h pour atteindre 80%

---

### Exemple 2 : Code Smells Détectés

**Input :**
```typescript
function processOrder(order, user, config, db, logger, mailer) {
  if (order.items.length > 0) {
    let total = 0
    for (let i = 0; i < order.items.length; i++) {
      if (order.items[i].quantity > 0) {
        if (order.items[i].price > 0) {
          total = total + (order.items[i].quantity * order.items[i].price)
          if (order.items[i].discount) {
            total = total - order.items[i].discount
          }
        }
      }
    }
    // ... 200 more lines
  }
}
```

**Output de l'Agent :**

### Score : 3/10

**Code Smells Détectés**

| Smell | Sévérité | Localisation |
|-------|----------|--------------|
| Long Parameter List | 🟡 Medium | L1: 6 paramètres |
| Deep Nesting | 🔴 High | L4-11: 5 niveaux |
| God Function | 🔴 High | 200+ lignes |
| Magic Operations | 🟡 Medium | Calcul inline |

**Refactoring Recommandé**

```typescript
// 1. Extraire un objet de contexte
interface OrderContext {
  db: Database
  logger: Logger
  mailer: Mailer
  config: Config
}

// 2. Décomposer en fonctions focalisées
function processOrder(order: Order, user: User, ctx: OrderContext): OrderResult {
  validateOrder(order)
  const total = calculateTotal(order.items)
  const result = persistOrder(order, total, ctx.db)
  notifyUser(user, result, ctx.mailer)
  return result
}

// 3. Fonction pure pour le calcul
function calculateTotal(items: OrderItem[]): number {
  return items
    .filter(item => item.quantity > 0 && item.price > 0)
    .reduce((sum, item) => {
      const itemTotal = item.quantity * item.price
      return sum + itemTotal - (item.discount ?? 0)
    }, 0)
}

// 4. Validation séparée
function validateOrder(order: Order): void {
  if (order.items.length === 0) {
    throw new EmptyOrderError()
  }
}
```

**Bénéfices**
- Testabilité : `calculateTotal` est une fonction pure, testable sans mock
- Lisibilité : Chaque fonction a une responsabilité claire
- Maintenabilité : Changement de calcul = 1 seul endroit

---

## Rapport Type

```markdown
# Rapport Qualité - [Module] - [Date]

## Score Global : 7.5/10

### Résumé Exécutif
Module globalement sain avec une bonne séparation des responsabilités.
Points d'attention sur la couverture des error paths et quelques
fonctions trop longues.

---

## Métriques

| Critère | Score | Cible | Status |
|---------|-------|-------|--------|
| Coverage Lines | 78% | > 80% | ⚠️ |
| Coverage Branches | 65% | > 75% | ❌ |
| Complexité Moy. | 6.2 | < 10 | ✅ |
| Complexité Max | 18 | < 15 | ❌ |
| Duplication | 2.1% | < 3% | ✅ |
| Lignes Max/Fonction | 120 | < 50 | ❌ |

---

## Problèmes par Priorité

### 🔴 Critique

**Fonction processPayment trop complexe**
- Fichier : `src/services/PaymentService.ts:45-165`
- Complexité : 18 (seuil : 15)
- Lignes : 120 (seuil : 50)
- Impact : Difficile à tester, bug-prone

### 🟡 Important

**Branches non testées dans AuthService**
- Fichier : `src/services/AuthService.ts`
- Coverage branches : 52%
- Risque : Bugs non détectés dans les cas d'erreur

### 🟢 Mineur

**Duplication pattern de validation**
- Fichiers : `UserController.ts`, `TaskController.ts`
- Pattern : Validation email répétée 3x
- Fix : Extraire dans `validators/email.ts`

---

## Tests à Ajouter (Priorité Haute)

```typescript
// PaymentService.test.ts
describe('processPayment error handling', () => {
  it('should handle gateway timeout', async () => { ... })
  it('should handle invalid card', async () => { ... })
  it('should handle insufficient funds', async () => { ... })
  it('should rollback on partial failure', async () => { ... })
})
```

---

## Plan d'Action

| Action | Effort | Impact | Priorité |
|--------|--------|--------|----------|
| Refactor processPayment | 4h | High | Cette semaine |
| Tests error paths Auth | 2h | High | Cette semaine |
| Extraire validation email | 1h | Low | Backlog |

---

## Évolution Recommandée

**Court terme (ce sprint)**
- Atteindre 80% coverage sur services critiques
- Refactorer les 2 fonctions > 100 lignes

**Moyen terme (ce quarter)**
- Mettre en place mutation testing
- Ajouter des tests de contrat API
```

---

## Intégration CI/CD

### GitHub Actions

```yaml
name: Quality Checks

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install

      # Tests avec coverage
      - name: Run tests with coverage
        run: pnpm test:coverage

      # Vérification seuils coverage
      - name: Check coverage thresholds
        run: |
          pnpm coverage:check --lines 80 --branches 75 --functions 80

      # Analyse complexité
      - name: Check complexity
        run: npx ts-complexity src/**/*.ts --max-complexity 15 --fail

      # Détection duplication
      - name: Check duplication
        run: npx jscpd src --min-lines 10 --threshold 3

      # Upload rapport
      - name: Upload coverage report
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### Configuration Seuils

```json
// package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 75,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "./src/services/": {
        "branches": 85,
        "lines": 90
      }
    }
  }
}
```

---

## Anti-patterns

### ❌ Viser 100% de coverage

**Problème** : Effort démesuré pour les derniers %, tests fragiles sur du code trivial.

**Solution** : Définir des seuils réalistes par zone. 90% sur business logic, 70% sur UI suffit généralement.

### ❌ Tests qui testent l'implémentation

**Problème** : Tests cassent à chaque refactoring, même si le comportement est correct.

```typescript
// ❌ Mauvais : teste l'implémentation
expect(spy).toHaveBeenCalledWith('internal-method', { exact: 'args' })

// ✅ Bon : teste le comportement
expect(result.status).toBe('success')
expect(user.notifications).toContainEqual(expect.objectContaining({ type: 'welcome' }))
```

### ❌ Métriques comme objectif unique

**Problème** : Coverage élevé mais tests sans assertions pertinentes.

**Solution** : Combiner coverage + mutation testing + review manuelle des tests.

### ❌ Ignorer la dette de test

**Problème** : Code critique non testé depuis longtemps, personne n'ose y toucher.

**Solution** : Allouer 20% du temps de chaque sprint à la dette technique/test.

### ❌ Tests unitaires partout

**Problème** : Trop de mocks, tests ne détectent pas les bugs d'intégration.

**Solution** : Pyramide de tests équilibrée : 70% unit, 20% integration, 10% E2E.

---

## Checklist Agent Quality

### Avant Analyse
- [ ] Rapport de coverage disponible
- [ ] Accès au code source complet
- [ ] Contexte projet (stack, conventions)
- [ ] Seuils attendus définis

### Pendant Analyse
- [ ] Évaluer chaque critère avec exemples
- [ ] Identifier les 3-5 problèmes prioritaires
- [ ] Proposer des fixes avec code
- [ ] Estimer l'effort de correction

### Après Analyse
- [ ] Rapport structuré généré
- [ ] Actions priorisées
- [ ] Tests suggérés avec squelettes
- [ ] Métriques de suivi définies

---

## Outils Complémentaires

| Besoin | Outil | Usage |
|--------|-------|-------|
| Coverage | c8, istanbul, coverage.py | Mesure couverture |
| Mutation Testing | Stryker, mutmut | Valide qualité des tests |
| Complexity | ts-complexity, radon | Mesure complexité |
| Duplication | jscpd, CPD | Détecte code dupliqué |
| Linting | ESLint, Ruff | Standards automatisés |
| Type Check | TypeScript, mypy | Détecte erreurs de type |

**Recommandation** : L'Agent Quality analyse et explique. Les outils mesurent et enforçent. Combiner les deux.

---

*Voir aussi : [F.1 Agent Security](./F1-agent-security.md) • [F.6 Agent Code Review](./F6-agent-code-review.md) • [B.3 QA Engineer](./B3-qa-engineer.md)*
