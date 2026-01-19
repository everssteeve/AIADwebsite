# PARTIE 1 : PHASE D'INITIALISATION

La phase d'initialisation prépare les fondations du projet. Cette phase est critique pour le succès des sprints.

> 💡 **CONSEIL**
> Investissez le temps nécessaire. Une initialisation bâclée se paie cher en corrections.

## 1.1 Étape : Cadrage initial

| | |
|---|---|
| 🎭 **ACTEUR** | Product Owner (avec Tech Lead) |
| 📥 **ENTRÉES** | Idée de projet, contraintes business |
| 📤 **SORTIES** | Document de cadrage validé |
| ⏱️ **DURÉE** | 1-2 jours |

### 1.1.1 Questions fondamentales

- Quel problème résolvons-nous exactement ?
- Pour qui résolvons-nous ce problème (persona) ?
- Pourquoi maintenant ? Quelle urgence ?
- Quel est l'impact business attendu ?
- Comment saurons-nous que nous avons réussi ?

### 1.1.2 Template de cadrage

```markdown
# DOCUMENT DE CADRAGE
## Projet : [Nom du projet]

### 1. CONTEXTE ET VISION
**Problème identifié :**
[Description du problème]

**Vision :**
[Vision du produit en 1-2 phrases]

**Persona cible :**
[Description du persona principal]

### 2. OBJECTIFS MESURABLES
| Objectif | Métrique | Cible |
|----------|----------|-------|
| [Obj 1]  | [Métrique]| [Valeur] |

### 3. FONCTIONNALITÉS
**MVP (Must Have) :**
- [Fonctionnalité 1]
- [Fonctionnalité 2]

**Hors périmètre :**
- [Élément exclu 1]

### 4. CONTRAINTES
Budget : [X €]
Délai : [X semaines]
Équipe : [Composition]
```

## 1.2 Étape : Création du PRD

| | |
|---|---|
| 🎭 **ACTEUR** | Product Owner |
| 📥 **ENTRÉES** | Document de cadrage validé |
| 📤 **SORTIES** | PRD.md complet |
| ⏱️ **DURÉE** | 2-4 heures |
| 🔗 **DÉPENDANCES** | 1.1 Cadrage validé |

### 1.2.1 Prompt pour créer le PRD avec un LLM

```
Je souhaite créer un PRD pour mon projet.

**Contexte :**
[Coller le document de cadrage]

**Format souhaité :**
1. Contexte et problématique
2. Objectifs mesurables
3. Personas détaillés
4. User Stories (format: En tant que... je veux... afin de...)
5. Critères d'acceptation pour chaque story
6. Hors périmètre
7. Risques et mitigations
8. Métriques de succès

Pour chaque user story, inclure :
- ID unique (US-001, US-002...)
- Complexité (S, M, L)
- Critères d'acceptation testables

Je veux maintenant planifier ce que l'on a défini ensemble en MVP, V1, V2 et hors-périmètre. Propose-moi une répartition et je te ferai mon retour pour l'adapter.
```

**Consigne :** discuter avec le LLM jusqu'à obtenir un résultat qui vous convient (les bons éléments et une planification cohérente).

### 1.2.2 Structure du PRD

Génère un récapitulatif structuré ainsi :

- **Contexte** décrivant Problème et Opportunité
- **Objectifs** décrivant Objectifs mesurables et métriques de succès
- **Personas** décrivant les Profils utilisateurs détaillés
- **User Stories** décrivant les Fonctionnalités
- **Hors périmètre** décrivant Ce qui n'est PAS inclus
- **Risques** décrivant Identification des risques et mitigation

```
Puis, peux-tu mettre l'ensemble des éléments retenus de notre discussion au format Markdown afin d'avoir la version 1.0 du PRD ?

Ainsi je pourrais le copier/coller dans un fichier PRD.md et commencer à construire l'application avec un Agent IA de Codage.
```

