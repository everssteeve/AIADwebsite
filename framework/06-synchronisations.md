# Les Synchronisations Intentionnelles

## Pourquoi lire cette section ?

Cette section définit les moments où l'équipe se réunit. Sans synchronisations intentionnelles, les équipes tombent dans deux extrêmes : trop de réunions qui tuent la productivité, ou pas assez de communication qui crée des silos. Les synchronisations AIAD remplacent les cérémonies Scrum par des rencontres ciblées et utiles.

**Temps de lecture : 10 minutes**

---

## Le principe fondamental

**Les synchronisations ne sont pas des cérémonies. Ce sont des moments de décision collective.**

### Ce que cela signifie concrètement

| Approche Cérémonie | Approche Synchronisation |
|--------------------|--------------------------|
| Calendrier fixe imposé | Déclenchée par un besoin |
| Participants obligatoires | Participants pertinents |
| Format rigide | Format adapté au contexte |
| Durée standard | Durée minimale nécessaire |

### Les sept caractéristiques d'une synchronisation

| Caractéristique | Description |
|-----------------|-------------|
| **Intentionnelle** | Objectif clair défini avant la réunion |
| **Timeboxée** | Durée maximale définie et respectée |
| **Actionnable** | Génère des décisions et actions assignées |
| **Flexible** | Fréquence et format s'adaptent au contexte |
| **Orientée valeur** | Focus sur outcomes et apprentissage |
| **Documentée** | Notes disponibles pour toute l'équipe |
| **Améliorée** | Feedback régulier sur son utilité |

**L'important n'est pas de suivre un calendrier de cérémonies, mais de se synchroniser quand c'est nécessaire.**

---

## Les cinq synchronisations

### Sync 1 : Alignment Stratégique

**Essence** : S'assurer que l'équipe reste alignée avec la stratégie produit.

**Pourquoi cette sync existe** : Sans alignement régulier, les équipes dérivent. Le Product Goal devient obsolète, les priorités divergent de la stratégie, et l'effort se disperse.

**Quand la déclencher :**

- Mensuel ou bi-mensuel
- Quand un Product Goal est atteint
- Après un pivot stratégique

**Qui participe :** PM + PE + Tech Lead + QA + Stakeholders clés + Supporters

**Durée :** 1h30 - 2h

**Comment ça se passe :**

| Étape | Durée | Focus |
|-------|-------|-------|
| 1. Review des Outcomes | 30min | Outcomes atteints, learnings, effets secondaires |
| 2. Review du Product Goal | 20min | Pertinence, adaptation, prochain goal |
| 3. Priorisation Backlog | 40min | Prochaines priorités, ce qu'on décide de NE PAS faire |
| 4. Feedback Supporters | 20min | Obstacles organisationnels, actions |
| 5. Clôture | 10min | Résumé décisions, actions assignées |

**Ce que produit cette sync :**

- Product Goal validé ou adapté
- Product Backlog priorisé
- Actions Supporters assignées
- Décisions stratégiques documentées

**Comment savoir si c'est réussi :**

| Indicateur | Cible |
|------------|-------|
| Alignement équipe sur Product Goal | 100% |
| Clarté sur 5 prochaines priorités | Cristalline |
| Actions Supporters complétées | >80% |

**Anti-pattern** : L'alignement stratégique qui devient une revue de status de 3 heures, ou la réunion fantôme où personne ne prend de décision.

> *Voir Annexe D.1 pour le template de notes*

---

### Sync 2 : Demo & Feedback

**Essence** : Obtenir du feedback direct sur les fonctionnalités livrées.

**Pourquoi cette sync existe** : Le code en production n'a de valeur que si les utilisateurs l'adoptent. Sans feedback rapide, les équipes construisent des fonctionnalités que personne n'utilise.

**Quand la déclencher :**

- Hebdomadaire
- Après chaque feature majeure
- Quand du feedback est nécessaire pour décider

