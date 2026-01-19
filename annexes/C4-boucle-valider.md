# C.4 Boucle VALIDER - Détails

## Pourquoi cette annexe ?

Cette annexe détaille la boucle VALIDER : le template de rapport QA, les critères de régression et les stratégies de validation efficaces.

---

## Vue d'Ensemble

### Objectif de la Boucle
Vérifier que l'output satisfait le DoOD et ne crée pas de régression.

### Durée Typique
1 à 4 heures selon la complexité de la feature.

### Participant Principal
**QA Engineer** (ou Product Engineer si pas de QA dédié).

---

## Processus de Validation

### Flux Complet

```
┌─────────────────────────────────────────────────┐
│ 1. PRÉPARATION (10-15 min)                      │
│    - Lire la SPEC et les critères d'acceptation │
│    - Identifier les scénarios de test           │
│    - Préparer l'environnement de test           │
├─────────────────────────────────────────────────┤
│ 2. TESTS AUTOMATISÉS                            │
│    - Exécuter la suite de tests                 │
│    - Vérifier la couverture                     │
│    - Analyser les échecs                        │
├─────────────────────────────────────────────────┤
│ 3. TESTS MANUELS                                │
│    - Parcours utilisateur principal             │
│    - Cas limites                                │
│    - Exploration                                │
├─────────────────────────────────────────────────┤
│ 4. VÉRIFICATION DoOD                            │
│    - Checklist point par point                  │
│    - Documentation des écarts                   │
├─────────────────────────────────────────────────┤
│ 5. RAPPORT                                      │
│    - Synthèse des résultats                     │
│    - Recommandation (valider/rejeter)           │
│    - Bugs identifiés                            │
└─────────────────────────────────────────────────┘
```

### Critères d'Entrée

```markdown
## Checklist Prêt pour Validation

- [ ] Code implémenté et poussé
- [ ] Tests automatisés écrits par le PE
- [ ] CI passe (lint, typecheck, tests)
- [ ] PR créée avec description
- [ ] Environnement de test accessible
```

---

## Tests Automatisés

### Exécution Standard

```bash
# Tests unitaires
pnpm test:unit

# Tests d'intégration
pnpm test:integration

# Tests E2E
pnpm test:e2e

# Couverture
pnpm test:coverage
```

### Analyse des Résultats

```markdown
## Rapport Tests Automatisés

### Résumé
| Type | Passés | Échoués | Skipped | Couverture |
|------|--------|---------|---------|------------|
| Unit | 145 | 0 | 2 | 84% |
| Integration | 23 | 1 | 0 | - |
| E2E | 12 | 0 | 0 | - |

### Échecs
#### test/integration/tasks.test.ts:45
```
Error: Expected status 200, got 500
  at TaskAPI.create
```
**Cause probable** : [Analyse]
**Action** : [À corriger / Faux positif]

### Tests Skipped
- `test/unit/legacy.test.ts` : Désactivé car feature dépréciée
- `test/unit/flaky.test.ts` : À investiguer (flaky)
```

### Critères de Couverture

| Zone | Minimum | Cible |
|------|---------|-------|
| Nouvelles lignes | 80% | 90% |
| Nouvelles branches | 70% | 80% |
| Fonctions critiques | 90% | 100% |

---

## Tests Manuels

### Scénarios Prioritaires

```markdown
## Scénarios de Test Manuel

### Happy Path (Obligatoire)
| # | Étape | Résultat Attendu | Résultat | Status |
|---|-------|------------------|----------|--------|
| 1 | [Action] | [Attendu] | [Observé] | ✅/❌ |
| 2 | [Action] | [Attendu] | [Observé] | ✅/❌ |

### Cas Limites (Obligatoire)
| # | Cas | Comportement Attendu | Résultat | Status |
|---|-----|---------------------|----------|--------|
| 1 | Input vide | Message d'erreur | [Observé] | ✅/❌ |
| 2 | Input trop long | Troncature/erreur | [Observé] | ✅/❌ |

### Cas d'Erreur (Obligatoire)
| # | Erreur | Comportement Attendu | Résultat | Status |
|---|--------|---------------------|----------|--------|
| 1 | Réseau off | Message "hors ligne" | [Observé] | ✅/❌ |
| 2 | API 500 | Message d'erreur user-friendly | [Observé] | ✅/❌ |

### Exploration (Optionnel mais recommandé)
[Notes sur les tests exploratoires effectués]
```

### Checklist Tests Manuels

```markdown
## Checklist Test Manuel

### Fonctionnel
- [ ] Tous les critères d'acceptation vérifiés
- [ ] Navigation intuitive
- [ ] Messages d'erreur clairs

### UI/UX
- [ ] Responsive (mobile/tablet/desktop)
- [ ] États visuels corrects (hover, focus, disabled)
- [ ] Feedback utilisateur (loading, success, error)

### Accessibilité
- [ ] Navigation clavier fonctionnelle
- [ ] Focus visible
- [ ] Labels et ARIA appropriés

### Performance (check visuel)
- [ ] Pas de lag perceptible
- [ ] Pas de flash de contenu
```

---

## Critères de Régression

### Zones à Vérifier

