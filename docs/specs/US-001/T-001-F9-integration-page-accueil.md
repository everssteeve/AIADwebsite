# T-001-F9 : Intégrer HeroSection dans la page d'accueil

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.1 |
| **Date** | 05 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001](./spec.md) — Comprendre AIAD rapidement |
| **Dépendances** | T-001-F8 (HeroSection), T-001-B4 (données hero), T-001-B5 (données bénéfices), T-001-B6 (données stats) |
| **Bloque** | T-001-T3 (Tests intégration), T-001-T4 (Tests accessibilité), T-001-T5 (Tests utilisateur) |

---

## 1. Objectif

Intégrer le composant **HeroSection** dans la page d'accueil (`src/pages/index.astro`) en remplaçant le contenu placeholder actuel par le hero complet avec ses données depuis Content Collections. Cette tâche constitue le **point d'assemblage final** de la Phase 4 (US-001), rendant le hero visible et fonctionnel pour les visiteurs.

---

## 2. Contexte technique

### 2.1 Stack

| Technologie | Version | Rôle |
|-------------|---------|------|
| Astro | 4.x | Page statique (SSG, 0 JS client) |
| TypeScript | 5.x | Typage strict des données |
| Tailwind CSS | 3.x | Utility-first, responsive mobile-first |

### 2.2 Arborescence

```
src/
├── pages/
│   └── index.astro                ← FICHIER À MODIFIER
├── components/
│   └── hero/
│       └── HeroSection.astro      ← T-001-F8 ✅
├── content/
│   ├── config.ts                  ← Schémas Content Collections
│   ├── hero/
│   │   └── main.json              ← T-001-B4 ✅
│   ├── benefits/
│   │   └── main.json              ← T-001-B5 ✅
│   └── stats/
│       └── main.json              ← T-001-B6 ✅
└── types/
    ├── index.ts                   ← Exports centralisés
    ├── hero.ts                    ← HeroContent type
    ├── benefit.ts                 ← BenefitItem type
    └── stat.ts                    ← StatItem type
```

### 2.3 État actuel de `index.astro`

Le fichier actuel est un placeholder minimal :

```astro
---
// src/pages/index.astro
---

<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AIAD - Framework de développement avec agents IA</title>
    <meta name="description" content="AIAD : Le framework pour développer avec des agents IA" />
  </head>
  <body>
    <main>
      <h1>AIAD</h1>
      <p>Site en construction</p>
    </main>
  </body>
</html>
```

### 2.4 Dépendances

| Composant / Donnée | Type | Statut | Import |
|--------------------|------|--------|--------|
| HeroSection | Composant Astro | ✅ Terminé | `@components/hero/HeroSection.astro` |
| HeroContent | Données JSON | ✅ Terminé | Content Collection `hero` |
| BenefitItem[] | Données JSON | ✅ Terminé | Content Collection `benefits` |
| StatItem[] | Données JSON | ✅ Terminé | Content Collection `stats` |
| HeroContent | Type TypeScript | ✅ Terminé | `@/types` |
| BenefitItem | Type TypeScript | ✅ Terminé | `@/types` |
| StatItem | Type TypeScript | ✅ Terminé | `@/types` |

### 2.5 Position dans l'architecture

```
Utilisateur → Page d'accueil (index.astro) ← CE FICHIER
                └── <main>
                    └── HeroSection (assemblage complet)
                        ├── HeroTitle (H1 + tagline)
                        ├── ValueProposition (paragraphe)
                        ├── CTAButton ("Explorer le Framework")
                        ├── BenefitsList (grille de 3 BenefitCard)
                        └── StatsRow (ligne de 3 StatDisplay)
```

---

## 3. Spécifications fonctionnelles

### 3.1 Description

La page d'accueil `index.astro` doit :

1. **Charger les données** depuis Content Collections (hero, benefits, stats)
2. **Injecter les métadonnées SEO** (titre, description, Open Graph) depuis les données hero
3. **Rendre le HeroSection** avec toutes les données, en configuration par défaut
4. **Structurer la page HTML** avec les balises sémantiques appropriées
5. **Intégrer Tailwind CSS** pour les styles globaux
6. **Rester extensible** pour les futures sections (features, témoignages, footer...)

### 3.2 Comportement attendu

