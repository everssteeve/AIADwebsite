# PARTIE 6 : RITUELS ET AMÉLIORATION CONTINUE

Cette partie couvre les synchronisations régulières et le processus d'amélioration continue de l'équipe et du framework AIAD lui-même.

> 📖 Référence : @framework/06-synchronisations.md + @framework/07-metriques.md

---

## 6.1 Étape : Standup Quotidien

| | |
|---|---|
| 🎭 **ACTEUR** | PE (animateur tournant) |
| 📥 **ENTRÉES** | Travail de la veille, plan du jour, blocages éventuels |
| 📤 **SORTIES** | Équipe synchronisée, blocages identifiés |
| ⏱️ **DURÉE** | 5-15 minutes MAX |
| 🔗 **DÉPENDANCES** | Aucune |

### 6.1.1 Format synchrone

Chaque membre partage en 1-2 minutes maximum :

| Question | Focus |
|----------|-------|
| Sur quoi je travaille actuellement ? | SPEC en cours, avancement |
| Que vais-je faire aujourd'hui ? | Plan du jour |
| Ai-je des blocages ? | Obstacles nécessitant aide |

**Questions spécifiques IA à intégrer :**

| Question | Objectif |
|----------|----------|
| L'agent a-t-il eu des difficultés hier ? | Identifier patterns problématiques |
| Le AGENT-GUIDE a-t-il besoin d'une mise à jour ? | Maintenir documentation à jour |

### 6.1.2 Format asynchrone

Pour les équipes distribuées, postez chaque matin sur Slack/Teams :

```
**Hier :** [Ce que j'ai fait]
**Aujourd'hui :** [Ce que je prévois]
**Blocages :** [Aucun / Description]
**Note IA :** [Comportement agent notable / RAS]
```

### 6.1.3 Règles strictes

| Règle | Justification |
|-------|---------------|
| Durée < 15 minutes | Évite la dérive en réunion de status |
| Pas de débat technique | Reporter après le standup |
| Debout si en présentiel | Incite à la concision |
| Même heure chaque jour | Crée une habitude |

> ⚠️ **Anti-pattern** : Le standup de 45 minutes qui devient réunion de coordination. Si cela arrive régulièrement, réduisez le scope ou passez en asynchrone.

---

## 6.2 Étape : Demo & Feedback

| | |
|---|---|
| 🎭 **ACTEUR** | PE (démonstrateur) + PM (facilitateur) |
| 📥 **ENTRÉES** | Fonctionnalités livrées de la semaine |
| 📤 **SORTIES** | Feedback documenté, backlog repriorisé |
| ⏱️ **DURÉE** | 30 minutes - 1 heure |
| 🔗 **DÉPENDANCES** | Fonctionnalités déployées en staging ou production |

### 6.2.1 Déroulé

| Étape | Durée | Contenu |
|-------|-------|---------|
| 1. Démonstration | 15-20 min | PE montre les fonctionnalités en conditions réelles |
| 2. Feedback qualitatif | 20-30 min | Questions ouvertes, discussion avec utilisateurs |
| 3. Analyse données | 10 min | Métriques d'usage si disponibles |
| 4. Adaptation backlog | 10 min | Nouvelles stories, repriorisation |

### 6.2.2 Questions à poser aux utilisateurs

```
- Cette fonctionnalité résout-elle votre problème initial ?
- Qu'est-ce qui vous a surpris (positif ou négatif) ?
- Qu'auriez-vous fait différemment ?
- Manque-t-il quelque chose d'essentiel ?
- Recommanderiez-vous cette fonctionnalité à un collègue ?
```

### 6.2.3 Template de notes

```markdown
# Demo & Feedback - [Date]

## Fonctionnalités présentées
- [ ] [Nom feature 1] - SPEC: [lien]
- [ ] [Nom feature 2] - SPEC: [lien]

## Feedback collecté
| Feature | Feedback | Action |
|---------|----------|--------|
| [Feature 1] | [Verbatim utilisateur] | [Action décidée] |

## Métriques d'usage
- Taux d'adoption : [X%]
- Temps moyen d'utilisation : [X min]

## Décisions
- [ ] [Décision 1]
- [ ] [Décision 2]

## Prochaines actions
| Action | Responsable | Échéance |
|--------|-------------|----------|
| [Action] | [Nom] | [Date] |
```

