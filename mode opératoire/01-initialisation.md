# PARTIE 1 : PHASE D'INITIALISATION

La phase d'initialisation pose les fondations du projet. Cette phase n'a lieu qu'une fois par produit (ou à chaque pivot majeur). Elle est critique : sans initialisation structurée, les agents IA génèrent du code sans contexte, l'architecture émerge par accident, et la dette technique s'accumule dès le premier jour.

> 📖 Référence : @framework/05-boucles-iteratives.md - Section "Phase d'initialisation"

> 💡 **CONSEIL**
> Investissez le temps nécessaire. Une initialisation bâclée se paie cher en corrections. L'équipe doit pouvoir démarrer l'implémentation entre le jour 5 et 7.

---

## 1.1 Étape : Cadrage initial

| | |
|---|---|
| 🎭 **ACTEUR** | PM (avec Tech Lead) |
| 📥 **ENTRÉES** | Idée de projet, contraintes business |
| 📤 **SORTIES** | Document de cadrage validé |
| ⏱️ **DURÉE** | 1-2 jours |
| 🔗 **DÉPENDANCES** | Aucune |

### 1.1.1 Questions fondamentales

Répondez à ces cinq questions avant de rédiger le document de cadrage :

| Question | Objectif |
|----------|----------|
| Quel problème résolvons-nous exactement ? | Définir le problème, pas la solution |
| Pour qui résolvons-nous ce problème ? | Identifier le persona principal |
| Pourquoi maintenant ? | Justifier l'urgence et le timing |
| Quel est l'impact business attendu ? | Quantifier la valeur |
| Comment saurons-nous que nous avons réussi ? | Définir les métriques de succès |

### 1.1.2 Template de cadrage

Créez un fichier `CADRAGE.md` avec le contenu suivant :

```markdown
# DOCUMENT DE CADRAGE
## Projet : [Nom du projet]

### 1. CONTEXTE ET VISION
**Problème identifié :**
[Description du problème en 2-3 phrases]

**Vision :**
[Vision du produit en 1-2 phrases]

**Persona cible :**
[Description du persona principal : rôle, besoins, frustrations]

### 2. OBJECTIFS MESURABLES
| Objectif | Métrique | Cible | Échéance |
|----------|----------|-------|----------|
| [Objectif 1] | [Métrique] | [Valeur cible] | [Date] |
| [Objectif 2] | [Métrique] | [Valeur cible] | [Date] |

### 3. PÉRIMÈTRE FONCTIONNEL
**MVP (Must Have) :**
- [Fonctionnalité 1]
- [Fonctionnalité 2]

**V1 (Should Have) :**
- [Fonctionnalité 3]

**Hors périmètre :**
- [Élément exclu 1]
- [Élément exclu 2]

### 4. CONTRAINTES
| Type | Valeur |
|------|--------|
| Budget | [X €] |
| Délai | [X semaines] |
| Équipe | [Composition] |
| Techniques | [Contraintes spécifiques] |

### 5. RISQUES IDENTIFIÉS
| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| [Risque 1] | Haute/Moyenne/Basse | Fort/Moyen/Faible | [Action] |
```

### 1.1.3 Validation du cadrage

| ✓ | Critère | Vérification |
|---|---------|--------------|
| ☐ | Problème clair | Toute l'équipe peut l'expliquer en 1 phrase |
| ☐ | Objectifs mesurables | Au moins 2 métriques quantifiées |
| ☐ | Périmètre défini | MVP explicitement listé |
| ☐ | Hors périmètre documenté | Au moins 3 éléments exclus |
| ☐ | Stakeholders alignés | Document validé par décideurs |

> ⚠️ **ESCALADE** : Si les stakeholders ne s'accordent pas sur le problème ou les objectifs, organisez un atelier de cadrage avant de continuer.

---

## 1.2 Étape : Création du PRD

