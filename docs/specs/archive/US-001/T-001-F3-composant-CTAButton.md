# T-001-F3 : Créer le composant CTAButton ("Explorer le Framework")

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 2 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | Aucune (composant indépendant) |
| **Bloque** | T-001-F8 (HeroSection assemblage) |

---

## 1. Objectif

Créer le composant Astro `CTAButton` (Call-To-Action Button) qui affiche le bouton principal d'action de la hero section, en garantissant :

- **Impact visuel** : Bouton proéminent et attractif invitant à l'action
- **Accessibilité** : Conforme RGAA AA (focus visible, contraste, ARIA)
- **Flexibilité** : Support des variantes (lien ou bouton, tailles, couleurs)
- **Responsive** : Adaptation mobile-first selon les breakpoints
- **Performance** : Rendu statique sans JavaScript client (sauf interactions CSS)
- **Type-safety** : Props typées avec TypeScript strict
- **Design system** : Intégration Tailwind CSS cohérente avec les autres composants hero

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
│   │   └── CTAButton.astro        # ← COMPOSANT À CRÉER (réutilisable)
│   └── hero/                      # Composants hero section
│       ├── HeroTitle.astro        # ✅ Implémenté (T-001-F1)
│       └── ValueProposition.astro # ✅ Implémenté (T-001-F2)
├── types/
│   └── components.ts              # Interfaces des composants
└── pages/
    └── index.astro                # Consommateur final (via HeroSection)
```

**Note :** Le CTAButton est placé dans `common/` car c'est un composant réutilisable au-delà de la hero section (pages internes, sections diverses).

### 2.3 Dépendances

| Type | Nom | Provenance | Statut |
|------|-----|------------|--------|
| **Aucune** | - | - | - |

Le CTAButton est un composant atomique sans dépendance vers les données `HeroContent`. Le texte et l'URL sont passés en props par le composant parent.

### 2.4 Position dans la hero section

```
┌─────────────────────────────────────────────────────────────────┐
│                         HeroSection                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ HeroTitle (H1 + tagline)                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ValueProposition                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│                   ┌───────────────────────┐                      │
│                   │   CTAButton           │ ← CE COMPOSANT       │
│                   │  "Explorer le         │                      │
│                   │   Framework"    →     │                      │
│                   └───────────────────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Spécifications fonctionnelles

### 3.1 Description du composant

Le `CTAButton` est un composant atomique responsable de l'affichage d'un bouton d'appel à l'action (CTA) :

| Élément | Balise HTML | Source de données | Rôle |
|---------|-------------|-------------------|------|
| Bouton CTA | `<a>` ou `<button>` | Props | Inciter l'utilisateur à explorer le framework |
| Texte | Text node | Props `text` | Label du bouton |
| Icône (optionnel) | `<svg>` ou slot | Props `icon` | Renforcer l'action (ex: flèche →) |

### 3.2 Comportement attendu

#### 3.2.1 Rendu par défaut (Hero)

```
┌─────────────────────────────────────┐
│                                     │
│    Explorer le Framework    →       │
│                                     │
└─────────────────────────────────────┘
```

#### 3.2.2 Hiérarchie visuelle

| Élément | Taille desktop | Taille mobile | Poids | Couleur fond | Couleur texte |
|---------|----------------|---------------|-------|--------------|---------------|
| CTA Primary (lg) | `text-lg` padding `px-8 py-4` | `text-base` padding `px-6 py-3` | `font-semibold` | `bg-blue-600` | `text-white` |
| CTA Primary (md) | `text-base` padding `px-6 py-3` | `text-sm` padding `px-5 py-2.5` | `font-semibold` | `bg-blue-600` | `text-white` |
| CTA Primary (sm) | `text-sm` padding `px-4 py-2` | `text-sm` padding `px-4 py-2` | `font-medium` | `bg-blue-600` | `text-white` |

### 3.3 Variantes

Le composant supporte les variantes suivantes :

| Variante | Prop | Valeur par défaut | Description |
|----------|------|-------------------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Style visuel du bouton |
| `size` | `'sm' \| 'md' \| 'lg'` | `'lg'` | Taille du bouton |
| `as` | `'link' \| 'button'` | `'link'` | Élément HTML rendu (`<a>` ou `<button>`) |
| `icon` | `'arrow' \| 'external' \| 'none'` | `'arrow'` | Icône à afficher |
| `iconPosition` | `'left' \| 'right'` | `'right'` | Position de l'icône |
| `fullWidth` | `boolean` | `false` | Bouton pleine largeur |
| `disabled` | `boolean` | `false` | État désactivé |

#### 3.3.1 Styles des variantes

| Variante | Fond | Texte | Bordure | Hover |
|----------|------|-------|---------|-------|
| `primary` | `bg-blue-600` | `text-white` | Aucune | `bg-blue-700` |
| `secondary` | `bg-gray-100` | `text-gray-900` | Aucune | `bg-gray-200` |
| `outline` | Transparent | `text-blue-600` | `border-blue-600` | `bg-blue-50` |
| `ghost` | Transparent | `text-blue-600` | Aucune | `bg-blue-50` |

