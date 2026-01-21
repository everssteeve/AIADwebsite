# I.2 Glossaire AIAD

## Pourquoi cette annexe ?

Un vocabulaire partagé élimine les malentendus. Ce glossaire définit les termes spécifiques au framework AIAD et les concepts techniques courants. Utilisez-le pour aligner l'équipe et onboarder les nouveaux membres.

---

## Index Rapide

| Lettre | Termes Clés |
|--------|-------------|
| **A** | AGENT-GUIDE, Agent IA, Anti-pattern |
| **B** | Backlog, Boucle de Développement |
| **C** | CI/CD, Contexte (Agent), Critères d'Acceptation |
| **D** | DoOD, DoOuD |
| **I** | IMPLÉMENTER, INTÉGRER |
| **P** | PE, PM, PLANIFIER, PRD, Prompt |
| **S** | SPEC, SubAgent |
| **V** | VALIDER |

---

## Termes AIAD

### AGENT-GUIDE
Fichier de configuration définissant le contexte projet pour les agents IA. Contient conventions, patterns, structure et exemples de code.

```markdown
## Noms Courants
- CLAUDE.md (pour Claude)
- .cursorrules (pour Cursor)
- .github/copilot-instructions.md (pour Copilot)

## Contenu Type
- Stack technique et versions
- Conventions de nommage
- Patterns avec exemples de code
- Erreurs à éviter
```

**Voir aussi** : [A.3 Template AGENT-GUIDE](A3-agent-guide.md)

---

### Agent IA
Programme d'IA capable d'exécuter des tâches de développement de manière semi-autonome. Dans AIAD, l'agent amplifie les capacités du développeur, il ne le remplace pas.

| Agent | Usage Principal |
|-------|-----------------|
| Claude | Génération de code, refactoring, documentation |
| GPT-4 | Alternatives pour certains use cases |
| Copilot | Complétion en temps réel |
| Cursor | IDE augmenté avec agents |

**Point clé** : L'agent a besoin de contexte (AGENT-GUIDE + exemples) pour être efficace.

---

### Boucle de Développement
Cycle répétitif du processus AIAD composé de 4 phases :

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  PLANIFIER  │ ──► │ IMPLÉMENTER │ ──► │   VALIDER   │ ──► │  INTÉGRER   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                                                            │
       └────────────────────────────────────────────────────────────┘
                           Feedback continu
```

| Phase | Input | Output | Durée Type |
|-------|-------|--------|------------|
| PLANIFIER | PRD | SPECs | 2-4h |
| IMPLÉMENTER | SPEC | Code | 1-2j |
| VALIDER | Code | Tests verts | 2-4h |
| INTÉGRER | PR | Code en prod | 1-4h |

**Voir aussi** : [C.1 Phase d'Initialisation](C1-phase-initialisation.md)

---

### DoOD (Definition of Obviously Done)
Checklist des critères qu'une SPEC doit satisfaire pour être considérée comme terminée. Plus explicite que "Done", ne laisse pas place à l'interprétation.

```markdown
## Exemple DoOD pour une Feature

- [ ] Code mergé sur main
- [ ] Tests unitaires passent (coverage > 80%)
- [ ] Tests E2E pour les parcours critiques
- [ ] Documentation API mise à jour
- [ ] Review approuvée par 1 pair minimum
- [ ] Pas de régression sur les tests existants
- [ ] Déployé sur staging et vérifié
```

**Anti-pattern** : DoOD theatre = cocher des cases sans vérifier vraiment.

**Voir aussi** : [A.5 Template DoOD](A5-dood.md)

---

### DoOuD (Definition of Obviously Undone)
Checklist des critères qui prouvent qu'une fonctionnalité n'est PAS terminée. Complément du DoOD pour les cas ambigus.

```markdown
## Exemple DoOuD