**Qui participe :** PM + PE + Utilisateurs/Clients/Stakeholders concernés

**Durée :** 30min - 1h

**Comment ça se passe :**

| Étape | Durée | Focus |
|-------|-------|-------|
| 1. Démonstration | 15-20min | PE montre les fonctionnalités, focus usage réel |
| 2. Feedback qualitatif | 20-30min | Questions ouvertes, discussion |
| 3. Analyse données | 10min | Métriques d'usage si disponibles |
| 4. Adaptation backlog | 10min | Nouvelles stories, repriorisation |

**Ce que produit cette sync :**

- Feedback utilisateur documenté
- Nouvelles user stories (si pertinent)
- Product Backlog repriorisé si nécessaire
- Décisions d'itération ou pivot

**Comment savoir si c'est réussi :**

| Indicateur | Cible |
|------------|-------|
| Insights actionnables par session | >3 |
| Satisfaction utilisateur sur features | >8/10 |
| Participation stakeholders | >70% |

**Anti-pattern** : La démo PowerPoint sans produit réel, ou la session où seul le PM parle pendant que les utilisateurs écoutent passivement.

> *Voir Annexe D.2 pour le template et questions type*

---

### Sync 3 : Tech Review

**Essence** : Assurer la cohérence technique et gérer la dette.

**Pourquoi cette sync existe** : Sans revue technique régulière, l'architecture dérive par accident. La dette technique s'accumule invisiblement jusqu'à paralyser l'équipe.

**Quand la déclencher :**

- Mensuel
- Après changements architecturaux majeurs
- Quand la dette technique devient problématique

**Qui participe :** Tech Lead + PE + Agents Engineer (+ QA si pertinent)

**Durée :** 1h - 2h

**Comment ça se passe :**

| Étape | Durée | Focus |
|-------|-------|-------|
| 1. Review Architecture | 30min | ARCHITECTURE à jour, dérives, adaptations |
| 2. Review Dette Technique | 30min | Niveau dette, priorités remédiation |
| 3. Review Écosystème Agents | 30min | Performance agents, ajouts/retraits |
| 4. Partage Learnings | 20min | Nouveaux patterns, anti-patterns |
| 5. Clôture | 10min | Décisions, plan remédiation |

**Ce que produit cette sync :**

- Document ARCHITECTURE mis à jour
- Plan de remédiation dette technique
- Catalogue d'agents adapté
- AGENT-GUIDE mis à jour
- ADR pour décisions majeures

**Comment savoir si c'est réussi :**

| Indicateur | Cible |
|------------|-------|
| Dette technique | Tendance stable ou décroissante |
| Performance agents | Amélioration continue |
| AGENT-GUIDE | Mis à jour mensuellement |
| Participation PE | >80% |

**Anti-pattern** : La tech review qui devient un débat philosophique sans décision, ou la revue superficielle "tout va bien" qui ignore les vrais problèmes.

> *Voir Annexe D.3 pour le template et critères de priorisation*

---

### Sync 4 : Rétrospective

**Essence** : Améliorer continuellement l'efficacité et le bien-être de l'équipe.

**Pourquoi cette sync existe** : Une équipe qui ne s'améliore pas régresse. La rétrospective est le mécanisme d'apprentissage collectif qui transforme les erreurs en améliorations.

**Quand la déclencher :**

- Hebdomadaire ou bi-hebdomadaire
- Après un incident majeur
- Quand l'équipe sent le besoin

**Qui participe :** PE + PM + Agents Engineer + QA + Tech Lead

**Durée :** 45min - 1h

**Comment ça se passe :**

| Étape | Durée | Focus |
|-------|-------|-------|
| 1. Rétrospective classique | 30min | Start / Stop / Continue (ou autre format) |
| 2. Rétrospective IA | 20min | Prompts efficaces, erreurs agents, AGENT-GUIDE |
| 3. Amélioration workflow | 10min | Goulots, collaboration, synchronisations |
| 4. Engagement | 10min | 1-3 actions max, owners, deadlines |

