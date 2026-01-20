# A.1 Template PRD (Product Requirements Document)

## Pourquoi cette annexe ?

Le PRD pose les fondations de tout projet AIAD. Sans PRD clair, les agents IA génèrent du code sans direction, le Product Engineer manque de contexte, et l'équipe perd du temps en clarifications. Un bon PRD permet de démarrer un projet en moins de 2 heures avec une vision partagée.

---

## Structure Complète du PRD

### 1. Vision Produit

Cette section ancre le projet dans un objectif clair.

```markdown
## Vision

**Vision en une phrase** : [Phrase qui capture l'essence du produit]

### Problème Adressé
[Description du problème utilisateur - douleur concrète, pas abstraite]

### Solution Proposée
[Comment le produit résout ce problème - mécanisme, pas features]

### Utilisateurs Cibles
| Persona | Contexte | Besoin Principal |
|---------|----------|------------------|
| [Nom] | [Situation] | [Ce qu'il cherche] |
```

**Justification** : La vision guide toutes les décisions. Sans elle, chaque feature devient un débat.

### 2. Outcomes Attendus

Les outcomes sont des résultats mesurables, pas des livrables.

```markdown
## Outcomes

### Outcome Principal
[Objectif business mesurable que le produit doit atteindre]

### Métriques de Succès (SMART)
| Métrique | Baseline | Cible | Échéance |
|----------|----------|-------|----------|
| [Métrique 1] | [Valeur actuelle] | [Valeur cible] | [Date] |
| [Métrique 2] | [Valeur actuelle] | [Valeur cible] | [Date] |

### Critères de Succès (DoOuD)
- [ ] [Critère quantitatif 1]
- [ ] [Critère quantitatif 2]
- [ ] [Critère qualitatif 1]
```

**Critères SMART pour les outcomes** :
- **S**pécifique : "Réduire le temps de X" pas "Améliorer X"
- **M**esurable : Chiffre concret avec baseline
- **A**tteignable : Réaliste avec les ressources
- **R**elevant : Lié à la vision
- **T**emporel : Échéance claire

### 3. Périmètre

Définir ce qui est inclus est aussi important que ce qui est exclu.

```markdown
## Périmètre

### Dans le Scope (MVP)
- [Fonctionnalité essentielle 1]
- [Fonctionnalité essentielle 2]
- [Fonctionnalité essentielle 3]

### Hors Scope (explicitement exclu)
- [Ce qui ne sera PAS fait] → Raison : [pourquoi]
- [Reporté à v2] → Raison : [pourquoi]

### Dépendances Externes
| Dépendance | Type | Impact si indisponible |
|------------|------|------------------------|
| [Système/API] | Technique | [Conséquence] |
| [Équipe/Décision] | Organisationnelle | [Conséquence] |
```

### 4. Contraintes

Les contraintes cadrent les solutions possibles.

```markdown
## Contraintes

### Techniques
- Stack : [Technologies imposées ou recommandées]
- Intégrations : [Systèmes à intégrer]
- Performance : [SLA, temps de réponse, etc.]

### Business
- Budget : [Montant ou fourchette]
- Délai : [Date cible]
- Ressources : [Composition équipe]

### Réglementaires
- [RGPD, accessibilité, sécurité, etc.]
```

### 5. Risques

Identifier les risques permet de les anticiper.

```markdown
## Risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| [Description] | Haute/Moyenne/Basse | Haut/Moyen/Bas | [Action préventive] |
| [Description] | Haute/Moyenne/Basse | Haut/Moyen/Bas | [Action préventive] |

### Risques Techniques
- [Risque lié à la stack, aux intégrations, etc.]

### Risques Business
- [Risque lié au marché, à l'adoption, etc.]
```

---

## Exemples Pratiques

### Exemple 1 : PRD Minimaliste (Projet Solo, MVP Rapide)

