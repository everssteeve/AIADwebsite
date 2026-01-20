# B.5 Supporters (Rôles de Support)

## Pourquoi cette annexe ?

Les Supporters sont des experts qui interviennent ponctuellement pour débloquer ou enrichir, sans être dans la boucle quotidienne. Cette annexe clarifie quand et comment solliciter ces rôles, et comment eux-mêmes peuvent contribuer efficacement sans créer de friction.

---

## Définition des Supporters

### Principe

Les Supporters apportent une expertise spécifique quand nécessaire. Ils ne sont pas dans le cycle quotidien de développement mais interviennent sur demande.

### Rôles Typiques

| Rôle | Expertise | Intervention Type |
|------|-----------|-------------------|
| **DevOps/SRE** | Infrastructure, CI/CD, observabilité | Problèmes de déploiement, scaling, incidents |
| **DBA** | Base de données, performance SQL | Optimisation requêtes, migrations complexes |
| **Security Engineer** | Sécurité applicative, compliance | Audits, incidents, nouvelles features sensibles |
| **UX Designer** | Recherche utilisateur, design | Maquettes, tests utilisateurs, design system |
| **Data Engineer** | Data pipeline, analytics | Intégrations BI, reporting, data quality |
| **Domain Expert** | Métier spécifique | Règles business complexes, validation |

### Mode d'Intervention

```
Fonctionnement Normal
────────────────────────────────────────────────────
PE + Agents IA travaillent en autonomie
────────────────────────────────────────────────────
            │
            ▼
Besoin identifié (blocage ou expertise requise)
            │
            ▼
Sollicitation du Supporter pertinent
            │
            ▼
Intervention ponctuelle (conseil, review, implémentation)
            │
            ▼
Capitalisation (documentation, AGENT-GUIDE)
            │
            ▼
Retour à l'autonomie normale
────────────────────────────────────────────────────
```

---

## Quand Solliciter un Supporter

### Critères de Sollicitation

| ✅ Solliciter | ❌ Ne Pas Solliciter |
|---------------|----------------------|
| Blocage technique réel après tentatives | Confort de validation |
| Expertise clairement hors compétence équipe | Question googleable |
| Décision à impact fort et irréversible | Micro-optimisation sans enjeu |
| Incident en production | Feature standard |
| Nouvelle zone technique inconnue | Répétition d'un pattern déjà vu |

### Guide par Rôle

#### DevOps / SRE

**Solliciter pour** :
- Configuration d'un nouveau service (cache, queue, monitoring)
- Problème de performance en production
- Setup d'environnement (staging, preview)
- Incident de disponibilité
- Scaling (horizontal, vertical)

**Ne pas solliciter pour** :
- Ajouter une variable d'environnement (doc existante)
- Modifier un script de build standard
- Problème de CI qui passe en re-run
- Questions sur Docker basiques

#### Security Engineer

**Solliciter pour** :
- Audit avant release majeure
- Nouvelle feature d'authentification/autorisation
- Incident de sécurité (même potentiel)
- Compliance (RGPD, SOC2, PCI-DSS)
- Manipulation de données sensibles (PII, paiements)

**Ne pas solliciter pour** :
- Validation de routine (couverte par les agents IA)
- Questions sur les bonnes pratiques documentées
- Choix de librairie standard

#### UX Designer

**Solliciter pour** :
- Nouvelle feature nécessitant recherche utilisateur
- Redesign d'un parcours complexe
- Création/extension du design system
- Test utilisateur à organiser
- Problème d'accessibilité complexe

**Ne pas solliciter pour** :
- Ajustement de padding/margin
- Placement d'un bouton sur page existante
- Choix de couleur dans la palette existante
- Application d'un pattern design system documenté

#### DBA

**Solliciter pour** :
- Migration de schéma complexe (millions de lignes)
- Optimisation de requête lente (> 1s)
- Choix de stratégie d'indexation
- Problème de deadlock ou contention
- Changement de type de base de données

**Ne pas solliciter pour** :
- Création de table standard
- Index simple sur une colonne
- Migration réversible standard
- Questions sur la syntaxe SQL

---

## Protocole de Demande

### Template de Demande

