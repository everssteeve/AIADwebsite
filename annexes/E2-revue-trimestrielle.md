# E.2 Template Revue Trimestrielle

## Pourquoi cette annexe ?

Cette annexe fournit un template complet pour conduire la revue trimestrielle AIAD : questions à aborder, format, participants et outputs attendus.

---

## Vue d'Ensemble

### Objectif
Évaluer la santé globale du produit et de l'équipe sur le trimestre passé, définir les orientations pour le trimestre suivant.

### Cadence
Tous les 3 mois (fin de Q1, Q2, Q3, Q4).

### Durée
2 à 3 heures.

### Participants
- Product Manager (facilite)
- Tech Lead
- Product Engineer(s)
- QA Engineer
- Stakeholders clés (direction, sponsor produit)

---

## Préparation (1 semaine avant)

### Collecte de Données

```markdown
## Checklist Préparation

### Métriques à Collecter
- [ ] Outcomes : progression vers les cibles
- [ ] Vélocité : features livrées, cycle time
- [ ] Qualité : bugs, incidents, couverture
- [ ] Dette technique : évolution, remboursement
- [ ] Satisfaction équipe : feedback informel ou sondage

### Documents à Préparer
- [ ] Dashboard du trimestre
- [ ] Liste des features livrées
- [ ] Incidents majeurs et post-mortems
- [ ] Retours utilisateurs consolidés
- [ ] État de la roadmap

### Input des Participants
Demander à chaque participant de préparer :
- 1-2 succès du trimestre
- 1-2 échecs ou déceptions
- 1-2 suggestions pour le trimestre suivant
```

---

## Agenda Détaillé

```markdown
# Revue Trimestrielle - Q[X] 2026

## Agenda

| Bloc | Durée | Contenu |
|------|-------|---------|
| 1 | 15 min | Check-in et contexte |
| 2 | 30 min | Revue des Outcomes |
| 3 | 30 min | Revue Opérationnelle |
| 4 | 20 min | Revue Technique |
| 5 | 20 min | Retours Équipe |
| 6 | 30 min | Orientations Q+1 |
| 7 | 15 min | Actions et Clôture |

**Total : 2h40**
```

---

## Bloc 1 : Check-in et Contexte (15 min)

```markdown
## Check-in

### Tour de Table Express
Chaque participant en 1 phrase :
- Comment je vois ce trimestre ?
- Un mot pour le résumer ?

### Contexte Business
(PM présente, 5 min)
- Événements majeurs du trimestre
- Changements de contexte
- Ce qui a impacté le produit
```

---

## Bloc 2 : Revue des Outcomes (30 min)

```markdown
## Revue des Outcomes

### Outcome 1 : [Nom]

#### Progression
| Métrique | Début Q | Fin Q | Cible Q | Cible Annuelle |
|----------|---------|-------|---------|----------------|
| [Métrique] | [X] | [Y] | [Z] | [W] |

#### Analyse
- **Atteint ?** Oui / Partiellement / Non
- **Facteurs de succès** : [Ce qui a contribué]
- **Obstacles rencontrés** : [Ce qui a freiné]
- **Learnings** : [Ce qu'on a appris]

#### Projection
- Au rythme actuel, cible annuelle atteinte : [Oui/Non]
- Ajustements nécessaires : [Si applicable]

### Outcome 2 : [Nom]
[Même structure]

### Synthèse Outcomes
| Outcome | Status | Confiance Cible Annuelle |
|---------|--------|--------------------------|
| [O1] | 🟢/🟡/🔴 | Haute/Moyenne/Basse |
| [O2] | 🟢/🟡/🔴 | Haute/Moyenne/Basse |
```

---

## Bloc 3 : Revue Opérationnelle (30 min)

