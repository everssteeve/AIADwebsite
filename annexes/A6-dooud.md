# A.6 Template DoOuD (Definition of Outcome Done)

## Pourquoi ce template ?

Le DoOuD (Definition of Outcome Done) définit les critères de succès business d'un outcome. Contrairement au DoOD qui vérifie la qualité technique d'un output, le DoOuD mesure si l'objectif business a été atteint. C'est la validation finale que le travail produit la valeur attendue.

**Responsable principal** : Product Manager

---

## Différence DoOD vs DoOuD

| Aspect | DoOD (Output) | DoOuD (Outcome) |
|--------|---------------|-----------------|
| Question | "Est-ce bien fait ?" | "Est-ce que ça marche ?" |
| Focus | Qualité technique | Impact business |
| Timing | À chaque livraison | Après période d'observation |
| Mesure | Checklist binaire | Métriques quantifiées |
| Responsable | Équipe technique | Product Manager |

---

## Structure du DoOuD

### 1. Définition de l'Outcome

```markdown
## Outcome : [Nom de l'outcome]

### Objectif Business
[Ce que le produit doit accomplir en termes de valeur]

### Lien avec la Vision
[Comment cet outcome contribue à la vision produit du PRD]

### Périmètre de Mesure
[Quels utilisateurs/fonctionnalités sont concernés par la mesure]
```

### 2. Métriques de Succès

```markdown
## Métriques de Succès

| Métrique | Baseline | Cible | Seuil Minimum | Méthode de Mesure |
|----------|----------|-------|---------------|-------------------|
| [Métrique principale] | [Valeur actuelle] | [Objectif] | [Seuil acceptable] | [Comment mesurer] |
| [Métrique secondaire] | [Valeur actuelle] | [Objectif] | [Seuil acceptable] | [Comment mesurer] |

### Définitions
- **Baseline** : Valeur avant implémentation
- **Cible** : Objectif visé
- **Seuil Minimum** : En dessous = échec
```

### 3. Critères de Validation

```markdown
## Critères de Validation

### Critères Quantitatifs
- [ ] [Métrique 1] atteint [seuil minimum] sur [période]
- [ ] [Métrique 2] atteint [seuil minimum] sur [période]

### Critères Qualitatifs
- [ ] [Feedback utilisateur positif]
- [ ] [Absence de problèmes critiques]

### Période d'Observation
[Durée nécessaire pour collecter des données significatives]
```

### 4. Plan de Mesure

```markdown
## Plan de Mesure

### Sources de Données
| Métrique | Source | Fréquence | Responsable |
|----------|--------|-----------|-------------|
| [Métrique 1] | [Analytics/DB/Survey] | [Quotidien/Hebdo] | [Qui] |
| [Métrique 2] | [Analytics/DB/Survey] | [Quotidien/Hebdo] | [Qui] |

### Points de Contrôle
- **T+7 jours** : Première lecture, ajustements si nécessaire
- **T+14 jours** : Analyse intermédiaire
- **T+30 jours** : Validation finale du DoOuD
```

---

## Exemple Complet

