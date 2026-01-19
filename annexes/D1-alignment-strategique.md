# D.1 Alignment Stratégique - Détails

## Pourquoi cette annexe ?

Cette annexe fournit le template d'ordre du jour, des exemples de décisions et des bonnes pratiques pour conduire un Alignment Stratégique efficace.

---

## Vue d'Ensemble

### Objectif
Aligner l'équipe sur les priorités et les outcomes. Prendre les décisions stratégiques qui impactent la direction du produit.

### Cadence Recommandée
Hebdomadaire ou bi-hebdomadaire selon la maturité du projet.

### Durée
30 à 60 minutes.

### Participants
- Product Manager (facilite)
- Tech Lead
- Product Engineer(s)
- Stakeholders clés (optionnel, selon les sujets)

---

## Template d'Ordre du Jour

```markdown
# Alignment Stratégique - [Date]

## Durée Prévue : [X] minutes

---

## 1. Review des Outcomes (10-15 min)

### Outcome 1 : [Nom]
- **Cible** : [Métrique cible]
- **Actuel** : [Valeur actuelle]
- **Tendance** : 🟢 En bonne voie / 🟡 À surveiller / 🔴 En danger
- **Analyse** : [Explication si nécessaire]

### Outcome 2 : [Nom]
- **Cible** : [Métrique cible]
- **Actuel** : [Valeur actuelle]
- **Tendance** : 🟢/🟡/🔴
- **Analyse** : [Explication si nécessaire]

---

## 2. Décisions à Prendre (15-20 min)

### Décision 1 : [Titre]
**Contexte** : [Situation qui nécessite une décision]

**Options** :
| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| A | [...] | [...] |
| B | [...] | [...] |

**Recommandation PM** : [Option X parce que...]

**Décision** : [À remplir]
**Owner** : [Nom]

### Décision 2 : [Titre]
[Même structure]

---

## 3. Ajustement des Priorités (10-15 min)

### Backlog Actuel
| Priorité | SPEC | Status | Commentaire |
|----------|------|--------|-------------|
| P0 | SPEC-042 | In Progress | - |
| P0 | SPEC-043 | Ready | - |
| P1 | SPEC-044 | Draft | Besoin review Tech Lead |

### Changements Proposés
- [Changement 1] : [Justification]
- [Changement 2] : [Justification]

---

## 4. Risques et Blocages (5-10 min)

### Risques Identifiés
| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| [Risque 1] | [H/M/L] | [H/M/L] | [Action] |

### Blocages Actuels
| Blocage | Owner | Status | ETA |
|---------|-------|--------|-----|
| [Blocage 1] | [Nom] | [Status] | [Date] |

---

## 5. Actions et Next Steps (5 min)

| Action | Owner | Deadline |
|--------|-------|----------|
| [Action 1] | [Nom] | [Date] |
| [Action 2] | [Nom] | [Date] |

---

## Notes

[Autres points discutés]
```

---

## Exemples de Décisions

### Exemple 1 : Priorisation de Feature

```markdown
### Décision : Priorisation Feature A vs Feature B

**Contexte** :
Deux features prêtes à développer, capacité pour une seule cette semaine.
- Feature A : Export CSV demandé par 3 clients enterprise
- Feature B : Dark mode demandé par la communauté

**Options** :
| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| Feature A | Revenus immédiats, clients satisfaits | Impact utilisateurs limité |
| Feature B | Large audience, améliore satisfaction | Pas de revenu direct |

**Recommandation PM** : Feature A car impact business mesurable et clients en attente depuis 2 semaines.

**Décision** : Feature A cette semaine, Feature B la semaine suivante.
**Owner** : PM (communication aux clients), PE (implémentation)
```

### Exemple 2 : Pivot Technique

```markdown
### Décision : Migration de Redux vers Zustand

**Contexte** :
Performance dégradée sur les grandes listes. Redux identifié comme goulot d'étranglement.
Migration estimée à 3 jours.

**Options** :
| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| Migrer maintenant | Résout le problème, code plus simple | 3 jours sans feature |
| Optimiser Redux | Pas de migration | Patch temporaire, re-travail probable |
| Reporter | Features continuent | Problème persiste |

**Recommandation Tech Lead** : Migrer maintenant. Le problème va empirer et impacte l'UX.

**Décision** : Migration cette semaine. Communiquer aux stakeholders le délai.
**Owner** : Tech Lead (architecture), PE (implémentation)
```

### Exemple 3 : Scope Cut

