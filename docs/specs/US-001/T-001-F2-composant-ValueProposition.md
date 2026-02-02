# T-001-F2 : Créer le composant ValueProposition

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

Créer le composant Astro `ValueProposition` qui affiche la proposition de valeur principale du framework AIAD, en garantissant :

- **Clarté du message** : Communiquer le bénéfice principal en une phrase impactante
- **Sémantique HTML** : Utilisation appropriée des balises paragraphe
- **Accessibilité** : Conforme RGAA AA (contraste, lisibilité)
- **Responsive** : Adaptation mobile-first selon les breakpoints
- **Performance** : Rendu statique sans JavaScript client
- **Type-safety** : Props typées avec TypeScript strict
- **Design system** : Intégration Tailwind CSS cohérente avec HeroTitle

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
│   └── hero/                      # Composants hero section
│       ├── HeroTitle.astro        # ✅ Implémenté (T-001-F1)
│       └── ValueProposition.astro # ← COMPOSANT À CRÉER
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
| **Composant** | `HeroTitle.astro` | `@components/hero/` | ✅ Disponible (référence design) |

### 2.4 Différence avec HeroTitle

| Aspect | HeroTitle | ValueProposition |
|--------|-----------|------------------|
| **Rôle** | Identifier le produit (titre + accroche) | Expliquer le bénéfice principal |
| **Balises** | `<h1>` + `<p>` | `<p>` uniquement |
| **Contenu source** | `title` + `tagline` | `valueProposition` |
| **Style** | Gros texte impactant | Texte descriptif, plus petit |
| **Position** | Premier bloc hero | Sous HeroTitle, avant CTA |

---

## 3. Spécifications fonctionnelles

### 3.1 Description du composant

Le `ValueProposition` est le composant atomique responsable de l'affichage de la proposition de valeur dans la hero section :

| Élément | Balise HTML | Source de données | Rôle |
|---------|-------------|-------------------|------|
| Proposition de valeur | `<p>` | `HeroContent.valueProposition` | Expliquer le bénéfice principal en 1-2 phrases |

### 3.2 Comportement attendu

#### 3.2.1 Rendu par défaut

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│     Une méthodologie éprouvée pour intégrer les agents IA dans votre       │
│     workflow de développement et multiplier votre productivité.            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

#### 3.2.2 Hiérarchie visuelle

| Élément | Taille desktop | Taille mobile | Poids | Couleur |
|---------|----------------|---------------|-------|---------|
| Value Proposition | `text-lg` (1.125rem) | `text-base` (1rem) | `font-normal` | `text-gray-600` |

#### 3.2.3 Contrainte de largeur

Le texte doit être contraint en largeur pour assurer une lecture confortable :

| Viewport | Largeur max | Justification |
|----------|-------------|---------------|
| Mobile | 100% | Pleine largeur avec padding |
| Tablet/Desktop | `max-w-3xl` (48rem) | ~65-75 caractères par ligne (optimal) |

### 3.3 Variantes

Le composant supporte les variantes suivantes :

| Variante | Prop | Valeur par défaut | Description |
|----------|------|-------------------|-------------|
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | Alignement du texte |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Taille du texte |
| `emphasis` | `'normal' \| 'strong' \| 'subtle'` | `'normal'` | Niveau de mise en avant |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'lg'` | Contrainte de largeur |

### 3.4 Accessibilité (RGAA AA)

| Critère | Exigence | Implémentation |
|---------|----------|----------------|
| **3.1** Contraste texte | Ratio ≥ 4.5:1 | `text-gray-600` sur fond clair (ratio ~5.74:1) |
| **8.1** Structure | Ordre logique | `<p>` après le titre |
| **10.1** Responsive | Lisible sur tous devices | Tailles responsives, contrainte largeur |
| **10.6** Interlignage | 1.5 minimum | `leading-relaxed` (1.625) |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript des Props

```typescript
// src/components/hero/ValueProposition.astro - Frontmatter

/**
 * Props du composant ValueProposition
 */
export interface ValuePropositionProps {
  /**
   * Texte de la proposition de valeur
   * Correspond à HeroContent.valueProposition
   * Doit se terminer par un point (validé par le schéma)
   * @minLength 20
   * @maxLength 200
   */
  text: string