```markdown
# PRD : Outil de Suivi de Temps

## Vision
Un outil minimaliste qui permet aux freelances de tracker leur temps par projet
sans friction.

**Problème** : Les freelances perdent de l'argent en oubliant de facturer
des heures travaillées.

**Solution** : Un timer en un clic avec catégorisation automatique.

**Utilisateurs** : Freelances tech, 1-5 clients simultanés.

## Outcomes
| Métrique | Baseline | Cible | Échéance |
|----------|----------|-------|----------|
| Heures trackées/oubliées | 20% oubliées | < 5% | M+2 |
| Temps pour démarrer tracking | N/A | < 3 sec | M+1 |

## Périmètre MVP
✅ Timer start/stop en un clic
✅ Catégories de projets
✅ Export CSV
❌ Facturation (v2)
❌ App mobile (v2)

## Contraintes
- Stack : React + Supabase (compétences existantes)
- Budget infra : 0€ (tier gratuit)
- Délai : 2 semaines
```

### Exemple 2 : PRD Complet (Équipe, Produit Structuré)

```markdown
# PRD : Plateforme de Gestion de Tâches Collaborative

## Vision

**Vision** : Une plateforme qui élimine la friction de coordination dans les
petites équipes tech.

### Problème Adressé
Les équipes de 3-10 personnes utilisent 3+ outils (Slack, email, spreadsheets)
pour se coordonner sur les tâches. Résultat : 5h/semaine perdues en
synchronisation, tâches qui tombent entre les mailles.

### Solution Proposée
Une interface unique où chaque tâche a un owner clair, un statut visible,
et des notifications ciblées. L'équipe voit en temps réel qui fait quoi.

### Utilisateurs Cibles
| Persona | Contexte | Besoin Principal |
|---------|----------|------------------|
| Lead Dev | Gère 4-6 devs | Visibilité sur l'avancement |
| Développeur | Multitâche | Clarté sur ses priorités |
| PM | Coordination | Suivi sans micro-management |

## Outcomes

### Outcome Principal
Réduire le temps de coordination hebdomadaire de 5h à 3.5h (-30%)
sur les équipes utilisatrices.

### Métriques de Succès
| Métrique | Baseline | Cible | Échéance |
|----------|----------|-------|----------|
| Temps coordination/semaine | 5h | 3.5h | M+3 |
| Tâches sans owner > 24h | 30% | < 10% | M+2 |
| Tâches complétées/semaine | 20 | 28 | M+3 |
| NPS équipe | N/A | > 40 | M+3 |

### DoOuD
- [ ] Temps coordination réduit d'au moins 20% (seuil minimum)
- [ ] NPS > 30
- [ ] Adoption > 80% de l'équipe active quotidiennement

## Périmètre

### Dans le Scope (MVP)
- Création/édition/suppression de tâches
- Assignation à un membre
- Vue liste et vue kanban
- Statuts : À faire, En cours, Terminé
- Notifications lors d'assignation

### Hors Scope
- Intégration calendrier → v2 (complexité technique)
- Application mobile native → v2 (budget)
- Rapports avancés → v2 (besoin non validé)
- Sous-tâches → v2 (scope creep)

### Dépendances
| Dépendance | Type | Impact |
|------------|------|--------|
| Auth0 | Technique | Bloque le login |
| Design system | Organisationnelle | Ralentit l'UI |

## Contraintes

### Techniques
- Stack : React 18 + Node.js + PostgreSQL
- Hébergement : Vercel (front) + Railway (back)
- Performance : LCP < 2s, API < 200ms

### Business
- Budget : 5000€ total (infra + outils)
- Délai : MVP en 6 semaines
- Équipe : 1 PM, 1 PE, 1 TL (temps partiel)

### Réglementaires
- RGPD : Données en UE, export/suppression
- Accessibilité : RGAA AA

## Risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Adoption faible | Moyenne | Haut | Beta avec 2 équipes pilotes |
| Scope creep | Haute | Moyen | PRD signé, change request process |
| Complexité technique temps réel | Moyenne | Moyen | POC en semaine 1 |
```

---

## Anti-patterns

### ❌ Le PRD Roman

