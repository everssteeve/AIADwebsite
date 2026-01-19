# D.3 Tech Review - Détails

## Pourquoi cette annexe ?

Cette annexe fournit les critères de priorisation de la dette technique et des templates pour conduire des Tech Reviews efficaces.

---

## Vue d'Ensemble

### Objectif
Examiner les choix techniques, identifier et prioriser la dette technique, valider l'architecture des nouvelles features.

### Cadence Recommandée
Bi-hebdomadaire ou mensuelle selon le rythme du projet.

### Durée
30 à 60 minutes.

### Participants
- Tech Lead (facilite)
- Product Engineer(s)
- Agents Engineer (si présent)
- PM (optionnel, pour contexte business)

---

## Types de Tech Review

### 1. Review de Design

Avant l'implémentation d'une feature complexe.

```markdown
## Design Review - [Feature]

### Contexte
- SPEC : [Référence]
- Objectif technique : [Ce qu'on doit accomplir]

### Proposition
[Description de l'approche technique proposée]

### Diagramme (si applicable)
[Schéma d'architecture]

### Points de Discussion
- [ ] [Question technique 1]
- [ ] [Question technique 2]

### Alternatives Considérées
| Alternative | Pour | Contre |
|-------------|------|--------|
| [A] | [...] | [...] |
| [B] | [...] | [...] |

### Décision
[À remplir pendant la review]

### ADR à Créer
[ ] Oui → ADR-XXX
[ ] Non
```

### 2. Review de Code Approfondie

Pour les changements complexes ou sensibles.

```markdown
## Code Review - [PR/Changement]

### Portée
- Fichiers : [Liste]
- Lignes modifiées : [N]
- Type : [Feature/Refactoring/Fix]

### Points d'Attention

#### Architecture
- [ ] Cohérence avec les patterns existants
- [ ] Séparation des responsabilités
- [ ] Extensibilité

#### Performance
- [ ] Complexité algorithmique acceptable
- [ ] Pas de N+1 queries
- [ ] Gestion mémoire

#### Sécurité
- [ ] Input validation
- [ ] Pas d'exposition de données sensibles

#### Maintenabilité
- [ ] Code lisible
- [ ] Tests suffisants
- [ ] Documentation si nécessaire

### Findings
| Sévérité | Fichier:Ligne | Issue | Suggestion |
|----------|---------------|-------|------------|
| 🔴 | [...] | [...] | [...] |
| 🟡 | [...] | [...] | [...] |
| 🟢 | [...] | [...] | [...] |
```

### 3. Review de Dette Technique

Évaluation périodique de la dette accumulée.

```markdown
## Review Dette Technique - [Date]

### Inventaire

#### Dette Identifiée Cette Période
| ID | Zone | Description | Impact | Effort |
|----|------|-------------|--------|--------|
| D-001 | [Zone] | [Description] | [H/M/L] | [S/M/L] |

#### Dette Existante
| ID | Zone | Status | Évolution |
|----|------|--------|-----------|
| D-001 | [Zone] | [Open/In Progress/Done] | [↑/→/↓] |

### Analyse
- Dette totale estimée : [X] jours
- Tendance : 📈 Croissante / 📉 Décroissante / ➡️ Stable

### Actions
| Action | Priorité | Sprint | Owner |
|--------|----------|--------|-------|
| [Action] | [P0/P1/P2] | [Quand] | [Nom] |
```

---

## Priorisation de la Dette Technique

### Matrice Impact/Effort

```
         │ Effort Faible  │ Effort Moyen   │ Effort Élevé
─────────┼────────────────┼────────────────┼───────────────
Impact   │ 🔴 QUICK WIN   │ 🟠 PLANIFIER   │ 🟡 ÉVALUER
Élevé    │ Faire ASAP     │ Sprint prochain│ ROI à valider
─────────┼────────────────┼────────────────┼───────────────
Impact   │ 🟠 PLANIFIER   │ 🟡 ÉVALUER     │ 🔵 BACKLOG
Moyen    │ Opportuniste   │ Si capacité    │ Plus tard
─────────┼────────────────┼────────────────┼───────────────
Impact   │ 🟡 ÉVALUER     │ 🔵 BACKLOG     │ ⚪ IGNORER
Faible   │ Boy scout rule │ Quand pertinent│ Pas de ROI
```

### Critères d'Impact

| Score | Critère | Exemple |
|-------|---------|---------|
| 🔴 Élevé | Bloque des features / Cause des bugs / Risque sécurité | Couplage empêchant l'évolution |
| 🟡 Moyen | Ralentit le développement / DX dégradée | Tests lents, code confus |
| 🟢 Faible | Gêne esthétique / Inconsistance mineure | Nommage inconsistant |

### Critères d'Effort

| Score | Critère | Exemple |
|-------|---------|---------|
| S | < 2h | Renommer, simplifier une fonction |
| M | 2h - 1 jour | Extraire un module, refactorer une classe |
| L | 1-3 jours | Migration, réécriture d'un composant |
| XL | > 3 jours | Refonte architecture, changement de lib |

### Scoring Détaillé