| | |
|---|---|
| 🎭 **ACTEUR** | PM |
| 📥 **ENTRÉES** | Document de cadrage validé |
| 📤 **SORTIES** | PRD.md complet |
| ⏱️ **DURÉE** | 2-4 heures |
| 🔗 **DÉPENDANCES** | 1.1 Cadrage validé |

> 📖 Référence : @framework/04-artefacts.md - Section "PRD"

### 1.2.1 Prompt pour créer le PRD avec un LLM

Ouvrez une nouvelle conversation avec un LLM (Claude, GPT-4, etc.) et utilisez ce prompt :

```
Je souhaite créer un PRD (Product Requirement Document) pour mon projet.

**Contexte :**
[Coller le contenu de CADRAGE.md]

**Format attendu :**
Structure le PRD avec les sections suivantes :
1. Contexte et Problème (quel problème ? pour qui ? pourquoi maintenant ?)
2. Outcome Criteria (métriques mesurables de succès)
3. Personas détaillés (profils, besoins, frustrations, scénarios)
4. User Stories au format : "En tant que [persona], je veux [action] afin de [bénéfice]"
5. Critères d'acceptation testables pour chaque User Story
6. Hors périmètre (ce que nous NE faisons PAS volontairement)
7. Trade-offs et décisions majeures
8. Risques et mitigations

**Exigences pour les User Stories :**
- ID unique (US-001, US-002...)
- Complexité (S, M, L)
- Critères d'acceptation vérifiables
- Rattachement à un persona

Commence par me poser des questions si certains éléments du contexte nécessitent clarification.
```

**Consigne** : Dialoguez avec le LLM jusqu'à obtenir un résultat satisfaisant. Challengez les propositions, affinez les User Stories, assurez-vous que les critères d'acceptation sont testables.

### 1.2.2 Prompt pour structurer le PRD final

Une fois les échanges terminés, demandez la mise en forme :

```
Génère maintenant la version finale du PRD au format Markdown.

Structure :
- **Contexte et Problème** : problème, opportunité, timing
- **Outcome Criteria** : métriques de succès mesurables
- **Personas** : profils utilisateurs détaillés
- **User Stories** : tableau avec ID, persona, story, complexité, critères d'acceptation
- **Hors périmètre** : liste explicite
- **Trade-offs** : décisions majeures et alternatives écartées
- **Risques** : identification et mitigation

Je copierai ce contenu dans un fichier docs/PRD.md pour démarrer le développement avec un agent IA de codage.
```

### 1.2.3 Structure attendue du PRD

| Section | Contenu | Importance |
|---------|---------|------------|
| Contexte et Problème | Problème, opportunité, timing | Critique |
| Outcome Criteria | Métriques de succès mesurables | Critique |
| Personas | Profils utilisateurs détaillés | Élevée |
| User Stories | Fonctionnalités avec critères d'acceptation | Critique |
| Hors périmètre | Ce qui n'est PAS inclus | Élevée |
| Trade-offs | Décisions et alternatives écartées | Moyenne |
| Risques | Identification et mitigation | Moyenne |

### 1.2.4 Validation du PRD

| ✓ | Critère | Vérification |
|---|---------|--------------|
| ☐ | Problème explicite | Section "Contexte et Problème" complète |
| ☐ | Outcomes mesurables | Au moins 3 métriques quantifiées |
| ☐ | Personas définis | Profils avec besoins et frustrations |
| ☐ | User Stories complètes | Toutes ont des critères d'acceptation testables |
| ☐ | Hors périmètre clair | Liste d'au moins 5 éléments exclus |

> 💡 **CONSEIL** : Un bon PRD permet à n'importe quel membre de l'équipe de comprendre le "pourquoi" du projet en moins de 10 minutes.

---

## 1.3 Étape : Architecture technique

| | |
|---|---|
| 🎭 **ACTEUR** | Tech Lead |
| 📥 **ENTRÉES** | PRD.md validé |
| 📤 **SORTIES** | ARCHITECTURE.md complet |
| ⏱️ **DURÉE** | 1-2 jours |
| 🔗 **DÉPENDANCES** | 1.2 PRD validé |

