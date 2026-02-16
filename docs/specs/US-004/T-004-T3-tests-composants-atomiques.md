# T-004-T3 : Tests unitaires composants atomiques (NavLink, Breadcrumb, PrevNextLinks, TableOfContents)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 16 fevrier 2026 |
| **Statut** | 🟢 Terminee |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | T-004-F2 (NavLink), T-004-F6 (Breadcrumb), T-004-F7 (TableOfContents), T-004-F8 (PrevNextLinks) |
| **Bloque** | Aucune (tache terminale) |

---

## 1. Objectif

Implementer les suites de tests unitaires exhaustives pour les 4 composants atomiques de navigation definis dans les taches T-004-F2, T-004-F6, T-004-F7 et T-004-F8, en garantissant :

- **Couverture a 100%** : Chaque composant, chaque prop, chaque branche conditionnelle est testee
- **Validation du rendu HTML** : La structure HTML generee est conforme aux specs de chaque composant
- **Accessibilite** : Les attributs ARIA (`aria-current`, `aria-label`, `aria-hidden`, `aria-expanded`, `aria-controls`) sont verifies
- **Variantes et etats** : Toutes les combinaisons de props (variantes, badges, etats actifs/inactifs, responsive) sont couvertes
- **Cas limites** : Les 97 cas limites documentes dans les 4 specs composants sont couverts (25 NavLink + 25 Breadcrumb + 22 TOC + 25 PrevNextLinks)
- **Protection XSS** : L'echappement automatique d'Astro est verifie pour chaque composant
- **Regression** : La suite protege contre les modifications accidentelles des composants

---

## 2. Contexte technique

### 2.1 Stack de test

| Technologie | Version | Role |
|-------------|---------|------|
| Vitest | 1.x | Framework de test unitaire |
| Astro Container API | experimental | Rendu des composants .astro en string HTML |
| TypeScript | 5.x | Typage strict des fixtures et assertions |

### 2.2 Arborescence

```
tests/
└── unit/
    └── components/
        └── layout/
            ├── nav-link.test.ts              <-- FICHIER DE TEST NavLink
            ├── breadcrumb.test.ts            <-- FICHIER DE TEST Breadcrumb
            ├── table-of-contents.test.ts     <-- FICHIER DE TEST TableOfContents
            └── prev-next-links.test.ts       <-- FICHIER DE TEST PrevNextLinks
src/
├── components/
│   └── layout/
│       ├── NavLink.astro                     # Code teste (T-004-F2)
│       ├── Breadcrumb.astro                  # Code teste (T-004-F6)
│       ├── TableOfContents.astro             # Code teste (T-004-F7)
│       └── PrevNextLinks.astro               # Code teste (T-004-F8)
├── types/
│   └── navigation.ts                         # Types source (T-004-B1)
├── lib/
│   └── navigation.ts                         # Helpers (T-004-B4)
└── data/
    └── navigation.ts                         # Donnees de navigation (T-004-B3)
```

### 2.3 Composants testes

| Composant | Fichier source | Props principales | Nb cas limites |
|-----------|---------------|-------------------|----------------|
| `NavLink` | `src/components/layout/NavLink.astro` | `href`, `label`, `variant`, `activeMatch`, `isActive`, `badge`, `hasChildren`, `section` | 25 |
| `Breadcrumb` | `src/components/layout/Breadcrumb.astro` | `items`, `tree`, `siteUrl`, `noJsonLd` | 25 |
| `TableOfContents` | `src/components/layout/TableOfContents.astro` | `headings`, `title`, `minDepth`, `maxDepth` | 22 |
| `PrevNextLinks` | `src/components/layout/PrevNextLinks.astro` | `links`, `tree` | 25 |

### 2.4 Technique de rendu : Astro Container API

Tous les tests utilisent l'**Astro Container API** (experimentale) pour rendre les composants `.astro` en string HTML cote serveur :

```typescript
import { experimental_AstroContainer as AstroContainer } from 'astro/container'

const container = await AstroContainer.create()
const html = await container.renderToString(MonComposant, {
  props: { /* ... */ },
  request: new Request('https://aiad.dev/page-courante'),
})
```

**Points cles :**

| Aspect | Detail |
|--------|--------|
| `AstroContainer.create()` | Cree un conteneur de rendu isole |
| `renderToString()` | Retourne le HTML genere en string |
| `props` | Les proprietes a passer au composant |
| `request` | Simule l'URL courante (utilise par `Astro.url.pathname`) |
| Assertions | Toutes basees sur `string.toContain()` / `not.toContain()` / `toMatch()` |

### 2.5 Conventions de test

Conformement aux tests existants du projet (`tests/unit/lib/navigation.test.ts`, `tests/unit/schemas/navigation.test.ts`) :

| Convention | Detail |
|-----------|--------|
| Nommage fichiers | `kebab-case.test.ts` dans `tests/unit/components/layout/` |
| Structure | `describe` par composant/categorie, `it` par cas de test |
| Helper de rendu | Fonction `render*` par composant (ex: `renderNavLink`, `renderBreadcrumb`) |
| Fixtures | Variables `const` en haut du fichier, reutilisables |
| Assertions | Verification de la presence/absence de strings dans le HTML rendu |
| References cas limites | Prefixe `T-XX:` dans le nom du test |
| Langue des descriptions | Francais |
| Numerotation tests | Sequentielle par fichier (T-01, T-02, ...) |

---

## 3. Specifications fonctionnelles

### 3.1 Vue d'ensemble des 4 fichiers de test

| Fichier | Composant | Nb tests | Categories |
|---------|-----------|----------|------------|
| `nav-link.test.ts` | NavLink | 40 | Structure HTML, etat actif, trailing slash, variantes, badge, chevron, classes/attributs, XSS, combinaisons |
| `breadcrumb.test.ts` | Breadcrumb | 50 | Rendu conditionnel, structure HTML, separateur, etat courant, troncature mobile, JSON-LD, accessibilite, styles, classes/attributs, XSS, combinaisons |
| `table-of-contents.test.ts` | TableOfContents | 50 | Rendu conditionnel, structure HTML, titre, indentation, styles par profondeur, positionnement, mobile, filtrage, accessibilite, classes/attributs, XSS, script client, combinaisons |
| `prev-next-links.test.ts` | PrevNextLinks | 50 | Rendu conditionnel, structure HTML, fleches, accessibilite, cross-section, responsive, styles, classes/attributs, XSS, combinaisons |
| **Total** | **4 composants** | **~190** | |

---

### 3.2 NavLink — Inventaire des tests (40 tests)

#### 3.2.1 Helper de rendu

```typescript
async function renderNavLink(
  props: Record<string, unknown> = {},
  currentPath: string = '/',
) {
  const container = await AstroContainer.create()
  return container.renderToString(NavLink, {
    props: { href: '/test', label: 'Test Link', ...props },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}
```