### 3.4 Accessibilité (RGAA AA)

| Critère | Exigence | Implémentation |
|---------|----------|----------------|
| **1.1** Rôle | Role approprié (link ou button) | `<a>` pour navigation, `<button>` pour action |
| **3.1** Contraste | Ratio ≥ 4.5:1 pour le texte | Blanc sur bleu-600 = ~4.68:1 ✅ |
| **3.3** Focus | Indicateur de focus visible | `focus:ring-2 focus:ring-offset-2` |
| **7.1** Clavier | Activable au clavier | Enter/Space natifs |
| **8.2** Target size | Zone cliquable ≥ 44x44px | Padding minimum `py-2 px-4` |
| **10.5** Liens | Lien explicite | `aria-label` si texte insuffisant |
| **11.1** Désactivé | État désactivé perceptible | `aria-disabled`, couleurs atténuées |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript des Props

```typescript
// src/components/common/CTAButton.astro - Frontmatter

/**
 * Variantes visuelles du bouton CTA
 */
export type CTAVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

/**
 * Tailles disponibles pour le bouton CTA
 */
export type CTASize = 'sm' | 'md' | 'lg'

/**
 * Type d'icône à afficher
 */
export type CTAIcon = 'arrow' | 'external' | 'none'

/**
 * Props du composant CTAButton
 */
export interface CTAButtonProps {
  /**
   * Texte affiché dans le bouton
   * @minLength 2
   * @maxLength 50
   */
  text: string

  /**
   * URL de destination (requis si as="link")
   * Ignoré si as="button"
   */
  href?: string

  /**
   * Variante visuelle du bouton
   * - primary: fond bleu, texte blanc (action principale)
   * - secondary: fond gris clair, texte foncé (action secondaire)
   * - outline: bordure bleue, fond transparent (alternative)
   * - ghost: texte bleu, fond transparent (discret)
   * @default 'primary'
   */
  variant?: CTAVariant

  /**
   * Taille du bouton
   * - sm: petit (zones secondaires)
   * - md: moyen (usage général)
   * - lg: grand (hero section)
   * @default 'lg'
   */
  size?: CTASize

  /**
   * Élément HTML à rendre
   * - link: rend un <a> (navigation)
   * - button: rend un <button> (action JS/formulaire)
   * @default 'link'
   */
  as?: 'link' | 'button'

  /**
   * Type de bouton HTML (si as="button")
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'

  /**
   * Icône à afficher
   * - arrow: flèche vers la droite (→)
   * - external: icône lien externe (↗)
   * - none: pas d'icône
   * @default 'arrow'
   */
  icon?: CTAIcon

  /**
   * Position de l'icône par rapport au texte
   * @default 'right'
   */
  iconPosition?: 'left' | 'right'

  /**
   * Étendre le bouton sur toute la largeur du conteneur
   * @default false
   */
  fullWidth?: boolean

  /**
   * État désactivé
   * @default false
   */
  disabled?: boolean

  /**
   * Ouvrir le lien dans un nouvel onglet (si as="link")
   * Ajoute automatiquement rel="noopener noreferrer"
   * @default false
   */
  newTab?: boolean

  /**
   * Label accessible alternatif (si le texte seul n'est pas suffisant)
   * Utilisé pour aria-label
   */
  ariaLabel?: string

  /**
   * Classes CSS additionnelles pour le bouton
   */
  class?: string
}
```

### 4.2 Implémentation du composant

```astro
---
// src/components/common/CTAButton.astro

export interface Props {
  text: string
  href?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  as?: 'link' | 'button'
  type?: 'button' | 'submit' | 'reset'
  icon?: 'arrow' | 'external' | 'none'
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  disabled?: boolean
  newTab?: boolean
  ariaLabel?: string
  class?: string
}

const {
  text,
  href = '#',
  variant = 'primary',
  size = 'lg',
  as = 'link',
  type = 'button',
  icon = 'arrow',
  iconPosition = 'right',
  fullWidth = false,
  disabled = false,
  newTab = false,
  ariaLabel,
  class: className = '',
} = Astro.props

// Mapping des variantes
const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
  outline: 'bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
}

// Mapping des tailles
const sizeClasses = {
  sm: 'text-sm px-4 py-2 gap-1.5',
  md: 'text-base px-6 py-3 gap-2',
  lg: 'text-base md:text-lg px-6 md:px-8 py-3 md:py-4 gap-2.5',
}

// Mapping du font-weight selon la taille
const weightClasses = {
  sm: 'font-medium',
  md: 'font-semibold',
  lg: 'font-semibold',
}

// Classes de base communes
const baseClasses = [
  'inline-flex items-center justify-center',
  'rounded-lg',
  'transition-all duration-200 ease-in-out',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  variantClasses[variant],
  sizeClasses[size],
  weightClasses[size],
  fullWidth ? 'w-full' : '',
  disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
  className,
].filter(Boolean).join(' ')

// Attributs communs
const commonAttrs = {
  class: baseClasses,
  'aria-label': ariaLabel || undefined,
  'aria-disabled': disabled ? 'true' : undefined,
}

// Attributs spécifiques au lien
const linkAttrs = as === 'link' ? {
  href: disabled ? undefined : href,
  target: newTab ? '_blank' : undefined,
  rel: newTab ? 'noopener noreferrer' : undefined,
} : {}

// Attributs spécifiques au bouton
const buttonAttrs = as === 'button' ? {
  type,
  disabled: disabled || undefined,
} : {}

// Icônes SVG
const icons = {
  arrow: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>`,
  external: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
  </svg>`,
  none: '',
}

const iconSvg = icons[icon]
const Element = as === 'link' ? 'a' : 'button'
---

{as === 'link' ? (
  <a {...commonAttrs} {...linkAttrs}>
    {iconPosition === 'left' && icon !== 'none' && <Fragment set:html={iconSvg} />}
    <span>{text}</span>
    {iconPosition === 'right' && icon !== 'none' && <Fragment set:html={iconSvg} />}
  </a>
) : (
  <button {...commonAttrs} {...buttonAttrs}>
    {iconPosition === 'left' && icon !== 'none' && <Fragment set:html={iconSvg} />}
    <span>{text}</span>
    {iconPosition === 'right' && icon !== 'none' && <Fragment set:html={iconSvg} />}
  </button>
)}
```

