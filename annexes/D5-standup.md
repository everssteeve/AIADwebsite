# D.5 Standup - Détails

## Pourquoi cette annexe ?

Cette annexe fournit des exemples de standups efficaces vs inefficaces et des alternatives au format traditionnel.

---

## Vue d'Ensemble

### Objectif
Synchroniser l'équipe sur l'avancement, identifier les blocages rapidement et maintenir l'alignement.

### Rappel AIAD
Les standups sont **optionnels** dans AIAD. Ils sont utiles quand il y a besoin de coordination fréquente, pas comme rituel obligatoire.

### Quand Faire un Standup

| Situation | Standup Utile ? |
|-----------|-----------------|
| Équipe distribuée, travail interdépendant | ✅ Oui |
| Phase critique (release, deadline) | ✅ Oui |
| Équipe colocalisée, communication fluide | ❓ Peut-être pas |
| Travail indépendant sur des SPECs séparées | ❌ Probablement pas |

---

## Format Efficace

### Structure de Base

```markdown
## Standup - [Date]

### Tour de Table (1-2 min par personne)

#### [Nom]
- **Focus aujourd'hui** : [Ce sur quoi je travaille]
- **Besoin** : [Ce dont j'ai besoin / blocage]

### Sujets à Discuter Après
- [Sujet 1] → [Participants concernés]
- [Sujet 2] → [Participants concernés]

### Parking Lot (à traiter plus tard)
- [Sujet non urgent]

Durée totale : [X] min
```

### Questions par Personne

| ✅ Questions Efficaces | ❌ Questions Inefficaces |
|------------------------|-------------------------|
| "Sur quoi tu avances aujourd'hui ?" | "Qu'est-ce que tu as fait hier ?" |
| "De quoi tu as besoin ?" | "Qu'est-ce que tu vas faire demain ?" |
| "Y a-t-il un blocage ?" | "Quel est ton plan pour la semaine ?" |

---

## Exemples : Efficace vs Inefficace

### ❌ Standup Inefficace

```
PM : "Alors, qu'est-ce que chacun a fait hier ?"

Dev 1 : "Hier j'ai travaillé sur le bug 123, j'ai regardé le code,
j'ai trouvé que le problème venait de la fonction calculateTotal,
j'ai refactoré un peu le code autour, j'ai ajouté des logs,
et finalement j'ai trouvé que c'était un problème de précision
sur les décimales. Aujourd'hui je vais finir de corriger ça
et ajouter des tests. Demain je pense commencer la feature 456."
[3 min de monologue]

Dev 2 : "Hier j'ai fait des PR reviews, j'ai eu des meetings,
j'ai répondu à des emails..." [2 min de détails]

[...30 min plus tard...]

PM : "OK, quelqu'un a des blocages ?"
[Silence]
PM : "Parfait, bonne journée !"
```

**Problèmes :**
- Trop long (30 min)
- Focus sur le passé
- Pas de valeur ajoutée
- Blocages non identifiés

### ✅ Standup Efficace

```
PM : "C'est parti. Alice ?"

Alice : "Je finis SPEC-042 ce matin. J'ai besoin de 10 min avec
Bob pour le format de l'API. Pas de blocage."

PM : "Bob ?"

Bob : "Je suis sur SPEC-043. Bloqué sur l'intégration Stripe,
j'attends leur support. Je vais avancer sur les tests en attendant."

PM : "Charlie ?"

Charlie : "Review de la PR d'Alice, puis je commence SPEC-044.
RAS."

PM : "OK. Alice-Bob, vous vous syncez après. Bob, escalade si
pas de réponse Stripe d'ici midi. Autre chose ? Non ? Go."

[Total : 5 min]
```

**Points Forts :**
- Court (5 min)
- Focus sur aujourd'hui et les besoins
- Blocages identifiés avec action
- Coordination facilitée

---

## Formats Alternatifs

### Standup Asynchrone (Slack/Teams)

Pour les équipes distribuées sur plusieurs fuseaux horaires.

```markdown
## Template Message Standup

📍 **Focus aujourd'hui** : [1-2 phrases max]
🚧 **Blocage** : [Rien / Description courte]
🤝 **Besoin** : [Rien / Qui pour quoi]

Exemple :
📍 **Focus** : Finaliser SPEC-042, tests + PR
🚧 **Blocage** : Aucun
🤝 **Besoin** : Review de @Bob sur ma PR cet aprem si possible
```

**Configuration Slack/Teams :**
- Channel dédié #standup
- Rappel automatique à heure fixe
- Thread par jour
- Pas d'obligation de répondre si rien de nouveau

### Walking Standup

Debout et en mouvement, limite naturellement le temps.

