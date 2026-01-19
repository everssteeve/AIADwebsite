# D.4 Rétrospective - Détails

## Pourquoi cette annexe ?

Cette annexe fournit différents formats de facilitation pour les rétrospectives et des bonnes pratiques pour les rendre efficaces.

---

## Vue d'Ensemble

### Objectif
Réfléchir sur le travail passé, identifier les améliorations et adapter le framework au contexte de l'équipe.

### Cadence Recommandée
Après chaque cycle significatif (2-4 semaines) ou après un événement notable (release majeure, incident).

### Durée
45 à 90 minutes selon la taille de l'équipe et la période couverte.

### Participants
Toute l'équipe (PM, PE, QA, Tech Lead).

---

## Formats de Facilitation

### Format 1 : Start / Stop / Continue

Simple et efficace, idéal pour les équipes qui débutent.

```markdown
## Rétrospective Start/Stop/Continue - [Date]

### 🟢 START - Ce qu'on devrait commencer à faire
| Suggestion | Proposé par | Votes |
|------------|-------------|-------|
| [Suggestion 1] | [Nom] | [X] |
| [Suggestion 2] | [Nom] | [X] |

### 🔴 STOP - Ce qu'on devrait arrêter de faire
| Suggestion | Proposé par | Votes |
|------------|-------------|-------|
| [Suggestion 1] | [Nom] | [X] |
| [Suggestion 2] | [Nom] | [X] |

### 🟡 CONTINUE - Ce qu'on fait bien et qu'on doit continuer
| Suggestion | Proposé par | Votes |
|------------|-------------|-------|
| [Suggestion 1] | [Nom] | [X] |
| [Suggestion 2] | [Nom] | [X] |

### Actions Retenues
| Action | Owner | Deadline |
|--------|-------|----------|
| [Top voted START] | [Nom] | [Date] |
| [Top voted STOP] | [Nom] | [Date] |
```

### Format 2 : 4L (Liked, Learned, Lacked, Longed For)

Plus introspectif, bon pour les périodes d'apprentissage.

```markdown
## Rétrospective 4L - [Date]

### 💚 LIKED - Ce qu'on a aimé
- [Point positif 1]
- [Point positif 2]

### 📚 LEARNED - Ce qu'on a appris
- [Learning 1]
- [Learning 2]

### ❌ LACKED - Ce qui nous a manqué
- [Manque 1]
- [Manque 2]

### 💭 LONGED FOR - Ce qu'on aurait aimé avoir
- [Souhait 1]
- [Souhait 2]

### Synthèse et Actions
[Résumé et actions décidées]
```

### Format 3 : Sailboat (Bateau)

Visuel et engageant, bon pour les discussions stratégiques.

```markdown
## Rétrospective Sailboat - [Date]

### 🏝️ ÎLE - Notre destination (objectif)
[Où voulons-nous aller ?]

### 💨 VENT - Ce qui nous pousse
- [Force 1 qui nous aide]
- [Force 2 qui nous aide]

### ⚓ ANCRE - Ce qui nous retient
- [Frein 1]
- [Frein 2]

### 🪨 RÉCIFS - Risques devant nous
- [Risque 1]
- [Risque 2]

### 🌊 VAGUES - Opportunités
- [Opportunité 1]
- [Opportunité 2]

### Cap à Suivre
[Décisions et actions]
```

### Format 4 : Mad / Sad / Glad

Centré sur les émotions, bon après des périodes difficiles.

```markdown
## Rétrospective Mad/Sad/Glad - [Date]

### 😠 MAD - Ce qui nous a frustré/énervé
| Item | Qui | Discussion |
|------|-----|------------|
| [Item 1] | [Nom] | [Notes] |

### 😢 SAD - Ce qui nous a déçu/attristé
| Item | Qui | Discussion |
|------|-----|------------|
| [Item 1] | [Nom] | [Notes] |

### 😊 GLAD - Ce qui nous a rendu heureux
| Item | Qui | Discussion |
|------|-----|------------|
| [Item 1] | [Nom] | [Notes] |

### Comment Transformer
- Mad → [Action pour éviter]
- Sad → [Action pour améliorer]
- Glad → [Action pour renforcer]
```

### Format 5 : Timeline

Pour analyser une période spécifique ou un projet.

