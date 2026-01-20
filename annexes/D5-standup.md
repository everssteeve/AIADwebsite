# D.5 Standup

## Pourquoi cette annexe ?

Le standup est le rituel le plus controversé : souvent imposé par habitude, rarement remis en question. Dans AIAD, il est **optionnel**. Cette annexe vous aide à décider si vous en avez besoin, et si oui, à le rendre efficace en moins de 10 minutes.

---

## Faut-il Faire un Standup ?

### Arbre de Décision

```
L'équipe a-t-elle besoin de synchronisation quotidienne ?
│
├─ Non → Pas de standup (async suffit)
│
└─ Oui → Les blocages sont-ils fréquents ?
         │
         ├─ Non → Standup async (Slack/Teams)
         │
         └─ Oui → Standup synchrone court
```

### Critères de Décision

| Situation | Standup Recommandé |
|-----------|-------------------|
| Travail interdépendant, beaucoup de coordination | ✅ Sync quotidien |
| Phase critique (release, deadline) | ✅ Sync quotidien |
| Équipe distribuée, peu de chevauchement horaire | ⚠️ Async + sync hebdo |
| Équipe colocalisée, communication fluide | ❓ Probablement pas |
| Travail indépendant sur des SPECs séparées | ❌ Async suffit |
| Standup devient routine sans valeur | ❌ Arrêter ou repenser |

### Questions à se Poser

```markdown
## Évaluation Besoin Standup

1. "Cette semaine, le standup a-t-il débloqué quelqu'un ?"
   - Si rarement → probablement inutile

2. "Pourrait-on avoir cette info autrement (Slack, board) ?"
   - Si oui facilement → standup optionnel

3. "Les gens écoutent-ils ou attendent-ils leur tour ?"
   - Si attente passive → format à revoir

4. "Le standup dure-t-il > 15 min ?"
   - Si oui → problème de format
```

---

## Format Efficace

### Structure Optimale

**Durée cible : 5-10 minutes**

```
┌─────────────────────────────────────────────────┐
│ Par personne (1-2 min max) :                    │
│                                                 │
│ 1. "Mon focus aujourd'hui : [quoi]"             │
│ 2. "J'ai besoin de : [qui/quoi]" ou "RAS"       │
│ 3. "Blocage : [oui/non]"                        │
│                                                 │
│ Si blocage → action immédiate, pas de résolution│
└─────────────────────────────────────────────────┘
```

### Questions Efficaces vs Inefficaces

| ✅ Efficace | ❌ Inefficace |
|-------------|---------------|
| "Sur quoi tu avances aujourd'hui ?" | "Qu'est-ce que tu as fait hier ?" |
| "De quoi tu as besoin ?" | "Qu'est-ce que tu vas faire demain ?" |
| "Y a-t-il un blocage ?" | "Quel est ton plan pour la semaine ?" |

### Template Standup

```markdown
# Standup - [Date]

## Tour Rapide

### [Nom 1]
- **Focus** : [Ce sur quoi je travaille]
- **Besoin** : [Rien / Sync avec X pour Y]
- **Blocage** : [Non / Oui : description courte]

### [Nom 2]
[Même structure]

---

## Actions Immédiates
- [Personne A] + [Personne B] : sync après sur [sujet]
- [Personne C] : escalade [blocage] à [qui]

## Parking Lot (à traiter ailleurs)
- [Sujet non urgent]

---

Durée : [X] min
```

---

## Exemples : Efficace vs Inefficace

### ❌ Standup Inefficace

```
PM : "Alors, qu'est-ce que chacun a fait hier ?"

Alice : "Hier j'ai travaillé sur le bug #123, j'ai regardé le code,
j'ai trouvé que le problème venait de calculateTotal, j'ai refactoré,
j'ai ajouté des logs, et finalement c'était un problème de précision
décimale. Aujourd'hui je vais finir et ajouter des tests..."
[3 minutes de monologue]

Bob : "Hier j'ai fait des PR reviews, j'ai eu des meetings,
j'ai répondu à des emails, j'ai commencé à regarder la SPEC-044..."
[2 minutes]

[...30 minutes plus tard...]

PM : "OK, quelqu'un a des blocages ?"
[Silence gêné]
PM : "Parfait, bonne journée !"
```

**Problèmes** :
- 30 min au lieu de 10
- Focus sur le passé
- Pas de valeur pour les autres
- Blocages non identifiés (ou pas remontés)

