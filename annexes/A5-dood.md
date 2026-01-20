# A.5 Template DoOD (Definition of Output Done)

## Pourquoi cette annexe ?

Le DoOD est le contrat qualité entre l'équipe et le produit. C'est la checklist de validation qu'un output doit satisfaire avant d'être considéré comme terminé. Sans DoOD clair, "terminé" devient subjectif : le développeur pense avoir fini, le QA trouve des bugs, le Tech Lead rejette le code. Le DoOD aligne tout le monde sur ce que "Done" signifie vraiment.

---

## Différence DoOD vs DoOuD

| Aspect | DoOD (Output Done) | DoOuD (Outcome Done) |
|--------|-------------------|---------------------|
| **Question** | "Est-ce bien fait ?" | "Est-ce que ça marche ?" |
| **Focus** | Qualité technique du livrable | Impact business |
| **Timing** | À chaque livraison | Après observation |
| **Mesure** | Checklist binaire | Métriques quantifiées |
| **Responsable** | Équipe technique | Product Manager |
| **Exemple** | "Tests passent, code reviewé" | "Conversion +15%" |

---

## DoOD Standard Universel

Cette checklist s'applique à tout output, quel que soit son type.

```markdown
## DoOD - [Nom de l'Output]

### Fonctionnel
- [ ] Tous les critères d'acceptation de la SPEC sont satisfaits
- [ ] Les cas limites documentés sont gérés
- [ ] Le comportement en cas d'erreur est correct

### Qualité du Code
- [ ] Code passe le linting sans erreur
- [ ] Code passe la vérification de types (typecheck)
- [ ] Code suit les conventions du projet (AGENT-GUIDE)
- [ ] Pas de code mort, commenté, ou de TODO non résolu

### Tests
- [ ] Tests unitaires ajoutés ou mis à jour
- [ ] Tests d'intégration ajoutés (si applicable)
- [ ] Tous les tests passent
- [ ] Couverture maintenue (pas de régression)

### Sécurité
- [ ] Pas de secrets exposés dans le code
- [ ] Inputs utilisateur validés et sanitizés
- [ ] Pas de vulnérabilité évidente (injection, XSS, etc.)

### Performance
- [ ] Pas de requête N+1 introduite
- [ ] Pas de re-render inutile (React)
- [ ] Assets optimisés

### Documentation
- [ ] Code auto-documenté (noms explicites)
- [ ] Commentaires si logique complexe
- [ ] README/docs mis à jour si API publique modifiée

### Review
- [ ] Code reviewé par un pair ou agent spécialisé
- [ ] Feedback intégré

### Intégration
- [ ] Merge sans conflit
- [ ] CI/CD passe
- [ ] Pas de régression sur les fonctionnalités existantes
```

---

## DoOD par Type d'Output

### DoOD - Feature Frontend

```markdown
## DoOD - Feature Frontend

### Fonctionnel
- [ ] Critères d'acceptation satisfaits
- [ ] Tous les états UI gérés (loading, empty, error, success)
- [ ] Responsive testé (mobile, tablet, desktop)

### Accessibilité
- [ ] Navigation clavier fonctionnelle
- [ ] Labels ARIA appropriés
- [ ] Contraste suffisant (4.5:1 minimum)
- [ ] Focus visible sur les éléments interactifs

### Tests
- [ ] Tests unitaires des composants
- [ ] Tests des hooks custom
- [ ] Test E2E du parcours principal

### Performance
- [ ] LCP < 2.5s
- [ ] Pas de layout shift visible (CLS < 0.1)
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Bundle size vérifié (pas d'augmentation anormale)

### Code Quality
- [ ] Pas de `any` TypeScript
- [ ] Pas de `console.log` en production
- [ ] Composants < 200 lignes (sinon split)
```

### DoOD - Feature Backend / API

