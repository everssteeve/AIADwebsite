# E.2 Revue Trimestrielle

## Pourquoi cette annexe ?

La revue trimestrielle permet de prendre du recul sur la performance à long terme du produit et de l'équipe. Elle relie les efforts quotidiens aux résultats business et ajuste les orientations stratégiques. Sans cette vision macro, on risque de s'activer sans progresser vers les vrais objectifs.

---

## Vue d'Ensemble

| Aspect | Détail |
|--------|--------|
| **Objectif** | Évaluer la santé globale, mesurer la progression vers les outcomes, ajuster la stratégie |
| **Cadence** | Tous les 3 mois (fin Q1, Q2, Q3, Q4) |
| **Durée** | 2h30 (pas plus) |
| **Facilitateur** | Product Manager |
| **Participants** | PM, Tech Lead, PE(s), QA, Stakeholders clés |

---

## Métriques Stratégiques

### Métriques de niveau outcome

| Métrique | Description | Source | Fréquence calcul |
|----------|-------------|--------|------------------|
| Progression outcome | % d'atteinte de la cible | PRD / Analytics | Mensuel |
| Vélocité trend | Évolution features/mois sur 3 mois | Board | Mensuel |
| Qualité trend | Évolution bugs/incidents sur 3 mois | Monitoring | Mensuel |
| ROI AIAD | Gain de productivité vs avant | Estimation | Trimestriel |

### Template de collecte

```markdown
## Données Trimestrielles à Collecter

### Outcomes (par outcome défini dans le PRD)
| Outcome | Début Q | Fin Q | Cible Q | Cible Annuelle | Status |
|---------|---------|-------|---------|----------------|--------|
| [O1] | | | | | |
| [O2] | | | | | |

### Vélocité
| Mois | Features | Cycle Time | Prévisibilité |
|------|----------|------------|---------------|
| M1 | | | |
| M2 | | | |
| M3 | | | |

### Qualité
| Mois | Bugs Prod | Incidents | Couverture | Uptime |
|------|-----------|-----------|------------|--------|
| M1 | | | | |
| M2 | | | | |
| M3 | | | | |

### Dette Technique
- Début trimestre : ___ jours
- Fin trimestre : ___ jours
- Remboursement effectué : ___ jours
```

---

## Comparaison Avant/Après AIAD

### Métriques de référence

Mesurer l'impact de l'adoption AIAD nécessite une baseline.

| Métrique | Avant AIAD | Après AIAD (Q actuel) | Δ |
|----------|------------|----------------------|---|
| Cycle time moyen | ___j | ___j | __% |
| Features/mois/dev | ___ | ___ | __% |
| Bugs en prod/mois | ___ | ___ | __% |
| Time to first PR | ___j | ___j | __% |
| Taux de rework | ___% | ___% | __% |

### Calcul du ROI simplifié

```markdown
## ROI AIAD - Q[X]

### Gains
- Temps économisé : [X] jours × [Y] €/jour = [Z] €
  - Base: Features/mois passé de [A] à [B] = +[C]%
  - Cycle time réduit de [X]j à [Y]j = -[Z]%

### Coûts
- Licences agents IA : [X] €/mois × 3 = [Y] €
- Temps formation : [X] jours × [Y] €/jour = [Z] €
- Overhead process : [estimation] €

### ROI
- Gains - Coûts = [X] €
- ROI % = (Gains - Coûts) / Coûts × 100 = [Y]%
```

---

## Identification des Tendances

### Analyse des patterns

Questions à se poser :

| Domaine | Questions | Indicateurs |
|---------|-----------|-------------|
| Vélocité | Accélère-t-on ? Stagne-t-on ? | Trend 3 mois features/cycle time |
| Qualité | Dégrade-t-on ? Stabilise-t-on ? | Trend bugs/incidents |
| Équipe | Fatigue ? Montée en compétence ? | Feedback + vélocité individuelle |
| Process | AIAD fonctionne-t-il ? Frictions ? | Retros + blocages récurrents |