### ✅ Standup Efficace

```
PM : "C'est parti. Alice ?"

Alice : "Je finis SPEC-042 ce matin. Besoin de 10 min avec Bob
pour valider le format API. Pas de blocage."

PM : "Bob ?"

Bob : "Je suis sur SPEC-043. Bloqué sur l'intégration Stripe,
j'attends leur support. Je continue sur les tests en attendant."

PM : "Charlie ?"

Charlie : "Review de la PR d'Alice, puis SPEC-044. RAS."

PM : "OK. Alice-Bob, vous vous syncez après. Bob, escalade
si pas de réponse Stripe d'ici midi. Autre chose ? Non ? Go."

[Total : 5 minutes]
```

**Points forts** :
- 5 min, pas une de plus
- Focus sur aujourd'hui et les besoins
- Blocage identifié avec action
- Coordination facilitée

---

## Formats Alternatifs

### Standup Asynchrone

Pour équipes distribuées ou quand le sync n'apporte pas de valeur.

**Configuration Slack/Teams** :

```markdown
## Setup

1. Créer channel #standup
2. Configurer rappel automatique (9h ou heure de l'équipe)
3. Template de message épinglé

## Template Message

📍 **Focus** : [1-2 phrases max]
🚧 **Blocage** : [Rien / Description courte]
🤝 **Besoin** : [Rien / Qui pour quoi]

## Règles

- Poster avant [heure]
- Pas d'obligation si rien de nouveau depuis hier
- Répondre aux besoins mentionnés dans les 2h
- Thread si discussion nécessaire
```

**Exemple** :

```
📍 Focus : Finaliser SPEC-042, tests + PR
🚧 Blocage : Aucun
🤝 Besoin : Review de @Bob sur ma PR cet aprem si possible
```

### Kanban Walk

Au lieu d'un tour de table, on parcourt le board.

```markdown
## Kanban Walk - Déroulement

### Principe
- On regarde le board de DROITE à GAUCHE
- On commence par ce qui est presque fini
- Question clé : "Qu'est-ce qui manque pour finir ?"

### Étapes

1. **In Review** → "Qui peut reviewer ?"
2. **In Progress** → "Blocages ? Besoin d'aide ?"
3. **Ready** → "Qui prend quoi ?"

### Avantages
- Focus sur le flux, pas les personnes
- Visualisation immédiate des blocages
- Détecte le WIP excessif

### Durée
5-10 min selon la taille du board
```

### Standup Walking

Tout le monde debout, sans écran.

```markdown
## Règles Walking Standup

- Tout le monde DEBOUT
- PAS d'ordinateurs/téléphones
- 1 minute max par personne
- Si discussion → "après le standup"
- Timer visible (10 min max)
- Si quelqu'un s'assied, le standup est fini

### Pourquoi ça marche
- L'inconfort physique limite naturellement la durée
- Pas de distraction possible
- Focus sur l'essentiel
```

### Modèle Hybride

Async pour l'info, sync pour les blocages uniquement.

```markdown
## Modèle Hybride

### Partie Async (avant 9h)
Chacun poste son focus dans #standup

### Partie Sync (9h30, SI NÉCESSAIRE)

Facilitateur : "Quelqu'un a un blocage ?"
- Si non → standup annulé, 0 min
- Si oui → 5 min sur les blocages uniquement

### Avantage
- Pas de standup si pas de besoin
- Ceux qui n'ont rien à dire ne perdent pas de temps
- Focus sur les vrais problèmes
```

---

## Anti-patterns

### 1. Le Rapport Quotidien

**Symptôme** : Chacun récite ce qu'il a fait

```
❌ "Hier j'ai fait X, puis Y, puis Z..."
   → Monologue de 3 min, personne n'écoute
```

**Solution** : Focus sur les besoins

```
✅ "Aujourd'hui je finis X. J'ai besoin de Y."
```

### 2. Le Standup Assis de 45 Minutes

**Symptôme** : Tout le monde confortablement installé

```
❌ Assis, avec café, discussions qui dérivent
   → 45 min, personne ne sait quand ça finit
```

**Solution** : Debout + timer strict

```
✅ Debout, timer visible de 10 min, discussions après
```

### 3. Le Problem-Solving Meeting

**Symptôme** : Résolution de problèmes en direct

```
❌ "Ah oui, pour ce bug, tu devrais essayer X, puis Y,
    et peut-être vérifier Z aussi..."
   → 15 min sur un sujet qui concerne 2 personnes
```

