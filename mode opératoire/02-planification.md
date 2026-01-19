# PARTIE 2 : PHASE DE PLANIFICATION

La planification transforme les user stories en tâches concrètes prêtes pour l'agent IA.

## 2.1 Rituel : Planning d'itération

| | |
|---|---|
| 🎭 **ACTEUR** | PO + PE + TL |
| 📥 **ENTRÉES** | PRD.md, Product Backlog |
| 📤 **SORTIES** | Sprint backlog, Stories sélectionnées |
| ⏱️ **DURÉE** | 2-4 heures |
| 🔗 **DÉPENDANCES** | Phase 1 complète |

### 2.1.1 Ordre du jour

| Durée | Activité | Participants |
|-------|----------|--------------|
| 15 min | Rappel des objectifs | Tous |
| 30 min | Présentation des stories candidates | PO |
| 45 min | Clarification et questions | Tous |
| 30 min | Estimation (T-shirt sizing) | PE + TL |
| 30 min | Sélection selon capacité | Tous |
| 10 min | Engagement de l'équipe | Tous |

### 2.1.2 Estimation T-shirt

| Taille | Complexité | Durée |
|--------|------------|-------|
| XS | Très simple | < 2h |
| S | Simple | 2-4h |
| M | Moyenne | 4-8h (1 jour) |
| L | Complexe | 2-3 jours |
| XL | Très complexe | À redécouper |

> 💡 **CONSEIL**
> Une story XL doit toujours être redécoupée en stories plus petites.

## 2.2 Décomposition en tâches

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | User Stories sélectionnées |
| 📤 **SORTIES** | Tâches atomiques |
| ⏱️ **DURÉE** | 1-2h par story |
| 🔗 **DÉPENDANCES** | 2.1 Planning terminé |

### 2.2.1 Critères d'atomicité

- Réalisable en moins de 4 heures
- Objectif unique et clair
- Testable indépendamment
- Décrite en 1-2 phrases

### 2.2.2 Exemple de décomposition

```markdown
# User Story : US-001 - Création de tâche

## Décomposition

### Backend
| ID | Tâche | Durée |
|----|-------|-------|
| T-001-1 | Créer schéma Prisma Task | 1h |
| T-001-2 | Créer route POST /api/tasks | 2h |
| T-001-3 | Créer validateur Zod | 1h |
| T-001-4 | Tests unitaires taskService | 2h |

### Frontend
| ID | Tâche | Durée |
|----|-------|-------|
| T-001-5 | Créer composant TaskForm | 2h |
| T-001-6 | Créer hook useCreateTask | 1h |
| T-001-7 | Intégrer dans page Tasks | 1h |
| T-001-8 | Tests composant TaskForm | 2h |
```

## 2.3 Rédaction des SPECS

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Tâche atomique, PRD, ARCHITECTURE |
| 📤 **SORTIES** | Fichier SPEC complet |
| ⏱️ **DURÉE** | 30-60 min par SPEC |
| 🔗 **DÉPENDANCES** | 2.2 Tâches décomposées |

### 2.3.1 Template SPEC

```markdown
# SPEC : T-001-2 - Créer route POST /api/tasks

## 📋 Référence
- User Story : US-001
- PRD : @docs/PRD.md#us-001

## 🎯 Objectif
Créer l'endpoint API POST /api/tasks pour créer une tâche.

## 📁 Fichiers impactés
### À créer
- apps/api/src/routes/task-routes.ts
- apps/api/src/controllers/taskController.ts
- apps/api/src/services/taskService.ts

### À modifier
- apps/api/src/index.ts

## 📐 Interface

### Request
```typescript
// POST /api/v1/tasks
interface CreateTaskRequest {
  title: string;        // 1-200 chars
  description?: string; // max 2000 chars
  deadline?: string;    // ISO 8601
}
```

### Response (201)
```typescript
interface CreateTaskResponse {
  data: {
    id: string;
    title: string;
    status: 'TODO';
    createdAt: string;
  }
}
```

## 🔲 Cas limites
| Cas | Comportement |
|-----|--------------|
| Titre vide | 400 VALIDATION_ERROR |
| Titre > 200 chars | 400 VALIDATION_ERROR |

## 🧪 Tests attendus
```typescript
describe('TaskService', () => {
  it('should create task with minimal data');
  it('should throw if title empty');
});
```
```

### 2.3.2 Checklist qualité SPEC

| ✓ | Critère |
|---|---------|
| ☐ | Objectif unique et clair |
| ☐ | Fichiers à créer/modifier listés |
| ☐ | Interfaces TypeScript définies |
| ☐ | Cas d'erreur documentés |
| ☐ | Tests attendus spécifiés |
| ☐ | Exemple entrée/sortie fourni |
