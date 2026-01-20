# B.4 Tech Lead

## Pourquoi cette annexe ?

Le Tech Lead dans AIAD est le garant de la cohérence technique et de la qualité architecturale du code généré par les agents IA. Cette annexe détaille comment conduire des design reviews, gérer la dette technique, et maintenir des standards sans devenir un bottleneck.

---

## Le Rôle Tech Lead en Contexte AIAD

### Ce Qui Change

| Tech Lead Traditionnel | Tech Lead AIAD |
|------------------------|----------------|
| Review du code humain ligne par ligne | Review des patterns et de la cohérence globale |
| Mentoring technique individuel | Configuration AGENT-GUIDE et standards |
| Écrit le code critique | Valide et guide les outputs IA |
| Décisions au fil de l'eau | Décisions documentées (ADRs) |
| Focus sur le "comment" | Focus sur le "pourquoi" et les contraintes |

### Responsabilités Clés

1. **Architecture** : Définir et maintenir l'architecture système
2. **Standards** : Établir et faire respecter les conventions via l'AGENT-GUIDE
3. **Dette Technique** : Identifier, prioriser et planifier le remboursement
4. **Review** : Valider la cohérence du code généré (pas ligne par ligne)
5. **Enablement** : Créer les conditions pour une génération de code optimale

---

## Design Reviews

### Quand Organiser une Design Review

| Situation | Review ? | Justification |
|-----------|----------|---------------|
| Nouvelle feature simple | Non | Les patterns existants suffisent |
| Feature avec impact architectural | **Oui** | Nouvelle structure ou dépendance |
| Changement de modèle de données | **Oui** | Impact sur plusieurs composants |
| Nouvelle dépendance majeure | **Oui** | Engagement long terme |
| Refactoring d'un module core | **Oui** | Risque de régression |
| Bug fix standard | Non | Correction locale |
| Optimisation de performance | **Oui** si structurelle | Peut modifier l'architecture |

### Structure d'une Design Review

```markdown
## Design Review - [Sujet]

**Date** : YYYY-MM-DD
**Durée** : 30-60 min
**Participants** : Tech Lead + PE concerné + [autres si pertinent]

### Contexte
[Pourquoi cette review ? Quel problème résoudre ?]

### Proposition
[Description de l'approche proposée par le PE]

### Alternatives Considérées
| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| A (proposée) | [...] | [...] |
| B | [...] | [...] |
| C (ne rien faire) | [...] | [...] |

### Points de Discussion
- [ ] [Question technique 1]
- [ ] [Question technique 2]
- [ ] [Impact sur l'existant]

### Décision
[Rempli pendant la review]

### Actions
- [ ] [Action 1] - Responsable : [Nom] - Deadline : [Date]
- [ ] [Action 2] - Responsable : [Nom] - Deadline : [Date]

### Suivi
ADR créé : ADR-XXX (si applicable)
```

### ADR (Architecture Decision Record)

Chaque décision architecturale significative doit être documentée.

