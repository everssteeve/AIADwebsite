# F.4 Agent Documentation

## Pourquoi cet agent ?

L'agent Documentation génère et met à jour la documentation technique : API docs, README, guides d'utilisation, commentaires de code.

---

## Cas d'Usage

| Situation | Utilisation |
|-----------|-------------|
| Nouvelle API | Générer la documentation |
| README outdated | Mettre à jour |
| Code complexe | Ajouter des commentaires |
| Onboarding | Créer des guides |

---

## Configuration

### System Prompt

```markdown
Tu es un technical writer expert. Ton rôle est de créer et maintenir
une documentation claire, complète et utile.

## Principes de Documentation

### Clarté
- Langage simple et direct
- Phrases courtes
- Vocabulaire consistant

### Structure
- Hiérarchie logique
- Table des matières
- Navigation facile

### Complétude
- Tous les cas d'usage couverts
- Exemples concrets
- FAQ si pertinent

### Maintenabilité
- Facile à mettre à jour
- Pas de duplication
- Références plutôt que copies

## Types de Documentation

### API Documentation
- Endpoints avec méthodes
- Paramètres avec types
- Réponses avec exemples
- Codes d'erreur

### README
- Description du projet
- Installation
- Usage rapide
- Contribution

### Guides
- Tutoriels pas à pas
- Cas d'usage
- Troubleshooting

### Code Comments
- JSDoc pour les fonctions publiques
- Commentaires pour la logique complexe
- Pas de commentaires évidents
```

---

## Utilisation

### Générer Documentation API

```markdown
## Prompt : Doc API

Génère la documentation pour cette API :

### Endpoints
[Code des routes/endpoints]

### Modèles
[Types/interfaces]

### Format Attendu
Documentation OpenAPI/Swagger ou Markdown avec :
- Description de chaque endpoint
- Paramètres (path, query, body)
- Réponses (success, errors)
- Exemples de requêtes/réponses
```

### Mettre à Jour README

```markdown
## Prompt : Update README

Met à jour le README pour refléter l'état actuel du projet :

### README Actuel
[Contenu actuel]

### Changements Récents
- [Nouvelle feature 1]
- [Changement de config]
- [Nouvelle dépendance]

### Output
README mis à jour avec les nouvelles informations intégrées
de manière cohérente.
```

### Ajouter JSDoc

```markdown
## Prompt : Ajouter JSDoc

Ajoute la documentation JSDoc à ces fonctions :

```typescript
[Code sans documentation]
```

### Règles
- Description claire de la fonction
- @param avec type et description
- @returns avec type et description
- @throws si applicable
- @example avec usage typique
```

---

## Rapport Type

```markdown
# Documentation Générée - TaskService API

## Vue d'Ensemble

API de gestion des tâches pour l'application TaskFlow.

**Base URL** : `/api/v1/tasks`
**Auth** : Bearer token requis

---

## Endpoints

### GET /tasks

Récupère la liste des tâches avec filtres optionnels.

**Query Parameters**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | Non | Filtrer par statut (todo, in_progress, done) |
| assignee | string | Non | Filtrer par assigné (user ID) |
| limit | number | Non | Nombre max de résultats (défaut: 50) |
| offset | number | Non | Offset pour pagination |

**Response 200**
```json
{
  "data": [
    {
      "id": "task_123",
      "title": "Implement login",
      "status": "in_progress",
      "assignee": "user_456",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0
  }
}
```

**Errors**
| Code | Description |
|------|-------------|
| 401 | Token manquant ou invalide |
| 403 | Accès non autorisé au projet |

**Example**
```bash
curl -X GET "https://api.taskflow.com/api/v1/tasks?status=todo" \
  -H "Authorization: Bearer <token>"
```

---

### POST /tasks

Crée une nouvelle tâche.

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
  "id": "task_789",
  "title": "New task",
  "status": "todo",
  "createdAt": "2026-01-19T14:30:00Z"
}
```

**Errors**
| Code | Description |
|------|-------------|
| 400 | Validation error (title manquant ou trop long) |
| 401 | Non authentifié |
| 403 | Pas de permission de création |

---

### PUT /tasks/:id

Met à jour une tâche existante.

[...]

---

### DELETE /tasks/:id

Supprime une tâche.

[...]

---

## Modèles

### Task

```typescript
interface Task {
  id: string           // Identifiant unique
  title: string        // Titre (1-200 caractères)
  description?: string // Description optionnelle
  status: TaskStatus   // Statut actuel
  assignee?: string    // ID de l'utilisateur assigné
  dueDate?: string     // Date d'échéance (ISO 8601)
  createdAt: string    // Date de création
  updatedAt: string    // Dernière modification
}

type TaskStatus = 'todo' | 'in_progress' | 'done'
```

---

## Codes d'Erreur

| Code | Nom | Description |
|------|-----|-------------|
| 400 | Bad Request | Requête malformée ou validation échouée |
| 401 | Unauthorized | Authentication requise |
| 403 | Forbidden | Pas de permission pour cette action |
| 404 | Not Found | Ressource non trouvée |
| 429 | Too Many Requests | Rate limit dépassé |
| 500 | Internal Error | Erreur serveur |

### Format d'Erreur
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```
```

---

## Templates

### Template README

```markdown
# [Nom du Projet]

[Description en 1-2 phrases]

## Features

- [Feature 1]
- [Feature 2]
- [Feature 3]

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
git clone [repo-url]
cd [project-name]
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Documentation

- [API Documentation](./docs/api.md)
- [Contributing](./CONTRIBUTING.md)

## Tech Stack

- [Tech 1]
- [Tech 2]

## License

[License type]
```

### Template JSDoc

```typescript
/**
 * [Description de la fonction]
 *
 * @param {ParamType} paramName - Description du paramètre
 * @param {Object} options - Options de configuration
 * @param {boolean} options.flag - Description de l'option
 * @returns {ReturnType} Description du retour
 * @throws {ErrorType} Quand [condition d'erreur]
 *
 * @example
 * ```typescript
 * const result = functionName(param, { flag: true })
 * // => expected output
 * ```
 */
```

---

## Bonnes Pratiques

### Quand Documenter

| Situation | Action |
|-----------|--------|
| Nouvelle API publique | Documentation complète |
| Changement d'API | Mise à jour immédiate |
| Code complexe | Commentaires explicatifs |
| Feature majeure | Guide d'utilisation |

### Éviter

- Documentation qui paraphrase le code
- Commentaires évidents (`// Increment counter`)
- Documentation non maintenue
- Duplication d'information

### Outils Complémentaires

```markdown
## Stack Documentation

1. **Agent IA** : Génération initiale, mise à jour intelligente
2. **TypeDoc** : Doc auto depuis TypeScript
3. **Swagger/OpenAPI** : API documentation
4. **Storybook** : Documentation composants UI
5. **Docusaurus** : Site de documentation
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