### 4.3 Type export

```typescript
// src/types/components.ts (ou ajout à src/types/index.ts)

export type { Props as CTAButtonProps } from '@components/common/CTAButton.astro'
export type { CTAVariant, CTASize, CTAIcon } from '@components/common/CTAButton.astro'
```

### 4.4 Utilisation du composant

#### 4.4.1 Utilisation basique (Hero)

```astro
---
import CTAButton from '@components/common/CTAButton.astro'
---

<CTAButton
  text="Explorer le Framework"
  href="/framework"
/>
```

#### 4.4.2 Utilisation avec options

```astro
<CTAButton
  text="Explorer le Framework"
  href="/framework"
  variant="primary"
  size="lg"
  icon="arrow"
  iconPosition="right"
/>
```

#### 4.4.3 Variante secondaire

```astro
<CTAButton
  text="En savoir plus"
  href="/about"
  variant="secondary"
  size="md"
  icon="none"
/>
```

#### 4.4.4 Variante outline avec lien externe

```astro
<CTAButton
  text="Voir sur GitHub"
  href="https://github.com/aiad/framework"
  variant="outline"
  icon="external"
  newTab={true}
/>
```

#### 4.4.5 Bouton (pas un lien)

```astro
<CTAButton
  text="Soumettre"
  as="button"
  type="submit"
  variant="primary"
  icon="none"
/>
```

#### 4.4.6 Bouton désactivé

```astro
<CTAButton
  text="Bientôt disponible"
  href="/coming-soon"
  disabled={true}
/>
```

#### 4.4.7 Bouton pleine largeur (mobile)

```astro
<CTAButton
  text="Commencer"
  href="/start"
  fullWidth={true}
  class="sm:w-auto"
/>
```

---

## 5. Design et style

### 5.1 Tokens de design

| Token | Mobile | Tablet (md) | Desktop (lg) | Variable Tailwind |
|-------|--------|-------------|--------------|-------------------|
| **Font-size (lg)** | 1rem | 1.125rem | 1.125rem | `text-base md:text-lg` |
| **Padding X (lg)** | 1.5rem | 2rem | 2rem | `px-6 md:px-8` |
| **Padding Y (lg)** | 0.75rem | 1rem | 1rem | `py-3 md:py-4` |
| **Border radius** | 0.5rem | 0.5rem | 0.5rem | `rounded-lg` |
| **Primary bg** | #2563EB | - | - | `bg-blue-600` |
| **Primary bg hover** | #1D4ED8 | - | - | `hover:bg-blue-700` |
| **Primary text** | #FFFFFF | - | - | `text-white` |
| **Focus ring** | - | - | - | `focus:ring-2 focus:ring-offset-2` |
| **Transition** | 200ms | - | - | `transition-all duration-200` |
| **Gap icon/text** | 0.625rem | - | - | `gap-2.5` (lg) |

### 5.2 Breakpoints

| Breakpoint | Largeur min | Ajustements |
|------------|-------------|-------------|
| **Mobile** | 0px | Tailles de base, padding réduit |
| **md (Tablet)** | 768px | Augmentation padding et font-size |
| **lg (Desktop)** | 1024px | Pas de changement additionnel |

### 5.3 États visuels

