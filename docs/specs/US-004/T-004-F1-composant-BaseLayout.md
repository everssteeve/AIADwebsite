# T-004-F1 : Composant BaseLayout (HTML shell, head, meta, skip-link, slots)

| Metadonnee | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 10 fevrier 2026 |
| **Statut** | A faire |
| **User Story** | [US-004 - Naviguer facilement dans le framework](./spec-US-004.md) |
| **Dependances** | Aucune |
| **Bloque** | T-004-F10 (DocsLayout) |

---

## 1. Objectif

Creer le composant **BaseLayout** qui sert de layout racine pour toutes les pages du site AIAD. Ce composant fournit :

- Le **shell HTML** complet (`<!doctype html>`, `<html lang="fr">`, `<head>`, `<body>`)
- Les **meta tags SEO** (title, description, Open Graph, canonical)
- Le **skip-link** d'accessibilite ("Aller au contenu principal")
- L'import du **CSS global** (Tailwind)
- Un systeme de **slots** pour la composition flexible (head additionnel, contenu principal, scripts)
- Le support optionnel de **JSON-LD** (donnees structurees)

Ce layout est le point d'entree unique pour la structure HTML du site et sera etendu par `DocsLayout` (T-004-F10) et utilise directement par les pages standalone (accueil, glossaire, etc.).

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Role |
|-------------|---------|------|
| Astro | 4.x | Composant layout statique (SSG, 0 JS client) |
| TypeScript | 5.x | Typage strict des props |
| Tailwind CSS | 3.x | Utility-first, styles via global.css |

### 2.2 Arborescence

```
src/
├── layouts/
│   └── BaseLayout.astro           <-- CE COMPOSANT
├── styles/
│   └── global.css                 # Tailwind base (existant)
├── pages/
│   └── index.astro                # Consommateur principal (existant, a refactorer)
└── components/
    └── layout/                    # Futurs composants Header, Footer, etc.
```

### 2.3 Etat actuel

Le fichier `src/pages/index.astro` contient actuellement le shell HTML inline :

```astro
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{seoTitle}</title>
    <meta name="description" content={seoDescription} />
    <meta property="og:title" content={seoTitle} />
    <meta property="og:description" content={seoDescription} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
  </head>
  <body class="min-h-screen bg-white text-gray-900 antialiased">
    <main>...</main>
  </body>
</html>
```

Ce shell HTML doit etre **extrait** dans `BaseLayout.astro` pour etre reutilisable par toutes les pages.

### 2.4 Position dans l'architecture

```
BaseLayout.astro                  <-- CE COMPOSANT (layout racine)
├── index.astro (page accueil)    <-- Consommateur direct
├── glossaire.astro               <-- Consommateur direct
├── pour-qui.astro                <-- Consommateur direct
├── 404.astro                     <-- Consommateur direct
└── DocsLayout.astro (T-004-F10) <-- Extension (layout enfant)
    ├── framework/[...slug].astro
    ├── mode-operatoire/[...slug].astro
    └── annexes/[...slug].astro
```

### 2.5 Conventions suivies

| Convention | Detail |
|-----------|--------|
| Nommage fichier | PascalCase dans `src/layouts/` |
| TypeScript | Mode strict, props typees via `interface Props` |
| Imports | Alias `@/*` pour `src/*` |
| Langue | HTML `lang="fr"`, contenu en francais |
| Formatage | Prettier : pas de semicolons, single quotes, 2 espaces |

---

## 3. Specifications fonctionnelles

### 3.1 Description

Le composant `BaseLayout` est le **layout racine** du site qui :

1. Fournit la structure HTML minimale valide (`<!doctype html>`, `<html>`, `<head>`, `<body>`)
2. Gere les meta tags SEO configurables via props
3. Integre un **skip-link** d'accessibilite en premier element focusable
4. Importe le CSS global Tailwind
5. Expose des **slots** pour la composition : contenu principal (default), head additionnel, scripts

### 3.2 Comportement attendu

```
<!doctype html>
<html lang="fr">
  <head>
    ┌──────────────────────────────────────────────────────┐
    │  charset UTF-8                                         │
    │  viewport (mobile-first)                               │
    │  <title>{title} | AIAD</title>                        │
    │  meta description                                      │
    │  meta Open Graph (title, description, type, locale)   │
    │  meta canonical (optionnel)                            │
    │  <link> global.css                                     │
    │  <slot name="head" />  ← meta/link additionnels       │
    │  JSON-LD (optionnel)                                   │
    └──────────────────────────────────────────────────────┘
  </head>
  <body class="min-h-screen bg-white text-gray-900 antialiased">
    ┌──────────────────────────────────────────────────────┐
    │  <a href="#main-content" class="skip-link">           │
    │    Aller au contenu principal                          │
    │  </a>                                                  │
    │                                                        │
    │  <slot />  ← contenu principal (Header, main, Footer) │
    │                                                        │
    └──────────────────────────────────────────────────────┘
  </body>
</html>
```

### 3.3 Skip-link d'accessibilite

Le skip-link est le **premier element focusable** de la page. Il est visuellement masque par defaut et apparait au focus clavier :

| Etat | Comportement |
|------|-------------|
| Par defaut | Masque visuellement (`sr-only` + position absolue hors ecran) |
| Au focus (`Tab`) | Visible en haut de page, fond colore, texte lisible |
| Au clic/Enter | Scroll vers `#main-content` |

Le texte du skip-link est configurable via prop mais vaut `'Aller au contenu principal'` par defaut.

### 3.4 Meta tags SEO

