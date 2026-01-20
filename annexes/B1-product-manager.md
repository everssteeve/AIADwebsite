# B.1 Product Manager

## Pourquoi cette annexe ?

Le Product Manager dans AIAD définit le "quoi" et le "pourquoi", jamais le "comment". Cette annexe transforme cette responsabilité en actions concrètes : ce que vous faites lundi matin, comment vous collaborez avec l'équipe, et les pièges à éviter.

---

## Activités Quotidiennes

### La Journée Type du PM AIAD

| Moment | Activité | Durée | Output |
|--------|----------|-------|--------|
| Matin | Review des métriques produit | 15 min | Alertes identifiées |
| Matin | Traitement des feedbacks utilisateurs | 30 min | Insights documentés |
| Matin | Clarification des specs en cours | 30 min | Questions résolues |
| Après-midi | Rédaction/affinement des specs | 2h | SPECs Ready |
| Après-midi | Alignement avec stakeholders | 1h | Décisions prises |
| Fin de journée | Priorisation backlog | 30 min | Backlog à jour |

### Checklist Quotidienne

```markdown
## Daily PM - [Date]

### Métriques
- [ ] KPIs vérifiés (anomalies ?)
- [ ] Feedback utilisateurs lu

### Specs
- [ ] Questions PE/TL répondues (< 4h)
- [ ] Blocages identifiés et traités

### Décisions
- [ ] Décisions du jour documentées
- [ ] Stakeholders informés si nécessaire

### Préparation Demain
- [ ] SPECs prioritaires identifiées
- [ ] Réunions préparées
```

---

## Livrables Attendus

### 1. PRD (Product Requirements Document)

**Quand** : Au lancement d'un nouveau produit ou feature majeure.

**Structure** :

```markdown
# PRD : [Nom du Produit/Feature]

## Vision
[Une phrase qui répond à : "Pourquoi ce produit existe ?"]

## Outcome Principal
[Verbe] + [Métrique] + [Cible] + [Échéance]
Exemple : "Augmenter le taux de conversion de 5% à 8% d'ici M+3"

## Métriques de Succès
| Métrique | Baseline | Cible | Garde-fou |
|----------|----------|-------|-----------|
| [Principale] | [X] | [Y] | [Z min] |
| [Secondaire] | [X] | [Y] | [Z min] |

## Dans le Scope
- [Feature 1 avec critère de succès]
- [Feature 2 avec critère de succès]

## Hors Scope (explicite)
- [Ce qu'on ne fait PAS et pourquoi]

## Contraintes
- Business : [Budget, délais, dépendances]
- Technique : [Performance, sécurité, compatibilité]
- Légal : [RGPD, accessibilité, etc.]

## Non Spécifié (liberté technique)
- [Ce que l'équipe technique décide]
```

### 2. Opportunités Qualifiées

**Quand** : Discovery continue, alimentation du backlog.

```markdown
## Opportunité : [Nom]

### Problème Utilisateur
[Description factuelle du problème observé]

### Preuves
| Type | Donnée |
|------|--------|
| Quantitative | X% des utilisateurs abandonnent à l'étape Y |
| Qualitative | "Je ne comprends pas comment..." (interview #12) |
| Benchmark | Concurrent Z résout ce problème avec... |

### Impact Estimé
- Utilisateurs concernés : [N]
- Valeur potentielle : [€ ou métrique]
- Effort estimé : [T-shirt size]

### Recommandation
[ ] Prioriser (forte conviction, impact élevé)
[ ] Explorer (besoin de validation)
[ ] Rejeter (impact insuffisant)
```

### 3. SPECs Priorisées

**Quand** : Chaque cycle, alimenter le travail des PE.

Le PM ne rédige pas les SPECs techniques mais :
- Définit les critères d'acceptation business
- Valide que la SPEC couvre l'outcome attendu
- Priorise les SPECs selon la valeur

---

## Collaboration avec Chaque Rôle

### PM ↔ Product Engineer

| Situation | PM Fait | PM Ne Fait Pas |
|-----------|---------|----------------|
| Nouvelle feature | Définit l'outcome et les contraintes | Impose la solution technique |
| Question technique | Répond en < 4h sur le besoin business | Décide de l'architecture |
| Demo | Valide si l'outcome est atteint | Review le code |
| Blocage | Priorise ou ajuste le scope | Contourne le PE |

**Rituels clés** :
- **Refinement** : PM présente les outcomes, PE estime l'effort
- **Demo** : PE montre, PM valide l'outcome

### PM ↔ Tech Lead

| Situation | PM Fait | TL Fait |
|-----------|---------|---------|
| Nouvelle feature | Contraintes business et délais | Contraintes techniques et risques |
| Dette technique | Accepte le coût si justifié | Propose et estime le remboursement |
| Décision archi | Comprend l'impact business | Prend la décision technique |

**Point clé** : Le PM ne dit jamais "utilise telle techno". Il dit "j'ai besoin de X performance/coût/délai".

### PM ↔ QA Engineer

| Situation | PM Fait | QA Fait |
|-----------|---------|---------|
| Nouvelle spec | Définit les critères d'acceptation | Définit la stratégie de test |
| Bug découvert | Priorise selon impact utilisateur | Qualifie la sévérité technique |
| Release | Valide le DoOuD (outcome) | Valide le DoOD (qualité) |

### PM ↔ Stakeholders

| Situation | PM Fait | PM Évite |
|-----------|---------|----------|
| Demande de feature | Traduit en outcome mesurable | Promet une solution |
| Rapport d'avancement | Communique en outcomes | Liste des features livrées |
| Retard | Explique l'impact et les options | Cache ou minimise |

---

## Exemples Pratiques

