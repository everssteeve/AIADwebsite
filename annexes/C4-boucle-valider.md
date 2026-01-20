# C.4 Boucle VALIDER

## Pourquoi cette annexe ?

Du code qui compile n'est pas du code qui fonctionne. Sans validation rigoureuse, les bugs atteignent la production, les régressions s'accumulent et la confiance dans le code généré s'effondre. Cette annexe vous guide pour valider efficacement avant d'intégrer.

---

## Vue d'Ensemble

### Ce que vous allez vérifier

La boucle VALIDER confirme que :
- Les critères d'acceptation sont satisfaits
- Le DoOD est respecté
- Aucune régression n'a été introduite
- Le code est prêt pour la review et le merge

### Le Flux de Validation

```
┌─────────────────────────────────────────────┐
│ 1. TESTS AUTOMATISÉS                        │
│    Unit → Integration → E2E                 │
├─────────────────────────────────────────────┤
│ 2. TESTS MANUELS                            │
│    Happy path → Cas limites → Exploration   │
├─────────────────────────────────────────────┤
│ 3. VÉRIFICATION DoOD                        │
│    Checklist point par point                │
├─────────────────────────────────────────────┤
│ 4. RAPPORT                                  │
│    Valider / Rejeter / Valider avec réserve │
└─────────────────────────────────────────────┘
```

### Qui valide ?

| Contexte | Validateur |
|----------|------------|
| Équipe avec QA | QA Engineer |
| Équipe sans QA | Product Engineer (peer ou auto-review) |
| Feature critique | Tech Lead en support |

---

## Étape 1 : Vérifier les Prérequis

Avant de commencer la validation, assurez-vous que l'implémentation est terminée.

### Checklist Prêt pour Validation

```markdown
## L'implémentation est-elle terminée ?

### Code
- [ ] Toutes les tâches du plan exécutées
- [ ] Tous les commits poussés sur la branche
- [ ] Pas de TODO ou FIXME restants

### CI
- [ ] Lint passe
- [ ] Typecheck passe
- [ ] Tests existants passent
- [ ] Build réussit

### Documentation
- [ ] PR créée avec description
- [ ] Changements documentés si nécessaire
```

### Que faire si les prérequis ne sont pas remplis

| Problème | Action |
|----------|--------|
| CI en échec | Retourner à IMPLÉMENTER, corriger |
| Tests manquants | Demander au PE d'ajouter les tests |
| PR sans description | Compléter la description avant validation |
| Code incomplet | Reporter la validation |

---

## Étape 2 : Exécuter les Tests Automatisés

### Commandes Standard

```bash
# Tests unitaires
pnpm test:unit

# Tests d'intégration
pnpm test:integration

# Tests E2E
pnpm test:e2e

# Couverture de code
pnpm test:coverage

# Tous les tests
pnpm test
```

### Analyser les Résultats

```markdown
## Rapport Tests Automatisés - SPEC-[XXX]

### Résumé
| Type | Total | Passés | Échoués | Skipped |
|------|-------|--------|---------|---------|
| Unit | 156 | 154 | 0 | 2 |
| Integration | 24 | 24 | 0 | 0 |
| E2E | 12 | 12 | 0 | 0 |

### Couverture
| Métrique | Actuel | Seuil |
|----------|--------|-------|
| Lignes | 87% | 80% |
| Branches | 79% | 70% |
| Fonctions | 91% | 80% |

### Résultat : ✅ PASSE
```

### En Cas d'Échec

```markdown
## Échec Test - Analyse

### Test échoué
`test/integration/tasks.test.ts:45` - "should create task with valid data"

### Erreur
```
Error: Expected status 200, got 500
  at TaskAPI.create (tasks.test.ts:47)
```

### Analyse
- [ ] Bug réel dans le code → Retour à IMPLÉMENTER
- [ ] Test obsolète → Mettre à jour le test
- [ ] Environnement de test incorrect → Corriger la config
- [ ] Test flaky → Marquer et investiguer séparément

### Action : [Bug réel - retour PE pour fix]
```

### Seuils de Couverture

| Zone | Minimum | Cible |
|------|---------|-------|
| Nouveau code | 80% | 90% |
| Code modifié | Pas de régression | +5% |
| Logique métier | 90% | 100% |

---

## Étape 3 : Effectuer les Tests Manuels

### Préparer les Scénarios

Basez-vous sur les critères d'acceptation de la SPEC.