```markdown
## Revue Opérationnelle

### Vélocité

#### Métriques
| Métrique | Q-1 | Ce Q | Δ | Trend |
|----------|-----|------|---|-------|
| Features livrées | [X] | [Y] | [Z] | ↑/→/↓ |
| Cycle time moyen | [X]j | [Y]j | [Z]j | ↑/→/↓ |
| Prévisibilité | [X]% | [Y]% | [Z]% | ↑/→/↓ |

#### Analyse
- Vélocité en hausse/baisse de [X]%
- Principale cause : [...]
- Impact sur la roadmap : [...]

### Qualité

#### Métriques
| Métrique | Valeur | vs Q-1 | Cible |
|----------|--------|--------|-------|
| Bugs en prod | [X] | [Δ] | 0 |
| Incidents | [X] | [Δ] | 0 |
| Couverture tests | [X]% | [Δ]% | 80% |
| Rollbacks | [X] | [Δ] | <5% |

#### Incidents Majeurs
| Date | Incident | Impact | Root Cause | Résolu |
|------|----------|--------|------------|--------|
| [Date] | [Desc] | [Users affectés] | [Cause] | ✅/❌ |

### Process AIAD

#### Ce qui fonctionne bien
- [Point 1]
- [Point 2]

#### Ce qui peut être amélioré
- [Point 1]
- [Point 2]

#### Adaptations faites ce trimestre
- [Adaptation 1] → Résultat : [...]
- [Adaptation 2] → Résultat : [...]
```

---

## Bloc 4 : Revue Technique (20 min)

```markdown
## Revue Technique

### État de la Dette

| Métrique | Début Q | Fin Q | Δ |
|----------|---------|-------|---|
| Dette estimée (jours) | [X] | [Y] | [Z] |
| Items critiques | [X] | [Y] | [Z] |
| Remboursement effectué | - | [X]j | - |

#### Évolution
```
Début Q    ████████████████████ 20j
Mi-Q       ████████████████ 16j
Fin Q      ████████████ 12j
```

#### Actions Dette ce Trimestre
- ✅ [Action réalisée 1]
- ✅ [Action réalisée 2]
- ❌ [Action non réalisée - raison]

### Architecture

#### Changements Majeurs
- [ADR-XXX] : [Décision et impact]
- [ADR-YYY] : [Décision et impact]

#### Risques Techniques
| Risque | Niveau | Mitigation Prévue |
|--------|--------|-------------------|
| [Risque 1] | 🔴/🟡/🟢 | [Action] |

### Agents IA

#### Performance des Agents
| Aspect | Évaluation | Notes |
|--------|------------|-------|
| Qualité du code généré | [1-5] | [...] |
| Productivité | [1-5] | [...] |
| Courbe d'apprentissage équipe | [1-5] | [...] |

#### Améliorations AGENT-GUIDE
- [Amélioration 1]
- [Amélioration 2]
```

---

## Bloc 5 : Retours Équipe (20 min)

```markdown
## Retours Équipe

### Satisfaction et Bien-être

#### Sondage (si réalisé)
| Question | Score /5 | Δ Q-1 |
|----------|----------|-------|
| Satisfaction générale | [X] | [Δ] |
| Charge de travail | [X] | [Δ] |
| Clarté des priorités | [X] | [Δ] |
| Autonomie | [X] | [Δ] |
| Collaboration | [X] | [Δ] |

#### Tour de Table
Chaque membre partage (préparé en amont) :

**[Nom]**
- Fierté du trimestre : [...]
- Frustration : [...]
- Suggestion : [...]

**[Nom]**
- Fierté : [...]
- Frustration : [...]
- Suggestion : [...]

### Thèmes Récurrents
- [Thème 1] mentionné par [N] personnes
- [Thème 2] mentionné par [N] personnes
```

---

## Bloc 6 : Orientations Q+1 (30 min)