**Symptôme** : 20+ pages de prose détaillée avant d'avoir écrit une ligne de code.

**Problème** : Le PRD devient obsolète avant même de commencer. L'équipe ne le lit pas.

**Solution** : PRD d'une page pour le MVP. Itérer après les premiers feedbacks.

---

### ❌ Les Outcomes Vagues

**Symptôme** :
```markdown
## Outcomes
- Améliorer l'expérience utilisateur
- Augmenter la satisfaction client
- Rendre le produit plus performant
```

**Problème** : Impossible de savoir si l'outcome est atteint. Débats sans fin.

**Solution** :
```markdown
## Outcomes
| Métrique | Baseline | Cible |
|----------|----------|-------|
| Temps pour compléter tâche X | 45s | < 20s |
| CSAT post-onboarding | 3.2/5 | > 4.0/5 |
| LCP page principale | 3.5s | < 2s |
```

---

### ❌ Le PRD Technique

**Symptôme** : Le PRD décrit l'architecture, les endpoints API, les modèles de données.

**Problème** : Confusion des responsabilités. Le "comment" avant le "quoi".

**Solution** : Le PRD décrit le **quoi** et le **pourquoi**. Le **comment** va dans ARCHITECTURE et les SPECS.

---

### ❌ Le Scope Illimité

**Symptôme** :
```markdown
## Dans le Scope
- Gestion des tâches
- Gestion des projets
- Gestion des équipes
- Chat intégré
- Vidéo-conférence
- IA pour prioriser
- Intégrations avec 50 outils
```

**Problème** : MVP impossible à livrer. Paralysie par l'ambition.

**Solution** : Règle du "Si on ne peut le livrer en 4-6 semaines, c'est trop gros". Découper.

---

## Template Prêt à Copier

```markdown
# PRD : [Nom du Produit]

## Vision

**Vision en une phrase** :

### Problème Adressé


### Solution Proposée


### Utilisateurs Cibles
| Persona | Contexte | Besoin Principal |
|---------|----------|------------------|
|  |  |  |

---

## Outcomes

### Outcome Principal


### Métriques de Succès
| Métrique | Baseline | Cible | Échéance |
|----------|----------|-------|----------|
|  |  |  |  |

### DoOuD
- [ ]
- [ ]
- [ ]

---

## Périmètre

### Dans le Scope (MVP)
-
-
-

### Hors Scope
- [ ] → Raison :
- [ ] → Raison :

### Dépendances
| Dépendance | Type | Impact |
|------------|------|--------|
|  |  |  |

---

## Contraintes

### Techniques
- Stack :
- Performance :

### Business
- Budget :
- Délai :
- Équipe :

### Réglementaires
-

---

## Risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
|  |  |  |  |
```

---

## Checklist de Validation

Avant de considérer le PRD comme "Ready" :

- [ ] La vision est compréhensible en 30 secondes
- [ ] Au moins un outcome a une baseline et une cible chiffrée
- [ ] Le scope MVP tient en 5-7 items maximum
- [ ] Les exclusions sont explicites avec leurs raisons
- [ ] Les contraintes techniques sont réalistes
- [ ] Au moins 2 risques sont identifiés avec mitigation
- [ ] Le PRD tient sur 1-2 pages (pas un roman)
- [ ] Un nouveau membre de l'équipe pourrait comprendre le projet en le lisant

---

## Évolution du PRD

| Phase | Actions |
|-------|---------|
| **Semaine 0** | Version initiale minimaliste |
| **Chaque cycle** | Revue lors de l'Alignment Stratégique |
| **Post-MVP** | Ajout des learnings et pivot si nécessaire |
| **Trimestriel** | Revue complète : outcomes atteints ? Nouvelle vision ? |

Le PRD n'est pas un document figé. Il évolue avec le produit.

---

*Annexes connexes : [A.5 Template DoOD](./A5-dood.md) • [A.6 Template DoOuD](./A6-dooud.md) • [B.1 Product Manager](./B1-product-manager.md)*
