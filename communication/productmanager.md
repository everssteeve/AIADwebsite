# AIAD pour le Product Manager

## En 30 secondes

**AIAD (AI-Agent Iterative Development)** transforme le rôle du Product Manager : vous ne gérez plus des tickets et des vélocités, vous orchestrez la création de valeur. Avec des agents IA qui génèrent 80% du code, votre capacité à définir clairement le "quoi" et le "pourquoi" devient le facteur limitant de la productivité de l'équipe.

---

## Ce qui change pour vous

### Avant vs Avec AIAD

| Avant | Avec AIAD |
|-------|-----------|
| Rédiger des tickets vagues, clarifier pendant le dev | Rédiger des SPECs précises une fois, générer du code correct |
| Mesurer la vélocité (points livrés) | Mesurer les outcomes (valeur créée) |
| Planifier des Sprints de 2 semaines | Flux continu, cadence adaptée à la complexité |
| Attendre la fin du Sprint pour voir le résultat | Valider en continu, pivoter rapidement |
| Estimer en jours/semaines | Feature livrée en heures/jours |

### L'exemple concret

**Approche traditionnelle :**
1. Vous rédigez un ticket "Ajouter le login social" → 10 min
2. Développeur interprète, code → 3 jours
3. Vous découvrez que ce n'est pas ce que vous vouliez → retravail 1 jour
4. **Total : 4+ jours, frustration des deux côtés**

**Avec AIAD :**
1. Vous rédigez une SPEC précise avec outcomes → 30 min
2. Product Engineer orchestre l'agent IA → 2h
3. Validation immédiate → 30 min
4. **Total : 3h, résultat conforme**

**La différence ?** 30 minutes de réflexion en amont remplacent des jours de corrections.

---

## Votre nouveau rôle

### Ce que vous faites

| Responsabilité | Fréquence |
|----------------|-----------|
| Définir le Product Goal (horizon 4-12 semaines) | lors de Alignement Stratégique (moment choisi)  |
| Maintenir le backlog ordonné par valeur | Continu |
| Conduire la discovery (problème → solution → validation) | Hebdomadaire |
| Définir les Outcome Criteria de chaque fonctionnalité | Par fonctionnalité |
| Mesurer l'impact réel des releases | Post-release |
| Arbitrer les trade-offs | À la demande |

### Ce que vous ne faites plus

- **Imposer des solutions techniques** : Vous définissez les contraintes et outcomes, l'équipe choisit le "comment"
- **Micro-manager l'exécution** : Vous validez les SPECs en amont, vous faites confiance pour l'implémentation
- **Estimer en points/jours** : La complexité dicte la durée, pas le calendrier
- **Attendre les cérémonies** : Les synchronisations ont lieu quand nécessaires, pas parce que c'est mardi

---

## Ce que vous livrez

### 1. Le PRD (Product Requirements Document)

Le PRD définit le "pourquoi" et le "quoi" d'un produit ou d'une feature majeure.

**Structure essentielle :**

```markdown
# PRD : [Nom]

## Vision
[Une phrase : pourquoi ce produit existe ?]

## Outcome Principal
[Verbe] + [Métrique] + [Cible] + [Échéance]
Ex: "Augmenter le taux de conversion de 5% à 8% d'ici M+3"

## Métriques de Succès
| Métrique | Baseline | Cible | Garde-fou |
|----------|----------|-------|-----------|

## Dans le Scope
- [Feature avec critère de succès]

## Hors Scope (explicite)
- [Ce qu'on ne fait PAS et pourquoi]

## Contraintes
- Business, Technique, Légal

## Non Spécifié (liberté technique)
- [Ce que l'équipe technique décide]
```

### 2. Les Outcome Criteria

Chaque fonctionnalité doit avoir des critères de succès **mesurables** :

| Mauvais | Bon | Pourquoi |
|---------|-----|----------|
| "Améliorer l'UX" | "Réduire le taux d'abandon checkout de 15% à 10%" | Mesurable, actionnable |
| "Ajouter des notifications" | "Augmenter l'engagement à 3 sessions/semaine" | Orienté résultat |
| "Refondre le dashboard" | "Réduire le temps pour trouver une info de 2min à 30s" | Valeur utilisateur explicite |