```markdown
## Règles Walking Standup

- Tout le monde debout
- Pas d'ordinateurs/téléphones
- 1 min max par personne
- Si discussion nécessaire → "après le standup"
- Timer visible (10 min max total)
```

### Kanban Walk

Au lieu de tour de table, on parcourt le board.

```markdown
## Kanban Walk

### Principe
- On regarde le board de droite à gauche
- On commence par ce qui est presque fini
- Pour chaque item : "Qu'est-ce qui manque pour finir ?"

### Avantages
- Focus sur le flux
- Visualisation des blocages
- Identifie le WIP excessif

### Déroulement
1. Items "In Review" → Qui peut reviewer ?
2. Items "In Progress" → Blocages ?
3. Items "Ready" → Qui prend quoi ?
```

### Check-in Async + Sync Blocages

Hybride pour équipes moyennes.

```markdown
## Modèle Hybride

### Async (avant 9h)
Chacun poste son focus dans #standup

### Sync (9h30, 10 min max)
- Pas de tour de table
- "Quelqu'un a un blocage ?"
- "Quelqu'un a besoin de sync ?"
- Si rien → annulé

### Avantage
- Standup annulé si pas de besoin
- Focus sur les vrais problèmes
```

---

## Anti-patterns

### 1. "Le Rapport Quotidien"

**Symptôme** : Chacun récite ce qu'il a fait
```
❌ "Hier j'ai fait X, Y, Z..."
```

**Solution** : Focus sur les besoins
```
✅ "Aujourd'hui je finis X, j'ai besoin de Y"
```

### 2. "Le Standup Assis"

**Symptôme** : 45 minutes de discussion confortable
```
❌ Tout le monde assis, discussions qui s'éternisent
```

**Solution** : Debout + timebox strict
```
✅ Debout, timer visible, discussions après
```

### 3. "Le Problem-Solving Meeting"

**Symptôme** : Résolution de problèmes pendant le standup
```
❌ "Ah oui, pour ce bug, tu devrais faire X, Y, Z..."
```

**Solution** : Identifier, ne pas résoudre
```
✅ "OK, Alice et Bob vous syncez après pour ce sujet"
```

### 4. "Le Spectateur Passif"

**Symptôme** : Des gens qui n'ont rien à dire mais sont là
```
❌ 10 personnes, 3 parlent, 7 écoutent passivement
```

**Solution** : Inviter seulement les concernés
```
✅ Standup par squad/feature, pas global
```

### 5. "L'Absence de Suivi"

**Symptôme** : Blocages mentionnés mais jamais résolus
```
❌ "Je suis bloqué" → [Aucune action]
```

**Solution** : Action immédiate sur les blocages
```
✅ "Tu es bloqué → Qui peut aider ? → RDV dans 30 min"
```

---

## Checklist Standup Efficace

```markdown
## Évaluation Standup

### Durée
- [ ] < 15 min pour équipe de 5
- [ ] < 10 min si possible

### Format
- [ ] Focus sur les besoins (pas le passé)
- [ ] Blocages identifiés avec action
- [ ] Discussions reportées après

### Valeur
- [ ] Chacun sait ce que font les autres
- [ ] Les dépendances sont clarifiées
- [ ] Les blocages sont adressés

### Efficacité
- [ ] Tout le monde participe
- [ ] Personne ne s'ennuie
- [ ] On ne pourrait pas avoir cette info autrement
```

---

## Quand Arrêter les Standups

### Signaux

| Signal | Interprétation |
|--------|----------------|
| Standups souvent annulés | Pas de besoin réel |
| "Rien de nouveau" récurrent | Communication fonctionne autrement |
| Participants frustrés | Format inadapté |
| Aucun blocage jamais remonté | Soit tout va bien, soit pas de confiance |

### Alternatives

```markdown
## Si on Arrête le Standup

### Communication Async
- Updates dans #standup Slack
- Commentaires sur les tickets/PRs
- Doc de suivi partagé

### Sync à la Demande
- "J'ai besoin de sync" → on organise
- Slack huddle pour les blocages

### Points de Contact
- PM check individuel hebdo
- Tech Lead dispo pour débloquer
```

---

## Métriques (si vous voulez mesurer)

### Indicateurs Qualitatifs

| Question | Réponse Idéale |
|----------|----------------|
| "Le standup apporte-t-il de la valeur ?" | Oui, clairement |
| "Pourrait-on avoir cette info autrement ?" | Non, pas aussi efficacement |
| "Les blocages sont-ils résolus plus vite ?" | Oui |

### Indicateurs Quantitatifs

| Métrique | Cible |
|----------|-------|
| Durée | < 15 min |
| Taux de participation | 100% |
| Blocages résolus dans la journée | > 80% |
| Standups annulés (faute de besoin) | > 20% = OK |

---

*Retour aux [Annexes](../framework/08-annexes.md)*
