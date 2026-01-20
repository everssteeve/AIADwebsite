# A.6 Template DoOuD (Definition of Outcome Done)

## Pourquoi cette annexe ?

Le DoOuD définit les critères de succès business d'un outcome. Contrairement au DoOD qui valide la qualité technique d'un livrable, le DoOuD répond à la question : "Est-ce que ça produit la valeur attendue ?". C'est la différence entre "le code fonctionne" et "les utilisateurs résolvent leur problème". Sans DoOuD, on peut livrer des fonctionnalités parfaites techniquement qui n'apportent aucune valeur.

---

## Différence DoOD vs DoOuD (Rappel)

| Aspect | DoOD (Output) | DoOuD (Outcome) |
|--------|--------------|-----------------|
| **Question** | "Est-ce bien fait ?" | "Est-ce que ça marche ?" |
| **Focus** | Qualité technique | Impact business |
| **Timing** | À chaque livraison | Après période d'observation |
| **Mesure** | Checklist binaire | Métriques quantifiées |
| **Responsable** | Équipe technique | Product Manager |
| **Durée** | Instantané | Jours/semaines |

---

## Structure du DoOuD

### 1. Définition de l'Outcome

```markdown
## Outcome : [Nom de l'Outcome]

### Objectif Business
[Ce que le produit doit accomplir en termes de valeur mesurable]

### Lien avec la Vision
[Comment cet outcome contribue à la vision produit du PRD]

### Périmètre de Mesure
[Quels utilisateurs/segments sont concernés par la mesure]
```

### 2. Métriques de Succès

```markdown
## Métriques de Succès

### Métrique Principale (North Star)
| Métrique | Baseline | Cible | Seuil Minimum | Méthode |
|----------|----------|-------|---------------|---------|
| [Métrique] | [Valeur actuelle] | [Objectif idéal] | [Minimum acceptable] | [Comment mesurer] |

### Métriques Secondaires
| Métrique | Baseline | Cible | Seuil Min | Méthode |
|----------|----------|-------|-----------|---------|
| [Métrique 2] | | | | |
| [Métrique 3] | | | | |
```

**Vocabulaire** :
- **Baseline** : Valeur avant implémentation (point de comparaison)
- **Cible** : Objectif visé (succès complet)
- **Seuil Minimum** : En dessous = échec (le minimum acceptable)

### 3. Critères de Validation

```markdown
## Critères de Validation

### Critères Quantitatifs
- [ ] [Métrique 1] atteint [seuil minimum] sur [période]
- [ ] [Métrique 2] atteint [seuil minimum] sur [période]

### Critères Qualitatifs
- [ ] [Feedback positif des utilisateurs]
- [ ] [Absence de problèmes critiques signalés]

### Période d'Observation
[Durée nécessaire pour collecter des données significatives]
```

### 4. Plan de Mesure

```markdown
## Plan de Mesure

### Sources de Données
| Métrique | Source | Fréquence | Responsable |
|----------|--------|-----------|-------------|
| [Métrique] | [Outil/Méthode] | [Quotidien/Hebdo/Mensuel] | [Qui] |

### Points de Contrôle
- **T+7 jours** : [Première lecture, vérification setup]
- **T+14 jours** : [Analyse intermédiaire]
- **T+30 jours** : [Validation finale du DoOuD]

### Actions si Seuil Non Atteint
1. [Action corrective 1]
2. [Action corrective 2]
3. [Décision de pivot si échec confirmé]
```

---

## Types de Métriques

### Métriques d'Outcome (Lag Indicators)

Mesurent le résultat final recherché. Lentes à bouger, mais représentent la vraie valeur.

| Type | Exemples |
|------|----------|
| **Revenue** | CA mensuel, ARPU, conversion |
| **Rétention** | Churn rate, DAU/MAU ratio |
| **Satisfaction** | NPS, CSAT, reviews |
| **Efficacité** | Temps économisé, erreurs évitées |
| **Adoption** | % utilisateurs actifs, feature usage |

### Métriques Proxy (Lead Indicators)

Mesurent les comportements qui mènent à l'outcome. Rapides à mesurer, actionnables.

| Type | Exemples |
|------|----------|
| **Engagement** | Sessions/semaine, durée session |
| **Adoption feature** | % utilisateurs qui utilisent la feature |
| **Complétion** | Taux de complétion d'un flow |
| **Performance** | Temps de chargement, temps sur tâche |