**Formats de facilitation à varier :**

- Start / Stop / Continue
- Mad / Sad / Glad
- 4Ls : Liked / Learned / Lacked / Longed For
- Sailboat (visuel)
- Timeline

**Ce que produit cette sync :**

- Actions d'amélioration (1-3 max)
- AGENT-GUIDE mis à jour avec learnings
- Engagement collectif sur actions

**Comment savoir si c'est réussi :**

| Indicateur | Cible |
|------------|-------|
| Participation équipe | 100% |
| Actions complétées (review retro suivante) | >80% |
| Satisfaction équipe | >7/10, tendance stable ou croissante |
| Amélioration implémentée par retro | ≥1 |

**Anti-pattern** : La rétrospective où tout le monde dit "ça va" sans rien changer, ou celle qui génère 15 actions dont aucune n'est jamais faite.

> *Voir Annexe D.4 pour le template et formats de facilitation*

---

### Sync 5 : Standup Quotidien (Optionnel)

**Essence** : Synchronisation rapide pour aligner le travail en cours.

**Pourquoi cette sync existe** : Certaines équipes ont besoin de se synchroniser quotidiennement pour éviter les blocages et maintenir le flux. D'autres non. C'est un outil, pas une obligation.

**Quand la déclencher :**

- Quotidien si l'équipe le souhaite
- Peut être remplacé par un standup asynchrone

**Qui participe :** PE (+ autres rôles si souhaité)

**Durée :** 5-15 minutes MAX

**Format synchrone :**

Chaque membre partage (1-2min max) :
1. Sur quoi je travaille actuellement
2. Ce que je prévois de faire aujourd'hui
3. Blocages éventuels

**Format asynchrone (recommandé pour équipes distribuées) :**

Via Slack/Teams, chaque matin :
- **Hier :** [Ce que j'ai fait]
- **Aujourd'hui :** [Ce que je prévois]
- **Blocages :** [Aucun / Description]

**Comment savoir si c'est réussi :**

| Indicateur | Cible |
|------------|-------|
| Participation | >90% |
| Durée respectée | <15min |
| Blocages résolus dans la journée | >80% |

**Anti-patterns :**

- Le standup de 45min qui devient réunion de status
- Les débats techniques pendant le standup
- Le micro-management déguisé
- L'obligation rigide sans valeur ajoutée

> *Voir Annexe D.5 pour exemples de standup efficaces*

---

## Erreurs fréquentes

### "On fait toutes les syncs chaque semaine"

**Le problème** : Surcharge de réunions. L'équipe passe plus de temps à se synchroniser qu'à produire.

**La réalité** : Adapter la fréquence au besoin. Une équipe mature peut espacer certaines syncs.

### "Les syncs durent toujours plus longtemps que prévu"

**Le problème** : Pas de timebox respecté, pas d'agenda clair, discussions qui dérivent.

**La réalité** : Définir l'agenda et la durée à l'avance. Couper les discussions hors-sujet. "On en parle après."

### "Personne ne prépare les syncs"

**Le problème** : Les syncs deviennent des sessions d'improvisation inefficaces.

**La réalité** : Chaque sync a un owner qui prépare l'agenda et les inputs nécessaires.

---

## En résumé

| Sync | Question centrale | Fréquence typique |
|------|-------------------|-------------------|
| **Alignment Stratégique** | Où va-t-on ? | Mensuel |
| **Demo & Feedback** | Est-ce que ça plaît ? | Hebdo |
| **Tech Review** | Est-ce solide ? | Mensuel |
| **Rétrospective** | Comment s'améliorer ? | Hebdo/Bi-hebdo |
| **Standup** | Où en est-on ? | Quotidien (optionnel) |

---

*Prochaine section : [L'Écosystème d'Agents](07-ecosysteme.md)*
