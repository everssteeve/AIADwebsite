# PARTIE 4 : PHASE DE VALIDATION

La validation assure que le code répond aux attentes métier ET aux standards de qualité avant intégration. Cette phase applique la Boucle 3 du Framework AIAD.

> 📖 Référence : @framework/05-boucles-iteratives.md - Section "Boucle 3 : Valider"

---

## 4.1 Vue d'ensemble du processus de validation

| Étape | Responsable | Focus | Durée |
|-------|-------------|-------|-------|
| Validation technique | PE | CI, couverture, linting, DoOD | 15-30 min |
| Validation fonctionnelle | QA | Tests, acceptance criteria | 30 min - 2h |
| Validation utilisabilité | QA + PM | UX, accessibilité, performance | 30 min - 1h |
| Validation métier | PM | Intention respectée, outcomes | 30 min - 1h |
| Décision | Équipe | VALIDÉ / CORRECTIONS / REJET | 15 min |

**Ce qui déclenche cette phase** : Code implémenté et tests passent localement.

**Ce que produit cette phase** :
- Rapport de validation
- Liste de corrections mineures (si applicable)
- Feu vert pour intégration

---

## 4.2 Étape : Validation technique (PE)

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Code committé localement, tests passants |
| 📤 **SORTIES** | Checklist DoOD complétée |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | Boucle Implémenter terminée |

### 4.2.1 Checklist DoOD (Definition of Output Done)

Exécutez chaque vérification dans l'ordre :

| ✓ | Catégorie | Vérification | Commande / Action |
|---|-----------|--------------|-------------------|
| ☐ | **Techniques** | Conventions de code respectées | `pnpm lint` → 0 erreurs |
| ☐ | **Techniques** | Types complets | `pnpm typecheck` → 0 erreurs |
| ☐ | **Techniques** | Tests unitaires passent | `pnpm test:unit` → 100% passants |
| ☐ | **Techniques** | Couverture suffisante | >80% backend, >70% frontend |
| ☐ | **Sécurité** | Pas de secrets dans le code | Vérification manuelle ou `git secrets --scan` |
| ☐ | **Sécurité** | Validation des inputs | Review des entrées utilisateur |
| ☐ | **Performance** | Budgets respectés | Lighthouse > 90 (si applicable) |
| ☐ | **Performance** | Requêtes optimisées | Pas de N+1, index présents |
| ☐ | **Build** | Build réussit | `pnpm build` → 0 erreurs |

> 📖 Référence : @framework/04-artefacts.md - Section "Definition of Output Done (DoOD)"

### 4.2.2 Ce qui N'est PAS "Done"

| Affirmation | Pourquoi ce n'est pas Done |
|-------------|---------------------------|
| "Le code compile" | Compiler ≠ fonctionner |
| "Ça marche sur ma machine" | L'environnement de prod est différent |
| "Les tests passent localement" | CI peut révéler d'autres problèmes |
| "Done à 90%" | 90% = pas done |
| "On testera plus tard" | Plus tard = jamais |

> ⚠️ **RÈGLE** : Une fonctionnalité n'est "Done" que si TOUS les critères sont satisfaits. Pas d'exception.

---

## 4.3 Étape : Validation fonctionnelle (QA)

| | |
|---|---|
| 🎭 **ACTEUR** | QA Engineer |
| 📥 **ENTRÉES** | Code validé techniquement, SPEC, critères d'acceptation |
| 📤 **SORTIES** | Rapport de validation fonctionnelle |
| ⏱️ **DURÉE** | 30 min - 2h |
| 🔗 **DÉPENDANCES** | Validation technique OK |

### 4.3.1 Types de tests à exécuter

| Type de test | Objectif | Niveau d'automatisation |
|--------------|----------|-------------------------|
| **Fonctionnel** | Vérifier chaque critère d'acceptation | 70-80% automatisé |
| **Régression** | S'assurer que rien n'est cassé | 100% automatisé |
| **Exploratoire** | Trouver bugs non anticipés | 0% (manuel intentionnel) |
| **Edge cases** | Tester les cas limites | 50-70% automatisé |

### 4.3.2 Procédure de validation fonctionnelle

1. **Récupérez la SPEC** de la fonctionnalité à valider
2. **Listez les critères d'acceptation** (AC) à vérifier
3. **Préparez l'environnement de test** (staging ou local)
4. **Exécutez les tests automatisés** :
   ```bash
   pnpm test:e2e
   ```
5. **Testez manuellement** chaque critère d'acceptation
6. **Effectuez des tests exploratoires** (10-15 min)
7. **Documentez les résultats** dans le rapport

### 4.3.3 Template rapport de validation fonctionnelle

