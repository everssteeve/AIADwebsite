# E.1 Exemples de Dashboards

## Pourquoi cette annexe ?

Visualiser les bonnes métriques permet de piloter efficacement un projet AIAD. Cette annexe fournit des templates de dashboards prêts à l'emploi, adaptés à chaque rôle et fréquence de revue. Un bon dashboard aide à la décision, pas à la confusion.

---

## Dashboard par Rôle

### Dashboard Product Manager

Focus : outcomes et valeur livrée.

| Métrique | Fréquence | Source | Seuil d'alerte |
|----------|-----------|--------|----------------|
| Progression outcomes | Hebdo | PRD tracking | < 80% trend |
| Features livrées vs planifiées | Hebdo | Backlog | < 70% |
| Satisfaction utilisateurs | Mensuel | NPS/CSAT | < 7/10 |
| Time-to-market | Mensuel | Dates release | > +20% dérive |

**Template visuel PM :**

```
┌─────────────────────────────────────────────────────────────┐
│  OUTCOMES                          LIVRAISONS              │
│  ┌───────────────────┐            ┌───────────────────┐    │
│  │ Engagement: 2.4   │            │ Features: 4/5     │    │
│  │ Cible: 3.0  ▲     │            │ Cette semaine     │    │
│  │ ████████░░░ 80%   │            │ ████████████░░    │    │
│  └───────────────────┘            └───────────────────┘    │
│                                                             │
│  PROCHAINES PRIORITÉS              ALERTES                 │
│  1. Onboarding v2                  ⚠️ SPEC-045 bloquée    │
│  2. Export CSV                     ✅ Tests OK             │
│  3. Notifications                                          │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Product Engineer

Focus : flux de travail et productivité.

| Métrique | Fréquence | Source | Seuil d'alerte |
|----------|-----------|--------|----------------|
| Cycle time | Quotidien | Board | > 3 jours |
| WIP en cours | Temps réel | Board | > limite |
| Taux première validation | Hebdo | Review | < 75% |
| Qualité code généré | Hebdo | Linter/Tests | > 5 erreurs/PR |

**Template visuel PE :**

```
┌─────────────────────────────────────────────────────────────┐
│  KANBAN LIVE                                                │
│  ┌─────────┬─────────┬─────────┬─────────┐                 │
│  │ Ready   │ WIP     │ Review  │ Done    │                 │
│  │   5     │   2/3   │   1     │   4     │                 │
│  │ ○○○○○   │ ●●○     │ ●       │ ●●●●    │                 │
│  └─────────┴─────────┴─────────┴─────────┘                 │
│                                                             │
│  CYCLE TIME: 2.3j (cible: <3j) ✅                          │
│  SPEC EN COURS: SPEC-046 - Filtres (jour 2)               │
│                                                             │
│  CI/CD: main ✅ | PR #234 ⏳ | PR #235 ❌ (tests e2e)      │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Tech Lead

Focus : santé technique et architecture.

| Métrique | Fréquence | Source | Seuil d'alerte |
|----------|-----------|--------|----------------|
| Couverture tests | Quotidien | CI | < 80% |
| Dette technique | Hebdo | Estimation | > 20 jours |
| Bugs en production | Temps réel | Monitoring | > 0 critique |
| Incidents | Temps réel | Alerting | Tout incident |

**Template visuel TL :**

```
┌─────────────────────────────────────────────────────────────┐
│  SANTÉ TECHNIQUE                                            │
│  ┌───────────┬───────────┬───────────┬───────────┐         │
│  │ Coverage  │ Dette     │ Bugs Prod │ Incidents │         │
│  │   84%     │   12j     │     0     │     0     │         │
│  │    🟢     │    🟢     │    🟢     │    🟢     │         │
│  └───────────┴───────────┴───────────┴───────────┘         │
│                                                             │
│  DETTE: 20j → 15j → 12j (↓40% ce trimestre)               │
│                                                             │
│  ADR RÉCENTS:                                               │
│  - ADR-012: Migration Zustand ✅                           │
│  - ADR-013: API v2 (en discussion)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Dashboard par Fréquence

### Dashboard Hebdomadaire

Pour la synchronisation d'équipe et le suivi opérationnel.

```markdown
# Dashboard Hebdo - Semaine [N]

## Métriques Clés

| Métrique | Valeur | Δ Semaine | Cible | Status |
|----------|--------|-----------|-------|--------|
| Cycle Time | 2.3j | -0.5j | < 3j | 🟢 |
| Features Livrées | 4 | +1 | 3-5 | 🟢 |
| Taux 1ère Valid. | 85% | = | > 80% | 🟢 |
| WIP actuel | 2 | - | ≤ 3 | 🟢 |

## Flux de Travail