> 📖 Référence : @framework/04-artefacts.md - Section "ARCHITECTURE"

### 1.3.1 Prompt pour obtenir des recommandations

Utilisez le mode Plan de Claude Code (`shift + tab` ou demandez explicitement) et déclenchez un mode de réflexion avancé :

```
Analyse @docs/PRD.md et recommande une stack technique.

**Contraintes du projet :**
- Équipe : [X] Product Engineers
- Budget mensuel infrastructure : [montant]
- Type d'application : [web, mobile, desktop, API]
- Contraintes spécifiques : [temps réel, offline, multi-tenant, etc.]

**Compare les options pour :**
1. Frontend (framework, styling, state management)
2. Backend (framework, langage, ORM)
3. Base de données (type, service managé vs self-hosted)
4. Hébergement (cloud provider, stratégie de déploiement)
5. Services tiers (auth, email, paiement, etc.)

**Pour chaque option, indique :**
- Avantages et inconvénients
- Coût estimé
- Compatibilité avec les agents IA (qualité du code généré)
- Courbe d'apprentissage

Recommande un choix justifié pour chaque catégorie.

Think hard.
```

### 1.3.2 Prompt pour générer ARCHITECTURE.md

Après validation des choix techniques :

```
Documente les choix techniques retenus dans un fichier ARCHITECTURE.md.

**Sections requises :**

1. **Vue d'ensemble** : description high-level de l'architecture avec diagramme ASCII
2. **Stack technique** : technologies, versions exactes, justifications
3. **Structure du projet** : organisation des dossiers et modules
4. **Conventions de code** : nommage, formatage, organisation des imports
5. **Patterns utilisés** : design patterns avec exemples de code
6. **API et interfaces** : contrats, formats de données, versioning
7. **Base de données** : schéma, relations, stratégie de migration
8. **Tests** : frameworks, organisation, couverture cible
9. **Sécurité** : principes et pratiques obligatoires
10. **ADR** : section vide pour les futures Architecture Decision Records

**Exigences :**
- Chaque choix doit avoir une justification
- Inclure des exemples de code pour les conventions
- Ne pas documenter les options écartées

Quitte le mode Plan après génération.
```

### 1.3.3 Sections de ARCHITECTURE.md

| Section | Contenu | Obligatoire |
|---------|---------|-------------|
| Vue d'ensemble | Description high-level, diagramme | Oui |
| Stack technique | Technologies, versions, justifications | Oui |
| Structure du projet | Organisation dossiers et modules | Oui |
| Conventions de code | Nommage, formatage, imports | Oui |
| Patterns utilisés | Design patterns avec exemples | Oui |
| API et interfaces | Contrats, formats | Oui |
| Base de données | Schéma, relations | Oui |
| Tests | Frameworks, organisation, couverture | Oui |
| Sécurité | Principes obligatoires | Oui |
| ADR | Architecture Decision Records | Oui (vide au départ) |

### 1.3.4 Validation de l'architecture

| ✓ | Critère | Vérification |
|---|---------|--------------|
| ☐ | Stack justifiée | Chaque technologie a une rationale |
| ☐ | Structure définie | Arborescence des dossiers documentée |
| ☐ | Conventions explicites | Exemples de code pour chaque convention |
| ☐ | Patterns documentés | Au moins 3 patterns avec exemples |
| ☐ | Schéma DB initial | Entités principales définies |

---

## 1.4 Étape : Configuration de l'environnement

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | ARCHITECTURE.md validé |
| 📤 **SORTIES** | Environnement de développement opérationnel |
| ⏱️ **DURÉE** | 2-4 heures |
| 🔗 **DÉPENDANCES** | 1.3 Architecture validée |

### 1.4.1 Installation des prérequis

Exécutez les commandes suivantes selon votre système d'exploitation :

**Installation de Claude Code :**

