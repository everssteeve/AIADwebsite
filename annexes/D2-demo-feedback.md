# D.2 Demo & Feedback

## Pourquoi cette annexe ?

La démo est le moment de vérité : soit vous montrez de la valeur et récoltez du feedback utile, soit vous perdez 30 minutes en monologue technique. Cette annexe vous donne les outils pour présenter efficacement et transformer le feedback en actions concrètes.

---

## Structure d'une Demo

**Durée totale : 20-30 minutes**

```
┌─────────────────────────────────────────────────┐
│ 1. CONTEXTE (2 min)                             │
│    Pourquoi on est là, ce qu'on va voir         │
├─────────────────────────────────────────────────┤
│ 2. DÉMONSTRATION (10-15 min)                    │
│    Parcours utilisateur, pas de code            │
├─────────────────────────────────────────────────┤
│ 3. FEEDBACK (10-15 min)                         │
│    Questions structurées, collecte active       │
├─────────────────────────────────────────────────┤
│ 4. CLÔTURE (2 min)                              │
│    Récap, prochaines étapes                     │
└─────────────────────────────────────────────────┘
```

### Script de Demo

```markdown
## 1. CONTEXTE (2 min)

"On va vous montrer [feature] qui permet de [bénéfice utilisateur].

Rappel du besoin : [problème qu'on résout]

Ce qu'on va voir :
- [Parcours 1]
- [Parcours 2]

Questions bienvenues pendant la démo."

## 2. DÉMONSTRATION (10-15 min)

[Montrer le parcours utilisateur principal]
[Montrer 2-3 cas d'usage clés]
[Inclure au moins un cas limite ou message d'erreur]

## 3. FEEDBACK (10-15 min)

[Questions structurées - voir section suivante]

## 4. CLÔTURE (2 min)

"Ce qu'on retient :
- [Point 1]
- [Point 2]

Prochaines étapes : [actions]

Merci pour vos retours."
```

---

## Questions de Feedback

### Questions Essentielles

À poser systématiquement :

| Question | Ce qu'elle révèle |
|----------|-------------------|
| "Est-ce que ça répond au problème ?" | Adéquation besoin/solution |
| "Qu'est-ce qui manque pour que ce soit utile ?" | Gaps fonctionnels |
| "Si vous pouviez changer UNE chose ?" | Priorité utilisateur |

### Questions par Objectif

**Valider l'Utilité**

```markdown
1. "Sur 1 à 5, à quel point cette feature est utile pour vous ?"
   → Si < 4 : "Qu'est-ce qui la rendrait plus utile ?"

2. "À quelle fréquence utiliseriez-vous cette fonctionnalité ?"
   □ Quotidienne  □ Hebdomadaire  □ Mensuelle  □ Rarement

3. "Comment faisiez-vous avant ? Est-ce que c'est mieux ?"
```

**Évaluer l'UX**

```markdown
1. "Le parcours pour [action] vous semble-t-il naturel ?"
   → Si non : "Qu'est-ce qui vous a surpris ?"

2. "Si vous deviez faire cette action 10 fois par jour, qu'est-ce qui vous gênerait ?"

3. "Les messages d'erreur sont-ils clairs ?"
```

**Identifier les Manques**

```markdown
1. "Y a-t-il des cas où cette feature ne fonctionnerait pas pour vous ?"

2. "Y a-t-il quelque chose qu'on devrait enlever ?"

3. "Qu'est-ce que vous vous attendiez à voir et qui n'y est pas ?"
```

---

## Collecte Structurée du Feedback

### Template de Notes

```markdown
# Feedback Demo - [Feature] - [Date]

## Métadonnées
- **Feature** : [Nom]
- **SPEC** : [Référence]
- **Présentateur** : [PE]
- **Facilitateur** : [PM]

## Participants
| Nom | Rôle | Représente |
|-----|------|------------|
| [Nom] | [Rôle] | [Segment utilisateur] |

---

## Réception Globale

**Score utilité moyen** : [X]/5

**Verdict** : 🟢 Prêt / 🟡 Ajustements mineurs / 🔴 Revoir

---

## Feedback par Participant

### [Participant 1]
| Critère | Score | Verbatim |
|---------|-------|----------|
| Utilité | [X]/5 | "[Citation exacte]" |
| UX | [X]/5 | "[Citation exacte]" |
| Suggestion principale | - | "[Citation exacte]" |

### [Participant 2]
[Même structure]

---

## Synthèse

### Ce qui Fonctionne
- [Point positif 1]
- [Point positif 2]

### À Améliorer
| Feedback | Fréquence | Priorité suggérée |
|----------|-----------|-------------------|
| [Feedback] | [X] personnes | P0/P1/P2 |

### Décisions Prises
- [Décision 1] : [Action] - Owner: [Nom]
- [Décision 2] : [Action] - Owner: [Nom]

### Non Retenu (et pourquoi)
- [Suggestion] : [Raison du non retenu]

---

Partagé le [Date] par [PM]
```

