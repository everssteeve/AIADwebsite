# B.4 Détails Tech Lead

## Pourquoi cette annexe ?

Cette annexe détaille les responsabilités du Tech Lead dans AIAD, avec un focus sur la conduite des design reviews, la gestion de la dette technique et la gouvernance architecturale dans un contexte de génération de code par IA.

---

## Rôle Spécifique en Contexte AIAD

### Différences avec le Tech Lead Traditionnel

| Tech Lead Traditionnel | Tech Lead AIAD |
|------------------------|----------------|
| Revue de code humain | Revue de patterns et cohérence |
| Mentoring technique individuel | Configuration des agents et AGENT-GUIDE |
| Code critique lui-même | Valide et guide les outputs IA |
| Décisions au fil de l'eau | Décisions architecturales documentées (ADRs) |

### Responsabilités Clés

1. **Architecture** : Définir et maintenir l'architecture système
2. **Standards** : Établir et faire respecter les conventions
3. **Dette Technique** : Identifier, prioriser et planifier le remboursement
4. **Qualité** : Garantir la cohérence du code généré
5. **Enablement** : Configurer l'environnement pour une génération optimale

---

## Conduite des Design Reviews

### Quand Organiser une Design Review ?

| Situation | Review Nécessaire ? |
|-----------|---------------------|
| Nouvelle feature simple | Non |
| Nouvelle feature avec impact architectural | Oui |
| Changement de modèle de données | Oui |
| Ajout de nouvelle dépendance majeure | Oui |
| Refactoring d'un module core | Oui |
| Bug fix | Non |

### Structure d'une Design Review

```markdown
## Design Review - [Sujet]

**Date** : [YYYY-MM-DD]
**Durée** : 30-60 min
**Participants** : Tech Lead + PE concerné + [autres si pertinent]

### Contexte
[Pourquoi cette review ? Quel est le besoin ?]

### Proposition
[Description de l'approche proposée]

### Alternatives Considérées
| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| A | [...] | [...] |
| B | [...] | [...] |

### Points de Discussion
- [ ] [Question 1]
- [ ] [Question 2]

### Décision
[À remplir pendant la review]

### Actions
- [ ] [Action 1] - Responsable : [Nom]
- [ ] [Action 2] - Responsable : [Nom]
```

### Template ADR (Architecture Decision Record)

```markdown
# ADR-[XXX] : [Titre]

## Statut
[Proposé | Accepté | Déprécié | Remplacé par ADR-XXX]

## Date
[YYYY-MM-DD]

## Contexte
[Quelle situation nécessite une décision ?
Quelles sont les forces en jeu ?]

## Décision
[Quelle est la décision prise ?
Formuler de manière active : "Nous allons..."]

## Conséquences

### Positives
- [Conséquence positive 1]
- [Conséquence positive 2]

### Négatives
- [Conséquence négative 1]
- [Trade-off accepté]

### Neutres
- [Changement qui n'est ni positif ni négatif]

## Alternatives Rejetées
### [Alternative A]
[Pourquoi elle n'a pas été retenue]

### [Alternative B]
[Pourquoi elle n'a pas été retenue]
```

### Exemple d'ADR

```markdown
# ADR-007 : Utilisation de Drizzle ORM

## Statut
Accepté

## Date
2026-01-10

## Contexte
Nous devons choisir un ORM pour notre backend Node.js/TypeScript.
Critères :
- Type-safety forte (les agents IA génèrent du code plus fiable avec de bons types)
- Performance (pas d'overhead significatif)
- Familiarité équipe (courbe d'apprentissage)

## Décision
Nous allons utiliser Drizzle ORM.

## Conséquences

### Positives
- Type-safety complète avec inférence
- Proche du SQL natif (pas de magie)
- Léger et performant
- Migrations générées automatiquement

### Négatives
- Moins mature que Prisma (moins de docs/exemples)
- Équipe doit apprendre une nouvelle syntaxe

### Neutres
- Changement dans notre workflow de migrations

## Alternatives Rejetées

### Prisma
Type-safety excellente mais:
- Client généré lourd
- Syntaxe éloignée du SQL
- Performance moindre sur requêtes complexes

### TypeORM
Plus mature mais:
- Types moins stricts
- Patterns decorators vieillissants
- Bugs connus non résolus

### Raw SQL + Kysely
Plus de contrôle mais:
- Pas de gestion de migrations intégrée
- Plus de code boilerplate
```

---

## Gestion de la Dette Technique

### Identification de la Dette

```markdown
## Sources de Dette Technique

### 1. Dette Délibérée
Compromis acceptés pour livrer plus vite
- "On fait simple maintenant, on refactorera si ça scale"
- Documentée dans les ADRs

### 2. Dette Accidentelle (à surveiller avec code IA)
- Incohérences de patterns entre features
- Code dupliqué non détecté
- Over-engineering local

### 3. Dette d'Entropie
- Dépendances obsolètes
- Tests flaky non fixés
- Documentation périmée
```

### Matrice de Priorisation

| Impact \ Effort | Faible | Moyen | Élevé |
|-----------------|--------|-------|-------|
| **Élevé** | 🔴 Urgent | 🟠 Planifier | 🟡 Évaluer |
| **Moyen** | 🟠 Planifier | 🟡 Évaluer | 🔵 Backlog |
| **Faible** | 🟡 Évaluer | 🔵 Backlog | ⚪ Ignorer |

### Template de Ticket Dette

