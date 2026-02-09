# T-001-F1 : Créer le composant HeroTitle (H1 + tagline)

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 2 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-B1 (HeroContent model) ✅, T-001-B4 (Hero JSON) ✅ |
| **Bloque** | T-001-F8 (HeroSection assemblage) |

---

## 1. Objectif

Créer le composant Astro `HeroTitle` qui affiche le titre principal (H1) et la tagline de la hero section, en garantissant :

- **Sémantique HTML** : Utilisation correcte des balises H1 et paragraphe
- **Accessibilité** : Conforme RGAA AA (contraste, structure)
- **Responsive** : Adaptation mobile-first selon les breakpoints
- **Performance** : Rendu statique sans JavaScript client
- **Type-safety** : Props typées avec TypeScript strict
- **Design system** : Intégration Tailwind CSS cohérente

---

## 2. Contexte technique

### 2.1 Architecture cible

D'après [ARCHITECTURE.md](../../ARCHITECTURE.md), le projet utilise :

- **Astro 4.x** avec composants `.astro` (static by default)
- **TypeScript 5.x** en mode strict
- **Tailwind CSS 3.x** pour le styling utility-first
- **Pattern Mobile-first** pour le responsive design

### 2.2 Positionnement dans l'arborescence

```
src/
├── components/
│   ├── common/                    # Composants réutilisables génériques
│   └── hero/                      # ← Nouveau dossier pour les composants hero
│       └── HeroTitle.astro        # ← COMPOSANT À CRÉER
├── content/
│   └── hero/
│       └── main.json              # Données source (T-001-B4) ✅
├── types/
│   └── hero.ts                    # Interface HeroContent (T-001-B1) ✅
└── pages/
    └── index.astro                # Consommateur final (via HeroSection)
```

### 2.3 Dépendances

| Type | Nom | Provenance | Statut |
|------|-----|------------|--------|
| **Type** | `HeroContent` | `@/types/hero` | ✅ Disponible |
| **Data** | `main.json` | `src/content/hero/` | ✅ Disponible |
| **Schema** | `heroContentSchema` | `src/content/config.ts` | ✅ Disponible |

---

## 3. Spécifications fonctionnelles

### 3.1 Description du composant

Le `HeroTitle` est le composant atomique responsable de l'affichage du bloc titre de la hero section, comprenant :

| Élément | Balise HTML | Source de données | Rôle |
|---------|-------------|-------------------|------|
| Titre principal | `<h1>` | `HeroContent.title` | Identifier le produit AIAD |
| Tagline | `<p>` | `HeroContent.tagline` | Accrocher avec la promesse principale |

### 3.2 Comportement attendu

#### 3.2.1 Rendu par défaut

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│         AIAD : Le framework pour développer                │
│              avec des agents IA                            │
│                                                            │
│    Structurez votre collaboration avec l'intelligence      │
│                      artificielle                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### 3.2.2 Hiérarchie visuelle

| Élément | Taille desktop | Taille mobile | Poids | Couleur |
|---------|----------------|---------------|-------|---------|
| Titre H1 | `text-5xl` (3rem) | `text-3xl` (1.875rem) | `font-bold` | `text-gray-900` |
| Tagline | `text-xl` (1.25rem) | `text-lg` (1.125rem) | `font-normal` | `text-gray-600` |

### 3.3 Variantes

Le composant supporte les variantes suivantes :

| Variante | Prop | Valeur par défaut | Description |
|----------|------|-------------------|-------------|
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Alignement du texte |
| `size` | `'sm' \| 'md' \| 'lg'` | `'lg'` | Taille globale (impact title + tagline) |
| `showTagline` | `boolean` | `true` | Afficher ou masquer la tagline |

### 3.4 Accessibilité (RGAA AA)

| Critère | Exigence | Implémentation |
|---------|----------|----------------|
| **1.1** Headings | H1 unique par page | Un seul `<h1>` dans le composant |
| **3.1** Contraste texte | Ratio ≥ 4.5:1 | `text-gray-900` sur fond clair |
| **8.1** Structure | Ordre logique | H1 suivi de `<p>` |
| **10.1** Responsive | Lisible sur tous devices | Tailles responsives |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript des Props