#### 3.2.2 Structure HTML (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-01 | Genere un element `<a>` | — | `toContain('<a')` |
| T-02 | Le `href` est present sur le lien | — | `toContain('href="/framework/preambule"')` |
| T-03 | Le label est affiche dans un `<span class="truncate">` | — | `toContain('truncate')`, `toContain('Preambule')` |
| T-04 | Le `data-navlink` est present | — | `toContain('data-navlink')` |

#### 3.2.3 Etat actif (7 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-05 | `aria-current="page"` quand le href correspond (exact) | CL-01 | `toContain('aria-current="page"')` |
| T-06 | Pas d'`aria-current` quand le href ne correspond pas (exact) | CL-02 | `not.toContain('aria-current')` |
| T-07 | Actif avec `activeMatch="prefix"` + URL enfant | CL-03 | `toContain('aria-current="page"')` |
| T-08 | Actif avec `activeMatch="prefix"` + URL exacte | — | `toContain('aria-current="page"')` |
| T-09 | Inactif avec `activeMatch="prefix"` + autre section | CL-04 | `not.toContain('aria-current')` |
| T-10 | `isActive=true` force l'etat actif | CL-09 | `toContain('aria-current="page"')` |
| T-11 | `isActive=false` force l'etat inactif | CL-10 | `not.toContain('aria-current')` |

#### 3.2.4 Trailing slash (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-12 | Normalise le href avec trailing slash | CL-06 | href=`/fw/preambule/`, URL=`/fw/preambule` → actif |
| T-13 | Normalise l'URL courante avec trailing slash | CL-07 | href=`/fw/preambule`, URL=`/fw/preambule/` → actif |
| T-14 | La racine `/` n'est pas affectee par la normalisation | CL-08 | href=`/`, URL=`/` → actif |

#### 3.2.5 Variantes (7 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-15 | Variante sidebar par defaut | CL-20 | `toContain('px-3 py-2')`, `toContain('text-sm')` |
| T-16 | Variante header | — | `toContain('inline-flex')`, `toContain('font-medium')` |
| T-17 | Variante dropdown a `w-full` | — | `toContain('w-full')` |
| T-18 | Variante mobile a un padding plus grand | — | `toContain('px-4')`, `toContain('py-3')`, `toContain('text-base')` |
| T-19 | Sidebar active a une bordure gauche | — | `toContain('border-l-2')`, `toContain('border-blue-600')` |
| T-20 | Header actif a un soulignement | — | `toContain('border-b-2')`, `toContain('border-blue-600')` |
| T-21 | Dropdown actif a un fond bleu | — | `toContain('bg-blue-50')`, `toContain('text-blue-700')` |

#### 3.2.6 Badge (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-22 | Pas de badge par defaut | CL-11 | `not.toContain('Nouveau')`, `not.toContain('Essentiel')` |
| T-23 | Badge `"new"` affiche "Nouveau" en vert | CL-12 | `toContain('Nouveau')`, `toContain('bg-green-100')` |
| T-24 | Badge `"essential"` affiche "Essentiel" en ambre | CL-13 | `toContain('Essentiel')`, `toContain('bg-amber-100')` |
| T-25 | Badge a les classes de style attendues | — | `toContain('text-xs')`, `toContain('rounded-full')` |

#### 3.2.7 Chevron (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-26 | Pas de chevron par defaut | CL-15 | `not.toContain('<svg')` |
| T-27 | Chevron affiche quand `hasChildren=true` | CL-14 | `toContain('<svg')`, `toContain('aria-hidden="true"')` |
| T-28 | Chevron a la classe `ml-auto` pour etre a droite | — | `toContain('ml-auto')` |

#### 3.2.8 Classes et attributs (8 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-29 | Classe personnalisee ajoutee | CL-19 | `toContain('my-custom-class')` |
| T-30 | Focus ring present | — | `toContain('focus:ring-2')`, `toContain('focus:ring-blue-500')` |
| T-31 | `data-section` rendu quand `section` fourni | CL-23 | `toContain('data-section="framework"')` |
| T-32 | Pas de `data-section` sans prop `section` | CL-24 | `not.toMatch(/data-section="[^"]+"/)`|
| T-33 | `id` rendu quand fourni | CL-25 | `toContain('id="nav-framework"')` |
| T-34 | `role` rendu quand fourni | CL-21 | `toContain('role="menuitem"')` |
| T-35 | `tabindex` rendu quand fourni | CL-22 | `toContain('tabindex="-1"')` |
| T-36 | `transition-colors` presente | — | `toContain('transition-colors')` |

#### 3.2.9 Protection XSS (2 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-37 | Label avec caracteres HTML est echappe | CL-18 | `not.toContain('<script>alert')`, `toContain('&lt;script&gt;')` |
| T-38 | Label avec accents et caracteres speciaux | — | `toContain('Ecosysteme')` |

#### 3.2.10 Combinaisons (2 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-39 | Badge et chevron affiches ensemble, badge avant chevron | CL-16 | `indexOf('Essentiel') < indexOf('<svg')` |
| T-40 | Lien actif avec badge | — | `toContain('aria-current="page"')`, `toContain('Nouveau')` |

---

### 3.3 Breadcrumb — Inventaire des tests (50 tests)

#### 3.3.1 Helper de rendu et fixtures

```typescript
const SIMPLE_BREADCRUMBS = [
  { label: 'Accueil', href: '/' },
  { label: 'Framework', href: '/framework' },
  { label: 'Preambule', href: '/framework/preambule', isCurrent: true },
]

const DEEP_BREADCRUMBS = [
  { label: 'Accueil', href: '/' },
  { label: 'Annexes', href: '/annexes' },
  { label: 'A - Templates', href: '/annexes/templates' },
  { label: 'A1 - PRD', href: '/annexes/templates/prd', isCurrent: true },
]

const MINIMAL_BREADCRUMBS = [
  { label: 'Accueil', href: '/' },
  { label: 'Glossaire', href: '/glossaire', isCurrent: true },
]

async function renderBreadcrumb(
  props: Record<string, unknown> = {},
  currentPath: string = '/framework/preambule',
) {
  const container = await AstroContainer.create()
  return container.renderToString(Breadcrumb, {
    props: { items: SIMPLE_BREADCRUMBS, ...props },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}
```

#### 3.3.2 Rendu conditionnel (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-01 | Rend le composant quand `items` est fourni | CL-01 | `toContain('<nav')`, `toContain('data-breadcrumb')` |
| T-02 | Ne rend rien quand `items` est un tableau vide | CL-04 | `not.toContain('<nav')` |
| T-03 | Ne rend rien quand `items` est null | CL-02 | `not.toContain('<nav')` |