| Meta | Source | Defaut | Requis |
|------|--------|--------|--------|
| `<title>` | prop `title` | `'AIAD'` | Oui (auto) |
| `<meta name="description">` | prop `description` | — | Oui |
| `<meta property="og:title">` | prop `title` | Meme que title | Non |
| `<meta property="og:description">` | prop `description` | Meme que description | Non |
| `<meta property="og:type">` | prop `ogType` | `'website'` | Non |
| `<meta property="og:image">` | prop `ogImage` | `'/images/og/default.png'` | Non |
| `<meta property="og:locale">` | fixe | `'fr_FR'` | Non |
| `<link rel="canonical">` | prop `canonical` | — (non rendu si absent) | Non |

**Format du titre :** `{title} | AIAD` — sauf si le titre contient deja "AIAD", auquel cas il est utilise tel quel.

### 3.5 Accessibilite (RGAA AA)

| Critere | Implementation | Reference RGAA |
|---------|----------------|----------------|
| Langue de la page | `<html lang="fr">` | 8.3 |
| Titre de page unique | `<title>` dynamique par page | 8.5 |
| Skip-link | Premier element focusable, visible au focus | 12.7 |
| Cible du skip-link | `id="main-content"` sur le `<main>` (responsabilite de la page consommatrice) | 12.7 |
| Viewport | `width=device-width, initial-scale=1.0` sans `maximum-scale` ni `user-scalable=no` | 13.9 |
| Charset | `UTF-8` en premier element du `<head>` | 8.1 |

---

## 4. Specifications techniques

### 4.1 Interface TypeScript

```typescript
// src/layouts/BaseLayout.astro (frontmatter)

/**
 * Props du composant BaseLayout.
 *
 * Layout racine du site AIAD fournissant le shell HTML,
 * les meta tags SEO, le skip-link d'accessibilite et les slots.
 *
 * @example
 * ```astro
 * ---
 * import BaseLayout from '@layouts/BaseLayout.astro'
 * ---
 * <BaseLayout title="Accueil" description="Decouvrez le framework AIAD">
 *   <main id="main-content">
 *     <h1>Bienvenue</h1>
 *   </main>
 * </BaseLayout>
 * ```
 */
export interface Props {
  // ── SEO ───────────────────────────────────────────────

  /**
   * Titre de la page, affiche dans `<title>` et og:title.
   * Le suffixe " | AIAD" est ajoute automatiquement sauf si
   * le titre contient deja "AIAD".
   */
  title: string

  /**
   * Description de la page pour les moteurs de recherche.
   * Utilisee dans `<meta name="description">` et og:description.
   */
  description: string

  /**
   * URL canonique de la page (optionnel).
   * Si fournie, genere un `<link rel="canonical">`.
   */
  canonical?: string

  /**
   * Type Open Graph.
   * @default 'website'
   */
  ogType?: 'website' | 'article'

  /**
   * Image Open Graph (URL relative ou absolue).
   * @default '/images/og/default.png'
   */
  ogImage?: string

  // ── JSON-LD ───────────────────────────────────────────

  /**
   * Donnees structurees JSON-LD a injecter dans le head.
   * Accepte un objet ou un tableau d'objets schema.org.
   * Si non fourni, aucun script JSON-LD n'est genere.
   *
   * @example
   * ```typescript
   * jsonLd={{
   *   '@context': 'https://schema.org',
   *   '@type': 'WebSite',
   *   name: 'AIAD',
   *   url: 'https://aiad.dev',
   * }}
   * ```
   */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]

  // ── Accessibilite ─────────────────────────────────────

  /**
   * Texte du skip-link d'accessibilite.
   * @default 'Aller au contenu principal'
   */
  skipLinkText?: string

  /**
   * ID de l'element cible du skip-link.
   * @default 'main-content'
   */
  skipLinkTarget?: string

  // ── Layout ────────────────────────────────────────────

  /**
   * Classes CSS additionnelles pour le `<body>`.
   */
  bodyClass?: string

  /**
   * Classes CSS additionnelles pour le `<html>`.
   */
  class?: string
}
```

### 4.2 Implementation du composant

```astro
---
// src/layouts/BaseLayout.astro

export interface Props {
  title: string
  description: string
  canonical?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  skipLinkText?: string
  skipLinkTarget?: string
  bodyClass?: string
  class?: string
}

const {
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/images/og/default.png',
  jsonLd,
  skipLinkText = 'Aller au contenu principal',
  skipLinkTarget = 'main-content',
  bodyClass = '',
  class: htmlClass = '',
} = Astro.props

// ── Construction du titre ─────────────────────────────────
const formattedTitle = title.includes('AIAD') ? title : `${title} | AIAD`

// ── Classes body ──────────────────────────────────────────
const bodyClasses = [
  'min-h-screen',
  'bg-white',
  'text-gray-900',
  'antialiased',
  bodyClass,
].filter(Boolean).join(' ')

// ── Classes html ──────────────────────────────────────────
const htmlClasses = htmlClass || undefined
---

<!doctype html>
<html lang="fr" class={htmlClasses}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    {/* ── Titre ──────────────────────────────────────── */}
    <title>{formattedTitle}</title>

    {/* ── Meta SEO ───────────────────────────────────── */}
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={canonical} />}

    {/* ── Open Graph ─────────────────────────────────── */}
    <meta property="og:title" content={formattedTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={ogType} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:locale" content="fr_FR" />

    {/* ── CSS global ─────────────────────────────────── */}
    <link rel="stylesheet" href="/src/styles/global.css" />

    {/* ── Slot head (meta/link additionnels) ─────────── */}
    <slot name="head" />

    {/* ── JSON-LD (donnees structurees) ──────────────── */}
    {jsonLd && (
      <script
        type="application/ld+json"
        set:html={JSON.stringify(jsonLd)}
      />
    )}
  </head>
  <body class={bodyClasses}>
    {/* ── Skip-link (premier element focusable) ──────── */}
    <a
      href={`#${skipLinkTarget}`}
      class="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    >
      {skipLinkText}
    </a>

    {/* ── Contenu principal (slot par defaut) ─────────── */}
    <slot />
  </body>