| Status | Count | Limite | Alert |
|--------|-------|--------|-------|
| Ready | 5 | - | - |
| In Progress | 2 | 3 | ✅ |
| In Review | 1 | 2 | ✅ |
| Done (semaine) | 4 | - | - |

## Qualité

| Métrique | Valeur | Cible | Status |
|----------|--------|-------|--------|
| Couverture Tests | 84% | 80% | 🟢 |
| Bugs en Prod | 0 | 0 | 🟢 |
| Tests Flaky | 2 | 0 | 🟡 |

## Alertes

- ⚠️ SPEC-045 en WIP depuis 4 jours (limite: 3j)
- 🟡 2 tests flaky à investiguer

## Actions Semaine

- [ ] Débloquer SPEC-045 avec Alice
- [ ] Fix tests flaky auth
```

### Dashboard Mensuel

Pour le reporting stakeholders et le suivi des outcomes.

```markdown
# Dashboard Mensuel - [Mois Année]

## Outcomes

### Outcome 1 : [Nom]

| Semaine | Valeur | Progression |
|---------|--------|-------------|
| S1 | 2.1 | ████████░░░░ |
| S2 | 2.2 | █████████░░░ |
| S3 | 2.3 | █████████░░░ |
| S4 | 2.4 | ██████████░░ |

**Cible** : 3.0 | **Actuel** : 2.4 (80%)
**Projection** : Cible atteinte M+2 si trend maintenu

## Vélocité (3 derniers mois)

| Métrique | M-2 | M-1 | Ce Mois | Trend |
|----------|-----|-----|---------|-------|
| Features | 10 | 12 | 14 | ↑ +17% |
| Cycle Time | 3.2j | 2.8j | 2.5j | ↓ -11% |
| Prévisibilité | 75% | 78% | 82% | ↑ |

## Santé Technique

| Indicateur | Valeur | vs M-1 | Status |
|------------|--------|--------|--------|
| Couverture | 84% | +2% | 🟢 |
| Dette Tech | 12j | -3j | 🟢 |
| Incidents | 0 | = | 🟢 |

## Réalisations

- ✅ Filtres avancés - adoption 35%
- ✅ Migration Zustand - perf +40%
- 🔄 Notifications - ETA S+2

## Focus Mois Prochain

1. Finaliser notifications
2. Onboarding v2
3. Réduire dette à <10j
```

---

## Métriques Vélocité avec Agents

### Métriques spécifiques AIAD

| Métrique | Description | Formule | Cible |
|----------|-------------|---------|-------|
| Code acceptance rate | % code agent accepté sans modif | Commits directs / Total | > 70% |
| Prompt efficiency | Itérations par tâche | Prompts / Tâche complétée | < 3 |
| Agent productivity | Features par PE par semaine | Features / PE / Semaine | > 2 |
| Context quality | Taux réussite première génération | 1ère génération OK / Total | > 60% |

### Dashboard Agent Performance

```
┌─────────────────────────────────────────────────────────────┐
│  PERFORMANCE AGENTS - Semaine 3                             │
│                                                             │
│  Acceptance Rate    Prompt Efficiency    PE Productivity   │
│      78%                 2.1                  2.5          │
│  ████████████░░░     ███████████░░░      █████████████░░   │
│  Cible: >70% ✅      Cible: <3 ✅        Cible: >2 ✅      │
│                                                             │
│  QUALITÉ CODE GÉNÉRÉ                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Lint errors/PR: 1.2 (↓ était 3.5)                   │   │
│  │ Tests ajoutés: 94% des features                     │   │
│  │ Refactoring demandés: 15% (↓ était 30%)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  TOP AMÉLIORATIONS AGENT-GUIDE CE MOIS:                    │
│  1. Convention nommage hooks → -50% corrections            │
│  2. Pattern error handling → -40% bugs                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Qualité du Code Généré

### Métriques à suivre

| Catégorie | Métrique | Mesure | Outil |
|-----------|----------|--------|-------|
| Syntaxe | Erreurs lint | Par PR | ESLint |
| Tests | Couverture nouvelle | % lignes | Vitest/Jest |
| Sécurité | Vulnérabilités | Count | Snyk/npm audit |
| Performance | Bundle size delta | Ko | Bundlesize |
| Maintenabilité | Complexité | Score | SonarQube |

### Seuils d'alerte

```yaml
quality_gates:
  lint_errors_per_pr:
    warning: 3
    critical: 10
  coverage_new_code:
    warning: 70%
    critical: 50%
  security_vulns:
    warning: 1 (low)
    critical: 1 (high+)
  bundle_increase:
    warning: 10Ko
    critical: 50Ko
```

---

## Implémentation

### Option 1 : Notion / Coda (Simple)