### 3. La priorisation par valeur

La priorisation RICE adaptée AIAD :

| Critère | Question |
|---------|----------|
| **R**each | Combien d'utilisateurs impactés ? |
| **I**mpact | Quelle amélioration par utilisateur ? |
| **C**onfiance | Quelle certitude sur les estimations ? |
| **E**ffort | Combien de cycles AIAD (pas de jours) ? |

---

## La collaboration redéfinie

### Avec le Product Engineer

| Situation | Vous faites | Vous ne faites pas |
|-----------|-------------|-------------------|
| Nouvelle feature | Définir l'outcome et les contraintes | Imposer la solution technique |
| Question technique | Répondre en <4h sur le besoin business | Décider de l'architecture |
| Demo | Valider si l'outcome est atteint | Review le code |
| Blocage | Priorise ou ajuster le scope | Contourner le PE |

**Le moment clé : la Planification**
- Vous présentez les outcomes
- Le PE pose des questions de clarification
- Ensemble, vous rédigez la SPEC
- L'agent IA peut implémenter sans ambiguïté

### Avec le Tech Lead

| Vous apportez | Le Tech Lead apporte |
|---------------|---------------------|
| Contraintes business et délais | Contraintes techniques et risques |
| Budget acceptable pour la dette | Estimation du coût de remboursement |
| Impact business des choix | Décision technique finale |

**Règle d'or** : Vous ne dites jamais "utilise telle techno". Vous dites "j'ai besoin de X performance/coût/délai".

### Avec le QA Engineer

| Vous définissez | Le QA définit |
|-----------------|---------------|
| Critères d'acceptation business | Stratégie de test |
| Priorité des bugs selon impact | Sévérité technique |
| DoOuD (outcome atteint ?) | DoOD (qualité technique) |

---

## Les métriques qui comptent

### Ce que vous suivez

| Métrique | Cible | Pourquoi |
|----------|-------|----------|
| **Atteinte Outcome Criteria** | >70% | Valide que vous construisez les bonnes choses |
| **Lead Time** (Idée → Production) | <2 semaines | Mesure votre capacité à réagir au marché |
| **Adoption Fonctionnalité** | >60% en 1 mois | Valide l'utilité réelle |
| **NPS/CSAT** | >8/10 | Mesure la satisfaction |
| **Fonctionnalités avec outcomes mesurés** | 100% | Discipline de mesure |

### Ce que vous ne suivez plus

- **Vélocité en points** : Mesure l'output, pas l'outcome
- **Nombre de features livrées** : Quantité ≠ valeur
- **% du scope complété** : Scope figé = mauvais signe

### Le dashboard mensuel

Ce que vous présentez aux stakeholders :

| Section | Contenu |
|---------|---------|
| Outcomes | Critères atteints, NPS, adoption |
| Tendances | Lead Time en évolution |
| Apprentissages | Hypothèses validées/invalidées |
| Actions | Top 3 des priorités du mois suivant |

---

## Les pièges à éviter

### 1. Le PM Architecte

**Symptôme** : Vous dictez les solutions techniques.

```
"Il faut utiliser Redis pour le cache"
"Faites un microservice pour cette feature"
```

**Correction** :
```
"On a besoin de temps de réponse < 200ms"
"Cette feature doit pouvoir évoluer indépendamment"
```

### 2. Le PM Absent

**Symptôme** : SPECs vagues, décisions retardées.

```
"Faites au mieux pour le comportement en erreur"
[Question sans réponse pendant 2 jours]
```

**Impact** : Les agents IA produisent du code incohérent car ils n'ont pas le contexte.

**Correction** : Réponse aux questions en <4h. Une décision imparfaite > pas de décision.

### 3. Le PM Feature Factory

**Symptôme** : Accumulation de features sans mesure d'impact.

