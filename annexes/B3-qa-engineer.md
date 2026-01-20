# B.3 QA Engineer

## Pourquoi cette annexe ?

Le QA Engineer dans AIAD garantit la qualité du code généré par les agents IA. Son rôle évolue : moins de tests manuels répétitifs, plus de stratégie de test, d'automatisation et de détection des patterns de bugs spécifiques à la génération IA.

---

## Le Rôle QA en Contexte AIAD

### Ce Qui Change

| QA Traditionnel | QA AIAD |
|-----------------|---------|
| Teste du code écrit par des humains | Teste du code généré par des agents IA |
| Trouve des bugs de logique humaine | Détecte des patterns de bugs IA (edge cases, incohérences) |
| Tests manuels fréquents | Automatisation maximale, manuel pour l'exploration |
| Intervient après le développement | En parallèle dès le début du cycle |
| Focus sur les bugs | Focus sur la cohérence et les edge cases oubliés |

### Responsabilités Clés

1. **Définir la stratégie de test** pour chaque feature
2. **Valider les outputs** contre le DoOD (Definition of Output Done)
3. **Identifier les patterns de bugs** récurrents des agents IA
4. **Automatiser** pour réduire le travail répétitif
5. **Former les PE** aux bonnes pratiques de test

---

## Workflow Quotidien

### Travail en Parallèle du Développement

```
Cycle AIAD commence
        │
        ├── [PM] SPEC Ready
        │
        ├── [QA] Prépare la stratégie de test ◄── En parallèle
        │
        ├── [PE] Commence l'implémentation
        │
        ├── [QA] Review code + tests unitaires ◄── À chaque livraison
        │
        ├── [PE] Intègre le feedback QA
        │
        ├── [QA] Tests d'intégration
        │
        ├── [PE] Finalise
        │
        ├── [QA] Tests E2E + Validation DoOD
        │
        └── ✓ Output validé
```

### Checklist Quotidienne

```markdown
## Daily QA - [Date]

### Suivi des SPECs en Cours
- [ ] SPEC-XXX : Stratégie prête ? Tests automatisés préparés ?
- [ ] SPEC-YYY : Code livré ? Review effectuée ?

### Qualité Continue
- [ ] Résultats CI vérifiés (tests échoués ?)
- [ ] Couverture de code stable ou en hausse ?
- [ ] Tests flaky identifiés et trackés ?

### Collaboration
- [ ] Feedback PE donné (< 4h après livraison)
- [ ] Blocages QA communiqués
```

---

## Stratégies de Test par Contexte

### Nouvelle Feature

```markdown
## Stratégie de Test : [Feature Name]

### Tests Unitaires (PE responsable, QA review)
- [ ] Fonctions métier isolées
- [ ] Edge cases identifiés dans la spec
- [ ] Mocks des dépendances externes

### Tests d'Intégration (QA responsable)
- [ ] API endpoints avec DB de test
- [ ] Workflows multi-composants
- [ ] Intégrations externes (mockées)

### Tests E2E (QA responsable)
- [ ] Happy path principal
- [ ] Parcours alternatifs critiques
- [ ] Cas d'erreur utilisateur

### Tests Manuels (QA responsable)
- [ ] Exploration des edge cases non spécifiés
- [ ] Cross-browser (si applicable)
- [ ] Responsive (si applicable)
- [ ] Accessibilité (navigation clavier, lecteur d'écran)
```

### Bug Fix

```markdown
## Stratégie de Test : Bug Fix [BUG-ID]

### Avant le Fix
- [ ] Bug reproduit manuellement
- [ ] Test automatisé écrit qui échoue (red)

### Après le Fix
- [ ] Test passe (green)
- [ ] Tests existants passent (pas de régression)
- [ ] Test manuel de confirmation

### Documentation
- [ ] Root cause documentée
- [ ] Pattern ajouté à la surveillance si récurrent
```

### Refactoring

```markdown
## Stratégie de Test : Refactoring [Zone]

### Pré-requis
- [ ] Couverture existante ≥ 80% sur la zone ?
- [ ] Si non, ajouter des tests de caractérisation d'abord

### Pendant
- [ ] Tests passent à chaque étape
- [ ] Aucune modification des tests (sauf si API change)

### Après
- [ ] Couverture maintenue ou améliorée
- [ ] Test manuel du parcours principal
- [ ] Performance non dégradée (si applicable)
```

---

## Pyramide de Tests AIAD

```
              /\
             /  \   E2E (10%)
            /    \  → Parcours critiques uniquement
           /------\  → Lent, fragile, coûteux
          /        \
         /          \   Intégration (20%)
        /            \  → API, workflows, DB
       /--------------\  → Medium speed
      /                \
     /                  \   Unitaires (70%)
    /                    \  → Fonctions, composants
   /----------------------\  → Rapide, fiable
```

