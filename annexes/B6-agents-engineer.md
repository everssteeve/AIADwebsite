# B.6 Agents Engineer

## Pourquoi cette annexe ?

L'Agents Engineer est le spécialiste qui configure et optimise l'écosystème d'agents IA pour l'équipe. Ce rôle existe dans les équipes matures ou les organisations avec plusieurs projets AIAD. Cette annexe détaille le workflow quotidien, la création de subagents, et la progression vers l'expertise.

---

## Vue d'Ensemble du Rôle

### Positionnement dans l'Équipe

```
┌─────────────────────────────────────────────────────────────┐
│                    Product Manager                          │
│                   (Vision, Priorités)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agents Engineer                          │
│        (Configure les agents pour le contexte projet)       │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         ┌────────┐   ┌────────┐   ┌────────┐
         │ Agent  │   │ Agent  │   │ Agent  │
         │Principal│  │Quality │   │Security│
         └────────┘   └────────┘   └────────┘
              │             │             │
              └─────────────┼─────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Product Engineers                         │
│              (Utilisent les agents configurés)              │
└─────────────────────────────────────────────────────────────┘
```

### Responsabilités Clés

1. **AGENT-GUIDE** : Créer et maintenir le fichier de contexte projet
2. **Sélection d'agents** : Choisir et configurer les agents pour le projet
3. **Optimisation** : Améliorer continuellement la qualité des outputs
4. **Subagents** : Créer des agents spécialisés pour les besoins récurrents
5. **Formation** : Aider l'équipe à utiliser efficacement les agents

---

## Workflow Quotidien

### Structure de la Journée

```markdown
## Matin (30 min)

### Review
- [ ] Qualité des outputs de la veille (feedback PE)
- [ ] Problèmes signalés avec les agents
- [ ] Patterns récurrents identifiés

### Priorisation
- [ ] Ajustements AGENT-GUIDE nécessaires ?
- [ ] Support à prévoir pour qui ?

## Pendant la Journée

### Support Réactif
- Répondre aux questions dans le channel dédié
- Pair prompting si cas complexe

### Amélioration Continue
- Mettre à jour AGENT-GUIDE si nouvelle décision
- Créer/améliorer subagents si besoin identifié

### Veille
- Nouvelles versions des agents
- Nouvelles techniques de prompting
- Retours communauté

## Fin de Journée (15 min)

### Documentation
- [ ] Learnings notés
- [ ] FAQ mise à jour si questions récurrentes

### Préparation
- [ ] Actions identifiées pour demain
```

---

## Gestion de l'AGENT-GUIDE

### Responsabilité Principale

L'Agents Engineer est responsable de la qualité et de la mise à jour de l'AGENT-GUIDE.

### Checklist de l'AGENT-GUIDE

```markdown
## Checklist AGENT-GUIDE

### Structure Projet
- [ ] Arborescence documentée avec rôle de chaque dossier
- [ ] Points d'entrée identifiés (main, routes, API)
- [ ] Modules et leurs responsabilités claires

### Conventions de Code
- [ ] Nommage (fichiers, variables, fonctions, classes)
- [ ] Style (formatage, imports, exports)
- [ ] Patterns (hooks, services, composants, API)
- [ ] Gestion d'erreurs
- [ ] Logging

### Exemples de Référence
- [ ] Au moins 2 exemples par pattern majeur
- [ ] Exemples annotés avec commentaires "pourquoi"
- [ ] Anti-exemples (ce qu'il ne faut pas faire)

### Contraintes
- [ ] Dépendances autorisées (et interdites)
- [ ] Patterns interdits avec justification
- [ ] Règles de sécurité spécifiques
- [ ] Limites de l'agent (ce qu'il ne doit pas faire)
```

### Cycle de Mise à Jour

```
Nouvelle décision technique
         │
         ▼
Tech Lead documente dans ADR
         │
         ▼
Agents Engineer met à jour AGENT-GUIDE
         │
         ▼
Test avec prompt type
         │
         ├── Output conforme → Commit
         │
         └── Output non conforme → Ajuster et re-tester
```