```
"Le client X l'a demandé, on l'ajoute"
"Le concurrent l'a, on doit l'avoir"
```

**Correction** :
```
"Cette feature contribue à l'outcome Y, voici comment on mesure"
"Impact incertain → on fait un test avant de s'engager"
"Non, car ça ne sert pas nos outcomes prioritaires"
```

### 4. Le PM qui garde ses Sprints

**Symptôme** : "On fait de l'AIAD dans nos Sprints de 2 semaines".

**Problème** : Friction entre la vélocité des agents (heures) et la rigidité des cérémonies (semaines).

**Correction** : Adopter le flux continu. Les fonctionnalités trouvent leur cadence naturelle :
- Bug simple : boucle de 2h
- Feature standard : boucle de 1-3 jours
- Exploration : boucle d'1 semaine

---

## Pourquoi adopter AIAD ?

### Les gains concrets

| Aspect | Impact |
|--------|--------|
| **Time-to-market** | x3 à x10 plus rapide |
| **Qualité** | Tests générés automatiquement, couverture >80% |
| **Alignement** | SPECs précises = pas de mauvaises surprises |
| **Agilité** | Pivoter en jours, pas en mois |
| **Focus** | Vous vous concentrez sur la valeur, pas la gestion |

### Ce que disent les équipes

> "Avant, je passais mes journées à clarifier des tickets. Maintenant, je passe mes journées à découvrir ce que veulent vraiment les utilisateurs."

> "On livre en 3h ce qui prenait 3 jours. Et le résultat correspond à ce que j'avais en tête."

> "Je mesure enfin l'impact réel, pas juste ce qu'on a livré."

---

## Comment démarrer

### Semaine 1 : Comprendre

1. Lire le préambule et la vision AIAD
2. Comprendre les 4 piliers : Empirisme, Orchestration, Fluidité, Excellence produit
3. Identifier une fonctionnalité pilote

### Semaine 2 : Préparer

4. Rédiger un PRD pour la fonctionnalité pilote
5. Définir les Outcome Criteria mesurables
6. Créer votre première SPEC avec le PE

### Semaine 3+ : Itérer

7. Observer le cycle PLANIFIER → IMPLÉMENTER → VALIDER → INTÉGRER
8. Mesurer les outcomes
9. Ajuster votre approche

---

## Ressources

### Documents essentiels

| Document | Utilité |
|----------|---------|
| [PRD Template](../annexes/A1-prd.md) | Structure de votre PRD |
| [DoOuD Template](../annexes/A6-dooud.md) | Définition des outcomes |
| [Boucles Itératives](../framework/05-boucles-iteratives.md) | Comprendre le cycle |
| [Mode Opératoire - Planification](../mode%20opératoire/02-planification.md) | Guide pratique |

### Questions fréquentes

**Q : Et si l'équipe n'est pas prête ?**
R : Commencez par une fonctionnalité pilote. L'adoption se fait par l'exemple.

**Q : Comment je justifie le changement aux stakeholders ?**
R : Montrez les outcomes, pas les features. "Le taux de conversion a augmenté de 3%" vaut mieux que "On a livré 12 features".

**Q : Et la documentation produit ?**
R : Le PRD et les SPECs deviennent votre documentation vivante. Plus de specs figées qui périment.

---

## En résumé

| Question | Réponse AIAD |
|----------|--------------|
| Quel est mon rôle ? | Définir le "quoi" et le "pourquoi", jamais le "comment" |
| Comment je mesure le succès ? | Par les outcomes, pas les outputs |
| Comment je collabore ? | SPECs précises + confiance dans l'exécution |
| Quelle est ma valeur ajoutée ? | La clarté de l'intention, pas la gestion de projet |

**Votre capacité à exprimer une intention précise est devenue le facteur limitant de la productivité de l'équipe. AIAD vous donne les outils pour exceller dans ce rôle.**

---

*Pour aller plus loin : [Framework AIAD](../framework/referentiel.md) • [Mode Opératoire](../mode%20opératoire/referentiel.md) • [Annexe PM](../annexes/B1-product-manager.md)*
