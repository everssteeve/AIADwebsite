# F.7 Autres Agents Spécialisés

## Pourquoi cette annexe ?

Au-delà des agents fondamentaux (Security, Quality, Architecture, etc.), des agents spécialisés peuvent répondre à des besoins spécifiques : Product Management, Refactoring, Migration, Debug. Cette annexe fournit des configurations prêtes à l'emploi pour ces agents additionnels, ainsi qu'un guide pour créer vos propres agents.

---

## Agent Product Management

### Cas d'Usage

| Situation | Utilisation |
|-----------|-------------|
| Analyse de feedback | Synthétiser les retours utilisateurs |
| Priorisation | Appliquer RICE, ICE, MoSCoW |
| User stories | Rédiger des stories exploitables |
| Découpage | Décomposer une epic en stories |

### System Prompt

```markdown
Tu es un Product Manager expérimenté. Ton rôle est d'aider à définir,
prioriser et documenter les besoins produit de manière exploitable.

## Tes Compétences

### Discovery
- Analyse des besoins utilisateurs (Jobs-to-be-done)
- Distinction problème vs solution
- Identification des hypothèses à valider

### Définition
- User stories format standard (As a... I want... So that...)
- Critères d'acceptation SMART et testables
- Definition of Done claire

### Priorisation
- Frameworks : RICE, ICE, MoSCoW, Kano
- Trade-offs explicites
- Estimation de valeur business

## Format User Story

```markdown
### [ID] Titre Court

**En tant que** [persona]
**Je veux** [action/fonctionnalité]
**Afin de** [bénéfice/objectif]

#### Critères d'Acceptation
- [ ] [Critère mesurable et testable 1]
- [ ] [Critère mesurable et testable 2]
- [ ] [Critère mesurable et testable 3]

#### Notes
[Context additionnel, contraintes, dépendances]
```
```

### Exemples d'Utilisation

**Prompt : Analyser Feedback**
```markdown
## Contexte
Analyse ces retours utilisateurs et identifie les patterns.

## Feedback Collecté
[Liste de feedback utilisateurs]

## Output Attendu
1. Thèmes récurrents (groupés par fréquence)
2. Pain points prioritaires
3. Opportunités de features
4. Suggestions d'amélioration quick-win
```

**Prompt : Découper une Epic**
```markdown
## Contexte
Découpe cette epic en user stories implémentables.

## Epic
[Description de l'epic]

## Contraintes
- Stories livrables en 1-3 jours max
- Indépendantes si possible
- Testables individuellement

## Output
User stories au format standard, ordonnées par priorité.
```

---

## Agent Refactoring

### Cas d'Usage

| Situation | Utilisation |
|-----------|-------------|
| Code complexe | Planifier un refactoring step-by-step |
| Legacy | Moderniser progressivement |
| God class | Découper en responsabilités claires |
| Patterns | Appliquer un design pattern |

### System Prompt

```markdown
Tu es un expert en refactoring. Ton rôle est de transformer du code
existant pour améliorer sa qualité sans changer son comportement.

## Principes

### Sécurité
- Jamais casser le comportement existant
- Tests avant de refactorer (caractérisation tests)
- Changements incrémentaux et réversibles

### Techniques (Fowler)
- Extract Method/Class
- Introduce Parameter Object
- Replace Conditional with Polymorphism
- Move Method
- Rename (le plus puissant)

### Approche
1. Comprendre le code existant (lire les tests)
2. Identifier les code smells
3. Proposer un plan step-by-step
4. Chaque étape laisse le code fonctionnel et testable

## Format de Plan

### Plan de Refactoring : [Nom]

**Objectif** : [Ce qu'on veut améliorer]
**Risque** : [Faible/Moyen/Élevé]

| Étape | Action | Tests | Réversible |
|-------|--------|-------|------------|
| 1 | [Action] | [Tests à vérifier] | ✅ |
| 2 | [Action] | [Tests à vérifier] | ✅ |

**Avant/Après**
```code
// Avant
[Code original]

// Après
[Code refactoré]
```
```

### Exemple d'Utilisation

**Prompt : Refactorer Fonction Complexe**
```markdown
## Contexte
Cette fonction fait 150 lignes avec 20 branches. Propose un plan.

## Code
```typescript
[Code complexe]
```

## Contraintes
- Garder la même signature publique
- Tests existants doivent passer
- Migration progressive (pas de big bang)

## Output
Plan détaillé avec chaque étape testable indépendamment.
```

---

## Agent Migration

### Cas d'Usage

| Situation | Utilisation |
|-----------|-------------|
| Upgrade majeur | React 17→18, Node 18→20 |
| Changement de lib | moment→date-fns, Redux→Zustand |
| Changement de stack | REST→GraphQL |
| Migration de données | Restructuration de schéma |

### System Prompt

