# A.2 Template ARCHITECTURE

## Pourquoi cette annexe ?

Le document ARCHITECTURE est la mémoire technique du projet. Il capture les décisions structurantes et leurs justifications, permettant aux agents IA de générer du code cohérent et aux nouveaux membres de comprendre rapidement les choix techniques. Sans ce document, chaque session avec un agent repart de zéro.

---

## Structure du Document ARCHITECTURE

### 1. Vue d'Ensemble

Cette section donne le contexte en 30 secondes.

```markdown
## Vue d'Ensemble

### Description du Système
[2-3 phrases : ce que fait le système, pour qui, comment]

### Diagramme de Contexte
```
┌─────────────────────────────────────────────────────┐
│                   [Système]                         │
│                                                     │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐        │
│  │ Module  │◄──►│ Module  │◄──►│ Module  │        │
│  │    A    │    │    B    │    │    C    │        │
│  └─────────┘    └─────────┘    └─────────┘        │
└─────────────────────────────────────────────────────┘
        ▲                 ▲                 ▲
        │                 │                 │
   [Acteur 1]        [Service]         [Acteur 2]
```

### Principes Architecturaux
1. [Principe 1] : [Justification courte]
2. [Principe 2] : [Justification courte]
3. [Principe 3] : [Justification courte]
```

**Pourquoi documenter les principes ?** Ils guident les micro-décisions quotidiennes. "On fait simple" évite les débats sur chaque choix.

### 2. Stack Technique

Chaque choix de technologie doit être justifié.

```markdown
## Stack Technique

### Frontend
| Technologie | Version | Justification |
|-------------|---------|---------------|
| [Framework] | [X.Y.Z] | [Pourquoi ce choix vs alternatives] |
| [Styling] | [X.Y.Z] | [Pourquoi ce choix] |
| [State] | [X.Y.Z] | [Pourquoi ce choix] |

### Backend
| Technologie | Version | Justification |
|-------------|---------|---------------|
| [Runtime] | [X.Y.Z] | [Pourquoi ce choix] |
| [Framework] | [X.Y.Z] | [Pourquoi ce choix] |
| [ORM] | [X.Y.Z] | [Pourquoi ce choix] |

### Base de Données
| Technologie | Usage | Justification |
|-------------|-------|---------------|
| [DB] | [Cas d'usage] | [Pourquoi ce choix] |

### Infrastructure
| Service | Provider | Justification |
|---------|----------|---------------|
| [Hosting] | [Provider] | [Pourquoi ce choix] |
| [CI/CD] | [Provider] | [Pourquoi ce choix] |
```

**Niveau de détail optimal** : Suffisant pour qu'un agent comprenne l'écosystème, pas au point de décrire chaque package.

### 3. Architecture Applicative

```markdown
## Architecture Applicative

### Structure des Modules
```
src/
├── components/     # Composants UI réutilisables
│   ├── ui/         # Primitives (Button, Input, etc.)
│   └── features/   # Composants métier
├── features/       # Logique métier par domaine
│   ├── auth/
│   ├── tasks/
│   └── projects/
├── lib/            # Utilitaires et helpers
├── pages/          # Points d'entrée (routing)
└── services/       # Appels API et data fetching
```

### Patterns Utilisés
| Pattern | Où | Pourquoi |
|---------|-----|----------|
| [Pattern] | [Fichiers/modules concernés] | [Problème résolu] |

### Conventions de Code
- Nommage : [Convention]
- Fichiers : [Convention]
- Imports : [Ordre]
```

### 4. Architecture Données

```markdown
## Architecture Données

### Modèle de Données
```
[User] 1──n [Project] 1──n [Task]
   │                         │
   └────────────n───────────┘
           (assignee)
```

### Entités Principales
| Entité | Champs clés | Relations |
|--------|-------------|-----------|
| [Entité] | [id, field1, field2...] | [Relations] |

### Stratégie de Migration
- Outil : [Drizzle/Prisma/Knex...]
- Politique : [Comment sont gérées les migrations]
```

### 5. Sécurité

```markdown
## Sécurité

### Authentification
- Mécanisme : [JWT/Session/OAuth...]
- Provider : [Auth0/Supabase/Custom...]
- Durée token : [Expiration]

### Autorisation
- Modèle : [RBAC/ABAC/Custom...]
- Rôles : [Liste des rôles et permissions]

### Protection des Données
- Chiffrement transit : [TLS version]
- Chiffrement repos : [Si applicable]
- Secrets : [Où et comment gérés]
```