```markdown
## Analyse de Régression

### Zones Impactées par le Changement
- [Zone 1] : Risque [Haut/Moyen/Bas]
- [Zone 2] : Risque [Haut/Moyen/Bas]

### Tests de Régression
| Zone | Test | Résultat |
|------|------|----------|
| Page d'accueil | Chargement normal | ✅ |
| Liste des tâches | Affichage et tri | ✅ |
| Création de tâche | Workflow complet | ✅ |
```

### Smoke Test

Test minimal pour vérifier que l'application fonctionne :

```markdown
## Smoke Test

- [ ] Application démarre sans erreur
- [ ] Page d'accueil s'affiche
- [ ] Login fonctionne
- [ ] Navigation principale fonctionne
- [ ] Fonctionnalité core fonctionne (ex: créer une tâche)
```

---

## Vérification DoOD

### Checklist Standard

```markdown
## Vérification DoOD - SPEC-[XXX]

### Fonctionnel
- [ ] Tous les critères d'acceptation satisfaits
- [ ] Cas limites gérés
- [ ] Comportement en erreur correct

### Qualité du Code
- [ ] Linting passe
- [ ] Typecheck passe
- [ ] Conventions du projet respectées

### Tests
- [ ] Tests unitaires ajoutés
- [ ] Tests d'intégration (si applicable)
- [ ] Couverture maintenue

### Sécurité
- [ ] Pas de secrets exposés
- [ ] Inputs validés
- [ ] Pas de vulnérabilité évidente

### Performance
- [ ] Pas de requête N+1
- [ ] Temps de réponse acceptable

### Documentation
- [ ] Code lisible et auto-documenté
- [ ] Docs mises à jour si API change

### Review
- [ ] Code reviewé
```

---

## Template Rapport QA

```markdown
# Rapport QA - SPEC-[XXX] : [Titre]

**Date** : [YYYY-MM-DD]
**QA Engineer** : [Nom]
**Version testée** : [commit/PR]

---

## Résumé Exécutif

**Statut** : ✅ Validé / ⚠️ Validé avec réserves / ❌ Rejeté

**Recommandation** : [Texte court]

---

## Tests Automatisés

| Type | Passés | Échoués | Couverture |
|------|--------|---------|------------|
| Unit | [X] | [Y] | [Z%] |
| Integration | [X] | [Y] | - |
| E2E | [X] | [Y] | - |

### Commentaires
[Si échecs, détails]

---

## Tests Manuels

### Critères d'Acceptation

| CA | Description | Status | Notes |
|----|-------------|--------|-------|
| CA-1 | [Description] | ✅ | - |
| CA-2 | [Description] | ✅ | - |
| CA-3 | [Description] | ⚠️ | [Détail] |

### Cas Limites

| Cas | Status | Notes |
|-----|--------|-------|
| [Cas 1] | ✅ | - |
| [Cas 2] | ✅ | - |

### Exploration

[Notes sur les tests exploratoires]

---

## Régression

| Zone | Status |
|------|--------|
| [Zone 1] | ✅ Pas de régression |
| [Zone 2] | ✅ Pas de régression |

---

## DoOD

| Critère | Status |
|---------|--------|
| Critères d'acceptation | ✅ |
| Tests automatisés | ✅ |
| Linting | ✅ |
| Typecheck | ✅ |
| Review | ✅ |
| Documentation | N/A |

---

## Bugs Identifiés

### Bug 1 : [Titre]
- **Sévérité** : [Critique/Majeur/Mineur]
- **Description** : [Détail]
- **Reproduction** : [Étapes]
- **Bloquant** : [Oui/Non]

---

## Recommandation Finale

[X] **Valider** - Prêt pour merge
[ ] **Valider avec réserves** - Bug mineur à traiter après merge
[ ] **Rejeter** - Corrections requises avant retest

### Si Rejet, Actions Requises
1. [Action 1]
2. [Action 2]

---

**Signature QA** : [Nom]
**Date** : [YYYY-MM-DD]
```

---

## Workflow de Feedback

### Si Validation Réussie

```
Validation ✅
    │
    ▼
Rapport QA créé
    │
    ▼
PR approuvée pour merge
    │
    ▼
→ Boucle INTÉGRER
```

### Si Validation Échouée

```
Validation ❌
    │
    ▼
Rapport QA avec bugs identifiés
    │
    ▼
Feedback au PE avec détails
    │
    ▼
PE corrige
    │
    ▼
Nouveau cycle de validation
```

### Format de Feedback

```markdown
## Feedback QA - SPEC-[XXX]

### Bugs à Corriger (Bloquants)
1. **[Titre]**
   - Description : [...]
   - Reproduction : [...]
   - Attendu vs Observé : [...]

### Améliorations Suggérées (Non Bloquantes)
1. **[Titre]**
   - Suggestion : [...]
   - Raison : [...]

### Questions
- [Question 1]

### Retest Après
- [ ] Bug 1 corrigé
- [ ] Bug 2 corrigé
```

---

## Métriques de Validation

### Indicateurs à Suivre

| Métrique | Cible |
|----------|-------|
| Taux de première validation | > 80% |
| Temps moyen de validation | < 4h |
| Bugs trouvés en prod | 0 |
| Régressions | 0 |

### Analyse

- **Taux de première validation bas** → SPECs pas assez claires ou DoOD trop strict
- **Temps de validation élevé** → Automatiser plus ou mieux préparer les scénarios
- **Bugs en prod** → Renforcer les tests E2E et l'exploration

---

*Retour aux [Annexes](../framework/08-annexes.md)*
