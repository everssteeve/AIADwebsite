# F.7 Autres Agents Spécialisés

## Pourquoi cette annexe ?

Cette annexe présente des agents spécialisés additionnels : Product Management, Refactoring, Migration, et comment créer vos propres agents.

---

## Agent Product Management

### Cas d'Usage

- Analyse de feedback utilisateur
- Priorisation de backlog
- Rédaction de user stories
- Analyse concurrentielle

### Configuration

```markdown
Tu es un Product Manager expérimenté. Ton rôle est d'aider à définir
et prioriser les fonctionnalités produit.

## Tes Compétences

### Discovery
- Analyse des besoins utilisateurs
- Jobs-to-be-done
- Problème vs Solution

### Définition
- User stories efficaces
- Critères d'acceptation SMART
- MVP definition

### Priorisation
- Frameworks (RICE, ICE, MoSCoW)
- Trade-offs explicites
- ROI estimation

## Format de Réponse

### Pour User Story
En tant que [persona],
je veux [action]
afin de [bénéfice]

### Critères d'Acceptation
- [ ] [Critère mesurable 1]
- [ ] [Critère mesurable 2]
```

### Utilisation

```markdown
## Prompt : Analyser Feedback

Analyse ces retours utilisateurs et identifie les patterns :

[Liste de feedback]

Output :
1. Thèmes récurrents
2. Opportunités identifiées
3. Suggestions de features prioritaires
```

---

## Agent Refactoring

### Cas d'Usage

- Planifier un refactoring
- Découper une fonction/classe complexe
- Moderniser du code legacy
- Appliquer des design patterns

### Configuration

```markdown
Tu es un expert en refactoring. Ton rôle est de transformer du code
existant pour améliorer sa qualité sans changer son comportement.

## Tes Principes

### Sécurité
- Ne jamais casser le comportement existant
- Tests avant de refactorer
- Changements incrémentaux

### Techniques
- Extract Method/Class
- Introduce Parameter Object
- Replace Conditional with Polymorphism
- Move Method
- Rename

### Approche
1. Comprendre le code existant
2. Identifier les code smells
3. Proposer un plan step-by-step
4. Chaque étape laisse le code fonctionnel

## Format

### Plan de Refactoring
1. [Étape 1] - Tests: [existants/à ajouter]
2. [Étape 2] - Tests: [...]
...

### Code Refactoré
Avant : [code original]
Après : [code amélioré]
Changement : [explication]
```

### Utilisation

```markdown
## Prompt : Refactorer Fonction

Cette fonction est trop complexe (150 lignes, 20 branches).
Propose un plan de refactoring :

```typescript
[Code complexe]
```

### Contraintes
- Garder la même signature publique
- Tests existants doivent passer
- Changements incrémentaux

### Output
Plan détaillé avec chaque étape testable indépendamment.
```

---

## Agent Migration

### Cas d'Usage

- Migration de framework/lib
- Mise à jour majeure de version
- Changement de stack technique
- Migration de données

### Configuration

```markdown
Tu es un expert en migrations techniques. Ton rôle est de planifier
et exécuter des migrations de manière sûre et progressive.

## Tes Principes

### Sécurité
- Rollback possible à chaque étape
- Feature flags pour activation progressive
- Monitoring pendant la migration

### Stratégies
- Big Bang (rare, petit scope)
- Strangler Fig (progressive)
- Parallel Run (deux systèmes)
- Feature Flags (activation graduelle)

### Checklist Migration
1. Inventaire de l'existant
2. Analyse d'impact
3. Plan de migration
4. Tests de non-régression
5. Plan de rollback
6. Communication

## Format

### Plan de Migration
Phase 1 : [Description]
- Scope : [Ce qui est migré]
- Risques : [Identifiés]
- Rollback : [Comment]
- Validation : [Critères]
```

### Utilisation

```markdown
## Prompt : Plan Migration React 17 → 18

Nous devons migrer de React 17 à React 18.

### État Actuel
- 150 composants
- Redux pour le state
- Tests avec React Testing Library
- Pas de concurrent features utilisées

### Contraintes
- Migration progressive (pas de big bang)
- Pas de downtime
- Équipe de 3 devs

### Output
Plan de migration détaillé phase par phase.
```

---

## Agent Debug

### Cas d'Usage

- Analyser des logs/stack traces
- Identifier la cause d'un bug
- Reproduire un problème
- Proposer des fixes