```markdown
### Décision : Réduction du Scope SPEC-042

**Contexte** :
SPEC-042 (système de notifications) estimée à 2 semaines.
Deadline client dans 1 semaine.

**Options** :
| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| Scope complet | Feature complète | Deadline ratée |
| MVP (email only) | Deadline tenue | Pas de push/in-app |
| Reporter | Qualité préservée | Client déçu |

**Recommandation PM** : MVP avec email uniquement. Push et in-app en v2.

**Décision** : MVP. SPEC-042 réduite, SPEC-042b créée pour la suite.
**Owner** : PM (SPEC update), PE (implémentation)
```

---

## Métriques à Présenter

### Dashboard Outcomes

```markdown
## Dashboard - Semaine [N]

### Outcomes Principaux
| Outcome | Métrique | Cible | Actuel | Δ Semaine | Status |
|---------|----------|-------|--------|-----------|--------|
| Engagement | Sessions/user/semaine | 3.0 | 2.4 | +0.2 | 🟡 |
| Conversion | Trial→Paid % | 8% | 7.2% | +0.5% | 🟢 |
| Rétention | M1 Retention | 70% | 65% | +2% | 🟡 |

### Proxy Metrics (Features Récentes)
| Feature | Métrique | Attendu | Actuel |
|---------|----------|---------|--------|
| Task Filter | Usage/jour | 40% | 35% |
| Bulk Edit | Usage/semaine | 20% | 25% |
```

### Visualisation Tendance

```
Engagement (sessions/user/semaine)
Target: 3.0
───────────────────────────────────── 3.0
                                    ╱
                               ╱───╱
                          ╱───╱
                     ╱───╱
                ╱───╱
           ╱───╱
      ╱───╱
 ╱───╱
───────────────────────────────────── 2.0
S1   S2   S3   S4   S5   S6   S7   S8
```

---

## Bonnes Pratiques

### Préparation

| Responsable | Préparation |
|-------------|-------------|
| PM | Préparer les métriques, identifier les décisions à prendre |
| Tech Lead | Préparer le status technique, risques identifiés |
| PE | Mettre à jour le status des SPECs en cours |

### Pendant la Réunion

1. **Time-boxé** : Chaque section a un temps alloué
2. **Décisions actionnables** : Sortir avec des owners et deadlines
3. **Pas de résolution technique** : Si discussion technique longue, planifier une session dédiée

### Après la Réunion

```markdown
## Compte-Rendu Alignment - [Date]

### Décisions Prises
1. [Décision 1] - Owner: [Nom]
2. [Décision 2] - Owner: [Nom]

### Actions
| Action | Owner | Deadline |
|--------|-------|----------|
| [Action 1] | [Nom] | [Date] |

### À Suivre
- [Point à revoir à la prochaine session]

Compte-rendu partagé le [Date] par [PM]
```

---

## Anti-patterns

### 1. "Le Status Meeting"

**Symptôme** : Tour de table de status sans décision
```
❌ "Qu'est-ce que chacun a fait cette semaine ?"
```

**Solution** : Focus sur les décisions et les outcomes
```
✅ Status partagé en amont
✅ Réunion centrée sur décisions et blocages
```

### 2. "Le Deep Dive Technique"

**Symptôme** : 30 minutes sur un détail d'implémentation
```
❌ Discussion architecture pendant l'alignment
```

**Solution** : Timeboxer et reporter
```
✅ "Ce sujet nécessite une session dédiée. Tech Lead, tu peux organiser ?"
```

### 3. "Le One-Man Show"

**Symptôme** : Seul le PM parle
```
❌ Présentation sans interaction
```

**Solution** : Solliciter les inputs
```
✅ "Tech Lead, quel est ton avis sur cette priorité ?"
✅ "PE, des blocages à signaler ?"
```

### 4. "Le Sans Décision"

**Symptôme** : Discussion sans conclusion
```
❌ "On en reparle la semaine prochaine"
```

**Solution** : Forcer la décision ou l'action
```
✅ "Décision : [X]. Si pas possible aujourd'hui : qui collecte les infos manquantes pour quand ?"
```

---

## Checklist de Facilitation

```markdown
## Checklist PM - Alignment Stratégique

### Avant (J-1)
- [ ] Métriques à jour
- [ ] Décisions à prendre identifiées
- [ ] Ordre du jour envoyé

### Pendant
- [ ] Commencer à l'heure
- [ ] Timeboxer chaque section
- [ ] Noter les décisions et actions
- [ ] Solliciter tous les participants

### Après
- [ ] Compte-rendu envoyé (< 2h)
- [ ] Actions trackées
- [ ] Décisions communiquées aux absents
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
