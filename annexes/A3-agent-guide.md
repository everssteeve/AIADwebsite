# A.3 Template AGENT-GUIDE

## Pourquoi ce template ?

L'AGENT-GUIDE (souvent implémenté comme fichier CLAUDE.md, CURSOR.md, ou .github/copilot-instructions.md) est le document qui configure le contexte pour les agents IA. Il leur permet de comprendre le projet, ses conventions et ses contraintes pour générer du code aligné avec l'existant.

**Responsable principal** : Agents Engineer

---

## Structure de l'AGENT-GUIDE

### 1. Présentation du Projet

```markdown
# AGENT-GUIDE

## Projet

[Nom du projet] - [Description en une ligne]

### Contexte
[2-3 phrases sur le contexte business et technique]

### Stack Principale
- Frontend : [Technologies]
- Backend : [Technologies]
- Base de données : [Technologies]
- Infrastructure : [Technologies]
```

### 2. Commandes Essentielles

```markdown
## Commandes

```bash
# Développement
[commande dev]          # Lancer le serveur de dev

# Qualité
[commande lint]         # Vérification du code
[commande test]         # Lancer les tests
[commande typecheck]    # Vérification des types

# Build
[commande build]        # Build de production
```
```

### 3. Structure du Projet

```markdown
## Structure

```
[racine]/
├── src/
│   ├── components/     # [Description]
│   ├── features/       # [Description]
│   ├── lib/           # [Description]
│   └── pages/         # [Description]
├── tests/             # [Description]
└── [autres dossiers importants]
```

### Conventions de Nommage
- Composants : [Convention, ex: PascalCase.tsx]
- Fichiers : [Convention, ex: kebab-case.ts]
- Variables : [Convention, ex: camelCase]
- Constantes : [Convention, ex: SCREAMING_SNAKE_CASE]
```

### 4. Conventions de Code

```markdown
## Conventions de Code

### Style
- [Indentation : tabs/spaces, combien]
- [Quotes : single/double]
- [Semicolons : oui/non]
- [Trailing commas : configuration]

### Imports
[Ordre des imports attendu]
1. [Catégorie 1]
2. [Catégorie 2]
3. [Catégorie 3]

### Patterns à Suivre
- [Pattern 1 avec exemple court]
- [Pattern 2 avec exemple court]

### Anti-patterns à Éviter
- [Anti-pattern 1]
- [Anti-pattern 2]
```

### 5. Règles Métier

```markdown
## Règles Métier

### [Domaine 1]
- [Règle importante 1]
- [Règle importante 2]

### [Domaine 2]
- [Règle importante 1]
- [Règle importante 2]
```

### 6. Instructions Spécifiques pour les Agents

```markdown
## Instructions pour les Agents IA

### Comportement Général
- [Instruction 1 : ex. "Toujours vérifier les types avant de modifier"]
- [Instruction 2 : ex. "Privilégier les modifications minimales"]
- [Instruction 3 : ex. "Ne pas créer de fichiers sauf si nécessaire"]

### Avant de Coder
- [Vérification 1]
- [Vérification 2]

### Après Avoir Codé
- [Action 1 : ex. "Lancer les tests"]
- [Action 2 : ex. "Vérifier le linting"]
```

---

## Exemple Complet

```markdown
# AGENT-GUIDE

## Projet

TaskFlow - Application de gestion de tâches collaborative en temps réel.

### Contexte
MVP pour équipes de 3-10 personnes. Focus sur la simplicité et la performance.
Utilisateurs cibles : startups et PME tech-savvy.

### Stack Principale
- Frontend : React 18 + TypeScript + Tailwind CSS
- Backend : Node.js + Hono + Drizzle ORM
- Base de données : PostgreSQL
- Infrastructure : Vercel (front) + Railway (back + DB)

## Commandes

```bash
# Développement
pnpm dev              # Lancer front et back en parallèle
pnpm dev:front        # Front seul (port 3000)
pnpm dev:back         # Back seul (port 8080)