  /**
   * Alignement horizontal du texte
   * @default 'center'
   */
  align?: 'left' | 'center' | 'right'

  /**
   * Taille du texte
   * - sm: text-sm/base
   * - md: text-base/lg (défaut)
   * - lg: text-lg/xl
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * Niveau de mise en avant visuelle
   * - subtle: couleur plus claire (gray-500)
   * - normal: couleur standard (gray-600)
   * - strong: couleur plus foncée (gray-700) + font-medium
   * @default 'normal'
   */
  emphasis?: 'subtle' | 'normal' | 'strong'

  /**
   * Contrainte de largeur maximale
   * - sm: max-w-xl (36rem)
   * - md: max-w-2xl (42rem)
   * - lg: max-w-3xl (48rem) - défaut
   * - full: pas de contrainte
   * @default 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'full'

  /**
   * Classes CSS additionnelles pour le conteneur
   */
  class?: string
}
```

### 4.2 Implémentation du composant

```astro
---
// src/components/hero/ValueProposition.astro

export interface Props {
  text: string
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
  emphasis?: 'subtle' | 'normal' | 'strong'
  maxWidth?: 'sm' | 'md' | 'lg' | 'full'
  class?: string
}

const {
  text,
  align = 'center',
  size = 'md',
  emphasis = 'normal',
  maxWidth = 'lg',
  class: className = '',
} = Astro.props

// Mapping des alignements
const alignClasses = {
  left: 'text-left',
  center: 'text-center mx-auto',
  right: 'text-right ml-auto',
}

// Mapping des tailles
const sizeClasses = {
  sm: 'text-sm md:text-base',
  md: 'text-base md:text-lg',
  lg: 'text-lg md:text-xl',
}

// Mapping des emphases
const emphasisClasses = {
  subtle: 'text-gray-500 font-normal',
  normal: 'text-gray-600 font-normal',
  strong: 'text-gray-700 font-medium',
}

// Mapping des largeurs max
const maxWidthClasses = {
  sm: 'max-w-xl',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  full: '',
}

const currentAlign = alignClasses[align]
const currentSize = sizeClasses[size]
const currentEmphasis = emphasisClasses[emphasis]
const currentMaxWidth = maxWidthClasses[maxWidth]
---

<p
  class:list={[
    'leading-relaxed',
    currentAlign,
    currentSize,
    currentEmphasis,
    currentMaxWidth,
    className,
  ]}
>
  {text}
</p>
```

### 4.3 Type export

```typescript
// src/types/components.ts (ou ajout à src/types/index.ts)

export type { Props as ValuePropositionProps } from '@components/hero/ValueProposition.astro'
```

### 4.4 Utilisation du composant

#### 4.4.1 Utilisation basique

```astro
---
import ValueProposition from '@components/hero/ValueProposition.astro'
import { getEntry } from 'astro:content'

const heroData = await getEntry('hero', 'main')
---

<ValueProposition text={heroData.data.valueProposition} />
```

#### 4.4.2 Utilisation avec options

```astro
<ValueProposition
  text={heroData.data.valueProposition}
  align="left"
  size="lg"
  emphasis="strong"
  maxWidth="md"
  class="my-6"
/>
```

#### 4.4.3 Utilisation dans le contexte HeroSection

```astro
---
import HeroTitle from '@components/hero/HeroTitle.astro'
import ValueProposition from '@components/hero/ValueProposition.astro'
import { getEntry } from 'astro:content'

const heroData = await getEntry('hero', 'main')
---

<section class="hero">
  <HeroTitle
    title={heroData.data.title}
    tagline={heroData.data.tagline}
  />

  <ValueProposition
    text={heroData.data.valueProposition}
    class="mt-6"
  />

  <!-- CTA Button viendra ici (T-001-F3) -->