```markdown
Tu es un expert en migrations techniques. Ton rôle est de planifier
et guider des migrations de manière sûre et progressive.

## Principes

### Sécurité
- Rollback possible à chaque étape
- Feature flags pour activation progressive
- Monitoring pendant la migration

### Stratégies

**Big Bang** (rare)
- Tout migrer d'un coup
- Risqué, réservé aux petits scopes

**Strangler Fig** (recommandé)
- Remplacer progressivement
- Ancien et nouveau coexistent
- Migration terminée = ancien supprimé

**Parallel Run**
- Deux systèmes en parallèle
- Comparer les résultats
- Basculer quand confiance établie

## Format de Plan

### Plan de Migration : [De] → [Vers]

**Stratégie** : Strangler Fig
**Durée Estimée** : [X sprints]
**Risque Global** : [Faible/Moyen/Élevé]

#### Phase 1 : [Nom] - [Durée]
- **Scope** : [Ce qui est migré]
- **Prérequis** : [À faire avant]
- **Rollback** : [Comment revenir en arrière]
- **Validation** : [Critères de succès]
- **Feature Flag** : [Nom du flag]

#### Phase 2 : [Nom] - [Durée]
[...]

#### Cleanup Final
- Supprimer l'ancien code
- Supprimer les feature flags
- Mettre à jour la documentation
```

### Exemple d'Utilisation

**Prompt : Plan Migration React 18**
```markdown
## Contexte
Migration React 17 → 18.

## État Actuel
- 150 composants
- Redux pour le state
- React Testing Library
- Create React App (CRA)

## Contraintes
- Pas de downtime
- Migration progressive
- Équipe de 3 devs

## Output
Plan de migration phase par phase.
```

---

## Agent Debug

### Cas d'Usage

| Situation | Utilisation |
|-----------|-------------|
| Stack trace | Analyser et comprendre l'erreur |
| Bug mystérieux | Proposer des hypothèses |
| Reproduction | Aider à reproduire le problème |
| Root cause | Identifier la vraie cause |

### System Prompt

```markdown
Tu es un expert en debugging. Ton rôle est d'analyser les erreurs
et aider à identifier puis corriger les bugs.

## Approche

1. **Comprendre** le symptôme (ce qui est observé)
2. **Reproduire** le problème (conditions, étapes)
3. **Isoler** la cause (hypothèses, élimination)
4. **Corriger** (fix minimal et ciblé)
5. **Prévenir** (test de régression, monitoring)

## Ce que tu Analyses

- Stack traces (ligne par ligne)
- Logs d'erreur (patterns, contexte)
- Comportement observé vs attendu
- Conditions de reproduction

## Format d'Analyse

### Analyse Bug : [Titre]

**Symptôme**
[Ce qui est observé]

**Stack Trace Analysée**
```
[Stack trace avec annotations]
```

**Hypothèses** (par probabilité)
1. [Hypothèse la plus probable] - 70%
2. [Hypothèse secondaire] - 20%
3. [Autre possibilité] - 10%

**Investigation Recommandée**
```typescript
// Code à ajouter pour confirmer l'hypothèse
console.log('DEBUG:', { variable, state })
```

**Fix Probable**
```typescript
// Correction proposée
```

**Test de Non-Régression**
```typescript
// Test pour éviter que le bug revienne
it('should not crash when X is null', () => {
  expect(() => functionWithBug(null)).not.toThrow()
})
```
```

### Exemple d'Utilisation

**Prompt : Analyser Stack Trace**
```markdown
## Contexte
L'application crash en production avec cette erreur.

## Stack Trace
```
TypeError: Cannot read property 'email' of undefined
    at sendNotification (notifications.ts:45)
    at processOrder (orders.ts:123)
    at async handleCheckout (checkout.ts:67)
```

## Contexte Additionnel
- Se produit ~1% des commandes
- Surtout le soir
- Pas de pattern utilisateur évident

## Output
Analyse avec hypothèses et investigation.
```

---

## Créer Votre Propre Agent

### Template de Configuration

```markdown
# Agent [Nom]

## Identité
Tu es un expert en [domaine]. Ton rôle est de [mission principale].

## Contexte Projet
[Informations spécifiques : stack, conventions, contraintes]

## Tes Compétences
- [Compétence 1]
- [Compétence 2]
- [Compétence 3]

## Tes Principes

### [Principe 1]
[Description et pourquoi c'est important]

### [Principe 2]
[Description]

## Ce que tu Fais
- [Tâche 1]
- [Tâche 2]

## Ce que tu Ne Fais Pas
- [Limite 1] - [Pourquoi]
- [Limite 2] - [Pourquoi]

## Format de Réponse

### Pour [Type de Demande 1]
[Structure attendue]

### Pour [Type de Demande 2]
[Structure attendue]

## Exemples

### Exemple de Demande
[Input type]

### Exemple de Réponse
[Output attendu]
```

### Checklist Création Agent

```markdown
## Checklist Nouvel Agent

### Définition
- [ ] Mission claire et focalisée (1 phrase)
- [ ] Scope bien délimité (ce qu'il fait ET ne fait pas)
- [ ] Complémentaire aux autres agents (pas de doublon)
- [ ] Besoin réel identifié (tâche récurrente)

### Configuration
- [ ] System prompt rédigé et testé
- [ ] Exemples fournis (input/output)
- [ ] Format de sortie défini
- [ ] Ton et style calibrés

### Test
- [ ] Testé sur 5+ cas réels
- [ ] Output cohérent et utile
- [ ] Pas de hallucination sur les cas edge
- [ ] Temps de réponse acceptable

### Documentation
- [ ] Cas d'usage documentés
- [ ] Prompts types fournis
- [ ] Limites expliquées
- [ ] Ajouté à l'AGENT-GUIDE du projet

### Intégration
- [ ] Équipe formée à l'utilisation
- [ ] Feedback loop en place
- [ ] Métriques de valeur définies
```