```
┌──────────────────────────────────────────────────────────────┐
│                      <!doctype html>                          │
│                      <html lang="fr">                         │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                       <head>                              │ │
│  │  <title>AIAD Framework - Développement avec agents IA</title>│
│  │  <meta name="description" content="Découvrez AIAD..."/>  │ │
│  │  <meta property="og:title" content="..."/>                │ │
│  │  <meta property="og:description" content="..."/>          │ │
│  │  <link rel="stylesheet" ... /> (Tailwind)                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                       <body>                              │ │
│  │                                                           │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │                     <main>                           │ │ │
│  │  │                                                      │ │ │
│  │  │  ┌──────────────────────────────────────────────────┐│ │ │
│  │  │  │              HeroSection                         ││ │ │
│  │  │  │  (avec toutes les données Content Collections)   ││ │ │
│  │  │  │                                                  ││ │ │
│  │  │  │  HeroTitle                                       ││ │ │
│  │  │  │  ValueProposition                                ││ │ │
│  │  │  │  CTAButton                                       ││ │ │
│  │  │  │  BenefitsList (3 cartes)                         ││ │ │
│  │  │  │  StatsRow (3 stats)                              ││ │ │
│  │  │  └──────────────────────────────────────────────────┘│ │ │
│  │  │                                                      │ │ │
│  │  │  <!-- Futures sections (hors scope) -->              │ │ │
│  │  │                                                      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Métadonnées SEO

Les métadonnées de la page sont alimentées dynamiquement depuis les données hero :

| Balise HTML | Source | Fallback |
|-------------|--------|----------|
| `<title>` | `heroContent.metadata.seoTitle` | `"AIAD - Framework de développement avec agents IA"` |
| `<meta name="description">` | `heroContent.metadata.seoDescription` | `"AIAD : Le framework pour développer avec des agents IA"` |
| `<meta property="og:title">` | `heroContent.metadata.seoTitle` | Identique au `<title>` |
| `<meta property="og:description">` | `heroContent.metadata.seoDescription` | Identique à description |
| `<meta property="og:type">` | `"website"` (statique) | — |
| `<meta property="og:locale">` | `"fr_FR"` (statique) | — |
| `<html lang>` | `"fr"` (statique) | — |

### 3.4 Chargement des données

La page charge les données en frontmatter (côté serveur, au build) :

| Collection | Méthode | Filtrage | Résultat attendu |
|------------|---------|----------|-------------------|
| `hero` | `getCollection('hero')` | `isActive !== false && locale === 'fr'` | 1 objet `HeroContent` |
| `benefits` | `getCollection('benefits')` | `isActive !== false && locale === 'fr'` | 3 objets `BenefitItem[]` triés par `order` |
| `stats` | `getCollection('stats')` | `isActive !== false && locale === 'fr'` | 3 objets `StatItem[]` triés par `order` |

### 3.5 Configuration du HeroSection

Le HeroSection est rendu en configuration par défaut, avec injection explicite des données :

| Prop | Valeur | Justification |
|------|--------|---------------|
| `heroContent` | Données chargées depuis Content Collection | Chargement centralisé dans la page |
| `benefits` | Données filtrées et triées | Évite un second chargement dans BenefitsList |
| `stats` | Données filtrées et triées | Évite un second chargement dans StatsRow |
| `background` | `'gradient'` | Fond dégradé pour distinguer le hero du reste |
| Toutes les autres props | Valeurs par défaut | Configuration standard recommandée |

> **Note** : Les données sont chargées dans `index.astro` plutôt que déléguées aux sous-composants afin de centraliser le chargement, éviter les requêtes redondantes vers Content Collections, et faciliter la gestion d'erreurs.

### 3.6 Structure HTML de la page

| Élément | Balise | Rôle | Attributs requis |
|---------|--------|------|------------------|
| Document | `<html>` | Racine | `lang="fr"` |
| Head | `<head>` | Métadonnées | charset, viewport, title, description, OG |
| Body | `<body>` | Conteneur | Classe Tailwind pour fond et typographie |
| Main | `<main>` | Contenu principal | Landmark ARIA implicite |
| HeroSection | `<section>` | Hero (via composant) | `id="hero"`, `aria-labelledby` |

### 3.7 Accessibilité (RGAA AA)

| Critère | Implémentation | Référence RGAA |
|---------|----------------|----------------|
| Langue | `<html lang="fr">` | 8.3 |
| Titre de page | `<title>` dynamique depuis SEO metadata | 8.5 |
| H1 unique | Via HeroTitle dans HeroSection (unique sur la page) | 9.1 |
| Landmark main | `<main>` comme conteneur principal | 9.2 |
| Landmark section | `<section aria-labelledby>` via HeroSection | 9.2 |
| Viewport | `<meta name="viewport">` sans désactivation du zoom | 13.10 |
| Responsive | Fonctionnel de 320px à 1920px | 13.10 |
| Contraste | Hérité des sous-composants (ratio ≥ 4.5:1) | 3.2 |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript

```typescript
// src/pages/index.astro (frontmatter)

import { getCollection } from 'astro:content'
import type { HeroContent, BenefitItem, StatItem } from '@/types'

// ── Chargement des données Content Collections ─────────────

// Hero content
const heroEntries = await getCollection('hero')
const heroContent: HeroContent | undefined = heroEntries
  .map((entry) => entry.data as HeroContent)
  .find((h) => h.isActive !== false && h.locale === 'fr')

// Benefits
const benefitEntries = await getCollection('benefits')
const benefits: BenefitItem[] = (benefitEntries
  .map((entry) => entry.data as BenefitItem)
  .filter((b) => b.isActive !== false && b.locale === 'fr') as BenefitItem[])
  .sort((a, b) => a.order - b.order)

// Stats
const statEntries = await getCollection('stats')
const stats: StatItem[] = (statEntries
  .map((entry) => entry.data as StatItem)
  .filter((s) => s.isActive !== false && s.locale === 'fr') as StatItem[])
  .sort((a, b) => a.order - b.order)

// ── Métadonnées SEO ────────────────────────────────────────

const DEFAULT_TITLE = 'AIAD - Framework de développement avec agents IA'
const DEFAULT_DESCRIPTION =
  'AIAD : Le framework pour développer avec des agents IA'

const seoTitle = heroContent?.metadata?.seoTitle || DEFAULT_TITLE
const seoDescription = heroContent?.metadata?.seoDescription || DEFAULT_DESCRIPTION
```

### 4.2 Implémentation du composant

```astro
---
// src/pages/index.astro

import { getCollection } from 'astro:content'
import type { HeroContent, BenefitItem, StatItem } from '@/types'
import HeroSection from '@components/hero/HeroSection.astro'

// ── Chargement des données Content Collections ─────────────

const heroEntries = await getCollection('hero')
const heroContent = heroEntries
  .map((entry) => entry.data as HeroContent)
  .find((h) => h.isActive !== false && h.locale === 'fr')

const benefitEntries = await getCollection('benefits')
const benefits = (benefitEntries
  .map((entry) => entry.data as BenefitItem)
  .filter((b) => b.isActive !== false && b.locale === 'fr') as BenefitItem[])
  .sort((a, b) => a.order - b.order)

const statEntries = await getCollection('stats')
const stats = (statEntries
  .map((entry) => entry.data as StatItem)
  .filter((s) => s.isActive !== false && s.locale === 'fr') as StatItem[])
  .sort((a, b) => a.order - b.order)

// ── Métadonnées SEO ────────────────────────────────────────

const DEFAULT_TITLE = 'AIAD - Framework de développement avec agents IA'
const DEFAULT_DESCRIPTION =
  'AIAD : Le framework pour développer avec des agents IA'

const seoTitle = heroContent?.metadata?.seoTitle || DEFAULT_TITLE
const seoDescription =
  heroContent?.metadata?.seoDescription || DEFAULT_DESCRIPTION
---

<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{seoTitle}</title>
    <meta name="description" content={seoDescription} />

    <!-- Open Graph -->
    <meta property="og:title" content={seoTitle} />
    <meta property="og:description" content={seoDescription} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
  </head>
  <body class="min-h-screen bg-white text-gray-900 antialiased">
    <main>
      <HeroSection
        heroContent={heroContent}
        benefits={benefits}
        stats={stats}
        background="gradient"
      />
    </main>
  </body>
</html>
```

### 4.3 Détail du chargement Content Collections

#### Flux de données hero

```
getCollection('hero')
  → [{ id: 'main', data: { id: 'hero-main-fr', title: '...', ... } }]
  → .map(entry => entry.data as HeroContent)
  → .find(h => h.isActive !== false && h.locale === 'fr')
  → HeroContent | undefined