```markdown
# Rapport de Validation Fonctionnelle

## Informations
| | |
|---|---|
| **SPEC** | [Référence de la SPEC] |
| **Date** | [Date de validation] |
| **QA** | [Nom du QA] |
| **Environnement** | [Staging / Local / Production] |

## Résultat des critères d'acceptation

| AC | Description | Statut | Commentaire |
|----|-------------|--------|-------------|
| AC-001 | [Description courte] | ✅ Validé | - |
| AC-002 | [Description courte] | ✅ Validé | - |
| AC-003 | [Description courte] | ⚠️ Mineur | [Détail] |
| AC-004 | [Description courte] | ❌ Bloquant | [Détail] |

## Tests automatisés
| Suite | Passés | Échoués | Ignorés |
|-------|--------|---------|---------|
| E2E | XX | XX | XX |
| Régression | XX | XX | XX |

## Bugs découverts

| ID | Sévérité | Description | Reproductible |
|----|----------|-------------|---------------|
| BUG-XXX | Critique / Majeur / Mineur | [Description] | Oui / Non |

## Tests exploratoires
[Résumé des findings]

## Verdict
- [ ] ✅ **VALIDÉ** - Prêt pour validation métier
- [ ] ⚠️ **VALIDÉ AVEC RÉSERVES** - Corrections mineures requises
- [ ] ❌ **NON VALIDÉ** - Retour en développement requis
```

---

## 4.4 Étape : Validation utilisabilité (QA + PM)

| | |
|---|---|
| 🎭 **ACTEUR** | QA Engineer + Product Manager |
| 📥 **ENTRÉES** | Validation fonctionnelle OK |
| 📤 **SORTIES** | Rapport de validation UX |
| ⏱️ **DURÉE** | 30 min - 1h |
| 🔗 **DÉPENDANCES** | Validation fonctionnelle |

### 4.4.1 Checklist utilisabilité

| ✓ | Catégorie | Vérification |
|---|-----------|--------------|
| ☐ | **UX** | Le parcours utilisateur est fluide et intuitif |
| ☐ | **UX** | Les messages d'erreur sont clairs et actionnables |
| ☐ | **UX** | Les états de chargement sont visibles |
| ☐ | **Accessibilité** | Navigation clavier fonctionnelle |
| ☐ | **Accessibilité** | Contrastes suffisants (ratio 4.5:1 minimum) |
| ☐ | **Accessibilité** | Labels et alt texts présents |
| ☐ | **Performance** | Temps de chargement acceptable (<3s) |
| ☐ | **Responsive** | Affichage correct mobile/tablette/desktop |

### 4.4.2 Outils de vérification

| Outil | Usage | Commande / URL |
|-------|-------|----------------|
| Lighthouse | Performance, accessibilité, SEO | DevTools > Lighthouse |
| axe DevTools | Accessibilité détaillée | Extension navigateur |
| WAVE | Accessibilité visuelle | wave.webaim.org |

---

## 4.5 Étape : Validation métier (PM)

| | |
|---|---|
| 🎭 **ACTEUR** | Product Manager |
| 📥 **ENTRÉES** | Validations technique, fonctionnelle et UX OK |
| 📤 **SORTIES** | Acceptation ou refus métier |
| ⏱️ **DURÉE** | 30 min - 1h |
| 🔗 **DÉPENDANCES** | Toutes validations précédentes |

### 4.5.1 Procédure de démo

1. **Le PE prépare l'environnement** de démonstration (staging)
2. **Le PE présente la fonctionnalité** en suivant le flow nominal
3. **Le PM vérifie chaque critère d'acceptation** de la SPEC
4. **Le PM teste lui-même** les cas d'usage principaux
5. **Le PM valide l'alignement** avec l'intention métier du PRD
6. **Le PM donne son verdict**

### 4.5.2 Questions clés pour le PM

| Question | Ce que ça valide |
|----------|------------------|
| La fonctionnalité résout-elle le problème identifié dans le PRD ? | Alignement avec l'intention |
| L'utilisateur comprendra-t-il comment l'utiliser ? | Utilisabilité |
| Cette implémentation apporte-t-elle la valeur attendue ? | Outcome potentiel |
| Y a-t-il des cas d'usage non couverts qui devraient l'être ? | Complétude |

### 4.5.3 Template validation métier