```markdown
# ADR-XXX : [Titre]

## Statut
[Proposé | Accepté | Déprécié | Remplacé par ADR-YYY]

## Date
YYYY-MM-DD

## Contexte
[Quelle situation nécessite une décision ?]
[Quelles sont les contraintes et forces en jeu ?]

## Décision
[Quelle est la décision prise ?]
Formuler de manière active : "Nous allons..."

## Conséquences

### Positives
- [Bénéfice 1]
- [Bénéfice 2]

### Négatives
- [Coût ou trade-off 1]
- [Coût ou trade-off 2]

### Neutres
- [Changement qui n'est ni positif ni négatif]

## Alternatives Rejetées

### [Alternative A]
[Description et pourquoi rejetée]

### [Alternative B]
[Description et pourquoi rejetée]
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

Contraintes :
- Type-safety forte (les agents IA génèrent du code plus fiable avec de bons types)
- Performance (pas d'overhead significatif sur les requêtes)
- Simplicité (proche du SQL natif)

## Décision
Nous allons utiliser Drizzle ORM pour toutes les interactions base de données.

## Conséquences

### Positives
- Type-safety complète avec inférence depuis le schéma
- Syntaxe proche du SQL (facile à comprendre et débugger)
- Léger et performant (pas de client lourd)
- Migrations générées automatiquement depuis le schéma

### Négatives
- Moins mature que Prisma (communauté plus petite)
- Équipe doit apprendre une nouvelle syntaxe

### Neutres
- Changement dans le workflow de migrations (drizzle-kit vs prisma migrate)

## Alternatives Rejetées

### Prisma
Type-safety excellente mais :
- Client généré volumineux (~1MB)
- Syntaxe propriétaire éloignée du SQL
- Performance moindre sur requêtes complexes (N+1 par défaut)

### TypeORM
Plus mature mais :
- Types moins stricts (usage de any fréquent)
- Patterns decorators obsolètes
- Bugs connus non résolus depuis des années
```

---

## Gestion de la Dette Technique

### Types de Dette

| Type | Définition | Exemple |
|------|------------|---------|
| **Délibérée** | Compromis accepté pour livrer | "On hardcode maintenant, on paramètre si besoin" |
| **Accidentelle** | Introduite sans le savoir | Incohérences entre features générées par IA |
| **Entropie** | Dégradation naturelle | Dépendances obsolètes, tests flaky |

### Identification de la Dette

```markdown
## Sources de Dette à Surveiller

### Code Généré par IA
- Incohérences de patterns entre features
- Code dupliqué non détecté
- Over-engineering local
- Types trop permissifs (any)

### Infrastructure
- Dépendances avec vulnérabilités
- Scripts de build fragiles
- Configuration non versionnée

### Process
- Tests flaky non adressés
- Documentation périmée
- AGENT-GUIDE obsolète
```

### Matrice de Priorisation

| Impact \ Effort | Faible | Moyen | Élevé |
|-----------------|--------|-------|-------|
| **Élevé** | 🔴 Urgent | 🟠 Planifier | 🟡 Évaluer ROI |
| **Moyen** | 🟠 Planifier | 🟡 Évaluer | 🔵 Backlog |
| **Faible** | 🟡 Opportuniste | 🔵 Backlog | ⚪ Ignorer |

### Template de Ticket Dette

```markdown
## DEBT-XXX : [Titre]

### Type
[ ] Délibérée (compromis documenté)
[ ] Accidentelle (découverte)
[ ] Entropie (dégradation)

### Localisation
[Fichiers, modules, ou zones concernés]

### Description
[Quelle est la dette ? Comment s'est-elle formée ?]

### Impact Actuel
- [ ] Performance (ralentissement, timeouts)
- [ ] Maintenabilité (temps de modification élevé)
- [ ] Sécurité (vulnérabilité potentielle)
- [ ] DX (expérience développeur dégradée)
- [ ] Fiabilité (bugs fréquents dans cette zone)

### Risque si Non Traité
[Que se passe-t-il dans 3 mois ? 6 mois ?]

### Solution Proposée
[Comment rembourser cette dette ?]

### Effort Estimé
[ ] XS (< 2h)
[ ] S (2-4h)
[ ] M (1-2 jours)
[ ] L (3-5 jours)
[ ] XL (> 1 semaine)

### Priorité
[ ] 🔴 Urgent (traiter ce cycle)
[ ] 🟠 Planifier (dans le mois)
[ ] 🟡 Évaluer (besoin de plus d'info)
[ ] 🔵 Backlog (quand on aura le temps)
```

### Règle des 20%

```markdown
## Allocation du Temps pour la Dette

### Principe
Allouer ~20% du temps de chaque cycle au remboursement de dette.

### Options d'Application
- 1 jour sur 5 dédié à la dette
- 1 feature sur 5 est du remboursement
- Intégré dans chaque feature (boy scout rule)

### Quand Augmenter (> 20%)
- Après une période de crunch/deadline
- Avant une phase de scaling
- Quand la vélocité baisse significativement
- Avant onboarding de nouveaux membres

### Quand Réduire (< 20%)
- Deadline critique proche
- Code greenfield sans legacy
- Déjà très peu de dette
```