```markdown
## Rétrospective Timeline - [Période]

### Chronologie des Événements

```
Début                                                    Fin
  │                                                        │
  ├── [Event 1] 😊                                         │
  │       │                                                │
  │       ├── [Event 2] 😐                                 │
  │       │       │                                        │
  │       │       ├── [Event 3] 😞                         │
  │       │       │       │                                │
  │       │       │       ├── [Event 4] 😊                 │
  │       │       │       │       │                        │
  ▼       ▼       ▼       ▼       ▼                        ▼
```

### Analyse par Phase
| Phase | Ce qui s'est passé | Émotions | Apprentissage |
|-------|-------------------|----------|---------------|
| [Phase 1] | [...] | 😊/😐/😞 | [...] |
| [Phase 2] | [...] | 😊/😐/😞 | [...] |

### Patterns Identifiés
- [Pattern récurrent 1]
- [Pattern récurrent 2]

### Actions
[Actions basées sur les patterns]
```

---

## Déroulement Type

### Préparation (J-1)

```markdown
## Checklist Préparation Rétro

### Facilitateur
- [ ] Format choisi
- [ ] Board/doc préparé
- [ ] Invitations envoyées
- [ ] Données collectées (métriques, incidents, feedback)

### Participants
- [ ] Réfléchir aux points à aborder
- [ ] Noter les situations marquantes
```

### Déroulement (pendant)

```
┌─────────────────────────────────────────────────┐
│ 1. CHECK-IN (5 min)                             │
│    - Comment chacun arrive                      │
│    - Rappel des règles                          │
├─────────────────────────────────────────────────┤
│ 2. COLLECTE (15-20 min)                         │
│    - Chacun écrit ses points                    │
│    - Silence ou musique                         │
│    - Pas de discussion                          │
├─────────────────────────────────────────────────┤
│ 3. PARTAGE (15-20 min)                          │
│    - Tour de table                              │
│    - Clarification (pas de débat)              │
│    - Groupement par thème                       │
├─────────────────────────────────────────────────┤
│ 4. VOTE & PRIORISATION (5 min)                  │
│    - Chacun a 3 votes                           │
│    - Vote sur les thèmes à discuter            │
├─────────────────────────────────────────────────┤
│ 5. DISCUSSION (15-20 min)                       │
│    - Top 2-3 thèmes votés                       │
│    - Identifier les actions                     │
├─────────────────────────────────────────────────┤
│ 6. ACTIONS & CLÔTURE (5-10 min)                 │
│    - Actions avec owners et deadlines           │
│    - Feedback sur la rétro                      │
└─────────────────────────────────────────────────┘
```

### Règles du Jeu

```markdown
## Règles de la Rétrospective

### Présupposés
- Chacun a fait de son mieux avec ce qu'il savait
- On cherche à améliorer, pas à blâmer
- Ce qui se dit ici reste ici

### Comportements
✅ Écouter sans interrompre
✅ Parler de faits et ressentis
✅ Proposer des solutions
✅ S'engager sur les actions

❌ Blâmer des individus
❌ Refaire les débats techniques
❌ Monopoliser la parole
❌ Dire "on ne peut pas"
```

---

## Template de Compte-Rendu

```markdown
# Rétrospective - [Date]

## Participants
- [Nom] (Facilitateur)
- [Nom]
- [Nom]

## Format
[Format utilisé]

## Période Couverte
[Dates ou cycles]

---

## Points Positifs (Keep Doing)
1. [Point 1]
2. [Point 2]
3. [Point 3]

## Points à Améliorer
1. [Point 1]
2. [Point 2]
3. [Point 3]

## Thèmes Discutés

### Thème 1 : [Nom]
**Contexte** : [Description]
**Discussion** : [Résumé]
**Décision** : [Ce qu'on décide]

### Thème 2 : [Nom]
**Contexte** : [Description]
**Discussion** : [Résumé]
**Décision** : [Ce qu'on décide]

---

## Actions

| # | Action | Owner | Deadline | Status |
|---|--------|-------|----------|--------|
| 1 | [Action 1] | [Nom] | [Date] | 🔲 |
| 2 | [Action 2] | [Nom] | [Date] | 🔲 |
| 3 | [Action 3] | [Nom] | [Date] | 🔲 |

---

## Suivi Actions Précédentes

| Action (Rétro précédente) | Status |
|---------------------------|--------|
| [Action 1] | ✅ Fait |
| [Action 2] | 🔄 En cours |
| [Action 3] | ❌ Abandonné - [raison] |

---

## Feedback sur la Rétro
- Format : [Note /5]
- Durée : [Trop court / OK / Trop long]
- Suggestions : [...]

---

Compte-rendu partagé le [Date] par [Facilitateur]
```