### Template de Section AGENT-GUIDE

```markdown
## [Nom du Pattern]

### Quand l'utiliser
[Contexte d'utilisation]

### Structure
[Code ou structure attendue]

### Exemple de référence
→ src/[chemin]/[fichier]

### À éviter
[Anti-pattern avec explication]

### Référence
- ADR : [si applicable]
- Date ajout : YYYY-MM-DD
```

---

## Sélection et Configuration des Agents

### Matrice de Sélection

| Besoin | Agent Recommandé | Configuration Clé |
|--------|------------------|-------------------|
| Développement général | Claude / GPT-4 | AGENT-GUIDE complet |
| Revue de sécurité | Agent Security | Règles OWASP + contexte projet |
| Génération de tests | Agent Quality | Framework de test + conventions |
| Revue d'architecture | Agent Architecture | Patterns + contraintes |
| Documentation | Agent Documentation | Templates + style guide |

### Process de Configuration

```markdown
## Configuration Nouvel Agent

### 1. Évaluer le Besoin
- [ ] Quel problème résoudre ?
- [ ] Quelle fréquence d'utilisation ?
- [ ] Quels risques si mauvais output ?
- [ ] ROI estimé (temps gagné vs temps config)

### 2. Sélectionner l'Agent
- [ ] Capacités vs besoins (match ?)
- [ ] Coût vs valeur
- [ ] Intégration avec l'existant

### 3. Configurer le Contexte
- [ ] Prompt système défini
- [ ] Fichiers de référence identifiés
- [ ] Permissions configurées
- [ ] Limites explicites

### 4. Tester et Valider
- [ ] Cas d'usage nominal → OK ?
- [ ] Edge cases → OK ?
- [ ] Performance acceptable ?
- [ ] PE pilote satisfait ?
```

---

## Création de Subagents

### Quand Créer un Subagent

| Situation | Créer un Subagent ? |
|-----------|---------------------|
| Tâche récurrente (> 5 fois/semaine) | **Oui** |
| Pattern stable et documenté | **Oui** |
| ROI positif (temps config < temps gagné) | **Oui** |
| Cas unique | Non |
| Pattern encore instable | Non |

### Template de Subagent

```markdown
# [Nom] SubAgent

## Rôle
Tu es un agent spécialisé dans [domaine].
Tu génères du code pour le projet [nom projet].

## Contexte Projet
[Extrait pertinent de l'AGENT-GUIDE]

- Stack : [technologies]
- Patterns : [patterns clés]
- Contraintes : [contraintes importantes]

## Tâche
Quand on te demande de [action], tu dois :
1. [Étape 1]
2. [Étape 2]
3. [Étape 3]

## Contraintes
- [Contrainte 1]
- [Contrainte 2]
- [Contrainte 3]

## Output Attendu
[Format et structure de l'output]

## Exemples

### Input
[Exemple de demande]

### Output Attendu
[Exemple de réponse correcte]

## Ce Que Tu Ne Dois PAS Faire
- [Anti-pattern 1]
- [Anti-pattern 2]
```

### Exemple : Subagent API Route

```markdown
# API Route SubAgent

## Rôle
Tu génères des routes API Express pour le projet TaskManager.
Tu suis strictement les patterns établis.

## Contexte Projet
- Stack : Node.js + Express + TypeScript + Drizzle ORM
- Validation : Zod
- Auth : JWT middleware
- Errors : src/lib/errors.ts (AppError class)

## Tâche
Quand on te demande de créer une route API, tu dois :
1. Créer le schéma Zod de validation
2. Créer la route avec le handler
3. Ajouter la route au router principal
4. Générer les tests correspondants

## Contraintes
- Toujours valider les inputs avec Zod
- Toujours utiliser le middleware auth si route protégée
- Retourner des AppError, jamais throw générique
- Transactions pour les opérations multi-tables

## Output Attendu
3 fichiers :
- src/api/routes/[resource].ts (route)
- src/api/schemas/[resource].ts (validation)
- tests/api/[resource].test.ts (tests)

## Exemple de Référence
→ src/api/routes/tasks.ts
→ src/api/schemas/task.ts
→ tests/api/tasks.test.ts

## Ce Que Tu Ne Dois PAS Faire
- Créer de nouvelles dépendances sans demander
- Utiliser any en TypeScript
- Oublier la validation Zod
- Faire des requêtes N+1
```

