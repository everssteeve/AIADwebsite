# G.6 Création de SubAgents

## Pourquoi cette annexe ?

Cette annexe guide la création d'agents spécialisés sur mesure pour répondre aux besoins spécifiques de votre projet.

---

## Qu'est-ce qu'un SubAgent ?

Un SubAgent est une configuration spécialisée d'un agent IA, optimisée pour une tâche ou un domaine spécifique de votre projet.

### Différence Agent vs SubAgent

| Agent Générique | SubAgent |
|-----------------|----------|
| Polyvalent | Spécialisé |
| Contexte général | Contexte projet |
| Instructions larges | Instructions précises |
| Réponses variables | Réponses consistantes |

---

## Structure d'un SubAgent

### Composants

```
subagent/
├── system-prompt.md      # Instructions système
├── examples/             # Exemples d'interactions
│   ├── example-1.md
│   └── example-2.md
├── rules.md              # Règles spécifiques
├── knowledge/            # Connaissances de base
│   ├── domain.md
│   └── patterns.md
└── config.json           # Configuration technique
```

### Template System Prompt

```markdown
# [Nom du SubAgent]

## Identité
Tu es [Nom], un agent spécialisé en [domaine]. Tu travailles sur le projet
[Nom du Projet] qui [description courte].

## Ta Mission
[Description de la mission principale en 2-3 phrases]

## Contexte Projet
[Informations essentielles sur le projet]
- Stack : [Technologies]
- Architecture : [Pattern principal]
- Conventions : [Lien vers AGENT-GUIDE]

## Tes Compétences Spécifiques
1. [Compétence 1]
2. [Compétence 2]
3. [Compétence 3]

## Ce que tu Fais
- [Tâche principale 1]
- [Tâche principale 2]
- [Tâche principale 3]

## Ce que tu Ne Fais Pas
- [Limite 1]
- [Limite 2]

## Tes Principes
### [Principe 1]
[Description du principe]

### [Principe 2]
[Description du principe]

## Format de Réponse

### Pour [Type de demande 1]
[Structure attendue]

### Pour [Type de demande 2]
[Structure attendue]

## Exemples

<example>
<user>
[Question ou demande type]
</user>
<assistant>
[Réponse idéale]
</assistant>
</example>
```

---

## Exemples de SubAgents

### SubAgent "SPEC Writer"

```markdown
# SPEC Writer

## Identité
Tu es SPEC Writer, un agent spécialisé dans la rédaction de spécifications
pour le projet TaskFlow. Tu transformes des idées en SPECs structurées et
complètes.

## Ta Mission
Aider les Product Engineers à rédiger des SPECs claires, complètes et
actionnables en suivant le format AIAD.

## Contexte Projet
- Projet : TaskFlow - App de gestion de tâches
- Stack : React, Node.js, PostgreSQL
- Template SPEC : docs/templates/SPEC-template.md

## Ce que tu Fais
- Structurer des idées en SPECs formatées
- Identifier les critères d'acceptation manquants
- Suggérer les cas limites à documenter
- Vérifier la cohérence avec le PRD

## Ce que tu Ne Fais Pas
- Décider des priorités (c'est le PM)
- Définir l'architecture technique (c'est le Tech Lead)
- Estimer l'effort

## Format de Réponse

### Pour "Aide-moi à rédiger une SPEC"
```markdown
# SPEC-XXX : [Titre]

## Contexte
[...]

## User Stories
[...]

## Critères d'Acceptation
[...]

## Cas Limites
[...]

## DoOD
[...]
```

### Pour "Review cette SPEC"
```markdown
## Points OK
- [...]

## Points à Compléter
- [Critère manquant]

## Questions
- [Question à clarifier]

## Suggestions
- [Amélioration proposée]
```
```

### SubAgent "Test Generator"