# Qualité
pnpm lint             # ESLint
pnpm lint:fix         # ESLint avec auto-fix
pnpm typecheck        # tsc --noEmit
pnpm test             # Vitest
pnpm test:e2e         # Playwright

# Build
pnpm build            # Build de production
pnpm db:migrate       # Appliquer les migrations
pnpm db:generate      # Générer une migration
```

## Structure

```
taskflow/
├── apps/
│   ├── web/              # Application React
│   │   ├── src/
│   │   │   ├── components/   # Composants UI
│   │   │   ├── features/     # Logique métier par feature
│   │   │   ├── hooks/        # Hooks React custom
│   │   │   ├── lib/          # Utilitaires
│   │   │   └── pages/        # Routes
│   │   └── tests/
│   └── api/              # API Hono
│       ├── src/
│       │   ├── routes/       # Endpoints
│       │   ├── services/     # Logique métier
│       │   ├── db/           # Schéma et migrations
│       │   └── lib/          # Utilitaires
│       └── tests/
└── packages/
    └── shared/           # Types et validations partagés
```

### Conventions de Nommage
- Composants React : PascalCase.tsx (TaskCard.tsx)
- Hooks : useCamelCase.ts (useTaskList.ts)
- Fichiers utilitaires : kebab-case.ts (date-utils.ts)
- Variables/fonctions : camelCase
- Constantes : SCREAMING_SNAKE_CASE
- Types/Interfaces : PascalCase (sans préfixe I)

## Conventions de Code

### Style
- Indentation : 2 espaces
- Quotes : single quotes
- Semicolons : non
- Trailing commas : es5

### Imports (dans cet ordre)
1. React et hooks
2. Packages externes
3. Alias internes (@/)
4. Imports relatifs
5. Types (import type)

### Patterns à Suivre
- Composants : fonction + export nommé
  ```tsx
  export function TaskCard({ task }: TaskCardProps) {
    return <div>...</div>
  }
  ```
- Hooks pour la logique métier
- Zod pour la validation (partagé front/back)
- TanStack Query pour les appels API

### Anti-patterns à Éviter
- any : toujours typer explicitement
- useEffect pour la data fetching : utiliser TanStack Query
- Props drilling > 2 niveaux : utiliser un context ou composer
- console.log en production : utiliser le logger

## Règles Métier

### Tâches
- Une tâche appartient à exactement un projet
- Une tâche peut être assignée à 0 ou 1 membre
- Statuts possibles : todo, in_progress, done
- La suppression est soft delete (archived_at)

### Projets
- Un projet a au moins un membre (le créateur)
- Le créateur est automatiquement admin
- Rôles : admin, member

## Instructions pour les Agents IA

### Comportement Général
- Lire le code existant avant de modifier
- Privilégier l'édition à la création de fichiers
- Garder les modifications minimales et focalisées
- Suivre les patterns existants dans le code

### Avant de Coder
- Vérifier si un composant/hook similaire existe
- Comprendre le flow de données actuel
- Identifier les types existants à réutiliser

### Après Avoir Codé
- Lancer `pnpm typecheck`
- Lancer `pnpm lint`
- Lancer `pnpm test` si des tests existent pour le code modifié
- Vérifier que le code ajouté suit les conventions
```

---

## Conseils d'Utilisation

### Placement du Fichier

| Outil | Fichier | Emplacement |
|-------|---------|-------------|
| Claude Code | CLAUDE.md | Racine du projet |
| Cursor | .cursorrules | Racine du projet |
| GitHub Copilot | .github/copilot-instructions.md | Dossier .github |

### Maintenance

- **Mise à jour** : À chaque changement de convention ou de stack
- **Revue** : Lors des Tech Reviews
- **Validation** : Tester que les agents produisent du code conforme

### Erreurs Courantes

- **Trop verbeux** : Les agents ont une limite de contexte, être concis
- **Pas à jour** : Un guide obsolète produit du code incohérent
- **Trop restrictif** : Laisser de la flexibilité pour les cas non prévus

---

*Retour aux [Annexes](../framework/08-annexes.md)*