---

## Exemples Pratiques

### Exemple 1 : Demo Feature - Bon Déroulement

```markdown
## Demo - Export CSV - 15/01

### Contexte (2 min)
"On vous montre l'export CSV demandé par plusieurs clients enterprise.
Problème résolu : avant, extraction manuelle de 2h par semaine.
Ce qu'on va voir : export simple, filtres, formats."

### Démo (12 min)
- Export basique : 3 clics → fichier téléchargé
- Filtres : par date, par status, par utilisateur
- Formats : CSV, Excel
- Cas limite : export de 10k lignes (message d'attente)

### Feedback Collecté
| Participant | Score | Feedback clé |
|-------------|-------|--------------|
| Marie (Client A) | 5/5 | "Exactement ce qu'il fallait" |
| Jean (Client B) | 4/5 | "Manque l'export PDF pour les rapports" |
| Sophie (Interne) | 4/5 | "Ajouter les colonnes personnalisables serait top" |

### Décisions
- Export PDF → SPEC-056 créée (P1)
- Colonnes personnalisables → V2, pas urgent
- Feature livrée en l'état ✅
```

### Exemple 2 : Demo avec Feedback Négatif

```markdown
## Demo - Nouveau Dashboard - 22/01

### Feedback Collecté
| Participant | Score | Feedback clé |
|-------------|-------|--------------|
| Pierre | 2/5 | "Je ne trouve pas les métriques importantes" |
| Claire | 3/5 | "Trop de clics pour arriver à ce que je veux" |
| Marc | 2/5 | "Les graphiques ne correspondent pas à mon usage" |

### Analyse
Score moyen : 2.3/5 → 🔴 Revoir avant livraison

Problèmes identifiés :
1. Hiérarchie visuelle ne correspond pas aux priorités utilisateurs
2. Navigation trop profonde
3. Métriques par défaut mal choisies

### Décisions
1. Atelier avec 3 utilisateurs pour redéfinir le layout → Owner: PM
2. Prototype v2 avant prochaine demo → Owner: PE
3. Livraison reportée de 1 semaine → Stakeholders informés
```

---

## Gestion du Feedback Difficile

### Feedback Négatif

**Posture à adopter** :

| ✅ Faire | ❌ Éviter |
|----------|-----------|
| "Merci, c'est utile." | "Oui mais c'était dans la spec..." |
| "Peux-tu m'en dire plus ?" | "C'est pas possible techniquement." |
| "Comment tu verrais ça idéalement ?" | "Les autres aiment bien." |
| [Noter le verbatim exact] | [Interpréter ou reformuler] |

**Script de réponse** :

```
Feedback négatif reçu →
  "Merci pour ce retour. Pour bien comprendre : [reformuler].
   C'est noté, on va regarder ça."

Ne pas : justifier, défendre, expliquer les contraintes.
```

### Feedback Contradictoire

Quand deux participants veulent des choses opposées :

```markdown
## Résolution

1. Noter les deux feedbacks sans trancher en séance
2. Identifier le contexte de chaque demande
3. Décision PM après la démo :
   - Si un segment est prioritaire → suivre ce feedback
   - Si les deux comptent → proposer une config/option
   - Si aucun n'est critique → ne rien faire
```

### Feedback Hors Scope

```markdown
## Réponse Type

"C'est un bon point. Ce n'était pas dans le scope de cette version,
mais je le note pour [SPEC future / backlog / discussion PM]."

→ Ne pas s'engager pendant la démo
→ Ne pas rejeter non plus
```

---

## Formats Alternatifs

### Demo Asynchrone

Pour équipes distribuées ou stakeholders indisponibles.