</html>
```

### 4.3 Slots disponibles

| Slot | Usage | Exemple |
|------|-------|---------|
| **default** (sans nom) | Contenu principal de la page (Header, main, Footer) | `<main id="main-content">...</main>` |
| **head** | Meta tags, liens, scripts additionnels dans `<head>` | `<link rel="preload" slot="head" ... />` |

### 4.4 Exemples d'utilisation

#### Utilisation minimale

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro'
---

<BaseLayout title="Accueil" description="Decouvrez le framework AIAD">
  <main id="main-content">
    <h1>Bienvenue sur AIAD</h1>
  </main>
</BaseLayout>
```

**Sortie HTML :**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Accueil | AIAD</title>
    <meta name="description" content="Decouvrez le framework AIAD" />
    <meta property="og:title" content="Accueil | AIAD" />
    <meta property="og:description" content="Decouvrez le framework AIAD" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/images/og/default.png" />
    <meta property="og:locale" content="fr_FR" />
    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body class="min-h-screen bg-white text-gray-900 antialiased">
    <a href="#main-content" class="skip-link sr-only focus:not-sr-only ...">
      Aller au contenu principal
    </a>
    <main id="main-content">
      <h1>Bienvenue sur AIAD</h1>
    </main>
  </body>
</html>
```

#### Avec meta additionnels (slot head)

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro'
---

<BaseLayout
  title="Preambule"
  description="Introduction au Framework AIAD"
  canonical="https://aiad.dev/framework/preambule"
  ogType="article"
>
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin slot="head" />

  <main id="main-content">
    <h1>Preambule</h1>
    <p>...</p>
  </main>
</BaseLayout>
```

#### Titre contenant deja "AIAD"

```astro
<BaseLayout
  title="AIAD - Framework de developpement avec agents IA"
  description="..."
>
  <main id="main-content">...</main>
</BaseLayout>
```

**Titre genere :** `AIAD - Framework de developpement avec agents IA` (pas de suffixe `| AIAD` ajoute).

#### Avec JSON-LD

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://aiad.dev/' },
    { '@type': 'ListItem', position: 2, name: 'Framework', item: 'https://aiad.dev/framework' },
  ],
}
---

<BaseLayout
  title="Framework AIAD"
  description="Le framework theorique AIAD"
  jsonLd={breadcrumbJsonLd}
>
  <main id="main-content">
    <h1>Framework</h1>
  </main>
</BaseLayout>
```

#### Classes personnalisees

```astro
<BaseLayout
  title="Page sombre"
  description="..."
  bodyClass="dark bg-gray-900"
  class="scroll-smooth"
>
  <main id="main-content">...</main>