```markdown
## Scoring Dette - [ID]

### Impact
| Critère | Score (1-5) | Commentaire |
|---------|-------------|-------------|
| Fréquence d'exposition | [X] | Combien de devs touchent ce code |
| Vélocité impactée | [X] | Ralentissement estimé |
| Risque bug/incident | [X] | Probabilité de problème |
| Blocage feature | [X] | Features impossibles |

**Impact Total** : [Somme] / 20 → [Haut/Moyen/Bas]

### Effort
| Critère | Estimation |
|---------|------------|
| Temps dev | [X]h |
| Risque régression | [Haut/Moyen/Bas] |
| Tests à écrire | [X]h |
| Migration données | [Oui/Non] |

**Effort Total** : [S/M/L/XL]

### ROI
Priorité = Impact / Effort = [Score]
```

---

## Template Tech Review

```markdown
# Tech Review - [Date]

## Participants
- [Nom] (Tech Lead)
- [Nom] (PE)

## Agenda
1. Review des ADRs récents (5 min)
2. Design review [Feature X] (15 min)
3. État de la dette technique (10 min)
4. Discussion ouverte (10 min)

---

## 1. ADRs Récents

| ADR | Status | Impact |
|-----|--------|--------|
| ADR-042 : [Titre] | Accepté | [Notes] |

---

## 2. Design Review : [Feature X]

### Proposition
[Description technique]

### Discussion
[Notes de discussion]

### Décision
[Décision prise]

### Actions
- [ ] [Action 1]

---

## 3. Dette Technique

### Nouvelles Dettes Identifiées
| Zone | Issue | Priorité |
|------|-------|----------|
| [Zone] | [Description] | [P0/P1/P2] |

### Progress sur la Dette
| ID | Status Précédent | Status Actuel |
|----|------------------|---------------|
| D-001 | Open | In Progress |

### Allocation
- Sprint en cours : [X]% capacity sur dette
- Cible : 20%

---

## 4. Discussion Ouverte

### Sujets Abordés
- [Sujet 1]
- [Sujet 2]

### Actions
| Action | Owner | Deadline |
|--------|-------|----------|
| [Action] | [Nom] | [Date] |

---

## Prochaine Tech Review
Date : [Date]
Focus : [Sujet anticipé]
```

---

## Checklist Tech Lead

```markdown
## Préparation Tech Review

### Avant (J-1)
- [ ] Agenda préparé et partagé
- [ ] ADRs récents identifiés
- [ ] Design docs collectés
- [ ] Métriques de dette mises à jour

### Pendant
- [ ] Time-keeper sur chaque section
- [ ] Décisions documentées en direct
- [ ] Actions avec owners assignés

### Après (< 24h)
- [ ] Notes partagées
- [ ] ADRs créés si nécessaire
- [ ] Tickets de dette créés/mis à jour
- [ ] Actions trackées
```

---

## Anti-patterns

### 1. "Le Comité d'Architecture"

**Symptôme** : Décisions bloquées en attente de review
```
❌ "On ne peut pas commencer sans la validation Tech Review"
```

**Solution** : Review asynchrone pour les cas simples
```
✅ Design doc partagé pour commentaires
✅ Tech Review synchrone pour les cas complexes uniquement
```

### 2. "Le Catalogue de Dette"

**Symptôme** : Liste de dette qui grandit sans action
```
❌ 50 items de dette, aucun résolu
```

**Solution** : Prioriser et agir
```
✅ Max 10 items actifs
✅ 20% du temps alloué au remboursement
✅ Archiver la dette "basse priorité"
```

### 3. "Le Perfectionnisme"

**Symptôme** : Tout est de la dette
```
❌ "Ce code n'est pas parfait, c'est de la dette"
```

**Solution** : Définition claire de la dette
```
✅ Dette = impact mesurable sur la vélocité/qualité
✅ Code "pas parfait" ≠ dette si fonctionnel et maintenable
```

### 4. "La Review Tardive"

**Symptôme** : Review après que le code est écrit
```
❌ "Ah, on aurait dû faire autrement..."
```

**Solution** : Review avant l'implémentation
```
✅ Design review pour les features complexes
✅ Spike/POC pour les incertitudes
```

---

## Métriques Techniques

### À Suivre

```markdown
## Dashboard Technique

### Santé du Code
| Métrique | Valeur | Tendance | Cible |
|----------|--------|----------|-------|
| Couverture tests | 82% | ↑ | > 80% |
| Dette technique | 15 jours | → | < 20 jours |
| Temps de build | 4.2 min | ↑ | < 5 min |
| Dépendances outdated | 8 | ↓ | < 10 |

### Vélocité
| Métrique | Valeur | Tendance |
|----------|--------|----------|
| Lead time (commit → prod) | 2.1 jours | ↓ |
| Cycle time (start → done) | 3.5 jours | → |
| Taux de rollback | 2% | ↓ |
```

### Alertes

| Alerte | Seuil | Action |
|--------|-------|--------|
| Couverture < 75% | 🔴 | Bloquer merge, ajouter tests |
| Build > 10 min | 🟡 | Optimiser la CI |
| Dépendances outdated > 20 | 🟡 | Sprint de mise à jour |

---

*Retour aux [Annexes](../framework/08-annexes.md)*