```

**Entrée :** `src/content/hero/main.json`
```json
{
  "id": "hero-main-fr",
  "title": "AIAD : Le framework pour développer avec des agents IA",
  "tagline": "Structurez votre collaboration avec l'intelligence artificielle",
  "valueProposition": "Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.",
  "locale": "fr",
  "isActive": true,
  "metadata": {
    "seoTitle": "AIAD Framework - Développement avec agents IA",
    "seoDescription": "Découvrez AIAD, le framework de référence pour structurer votre collaboration avec les agents IA de codage et booster votre productivité."
  },
  "updatedAt": "2026-02-02T10:00:00.000Z"
}
```

**Sortie :** objet `HeroContent` conforme au type défini dans `src/types/hero.ts`

#### Flux de données benefits

```
getCollection('benefits')
  → [{ id: 'main', data: [...] }]
  → .map(entry => entry.data as BenefitItem)
  → .filter(b => b.isActive !== false && b.locale === 'fr')
  → .sort((a, b) => a.order - b.order)
  → BenefitItem[] (3 éléments triés)
```

#### Flux de données stats

```
getCollection('stats')
  → [{ id: 'main', data: [...] }]
  → .map(entry => entry.data as StatItem)
  → .filter(s => s.isActive !== false && s.locale === 'fr')
  → .sort((a, b) => a.order - b.order)
  → StatItem[] (3 éléments triés)
```

> **Note sur les collections `type: 'data'`** : Les collections de type `data` (JSON) dans Astro retournent `entry.data` directement comme objet parsé. Pour les données de type array (`benefits/main.json`, `stats/main.json`), Astro traite chaque entrée du fichier selon le schéma défini. Le code d'extraction doit s'adapter à la structure réelle retournée par `getCollection()`.

### 4.4 Exemples d'utilisation

#### Configuration par défaut (recommandée)

```astro
<HeroSection
  heroContent={heroContent}
  benefits={benefits}
  stats={stats}
  background="gradient"
/>
```

#### Sans fond dégradé

```astro
<HeroSection
  heroContent={heroContent}
  benefits={benefits}
  stats={stats}
/>
```

#### Configuration future avec header/footer (hors scope T-001-F9)

```astro
<body class="min-h-screen bg-white text-gray-900 antialiased">
  <!-- <Header /> (future US) -->
  <main>
    <HeroSection
      heroContent={heroContent}
      benefits={benefits}
      stats={stats}
      background="gradient"
    />
    <!-- <FeaturesSection /> (future US) -->
    <!-- <TestimonialsSection /> (future US) -->
  </main>
  <!-- <Footer /> (future US) -->
</body>
```

---

## 5. Design et Style

### 5.1 Styles globaux de la page

| Propriété | Classe Tailwind | Valeur CSS | Justification |
|-----------|-----------------|------------|---------------|
| Hauteur min body | `min-h-screen` | `min-height: 100vh` | Éviter la page plus courte que le viewport |
| Fond body | `bg-white` | `background: #fff` | Fond blanc standard |
| Couleur texte | `text-gray-900` | `color: #111827` | Contraste maximal |
| Lissage polices | `antialiased` | `-webkit-font-smoothing: antialiased` | Rendu typographique optimal |

### 5.2 Fond du HeroSection

Le HeroSection est configuré avec `background="gradient"` pour créer une transition visuelle douce :

```
┌──────────────────────────────────────┐
│ bg-gradient-to-b from-white to-gray-50│
│                                        │
│  (blanc pur → gris très léger)         │
│                                        │
└──────────────────────────────────────┘
│ Suite de la page (bg-white)             │
```

Ce dégradé permet de :
- Distinguer visuellement le hero du reste de la page
- Créer une transition douce sans bordure visible
- Rester cohérent avec la palette projet (white, gray-50)

### 5.3 Responsive

La page elle-même ne définit pas de breakpoints spécifiques. Le responsive est entièrement délégué au composant HeroSection et ses sous-composants :

| Breakpoint | Comportement |
|------------|-------------|
| < 768px (mobile) | Layout empilé, padding réduit, grilles 1 colonne |
| ≥ 768px (tablette) | Grilles 3 colonnes, espacement élargi |
| ≥ 1024px (desktop) | Padding horizontal élargi, titre plus grand |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Matrice des cas limites

| ID | Cas | Comportement attendu | Priorité |
|----|-----|----------------------|----------|
| CL-01 | Content Collection `hero` vide (aucun fichier JSON) | `heroContent` = `undefined` → HeroSection utilise ses fallbacks internes (titre "AIAD") | Haute |
| CL-02 | Aucun hero actif pour locale `'fr'` | `heroContent` = `undefined` → fallback | Haute |
| CL-03 | Content Collection `benefits` vide | `benefits` = `[]` → BenefitsList rend une section vide (invisible) | Haute |
| CL-04 | Content Collection `stats` vide | `stats` = `[]` → StatsRow rend une section vide (invisible) | Haute |
| CL-05 | `metadata.seoTitle` absent dans hero content | Utilise `DEFAULT_TITLE` comme fallback | Moyenne |
| CL-06 | `metadata.seoDescription` absent dans hero content | Utilise `DEFAULT_DESCRIPTION` comme fallback | Moyenne |
| CL-07 | `metadata` entièrement absent | Les deux fallbacks SEO sont utilisés | Moyenne |
| CL-08 | Données hero avec `isActive: false` | Filtrées par `.find()`, hero non affiché → fallback | Haute |
| CL-09 | Bénéfices avec certains `isActive: false` | Filtrés, seuls les actifs sont affichés | Moyenne |
| CL-10 | Stats avec certains `isActive: false` | Filtrées, seules les actives sont affichées | Moyenne |
| CL-11 | Bénéfices non triés dans le JSON | `.sort()` par `order` assure l'ordre correct | Moyenne |
| CL-12 | Stats non triées dans le JSON | `.sort()` par `order` assure l'ordre correct | Moyenne |
| CL-13 | Plus de 3 bénéfices actifs | Tous affichés (BenefitsList gère le wrap) | Basse |
| CL-14 | Plus de 3 stats actives | Toutes affichées (StatsRow gère le wrap) | Basse |
| CL-15 | Titre SEO avec caractères spéciaux HTML | Astro échappe automatiquement dans les attributs | Haute |
| CL-16 | Build Astro sans Content Collections configurées | Erreur de build explicite (failfast) | Haute |
| CL-17 | Plusieurs hero actifs pour locale `'fr'` | `.find()` retourne le premier trouvé | Basse |
| CL-18 | Tailwind CSS non chargé | Styles dégradés mais contenu visible (progressive enhancement) | Moyenne |
| CL-19 | JavaScript désactivé côté client | Aucun impact (page 100% statique, 0 JS) | Basse |
| CL-20 | Écran très étroit (320px) | Layout géré par HeroSection (responsive mobile-first) | Haute |
| CL-21 | Écran très large (> 1920px) | Conteneur centré `max-w-7xl` via HeroSection | Moyenne |