```markdown
## Demo Async - [Feature]

### Vidéo
[Lien vers Loom/vidéo de 5 min max]

### Ce qu'on Montre
1. [Parcours 1]
2. [Parcours 2]
3. [Cas limite]

### Questions pour Vous

Merci de répondre avant [Date] :

1. Sur 1-5, utilité de cette feature pour vous ?
   Votre score : ___

2. Qu'est-ce qui manque pour que ce soit vraiment utile ?
   Votre réponse : ___

3. Une chose à changer ?
   Votre réponse : ___

### Comment Répondre
- Répondez directement dans ce doc
- Ou commentez sur la vidéo
- Questions ? Slack @[PM]
```

### Dogfooding

L'équipe utilise la feature avant les stakeholders.

```markdown
## Dogfooding - [Feature]

### Période
Du [Date] au [Date] (5 jours)

### Participants
Toute l'équipe AIAD

### Instructions
1. Utiliser [feature] dans votre travail quotidien
2. Noter les frictions dans #dogfooding
3. Format : "[Friction] - [Impact]"

### Questions Guide
- Est-ce intuitif ?
- Qu'est-ce qui m'agace ?
- Qu'est-ce qui manque ?

### Debrief
[Date] à [Heure]
```

---

## Anti-patterns

### 1. La Demo Parfaite

**Symptôme** : Uniquement le happy path idéal

```
❌ "Ici tout fonctionne parfaitement avec mes données de test..."
```

**Impact** : Feedback déconnecté de la réalité

**Solution** :
```
✅ Inclure au moins un cas limite
✅ Montrer un message d'erreur
✅ Utiliser des données réalistes (pas "Test User 1")
```

### 2. La Demo Technique

**Symptôme** : Montrer le code au lieu du produit

```
❌ "Regardez ce refactoring élégant..."
❌ "L'architecture utilise un pattern observer avec..."
```

**Impact** : Stakeholders perdus, feedback non pertinent

**Solution** :
```
✅ Montrer uniquement ce que l'utilisateur voit
✅ Tech details en aparté si demandé explicitement
```

### 3. Le Feedback Ignoré

**Symptôme** : Demo après demo sans changement visible

```
❌ Même feedback remonté 3 fois sans réponse
```

**Impact** : Stakeholders désengagés, démos inutiles

**Solution** :
```
✅ Commencer chaque démo par : "Suite à vos retours, on a..."
✅ Expliquer ce qu'on ne fait pas et pourquoi
```

### 4. Trop de Monde

**Symptôme** : 15 participants, opinions contradictoires

```
❌ "Faites-le bleu" vs "Faites-le rouge" vs "Pas de couleur"
```

**Impact** : Paralysie, feature design by committee

**Solution** :
```
✅ Max 5-6 participants
✅ Stakeholders représentatifs des segments clés
✅ PM arbitre les contradictions après la démo
```

---

## Après la Demo

### Actions Immédiates (< 2h)

- [ ] Notes de feedback consolidées
- [ ] Partagées dans le canal équipe
- [ ] Verdict : 🟢 Prêt / 🟡 Ajustements / 🔴 Revoir

### Actions Courtes (< 48h)

- [ ] Feedback priorisé
- [ ] SPECs créées/mises à jour si nécessaire
- [ ] Réponse aux participants si questions ouvertes

### Suivi

- [ ] Informer quand le feedback est adressé
- [ ] Mentionner les changements issus du feedback en début de prochaine demo

---

## Checklist

```markdown
## Checklist Demo & Feedback

### Préparation
- [ ] Scénario de démo préparé (pas improvisé)
- [ ] Données de test réalistes
- [ ] Environnement stable (staging)
- [ ] Questions de feedback préparées
- [ ] Participants invités et confirmés

### Pendant
- [ ] Contexte donné en 2 min max
- [ ] Focus utilisateur, pas technique
- [ ] Cas limite inclus
- [ ] Questions de feedback posées
- [ ] Verbatims notés exactement

### Après
- [ ] Notes partagées < 2h
- [ ] Feedback priorisé
- [ ] Actions identifiées avec owners
- [ ] Participants remerciés
```

---

*Annexes connexes : [D.1 Alignment Stratégique](./D1-alignment-strategique.md) · [D.3 Tech Review](./D3-tech-review.md)*