| Section | Contenu | Importance |
|---------|---------|------------|
| Contexte | Problème, opportunité | Critique |
| Objectifs | Objectifs mesurables et métriques de succès | Critique |
| Personas | Profils utilisateurs détaillés | Élevée |
| User Stories | Fonctionnalités avec critères | Critique |
| Hors périmètre | Ce qui n'est PAS inclus | Élevée |
| Risques | Identification et mitigation | Moyenne |

## 1.3 Étape : Architecture technique

| | |
|---|---|
| 🎭 **ACTEUR** | Tech Lead |
| 📥 **ENTRÉES** | PRD.md validé |
| 📤 **SORTIES** | ARCHITECTURE.md complet |
| ⏱️ **DURÉE** | 1-2 jours |
| 🔗 **DÉPENDANCES** | 1.2 PRD validé |

### 1.3.1 Prompt pour demander des recommandations

Utiliser le "Plan Mode" (shift + tab dans la console Claude Code ou le demander explicitement à Claude Code) & déclencher un mode de reflexion avancé ("think" < "think hard" < "think harder" < "ultrathink")

```
Quelle stack technique serait idéale pour mon application décrite dans @PRD.md ?

Critères :
- Équipe : [X] Product Engineers
- Budget : [montant]
- Contraintes : [web, mobile, etc.]

Compare les options pour :
- Frontend (framework, styling)
- Backend (framework, langage)
- Base de données
- Hébergement

Pour chaque option, indique avantages, inconvénients, et compatibilité avec les agents IA.

Recommande un choix.

Think hard.
```

### 1.3.2 Sections de ARCHITECTURE.md

```
Documente l'ensemble des choix techniques dans un fichier ARCHITECTURE.md qui contient les choix retenus et s'il reste certains points à éclaircir, tu peux me demander. Garde uniquement l'architecture choisie, pas besoin de garder les options écartées.

Documente les sections suivantes :
- Vue d'ensemble (Description high-level de l'architecture)
- Stack technique (Technologies, versions, justifications)
- Structure du projet (Organisation des dossiers et modules)
- Conventions de code (Nommage, formatage, imports)
- Patterns utilisés (Design patterns avec exemples)
- API et interfaces (Contrats, formats)
- Base de données (Schéma, relations)
- Tests (Frameworks, organisation, couverture)

Pensez à sortir du mode plan
```

| Section | Contenu |
|---------|---------|
| Vue d'ensemble | Description high-level de l'architecture |
| Stack technique | Technologies, versions, justifications |
| Structure du projet | Organisation des dossiers et modules |
| Conventions de code | Nommage, formatage, imports |
| Patterns utilisés | Design patterns avec exemples |
| API et interfaces | Contrats, formats |
| Base de données | Schéma, relations |
| Tests | Frameworks, organisation, couverture |

## 1.4 Étape : Configuration environnement

| | |
|---|---|
| 🎭 **ACTEUR** | DevOps / Product Engineer |
| 📥 **ENTRÉES** | ARCHITECTURE.md validé |
| 📤 **SORTIES** | Environnement opérationnel |
| ⏱️ **DURÉE** | 0.5-1 jour |
| 🔗 **DÉPENDANCES** | 1.3 Architecture validée |

### 1.4.1 Installation Warp et Claude Code

```bash
# Installation Warp (terminal recommandé)
# macOS
brew install --cask warp

# Ou télécharger depuis https://www.warp.dev/

# Installation Claude Code
npm install -g @anthropic-ai/claude-code

# Vérification
claude --version

# Première utilisation (authentification)
claude
```

### 1.4.2 Setup du repository

```bash
# Création du projet
mkdir mon-projet && cd mon-projet
git init

# Fichier .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
dist/
.DS_Store
EOF

# Premier commit
git add .
git commit -m "Initial commit"

# Connexion GitHub
gh repo create mon-projet --private --source=. --remote=origin
git push -u origin main
```

<!-- TODO refaire en utilisant Claude Code -->

## 1.5 Étape : Création de CLAUDE.md

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer + Tech Lead |
| 📥 **ENTRÉES** | PRD, ARCHITECTURE, environnement prêt |
| 📤 **SORTIES** | CLAUDE.md opérationnel |
| ⏱️ **DURÉE** | 2-4 heures |
| 🔗 **DÉPENDANCES** | 1.4 Environnement configuré |