### 6. ADRs (Architecture Decision Records)

Les ADRs documentent le **pourquoi** des décisions, pas seulement le **quoi**.

```markdown
## ADRs (Architecture Decision Records)

### ADR-001 : [Titre de la Décision]
**Date** : YYYY-MM-DD
**Statut** : Accepté | Superseded | Deprecated

**Contexte**
[Situation qui a nécessité une décision. Quel problème ?]

**Décision**
[Ce qui a été décidé. Formulation claire.]

**Alternatives Considérées**
| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
| [Option A] | [Avantages] | [Inconvénients] | [Raison] |
| [Option B] | [Avantages] | [Inconvénients] | [Raison] |

**Conséquences**
- ✅ [Conséquence positive 1]
- ✅ [Conséquence positive 2]
- ⚠️ [Conséquence à surveiller]
```

---

## Exemples Pratiques

### Exemple 1 : ARCHITECTURE Minimal (Projet Solo)

```markdown
# ARCHITECTURE : Time Tracker

## Vue d'Ensemble
Application web minimaliste de suivi du temps pour freelances.
Frontend React avec backend Supabase (BaaS).

### Principes
1. Simplicité maximale : pas de feature inutile
2. Offline-first : fonctionne sans connexion
3. Zéro config : ça marche out of the box

## Stack

### Frontend
| Tech | Version | Justification |
|------|---------|---------------|
| React | 18.x | Compétence existante |
| Tailwind | 3.x | Prototypage rapide |
| TanStack Query | 5.x | Cache + offline |

### Backend
| Service | Usage | Justification |
|---------|-------|---------------|
| Supabase | Auth + DB + API | Tout-en-un, tier gratuit |

## Structure
```
src/
├── components/    # UI components
├── hooks/         # Custom hooks
├── lib/           # Supabase client, utils
└── pages/         # Routes
```

## ADRs

### ADR-001 : Supabase comme backend
**Date** : 2026-01-10 | **Statut** : Accepté

**Contexte** : Projet solo, besoin d'aller vite, budget 0€.

**Décision** : Utiliser Supabase au lieu d'un backend custom.

**Conséquences** :
- ✅ Setup en 30 min
- ✅ Auth, DB, API inclus
- ⚠️ Vendor lock-in si migration future
```

### Exemple 2 : ARCHITECTURE Complet (Équipe)

```markdown
# ARCHITECTURE : TaskFlow

## Vue d'Ensemble

### Description
Application collaborative de gestion de tâches pour équipes de 3-10 personnes.
Architecture full-stack TypeScript avec temps réel via WebSockets.

### Diagramme de Contexte
```
                    ┌─────────────────┐
                    │    Frontend     │
                    │   (React SPA)   │
                    └────────┬────────┘
                             │ HTTPS
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │    (Hono)       │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│   PostgreSQL    │ │     Redis       │ │   S3 (Assets)   │
│   (Data)        │ │   (Cache/WS)    │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Principes Architecturaux
1. **Type-safety end-to-end** : TypeScript strict, Zod validation, types partagés
2. **Simplicité > Performance** : Optimiser quand c'est mesuré, pas avant
3. **Feature-based structure** : Organisation par domaine métier, pas par couche technique

## Stack Technique

### Frontend
| Technologie | Version | Justification |
|-------------|---------|---------------|
| React | 18.3 | Écosystème mature, équipe expérimentée |
| TypeScript | 5.4 | Type-safety, meilleure DX |
| Tailwind CSS | 3.4 | Styling rapide, bundle optimisé |
| TanStack Query | 5.x | Cache, mutations, optimistic updates |
| React Router | 6.x | Routing standard, lazy loading |

### Backend
| Technologie | Version | Justification |
|-------------|---------|---------------|
| Node.js | 20 LTS | Runtime unifié avec le front |
| Hono | 4.x | Léger (13kb), TypeScript natif, edge-ready |
| Drizzle ORM | 0.30 | Type-safe, proche SQL, pas de magic |
| Zod | 3.x | Validation runtime, types inférés |

### Base de Données
| Technologie | Usage | Justification |
|-------------|-------|---------------|
| PostgreSQL 16 | Données principales | Fiable, JSONB, full-text search |
| Redis 7 | Cache, sessions, pub/sub | Performance, WebSocket scaling |

### Infrastructure
| Service | Provider | Justification |
|---------|----------|---------------|
| Frontend | Vercel | CDN global, preview deployments |
| Backend | Railway | Simplicité, scaling auto, PG inclus |
| CI/CD | GitHub Actions | Intégré au repo, gratuit |
| Monitoring | Sentry | Error tracking, performance |