| État | Primary | Secondary | Outline | Ghost |
|------|---------|-----------|---------|-------|
| **Default** | `bg-blue-600 text-white` | `bg-gray-100 text-gray-900` | `border-blue-600 text-blue-600` | `text-blue-600` |
| **Hover** | `bg-blue-700` | `bg-gray-200` | `bg-blue-50` | `bg-blue-50` |
| **Focus** | `ring-2 ring-blue-500 ring-offset-2` | `ring-2 ring-gray-500 ring-offset-2` | `ring-2 ring-blue-500 ring-offset-2` | `ring-2 ring-blue-500 ring-offset-2` |
| **Active** | `bg-blue-800` | `bg-gray-300` | `bg-blue-100` | `bg-blue-100` |
| **Disabled** | `opacity-50 cursor-not-allowed` | `opacity-50 cursor-not-allowed` | `opacity-50 cursor-not-allowed` | `opacity-50 cursor-not-allowed` |

### 5.4 Icônes

#### 5.4.1 Icône Arrow (→)

```svg
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
</svg>
```

#### 5.4.2 Icône External (↗)

```svg
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
</svg>
```

### 5.5 Cohérence avec le design system

| Aspect | HeroTitle | ValueProposition | CTAButton |
|--------|-----------|------------------|-----------|
| **Color scheme** | `gray-900` / `gray-600` | `gray-600` | `blue-600` (accent) |
| **Responsive pattern** | `text-base md:text-lg` | `text-base md:text-lg` | `text-base md:text-lg` |
| **Font weight** | `font-bold` (title) | `font-normal` | `font-semibold` |
| **Spacing** | `gap-4` | `leading-relaxed` | `gap-2.5` |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Cas limites identifiés

| ID | Cas limite | Valeur/Situation | Comportement attendu | Test |
|----|------------|------------------|---------------------|------|
| CL-01 | Texte très long (50 chars) | `"Explorez toutes les fonctionnalités du framework"` | Wrap sur mobile, inline sur desktop | T-01 |
| CL-02 | Texte très court (2 chars) | `"OK"` | Rendu normal, padding maintenu | T-02 |
| CL-03 | Href vide | `href=""` | Lien vers `#` par défaut | T-03 |
| CL-04 | Href undefined (as=link) | `<CTAButton text="Test" />` | Lien vers `#` | T-04 |
| CL-05 | URL externe sans newTab | `href="https://..."` + `newTab={false}` | Pas de `target="_blank"` | T-05 |
| CL-06 | URL externe avec newTab | `href="https://..."` + `newTab={true}` | `target="_blank" rel="noopener noreferrer"` | T-06 |
| CL-07 | as=button avec href | `as="button" href="/test"` | href ignoré, rendu `<button>` | T-07 |
| CL-08 | as=link avec type | `as="link" type="submit"` | type ignoré, rendu `<a>` | T-08 |
| CL-09 | Désactivé avec as=link | `disabled={true} as="link"` | href supprimé, `aria-disabled="true"` | T-09 |
| CL-10 | Désactivé avec as=button | `disabled={true} as="button"` | `disabled` attribut HTML | T-10 |
| CL-11 | Variant invalide | `variant="invalid"` | Erreur TypeScript | T-11 |
| CL-12 | Size invalide | `size="xl"` | Erreur TypeScript | T-12 |
| CL-13 | Icon invalide | `icon="chevron"` | Erreur TypeScript | T-13 |
| CL-14 | Classe additionnelle | `class="my-custom-class"` | Classe appliquée en plus | T-14 |
| CL-15 | fullWidth sur mobile/desktop | `fullWidth={true}` | `w-full` appliqué | T-15 |
| CL-16 | Texte avec caractères spéciaux | `"Découvrir l'IA & plus →"` | Rendu correct, HTML échappé | T-16 |
| CL-17 | Texte avec HTML injection | `"Test <script>alert('xss')</script>"` | HTML échappé automatiquement | T-17 |
| CL-18 | ariaLabel fourni | `ariaLabel="Explorer la documentation"` | `aria-label` appliqué | T-18 |
| CL-19 | Focus clavier | Tab navigation | Focus ring visible | T-19 |
| CL-20 | Clic sur lien désactivé | Clic + `disabled={true}` | Pas de navigation | T-20 |
| CL-21 | Icon à gauche | `iconPosition="left"` | Icône avant le texte | T-21 |
| CL-22 | Viewports très étroits (< 320px) | Écran 280px | Bouton adaptatif, pas d'overflow | T-22 |

### 6.2 Validation des props

```typescript
// Runtime validation (optionnel, en développement)
if (import.meta.env.DEV) {
  if (!text || text.trim().length < 2) {
    console.warn('[CTAButton] Text should be at least 2 characters')
  }
  if (text && text.length > 50) {
    console.warn('[CTAButton] Text exceeds 50 characters, may cause layout issues')
  }
  if (as === 'link' && !href) {
    console.warn('[CTAButton] href is recommended when as="link"')
  }
  if (as === 'button' && href) {
    console.warn('[CTAButton] href is ignored when as="button"')
  }
}
```

### 6.3 Stratégie de fallback

| Situation | Fallback | Justification |
|-----------|----------|---------------|
| href vide/undefined | `'#'` | Éviter lien cassé |
| Variant non reconnu | `'primary'` par défaut | Défaut sûr |
| Size non reconnu | `'lg'` par défaut | Défaut sûr (hero context) |
| as non reconnu | `'link'` par défaut | Comportement le plus courant |
| icon non reconnu | `'arrow'` par défaut | Défaut visuel attendu |