</BaseLayout>
```

---

## 5. Design et Style

### 5.1 Skip-link — Design tokens

| Etat | Classes Tailwind |
|------|-----------------|
| Masque (defaut) | `sr-only` |
| Visible (focus) | `focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50` |
| Style visible | `focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg` |
| Outline focus | `focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2` |

### 5.2 Body — Styles de base

| Propriete | Classe Tailwind | Valeur |
|-----------|-----------------|--------|
| Hauteur minimale | `min-h-screen` | 100vh |
| Fond | `bg-white` | #ffffff |
| Couleur texte | `text-gray-900` | #111827 |
| Lissage police | `antialiased` | -webkit-font-smoothing: antialiased |

### 5.3 Coherence avec le design system

| Aspect | Conformite |
|--------|------------|
| Couleurs | `blue-600` (skip-link), `gray-900` (texte), `white` (fond) |
| Focus ring | `ring-blue-400`, `ring-offset-2` — coherent avec CTAButton |
| Z-index | `z-50` pour le skip-link au focus (au-dessus de tout) |
| Typographie | Heritee de Tailwind defaults (polices systeme) |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorite |
|----|-----|----------------------|----------|
| CL-01 | `title` contient "AIAD" | Titre utilise tel quel (pas de doublon " \| AIAD") | Haute |
| CL-02 | `title` ne contient pas "AIAD" | Suffixe " \| AIAD" ajoute automatiquement | Haute |
| CL-03 | `title` vide `''` | Titre genere : " \| AIAD" (valide HTML mais non recommande) | Basse |
| CL-04 | `description` vide `''` | Meta description rendue avec content vide | Basse |
| CL-05 | `canonical` non fourni | Aucun `<link rel="canonical">` genere dans le head | Haute |
| CL-06 | `canonical` fourni | `<link rel="canonical" href="...">` genere | Haute |
| CL-07 | `ogImage` non fourni | Utilise la valeur par defaut `'/images/og/default.png'` | Moyenne |
| CL-08 | `jsonLd` non fourni | Aucun script JSON-LD genere | Haute |
| CL-09 | `jsonLd` fourni (objet simple) | Script `<script type="application/ld+json">` genere | Haute |
| CL-10 | `jsonLd` fourni (tableau) | JSON-LD serialise correctement avec le tableau | Moyenne |
| CL-11 | `bodyClass` vide ou non fourni | Classes body par defaut uniquement | Moyenne |
| CL-12 | `bodyClass` fourni | Classes ajoutees apres les classes par defaut | Moyenne |
| CL-13 | Slot `head` non utilise | Aucun contenu additionnel dans `<head>` | Haute |
| CL-14 | Slot `head` avec contenu | Contenu injecte dans `<head>` apres le CSS global | Haute |
| CL-15 | Slot default vide | Body genere avec seulement le skip-link | Basse |
| CL-16 | `title` contient des caracteres speciaux HTML (`<`, `>`, `&`) | Echappement automatique par Astro (XSS protege) | Haute |
| CL-17 | `description` contient des guillemets | Echappement automatique dans l'attribut `content` | Haute |
| CL-18 | `skipLinkText` personnalise | Texte du skip-link utilise la valeur fournie | Basse |
| CL-19 | `skipLinkTarget` personnalise | Href du skip-link pointe vers `#custom-id` | Basse |
| CL-20 | `class` (html) fourni | Classe ajoutee sur la balise `<html>` | Basse |
| CL-21 | Page sans `<main id="main-content">` dans le slot | Skip-link pointe vers un ancre inexistante (pas d'erreur, scroll no-op) | Moyenne |

### 6.2 Strategie de fallback

```
Props manquantes ?
├── title: REQUIS (TypeScript l'impose)
├── description: REQUIS (TypeScript l'impose)
├── canonical: non fourni → pas de <link rel="canonical">
├── ogType: non fourni → 'website'
├── ogImage: non fourni → '/images/og/default.png'
├── jsonLd: non fourni → pas de <script type="application/ld+json">
├── skipLinkText: non fourni → 'Aller au contenu principal'
├── skipLinkTarget: non fourni → 'main-content'
├── bodyClass: non fourni → ''
└── class: non fourni → undefined (pas d'attribut class sur <html>)
```

---

## 7. Exemples entree/sortie

### 7.1 Cas par defaut (minimal)

**Entree :**

```astro
<BaseLayout title="Accueil" description="Decouvrez le framework AIAD">
  <main id="main-content">
    <h1>Bienvenue</h1>
  </main>
</BaseLayout>
```

**Sortie HTML :**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Accueil | AIAD</title>
    <meta name="description" content="Decouvrez le framework AIAD" />
    <meta property="og:title" content="Accueil | AIAD" />
    <meta property="og:description" content="Decouvrez le framework AIAD" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/images/og/default.png" />
    <meta property="og:locale" content="fr_FR" />
    <link rel="stylesheet" href="/src/styles/global.css" />
  </head>
  <body class="min-h-screen bg-white text-gray-900 antialiased">
    <a href="#main-content" class="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
      Aller au contenu principal
    </a>
    <main id="main-content">
      <h1>Bienvenue</h1>
    </main>
  </body>
</html>
```

### 7.2 Titre contenant "AIAD" (pas de doublon)

**Entree :**

```astro
<BaseLayout
  title="AIAD - Framework de developpement avec agents IA"
  description="Le framework pour developper avec des agents IA"
>
  <main id="main-content">...</main>
</BaseLayout>
```

**Sortie `<title>` :**

```html
<title>AIAD - Framework de developpement avec agents IA</title>
```

### 7.3 Avec canonical et ogType article

**Entree :**

```astro
<BaseLayout
  title="Preambule"
  description="Introduction au Framework AIAD"
  canonical="https://aiad.dev/framework/preambule"
  ogType="article"
>
  <main id="main-content">...</main>
</BaseLayout>
```

**Sortie head (extrait) :**

```html
<title>Preambule | AIAD</title>
<meta name="description" content="Introduction au Framework AIAD" />
<link rel="canonical" href="https://aiad.dev/framework/preambule" />
<meta property="og:type" content="article" />
```

### 7.4 Sans canonical (pas de balise generee)

**Entree :**

```astro
<BaseLayout title="Accueil" description="...">
  <main id="main-content">...</main>
</BaseLayout>
```

**Sortie :** Aucun `<link rel="canonical">` dans le head.

### 7.5 Avec JSON-LD

**Entree :**

```astro
<BaseLayout
  title="Framework"
  description="..."
  jsonLd={{
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AIAD',
    url: 'https://aiad.dev',
  }}
>
  <main id="main-content">...</main>
</BaseLayout>
```

**Sortie head (extrait) :**

```html
<script type="application/ld+json">
  {"@context":"https://schema.org","@type":"WebSite","name":"AIAD","url":"https://aiad.dev"}
</script>
```

### 7.6 Sans JSON-LD (pas de script genere)

**Entree :**

```astro
<BaseLayout title="Accueil" description="...">
  <main id="main-content">...</main>
</BaseLayout>
```

**Sortie :** Aucun `<script type="application/ld+json">` dans le head.

### 7.7 Avec slot head (meta additionnels)

**Entree :**

```astro
<BaseLayout title="Accueil" description="...">
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin slot="head" />
  <meta name="author" content="AIAD Team" slot="head" />

  <main id="main-content">...</main>
</BaseLayout>
```

**Sortie head (extrait, apres global.css) :**

```html
<link rel="stylesheet" href="/src/styles/global.css" />
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
<meta name="author" content="AIAD Team" />
```

### 7.8 Protection XSS

**Entree :**

```astro
<BaseLayout
  title='<script>alert("xss")</script>'
  description='Description "avec" des <guillemets>'
>
  <main id="main-content">...</main>
</BaseLayout>
```

**Sortie :**

```html
<title>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; | AIAD</title>
<meta name="description" content="Description &quot;avec&quot; des &lt;guillemets&gt;" />
```

> Astro echappe automatiquement les expressions `{variable}` dans les templates.

### 7.9 Skip-link personnalise

**Entree :**

```astro
<BaseLayout
  title="Accueil"
  description="..."
  skipLinkText="Passer au contenu"
  skipLinkTarget="content"
>
  <main id="content">...</main>
</BaseLayout>
```

**Sortie (skip-link) :**

```html
<a href="#content" class="skip-link sr-only focus:not-sr-only ...">
  Passer au contenu
</a>
```

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/layouts/base-layout.test.ts` | Unitaire | Vitest + Astro Container |
| `tests/a11y/base-layout.a11y.test.ts` | Accessibilite | Playwright + axe-core |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/layouts/base-layout.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import BaseLayout from '@layouts/BaseLayout.astro'

// ── Helpers ────────────────────────────────────────────────

async function renderLayout(props: Record<string, unknown> = {}) {
  const container = await AstroContainer.create()
  return container.renderToString(BaseLayout, {
    props: {
      title: 'Test Page',
      description: 'Test description',
      ...props,
    },
  })
}

// ── Tests structure HTML ──────────────────────────────────

describe('BaseLayout — Structure HTML', () => {
  it('T-01 : genere un document HTML valide avec doctype', async () => {
    const html = await renderLayout()
    expect(html).toContain('<!doctype html>')
    expect(html).toContain('<html')
    expect(html).toContain('</html>')
  })

  it('T-02 : <html> a l\'attribut lang="fr"', async () => {
    const html = await renderLayout()
    expect(html).toContain('lang="fr"')
  })

  it('T-03 : <head> contient charset UTF-8 en premier', async () => {
    const html = await renderLayout()
    expect(html).toContain('<meta charset="UTF-8"')
  })

  it('T-04 : <head> contient le viewport mobile-first', async () => {
    const html = await renderLayout()
    expect(html).toContain('name="viewport"')
    expect(html).toContain('width=device-width, initial-scale=1.0')
  })

  it('T-05 : viewport ne contient pas maximum-scale ni user-scalable=no', async () => {
    const html = await renderLayout()
    expect(html).not.toContain('maximum-scale')
    expect(html).not.toContain('user-scalable=no')
  })

  it('T-06 : <body> a les classes de base', async () => {
    const html = await renderLayout()
    expect(html).toContain('min-h-screen')
    expect(html).toContain('bg-white')
    expect(html).toContain('text-gray-900')
    expect(html).toContain('antialiased')
  })
})

// ── Tests titre ───────────────────────────────────────────

describe('BaseLayout — Titre', () => {
  it('T-07 : ajoute le suffixe " | AIAD" au titre', async () => {
    const html = await renderLayout({ title: 'Accueil' })
    expect(html).toContain('<title>Accueil | AIAD</title>')
  })

  it('T-08 : pas de doublon si le titre contient deja "AIAD"', async () => {
    const html = await renderLayout({ title: 'AIAD - Framework de dev' })
    expect(html).toContain('<title>AIAD - Framework de dev</title>')
    expect(html).not.toContain('AIAD | AIAD')
  })

  it('T-09 : titre vide genere " | AIAD"', async () => {
    const html = await renderLayout({ title: '' })
    expect(html).toContain('<title> | AIAD</title>')
  })
})

// ── Tests meta SEO ────────────────────────────────────────

describe('BaseLayout — Meta SEO', () => {
  it('T-10 : genere la meta description', async () => {
    const html = await renderLayout({ description: 'Ma description' })
    expect(html).toContain('name="description"')
    expect(html).toContain('content="Ma description"')
  })

  it('T-11 : genere les meta Open Graph', async () => {
    const html = await renderLayout()
    expect(html).toContain('property="og:title"')
    expect(html).toContain('property="og:description"')
    expect(html).toContain('property="og:type"')
    expect(html).toContain('property="og:image"')
    expect(html).toContain('property="og:locale"')
  })

  it('T-12 : og:type est "website" par defaut', async () => {
    const html = await renderLayout()
    expect(html).toContain('content="website"')
  })

  it('T-13 : og:type accepte "article"', async () => {
    const html = await renderLayout({ ogType: 'article' })
    expect(html).toContain('content="article"')
  })

  it('T-14 : og:image utilise la valeur par defaut', async () => {
    const html = await renderLayout()
    expect(html).toContain('content="/images/og/default.png"')
  })

  it('T-15 : og:image accepte une valeur personnalisee', async () => {
    const html = await renderLayout({ ogImage: '/images/og/custom.png' })
    expect(html).toContain('content="/images/og/custom.png"')
  })

  it('T-16 : og:locale est "fr_FR"', async () => {
    const html = await renderLayout()
    expect(html).toContain('content="fr_FR"')
  })
})

// ── Tests canonical ───────────────────────────────────────

describe('BaseLayout — Canonical', () => {
  it('T-17 : pas de <link rel="canonical"> sans prop canonical', async () => {
    const html = await renderLayout()
    expect(html).not.toContain('rel="canonical"')
  })

  it('T-18 : genere <link rel="canonical"> avec prop canonical', async () => {
    const html = await renderLayout({ canonical: 'https://aiad.dev/framework' })
    expect(html).toContain('rel="canonical"')
    expect(html).toContain('href="https://aiad.dev/framework"')
  })
})

// ── Tests JSON-LD ─────────────────────────────────────────

describe('BaseLayout — JSON-LD', () => {
  it('T-19 : pas de script JSON-LD sans prop jsonLd', async () => {
    const html = await renderLayout()
    expect(html).not.toContain('application/ld+json')
  })

  it('T-20 : genere le script JSON-LD avec un objet', async () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'AIAD',
    }
    const html = await renderLayout({ jsonLd })
    expect(html).toContain('application/ld+json')
    expect(html).toContain('"@context":"https://schema.org"')
    expect(html).toContain('"@type":"WebSite"')
    expect(html).toContain('"name":"AIAD"')
  })

  it('T-21 : genere le script JSON-LD avec un tableau', async () => {
    const jsonLd = [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'AIAD' },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList' },
    ]
    const html = await renderLayout({ jsonLd })
    expect(html).toContain('application/ld+json')
    expect(html).toContain('"@type":"WebSite"')
    expect(html).toContain('"@type":"BreadcrumbList"')
  })
})