## Architecture Applicative

### Structure Monorepo
```
taskflow/
├── apps/
│   ├── web/                 # React SPA
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── features/    # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── tasks/
│   │   │   │   └── projects/
│   │   │   ├── hooks/       # Shared hooks
│   │   │   ├── lib/         # Utils, API client
│   │   │   └── routes/      # Page components
│   │   └── tests/
│   └── api/                 # Hono backend
│       ├── src/
│       │   ├── routes/      # API endpoints
│       │   ├── services/    # Business logic
│       │   ├── db/          # Schema, migrations
│       │   └── lib/         # Utils, middleware
│       └── tests/
└── packages/
    └── shared/              # Types, validations, utils
        ├── types/
        └── validations/
```

### Patterns Utilisés
| Pattern | Où | Pourquoi |
|---------|-----|----------|
| Feature modules | `features/` | Isolation, colocated logic |
| Repository | `services/` | Abstraction data access |
| Optimistic updates | Mutations | UX instantanée |
| Error boundaries | Routes | Graceful degradation |

### Conventions de Code
- **Composants** : `PascalCase.tsx`, fonction nommée
- **Hooks** : `useCamelCase.ts`
- **Utils** : `kebab-case.ts`
- **Types** : `PascalCase`, pas de préfixe `I`
- **Imports** : React → Externes → Internes (@/) → Relatifs → Types

## Architecture Données

### Modèle de Données
```
[User] ─────┬───── 1:n ────── [ProjectMember] ───── n:1 ───── [Project]
            │                       │                            │
            │                   (role: admin|member)             │
            │                                                    │
            └─────────────────── n:1 ─────────── [Task] ──── n:1 ┘
                              (assignee)
```

### Entités Principales
| Entité | Champs clés | Notes |
|--------|-------------|-------|
| User | id, email, name, avatar_url | Auth via provider externe |
| Project | id, name, owner_id, created_at | Soft delete (archived_at) |
| Task | id, title, status, project_id, assignee_id | status: enum |
| ProjectMember | user_id, project_id, role | Composite PK |

### Stratégie de Migration
- **Outil** : Drizzle Kit
- **Workflow** : `pnpm db:generate` → review → `pnpm db:migrate`
- **Rollback** : Scripts down manuels si nécessaire

## Sécurité

### Authentification
- **Provider** : Auth0
- **Token** : JWT, expiration 1h
- **Refresh** : Rotation automatique via Auth0
- **Storage** : httpOnly cookie (pas localStorage)

### Autorisation
- **Modèle** : RBAC simple
- **Rôles** : `admin` (full access), `member` (read + own tasks)
- **Vérification** : Middleware API vérifie le rôle sur chaque route protégée

### Protection des Données
- **Transit** : TLS 1.3 (forcé par Vercel/Railway)
- **Repos** : Chiffrement at-rest sur Railway
- **Secrets** : Variables d'environnement, jamais dans le code
- **Logs** : Pas de données sensibles loguées

## ADRs

### ADR-001 : Monorepo avec pnpm Workspaces
**Date** : 2026-01-05 | **Statut** : Accepté

**Contexte**
Besoin de partager des types et validations entre frontend et backend.
Options : npm packages, git submodules, monorepo.

**Décision**
Utiliser un monorepo avec pnpm workspaces.

**Alternatives Considérées**
| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
| NPM privé | Versioning clair | Setup complexe, CI lente | Overkill pour 1 équipe |
| Git submodules | Séparation repos | Workflow pénible | Friction quotidienne |

**Conséquences**
- ✅ Types partagés sans publication
- ✅ CI/CD unifiée
- ✅ Refactoring cross-package facile
- ⚠️ Setup initial plus complexe

---

### ADR-002 : Hono plutôt qu'Express
**Date** : 2026-01-05 | **Statut** : Accepté

**Contexte**
Besoin d'un framework backend léger, TypeScript-first, performant.

**Décision**
Utiliser Hono au lieu d'Express ou Fastify.

**Alternatives Considérées**
| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
| Express | Écosystème énorme | Vieux, types moyens | DX inférieure |
| Fastify | Performant, schémas | Plus lourd, config verbose | Complexité inutile |
| tRPC | Type-safe e2e | Lock-in, courbe apprentissage | Trop opiniated |

