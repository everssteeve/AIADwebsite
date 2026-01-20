# D.3 Tech Review

## Pourquoi cette annexe ?

La Tech Review est le gardien de la qualité technique. Mal conduite, elle devient un goulot d'étranglement bureaucratique. Bien conduite, elle prévient les erreurs coûteuses et accélère les décisions architecturales. Cette annexe vous donne les outils pour des reviews qui ajoutent de la valeur sans ralentir l'équipe.

---

## Types de Tech Review

| Type | Quand | Durée | Output |
|------|-------|-------|--------|
| **Design Review** | Avant implémentation complexe | 30-45 min | Décision Go/No-Go + ADR |
| **Code Review Approfondie** | Changements sensibles/complexes | 30-60 min | Feedback structuré |
| **Review de Dette** | Périodique (bi-hebdo/mensuel) | 30 min | Priorisation dette |

---

## Design Review

Pour valider une approche technique **avant** d'écrire le code.

### Quand Déclencher

| Trigger | Exemples |
|---------|----------|
| Nouveau composant structurant | Nouveau service, nouvelle lib majeure |
| Changement d'architecture | Migration DB, changement de pattern |
| Incertitude technique | Plusieurs approches possibles |
| Impact transverse | Touche plusieurs modules/équipes |

### Template Design Review

```markdown
# Design Review - [Feature/Changement]

## Métadonnées
- **Date** : [Date]
- **Proposeur** : [PE/TL]
- **SPEC** : [Référence]

## Participants
- [ ] Tech Lead (facilite)
- [ ] PE concerné(s)
- [ ] Agents Engineer (si pertinent)

---

## 1. Contexte (5 min)

**Problème à résoudre** :
[Description en 2-3 phrases]

**Contraintes** :
- [Contrainte 1]
- [Contrainte 2]

**SPEC associée** : [Lien]

---

## 2. Proposition (10 min)

### Approche Proposée
[Description technique de l'approche]

### Diagramme
[Schéma si applicable]

### Changements Requis
| Composant | Modification |
|-----------|--------------|
| [Composant] | [Ce qui change] |

---

## 3. Alternatives Considérées (10 min)

| Alternative | Pour | Contre | Pourquoi Non |
|-------------|------|--------|--------------|
| [Option A] | [...] | [...] | [Raison] |
| [Option B] | [...] | [...] | [Raison] |

---

## 4. Discussion (15 min)

### Points à Valider
- [ ] [Question technique 1]
- [ ] [Question technique 2]
- [ ] [Risque identifié]

### Notes de Discussion
[Prise de notes pendant la review]

---

## 5. Décision

**Status** : ✅ Approuvé / ⚠️ Approuvé avec réserves / ❌ Rejeté

**Réserves/Conditions** :
- [Si applicable]

**ADR à créer** : Oui → ADR-XXX / Non

**Next Steps** :
| Action | Owner | Deadline |
|--------|-------|----------|
| [Action] | [Nom] | [Date] |
```

### Exemple : Design Review Migration

```markdown
# Design Review - Migration Redux → Zustand

## Contexte
Performance dégradée sur listes > 1000 items.
Profiling : 60% du temps CPU dans les re-renders Redux.
Objectif : améliorer le temps de réponse de 200ms à < 50ms.

## Proposition
Migrer vers Zustand avec stores atomiques par domaine.
Migration incrémentale sur 3 sprints.

## Alternatives Considérées
| Alternative | Pour | Contre | Pourquoi Non |
|-------------|------|--------|--------------|
| Optimiser Redux (memo, selectors) | Pas de migration | Gains limités (~30%) | Insuffisant |
| Recoil | API similaire | Maintenance incertaine | Risque long terme |
| Zustand | Simple, performant, stable | Petite migration | ✅ Choisi |

## Décision
✅ Approuvé

ADR-015 créé pour documenter la décision.

Next Steps :
- POC sur module Dashboard → PE1 → S42
- Plan de migration détaillé → TL → S42
```

---

## Code Review Approfondie

