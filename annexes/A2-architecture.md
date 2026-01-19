# A.2 Template ARCHITECTURE

## Pourquoi ce template ?

Le document ARCHITECTURE capture les décisions techniques structurantes du projet. Il sert de référence pour les agents IA et les humains, garantissant la cohérence des choix techniques tout au long du développement.

**Responsable principal** : Tech Lead

---

## Structure du Document ARCHITECTURE

### 1. Vue d'Ensemble

```markdown
## Vue d'Ensemble

### Description du Système
[Description en 2-3 phrases du système et de son objectif]

### Diagramme de Contexte
[Schéma montrant le système et ses interactions avec les acteurs externes]

### Principes Architecturaux
- [Principe 1 : ex. "Simplicité avant optimisation"]
- [Principe 2 : ex. "API-first"]
- [Principe 3 : ex. "Immutabilité des données"]
```

### 2. Stack Technique

```markdown
## Stack Technique

### Frontend
| Technologie | Version | Justification |
|-------------|---------|---------------|
| [Framework] | [X.Y] | [Pourquoi ce choix] |
| [Styling] | [X.Y] | [Pourquoi ce choix] |
| [State Management] | [X.Y] | [Pourquoi ce choix] |

### Backend
| Technologie | Version | Justification |
|-------------|---------|---------------|
| [Runtime] | [X.Y] | [Pourquoi ce choix] |
| [Framework] | [X.Y] | [Pourquoi ce choix] |
| [ORM/Query Builder] | [X.Y] | [Pourquoi ce choix] |

### Base de Données
| Technologie | Usage | Justification |
|-------------|-------|---------------|
| [DB principale] | [Cas d'usage] | [Pourquoi ce choix] |
| [Cache] | [Cas d'usage] | [Pourquoi ce choix] |

### Infrastructure
| Service | Provider | Justification |
|---------|----------|---------------|
| [Hosting] | [Provider] | [Pourquoi ce choix] |
| [CI/CD] | [Provider] | [Pourquoi ce choix] |
| [Monitoring] | [Provider] | [Pourquoi ce choix] |
```

### 3. Architecture Applicative

```markdown
## Architecture Applicative

### Structure des Modules
[Description de l'organisation du code]

```
src/
├── components/     # Composants UI réutilisables
├── features/       # Fonctionnalités métier
├── lib/           # Utilitaires et helpers
├── pages/         # Points d'entrée (routing)
└── services/      # Couche d'accès aux données
```

### Patterns Utilisés
| Pattern | Usage | Exemple |
|---------|-------|---------|
| [Pattern 1] | [Où et pourquoi] | [Référence fichier] |
| [Pattern 2] | [Où et pourquoi] | [Référence fichier] |

### Conventions de Code
- [Convention 1 : nommage, structure, etc.]
- [Convention 2]
- [Convention 3]
```

### 4. Architecture Données

```markdown
## Architecture Données

### Modèle de Données Principal
[Schéma ou description des entités principales et leurs relations]

### Stratégie de Migration
- [Outil utilisé pour les migrations]
- [Politique de versioning du schéma]

### Gestion des États
- [Comment l'état applicatif est géré]
- [Stratégie de cache]
```

### 5. Sécurité

```markdown
## Sécurité

### Authentification
- [Mécanisme utilisé : JWT, sessions, OAuth, etc.]
- [Gestion des tokens/sessions]

### Autorisation
- [Modèle de permissions : RBAC, ABAC, etc.]
- [Implémentation]

### Protection des Données
- [Chiffrement au repos]
- [Chiffrement en transit]
- [Gestion des secrets]
```

### 6. ADRs (Architecture Decision Records)

```markdown
## Décisions Architecturales (ADRs)

### ADR-001 : [Titre de la décision]
**Date** : [YYYY-MM-DD]
**Statut** : [Accepté/Superseded/Deprecated]

**Contexte**
[Situation qui nécessite une décision]

**Décision**
[Ce qui a été décidé]

**Conséquences**
- [Conséquence positive 1]
- [Conséquence négative à surveiller]

**Alternatives Considérées**
- [Alternative 1] : [Pourquoi rejetée]
- [Alternative 2] : [Pourquoi rejetée]
```

---

## Exemple Minimal

```markdown
# ARCHITECTURE : Application de Gestion de Tâches

## Vue d'Ensemble

### Description du Système
Application web permettant la gestion collaborative de tâches en temps réel pour des équipes de petite taille.

### Principes Architecturaux
- Simplicité : pas d'over-engineering, YAGNI
- Type-safety : TypeScript strict partout
- Composabilité : composants et hooks réutilisables

## Stack Technique

### Frontend
| Technologie | Version | Justification |
|-------------|---------|---------------|
| React | 18.x | Écosystème mature, équipe familière |
| Tailwind CSS | 3.x | Prototypage rapide, bundle optimisé |
| TanStack Query | 5.x | Gestion cache et état serveur |

### Backend
| Technologie | Version | Justification |
|-------------|---------|---------------|
| Node.js | 20.x | Runtime unifié avec le front |
| Hono | 4.x | Léger, performant, TypeScript natif |
| Drizzle | 0.29.x | Type-safe, proche du SQL |

### Base de Données
| Technologie | Usage | Justification |
|-------------|-------|---------------|
| PostgreSQL | Données principales | Fiable, fonctionnalités avancées |

### Infrastructure
| Service | Provider | Justification |
|---------|----------|---------------|
| Hosting | Vercel + Railway | Simplicité, coût maîtrisé |
| CI/CD | GitHub Actions | Intégré au repo |

## ADRs

### ADR-001 : Monorepo avec pnpm workspaces
**Date** : 2026-01-15
**Statut** : Accepté

**Contexte**
Besoin de partager du code entre front et back (types, validations).

**Décision**
Utiliser un monorepo avec pnpm workspaces.

**Conséquences**
- (+) Types partagés sans publication npm
- (+) CI unifiée
- (-) Complexité initiale de setup
```

---

## Conseils d'Utilisation

### Quand Créer un ADR

- Choix de technologie structurant
- Pattern architectural non évident
- Décision avec trade-offs significatifs
- Tout choix qui pourrait être questionné plus tard

### Évolution du Document

1. **Initialisation** : Stack et principes de base
2. **En continu** : Nouveaux ADRs à chaque décision significative
3. **Tech Review** : Revue et mise à jour si nécessaire

### Erreurs Courantes

- **Documentation morte** : Le document doit rester synchronisé avec le code
- **Trop de détails** : Documenter les décisions, pas l'implémentation
- **Pas de justification** : Chaque choix doit expliquer le "pourquoi"

---

*Retour aux [Annexes](../framework/08-annexes.md)*