</section>
```

---

## 5. Design et style

### 5.1 Tokens de design

| Token | Mobile | Tablet (md) | Desktop (lg) | Variable Tailwind |
|-------|--------|-------------|--------------|-------------------|
| **Font-size (md)** | 1rem | 1.125rem | 1.125rem | `text-base md:text-lg` |
| **Line-height** | 1.625 | 1.625 | 1.625 | `leading-relaxed` |
| **Color (normal)** | #4B5563 | - | - | `text-gray-600` |
| **Color (subtle)** | #6B7280 | - | - | `text-gray-500` |
| **Color (strong)** | #374151 | - | - | `text-gray-700` |
| **Max width (lg)** | 100% | 48rem | 48rem | `max-w-3xl` |
| **Font weight (normal)** | 400 | - | - | `font-normal` |
| **Font weight (strong)** | 500 | - | - | `font-medium` |

### 5.2 Breakpoints

| Breakpoint | Largeur min | Ajustements |
|------------|-------------|-------------|
| **Mobile** | 0px | Tailles de base, pleine largeur |
| **md (Tablet)** | 768px | Augmentation taille texte |
| **lg (Desktop)** | 1024px | Pas de changement additionnel |

### 5.3 États visuels

Le composant étant statique (pas d'interactivité), il n'a pas d'états hover/focus/active.

### 5.4 Cohérence avec HeroTitle

| Aspect | HeroTitle | ValueProposition |
|--------|-----------|------------------|
| **Container** | `flex flex-col` | `<p>` simple |
| **Alignment** | `text-{align}` | `text-{align} mx-auto` |
| **Color scheme** | `gray-900` / `gray-600` | `gray-600` (normal) |
| **Responsive pattern** | `text-base md:text-lg lg:text-xl` | `text-base md:text-lg` |
| **Width constraint** | `max-w-2xl` (tagline) | `max-w-3xl` (plus large) |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Cas limites identifiés

| ID | Cas limite | Valeur/Situation | Comportement attendu | Test |
|----|------------|------------------|---------------------|------|
| CL-01 | Texte très long (200 chars) | Texte de 200 caractères | Wrap naturel dans max-width, pas de troncature | T-01 |
| CL-02 | Texte court (20 chars) | `"Productivité accrue."` | Rendu normal, centré | T-02 |
| CL-03 | Texte avec retours à la ligne | `"Ligne 1.\nLigne 2."` | Rendu avec `\n` préservé (whitespace) | T-03 |
| CL-04 | Texte avec caractères spéciaux | `"L'IA & vous — ensemble."` | Rendu correct, HTML échappé | T-04 |
| CL-05 | Texte avec emoji | `"Boostez votre productivité 🚀."` | Rendu correct (UTF-8) | T-05 |
| CL-06 | Texte avec HTML injection | `"Test <script>alert('xss')</script>."` | HTML échappé automatiquement | T-06 |
| CL-07 | Texte vide | `text=""` | Rendu `<p>` vide (à éviter) | T-07 |
| CL-08 | Props optionnelles manquantes | Sans align/size/emphasis | Valeurs par défaut appliquées | T-08 |
| CL-09 | Align invalide | `align="justify"` | Erreur TypeScript | T-09 |
| CL-10 | Size invalide | `size="xl"` | Erreur TypeScript | T-10 |
| CL-11 | Emphasis invalide | `emphasis="bold"` | Erreur TypeScript | T-11 |
| CL-12 | MaxWidth invalide | `maxWidth="xl"` | Erreur TypeScript | T-12 |
| CL-13 | Classe additionnelle | `class="my-custom-class"` | Classe appliquée au `<p>` | T-13 |
| CL-14 | Viewports très étroits (< 320px) | Écran 280px | Texte wrap, pas d'overflow horizontal | T-14 |
| CL-15 | Texte sans point final | `"Texte sans point"` | Rendu normal (validation schema) | T-15 |
| CL-16 | Multiple espaces consécutifs | `"Mot   avec   espaces"` | Espaces préservés (HTML collapse) | T-16 |
| CL-17 | Combinaison align=left + mx-auto | `align="left"` | Pas de mx-auto appliqué | T-17 |

### 6.2 Validation des props

```typescript
// Runtime validation (optionnel, en développement)
if (import.meta.env.DEV) {
  if (!text || text.trim().length === 0) {
    console.warn('[ValueProposition] Text should not be empty')
  }
  if (text && text.length < 20) {
    console.warn('[ValueProposition] Text should be at least 20 characters for impact')
  }
  if (text && !text.trim().endsWith('.')) {
    console.warn('[ValueProposition] Text should end with a period for readability')
  }
}
```

### 6.3 Stratégie de fallback

| Situation | Fallback | Justification |
|-----------|----------|---------------|
| Text vide | Rendu `<p>` vide | Comportement prévisible (éviter en amont) |
| Size non reconnue | `'md'` par défaut | Défaut sûr |
| Align non reconnu | `'center'` par défaut | Défaut sûr |
| Emphasis non reconnu | `'normal'` par défaut | Défaut sûr |
| MaxWidth non reconnu | `'lg'` par défaut | Défaut sûr |

---

## 7. Exemples entrée/sortie

### 7.1 Rendu par défaut

**Entrée (Props) :**

```typescript
{
  text: "Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.",
  align: 'center',
  size: 'md',
  emphasis: 'normal',
  maxWidth: 'lg',
  class: ''
}
```

**Sortie (HTML) :**

```html
<p class="leading-relaxed text-center mx-auto text-base md:text-lg text-gray-600 font-normal max-w-3xl">
  Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.
