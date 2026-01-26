# PARTIE 2 : PHASE DE PLANIFICATION

La planification transforme une intention métier en SPEC exploitable par un agent IA. Cette phase est le pont entre le "quoi" (PRD) et le "comment" (implémentation). Une SPEC de qualité permet à l'agent de générer 80%+ du code correct du premier coup.

> 📖 Référence : @framework/05-boucles-iteratives.md - Section "Boucle 1 : Planifier"

> 💡 **CONSEIL**
> Investissez 30 minutes de plus en planification : cela économise des heures en implémentation. Le contexte frais produit des décisions pertinentes.

---

## 2.1 Étape : Préparation de l'itération

| | |
|---|---|
| 🎭 **ACTEUR** | PM |
| 📥 **ENTRÉES** | PRD.md, Product Backlog |
| 📤 **SORTIES** | User Stories priorisées pour l'itération |
| ⏱️ **DURÉE** | 1-2 heures |
| 🔗 **DÉPENDANCES** | Phase 1 complète |

### 2.1.1 Sélection des User Stories

Identifiez les User Stories candidates pour la prochaine itération en utilisant ces critères :

| Critère | Question à poser |
|---------|------------------|
| Valeur métier | Cette story contribue-t-elle directement aux Outcome Criteria du PRD ? |
| Dépendances | Les prérequis techniques sont-ils en place ? |
| Clarté | L'intention est-elle suffisamment claire pour être spécifiée ? |
| Taille | Peut-elle être livrée en moins de 3 jours ? |

### 2.1.2 Priorisation MoSCoW

Classez les stories selon la méthode MoSCoW :

| Priorité | Signification | Action |
|----------|---------------|--------|
| **Must** | Indispensable pour l'itération | Planifier en premier |
| **Should** | Important mais pas bloquant | Planifier si capacité |
| **Could** | Souhaitable | Reporter si nécessaire |
| **Won't** | Hors périmètre itération | Ne pas planifier |

> ⚠️ **ATTENTION** : Ne surchargez pas l'itération. Mieux vaut livrer 3 stories complètes que 5 stories à 80%.

---

## 2.2 Étape : Rituel de planning

| | |
|---|---|
| 🎭 **ACTEUR** | PM + PE + Tech Lead |
| 📥 **ENTRÉES** | User Stories priorisées |
| 📤 **SORTIES** | Stories sélectionnées, estimées, comprises |
| ⏱️ **DURÉE** | 1-2 heures |
| 🔗 **DÉPENDANCES** | 2.1 Préparation terminée |

### 2.2.1 Agenda du rituel

| Durée | Activité | Responsable |
|-------|----------|-------------|
| 10 min | Rappel des objectifs de l'itération | PM |
| 20 min | Présentation des stories candidates | PM |
| 30 min | Clarification et questions | Tous |
| 20 min | Estimation T-shirt sizing | PE + Tech Lead |
| 15 min | Sélection selon capacité | Tous |
| 5 min | Engagement de l'équipe | Tous |

### 2.2.2 Estimation T-shirt

| Taille | Complexité | Durée estimée | Action |
|--------|------------|---------------|--------|
| **XS** | Très simple, aucune ambiguïté | < 2h | Implémenter directement |
| **S** | Simple, peu d'inconnues | 2-4h | SPEC légère |
| **M** | Moyenne, quelques inconnues | 4-8h (1 jour) | SPEC complète |
| **L** | Complexe, plusieurs composants | 2-3 jours | SPEC détaillée |
| **XL** | Très complexe | > 3 jours | **À redécouper obligatoirement** |

> 💡 **CONSEIL** : Si l'estimation fait débat, c'est un signe que la story manque de clarté. Clarifiez avant d'estimer.

### 2.2.3 Questions de clarification

Posez systématiquement ces questions pour chaque story :