---

## Bonnes Pratiques

### Sécurité Psychologique

```markdown
## Créer un Environnement Safe

### Au Début
- Rappeler que c'est un espace safe
- Pas de jugement, pas de blâme
- Focus sur le système, pas les personnes

### Pendant
- Faciliter les silences (laisser réfléchir)
- Valider les émotions exprimées
- Rediriger si quelqu'un est attaqué

### Si Tension
- "On note ce point, on en reparle après"
- Prendre une pause si nécessaire
- Follow-up individuel si besoin
```

### Actions Efficaces

| ✅ Bonne Action | ❌ Mauvaise Action |
|-----------------|-------------------|
| Spécifique et actionnable | Vague et générale |
| Un seul owner | "L'équipe va..." |
| Deadline claire | "Bientôt" |
| Mesurable | Impossible à vérifier |

**Exemples :**
```
❌ "Améliorer la communication"
✅ "Marie organise un daily de 15 min tous les jours à 9h30 dès lundi"

❌ "Moins de bugs"
✅ "Pierre ajoute un check de couverture minimum (80%) en CI d'ici vendredi"
```

### Suivi des Actions

```markdown
## Rituel de Suivi

### Début de Rétro
- Revoir les actions de la rétro précédente
- Status : Fait / En cours / Abandonné
- Célébrer ce qui est fait

### Entre les Rétros
- Actions visibles (board/doc partagé)
- Check-in rapide en standup si pertinent
- Owner responsable de l'avancement
```

---

## Anti-patterns

### 1. "La Rétro Défouloir"

**Symptôme** : Session de plaintes sans solution
```
❌ 45 minutes à lister les problèmes, 0 action
```

**Solution** : Timeboxer la collecte, focus sur les actions
```
✅ 15 min collecte, 30 min discussion/actions
```

### 2. "La Rétro Ignorée"

**Symptôme** : Actions jamais suivies
```
❌ "On avait dit qu'on ferait ça..." (jamais fait)
```

**Solution** : Suivi systématique
```
✅ Revoir les actions en début de chaque rétro
✅ Actions trackées dans un board visible
```

### 3. "La Rétro Blâme"

**Symptôme** : Focus sur les individus, pas le système
```
❌ "C'est à cause de Pierre que..."
```

**Solution** : Règles claires + redirection
```
✅ "On ne cherche pas de coupable"
✅ "Quel process a permis cette situation ?"
```

### 4. "La Rétro Routine"

**Symptôme** : Même format, mêmes discussions, ennui
```
❌ "C'est toujours la même chose..."
```

**Solution** : Varier les formats
```
✅ Alterner les formats
✅ Focus thématique parfois (ex: "rétro sur la qualité")
```

### 5. "Le Silence Radio"

**Symptôme** : Personne ne parle
```
❌ "... Personne n'a rien à dire ?"
```

**Solution** : Techniques de facilitation
```
✅ Écriture silencieuse avant discussion
✅ Tour de table structuré
✅ Sondage anonyme avant si besoin
```

---

## Rétros Thématiques

### Rétro Post-Incident

```markdown
## Post-Mortem / Rétro Incident - [Date]

### Incident
- Date : [Date/heure]
- Durée : [X heures]
- Impact : [Utilisateurs affectés]

### Timeline
| Heure | Événement |
|-------|-----------|
| [H] | [Ce qui s'est passé] |

### Analyse
- Cause immédiate : [...]
- Cause racine : [...]
- Facteurs contributifs : [...]

### Ce qui a bien fonctionné
- [Point 1]

### Ce qui peut être amélioré
- [Point 1]

### Actions Préventives
| Action | Owner | Priorité |
|--------|-------|----------|
| [Action] | [Nom] | [P0/P1] |
```

### Rétro Technique

```markdown
## Rétro Technique - [Date]

### Focus
Architecture / Performance / DX / Tests

### État Actuel
[Description de l'état technique]

### Points Douloureux
- [Pain point 1]
- [Pain point 2]

### Améliorations Proposées
| Amélioration | Effort | Impact | Priorité |
|--------------|--------|--------|----------|
| [Amélio 1] | [S/M/L] | [H/M/L] | [#] |

### Quick Wins Identifiés
- [Quick win 1]
- [Quick win 2]
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