```markdown
## DEBT-[XXX] : [Titre]

### Type
[ ] Délibérée (compromis documenté)
[ ] Accidentelle (découverte)
[ ] Entropie (dégradation naturelle)

### Description
[Quelle est la dette ? Où se trouve-t-elle ?]

### Impact
[Qu'est-ce que cette dette cause comme problèmes ?]
- [ ] Performance
- [ ] Maintenabilité
- [ ] Sécurité
- [ ] Expérience développeur

### Risque si Non Traité
[Que se passe-t-il si on ne fait rien ?]

### Solution Proposée
[Comment rembourser cette dette ?]

### Effort Estimé
[ ] XS (< 2h)
[ ] S (2-4h)
[ ] M (1-2 jours)
[ ] L (3-5 jours)
[ ] XL (> 1 semaine)

### Priorité
[ ] 🔴 Urgent
[ ] 🟠 Planifier dans le mois
[ ] 🟡 À évaluer
[ ] 🔵 Backlog
```

### Allocation du Temps

```markdown
## Règle des 20%

Chaque cycle, allouer ~20% du temps au remboursement de dette :
- 1 jour sur 5
- 1 feature sur 5
- Ou intégré dans chaque feature (boy scout rule)

## Quand Augmenter ?
- Après une période de crunch
- Avant une phase de scaling
- Quand la vélocité baisse significativement

## Quand Réduire ?
- Deadline critique imminente
- Code greenfield sans legacy
```

---

## Configuration de l'Environnement IA

### AGENT-GUIDE : Responsabilité du Tech Lead

Le Tech Lead est responsable de :
1. **Créer** l'AGENT-GUIDE initial
2. **Maintenir** à jour avec l'évolution du projet
3. **Valider** que les agents produisent du code conforme

### Checklist de Configuration

```markdown
## Configuration Environnement IA

### AGENT-GUIDE
- [ ] Stack technique documentée
- [ ] Commandes principales listées
- [ ] Structure de projet expliquée
- [ ] Conventions de nommage définies
- [ ] Patterns à suivre avec exemples
- [ ] Anti-patterns à éviter listés
- [ ] Instructions spécifiques pour les agents

### Tooling
- [ ] Linting configuré et strict
- [ ] TypeScript en mode strict
- [ ] Pre-commit hooks (lint, format, tests)
- [ ] CI/CD avec checks bloquants

### Templates
- [ ] Template de composant
- [ ] Template de test
- [ ] Template de migration
- [ ] Exemples de code "gold standard"
```

### Patterns de Code "Gold Standard"

Maintenir des exemples de référence pour les agents :

```markdown
## Exemples de Référence

### Composant React Type
→ src/components/examples/ExampleCard.tsx

### Hook Custom Type
→ src/hooks/examples/useExampleData.ts

### Endpoint API Type
→ src/api/routes/examples/example.route.ts

### Test Unitaire Type
→ tests/examples/example.test.ts
```

---

## Review de Code Généré par IA

### Focus de la Review

| À Vérifier | Priorité |
|------------|----------|
| Cohérence avec l'architecture | 🔴 Haute |
| Respect des patterns du projet | 🔴 Haute |
| Sécurité (inputs, secrets, permissions) | 🔴 Haute |
| Performance (N+1, re-renders) | 🟠 Moyenne |
| Lisibilité et maintenabilité | 🟠 Moyenne |
| Tests suffisants | 🟠 Moyenne |
| Documentation si API publique | 🟡 Basse |

### Checklist de Review Tech Lead

```markdown
## Review Architecturale - PR #[XXX]

### Cohérence
- [ ] Pattern utilisé conforme à l'architecture
- [ ] Pas de nouvelle dépendance non validée
- [ ] Pas de duplication de logique existante
- [ ] Nomenclature conforme

### Qualité
- [ ] Code compréhensible sans contexte supplémentaire
- [ ] Pas de over-engineering
- [ ] Gestion d'erreurs appropriée
- [ ] Logging suffisant pour debug

### Sécurité
- [ ] Pas de secrets en dur
- [ ] Inputs validés
- [ ] Permissions vérifiées

### Performance
- [ ] Pas de requête N+1
- [ ] Pas de calcul coûteux dans le chemin critique
- [ ] Indexes DB si nouvelle requête

### Verdict
[ ] ✅ Approuvé
[ ] ⚠️ Approuvé avec commentaires mineurs
[ ] 🔄 Changements requis
[ ] ❌ Rejet architectural
```

---

## Anti-patterns du Tech Lead

### 1. "Le Tech Lead Absent"

**Symptôme** : Pas de review architecturale, décisions prises au fil de l'eau
```
❌ "Faites comme vous pensez, ça ira"
```

**Impact** : Architecture incohérente, dette technique massive

**Solution** : Présence proactive
```
✅ Design review avant les features complexes
✅ ADRs pour toute décision structurante
✅ Review régulière du code généré
```

### 2. "Le Tech Lead Gatekeeper"

**Symptôme** : Tout passe par le Tech Lead
```
❌ Bottleneck sur toutes les PRs
```

**Impact** : Ralentissement, équipe déresponsabilisée

**Solution** : Délégation et automation
```
✅ Standards codifiés dans l'AGENT-GUIDE
✅ Linting/tests automatiques en CI
✅ Review par les pairs pour les changements standard
✅ Tech Lead focus sur l'architectural
```

### 3. "Le Tech Lead Perfectionniste"

**Symptôme** : Refus de toute dette technique
```
❌ "On ne peut pas merger ça, c'est pas parfait"
```

**Impact** : Paralysie, frustration

**Solution** : Pragmatisme documenté
```
✅ Accepter la dette délibérée si documentée
✅ Distinguer le "nice to have" du bloquant
✅ Planifier le remboursement plutôt que bloquer
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
