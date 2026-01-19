# B.1 Détails Product Manager

## Pourquoi cette annexe ?

Cette annexe approfondit le rôle de Product Manager dans le contexte AIAD. Elle fournit des exemples concrets, des anti-patterns à éviter et des situations quotidiennes typiques.

---

## Responsabilités Détaillées

### 1. Discovery Continue

Le PM est responsable de comprendre le marché, les utilisateurs et d'identifier les opportunités de valeur.

#### Activités Quotidiennes
- Analyse des retours utilisateurs (support, NPS, interviews)
- Veille concurrentielle et technologique
- Synthèse des données d'usage (analytics)
- Priorisation du backlog d'opportunités

#### Output Principal
**Opportunités qualifiées** : Problèmes utilisateurs validés avec potentiel business estimé.

```markdown
## Opportunité : [Nom]

### Problème Identifié
[Description du problème utilisateur]

### Preuves
- [Donnée quantitative : X% des utilisateurs...]
- [Donnée qualitative : "verbatim interview..."]
- [Benchmark : concurrent Y propose...]

### Impact Potentiel
- Utilisateurs concernés : [N]
- Valeur estimée : [€ / métrique impactée]
- Effort estimé : [T-shirt size]

### Recommandation
[Prioriser / Explorer / Rejeter]
```

### 2. Définition des Outcomes

Le PM traduit les opportunités en outcomes mesurables.

#### Bon Outcome vs Mauvais Outcome

| ❌ Mauvais | ✅ Bon |
|-----------|--------|
| "Améliorer l'UX" | "Réduire le taux d'abandon checkout de 15%" |
| "Ajouter des features" | "Augmenter la fréquence d'usage à 3x/semaine" |
| "Refondre le dashboard" | "Réduire le temps pour trouver une info de 2min à 30s" |

#### Template de Rédaction

```markdown
## Outcome : [Verbe d'action] + [Métrique] + [Cible] + [Échéance]

Exemple : "Augmenter le taux de conversion trial→paid de 5% à 8% d'ici M+3"
```

### 3. Priorisation Stratégique

Le PM décide **quoi** faire, pas **comment**.

#### Framework RICE Adapté AIAD

| Critère | Question | Score |
|---------|----------|-------|
| **R**each | Combien d'utilisateurs impactés ? | 1-10 |
| **I**mpact | Quelle amélioration par utilisateur ? | 0.25 / 0.5 / 1 / 2 / 3 |
| **C**onfidence | Quelle certitude sur les estimations ? | 0.5 / 0.8 / 1 |
| **E**ffort | Combien de cycles AIAD ? | 1-10 |

```
Score = (Reach × Impact × Confidence) / Effort
```

### 4. Validation des Outcomes (DoOuD)

Le PM vérifie que le travail produit atteint les objectifs business.

#### Rituel de Validation

1. **Collecter** les données selon le plan de mesure
2. **Comparer** avec les seuils définis
3. **Décider** : succès / itération / pivot
4. **Communiquer** les learnings à l'équipe

---

## Anti-patterns du Product Manager

### 1. "Le PM Architecte"

**Symptôme** : Le PM dicte les solutions techniques
```
❌ "Il faut utiliser Redis pour le cache"
❌ "Faites un microservice pour cette feature"
```

**Impact** : Frustration des devs, solutions sous-optimales

**Solution** : Se concentrer sur le problème et les contraintes
```
✅ "On a besoin de temps de réponse < 200ms"
✅ "La feature doit être déployable indépendamment"
```

### 2. "Le PM Absent"

**Symptôme** : Specs vagues, décisions retardées
```
❌ "Faites au mieux pour le comportement en erreur"
❌ "On verra le design plus tard"
```

**Impact** : Agents IA produisent du code incohérent, retravail

**Solution** : Être disponible et spécifique
```
✅ Specs complètes avec cas limites documentés
✅ Réponse aux questions en < 4h
```

### 3. "Le PM Feature Factory"

**Symptôme** : Accumulation de features sans mesure d'impact
```
❌ "On ajoute cette feature parce que le client X l'a demandée"
❌ "Le concurrent l'a, on doit l'avoir"
```