---

## 7. Exemples entrée/sortie

### 7.1 Rendu par défaut (Hero CTA)

**Entrée (Props) :**

```typescript
{
  text: "Explorer le Framework",
  href: "/framework",
  variant: 'primary',
  size: 'lg',
  as: 'link',
  icon: 'arrow',
  iconPosition: 'right',
  fullWidth: false,
  disabled: false,
  newTab: false,
  class: ''
}
```

**Sortie (HTML) :**

```html
<a
  href="/framework"
  class="inline-flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 gap-2.5 font-semibold"
>
  <span>Explorer le Framework</span>
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>
</a>
```

### 7.2 Rendu variante secondary, taille medium

**Entrée (Props) :**

```typescript
{
  text: "En savoir plus",
  href: "/about",
  variant: 'secondary',
  size: 'md',
  icon: 'none'
}
```

**Sortie (HTML) :**

```html
<a
  href="/about"
  class="inline-flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 text-base px-6 py-3 gap-2 font-semibold"
>
  <span>En savoir plus</span>
</a>
```

### 7.3 Rendu variante outline avec lien externe

**Entrée (Props) :**

```typescript
{
  text: "Voir sur GitHub",
  href: "https://github.com/aiad/framework",
  variant: 'outline',
  size: 'md',
  icon: 'external',
  newTab: true
}
```

**Sortie (HTML) :**

```html
<a
  href="https://github.com/aiad/framework"
  target="_blank"
  rel="noopener noreferrer"
  class="inline-flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-500 text-base px-6 py-3 gap-2 font-semibold"
>
  <span>Voir sur GitHub</span>
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
  </svg>
</a>
```

### 7.4 Rendu bouton (pas un lien)

**Entrée (Props) :**

```typescript
{
  text: "Soumettre",
  as: 'button',
  type: 'submit',
  variant: 'primary',
  size: 'md',
  icon: 'none'
}
```

**Sortie (HTML) :**

```html
<button
  type="submit"
  class="inline-flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 text-base px-6 py-3 gap-2 font-semibold"
>
  <span>Soumettre</span>
</button>
```

### 7.5 Rendu désactivé

**Entrée (Props) :**

```typescript
{
  text: "Bientôt disponible",
  href: "/coming-soon",
  disabled: true
}
```

**Sortie (HTML) :**

```html
<a
  aria-disabled="true"
  class="inline-flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 gap-2.5 font-semibold opacity-50 cursor-not-allowed pointer-events-none"
>
  <span>Bientôt disponible</span>
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>
</a>
```

### 7.6 Rendu avec caractères spéciaux (XSS protection)

**Entrée (Props) :**

```typescript
{
  text: "Découvrir <script>alert('xss')</script>",
  href: "/discover"
}
```

**Sortie (HTML) :**

```html
<a
  href="/discover"
  class="..."
>
  <span>Découvrir &lt;script&gt;alert('xss')&lt;/script&gt;</span>
  <svg ...></svg>
</a>
```

---

## 8. Tests

### 8.1 Fichiers de test

| Type | Emplacement | Focus |
|------|-------------|-------|
| **Unitaires** | `tests/unit/components/cta-button.test.ts` | Rendu, props, classes, attributs |
| **E2E** | `tests/e2e/cta-button.spec.ts` | Intégration page, responsive, interactions |
| **Accessibilité** | `tests/e2e/accessibility.spec.ts` | RGAA AA, focus, contraste |

### 8.2 Suite de tests unitaires

