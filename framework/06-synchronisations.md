# Synchronisations Intentionnelles

## Principes Transversaux

Les synchronisations remplacent les cérémonies Scrum rigides. Elles sont :

1. **Intentionnelles** : Objectif clair et participants pertinents
2. **Timeboxées** : Durée maximale définie et RESPECTÉE
3. **Actionnables** : Génèrent des décisions concrètes et actions assignées
4. **Flexibles** : Fréquence et format s'adaptent au contexte
5. **Orientées Valeur** : Focus sur valeur, outcomes, apprentissage
6. **Documentées** : Notes disponibles pour toute l'équipe
7. **Améliorées Continuellement** : Feedback régulier sur leur utilité

---

## Les 5 Synchronisations Clés

### Sync 1 : Alignment Stratégique

**Objectif :** S'assurer que l'équipe reste alignée avec la stratégie produit et adapter le Product Goal si nécessaire.

**Fréquence :** Mensuel ou Bi-Mensuel (ou quand Product Goal atteint)

**Participants :** PM + PE + Tech Lead + QA + Stakeholders clés + Supporters

**Durée :** 1.5 - 2h

**Agenda principal :**
1. Review des Outcomes (30min) : Outcomes atteints, learnings, side effects
2. Review du Product Goal (20min) : Pertinence, adaptation, prochain goal
3. Priorisation Product Backlog (40min) : Prochaines priorités, ce qu'on décide de NE PAS faire
4. Feedback Supporters (20min) : Obstacles organisationnels, actions
5. Actions et Décisions (10min) : Résumé, Product Goal validé, actions assignées

**Livrables :**
- [ ] Product Goal validé ou adapté
- [ ] Product Backlog à jour et priorisé
- [ ] Liste d'actions Supporters
- [ ] Décisions stratégiques documentées

**Indicateurs de succès :**
- Alignement équipe sur Product Goal : 100%
- Clarté sur 5 prochaines priorités : Cristalline
- Actions Supporters complétées : >80%

> 📖 *Voir Annexe D.1 pour le template de notes et exemples*

---

### Sync 2 : Demo & Feedback Utilisateurs

**Objectif :** Obtenir du feedback direct et rapide des utilisateurs/clients/stakeholders sur les fonctionnalités livrées.

**Fréquence :** Hebdomadaire OU après chaque feature majeure

**Participants :** PM + PE + Utilisateurs/Clients/Stakeholders concernés

**Durée :** 30min - 1h

**Agenda principal :**
1. Démonstration (15-20min) : PE montre fonctionnalités, focus usage réel
2. Feedback Qualitatif (20-30min) : Questions ouvertes, discussion
3. Analyse des Données (10min) : Métriques d'usage si disponibles
4. Adaptation Product Backlog (10min) : Nouvelles stories, repriorisation

**Livrables :**
- [ ] Feedback utilisateur documenté
- [ ] Nouvelles user stories ajoutées (si pertinent)
- [ ] Product Backlog repriorisé si nécessaire
- [ ] Décisions d'itération ou pivot documentées

**Indicateurs de succès :**
- Feedback actionnable obtenu : >3 insights par session
- Satisfaction utilisateur sur features : >8/10
- Taux participation stakeholders : >70%

> 📖 *Voir Annexe D.2 pour le template de notes et questions type*

---

### Sync 3 : Tech Review

**Objectif :** Assurer cohérence technique et excellence architecturale, gérer dette technique, optimiser écosystème d'agents.

**Fréquence :** Mensuel OU après changements architecturaux majeurs

**Participants :** Tech Lead + PE + Agents Engineer (+ QA si pertinent)

**Durée :** 1 - 2h

**Agenda principal :**
1. Review de l'Architecture (30min) : ARCHITECTURE à jour, dérives, adaptations
2. Review Dette Technique (30min) : Niveau dette, priorités remédiation, prévention
3. Review Écosystème Agents (30min) : Pertinence agents, performance, ajouts/retraits
4. Partage Pratiques et Learnings (20min) : Nouveaux patterns, anti-patterns
5. Actions et Décisions (10min) : Résumé décisions, plan remédiation

**Livrables :**
- [ ] Document ARCHITECTURE mis à jour (si changements)
- [ ] Plan de remédiation dette technique
- [ ] Catalogue d'agents adapté
- [ ] AGENT-GUIDE mis à jour
- [ ] ADR pour décisions majeures

**Indicateurs de succès :**
- Dette technique : tendance décroissante ou stable
- Performance agents : amélioration continue
- AGENT-GUIDE : mis à jour mensuellement minimum
- Participation PE : >80%

> 📖 *Voir Annexe D.3 pour le template de notes et critères de priorisation dette*

---

### Sync 4 : Retrospective d'Équipe

**Objectif :** Amélioration continue de l'efficacité, du bien-être et de la collaboration de l'équipe.

**Fréquence :** Hebdomadaire ou Bi-Hebdomadaire

**Participants :** PE + PM + Agents Engineer + QA + Tech Lead

**Durée :** 45min - 1h

**Agenda principal :**
1. Rétrospective Classique (30min) : Start / Stop / Continue (ou autre format)
2. Rétrospective IA Spécifique (20min) : Prompts efficaces, erreurs récurrentes agents, AGENT-GUIDE
3. Amélioration Workflow (10min) : Goulots, collaboration, synchronisations
4. Actions et Engagement (10min) : 1-3 actions max, owners, deadlines

**Formats de Facilitation (à varier) :**
- Start / Stop / Continue
- Mad / Sad / Glad
- 4Ls : Liked / Learned / Lacked / Longed For
- Sailboat (visuel)
- Timeline

**Livrables :**
- [ ] Actions d'amélioration (1-3 max)
- [ ] AGENT-GUIDE mis à jour avec learnings
- [ ] Engagement collectif sur actions

**Indicateurs de succès :**
- Participation équipe : 100%
- Actions complétées (review retro suivante) : >80%
- Satisfaction équipe : tendance croissante ou stable >7/10
- Amélioration continue : ≥1 action implémentée par retro

> 📖 *Voir Annexe D.4 pour le template de notes et formats de facilitation*

---

### Sync 5 : Standup Quotidien (OPTIONNEL)

**Objectif :** Synchronisation rapide quotidienne pour aligner travail en cours et identifier blocages.

**Fréquence :** Quotidien (si l'équipe le souhaite)

**Participants :** PE (+ autres rôles si souhaité)

**Durée :** 5 - 15 minutes MAX

**Format A : Synchrone**
Chaque membre partage (1-2min max) :
1. Sur quoi je travaille actuellement
2. Ce que je prévois de faire aujourd'hui
3. Blocages éventuels

**Format B : Asynchrone** (recommandé pour équipes distribuées)
Via Slack/Teams, chaque matin :
- **Hier :** [Ce que j'ai fait]
- **Aujourd'hui :** [Ce que je prévois]
- **Blocages :** [Aucun / Description]

**Indicateurs de succès :**
- Participation : >90%
- Durée respectée : <15min
- Blocages résolus dans la journée : >80%

**Anti-patterns :**
- 🚫 Standup de 45min qui devient réunion de status
- 🚫 Débats techniques pendant le standup
- 🚫 Micro-management déguisé
- 🚫 Obligation rigide sans valeur ajoutée

> 📖 *Voir Annexe D.5 pour exemples de standup efficaces*