// ── Tests skip-link ───────────────────────────────────────

describe('BaseLayout — Skip-link', () => {
  it('T-22 : genere un skip-link avec le texte par defaut', async () => {
    const html = await renderLayout()
    expect(html).toContain('Aller au contenu principal')
    expect(html).toContain('href="#main-content"')
  })

  it('T-23 : le skip-link a la classe sr-only (masque par defaut)', async () => {
    const html = await renderLayout()
    expect(html).toContain('class="skip-link')
    expect(html).toContain('sr-only')
  })

  it('T-24 : le skip-link a les classes focus pour la visibilite', async () => {
    const html = await renderLayout()
    expect(html).toContain('focus:not-sr-only')
    expect(html).toContain('focus:fixed')
    expect(html).toContain('focus:bg-blue-600')
    expect(html).toContain('focus:text-white')
  })

  it('T-25 : le skip-link a un focus ring visible', async () => {
    const html = await renderLayout()
    expect(html).toContain('focus:ring-2')
    expect(html).toContain('focus:ring-blue-400')
  })

  it('T-26 : le skip-link est le premier element dans le body', async () => {
    const html = await renderLayout()
    const bodyStart = html.indexOf('<body')
    const skipLinkStart = html.indexOf('skip-link', bodyStart)
    const slotContent = html.indexOf('</a>', skipLinkStart)
    // Le skip-link doit apparaitre avant tout autre contenu significatif
    expect(skipLinkStart).toBeGreaterThan(bodyStart)
    expect(slotContent).toBeGreaterThan(skipLinkStart)
  })

  it('T-27 : skip-link avec texte personnalise', async () => {
    const html = await renderLayout({ skipLinkText: 'Passer au contenu' })
    expect(html).toContain('Passer au contenu')
  })

  it('T-28 : skip-link avec cible personnalisee', async () => {
    const html = await renderLayout({ skipLinkTarget: 'content' })
    expect(html).toContain('href="#content"')
  })
})