Pour les changements complexes qui méritent plus qu'une PR review standard.

### Critères de Déclenchement

| Signal | Action |
|--------|--------|
| PR > 500 lignes | Review approfondie recommandée |
| Nouveau pattern introduit | Review avec TL obligatoire |
| Code sécurité/paiement | Review approfondie obligatoire |
| Refactoring majeur | Review avant merge |

### Grille d'Évaluation

```markdown
# Code Review - [PR/Changement]

## Scope
- **PR** : [Lien]
- **Lignes** : [N] lignes modifiées
- **Fichiers** : [Liste principales]

---

## Architecture

| Critère | Status | Notes |
|---------|--------|-------|
| Cohérence avec patterns existants | 🟢/🟡/🔴 | [Notes] |
| Séparation des responsabilités | 🟢/🟡/🔴 | [Notes] |
| Couplage approprié | 🟢/🟡/🔴 | [Notes] |
| Extensibilité si nécessaire | 🟢/🟡/🔴 | [Notes] |

## Performance

| Critère | Status | Notes |
|---------|--------|-------|
| Complexité algorithmique | 🟢/🟡/🔴 | [Notes] |
| Pas de N+1 queries | 🟢/🟡/🔴 | [Notes] |
| Gestion mémoire appropriée | 🟢/🟡/🔴 | [Notes] |

## Sécurité

| Critère | Status | Notes |
|---------|--------|-------|
| Input validation | 🟢/🟡/🔴 | [Notes] |
| Pas d'exposition données sensibles | 🟢/🟡/🔴 | [Notes] |
| Auth/Authz correcte | 🟢/🟡/🔴 | [Notes] |

## Maintenabilité

| Critère | Status | Notes |
|---------|--------|-------|
| Code lisible | 🟢/🟡/🔴 | [Notes] |
| Tests suffisants | 🟢/🟡/🔴 | [Notes] |
| Documentation si nécessaire | 🟢/🟡/🔴 | [Notes] |

---

## Findings

| Sévérité | Fichier | Issue | Action Requise |
|----------|---------|-------|----------------|
| 🔴 Bloquant | [file:line] | [Description] | [Fix requis] |
| 🟡 Important | [file:line] | [Description] | [Suggestion] |
| 🟢 Mineur | [file:line] | [Description] | [Optionnel] |

---

## Verdict

**Status** : ✅ Approuvé / ⚠️ Changements requis / ❌ Rejeté

**Bloquants à résoudre** :
- [Item 1]

**Avant merge** :
- [ ] [Action 1]
- [ ] [Action 2]
```

---

## Review de Dette Technique

### Inventaire de la Dette

```markdown
# Inventaire Dette - [Date]

## Dette Active

| ID | Zone | Description | Impact | Effort | Priorité |
|----|------|-------------|--------|--------|----------|
| D-001 | Auth | Session management legacy | 🔴 High | M | P0 |
| D-002 | API | Inconsistance error handling | 🟡 Med | S | P1 |
| D-003 | UI | Composants non accessibles | 🟡 Med | L | P1 |
| D-004 | Tests | Couverture < 60% module X | 🟢 Low | M | P2 |

## Évolution

| Période | Dette Ajoutée | Dette Remboursée | Net |
|---------|---------------|------------------|-----|
| S40-S41 | +3 items | -2 items | +1 |
| S38-S39 | +1 item | -3 items | -2 |

## Allocation

- **Cible** : 20% du temps sur la dette
- **Actuel** : [X]%
- **Tendance** : 📈/📉/➡️
```

### Matrice de Priorisation