```markdown
## Scénarios de Test Manuel - SPEC-[XXX]

### Happy Path (Obligatoire)
| # | Action | Résultat Attendu |
|---|--------|------------------|
| 1 | Ouvrir la page des tâches | Liste des tâches affichée |
| 2 | Cocher le filtre "En cours" | Seules les tâches "in_progress" affichées |
| 3 | Cocher aussi "Terminé" | Tâches "in_progress" ET "done" affichées |
| 4 | Décocher tous les filtres | Toutes les tâches affichées |

### Cas Limites (Obligatoire)
| # | Cas | Comportement Attendu |
|---|-----|---------------------|
| 1 | Aucune tâche correspondant au filtre | Message "Aucune tâche" |
| 2 | Liste de 100+ tâches | Affichage fluide, pas de lag |
| 3 | Rafraîchir la page avec filtre actif | Filtre préservé dans l'URL |

### Cas d'Erreur (Obligatoire)
| # | Erreur | Comportement Attendu |
|---|--------|---------------------|
| 1 | API indisponible | Message d'erreur clair |
| 2 | Token expiré | Redirection vers login |
```

### Exécuter et Documenter

```markdown
## Résultats Tests Manuels - SPEC-[XXX]

### Happy Path
| # | Action | Résultat | Status |
|---|--------|----------|--------|
| 1 | Ouvrir la page des tâches | Liste affichée correctement | ✅ |
| 2 | Cocher "En cours" | Filtrage correct | ✅ |
| 3 | Cocher aussi "Terminé" | Multi-filtre OK | ✅ |
| 4 | Décocher tous | Toutes les tâches | ✅ |

### Cas Limites
| # | Cas | Résultat | Status |
|---|-----|----------|--------|
| 1 | Aucune tâche | Message "Aucune tâche trouvée" | ✅ |
| 2 | 100+ tâches | Fluide | ✅ |
| 3 | Refresh avec filtre | Filtre préservé | ✅ |

### Cas d'Erreur
| # | Erreur | Résultat | Status |
|---|--------|----------|--------|
| 1 | API down | Toast "Impossible de charger" | ✅ |
| 2 | Token expiré | Redirection login OK | ✅ |

### Résultat : ✅ PASSE
```

### Checklist Tests Manuels Complémentaires

```markdown
## Vérifications Supplémentaires

### UI/UX
- [ ] Responsive : mobile (320px), tablet (768px), desktop (1200px)
- [ ] États visuels : hover, focus, active, disabled
- [ ] Feedback : loading spinner, messages de succès/erreur
- [ ] Cohérence : style conforme au design system

### Accessibilité
- [ ] Navigation clavier : Tab, Enter, Escape
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Contraste suffisant (4.5:1 minimum)
- [ ] Labels et ARIA pour les lecteurs d'écran

### Performance (vérification visuelle)
- [ ] Pas de lag perceptible (< 100ms pour les interactions)
- [ ] Pas de flash de contenu non stylé
- [ ] Images chargées ou placeholder visible
```

---

## Étape 4 : Tester les Régressions

### Identifier les Zones à Risque

```markdown
## Analyse de Régression - SPEC-[XXX]

### Fichiers Modifiés
- src/components/TaskList.tsx
- src/hooks/useTaskFilter.ts
- src/components/TaskFilter.tsx

### Zones Impactées Potentiellement
| Zone | Risque | Raison |
|------|--------|--------|
| Affichage liste des tâches | Haut | Modification directe |
| Création de tâche | Moyen | Même composant parent |
| Autres pages | Bas | Pas d'impact direct |
```

### Exécuter le Smoke Test

Test minimal pour vérifier que l'application fonctionne globalement.

```markdown
## Smoke Test

### Vérifications Critiques
- [ ] Application démarre sans erreur console
- [ ] Page d'accueil s'affiche
- [ ] Navigation principale fonctionne
- [ ] Login/Logout fonctionnel
- [ ] Fonctionnalité core (créer une tâche) OK

### Zones Impactées
- [ ] Liste des tâches : affichage normal
- [ ] Création de tâche : workflow complet
- [ ] Modification de tâche : mise à jour OK
- [ ] Suppression de tâche : suppression OK

### Résultat : ✅ Pas de régression détectée
```

---

## Étape 5 : Vérifier le DoOD

Passer en revue chaque critère du Definition of Done.

### Checklist DoOD Standard