```bash
# Installation via npm (Node.js 18+ requis)
npm install -g @anthropic-ai/claude-code

# Vérification de l'installation
claude --version

# Première authentification
claude
```

**Terminal recommandé (optionnel) :**

```bash
# macOS - Installation de Warp
brew install --cask warp

# Ou télécharger depuis https://www.warp.dev/
```

### 1.4.2 Initialisation du repository

```bash
# Création du projet
mkdir [nom-projet] && cd [nom-projet]

# Initialisation Git
git init

# Création de la structure de base
mkdir -p docs src tests .claude/agents

# Déplacement des artefacts
mv ../CADRAGE.md docs/
mv ../PRD.md docs/
mv ../ARCHITECTURE.md docs/

# Création du .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
vendor/
.venv/

# Environment
.env
.env.local
.env.*.local

# Build
dist/
build/
out/

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/
EOF

# Premier commit
git add .
git commit -m "chore: initialisation du projet avec artefacts AIAD"
```

### 1.4.3 Connexion au repository distant

```bash
# GitHub (via GitHub CLI)
gh repo create [nom-projet] --private --source=. --remote=origin
git push -u origin main

# Ou GitLab
git remote add origin git@gitlab.com:[organisation]/[nom-projet].git
git push -u origin main
```

### 1.4.4 Validation de l'environnement

| ✓ | Élément | Commande de vérification |
|---|---------|--------------------------|
| ☐ | Claude Code | `claude --version` |
| ☐ | Node.js 18+ | `node --version` |
| ☐ | Git configuré | `git config user.email` |
| ☐ | Repository distant | `git remote -v` |
| ☐ | Structure créée | `ls -la docs/ .claude/` |

---

## 1.5 Étape : Création de l'AGENT-GUIDE

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer + Tech Lead |
| 📥 **ENTRÉES** | PRD.md, ARCHITECTURE.md, environnement prêt |
| 📤 **SORTIES** | CLAUDE.md opérationnel |
| ⏱️ **DURÉE** | 2-4 heures |
| 🔗 **DÉPENDANCES** | 1.4 Environnement configuré |

> 📖 Référence : @framework/04-artefacts.md - Section "AGENT-GUIDE"

### 1.5.1 Initialisation avec Claude Code

```bash
# Se placer à la racine du projet
cd [nom-projet]

# Lancer Claude Code
claude

# Utiliser la commande d'initialisation
/init
```

Claude Code pose des questions et génère un fichier `CLAUDE.md` de base. Complétez-le ensuite manuellement.

### 1.5.2 Template CLAUDE.md complet

Créez ou complétez le fichier `CLAUDE.md` à la racine du projet :

````markdown
# CLAUDE.md - [Nom du projet]

## 🎯 Identité du Projet

Ce projet est **[Nom]**, [description en 1-2 phrases].

| Attribut | Valeur |
|----------|--------|
| **Domaine métier** | [Domaine] |
| **Utilisateurs cibles** | [Personas principaux] |
| **Objectif principal** | [Outcome principal] |

## 📚 Documentation de Référence

| Document | Chemin |
|----------|--------|
| PRD | @docs/PRD.md |
| Architecture | @docs/ARCHITECTURE.md |
| SPECs | @docs/specs/ |

## 🛠️ Stack Technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Frontend | [Framework] | [X.Y.Z] |
| Backend | [Framework] | [X.Y.Z] |
| Database | [Type] | [X.Y.Z] |
| Tests | [Framework] | [X.Y.Z] |

## ✅ RÈGLES ABSOLUES

### TOUJOURS :
1. TypeScript strict (jamais `any` sauf cas documenté)
2. Validation des entrées avec [Zod/Joi/autre]
3. Gestion d'erreurs explicite (try/catch, Result type)
4. Tests pour chaque nouvelle fonction publique
5. Commits conventionnels (feat:, fix:, chore:, etc.)