```markdown
## Demande de Support - [Type de Support]

**Demandeur** : [Nom]
**Date** : YYYY-MM-DD
**Urgence** : 🔴 Bloquant | 🟠 Important | 🟡 Normal

### Contexte
[Qu'est-ce qu'on fait ? Où en est-on dans le cycle ?]

### Besoin
[Quelle aide est nécessaire ? Soyez spécifique.]

### Tentatives Déjà Faites
[Qu'est-ce qu'on a essayé ? Pourquoi ça n'a pas marché ?]
- [Tentative 1] → [Résultat]
- [Tentative 2] → [Résultat]

### Impact si Non Résolu
[Qu'est-ce qui est bloqué ? Quel délai impacté ?]

### Deadline
[Quand en a-t-on besoin ? Pourquoi ?]

### Ressources Utiles
- [Lien vers le code concerné]
- [Lien vers la SPEC]
- [Logs/erreurs si applicable]
```

### Template de Réponse

```markdown
## Réponse Support - [Référence Demande]

**Supporter** : [Nom]
**Date** : YYYY-MM-DD

### Analyse
[Compréhension du problème et diagnostic]

### Recommandation
[Ce qu'il faut faire, avec justification]

### Mode d'Intervention
[ ] L'équipe peut implémenter seule avec cette guidance
[ ] Je recommande du pair programming
[ ] Je dois intervenir directement

### Prochaines Étapes
1. [Étape 1] - Responsable : [Nom]
2. [Étape 2] - Responsable : [Nom]

### Capitalisation
[ ] À documenter dans l'AGENT-GUIDE
[ ] À ajouter au runbook
[ ] Pattern récurrent → créer un guide
[ ] Pas de capitalisation nécessaire
```

---

## Organisation des Supporters

### Modèle "Office Hours"

Pour les équipes avec plusieurs projets utilisant le même pool de supporters.

```markdown
## Office Hours - [Expertise]

**Supporter** : [Nom]
**Créneau** : [Jour] [Heure] - [Heure]
**Format** : Slots de 15-30 min, premier arrivé premier servi

### Comment Réserver
1. Ajouter son sujet au doc partagé avant le créneau
2. Venir au créneau avec le contexte prêt
3. Si urgent et hors créneau : message direct avec template de demande

### Sujets Appropriés
✅ Questions techniques complexes
✅ Review de design/architecture
✅ Déblocage sur un problème

### Sujets Non Appropriés
❌ Urgences (utiliser le canal incident)
❌ Questions simples (utiliser la documentation)
❌ Validation de routine
```

### Modèle "On-Call Rotation"

Pour les équipes avec besoin de support continu.

```markdown
## Rotation Support - [Expertise]

### Planning
| Semaine | Primary | Secondary |
|---------|---------|-----------|
| S1 | Alice | Bob |
| S2 | Bob | Charlie |
| S3 | Charlie | Alice |

### SLA
| Urgence | Temps de Réponse |
|---------|------------------|
| 🔴 Incident prod | < 15 min |
| 🟠 Bloquant | < 2h (heures ouvrées) |
| 🟡 Normal | < 4h (heures ouvrées) |

### Escalade
1. Primary on-call
2. Si indisponible (15 min) : Secondary
3. Si tous indisponibles : Manager du supporter
```

---

## Capitalisation des Interventions

### Objectif

Chaque intervention doit réduire la probabilité qu'une intervention similaire soit nécessaire à l'avenir.

### Template de Capitalisation

```markdown
## Learning - [Sujet]

**Date** : YYYY-MM-DD
**Source** : Intervention de [Supporter] pour [Demande]

### Problème Initial
[Qu'est-ce qui a déclenché l'intervention ?]

### Solution Apportée
[Comment ça a été résolu ?]

### Pour la Prochaine Fois
[Comment l'équipe peut gérer seule ?]

### Actions de Capitalisation
- [ ] Ajouté à l'AGENT-GUIDE section [X]
- [ ] Runbook créé/mis à jour : [lien]
- [ ] ADR créé : ADR-XXX
- [ ] Aucune action (cas unique)
```

### Mise à Jour de l'AGENT-GUIDE

Après une intervention significative :

```markdown
## Ajout Post-Intervention - [Date]

### Section : [Nom de la section]

[Nouvelle information issue de l'intervention]

### Exemple Concret
[Code ou configuration validé par le supporter]

### À Éviter
[Anti-pattern découvert pendant l'intervention]

### Référence
- Intervention : [lien vers la demande]
- ADR : [si applicable]
```

---

## Anti-patterns

### 1. Le Supporter Omniprésent

**Symptôme** : Le supporter est dans toutes les discussions.