### Répartition par Responsable

| Type | Responsable | Review par |
|------|-------------|------------|
| Unitaires | PE | QA |
| Intégration | QA (ou PE si simple) | QA |
| E2E | QA | QA |
| Manuel exploratoire | QA | - |

---

## Patterns de Bugs des Agents IA

### Bugs Récurrents à Surveiller

| Pattern | Description | Prévention |
|---------|-------------|------------|
| **Edge Cases Oubliés** | null, undefined, [], "" non gérés | Lister les edge cases dans la spec |
| **Over-engineering** | Code trop complexe pour des cas simples | Demander explicitement la simplicité |
| **Incohérence de Style** | Mix de patterns différents dans le même fichier | AGENT-GUIDE strict + review |
| **Dépendances Fantômes** | Import de packages non installés | CI avec lockfile strict |
| **Types Trop Permissifs** | Usage de `any` en TypeScript | `strict: true` dans tsconfig |
| **Tests Triviaux** | Tests qui ne testent rien de significatif | Review systématique des tests |
| **Logique Dupliquée** | Même logique réimplémentée au lieu de réutiliser | Vérifier les helpers existants |

### Checklist de Review Code IA

```markdown
## Review Code Généré par IA

### Cohérence
- [ ] Suit les patterns existants du projet ?
- [ ] Nomenclature conforme à l'AGENT-GUIDE ?
- [ ] Pas de mix de styles (callbacks vs async/await) ?
- [ ] Imports dans le bon ordre ?

### Complétude
- [ ] Tous les cas de la spec couverts ?
- [ ] Gestion des erreurs présente ?
- [ ] Edge cases gérés (null, empty, invalid) ?
- [ ] Loading states si applicable ?

### Sécurité
- [ ] Inputs validés côté serveur ?
- [ ] Pas de secrets en dur ?
- [ ] Pas d'injection possible (SQL, XSS) ?
- [ ] Permissions vérifiées ?

### Performance
- [ ] Pas de N+1 queries ?
- [ ] Pas de calculs coûteux dans les renders ?
- [ ] Pas de fuites mémoire évidentes ?
- [ ] Lazy loading si applicable ?
```

---

## Automatisation

### Configuration CI Recommandée

```yaml
# Exemple GitHub Actions
name: Quality Gates

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit --coverage
      - name: Check Coverage
        run: |
          # Échoue si couverture < 80%
          pnpm coverage:check --threshold=80

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test:e2e

  quality-gates:
    needs: [unit-tests, integration-tests, e2e-tests]
    runs-on: ubuntu-latest
    steps:
      - name: All gates passed
        run: echo "Quality gates OK"
```

### Gestion des Tests Flaky

```markdown
## Protocole Tests Flaky

### Définition
Un test est flaky s'il échoue de manière intermittente sans changement de code.

### Quand un Test est Détecté Flaky

1. **Immédiat** : Marquer le test avec `@flaky` ou `skip.failing`
2. **Sous 48h** : Créer un ticket avec priorité haute
3. **Sous 1 semaine** : Fix ou suppression

### Causes Courantes et Solutions

| Cause | Symptôme | Solution |
|-------|----------|----------|
| Timing | Échoue sous charge | Ajouter des attentes explicites |
| Ordre d'exécution | Échoue en isolation | Isoler le state entre tests |
| Données partagées | Échoue en parallèle | Utiliser des fixtures isolées |
| Dépendance externe | Échoue aléatoirement | Mocker la dépendance |

### Règle
Aucun test flaky ne reste plus de 2 semaines.
Après 2 semaines : fix ou delete, pas de skip permanent.
```

---

## Livrables QA

### Rapport de Validation

```markdown
## Rapport QA - SPEC-XXX

**Date** : YYYY-MM-DD
**QA Engineer** : [Nom]
**Statut** : ✅ Validé | ⚠️ Validé avec réserves | ❌ Rejeté

### Résumé
[1-2 phrases sur l'état de la livraison]

### Tests Automatisés
| Type | Passés | Échoués | Skipped |
|------|--------|---------|---------|
| Unitaires | 45 | 0 | 2 |
| Intégration | 12 | 0 | 0 |
| E2E | 3 | 0 | 0 |

### Couverture
- Avant : 82%
- Après : 84%
- Delta : +2% ✓

### Tests Manuels
| Scénario | Résultat | Notes |
|----------|----------|-------|
| Happy path | ✅ | - |
| Erreur réseau | ✅ | Message clair |
| Mobile (320px) | ⚠️ | Bouton légèrement tronqué |

### Validation DoOD
- [x] Critères d'acceptation satisfaits
- [x] Tests automatisés présents et passants
- [x] Code reviewé
- [x] Pas de régression
- [ ] Accessibilité (hors scope ce cycle)

### Recommandation
[Validé | Validé avec réserves à adresser | Rejeté pour raison X]

### Bugs Identifiés
| ID | Description | Sévérité | Bloquant ? |
|----|-------------|----------|------------|
| BUG-123 | Bouton tronqué < 320px | P3 | Non |
```