Si l'un de ces points est vrai, ce n'est PAS fini :
- [ ] TODO ou FIXME dans le code
- [ ] Console.log de debug présents
- [ ] Tests en .skip()
- [ ] Hardcoded values temporaires
- [ ] "Happy path only" sans gestion d'erreurs
```

**Voir aussi** : [A.6 Template DoOuD](A6-dooud.md)

---

### PE (Product Engineer)
Développeur qui travaille avec les agents IA pour implémenter les SPECs. Combine compétences techniques et compréhension produit.

| Responsabilité | Activité |
|----------------|----------|
| Orchestration | Piloter l'agent avec les bons prompts |
| Qualité | Valider le code généré avant commit |
| Contexte | Maintenir l'AGENT-GUIDE à jour |
| Intégration | Connecter les morceaux générés |

**Voir aussi** : [B.2 Product Engineer](B2-product-engineer.md)

---

### PM (Product Manager)
Responsable de la vision produit, des PRDs et de la priorisation du backlog.

| Responsabilité | Livrable |
|----------------|----------|
| Vision | PRD avec outcomes clairs |
| Priorisation | Backlog ordonné |
| Arbitrage | Décisions scope/délai |
| Feedback | Boucle avec utilisateurs |

**Voir aussi** : [B.1 Product Manager](B1-product-manager.md)

---

### PLANIFIER
Première boucle du processus AIAD où les SPECs sont créées à partir des PRDs.

```markdown
## Activités Clés
1. Analyser le PRD et les outcomes
2. Décomposer en SPECs autonomes
3. Définir le DoOD de chaque SPEC
4. Identifier les dépendances
5. Séquencer les SPECs
```

**Voir aussi** : [C.2 Boucle Planifier](C2-boucle-planifier.md)

---

### PRD (Product Requirements Document)
Document décrivant les objectifs, contexte et outcomes d'une fonctionnalité produit. Input principal pour la phase PLANIFIER.

```markdown
## Structure PRD AIAD

1. Contexte et problème
2. Outcomes attendus (mesurables)
3. Périmètre (in/out of scope)
4. User stories principales
5. Contraintes et risques
6. Critères de succès
```

**Voir aussi** : [A.1 Template PRD](A1-prd.md)

---

### Prompt
Instruction textuelle donnée à un agent IA pour accomplir une tâche.

```markdown
## Anatomie d'un Bon Prompt

1. Contexte : "Dans notre projet React/TypeScript..."
2. Tâche : "Crée un hook useAuth qui..."
3. Contraintes : "Utilise nos conventions (voir AGENT-GUIDE)"
4. Output attendu : "Retourne le code + tests unitaires"
5. Exemples : "Similaire à useUser dans src/hooks/"
```

**Voir aussi** : [H.1 Prompts Efficaces](H1-prompts-efficaces.md)

---

### SPEC
Spécification technique détaillée décrivant comment implémenter un outcome du PRD. Unité de travail fondamentale dans AIAD.

```markdown
## Caractéristiques d'une Bonne SPEC