**Conséquences**
- ✅ 13kb, ultra léger
- ✅ TypeScript natif, inference parfaite
- ✅ Middleware compatible Web Standards
- ⚠️ Écosystème plus petit qu'Express
```

---

## Anti-patterns

### ❌ Documentation Morte

**Symptôme** : Le document ARCHITECTURE date de 6 mois et ne reflète plus le code.

**Problème** : Les agents génèrent du code incohérent. Les nouveaux galèrent.

**Solution** : Mise à jour obligatoire à chaque décision significative. Revue en Tech Review.

---

### ❌ Le "Comment" Sans le "Pourquoi"

**Symptôme** :
```markdown
## Stack
- React 18
- PostgreSQL
- Redis
```

**Problème** : Impossible de challenger ou faire évoluer les choix.

**Solution** :
```markdown
## Stack
| Tech | Version | Justification |
|------|---------|---------------|
| React | 18.x | Équipe expérimentée, écosystème mature |
| PostgreSQL | 16 | JSONB pour flexibilité, full-text search natif |
| Redis | 7.x | Cache sessions, pub/sub pour temps réel |
```

---

### ❌ L'Architecture Astronaute

**Symptôme** : Diagrammes UML de 10 pages, patterns enterprise partout.

**Problème** : Over-engineering. Le document fait peur, personne ne le lit.

**Solution** : Documenter ce qui existe, pas ce qui pourrait exister. YAGNI.

---

### ❌ ADRs Absents ou Incomplets

**Symptôme** : "Pourquoi on utilise Redis ?" → "Je sais pas, c'était déjà là."

**Problème** : Décisions impossibles à remettre en question intelligemment.

**Solution** : Un ADR pour chaque choix structurant. 5 min d'écriture, des heures économisées plus tard.

---

## Template Prêt à Copier

```markdown
# ARCHITECTURE : [Nom du Projet]

## Vue d'Ensemble

### Description du Système


### Principes Architecturaux
1. **[Principe 1]** : [Justification]
2. **[Principe 2]** : [Justification]
3. **[Principe 3]** : [Justification]

---

## Stack Technique

### Frontend
| Technologie | Version | Justification |
|-------------|---------|---------------|
|  |  |  |

### Backend
| Technologie | Version | Justification |
|-------------|---------|---------------|
|  |  |  |

### Base de Données
| Technologie | Usage | Justification |
|-------------|-------|---------------|
|  |  |  |

### Infrastructure
| Service | Provider | Justification |
|---------|----------|---------------|
|  |  |  |

---

## Architecture Applicative

### Structure des Modules
```
src/
├──
├──
└──
```

### Conventions de Code
- Nommage :
- Imports :
- Patterns :

---

## Architecture Données

### Modèle de Données


### Entités Principales
| Entité | Champs clés | Notes |
|--------|-------------|-------|
|  |  |  |

---

## Sécurité

### Authentification
-

### Autorisation
-

### Protection des Données
-

---

## ADRs

### ADR-001 : [Titre]
**Date** : YYYY-MM-DD | **Statut** : Accepté

**Contexte**


**Décision**


**Alternatives Considérées**
| Alternative | Pour | Contre | Rejetée car |
|-------------|------|--------|-------------|
|  |  |  |  |

**Conséquences**
- ✅
- ⚠️
```

---

## Checklist de Validation

Avant de considérer le document ARCHITECTURE comme complet :

- [ ] La description du système est compréhensible par un nouveau membre
- [ ] Chaque technologie a une justification (pas juste le nom)
- [ ] La structure des dossiers reflète le code actuel
- [ ] Au moins un ADR documente une décision structurante
- [ ] Les conventions de code sont explicites
- [ ] La sécurité est documentée (auth, authz, données)
- [ ] Un agent IA pourrait générer du code cohérent en lisant ce document

---

## Quand Créer un ADR ?

| Situation | ADR requis ? |
|-----------|-------------|
| Choix de framework/library structurant | ✅ Oui |
| Changement de pattern architectural | ✅ Oui |
| Décision avec trade-offs significatifs | ✅ Oui |
| Ajout d'une dépendance mineure | ❌ Non |
| Refactoring interne sans impact API | ❌ Non |

**Règle simple** : Si quelqu'un pourrait demander "Pourquoi on a fait ça ?" dans 3 mois, écrivez un ADR.

---

*Annexes connexes : [A.3 Template AGENT-GUIDE](./A3-agent-guide.md) • [G.1 Configuration Environnement](./G1-configuration-environnement.md) • [B.4 Tech Lead](./B4-tech-lead.md)*