```markdown
## Vérification DoOD - SPEC-[XXX]

### Fonctionnel
- [x] Tous les critères d'acceptation satisfaits
- [x] Cas limites gérés correctement
- [x] Comportement en erreur approprié

### Qualité du Code
- [x] Lint passe sans erreur
- [x] Typecheck passe sans erreur
- [x] Conventions du projet respectées
- [x] Pas de code mort ou commenté

### Tests
- [x] Tests unitaires ajoutés pour le nouveau code
- [x] Tests d'intégration si interaction multi-composants
- [x] Couverture maintenue ou améliorée
- [x] Tous les tests passent

### Sécurité
- [x] Pas de secrets exposés
- [x] Inputs utilisateur validés
- [x] Pas de vulnérabilité évidente (XSS, injection)

### Performance
- [x] Pas de requête N+1 introduite
- [x] Mémoisation si calculs coûteux
- [x] Lazy loading si composants lourds

### Documentation
- [x] Code lisible et auto-documenté
- [x] Commentaires si logique complexe
- [x] README mis à jour si nouvelle feature publique

### Review
- [ ] Code prêt pour review humaine

### Résultat DoOD : ✅ SATISFAIT
```

---

## Étape 6 : Produire le Rapport

### Template de Rapport QA

```markdown
# Rapport QA - SPEC-[XXX] : [Titre]

**Date** : YYYY-MM-DD
**Validateur** : [Nom]
**Branche** : feat/SPEC-XXX-description
**Commit** : [hash court]

---

## Résumé Exécutif

**Statut** : ✅ VALIDÉ

**Recommandation** : Prêt pour review et merge

---

## Tests Automatisés

| Type | Passés | Échoués | Couverture |
|------|--------|---------|------------|
| Unit | 156 | 0 | 87% |
| Integration | 24 | 0 | - |
| E2E | 12 | 0 | - |

**Commentaires** : Couverture conforme aux seuils

---

## Tests Manuels

### Critères d'Acceptation
| CA | Description | Status |
|----|-------------|--------|
| CA-1 | Filtrer par statut unique | ✅ |
| CA-2 | Filtrer par statuts multiples | ✅ |
| CA-3 | Persistance du filtre | ✅ |

### Cas Limites
| Cas | Status |
|-----|--------|
| Liste vide | ✅ |
| Grande liste | ✅ |
| Refresh page | ✅ |

---

## Régression

| Zone | Status |
|------|--------|
| Liste des tâches | ✅ OK |
| Création tâche | ✅ OK |
| Navigation | ✅ OK |

---

## DoOD

| Critère | Status |
|---------|--------|
| Fonctionnel | ✅ |
| Tests | ✅ |
| Qualité code | ✅ |
| Sécurité | ✅ |
| Performance | ✅ |

---

## Bugs Identifiés

Aucun bug identifié.

---

## Verdict Final

**✅ VALIDÉ** - Prêt pour review et merge

---

**Signature** : [Nom du validateur]
**Date** : YYYY-MM-DD
```

### En Cas de Rejet

```markdown
## Verdict : ❌ REJETÉ

### Bugs Bloquants

#### Bug #1 : Filtre ne persiste pas après navigation
- **Sévérité** : Majeur
- **Description** : Quand on navigue vers une tâche puis revient,
                    le filtre est réinitialisé
- **Reproduction** :
  1. Appliquer un filtre "En cours"
  2. Cliquer sur une tâche pour voir le détail
  3. Cliquer "Retour"
  4. Le filtre n'est plus actif
- **Attendu** : Le filtre devrait être préservé

### Actions Requises
1. Corriger la persistance du filtre (utiliser URL params)
2. Ajouter un test E2E pour ce scénario

### Après Correction
- Retester le bug #1
- Valider la non-régression
```

---

## Workflow Décisionnel

### Après Validation Réussie

```
Validation ✅
     │
     ▼
Rapport QA créé et attaché à la PR
     │
     ▼
Notification au PE : "Prêt pour review"
     │
     ▼
→ Boucle INTÉGRER
```

### Après Rejet

```
Validation ❌
     │
     ▼
Rapport QA avec bugs détaillés
     │
     ▼
Feedback au PE avec étapes de reproduction
     │
     ▼
PE corrige les bugs
     │
     ▼
Nouveau cycle de validation (retest ciblé)
```

### Format de Feedback au PE

```markdown
## Feedback QA - SPEC-[XXX]

### Bugs à Corriger (Bloquants)

#### Bug #1 : [Titre court]
**Description** : [Ce qui se passe]
**Attendu** : [Ce qui devrait se passer]
**Reproduction** :
1. [Étape 1]
2. [Étape 2]
3. [Étape 3]
**Fichier probable** : [src/xxx.ts]

### Observations (Non Bloquantes)
- [Observation 1 - suggestion d'amélioration]
- [Observation 2]

### Retest
Après correction, je retesterai :
- [ ] Bug #1 corrigé
- [ ] Pas de régression sur les autres tests
```