### 1.5.1 Initialisation

```bash
# Se placer à la racine du projet
cd mon-projet

# Lancer Claude Code
claude

# Initialiser CLAUDE.md
/init

# Claude pose des questions et génère un fichier de base
```

### 1.5.2 Template CLAUDE.md complet

```markdown
# CLAUDE.md - [Nom du projet]

## 🎯 Identité du Projet
Ce projet est **[Nom]**, [description courte].
**Domaine métier :** [Domaine]
**Utilisateurs :** [Personas]

## 📚 Documentation
- PRD : @docs/PRD.md
- Architecture : @docs/ARCHITECTURE.md

## 🛠️ Stack Technique
**Frontend :** React 18 + TypeScript + TailwindCSS
**Backend :** Node.js + Express + Prisma
**Database :** PostgreSQL

## ✅ RÈGLES ABSOLUES

### TOUJOURS :
1. TypeScript strict (jamais `any`)
2. Composants fonctionnels (pas de classes)
3. Validation Zod sur toutes les entrées
4. Gestion d'erreurs avec try/catch
5. Tests pour chaque nouvelle fonction

### JAMAIS :
1. Pas de `any` en TypeScript
2. Pas de `console.log` en production
3. Pas de secrets dans le code
4. Pas de logique métier dans les composants UI
5. Pas de fonctions > 50 lignes

## 🎨 Conventions de Code
| Type | Convention | Exemple |
|------|------------|---------|
| Composants | PascalCase.tsx | TaskCard.tsx |
| Hooks | useCamelCase.ts | useAuth.ts |
| Services | camelCase.ts | taskService.ts |

## 📖 Vocabulaire Métier
| Terme | Définition |
|-------|------------|
| [Terme 1] | [Définition] |
```

## 1.6 Étape : Configuration des permissions

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Politique de sécurité |
| 📤 **SORTIES** | .claude/settings.local.json |
| ⏱️ **DURÉE** | 30 minutes |
| 🔗 **DÉPENDANCES** | 1.5 CLAUDE.md créé |

### 1.6.1 Fichier de permissions recommandé

```json
// .claude/settings.local.json
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
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git push:*)",
      "WebFetch(domain:*)",
      "Skill(*)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(sudo:*)"
    ]
  }
}
```

## 1.7 Étape : Installation MCP et Plugins

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Besoins identifiés |
| 📤 **SORTIES** | MCPs opérationnels |
| ⏱️ **DURÉE** | 1-2 heures |
| 🔗 **DÉPENDANCES** | 1.6 Permissions configurées |

### 1.7.1 MCPs recommandés

| MCP | Usage | Installation dans warp |
|-----|-------|------------------------|
| Context7 | Documentation à jour | `claude mcp add context7 -- npx -y @upstash/context7-mcp` |
| Playwright | Contrôle navigateur | `claude mcp add playwright npx @playwright/mcp@latest` |

Dans Claude Code, afficher les MCP installés :

```
/mcp
```

Puis :

```
Ajoute context7 et playwright dans la config du projet
```

## 1.8 Étape : Configuration des SubAgents

| | |
|---|---|
| 🎭 **ACTEUR** | Tech Lead + Product Engineer |
| 📥 **ENTRÉES** | Besoins en expertise |
| 📤 **SORTIES** | SubAgents dans .claude/agents/ |
| ⏱️ **DURÉE** | 2-4 heures |
| 🔗 **DÉPENDANCES** | 1.7 MCPs installés |

### 1.8.1 Création de SubAgents

```bash
# Dans Claude Code
/agents

# Les agents sont stockés dans :
# - ~/.claude/agents/     (global)
# - .claude/agents/       (local au projet)
```

### 1.8.2 SubAgent : Code Reviewer