### Combinaison Recommandée

```markdown
## Métriques

### Outcome Metric (validation finale)
La métrique business qui prouve la valeur. Ex: "Temps de coordination réduit de 30%"

### Proxy Metrics (suivi continu)
Les métriques intermédiaires qui prédisent l'outcome. Ex: "Taux d'adoption des filtres > 60%"
```

**Pourquoi les deux ?**
- L'outcome metric prend du temps à bouger → on ne peut pas attendre des mois
- Les proxy metrics bougent vite → signal précoce de succès ou d'échec
- Si les proxy metrics sont bons mais l'outcome ne suit pas → hypothèse à revoir

---

## Exemples Pratiques

### Exemple 1 : Outcome "Réduction du Temps de Coordination"

```markdown
# DoOuD : Réduction du Temps de Coordination

## Outcome

### Objectif Business
Réduire de 30% le temps que les équipes passent à se coordonner sur les tâches,
leur permettant de consacrer plus de temps au travail productif.

### Lien avec la Vision
Cet outcome est le KPI principal du PRD : "une interface unique qui réduit
la friction de coordination".

### Périmètre de Mesure
- Équipes actives (≥ 3 connexions/semaine par membre)
- Utilisateurs ayant complété l'onboarding
- Après 2 semaines d'utilisation minimum

---

## Métriques de Succès

### Métrique Principale
| Métrique | Baseline | Cible | Seuil Min | Méthode |
|----------|----------|-------|-----------|---------|
| Temps de coordination hebdo | 5h | 3.5h (-30%) | 4h (-20%) | Survey mensuel |

### Métriques Secondaires
| Métrique | Baseline | Cible | Seuil Min | Méthode |
|----------|----------|-------|-----------|---------|
| Messages hors-app pour coordination | 45/sem | 25/sem | 35/sem | Survey + logs Slack |
| Tâches sans owner > 24h | 30% | 10% | 15% | Analytics |
| NPS coordination | 25 | 50 | 40 | Survey in-app |

### Proxy Metrics (mesurables immédiatement)
| Métrique | Cible | Méthode |
|----------|-------|---------|
| Temps moyen pour assigner une tâche | < 30s | Analytics |
| Taux de tâches créées avec owner | > 70% | Analytics |
| Sessions avec usage des filtres | > 60% | Analytics |
| DAU/MAU ratio | > 40% | Analytics |

---

## Critères de Validation

### Critères Quantitatifs
- [ ] Temps de coordination réduit d'au moins 20% (seuil minimum)
- [ ] NPS coordination ≥ 40
- [ ] Taux d'assignation immédiate > 70%

### Critères Qualitatifs
- [ ] Pas de plainte majeure sur l'UX de coordination dans les feedbacks
- [ ] Interviews utilisateurs majoritairement positives (4/5 satisfaits)
- [ ] Pas de workaround détecté (retour aux anciens outils)

### Période d'Observation
30 jours après déploiement à 100% des utilisateurs

---

## Plan de Mesure

### Sources de Données
| Métrique | Source | Fréquence | Responsable |
|----------|--------|-----------|-------------|
| Temps coordination | Typeform survey | Mensuel | PM |
| Usage filtres | Amplitude | Temps réel | PM |
| Tâches sans owner | Query PostgreSQL | Quotidien | Data |
| NPS | Survey in-app | Mensuel | PM |

### Points de Contrôle
- **J+7** : Vérifier l'adoption des nouvelles features (proxy metrics)
- **J+14** : Premier survey de satisfaction
- **J+21** : Analyse intermédiaire, ajustements si nécessaire
- **J+30** : Validation finale DoOuD + décision Go/No-Go

### Actions si Seuil Non Atteint
1. Analyse des données pour identifier les blocages
2. Interviews utilisateurs ciblées (5-10 users)
3. Itération sur les fonctionnalités problématiques
4. Nouveau cycle de mesure (14 jours additionnels)

---

## Suivi

| Date | Statut | Commentaire |
|------|--------|-------------|
| 2026-01-15 | 🟡 En cours | Déploiement effectué |
| 2026-01-22 | 🟡 J+7 | Adoption à 45%, légèrement sous cible |
| 2026-01-29 | - | Point J+14 prévu |
| 2026-02-14 | - | Validation finale prévue |
```