```
         │ Effort Faible  │ Effort Moyen   │ Effort Élevé
─────────┼────────────────┼────────────────┼───────────────
Impact   │ 🔴 QUICK WIN   │ 🟠 PLANIFIER   │ 🟡 ÉVALUER ROI
Élevé    │ → Sprint actuel│ → Sprint +1    │ → Business case
─────────┼────────────────┼────────────────┼───────────────
Impact   │ 🟠 OPPORTUNISTE│ 🟡 SI CAPACITÉ │ 🔵 BACKLOG
Moyen    │ → Boy scout    │ → Quand possible│ → Plus tard
─────────┼────────────────┼────────────────┼───────────────
Impact   │ 🟡 BOY SCOUT   │ 🔵 BACKLOG     │ ⚪ IGNORER
Faible   │ → Si on passe  │ → Someday/Maybe │ → Pas de ROI
```

### Critères d'Impact

| Score | Définition | Exemples |
|-------|------------|----------|
| 🔴 **Élevé** | Bloque features, cause bugs, risque sécurité | Couplage empêchant évolution, faille connue |
| 🟡 **Moyen** | Ralentit développement, DX dégradée | Tests lents, code confus, docs obsolètes |
| 🟢 **Faible** | Gêne esthétique, inconsistance mineure | Nommage variable, formatage |

### Critères d'Effort

| Score | Définition |
|-------|------------|
| **S** (Small) | < 2h |
| **M** (Medium) | 2h - 1 jour |
| **L** (Large) | 1-3 jours |
| **XL** | > 3 jours (nécessite découpage) |

---

## Template Tech Review Périodique

```markdown
# Tech Review - [Date]

## Participants
- [Nom] - Tech Lead (facilite)
- [Nom] - PE
- [Nom] - PE

---

## 1. ADRs Récents (5 min)

| ADR | Titre | Status | Notes |
|-----|-------|--------|-------|
| ADR-XXX | [Titre] | Accepté | - |

---

## 2. Design Reviews En Cours (15 min)

### [Feature X]
**Status** : En discussion / Validé / Bloqué

**Points clés** :
- [Point 1]
- [Point 2]

**Décision** : [Si applicable]

---

## 3. Dette Technique (10 min)

### Nouvelles Dettes
| ID | Zone | Description | Priorité |
|----|------|-------------|----------|
| D-XXX | [Zone] | [Desc] | P0/P1/P2 |

### Progress
| ID | Status Avant | Status Après |
|----|--------------|--------------|
| D-XXX | Open | In Progress |
| D-XXX | In Progress | Done ✅ |

### Allocation Sprint
- Prévu : 20%
- Réel : [X]%

---

## 4. Sujets Techniques (10 min)

### [Sujet 1]
[Discussion et décision]

### [Sujet 2]
[Discussion et décision]

---

## Actions

| Action | Owner | Deadline |
|--------|-------|----------|
| [Action] | [Nom] | [Date] |

---

**Prochaine Tech Review** : [Date]
**Focus prévu** : [Sujet]
```

---

## Exemples Pratiques

### Exemple 1 : Quick Win Identifié

```markdown
## Dette D-012 : Logs Inconsistants

**Impact** : 🟡 Moyen - Debugging difficile, 30 min perdues par incident
**Effort** : S - 2h pour standardiser

**Action** :
- Créer helper logEvent() standardisé
- Migrer les 15 appels existants
- Owner : PE2 - Sprint actuel (boy scout)
```

### Exemple 2 : Refus de Dette

```markdown
## Proposition : Réécrire le Module Auth

**Argument** : "Le code est vieux et pas élégant"

**Analyse** :
- Fonctionne depuis 2 ans sans bug
- Aucune feature bloquée
- Effort estimé : 2 semaines

**Décision** : ❌ Non

**Raison** : Dette "pas parfait" ≠ dette à rembourser.
Le code fonctionne, pas d'impact vélocité mesurable.
```

### Exemple 3 : ADR Suite à Design Review

```markdown
# ADR-015 : Migration Zustand

## Status
Accepté - 2024-01-15

## Contexte
Performance dégradée sur listes > 1000 items.
Redux responsable de 60% du temps CPU en re-renders.

## Décision
Migrer vers Zustand avec stores atomiques.

## Conséquences
+ Performance améliorée (cible : -75% temps réponse)
+ Code simplifié (moins de boilerplate)
- Coût migration : 3 sprints
- Formation équipe nécessaire

## Alternatives Rejetées
- Optimiser Redux : gains insuffisants
- Recoil : maintenance incertaine
```

