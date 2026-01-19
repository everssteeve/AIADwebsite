# B.5 Détails Supporters (Rôles de Support)

## Pourquoi cette annexe ?

Cette annexe détaille les rôles de support dans AIAD : les personnes qui n'ont pas de responsabilité quotidienne mais interviennent ponctuellement pour débloquer ou enrichir. Elle clarifie quand et comment intervenir sans créer de friction.

---

## Principes des Rôles de Support

### Définition

Les Supporters sont des experts qui apportent une compétence spécifique quand nécessaire, sans être dans la boucle quotidienne de développement.

### Exemples de Supporters

| Rôle | Expertise | Intervention Typique |
|------|-----------|----------------------|
| **DevOps/SRE** | Infrastructure, CI/CD | Problèmes de déploiement, scaling |
| **DBA** | Base de données | Optimisation requêtes, migrations complexes |
| **Security Engineer** | Sécurité | Audit, incidents, compliance |
| **UX Designer** | Design | Maquettes, recherche utilisateur |
| **Data Engineer** | Data pipeline | Analytics, BI, reporting |
| **Domain Expert** | Métier spécifique | Règles business complexes |

### Mode d'Intervention

```
Normal : PE + Agents IA travaillent en autonomie
            │
            ▼
Besoin identifié (blocage, expertise requise)
            │
            ▼
Sollicitation du Supporter pertinent
            │
            ▼
Intervention ponctuelle (conseil, review, implementation)
            │
            ▼
Retour à l'autonomie normale
```

---

## Quand Solliciter un Supporter

### Critères de Sollicitation

| ✅ Solliciter | ❌ Ne pas solliciter |
|---------------|----------------------|
| Blocage technique réel | Confort de validation |
| Expertise hors compétence équipe | Question googleable |
| Décision à impact fort | Micro-optimisation |
| Incident en production | Feature standard |

### Exemples Concrets

#### DevOps/SRE

**Solliciter pour :**
- Configuration d'un nouveau service (cache, queue, etc.)
- Problème de performance en production
- Setup d'environnement de staging
- Incident de disponibilité

**Ne pas solliciter pour :**
- Ajouter une variable d'environnement
- Modifier un script de build standard
- Problème de CI qui passe en re-run

#### Security Engineer

**Solliciter pour :**
- Audit de sécurité avant une release majeure
- Nouvelle fonctionnalité d'authentification
- Incident de sécurité potentiel
- Compliance (RGPD, SOC2, etc.)

**Ne pas solliciter pour :**
- Validation de routine (couvert par les agents IA)
- Questions sur les bonnes pratiques documentées

#### UX Designer

**Solliciter pour :**
- Nouvelle feature nécessitant de la recherche utilisateur
- Redesign d'un parcours complexe
- Test utilisateur à organiser
- Création d'un design system

**Ne pas solliciter pour :**
- Ajustement de padding/margin
- Placement d'un bouton sur une page existante
- Choix de couleur dans la palette existante

---

## Anti-patterns de Sur-intervention

### 1. "Le Supporter Omniprésent"

**Symptôme** : Le supporter est dans toutes les discussions
```
❌ DevOps en review sur chaque PR
❌ Designer valide chaque changement UI
```

**Impact** : Bottleneck, perte d'autonomie de l'équipe

**Solution** : Intervention sur demande uniquement
```
✅ L'équipe appelle quand elle a besoin
✅ Pas de review systématique
✅ Guidelines documentées plutôt que validation continue
```

### 2. "Le Supporter Invisible"

**Symptôme** : Impossible de joindre le supporter quand nécessaire
```
❌ "Le DBA n'est jamais disponible"
❌ "On attend le security review depuis 2 semaines"
```

**Impact** : Blocages, compromis de qualité

**Solution** : SLA explicite
```
✅ Temps de réponse défini (ex: < 24h pour une question)
✅ Escalade claire si indisponible
✅ Documentation des patterns fréquents
```

### 3. "Le Supporter qui Prend le Contrôle"

**Symptôme** : Le supporter implémente au lieu de guider
```
❌ "Je vais le faire moi-même, c'est plus rapide"
```

**Impact** : Équipe ne monte pas en compétence, dépendance

**Solution** : Posture de conseil
```
✅ Expliquer le pourquoi, pas juste le comment
✅ Pair programming plutôt que prise en main
✅ Documenter pour les prochaines fois
```

### 4. "Le Supporter Gatekeepper"

**Symptôme** : Le supporter bloque sur des détails
```
❌ "Je ne valide pas, le nommage n'est pas parfait"
```