#### 3.3.3 Structure HTML (6 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-04 | `<nav>` avec `aria-label="Fil d'Ariane"` | — | `toContain("aria-label=\"Fil d'Ariane\"")` |
| T-05 | Contient une liste ordonnee `<ol>` | — | `toContain('<ol')` |
| T-06 | Contient un `<li>` par element du breadcrumb | — | `liCount === 3` |
| T-07 | Les liens intermediaires sont des `<a>` avec href | — | `toContain('href="/"')`, `toContain('href="/framework"')` |
| T-08 | Le dernier element est un `<span>` non cliquable | CL-11 | `toContain('data-breadcrumb-current')` |
| T-09 | Les labels sont affiches dans le bon ordre | — | positions comparees |

#### 3.3.4 Separateur (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-10 | Pas de separateur avant le premier element | — | premier `<li>` sans `<svg>` |
| T-11 | Separateur SVG entre les elements | — | `svgCount === 2` |
| T-12 | Les separateurs ont `aria-hidden="true"` | CL-12 | tous les SVG avec `aria-hidden` |
| T-13 | Le separateur est un chevron droit | — | `toContain('M9 5l7 7-7 7')` |

#### 3.3.5 Etat courant (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-14 | Le dernier element a `aria-current="page"` | CL-11 | `toContain('aria-current="page"')` |
| T-15 | Seul le dernier element a `aria-current` | — | `ariaCurrentCount === 1` |
| T-16 | Les liens intermediaires n'ont pas `aria-current` | — | `<a>` sans `aria-current` |

#### 3.3.6 Troncature mobile (7 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-17 | Pas de troncature quand <= 3 niveaux | CL-08 | `not.toContain('data-breadcrumb-ellipsis')` |
| T-18 | Troncature quand > 3 niveaux | CL-09 | `toContain('data-breadcrumb-ellipsis')` |
| T-19 | Items intermediaires ont `hidden md:inline-flex` quand > 3 | — | `toContain('hidden md:inline-flex')` |
| T-20 | L'ellipsis est visible sur mobile (`inline-flex md:hidden`) | — | `toContain('inline-flex md:hidden')` |
| T-21 | L'ellipsis a `aria-hidden="true"` | CL-24 | `toContain('data-breadcrumb-ellipsis')` |
| T-22 | L'ellipsis contient `...` | — | `toContain('...')` |
| T-23 | Le premier et le dernier element ne sont jamais masques | — | `toContain('Accueil')`, `toContain('A1 - PRD')` |

#### 3.3.7 JSON-LD (8 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-24 | Genere un `<script type="application/ld+json">` | CL-15 | `toContain('application/ld+json')` |
| T-25 | JSON-LD contient `"@type":"BreadcrumbList"` | — | `toContain('"@type":"BreadcrumbList"')` |
| T-26 | JSON-LD contient le bon nombre d'elements | — | `positionMatches.length === 3` |
| T-27 | JSON-LD a des positions 1-based | — | `"position":1`, `"position":2`, `"position":3` |
| T-28 | Le dernier item JSON-LD n'a pas de propriete `"item"` | CL-15 | `lastItem.item === undefined` |
| T-29 | Les items non-derniers ont une propriete `"item"` (URL) | CL-16 | `firstItem.item` contient `/` |
| T-30 | `noJsonLd=true` desactive le JSON-LD | CL-17 | `not.toContain('application/ld+json')` |
| T-31 | Le JSON-LD utilise des URLs absolues | CL-16 | `toMatch(/^https?:\/\//)` |

#### 3.3.8 Accessibilite (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-32 | Le nav a `aria-label="Fil d'Ariane"` | — | `toContain("aria-label=\"Fil d'Ariane\"")` |
| T-33 | Les liens ont un focus ring | — | `toContain('focus:ring-2')` |
| T-34 | La liste utilise `<ol>` (ordonnee) | — | `toContain('<ol')` |

#### 3.3.9 Styles (5 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-35 | Les liens ont `text-gray-600` | — | `toContain('text-gray-600')` |
| T-36 | La page courante a `text-gray-500` et `font-medium` | — | `toContain('text-gray-500')`, `toContain('font-medium')` |
| T-37 | Les liens ont `hover:underline` | — | `toContain('hover:underline')` |
| T-38 | Les separateurs ont `text-gray-400` | — | `toContain('text-gray-400')` |
| T-39 | `transition-colors` presente sur les liens | — | `toContain('transition-colors')` |

#### 3.3.10 Classes et attributs (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-40 | Classe personnalisee ajoutee au nav | CL-19 | `toContain('my-custom-class')` |
| T-41 | `data-breadcrumb` present sur le nav | — | `toContain('data-breadcrumb')` |
| T-42 | `data-breadcrumb-link` present sur les liens | — | `toContain('data-breadcrumb-link')` |
| T-43 | `data-breadcrumb-current` present sur la page courante | — | `toContain('data-breadcrumb-current')` |

#### 3.3.11 Protection XSS (2 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-44 | Label avec HTML est echappe | CL-13 | `not.toContain('<script>alert')` |
| T-45 | Label avec accents et caracteres speciaux | — | `toContain('Ecosysteme')` |

#### 3.3.12 Combinaisons (5 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-46 | Breadcrumb minimal (2 niveaux) | — | 2 `<li>`, 1 SVG |
| T-47 | Breadcrumb profond (4 niveaux) | CL-07 | 4 labels presents |
| T-48 | JSON-LD correct pour un breadcrumb profond | — | 4 elements, dernier sans `item` |
| T-49 | Classe personnalisee + items manuels | CL-03 | combinaison correcte |
| T-50 | `noJsonLd` + items manuels | — | nav present, pas de JSON-LD |

---

### 3.4 TableOfContents — Inventaire des tests (50 tests)

#### 3.4.1 Helper de rendu et fixtures

```typescript
const SAMPLE_HEADINGS = [
  { depth: 2, text: 'Vision', slug: 'vision' },
  { depth: 3, text: 'Principes fondateurs', slug: 'principes-fondateurs' },
  { depth: 3, text: 'Valeurs cles', slug: 'valeurs-cles' },
  { depth: 2, text: 'Philosophie', slug: 'philosophie' },
  { depth: 3, text: 'Approche iterative', slug: 'approche-iterative' },
  { depth: 4, text: 'Boucle de feedback', slug: 'boucle-de-feedback' },
]

const H2_ONLY_HEADINGS = [
  { depth: 2, text: 'Introduction', slug: 'introduction' },
  { depth: 2, text: 'Methodologie', slug: 'methodologie' },
  { depth: 2, text: 'Conclusion', slug: 'conclusion' },
]

async function renderTOC(props: Record<string, unknown> = {}) {
  const container = await AstroContainer.create()
  return container.renderToString(TableOfContents, {
    props: { headings: SAMPLE_HEADINGS, ...props },
  })
}
```