---

## Optimisation des Prompts

### Cycle d'Optimisation

```
┌─────────────┐
│  Observer   │ ← Analyser les outputs des agents
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Identifier │ ← Repérer patterns de succès/échec
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Améliorer  │ ← Ajuster AGENT-GUIDE ou prompts
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Mesurer    │ ← Vérifier l'amélioration
└──────┬──────┘
       │
       └──────────→ (retour à Observer)
```

### Techniques d'Amélioration

#### 1. Enrichissement du Contexte

```markdown
## Avant (vague)
"Crée un composant de liste"

## Après (contextualisé)
"Crée un composant TaskList en suivant le pattern de UserList.tsx.
Utilise notre hook useQuery et les composants du design system.
Voir src/components/UserList.tsx pour référence."
```

#### 2. Few-Shot Examples

```markdown
"Voici comment on crée des hooks dans ce projet :

Exemple 1 - useUsers.ts :
[code]

Exemple 2 - useTasks.ts :
[code]

Crée un hook similaire pour gérer les projets."
```

#### 3. Guardrails Explicites

```markdown
"Contraintes strictes :
- TypeScript strict (pas de any)
- Max 50 lignes par fonction
- Tests obligatoires
- Réutiliser les helpers existants de src/lib/"
```

#### 4. Feedback Structuré

```markdown
"Output précédent : bon début mais à ajuster.

1. Ligne 15 : utilise notre type Task, pas un nouveau
2. Ligne 23 : on préfère useMemo ici pour les performances
3. Manque : ajoute le cas d'erreur réseau

Regenere avec ces corrections."
```

---

## Formation et Support de l'Équipe

### Onboarding Nouveau PE

```markdown
## Onboarding Agents - [Nom]

### Session 1 : Introduction (1h)
- [ ] Présentation de l'écosystème d'agents
- [ ] Tour de l'AGENT-GUIDE
- [ ] Demo des cas d'usage principaux

### Session 2 : Pratique (2h)
- [ ] Exercice guidé : feature simple avec agent
- [ ] Pattern Contexte → Tâche → Validation
- [ ] Gestion des itérations

### Session 3 : Autonomie (1h)
- [ ] Feature complexe en autonomie supervisée
- [ ] Debrief et questions
- [ ] Ressources pour continuer

### Suivi
- [ ] Check-in J+3
- [ ] Check-in J+7
- [ ] Feedback sur l'expérience
```

### Support Quotidien

| Type de Demande | Réponse |
|-----------------|---------|
| "L'agent ne comprend pas mon contexte" | Pair prompting pour enrichir le contexte |
| "L'output n'est pas bon" | Analyser, ajuster AGENT-GUIDE si pattern |
| "Comment faire X avec l'agent ?" | Montrer l'exemple, documenter si récurrent |
| "Bug dans un subagent" | Fix et déploiement |

### Documentation à Maintenir

- **Guide d'utilisation** : Par agent, avec exemples
- **Catalogue de prompts** : Prompts validés par situation
- **FAQ** : Questions fréquentes et réponses
- **Changelog** : Modifications de l'AGENT-GUIDE

---

## Anti-patterns

### 1. L'AGENT-GUIDE Statique

**Symptôme** : AGENT-GUIDE créé au début et jamais mis à jour.

```
❌ Dernière modification il y a 3 mois
❌ Patterns obsolètes documentés
❌ Nouvelles conventions non ajoutées
```