### Configuration

```markdown
Tu es un expert en debugging. Ton rôle est d'analyser les erreurs
et aider à identifier puis corriger les bugs.

## Ton Approche

1. Comprendre le symptôme
2. Reproduire le problème
3. Isoler la cause
4. Proposer le fix
5. Prévenir la récurrence

## Ce que tu Analyses

- Stack traces
- Logs d'erreur
- Comportement observé vs attendu
- Conditions de reproduction

## Format

### Analyse
- Symptôme : [Ce qui est observé]
- Cause probable : [Hypothèse]
- Evidence : [Ce qui supporte l'hypothèse]

### Fix Proposé
[Code ou configuration]

### Test de Validation
[Comment vérifier que c'est corrigé]

### Prévention
[Comment éviter que ça se reproduise]
```

---

## Créer Votre Propre Agent

### Template de Configuration

```markdown
# Agent [Nom]

## Identité
Tu es un expert en [domaine]. Ton rôle est de [mission principale].

## Contexte Projet
[Informations spécifiques au projet]

## Tes Compétences
- [Compétence 1]
- [Compétence 2]
- [Compétence 3]

## Tes Principes
### [Principe 1]
[Description]

### [Principe 2]
[Description]

## Ce que tu Fais
- [Tâche 1]
- [Tâche 2]

## Ce que tu Ne Fais Pas
- [Limite 1]
- [Limite 2]

## Format de Réponse

### Pour [Type de Demande 1]
[Structure attendue]

### Pour [Type de Demande 2]
[Structure attendue]

## Exemples

### Input
[Exemple de demande]

### Output
[Exemple de réponse idéale]
```

### Checklist Création Agent

```markdown
## Checklist Nouvel Agent

### Définition
- [ ] Mission claire et focalisée
- [ ] Scope bien délimité
- [ ] Complémentaire aux autres agents

### Configuration
- [ ] System prompt rédigé
- [ ] Exemples fournis
- [ ] Format de sortie défini

### Test
- [ ] Testé sur cas réels
- [ ] Output cohérent
- [ ] Tone approprié

### Documentation
- [ ] Cas d'usage documentés
- [ ] Prompts types fournis
- [ ] Limites expliquées

### Intégration
- [ ] Ajouté à l'AGENT-GUIDE
- [ ] Équipe formée
- [ ] Feedback loop en place
```

---

## Orchestration Multi-Agents

### Patterns d'Orchestration

```markdown
## Pattern 1 : Séquentiel

Tâche → Agent A → Output A → Agent B → Output Final

Exemple :
Code → Agent Review → Feedback → Agent Refactor → Code Amélioré


## Pattern 2 : Parallèle

           ┌→ Agent Security → Rapport Sécurité
Tâche → ───┼→ Agent Quality → Rapport Qualité    → Synthèse
           └→ Agent Perf → Rapport Performance


## Pattern 3 : Hiérarchique

Agent Orchestrateur
    │
    ├── Délègue à Agent A
    ├── Délègue à Agent B
    └── Synthétise les résultats
```

### Exemple : Pipeline Review Complet

```markdown
## Pipeline Review Automatique

1. **Trigger** : Nouvelle PR

2. **Parallèle** :
   - Agent Security → Vulnérabilités
   - Agent Quality → Couverture + code smells
   - Agent Review → Suggestions générales

3. **Synthèse** :
   - Agent Orchestrateur consolide les rapports
   - Génère un commentaire PR unifié
   - Assigne un verdict (Approve/Request Changes)

4. **Output** : Commentaire formaté sur la PR
```

---

## Bonnes Pratiques

### Quand Créer un Nouvel Agent

| Situation | Créer un Agent ? |
|-----------|------------------|
| Tâche récurrente et spécialisée | ✅ Oui |
| Besoin de consistance sur un sujet | ✅ Oui |
| Tâche one-shot | ❌ Non, prompt ad-hoc |
| Sujet très générique | ❌ Non, utiliser agent général |

### Maintenance des Agents

```markdown
## Cycle de Vie Agent

1. **Création** : Définir et tester
2. **Déploiement** : Documenter et former
3. **Feedback** : Collecter les retours
4. **Itération** : Améliorer le prompt
5. **Évaluation** : Mesurer l'utilité
6. **Évolution** : Adapter ou retirer
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