### JAMAIS :
1. `console.log` en production (utiliser le logger)
2. Secrets dans le code (utiliser les variables d'environnement)
3. Logique métier dans les composants UI
4. Requêtes N+1 en base de données
5. Fonctions de plus de 50 lignes

## 🎨 Conventions de Code

| Type | Convention | Exemple |
|------|------------|---------|
| Composants | PascalCase.tsx | `TaskCard.tsx` |
| Hooks | useCamelCase.ts | `useAuth.ts` |
| Services | camelCase.ts | `taskService.ts` |
| Types | PascalCase | `type TaskStatus = ...` |
| Constantes | SCREAMING_SNAKE | `const MAX_RETRIES = 3` |

## 📖 Vocabulaire Métier

| Terme | Définition |
|-------|------------|
| [Terme 1] | [Définition précise] |
| [Terme 2] | [Définition précise] |

## 🧩 Patterns de Développement

### Pattern : [Nom du pattern]

```typescript
// Exemple de code illustrant le pattern
```

## ⛔ Anti-Patterns

### Anti-pattern : [Nom]

```typescript
// ❌ À éviter
[code problématique]

// ✅ Préférer
[code correct]
```

## 📝 Notes d'Apprentissage

*Section mise à jour au fil du projet avec les learnings de l'équipe.*

- [Date] : [Learning découvert]
````

### 1.5.3 Validation de l'AGENT-GUIDE

| ✓ | Critère | Vérification |
|---|---------|--------------|
| ☐ | Identité claire | Nom, description, domaine définis |
| ☐ | Documentation liée | Références vers PRD et ARCHITECTURE |
| ☐ | Stack documentée | Toutes les technos avec versions |
| ☐ | Règles TOUJOURS/JAMAIS | Au moins 5 de chaque |
| ☐ | Conventions explicites | Exemples pour chaque type de fichier |
| ☐ | Vocabulaire métier | Au moins 5 termes définis |

---

## 1.6 Étape : Configuration des permissions

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | CLAUDE.md créé |
| 📤 **SORTIES** | `.claude/settings.local.json` configuré |
| ⏱️ **DURÉE** | 30 minutes |
| 🔗 **DÉPENDANCES** | 1.5 AGENT-GUIDE créé |

### 1.6.1 Fichier de permissions recommandé

Créez le fichier `.claude/settings.local.json` :

```json
{
  "permissions": {
    "allow": [
      "Read(*)",
      "Write(*)",
      "Edit(*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(mkdir:*)",
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(pnpm:*)",
      "Bash(yarn:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git push:*)",
      "Bash(git pull:*)",
      "Bash(git checkout:*)",
      "Bash(git branch:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "WebFetch(domain:*)",
      "Skill(*)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(sudo:*)",
      "Bash(chmod 777:*)"
    ]
  }
}
```

### 1.6.2 Personnalisation des permissions

| Niveau de confiance | Permissions recommandées |
|---------------------|--------------------------|
| **Restrictif** | Read, Write, Edit uniquement |
| **Standard** | + Bash pour commandes de dev (npm, git) |
| **Étendu** | + WebFetch, Skill |

> ⚠️ **ATTENTION** : Ne jamais autoriser `rm -rf` ou `sudo` sans validation manuelle.

---

## 1.7 Étape : Installation des MCPs

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Besoins identifiés dans ARCHITECTURE.md |
| 📤 **SORTIES** | MCPs opérationnels |
| ⏱️ **DURÉE** | 1-2 heures |
| 🔗 **DÉPENDANCES** | 1.6 Permissions configurées |

### 1.7.1 MCPs recommandés

| MCP | Usage | Commande d'installation |
|-----|-------|-------------------------|
| Context7 | Documentation des bibliothèques à jour | `claude mcp add context7 -- npx -y @upstash/context7-mcp` |
| Playwright | Contrôle navigateur, tests E2E | `claude mcp add playwright -- npx @playwright/mcp@latest` |

### 1.7.2 Installation et vérification

```bash
# Dans le terminal, installez les MCPs
claude mcp add context7 -- npx -y @upstash/context7-mcp
claude mcp add playwright -- npx @playwright/mcp@latest

# Dans Claude Code, vérifiez l'installation
/mcp
```

### 1.7.3 Configuration dans le projet

Demandez à Claude Code :

```
Ajoute la configuration des MCPs context7 et playwright dans la config du projet.
```

---

## 1.8 Étape : Configuration des SubAgents

| | |
|---|---|
| 🎭 **ACTEUR** | Tech Lead + Product Engineer |
| 📥 **ENTRÉES** | Besoins en expertise identifiés |
| 📤 **SORTIES** | SubAgents dans `.claude/agents/` |
| ⏱️ **DURÉE** | 2-4 heures |
| 🔗 **DÉPENDANCES** | 1.7 MCPs installés |

### 1.8.1 Accès aux agents

```bash
# Dans Claude Code, accédez à la gestion des agents
/agents

# Emplacement des fichiers :
# - ~/.claude/agents/     (global, tous les projets)
# - .claude/agents/       (local, ce projet uniquement)
```

### 1.8.2 SubAgent : Code Reviewer

Créez le fichier `.claude/agents/code-reviewer.md` :

````markdown
# Code Reviewer Agent

## Rôle
Expert en revue de code. Analyse le code et fournit un feedback constructif.

## Instructions
Quand tu reçois du code à reviewer :

1. **Analyse structurelle**
   - Architecture et organisation
   - Respect des patterns du projet (@docs/ARCHITECTURE.md)

2. **Qualité du code**
   - Lisibilité et clarté
   - Respect du principe DRY
   - Complexité cognitive

3. **Sécurité**
   - Validation des entrées
   - Gestion des erreurs
   - Données sensibles

4. **Performance**
   - Requêtes N+1
   - Mémoïsation manquante
   - Opérations coûteuses

5. **Tests**
   - Couverture
   - Cas limites
   - Assertions significatives

## Format de sortie

### ✅ Points positifs
[Liste des bonnes pratiques observées]

### ⚠️ Suggestions d'amélioration
[Améliorations non-bloquantes avec exemples de code]

### ❌ À corriger
[Problèmes bloquants à résoudre avant merge]

### 📊 Score global : X/10
````

### 1.8.3 SubAgent : Test Writer

Créez le fichier `.claude/agents/test-writer.md` :

````markdown
# Test Writer Agent

## Rôle
Expert en écriture de tests automatisés.

## Instructions
1. Identifier les cas de test :
   - Cas nominal (happy path)
   - Cas limites (edge cases)
   - Cas d'erreur

2. Utiliser le framework de test du projet :
   - Frontend : [Vitest/Jest/autre]
   - Backend : [Jest/Mocha/autre]
   - E2E : [Playwright/Cypress/autre]

3. Suivre le pattern Arrange-Act-Assert

4. Écrire des messages de test descriptifs

## Format de sortie

```typescript
describe('[Module]', () => {
  describe('[fonction/composant]', () => {
    it('should [comportement attendu] when [condition]', () => {
      // Arrange
      const input = ...

      // Act
      const result = ...

      // Assert
      expect(result).toBe(...)
    })
  })
})
```
````

### 1.8.4 Validation des SubAgents

| ✓ | Agent | Vérification |
|---|-------|--------------|
| ☐ | code-reviewer.md | Fichier présent dans `.claude/agents/` |
| ☐ | test-writer.md | Fichier présent dans `.claude/agents/` |
| ☐ | Invocation | Tester avec `/agents` puis sélectionner un agent |

---

## 1.9 Étape : Finalisation de CLAUDE.md

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Tous les éléments configurés |
| 📤 **SORTIES** | CLAUDE.md complet et opérationnel |
| ⏱️ **DURÉE** | 30 minutes |
| 🔗 **DÉPENDANCES** | 1.8 SubAgents configurés |

### 1.9.1 Prompt de finalisation

Utilisez ce prompt dans Claude Code pour compléter le CLAUDE.md :

```
Complète @CLAUDE.md avec les informations suivantes. Ne modifie pas les sections existantes.

**Sections à ajouter :**

### Style visuel
- Interface claire et minimaliste
- [Mode sombre : oui/non pour le MVP]

### Contraintes et politiques
- NE JAMAIS exposer les clés API au client
- [Autres contraintes spécifiques]

### Dépendances
- Préférer les composants existants plutôt que d'ajouter de nouvelles bibliothèques UI

### Workflow de développement
- À la fin de chaque développement impliquant l'interface graphique, tester avec playwright-skill
- L'interface doit être responsive, fonctionnelle et répondre au besoin développé

### Context7
Utilise toujours context7 lorsque tu as besoin de :
- Génération de code
- Étapes de configuration ou d'installation
- Documentation de bibliothèque/API

Cela signifie que tu dois automatiquement utiliser les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation sans que je le demande explicitement.

### Langue
Toutes les spécifications doivent être rédigées en français.
```

---

## 1.10 Étape : Génération du README

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | PRD.md, ARCHITECTURE.md, CLAUDE.md |
| 📤 **SORTIES** | README.md |
| ⏱️ **DURÉE** | 15 minutes |
| 🔗 **DÉPENDANCES** | 1.9 CLAUDE.md finalisé |

### 1.10.1 Prompt de génération

```
Génère un README.md à partir des informations contenues dans :
- @docs/PRD.md
- @docs/ARCHITECTURE.md
- @CLAUDE.md

**Structure attendue :**
1. Nom et description du projet
2. Fonctionnalités principales
3. Stack technique
4. Prérequis d'installation
5. Guide de démarrage rapide
6. Structure du projet
7. Scripts disponibles
8. Contribution
9. Licence
```

---

## 1.11 Checklist de fin d'initialisation

| ✓ | Élément | Vérification | Responsable |
|---|---------|--------------|-------------|
| ☐ | Document de cadrage | Validé par stakeholders | PM |
| ☐ | PRD.md | User Stories avec critères d'acceptation | PM |
| ☐ | ARCHITECTURE.md | Stack et conventions définies | Tech Lead |
| ☐ | CLAUDE.md | Règles et contexte documentés | PE + Tech Lead |
| ☐ | Environnement | Node.js, Git, Claude Code installés | PE |
| ☐ | Repository | Git initialisé, remote configuré | PE |
| ☐ | Permissions | `.claude/settings.local.json` configuré | PE |
| ☐ | MCPs | Context7, Playwright installés | PE |
| ☐ | SubAgents | code-reviewer, test-writer créés | PE |
| ☐ | README.md | Généré et à jour | PE |

> ⚠️ **ATTENTION**
> Ne démarrez pas le développement tant que tous les éléments ne sont pas validés. Une initialisation incomplète génère de la dette technique dès le premier jour.

---

## Problèmes courants

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| Claude Code ne reconnaît pas les artefacts | Chemins incorrects dans CLAUDE.md | Vérifier les chemins avec `@` (ex: `@docs/PRD.md`) |
| MCP non détecté | Installation échouée | Relancer `claude mcp add` et vérifier avec `/mcp` |
| Permissions refusées | Configuration restrictive | Ajuster `.claude/settings.local.json` |
| Agent génère du code générique | CLAUDE.md incomplet | Enrichir les sections règles et conventions |
| Erreur d'authentification Claude | Token expiré | Relancer `claude` pour ré-authentification |

> ⚠️ **ESCALADE** : Si un problème persiste après 30 minutes de troubleshooting, impliquez le Tech Lead ou consultez la documentation officielle de Claude Code.

---

*Version 1.0 - Janvier 2026*

> 📖 Références Framework utilisées :
> - @framework/04-artefacts.md
> - @framework/05-boucles-iteratives.md