</p>
```

### 7.2 Rendu avec emphasis strong, aligné à gauche

**Entrée (Props) :**

```typescript
{
  text: "Transformez votre façon de coder avec les agents IA.",
  align: 'left',
  size: 'lg',
  emphasis: 'strong',
  maxWidth: 'md'
}
```

**Sortie (HTML) :**

```html
<p class="leading-relaxed text-left text-lg md:text-xl text-gray-700 font-medium max-w-2xl">
  Transformez votre façon de coder avec les agents IA.
</p>
```

### 7.3 Rendu subtil, petite taille

**Entrée (Props) :**

```typescript
{
  text: "Une approche structurée pour l'IA.",
  align: 'center',
  size: 'sm',
  emphasis: 'subtle',
  maxWidth: 'sm'
}
```

**Sortie (HTML) :**

```html
<p class="leading-relaxed text-center mx-auto text-sm md:text-base text-gray-500 font-normal max-w-xl">
  Une approche structurée pour l'IA.
</p>
```

### 7.4 Rendu avec caractères spéciaux (XSS protection)

**Entrée (Props) :**

```typescript
{
  text: "L'IA & vous — ensemble. <script>alert('xss')</script>",
  align: 'center'
}
```

**Sortie (HTML) :**

```html
<p class="leading-relaxed text-center mx-auto text-base md:text-lg text-gray-600 font-normal max-w-3xl">
  L'IA &amp; vous — ensemble. &lt;script&gt;alert('xss')&lt;/script&gt;
</p>
```

### 7.5 Rendu pleine largeur avec classe custom

**Entrée (Props) :**

```typescript
{
  text: "Une vision claire pour votre transformation digitale.",
  align: 'center',
  maxWidth: 'full',
  class: 'mt-8 mb-4 px-4'
}
```

**Sortie (HTML) :**

```html
<p class="leading-relaxed text-center mx-auto text-base md:text-lg text-gray-600 font-normal mt-8 mb-4 px-4">
  Une vision claire pour votre transformation digitale.
</p>
```

---

## 8. Tests

### 8.1 Fichiers de test

| Type | Emplacement | Focus |
|------|-------------|-------|
| **Unitaires** | `tests/unit/components/value-proposition.test.ts` | Rendu, props, classes |
| **E2E** | `tests/e2e/value-proposition.spec.ts` | Intégration page, responsive |
| **Accessibilité** | `tests/e2e/accessibility.spec.ts` | Contraste, structure |

### 8.2 Suite de tests unitaires

```typescript
// tests/unit/components/value-proposition.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import ValueProposition from '@components/hero/ValueProposition.astro'