> 💡 **Conseil** : Invitez de vrais utilisateurs, pas seulement des stakeholders internes. Le feedback terrain est irremplaçable.

---

## 6.3 Étape : Tech Review

| | |
|---|---|
| 🎭 **ACTEUR** | Tech Lead (animateur) + PE + Agents Engineer |
| 📥 **ENTRÉES** | ARCHITECTURE, dette technique, performance agents |
| 📤 **SORTIES** | ARCHITECTURE mis à jour, plan de remédiation, AGENT-GUIDE amélioré |
| ⏱️ **DURÉE** | 1-2 heures |
| 🔗 **DÉPENDANCES** | Métriques de la période écoulée |

### 6.3.1 Déroulé

| Étape | Durée | Focus |
|-------|-------|-------|
| 1. Review Architecture | 30 min | ARCHITECTURE à jour ? Dérives ? Adaptations ? |
| 2. Review Dette Technique | 30 min | Niveau dette, priorités remédiation |
| 3. Review Écosystème Agents | 30 min | Performance agents, ajouts/retraits |
| 4. Partage Learnings | 20 min | Nouveaux patterns, anti-patterns |
| 5. Clôture | 10 min | Décisions, plan d'action |

### 6.3.2 Questions de review architecture

```
- L'ARCHITECTURE reflète-t-elle l'état réel du code ?
- Y a-t-il des décisions architecturales non documentées ?
- Quels ADR faut-il créer ?
- La dette technique est-elle sous contrôle ?
```

### 6.3.3 Questions de review écosystème IA

| Question | Action si problème |
|----------|-------------------|
| Les agents atteignent-ils >70% de First-Time Success ? | Améliorer AGENT-GUIDE ou SPECs |
| Quels prompts ont particulièrement bien fonctionné ? | Documenter dans AGENT-GUIDE |
| Quelles erreurs récurrentes observer ? | Ajouter garde-fous dans AGENT-GUIDE |
| Les SubAgents sont-ils efficaces ? | Ajuster configuration ou retirer |
| Le ratio code généré/manuel reste-t-il >80/20 ? | Investiguer cause racine |

### 6.3.4 Template de compte-rendu

```markdown
# Tech Review - [Date]

## État Architecture
- Conformité ARCHITECTURE : [Conforme / Dérives identifiées]
- ADR à créer : [Liste]

## Dette Technique
| Élément | Criticité | Action | Responsable |
|---------|-----------|--------|-------------|
| [Dette 1] | Haute/Moyenne/Basse | [Action] | [Nom] |

## Performance Agents
- First-Time Success Rate : [X%]
- Ratio généré/manuel : [X/Y]
- Problèmes récurrents : [Liste]

## Mises à jour AGENT-GUIDE
- [ ] [Amélioration 1]
- [ ] [Amélioration 2]

## Décisions
- [ ] [Décision 1] - ADR: [lien si créé]
```

---

## 6.4 Étape : Rétrospective

| | |
|---|---|
| 🎭 **ACTEUR** | PE (facilitateur tournant) + PM + QA + Tech Lead |
| 📥 **ENTRÉES** | Expérience de la période écoulée, métriques |
| 📤 **SORTIES** | 1-3 actions d'amélioration, AGENT-GUIDE mis à jour |
| ⏱️ **DURÉE** | 45 minutes - 1 heure |
| 🔗 **DÉPENDANCES** | Métriques de la semaine |

### 6.4.1 Déroulé

| Étape | Durée | Focus |
|-------|-------|-------|
| 1. Rétrospective classique | 30 min | Start / Stop / Continue |
| 2. Rétrospective IA | 20 min | Prompts, agents, AGENT-GUIDE |
| 3. Engagement | 10 min | 1-3 actions max avec owners |

### 6.4.2 Format Start / Stop / Continue

| Catégorie | Question |
|-----------|----------|
| **START** | Qu'est-ce qu'on devrait commencer à faire ? |
| **STOP** | Qu'est-ce qu'on devrait arrêter de faire ? |
| **CONTINUE** | Qu'est-ce qu'on devrait continuer à faire ? |

**Autres formats à alterner :**

| Format | Description |
|--------|-------------|
| Mad / Sad / Glad | Émotions de la période |
| 4Ls | Liked / Learned / Lacked / Longed For |
| Sailboat | Ancres (freins) / Voiles (accélérateurs) |
| Timeline | Événements clés sur frise chronologique |

