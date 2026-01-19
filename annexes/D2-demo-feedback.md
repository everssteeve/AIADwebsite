# D.2 Demo & Feedback - Détails

## Pourquoi cette annexe ?

Cette annexe fournit des questions types pour collecter du feedback utile lors des démonstrations, et des bonnes pratiques pour rendre ces sessions productives.

---

## Vue d'Ensemble

### Objectif
Montrer le travail accompli, collecter du feedback utilisateur/stakeholder, et valider que les outputs répondent aux besoins.

### Cadence Recommandée
À chaque output significatif livré, ou hebdomadaire si flux continu.

### Durée
15 à 30 minutes.

### Participants
- Product Engineer (démontre)
- Product Manager (facilite et collecte le feedback)
- Stakeholders / Utilisateurs (donnent le feedback)
- Tech Lead (optionnel)

---

## Structure d'une Demo

### Format Recommandé

```
┌─────────────────────────────────────────────────┐
│ 1. CONTEXTE (2 min)                             │
│    - Rappel de l'objectif                       │
│    - Ce qui va être montré                      │
├─────────────────────────────────────────────────┤
│ 2. DÉMONSTRATION (10-15 min)                    │
│    - Parcours utilisateur principal             │
│    - Cas d'usage clés                           │
│    - (Pas de deep dive technique)               │
├─────────────────────────────────────────────────┤
│ 3. QUESTIONS & FEEDBACK (10-15 min)             │
│    - Questions ouvertes                         │
│    - Collecte structurée                        │
├─────────────────────────────────────────────────┤
│ 4. WRAP-UP (2 min)                              │
│    - Récap du feedback                          │
│    - Prochaines étapes                          │
└─────────────────────────────────────────────────┘
```

---

## Questions Types par Catégorie

### Compréhension et Utilité

```markdown
## Questions - Compréhension

1. "Est-ce que c'est clair comment utiliser cette fonctionnalité ?"
   - Si non : "Qu'est-ce qui n'est pas clair ?"

2. "Est-ce que ça répond au problème qu'on essayait de résoudre ?"
   - Si partiellement : "Qu'est-ce qui manque ?"

3. "Sur une échelle de 1-5, à quel point cette feature est utile pour vous ?"
   - Follow-up : "Qu'est-ce qui la rendrait plus utile ?"
```

### Expérience Utilisateur

```markdown
## Questions - UX

1. "Comment trouvez-vous le parcours pour [action] ?"
   - "Y a-t-il des étapes qui semblent inutiles ?"
   - "Quelque chose vous a surpris ?"

2. "Si vous deviez faire cette action 10 fois par jour, qu'est-ce qui vous gênerait ?"

3. "Qu'est-ce que vous chercheriez en premier sur cet écran ?"
   - Valide la hiérarchie visuelle

4. "Les messages d'erreur sont-ils clairs ?" (si applicable)
```

### Cas d'Usage

```markdown
## Questions - Cas d'Usage

1. "Dans quelle situation utiliseriez-vous cette fonctionnalité ?"
   - Valide qu'on a bien compris le besoin

2. "Y a-t-il des cas où cette feature ne fonctionnerait pas pour vous ?"
   - Identifie les edge cases manqués

3. "Comment faisiez-vous avant ? Est-ce que c'est mieux ?"
   - Compare avec l'existant
```

### Priorités et Améliorations

```markdown
## Questions - Améliorations

1. "Si vous pouviez changer UNE chose, ce serait quoi ?"
   - Force la priorisation

2. "Qu'est-ce qui manque pour que ce soit vraiment utile ?"
   - Identifie les gaps

3. "Y a-t-il quelque chose qu'on devrait enlever ?"
   - Identifie la complexité inutile
```

### Questions Quantitatives

```markdown
## Questions - Quantitatif

1. "De 1 à 10, quelle est la probabilité que vous utilisiez cette feature ?"
   □ 1-3 : Peu probable → Pourquoi ?
   □ 4-6 : Peut-être → Qu'est-ce qui vous ferait passer à 8+ ?
   □ 7-10 : Très probable → Super, qu'est-ce qui vous plaît ?

2. "Combien de temps pensez-vous gagner avec cette feature ?"
   - Valide la proposition de valeur

3. "À quelle fréquence utiliseriez-vous cette fonctionnalité ?"
   □ Quotidienne
   □ Hebdomadaire
   □ Mensuelle
   □ Rarement
```

---

## Template de Collecte de Feedback

```markdown
# Feedback Demo - [Feature] - [Date]

## Participants
- [Nom] - [Rôle]
- [Nom] - [Rôle]

## Résumé Global
**Réception** : 🟢 Positive / 🟡 Mitigée / 🔴 Négative

**Points Forts**
- [Ce qui a été apprécié]
- [Ce qui a été apprécié]

**Points à Améliorer**
- [Feedback négatif/suggestion]
- [Feedback négatif/suggestion]

## Feedback Détaillé

### [Participant 1]
| Question | Réponse |
|----------|---------|
| Utilité (1-5) | [X] |
| Principal feedback | [Verbatim] |
| Suggestion | [Verbatim] |

### [Participant 2]
| Question | Réponse |
|----------|---------|
| Utilité (1-5) | [X] |
| Principal feedback | [Verbatim] |
| Suggestion | [Verbatim] |

## Actions Identifiées

| Action | Priorité | Owner |
|--------|----------|-------|
| [Action issue du feedback] | [P0/P1/P2] | [Nom] |
| [Action issue du feedback] | [P0/P1/P2] | [Nom] |

## Décisions

- [Décision prise suite au feedback]
- [Ce qu'on ne fait PAS et pourquoi]
```