```markdown
## Orientations Q+1

### Contexte Stratégique
(Input direction si présente)
- Priorités business Q+1 : [...]
- Contraintes : [...]
- Opportunités : [...]

### Objectifs Proposés

#### Outcomes
| Outcome | Cible Q+1 | Justification |
|---------|-----------|---------------|
| [O1] | [Cible] | [Pourquoi] |
| [O2] | [Cible] | [Pourquoi] |

#### Initiatives Majeures
1. **[Initiative 1]**
   - Objectif : [...]
   - Effort estimé : [...]
   - Impact attendu : [...]

2. **[Initiative 2]**
   - Objectif : [...]
   - Effort estimé : [...]
   - Impact attendu : [...]

#### Dette Technique
- Budget prévu : [X]% du temps
- Focus : [Zones prioritaires]

### Discussion et Validation
- [ ] Objectifs validés par les stakeholders
- [ ] Équipe alignée
- [ ] Risques identifiés
```

---

## Bloc 7 : Actions et Clôture (15 min)

```markdown
## Actions

### Actions Décidées

| # | Action | Owner | Deadline | Lien |
|---|--------|-------|----------|------|
| 1 | [Action] | [Nom] | [Date] | [Ticket/Doc] |
| 2 | [Action] | [Nom] | [Date] | [Ticket/Doc] |
| 3 | [Action] | [Nom] | [Date] | [Ticket/Doc] |

### Suivi
- Actions trackées dans [Outil]
- Review mi-trimestre prévue : [Date]

## Clôture

### Feedback sur la Revue
- Format : [Score /5]
- Durée : [OK / Trop long / Trop court]
- Suggestions : [...]

### Prochaine Revue
- Date : [Date fin Q+1]
- Facilitateur : [Nom]

### Compte-Rendu
- Partagé à : [Liste]
- Par : [Nom]
- Avant : [Date]
```

---

## Template Compte-Rendu

```markdown
# Compte-Rendu Revue Trimestrielle Q[X] 2026

**Date** : [Date]
**Participants** : [Liste]
**Durée** : [X]h

---

## Résumé Exécutif

### Santé du Trimestre : [🟢/🟡/🔴]

[2-3 phrases résumant le trimestre]

### Chiffres Clés
- Features livrées : [X]
- Outcomes atteints : [X/Y]
- Satisfaction équipe : [X/5]

---

## Outcomes

| Outcome | Progression | Status |
|---------|-------------|--------|
| [O1] | [X% → Y%] | 🟢/🟡/🔴 |
| [O2] | [X% → Y%] | 🟢/🟡/🔴 |

**Analyse** : [Résumé]

---

## Points Saillants

### Succès
- [Succès 1]
- [Succès 2]

### Difficultés
- [Difficulté 1]
- [Difficulté 2]

### Learnings
- [Learning 1]
- [Learning 2]

---

## Orientations Q+1

### Priorités
1. [Priorité 1]
2. [Priorité 2]
3. [Priorité 3]

### Cibles
| Outcome | Cible Q+1 |
|---------|-----------|
| [O1] | [Cible] |

---

## Actions

| Action | Owner | Deadline |
|--------|-------|----------|
| [Action 1] | [Nom] | [Date] |
| [Action 2] | [Nom] | [Date] |

---

**Compte-rendu rédigé par** : [Nom]
**Date** : [Date]
```

---

## Checklist Facilitateur

```markdown
## Checklist Revue Trimestrielle

### 1 Semaine Avant
- [ ] Data collectée
- [ ] Dashboard préparé
- [ ] Agenda envoyé
- [ ] Input demandé aux participants
- [ ] Salle/visio réservée

### Le Jour J
- [ ] Matériel prêt (présentation, board)
- [ ] Timer pour chaque bloc
- [ ] Notes en temps réel
- [ ] Actions documentées avec owners

### Après
- [ ] Compte-rendu rédigé (< 48h)
- [ ] Partagé aux participants et stakeholders
- [ ] Actions créées dans l'outil de suivi
- [ ] Date prochaine revue calendrier
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