### 6.4.3 Questions spécifiques Rétrospective IA

Exécutez cette partie systématiquement :

```
1. Quels prompts ont particulièrement bien fonctionné cette semaine ?
   → Documenter dans AGENT-GUIDE

2. Quelles erreurs récurrentes avons-nous observées avec les agents ?
   → Ajouter des garde-fous dans AGENT-GUIDE

3. Le AGENT-GUIDE est-il à jour par rapport aux apprentissages ?
   → Planifier mise à jour si nécessaire

4. Les SubAgents configurés sont-ils toujours pertinents ?
   → Ajuster configuration si besoin

5. Comment améliorer la qualité des SPECs pour les agents ?
   → Actions concrètes d'amélioration
```

### 6.4.4 Règle des 1-3 actions

| Règle | Justification |
|-------|---------------|
| Maximum 3 actions | Évite dispersion, augmente taux de complétion |
| Chaque action a un owner | Responsabilité claire |
| Chaque action a une deadline | Permet suivi |
| Review en début de prochaine rétro | Boucle de feedback |

> ⚠️ **Anti-pattern** : La rétrospective qui génère 15 actions dont aucune n'est jamais faite. Moins d'actions, mieux exécutées.

### 6.4.5 Template de rétrospective

```markdown
# Rétrospective - [Date]

## Participants
- [Liste des présents]

## Format utilisé
[Start/Stop/Continue | Mad/Sad/Glad | 4Ls | Autre]

## Rétrospective classique

### START
- [Point 1]
- [Point 2]

### STOP
- [Point 1]

### CONTINUE
- [Point 1]

## Rétrospective IA
| Question | Constat | Action |
|----------|---------|--------|
| Prompts efficaces | [Constat] | Documenter dans AGENT-GUIDE |
| Erreurs récurrentes | [Constat] | [Action corrective] |
| AGENT-GUIDE à jour ? | [Oui/Non] | [Action si non] |

## Actions décidées
| Action | Owner | Deadline | Statut |
|--------|-------|----------|--------|
| [Action 1] | [Nom] | [Date] | En cours |

## Review actions précédentes
| Action précédente | Statut | Commentaire |
|-------------------|--------|-------------|
| [Action] | Fait/Partiel/Non fait | [Commentaire] |
```

---

## 6.5 Étape : Alignment Stratégique

| | |
|---|---|
| 🎭 **ACTEUR** | PM (animateur) + PE + Tech Lead + QA + Stakeholders + Supporters |
| 📥 **ENTRÉES** | Outcomes de la période, Product Goal, métriques |
| 📤 **SORTIES** | Product Goal validé/adapté, backlog priorisé, actions Supporters |
| ⏱️ **DURÉE** | 1h30 - 2 heures |
| 🔗 **DÉPENDANCES** | Métriques du mois écoulé |

### 6.5.1 Déroulé

| Étape | Durée | Focus |
|-------|-------|-------|
| 1. Review des Outcomes | 30 min | Outcomes atteints, learnings, effets secondaires |
| 2. Review du Product Goal | 20 min | Pertinence, adaptation, prochain goal |
| 3. Priorisation Backlog | 40 min | Prochaines priorités, ce qu'on décide de NE PAS faire |
| 4. Feedback Supporters | 20 min | Obstacles organisationnels, actions |
| 5. Clôture | 10 min | Résumé décisions, actions assignées |

### 6.5.2 Questions clés

```
- Les Outcome Criteria définis ont-ils été atteints ?
- Le Product Goal actuel est-il toujours pertinent ?
- Quelles sont les 5 prochaines priorités ?
- Qu'est-ce qu'on décide explicitement de NE PAS faire ?
- Quels obstacles organisationnels bloquent l'équipe ?
```

### 6.5.3 Template de compte-rendu

```markdown
# Alignment Stratégique - [Date]

## Review Outcomes
| Outcome | Criteria | Atteint ? | Learning |
|---------|----------|-----------|----------|
| [Outcome 1] | [Criteria] | Oui/Partiel/Non | [Learning] |

## Product Goal
- Goal actuel : [Description]
- Statut : [En cours / Atteint / À adapter]
- Prochain goal : [Si changement]

## Priorisation Backlog
### Top 5 priorités
1. [Priorité 1]
2. [Priorité 2]
3. [Priorité 3]
4. [Priorité 4]
5. [Priorité 5]

### Ce qu'on ne fait PAS
- [Élément dé-priorisé 1]
- [Élément dé-priorisé 2]

## Actions Supporters
| Obstacle | Action | Supporter | Deadline |
|----------|--------|-----------|----------|
| [Obstacle] | [Action] | [Nom] | [Date] |

## Décisions stratégiques
- [ ] [Décision 1]
- [ ] [Décision 2]
```