---

## Configuration de l'Environnement IA

### Responsabilité : AGENT-GUIDE

Le Tech Lead est responsable de créer et maintenir l'AGENT-GUIDE.

```markdown
## Checklist AGENT-GUIDE

### Structure Projet
- [ ] Arborescence documentée avec rôle de chaque dossier
- [ ] Points d'entrée identifiés (main, routes, etc.)
- [ ] Modules et leurs responsabilités

### Conventions de Code
- [ ] Nommage (fichiers, variables, fonctions, classes)
- [ ] Style (formatage, imports, exports)
- [ ] Patterns (hooks, services, composants, API)
- [ ] Gestion d'erreurs

### Exemples de Référence
- [ ] Composant "gold standard" → src/components/examples/
- [ ] Hook "gold standard" → src/hooks/examples/
- [ ] Endpoint API "gold standard" → src/api/examples/
- [ ] Test "gold standard" → tests/examples/

### Contraintes
- [ ] Dépendances à utiliser (et alternatives interdites)
- [ ] Patterns interdits (avec justification)
- [ ] Règles de sécurité spécifiques
```

### Tooling de Qualité

```markdown
## Configuration Qualité

### Linting (Obligatoire)
- ESLint avec règles strictes
- Règles spécifiques au projet dans .eslintrc
- CI échoue si lint errors

### TypeScript (Obligatoire)
- strict: true
- noImplicitAny: true
- strictNullChecks: true

### Pre-commit Hooks
- lint-staged pour lint + format
- Tests unitaires sur fichiers modifiés
- Type-check incrémental

### CI Checks (Bloquants)
- Lint
- Type-check
- Tests unitaires
- Tests d'intégration
- Couverture minimum
```

---

## Review de Code Généré par IA

### Ce Qu'il Faut Vérifier

| Aspect | Priorité | Focus |
|--------|----------|-------|
| Cohérence architecturale | 🔴 Haute | Le code suit-il l'architecture définie ? |
| Respect des patterns | 🔴 Haute | Les patterns du projet sont-ils utilisés ? |
| Sécurité | 🔴 Haute | Inputs validés, pas de secrets, permissions ? |
| Performance | 🟠 Moyenne | N+1, re-renders inutiles, calculs coûteux ? |
| Lisibilité | 🟠 Moyenne | Code compréhensible sans contexte ? |
| Tests | 🟠 Moyenne | Couverture suffisante et tests significatifs ? |

### Checklist de Review

```markdown
## Review Tech Lead - PR #XXX

### Architecture
- [ ] Code dans le bon module/dossier
- [ ] Pas de nouvelle dépendance non validée
- [ ] Pas de duplication de logique existante
- [ ] Pattern conforme à l'architecture

### Qualité
- [ ] Code compréhensible sans contexte supplémentaire
- [ ] Pas de over-engineering
- [ ] Gestion d'erreurs appropriée
- [ ] Logging suffisant pour debug (si applicable)

### Sécurité
- [ ] Pas de secrets en dur
- [ ] Inputs validés côté serveur
- [ ] Permissions vérifiées
- [ ] Pas de vulnérabilité évidente (injection, XSS)

### Performance (si applicable)
- [ ] Pas de requête N+1
- [ ] Pas de calcul coûteux dans le chemin critique
- [ ] Indexes DB si nouvelle requête

### Verdict
[ ] ✅ Approuvé
[ ] ⚠️ Approuvé avec commentaires mineurs
[ ] 🔄 Changements requis (non bloquant)
[ ] ❌ Rejet architectural (bloquant)
```

### Ce Qu'il Ne Faut PAS Faire