| Question | Objectif |
|----------|----------|
| Quel est le critère de succès mesurable ? | Éviter le flou sur le "Done" |
| Quels sont les cas limites identifiés ? | Anticiper les edge cases |
| Quelles sont les dépendances techniques ? | Identifier les prérequis |
| Quel est le comportement en cas d'erreur ? | Définir la gestion d'erreurs |
| Existe-t-il des contraintes de performance ? | Cadrer les attentes non-fonctionnelles |

### 2.2.4 Validation du planning

| ✓ | Critère | Vérification |
|---|---------|--------------|
| ☐ | Stories comprises | Chaque PE peut expliquer les stories qui lui sont assignées |
| ☐ | Estimations cohérentes | Aucune story XL restante |
| ☐ | Capacité respectée | Total estimé ≤ 80% de la capacité disponible |
| ☐ | Dépendances identifiées | Ordre d'implémentation clair |
| ☐ | Engagement explicite | L'équipe s'engage sur le périmètre |

> ⚠️ **ESCALADE** : Si une story reste floue après 15 minutes de discussion, reportez-la et demandez au PM de la clarifier avant la prochaine itération.

---

## 2.3 Étape : Décomposition en tâches

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | User Story sélectionnée |
| 📤 **SORTIES** | Liste de tâches atomiques |
| ⏱️ **DURÉE** | 30-60 min par story |
| 🔗 **DÉPENDANCES** | 2.2 Planning terminé |

### 2.3.1 Critères d'atomicité

Une tâche est atomique si elle répond à **tous** ces critères :

| Critère | Description | Exemple valide | Exemple invalide |
|---------|-------------|----------------|------------------|
| **Durée** | Réalisable en < 4 heures | "Créer endpoint POST /tasks" | "Implémenter module tâches" |
| **Objectif unique** | Une seule responsabilité | "Valider schéma Zod" | "Valider et persister" |
| **Testable** | Vérifiable indépendamment | "Test unitaire taskService" | "Tester le module" |
| **Descriptible** | Explicable en 1-2 phrases | "Créer composant TaskForm" | "Faire le frontend" |

### 2.3.2 Prompt pour décomposer avec un LLM

Utilisez ce prompt pour obtenir une décomposition structurée :

```
Décompose cette User Story en tâches atomiques.

**User Story :**
[Coller la User Story avec ses critères d'acceptation]

**Contraintes :**
- Chaque tâche doit être réalisable en moins de 4 heures
- Chaque tâche doit avoir un objectif unique et clair
- Chaque tâche doit être testable indépendamment

**Format attendu :**

### Backend
| ID | Tâche | Durée | Dépendances |
|----|-------|-------|-------------|
| T-XXX-1 | [Description] | [Xh] | [IDs] |

### Frontend
| ID | Tâche | Durée | Dépendances |
|----|-------|-------|-------------|
| T-XXX-2 | [Description] | [Xh] | [IDs] |

### Tests
| ID | Tâche | Durée | Dépendances |
|----|-------|-------|-------------|
| T-XXX-3 | [Description] | [Xh] | [IDs] |

Identifie l'ordre d'implémentation optimal.
```

### 2.3.3 Exemple de décomposition

```markdown
# User Story : US-007 - Création de tâche

"En tant qu'utilisateur connecté, je veux créer une tâche
afin de suivre mes travaux à réaliser."

## Critères d'acceptation
- Champs : titre (obligatoire), description (optionnelle), deadline (optionnelle)
- Validation : titre 1-200 caractères
- Confirmation visuelle après création

## Décomposition

### Backend
| ID | Tâche | Durée | Dépendances |
|----|-------|-------|-------------|
| T-007-1 | Créer schéma Prisma Task | 1h | - |
| T-007-2 | Créer validateur Zod CreateTaskInput | 1h | T-007-1 |
| T-007-3 | Créer service taskService.create() | 2h | T-007-1, T-007-2 |
| T-007-4 | Créer route POST /api/v1/tasks | 2h | T-007-3 |

### Frontend
| ID | Tâche | Durée | Dépendances |
|----|-------|-------|-------------|
| T-007-5 | Créer composant TaskForm | 2h | - |
| T-007-6 | Créer hook useCreateTask (React Query) | 1h | T-007-4 |
| T-007-7 | Intégrer TaskForm dans page /tasks | 1h | T-007-5, T-007-6 |
| T-007-8 | Ajouter toast de confirmation | 30min | T-007-7 |

### Tests
| ID | Tâche | Durée | Dépendances |
|----|-------|-------|-------------|
| T-007-9 | Tests unitaires taskService | 2h | T-007-3 |
| T-007-10 | Tests composant TaskForm | 1h | T-007-5 |
| T-007-11 | Test E2E création de tâche | 1h | T-007-7 |

## Ordre d'implémentation
T-007-1 → T-007-2 → T-007-3 → T-007-4 → T-007-9 (backend complet)
→ T-007-5 → T-007-6 → T-007-7 → T-007-8 → T-007-10 → T-007-11 (frontend + E2E)
```