#### 3.4.2 Rendu conditionnel (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-01 | Ne rend rien quand `headings` est vide | CL-01 | `not.toContain('<nav')` |
| T-02 | Ne rend rien quand aucun heading h2-h4 apres filtrage | CL-02 | `not.toContain('<nav')` |
| T-03 | Rend le composant quand il y a des headings valides | — | `toContain('data-toc')` |

#### 3.4.3 Structure HTML (5 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-04 | `<nav>` avec `aria-label="Table des matieres"` | — | `toContain('aria-label="Table des matieres"')` |
| T-05 | Contient une liste `<ul>` | — | `toContain('<ul')` |
| T-06 | Contient un lien `<a>` pour chaque heading | — | `toContain('href="#vision"')`, etc. |
| T-07 | Chaque lien a `data-toc-link` avec le slug | — | `toContain('data-toc-link="vision"')` |
| T-08 | Affiche le texte de chaque heading | — | `toContain('Vision')`, `toContain('Philosophie')` |

#### 3.4.4 Titre (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-09 | Affiche le titre par defaut "Sur cette page" | CL-19 | `toContain('Sur cette page')` |
| T-10 | Affiche un titre personnalise | CL-19 | `toContain('Sommaire')` |
| T-11 | Le titre a le style `uppercase` | — | `toContain('uppercase')`, `toContain('tracking-wider')` |

#### 3.4.5 Indentation par profondeur (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-12 | h2 a l'indentation `pl-0` | CL-03 | `toContain('pl-0')` |
| T-13 | h3 a l'indentation `pl-4` | — | `toContain('pl-4')` |
| T-14 | h4 a l'indentation `pl-8` | — | `toContain('pl-8')` |

#### 3.4.6 Styles par profondeur (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-15 | h2 a le style `text-sm font-medium text-gray-700` | — | `toContain('font-medium')`, `toContain('text-gray-700')` |
| T-16 | h3 a le style `text-gray-600` | — | `toContain('text-gray-600')` |
| T-17 | h4 a le style `text-xs text-gray-500` | — | `toContain('text-xs')`, `toContain('text-gray-500')` |

#### 3.4.7 Positionnement (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-18 | Le container desktop est sticky | — | `toContain('sticky')`, `toContain('top-24')` |
| T-19 | Le container desktop a max-height et overflow | CL-21 | `toContain('max-h-[calc(100vh-8rem)]')`, `toContain('overflow-y-auto')` |
| T-20 | Le container desktop est cache en mobile (`hidden lg:block`) | — | `toContain('hidden lg:block')` |

#### 3.4.8 Mobile (7 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-21 | Le container mobile est visible sous lg (`lg:hidden`) | CL-17 | `toContain('lg:hidden')` |
| T-22 | Le bouton toggle a `aria-expanded="false"` par defaut | CL-10 | `toContain('aria-expanded="false"')` |
| T-23 | Le bouton toggle a `aria-controls="toc-mobile-list"` | — | `toContain('aria-controls="toc-mobile-list"')` |
| T-24 | La liste mobile a l'attribut `hidden` par defaut | CL-10 | `toMatch(/id="toc-mobile-list"[^>]*hidden/)` |
| T-25 | Le bouton toggle a `data-toc-toggle` | — | `toContain('data-toc-toggle')` |
| T-26 | Le chevron a `data-toc-chevron` | — | `toContain('data-toc-chevron')` |
| T-27 | Le bouton toggle affiche le titre | — | contient "Sur cette page" dans la section mobile |

#### 3.4.9 Filtrage des profondeurs (5 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-28 | `maxDepth=3` exclut les h4 | — | `not.toContain('Boucle de feedback')` |
| T-29 | `maxDepth=2` ne garde que les h2 | — | `not.toContain('Principes fondateurs')` |
| T-30 | `minDepth=3` exclut les h2 | CL-04 | `not.toContain('>Vision<')` |
| T-31 | `minDepth > maxDepth` ne rend rien | CL-18 | `not.toContain('<nav')` |
| T-32 | Les headings h1 sont toujours exclus | — | `not.toContain('Titre H1')` |

#### 3.4.10 Accessibilite (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-33 | Le nav a `aria-label="Table des matieres"` | — | `toContain('aria-label="Table des matieres"')` |
| T-34 | Les liens ont un focus ring | — | `toContain('focus:ring-2')` |
| T-35 | La bordure gauche de guidage est presente | — | `toContain('border-l')`, `toContain('border-gray-200')` |
| T-36 | Chaque item est dans un `<li>` | — | `liCount === SAMPLE_HEADINGS.length * 2` (desktop + mobile) |

#### 3.4.11 Classes et attributs (5 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-37 | Classe personnalisee ajoutee au nav | CL-20 | `toContain('my-custom-class')` |
| T-38 | `data-toc` present sur le nav | — | `toContain('data-toc')` |
| T-39 | `data-toc-list` present sur la liste desktop | — | `toContain('data-toc-list')` |
| T-40 | `transition-colors` presente sur les liens | — | `toContain('transition-colors')` |
| T-41 | Les liens ont `border-transparent` par defaut | — | `toContain('border-transparent')` |

#### 3.4.12 Protection XSS (2 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-42 | Heading avec HTML est echappe | CL-07 | `not.toContain('<script>alert')` |
| T-43 | Heading avec accents et caracteres speciaux | — | `toContain('Ecosysteme')` |

#### 3.4.13 Script client (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-44 | Le script est present dans le rendu | CL-09 | `toContain('<script>')`, `toContain('initTableOfContents')` |
| T-45 | Le script reference `IntersectionObserver` | — | `toContain('IntersectionObserver')` |
| T-46 | Le script reference `scrollIntoView` | — | `toContain('scrollIntoView')` |
| T-47 | Le script gere le toggle mobile | — | `toContain('data-toc-toggle')`, `toContain('aria-expanded')` |

#### 3.4.14 Combinaisons (3 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-48 | Uniquement des h2 rend sans indentation | CL-03 | `toContain('pl-0')`, `not.toContain('pl-4')` |
| T-49 | Titre personnalise apparait dans desktop et mobile | — | occurrences >= 2 |
| T-50 | Le nombre de liens correspond au nombre de headings filtres | — | `linkCount === SAMPLE_HEADINGS.length * 2` |

---

### 3.5 PrevNextLinks — Inventaire des tests (50 tests)

#### 3.5.1 Helper de rendu et fixtures

