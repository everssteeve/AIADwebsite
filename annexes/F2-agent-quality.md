# F.2 Agent Quality

## Pourquoi cet agent ?

L'agent Quality analyse la couverture de tests, les standards de code et la qualité globale du codebase pour maintenir un niveau de qualité élevé.

---

## Cas d'Usage

| Situation | Utilisation |
|-----------|-------------|
| PR Review | Vérifier la qualité du nouveau code |
| Génération de tests | Créer des tests pour du code existant |
| Audit qualité | Évaluer la santé du codebase |
| Amélioration continue | Identifier les zones à améliorer |

---

## Configuration

### System Prompt

```markdown
Tu es un expert en qualité logicielle. Ton rôle est d'analyser le code
pour évaluer et améliorer sa qualité : tests, lisibilité, maintenabilité.

## Ton Approche

1. Analyser le code selon les critères de qualité
2. Identifier les problèmes et les axes d'amélioration
3. Proposer des solutions concrètes avec exemples

## Critères d'Évaluation

### Testabilité
- Couverture de code
- Qualité des tests (pas juste quantité)
- Tests pertinents (edge cases, happy path)
- Mocking approprié

### Lisibilité
- Nommage clair et cohérent
- Fonctions courtes et focalisées
- Complexité cyclomatique raisonnable
- Code auto-documenté

### Maintenabilité
- DRY (Don't Repeat Yourself)
- SOLID principles
- Couplage faible
- Cohésion forte

### Standards
- Respect des conventions du projet
- Formatage cohérent
- Pas de code mort
- Imports organisés

## Format de Réponse

### Score Global : [X/10]

**Points Forts**
- [Point 1]
- [Point 2]

**Axes d'Amélioration**
- [Amélioration 1]
- [Amélioration 2]

**Recommandations Détaillées**
[Détails avec exemples de code]
```

### Règles Spécifiques

```markdown
## Règles Quality Agent

### Coverage
Attentes par zone :
- Business logic : > 90%
- API endpoints : > 80%
- UI components : > 70%
- Utilities : > 90%

### Complexité
Seuils recommandés :
- Complexité cyclomatique : < 10
- Lignes par fonction : < 50
- Paramètres par fonction : < 5
- Nesting : < 4 niveaux

### Tests
Types attendus :
- Unit tests : Fonctions isolées
- Integration tests : Interactions modules
- E2E tests : Parcours utilisateur critiques

### Anti-patterns à Détecter
- God classes/functions
- Feature envy
- Primitive obsession
- Long parameter lists
- Magic numbers/strings
```

---

## Utilisation

### Analyse de Couverture

```markdown
## Prompt : Analyse Coverage

Analyse la couverture de tests pour les fichiers suivants :

### Fichiers à Analyser
[Liste des fichiers]

### Rapport de Couverture Actuel
[Output de coverage tool si disponible]

### Questions
1. Quelles parties critiques ne sont pas testées ?
2. Quels tests seraient les plus impactants à ajouter ?
3. Y a-t-il des tests redondants ?

### Output Attendu
- Analyse par fichier
- Priorisation des tests à ajouter
- Exemples de tests recommandés
```

### Génération de Tests

```markdown
## Prompt : Générer Tests

Génère des tests complets pour la fonction suivante :

```typescript
[Code de la fonction]
```

### Contexte
- Framework de test : [Vitest/Jest]
- Le projet utilise : [Context technique]

### Couverture Attendue
- Happy path
- Edge cases (null, undefined, empty, limites)
- Cas d'erreur
- Cas aux limites (boundary)

### Format
Tests avec describe/it, assertions claires, setup/teardown si nécessaire.
```

### Review Qualité PR

```markdown
## Prompt : Quality Review PR

Review la qualité du code dans cette PR :

### Diff
[Code modifié]

### Checklist
- [ ] Nommage clair et cohérent
- [ ] Fonctions courtes et focalisées
- [ ] Pas de duplication
- [ ] Tests ajoutés pour le nouveau code
- [ ] Gestion d'erreurs appropriée
- [ ] Pas de TODO non justifié
- [ ] Pas de console.log

### Output
Score /10 avec justification et suggestions d'amélioration.
```

---

## Rapport Type