### 2.3.4 Validation de la décomposition

| ✓ | Critère | Vérification |
|---|---------|--------------|
| ☐ | Atomicité | Aucune tâche > 4h |
| ☐ | Complétude | Toutes les couches couvertes (DB, API, UI, Tests) |
| ☐ | Dépendances | Ordre d'implémentation logique |
| ☐ | Testabilité | Chaque tâche a un critère de validation clair |

---

## 2.4 Étape : Rédaction des SPECS

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Tâche atomique, PRD, ARCHITECTURE |
| 📤 **SORTIES** | Fichier SPEC prêt pour l'agent IA |
| ⏱️ **DURÉE** | 30-60 min par SPEC |
| 🔗 **DÉPENDANCES** | 2.3 Décomposition terminée |

> 📖 Référence : @framework/04-artefacts.md - Section "SPECS"

### 2.4.1 Structure d'une SPEC

Chaque SPEC suit cette structure obligatoire :

| Section | Contenu | Obligatoire |
|---------|---------|-------------|
| Référence | User Story, PRD, liens | Oui |
| Objectif | Ce que la tâche accomplit | Oui |
| Périmètre | In Scope / Out of Scope | Oui |
| Fichiers impactés | À créer / À modifier | Oui |
| Interface technique | Types, API, schémas | Oui |
| Comportement | Flow nominal, cas limites | Oui |
| Règles de validation | Schémas, contraintes | Oui |
| Tests attendus | Scénarios à implémenter | Oui |
| Exemples | Requêtes/réponses concrètes | Recommandé |
| Definition of Done | Critères de validation | Oui |

### 2.4.2 Template SPEC complet

Demander à Claude : Crée le fichier `docs/specs/T-XXX-X-[nom-tache].md`

Exemple de fichier ci dessous :

````markdown
# SPEC : T-XXX-X - [Nom de la tâche]

## 📋 Référence

| Élément | Valeur |
|---------|--------|
| User Story | US-XXX |
| PRD | @docs/PRD.md#us-xxx |
| Architecture | @docs/ARCHITECTURE.md |

## 🎯 Objectif

[Description claire et concise de ce que cette tâche accomplit - 1 à 3 phrases]

## 📐 Périmètre

### In Scope
- [Élément inclus 1]
- [Élément inclus 2]

### Out of Scope
- [Élément explicitement exclu 1]
- [Élément explicitement exclu 2]

## 📁 Fichiers impactés

### À créer
| Fichier | Responsabilité |
|---------|----------------|
| `[chemin/fichier.ts]` | [Description] |

### À modifier
| Fichier | Modification |
|---------|--------------|
| `[chemin/fichier.ts]` | [Description de la modification] |

## 🔧 Interface technique

### Types TypeScript

```typescript
// Input
interface [NomInput] {
  field1: string;    // [contrainte]
  field2?: number;   // [contrainte optionnelle]
}

// Output
interface [NomOutput] {
  id: string;
  field1: string;
  createdAt: string; // ISO 8601
}
```

### Endpoint API (si applicable)