```markdown
## DoOD - Feature Backend / API

### Fonctionnel
- [ ] Endpoint fonctionne selon la SPEC
- [ ] Codes HTTP corrects (200, 201, 400, 401, 403, 404, 500)
- [ ] Messages d'erreur explicites et cohérents

### Sécurité
- [ ] Authentification requise (si applicable)
- [ ] Autorisation vérifiée (permissions)
- [ ] Input validation avec schéma (Zod, etc.)
- [ ] Rate limiting configuré (si endpoint public)

### Tests
- [ ] Tests unitaires des services
- [ ] Tests d'intégration de l'endpoint
- [ ] Tests des cas d'erreur

### Performance
- [ ] Requêtes DB optimisées (index, pas de N+1)
- [ ] Pagination implémentée (si liste)
- [ ] Temps de réponse < 200ms (cas nominal)

### Documentation
- [ ] OpenAPI/Swagger mis à jour
- [ ] Exemples de requêtes/réponses documentés
```

### DoOD - Bug Fix

```markdown
## DoOD - Bug Fix

### Correction
- [ ] Le bug est corrigé (vérifiable avec le scénario de reproduction)
- [ ] La cause racine est identifiée et traitée
- [ ] Pas de régression introduite

### Tests
- [ ] Test ajouté qui échoue sans le fix
- [ ] Test passe avec le fix
- [ ] Tests existants toujours passants

### Documentation
- [ ] Commit message explique la cause et la solution
- [ ] Ticket/issue mis à jour avec l'explication
```

### DoOD - Refactoring

```markdown
## DoOD - Refactoring

### Comportement
- [ ] Comportement externe inchangé
- [ ] Tous les tests existants passent sans modification

### Qualité
- [ ] Code plus lisible et maintenable
- [ ] Duplication réduite (si objectif)
- [ ] Meilleure séparation des responsabilités

### Tests
- [ ] Couverture maintenue ou améliorée
- [ ] Pas de test supprimé sans justification

### Performance
- [ ] Pas de dégradation de performance mesurable
```

### DoOD - Migration Base de Données

```markdown
## DoOD - Migration DB

### Migration
- [ ] Script de migration créé et testé en local
- [ ] Script de rollback préparé (si possible)
- [ ] Migration réversible ou données préservées

### Données
- [ ] Pas de perte de données
- [ ] Données existantes correctement transformées
- [ ] Contraintes respectées (FK, unique, not null)

### Application
- [ ] Code applicatif compatible avec le nouveau schéma
- [ ] Queries mises à jour

### Tests
- [ ] Migration testée sur une copie de production
- [ ] Tests d'intégration passent
```

---

## Adaptation du DoOD au Contexte

Le DoOD n'est pas one-size-fits-all. Adaptez-le au contexte.

### Par Phase de Projet

| Phase | Adaptation |
|-------|------------|
| **MVP / Prototype** | Réduire exigences de couverture tests et documentation |
| **Production active** | DoOD complet + vérifications de rollback |
| **Maintenance** | Focus sur régression et stabilité |
| **Open source** | Ajouter CHANGELOG et documentation publique |

### Exemple : DoOD Allégé pour MVP

```markdown
## DoOD - MVP

- [ ] Fonctionnalité fonctionne selon la SPEC
- [ ] Code passe lint + typecheck
- [ ] Test manuel effectué sur le happy path
- [ ] Pas de régression évidente
- [ ] Code pushé et déployé
```

### Exemple : DoOD Renforcé pour Production Critique

```markdown
## DoOD - Production Critique

### Standard
[Tous les points du DoOD standard]

### Sécurité Renforcée
- [ ] Audit de sécurité passé (agent Security ou humain)
- [ ] Pen test si surface d'attaque étendue
- [ ] Logs d'audit implémentés pour actions sensibles

### Résilience
- [ ] Plan de rollback documenté et testé
- [ ] Feature flag activé (si applicable)
- [ ] Monitoring et alertes configurés
- [ ] Runbook mis à jour

### Validation
- [ ] Review par 2 personnes minimum
- [ ] Test en staging avec données réalistes
- [ ] Sign-off du Tech Lead
- [ ] Communication planifiée vers stakeholders
```