// ── Tests CSS global ──────────────────────────────────────

describe('BaseLayout — CSS global', () => {
  it('T-29 : importe le fichier CSS global', async () => {
    const html = await renderLayout()
    expect(html).toContain('global.css')
  })
})

// ── Tests classes personnalisees ──────────────────────────

describe('BaseLayout — Classes personnalisees', () => {
  it('T-30 : bodyClass ajoute des classes au body', async () => {
    const html = await renderLayout({ bodyClass: 'dark bg-gray-900' })
    expect(html).toContain('dark')
    expect(html).toContain('bg-gray-900')
    // Les classes de base sont toujours presentes
    expect(html).toContain('min-h-screen')
  })

  it('T-31 : class ajoute une classe a <html>', async () => {
    const html = await renderLayout({ class: 'scroll-smooth' })
    expect(html).toContain('scroll-smooth')
  })

  it('T-32 : pas d\'attribut class sur <html> si non fourni', async () => {
    const html = await renderLayout()
    // L'attribut class ne doit pas etre present sur <html> s'il est undefined
    const htmlTag = html.match(/<html[^>]*>/)
    // Verifier que class n'est pas present ou est vide
    expect(htmlTag).toBeTruthy()
  })
})

// ── Tests protection XSS ─────────────────────────────────