**Correction** :
```
✅ Mise à jour à chaque décision technique
✅ Review mensuelle de l'exhaustivité
✅ Feedback PE intégré régulièrement
```

### 2. Le Sur-Outillage

**Symptôme** : Trop d'agents configurés "au cas où".

```
❌ 10 subagents pour un projet simple
❌ Temps de config > temps gagné
❌ PE ne savent pas quel agent utiliser
```

**Correction** :
```
✅ Commencer avec 1-2 agents
✅ Ajouter quand besoin réel identifié
✅ ROI positif avant de créer
```

### 3. L'Absence de Mesure

**Symptôme** : "Ça a l'air de marcher" sans données.

```
❌ Pas de feedback structuré des PE
❌ Pas de métriques de qualité
❌ Intuition seule guide les décisions
```

**Correction** :
```
✅ Survey satisfaction PE mensuel
✅ Tracking des corrections post-génération
✅ Métriques de temps par feature
```

### 4. Le Siloing

**Symptôme** : Agents Engineer travaille seul, équipe ne comprend pas.

```
❌ AGENT-GUIDE non partagé
❌ PE ne savent pas comment contribuer
❌ Dépendance totale sur l'AE
```

**Correction** :
```
✅ Transparence sur les configurations
✅ Formation continue de l'équipe
✅ PE peuvent proposer des améliorations
✅ Documentation accessible
```

### 5. Le Prompt Magique

**Symptôme** : Chercher LE prompt parfait universel.

```
❌ "J'ai trouvé le prompt parfait"
❌ Même prompt pour tous les cas
❌ Frustration quand ça ne marche pas
```

**Correction** :
```
✅ Le contexte compte plus que le prompt
✅ Différents cas = différentes approches
✅ L'itération est normale et attendue
```

---

## Métriques de Succès

| Métrique | Cible | Comment Mesurer |
|----------|-------|-----------------|
| Satisfaction PE | > 80% | Survey mensuel |
| Corrections post-génération | < 3 par output | Review des commits |
| Questions support/jour | < 5 | Channel support |
| Temps moyen par feature | -20% vs baseline | Tracking |
| AGENT-GUIDE à jour | Oui | Dernière MàJ < 2 semaines |

---

## Progression de Compétence

### Niveau 1 : Débutant (Mois 1-3)

**Focus** : Mise en place
- Créer l'AGENT-GUIDE initial
- Configurer les agents de base
- Former l'équipe aux fondamentaux
- Collecter le feedback

### Niveau 2 : Intermédiaire (Mois 3-6)

**Focus** : Optimisation
- Améliorer les prompts système
- Créer des subagents spécialisés
- Mesurer et itérer
- Réduire les corrections post-génération

### Niveau 3 : Expert (Mois 6+)

**Focus** : Scalabilité
- Documenter pour d'autres équipes
- Contribuer aux bonnes pratiques globales
- Innover sur les usages
- Mentorer d'autres Agents Engineers

---

## Checklist

### Hebdomadaire
- [ ] Feedback PE collecté et analysé
- [ ] AGENT-GUIDE mis à jour si décisions techniques
- [ ] Questions récurrentes ajoutées à la FAQ
- [ ] Subagents testés et fonctionnels

### Mensuelle
- [ ] Survey satisfaction PE
- [ ] Review des métriques
- [ ] Nettoyage des patterns obsolètes
- [ ] Veille nouvelles techniques

### Trimestrielle
- [ ] Audit complet de l'AGENT-GUIDE
- [ ] ROI des subagents évalué
- [ ] Formation refresh pour l'équipe
- [ ] Partage des learnings (blog, présentation)

---

*Annexes connexes : [A.3 Template AGENT-GUIDE](A3-agent-guide.md) • [H.1 Prompts Efficaces](H1-prompts-efficaces.md) • [G.6 Création de Subagents](G6-creation-subagents.md) • [F Catalogue d'Agents](F1-agent-security.md)*
