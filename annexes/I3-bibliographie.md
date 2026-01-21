# I.3 Bibliographie et Ressources

## Pourquoi cette annexe ?

Les bonnes ressources accélèrent l'apprentissage. Cette bibliographie curate les meilleures sources pour approfondir les concepts AIAD : livres fondateurs, articles de référence, documentations officielles et créateurs à suivre. Organisée par niveau et par rôle pour un accès rapide.

---

## Lecture Express par Profil

### Je suis PM, par où commencer ?
1. **Inspired** de Marty Cagan (product management moderne)
2. **The Mom Test** de Rob Fitzpatrick (interviews utilisateurs)
3. **Shape Up** de Basecamp (alternative aux sprints)

### Je suis PE/Dev, par où commencer ?
1. **A Philosophy of Software Design** de John Ousterhout (simplicité)
2. **Prompt Engineering Guide** de DAIR.AI (prompting)
3. Documentation TanStack Query (data fetching moderne)

### Je suis Tech Lead, par où commencer ?
1. **Clean Architecture** de Robert C. Martin (principes)
2. **Team Topologies** de Skelton & Pais (organisation)
3. **DORA Metrics** (mesure de performance)

### Je découvre AIAD, par où commencer ?
1. Ce site web (framework + mode opératoire)
2. Documentation Claude/Anthropic (agents IA)
3. **The Twelve-Factor App** (bonnes pratiques)

---

## Livres Essentiels

### Développement Produit

| Livre | Auteur | Pourquoi le Lire |
|-------|--------|------------------|
| **Inspired** | Marty Cagan | La référence product management. Comment créer des produits que les gens aiment. |
| **Continuous Discovery Habits** | Teresa Torres | Discovery continue, interviews, opportunity solution trees. Indispensable pour le PM moderne. |
| **The Mom Test** | Rob Fitzpatrick | Comment poser les bonnes questions aux utilisateurs sans biais. Court et actionnable. |
| **Shape Up** | Basecamp | Alternative aux sprints. Cycles de 6 semaines, autonomie, betting table. Gratuit en ligne. |
| **The Lean Startup** | Eric Ries | Build-Measure-Learn. Fondamental pour comprendre l'expérimentation rapide. |

```markdown
## Ordre de Lecture Recommandé (PM)

1. The Mom Test (2h) → Savoir interviewer
2. Inspired (8h) → Framework mental product
3. Continuous Discovery Habits (6h) → Process continu
4. Shape Up (4h) → Alternative aux sprints
```

---

### Architecture et Code

| Livre | Auteur | Pourquoi le Lire |
|-------|--------|------------------|
| **Clean Architecture** | Robert C. Martin | Principes SOLID, séparation des responsabilités. Base pour toute architecture propre. |
| **A Philosophy of Software Design** | John Ousterhout | Gestion de la complexité, simplicité. Le livre que j'aurais voulu lire plus tôt. |
| **Domain-Driven Design** | Eric Evans | Modélisation du domaine métier. Dense mais fondamental pour les gros projets. |
| **Refactoring** | Martin Fowler | Catalogue de refactorings avec code smells. Référence incontournable. |
| **Designing Data-Intensive Applications** | Martin Kleppmann | Pour comprendre les systèmes distribués. Niveau avancé. |

```markdown
## Ordre de Lecture Recommandé (Dev/TL)

1. A Philosophy of Software Design (4h) → Mindset
2. Clean Architecture (6h) → Principes
3. Refactoring (consulter) → Catalogue
4. DDD (12h+) → Quand projets complexes
```

---

### Tests et Qualité

| Livre | Auteur | Pourquoi le Lire |
|-------|--------|------------------|
| **Test-Driven Development by Example** | Kent Beck | TDD expliqué par son créateur. Fondamental. |
| **Growing Object-Oriented Software, Guided by Tests** | Freeman & Pryce | TDD avancé, outside-in, design émergent. |
| **Working Effectively with Legacy Code** | Michael Feathers | Comment ajouter des tests sur du code existant. Indispensable en contexte legacy. |

---

### IA et Agents

| Ressource | Source | Pourquoi la Consulter |
|-----------|--------|----------------------|
| **Prompt Engineering Guide** | DAIR.AI | Techniques de prompting complètes. Gratuit, maintenu. |
| **Anthropic Documentation** | Anthropic | Best practices officielles pour Claude. |
| **Building LLM Apps** | LangChain | Patterns pour applications IA. |