```markdown
# Rapport Quality Audit - [Module]

## Score Global : 7.5/10

### Résumé
| Critère | Score | Notes |
|---------|-------|-------|
| Coverage | 8/10 | 84% global, gaps identifiés |
| Lisibilité | 7/10 | Quelques fonctions longues |
| Maintenabilité | 8/10 | Bonne séparation |
| Standards | 7/10 | Inconsistances mineures |

---

## Analyse Détaillée

### Coverage

**État Actuel** : 84%

**Zones Sous-Couvertes**
| Fichier | Coverage | Risque |
|---------|----------|--------|
| TaskService.ts | 62% | 🔴 High |
| AuthMiddleware.ts | 71% | 🟡 Medium |

**Tests Prioritaires à Ajouter**
1. `TaskService.bulkDelete()` - Logique complexe non testée
2. `AuthMiddleware.verifyToken()` - Cas d'erreur non couverts

### Complexité

**Fonctions Complexes**
| Fonction | Cyclomatique | Lignes | Action |
|----------|--------------|--------|--------|
| processOrder() | 15 | 120 | 🔴 Refactorer |
| validateForm() | 12 | 80 | 🟡 Simplifier |

**Recommandation : processOrder()**
```typescript
// Avant : 1 fonction de 120 lignes
function processOrder(order: Order) {
  // 15 branches, difficile à tester
}

// Après : Fonctions focalisées
function processOrder(order: Order) {
  validateOrder(order)
  calculatePricing(order)
  applyDiscounts(order)
  createInvoice(order)
}
```

### Duplication

**Code Dupliqué Détecté**
| Pattern | Occurrences | Fichiers |
|---------|-------------|----------|
| Validation email | 3 | user.ts, auth.ts, contact.ts |
| Date formatting | 4 | Divers composants |

**Recommandation**
```typescript
// Créer un helper partagé
// src/lib/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

---

## Tests Recommandés

### 1. TaskService.bulkDelete

```typescript
describe('TaskService.bulkDelete', () => {
  it('should delete multiple tasks', async () => {
    const taskIds = ['1', '2', '3']
    await taskService.bulkDelete(taskIds)

    for (const id of taskIds) {
      expect(await taskService.findById(id)).toBeNull()
    }
  })

  it('should handle empty array', async () => {
    const result = await taskService.bulkDelete([])
    expect(result.deletedCount).toBe(0)
  })

  it('should handle non-existent ids gracefully', async () => {
    await expect(
      taskService.bulkDelete(['non-existent'])
    ).resolves.not.toThrow()
  })

  it('should rollback on partial failure', async () => {
    // Simuler une erreur sur le 2ème delete
    // Vérifier que le 1er n'est pas supprimé
  })
})
```

---

## Plan d'Amélioration

### Court Terme (cette semaine)
1. [ ] Ajouter tests pour TaskService.bulkDelete
2. [ ] Extraire la validation email en helper

### Moyen Terme (ce mois)
1. [ ] Refactorer processOrder()
2. [ ] Atteindre 80% coverage sur tous les services

### Métriques de Suivi
- Coverage : 84% → 90%
- Complexité max : 15 → 10
- Duplication : 7 → 3 patterns
```

---

## Intégration CI

```yaml
# .github/workflows/quality.yml
name: Quality Checks

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install

      # Coverage
      - name: Run tests with coverage
        run: pnpm test:coverage

      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80%"
            exit 1
          fi

      # Complexity
      - name: Check complexity
        run: npx ts-complexity src/**/*.ts --max-complexity 10

      # Lint
      - name: Lint
        run: pnpm lint

      # Duplication
      - name: Check duplication
        run: npx jscpd src --min-lines 10 --threshold 5
```

---

## Bonnes Pratiques

### Quand Utiliser l'Agent Quality

| Moment | Scope | Automatique |
|--------|-------|-------------|
| PR | Nouveau code | Oui (CI) |
| Après feature | Module concerné | Semi-auto |
| Quarterly | Full codebase | Manuel |

### Limites

- L'agent ne remplace pas les tests réels
- Les métriques sont des indicateurs, pas des absolus
- Le contexte humain reste important

### Combinaison avec Outils

```markdown
## Stack Quality

1. **Agent IA** : Analyse contextuelle, suggestions intelligentes
2. **Coverage tool** (c8, istanbul) : Métriques précises
3. **Linter** (ESLint) : Standards automatisés
4. **Complexity** (ts-complexity) : Métriques complexité
5. **Duplication** (jscpd) : Détection code dupliqué
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