- Autonome : implémentable sans autre SPEC
- Dimensionnée : 1-2 jours de travail
- Testable : critères d'acceptation vérifiables
- Contextualisée : lien vers PRD et architecture
```

**Taille optimale** : 3-7 tâches, 1-2 jours d'implémentation.

**Voir aussi** : [A.4 Template SPECS](A4-specs.md)

---

### SubAgent
Agent IA spécialisé pour une tâche spécifique (sécurité, tests, documentation).

| SubAgent | Spécialité |
|----------|------------|
| Security | Détection vulnérabilités |
| Quality | Standards de code |
| Tests | Génération de tests |
| Docs | Documentation API |

**Voir aussi** : [G.6 Création de SubAgents](G6-creation-subagents.md)

---

### VALIDER
Troisième boucle du processus AIAD où le code est testé et reviewé.

```markdown
## Activités Clés
1. Exécuter les tests (unit + intégration)
2. Vérifier le DoOD
3. Review par un pair
4. Valider sur staging
```

**Voir aussi** : [C.4 Boucle Valider](C4-boucle-valider.md)

---

## Termes Techniques Courants

### Anti-pattern
Pratique qui semble efficace mais produit des résultats négatifs.

```markdown
## Exemples AIAD
- Prompts vagues ("fais un truc bien")
- DoOD theatre (cocher sans vérifier)
- Agent sans contexte (pas d'AGENT-GUIDE)
- SPEC géante (> 1 semaine)
```

**Voir aussi** : [H.3 Anti-patterns](H3-anti-patterns.md)

---

### Backlog
Liste priorisée des SPECs à implémenter. Géré par le PM en collaboration avec l'équipe.

| Position | Signification |
|----------|---------------|
| Top 3 | Sprint actuel |
| Top 10 | Prochains sprints |
| Reste | Future consideration |

---

### CI/CD (Continuous Integration / Continuous Deployment)
Pratique d'automatisation des tests, build et déploiement.

```yaml
# Pipeline type
stages:
  - lint       # Vérification code style
  - test       # Tests unitaires et intégration
  - build      # Compilation
  - deploy     # Mise en production
```

**Voir aussi** : [G.3 Setup CI/CD](G3-setup-cicd.md)

---

### Contexte (Agent)
Ensemble des informations fournies à un agent IA pour qu'il comprenne le projet.

```markdown
## Composants du Contexte

1. AGENT-GUIDE (conventions, patterns)
2. Fichiers de référence (exemples)
3. Documentation technique
4. Historique de conversation
```

---

### Critères d'Acceptation
Liste de conditions vérifiables qu'une fonctionnalité doit satisfaire.

```markdown
## Format Gherkin

Given [contexte initial]
When [action]
Then [résultat attendu]

## Exemple
Given un utilisateur connecté
When il clique sur "Déconnexion"
Then il est redirigé vers la page de login
And son token est invalidé
```

---

### E2E (End-to-End)
Type de test qui vérifie un parcours utilisateur complet, de l'interface jusqu'à la base de données.

```typescript
// Exemple Playwright
test('utilisateur peut créer une tâche', async ({ page }) => {
  await page.goto('/tasks')
  await page.fill('[name="title"]', 'Ma tâche')
  await page.click('button[type="submit"]')
  await expect(page.locator('.task-item')).toContainText('Ma tâche')
})
```

---

### Feature Flag
Mécanisme permettant d'activer ou désactiver une fonctionnalité sans déploiement.

```typescript
if (featureFlags.isEnabled('new-checkout')) {
  return <NewCheckout />
}
return <OldCheckout />
```

---

### Flaky Test
Test qui échoue de manière intermittente sans changement de code.

**Causes courantes** : timing, état partagé, dépendances externes.

**Voir aussi** : [I.1 Troubleshooting](I1-troubleshooting.md#tests-instables-flaky)

---

### IMPLÉMENTER
Deuxième boucle du processus AIAD où le code est écrit avec l'aide des agents.

```markdown
## Workflow Type
1. Charger le contexte (AGENT-GUIDE + SPEC)
2. Prompter l'agent
3. Reviewer le code généré
4. Itérer si nécessaire
5. Commit quand satisfaisant
```

**Voir aussi** : [C.3 Boucle Implémenter](C3-boucle-implementer.md)

---

### INTÉGRER
Quatrième boucle du processus AIAD où le code validé est mergé et déployé.

```markdown
## Étapes
1. Créer la PR
2. Passer la review
3. Merger sur main
4. Déployer sur staging
5. Valider en staging
6. Déployer en production
```

**Voir aussi** : [C.5 Boucle Intégrer](C5-boucle-integrer.md)

---

### MCP (Model Context Protocol)
Protocole permettant aux agents IA d'accéder à des sources de contexte externes.

```markdown
## Sources Supportées
- Documentation (Notion, Confluence)
- Code (GitHub, GitLab)
- Bases de données
- APIs internes
```

**Voir aussi** : [G.5 Installation MCP/Plugins](G5-installation-mcp-plugins.md)

---

### N+1 Query
Anti-pattern où N requêtes supplémentaires sont exécutées pour chaque élément d'une liste.

```typescript
// ❌ N+1 : 1 requête liste + N requêtes détails
const users = await db.user.findMany()
for (const user of users) {
  user.posts = await db.post.findMany({ where: { userId: user.id } })
}

// ✅ Solution : include ou join
const users = await db.user.findMany({
  include: { posts: true }
})
```

---

### PR (Pull Request)
Demande de fusion de code avec review obligatoire. Aussi appelée Merge Request (MR).

```markdown
## Structure PR Efficace

### Titre
feat(auth): add logout functionality

### Description
- Contexte : pourquoi ce changement
- Changements : ce qui a été modifié
- Tests : comment tester
- Screenshots : si UI

### Checklist
- [ ] Tests passent
- [ ] Doc mise à jour
- [ ] Self-review effectuée
```

---

### Régression
Bug introduit dans une fonctionnalité qui marchait précédemment.

**Prévention** : Tests automatisés, smoke tests post-deploy.

---

### Tech Lead
Responsable technique de l'équipe, garant de l'architecture et des standards.

| Responsabilité | Activité |
|----------------|----------|
| Architecture | Décisions et documentation (ADR) |
| Standards | AGENT-GUIDE, conventions |
| Review | Validation technique des PRs |
| Mentorat | Montée en compétence équipe |

**Voir aussi** : [B.4 Tech Lead](B4-tech-lead.md)

---

### TDD (Test-Driven Development)
Pratique où les tests sont écrits avant le code.

```typescript
// 1. RED : écrire un test qui échoue
test('sum adds two numbers', () => {
  expect(sum(1, 2)).toBe(3)  // Fails: sum not defined
})

// 2. GREEN : écrire le minimum pour passer
function sum(a, b) { return a + b }

// 3. REFACTOR : améliorer sans casser
function sum(a: number, b: number): number {
  return a + b
}
```

---

### Velocity
Mesure de la quantité de travail accomplie par itération.

| Mesure | Unité | Usage |
|--------|-------|-------|
| SPECs | Nombre | Simple, facile |
| Story Points | Points | Relatif, populaire |
| Heures | Temps | Précis, chronophage |

**Attention** : La velocity n'est pas un KPI de performance individuelle.

---

## Acronymes

| Acronyme | Signification | Contexte |
|----------|---------------|----------|
| AIAD | AI-Agent Iterative Development | Framework |
| ADR | Architecture Decision Record | Documentation |
| API | Application Programming Interface | Technique |
| CI | Continuous Integration | DevOps |
| CD | Continuous Deployment | DevOps |
| DoOD | Definition of Obviously Done | AIAD |
| DoOuD | Definition of Obviously Undone | AIAD |
| E2E | End-to-End | Tests |
| LCP | Largest Contentful Paint | Performance |
| MCP | Model Context Protocol | Agents |
| MVP | Minimum Viable Product | Produit |
| PE | Product Engineer | Rôle AIAD |
| PM | Product Manager | Rôle AIAD |
| PR | Pull Request | Git |
| PRD | Product Requirements Document | AIAD |
| QA | Quality Assurance | Rôle |
| SLA | Service Level Agreement | Process |
| SPEC | Spécification | AIAD |
| SSG | Static Site Generation | Architecture |
| TDD | Test-Driven Development | Pratique |
| TL | Tech Lead | Rôle |
| WIP | Work In Progress | Process |

---

## Comment Utiliser ce Glossaire

```markdown
## Pour l'Onboarding
1. Lire les termes AIAD en premier
2. Puis les termes techniques courants
3. Garder la liste des acronymes à portée

## Pour les Discussions
- Référencer ce glossaire si un terme est ambigu
- Proposer des ajouts si un terme manque
- Utiliser les termes de manière cohérente

## Pour la Documentation
- Utiliser les termes exacts du glossaire
- Créer des liens vers les définitions si pertinent
- Ne pas redéfinir les termes dans chaque document
```

---

## Ressources Connexes

- [A.1-A.6 Templates](A1-prd.md) - Templates des artefacts AIAD
- [B.1-B.6 Rôles](B1-product-manager.md) - Descriptions détaillées des rôles
- [C.1-C.5 Boucles](C1-phase-initialisation.md) - Guides opérationnels des phases
- [H.3 Anti-patterns](H3-anti-patterns.md) - Ce qu'il faut éviter

---

*Dernière mise à jour : Janvier 2025*