---

## Anti-patterns

### 1. Le Comité d'Architecture

**Symptôme** : Rien ne se fait sans validation

```
❌ "On ne peut pas commencer avant la Tech Review de mardi"
   → Bloqué 5 jours pour une décision de 10 min
```

**Solution** : Review asynchrone pour les cas simples

```
✅ Design doc partagé pour commentaires (24h de délai)
✅ Tech Review synchrone uniquement si complexe ou controversé
```

### 2. Le Catalogue de Dette Infini

**Symptôme** : Liste qui grandit sans action

```
❌ 47 items de dette, 0 résolu ce trimestre
```

**Solution** : Prioriser et limiter

```
✅ Max 10-15 items actifs
✅ 20% du temps alloué au remboursement
✅ Archiver la dette basse priorité (Someday/Maybe)
```

### 3. Le Perfectionnisme

**Symptôme** : Tout devient de la dette

```
❌ "Ce code n'est pas parfait, c'est de la dette"
```

**Solution** : Définition stricte

```
✅ Dette = impact MESURABLE sur vélocité/qualité/sécurité
✅ Code "pas parfait" mais fonctionnel ≠ dette
```

### 4. La Review Tardive

**Symptôme** : Review après implémentation

```
❌ "Ah, on aurait dû faire autrement..."
   → 3 jours de travail à refaire
```

**Solution** : Review avant

```
✅ Design Review pour les features complexes
✅ Spike/POC pour les incertitudes
✅ Validation du "comment" avant de coder
```

### 5. Le Bikeshedding

**Symptôme** : 30 minutes sur un nom de variable

```
❌ Débat sur getUser vs fetchUser vs loadUser
```

**Solution** : Timeboxer et trancher

```
✅ "5 min max sur ce sujet. Pas de consensus ? TL tranche."
✅ Focus sur l'impact réel, pas les préférences
```

---

## Métriques Techniques

### Dashboard Santé du Code

```markdown
## Métriques Techniques - Semaine [N]

| Métrique | Valeur | Tendance | Cible | Status |
|----------|--------|----------|-------|--------|
| Couverture tests | 82% | ↑ | > 80% | 🟢 |
| Dette technique | 12 items | → | < 15 | 🟢 |
| Temps de build | 4.2 min | ↑ | < 5 min | 🟢 |
| Deps outdated | 8 | ↓ | < 10 | 🟢 |
| Incidents prod | 1 | ↓ | < 2/mois | 🟢 |
```

### Alertes

| Alerte | Seuil | Action |
|--------|-------|--------|
| Couverture < 75% | 🔴 | Bloquer merge, ajouter tests |
| Build > 10 min | 🟡 | Prioriser optimisation CI |
| Deps outdated > 20 | 🟡 | Sprint de mise à jour |
| > 3 incidents/mois | 🔴 | Post-mortem + action correctrice |

---

## Checklist

```markdown
## Checklist Tech Review

### Design Review
- [ ] Contexte et problème documentés
- [ ] Alternatives listées avec pour/contre
- [ ] Diagramme si architecture complexe
- [ ] Participants pertinents invités
- [ ] Décision documentée (ADR si significatif)

### Code Review Approfondie
- [ ] Scope défini (pas de review de 2000 lignes)
- [ ] Critères d'évaluation appliqués
- [ ] Findings catégorisés par sévérité
- [ ] Actions clairement listées
- [ ] Verdict explicite

### Review de Dette
- [ ] Inventaire à jour
- [ ] Priorisation matrice Impact/Effort
- [ ] Allocation 20% respectée
- [ ] Items terminés célébrés
- [ ] Nouvelles dettes identifiées
```

---

*Annexes connexes : [D.2 Demo & Feedback](./D2-demo-feedback.md) · [D.4 Rétrospective](./D4-retrospective.md) · [A.2 Template Architecture](./A2-architecture.md)*