---

## Bonnes Pratiques

### Préparation de la Demo

```markdown
## Checklist Pré-Demo

### Contenu
- [ ] Scénario de démo préparé
- [ ] Données de test réalistes
- [ ] Environnement stable (staging ou local propre)

### Logistique
- [ ] Lien de visio partagé (si remote)
- [ ] Écran à partager testé
- [ ] Backup si problème technique

### Participants
- [ ] Invitations envoyées
- [ ] Rappel J-1 si nécessaire
- [ ] Contexte partagé en amont
```

### Pendant la Demo

| ✅ Faire | ❌ Éviter |
|----------|-----------|
| Montrer le parcours utilisateur | Montrer le code |
| Utiliser des données réalistes | "Imaginez que..." |
| Solliciter les questions | Monologue de 20 min |
| Accepter le feedback | Défendre/justifier |
| Noter les verbatims | Interpréter sur le moment |

### Gestion du Feedback Négatif

```markdown
## Comment Recevoir du Feedback Négatif

### Posture
- Remercier pour le feedback
- Ne pas justifier ou défendre
- Creuser pour comprendre

### Phrases Utiles
- "Merci, c'est utile. Peux-tu m'en dire plus ?"
- "Je comprends. Comment tu verrais ça idéalement ?"
- "C'est noté, on va regarder ça."

### Ce qu'il ne faut PAS dire
❌ "Oui mais c'était dans la spec..."
❌ "C'est pas possible techniquement."
❌ "Les autres utilisateurs aiment bien."
```

### Après la Demo

```markdown
## Actions Post-Demo

### Immédiat (< 2h)
- [ ] Notes de feedback consolidées
- [ ] Partagées avec l'équipe

### Court terme (< 48h)
- [ ] Actions priorisées
- [ ] SPECs créées/mises à jour si nécessaire
- [ ] Réponse aux participants si questions ouvertes

### Suivi
- [ ] Feedback intégré dans les prochains cycles
- [ ] Communication quand le feedback est adressé
```

---

## Formats Alternatifs

### Demo Asynchrone

Pour les équipes distribuées ou stakeholders indisponibles :

```markdown
## Demo Asynchrone - [Feature]

### Vidéo
[Lien vers vidéo de 3-5 min]

### Contexte
[Résumé écrit de ce qui est montré]

### Questions pour Vous
1. [Question 1]
2. [Question 2]
3. [Question 3]

### Comment Répondre
- Répondre dans ce thread/doc avant [date]
- Ou planifier un call si besoin de discuter
```

### Demo "Dogfooding"

L'équipe utilise elle-même la feature :

```markdown
## Dogfooding - [Feature]

### Période
[Date début] → [Date fin]

### Participants
Toute l'équipe

### Instructions
1. Utiliser [feature] dans votre workflow quotidien
2. Noter les frictions dans [channel/doc]
3. Debrief à [date]

### Questions à se Poser
- Est-ce que c'est intuitif ?
- Est-ce que ça me fait gagner du temps ?
- Qu'est-ce qui m'agace ?
```

---

## Anti-patterns

### 1. "La Demo Parfaite"

**Symptôme** : Montrer uniquement le happy path idéal
```
❌ "Ici tout fonctionne parfaitement..."
```

**Impact** : Feedback déconnecté de la réalité

**Solution** : Montrer des cas réalistes
```
✅ Inclure des cas limites
✅ Montrer les messages d'erreur
✅ Utiliser des données réalistes (pas "Test User")
```

### 2. "La Demo Technique"

**Symptôme** : Montrer l'architecture au lieu du produit
```
❌ "Regardez ce beau refactoring..."
```

**Impact** : Feedback non pertinent, stakeholders perdus

**Solution** : Focus utilisateur
```
✅ Montrer ce que l'utilisateur voit et fait
✅ Tech details en aparté si demandé
```

### 3. "Le Feedback Ignoré"

**Symptôme** : Collecter sans suite
```
❌ Demo après demo sans changement
```

**Impact** : Stakeholders désengagés

**Solution** : Boucle de feedback visible
```
✅ Montrer ce qui a changé grâce au feedback
✅ Expliquer ce qu'on ne fait pas et pourquoi
```

### 4. "Trop de Stakeholders"

**Symptôme** : 15 personnes avec opinions contradictoires
```
❌ Design by committee
```

**Impact** : Paralysie, feature diluée

**Solution** : Audience ciblée
```
✅ Max 5-6 personnes
✅ Stakeholders représentatifs
✅ PM arbitre les contradictions
```

---

## Métriques de Demo

### Indicateurs Qualitatifs

| Indicateur | Signal Positif | Signal Négatif |
|------------|----------------|----------------|
| Engagement | Questions nombreuses | Silence |
| Clarté | "Ah oui, je vois" | "Je ne comprends pas" |
| Utilité | "J'ai hâte de l'utiliser" | "Mouais, peut-être" |
| UX | Navigation fluide | "Comment on fait pour...?" |

### Suivi Quantitatif

```markdown
## Métriques Demo

| Demo | Date | Participants | Score Utilité (moy) | Actions Générées |
|------|------|--------------|---------------------|------------------|
| Feature A | 01/15 | 4 | 4.2/5 | 3 |
| Feature B | 01/22 | 3 | 3.8/5 | 5 |
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
