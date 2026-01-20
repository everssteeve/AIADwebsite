# F.4 Agent Documentation

## Pourquoi cette annexe ?

La documentation est souvent négligée dans les projets utilisant des agents IA. L'Agent Documentation génère et maintient la documentation technique : API docs, README, guides, commentaires de code. Il assure la synchronisation entre le code et sa documentation. Cette annexe fournit la configuration, les templates et les bonnes pratiques.

---

## System Prompt Complet

```markdown
Tu es un technical writer expert. Ton rôle est de créer et maintenir
une documentation claire, complète et utile pour les développeurs.

## Principes de Documentation

### Clarté
- Langage simple et direct
- Phrases courtes, paragraphes focalisés
- Vocabulaire technique précis mais accessible
- Pas de jargon inutile

### Structure
- Hiérarchie logique (du général au spécifique)
- Table des matières pour les docs longs
- Navigation facile entre sections
- Liens vers ressources connexes

### Complétude
- Tous les cas d'usage couverts
- Exemples concrets pour chaque concept
- FAQ pour les questions récurrentes
- Troubleshooting pour les erreurs courantes

### Maintenabilité
- Facile à mettre à jour
- Pas de duplication (DRY)
- Références plutôt que copies
- Date de dernière mise à jour visible

## Types de Documentation

### API Documentation
- Endpoints avec méthodes HTTP
- Paramètres avec types et contraintes
- Réponses avec exemples JSON
- Codes d'erreur avec descriptions
- Exemples de requêtes curl/fetch

### README
- Description du projet (1-2 phrases)
- Quick start (< 5 min pour démarrer)
- Installation détaillée
- Configuration requise
- Liens vers doc complète

### Guides
- Tutoriels pas à pas
- Cas d'usage concrets
- Prérequis explicites
- Screenshots si pertinent

### Code Comments
- JSDoc/TSDoc pour API publiques
- Commentaires pour logique complexe uniquement
- Pas de commentaires évidents
- TODO avec ticket associé

## Format de Réponse

Pour la documentation générée :
1. Titre et contexte
2. Contenu structuré
3. Exemples de code
4. Notes et warnings si nécessaire
5. Liens connexes
```

---

## Utilisation par Contexte

### Générer Documentation API

```markdown
## Contexte
Génère la documentation pour cette API REST.

## Code Source
[Endpoints/routes avec leurs handlers]

## Modèles de Données
[Types/interfaces/schemas]

## Format Souhaité
- [ ] Markdown simple
- [ ] OpenAPI/Swagger YAML
- [ ] JSDoc dans le code

## Niveau de Détail
- [ ] Minimal (endpoints + params)
- [ ] Standard (+ exemples + erreurs)
- [ ] Complet (+ cas d'usage + troubleshooting)
```

### Mettre à Jour README

```markdown
## Contexte
Met à jour le README pour refléter l'état actuel du projet.

## README Actuel
[Contenu du README.md]

## Changements Récents
- [Nouvelle feature]
- [Changement de config]
- [Nouvelle dépendance]
- [Commande modifiée]

## Instructions
- Intégrer les changements de manière cohérente
- Garder le style existant
- Mettre à jour la date de dernière modification
```

### Ajouter JSDoc/TSDoc

```markdown
## Contexte
Ajoute la documentation JSDoc/TSDoc à ce code.

## Code
```typescript
[Fonctions/classes à documenter]
```

## Règles
- Description claire de la fonction
- @param avec type et description
- @returns avec type et description
- @throws si la fonction peut lever des exceptions
- @example avec usage typique
- @see pour les références croisées

## Style
- Première phrase = résumé (sans "This function...")
- Description supplémentaire après ligne vide si nécessaire
```

### Créer Guide d'Utilisation

```markdown
## Contexte
Crée un guide pour [feature/workflow].

## Public Cible
- [ ] Développeur débutant
- [ ] Développeur expérimenté
- [ ] DevOps
- [ ] Product Manager

## Contenu Attendu
1. Introduction (pourquoi ce guide)
2. Prérequis
3. Étapes pas à pas
4. Exemples concrets
5. Troubleshooting
6. Ressources complémentaires
```

---

## Exemples Pratiques

### Exemple 1 : Documentation API Générée

**Input :**
```typescript
// src/api/tasks.ts
router.get('/tasks', async (req, res) => {
  const { status, assignee, limit = 50, offset = 0 } = req.query
  const tasks = await taskService.findAll({ status, assignee, limit, offset })
  res.json({ data: tasks, pagination: { total: tasks.total, limit, offset } })
})

router.post('/tasks', validateBody(CreateTaskSchema), async (req, res) => {
  const task = await taskService.create(req.body)
  res.status(201).json(task)
})

router.delete('/tasks/:id', async (req, res) => {
  await taskService.delete(req.params.id)
  res.status(204).send()
})
```

**Output de l'Agent :**