```markdown
# Validation Métier

## Informations
| | |
|---|---|
| **SPEC** | [Référence de la SPEC] |
| **Date** | [Date de validation] |
| **PM** | [Nom du PM] |

## Alignement PRD
| Critère | Statut | Commentaire |
|---------|--------|-------------|
| Problème résolu | ✅ / ❌ | [Commentaire] |
| Outcome atteignable | ✅ / ❌ | [Commentaire] |
| Personas couverts | ✅ / ❌ | [Commentaire] |

## Verdict métier
- [ ] ✅ **ACCEPTÉ** - Prêt pour intégration
- [ ] ⚠️ **ACCEPTÉ AVEC RÉSERVES** - [Détail des réserves]
- [ ] ❌ **REFUSÉ** - [Raison du refus]

## Commentaires
[Feedback libre]
```

---

## 4.6 Étape : Décision finale

| | |
|---|---|
| 🎭 **ACTEUR** | Équipe (PE + QA + PM) |
| 📥 **ENTRÉES** | Tous les rapports de validation |
| 📤 **SORTIES** | Décision : VALIDÉ / CORRECTIONS / REJET |
| ⏱️ **DURÉE** | 15 min |
| 🔗 **DÉPENDANCES** | Toutes validations terminées |

### 4.6.1 Matrice de décision

| Situation | Décision | Action suivante |
|-----------|----------|-----------------|
| Tous les critères OK | **VALIDÉ** | → Passer à la Boucle 4 (Intégrer) |
| Bugs mineurs uniquement (<3) | **CORRECTIONS** | → PE corrige, retour en 4.3 |
| Bug critique ou bloquant | **REJET** | → Retour en Boucle 2 (Implémenter) |
| Fonctionnalité hors intention PRD | **REJET** | → Retour en Boucle 1 (Planifier) |

### 4.6.2 Critères de sévérité des bugs

| Sévérité | Définition | Impact sur décision |
|----------|------------|---------------------|
| **Critique** | Crash, perte de données, faille sécurité | REJET immédiat |
| **Majeur** | Fonctionnalité principale inutilisable | REJET |
| **Mineur** | Gêne utilisateur, contournement possible | CORRECTIONS si <3 |
| **Cosmétique** | UI non conforme, texte incorrect | Peut être livré, à corriger après |

> ⚠️ **ESCALADE** : Si un bug critique est découvert, impliquez immédiatement le Tech Lead pour évaluer l'impact.

---

## 4.7 Métriques de validation

### 4.7.1 Indicateurs à suivre

| Indicateur | Cible | Fréquence de mesure |
|------------|-------|---------------------|
| Validation au premier essai | >70% | Par fonctionnalité |
| Bugs critiques détectés en validation | 0 | Par fonctionnalité |
| Bugs mineurs par feature | <3 | Par fonctionnalité |
| Durée moyenne de validation | <4h | Hebdomadaire |
| Bugs échappés en production | <1/mois | Mensuelle |

### 4.7.2 Comment améliorer le taux de validation

| Problème | Cause probable | Action corrective |
|----------|----------------|-------------------|
| Trop de rejets | SPECs insuffisantes | Améliorer la qualité des SPECs (Boucle 1) |
| Bugs critiques fréquents | Tests insuffisants | Renforcer la couverture de tests |
| Validation trop longue | Process mal défini | Automatiser davantage |
| Désalignement métier | Manque de communication | Impliquer PM plus tôt |

---

## 4.8 Problèmes courants

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| Ping-pong PE ↔ QA sans fin | Critères d'acceptation flous | Clarifier les AC avant développement |
| PM indisponible pour valider | Planning non aligné | Planifier les créneaux de validation |
| Environnement de test instable | Infrastructure fragile | Dédier un environnement staging stable |
| Régression non détectée | Tests automatisés insuffisants | Augmenter couverture de régression |
| Bugs découverts en production | Validation bâclée | Appliquer strictement la checklist |

> ⚠️ **ESCALADE** : Si les rejets dépassent 50% sur 5 fonctionnalités consécutives, organisez une rétrospective dédiée avec le Tech Lead.

---

## 4.9 Checklist de fin de phase

Avant de passer à la Boucle 4 (Intégrer), vérifiez :

| ✓ | Élément | Vérification |
|---|---------|--------------|
| ☐ | Validation technique | Checklist DoOD 100% complétée |
| ☐ | Validation fonctionnelle | Tous les AC validés |
| ☐ | Validation utilisabilité | Aucun problème UX bloquant |
| ☐ | Validation métier | PM a donné son accord |
| ☐ | Décision finale | VALIDÉ ou CORRECTIONS appliquées |
| ☐ | Rapport de validation | Documenté et archivé |
| ☐ | Bugs | Tous les bugs critiques/majeurs corrigés |

> 💡 **CONSEIL** : Ne passez jamais à l'intégration avec des bugs majeurs non résolus. La dette de qualité coûte plus cher à corriger en production.

---

*Étape suivante : [05-deploiement.md](05-deploiement.md) — Livrer le code en production*