```typescript
// src/components/hero/HeroTitle.astro - Frontmatter

/**
 * Props du composant HeroTitle
 */
export interface HeroTitleProps {
  /**
   * Titre principal affiché en H1
   * Correspond à HeroContent.title
   * @minLength 10
   * @maxLength 80
   */
  title: string

  /**
   * Accroche affichée sous le titre
   * Correspond à HeroContent.tagline
   * @minLength 10
   * @maxLength 120
   */
  tagline: string

  /**
   * Alignement horizontal du texte
   * @default 'center'
   */
  align?: 'left' | 'center' | 'right'

  /**
   * Taille globale du composant
   * - sm: titre text-2xl/3xl, tagline text-base/lg
   * - md: titre text-3xl/4xl, tagline text-lg/xl
   * - lg: titre text-4xl/5xl, tagline text-xl/2xl
   * @default 'lg'
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Afficher ou masquer la tagline
   * @default true
   */
  showTagline?: boolean

  /**
   * Classes CSS additionnelles pour le conteneur
   */
  class?: string
}
```

### 4.2 Implémentation du composant

```astro
---
// src/components/hero/HeroTitle.astro

export interface Props {
  title: string
  tagline: string
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  class?: string
}

const {
  title,
  tagline,
  align = 'center',
  size = 'lg',
  showTagline = true,
  class: className = '',
} = Astro.props

// Mapping des tailles
const sizeClasses = {
  sm: {
    title: 'text-2xl md:text-3xl',
    tagline: 'text-base md:text-lg',
    gap: 'gap-2',
  },
  md: {
    title: 'text-3xl md:text-4xl',
    tagline: 'text-lg md:text-xl',
    gap: 'gap-3',
  },
  lg: {
    title: 'text-3xl md:text-4xl lg:text-5xl',
    tagline: 'text-lg md:text-xl lg:text-2xl',
    gap: 'gap-4',
  },
}

// Mapping des alignements
const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const currentSize = sizeClasses[size]
const currentAlign = alignClasses[align]
---

<div class:list={['flex flex-col', currentSize.gap, currentAlign, className]}>
  <h1
    class:list={[
      currentSize.title,
      'font-bold tracking-tight text-gray-900',
    ]}
  >
    {title}
  </h1>

  {showTagline && (
    <p
      class:list={[
        currentSize.tagline,
        'font-normal text-gray-600 max-w-2xl',
        align === 'center' && 'mx-auto',
      ]}
    >
      {tagline}
    </p>
  )}
</div>
```

### 4.3 Type export

```typescript
// src/types/components.ts (ou ajout à src/types/index.ts)

export type { Props as HeroTitleProps } from '@components/hero/HeroTitle.astro'
```

### 4.4 Utilisation du composant

#### 4.4.1 Utilisation basique

```astro
---
import HeroTitle from '@components/hero/HeroTitle.astro'
import { getEntry } from 'astro:content'

const heroData = await getEntry('hero', 'main')
---

<HeroTitle
  title={heroData.data.title}
  tagline={heroData.data.tagline}
/>
```

#### 4.4.2 Utilisation avec options

```astro
<HeroTitle
  title={heroData.data.title}
  tagline={heroData.data.tagline}
  align="left"
  size="md"
  showTagline={true}
  class="my-8"
/>
```

#### 4.4.3 Utilisation sans tagline

```astro
<HeroTitle
  title={heroData.data.title}
  tagline=""
  showTagline={false}
  size="sm"
/>
```

---

## 5. Design et style

### 5.1 Tokens de design

| Token | Mobile | Tablet (md) | Desktop (lg) | Variable Tailwind |
|-------|--------|-------------|--------------|-------------------|
| **Title font-size (lg)** | 1.875rem | 2.25rem | 3rem | `text-3xl md:text-4xl lg:text-5xl` |
| **Tagline font-size (lg)** | 1.125rem | 1.25rem | 1.5rem | `text-lg md:text-xl lg:text-2xl` |
| **Title color** | #111827 | - | - | `text-gray-900` |
| **Tagline color** | #4B5563 | - | - | `text-gray-600` |
| **Title weight** | 700 | - | - | `font-bold` |
| **Tagline weight** | 400 | - | - | `font-normal` |
| **Letter spacing** | -0.025em | - | - | `tracking-tight` |
| **Max width tagline** | 100% | 42rem | 42rem | `max-w-2xl` |
| **Gap title/tagline** | 1rem | - | - | `gap-4` |