---

## 6.6 Métriques essentielles

> 📖 Référence : @framework/07-metriques.md

### 6.6.1 Dashboard hebdomadaire (pour l'équipe)

| Catégorie | Métrique | Cible |
|-----------|----------|-------|
| **Productivité** | Cycle Time | <3 jours |
| | Throughput | Stable ou croissant |
| **Qualité** | First-Time Success Rate | >70% |
| | Couverture tests | >80% |
| | Bugs production | Tendance décroissante |
| **Efficacité IA** | Adoption agents | >90% |
| | First-Time Success agents | >70% |
| | Ratio généré/manuel | >80/20 |
| **Équipe** | Satisfaction équipe | >7/10 |

### 6.6.2 Dashboard mensuel (pour PM + Stakeholders)

| Catégorie | Métrique | Cible |
|-----------|----------|-------|
| **Outcomes** | Atteinte Outcome Criteria | >70% |
| | Satisfaction utilisateur | >8/10 |
| | Adoption fonctionnalités | >60% en 1 mois |
| **Vélocité** | Lead Time | <2 semaines |
| **Santé technique** | Dette technique | Stable ou décroissante |

### 6.6.3 Seuils d'alerte

| Signal | Seuil | Action immédiate |
|--------|-------|------------------|
| Cycle Time | >6 jours | Analyse blocages |
| First-Time Success | <50% | Review SPECs et AGENT-GUIDE |
| Satisfaction équipe | <6/10 | Discussion 1:1 urgente |
| Bugs production | Tendance croissante | Tech Review extraordinaire |

---

## 6.7 Processus PDCA d'amélioration

### 6.7.1 Le cycle PDCA

| Phase | Action | Exemple |
|-------|--------|---------|
| **PLAN** | Identifier problème + cause racine + hypothèse | "Cycle Time élevé car SPECs trop vagues" |
| **DO** | Implémenter changement à petite échelle | Template SPEC amélioré sur 3 features |
| **CHECK** | Analyser avant/après | Cycle Time passé de 5j à 3j |
| **ACT** | Standardiser si succès, réessayer si échec | Nouveau template SPEC adopté |

### 6.7.2 Technique des 5 Pourquoi

Pour identifier la cause racine d'un problème :

```
1. Pourquoi le Cycle Time a augmenté ?
   → Les agents mettent plus de temps

2. Pourquoi les agents mettent plus de temps ?
   → Ils font plus d'erreurs

3. Pourquoi font-ils plus d'erreurs ?
   → Les SPECs sont moins claires

4. Pourquoi les SPECs sont moins claires ?
   → Nouveau PM pas encore formé

5. Pourquoi pas encore formé ?
   → Pas de processus d'onboarding SPECs

→ ACTION : Créer un guide d'onboarding pour la rédaction de SPECs
```

### 6.7.3 Cadence d'amélioration

| Fréquence | Activité | Responsable |
|-----------|----------|-------------|
| Quotidien | Monitoring automatique (alertes) | Système |
| Hebdomadaire | Review métriques équipe (Rétrospective) | Équipe |
| Mensuel | Review métriques outcomes (Alignment) | PM + Stakeholders |
| Trimestriel | Review du framework AIAD lui-même | Équipe + Supporters |

---

## 6.8 Revue trimestrielle du framework

### 6.8.1 Les six questions

| # | Question | Focus |
|---|----------|-------|
| 1 | Les boucles itératives sont-elles fluides ? | Frictions, goulots, étapes à modifier |
| 2 | Les synchronisations sont-elles utiles ? | Valeur apportée, fréquence, format |
| 3 | Les artefacts sont-ils vivants et utiles ? | PRD, ARCHITECTURE, AGENT-GUIDE à jour et utilisés |
| 4 | L'écosystème d'agents est-il optimal ? | Performance >80%, nouveaux agents à explorer |
| 5 | Les métriques sont-elles actionnables ? | Informent décisions, vanity metrics à retirer |
| 6 | L'équipe est-elle épanouie ? | Satisfaction >7/10, turnover, équilibre |