### Bon Outcome vs Mauvais Outcome

| ❌ Mauvais | ✅ Bon | Pourquoi |
|-----------|--------|----------|
| "Améliorer l'UX" | "Réduire le taux d'abandon checkout de 15% à 10%" | Mesurable, actionnable |
| "Ajouter des notifications" | "Augmenter l'engagement à 3 sessions/semaine" | Orienté résultat, pas feature |
| "Refondre le dashboard" | "Réduire le temps pour trouver une info de 2min à 30s" | Valeur utilisateur explicite |
| "Faire comme le concurrent" | "Atteindre 80% de satisfaction sur la feature X" | Propre au contexte, mesurable |

### Template de Décision Rapide

```markdown
## Décision : [Sujet]

**Date** : [YYYY-MM-DD]
**Contexte** : [1-2 phrases]

### Options
| Option | Pour | Contre |
|--------|------|--------|
| A | [...] | [...] |
| B | [...] | [...] |

### Décision
[Option choisie] parce que [raison principale].

### Impact
- Sur le scope : [...]
- Sur le planning : [...]
- À communiquer à : [...]
```

---

## Anti-patterns

### 1. Le PM Architecte

**Symptôme** : Dicte les solutions techniques.

```
❌ "Il faut utiliser Redis pour le cache"
❌ "Faites un microservice pour cette feature"
❌ "Utilisez React Query, c'est mieux"
```

**Impact** : Frustration des devs, solutions sous-optimales, responsabilité diluée.

**Correction** :
```
✅ "On a besoin de temps de réponse < 200ms sous 1000 utilisateurs"
✅ "Cette feature doit pouvoir évoluer indépendamment du reste"
✅ "Le state doit persister entre les sessions"
```

### 2. Le PM Absent

**Symptôme** : Specs vagues, décisions retardées, indisponibilité.

```
❌ "Faites au mieux pour le comportement en erreur"
❌ [Question sans réponse pendant 2 jours]
❌ "On verra le design plus tard"
```

**Impact** : Agents IA produisent du code incohérent, retravail massif, équipe démotivée.

**Correction** :
```
✅ Specs avec tous les cas limites documentés
✅ Réponse aux questions en < 4h (heures ouvrées)
✅ Décision même imparfaite > pas de décision
```

### 3. Le PM Feature Factory

**Symptôme** : Accumulation de features sans mesure d'impact.

```
❌ "Le client X l'a demandé, on l'ajoute"
❌ "Le concurrent l'a, on doit l'avoir"
❌ "On verra si ça marche après"
```

**Impact** : Produit complexe, outcomes non atteints, équipe épuisée.

**Correction** :
```
✅ "Cette feature contribue à l'outcome Y, voici comment on mesure"
✅ "Impact incertain → on fait un test avant de s'engager"
✅ "Non, car ça ne sert pas nos outcomes prioritaires"
```

### 4. Le PM Micro-manager

**Symptôme** : Dans chaque détail, valide chaque décision.

```
❌ "Je veux valider chaque PR"
❌ "Montrez-moi le code avant de merger"
❌ "Je dois être en copie de tous les échanges"
```

**Impact** : Bottleneck, équipe déresponsabilisée, PM submergé.

**Correction** :
```
✅ Valider les specs en amont, faire confiance à l'exécution
✅ Review à la Demo, pas à chaque commit
✅ Intervenir sur les outcomes, pas sur les outputs
```

---

## Outils

### Weekly Review PM

```markdown
## Review Hebdo - Semaine [N]

### Outcomes Status
| Outcome | Baseline | Actuel | Cible | Trend |
|---------|----------|--------|-------|-------|
| [O1] | [X] | [Y] | [Z] | 🟢/🟡/🔴 |

### Décisions de la Semaine
| Décision | Contexte | Impact |
|----------|----------|--------|
| [D1] | [Pourquoi] | [Conséquences] |

### Learnings
- [Learning 1 - Ce qu'on a appris]
- [Learning 2 - Ce qu'on ferait différemment]

### Priorités Semaine Prochaine
1. [Priorité 1 - outcome visé]
2. [Priorité 2 - outcome visé]

### Risques/Blocages
| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| [R1] | [H/M/L] | [H/M/L] | [Action] |
```

### Priorisation RICE Adaptée AIAD

| Critère | Question | Score |
|---------|----------|-------|
| **R**each | Combien d'utilisateurs impactés ce mois ? | 1-10 |
| **I**mpact | Quelle amélioration par utilisateur ? | 0.25 / 0.5 / 1 / 2 / 3 |
| **C**onfidence | Quelle certitude sur les estimations ? | 50% / 80% / 100% |
| **E**ffort | Combien de cycles AIAD ? | 1-10 |

```
Score = (Reach × Impact × Confidence) / Effort
```

---

## Checklist

### Avant de Lancer une Feature
- [ ] Outcome mesurable défini (pas juste "améliorer X")
- [ ] Baseline et cible chiffrées
- [ ] Scope explicite (in ET out)
- [ ] Contraintes documentées (business, technique, légal)
- [ ] Liberté technique préservée (pas de solution imposée)
- [ ] Stakeholders alignés

### Pendant le Développement
- [ ] Disponible pour clarifications (< 4h)
- [ ] Décisions documentées
- [ ] Pas d'intervention sur le "comment"

### À la Livraison
- [ ] DoOuD vérifié (outcome atteint ?)
- [ ] Learnings documentés
- [ ] Communication stakeholders faite

---

*Annexes connexes : [A.1 Template PRD](A1-prd.md) • [A.6 Template DoOuD](A6-dooud.md) • [B.2 Product Engineer](B2-product-engineer.md)*