### 5.2 Breakpoints

| Breakpoint | Largeur min | Ajustements |
|------------|-------------|-------------|
| **Mobile** | 0px | Tailles de base, centrage auto |
| **md (Tablet)** | 768px | Augmentation tailles texte |
| **lg (Desktop)** | 1024px | Tailles maximales |

### 5.3 États visuels

Le composant étant statique (pas d'interactivité), il n'a pas d'états hover/focus/active.

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Cas limites identifiés

| ID | Cas limite | Valeur/Situation | Comportement attendu | Test |
|----|------------|------------------|---------------------|------|
| CL-01 | Titre très long (80 chars) | `"AIAD : Un framework extrêmement complet pour le développement avec agents IA"` | Wrap naturel, pas de troncature | T-01 |
| CL-02 | Titre court (10 chars) | `"AIAD : Dev"` | Rendu normal, espacement conservé | T-02 |
| CL-03 | Tagline très longue (120 chars) | 120 caractères | Wrap dans max-w-2xl, lisible | T-03 |
| CL-04 | Tagline vide avec showTagline=true | `tagline=""` + `showTagline={true}` | `<p>` vide rendu (éviter si possible) | T-04 |
| CL-05 | Tagline avec showTagline=false | `showTagline={false}` | `<p>` non rendu | T-05 |
| CL-06 | Titre avec caractères spéciaux | `"AIAD : L'IA & vous — ensemble"` | Rendu correct, HTML échappé | T-06 |
| CL-07 | Titre avec emoji | `"AIAD 🚀 : Le framework"` | Rendu correct (UTF-8) | T-07 |
| CL-08 | Titre avec HTML injection | `"AIAD <script>alert('xss')</script>"` | HTML échappé automatiquement | T-08 |
| CL-09 | Props manquantes (title) | `<HeroTitle tagline="..." />` | Erreur TypeScript à la compilation | T-09 |
| CL-10 | Props manquantes (tagline) | `<HeroTitle title="..." />` | Erreur TypeScript à la compilation | T-10 |
| CL-11 | Align invalide | `align="invalid"` | Erreur TypeScript | T-11 |
| CL-12 | Size invalide | `size="extra-large"` | Erreur TypeScript | T-12 |
| CL-13 | Classe additionnelle | `class="my-custom-class"` | Classe appliquée au conteneur | T-13 |
| CL-14 | Viewports très étroits (< 320px) | Écran 280px | Texte wrap, pas d'overflow horizontal | T-14 |
| CL-15 | Mode sombre (futur) | `dark:` classes | Non implémenté MVP (prêt pour extension) | T-15 |

### 6.2 Validation des props

```typescript
// Runtime validation (optionnel, en développement)
if (import.meta.env.DEV) {
  if (!title || title.length < 10) {
    console.warn('[HeroTitle] Title must be at least 10 characters')
  }
  if (!tagline && showTagline) {
    console.warn('[HeroTitle] Tagline is empty but showTagline is true')
  }
}
```

### 6.3 Stratégie de fallback

| Situation | Fallback | Justification |
|-----------|----------|---------------|
| Title vide | Aucun (erreur TS) | Title est requis |
| Tagline vide + showTagline | Rendu `<p>` vide | Comportement prévisible |
| Size non reconnue | `'lg'` par défaut | Défaut sûr |
| Align non reconnu | `'center'` par défaut | Défaut sûr |

---

## 7. Exemples entrée/sortie

### 7.1 Rendu par défaut (toutes options)

**Entrée (Props) :**

```typescript
{
  title: "AIAD : Le framework pour développer avec des agents IA",
  tagline: "Structurez votre collaboration avec l'intelligence artificielle",
  align: 'center',
  size: 'lg',
  showTagline: true,
  class: ''
}
```

**Sortie (HTML) :**

```html
<div class="flex flex-col gap-4 text-center">
  <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
    AIAD : Le framework pour développer avec des agents IA
  </h1>
  <p class="text-lg md:text-xl lg:text-2xl font-normal text-gray-600 max-w-2xl mx-auto">
    Structurez votre collaboration avec l'intelligence artificielle
  </p>
</div>
```

### 7.2 Rendu taille petite, aligné à gauche

**Entrée (Props) :**

```typescript
{
  title: "AIAD : Le framework",
  tagline: "Développez avec l'IA",
  align: 'left',
  size: 'sm',
  showTagline: true
}
```

**Sortie (HTML) :**

```html
<div class="flex flex-col gap-2 text-left">
  <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
    AIAD : Le framework
  </h1>
  <p class="text-base md:text-lg font-normal text-gray-600 max-w-2xl">
    Développez avec l'IA
  </p>
</div>
```

### 7.3 Rendu sans tagline

**Entrée (Props) :**

```typescript
{
  title: "AIAD : Framework IA",
  tagline: "Non affiché",
  showTagline: false
}
```

**Sortie (HTML) :**

```html
<div class="flex flex-col gap-4 text-center">
  <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
    AIAD : Framework IA
  </h1>
</div>
```

### 7.4 Rendu avec caractères spéciaux (XSS protection)

**Entrée (Props) :**

```typescript
{
  title: "AIAD : Test <script>alert('xss')</script>",
  tagline: "L'IA & vous — ensemble"
}
```

**Sortie (HTML) :**

```html
<div class="flex flex-col gap-4 text-center">
  <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
    AIAD : Test &lt;script&gt;alert('xss')&lt;/script&gt;
  </h1>
  <p class="text-lg md:text-xl lg:text-2xl font-normal text-gray-600 max-w-2xl mx-auto">
    L'IA &amp; vous — ensemble
  </p>
</div>
```

---

## 8. Tests

### 8.1 Fichiers de test

| Type | Emplacement | Focus |
|------|-------------|-------|
| **Unitaires** | `tests/unit/components/hero-title.test.ts` | Rendu, props, classes |
| **E2E** | `tests/e2e/hero-title.spec.ts` | Intégration page, responsive |
| **Accessibilité** | `tests/e2e/accessibility.spec.ts` | RGAA AA, structure sémantique |

### 8.2 Suite de tests unitaires

```typescript
// tests/unit/components/hero-title.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import HeroTitle from '@components/hero/HeroTitle.astro'

describe('HeroTitle Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base
  const defaultProps = {
    title: 'AIAD : Le framework pour développer avec des agents IA',
    tagline: "Structurez votre collaboration avec l'intelligence artificielle",
  }

  describe('Rendu de base', () => {
    it('T-00: should render title in h1 tag', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('<h1')
      expect(result).toContain(defaultProps.title)
      expect(result).toContain('</h1>')
    })

    it('T-00b: should render tagline in p tag', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain(defaultProps.tagline)
      expect(result).toContain('</p>')
    })

    it('should have only one h1 tag', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      const h1Count = (result.match(/<h1/g) || []).length
      expect(h1Count).toBe(1)
    })
  })

  describe('Props: align', () => {
    it('should apply text-center class by default', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
    })

    it('should apply text-left class when align="left"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'left' },
      })

      expect(result).toContain('text-left')
      expect(result).not.toContain('text-center')
    })

    it('should apply text-right class when align="right"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'right' },
      })

      expect(result).toContain('text-right')
    })

    it('should apply mx-auto to tagline only when centered', async () => {
      const resultCentered = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'center' },
      })

      const resultLeft = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, align: 'left' },
      })

      expect(resultCentered).toContain('mx-auto')
      expect(resultLeft).not.toContain('mx-auto')
    })
  })

  describe('Props: size', () => {
    it('should apply lg size classes by default', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('lg:text-5xl')
      expect(result).toContain('lg:text-2xl')
    })

    it('should apply sm size classes when size="sm"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'sm' },
      })

      expect(result).toContain('text-2xl')
      expect(result).toContain('md:text-3xl')
      expect(result).not.toContain('lg:text-5xl')
    })

    it('should apply md size classes when size="md"', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'md' },
      })

      expect(result).toContain('text-3xl')
      expect(result).toContain('md:text-4xl')
    })

    it('should apply correct gap for each size', async () => {
      const resultSm = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'sm' },
      })
      const resultMd = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'md' },
      })
      const resultLg = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, size: 'lg' },
      })

      expect(resultSm).toContain('gap-2')
      expect(resultMd).toContain('gap-3')
      expect(resultLg).toContain('gap-4')
    })
  })

  describe('Props: showTagline', () => {
    it('T-05: should not render tagline when showTagline=false', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, showTagline: false },
      })

      expect(result).not.toContain('<p')
      expect(result).not.toContain(defaultProps.tagline)
    })

    it('should render tagline by default (showTagline=true)', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain(defaultProps.tagline)
    })
  })

  describe('Props: class', () => {
    it('T-13: should apply custom class to container', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })

    it('should preserve default classes when adding custom class', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
      expect(result).toContain('my-custom-class')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('T-01: should handle very long title (80 chars)', async () => {
      const longTitle = 'AIAD : ' + 'A'.repeat(73) // 80 chars
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: longTitle },
      })

      expect(result).toContain(longTitle)
    })

    it('T-02: should handle short title (10 chars)', async () => {
      const shortTitle = 'AIAD : Dev'
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: shortTitle },
      })

      expect(result).toContain(shortTitle)
    })

    it('T-03: should handle very long tagline (120 chars)', async () => {
      const longTagline = 'A'.repeat(120)
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, tagline: longTagline },
      })

      expect(result).toContain(longTagline)
      expect(result).toContain('max-w-2xl')
    })

    it('T-06: should handle special characters in title', async () => {
      const specialTitle = "AIAD : L'IA & vous — ensemble"
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: specialTitle },
      })

      // Astro échappe automatiquement les caractères HTML
      expect(result).toContain('L&#39;IA')
      expect(result).toContain('&amp;')
    })

    it('T-07: should handle emoji in title', async () => {
      const emojiTitle = 'AIAD 🚀 : Le framework IA'
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: emojiTitle },
      })

      expect(result).toContain('🚀')
    })

    it('T-08: should escape HTML injection in title', async () => {
      const xssTitle = "AIAD <script>alert('xss')</script>"
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, title: xssTitle },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('T-04: should render empty p tag when tagline is empty but showTagline=true', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: { ...defaultProps, tagline: '', showTagline: true },
      })

      expect(result).toContain('<p')
      expect(result).toContain('</p>')
    })
  })

  describe('Styling: Classes Tailwind', () => {
    it('should have font-bold on title', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      // Vérifier que le h1 a font-bold
      expect(result).toMatch(/<h1[^>]*class="[^"]*font-bold[^"]*"/)
    })

    it('should have text-gray-900 on title', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toMatch(/<h1[^>]*class="[^"]*text-gray-900[^"]*"/)
    })

    it('should have text-gray-600 on tagline', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toMatch(/<p[^>]*class="[^"]*text-gray-600[^"]*"/)
    })

    it('should have tracking-tight on title', async () => {
      const result = await container.renderToString(HeroTitle, {
        props: defaultProps,
      })

      expect(result).toMatch(/<h1[^>]*class="[^"]*tracking-tight[^"]*"/)
    })
  })
})
```

### 8.3 Suite de tests E2E (Playwright)

```typescript
// tests/e2e/hero-title.spec.ts

import { test, expect } from '@playwright/test'

test.describe('HeroTitle Component - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers une page contenant le composant
    await page.goto('/')
  })

  test('should display title as h1', async ({ page }) => {
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText('AIAD')
  })

  test('should display tagline below title', async ({ page }) => {
    const h1 = page.locator('h1')
    const tagline = page.locator('h1 + p, h1 ~ p').first()

    await expect(h1).toBeVisible()
    await expect(tagline).toBeVisible()
  })

  test('T-14: should not have horizontal overflow on narrow viewport', async ({ page }) => {
    // Viewport très étroit
    await page.setViewportSize({ width: 280, height: 600 })

    const body = page.locator('body')
    const bodyWidth = await body.evaluate((el) => el.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test('should be responsive across breakpoints', async ({ page }) => {
    const h1 = page.locator('h1')

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(h1).toBeVisible()

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(h1).toBeVisible()

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(h1).toBeVisible()
  })
})
```

### 8.4 Tests d'accessibilité

```typescript
// tests/e2e/accessibility.spec.ts (ajout)

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('HeroTitle Accessibility', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('h1')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')

    // Vérifier qu'il n'y a qu'un seul h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // Le h1 doit être le premier heading de la page
    const firstHeading = await page.locator('h1, h2, h3, h4, h5, h6').first()
    expect(await firstHeading.evaluate((el) => el.tagName)).toBe('H1')
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')

    const h1 = page.locator('h1')
    const computedStyle = await h1.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
      }
    })

    // text-gray-900 = rgb(17, 24, 39)
    expect(computedStyle.color).toBe('rgb(17, 24, 39)')
  })
})
```

### 8.5 Matrice de couverture

| Aspect | Tests unitaires | Tests E2E | Couverture |
|--------|-----------------|-----------|------------|
| Rendu basique | T-00, T-00b | ✅ | 100% |
| Props align | 4 tests | - | 100% |
| Props size | 4 tests | - | 100% |
| Props showTagline | 2 tests | - | 100% |
| Props class | 2 tests | - | 100% |
| Cas limites contenu | T-01 à T-08 | T-14 | 100% |
| Styling Tailwind | 4 tests | - | 100% |
| Responsive | - | 3 tests | 100% |
| Accessibilité | - | 3 tests | 100% |

---

## 9. Critères d'acceptation

- [ ] **CA-01** : Le composant `HeroTitle.astro` existe dans `src/components/hero/`
- [ ] **CA-02** : Le composant rend un `<h1>` contenant le titre passé en prop
- [ ] **CA-03** : Le composant rend un `<p>` contenant la tagline (quand `showTagline=true`)
- [ ] **CA-04** : Les props `align`, `size`, `showTagline`, `class` fonctionnent correctement
- [ ] **CA-05** : Le composant est responsive (mobile-first)
- [ ] **CA-06** : Le composant n'émet pas de JavaScript client (static)
- [ ] **CA-07** : Les textes sont correctement échappés (protection XSS)
- [ ] **CA-08** : Le composant respecte RGAA AA (contraste, structure)
- [ ] **CA-09** : TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] **CA-10** : ESLint passe sans warning (`pnpm lint`)
- [ ] **CA-11** : Tous les tests unitaires passent
- [ ] **CA-12** : Tous les tests E2E passent