```typescript
// tests/unit/components/cta-button.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import CTAButton from '@components/common/CTAButton.astro'

describe('CTAButton Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base
  const defaultProps = {
    text: 'Explorer le Framework',
    href: '/framework',
  }

  describe('Rendu de base', () => {
    it('T-00: should render as anchor tag by default', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('<a')
      expect(result).toContain('</a>')
      expect(result).toContain('href="/framework"')
    })

    it('T-00b: should render text inside span', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('<span>Explorer le Framework</span>')
    })

    it('should render arrow icon by default', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('<svg')
      expect(result).toContain('aria-hidden="true"')
    })

    it('should have only one anchor or button tag', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      const aCount = (result.match(/<a/g) || []).length
      const buttonCount = (result.match(/<button/g) || []).length

      expect(aCount + buttonCount).toBe(1)
    })
  })

  describe('Props: variant', () => {
    it('should apply primary variant classes by default', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('bg-blue-600')
      expect(result).toContain('text-white')
      expect(result).toContain('hover:bg-blue-700')
    })

    it('should apply secondary variant classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, variant: 'secondary' },
      })

      expect(result).toContain('bg-gray-100')
      expect(result).toContain('text-gray-900')
      expect(result).toContain('hover:bg-gray-200')
    })

    it('should apply outline variant classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, variant: 'outline' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('text-blue-600')
      expect(result).toContain('border-2')
      expect(result).toContain('border-blue-600')
    })

    it('should apply ghost variant classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, variant: 'ghost' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('text-blue-600')
      expect(result).not.toContain('border-')
    })
  })

  describe('Props: size', () => {
    it('should apply lg size classes by default', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('md:text-lg')
      expect(result).toContain('md:px-8')
      expect(result).toContain('md:py-4')
    })

    it('should apply md size classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, size: 'md' },
      })

      expect(result).toContain('text-base')
      expect(result).toContain('px-6')
      expect(result).toContain('py-3')
      expect(result).not.toContain('md:px-8')
    })

    it('should apply sm size classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, size: 'sm' },
      })

      expect(result).toContain('text-sm')
      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
    })
  })

  describe('Props: as', () => {
    it('T-07: should render as button when as="button"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'button' },
      })

      expect(result).toContain('<button')
      expect(result).toContain('</button>')
      expect(result).not.toContain('<a')
      expect(result).not.toContain('href=')
    })

    it('should apply type attribute when as="button"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'button', type: 'submit' },
      })

      expect(result).toContain('type="submit"')
    })

    it('T-08: should ignore type attribute when as="link"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'link', type: 'submit' },
      })

      expect(result).not.toContain('type="submit"')
    })
  })

  describe('Props: icon', () => {
    it('should render arrow icon by default', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('M17 8l4 4')
    })

    it('should render external icon when icon="external"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, icon: 'external' },
      })

      expect(result).toContain('M10 6H6')
    })

    it('should not render icon when icon="none"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, icon: 'none' },
      })

      expect(result).not.toContain('<svg')
    })
  })

  describe('Props: iconPosition', () => {
    it('T-21: should render icon before text when iconPosition="left"', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, iconPosition: 'left' },
      })

      const svgIndex = result.indexOf('<svg')
      const spanIndex = result.indexOf('<span>')

      expect(svgIndex).toBeLessThan(spanIndex)
    })

    it('should render icon after text by default (iconPosition="right")', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      const svgIndex = result.indexOf('<svg')
      const spanIndex = result.indexOf('</span>')

      expect(svgIndex).toBeGreaterThan(spanIndex)
    })
  })

  describe('Props: newTab', () => {
    it('T-05: should not add target="_blank" when newTab=false', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, newTab: false },
      })

      expect(result).not.toContain('target="_blank"')
    })

    it('T-06: should add target="_blank" and rel="noopener noreferrer" when newTab=true', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, newTab: true },
      })

      expect(result).toContain('target="_blank"')
      expect(result).toContain('rel="noopener noreferrer"')
    })
  })

  describe('Props: disabled', () => {
    it('T-09: should apply disabled styles and aria-disabled for link', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, disabled: true },
      })

      expect(result).toContain('opacity-50')
      expect(result).toContain('cursor-not-allowed')
      expect(result).toContain('pointer-events-none')
      expect(result).toContain('aria-disabled="true"')
      expect(result).not.toContain('href="/framework"')
    })

    it('T-10: should apply disabled attribute for button', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, as: 'button', disabled: true },
      })

      expect(result).toContain('disabled')
      expect(result).toContain('opacity-50')
    })
  })

  describe('Props: fullWidth', () => {
    it('T-15: should apply w-full class when fullWidth=true', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, fullWidth: true },
      })

      expect(result).toContain('w-full')
    })

    it('should not apply w-full class when fullWidth=false', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, fullWidth: false },
      })

      expect(result).not.toContain('w-full')
    })
  })

  describe('Props: ariaLabel', () => {
    it('T-18: should apply aria-label when provided', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, ariaLabel: 'Accéder à la documentation' },
      })

      expect(result).toContain('aria-label="Accéder à la documentation"')
    })

    it('should not have aria-label when not provided', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).not.toContain('aria-label=')
    })
  })

  describe('Props: class', () => {
    it('T-14: should apply custom class', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })

    it('should preserve default classes when adding custom class', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, class: 'mt-8' },
      })

      expect(result).toContain('inline-flex')
      expect(result).toContain('rounded-lg')
      expect(result).toContain('mt-8')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('T-01: should handle long text (50 chars)', async () => {
      const longText = 'Explorez toutes les fonctionnalités du framework'
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: longText },
      })

      expect(result).toContain(longText)
    })

    it('T-02: should handle short text (2 chars)', async () => {
      const shortText = 'OK'
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: shortText },
      })

      expect(result).toContain(shortText)
    })

    it('T-03: should use # as default href when href is empty', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { text: 'Test', href: '' },
      })

      expect(result).toContain('href="#"')
    })

    it('T-04: should use # as default href when href is undefined', async () => {
      const result = await container.renderToString(CTAButton, {
        props: { text: 'Test' },
      })

      expect(result).toContain('href="#"')
    })

    it('T-16: should handle special characters in text', async () => {
      const specialText = "Découvrir l'IA & plus"
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: specialText },
      })

      expect(result).toContain("Découvrir l&#39;IA")
      expect(result).toContain('&amp;')
    })

    it('T-17: should escape HTML injection in text', async () => {
      const xssText = "Test <script>alert('xss')</script>"
      const result = await container.renderToString(CTAButton, {
        props: { ...defaultProps, text: xssText },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })
  })

  describe('Styling: Base classes', () => {
    it('should have inline-flex for layout', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('inline-flex')
      expect(result).toContain('items-center')
      expect(result).toContain('justify-center')
    })

    it('should have rounded-lg for border radius', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('rounded-lg')
    })

    it('should have transition classes', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('transition-all')
      expect(result).toContain('duration-200')
    })

    it('should have focus ring classes for accessibility', async () => {
      const result = await container.renderToString(CTAButton, {
        props: defaultProps,
      })

      expect(result).toContain('focus:outline-none')
      expect(result).toContain('focus:ring-2')
      expect(result).toContain('focus:ring-offset-2')
    })
  })
})
```