---

## Exemples Pratiques

### Exemple : Validation Réussie

```markdown
## SPEC-042 : Filtrage des tâches

### Contexte
Feature de filtrage par statut sur la liste des tâches.

### Tests Automatisés
- 8 nouveaux tests unitaires (tous passent)
- 2 tests d'intégration ajoutés (passent)
- Couverture nouvelle : 92%

### Tests Manuels
Tous les scénarios validés :
- Filtre unique ✅
- Filtre multiple ✅
- Filtre vide ✅
- Persistance URL ✅
- Responsive ✅

### Verdict
✅ VALIDÉ - Excellent travail, code propre et bien testé.
```

### Exemple : Validation avec Réserve

```markdown
## SPEC-043 : Export CSV des tâches

### Verdict : ⚠️ VALIDÉ AVEC RÉSERVES

### Fonctionnel
Tous les critères d'acceptation satisfaits.

### Réserve
Bug mineur identifié : les caractères spéciaux (é, à, ç)
s'affichent mal dans Excel sur Windows.

**Impact** : Bas - Affichage incorrect mais données préservées
**Workaround** : Ouvrir avec l'option "UTF-8" dans Excel

### Recommandation
Merger maintenant, créer un ticket pour le fix encoding
dans une prochaine itération.
```

---

## Anti-patterns

### "La Validation Express"

**Symptôme** : Validation en 5 minutes sans tests manuels
```
❌ "Les tests passent, c'est bon"
```

**Solution** :
```
✅ Tests automatisés + tests manuels
✅ Minimum : happy path + 2 cas limites
✅ Temps réaliste selon la complexité
```

### "Le QA Rubber Stamp"

**Symptôme** : Tout est toujours validé, jamais de rejet
```
❌ "C'est pas parfait mais ça ira"
```

**Solution** :
```
✅ Appliquer le DoOD sans compromis
✅ Rejeter si bloquant, avec feedback constructif
✅ La qualité est non négociable
```

### "Le Rapport Invisible"

**Symptôme** : Validation orale, pas de trace écrite
```
❌ "Je t'ai dit que c'était bon sur Slack"
```

**Solution** :
```
✅ Toujours un rapport écrit
✅ Attaché à la PR
✅ Traçabilité pour les audits et rétros
```

### "Les Tests en Production"

**Symptôme** : Bugs découverts après le merge
```
❌ "Ah, j'avais pas testé ce cas"
```

**Solution** :
```
✅ Couvrir systématiquement les cas limites
✅ Tester les cas d'erreur
✅ Smoke test sur les zones impactées
```

---

## Métriques de Validation

### Indicateurs à Suivre

| Métrique | Cible | Signal d'Alerte |
|----------|-------|-----------------|
| Taux de première validation | > 80% | < 60% |
| Bugs trouvés en prod | 0 | > 1/mois |
| Régressions introduites | 0 | > 1/mois |

### Analyse des Tendances

| Tendance | Cause Probable | Action |
|----------|----------------|--------|
| Taux de 1ère validation bas | SPECs pas assez claires | Améliorer les critères d'acceptation |
| Bugs en prod fréquents | Tests E2E insuffisants | Renforcer la couverture E2E |
| Régressions fréquentes | Pas de smoke test | Systématiser les tests de régression |

---

## Checklist de Sortie

```markdown
## Validation Terminée - Checklist

### Tests
- [ ] Tests automatisés exécutés (unit, integration, e2e)
- [ ] Tests manuels effectués (happy path, cas limites, erreurs)
- [ ] Smoke test de régression passé

### DoOD
- [ ] Tous les critères vérifiés
- [ ] Aucun critère bloquant non satisfait

### Documentation
- [ ] Rapport QA rédigé
- [ ] Rapport attaché à la PR
- [ ] PE notifié du verdict

### Verdict
- [ ] ✅ VALIDÉ : Prêt pour INTÉGRER
- [ ] ⚠️ VALIDÉ AVEC RÉSERVES : Merger avec ticket de suivi
- [ ] ❌ REJETÉ : Retour à IMPLÉMENTER avec feedback
```

---

*Annexes connexes : [A.5 Template DoOD](A5-dood.md) • [B.3 QA Engineer](B3-qa-engineer.md) • [C.3 Boucle IMPLÉMENTER](C3-boucle-implementer.md) • [C.5 Boucle INTÉGRER](C5-boucle-integrer.md)*