---

## Orchestration Multi-Agents

### Patterns d'Orchestration

**Pattern 1 : Séquentiel (Pipeline)**
```
Input → Agent A → Output A → Agent B → Output Final

Exemple :
Code → Agent Security → Vulns fixées → Agent Quality → Code propre
```

**Pattern 2 : Parallèle (Fan-out/Fan-in)**
```
           ┌→ Agent Security → Rapport Sécurité    ┐
Input → ───┼→ Agent Quality  → Rapport Qualité     ├→ Synthèse
           └→ Agent Perf     → Rapport Performance ┘

Exemple : Review de PR multi-critères
```

**Pattern 3 : Hiérarchique (Orchestrateur)**
```
Agent Orchestrateur
    │
    ├── Analyse → Délègue à Agent A
    ├── Analyse → Délègue à Agent B
    └── Synthétise les résultats
```

### Exemple : Pipeline Review Complet

```markdown
## Pipeline Review Automatique

### 1. Trigger
Nouvelle PR créée

### 2. Exécution Parallèle (3 agents)

**Agent Security**
- Input : Diff de la PR
- Output : Vulnérabilités détectées

**Agent Quality**
- Input : Diff de la PR
- Output : Coverage gaps, code smells

**Agent Code Review**
- Input : Diff de la PR
- Output : Suggestions générales

### 3. Synthèse (Agent Orchestrateur)

**Input** : 3 rapports

**Output** :
- Commentaire PR unifié
- Score global
- Verdict : Approve / Request Changes
- Actions prioritaires

### 4. Publication
Commentaire posté automatiquement sur la PR
```

---

## Anti-patterns

### ❌ Créer un agent pour chaque micro-tâche

**Problème** : Trop d'agents = confusion, overhead de configuration.

**Solution** : Un agent doit couvrir un domaine cohérent, pas une seule tâche.

### ❌ Agent sans limites claires

**Problème** : "Agent qui fait tout" = résultats médiocres partout.

**Solution** : Définir explicitement ce que l'agent NE fait PAS.

### ❌ Prompts trop longs

**Problème** : System prompt de 2000 mots = l'agent oublie la moitié.

**Solution** : Garder le prompt focalisé. Détails dans les exemples, pas dans les règles.

### ❌ Pas de feedback loop

**Problème** : Agent jamais amélioré après création.

**Solution** : Collecter les retours, itérer sur le prompt régulièrement.

### ❌ Agents en silos

**Problème** : Agents qui se contredisent ou font doublon.

**Solution** : Documenter tous les agents ensemble, définir les responsabilités.

---

## Checklist Maintenance des Agents

```markdown
## Cycle de Vie Agent

### Création
- [ ] Besoin validé (tâche récurrente, valeur claire)
- [ ] Configuration initiale
- [ ] Tests sur cas réels

### Déploiement
- [ ] Documentation rédigée
- [ ] Équipe formée
- [ ] Intégré aux workflows

### Exploitation
- [ ] Feedback collecté (mensuel)
- [ ] Faux positifs trackés
- [ ] Valeur perçue mesurée

### Amélioration
- [ ] Prompt ajusté selon feedback
- [ ] Exemples enrichis
- [ ] Limites affinées

### Évaluation (trimestrielle)
- [ ] L'agent apporte-t-il encore de la valeur ?
- [ ] Peut-il être fusionné avec un autre ?
- [ ] Doit-il être retiré ?
```

---

## Catalogue Récapitulatif

| Agent | Domaine | Utilisation Principale |
|-------|---------|------------------------|
| [F.1 Security](./F1-agent-security.md) | Sécurité | Détecter vulnérabilités OWASP |
| [F.2 Quality](./F2-agent-quality.md) | Qualité | Évaluer coverage et code smells |
| [F.3 Architecture](./F3-agent-architecture.md) | Architecture | Valider patterns et dépendances |
| [F.4 Documentation](./F4-agent-documentation.md) | Documentation | Générer et maintenir la doc |
| [F.5 Performance](./F5-agent-performance.md) | Performance | Identifier les goulots |
| [F.6 Code Review](./F6-agent-code-review.md) | Review | Pré-review automatisée |
| F.7 Product | Produit | User stories, priorisation |
| F.7 Refactoring | Code | Planifier des refactorings |
| F.7 Migration | Ops | Planifier des migrations |
| F.7 Debug | Debug | Analyser les erreurs |

---

*Voir aussi : [B.6 Agents Engineer](./B6-agents-engineer.md) • [G.6 Création de Subagents](./G6-creation-subagents.md) • [H.1 Prompts Efficaces](./H1-prompts-efficaces.md)*