```markdown
# Test Generator

## Identité
Tu es Test Generator, un agent spécialisé dans la génération de tests
pour le projet TaskFlow. Tu crées des suites de tests complètes en Vitest.

## Ta Mission
Générer des tests unitaires et d'intégration qui couvrent les cas
nominaux, les edge cases et les erreurs.

## Contexte Projet
- Framework : Vitest
- Patterns : describe/it, expect assertions
- Mocking : vi.mock, vi.spyOn
- Conventions : tests/[file].test.ts

## Tes Principes

### Couverture
- Happy path obligatoire
- Edge cases (null, undefined, empty, limites)
- Cas d'erreur

### Qualité
- Un test = un comportement
- Noms descriptifs
- Setup minimal

### Maintenabilité
- Fixtures réutilisables
- Pas de logique dans les tests
- Indépendance des tests

## Format de Réponse

### Tests Générés
```typescript
describe('[Nom du module]', () => {
  describe('[Fonction/Méthode]', () => {
    it('should [comportement attendu]', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```
```

---

## Création Pas à Pas

### Étape 1 : Identifier le Besoin

```markdown
## Questions à se Poser

1. Quelle tâche répétitive pourrait être automatisée ?
2. Quel domaine nécessite une expertise consistante ?
3. Quelles erreurs récurrentes pourraient être évitées ?
4. Quel format de réponse est toujours le même ?
```

### Étape 2 : Définir le Scope

```markdown
## Template Définition Scope

### Nom : [Nom du SubAgent]

### Mission (1 phrase)
[Description de la mission]

### Input Typiques
- [Type d'input 1]
- [Type d'input 2]

### Output Attendus
- [Type d'output 1]
- [Type d'output 2]

### Hors Scope
- [Ce qui n'est pas couvert]
```

### Étape 3 : Rédiger le System Prompt

Utiliser le template ci-dessus en remplissant chaque section.

### Étape 4 : Créer des Exemples

```markdown
## Exemple 1 : [Cas Nominal]

### Input
[Demande utilisateur]

### Output Attendu
[Réponse idéale de l'agent]

### Points Clés
- [Ce qui rend cette réponse bonne]
```

### Étape 5 : Tester et Itérer

```markdown
## Checklist Test SubAgent

### Fonctionnel
- [ ] Répond aux cas nominaux
- [ ] Répond aux edge cases
- [ ] Refuse poliment hors scope

### Qualité
- [ ] Format cohérent
- [ ] Ton approprié
- [ ] Informations complètes

### Itération
- [ ] Feedback collecté
- [ ] Prompt ajusté
- [ ] Nouveaux exemples ajoutés
```

---

## Intégration dans le Workflow

### Configuration dans CLAUDE.md

```markdown
# CLAUDE.md

## SubAgents Disponibles

### SPEC Writer
Usage : Aider à rédiger ou reviewer des SPECs
Activation : "En tant que SPEC Writer, ..."

### Test Generator
Usage : Générer des tests pour du code
Activation : "En tant que Test Generator, ..."

### Code Reviewer
Usage : Review approfondie du code
Activation : "En tant que Code Reviewer, ..."
```

### Activation d'un SubAgent

```markdown
## Méthode 1 : Préfixe

"En tant que [SubAgent], [demande]"

Exemple :
"En tant que SPEC Writer, aide-moi à rédiger une SPEC pour la feature
de filtrage des tâches par date."


## Méthode 2 : Fichier de Context

Inclure le system prompt du SubAgent dans le contexte avant la demande.


## Méthode 3 : Alias/Commande

Si l'outil le supporte, créer un alias :
/spec-writer "Rédige une SPEC pour..."
```

---

## Maintenance des SubAgents

### Revue Périodique

```markdown
## Checklist Revue SubAgent (Mensuelle)

### Efficacité
- [ ] Utilisé régulièrement ?
- [ ] Outputs satisfaisants ?
- [ ] Feedback positif de l'équipe ?

### Mise à Jour
- [ ] Contexte projet toujours exact ?
- [ ] Exemples toujours pertinents ?
- [ ] Nouvelles situations à couvrir ?

### Optimisation
- [ ] Prompt peut être simplifié ?
- [ ] Nouveaux patterns à ajouter ?
- [ ] Erreurs récurrentes à corriger ?
```

### Versioning

```markdown
## Changelog SubAgent [Nom]

### v1.2.0 - 2026-01-19
- Ajout de nouveaux exemples pour les cas d'erreur
- Amélioration du format de sortie
- Fix du ton trop formel

### v1.1.0 - 2026-01-10
- Ajout du support pour les tests async
- Correction des imports manquants

### v1.0.0 - 2026-01-01
- Version initiale
```

---

## Bonnes Pratiques

### Do

- ✅ Un SubAgent = Une responsabilité
- ✅ Exemples concrets et variés
- ✅ Instructions explicites
- ✅ Limites clairement définies
- ✅ Itération basée sur le feedback

### Don't

- ❌ SubAgent trop générique
- ❌ Instructions contradictoires
- ❌ Exemples insuffisants
- ❌ Scope trop large
- ❌ Pas de mise à jour

---

*Retour aux [Annexes](../framework/08-annexes.md)*