describe('ValueProposition Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base
  const defaultProps = {
    text: "Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.",
  }

  describe('Rendu de base', () => {
    it('T-00: should render text in p tag', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain(defaultProps.text)
      expect(result).toContain('</p>')
    })

    it('should have only one p tag', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      const pCount = (result.match(/<p/g) || []).length
      expect(pCount).toBe(1)
    })

    it('should not contain any heading tags', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).not.toMatch(/<h[1-6]/)
    })
  })

  describe('Props: align', () => {
    it('should apply text-center and mx-auto by default', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
      expect(result).toContain('mx-auto')
    })

    it('T-17: should apply text-left without mx-auto when align="left"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, align: 'left' },
      })

      expect(result).toContain('text-left')
      expect(result).not.toContain('mx-auto')
    })

    it('should apply text-right and ml-auto when align="right"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, align: 'right' },
      })

      expect(result).toContain('text-right')
      expect(result).toContain('ml-auto')
    })
  })

  describe('Props: size', () => {
    it('should apply md size classes by default', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-base')
      expect(result).toContain('md:text-lg')
    })

    it('should apply sm size classes when size="sm"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, size: 'sm' },
      })

      expect(result).toContain('text-sm')
      expect(result).toContain('md:text-base')
    })

    it('should apply lg size classes when size="lg"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, size: 'lg' },
      })

      expect(result).toContain('text-lg')
      expect(result).toContain('md:text-xl')
    })
  })

  describe('Props: emphasis', () => {
    it('should apply normal emphasis by default', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-600')
      expect(result).toContain('font-normal')
    })

    it('should apply subtle emphasis classes', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, emphasis: 'subtle' },
      })

      expect(result).toContain('text-gray-500')
      expect(result).toContain('font-normal')
    })

    it('should apply strong emphasis classes', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, emphasis: 'strong' },
      })

      expect(result).toContain('text-gray-700')
      expect(result).toContain('font-medium')
    })
  })

  describe('Props: maxWidth', () => {
    it('should apply max-w-3xl by default (lg)', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('max-w-3xl')
    })

    it('should apply max-w-xl when maxWidth="sm"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, maxWidth: 'sm' },
      })

      expect(result).toContain('max-w-xl')
    })

    it('should apply max-w-2xl when maxWidth="md"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, maxWidth: 'md' },
      })

      expect(result).toContain('max-w-2xl')
    })

    it('should not apply max-width class when maxWidth="full"', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, maxWidth: 'full' },
      })

      expect(result).not.toContain('max-w-')
    })
  })

  describe('Props: class', () => {
    it('T-13: should apply custom class', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })

    it('should preserve default classes when adding custom class', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { ...defaultProps, class: 'mt-8' },
      })

      expect(result).toContain('leading-relaxed')
      expect(result).toContain('mt-8')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('T-01: should handle very long text (200 chars)', async () => {
      const longText = 'A'.repeat(195) + ' fin.'
      const result = await container.renderToString(ValueProposition, {
        props: { text: longText },
      })

      expect(result).toContain(longText)
      expect(result).toContain('max-w-3xl')
    })

    it('T-02: should handle short text (20 chars)', async () => {
      const shortText = 'Productivité accrue.'
      const result = await container.renderToString(ValueProposition, {
        props: { text: shortText },
      })

      expect(result).toContain(shortText)
    })

    it('T-04: should handle special characters', async () => {
      const specialText = "L'IA & vous — ensemble."
      const result = await container.renderToString(ValueProposition, {
        props: { text: specialText },
      })

      // Astro échappe automatiquement les caractères HTML
      expect(result).toContain('L&#39;IA')
      expect(result).toContain('&amp;')
    })

    it('T-05: should handle emoji', async () => {
      const emojiText = 'Boostez votre productivité 🚀.'
      const result = await container.renderToString(ValueProposition, {
        props: { text: emojiText },
      })

      expect(result).toContain('🚀')
    })

    it('T-06: should escape HTML injection', async () => {
      const xssText = "Test <script>alert('xss')</script>."
      const result = await container.renderToString(ValueProposition, {
        props: { text: xssText },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('T-07: should render empty p tag when text is empty', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: { text: '' },
      })

      expect(result).toContain('<p')
      expect(result).toContain('</p>')
    })

    it('T-08: should apply all default values when optional props missing', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
      expect(result).toContain('mx-auto')
      expect(result).toContain('text-base')
      expect(result).toContain('md:text-lg')
      expect(result).toContain('text-gray-600')
      expect(result).toContain('font-normal')
      expect(result).toContain('max-w-3xl')
    })
  })

  describe('Styling: Classes Tailwind', () => {
    it('should always have leading-relaxed for readability', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: defaultProps,
      })

      expect(result).toMatch(/<p[^>]*class="[^"]*leading-relaxed[^"]*"/)
    })

    it('should apply all classes to the p element', async () => {
      const result = await container.renderToString(ValueProposition, {
        props: {
          ...defaultProps,
          align: 'center',
          size: 'md',
          emphasis: 'normal',
          maxWidth: 'lg',
          class: 'custom',
        },
      })

      // Vérifier que toutes les classes sont sur le <p>
      expect(result).toMatch(/<p[^>]*class="[^"]*leading-relaxed[^"]*"/)
      expect(result).toMatch(/<p[^>]*class="[^"]*text-center[^"]*"/)
      expect(result).toMatch(/<p[^>]*class="[^"]*custom[^"]*"/)
    })
  })
})
```

### 8.3 Suite de tests E2E (Playwright)

```typescript
// tests/e2e/value-proposition.spec.ts