**Impact** : Frustration, contournement

**Solution** : Distinguer bloquant vs recommandation
```
✅ "Bloquant : faille de sécurité"
✅ "Recommandation : ce nommage serait plus clair"
```

---

## Protocole d'Intervention

### Demande d'Intervention

```markdown
## Demande de Support - [Type]

**Demandeur** : [Nom]
**Date** : [YYYY-MM-DD]
**Urgence** : [🔴 Bloquant | 🟠 Important | 🟡 Normal]

### Contexte
[Qu'est-ce qu'on fait ? Où en est-on ?]

### Besoin
[Quelle aide est nécessaire ?]

### Tentatives Déjà Faites
[Qu'est-ce qu'on a essayé ? Pourquoi ça n'a pas marché ?]

### Impact si Non Résolu
[Qu'est-ce qui est bloqué ?]

### Deadline
[Quand en a-t-on besoin ?]
```

### Réponse du Supporter

```markdown
## Réponse Support - [Référence]

**Supporter** : [Nom]
**Date** : [YYYY-MM-DD]

### Analyse
[Compréhension du problème]

### Recommandation
[Ce qu'il faut faire]

### Si Nécessaire : Implémentation
- [ ] Je peux implémenter - disponible le [date]
- [ ] L'équipe peut implémenter avec cette guidance
- [ ] Pair programming recommandé

### Documentation
[Si c'est un pattern récurrent, où documenter ?]
```

---

## Organisation des Supporters

### Modèle "Office Hours"

Pour les équipes avec plusieurs projets :

```markdown
## Office Hours - [Expertise]

**Supporter** : [Nom]
**Créneau** : [Jour] [Heure] - [Heure]
**Format** : Slot de 15-30 min, first come first served

### Comment Réserver
1. Ajouter son sujet dans [channel/doc]
2. Venir au créneau
3. Si urgent, message direct avec contexte

### Types de Sujets
✅ Questions techniques complexes
✅ Review de design/architecture
✅ Déblocage sur un problème

❌ Pas pour : urgences (utiliser le canal incident)
```

### Modèle "On-Call Rotation"

Pour les équipes avec besoin de support continu :

```markdown
## Rotation Support [Expertise]

### Planning
| Semaine | Primary | Secondary |
|---------|---------|-----------|
| S1 | Alice | Bob |
| S2 | Bob | Charlie |
| S3 | Charlie | Alice |

### SLA
- Questions normales : réponse < 4h (heures ouvrées)
- Urgences : réponse < 1h
- Incidents : immédiat

### Escalade
1. Primary on-call
2. Si indisponible : Secondary
3. Si tous indisponibles : Manager de l'équipe support
```

---

## Capitalisation des Interventions

### Objectif

Transformer les interventions ponctuelles en autonomie future.

### Template de Capitalisation

```markdown
## Learning - [Sujet]

**Date** : [YYYY-MM-DD]
**Source** : Intervention de [Supporter]

### Problème Initial
[Qu'est-ce qui a déclenché l'intervention ?]

### Solution Apportée
[Comment ça a été résolu ?]

### Pour la Prochaine Fois
[Comment l'équipe peut gérer seule ?]

### Documentation Créée
- [ ] Ajouté à l'AGENT-GUIDE
- [ ] Runbook créé/mis à jour
- [ ] ADR si décision architecturale
```

### Mise à Jour de l'AGENT-GUIDE

Après une intervention significative, mettre à jour l'AGENT-GUIDE :

```markdown
## Ajout Post-Intervention

### Section : [Nom]

[Nouvelle information issue de l'intervention]

Exemple :
```
## Optimisation PostgreSQL

Pour les requêtes sur des tables > 1M rows :
- Toujours utiliser des index sur les colonnes de filtre
- Éviter SELECT * - lister les colonnes explicitement
- Utiliser EXPLAIN ANALYZE pour vérifier le plan

Pattern validé par DBA - voir ADR-042
```
```

---

## Métriques de Support

### Indicateurs à Suivre

| Métrique | Cible | Alerte Si |
|----------|-------|-----------|
| Temps de réponse moyen | < 4h | > 8h |
| Interventions / semaine | Stable | +50% sur 4 semaines |
| % questions récurrentes | < 20% | > 40% |
| Satisfaction équipe | > 4/5 | < 3/5 |

### Interprétation

- **Interventions en hausse** → Besoin de formation ou documentation
- **Questions récurrentes** → Capitalisation insuffisante
- **Temps de réponse élevé** → Capacity planning à revoir

---

*Retour aux [Annexes](../framework/08-annexes.md)*