```typescript
const BOTH_LINKS = {
  prev: { label: 'Ecosysteme', href: '/framework/ecosysteme', section: 'framework' },
  next: { label: 'Boucles Iteratives', href: '/framework/boucles-iteratives', section: 'framework' },
}

const CROSS_SECTION_LINKS = {
  prev: { label: 'Metriques', href: '/framework/metriques', section: 'framework' },
  next: { label: 'Preambule', href: '/mode-operatoire/preambule', section: 'mode-operatoire' },
}

const PREV_ONLY = {
  prev: { label: 'I3 - Bibliographie', href: '/annexes/ressources/bibliographie', section: 'annexes' },
  next: null,
}

const NEXT_ONLY = {
  prev: null,
  next: { label: 'Vision & Philosophie', href: '/framework/vision-philosophie', section: 'framework' },
}

const NO_LINKS = { prev: null, next: null }

const NO_SECTION_LINKS = {
  prev: { label: 'Page A', href: '/page-a' },
  next: { label: 'Page B', href: '/page-b' },
}

async function renderPrevNext(
  props: Record<string, unknown> = {},
  currentPath: string = '/framework/artefacts',
) {
  const container = await AstroContainer.create()
  return container.renderToString(PrevNextLinks, {
    props: { links: BOTH_LINKS, ...props },
    request: new Request(`https://aiad.dev${currentPath}`),
  })
}
```

#### 3.5.2 Rendu conditionnel (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-01 | Rend le composant quand les deux liens sont presents | CL-01 | `toContain('data-prev-next')` |
| T-02 | Rend le composant quand seul `prev` est present | CL-03 | prev present, next absent |
| T-03 | Rend le composant quand seul `next` est present | CL-02 | next present, prev absent |
| T-04 | Ne rend rien quand prev et next sont null | CL-04 | `not.toContain('<nav')` |

#### 3.5.3 Structure HTML (6 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-05 | `<nav>` avec `aria-label="Navigation entre les pages"` | — | `toContain('aria-label="Navigation entre les pages"')` |
| T-06 | Lien `<a>` pour le precedent avec href | — | `toContain('href="/framework/ecosysteme"')` |
| T-07 | Lien `<a>` pour le suivant avec href | — | `toContain('href="/framework/boucles-iteratives"')` |
| T-08 | Le lien precedent affiche le titre de la page | — | `toContain('Ecosysteme')` |
| T-09 | Le lien suivant affiche le titre de la page | — | `toContain('Boucles Iteratives')` |
| T-10 | Les labels de direction "Precedent" et "Suivant" sont presents | — | `toContain('Precedent')`, `toContain('Suivant')` |

#### 3.5.4 Fleches SVG (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-11 | Fleche gauche (chevron gauche) pour le precedent | — | `toContain('M15 19l-7-7 7-7')` |
| T-12 | Fleche droite (chevron droit) pour le suivant | — | `toContain('M9 5l7 7-7 7')` |
| T-13 | Les fleches ont `aria-hidden="true"` | CL-19 | tous les SVG avec `aria-hidden` |
| T-14 | Les fleches ont la bonne taille (`h-5 w-5`) | — | `toContain('h-5 w-5')` |

#### 3.5.5 Accessibilite (4 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-15 | Le nav a `aria-label="Navigation entre les pages"` | — | `toContain(...)` |
| T-16 | Le lien precedent a un `aria-label` descriptif | CL-14 | `toContain('aria-label="Precedent : Ecosysteme"')` |
| T-17 | Le lien suivant a un `aria-label` descriptif | CL-14 | `toContain('aria-label="Suivant : Boucles Iteratives"')` |
| T-18 | Les liens ont un focus ring | — | `toContain('focus:ring-2')` |

#### 3.5.6 Indicateur cross-section (5 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-19 | Pas d'indicateur quand meme section | CL-07 | `not.toContain('data-prev-next-prev-section')` |
| T-20 | Indicateur affiche quand cross-section sur next | CL-06 | `toContain('data-prev-next-next-section')` |
| T-21 | Pas d'indicateur sur prev quand meme section | — | `not.toContain('data-prev-next-prev-section')` |
| T-22 | Indicateur affiche le label francais de la section | — | contenu du span section |
| T-23 | Pas d'indicateur quand le lien n'a pas de section | CL-09, CL-10 | pas de `data-*-section` |

#### 3.5.7 Responsive (5 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-24 | Label complet "Precedent" visible sur desktop (`hidden md:inline`) | CL-20 | `toContain('hidden md:inline')` |
| T-25 | Label abrege "Prec." visible sur mobile (`md:hidden`) | CL-20 | `toContain('Prec.')` |
| T-26 | Label complet "Suivant" visible sur desktop | — | `toContain('Suivant')` |
| T-27 | Label abrege "Suiv." visible sur mobile | — | `toContain('Suiv.')` |
| T-28 | Layout `flex-col` sur mobile, `flex-row` sur desktop | — | `toContain('flex-col')`, `toContain('md:flex-row')` |

#### 3.5.8 Styles (8 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-29 | Bordure superieure de separation | — | `toContain('border-t')` |
| T-30 | Les liens ont une bordure et des coins arrondis | — | `toContain('rounded-lg')` |
| T-31 | Hover change la bordure et le fond | — | `toContain('hover:border-blue-300')` |
| T-32 | Hover change la couleur du titre | — | `toContain('group-hover:text-blue-700')` |
| T-33 | Hover change la couleur de la fleche | — | `toContain('group-hover:text-blue-600')` |
| T-34 | Transitions presentes | — | `toContain('transition-colors')` |
| T-35 | Les titres ont `truncate` pour les labels longs | CL-08 | `toContain('truncate')` |
| T-36 | Labels de direction sont uppercase | — | `toContain('uppercase')` |

#### 3.5.9 Classes et attributs (6 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-37 | Classe personnalisee ajoutee au nav | CL-18 | `toContain('my-custom-class')` |
| T-38 | `data-prev-next` present sur le nav | — | `toContain('data-prev-next')` |
| T-39 | `data-prev-next-prev` present sur le lien precedent | — | `toContain('data-prev-next-prev')` |
| T-40 | `data-prev-next-next` present sur le lien suivant | — | `toContain('data-prev-next-next')` |
| T-41 | `data-prev-next-prev-title` present | — | `toContain('data-prev-next-prev-title')` |
| T-42 | `data-prev-next-next-title` present | — | `toContain('data-prev-next-next-title')` |

#### 3.5.10 Protection XSS (2 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-43 | Label avec HTML est echappe | CL-13 | `not.toContain('<script>alert')` |
| T-44 | Label avec accents et caracteres speciaux | — | `toContain('Ecosysteme')` |

#### 3.5.11 Combinaisons (6 tests)

| # | Test | CL | Assertion |
|---|------|----|-----------|
| T-45 | Prev seulement — placeholder droit present sur desktop | CL-16 | `toContain('hidden md:block')` |
| T-46 | Next seulement — lien aligne a droite via `ml-auto` | CL-17 | `toContain('md:ml-auto')` |
| T-47 | Classe personnalisee + liens manuels | CL-05 | combinaison correcte |
| T-48 | Liens sans section definie — pas d'indicateur | CL-23 | pas de `data-*-section` |
| T-49 | Cross-section complet — indicateurs sur les deux liens | CL-24, CL-25 | indicateurs presents |
| T-50 | `aria-label` adapte au contenu de chaque lien | — | `toContain('Precedent : Metriques')` |

---

## 4. Cas limites et gestion d'erreurs

### 4.1 Cartographie des 97 cas limites couverts

#### NavLink (25 cas limites)

| CL | Description | Test(s) |
|----|-------------|---------|
| CL-01 | Page courante correspond exactement au `href` | T-05 |
| CL-02 | Page courante ne correspond pas au `href` | T-06 |
| CL-03 | `activeMatch="prefix"` avec URL enfant | T-07 |
| CL-04 | `activeMatch="prefix"` avec URL sans lien | T-09 |
| CL-05 | `activeMatch="prefix"` sur `/` (racine) | Non teste (a eviter par design) |
| CL-06 | `href` avec trailing slash | T-12 |
| CL-07 | URL courante avec trailing slash | T-13 |
| CL-08 | `href="/"` (page d'accueil) | T-14 |
| CL-09 | `isActive` force a `true` | T-10 |
| CL-10 | `isActive` force a `false` | T-11 |
| CL-11 | `badge` non fourni | T-22 |
| CL-12 | `badge="new"` | T-23 |
| CL-13 | `badge="essential"` | T-24 |
| CL-14 | `hasChildren=true` | T-27 |
| CL-15 | `hasChildren=false` (defaut) | T-26 |
| CL-16 | `badge` + `hasChildren` combines | T-39 |
| CL-17 | `label` tres long (>50 car.) | Couvert par `truncate` dans T-03 |
| CL-18 | `label` avec caracteres speciaux | T-37, T-38 |
| CL-19 | `class` personnalise fourni | T-29 |
| CL-20 | `variant` non fourni → `sidebar` par defaut | T-15 |
| CL-21 | `role="menuitem"` fourni | T-34 |
| CL-22 | `tabindex={-1}` fourni | T-35 |
| CL-23 | `section` fourni | T-31 |
| CL-24 | `section` non fourni | T-32 |
| CL-25 | `id` fourni | T-33 |

#### Breadcrumb (25 cas limites)

| CL | Description | Test(s) |
|----|-------------|---------|
| CL-01 | Chemin trouve dans l'arbre (cas nominal) | T-01 |
| CL-02 | `getBreadcrumbs()` retourne `null` | T-03 |
| CL-03 | `items` fournis manuellement | T-49 |
| CL-04 | `items` est un tableau vide | T-02 |
| CL-05 | Page Framework simple (3 niveaux) | T-06 |
| CL-06 | Page Mode Operatoire (3 niveaux) | Couvert par fixture |
| CL-07 | Page Annexe avec categorie (4 niveaux) | T-47 |
| CL-08 | Mobile avec <= 3 niveaux | T-17 |
| CL-09 | Mobile avec > 3 niveaux | T-18 |
| CL-10 | URL avec trailing slash | Normalise par `getBreadcrumbs()` |
| CL-11 | Dernier element non cliquable, `aria-current="page"` | T-08, T-14 |
| CL-12 | Separateur SVG `aria-hidden="true"` | T-12 |
| CL-13 | Label avec caracteres speciaux | T-44, T-45 |
| CL-14 | Label tres long | Couvert par `truncate` |
| CL-15 | JSON-LD : dernier item sans propriete `item` | T-28 |
| CL-16 | JSON-LD : URLs absolues | T-29, T-31 |
| CL-17 | `noJsonLd={true}` | T-30 |
| CL-18 | `Astro.site` non configure | Fallback sur `Astro.url.origin` |
| CL-19 | `class` personnalise fourni | T-40 |
| CL-20 | Page d'accueil (`/`) | `getBreadcrumbs()` retourne `null` |
| CL-21 | Un seul element dans le breadcrumb | T-46 (2 niveaux) |
| CL-22 | JSON-LD : caracteres speciaux | Echappe par `JSON.stringify()` |
| CL-23 | Navigation clavier : Tab traverse les liens | T-33 (focus ring) |
| CL-24 | Ellipsis mobile `aria-hidden="true"` | T-21 |
| CL-25 | `siteUrl` fourni manuellement | Non teste (basse priorite) |

#### TableOfContents (22 cas limites)

| CL | Description | Test(s) |
|----|-------------|---------|
| CL-01 | `headings` est un tableau vide | T-01 |
| CL-02 | Aucun heading h2-h4 apres filtrage | T-02 |
| CL-03 | Uniquement des h2 | T-48 |
| CL-04 | Uniquement des h3 et h4 (pas de h2) | T-30 |
| CL-05 | H4 sans h3 parent (saut de niveau) | Couvert par `SAMPLE_HEADINGS` |
| CL-06 | Heading avec texte tres long | Couvert par largeur fixe du container |
| CL-07 | Heading avec caracteres speciaux | T-42, T-43 |
| CL-08 | Heading avec slug special | Safe par construction Astro |
| CL-09 | Page sans JavaScript (progressive enhancement) | T-06 (liens `href="#slug"`) |
| CL-10 | Toggle mobile : clic quand ferme | T-22, T-24 (etat initial) |
| CL-11 | Toggle mobile : clic quand ouvert | Script JS — hors scope unitaire |
| CL-12 | Clic sur un item mobile | Script JS — hors scope unitaire |
| CL-13 | Scroll spy : premier heading visible | Script JS — hors scope unitaire |
| CL-14 | Scroll spy : dernier heading visible | Script JS — hors scope unitaire |
| CL-15 | Scroll spy : aucun heading visible | Script JS — hors scope unitaire |
| CL-16 | Heading cible introuvable dans le DOM | Script JS — hors scope unitaire |
| CL-17 | Redimensionnement fenetre | CSS responsive — T-20, T-21 |
| CL-18 | `minDepth` > `maxDepth` | T-31 |
| CL-19 | `title` personnalise | T-10 |
| CL-20 | `class` personnalise | T-37 |
| CL-21 | Tres grand nombre de headings | T-19 (`overflow-y-auto`) |
| CL-22 | Heading avec le meme slug (doublon) | Non teste (basse priorite) |

#### PrevNextLinks (25 cas limites)

| CL | Description | Test(s) |
|----|-------------|---------|
| CL-01 | Page au milieu d'une section (cas nominal) | T-01 |
| CL-02 | Premiere page du site (`prev: null`) | T-03 |
| CL-03 | Derniere page du site (`next: null`) | T-02 |
| CL-04 | `{ prev: null, next: null }` | T-04 |
| CL-05 | `links` fournis manuellement | T-47 |
| CL-06 | Navigation cross-section (FW → MO) | T-20 |
| CL-07 | Navigation intra-section (FW → FW) | T-19 |
| CL-08 | Titre de page tres long | T-35 (`truncate`) |
| CL-09 | Lien prev sans section definie | T-23 |
| CL-10 | Lien next sans section definie | T-23 |
| CL-11 | URL avec trailing slash | Normalise par `getPrevNext()` |
| CL-12 | Chemin introuvable dans l'arbre | T-04 |
| CL-13 | Label avec caracteres speciaux | T-43, T-44 |
| CL-14 | `aria-label` contient le titre complet | T-16, T-17 |
| CL-15 | Navigation clavier : Tab entre les deux liens | T-18 (focus ring) |
| CL-16 | Un seul lien : prev seulement | T-45 |
| CL-17 | Un seul lien : next seulement | T-46 |
| CL-18 | `class` personnalise fourni | T-37 |
| CL-19 | Fleches SVG `aria-hidden="true"` | T-13 |
| CL-20 | Mobile : labels abreges "Prec." / "Suiv." | T-25, T-27 |
| CL-21 | Page d'accueil (`/`) | `getCurrentSection()` retourne `null` |
| CL-22 | `links` avec les deux `null` | T-04 |
| CL-23 | Section identique mais undefined | T-48 |
| CL-24 | Transition MO → Annexes | T-49 |
| CL-25 | Transition Annexes → MO (retour) | T-49 |

---

## 5. Exemples entree/sortie

### 5.1 NavLink — Lien actif sidebar

**Entree :**
```typescript
await renderNavLink(
  { href: '/framework/preambule', variant: 'sidebar' },
  '/framework/preambule',
)
```

**Assertion :**
```typescript
expect(html).toContain('aria-current="page"')
expect(html).toContain('bg-blue-50')
expect(html).toContain('border-l-2')
expect(html).toContain('border-blue-600')
```

### 5.2 Breadcrumb — 4 niveaux avec troncature mobile

**Entree :**
```typescript
await renderBreadcrumb({ items: DEEP_BREADCRUMBS })
```

**Assertions :**
```typescript
expect(html).toContain('data-breadcrumb-ellipsis')  // Ellipsis mobile
expect(html).toContain('hidden md:inline-flex')       // Items intermediaires masques
expect(html).toContain('Accueil')                     // Premier visible
expect(html).toContain('A1 - PRD')                    // Dernier visible
```

### 5.3 TableOfContents — Filtrage maxDepth=3

**Entree :**
```typescript
await renderTOC({ maxDepth: 3 })
```

**Assertions :**
```typescript
expect(html).toContain('Vision')                      // h2 inclus
expect(html).toContain('Principes fondateurs')        // h3 inclus
expect(html).not.toContain('Boucle de feedback')      // h4 exclu
```

### 5.4 PrevNextLinks — Cross-section

**Entree :**
```typescript
await renderPrevNext(
  { links: CROSS_SECTION_LINKS },
  '/framework/annexes',
)
```

**Assertions :**
```typescript
expect(html).toContain('data-prev-next-next-section')   // Indicateur section
expect(html).not.toContain('data-prev-next-prev-section') // Meme section
expect(html).toContain('Preambule')                      // Titre next
```

### 5.5 Protection XSS — Toutes les composants

**Entree (NavLink) :**
```typescript
await renderNavLink({ label: '<script>alert("xss")</script>' })
```

**Assertion :**
```typescript
expect(html).not.toContain('<script>alert')
expect(html).toContain('&lt;script&gt;')
```

---

## 6. Tests

### 6.1 Fichiers de test

| Fichier | Composant | Nb tests |
|---------|-----------|----------|
| `tests/unit/components/layout/nav-link.test.ts` | NavLink | 40 |
| `tests/unit/components/layout/breadcrumb.test.ts` | Breadcrumb | 50 |
| `tests/unit/components/layout/table-of-contents.test.ts` | TableOfContents | 50 |
| `tests/unit/components/layout/prev-next-links.test.ts` | PrevNextLinks | 50 |
| **Total** | | **~190** |

### 6.2 Comptage par categorie

| Categorie | NavLink | Breadcrumb | TOC | PrevNext | Total |
|-----------|---------|------------|-----|----------|-------|
| Rendu conditionnel | — | 3 | 3 | 4 | 10 |
| Structure HTML | 4 | 6 | 5 | 6 | 21 |
| Etat actif / courant | 7 | 3 | — | — | 10 |
| Trailing slash | 3 | — | — | — | 3 |
| Variantes / direction | 7 | — | — | 5 | 12 |
| Badge | 4 | — | — | — | 4 |
| Chevron / fleches | 3 | — | — | 4 | 7 |
| Separateur | — | 4 | — | — | 4 |
| Troncature mobile | — | 7 | — | — | 7 |
| JSON-LD | — | 8 | — | — | 8 |
| Titre | — | — | 3 | — | 3 |
| Indentation | — | — | 3 | — | 3 |
| Styles par profondeur | — | — | 3 | — | 3 |
| Positionnement | — | — | 3 | — | 3 |
| Mobile toggle | — | — | 7 | — | 7 |
| Filtrage profondeurs | — | — | 5 | — | 5 |
| Cross-section | — | — | — | 5 | 5 |
| Responsive | — | — | — | 5 | 5 |
| Accessibilite | — | 3 | 4 | 4 | 11 |
| Styles | — | 5 | 5 | 8 | 18 |
| Classes et attributs | 8 | 4 | 5 | 6 | 23 |
| Protection XSS | 2 | 2 | 2 | 2 | 8 |
| Script client | — | — | 4 | — | 4 |
| Combinaisons | 2 | 5 | 3 | 6 | 16 |
| **Total** | **40** | **50** | **50** | **50** | **~190** |

### 6.3 Matrice de couverture par composant

| Composant | Cas nominal | Cas limites | Accessibilite | XSS | Styles | Nb tests | Couverture |
|-----------|-------------|-------------|---------------|-----|--------|----------|------------|
| NavLink | ✅ 4 variantes, etat actif, prefix/exact | ✅ trailing slash, isActive, badges, chevron | ✅ aria-current, focus ring, role, tabindex | ✅ echappement | ✅ par variante | 40 | 100% |
| Breadcrumb | ✅ 3 profondeurs, JSON-LD, separateurs | ✅ vide, null, troncature mobile, noJsonLd | ✅ aria-label, aria-current, ol, aria-hidden | ✅ echappement | ✅ couleurs, hover | 50 | 100% |
| TableOfContents | ✅ h2-h4, sticky, mobile toggle | ✅ vide, filtrage, minDepth > maxDepth, h1 exclus | ✅ aria-label, aria-expanded, aria-controls | ✅ echappement | ✅ par profondeur | 50 | 100% |
| PrevNextLinks | ✅ prev+next, prev only, next only | ✅ aucun lien, cross-section, sans section | ✅ aria-label, aria-hidden, focus ring | ✅ echappement | ✅ hover, responsive | 50 | 100% |

### 6.4 Commandes de test

```bash
# Executer tous les tests de cette tache
pnpm test:unit -- components/layout

