# A.5 Template DoOD (Definition of Output Done)

## Pourquoi ce template ?

Le DoOD (Definition of Output Done) est la checklist de validation qu'un output doit satisfaire avant d'être considéré comme terminé. C'est le contrat qualité entre l'équipe et le produit : si tous les points du DoOD sont cochés, l'output est prêt à être livré.

**Responsable principal** : Équipe (défini collectivement, vérifié par QA Engineer)

---

## DoOD Standard

### Checklist Universelle

```markdown
## DoOD - [Nom de l'output]

### Fonctionnel
- [ ] Tous les critères d'acceptation de la SPEC sont satisfaits
- [ ] Les cas limites documentés sont gérés
- [ ] Le comportement en cas d'erreur est correct

### Qualité du Code
- [ ] Le code passe le linting sans erreur
- [ ] Le code passe la vérification de types
- [ ] Le code suit les conventions du projet (AGENT-GUIDE)
- [ ] Pas de code mort ou commenté laissé
- [ ] Pas de TODO non résolu

### Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration ajoutés (si applicable)
- [ ] Tous les tests passent
- [ ] Couverture de code maintenue (pas de régression)

### Sécurité
- [ ] Pas de secrets exposés dans le code
- [ ] Inputs utilisateur validés et sanitizés
- [ ] Pas de vulnérabilité évidente (injection, XSS, etc.)

### Performance
- [ ] Pas de requête N+1 introduite
- [ ] Pas de re-render inutile (React)
- [ ] Assets optimisés (images, bundles)

### Documentation
- [ ] Code auto-documenté (noms explicites)
- [ ] Commentaires ajoutés si logique complexe
- [ ] README/docs mis à jour si API publique modifiée

### Review
- [ ] Code reviewé par un pair ou validé par agent spécialisé
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
- [ ] Responsive (mobile, tablet, desktop)

### Accessibilité
- [ ] Navigation clavier fonctionnelle
- [ ] Labels ARIA appropriés
- [ ] Contraste suffisant (4.5:1 minimum)
- [ ] Focus visible

### Tests
- [ ] Tests unitaires des composants
- [ ] Tests des hooks custom
- [ ] Test E2E du parcours principal

### Performance
- [ ] LCP < 2.5s
- [ ] Pas de layout shift visible
- [ ] Images optimisées (WebP, lazy loading)
```

### DoOD - Feature Backend / API

```markdown
## DoOD - Feature Backend / API

### Fonctionnel
- [ ] Endpoint fonctionne selon la spec
- [ ] Codes HTTP corrects (200, 201, 400, 401, 404, 500)
- [ ] Messages d'erreur explicites

### Sécurité
- [ ] Authentification requise (si applicable)
- [ ] Autorisation vérifiée (permissions)
- [ ] Input validation avec schéma (Zod, etc.)
- [ ] Rate limiting configuré (si public)

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
- [ ] Exemples de requêtes/réponses
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
- [ ] Code plus lisible/maintenable
- [ ] Duplication réduite (si objectif)
- [ ] Meilleure séparation des responsabilités

### Tests
- [ ] Couverture de tests maintenue ou améliorée
- [ ] Pas de test supprimé sans justification

### Performance
- [ ] Pas de dégradation de performance
```

---

## Adaptation du DoOD

### Par Contexte de Projet

| Contexte | Adaptations |
|----------|-------------|
| MVP / Prototype | Réduire les exigences de documentation et couverture tests |
| Production critique | Ajouter des vérifications de sécurité et rollback |
| Open source | Ajouter la documentation publique et CHANGELOG |
| Réglementé (santé, finance) | Ajouter les checks de conformité spécifiques |

### Exemple : DoOD Allégé pour MVP

```markdown
## DoOD - MVP

- [ ] Fonctionnalité fonctionne selon la spec
- [ ] Code passe lint + typecheck
- [ ] Test manuel effectué
- [ ] Pas de régression évidente
- [ ] Code pushé et déployé
```

### Exemple : DoOD Renforcé pour Production Critique

```markdown
## DoOD - Production Critique

### Standard
[Tous les points du DoOD standard]

### Sécurité Renforcée
- [ ] Audit de sécurité passé (agent Security)
- [ ] Pen test si surface d'attaque étendue
- [ ] Logs d'audit implémentés

### Résilience
- [ ] Plan de rollback documenté
- [ ] Feature flag activé (si applicable)
- [ ] Monitoring et alertes configurés

### Validation
- [ ] Review par 2 personnes minimum
- [ ] Test en staging avec données réalistes
- [ ] Sign-off du Tech Lead
```

---

## Utilisation Pratique

### Intégration dans le Workflow

1. **Planification** : Le DoOD est défini/adapté au début de chaque fonctionnalité
2. **Développement** : Le PE vérifie le DoOD au fur et à mesure
3. **Validation** : Le QA Engineer vérifie le DoOD point par point
4. **Merge** : Seulement si 100% du DoOD est satisfait

### Template de Validation

```markdown
## Validation DoOD - SPEC-007

**Validé par** : [Nom]
**Date** : [YYYY-MM-DD]

| Critère | Statut | Commentaire |
|---------|--------|-------------|
| Critères d'acceptation | ✅ | Tous OK |
| Tests | ✅ | 3 unit + 1 E2E ajoutés |
| Linting | ✅ | - |
| Review | ✅ | Reviewé par Alice |
| Performance | ⚠️ | LCP à 2.3s, acceptable |

**Décision** : ✅ Prêt à merger
```

### Automatisation

Automatiser au maximum la vérification du DoOD :

```yaml
# Exemple GitHub Actions
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
```

---

## Erreurs Courantes

### DoOD Ignoré

**Symptôme** : "On mergera et on corrigera après"
**Conséquence** : Dette technique qui s'accumule
**Solution** : DoOD non-négociable, branch protection rules

### DoOD Trop Lourd

**Symptôme** : 30 points à vérifier pour chaque micro-changement
**Conséquence** : Équipe contourne le process
**Solution** : Adapter le DoOD au type d'output

### DoOD Pas à Jour

**Symptôme** : Critères qui ne correspondent plus au projet
**Conséquence** : Checks inutiles, vrais problèmes ignorés
**Solution** : Revoir le DoOD en rétrospective

---

*Retour aux [Annexes](../framework/08-annexes.md)*