**Structure de base :**

```markdown
## Tables Notion

### Table SPECs
- Nom (Title)
- Status (Select: Ready/InProgress/Review/Done)
- Assignee (Person)
- Start Date (Date)
- End Date (Date)
- Cycle Time (Formula): dateBetween(End, Start, "days")

### Table Outcomes
- Nom (Title)
- Métrique (Text)
- Cible (Number)
- Actuel (Number)
- Progression (Formula): Actuel / Cible * 100

### Vues Dashboard
1. Board Kanban filtré sur "Cette semaine"
2. Graphique progression Outcomes
3. Tableau métriques calculées
```

### Option 2 : Google Sheets + Looker Studio (Intermédiaire)

```markdown
## Structure Sheets

### Onglet: Events
| Date | SPEC_ID | Event | Assignee | Notes |
|------|---------|-------|----------|-------|

### Onglet: Metrics (calculé)
| Week | Cycle_Time | Done_Count | First_Pass |
|------|------------|------------|------------|

### Formules clés
- Cycle Time: =AVERAGEIFS(...)
- WIP: =COUNTIF(Status, "InProgress")

## Looker Studio
- Connecter Sheet
- Scorecards pour métriques clés
- Time series pour trends
- Filtres par période
```

### Option 3 : Script automatisé (Avancé)

```typescript
// metrics-collector.ts
interface WeeklyMetrics {
  week: string
  cycleTime: number
  featuresDelivered: number
  firstPassRate: number
  coverage: number
  techDebt: number
}

async function collectMetrics(): Promise<WeeklyMetrics> {
  const [issues, coverage, debt] = await Promise.all([
    fetchFromLinear(), // ou GitHub/Jira
    fetchFromCI(),
    fetchTechDebtEstimate()
  ])

  return {
    week: getCurrentWeek(),
    cycleTime: calculateAvgCycleTime(issues),
    featuresDelivered: countCompleted(issues),
    firstPassRate: calculateFirstPass(issues),
    coverage: coverage.total,
    techDebt: debt.days
  }
}

// Exécution: cron hebdo ou GitHub Action
```

---

## Exemples Pratiques

### Exemple 1 : Startup early-stage (équipe 3 personnes)

Dashboard minimaliste sur Notion :
- 1 board Kanban
- 3 métriques : Cycle Time, Features/semaine, Bugs prod
- Revue : 15 min lundi matin

### Exemple 2 : Scale-up (équipe 8 personnes)

Dashboard complet sur Looker Studio :
- Vue temps réel + hebdo + mensuel
- Métriques par squad si plusieurs
- Alertes Slack automatiques
- Revue : 30 min lundi + mensuel 1h

### Exemple 3 : Entreprise (reporting direction)

Dashboard exécutif :
- Focus outcomes et ROI
- Comparaison avant/après AIAD
- Trend 6 mois minimum
- Format : 1 page, scannable en 30 secondes

---

## Anti-patterns

### ❌ Dashboard vanity metrics

```
❌ "200 commits cette semaine !"
   → Mesure l'activité, pas la valeur

✅ "4 features livrées, outcome progression +5%"
   → Mesure la valeur délivrée
```

### ❌ Dashboard trop complexe

```
❌ 50 métriques sur un écran
   → Information overload, personne ne regarde

✅ 5-7 métriques clés, le reste en drill-down
   → Scannable, actionnable
```

### ❌ Métriques sans contexte

```
❌ "Cycle Time: 2.5j"
   → C'est bien ? C'est mal ?

✅ "Cycle Time: 2.5j (cible: <3j, trend: ↓)"
   → Contexte = compréhension = action
```

### ❌ Dashboard statique jamais mis à jour

```
❌ Dernière mise à jour: il y a 3 semaines
   → Perte de confiance, abandon

✅ Automatisation ou routine claire
   → Dashboard toujours fiable
```

---

## Checklist Dashboard

```markdown
## Setup Initial
- [ ] Métriques clés identifiées (5-7 max)
- [ ] Sources de données connectées
- [ ] Cibles définies pour chaque métrique
- [ ] Seuils d'alerte configurés
- [ ] Responsable maintenance désigné

## Design
- [ ] Hiérarchie visuelle claire (important = visible)
- [ ] Contexte présent (cible, trend, période)
- [ ] Scannable en 30 secondes
- [ ] Actions possibles identifiables

## Maintenance
- [ ] Routine de mise à jour définie
- [ ] Automatisation si possible
- [ ] Revue mensuelle des métriques pertinentes
- [ ] Archive des données historiques
```

---

*Voir aussi : [E.2 Revue Trimestrielle](E2-revue-trimestrielle.md) | [D.1 Alignment Stratégique](D1-alignment-strategique.md)*