### Exemple 2 : Outcome "Amélioration de la Conversion"

```markdown
# DoOuD : Amélioration du Taux de Conversion

## Outcome

### Objectif Business
Augmenter le taux de conversion du funnel d'inscription de 15%
en simplifiant le processus d'onboarding.

### Lien avec la Vision
Réduire la friction pour les nouveaux utilisateurs,
conformément à l'objectif "Zéro friction" du PRD.

### Périmètre de Mesure
- Nouveaux visiteurs arrivant sur la landing page
- Période : 30 jours après déploiement

---

## Métriques de Succès

### Métrique Principale
| Métrique | Baseline | Cible | Seuil Min | Méthode |
|----------|----------|-------|-----------|---------|
| Taux de conversion (visitor → signed up) | 2.3% | 2.65% (+15%) | 2.5% (+10%) | Analytics |

### Métriques Secondaires
| Métrique | Baseline | Cible | Seuil Min | Méthode |
|----------|----------|-------|-----------|---------|
| Temps moyen pour compléter signup | 4min | 2min | 3min | Analytics |
| Taux d'abandon au step 2 | 35% | 20% | 25% | Funnel analytics |
| Complétion onboarding | 60% | 80% | 70% | Analytics |

### Proxy Metrics
| Métrique | Cible | Méthode |
|----------|-------|---------|
| Clics sur CTA "Commencer" | +20% | Analytics |
| Scroll jusqu'au formulaire | +15% | Heatmap |
| Erreurs de formulaire | -50% | Error tracking |

---

## Critères de Validation

### Quantitatifs
- [ ] Conversion ≥ 2.5% (seuil minimum)
- [ ] Temps signup ≤ 3 minutes
- [ ] Complétion onboarding ≥ 70%

### Qualitatifs
- [ ] Pas d'augmentation des tickets support "signup"
- [ ] Feedback positif sur la nouvelle expérience

### Période
14 jours après déploiement (traffic suffisant pour significativité)

---

## Suivi

| Date | Conversion | Commentaire |
|------|------------|-------------|
| Baseline | 2.3% | Avant déploiement |
| J+7 | 2.4% | +4%, tendance positive |
| J+14 | - | Validation prévue |
```

### Exemple 3 : DoOuD Minimal

Pour des outcomes simples ou des MVPs.

```markdown
# DoOuD : Feature X Apporte de la Valeur

## Outcome
Les utilisateurs utilisent la feature X et en tirent bénéfice.

## Métrique de Succès
| Métrique | Cible | Période |
|----------|-------|---------|
| % utilisateurs actifs qui utilisent X | > 30% | 14 jours |
| NPS des utilisateurs de X | > 40 | 30 jours |

## Critères de Validation
- [ ] Adoption > 30%
- [ ] Pas de feedback négatif majeur

## Décision
Si critères atteints → continuer à investir
Si critères non atteints → pivoter ou abandonner
```

---

## Anti-patterns

### ❌ Vanity Metrics

**Symptôme** : Mesurer ce qui est facile plutôt que ce qui compte.

```markdown
❌ Vanity
- Nombre de pages vues
- Nombre d'inscrits
- Temps passé dans l'app

✅ Actionnable
- Taux de conversion visiteur → client payant
- Utilisateurs actifs hebdomadaires (WAU)
- Tâches complétées par session
```

**Problème** : Ces métriques augmentent sans que la valeur augmente.

**Solution** : Toujours lier la métrique à un comportement ou résultat business.

---

### ❌ Moving the Goalposts

**Symptôme** : Ajuster la cible après avoir vu les résultats.

```markdown
❌ "On visait 30% mais 15% c'est bien aussi"
❌ "La métrique n'était pas la bonne, en fait"
```

**Problème** : On ne sait jamais si on a vraiment réussi.

**Solution** : Définir le seuil minimum AVANT de mesurer. C'est le contrat.

```markdown
✅ Cible : 30% | Seuil minimum : 20% | En dessous = échec
```

---

### ❌ One and Done

**Symptôme** : Mesurer une fois et passer à autre chose.

```markdown
❌ "L'outcome était OK au lancement, on passe à la suite"
```

**Problème** : L'outcome peut se dégrader avec le temps.

**Solution** : Suivi continu des outcomes clés.

```markdown
✅ Dashboard mensuel des outcomes principaux
✅ Alertes si régression > 10%
```

