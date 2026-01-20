# D.1 Alignment Stratégique

## Pourquoi cette annexe ?

L'Alignment Stratégique est le moment où l'équipe prend les décisions qui comptent. Sans structure, il devient un status meeting où chacun récite ce qu'il a fait. Avec cette annexe, vous transformez 45 minutes en décisions actionnables qui font avancer le produit.

---

## Préparation par Rôle

Chaque participant arrive préparé. Pas de préparation = pas de décision.

| Rôle | Préparation Requise | Livrable |
|------|---------------------|----------|
| **PM** | Mettre à jour les métriques, identifier 2-3 décisions à prendre | Agenda envoyé J-1 |
| **Tech Lead** | Préparer le status technique, risques identifiés | Points techniques listés |
| **PE** | Mettre à jour le status des SPECs en cours | Blocages remontés |
| **Stakeholders** | Lire l'agenda, préparer les questions | Présence confirmée |

### Template de Préparation PM

```markdown
## Prep Alignment - [Date]

### Métriques à Jour
- [ ] Dashboard outcomes actualisé
- [ ] Métriques des features récentes disponibles

### Décisions à Prendre
1. [Décision 1] : Contexte en 1 phrase, options identifiées
2. [Décision 2] : Contexte en 1 phrase, options identifiées

### Questions pour l'Équipe
- [Question 1]
- [Question 2]

### Agenda Envoyé
- [ ] Ordre du jour envoyé à [heure] la veille
```

---

## Ordre du Jour Type

**Durée totale : 45 minutes**

```
┌─────────────────────────────────────────────────┐
│ 1. OUTCOMES (10 min)                            │
│    Où en est-on par rapport aux objectifs ?     │
├─────────────────────────────────────────────────┤
│ 2. DÉCISIONS (20 min)                           │
│    Quelles décisions doivent être prises ?      │
├─────────────────────────────────────────────────┤
│ 3. PRIORITÉS (10 min)                           │
│    Faut-il ajuster le backlog ?                 │
├─────────────────────────────────────────────────┤
│ 4. ACTIONS (5 min)                              │
│    Qui fait quoi pour quand ?                   │
└─────────────────────────────────────────────────┘
```

### Template Complet

```markdown
# Alignment Stratégique - [Date]

## Participants
- [ ] PM (facilite)
- [ ] Tech Lead
- [ ] PE(s)
- [ ] [Stakeholder si sujet spécifique]

---

## 1. Review des Outcomes (10 min)

| Outcome | Cible | Actuel | Δ | Status |
|---------|-------|--------|---|--------|
| [Nom] | [X] | [Y] | [+/-Z] | 🟢/🟡/🔴 |
| [Nom] | [X] | [Y] | [+/-Z] | 🟢/🟡/🔴 |

**Analyse rapide** : [1-2 phrases sur les tendances]

---

## 2. Décisions à Prendre (20 min)

### Décision 1 : [Titre]

**Contexte** : [Situation en 2 phrases max]

| Option | Pour | Contre |
|--------|------|--------|
| A : [Nom] | [Avantages] | [Inconvénients] |
| B : [Nom] | [Avantages] | [Inconvénients] |

**Recommandation** : [Option X] parce que [raison]

**Décision** : _______________
**Owner** : _______________

### Décision 2 : [Titre]
[Même structure]

---

## 3. Ajustement des Priorités (10 min)

### Backlog Actuel
| Rang | SPEC | Status | Commentaire |
|------|------|--------|-------------|
| P0 | SPEC-XXX | [Status] | - |
| P0 | SPEC-XXX | [Status] | - |
| P1 | SPEC-XXX | [Status] | - |

### Changements
- [ ] Aucun changement
- [ ] [SPEC-XXX] passe de P1 à P0 : [Raison]
- [ ] [SPEC-XXX] reportée : [Raison]

---

## 4. Actions (5 min)

| Action | Owner | Deadline |
|--------|-------|----------|
| [Action] | [Nom] | [Date] |
| [Action] | [Nom] | [Date] |

---

## Risques et Blocages Évoqués

| Item | Type | Action | Owner |
|------|------|--------|-------|
| [Item] | Risque/Blocage | [Action] | [Nom] |

---

Fin : [Heure] | Durée réelle : [X] min
Prochaine session : [Date]
```

---

## Exemples Pratiques

### Exemple 1 : Priorisation Entre Features

```markdown
### Décision : Export CSV vs Dark Mode

**Contexte** : Capacité pour une seule feature cette semaine.
Export CSV demandé par 3 clients enterprise (€45k ARR).
Dark mode : 200 votes sur le feedback portal.

| Option | Pour | Contre |
|--------|------|--------|
| Export CSV | Revenus immédiats, clients en attente | Impact utilisateurs limité |
| Dark mode | Large audience, satisfaction | Pas de revenu direct |

**Recommandation** : Export CSV - impact business mesurable, clients en attente.

**Décision** : Export CSV cette semaine. Dark mode sprint suivant.
**Owner** : PM (comm clients) + PE (implémentation)
```

### Exemple 2 : Scope Cut sous Contrainte