**Impact** : Produit complexe, outcomes non atteints

**Solution** : Toujours lier à un outcome
```
✅ "Cette feature contribue à l'outcome Y, voici comment on va mesurer"
✅ "On ne l'ajoute pas car impact incertain, on fait d'abord un test"
```

### 4. "Le PM Micro-manager"

**Symptôme** : Révision de chaque ligne de code, présence dans chaque discussion technique
```
❌ "Je veux valider chaque PR"
❌ "Montrez-moi le code avant de merger"
```

**Impact** : Bottleneck, équipe déresponsabilisée

**Solution** : Faire confiance au DoOD et au processus
```
✅ Valider les specs en amont
✅ Review à la Demo, pas à chaque commit
```

---

## Exemples de PRD Efficaces

### PRD Efficace : Caractéristiques

1. **Vision claire** en une phrase
2. **Outcomes mesurables** avec métriques
3. **Scope explicite** (in/out)
4. **Contraintes documentées**
5. **Pas de solution technique** imposée

### Exemple Annoté

```markdown
# PRD : Système de Notifications

## Vision
Permettre aux utilisateurs de rester informés des événements importants
sans être submergés d'alertes. [✅ Claire, orientée valeur]

## Outcome Principal
Augmenter l'engagement hebdomadaire de 2.1 à 2.8 sessions/utilisateur
d'ici M+2. [✅ Mesurable, daté]

## Métriques Secondaires
- Taux d'ouverture notifications > 40% [✅ Seuil défini]
- Taux de désactivation < 10% [✅ Garde-fou]

## Dans le Scope
- Notifications in-app
- Notifications email (digest quotidien)
- Préférences utilisateur (on/off par type)
[✅ Clair sur ce qui est inclus]

## Hors Scope
- Push notifications mobile (v2)
- Notifications temps réel websocket (v2)
[✅ Explicite sur ce qui n'est pas fait]

## Contraintes
- RGPD : opt-in explicite requis
- Performance : pas d'impact sur le temps de chargement
- Budget : utiliser le service email existant
[✅ Contraintes techniques et business]

## Non spécifié (à définir par l'équipe technique)
- Choix de la queue de jobs
- Format exact du template email
- Architecture du système de préférences
[✅ Laisse la liberté technique]
```

---

## Collaboration avec les Autres Rôles

### PM ↔ Product Engineer

| PM Fournit | PE Fournit |
|------------|------------|
| PRD avec outcomes | Estimation des cycles |
| Specs priorisées | Feedback sur faisabilité |
| Décisions métier rapides | Propositions alternatives |
| Validation des outcomes | Démo des outputs |

### PM ↔ Tech Lead

| PM Fournit | Tech Lead Fournit |
|------------|-------------------|
| Contraintes business | Contraintes techniques |
| Vision long terme | Architecture durable |
| Priorisation features | Priorisation dette |

### PM ↔ Stakeholders

| PM Fournit | Stakeholders Fournissent |
|------------|-------------------------|
| Roadmap outcomes | Contexte business |
| Métriques de succès | Feedback marché |
| Status et risques | Décisions stratégiques |

---

## Outils et Templates

### Daily du PM

```markdown
## Daily Check - [Date]

### Décisions à Prendre Aujourd'hui
- [ ] [Décision 1]
- [ ] [Décision 2]

### Specs à Finaliser
- [ ] [SPEC-XXX]

### Métriques à Vérifier
- [Métrique 1] : [valeur actuelle vs cible]

### Blocages à Résoudre
- [Blocage] → Action : [...]
```

### Weekly Review PM

```markdown
## Review Hebdo - Semaine [N]

### Outcomes Status
| Outcome | Progress | Trend | Action |
|---------|----------|-------|--------|
| [O1] | [X%] | 🟢/🟡/🔴 | [Si nécessaire] |

### Learnings de la Semaine
- [Learning 1]
- [Learning 2]

### Décisions Prises
| Décision | Contexte | Impact |
|----------|----------|--------|
| [D1] | [Pourquoi] | [Conséquences] |

### Focus Semaine Prochaine
1. [Priorité 1]
2. [Priorité 2]
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