**Liens**
- [promptingguide.ai](https://www.promptingguide.ai)
- [docs.anthropic.com](https://docs.anthropic.com)
- [langchain.com/docs](https://python.langchain.com/docs)

---

## Articles de Référence

### Méthodologie et Process

| Article | Pourquoi le Lire |
|---------|------------------|
| **The Twelve-Factor App** | 12 principes pour apps cloud-native. Checklist incontournable. |
| **DORA Metrics** | Les 4 métriques qui comptent vraiment pour mesurer la perf DevOps. |
| **Team Topologies** | Comment organiser les équipes pour le flow. |
| **Conventional Commits** | Standard pour messages de commit. Adoptez-le. |

**Liens**
- [12factor.net](https://12factor.net)
- [dora.dev](https://dora.dev)
- [conventionalcommits.org](https://conventionalcommits.org)

---

### Talks Incontournables

| Talk | Speaker | Durée | Pourquoi le Regarder |
|------|---------|-------|---------------------|
| **Simple Made Easy** | Rich Hickey | 1h | Distinction entre simple et facile. Change votre façon de penser. |
| **The Art of Destroying Software** | Greg Young | 45min | Pourquoi le code jetable est une force. |
| **Making Impossible States Impossible** | Richard Feldman | 25min | Modélisation de données avec types. |
| **Boundaries** | Gary Bernhardt | 30min | Functional core, imperative shell. |

**Où les trouver** : YouTube, rechercher le titre + speaker.

---

## Documentation Technique

### Stack AIAD Recommandée

| Technologie | Documentation | Ce qu'on y Trouve |
|-------------|---------------|-------------------|
| **Astro** | [docs.astro.build](https://docs.astro.build) | Framework, Content Collections, Islands |
| **React** | [react.dev](https://react.dev) | Hooks, patterns, guides officiels |
| **TypeScript** | [typescriptlang.org](https://www.typescriptlang.org/docs) | Handbook, types avancés |
| **TanStack Query** | [tanstack.com/query](https://tanstack.com/query) | Data fetching, cache, mutations |
| **Tailwind CSS** | [tailwindcss.com/docs](https://tailwindcss.com/docs) | Utility classes, customisation |
| **Vitest** | [vitest.dev](https://vitest.dev) | Unit testing, mocking |
| **Playwright** | [playwright.dev](https://playwright.dev) | E2E testing, cross-browser |
| **Zod** | [zod.dev](https://zod.dev) | Schema validation, type inference |

---

### Outils de Développement

| Outil | Documentation | Usage |
|-------|---------------|-------|
| **pnpm** | [pnpm.io](https://pnpm.io) | Package manager rapide |
| **ESLint** | [eslint.org](https://eslint.org) | Linting JavaScript/TypeScript |
| **Prettier** | [prettier.io](https://prettier.io) | Formatage automatique |
| **Husky** | [typicode.github.io/husky](https://typicode.github.io/husky) | Git hooks |
| **GitHub Actions** | [docs.github.com/actions](https://docs.github.com/actions) | CI/CD |

---

## Blogs et Newsletters

### Engineering Blogs à Suivre

| Blog | Focus | Fréquence |
|------|-------|-----------|
| **Vercel Blog** | Next.js, performance, edge | Hebdo |
| **Linear Blog** | Product dev, design | Mensuel |
| **Stripe Engineering** | APIs, fiabilité | Mensuel |
| **Netflix Tech Blog** | Scale, architecture | Bi-mensuel |

**Liens**
- [vercel.com/blog](https://vercel.com/blog)
- [linear.app/blog](https://linear.app/blog)
- [stripe.com/blog/engineering](https://stripe.com/blog/engineering)
- [netflixtechblog.com](https://netflixtechblog.com)

---

### Newsletters Recommandées

| Newsletter | Auteur | Pourquoi S'abonner |
|------------|--------|-------------------|
| **Bytes.dev** | ui.dev | JavaScript/React, ton léger, hebdo |
| **The Pragmatic Engineer** | Gergely Orosz | Engineering management, carrière. Référence. |
| **TLDR** | Dan | Tech news condensées, quotidien |
| **Kent C. Dodds** | Kent C. Dodds | React, testing, patterns |

**Liens**
- [bytes.dev](https://bytes.dev)
- [blog.pragmaticengineer.com](https://blog.pragmaticengineer.com)
- [tldr.tech](https://tldr.tech)

---

### Créateurs à Suivre

| Qui | Plateforme | Expertise |
|-----|------------|-----------|
| **Theo (t3.gg)** | YouTube, Twitter | TypeScript, full-stack moderne |
| **Matt Pocock** | Twitter, totaltypescript.com | TypeScript avancé |
| **Kent C. Dodds** | Blog, YouTube | React, testing |
| **Tanner Linsley** | GitHub, Twitter | TanStack (Query, Router, Table) |
| **Ryan Carniato** | Twitter, YouTube | Signals, SolidJS, réactivité |

---

## Podcasts

| Podcast | Hosts | Format | Pour Qui |
|---------|-------|--------|----------|
| **Syntax** | Wes Bos, Scott Tolinski | 30-60min | Web dev généraliste |
| **Software Engineering Daily** | Sean | 45min | Architecture, interviews |
| **JS Party** | Changelog | 60min | JavaScript écosystème |
| **The Changelog** | Adam, Jerod | 60min | Open source, tendances |

---

## Conférences

### Vidéos de Conférences

| Conférence | Focus | Chaîne YouTube |
|------------|-------|----------------|
| **React Conf** | React écosystème | @ReactConf |
| **ViteConf** | Vite, build tools | @vikiconf |
| **Node Congress** | Node.js, backend | @GitNation |
| **Devoxx FR** | Java, architecture | @DevoxxFR |

---

## Anti-patterns Bibliographie

### Ce qu'il NE faut PAS faire

```markdown
❌ Lire un livre sans pratiquer
   → Appliquer immédiatement sur un projet

❌ Suivre toutes les newsletters
   → Choisir 2-3 max, les lire vraiment

❌ Regarder des talks sans notes
   → Noter 3 takeaways max par talk

❌ Accumuler les "à lire plus tard"
   → File d'attente de 5 items max

❌ Lire uniquement son domaine
   → PM lire du technique, Dev lire du produit
```

---

## Plan de Lecture par Niveau

### Débutant (0-2 ans)

```markdown
## Mois 1-3 : Fondations
- [ ] React Documentation (complet)
- [ ] TypeScript Handbook (sections 1-3)
- [ ] The Mom Test

## Mois 4-6 : Pratique
- [ ] A Philosophy of Software Design
- [ ] Test-Driven Development by Example
- [ ] Prompt Engineering Guide

## Continu
- Newsletter : Bytes.dev
- Blog : React Blog
```

---

### Intermédiaire (2-5 ans)

```markdown
## Trimestre 1 : Architecture
- [ ] Clean Architecture
- [ ] Refactoring (chapitres sélectionnés)
- [ ] DORA Metrics

## Trimestre 2 : Produit
- [ ] Inspired
- [ ] Shape Up
- [ ] Continuous Discovery Habits

## Continu
- Newsletter : The Pragmatic Engineer
- Talks : 1 par semaine
```

---

### Senior (5+ ans)

```markdown
## Focus : Leadership & Systèmes
- [ ] Team Topologies
- [ ] Domain-Driven Design
- [ ] Designing Data-Intensive Applications

## Focus : Contribution
- [ ] Écrire des articles
- [ ] Contribuer à l'open source
- [ ] Mentorer des juniors

## Continu
- Newsletter : The Pragmatic Engineer
- Conférences : Speaker ou attendee
```

---

## Checklist Bibliographie

```markdown
## Pour bien utiliser cette annexe

### Choix des Ressources
- [ ] Identifier mon niveau actuel
- [ ] Identifier mon rôle principal
- [ ] Choisir 1 livre à lire ce mois
- [ ] Choisir 2 newsletters max à suivre

### Mise en Pratique
- [ ] Appliquer sur un projet réel
- [ ] Prendre des notes
- [ ] Partager avec l'équipe

### Mise à Jour
- [ ] Revisiter cette liste chaque trimestre
- [ ] Proposer des ajouts si ressource utile trouvée
```

---

## Ressources Connexes

- [H.1 Prompts Efficaces](H1-prompts-efficaces.md) - Mettre en pratique le prompting
- [H.5 Notes d'Apprentissage](H5-notes-apprentissage.md) - Capitaliser les learnings
- [I.4 Communauté](I4-communaute.md) - Échanger avec d'autres praticiens

---

*Dernière mise à jour : Janvier 2025*