```markdown
### Décision : Réduction Scope SPEC-042

**Contexte** : SPEC-042 (notifications) estimée 2 semaines.
Deadline client dans 1 semaine. Pas de négociation possible.

| Option | Pour | Contre |
|--------|------|--------|
| Scope complet | Feature complète | Deadline ratée |
| MVP email only | Deadline tenue | Pas de push/in-app |
| Reporter | Qualité préservée | Client déçu, risque churn |

**Recommandation** : MVP email. Push/in-app en v2 (SPEC-042b).

**Décision** : MVP accepté. SPEC-042 réduite, SPEC-042b créée.
**Owner** : PM (update specs + comm) + PE (implémentation)
```

### Exemple 3 : Pivot Technique

```markdown
### Décision : Migration Redux → Zustand

**Contexte** : Performance dégradée sur grandes listes.
Redux identifié comme bottleneck. Migration estimée 3 jours.

| Option | Pour | Contre |
|--------|------|--------|
| Migrer maintenant | Résout le problème, code simplifié | 3 jours sans feature |
| Optimiser Redux | Pas de migration | Patch temporaire |
| Reporter | Features continuent | Problème persiste, UX dégradée |

**Recommandation** : Migrer maintenant. Le problème va empirer.

**Décision** : Migration cette semaine. Stakeholders informés.
**Owner** : Tech Lead (architecture) + PE (implémentation)
```

---

## Prise de Décision Efficace

### Framework RAPID Simplifié

Pour chaque décision importante :

| Rôle | Responsabilité | Qui |
|------|----------------|-----|
| **Recommande** | Propose une option argumentée | PM ou Tech Lead |
| **Approuve** | Valide ou ajuste | Stakeholder ou PM |
| **Décide** | Tranche si désaccord | PM (product) ou TL (technique) |

### Règles de Décision

1. **Pas d'info, pas de décision** : Si les données manquent, l'action est d'aller les chercher
2. **Décision > Consensus** : Mieux vaut une décision imparfaite qu'une non-décision parfaite
3. **Owner obligatoire** : Chaque décision a un responsable nommé
4. **Réversibilité** : Préciser si la décision est réversible facilement ou non

### Template de Décision Rapide

```markdown
**[Titre]**
- Décision : [Ce qu'on fait]
- Owner : [Qui]
- Deadline : [Quand]
- Réversible : Oui/Non
```

---

## Anti-patterns

### 1. Le Status Meeting

**Symptôme** : Tour de table sans décision

```
❌ "Qu'est-ce que chacun a fait cette semaine ?"
   → 40 minutes de monologue, 0 décision
```

**Solution** : Status partagé en amont, focus sur les décisions

```
✅ Status envoyé J-1, réunion = décisions et blocages uniquement
```

### 2. Le Deep Dive Technique

**Symptôme** : 30 minutes sur un détail d'implémentation

```
❌ "Comment on va structurer le state manager ?"
   → Discussion architecture en plein alignment
```

**Solution** : Timeboxer et reporter

```
✅ "Sujet technique. Tech Lead, tu organises une session dédiée ?"
```

### 3. Le One-Man Show

**Symptôme** : Seul le PM parle

```
❌ Présentation PowerPoint de 30 minutes
```

**Solution** : Solliciter les inputs

```
✅ "Tech Lead, ton avis sur cette priorité ?"
✅ "PE, des blocages à signaler ?"
```

### 4. Le Sans Décision

**Symptôme** : Discussion sans conclusion

```
❌ "On en reparle la semaine prochaine"
   → Sujet reporté 4 fois de suite
```

**Solution** : Forcer la décision ou l'action

```
✅ "On décide maintenant, ou on définit qui collecte les infos pour quand"
```

### 5. Le Sans Données

**Symptôme** : Décisions basées sur des opinions

```
❌ "Je pense que les utilisateurs préfèrent..."
```

**Solution** : Données d'abord

```
✅ "Qu'est-ce que les métriques/feedback disent ?"
✅ Si pas de données : "Action = collecter les données"
```

---

## Compte-Rendu Type

À envoyer dans les 2 heures suivant la session.

```markdown
# Compte-Rendu Alignment - [Date]

## Décisions Prises

| # | Décision | Owner | Deadline |
|---|----------|-------|----------|
| 1 | [Décision] | [Nom] | [Date] |
| 2 | [Décision] | [Nom] | [Date] |

## Actions

| # | Action | Owner | Deadline |
|---|--------|-------|----------|
| 1 | [Action] | [Nom] | [Date] |
| 2 | [Action] | [Nom] | [Date] |

## Priorités Mises à Jour
- [SPEC-XXX] : [Changement]

## Points Reportés
- [Sujet] → Prochaine session

---

Envoyé par [PM] le [Date] à [Heure]
```

---

## Checklist

```markdown
## Checklist Alignment Stratégique

### Avant (J-1)
- [ ] Métriques outcomes à jour
- [ ] Décisions à prendre identifiées (2-3 max)
- [ ] Agenda envoyé à tous les participants
- [ ] Salle/visio réservée

### Pendant
- [ ] Démarrer à l'heure
- [ ] Timeboxer chaque section
- [ ] Chaque décision a un owner et une deadline
- [ ] Notes prises en direct
- [ ] Solliciter tous les participants

### Après (< 2h)
- [ ] Compte-rendu envoyé
- [ ] Actions ajoutées au board/outil de suivi
- [ ] Décisions communiquées aux absents concernés
- [ ] SPECs mises à jour si nécessaire
```

---

*Annexes connexes : [D.2 Demo & Feedback](./D2-demo-feedback.md) · [D.4 Rétrospective](./D4-retrospective.md)*
