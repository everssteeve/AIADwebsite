# I.2 Glossaire

## Pourquoi cette annexe ?

Cette annexe définit tous les termes spécifiques au framework AIAD pour assurer une compréhension commune.

---

## A

### AGENT-GUIDE
Fichier de configuration qui définit le contexte projet pour les agents IA. Contient les conventions, patterns, structure du projet et exemples de code. Généralement nommé `CLAUDE.md` pour Claude ou adapté selon l'agent utilisé.

### Agent IA
Programme d'intelligence artificielle capable d'exécuter des tâches de développement de manière semi-autonome. Dans AIAD, les agents sont des assistants qui amplifient les capacités des développeurs, pas des remplaçants.

### Alignment Stratégique
Synchronisation trimestrielle (ou mensuelle) entre stakeholders et équipe pour valider la direction produit et ajuster les priorités. Voir [D.1 Alignment Stratégique](D1-alignment-strategique.md).

### Anti-pattern
Pratique de développement qui semble efficace mais produit des résultats négatifs. Voir [H.3 Anti-patterns](H3-anti-patterns.md).

### ARCHITECTURE.md
Document technique décrivant les choix architecturaux du projet, les patterns utilisés, et la structure du code. Template en [A.2 Architecture](A2-architecture.md).

---

## B

### Backlog
Liste priorisée des SPECs à implémenter. Géré par le Product Manager en collaboration avec l'équipe.

### Boucle de Développement
Cycle répétitif du processus AIAD : PLANIFIER → IMPLÉMENTER → VALIDER → INTÉGRER. Chaque boucle produit un incrément de valeur.

### Build
Processus de compilation et assemblage du code source en artefact déployable.

---

## C

### CI/CD
Continuous Integration / Continuous Deployment. Pratique d'automatisation des tests, build et déploiement. Voir [G.2 CI/CD](G2-cicd.md).

### Code Review
Relecture du code par un pair avant intégration. Pratique essentielle pour la qualité et le partage de connaissances.

### Content Collection
Dans Astro, système de gestion de contenu typé avec validation par schéma Zod.

### Contexte (Agent)
Ensemble des informations fournies à un agent IA pour qu'il comprenne le projet : AGENT-GUIDE, exemples de code, contraintes techniques.

### Critères d'Acceptation
Liste de conditions vérifiables qu'une fonctionnalité doit satisfaire pour être considérée comme terminée. Font partie de chaque User Story dans une SPEC.

---

## D

### Dashboard
Tableau de bord visuel présentant les métriques clés du projet. Voir [E.1 Exemples de Dashboards](E1-exemples-dashboards.md).

### Demo
Session de présentation du travail accompli aux stakeholders. Voir [D.2 Demo & Feedback](D2-demo-feedback.md).

### Dépendance
Bibliothèque externe ou module dont le projet a besoin pour fonctionner. Aussi : relation entre deux tâches où l'une nécessite la complétion de l'autre.

### DoOD (Definition of Obviously Done)
Checklist des critères qu'une SPEC doit satisfaire pour être considérée comme terminée. Plus explicite que "Done", ne laisse pas de place à l'interprétation. Template en [A.5 DoOD](A5-dood.md).

### DoOuD (Definition of Obviously Undone)
Checklist des critères qui prouvent qu'une fonctionnalité n'est PAS terminée. Complément du DoOD pour les cas ambigus. Template en [A.6 DoOuD](A6-dooud.md).

---

## E

### E2E (End-to-End)
Type de test qui vérifie un parcours utilisateur complet, de l'interface jusqu'à la base de données.

### Edge Case
Cas limite ou situation inhabituelle qu'un système doit gérer correctement.

### Epic
Grande fonctionnalité qui nécessite plusieurs SPECs pour être implémentée.

### ESLint
Outil d'analyse statique pour JavaScript/TypeScript qui identifie les problèmes de code et de style.

---

## F

### Feature Flag
Mécanisme permettant d'activer ou désactiver une fonctionnalité sans déploiement de code.

### Feedback Loop
Cycle de retour d'information permettant d'ajuster le développement. Plus le cycle est court, plus l'adaptation est rapide.