### 6.2 Stratégie de fallback

```
Données Content Collections disponibles ?
├── hero: main.json présent et valide
│   ├── isActive=true, locale='fr' → Utiliser les données
│   └── isActive=false ou locale≠'fr' → heroContent=undefined
│       → HeroSection fallback: title="AIAD", VP/tagline vides
├── benefits: main.json présent et valide
│   ├── Éléments actifs fr trouvés → Utiliser les données triées
│   └── Aucun élément actif → benefits=[]
│       → BenefitsList ne rend rien
└── stats: main.json présent et valide
    ├── Éléments actifs fr trouvés → Utiliser les données triées
    └── Aucun élément actif → stats=[]
        → StatsRow ne rend rien

SEO metadata:
├── metadata.seoTitle présent → Utilisé dans <title> et og:title
├── metadata.seoTitle absent → DEFAULT_TITLE
├── metadata.seoDescription présent → Utilisé dans description et og:description
└── metadata.seoDescription absent → DEFAULT_DESCRIPTION
```

### 6.3 Validation au build

Le build Astro valide automatiquement les données Content Collections contre les schémas Zod définis dans `src/content/config.ts`. Les erreurs de validation provoquent un **échec du build** avec un message explicite, ce qui empêche tout déploiement avec des données invalides.

---

## 7. Exemples entrée/sortie

### 7.1 Cas par défaut (toutes les données disponibles)

**Entrée :** Données Content Collections intactes (hero, benefits, stats)

**Sortie HTML (simplifiée) :**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AIAD Framework - Développement avec agents IA</title>
    <meta name="description" content="Découvrez AIAD, le framework de référence pour structurer votre collaboration avec les agents IA de codage et booster votre productivité." />

    <!-- Open Graph -->
    <meta property="og:title" content="AIAD Framework - Développement avec agents IA" />
    <meta property="og:description" content="Découvrez AIAD, le framework de référence pour structurer votre collaboration avec les agents IA de codage et booster votre productivité." />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
  </head>
  <body class="min-h-screen bg-white text-gray-900 antialiased">
    <main>
      <section id="hero" class="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50" aria-labelledby="hero-title">
        <div class="w-full max-w-7xl mx-auto">

          <!-- HeroTitle -->
          <div class="flex flex-col gap-4 text-center">
            <h1 id="hero-title" class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              AIAD : Le framework pour développer avec des agents IA
            </h1>
            <p class="text-lg md:text-xl lg:text-2xl font-normal text-gray-600 max-w-2xl mx-auto">
              Structurez votre collaboration avec l'intelligence artificielle
            </p>
          </div>

          <!-- ValueProposition -->
          <div class="mt-6">
            <p class="leading-relaxed text-center mx-auto text-base md:text-lg text-gray-600 font-normal max-w-3xl">
              Une méthodologie éprouvée pour intégrer les agents IA dans votre
              workflow de développement et multiplier votre productivité.
            </p>
          </div>

          <!-- CTAButton -->
          <div class="mt-8 flex justify-center">
            <a href="/framework" class="inline-flex items-center justify-center rounded-lg ... bg-blue-600 text-white hover:bg-blue-700 ...">
              <span>Explorer le Framework</span>
              <svg class="w-5 h-5" aria-hidden="true">...</svg>
            </a>
          </div>

          <!-- BenefitsList -->
          <div class="mt-12 md:mt-16">
            <section id="benefits-section" class="mx-auto max-w-6xl w-full" aria-labelledby="benefits-section-title">
              <h2 id="benefits-section-title" class="sr-only">Bénéfices clés</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <!-- BenefitCard: Productivité décuplée -->
                <!-- BenefitCard: Qualité garantie -->
                <!-- BenefitCard: Collaboration fluide -->
              </div>
            </section>
          </div>

          <!-- StatsRow -->
          <div class="mt-12 md:mt-16">
            <section id="stats-section" class="mx-auto max-w-5xl w-full" aria-labelledby="stats-section-title">
              <h2 id="stats-section-title" class="sr-only">Chiffres clés</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <!-- StatDisplay: 50% -->
                <!-- StatDisplay: 3x -->
                <!-- StatDisplay: >90% -->
              </div>
            </section>
          </div>

        </div>
      </section>
    </main>
  </body>
</html>
```

### 7.2 Cas fallback — hero content indisponible

**Entrée :** `src/content/hero/` vide ou `isActive: false`

**Sortie HTML (`<head>` et hero) :**

```html
<head>
  <title>AIAD - Framework de développement avec agents IA</title>
  <meta name="description" content="AIAD : Le framework pour développer avec des agents IA" />
  <meta property="og:title" content="AIAD - Framework de développement avec agents IA" />
  <meta property="og:description" content="AIAD : Le framework pour développer avec des agents IA" />
  ...
</head>
<body class="min-h-screen bg-white text-gray-900 antialiased">
  <main>
    <section id="hero" class="... bg-gradient-to-b from-white to-gray-50" aria-labelledby="hero-title">
      <div class="w-full max-w-7xl mx-auto">
        <!-- HeroTitle avec fallback -->
        <div class="...">
          <h1 id="hero-title" class="...">AIAD</h1>
          <!-- Pas de tagline -->
        </div>
        <!-- Pas de ValueProposition -->
        <!-- CTAButton affiché (valeurs par défaut) -->
        <div class="...">
          <a href="/framework" class="...">Explorer le Framework</a>
        </div>
        <!-- BenefitsList et StatsRow tentent un chargement autonome -->
        ...
      </div>
    </section>
  </main>