```markdown
# Tasks API

Base URL: `/api/v1/tasks`

## Endpoints

### List Tasks

Récupère la liste des tâches avec filtres et pagination.

```
GET /tasks
```

**Query Parameters**

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| status | string | Non | - | Filtrer par statut (`todo`, `in_progress`, `done`) |
| assignee | string | Non | - | Filtrer par ID de l'assigné |
| limit | number | Non | 50 | Nombre max de résultats (1-100) |
| offset | number | Non | 0 | Décalage pour pagination |

**Response 200**

```json
{
  "data": [
    {
      "id": "task_abc123",
      "title": "Implement login",
      "status": "in_progress",
      "assignee": "user_xyz789",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 50,
    "offset": 0
  }
}
```

**Exemple**

```bash
curl "https://api.example.com/api/v1/tasks?status=todo&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Create Task

Crée une nouvelle tâche.

```
POST /tasks
```

**Request Body**

```json
{
  "title": "string (required, 1-200 chars)",
  "description": "string (optional)",
  "status": "string (optional, default: 'todo')",
  "assignee": "string (optional, user ID)",
  "dueDate": "string (optional, ISO 8601)"
}
```

**Response 201**

```json
{
  "id": "task_def456",
  "title": "New task",
  "status": "todo",
  "createdAt": "2026-01-20T14:30:00Z"
}
```

**Errors**

| Code | Raison |
|------|--------|
| 400 | Validation error (title manquant ou trop long) |
| 401 | Token manquant ou invalide |

---

### Delete Task

Supprime une tâche.

```
DELETE /tasks/:id
```

**Path Parameters**

| Paramètre | Type | Description |
|-----------|------|-------------|
| id | string | ID de la tâche à supprimer |

**Response 204**

Pas de contenu.

**Errors**

| Code | Raison |
|------|--------|
| 404 | Tâche non trouvée |
| 403 | Pas de permission pour supprimer cette tâche |
```

---

### Exemple 2 : JSDoc Généré

**Input :**
```typescript
async function findUsersByRole(role, options) {
  const users = await db.users.findMany({
    where: { role, active: true },
    skip: options?.offset,
    take: options?.limit,
    orderBy: { createdAt: 'desc' }
  })
  return users
}
```

**Output de l'Agent :**

```typescript
/**
 * Retrieves active users filtered by role with pagination support.
 *
 * Returns users sorted by creation date (newest first). Only active
 * users are included in the results.
 *
 * @param role - The role to filter users by (e.g., 'admin', 'editor', 'viewer')
 * @param options - Optional pagination parameters
 * @param options.offset - Number of users to skip (default: 0)
 * @param options.limit - Maximum number of users to return (default: no limit)
 * @returns Promise resolving to array of users matching the criteria
 * @throws {DatabaseError} If the database query fails
 *
 * @example
 * // Get first 10 admin users
 * const admins = await findUsersByRole('admin', { limit: 10 })
 *
 * @example
 * // Get editors with pagination
 * const page2 = await findUsersByRole('editor', { offset: 20, limit: 10 })
 *
 * @see {@link User} for the user type definition
 * @see {@link updateUserRole} to modify a user's role
 */
async function findUsersByRole(
  role: UserRole,
  options?: { offset?: number; limit?: number }
): Promise<User[]> {
  const users = await db.users.findMany({
    where: { role, active: true },
    skip: options?.offset,
    take: options?.limit,
    orderBy: { createdAt: 'desc' }
  })
  return users
}
```

---

### Exemple 3 : README Mis à Jour

**Input (changements) :**
- Nouvelle feature : Export CSV
- Node.js minimum version : 20
- Nouvelle variable d'env : EXPORT_PATH

**Output de l'Agent :**

```markdown
# TaskFlow

Application de gestion de tâches avec collaboration en temps réel.

## Features

- Création et gestion de tâches
- Assignation aux membres de l'équipe
- Filtres et recherche avancée
- **Export CSV** des tâches *(nouveau)*

## Quick Start

### Prérequis

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- PostgreSQL 15+

### Installation

```bash
git clone https://github.com/org/taskflow.git
cd taskflow
pnpm install
cp .env.example .env
# Configurer les variables dans .env
pnpm db:migrate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

### Variables d'Environnement

| Variable | Requis | Description |
|----------|--------|-------------|
| DATABASE_URL | Oui | URL de connexion PostgreSQL |
| JWT_SECRET | Oui | Secret pour les tokens JWT |
| EXPORT_PATH | Non | Répertoire pour les exports CSV (défaut: ./exports) |

## Documentation

- [API Reference](./docs/api.md)
- [Contributing](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

---

*Dernière mise à jour : 2026-01-20*
```

---

## Templates

### Template README Minimal

```markdown
# [Nom du Projet]

[Description en 1-2 phrases]

## Quick Start

```bash
npm install
npm run dev
```

## Documentation

[Lien vers doc complète]

## License

[Type de license]
```

### Template README Complet

```markdown
# [Nom du Projet]

[Description en 1-2 phrases]

[![CI](badge)](link)
[![Coverage](badge)](link)

## Features

- [Feature 1]
- [Feature 2]

## Quick Start

### Prérequis

- [Prérequis 1]
- [Prérequis 2]

### Installation

```bash
[Commandes d'installation]
```

### Configuration

[Instructions de configuration]

### Démarrage

```bash
[Commande de démarrage]
```

## Usage

[Exemples d'utilisation basiques]

## Documentation

- [Guide utilisateur](link)
- [API Reference](link)
- [Contributing](link)

## Tech Stack

- [Tech 1]
- [Tech 2]

## Contributing

[Instructions ou lien vers CONTRIBUTING.md]

## License

[Type de license]

---

*Maintenu par [équipe/personne]*
```

### Template API Endpoint

```markdown
### [Method] [Path]

[Description courte]

**Authentication**: [Required/Optional/None]

**Path Parameters**

| Paramètre | Type | Description |
|-----------|------|-------------|
| param | type | description |

**Query Parameters**

| Paramètre | Type | Requis | Défaut | Description |
|-----------|------|--------|--------|-------------|
| param | type | Oui/Non | value | description |

**Request Body**

```json
{
  "field": "type (required/optional)"
}
```

**Response [Status]**

```json
{
  "field": "value"
}
```

**Errors**

| Code | Raison |
|------|--------|
| 4XX | Description |

**Exemple**

```bash
curl -X METHOD "url" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"field": "value"}'
```
```

---

## Anti-patterns

### ❌ Documentation qui paraphrase le code

**Problème** : Commentaires qui répètent ce que le code dit déjà.

```typescript
// ❌ Mauvais
// Increment the counter by 1
counter++

// ❌ Mauvais
/**
 * Gets user by ID
 * @param id The ID
 * @returns The user
 */
function getUserById(id) { ... }

// ✅ Bon (le code est assez clair, pas de commentaire nécessaire)
counter++

// ✅ Bon (ajoute de l'information utile)
/**
 * Retrieves a user with their preferences and recent activity.
 * Returns null if user is deactivated or not found.
 */
function getUserById(id) { ... }
```

### ❌ Documentation non maintenue

**Problème** : Doc qui ne correspond plus au code actuel.

**Solution** :
- Mettre à jour la doc dans la même PR que le code
- Ajouter un check en CI qui vérifie la cohérence
- Date de dernière mise à jour visible

### ❌ Duplication d'information

**Problème** : Même information à plusieurs endroits → désynchronisation.

**Solution** : Une source de vérité, des liens partout ailleurs.

```markdown
// ❌ Mauvais : Même liste dans README, CONTRIBUTING, et docs/
## Available Scripts
- npm run dev
- npm run build
...

// ✅ Bon : Une seule source
## Available Scripts

Voir [package.json](./package.json) pour la liste complète des scripts.

Scripts principaux :
- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Build de production
```

### ❌ Exemples qui ne fonctionnent pas

**Problème** : Exemples de code outdated ou avec des erreurs.

**Solution** :
- Tester les exemples (doctest, mdx-test)
- Extraire les exemples depuis les tests
- CI qui vérifie que les exemples compilent

### ❌ Documentation sans structure

**Problème** : Mur de texte sans navigation.

**Solution** : Titres, table des matières, sections courtes.

---

## Checklist Agent Documentation

### Avant Génération
- [ ] Type de doc à générer identifié
- [ ] Public cible défini
- [ ] Niveau de détail choisi
- [ ] Format de sortie spécifié

### Pendant Génération
- [ ] Structure logique (général → spécifique)
- [ ] Exemples pour chaque concept
- [ ] Ton adapté au public
- [ ] Pas de duplication

### Après Génération
- [ ] Exemples de code testés
- [ ] Liens vérifiés
- [ ] Cohérence avec doc existante
- [ ] Date de mise à jour ajoutée

---

## Outils Complémentaires

| Besoin | Outil | Usage |
|--------|-------|-------|
| Doc API auto | TypeDoc, Swagger | Génère depuis code/types |
| Doc interactive | Storybook | Composants UI |
| Site de doc | Docusaurus, Astro | Documentation complète |
| Vérification liens | markdown-link-check | CI check |
| Test exemples | doctest, mdx-test | Valide les snippets |

**Recommandation** : L'Agent Documentation génère le contenu initial et les mises à jour. Les outils automatisent la publication et la validation.

---

## Synchronisation Code/Doc

### Stratégie Recommandée

```
┌─────────────────────────────────────────────────────────┐
│                    Code Change                           │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│         Agent Documentation détecte le changement        │
│         et propose une mise à jour de la doc            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Review humain de la proposition             │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│           Commit doc + code dans la même PR             │
└─────────────────────────────────────────────────────────┘
```

### Prompt de Détection de Changement

```markdown
## Contexte
Compare ces deux versions pour identifier les changements à documenter.

## Avant
[Code/API avant le changement]

## Après
[Code/API après le changement]

## Documentation Actuelle
[Doc existante]

## Output Attendu
1. Changements détectés (breaking, new, deprecated)
2. Sections de doc à mettre à jour
3. Proposition de mise à jour
```

---

*Voir aussi : [F.6 Agent Code Review](./F6-agent-code-review.md) • [A.3 Template Agent-Guide](./A3-agent-guide.md) • [B.2 Product Engineer](./B2-product-engineer.md)*