### Flaky Test
Test qui échoue de manière intermittente sans changement de code, rendant la CI peu fiable.

### Framework (AIAD)
Ensemble structuré de pratiques, processus et outils pour le développement assisté par IA. AIAD = AI-Agent Iterative Development.

---

## G

### Git Flow
Modèle de gestion des branches Git avec main, develop, feature branches, etc.

### Golden Path
Parcours recommandé pour accomplir une tâche, documenté pour faciliter l'adoption.

---

## H

### Happy Path
Scénario où tout se passe comme prévu, sans erreur ni cas limite.

### Hook (React)
Fonction permettant d'utiliser l'état et d'autres fonctionnalités React dans des composants fonctionnels.

### Hook (Git)
Script exécuté automatiquement lors d'événements Git (pre-commit, pre-push, etc.).

### Hot Reload
Rechargement automatique du code en développement sans perdre l'état de l'application.

---

## I

### IMPLÉMENTER
Deuxième boucle du processus AIAD où le code est écrit. Le Product Engineer travaille avec l'agent IA pour produire du code selon la SPEC. Voir [C.3 Boucle Implémenter](C3-boucle-implementer.md).

### Incrément
Portion de produit fonctionnelle livrée à la fin d'une itération. Chaque incrément ajoute de la valeur.

### INTÉGRER
Quatrième boucle du processus AIAD où le code validé est mergé et déployé. Voir [C.5 Boucle Intégrer](C5-boucle-integrer.md).

### Itération
Cycle de développement répétable, généralement d'une à deux semaines.

---

## J

### JAMstack
Architecture web basée sur JavaScript, APIs, et Markup pré-rendu.

### JSDoc
Standard de documentation pour JavaScript/TypeScript via des commentaires structurés.

---

## K

### KPI (Key Performance Indicator)
Indicateur clé de performance permettant de mesurer l'atteinte des objectifs.

---

## L

### LCP (Largest Contentful Paint)
Métrique de performance mesurant le temps d'affichage du plus grand élément visible.

### Lint
Analyse statique du code pour détecter erreurs et violations de style.

### Lockfile
Fichier (package-lock.json, pnpm-lock.yaml) qui verrouille les versions exactes des dépendances.

---

## M

### MCP (Model Context Protocol)
Protocole permettant aux agents IA d'accéder à des sources de contexte externes (documentation, code, bases de données). Voir [G.4 MCP](G4-mcp.md).

### MDX
Format combinant Markdown et JSX, permettant d'inclure des composants React dans du contenu.

### Merge
Fusion d'une branche Git dans une autre (typiquement : feature branch → main).

### Mock
Simulation d'un composant ou service pour les tests, permettant d'isoler le code testé.

### Mode Opératoire
Partie pratique du framework AIAD décrivant comment appliquer les concepts au quotidien.

### Mutation (TanStack Query)
Opération qui modifie des données côté serveur (POST, PUT, DELETE).

---

## N

### N+1 Query
Anti-pattern où N requêtes supplémentaires sont exécutées pour chaque élément d'une liste.

---

## O

### Onboarding
Processus d'intégration d'un nouveau membre dans l'équipe ou le projet.

### Optimistic Update
Technique où l'UI est mise à jour immédiatement avant la confirmation serveur, avec rollback si erreur.

### Outcome
Résultat métier attendu, défini dans le PRD. Orienté valeur plutôt que livrable.

---

## P

### PE (Product Engineer)
Développeur qui travaille avec les agents IA pour implémenter les SPECs. Combine compétences techniques et compréhension produit. Voir [B.2 Product Engineer](B2-product-engineer.md).

### PLANIFIER
Première boucle du processus AIAD où les SPECs sont créées à partir des PRDs. Voir [C.2 Boucle Planifier](C2-boucle-planifier.md).

### PM (Product Manager)
Responsable de la vision produit, des PRDs, et de la priorisation du backlog. Voir [B.1 Product Manager](B1-product-manager.md).

### PR (Pull Request)
Demande de fusion de code avec review obligatoire. Aussi appelée Merge Request.

### PRD (Product Requirements Document)
Document décrivant les objectifs, contexte et outcomes d'une fonctionnalité produit. Template en [A.1 PRD](A1-prd.md).