---

## Exemples Pratiques

### Exemple 1 : Validation d'une Feature Frontend

```markdown
## Validation DoOD - SPEC-007 : Filtrage des Tâches

**Validé par** : Alice Martin
**Date** : 2026-01-18

### Checklist

| Critère | Statut | Commentaire |
|---------|--------|-------------|
| Critères d'acceptation | ✅ | 5/5 validés |
| États UI (loading, empty, error) | ✅ | Tous gérés |
| Responsive | ✅ | Testé iOS Safari + Chrome Android |
| Navigation clavier | ✅ | Tab + Enter fonctionnels |
| ARIA labels | ✅ | role="button", aria-pressed |
| Tests unitaires | ✅ | 3 tests ajoutés |
| Test E2E | ✅ | 1 parcours complet |
| Lint + Typecheck | ✅ | 0 erreur |
| LCP | ⚠️ | 2.3s (acceptable, < 2.5s) |
| Code review | ✅ | Review par Bob |
| Régression | ✅ | Suite E2E passe |

**Décision** : ✅ Prêt à merger

**Notes** : LCP légèrement au-dessus de la cible (2s) mais acceptable.
À surveiller si d'autres composants alourdissent la page.
```

### Exemple 2 : Validation d'un Bug Fix

```markdown
## Validation DoOD - BUG-042 : Crash sur liste vide

**Validé par** : Carol Chen
**Date** : 2026-01-19

### Checklist

| Critère | Statut | Commentaire |
|---------|--------|-------------|
| Bug corrigé | ✅ | Testé avec 0, 1, 100 éléments |
| Cause racine | ✅ | `.map()` sur undefined |
| Test de non-régression | ✅ | Test ajouté pour cas 0 élément |
| Tests existants | ✅ | 47/47 passent |
| Commit message | ✅ | "fix: handle empty array in TaskList" |

**Décision** : ✅ Prêt à merger
```

---

## Intégration dans le Workflow

### Quand Appliquer le DoOD

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Développement │────►│ Auto-check   │────►│ Review       │────►│ Merge        │
│  (PE + Agents) │     │ (CI/CD)      │     │ (Pair/QA)    │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
                            ▼                     ▼
                     DoOD automatisé        DoOD manuel
                     (lint, tests, etc.)   (review, UX, etc.)
```

### Automatisation du DoOD

Automatisez au maximum pour réduire la friction.

```yaml
# Exemple GitHub Actions
name: DoOD Check

on: [pull_request]

jobs:
  dood:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Tests
        run: pnpm test

      - name: Security scan
        run: pnpm audit

      - name: Coverage check
        run: pnpm test:coverage --threshold 80

      - name: Bundle size
        run: pnpm build && npx bundlesize
```

### Template de Validation Manuelle

```markdown
## Validation DoOD - [SPEC-ID]

**Validé par** : [Nom]
**Date** : YYYY-MM-DD

| Critère | Statut | Commentaire |
|---------|--------|-------------|
| [Critère 1] | ✅ / ❌ / ⚠️ | [Note si nécessaire] |
| [Critère 2] | ✅ / ❌ / ⚠️ | |
| [Critère 3] | ✅ / ❌ / ⚠️ | |

**Décision** : ✅ Prêt à merger / ❌ Blockers à résoudre