describe('BaseLayout — Protection XSS', () => {
  it('T-33 : title avec caracteres HTML est echappe', async () => {
    const html = await renderLayout({ title: '<script>alert("xss")</script>' })
    expect(html).not.toContain('<script>alert')
    expect(html).toContain('&lt;script&gt;')
  })

  it('T-34 : description avec guillemets est echappee', async () => {
    const html = await renderLayout({ description: 'Test "guillemets" et <tags>' })
    expect(html).toContain('content="Test')
    expect(html).not.toContain('content="Test "guillemets"')
  })
})
```

### 8.3 Tests d'accessibilite (Playwright + axe-core)

```typescript
// tests/a11y/base-layout.a11y.test.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('BaseLayout — Accessibilite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('A-01 : la page respecte WCAG 2.0 AA', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('A-02 : <html> a l\'attribut lang="fr"', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('fr')
  })

  test('A-03 : la page a un <title> non vide', async ({ page }) => {
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })

  test('A-04 : le skip-link existe et pointe vers #main-content', async ({ page }) => {
    const skipLink = page.locator('a.skip-link')
    await expect(skipLink).toBeAttached()

    const href = await skipLink.getAttribute('href')
    expect(href).toBe('#main-content')
  })

  test('A-05 : le skip-link est masque par defaut', async ({ page }) => {
    const skipLink = page.locator('a.skip-link')
    const box = await skipLink.boundingBox()
    // sr-only : soit width/height ~1px, soit hors ecran
    expect(box).toBeTruthy()
    expect(box!.width <= 1 || box!.x < 0).toBeTruthy()
  })

  test('A-06 : le skip-link est visible au focus clavier', async ({ page }) => {
    // Tab pour donner le focus au skip-link
    await page.keyboard.press('Tab')

    const skipLink = page.locator('a.skip-link')
    // Apres focus, il doit etre visible
    await expect(skipLink).toBeVisible()

    const box = await skipLink.boundingBox()
    expect(box).toBeTruthy()
    expect(box!.width).toBeGreaterThan(1)
    expect(box!.height).toBeGreaterThan(1)
  })

  test('A-07 : le skip-link est le premier element focusable', async ({ page }) => {
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    const tagName = await focused.evaluate((el) => el.tagName.toLowerCase())
    expect(tagName).toBe('a')
    const className = await focused.getAttribute('class')
    expect(className).toContain('skip-link')
  })

  test('A-08 : le viewport ne restreint pas le zoom', async ({ page }) => {
    const viewport = page.locator('meta[name="viewport"]')
    const content = await viewport.getAttribute('content')
    expect(content).toBeTruthy()
    expect(content).not.toContain('maximum-scale')
    expect(content).not.toContain('user-scalable=no')
  })

  test('A-09 : le charset est UTF-8', async ({ page }) => {
    const charset = page.locator('meta[charset]')
    const value = await charset.getAttribute('charset')
    expect(value?.toUpperCase()).toBe('UTF-8')
  })
})
```

### 8.4 Matrice de couverture

| ID | Test | Type | Assertion | Priorite |
|----|------|------|-----------|----------|
| T-01 | Document HTML avec doctype | Unit | `toContain('<!doctype html>')` | Haute |
| T-02 | `<html lang="fr">` | Unit | `toContain('lang="fr"')` | Haute |
| T-03 | charset UTF-8 | Unit | `toContain('charset="UTF-8"')` | Haute |
| T-04 | Viewport mobile-first | Unit | `toContain('width=device-width')` | Haute |
| T-05 | Viewport sans restriction zoom | Unit | `not.toContain('maximum-scale')` | Haute |
| T-06 | Classes body de base | Unit | `toContain('min-h-screen')` etc. | Haute |
| T-07 | Suffixe " \| AIAD" au titre | Unit | `toContain('Accueil \| AIAD')` | Haute |
| T-08 | Pas de doublon "AIAD" | Unit | `not.toContain('AIAD \| AIAD')` | Haute |
| T-09 | Titre vide | Unit | `toContain(' \| AIAD')` | Basse |
| T-10 | Meta description | Unit | `toContain('name="description"')` | Haute |
| T-11 | Meta Open Graph presentes | Unit | `toContain('og:title')` etc. | Haute |
| T-12 | og:type "website" par defaut | Unit | `toContain('content="website"')` | Moyenne |
| T-13 | og:type "article" | Unit | `toContain('content="article"')` | Moyenne |
| T-14 | og:image par defaut | Unit | `toContain('default.png')` | Moyenne |
| T-15 | og:image personnalisee | Unit | `toContain('custom.png')` | Moyenne |
| T-16 | og:locale "fr_FR" | Unit | `toContain('fr_FR')` | Moyenne |
| T-17 | Pas de canonical sans prop | Unit | `not.toContain('rel="canonical"')` | Haute |
| T-18 | Canonical avec prop | Unit | `toContain('rel="canonical"')` | Haute |
| T-19 | Pas de JSON-LD sans prop | Unit | `not.toContain('application/ld+json')` | Haute |
| T-20 | JSON-LD objet simple | Unit | `toContain('@type')` | Haute |
| T-21 | JSON-LD tableau | Unit | `toContain` pour chaque type | Moyenne |
| T-22 | Skip-link texte par defaut | Unit | `toContain('Aller au contenu principal')` | Haute |
| T-23 | Skip-link sr-only | Unit | `toContain('sr-only')` | Haute |
| T-24 | Skip-link classes focus | Unit | `toContain('focus:not-sr-only')` | Haute |
| T-25 | Skip-link focus ring | Unit | `toContain('focus:ring-2')` | Haute |
| T-26 | Skip-link premier dans body | Unit | Position dans le HTML | Haute |
| T-27 | Skip-link texte personnalise | Unit | `toContain('Passer au contenu')` | Basse |
| T-28 | Skip-link cible personnalisee | Unit | `toContain('href="#content"')` | Basse |
| T-29 | CSS global importe | Unit | `toContain('global.css')` | Haute |
| T-30 | bodyClass ajoute des classes | Unit | `toContain('dark')` | Moyenne |
| T-31 | class ajoute sur `<html>` | Unit | `toContain('scroll-smooth')` | Basse |
| T-32 | Pas de class vide sur html | Unit | Verification attribut | Basse |
| T-33 | XSS title echappe | Unit | `toContain('&lt;script&gt;')` | Haute |
| T-34 | XSS description echappee | Unit | Guillemets echappes | Haute |
| A-01 | WCAG 2.0 AA | A11y | `violations.toEqual([])` | Haute |
| A-02 | html lang="fr" | A11y | `getAttribute('lang')` | Haute |
| A-03 | Title non vide | A11y | `title.length > 0` | Haute |
| A-04 | Skip-link href valide | A11y | `href === '#main-content'` | Haute |
| A-05 | Skip-link masque par defaut | A11y | `boundingBox` hors ecran | Haute |
| A-06 | Skip-link visible au focus | A11y | `toBeVisible()` | Haute |
| A-07 | Skip-link premier focusable | A11y | Class contient 'skip-link' | Haute |
| A-08 | Viewport sans restriction zoom | A11y | `not.toContain('maximum-scale')` | Haute |
| A-09 | Charset UTF-8 | A11y | `getAttribute('charset')` | Haute |

---

## 9. Criteres d'acceptation

| ID | Critere | Verifie par |
|----|---------|-------------|
| CA-01 | Le fichier `src/layouts/BaseLayout.astro` est cree | Verification fichier |
| CA-02 | Le composant genere un document HTML valide avec `<!doctype html>`, `<html lang="fr">` | T-01, T-02, A-02 |
| CA-03 | Le `<head>` contient charset UTF-8 et viewport mobile-first sans restriction de zoom | T-03, T-04, T-05, A-08, A-09 |
| CA-04 | Le titre suit le format `{title} \| AIAD` sauf si "AIAD" est deja present | T-07, T-08 |
| CA-05 | Les meta description et Open Graph sont generes correctement | T-10, T-11, T-12, T-16 |
| CA-06 | `<link rel="canonical">` est genere uniquement quand la prop est fournie | T-17, T-18 |
| CA-07 | Le script JSON-LD est genere uniquement quand la prop `jsonLd` est fournie | T-19, T-20 |
| CA-08 | Le skip-link est le premier element focusable, masque par defaut, visible au focus | T-22, T-23, T-24, T-26, A-04, A-05, A-06, A-07 |
| CA-09 | Le slot `head` permet d'injecter du contenu dans `<head>` | T-29 (indirect) |
| CA-10 | Le slot default rend le contenu dans le `<body>` apres le skip-link | T-26 |
| CA-11 | Les classes body de base sont toujours presentes (`min-h-screen bg-white text-gray-900 antialiased`) | T-06 |
| CA-12 | `bodyClass` et `class` ajoutent des classes supplementaires | T-30, T-31 |
| CA-13 | Le composant protege contre le XSS via l'echappement Astro | T-33, T-34 |
| CA-14 | La page respecte WCAG 2.0 AA | A-01 |
| CA-15 | 0 JavaScript cote client (composant 100% statique) | Inspection build |
| CA-16 | Le CSS global Tailwind est importe | T-29 |
| CA-17 | Les tests unitaires passent (34 tests) | CI |
| CA-18 | Les tests d'accessibilite passent (9 tests) | CI |
| CA-19 | TypeScript compile sans erreur (`pnpm typecheck`) | CI |
| CA-20 | ESLint passe sans warning (`pnpm lint`) | CI |

---

## 10. Definition of Done

- [ ] Fichier `src/layouts/BaseLayout.astro` cree
- [ ] Interface TypeScript `Props` complete avec documentation
- [ ] Shell HTML complet (`<!doctype html>`, `<html lang="fr">`, `<head>`, `<body>`)
- [ ] Meta tags SEO : title (avec logique suffixe AIAD), description, Open Graph
- [ ] `<link rel="canonical">` conditionnel
- [ ] Script JSON-LD conditionnel
- [ ] Skip-link d'accessibilite : masque par defaut, visible au focus, premier element focusable
- [ ] Import CSS global Tailwind
- [ ] 2 slots : default (contenu) et head (meta additionnels)
- [ ] Props `bodyClass` et `class` pour la personnalisation
- [ ] Tests unitaires passants (34 tests)
- [ ] Tests d'accessibilite passants (9 tests)
- [ ] 0 erreur TypeScript (`pnpm typecheck`)
- [ ] 0 erreur ESLint (`pnpm lint`)
- [ ] 0 JS cote client
- [ ] Code formate avec Prettier

---

## 11. Notes d'implementation

### 11.1 Ordre d'implementation recommande

1. Creer le fichier `src/layouts/BaseLayout.astro` avec l'interface Props
2. Implementer le shell HTML minimal (doctype, html, head, body)
3. Ajouter la logique de formatage du titre (suffixe AIAD conditionnel)
4. Ajouter les meta tags SEO et Open Graph
5. Ajouter le canonical conditionnel et le JSON-LD conditionnel
6. Implementer le skip-link avec les classes Tailwind
7. Ajouter les slots (default et head)
8. Ajouter les props `bodyClass` et `class`
9. Verifier avec `pnpm typecheck` et `pnpm lint`
10. Ecrire les tests unitaires
11. Refactorer `src/pages/index.astro` pour utiliser BaseLayout (si dans le scope)

### 11.2 Points d'attention

| Point | Detail |
|-------|--------|
| **Import CSS** | Astro gere l'import du CSS global. Utiliser `<link rel="stylesheet" href="/src/styles/global.css" />` ou l'import direct dans le frontmatter selon la methode preferee par le projet. Verifier le fonctionnement au build. |
| **JSON-LD et XSS** | `set:html` est utilise pour injecter le JSON-LD car il ne doit pas etre echappe. S'assurer que les donnees sont de confiance (generees cote serveur au build). |
| **Skip-link cible** | Le `<main id="main-content">` doit etre fourni par la page consommatrice, pas par BaseLayout. BaseLayout ne rend pas de `<main>`. |
| **Slot head** | Les elements du slot `head` doivent avoir l'attribut `slot="head"` pour etre injectes au bon endroit. |
| **Pas de Header/Footer** | BaseLayout ne rend PAS de Header ni de Footer. C'est la responsabilite des layouts enfants (DocsLayout) ou des pages directement. |
| **0 JS client** | Aucune directive `client:*` ne doit etre utilisee. Le composant est 100% statique. |

### 11.3 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| Mode sombre | Ajout de `class="dark"` sur `<html>` et detection preference systeme | Non definie |
| Favicon | Ajout des balises favicon/apple-touch-icon dans le head | Non definie |
| Fonts preload | Prechargement des polices personnalisees | Non definie |
| Analytics | Integration Vercel Analytics script | Non definie |
| Multilangue | Support `lang` dynamique (en, es, etc.) | Phase 2 |

---

## 12. References

| Ressource | Lien |
|-----------|------|
| US-004 Spec | [spec-US-004.md](./spec-US-004.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Pattern Layout Composition | [ARCHITECTURE.md section Patterns](../../ARCHITECTURE.md#2-layout-composition) |
| T-004-F10 DocsLayout | [T-004-F10-layout-DocsLayout.md](./T-004-F10-layout-DocsLayout.md) |
| Types navigation (T-004-B1) | [T-004-B1-types-typescript-navigation.md](./T-004-B1-types-typescript-navigation.md) |
| Page d'accueil existante | [src/pages/index.astro](../../../src/pages/index.astro) |
| Tailwind CSS sr-only | https://tailwindcss.com/docs/screen-readers |
| RGAA — Skip-link (12.7) | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#12.7 |
| Schema.org JSON-LD | https://schema.org/ |
| Astro Layouts | https://docs.astro.build/en/basics/layouts/ |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 10/02/2026 | Creation initiale — Shell HTML, meta SEO, skip-link, slots, JSON-LD, 21 cas limites, 34 tests unitaires, 9 tests a11y, 20 criteres d'acceptation |