### Template d'analyse

```markdown
## Analyse des Tendances Q[X]

### Vélocité
- **Observation** : [Ce que montrent les données]
- **Hypothèse** : [Pourquoi ce trend]
- **Action** : [Ce qu'on fait]

### Qualité
- **Observation** : [Ce que montrent les données]
- **Hypothèse** : [Pourquoi ce trend]
- **Action** : [Ce qu'on fait]

### Process AIAD
- **Ce qui fonctionne** : [Points positifs]
- **Ce qui frotte** : [Points de friction]
- **Adaptations proposées** : [Changements à tester]
```

---

## Décisions de Pivot ou Ajustement

### Framework de décision

| Signal | Seuil | Décision type |
|--------|-------|---------------|
| Outcome très en retard | < 50% progression à mi-année | Pivot ou abandon |
| Vélocité en chute | -30% sur 2 mois | Investigation urgente |
| Qualité dégradée | +100% bugs | Stop feature, focus qualité |
| Équipe en souffrance | Feedback négatif récurrent | Réduction scope |

### Questions clés à trancher

```markdown
## Décisions Trimestrielles

### Sur les Outcomes
- [ ] Les cibles annuelles sont-elles encore atteignables ?
- [ ] Faut-il ajuster les cibles (hausse ou baisse) ?
- [ ] Y a-t-il un outcome à abandonner ?
- [ ] Un nouvel outcome doit-il être ajouté ?

### Sur la Roadmap
- [ ] Quelles initiatives prioriser Q+1 ?
- [ ] Quelles initiatives reporter/abandonner ?
- [ ] Quel budget pour la dette technique ?

### Sur l'Équipe
- [ ] La composition est-elle adaptée ?
- [ ] Des recrutements sont-ils nécessaires ?
- [ ] Des formations sont-elles requises ?

### Sur le Process
- [ ] AIAD fonctionne-t-il pour ce contexte ?
- [ ] Quelles adaptations tester Q+1 ?
```

---

## Communication aux Stakeholders

### Format exécutif (1 page)

```markdown
# Bilan Trimestriel Q[X] 2026

## En Bref
[2-3 phrases : état global, points saillants, orientation]

## Santé : [🟢/🟡/🔴]

## Outcomes

| Outcome | Progression | Confiance annuelle |
|---------|-------------|-------------------|
| [O1] | __% | Haute/Moyenne/Basse |
| [O2] | __% | Haute/Moyenne/Basse |

## Chiffres Clés

| Métrique | Valeur | vs Q-1 |
|----------|--------|--------|
| Features livrées | [X] | [+/-Y%] |
| Cycle Time | [X]j | [+/-Y%] |
| Bugs prod | [X] | [+/-Y%] |

## Réalisations Majeures
- ✅ [Réalisation 1]
- ✅ [Réalisation 2]

## Risques
- ⚠️ [Risque 1 et mitigation]

## Focus Q+1
1. [Priorité 1]
2. [Priorité 2]
3. [Priorité 3]

---
*Contact : [PM] | Détails : [lien document complet]*
```

### Niveaux de communication

| Audience | Format | Fréquence | Contenu |
|----------|--------|-----------|---------|
| Direction | 1 page exécutive | Trimestriel | Outcomes, ROI, risques |
| Stakeholders produit | Présentation 15 min | Trimestriel | Features, roadmap, feedback |
| Équipe élargie | Email + dashboard | Trimestriel | Célébration + orientations |

---

## Exemples Pratiques

### Exemple 1 : Startup early-stage

**Contexte** : Équipe de 4, product-market fit en cours

**Revue simplifiée (1h30)** :
1. Outcomes utilisateurs (30 min) - Les métriques d'engagement progressent-elles ?
2. Vélocité (20 min) - Livre-t-on assez vite pour itérer ?
3. Décisions (30 min) - Pivot ? Persévérer ? Ajuster ?
4. Actions (10 min)