# Executer un seul fichier
pnpm test:unit -- components/layout/nav-link
pnpm test:unit -- components/layout/breadcrumb
pnpm test:unit -- components/layout/table-of-contents
pnpm test:unit -- components/layout/prev-next-links

# Avec couverture
pnpm test:unit -- components/layout --coverage

# Mode watch
pnpm test:unit -- components/layout --watch

# Verification TypeScript
pnpm typecheck
```

---

## 7. Criteres d'acceptation

### 7.1 Globaux

- [ ] **CA-01** : Les 4 fichiers de test sont crees dans `tests/unit/components/layout/`
- [ ] **CA-02** : ~190 tests ecrits et passants
- [ ] **CA-03** : Les 97 cas limites documentes dans les specs des 4 composants sont couverts
- [ ] **CA-04** : Tous les tests passent (`pnpm test:unit -- components/layout`)
- [ ] **CA-05** : TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] **CA-06** : ESLint passe sans warning (`pnpm lint`)

### 7.2 NavLink (40 tests)

- [ ] **CA-07** : Structure HTML : `<a>`, href, label dans `<span class="truncate">`, `data-navlink`
- [ ] **CA-08** : Etat actif : `aria-current="page"` en exact et prefix, `isActive` force
- [ ] **CA-09** : Trailing slash : normalisation href et URL courante, racine `/` preservee
- [ ] **CA-10** : 4 variantes (header, sidebar, dropdown, mobile) avec styles differencies
- [ ] **CA-11** : Badges "Nouveau" (vert) et "Essentiel" (ambre) affiches correctement
- [ ] **CA-12** : Chevron affiche quand `hasChildren=true`, absent par defaut
- [ ] **CA-13** : Props HTML (`class`, `id`, `role`, `tabindex`) transmises au `<a>`
- [ ] **CA-14** : Protection XSS par echappement Astro

### 7.3 Breadcrumb (50 tests)

- [ ] **CA-15** : Rendu conditionnel : rien si items null/vide
- [ ] **CA-16** : Structure semantique `<nav>` > `<ol>` > `<li>`, dernier element `<span aria-current="page">`
- [ ] **CA-17** : Separateurs SVG chevron avec `aria-hidden="true"`
- [ ] **CA-18** : Troncature mobile : items intermediaires masques quand > 3 niveaux, ellipsis `...`
- [ ] **CA-19** : JSON-LD `schema.org/BreadcrumbList` : positions 1-based, URLs absolues, dernier sans `item`
- [ ] **CA-20** : `noJsonLd=true` desactive le JSON-LD
- [ ] **CA-21** : Focus ring, couleurs, transitions, classes personnalisees, data attributes

### 7.4 TableOfContents (50 tests)

- [ ] **CA-22** : Rendu conditionnel : rien si headings vide ou pas de h2-h4
- [ ] **CA-23** : Liens d'ancrage `<a href="#slug">` pour chaque heading filtre
- [ ] **CA-24** : Indentation hierarchique correcte (h2=`pl-0`, h3=`pl-4`, h4=`pl-8`)
- [ ] **CA-25** : Filtrage par `minDepth`/`maxDepth`, h1 toujours exclus
- [ ] **CA-26** : Positionnement sticky desktop (`sticky top-24`, `overflow-y-auto`)
- [ ] **CA-27** : Mobile toggle : `aria-expanded="false"`, `aria-controls`, `hidden`, `data-toc-toggle`
- [ ] **CA-28** : Script client present avec `IntersectionObserver`, `scrollIntoView`, toggle mobile

### 7.5 PrevNextLinks (50 tests)

- [ ] **CA-29** : Rendu conditionnel : rien si prev et next sont null
- [ ] **CA-30** : Liens prev/next avec fleches SVG, labels "Precedent"/"Suivant", titres de page
- [ ] **CA-31** : `aria-label` descriptif sur chaque lien ("Precedent : {titre}" / "Suivant : {titre}")
- [ ] **CA-32** : Indicateur cross-section avec label francais, absent si meme section
- [ ] **CA-33** : Responsive : labels abreges "Prec."/"Suiv." mobile, layout empile/cote a cote
- [ ] **CA-34** : Gestion prev seul / next seul avec placeholder et alignement `ml-auto`
- [ ] **CA-35** : Fleches SVG `aria-hidden="true"`, focus ring, hover styles

---

## 8. Definition of Done

- [ ] 4 fichiers de test crees :
  - `tests/unit/components/layout/nav-link.test.ts` (40 tests)
  - `tests/unit/components/layout/breadcrumb.test.ts` (50 tests)
  - `tests/unit/components/layout/table-of-contents.test.ts` (50 tests)
  - `tests/unit/components/layout/prev-next-links.test.ts` (50 tests)
- [ ] ~190 tests ecrits et passants
- [ ] 97 cas limites des specs composants couverts
- [ ] Chaque composant teste a 100% de couverture sur les branches HTML
- [ ] Accessibilite ARIA verifiee pour chaque composant
- [ ] Protection XSS verifiee pour chaque composant
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Tests executables en isolation (`pnpm test:unit -- components/layout`)

---

## 9. References

| Document | Lien |
|----------|------|
| User Story US-004 | [spec-US-004.md](./spec-US-004.md) |
| NavLink (T-004-F2) | [T-004-F2-composant-NavLink.md](./T-004-F2-composant-NavLink.md) |
| Breadcrumb (T-004-F6) | [T-004-F6-composant-Breadcrumb.md](./T-004-F6-composant-Breadcrumb.md) |
| TableOfContents (T-004-F7) | [T-004-F7-composant-TableOfContents.md](./T-004-F7-composant-TableOfContents.md) |
| PrevNextLinks (T-004-F8) | [T-004-F8-composant-PrevNextLinks.md](./T-004-F8-composant-PrevNextLinks.md) |
| Types TypeScript navigation (T-004-B1) | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| Helpers navigation (T-004-B4) | [T-004-B4-helpers-navigation.md](./T-004-B4-helpers-navigation.md) |
| Tests schemas Zod (T-004-T1) | [T-004-T1-tests-schemas-zod-navigation.md](./T-004-T1-tests-schemas-zod-navigation.md) |
| Tests helpers (T-004-T2) | [T-004-T2-tests-helpers-navigation.md](./T-004-T2-tests-helpers-navigation.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Astro Container API | https://docs.astro.build/en/reference/container-reference/ |
| WAI-ARIA Breadcrumb | https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/ |
| WAI-ARIA aria-current | https://www.w3.org/TR/wai-aria-1.1/#aria-current |
| RGAA 12.2 Navigation | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.2 |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 16/02/2026 | Creation initiale : 4 fichiers de test, ~190 tests, 97 cas limites, 35 criteres d'acceptation |