### Prompt
Instruction textuelle donnée à un agent IA pour lui faire accomplir une tâche.

---

## Q

### QA (Quality Assurance)
Ingénieur responsable de la stratégie de test et de la validation qualité. Voir [B.3 QA Engineer](B3-qa-engineer.md).

### Query (TanStack Query)
Opération qui récupère des données côté serveur (GET).

---

## R

### Refactoring
Modification du code pour améliorer sa structure sans changer son comportement.

### Régression
Bug introduit dans une fonctionnalité qui marchait précédemment.

### Rétrospective
Réunion d'équipe pour analyser ce qui a bien fonctionné et ce qui peut être amélioré. Voir [D.4 Rétrospective](D4-retrospective.md).

### Review (Code)
Relecture du code par un pair pour valider qualité, sécurité et conformité aux standards.

### RGAA
Référentiel Général d'Amélioration de l'Accessibilité (standard français).

### RGESN
Référentiel Général d'Écoconception de Services Numériques.

---

## S

### Schema
Définition de la structure de données, souvent avec validation (Zod, JSON Schema).

### Scope
Périmètre d'une fonctionnalité ou d'un projet. Ce qui est inclus et ce qui est exclu.

### SEO
Search Engine Optimization. Optimisation pour les moteurs de recherche.

### SLA (Service Level Agreement)
Engagement de niveau de service, par exemple temps de réponse maximum.

### Smoke Test
Test rapide vérifiant que les fonctionnalités principales marchent après un déploiement.

### SPEC
Spécification technique détaillée décrivant comment implémenter un outcome du PRD. Unité de travail dans AIAD. Template en [A.4 Specs](A4-specs.md).

### Spike
Investigation technique time-boxée pour réduire l'incertitude sur une approche.

### Sprint
Période de développement fixe (généralement 1-2 semaines) dans les méthodologies agiles.

### SSG (Static Site Generation)
Génération de pages HTML au moment du build, pas à la demande.

### Staging
Environnement de pré-production pour tester avant la mise en production.

### Stakeholder
Partie prenante ayant un intérêt dans le produit (clients, direction, équipes support).

### Standup
Réunion quotidienne courte pour synchroniser l'équipe. Voir [D.5 Standup](D5-standup.md).

### Story Point
Unité de mesure relative de l'effort pour implémenter une fonctionnalité.

### SubAgent
Agent IA spécialisé pour une tâche spécifique (sécurité, tests, documentation). Voir [G.6 SubAgents](G6-creation-subagents.md).

### Supporters
Rôles de support dans AIAD : DevOps, Design, Data, Domain Experts. Voir [B.5 Supporters](B5-supporters.md).

---

## T

### TDD (Test-Driven Development)
Pratique où les tests sont écrits avant le code.

### Tech Lead
Responsable technique de l'équipe, garant de l'architecture et des standards. Voir [B.4 Tech Lead](B4-tech-lead.md).

### Tech Review
Réunion technique pour discuter architecture et dette technique. Voir [D.3 Tech Review](D3-tech-review.md).

### Technical Debt
Code ou architecture qui nécessite une amélioration future, "emprunt" technique avec intérêts.

### Trunk-Based Development
Pratique où tout le monde travaille sur la branche principale avec des branches courtes.

### TypeScript
Sur-ensemble typé de JavaScript, standard dans AIAD.

---

## U

### Unit Test
Test d'une unité isolée de code (fonction, composant).

### User Story
Description d'une fonctionnalité du point de vue utilisateur : "En tant que X, je veux Y, afin de Z."

### UX (User Experience)
Expérience utilisateur, qualité de l'interaction avec le produit.

---

## V

### VALIDER
Troisième boucle du processus AIAD où le code est testé et reviewé. Voir [C.4 Boucle Valider](C4-boucle-valider.md).

### Velocity
Mesure de la quantité de travail accomplie par itération (story points, SPECs).

---

## W

### WIP (Work In Progress)
Travail en cours. Limiter le WIP améliore le flux.

---

## Z

### Zod
Bibliothèque TypeScript pour la validation de schémas avec inférence de types.

---

*Retour aux [Annexes](../framework/08-annexes.md)*