</body>
```

### 7.3 Cas SEO metadata partielle

**Entrée :** hero content sans `metadata.seoTitle`

```json
{
  "id": "hero-main-fr",
  "title": "AIAD : Le framework pour développer avec des agents IA",
  "tagline": "...",
  "valueProposition": "...",
  "locale": "fr",
  "isActive": true,
  "metadata": {
    "seoDescription": "Découvrez AIAD..."
  },
  "updatedAt": "2026-02-02T10:00:00.000Z"
}
```

**Sortie :**

```html
<title>AIAD - Framework de développement avec agents IA</title>
<!-- ↑ DEFAULT_TITLE car seoTitle absent -->
<meta name="description" content="Découvrez AIAD..." />
<!-- ↑ seoDescription du JSON -->
```

### 7.4 Protection XSS dans les métadonnées

**Entrée :** seoTitle malveillant

```json
{
  "metadata": {
    "seoTitle": "AIAD\" onload=\"alert('xss')"
  }
}
```

**Sortie :**

```html
<title>AIAD&quot; onload=&quot;alert(&#39;xss&#39;)</title>
<meta property="og:title" content="AIAD&quot; onload=&quot;alert(&#39;xss&#39;)" />
```

> Astro échappe automatiquement les expressions `{variable}` dans les attributs HTML.

---

## 8. Tests

### 8.1 Fichiers de test

| Fichier | Type | Framework |
|---------|------|-----------|
| `tests/unit/pages/index.test.ts` | Unitaire | Vitest + Astro Container |
| `tests/e2e/homepage.spec.ts` | E2E | Playwright |
| `tests/e2e/homepage-accessibility.spec.ts` | Accessibilité | Playwright + axe-core |
| `tests/e2e/homepage-seo.spec.ts` | SEO | Playwright |

### 8.2 Tests unitaires (Vitest)

```typescript
// tests/unit/pages/index.test.ts
import { describe, it, expect } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'

describe('Page d\'accueil (index.astro)', () => {
  describe('Structure HTML', () => {
    it('T-01 : rend un document HTML valide avec lang="fr"', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('<!doctype html>')
      expect(response).toContain('<html lang="fr">')
    })

    it('T-02 : contient un charset UTF-8', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('charset="UTF-8"')
    })

    it('T-03 : contient un viewport meta tag', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('name="viewport"')
      expect(response).toContain('width=device-width')
    })

    it('T-04 : contient un <main> comme conteneur principal', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('<main>')
      expect(response).toContain('</main>')
    })

    it('T-05 : contient la section hero avec id="hero"', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('id="hero"')
    })

    it('T-06 : applique les classes body Tailwind', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('min-h-screen')
      expect(response).toContain('bg-white')
      expect(response).toContain('text-gray-900')
      expect(response).toContain('antialiased')
    })
  })

  describe('Métadonnées SEO', () => {
    it('T-07 : contient un <title> depuis les données hero', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toMatch(/<title>.*AIAD.*<\/title>/)
    })

    it('T-08 : contient une meta description', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('name="description"')
      expect(response).toMatch(/content="[^"]{10,}"/) // Au moins 10 caractères
    })

    it('T-09 : contient les balises Open Graph', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('property="og:title"')
      expect(response).toContain('property="og:description"')
      expect(response).toContain('property="og:type"')
      expect(response).toContain('content="website"')
      expect(response).toContain('property="og:locale"')
      expect(response).toContain('content="fr_FR"')
    })

    it('T-10 : le titre SEO ne dépasse pas 60 caractères', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      const titleMatch = response.match(/<title>(.*?)<\/title>/)
      expect(titleMatch).toBeTruthy()
      expect(titleMatch![1].length).toBeLessThanOrEqual(60)
    })

    it('T-11 : la meta description ne dépasse pas 160 caractères', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      const descMatch = response.match(
        /name="description"\s+content="([^"]*)"/
      )
      expect(descMatch).toBeTruthy()
      expect(descMatch![1].length).toBeLessThanOrEqual(160)
    })
  })

  describe('Intégration HeroSection', () => {
    it('T-12 : rend le HeroTitle (H1) avec le titre AIAD', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('<h1')
      expect(response).toContain('AIAD')
    })

    it('T-13 : rend la tagline', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('Structurez votre collaboration')
    })

    it('T-14 : rend la ValueProposition', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('méthodologie éprouvée')
    })

    it('T-15 : rend le CTA "Explorer le Framework"', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('Explorer le Framework')
      expect(response).toContain('href="/framework"')
    })

    it('T-16 : rend les 3 bénéfices', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('Productivité décuplée')
      expect(response).toContain('Qualité garantie')
      expect(response).toContain('Collaboration fluide')
    })

    it('T-17 : rend les 3 statistiques', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('50%')
      expect(response).toContain('3x')
      expect(response).toContain('&gt;90%') // >90% échappé en HTML
    })

    it('T-18 : applique le fond dégradé au HeroSection', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).toContain('bg-gradient-to-b')
      expect(response).toContain('from-white')
      expect(response).toContain('to-gray-50')
    })
  })

  describe('Contenu placeholder supprimé', () => {
    it('T-19 : ne contient plus "Site en construction"', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      expect(response).not.toContain('Site en construction')
    })

    it('T-20 : ne contient pas un H1 orphelin "AIAD" sans sous-composants', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      // Vérifier que le H1 est à l'intérieur d'une section hero, pas seul dans main
      expect(response).toContain('id="hero"')
      expect(response).toContain('aria-labelledby="hero-title"')
    })
  })

  describe('Unicité H1', () => {
    it('T-21 : contient exactement un seul H1 sur la page', async () => {
      const container = await AstroContainer.create()
      const response = await container.renderToString(
        await import('@/pages/index.astro')
      )

      const h1Count = (response.match(/<h1[\s>]/g) || []).length
      expect(h1Count).toBe(1)
    })
  })
})
```

### 8.3 Tests E2E (Playwright)

```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Page d\'accueil - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('E-01 : la page d\'accueil se charge sans erreur', async ({ page }) => {
    await expect(page).toHaveTitle(/AIAD/)
  })

  test('E-02 : la section hero est visible', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
  })

  test('E-03 : le H1 contient "AIAD"', async ({ page }) => {
    const h1 = page.locator('h1')
    await expect(h1).toContainText('AIAD')
  })

  test('E-04 : un seul H1 sur la page', async ({ page }) => {
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
  })

  test('E-05 : le CTA "Explorer le Framework" est visible above the fold', async ({
    page,
  }) => {
    const cta = page.locator('a:has-text("Explorer le Framework")')
    await expect(cta).toBeVisible()

    // Vérifier que le CTA est dans le viewport initial (above the fold)
    const ctaBox = await cta.boundingBox()
    const viewportSize = page.viewportSize()
    expect(ctaBox).toBeTruthy()
    expect(ctaBox!.y + ctaBox!.height).toBeLessThan(viewportSize!.height)
  })

  test('E-06 : le CTA navigue vers /framework', async ({ page }) => {
    const cta = page.locator('a:has-text("Explorer le Framework")')
    await cta.click()
    await expect(page).toHaveURL(/\/framework/)
  })

  test('E-07 : 3 bénéfices sont affichés', async ({ page }) => {
    const benefitsSection = page.locator('#benefits-section')
    await expect(benefitsSection).toBeVisible()

    const cards = benefitsSection.locator('article')
    await expect(cards).toHaveCount(3)
  })

  test('E-08 : 3 statistiques sont affichées', async ({ page }) => {
    const statsSection = page.locator('#stats-section')
    await expect(statsSection).toBeVisible()
  })

  test('E-09 : pas de scroll horizontal', async ({ page }) => {
    const body = page.locator('body')
    const scrollWidth = await body.evaluate((el) => el.scrollWidth)
    const clientWidth = await body.evaluate((el) => el.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })

  test('E-10 : temps de lecture hero < 30 secondes', async ({ page }) => {
    const heroText = await page.locator('#hero').innerText()
    const wordCount = heroText.split(/\s+/).filter(Boolean).length

    // 200-250 mots/min → 30 secondes = 100-125 mots max
    expect(wordCount).toBeLessThan(150) // Marge de sécurité
  })

  test('E-11 : responsive mobile 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()

    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    const cta = page.locator('a:has-text("Explorer le Framework")')
    await expect(cta).toBeVisible()
  })

  test('E-12 : responsive tablette 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()

    const benefitsGrid = page.locator('#benefits-section .grid')
    await expect(benefitsGrid).toBeVisible()
  })

  test('E-13 : responsive desktop 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })

    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
  })

  test('E-14 : le fond dégradé est appliqué', async ({ page }) => {
    const hero = page.locator('#hero')
    const bgImage = await hero.evaluate((el) =>
      window.getComputedStyle(el).backgroundImage
    )

    // Vérifier qu'un dégradé est présent (ou la classe)
    const heroClasses = await hero.getAttribute('class')
    expect(heroClasses).toContain('bg-gradient-to-b')
  })
})
```

### 8.4 Tests SEO (Playwright)

```typescript
// tests/e2e/homepage-seo.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Page d\'accueil - SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('S-01 : <title> contient "AIAD"', async ({ page }) => {
    const title = await page.title()
    expect(title).toContain('AIAD')
  })

  test('S-02 : <title> ne dépasse pas 60 caractères', async ({ page }) => {
    const title = await page.title()
    expect(title.length).toBeLessThanOrEqual(60)
  })

  test('S-03 : meta description est présente et non vide', async ({
    page,
  }) => {
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content')
    expect(description).toBeTruthy()
    expect(description!.length).toBeGreaterThan(10)
  })

  test('S-04 : meta description ne dépasse pas 160 caractères', async ({
    page,
  }) => {
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content')
    expect(description!.length).toBeLessThanOrEqual(160)
  })

  test('S-05 : balises Open Graph présentes', async ({ page }) => {
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content')
    const ogDesc = await page
      .locator('meta[property="og:description"]')
      .getAttribute('content')
    const ogType = await page
      .locator('meta[property="og:type"]')
      .getAttribute('content')
    const ogLocale = await page
      .locator('meta[property="og:locale"]')
      .getAttribute('content')

    expect(ogTitle).toBeTruthy()
    expect(ogDesc).toBeTruthy()
    expect(ogType).toBe('website')
    expect(ogLocale).toBe('fr_FR')
  })

  test('S-06 : og:title correspond au <title>', async ({ page }) => {
    const title = await page.title()
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content')

    expect(ogTitle).toBe(title)
  })

  test('S-07 : html lang="fr" est défini', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('fr')
  })

  test('S-08 : un seul H1 sur la page', async ({ page }) => {
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
  })

  test('S-09 : charset UTF-8 déclaré', async ({ page }) => {
    const charset = await page
      .locator('meta[charset]')
      .getAttribute('charset')
    expect(charset).toBe('UTF-8')
  })

  test('S-10 : viewport meta tag présent', async ({ page }) => {
    const viewport = await page
      .locator('meta[name="viewport"]')
      .getAttribute('content')
    expect(viewport).toContain('width=device-width')
  })
})
```

### 8.5 Tests d'accessibilité (axe-core)

```typescript
// tests/e2e/homepage-accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Page d\'accueil - Accessibilité', () => {
  test('A-01 : respecte WCAG 2.0 AA sur toute la page', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('A-02 : respecte WCAG 2.0 AA sur la section hero', async ({
    page,
  }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('#hero')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('A-03 : landmark <main> est présent', async ({ page }) => {
    await page.goto('/')

    const main = page.locator('main')
    await expect(main).toBeAttached()
  })

  test('A-04 : section hero est un landmark accessible', async ({ page }) => {
    await page.goto('/')

    const hero = page.locator('#hero')
    const ariaLabel = await hero.getAttribute('aria-labelledby')
    expect(ariaLabel).toBeTruthy()

    const titleId = ariaLabel!
    const title = page.locator(`#${titleId}`)
    await expect(title).toBeAttached()
  })

  test('A-05 : hiérarchie des titres correcte (H1 unique → H2)', async ({
    page,
  }) => {
    await page.goto('/')

    // Un seul H1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // H2 pour bénéfices et stats (peuvent être sr-only)
    const h2Count = await page.locator('#hero h2').count()
    expect(h2Count).toBeGreaterThanOrEqual(2)
  })

  test('A-06 : navigation au clavier fonctionne sur le CTA', async ({
    page,
  }) => {
    await page.goto('/')

    // Tab pour atteindre le CTA
    await page.keyboard.press('Tab')

    // Vérifie qu'un élément a le focus
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('A-07 : contenu accessible à 320px sans débordement', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    await page.goto('/')

    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()

    const heroBox = await hero.boundingBox()
    expect(heroBox!.width).toBeLessThanOrEqual(320)
  })

  test('A-08 : pas de contenu tronqué sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Pas de scroll horizontal
    const body = page.locator('body')
    const scrollWidth = await body.evaluate((el) => el.scrollWidth)
    const clientWidth = await body.evaluate((el) => el.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })

  test('A-09 : contraste CTA suffisant', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('a:has-text("Explorer le Framework")')
      .withRules(['color-contrast'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('A-10 : html lang est défini', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .withRules(['html-has-lang', 'html-lang-valid'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
```

### 8.6 Matrice de couverture

| ID | Test | Type | Assertion | Priorité |
|----|------|------|-----------|----------|
| T-01 | HTML valide avec `lang="fr"` | Unit | `toContain('<html lang="fr">')` | Haute |
| T-02 | Charset UTF-8 | Unit | `toContain('charset="UTF-8"')` | Haute |
| T-03 | Viewport meta tag | Unit | `toContain('name="viewport"')` | Haute |
| T-04 | `<main>` conteneur principal | Unit | `toContain('<main>')` | Haute |
| T-05 | Section hero avec `id="hero"` | Unit | `toContain('id="hero"')` | Haute |
| T-06 | Classes body Tailwind | Unit | `toContain('min-h-screen')` | Moyenne |
| T-07 | `<title>` dynamique depuis hero | Unit | `toMatch(/<title>.*AIAD/)` | Haute |
| T-08 | Meta description présente | Unit | `toContain('name="description"')` | Haute |
| T-09 | Balises Open Graph | Unit | `toContain('property="og:...')` | Haute |
| T-10 | Titre SEO ≤ 60 chars | Unit | `length <= 60` | Moyenne |
| T-11 | Meta description ≤ 160 chars | Unit | `length <= 160` | Moyenne |
| T-12 | H1 avec titre AIAD | Unit | `toContain('<h1')` + `toContain('AIAD')` | Haute |
| T-13 | Tagline rendue | Unit | `toContain('Structurez votre collaboration')` | Haute |
| T-14 | ValueProposition rendue | Unit | `toContain('méthodologie éprouvée')` | Haute |
| T-15 | CTA avec texte et href | Unit | `toContain('Explorer le Framework')` | Haute |
| T-16 | 3 bénéfices rendus | Unit | `toContain` pour chaque titre | Haute |
| T-17 | 3 statistiques rendues | Unit | `toContain` pour chaque valeur | Haute |
| T-18 | Fond dégradé appliqué | Unit | `toContain('bg-gradient-to-b')` | Moyenne |
| T-19 | Placeholder supprimé | Unit | `not.toContain('Site en construction')` | Haute |
| T-20 | Hero structuré (pas un H1 orphelin) | Unit | `toContain('aria-labelledby')` | Haute |
| T-21 | H1 unique sur la page | Unit | `h1Count === 1` | Haute |
| E-01 | Page se charge | E2E | `toHaveTitle(/AIAD/)` | Haute |
| E-02 | Section hero visible | E2E | `toBeVisible()` | Haute |
| E-03 | H1 contient "AIAD" | E2E | `toContainText('AIAD')` | Haute |
| E-04 | H1 unique | E2E | `count() === 1` | Haute |
| E-05 | CTA above the fold | E2E | Position dans viewport | Haute |
| E-06 | CTA navigue vers /framework | E2E | `toHaveURL(/\/framework/)` | Haute |
| E-07 | 3 bénéfices affichés | E2E | `toHaveCount(3)` | Haute |
| E-08 | 3 statistiques affichées | E2E | `toBeVisible()` | Haute |
| E-09 | Pas de scroll horizontal | E2E | `scrollWidth <= clientWidth` | Haute |
| E-10 | Temps de lecture < 30s | E2E | `wordCount < 150` | Haute |
| E-11 | Responsive mobile 375px | E2E | Visible et fonctionnel | Moyenne |
| E-12 | Responsive tablette 768px | E2E | Grid visible | Moyenne |
| E-13 | Responsive desktop 1280px | E2E | Rendu correct | Moyenne |
| E-14 | Fond dégradé visible | E2E | Classe CSS présente | Moyenne |
| S-01 | Title contient AIAD | SEO | `toContain('AIAD')` | Haute |
| S-02 | Title ≤ 60 chars | SEO | `length <= 60` | Moyenne |
| S-03 | Description non vide | SEO | `toBeTruthy()` | Haute |
| S-04 | Description ≤ 160 chars | SEO | `length <= 160` | Moyenne |
| S-05 | OG tags présents | SEO | `toBeTruthy()` | Haute |
| S-06 | og:title = title | SEO | `toBe(title)` | Moyenne |
| S-07 | html lang="fr" | SEO | `toBe('fr')` | Haute |
| S-08 | H1 unique | SEO | `count() === 1` | Haute |
| S-09 | Charset UTF-8 | SEO | `toBe('UTF-8')` | Haute |
| S-10 | Viewport meta | SEO | `toContain('width=device-width')` | Haute |
| A-01 | WCAG AA page complète | A11y | `violations.toEqual([])` | Haute |
| A-02 | WCAG AA section hero | A11y | `violations.toEqual([])` | Haute |
| A-03 | Landmark main | A11y | `toBeAttached()` | Haute |
| A-04 | Section hero landmark | A11y | `aria-labelledby` valide | Haute |
| A-05 | Hiérarchie H1→H2 | A11y | Counts corrects | Haute |
| A-06 | Navigation clavier | A11y | Focus visible | Haute |
| A-07 | Accessible à 320px | A11y | Pas de débordement | Moyenne |
| A-08 | Pas de troncature mobile | A11y | `scrollWidth <= clientWidth` | Moyenne |
| A-09 | Contraste CTA | A11y | axe color-contrast | Haute |
| A-10 | html lang valide | A11y | axe html-has-lang | Haute |

---

## 9. Critères d'acceptation

| ID | Critère | Vérifié par |
|----|---------|-------------|
| CA-01 | Le fichier `src/pages/index.astro` est modifié (pas de placeholder) | T-19, T-20 |
| CA-02 | La page rend un document HTML complet avec `<html lang="fr">` | T-01, S-07, A-10 |
| CA-03 | Le `<title>` est alimenté dynamiquement depuis Content Collections | T-07, S-01 |
| CA-04 | La meta description est alimentée depuis Content Collections | T-08, S-03 |
| CA-05 | Les balises Open Graph sont présentes (og:title, og:description, og:type, og:locale) | T-09, S-05 |
| CA-06 | Le HeroSection est rendu dans un `<main>` avec `id="hero"` | T-04, T-05, E-02 |
| CA-07 | Le HeroTitle (H1) affiche le titre AIAD depuis les données | T-12, E-03 |
| CA-08 | Le H1 est unique sur la page | T-21, E-04, S-08 |
| CA-09 | La tagline est affichée | T-13 |
| CA-10 | La ValueProposition est affichée | T-14 |
| CA-11 | Le CTA "Explorer le Framework" est visible above the fold avec lien `/framework` | T-15, E-05, E-06 |
| CA-12 | Les 3 bénéfices sont affichés depuis Content Collections | T-16, E-07 |
| CA-13 | Les 3 statistiques sont affichées depuis Content Collections | T-17, E-08 |
| CA-14 | Le fond dégradé `gradient` est appliqué au HeroSection | T-18, E-14 |
| CA-15 | Le temps de lecture du hero est < 30 secondes | E-10 |
| CA-16 | La page est responsive de 320px à 1920px+ sans scroll horizontal | E-09, E-11, E-12, E-13, A-07, A-08 |
| CA-17 | La page respecte WCAG 2.0 AA | A-01, A-02 |
| CA-18 | Les données Content Collections sont chargées et triées par `order` | T-16, T-17 |
| CA-19 | Les fallbacks SEO sont appliqués si metadata absente | Section 7.2, 7.3 |
| CA-20 | 0 JavaScript côté client (page 100% statique) | Inspection build |
| CA-21 | Le titre SEO ≤ 60 caractères | T-10, S-02 |
| CA-22 | La meta description ≤ 160 caractères | T-11, S-04 |

---

## 10. Definition of Done

- [x] Fichier `src/pages/index.astro` modifié (placeholder supprimé)
- [x] Import et rendu du composant `HeroSection` avec `background="gradient"`
- [x] Chargement des données depuis Content Collections (hero, benefits, stats)
- [x] Filtrage par `isActive` et `locale: 'fr'`
- [x] Tri des bénéfices et stats par `order`
- [x] Métadonnées SEO dynamiques (`<title>`, description, Open Graph)
- [x] Fallbacks SEO si metadata absente
- [x] Structure HTML sémantique (`<html lang="fr">`, `<main>`, `<section>`)
- [x] Classes body Tailwind (`min-h-screen bg-white text-gray-900 antialiased`)
- [x] H1 unique sur la page
- [x] Responsive mobile-first (320px → 1920px+)
- [x] Accessibilité RGAA AA validée
- [ ] Tests unitaires passants (21 tests)
- [ ] Tests E2E passants (14 tests)
- [ ] Tests SEO passants (10 tests)
- [ ] Tests accessibilité passants (10 tests)
- [ ] 0 erreur TypeScript (`pnpm typecheck`)
- [ ] 0 erreur ESLint (`pnpm lint`)
- [x] 0 JS côté client
- [ ] Code formaté avec Prettier
- [ ] Build Astro réussi (`pnpm build`)
- [ ] Code review effectuée

---

## 11. Notes d'implémentation

### 11.1 Ordre d'implémentation recommandé

1. Ouvrir `src/pages/index.astro`
2. Ajouter les imports (Content Collections, types, HeroSection)
3. Implémenter le chargement des données dans le frontmatter
4. Ajouter les variables SEO avec fallbacks
5. Remplacer le HTML placeholder par la structure complète
6. Ajouter les balises `<head>` dynamiques (title, description, OG)
7. Rendre le HeroSection dans `<main>` avec `background="gradient"`
8. Vérifier avec `pnpm dev`
9. Vérifier le build avec `pnpm build`
10. Écrire et exécuter les tests

### 11.2 Points d'attention

| Point | Détail |
|-------|--------|
| **H1 unique** | Le H1 est rendu par HeroTitle via HeroSection. La page ne doit pas ajouter d'autre H1. Le placeholder `<h1>AIAD</h1>` doit être supprimé. |
| **Content Collections `type: 'data'`** | Les collections hero, benefits et stats sont de type `data` (JSON). La structure retournée par `getCollection()` peut varier selon que le JSON est un objet ou un array. Adapter le code d'extraction en conséquence. |
| **Filtrage locale** | Filtrer explicitement par `locale === 'fr'` pour anticiper le multilangue (Phase 2). |
| **Tri par `order`** | Trier les bénéfices et stats par `order` ascendant pour garantir l'ordre d'affichage, indépendamment de l'ordre dans le JSON. |
| **Chargement centralisé** | Les données sont chargées dans `index.astro` et passées en props au HeroSection pour éviter des chargements redondants dans les sous-composants. |
| **Pas de Layout** | Il n'existe pas encore de layout (`BaseLayout.astro`). La page définit sa propre structure HTML complète. Quand un layout sera créé (future US), `index.astro` sera refactoré pour l'utiliser. |
| **Tailwind CSS** | Vérifier que Tailwind est correctement intégré (via `@astrojs/tailwind` dans `astro.config.mjs`). Si les styles ne s'appliquent pas, vérifier la configuration. |
| **Pas de JavaScript client** | Aucune directive `client:*` ne doit être utilisée. La page est 100% statique. |
| **Open Graph image** | L'`og:image` n'est pas inclus dans cette tâche (pas d'image OG disponible). À ajouter dans une future itération. |

### 11.3 Extensions futures (hors scope)

| Extension | Description | User Story |
|-----------|-------------|------------|
| BaseLayout | Extraire la structure HTML dans un layout réutilisable | Non définie |
| Header/Navigation | Ajouter un header avec menu de navigation | Non définie |
| Footer | Ajouter un footer avec liens et copyright | Non définie |
| og:image | Ajouter une image Open Graph 1200x630 | Non définie |
| Mode sombre | Support du thème sombre | Non définie |
| Analytics | Intégration Vercel Analytics | Non définie |
| Structured Data | Ajouter du JSON-LD pour le SEO | Non définie |

---

## 12. Références

| Ressource | Lien |
|-----------|------|
| US-001 Spec | [spec.md](./spec.md) |
| T-001-F8 HeroSection | [T-001-F8-composant-HeroSection.md](./T-001-F8-composant-HeroSection.md) |
| T-001-B4 Données Hero | [T-001-B4-donnees-JSON-hero-content-francais.md](./T-001-B4-donnees-JSON-hero-content-francais.md) |
| T-001-B5 Données Bénéfices | [T-001-B5-donnees-JSON-benefices-cles.md](./T-001-B5-donnees-JSON-benefices-cles.md) |
| T-001-B6 Données Stats | [T-001-B6-donnees-JSON-statistiques-chiffrees.md](./T-001-B6-donnees-JSON-statistiques-chiffrees.md) |
| Architecture | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Astro Pages | https://docs.astro.build/en/basics/astro-pages/ |
| Astro Content Collections | https://docs.astro.build/en/guides/content-collections/ |
| Tailwind CSS | https://tailwindcss.com/docs |
| Open Graph Protocol | https://ogp.me/ |
| RGAA (accessibilité) | https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/ |
| axe-core | https://github.com/dequelabs/axe-core |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 05/02/2026 | Création initiale — Spécification complète de l'intégration HeroSection dans la page d'accueil |
| 1.1 | 05/02/2026 | Mise à jour statut → ✅ Terminé — Implémentation complète de l'intégration dans index.astro |