```
[METHOD] /api/v1/[resource]

Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request Body:
{
  "field1": "value",
  "field2": 123
}

Response 201:
{
  "data": {
    "id": "uuid",
    "field1": "value",
    "createdAt": "2026-01-19T10:00:00Z"
  }
}
```

### Schéma DB (si applicable)

```prisma
model [NomModel] {
  id        String   @id @default(uuid())
  field1    String   @db.VarChar(200)
  field2    Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔄 Comportement

### Flow nominal

1. [Étape 1]
2. [Étape 2]
3. [Étape 3]

### Cas limites

| Cas | Comportement attendu | Code erreur |
|-----|----------------------|-------------|
| [Cas limite 1] | [Comportement] | [400/404/500] |
| [Cas limite 2] | [Comportement] | [400/404/500] |

### Messages d'erreur

| Code | Message | Cause |
|------|---------|-------|
| VALIDATION_ERROR | "[Message]" | [Cause] |
| NOT_FOUND | "[Message]" | [Cause] |

## ✅ Règles de validation

```typescript
// Schéma Zod
const [NomSchema] = z.object({
  field1: z.string().min(1).max(200),
  field2: z.number().int().positive().optional(),
});
```

## 🧪 Tests attendus

### Tests unitaires

```typescript
describe('[Module]', () => {
  describe('[fonction]', () => {
    it('should [comportement attendu] when [condition nominale]');
    it('should throw [ErrorType] when [condition erreur 1]');
    it('should throw [ErrorType] when [condition erreur 2]');
  });
});
```

### Tests d'intégration (si applicable)

```typescript
describe('[Endpoint]', () => {
  it('should return 201 with created resource');
  it('should return 400 when validation fails');
  it('should return 401 when unauthorized');
});
```

## 📝 Exemples concrets

### Exemple 1 : Cas nominal

**Input :**
```json
{
  "field1": "Valeur exemple",
  "field2": 42
}
```

**Output attendu :**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "field1": "Valeur exemple",
    "createdAt": "2026-01-19T10:00:00.000Z"
  }
}
```

### Exemple 2 : Cas d'erreur

**Input :**
```json
{
  "field1": ""
}
```

**Output attendu :**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "field1 must not be empty"
  }
}
```

## ✔️ Definition of Done

| ✓ | Critère |
|---|---------|
| ☐ | Code implémenté selon l'interface définie |
| ☐ | Tous les cas limites gérés |
| ☐ | Tests unitaires passent (couverture > 80%) |
| ☐ | Tests d'intégration passent |
| ☐ | Linting et types OK |
| ☐ | Documentation inline si logique complexe |
````

### 2.4.3 Prompt pour générer une SPEC avec un LLM

Utilisez ce prompt dans Claude Code :

```
Génère une SPEC complète pour cette tâche.

**Contexte :**
- User Story : @docs/PRD.md#us-xxx (ou coller le contenu)
- Architecture : @docs/ARCHITECTURE.md
- AGENT-GUIDE : @CLAUDE.md

**Tâche à spécifier :**
[Description de la tâche atomique]

**Exigences :**
1. Utilise le template SPEC du projet
2. Définis les types TypeScript complets
3. Liste tous les cas limites identifiables
4. Fournis des exemples concrets entrée/sortie
5. Spécifie les tests attendus avec leurs assertions

**Format :** Markdown compatible avec le template docs/specs/