```
❌ Review ligne par ligne comme du code humain
❌ Bloquer pour des préférences de style (le linter s'en charge)
❌ Exiger la perfection sur chaque PR
❌ Review chaque PR personnellement (déléguer les PRs standard)
```

---

## Anti-patterns

### 1. Le Tech Lead Absent

**Symptôme** : Pas de review architecturale, décisions ad hoc.

```
❌ "Faites comme vous pensez, ça ira"
❌ Pas d'ADR, architecture implicite
❌ AGENT-GUIDE inexistant ou obsolète
```

**Impact** : Architecture incohérente, dette technique massive, code imprévisible.

**Correction** :
```
✅ Design review avant features complexes
✅ ADR pour toute décision structurante
✅ AGENT-GUIDE maintenu à jour
✅ Review régulière du code généré (pas toutes les PRs, mais un échantillon)
```

### 2. Le Tech Lead Gatekeeper

**Symptôme** : Tout passe par le Tech Lead.

```
❌ Review obligatoire de chaque PR
❌ File d'attente "waiting for TL review"
❌ Équipe ne peut rien merger sans approbation
```

**Impact** : Bottleneck, équipe déresponsabilisée, TL submergé.

**Correction** :
```
✅ Standards codifiés dans AGENT-GUIDE + linting
✅ PE peuvent merger si CI vert et self-review fait
✅ Review par les pairs pour les PRs standard
✅ TL review uniquement pour changements architecturaux
```

### 3. Le Tech Lead Perfectionniste

**Symptôme** : Refuse toute dette technique.

```
❌ "On ne peut pas merger ça, c'est pas parfait"
❌ Bloque pour des edge cases théoriques
❌ Refuse tout compromis
```

**Impact** : Paralysie, frustration, livraisons impossibles.

**Correction** :
```
✅ Accepter la dette délibérée si documentée (ADR)
✅ Distinguer "nice to have" vs "bloquant"
✅ Planifier le remboursement plutôt que bloquer
✅ Perfect is the enemy of done
```

### 4. Le Tech Lead Codeur

**Symptôme** : Écrit le code lui-même plutôt que de guider.

```
❌ "Laisse, je vais le faire moi-même"
❌ Réécrit le code des PE
❌ Ne délègue pas les décisions techniques simples
```

**Impact** : PE ne progressent pas, TL submergé, bus factor = 1.

**Correction** :
```
✅ Expliquer le "pourquoi", pas faire le "quoi"
✅ Pair programming plutôt que prise en main
✅ Documenter pour les prochaines fois
✅ Déléguer les décisions réversibles
```

---

## Métriques à Suivre

| Métrique | Cible | Alerte Si |
|----------|-------|-----------|
| Temps de review TL | < 4h | > 1 jour |
| ADRs documentés | 100% décisions majeures | Décision non documentée |
| Dette trackée | 100% identifiée | Dette découverte en prod |
| AGENT-GUIDE à jour | Oui | Dernière MàJ > 1 mois |
| PRs bloquées par TL | < 10% | > 30% |

---

## Checklist

### Hebdomadaire
- [ ] ADRs à jour avec décisions récentes
- [ ] AGENT-GUIDE reflète les nouveaux patterns
- [ ] Review de la dette technique (nouveaux items ? priorisation ?)
- [ ] Pas de PR bloquée > 24h

### Par Cycle
- [ ] Design review des features complexes faite
- [ ] Dette technique remboursée (~20%)
- [ ] Métriques qualité stables ou en hausse
- [ ] Standards respectés dans le code généré

### Trimestrielle
- [ ] Audit architectural complet
- [ ] Nettoyage des ADRs obsolètes
- [ ] Review des dépendances (mises à jour, sécurité)
- [ ] Retrospective technique avec l'équipe

---

*Annexes connexes : [A.2 Template ARCHITECTURE](A2-architecture.md) • [A.3 Template AGENT-GUIDE](A3-agent-guide.md) • [B.2 Product Engineer](B2-product-engineer.md)*