import { test, expect } from '@playwright/test'

test.describe('ValueProposition Component - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers une page contenant le composant
    await page.goto('/')
  })

  test('should display value proposition text', async ({ page }) => {
    // Le texte de la value proposition doit être visible
    const valueProp = page.locator('p:has-text("méthodologie")')
    await expect(valueProp).toBeVisible()
  })

  test('should be positioned below the title', async ({ page }) => {
    const h1 = page.locator('h1').first()
    const valueProp = page.locator('p:has-text("méthodologie")').first()

    const h1Box = await h1.boundingBox()
    const valuePropBox = await valueProp.boundingBox()

    expect(valuePropBox?.y).toBeGreaterThan(h1Box?.y ?? 0)
  })

  test('T-14: should not have horizontal overflow on narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 600 })

    const body = page.locator('body')
    const bodyWidth = await body.evaluate((el) => el.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test('should be responsive across breakpoints', async ({ page }) => {
    const valueProp = page.locator('p:has-text("méthodologie")').first()

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(valueProp).toBeVisible()

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(valueProp).toBeVisible()

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(valueProp).toBeVisible()
  })

  test('should respect max-width constraint on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    const valueProp = page.locator('p:has-text("méthodologie")').first()
    const box = await valueProp.boundingBox()

    // max-w-3xl = 48rem = 768px (avec 16px font-size)
    expect(box?.width).toBeLessThanOrEqual(768)
  })
})
```

### 8.4 Tests d'accessibilité

```typescript
// tests/e2e/accessibility.spec.ts (ajout)

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('ValueProposition Accessibility', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('p')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')

    const valueProp = page.locator('p:has-text("méthodologie")').first()
    const computedStyle = await valueProp.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
      }
    })

    // text-gray-600 = rgb(75, 85, 99)
    expect(computedStyle.color).toBe('rgb(75, 85, 99)')
  })

  test('should have proper line height for readability', async ({ page }) => {
    await page.goto('/')

    const valueProp = page.locator('p:has-text("méthodologie")').first()
    const lineHeight = await valueProp.evaluate((el) => {
      return window.getComputedStyle(el).lineHeight
    })

    // leading-relaxed = 1.625
    const fontSize = await valueProp.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize)
    })

    // Line height devrait être >= 1.5 * fontSize
    const lineHeightValue = parseFloat(lineHeight)
    expect(lineHeightValue).toBeGreaterThanOrEqual(fontSize * 1.5)
  })
})
```

### 8.5 Matrice de couverture

| Aspect | Tests unitaires | Tests E2E | Couverture |
|--------|-----------------|-----------|------------|
| Rendu basique | T-00, T-00b | ✅ | 100% |
| Props align | 3 tests | - | 100% |
| Props size | 3 tests | - | 100% |
| Props emphasis | 3 tests | - | 100% |
| Props maxWidth | 4 tests | ✅ | 100% |
| Props class | 2 tests | - | 100% |
| Cas limites contenu | T-01 à T-08 | T-14 | 100% |
| Styling Tailwind | 2 tests | - | 100% |
| Responsive | - | 3 tests | 100% |
| Accessibilité | - | 3 tests | 100% |

---

## 9. Critères d'acceptation

- [ ] **CA-01** : Le composant `ValueProposition.astro` existe dans `src/components/hero/`
- [ ] **CA-02** : Le composant rend un `<p>` contenant le texte passé en prop
- [ ] **CA-03** : Les props `align`, `size`, `emphasis`, `maxWidth`, `class` fonctionnent correctement
- [ ] **CA-04** : Le composant applique `leading-relaxed` pour la lisibilité
- [ ] **CA-05** : Le composant est responsive (mobile-first)
- [ ] **CA-06** : Le composant n'émet pas de JavaScript client (static)
- [ ] **CA-07** : Les textes sont correctement échappés (protection XSS)
- [ ] **CA-08** : Le composant respecte RGAA AA (contraste ≥ 4.5:1)
- [ ] **CA-09** : TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] **CA-10** : ESLint passe sans warning (`pnpm lint`)
- [ ] **CA-11** : Tous les tests unitaires passent
- [ ] **CA-12** : Tous les tests E2E passent

---

## 10. Definition of Done

- [ ] Composant implémenté dans `src/components/hero/ValueProposition.astro`
- [ ] Interface Props documentée avec JSDoc
- [ ] Tests unitaires écrits et passants (`tests/unit/components/value-proposition.test.ts`)
- [ ] Tests E2E écrits et passants (`tests/e2e/value-proposition.spec.ts`)
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Composant visuellement vérifié sur mobile, tablet, desktop
- [ ] Accessibilité vérifiée (axe-core)
- [ ] Code reviewé par un pair

---

## 11. Notes d'implémentation

### 11.1 Points d'attention

1. **Pas de balise titre** : Ce composant ne doit contenir que des `<p>`, pas de `<h1>` à `<h6>`. Le titre est géré par `HeroTitle`.

2. **Échappement automatique** : Astro échappe automatiquement le contenu des variables dans les templates. Pas besoin de sanitization manuelle.

3. **Pas de JavaScript** : Ce composant est 100% statique. Aucune directive `client:*` ne doit être utilisée.

4. **Cohérence avec HeroTitle** : Les valeurs par défaut (`align: center`, couleurs gray) sont cohérentes avec HeroTitle.

5. **Contrainte de largeur** : Utiliser `mx-auto` uniquement avec `align: center` pour éviter des conflits de positionnement.

### 11.2 Extensions futures

| Extension | Priorité | Impact |
|-----------|----------|--------|
| Mode sombre | Moyenne | Ajout classes `dark:text-gray-300`, `dark:text-gray-400`, `dark:text-gray-200` |
| Support multi-paragraphes | Basse | Passer un array de textes au lieu d'un string |
| Animation d'entrée | Basse | Ajout directive `client:visible` avec animation fade-in |
| Highlight de mots-clés | Basse | Parsing du texte pour wrapping de certains mots |

### 11.3 Relation avec les autres composants

```
HeroSection (T-001-F8)
├── HeroTitle (T-001-F1) ✅
│   ├── <h1> title
│   └── <p> tagline
├── ValueProposition (T-001-F2) ← CE COMPOSANT
│   └── <p> valueProposition
├── CTAButton (T-001-F3)
│   └── <button> ou <a>
├── BenefitsList (T-001-F5)
│   └── BenefitCard[] (T-001-F4)
└── StatsRow (T-001-F7)
    └── StatDisplay[] (T-001-F6)
```

---

## 12. Références

| Document | Lien |
|----------|------|
| User Story US-001 | [spec.md](./spec.md) |
| Modèle HeroContent (T-001-B1) | [T-001-B1-modele-donnees-HeroContent.md](./T-001-B1-modele-donnees-HeroContent.md) |
| Données JSON (T-001-B4) | [T-001-B4-donnees-JSON-hero-content-francais.md](./T-001-B4-donnees-JSON-hero-content-francais.md) |
| Composant HeroTitle (T-001-F1) | [T-001-F1-composant-HeroTitle.md](./T-001-F1-composant-HeroTitle.md) |
| Architecture technique | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Guide Claude | [CLAUDE.md](../../CLAUDE.md) |
| Astro Components | [docs.astro.build/components](https://docs.astro.build/en/core-concepts/astro-components/) |
| Tailwind CSS | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| Astro Container API | [docs.astro.build/container](https://docs.astro.build/en/reference/container-reference/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 02/02/2026 | Création initiale complète |