Think hard.
```

### 2.4.4 Checklist qualité SPEC

| ✓ | Critère | Question de validation |
|---|---------|------------------------|
| ☐ | Objectif unique | La SPEC ne traite-t-elle qu'une seule responsabilité ? |
| ☐ | Fichiers listés | Sait-on exactement quels fichiers créer/modifier ? |
| ☐ | Types complets | Les interfaces TypeScript sont-elles complètes ? |
| ☐ | Cas limites | Tous les edge cases sont-ils documentés ? |
| ☐ | Validation définie | Les règles de validation sont-elles explicites ? |
| ☐ | Tests spécifiés | Sait-on quels tests écrire et leurs assertions ? |
| ☐ | Exemples fournis | Y a-t-il au moins un exemple nominal et un exemple d'erreur ? |
| ☐ | DoD explicite | Les critères de "Done" sont-ils listés ? |

> 💡 **CONSEIL** : Une SPEC bien rédigée permet à l'agent IA de générer le code sans poser de questions. Si vous anticipez des questions, enrichissez la SPEC.

---

## 2.5 Étape : Organisation des SPECs

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | SPECs rédigées |
| 📤 **SORTIES** | SPECs organisées et accessibles |
| ⏱️ **DURÉE** | 15 min |
| 🔗 **DÉPENDANCES** | 2.4 SPECs rédigées |

### 2.5.1 Structure de dossier recommandée

```
docs/
└── specs/
    ├── _index.md              # Index des SPECs actives
    ├── US-007/                 # Groupement par User Story
    │   ├── T-007-1-schema-prisma-task.md
    │   ├── T-007-2-validateur-zod.md
    │   ├── T-007-3-service-create.md
    │   └── T-007-4-route-post-tasks.md
    └── archive/                # SPECs terminées
        └── US-001/
```

### 2.5.2 Fichier index des SPECs

Créez `docs/specs/_index.md` :

```markdown
# Index des SPECs

## En cours

| ID | Titre | Story | Status | Assigné |
|----|-------|-------|--------|---------|
| T-007-1 | Schéma Prisma Task | US-007 | 🔵 À faire | - |
| T-007-2 | Validateur Zod | US-007 | 🔵 À faire | - |

## Terminées (cette itération)

| ID | Titre | Story | Date |
|----|-------|-------|------|
| T-006-3 | Route GET /users | US-006 | 2026-01-18 |

## Légende
- 🔵 À faire
- 🟡 En cours
- 🟢 Terminée
- 🔴 Bloquée
```

### 2.5.3 Mise à jour du CLAUDE.md

Ajoutez la référence aux SPECs actives dans le CLAUDE.md :

```markdown
## 📚 Documentation de Référence

| Document | Chemin |
|----------|--------|
| PRD | @docs/PRD.md |
| Architecture | @docs/ARCHITECTURE.md |
| SPECs actives | @docs/specs/_index.md |
| SPECs en cours | @docs/specs/US-007/ |
```

---

## 2.6 Checklist de fin de planification

| ✓ | Élément | Vérification | Responsable |
|---|---------|--------------|-------------|
| ☐ | Stories sélectionnées | Priorisées et estimées | PM |
| ☐ | Planning validé | Équipe engagée sur le périmètre | Tous |
| ☐ | Décomposition | Toutes les tâches atomiques identifiées | PE |
| ☐ | SPECs rédigées | Au moins la première SPEC prête | PE |
| ☐ | Index mis à jour | `docs/specs/_index.md` à jour | PE |
| ☐ | CLAUDE.md mis à jour | Références vers SPECs actives | PE |

> ⚠️ **ATTENTION**
> Ne démarrez pas l'implémentation sans au moins une SPEC complète et validée. Implémenter sans SPEC, c'est coder sans contexte.

---

## Problèmes courants

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| Estimation impossible | Story trop floue | Demander clarification au PM avant d'estimer |
| Story XL persistante | Périmètre trop large | Découper en stories indépendantes |
| SPEC incomplète | Manque de contexte métier | Relire le PRD, questionner le PM |
| Agent pose des questions | SPEC pas assez précise | Enrichir les sections cas limites et exemples |
| Tâches dépendantes en boucle | Mauvaise décomposition | Revoir l'ordre d'implémentation |

> ⚠️ **ESCALADE** : Si une story ne peut pas être spécifiée après 1 heure de travail, impliquez le PM et le Tech Lead pour clarification.

---

*Version 1.0 - Janvier 2026*

> 📖 Références Framework utilisées :
> - @framework/04-artefacts.md (SPECS)
> - @framework/05-boucles-iteratives.md (Boucle 1 : Planifier)