---

### ❌ Outcome Non Mesurable

**Symptôme** : Outcome formulé de manière non quantifiable.

```markdown
❌ "Améliorer l'expérience utilisateur"
❌ "Rendre le produit plus intuitif"
❌ "Satisfaire les clients"
```

**Problème** : Impossible de savoir si c'est atteint.

**Solution** : Toujours une métrique chiffrée.

```markdown
✅ "Réduire le temps pour compléter la tâche X de 45s à 20s"
✅ "Augmenter le taux de complétion du flow de 60% à 80%"
✅ "Atteindre un NPS > 50"
```

---

## Template Prêt à Copier

```markdown
# DoOuD : [Nom de l'Outcome]

## Outcome

### Objectif Business


### Lien avec la Vision


### Périmètre de Mesure


---

## Métriques de Succès

### Métrique Principale
| Métrique | Baseline | Cible | Seuil Min | Méthode |
|----------|----------|-------|-----------|---------|
|  |  |  |  |  |

### Métriques Secondaires
| Métrique | Baseline | Cible | Seuil Min | Méthode |
|----------|----------|-------|-----------|---------|
|  |  |  |  |  |

### Proxy Metrics
| Métrique | Cible | Méthode |
|----------|-------|---------|
|  |  |  |

---

## Critères de Validation

### Critères Quantitatifs
- [ ] [Métrique] atteint [seuil] sur [période]
- [ ]

### Critères Qualitatifs
- [ ]
- [ ]

### Période d'Observation
[X] jours après déploiement

---

## Plan de Mesure

### Sources de Données
| Métrique | Source | Fréquence | Responsable |
|----------|--------|-----------|-------------|
|  |  |  |  |

### Points de Contrôle
- **J+7** :
- **J+14** :
- **J+30** :

### Actions si Seuil Non Atteint
1.
2.
3.

---

## Suivi

| Date | Statut | Commentaire |
|------|--------|-------------|
|  |  |  |
```

---

## Intégration au Workflow AIAD

### Création du DoOuD

| Phase | Action | Responsable |
|-------|--------|-------------|
| PRD | Définir les outcomes et leurs métriques | PM |
| SPEC | Lier chaque SPEC à un outcome | PM + PE |
| Alignment | Valider les seuils et méthodes de mesure | Équipe |

### Suivi du DoOuD

| Phase | Action | Responsable |
|-------|--------|-------------|
| Post-livraison | Configurer le tracking | PM + Data |
| T+7 | Premier check des proxy metrics | PM |
| T+14 | Analyse intermédiaire | PM |
| T+30 | Validation finale | PM |

### Validation du DoOuD

| Résultat | Décision |
|----------|----------|
| ✅ Cible atteinte | Documenter le succès, communiquer |
| ⚠️ Seuil atteint mais pas la cible | OK pour continuer, itérer pour améliorer |
| ❌ Seuil non atteint | Analyser, itérer ou pivoter |

---

## Checklist de Validation

Avant de considérer le DoOuD comme prêt :

- [ ] L'outcome est formulé en termes de valeur business (pas technique)
- [ ] La métrique principale a une baseline mesurée
- [ ] Les seuils (cible + minimum) sont définis AVANT déploiement
- [ ] La méthode de mesure est claire et réalisable
- [ ] La période d'observation est réaliste (assez de données)
- [ ] Les critères qualitatifs complètent les quantitatifs
- [ ] Le plan de suivi est établi avec des points de contrôle
- [ ] Les actions en cas d'échec sont prévues

---

## Gouvernance des Outcomes

| Action | Responsable | Fréquence |
|--------|-------------|-----------|
| Définition DoOuD | PM | À chaque nouveau PRD/outcome |
| Suivi des métriques | PM + Data | Hebdomadaire |
| Validation finale | PM | Fin de période d'observation |
| Revue des outcomes | Équipe | Demo & Feedback / Alignment |
| Dashboard outcomes | PM | Continue (automatisé) |
| Décisions pivot/stop | PM + Stakeholders | Quand seuil non atteint |

---

*Annexes connexes : [A.1 Template PRD](./A1-prd.md) • [A.5 Template DoOD](./A5-dood.md) • [B.1 Product Manager](./B1-product-manager.md) • [E.1 Exemples Dashboards](./E1-exemples-dashboards.md)*