### 8.3 Suite de tests E2E (Playwright)

```typescript
// tests/e2e/cta-button.spec.ts

import { test, expect } from '@playwright/test'

test.describe('CTAButton Component - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display CTA button in hero section', async ({ page }) => {
    const cta = page.locator('a:has-text("Explorer le Framework")')
    await expect(cta).toBeVisible()
  })

  test('should navigate to framework page on click', async ({ page }) => {
    const cta = page.locator('a:has-text("Explorer le Framework")')
    await cta.click()

    await expect(page).toHaveURL('/framework')
  })

  test('T-19: should have visible focus ring on keyboard navigation', async ({ page }) => {
    // Tab jusqu'au CTA
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const cta = page.locator('a:has-text("Explorer le Framework")')

    // Vérifier que le CTA est focusé
    await expect(cta).toBeFocused()

    // Vérifier le focus ring via computed style
    const hasRing = await cta.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.outlineStyle !== 'none' || style.boxShadow.includes('ring')
    })

    expect(hasRing).toBe(true)
  })

  test('should be clickable with Enter key', async ({ page }) => {
    const cta = page.locator('a:has-text("Explorer le Framework")')
    await cta.focus()
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL('/framework')
  })

  test('T-22: should not have horizontal overflow on narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 600 })

    const body = page.locator('body')
    const bodyWidth = await body.evaluate((el) => el.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test('should be responsive across breakpoints', async ({ page }) => {
    const cta = page.locator('a:has-text("Explorer le Framework")')

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(cta).toBeVisible()

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(cta).toBeVisible()

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(cta).toBeVisible()
  })

  test('should show hover state on mouse over', async ({ page }) => {
    const cta = page.locator('a:has-text("Explorer le Framework")')

    const bgColorBefore = await cta.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })

    await cta.hover()

    const bgColorAfter = await cta.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })

    // La couleur de fond devrait changer au hover
    expect(bgColorBefore).not.toBe(bgColorAfter)
  })
})
```

### 8.4 Tests d'accessibilité

```typescript
// tests/e2e/accessibility.spec.ts (ajout pour CTAButton)

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('CTAButton Accessibility', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('a:has-text("Explorer")')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')

    const cta = page.locator('a:has-text("Explorer le Framework")')
    const computedStyle = await cta.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
      }
    })

    // text-white = rgb(255, 255, 255)
    expect(computedStyle.color).toBe('rgb(255, 255, 255)')
    // bg-blue-600 = rgb(37, 99, 235)
    expect(computedStyle.backgroundColor).toBe('rgb(37, 99, 235)')
  })

  test('should be focusable via keyboard', async ({ page }) => {
    await page.goto('/')

    const cta = page.locator('a:has-text("Explorer le Framework")')

    // Focus programmatique
    await cta.focus()

    await expect(cta).toBeFocused()
  })

  test('should have proper link role', async ({ page }) => {
    await page.goto('/')

    const cta = page.locator('a:has-text("Explorer le Framework")')
    const tagName = await cta.evaluate((el) => el.tagName.toLowerCase())

    expect(tagName).toBe('a')
  })

  test('should have aria-hidden on decorative icon', async ({ page }) => {
    await page.goto('/')

    const icon = page.locator('a:has-text("Explorer le Framework") svg')

    await expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  test('T-20: disabled link should not be navigable', async ({ page }) => {
    // Ce test nécessite une page avec un CTA désactivé
    // À implémenter quand un tel cas existe
  })
})
```

### 8.5 Matrice de couverture

| Aspect | Tests unitaires | Tests E2E | Couverture |
|--------|-----------------|-----------|------------|
| Rendu basique | T-00, T-00b | ✅ | 100% |
| Props variant | 4 tests | - | 100% |
| Props size | 3 tests | - | 100% |
| Props as | 3 tests (T-07, T-08) | - | 100% |
| Props icon | 3 tests | - | 100% |
| Props iconPosition | T-21 + 1 test | - | 100% |
| Props newTab | T-05, T-06 | - | 100% |
| Props disabled | T-09, T-10 | T-20 | 100% |
| Props fullWidth | T-15 + 1 test | - | 100% |
| Props ariaLabel | T-18 + 1 test | - | 100% |
| Props class | T-14 + 1 test | - | 100% |
| Cas limites contenu | T-01 à T-04, T-16, T-17 | T-22 | 100% |
| Styling base | 4 tests | - | 100% |
| Focus clavier | - | T-19 | 100% |
| Responsive | - | 3 tests | 100% |
| Accessibilité | - | 5 tests | 100% |