### 6.8.2 Template de revue trimestrielle

```markdown
# Revue Trimestrielle AIAD - [Trimestre] [Année]

## 1. Boucles itératives
- Fluides ? [Oui/Non]
- Frictions identifiées : [Liste]
- Modifications proposées : [Liste]

## 2. Synchronisations
| Sync | Utile ? | Fréquence OK ? | Changement proposé |
|------|---------|----------------|-------------------|
| Standup | [Oui/Non] | [Oui/Non] | [Changement] |
| Demo | [Oui/Non] | [Oui/Non] | [Changement] |
| Tech Review | [Oui/Non] | [Oui/Non] | [Changement] |
| Rétrospective | [Oui/Non] | [Oui/Non] | [Changement] |
| Alignment | [Oui/Non] | [Oui/Non] | [Changement] |

## 3. Artefacts
| Artefact | À jour ? | Utilisé ? | Action |
|----------|----------|-----------|--------|
| PRD | [Oui/Non] | [Oui/Non] | [Action] |
| ARCHITECTURE | [Oui/Non] | [Oui/Non] | [Action] |
| AGENT-GUIDE | [Oui/Non] | [Oui/Non] | [Action] |

## 4. Écosystème agents
- Performance globale : [X%]
- Agents à retirer : [Liste]
- Agents à explorer : [Liste]

## 5. Métriques
- Métriques actionnables : [Liste]
- Vanity metrics à retirer : [Liste]
- Métriques à ajouter : [Liste]

## 6. Équipe
- Satisfaction moyenne : [X/10]
- Turnover : [X%]
- Points d'attention : [Liste]

## Décisions
- [ ] [Décision 1]
- [ ] [Décision 2]

## Plan d'action
| Action | Responsable | Deadline |
|--------|-------------|----------|
| [Action] | [Nom] | [Date] |
```

---

## 6.9 Récapitulatif des synchronisations

| Sync | Question centrale | Fréquence | Durée |
|------|-------------------|-----------|-------|
| **Standup** | Où en est-on ? | Quotidien (optionnel) | 5-15 min |
| **Demo & Feedback** | Est-ce que ça plaît ? | Hebdomadaire | 30 min - 1h |
| **Tech Review** | Est-ce solide ? | Mensuel | 1-2h |
| **Rétrospective** | Comment s'améliorer ? | Hebdo/Bi-hebdo | 45 min - 1h |
| **Alignment Stratégique** | Où va-t-on ? | Mensuel | 1h30 - 2h |

---

## 6.10 Problèmes courants

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| Syncs trop longues | Pas de timebox respecté, discussions qui dérivent | Définir agenda et durée à l'avance, couper hors-sujet |
| Personne ne prépare | Pas d'owner désigné | Assigner un responsable pour chaque sync |
| Actions jamais faites | Trop d'actions, pas de suivi | Max 3 actions par rétro, review systématique |
| AGENT-GUIDE jamais mis à jour | Pas intégré aux rituels | Question systématique en rétro |
| Métriques ignorées | Trop de métriques, pas actionnables | Réduire à 5-7 métriques essentielles |
| Rétro où "tout va bien" | Psychological safety insuffisant | Changer de format, facilitateur externe |

> ⚠️ **ESCALADE** : Si les synchronisations sont systématiquement boycottées ou si la satisfaction équipe passe sous 5/10, impliquez les Supporters immédiatement.

---

## 6.11 Checklist de validation

| ✓ | Élément | Vérification |
|---|---------|--------------|
| ☐ | Standup en place | Format défini (sync ou async), durée <15min |
| ☐ | Demo hebdomadaire | Utilisateurs invités, feedback documenté |
| ☐ | Tech Review mensuelle | ARCHITECTURE et dette technique reviewés |
| ☐ | Rétrospective régulière | Actions générées et suivies |
| ☐ | Alignment mensuel | Product Goal et priorités validés |
| ☐ | Métriques suivies | Dashboard hebdo et mensuel en place |
| ☐ | PDCA pratiqué | Au moins 1 amélioration par mois |
| ☐ | Revue trimestrielle planifiée | Date fixée, participants identifiés |

---

*Partie suivante : [07-annexes.md](07-annexes.md)*