**Focus métriques** :
- 1-2 outcomes max (engagement, rétention)
- Cycle time
- Feedback utilisateurs qualitatif

### Exemple 2 : Scale-up avec plusieurs squads

**Contexte** : 3 squads, 15 personnes, multiple products

**Revue structurée (2h30)** :
1. Vue consolidée (20 min) - Santé globale
2. Deep-dive par squad (45 min) - Outcomes spécifiques
3. Cross-squad (30 min) - Dépendances, mutualisations
4. Technique (20 min) - Architecture, dette
5. Orientations (25 min) - Priorisation globale
6. Actions (10 min)

**Spécificités** :
- Dashboard par squad + consolidé
- Comparaison inter-squads (avec bienveillance)
- Alignement sur les priorités cross

### Exemple 3 : Équipe en contexte réglementé

**Contexte** : Fintech, contraintes compliance fortes

**Revue avec volet conformité (2h30)** :
1. Outcomes business (30 min)
2. Compliance check (20 min) - Audits, écarts, remédiation
3. Sécurité (15 min) - Vulnérabilités, incidents
4. Opérationnel (30 min)
5. Technique (20 min)
6. Orientations (25 min)
7. Actions (10 min)

**Métriques spécifiques** :
- Couverture audits
- Temps résolution vulnérabilités
- Incidents de sécurité

---

## Anti-patterns

### ❌ Revue "théâtre"

```
❌ Présentation PowerPoint de 50 slides
   Tout le monde regarde son téléphone
   Aucune décision prise

✅ Discussion structurée autour de données
   Participation active
   Décisions documentées avec owners
```

### ❌ Focus uniquement sur les outputs

```
❌ "On a livré 15 features ce trimestre !"
   Mais aucun outcome n'a progressé

✅ "On a livré 12 features, l'engagement a progressé de 20%"
   Les features servent les outcomes
```

### ❌ Pas de suite aux décisions

```
❌ "On avait dit qu'on réduirait la dette..."
   3 mois plus tard, rien n'a changé

✅ Actions avec owners et deadlines
   Suivi à mi-trimestre
   Rappel en début de prochaine revue
```

### ❌ Blame game

```
❌ "Le trimestre a échoué parce que [équipe/personne]..."
   Ambiance toxique, aucun apprentissage

✅ "Voici ce qui n'a pas fonctionné et ce qu'on apprend"
   Analyse systémique, pas personnelle
```

---

## Template Complet de Revue

### Agenda (2h30)

| Bloc | Durée | Contenu | Responsable |
|------|-------|---------|-------------|
| 1 | 10 min | Check-in + contexte | PM |
| 2 | 30 min | Revue des Outcomes | PM |
| 3 | 25 min | Revue Opérationnelle | PE lead |
| 4 | 20 min | Revue Technique | Tech Lead |
| 5 | 20 min | Retours Équipe | Tous |
| 6 | 30 min | Orientations Q+1 | PM + Direction |
| 7 | 15 min | Actions et Clôture | PM |

### Bloc 1 : Check-in (10 min)

```markdown
## Check-in
Tour de table en 1 phrase : "Mon sentiment sur ce trimestre"

## Contexte Business
(PM, 5 min)
- Événements marquants
- Changements de contexte
- Ce qui a impacté le produit
```

### Bloc 2 : Revue des Outcomes (30 min)

```markdown
## Outcome : [Nom]

### Progression
| Début Q | Fin Q | Cible Q | Cible Annuelle |
|---------|-------|---------|----------------|
| [X] | [Y] | [Z] | [W] |

### Analyse
- **Atteint ?** Oui / Partiellement / Non
- **Facteurs positifs** : [Ce qui a contribué]
- **Obstacles** : [Ce qui a freiné]
- **Learnings** : [Ce qu'on retient]

### Projection
- Cible annuelle réaliste : Oui / Non
- Ajustement proposé : [Si applicable]
```