---

## 10. Definition of Done

- [ ] Composant implémenté dans `src/components/hero/HeroTitle.astro`
- [ ] Interface Props documentée avec JSDoc
- [ ] Tests unitaires écrits et passants (`tests/unit/components/hero-title.test.ts`)
- [ ] Tests E2E écrits et passants (`tests/e2e/hero-title.spec.ts`)
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Composant visuellement vérifié sur mobile, tablet, desktop
- [ ] Accessibilité vérifiée (axe-core)
- [ ] Code reviewé par un pair

---

## 11. Notes d'implémentation

### 11.1 Points d'attention

1. **Un seul H1 par page** : Ce composant contient le H1 de la page. S'assurer qu'il n'est utilisé qu'une fois par page.

2. **Échappement automatique** : Astro échappe automatiquement le contenu des variables dans les templates. Pas besoin de sanitization manuelle.

3. **Pas de JavaScript** : Ce composant est 100% statique. Aucune directive `client:*` ne doit être utilisée.

4. **Extensibilité dark mode** : Les classes `dark:` peuvent être ajoutées ultérieurement sans modification structurelle.

### 11.2 Extensions futures

| Extension | Priorité | Impact |
|-----------|----------|--------|
| Mode sombre | Moyenne | Ajout classes `dark:text-white`, `dark:text-gray-300` |
| Animation d'entrée | Basse | Ajout classes ou directive `client:visible` |
| Highlight du mot AIAD | Basse | Split du titre et span avec couleur accent |

---

## 12. Références

| Document | Lien |
|----------|------|
| User Story US-001 | [spec.md](./spec.md) |
| Modèle HeroContent (T-001-B1) | [T-001-B1-modele-donnees-HeroContent.md](./T-001-B1-modele-donnees-HeroContent.md) |
| Données JSON (T-001-B4) | [T-001-B4-donnees-JSON-hero-content-francais.md](./T-001-B4-donnees-JSON-hero-content-francais.md) |
| Architecture technique | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Guide Claude | [CLAUDE.md](../CLAUDE.md) |
| Astro Components | [docs.astro.build/components](https://docs.astro.build/en/core-concepts/astro-components/) |
| Tailwind CSS | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| Astro Container API | [docs.astro.build/container](https://docs.astro.build/en/reference/container-reference/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 02/02/2026 | Création initiale complète |