```markdown
# DoOuD : Réduction du Temps de Coordination

## Outcome : Réduction du Temps de Coordination

### Objectif Business
Réduire de 30% le temps que les équipes passent à se coordonner sur les tâches,
leur permettant de consacrer plus de temps au travail productif.

### Lien avec la Vision
Cet outcome est le KPI principal du PRD : "une interface unique qui réduit
la friction de coordination".

### Périmètre de Mesure
- Équipes actives (≥ 3 connexions/semaine)
- Utilisateurs ayant complété l'onboarding
- Période : après 2 semaines d'utilisation minimum

## Métriques de Succès

| Métrique | Baseline | Cible | Seuil Min | Méthode de Mesure |
|----------|----------|-------|-----------|-------------------|
| Temps de coordination hebdo | 5h | 3.5h (-30%) | 4h (-20%) | Survey mensuel |
| Messages coord. hors-app | 45/sem | 25/sem | 35/sem | Survey + logs Slack |
| Tâches sans owner > 24h | 30% | 10% | 15% | Analytics |
| NPS coordination | 25 | 50 | 40 | Survey |

### Proxy Metrics (mesurables immédiatement)
| Métrique | Cible | Méthode |
|----------|-------|---------|
| Temps moyen pour assigner une tâche | < 30s | Analytics |
| Taux de tâches créées avec owner | > 70% | Analytics |
| Sessions avec usage filtres | > 60% | Analytics |

## Critères de Validation

### Critères Quantitatifs
- [ ] Temps de coordination réduit d'au moins 20% (seuil min)
- [ ] NPS coordination ≥ 40
- [ ] Taux d'assignation immédiate > 70%

### Critères Qualitatifs
- [ ] Pas de plainte majeure sur l'UX de coordination
- [ ] Feedback positif dans les interviews utilisateurs
- [ ] Pas de workaround détecté (retour aux outils précédents)

### Période d'Observation
30 jours après déploiement à 100% des utilisateurs

## Plan de Mesure

### Sources de Données
| Métrique | Source | Fréquence | Responsable |
|----------|--------|-----------|-------------|
| Temps coordination | Survey Typeform | Mensuel | PM |
| Usage filtres | Amplitude | Temps réel | PM |
| Tâches sans owner | PostgreSQL query | Quotidien | Data |
| NPS | In-app survey | Mensuel | PM |

### Points de Contrôle
- **J+7** : Vérifier l'adoption des nouvelles features (proxy metrics)
- **J+14** : Premier survey de satisfaction
- **J+30** : Validation finale DoOuD + décision Go/No-Go

### Actions si Seuil Non Atteint
1. Analyse des données pour identifier les blocages
2. Interviews utilisateurs ciblées
3. Itération sur les fonctionnalités problématiques
4. Nouveau cycle de mesure (14 jours)

## Statut de Validation

| Date | Statut | Commentaire |
|------|--------|-------------|
| 2026-01-15 | 🟡 En cours | Déploiement effectué |
| 2026-01-22 | - | Point J+7 prévu |
| 2026-01-29 | - | Point J+14 prévu |
| 2026-02-14 | - | Validation finale prévue |
```

---

## Types de Métriques

### Métriques d'Outcome (Lag Indicators)

Mesurent le résultat final recherché :
- Revenus / Conversion
- Rétention / Churn
- NPS / Satisfaction
- Temps économisé
- Taux d'erreur réduit

**Caractéristiques** : Lentes à bouger, difficiles à influencer directement

### Métriques Proxy (Lead Indicators)

Mesurent les comportements qui mènent à l'outcome :
- Taux d'adoption d'une feature
- Fréquence d'utilisation
- Complétion de parcours
- Temps sur tâche

**Caractéristiques** : Rapides à mesurer, actionnables

### Combinaison Recommandée

```markdown
## Métriques

### Outcome Metric (validation finale)
- [Métrique business principale]

### Proxy Metrics (suivi continu)
- [Métrique d'adoption]
- [Métrique d'engagement]
- [Métrique de qualité d'usage]
```

---

## Anti-patterns

### "Vanity Metrics"

**Problème** : Mesurer ce qui est facile plutôt que ce qui compte
```markdown
❌ Nombre de pages vues
❌ Nombre d'utilisateurs inscrits
❌ Temps passé dans l'app
```

**Solution** : Toujours lier la métrique à la valeur business
```markdown
✅ Taux de conversion visiteur → client
✅ Utilisateurs actifs hebdomadaires
✅ Tâches complétées par session
```

### "Moving the Goalposts"

**Problème** : Ajuster la cible après avoir vu les résultats
```markdown
❌ "On visait 30% mais 15% c'est bien aussi"
```

**Solution** : Définir le seuil minimum avant de mesurer
```markdown
✅ Cible : 30% | Seuil minimum : 20% | En dessous = échec
```

### "One and Done"

**Problème** : Mesurer une fois et passer à autre chose
```markdown
❌ "L'outcome était OK au lancement, on passe à la suite"
```

**Solution** : Suivi continu des outcomes clés
```markdown
✅ Dashboard mensuel des outcomes
✅ Alertes si régression
```

---

## Intégration au Workflow AIAD

### Création du DoOuD
- **Quand** : Lors de la rédaction du PRD
- **Par qui** : Product Manager
- **Validation** : Alignment Stratégique

### Suivi du DoOuD
- **Quand** : Après livraison des outputs liés
- **Par qui** : Product Manager avec support Data
- **Reporting** : Demo & Feedback + Alignment Stratégique

### Validation du DoOuD
- **Quand** : Fin de période d'observation
- **Par qui** : Product Manager
- **Décision** : Succès / Itération nécessaire / Pivot

---

*Retour aux [Annexes](../framework/08-annexes.md)*