### Bloc 3 : Revue Opérationnelle (25 min)

```markdown
## Vélocité

| Métrique | M1 | M2 | M3 | Trend |
|----------|----|----|-----|-------|
| Features | | | | |
| Cycle Time | | | | |
| Prévisibilité | | | | |

## Qualité

| Métrique | Valeur Q | vs Q-1 | Status |
|----------|----------|--------|--------|
| Bugs prod | | | |
| Incidents | | | |
| Couverture | | | |

## Process AIAD
- **Fonctionne bien** : [Points positifs]
- **À améliorer** : [Frictions identifiées]
```

### Bloc 4 : Revue Technique (20 min)

```markdown
## Dette Technique

| Métrique | Début Q | Fin Q | Δ |
|----------|---------|-------|---|
| Dette estimée | [X]j | [Y]j | |
| Items critiques | | | |

## Architecture
- ADR majeurs ce trimestre : [Liste]
- Risques techniques : [Liste]

## Agents IA
- Qualité code généré : [Score /5]
- Améliorations AGENT-GUIDE : [Liste]
```

### Bloc 5 : Retours Équipe (20 min)

```markdown
## Tour de Table

Chaque membre partage :
- 1 fierté du trimestre
- 1 frustration
- 1 suggestion

## Thèmes Récurrents
- [Thème 1] (mentionné par X personnes)
- [Thème 2] (mentionné par X personnes)
```

### Bloc 6 : Orientations Q+1 (30 min)

```markdown
## Contexte Stratégique
(Input direction)
- Priorités business
- Contraintes
- Opportunités

## Propositions

### Outcomes Q+1
| Outcome | Cible | Justification |
|---------|-------|---------------|
| | | |

### Initiatives Majeures
1. [Initiative] - Effort: __, Impact: __
2. [Initiative] - Effort: __, Impact: __

### Budget Dette
- % temps alloué : __
- Focus : [Zones prioritaires]
```

### Bloc 7 : Actions et Clôture (15 min)

```markdown
## Actions Décidées

| Action | Owner | Deadline |
|--------|-------|----------|
| | | |

## Suivi
- Review mi-trimestre : [Date]
- Prochaine revue : [Date]

## Feedback sur la session
- Format : [OK / À améliorer]
- Durée : [OK / Trop long / Trop court]
```

---

## Checklist Facilitateur

```markdown
## 1 Semaine Avant
- [ ] Données collectées et dashboard préparé
- [ ] Agenda envoyé aux participants
- [ ] Input demandé à chacun (fierté/frustration/suggestion)
- [ ] Salle/visio réservée
- [ ] Temps bloqué chez les participants

## Jour J
- [ ] Support prêt (dashboard, template notes)
- [ ] Timer configuré pour chaque bloc
- [ ] Prise de notes en temps réel
- [ ] Actions documentées avec owners pendant la session

## Après (< 48h)
- [ ] Compte-rendu rédigé et partagé
- [ ] Actions créées dans l'outil de suivi
- [ ] Date prochaine revue calendrier
- [ ] Feedback collecté sur le format
```

---

## Checklist Qualité Revue

```markdown
## Préparation
- [ ] Données factuelles collectées (pas d'estimation au doigt mouillé)
- [ ] Tous les participants ont préparé leur input
- [ ] Stakeholders clés présents ou représentés

## Déroulement
- [ ] Temps respecté pour chaque bloc
- [ ] Tout le monde a pu s'exprimer
- [ ] Discussions factuelles, pas de blame
- [ ] Décisions prises et documentées

## Outputs
- [ ] Orientations Q+1 validées
- [ ] Actions avec owners et deadlines
- [ ] Compte-rendu partagé
- [ ] Suivi planifié
```

---

*Voir aussi : [E.1 Exemples de Dashboards](E1-exemples-dashboards.md) | [D.1 Alignment Stratégique](D1-alignment-strategique.md) | [D.4 Rétrospective](D4-retrospective.md)*