**Notes** :
[Commentaires additionnels, points d'attention]
```

---

## Anti-patterns

### ❌ DoOD Ignoré

**Symptôme** : "On merge et on corrigera après"

**Problème** : Dette technique qui s'accumule. Bugs en production.

**Solution** : DoOD non-négociable. Branch protection rules sur GitHub/GitLab.

---

### ❌ DoOD Trop Lourd

**Symptôme** : 30 points à vérifier pour chaque micro-changement.

**Problème** : L'équipe contourne le process. Frustration.

**Solution** : Adapter le DoOD au type d'output. Un one-liner de fix ≠ une feature complète.

---

### ❌ DoOD Pas à Jour

**Symptôme** : Critères qui ne correspondent plus au projet (ex: "Vérifier IE11").

**Problème** : Checks inutiles, vrais problèmes ignorés.

**Solution** : Revoir le DoOD en rétrospective. Supprimer ce qui n'a plus de sens.

---

### ❌ DoOD Theatre

**Symptôme** : Cocher des cases sans vraiment vérifier.

**Problème** : Fausse sécurité. Bugs passent quand même.

**Solution** : Responsabilité claire. Le validateur est accountable du DoOD.

---

## Template Prêt à Copier

### DoOD Standard

```markdown
## DoOD - [Nom]

### Fonctionnel
- [ ] Critères d'acceptation satisfaits
- [ ] Cas limites gérés
- [ ] Comportement erreur correct

### Qualité
- [ ] Lint passe
- [ ] Typecheck passe
- [ ] Conventions respectées

### Tests
- [ ] Tests ajoutés/mis à jour
- [ ] Tous les tests passent

### Sécurité
- [ ] Pas de secrets exposés
- [ ] Inputs validés

### Review
- [ ] Code reviewé
- [ ] Pas de régression
```

### DoOD Minimal (MVP)

```markdown
## DoOD - [Nom]

- [ ] Fonctionnel selon SPEC
- [ ] Lint + typecheck OK
- [ ] Test manuel OK
- [ ] Pas de régression
```

### DoOD Complet (Production)

```markdown
## DoOD - [Nom]

### Fonctionnel
- [ ] Tous les critères d'acceptation validés
- [ ] Tous les cas limites gérés
- [ ] Responsive (mobile + desktop)

### Qualité
- [ ] Lint passe
- [ ] Typecheck passe
- [ ] Conventions respectées
- [ ] Pas de code mort

### Tests
- [ ] Tests unitaires ajoutés
- [ ] Tests intégration ajoutés
- [ ] Tests E2E ajoutés
- [ ] Couverture > 80%

### Accessibilité
- [ ] Navigation clavier
- [ ] ARIA labels
- [ ] Contraste OK

### Performance
- [ ] LCP < 2s
- [ ] Pas de N+1
- [ ] Bundle size OK

### Sécurité
- [ ] Inputs validés
- [ ] Pas de secrets
- [ ] Auth/authz vérifiés

### Documentation
- [ ] Code auto-documenté
- [ ] API doc mise à jour

### Review & Deploy
- [ ] Code reviewé
- [ ] CI passe
- [ ] Staging testé
- [ ] Rollback plan prêt
```

---

## Checklist de Définition du DoOD

Quand vous définissez le DoOD de votre projet :

- [ ] Le DoOD est adapté au contexte (MVP vs Production)
- [ ] Les critères sont vérifiables (pas de "code propre")
- [ ] L'automatisation est maximale (CI/CD)
- [ ] La partie manuelle est clairement définie
- [ ] L'équipe a validé collectivement le DoOD
- [ ] Le DoOD est revu régulièrement (retro)

---

## Gouvernance du DoOD

| Action | Responsable | Fréquence |
|--------|-------------|-----------|
| Définition initiale | Équipe (Tech Lead facilite) | Démarrage projet |
| Vérification automatisée | CI/CD | Chaque PR |
| Vérification manuelle | Reviewer désigné | Chaque PR |
| Revue et ajustement | Équipe | Rétrospective |
| Mise à jour stack/outils | Tech Lead | Quand nécessaire |

---

*Annexes connexes : [A.4 Template SPECS](./A4-specs.md) • [A.6 Template DoOuD](./A6-dooud.md) • [B.3 QA Engineer](./B3-qa-engineer.md) • [C.4 Boucle VALIDER](./C4-boucle-valider.md)*