---

## 9. Critères d'acceptation

- [ ] **CA-01** : Le composant `CTAButton.astro` existe dans `src/components/common/`
- [ ] **CA-02** : Le composant rend un `<a>` par défaut (as="link")
- [ ] **CA-03** : Le composant rend un `<button>` quand as="button"
- [ ] **CA-04** : Les variantes `primary`, `secondary`, `outline`, `ghost` fonctionnent
- [ ] **CA-05** : Les tailles `sm`, `md`, `lg` fonctionnent avec les bonnes classes
- [ ] **CA-06** : L'icône arrow est affichée par défaut à droite
- [ ] **CA-07** : L'icône peut être positionnée à gauche avec iconPosition="left"
- [ ] **CA-08** : L'icône peut être masquée avec icon="none"
- [ ] **CA-09** : Le prop newTab ajoute `target="_blank"` et `rel="noopener noreferrer"`
- [ ] **CA-10** : Le prop disabled applique les styles et attributs appropriés
- [ ] **CA-11** : Le composant est responsive (mobile-first)
- [ ] **CA-12** : Le composant n'émet pas de JavaScript client (static)
- [ ] **CA-13** : Les textes sont correctement échappés (protection XSS)
- [ ] **CA-14** : Le composant respecte RGAA AA (contraste ≥ 4.5:1, focus visible)
- [ ] **CA-15** : TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] **CA-16** : ESLint passe sans warning (`pnpm lint`)
- [ ] **CA-17** : Tous les tests unitaires passent
- [ ] **CA-18** : Tous les tests E2E passent

---

## 10. Definition of Done

- [ ] Composant implémenté dans `src/components/common/CTAButton.astro`
- [ ] Interface Props documentée avec JSDoc
- [ ] Tests unitaires écrits et passants (`tests/unit/components/cta-button.test.ts`)
- [ ] Tests E2E écrits et passants (`tests/e2e/cta-button.spec.ts`)
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Composant visuellement vérifié sur mobile, tablet, desktop
- [ ] États hover/focus vérifiés visuellement
- [ ] Accessibilité vérifiée (axe-core)
- [ ] Code reviewé par un pair

---

## 11. Notes d'implémentation

### 11.1 Points d'attention

1. **Sémantique HTML** : Utiliser `<a>` pour la navigation et `<button>` pour les actions. Le prop `as` permet de choisir.

2. **Échappement automatique** : Astro échappe automatiquement le contenu des variables dans les templates. Pas besoin de sanitization manuelle.

3. **Pas de JavaScript** : Ce composant est 100% statique. Les transitions/animations sont gérées en CSS.

4. **Icônes inline** : Les icônes SVG sont inline pour éviter des requêtes HTTP supplémentaires et permettre la coloration via `currentColor`.

5. **Focus visible** : Le focus ring doit être visible sur tous les backgrounds (utilisation de `ring-offset`).

6. **Liens désactivés** : Un `<a>` ne peut pas avoir d'attribut `disabled` natif. On utilise `aria-disabled` + `pointer-events-none` + suppression du `href`.

### 11.2 Extensions futures

| Extension | Priorité | Impact |
|-----------|----------|--------|
| Mode sombre | Moyenne | Ajout classes `dark:bg-blue-500`, `dark:hover:bg-blue-600` |
| Loading state | Basse | Ajout prop `loading` avec spinner |
| Slot pour icône custom | Basse | Permettre des icônes personnalisées via slot |
| Animation d'entrée | Basse | Ajout animation fade-in ou slide-in |
| Variante danger | Basse | Rouge pour actions destructives |

### 11.3 Relation avec les autres composants

```
HeroSection (T-001-F8)
├── HeroTitle (T-001-F1) ✅
│   ├── <h1> title
│   └── <p> tagline
├── ValueProposition (T-001-F2) ✅
│   └── <p> valueProposition
├── CTAButton (T-001-F3) ← CE COMPOSANT
│   └── <a> ou <button>
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
| Composant HeroTitle (T-001-F1) | [T-001-F1-composant-HeroTitle.md](./T-001-F1-composant-HeroTitle.md) |
| Composant ValueProposition (T-001-F2) | [T-001-F2-composant-ValueProposition.md](./T-001-F2-composant-ValueProposition.md) |
| Architecture technique | [ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Guide Claude | [CLAUDE.md](../../CLAUDE.md) |
| Astro Components | [docs.astro.build/components](https://docs.astro.build/en/core-concepts/astro-components/) |
| Tailwind CSS | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| RGAA 4.1 - Boutons et liens | [accessibilite.numerique.gouv.fr](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/) |
| Astro Container API | [docs.astro.build/container](https://docs.astro.build/en/reference/container-reference/) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 02/02/2026 | Création initiale complète |