### Test Data Management

```typescript
// tests/fixtures/tasks.ts
export const taskFixtures = {
  // Cas nominal
  standard: [
    { id: '1', title: 'Task 1', status: 'todo' },
    { id: '2', title: 'Task 2', status: 'done' },
  ],

  // Edge cases
  empty: [],

  single: [
    { id: '1', title: 'Seule tâche', status: 'todo' }
  ],

  // Limites
  maxTasks: Array.from({ length: 100 }, (_, i) => ({
    id: String(i),
    title: `Task ${i}`,
    status: 'todo'
  })),

  // Données problématiques
  withEdgeCases: [
    { id: '1', title: '', status: 'todo' },                    // titre vide
    { id: '2', title: 'A'.repeat(1000), status: 'todo' },      // titre très long
    { id: '3', title: '<script>alert("xss")</script>', status: 'todo' }, // tentative XSS
    { id: '4', title: 'Test émojis 🎉', status: 'todo' },      // caractères spéciaux
  ]
}
```

---

## Anti-patterns

### 1. Le QA Bottleneck

**Symptôme** : Tout passe par le QA avant merge.

```
❌ File d'attente de PRs "waiting for QA"
❌ QA = seul point de validation
```

**Impact** : Ralentissement du cycle, QA submergé, équipe frustrée.

**Correction** :
```
✅ Tests automatisés bloquants en CI (PE peut merger si vert)
✅ PE responsable des tests unitaires
✅ QA focus sur intégration, E2E, et stratégie
✅ Review asynchrone quand possible
```

### 2. Le QA Détaché

**Symptôme** : QA découvre les features à la fin.

```
❌ "Je n'étais pas au courant de cette spec"
❌ Stratégie de test créée après le code
```

**Impact** : Tests superficiels, bugs en prod, retravail.

**Correction** :
```
✅ QA review les specs avant "Ready"
✅ Stratégie de test préparée dès le début du cycle
✅ QA participe à l'estimation (effort de test)
```

### 3. Les Tests Fragiles

**Symptôme** : Tests qui échouent aléatoirement.

```
❌ "Ce test est flaky, on le skip"
❌ CI rouge ignorée "ça passera au re-run"
```

**Impact** : CI non fiable, vrais bugs ignorés, équipe perd confiance.

**Correction** :
```
✅ Traiter les tests flaky comme des bugs P1
✅ Identifier la cause root (timing, data, env)
✅ Fix ou delete sous 2 semaines (pas de skip permanent)
```

### 4. Le QA Policier

**Symptôme** : QA bloque sur chaque détail.

```
❌ "Je refuse, le nom de variable n'est pas parfait"
❌ Bloquages pour des points cosmétiques
```

**Impact** : Friction avec l'équipe, contournement du QA.

**Correction** :
```
✅ Distinguer bloquant vs amélioration
✅ Bloquant = bug fonctionnel, sécurité, régression
✅ Amélioration = feedback non bloquant dans la PR
```

---

## Métriques à Suivre

| Métrique | Cible | Alerte Si |
|----------|-------|-----------|
| Couverture de code | > 80% | < 75% |
| Tests flaky | 0 | > 3 |
| Temps validation QA | < 4h | > 1 jour |
| Bugs en prod / cycle | < 2 | > 5 |
| Régressions | 0 | > 1 |

---

## Checklist

### Avant Chaque Cycle
- [ ] Specs reviewées et comprises
- [ ] Stratégie de test documentée
- [ ] Fixtures et mocks prêts

### Pendant le Cycle
- [ ] Review du code livré < 4h
- [ ] Tests d'intégration écrits
- [ ] Communication des blocages

### Avant Validation Finale
- [ ] Tous les tests automatisés passent
- [ ] Tests manuels exploratoires faits
- [ ] DoOD checklist complète
- [ ] Rapport de validation rédigé

---

*Annexes connexes : [A.5 Template DoOD](A5-dood.md) • [B.2 Product Engineer](B2-product-engineer.md) • [C.4 Boucle VALIDER](C4-boucle-valider.md)*