**Solution** : Identifier, ne pas résoudre

```
✅ "Blocage identifié. Alice et Bob, vous syncez après."
```

### 4. Le Spectateur Passif

**Symptôme** : Des gens qui n'ont rien à dire mais sont là

```
❌ 10 personnes présentes, 3 parlent, 7 scrollent leur téléphone
```

**Solution** : Inviter seulement les concernés

```
✅ Standup par squad/feature
✅ Si tu n'as jamais rien à dire, tu n'as pas besoin d'être là
```

### 5. L'Absence de Suivi

**Symptôme** : Blocages mentionnés mais jamais résolus

```
❌ "Je suis bloqué sur X" → Aucune action
   → Le lendemain : "Je suis toujours bloqué sur X"
```

**Solution** : Action immédiate sur chaque blocage

```
✅ Blocage → Qui aide ? → RDV dans 30 min
✅ Si personne ne peut aider → escalade immédiate
```

---

## Quand Arrêter les Standups

### Signaux d'Alarme

| Signal | Interprétation |
|--------|----------------|
| Standups souvent annulés faute de contenu | Pas de besoin réel |
| "Rien de nouveau" à chaque tour | Communication fonctionne autrement |
| Participants frustrés ou désengagés | Format inadapté ou inutile |
| Aucun blocage jamais remonté | Soit tout va bien, soit pas de confiance |
| Durée > 20 min régulièrement | Standup détourné de son objectif |

### Alternatives si on Arrête

```markdown
## Si on Arrête le Standup

### Communication Async
- Updates dans #standup Slack quand pertinent
- Commentaires sur tickets/PRs
- Doc de suivi partagé accessible à tous

### Sync à la Demande
- "J'ai besoin d'un sync" → on organise
- Slack huddle pour les blocages urgents
- Pas de meeting récurrent sans valeur

### Points de Contact
- PM check individuel hebdo (optionnel)
- Tech Lead dispo pour débloquer (Slack)
- Alignment hebdo pour la stratégie
```

---

## Checklist Standup Efficace

```markdown
## Évaluation Hebdomadaire Standup

### Durée
- [ ] < 15 min pour équipe de 5+
- [ ] < 10 min idéalement

### Format
- [ ] Focus sur les besoins, pas le passé
- [ ] Blocages identifiés avec action immédiate
- [ ] Discussions longues reportées après

### Valeur
- [ ] Au moins 1 blocage débloqué cette semaine
- [ ] Coordination facilitée entre membres
- [ ] Information qu'on n'aurait pas eue autrement

### Engagement
- [ ] Tout le monde participe (pas de spectateurs)
- [ ] Personne ne s'ennuie
- [ ] Le standup commence et finit à l'heure
```

### Décision Mensuelle

```markdown
## Revue Mensuelle Standup

Le standup apporte-t-il de la valeur ?

- [ ] Oui clairement → Continuer
- [ ] Parfois → Adapter le format
- [ ] Rarement → Tester 2 semaines sans
- [ ] Jamais → Arrêter

Si on arrête, définir :
- [ ] Comment on communique les blocages
- [ ] Comment on se coordonne
- [ ] Quand on se voit (si nécessaire)
```

---

## Métriques (optionnel)

Si vous voulez mesurer l'efficacité :

| Métrique | Cible | Signal d'alerte |
|----------|-------|-----------------|
| Durée moyenne | < 10 min | > 15 min |
| Blocages résolus/semaine | > 2 | 0 pendant 2 semaines |
| Taux de participation active | 100% | < 70% |
| Standups annulés/mois | 0-2 (OK) | > 50% (questionner le besoin) |

---

## Résumé

| Situation | Recommandation |
|-----------|----------------|
| Équipe avec beaucoup d'interdépendances | Standup sync quotidien, < 10 min |
| Équipe distribuée multi-timezone | Standup async + sync hebdo |
| Travail indépendant, peu de blocages | Pas de standup, async suffit |
| Standup qui dure > 20 min | Revoir le format ou arrêter |
| "On a toujours fait comme ça" | Questionner, expérimenter |

**Règle d'or** : Si le standup n'apporte pas de valeur visible chaque semaine, il ne devrait pas exister.

---

*Annexes connexes : [D.1 Alignment Stratégique](./D1-alignment-strategique.md) · [D.4 Rétrospective](./D4-retrospective.md)*