```
❌ DevOps en review sur chaque PR
❌ Designer valide chaque changement UI
❌ DBA consulté pour chaque requête SQL
```

**Impact** : Bottleneck, perte d'autonomie de l'équipe, supporter surchargé.

**Correction** :
```
✅ Intervention sur demande uniquement
✅ Guidelines documentées plutôt que validation continue
✅ L'équipe appelle quand elle a besoin
✅ Définir clairement ce qui nécessite validation vs ce qui ne le nécessite pas
```

### 2. Le Supporter Invisible

**Symptôme** : Impossible de joindre le supporter quand nécessaire.

```
❌ "Le DBA n'est jamais disponible"
❌ "On attend le security review depuis 2 semaines"
❌ Pas de réponse aux demandes
```

**Impact** : Blocages, compromis de qualité, frustration.

**Correction** :
```
✅ SLA explicite et respecté
✅ Escalade claire si indisponible
✅ Documentation des patterns fréquents
✅ Office hours réguliers
```

### 3. Le Supporter Qui Prend le Contrôle

**Symptôme** : Le supporter implémente au lieu de guider.

```
❌ "Je vais le faire moi-même, c'est plus rapide"
❌ Le supporter push du code sans transfert de connaissance
❌ L'équipe ne comprend pas ce qui a été fait
```

**Impact** : Équipe ne monte pas en compétence, dépendance, bus factor.

**Correction** :
```
✅ Expliquer le "pourquoi", pas juste le "comment"
✅ Pair programming plutôt que prise en main
✅ Documenter pour les prochaines fois
✅ L'équipe implémente, le supporter guide
```

### 4. Le Supporter Gatekeeper

**Symptôme** : Le supporter bloque sur des détails.

```
❌ "Je ne valide pas, le nommage n'est pas parfait"
❌ Bloque pour des préférences personnelles
❌ Review interminable avec commentaires mineurs
```

**Impact** : Friction, contournement du supporter, perte de confiance.

**Correction** :
```
✅ Distinguer bloquant vs recommandation
✅ Bloquant = sécurité, performance critique, incident potentiel
✅ Recommandation = amélioration non bloquante
✅ Feedback clair : "bloquant" vs "suggestion"
```

---

## Métriques de Support

| Métrique | Cible | Alerte Si |
|----------|-------|-----------|
| Temps de réponse moyen | < 4h | > 8h |
| Interventions / semaine | Stable | +50% sur 4 semaines |
| % questions récurrentes | < 20% | > 40% |
| Satisfaction équipe (survey) | > 4/5 | < 3/5 |
| Capitalisation post-intervention | > 80% | < 50% |

### Interprétation

| Signal | Diagnostic | Action |
|--------|------------|--------|
| Interventions en hausse | Manque de documentation ou formation | Investir dans la capitalisation |
| Questions récurrentes | Capitalisation insuffisante | Améliorer l'AGENT-GUIDE |
| Temps de réponse élevé | Capacity insuffisante | Revoir l'organisation, ajouter des supporters |
| Satisfaction basse | Problème relationnel ou de process | Retrospective avec l'équipe |

---

## Checklist

### Pour le Demandeur (Équipe AIAD)

Avant de solliciter un supporter :
- [ ] J'ai cherché dans la documentation existante
- [ ] J'ai tenté de résoudre seul (avec les agents IA)
- [ ] J'ai documenté mes tentatives et leurs résultats
- [ ] J'ai identifié le bon type de supporter
- [ ] J'ai préparé le contexte nécessaire

### Pour le Supporter

À chaque intervention :
- [ ] J'ai compris le contexte et le besoin
- [ ] J'ai expliqué le "pourquoi" de ma recommandation
- [ ] J'ai vérifié que l'équipe peut implémenter (ou fait du pair)
- [ ] J'ai identifié si capitalisation nécessaire
- [ ] J'ai mis à jour la documentation si applicable

### Pour l'Organisation

Trimestriellement :
- [ ] Review des métriques de support
- [ ] Identification des questions récurrentes
- [ ] Mise à jour des SLAs si nécessaire
- [ ] Feedback bidirectionnel (équipe ↔ supporters)

---

*Annexes connexes : [A.3 Template AGENT-GUIDE](A3-agent-guide.md) • [B.2 Product Engineer](B2-product-engineer.md) • [I.1 Troubleshooting](I1-troubleshooting.md)*