```markdown
# .claude/agents/code-reviewer.md

# Code Reviewer Agent

## Rôle
Expert en revue de code. Analyse et feedback constructif.

## Instructions
Quand tu reçois du code à reviewer :
1. Analyse structurelle (architecture, patterns)
2. Qualité (lisibilité, DRY)
3. Sécurité (validation, erreurs)
4. Performance (N+1, mémoisation)
5. Tests (couverture, cas limites)

## Format de sortie
### ✅ Points positifs
### ⚠️ Suggestions
### ❌ À corriger
### 📊 Score /10
```

### 1.8.3 SubAgent : Test Writer

```markdown
# .claude/agents/test-writer.md

# Test Writer Agent

## Rôle
Expert en écriture de tests.

## Instructions
1. Identifier cas nominal, limites, erreurs
2. Framework : Vitest (frontend), Jest (backend)
3. Pattern : Arrange-Act-Assert
4. Messages descriptifs

## Format
```typescript
describe('Module', () => {
  describe('fonction', () => {
    it('should [comportement] when [condition]', () => {
      // Arrange - Act - Assert
    });
  });
});
```
```

<!-- TODO Ajout : https://github.com/Fission-AI/OpenSpec/ -->
<!-- TODO Ajout : frontend-design de anthropic/claude-plugins-official -->
<!-- TODO Ajout : playwright-skill de playwright-skill@playwright-skill -->

## 1.9 Initialisation d'OpenSpec

Dans warp :

```bash
openspec init
```

Répondre aux différentes questions pour choisir Claude Code.

Créer le contexte projet d'OpenSpec.

## 1.10 Configuration dans CLAUDE.md

```
Ajoute ces informations dans mon @CLAUDE.md ne retouche pas à l'existant dans le fichier.

Aperçu de l'objectif du projet

Aperçu de l'architecture globale

Style visuel :
- Interface claire et minimaliste
- Pas de mode sombre pour le MVP

Contraintes et Politiques :
- NE JAMAIS exposer les clés API au client

Dépendances :
- Préférer les composants existants plutôt que d'ajouter de nouvelles bibliothèques UI

À la fin de chaque développement qui implique l'interface graphique :
- Tester avec playwright-skill, l'interface doit être responsive, fonctionnel et répondre au besoin développé

Documentation :
- Ajoute une section documentation avec les liens vers @PRD.md & @ARCHITECTURE.md

Context7 :
Utilise toujours context7 lorsque j'ai besoin de génération de code, d'étapes de configuration ou d'installation, ou de documentation de bibliothèque/API. Cela signifie que tu dois automatiquement utiliser les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation de bibliothèque sans que j'aie à le demander explicitement.

Note : Toutes les spécifications doivent être rédigées en français, y compris les specs OpenSpec (sections Purpose et Scenarios). Seuls les titres de Requirements doivent rester en anglais avec les mots-clés SHALL/MUST pour la validation OpenSpec.
```

## 1.11 Checklist de fin d'initialisation

| ✓ | Élément | Vérification |
|---|---------|--------------|
| ☐ | Document de cadrage | Validé par stakeholders |
| ☐ | PRD.md | Complet avec user stories |
| ☐ | ARCHITECTURE.md | Stack et conventions définis |
| ☐ | CLAUDE.md | Règles et contexte documentés |
| ☐ | Environnement | Node, Git, Claude Code installés |
| ☐ | Permissions | .claude/settings.local.json configuré |
| ☐ | MCPs | Context7, Playwright installés |
| ☐ | SubAgents | code-reviewer, test-writer créés |
| ☐ | Repository | Git initialisé, remote configuré |
| ☐ | CI/CD | Pipeline de base en place |

> ⚠️ **ATTENTION**
> Ne démarrez pas le développement tant que tous les éléments ne sont pas validés.

<!-- TODO Ajout dans la checklist : https://github.com/Fission-AI/OpenSpec/ -->
<!-- TODO Ajout dans la checklist : frontend-design de anthropic/claude-plugins-official -->
<!-- TODO Ajout dans la checklist : playwright-skill de playwright-skill@playwright-skill -->

## 1.12 Génération du readme.md

```
Génère le readme.md à partir des éléments contenus dans PRD.md, ARCHITECTURE.md et CLAUDE.md
```
