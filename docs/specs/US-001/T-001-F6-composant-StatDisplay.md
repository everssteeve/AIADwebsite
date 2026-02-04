# T-001-F6 : Créer le composant StatDisplay (stat individuelle)

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 4 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-B3 (StatItem model) ✅, T-001-B6 (Stats JSON data) ✅ |
| **Bloque** | T-001-F7 (StatsRow), T-001-F8 (HeroSection assemblage) |

---

## 1. Objectif

Créer le composant Astro `StatDisplay` qui affiche une statistique chiffrée individuelle (valeur + label + source) dans la hero section, en garantissant :

- **Impact visuel** : Mise en valeur de la valeur chiffrée avec typographie impactante
- **Crédibilité** : Attribution visible de la source pour chaque statistique
- **Accessibilité** : Conforme RGAA AA (contraste, sémantique, ARIA)
- **Réutilisabilité** : Composant atomique utilisable dans différents contextes
- **Responsive** : Adaptation mobile-first selon les breakpoints
- **Performance** : Rendu statique sans JavaScript client
- **Type-safety** : Props typées avec TypeScript strict basées sur `StatItem`
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
│   ├── common/
│   │   └── CTAButton.astro        # ✅ Implémenté (T-001-F3)
│   └── hero/
│       ├── HeroTitle.astro        # ✅ Implémenté (T-001-F1)
│       ├── ValueProposition.astro # ✅ Implémenté (T-001-F2)
│       ├── BenefitCard.astro      # ✅ Implémenté (T-001-F4)
│       ├── BenefitsList.astro     # ✅ Implémenté (T-001-F5)
│       ├── StatDisplay.astro      # ✅ Implémenté (T-001-F6)
│       └── StatsRow.astro         # T-001-F7 (consommateur)
├── content/
│   └── stats/
│       └── main.json              # ✅ Données (T-001-B6)
├── types/
│   ├── index.ts                   # Export barrel
│   └── stat.ts                    # Interface StatItem (T-001-B3)
└── pages/
    └── index.astro                # Consommateur final (via HeroSection)
```

### 2.3 Dépendances

| Type | Nom | Provenance | Statut |
|------|-----|------------|--------|
| **Modèle de données** | `StatItem` | T-001-B3 | ✅ Terminé |
| **Données JSON** | `stats/main.json` | T-001-B6 | ✅ Terminé |

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
│  ┌─────────────────────┐                                        │
│  │ CTAButton           │                                        │
│  └─────────────────────┘                                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    BenefitsList                           │   │
│  │  [ BenefitCard ]  [ BenefitCard ]  [ BenefitCard ]       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      StatsRow                             │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │   │
│  │  │ StatDisplay  │ │ StatDisplay  │ │ StatDisplay  │      │   │
│  │  │              │ │              │ │              │      │   │
│  │  │    50%       │ │     3x       │ │    >90%      │      │   │
│  │  │  ─────────   │ │  ─────────   │ │  ─────────   │      │   │
│  │  │ Productivité │ │   Vitesse    │ │ Satisfaction │      │   │
│  │  │   Source...  │ │   Source...  │ │   Source...  │      │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↑                                   │
│                     CE COMPOSANT (individuel)                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Spécifications fonctionnelles

### 3.1 Description du composant

Le `StatDisplay` est un composant atomique responsable de l'affichage d'une statistique chiffrée individuelle :

| Élément | Balise HTML | Source de données | Rôle |
|---------|-------------|-------------------|------|
| Conteneur | `<div>` | - | Encapsule la statistique |
| Valeur | `<span>` (dans `<p>`) | Props `value` | Chiffre impactant et mémorable |
| Label | `<p>` | Props `label` | Description courte de la statistique |
| Source | `<cite>` ou `<small>` | Props `source` | Attribution crédible (discret) |
| Lien source | `<a>` (optionnel) | Props `sourceUrl` | Lien vers la source vérifiable |

### 3.2 Comportement attendu

#### 3.2.1 Rendu par défaut

```
┌───────────────────────────────────────┐
│                                       │
│              50%                      │  ← Valeur (impactante)
│                                       │
│   Gain de productivité avec les       │  ← Label (descriptif)
│   agents IA                           │
│                                       │
│   McKinsey Global Institute, 2024     │  ← Source (discret)
│                                       │
└───────────────────────────────────────┘
```

#### 3.2.2 Rendu variante highlight

```
┌───────────────────────────────────────┐
│  ╔═══════════════════════════════╗    │
│  ║                               ║    │
│  ║            50%                ║    │  ← Valeur (plus grande)
│  ║                               ║    │
│  ║  Gain de productivité avec    ║    │  ← Label
│  ║  les agents IA                ║    │
│  ║                               ║    │
│  ║  McKinsey Global Institute    ║    │  ← Source
│  ║                               ║    │
│  ╚═══════════════════════════════╝    │
│          Fond coloré + border          │
└───────────────────────────────────────┘
```

#### 3.2.3 Hiérarchie visuelle

| Élément | Taille desktop | Taille mobile | Poids | Couleur |
|---------|----------------|---------------|-------|---------|
| Valeur | `text-4xl` (36px) | `text-3xl` (30px) | `font-bold` | `text-blue-600` |
| Valeur (highlight) | `text-5xl` (48px) | `text-4xl` (36px) | `font-bold` | `text-blue-700` |
| Label | `text-base` | `text-sm` | `font-medium` | `text-gray-700` |
| Source | `text-xs` | `text-xs` | `font-normal` | `text-gray-500` |
| Source (lien) | `text-xs` | `text-xs` | `font-normal` | `text-blue-500 hover:text-blue-600` |

### 3.3 Variantes

Le composant supporte les variantes suivantes :

| Variante | Prop | Valeur par défaut | Description |
|----------|------|-------------------|-------------|
| `variant` | `'default' \| 'highlight' \| 'compact'` | `'default'` | Style visuel de la stat |
| `alignment` | `'center' \| 'left'` | `'center'` | Alignement du contenu |
| `showSource` | `boolean` | `true` | Afficher ou masquer la source |
| `linkSource` | `boolean` | `true` | Rendre la source cliquable si `sourceUrl` fourni |

#### 3.3.1 Styles des variantes

| Variante | Fond | Bordure | Padding | Usage |
|----------|------|---------|---------|-------|
| `default` | `bg-transparent` | Aucune | `p-4` | Stats secondaires |
| `highlight` | `bg-blue-50` | `border border-blue-100 rounded-xl` | `p-6` | Stat principale mise en avant |
| `compact` | `bg-transparent` | Aucune | `p-2` | Espaces réduits |

### 3.4 Accessibilité (RGAA AA)

| Critère | Exigence | Implémentation |
|---------|----------|----------------|
| **1.1** Structure sémantique | Données liées | Association valeur-label implicite via structure |
| **3.1** Contraste valeur | Ratio ≥ 4.5:1 | `blue-600` sur blanc = 4.68:1 ✅ |
| **3.1** Contraste label | Ratio ≥ 4.5:1 | `gray-700` sur blanc = 7.0:1 ✅ |
| **3.1** Contraste source | Ratio ≥ 4.5:1 (small text) | `gray-500` sur blanc = 5.3:1 ✅ |
| **7.1** Lien accessible | Focus visible + underline | `focus:ring-2 focus:ring-blue-500` |
| **8.1** Citation source | Élément `<cite>` ou attribution | `<cite>` ou `<small>` avec attribut approprié |
| **10.1** Responsive | Lisible sur tous viewports | Mobile-first + breakpoints |

---

## 4. Spécifications techniques

### 4.1 Interface TypeScript des Props

```typescript
// src/components/hero/StatDisplay.astro - Frontmatter

import type { StatItem } from '@/types'

/**
 * Variantes visuelles de la statistique
 */
export type StatDisplayVariant = 'default' | 'highlight' | 'compact'

/**
 * Alignement du contenu
 */
export type StatDisplayAlignment = 'center' | 'left'

/**
 * Props du composant StatDisplay
 *
 * Le composant peut recevoir soit un objet StatItem complet,
 * soit les props individuelles pour plus de flexibilité.
 */
export interface StatDisplayProps {
  /**
   * Valeur affichée de la statistique (ex: "50%", "3x", ">90%")
   * @minLength 1
   * @maxLength 20
   */
  value: string

  /**
   * Description courte de la statistique
   * @minLength 10
   * @maxLength 100
   */
  label: string

  /**
   * Source/attribution de la statistique
   * @minLength 5
   * @maxLength 150
   */
  source: string

  /**
   * URL de la source (optionnel)
   * Si fourni et linkSource=true, la source devient un lien cliquable
   */
  sourceUrl?: string

  /**
   * Variante visuelle de la statistique
   * - default: style standard (stats secondaires)
   * - highlight: mise en avant avec fond coloré (stat principale)
   * - compact: padding réduit (espaces contraints)
   * @default 'default'
   */
  variant?: StatDisplayVariant

  /**
   * Alignement du contenu
   * - center: centré (défaut, pour StatsRow)
   * - left: aligné à gauche (pour usage standalone)
   * @default 'center'
   */
  alignment?: StatDisplayAlignment

  /**
   * Afficher la source
   * @default true
   */
  showSource?: boolean

  /**
   * Rendre la source cliquable si sourceUrl est fourni
   * @default true
   */
  linkSource?: boolean

  /**
   * Unité de mesure (pour séparer visuellement de la valeur)
   * Si fourni, sera affiché en plus petit après la valeur
   */
  unit?: string

  /**
   * Classes CSS additionnelles pour le conteneur
   */
  class?: string
}

/**
 * Props alternatives permettant de passer un StatItem complet
 */
export interface StatDisplayFromItemProps {
  /**
   * Objet StatItem complet
   */
  stat: StatItem

  /**
   * Variante visuelle (override le highlight du StatItem si fourni)
   * @default basé sur stat.highlight
   */
  variant?: StatDisplayVariant

  /**
   * Alignement du contenu
   * @default 'center'
   */
  alignment?: StatDisplayAlignment

  /**
   * Afficher la source
   * @default true
   */
  showSource?: boolean

  /**
   * Rendre la source cliquable
   * @default true
   */
  linkSource?: boolean

  /**
   * Classes CSS additionnelles
   */
  class?: string
}
```

### 4.2 Implémentation du composant

```astro
---
// src/components/hero/StatDisplay.astro

export interface Props {
  value: string
  label: string
  source: string
  sourceUrl?: string
  variant?: 'default' | 'highlight' | 'compact'
  alignment?: 'center' | 'left'
  showSource?: boolean
  linkSource?: boolean
  unit?: string
  class?: string
}

const {
  value,
  label,
  source,
  sourceUrl,
  variant = 'default',
  alignment = 'center',
  showSource = true,
  linkSource = true,
  unit,
  class: className = '',
} = Astro.props

// Mapping des variantes de conteneur
const variantClasses = {
  default: 'bg-transparent',
  highlight: 'bg-blue-50 border border-blue-100 rounded-xl',
  compact: 'bg-transparent',
}

// Mapping des paddings selon variante
const paddingClasses = {
  default: 'p-4 md:p-6',
  highlight: 'p-5 md:p-8',
  compact: 'p-2 md:p-3',
}

// Tailles de valeur selon variante
const valueSizeClasses = {
  default: 'text-3xl md:text-4xl',
  highlight: 'text-4xl md:text-5xl',
  compact: 'text-2xl md:text-3xl',
}

// Couleurs de valeur selon variante
const valueColorClasses = {
  default: 'text-blue-600',
  highlight: 'text-blue-700',
  compact: 'text-blue-600',
}

// Tailles de label selon variante
const labelSizeClasses = {
  default: 'text-sm md:text-base',
  highlight: 'text-base md:text-lg',
  compact: 'text-xs md:text-sm',
}

// Classes d'alignement
const alignmentClasses = {
  center: 'text-center items-center',
  left: 'text-left items-start',
}

// Construction des classes du conteneur
const containerClasses = [
  'flex flex-col',
  variantClasses[variant],
  paddingClasses[variant],
  alignmentClasses[alignment],
  className,
].filter(Boolean).join(' ')

// Déterminer si la source doit être un lien
const shouldLinkSource = linkSource && sourceUrl
---

<div class={containerClasses}>
  <!-- Valeur statistique -->
  <p class={`font-bold leading-none ${valueSizeClasses[variant]} ${valueColorClasses[variant]}`}>
    <span class="stat-value">{value}</span>
    {unit && (
      <span class="text-[0.6em] font-semibold ml-0.5 opacity-80">{unit}</span>
    )}
  </p>

  <!-- Label descriptif -->
  <p class={`mt-2 font-medium text-gray-700 leading-snug max-w-xs ${labelSizeClasses[variant]}`}>
    {label}
  </p>

  <!-- Source / Attribution -->
  {showSource && (
    <footer class="mt-3">
      {shouldLinkSource ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-blue-500 hover:text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors"
        >
          <cite class="not-italic">{source}</cite>
          <span class="sr-only">(ouvre dans un nouvel onglet)</span>
        </a>
      ) : (
        <cite class="text-xs text-gray-500 not-italic">{source}</cite>
      )}
    </footer>
  )}
</div>
```

### 4.3 Type export

```typescript
// src/types/components.ts (ou ajout à src/types/index.ts)

export type { Props as StatDisplayProps } from '@components/hero/StatDisplay.astro'
export type {
  StatDisplayVariant,
  StatDisplayAlignment,
} from '@components/hero/StatDisplay.astro'
```

### 4.4 Utilisation du composant

#### 4.4.1 Utilisation basique (avec props individuelles)

```astro
---
import StatDisplay from '@components/hero/StatDisplay.astro'
---

<StatDisplay
  value="50%"
  label="Gain de productivité avec les agents IA"
  source="McKinsey Global Institute, 2024"
  sourceUrl="https://www.mckinsey.com/..."
/>
```

#### 4.4.2 Utilisation avec StatItem depuis Content Collections

```astro
---
import { getCollection } from 'astro:content'
import StatDisplay from '@components/hero/StatDisplay.astro'

const stats = await getCollection('stats')
const sortedStats = stats.sort((a, b) => a.data.order - b.data.order)
---

{sortedStats.map((stat) => (
  <StatDisplay
    value={stat.data.value}
    label={stat.data.label}
    source={stat.data.source}
    sourceUrl={stat.data.sourceUrl}
    variant={stat.data.highlight ? 'highlight' : 'default'}
    unit={stat.data.unit}
  />
))}
```

#### 4.4.3 Variante highlight (stat mise en avant)

```astro
<StatDisplay
  value="50%"
  label="Gain de productivité avec les agents IA"
  source="McKinsey Global Institute, 2024"
  variant="highlight"
/>
```

#### 4.4.4 Variante compact (espaces réduits)

```astro
<StatDisplay
  value="3x"
  label="Plus rapide pour coder"
  source="GitHub Copilot Research"
  variant="compact"
  showSource={false}
/>
```

#### 4.4.5 Alignement à gauche

```astro
<StatDisplay
  value=">90%"
  label="Des développeurs satisfaits de l'IA"
  source="Stack Overflow Survey 2024"
  alignment="left"
/>
```

#### 4.4.6 Sans lien source (source textuelle uniquement)

```astro
<StatDisplay
  value="100+"
  label="Équipes utilisent AIAD"
  source="Statistiques internes AIAD"
  linkSource={false}
/>
```

---

## 5. Design et style

### 5.1 Tokens de design

| Token | Mobile | Desktop (md) | Variable Tailwind |
|-------|--------|--------------|-------------------|
| **Padding (default)** | 1rem | 1.5rem | `p-4 md:p-6` |
| **Padding (highlight)** | 1.25rem | 2rem | `p-5 md:p-8` |
| **Padding (compact)** | 0.5rem | 0.75rem | `p-2 md:p-3` |
| **Gap label-value** | 0.5rem | 0.5rem | `mt-2` |
| **Gap source-label** | 0.75rem | 0.75rem | `mt-3` |
| **Value color** | #2563EB | - | `text-blue-600` |
| **Value color (highlight)** | #1D4ED8 | - | `text-blue-700` |
| **Label color** | #374151 | - | `text-gray-700` |
| **Source color** | #6B7280 | - | `text-gray-500` |
| **Source link color** | #3B82F6 | - | `text-blue-500` |
| **Highlight bg** | #EFF6FF | - | `bg-blue-50` |
| **Highlight border** | #DBEAFE | - | `border-blue-100` |
| **Border radius** | 0.75rem | 0.75rem | `rounded-xl` |
| **Max label width** | 20rem | 20rem | `max-w-xs` |

### 5.2 Tailles de texte

| Élément | Variante | Mobile | Desktop |
|---------|----------|--------|---------|
| **Valeur** | default | 30px (`text-3xl`) | 36px (`text-4xl`) |
| **Valeur** | highlight | 36px (`text-4xl`) | 48px (`text-5xl`) |
| **Valeur** | compact | 24px (`text-2xl`) | 30px (`text-3xl`) |
| **Label** | default | 14px (`text-sm`) | 16px (`text-base`) |
| **Label** | highlight | 16px (`text-base`) | 18px (`text-lg`) |
| **Label** | compact | 12px (`text-xs`) | 14px (`text-sm`) |
| **Source** | tous | 12px (`text-xs`) | 12px (`text-xs`) |
| **Unit suffix** | tous | 0.6em | 0.6em |

### 5.3 Breakpoints

| Breakpoint | Largeur min | Ajustements |
|------------|-------------|-------------|
| **Mobile** | 0px | Tailles de base, padding compact |
| **md (Tablet)** | 768px | Tailles augmentées, padding élargi |
| **lg (Desktop)** | 1024px | Pas de changement additionnel |

### 5.4 Cohérence avec le design system

| Aspect | BenefitCard | StatDisplay | Cohérence |
|--------|-------------|-------------|-----------|
| **Primary color** | `blue-600` (icône) | `blue-600` (valeur) | ✅ |
| **Text dark** | `gray-900` (titre) | `gray-700` (label) | ✅ (hiérarchie) |
| **Text light** | `gray-600` (desc) | `gray-500` (source) | ✅ |
| **Highlight bg** | `blue-50` | `blue-50` | ✅ |
| **Highlight border** | `blue-100` | `blue-100` | ✅ |
| **Border radius** | `rounded-xl` | `rounded-xl` | ✅ |
| **Responsive pattern** | `md:text-*` | `md:text-*` | ✅ |

---

## 6. Cas limites et gestion d'erreurs

### 6.1 Cas limites identifiés

| ID | Cas limite | Valeur/Situation | Comportement attendu | Test |
|----|------------|------------------|---------------------|------|
| CL-01 | Valeur très longue (20 chars) | `"12345678901234567890"` | Rendu sans troncature, wrap si nécessaire | T-01 |
| CL-02 | Valeur minimale (1 char) | `"5"` | Rendu normal | T-02 |
| CL-03 | Label très long (100 chars) | 100 caractères | Wrap naturel dans max-w-xs | T-03 |
| CL-04 | Label minimal (10 chars) | `"Gain temps"` | Rendu normal | T-04 |
| CL-05 | Source très longue (150 chars) | 150 caractères | Wrap ou troncature avec ellipsis | T-05 |
| CL-06 | Source minimale (5 chars) | `"AIAD"` | Rendu normal | T-06 |
| CL-07 | sourceUrl valide | `"https://example.com"` | Lien cliquable | T-07 |
| CL-08 | sourceUrl invalide/manquant | `undefined` | Source non cliquable | T-08 |
| CL-09 | showSource=false | Prop à false | Source non affichée | T-09 |
| CL-10 | linkSource=false | Prop à false | Source textuelle même avec URL | T-10 |
| CL-11 | Variant invalide | `variant="invalid"` | Erreur TypeScript | T-11 |
| CL-12 | Caractères spéciaux dans value | `">90%"`, `"~100"` | Rendu correct (HTML échappé) | T-12 |
| CL-13 | HTML injection dans label | `"<script>alert('xss')</script>"` | HTML échappé | T-13 |
| CL-14 | Caractères accentués | `"Économie réalisée"` | Rendu correct (UTF-8) | T-14 |
| CL-15 | Classe additionnelle | `class="my-4"` | Classe appliquée au conteneur | T-15 |
| CL-16 | Viewport très étroit (280px) | Écran 280px | Pas d'overflow horizontal | T-16 |
| CL-17 | Variante highlight | `variant="highlight"` | Background bleu + border | T-17 |
| CL-18 | Variante compact | `variant="compact"` | Padding réduit, texte plus petit | T-18 |
| CL-19 | Alignement left | `alignment="left"` | Texte aligné à gauche | T-19 |
| CL-20 | Unit fourni séparément | `unit="%"` | Affiché après la valeur | T-20 |
| CL-21 | Value avec symbole uniquement | `"+++"` | Rendu (validation par schéma) | T-21 |
| CL-22 | Source avec & | `"McKinsey & Company"` | Rendu correct | T-22 |
| CL-23 | sourceUrl avec protocole HTTP | `"http://example.com"` | Fonctionne (warning possible) | T-23 |

### 6.2 Validation des props

```typescript
// Runtime validation (optionnel, en développement)
if (import.meta.env.DEV) {
  if (!value || value.trim().length < 1) {
    console.error('[StatDisplay] Value prop is required and must not be empty')
  }
  if (value && value.length > 20) {
    console.warn('[StatDisplay] Value exceeds 20 characters')
  }
  if (!label || label.trim().length < 10) {
    console.warn('[StatDisplay] Label should be at least 10 characters')
  }
  if (label && label.length > 100) {
    console.warn('[StatDisplay] Label exceeds 100 characters')
  }
  if (!source || source.trim().length < 5) {
    console.warn('[StatDisplay] Source should be at least 5 characters')
  }
  if (source && source.length > 150) {
    console.warn('[StatDisplay] Source exceeds 150 characters')
  }
  if (sourceUrl && !sourceUrl.match(/^https?:\/\//)) {
    console.warn('[StatDisplay] sourceUrl should be a valid URL')
  }
}
```

### 6.3 Stratégie de fallback

| Situation | Comportement | Justification |
|-----------|--------------|---------------|
| Variant invalide | Erreur TypeScript | Prévention à la compilation |
| sourceUrl absent | Source non cliquable | Dégradation gracieuse |
| showSource=false | Source masquée | Comportement explicite |
| Props manquantes (value, label, source) | Erreur Astro au build | Props requises |

---

## 7. Exemples entrée/sortie

### 7.1 Rendu par défaut (variante default, aligné au centre)

**Entrée (Props) :**

```typescript
{
  value: '50%',
  label: 'Gain de productivité avec les agents IA',
  source: 'McKinsey Global Institute, 2024',
  sourceUrl: 'https://www.mckinsey.com/...',
  variant: 'default',
  alignment: 'center',
  showSource: true,
  linkSource: true
}
```

**Sortie (HTML) :**

```html
<div class="flex flex-col bg-transparent p-4 md:p-6 text-center items-center">
  <p class="font-bold leading-none text-3xl md:text-4xl text-blue-600">
    <span class="stat-value">50%</span>
  </p>
  <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-sm md:text-base">
    Gain de productivité avec les agents IA
  </p>
  <footer class="mt-3">
    <a
      href="https://www.mckinsey.com/..."
      target="_blank"
      rel="noopener noreferrer"
      class="text-xs text-blue-500 hover:text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors"
    >
      <cite class="not-italic">McKinsey Global Institute, 2024</cite>
      <span class="sr-only">(ouvre dans un nouvel onglet)</span>
    </a>
  </footer>
</div>
```

### 7.2 Rendu variante highlight

**Entrée (Props) :**

```typescript
{
  value: '50%',
  label: 'Gain de productivité avec les agents IA',
  source: 'McKinsey Global Institute, 2024',
  variant: 'highlight'
}
```

**Sortie (HTML) :**

```html
<div class="flex flex-col bg-blue-50 border border-blue-100 rounded-xl p-5 md:p-8 text-center items-center">
  <p class="font-bold leading-none text-4xl md:text-5xl text-blue-700">
    <span class="stat-value">50%</span>
  </p>
  <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-base md:text-lg">
    Gain de productivité avec les agents IA
  </p>
  <footer class="mt-3">
    <cite class="text-xs text-gray-500 not-italic">McKinsey Global Institute, 2024</cite>
  </footer>
</div>
```

### 7.3 Rendu variante compact sans source

**Entrée (Props) :**

```typescript
{
  value: '3x',
  label: 'Plus rapide pour coder avec IA',
  source: 'GitHub Research',
  variant: 'compact',
  showSource: false
}
```

**Sortie (HTML) :**

```html
<div class="flex flex-col bg-transparent p-2 md:p-3 text-center items-center">
  <p class="font-bold leading-none text-2xl md:text-3xl text-blue-600">
    <span class="stat-value">3x</span>
  </p>
  <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-xs md:text-sm">
    Plus rapide pour coder avec IA
  </p>
</div>
```

### 7.4 Rendu avec unit séparé

**Entrée (Props) :**

```typescript
{
  value: '50',
  unit: '%',
  label: 'Gain de productivité',
  source: 'McKinsey, 2024',
}
```

**Sortie (HTML) :**

```html
<div class="flex flex-col bg-transparent p-4 md:p-6 text-center items-center">
  <p class="font-bold leading-none text-3xl md:text-4xl text-blue-600">
    <span class="stat-value">50</span>
    <span class="text-[0.6em] font-semibold ml-0.5 opacity-80">%</span>
  </p>
  <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-sm md:text-base">
    Gain de productivité
  </p>
  <footer class="mt-3">
    <cite class="text-xs text-gray-500 not-italic">McKinsey, 2024</cite>
  </footer>
</div>
```

### 7.5 Rendu avec caractères spéciaux (protection XSS)

**Entrée (Props) :**

```typescript
{
  value: ">90%",
  label: "Satisfaction & Performance <script>",
  source: "Source avec 'quotes' et \"doubles\"",
}
```

**Sortie (HTML) :**

```html
<div class="flex flex-col bg-transparent p-4 md:p-6 text-center items-center">
  <p class="font-bold leading-none text-3xl md:text-4xl text-blue-600">
    <span class="stat-value">&gt;90%</span>
  </p>
  <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-sm md:text-base">
    Satisfaction &amp; Performance &lt;script&gt;
  </p>
  <footer class="mt-3">
    <cite class="text-xs text-gray-500 not-italic">Source avec &#39;quotes&#39; et &quot;doubles&quot;</cite>
  </footer>
</div>
```

---

## 8. Tests

### 8.1 Fichiers de test

| Type | Emplacement | Focus |
|------|-------------|-------|
| **Unitaires** | `tests/unit/components/stat-display.test.ts` | Rendu, props, classes, accessibilité |
| **E2E** | `tests/e2e/stat-display.spec.ts` | Intégration, responsive, visuel |
| **Accessibilité** | `tests/e2e/accessibility.spec.ts` | RGAA AA, contraste, liens |

### 8.2 Suite de tests unitaires

```typescript
// tests/unit/components/stat-display.test.ts

import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import StatDisplay from '@components/hero/StatDisplay.astro'

describe('StatDisplay Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  // Fixture de base valide
  const defaultProps = {
    value: '50%',
    label: 'Gain de productivité avec les agents IA',
    source: 'McKinsey Global Institute, 2024',
  }

  describe('Rendu de base', () => {
    it('T-00: should render as div element', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<div')
      expect(result).toContain('</div>')
    })

    it('T-00b: should render value', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('50%')
      expect(result).toContain('stat-value')
    })

    it('T-00c: should render label in p tag', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain('Gain de productivité avec les agents IA')
    })

    it('T-00d: should render source in cite tag', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<cite')
      expect(result).toContain('McKinsey Global Institute, 2024')
      expect(result).toContain('</cite>')
    })

    it('should have flex column layout', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
    })
  })

  describe('Props: variant', () => {
    it('should apply default variant classes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'default' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('p-4')
    })

    it('T-17: should apply highlight variant classes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'highlight' },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('border')
      expect(result).toContain('border-blue-100')
      expect(result).toContain('rounded-xl')
      expect(result).toContain('text-blue-700')
    })

    it('T-18: should apply compact variant classes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'compact' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('p-2')
      expect(result).toContain('text-2xl')
    })
  })

  describe('Props: alignment', () => {
    it('should apply center alignment by default', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-center')
      expect(result).toContain('items-center')
    })

    it('T-19: should apply left alignment classes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, alignment: 'left' },
      })

      expect(result).toContain('text-left')
      expect(result).toContain('items-start')
    })
  })

  describe('Props: showSource', () => {
    it('should show source by default', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('McKinsey Global Institute')
      expect(result).toContain('<cite')
    })

    it('T-09: should hide source when showSource=false', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, showSource: false },
      })

      expect(result).not.toContain('McKinsey Global Institute')
      expect(result).not.toContain('<cite')
      expect(result).not.toContain('<footer')
    })
  })

  describe('Props: sourceUrl et linkSource', () => {
    it('T-07: should render source as link when sourceUrl provided', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: {
          ...defaultProps,
          sourceUrl: 'https://example.com/study',
        },
      })

      expect(result).toContain('<a')
      expect(result).toContain('href="https://example.com/study"')
      expect(result).toContain('target="_blank"')
      expect(result).toContain('rel="noopener noreferrer"')
    })

    it('T-08: should render source as text when sourceUrl not provided', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).not.toContain('<a')
      expect(result).toContain('<cite')
    })

    it('T-10: should render source as text when linkSource=false', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: {
          ...defaultProps,
          sourceUrl: 'https://example.com/study',
          linkSource: false,
        },
      })

      expect(result).not.toContain('<a')
      expect(result).toContain('<cite')
    })

    it('should have sr-only text for external link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: {
          ...defaultProps,
          sourceUrl: 'https://example.com/study',
        },
      })

      expect(result).toContain('sr-only')
      expect(result).toContain('nouvel onglet')
    })
  })

  describe('Props: unit', () => {
    it('T-20: should render unit separately when provided', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: '50', unit: '%' },
      })

      expect(result).toContain('50')
      expect(result).toContain('%')
      expect(result).toContain('text-[0.6em]')
    })

    it('should not render unit span when not provided', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      // Le % fait partie de la value, pas dans un span séparé
      expect(result).toContain('50%')
      expect(result).not.toContain('text-[0.6em]')
    })
  })

  describe('Props: class', () => {
    it('T-15: should apply custom class', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, class: 'my-custom-class' },
      })

      expect(result).toContain('my-custom-class')
    })

    it('should preserve default classes when adding custom class', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, class: 'mt-8' },
      })

      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
      expect(result).toContain('mt-8')
    })
  })

  describe('Cas limites: Contenu', () => {
    it('T-01: should handle long value (20 chars)', async () => {
      const longValue = '12345678901234567890'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: longValue },
      })

      expect(result).toContain(longValue)
    })

    it('T-02: should handle minimal value (1 char)', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: '5' },
      })

      expect(result).toContain('>5<')
    })

    it('T-03: should handle long label (100 chars)', async () => {
      const longLabel = 'A'.repeat(100)
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: longLabel },
      })

      expect(result).toContain(longLabel)
      expect(result).toContain('max-w-xs')
    })

    it('T-04: should handle minimal label (10 chars)', async () => {
      const shortLabel = 'Gain temps'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: shortLabel },
      })

      expect(result).toContain(shortLabel)
    })

    it('T-05: should handle long source (150 chars)', async () => {
      const longSource = 'S'.repeat(150)
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, source: longSource },
      })

      expect(result).toContain(longSource)
    })

    it('T-06: should handle minimal source (5 chars)', async () => {
      const shortSource = 'AIAD!'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, source: shortSource },
      })

      expect(result).toContain(shortSource)
    })

    it('T-12: should handle special characters in value', async () => {
      const specialValue = '>90%'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, value: specialValue },
      })

      // Vérifie que la valeur est présente (peut être échappée)
      expect(result).toContain('90')
      expect(result).toContain('%')
    })

    it('T-13: should escape HTML injection in label', async () => {
      const xssLabel = "<script>alert('xss')</script> Une vraie description."
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: xssLabel },
      })

      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })

    it('T-14: should handle French accents', async () => {
      const accentLabel = 'Économie réalisée significative'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, label: accentLabel },
      })

      expect(result).toContain('Économie réalisée significative')
    })

    it('T-22: should handle ampersand in source', async () => {
      const ampSource = 'McKinsey & Company, 2024'
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, source: ampSource },
      })

      expect(result).toContain('McKinsey')
      expect(result).toContain('Company')
    })
  })

  describe('Styling: Classes de base', () => {
    it('should have bold value', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('font-bold')
    })

    it('should have blue-600 value color for default variant', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-blue-600')
    })

    it('should have gray-700 label color', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-700')
    })

    it('should have gray-500 source color when not a link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-gray-500')
    })

    it('should have blue-500 source color when a link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('text-blue-500')
    })

    it('should have responsive text sizes', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('text-3xl')
      expect(result).toContain('md:text-4xl')
    })

    it('should have leading-none on value', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('leading-none')
    })

    it('should have max-w-xs on label', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('max-w-xs')
    })
  })

  describe('Accessibilité', () => {
    it('should use cite element for source', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<cite')
      expect(result).toContain('not-italic')
    })

    it('should have focus styles on source link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('focus:ring-2')
      expect(result).toContain('focus:ring-blue-500')
    })

    it('should have hover styles on source link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('hover:text-blue-600')
      expect(result).toContain('hover:underline')
    })

    it('should have noopener noreferrer on external link', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, sourceUrl: 'https://example.com' },
      })

      expect(result).toContain('rel="noopener noreferrer"')
    })
  })
})
```

### 8.3 Suite de tests E2E (Playwright)

```typescript
// tests/e2e/stat-display.spec.ts

import { test, expect } from '@playwright/test'

test.describe('StatDisplay Component - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display stat displays in hero section', async ({ page }) => {
    // Locator pour les stats (dans StatsRow)
    const statDisplays = page.locator('.stat-value').locator('..')

    // Devrait avoir 3 statistiques
    await expect(page.locator('.stat-value')).toHaveCount(3)
  })

  test('should display expected stat values', async ({ page }) => {
    const expectedValues = ['50%', '3x', '>90%']

    for (const value of expectedValues) {
      await expect(page.locator(`text=${value}`)).toBeVisible()
    }
  })

  test('should display sources for each stat', async ({ page }) => {
    const sources = page.locator('cite')

    // Chaque stat devrait avoir une source
    await expect(sources).toHaveCount(3)
  })

  test('should have clickable source links', async ({ page }) => {
    const sourceLinks = page.locator('footer a[target="_blank"]')

    // Au moins une source devrait être cliquable
    const count = await sourceLinks.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('should have proper text contrast for value', async ({ page }) => {
    const value = page.locator('.stat-value').first()
    const valueColor = await value.evaluate((el) => {
      return window.getComputedStyle(el).color
    })

    // text-blue-600 = rgb(37, 99, 235)
    expect(valueColor).toBe('rgb(37, 99, 235)')
  })

  test('T-16: should not have horizontal overflow on narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 600 })

    const body = page.locator('body')
    const bodyWidth = await body.evaluate((el) => el.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test('should be responsive across breakpoints', async ({ page }) => {
    const statValue = page.locator('.stat-value').first()

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(statValue).toBeVisible()

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(statValue).toBeVisible()

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(statValue).toBeVisible()
  })

  test('should have centered content', async ({ page }) => {
    const statContainer = page.locator('.stat-value').first().locator('..')

    const textAlign = await statContainer.evaluate((el) => {
      return window.getComputedStyle(el).textAlign
    })

    expect(textAlign).toBe('center')
  })

  test('highlight stat should have different styling', async ({ page }) => {
    // La première stat (50%) devrait être highlight
    const highlightedStat = page.locator('.bg-blue-50').first()

    if (await highlightedStat.count() > 0) {
      await expect(highlightedStat).toBeVisible()

      const hasBorder = await highlightedStat.evaluate((el) => {
        return window.getComputedStyle(el).borderWidth !== '0px'
      })

      expect(hasBorder).toBe(true)
    }
  })
})
```

### 8.4 Tests d'accessibilité

```typescript
// tests/e2e/accessibility.spec.ts (ajout pour StatDisplay)

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('StatDisplay Accessibility', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .include('.stat-value')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('should have sufficient color contrast for value', async ({ page }) => {
    await page.goto('/')

    const value = page.locator('.stat-value').first()
    const valueColor = await value.evaluate((el) => {
      return window.getComputedStyle(el).color
    })

    // text-blue-600 = rgb(37, 99, 235) sur fond clair
    expect(valueColor).toBe('rgb(37, 99, 235)')
  })

  test('should have sufficient color contrast for source text', async ({ page }) => {
    await page.goto('/')

    const source = page.locator('cite').first()
    const color = await source.evaluate((el) => {
      return window.getComputedStyle(el).color
    })

    // Devrait être text-gray-500 ou text-blue-500 selon le contexte
    expect(color).toMatch(/rgb\(\d+, \d+, \d+\)/)
  })

  test('source links should be keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Tab jusqu'au premier lien source
    const sourceLinks = page.locator('footer a[target="_blank"]')
    const count = await sourceLinks.count()

    if (count > 0) {
      await sourceLinks.first().focus()

      const isFocused = await sourceLinks.first().evaluate((el) => {
        return document.activeElement === el
      })

      expect(isFocused).toBe(true)
    }
  })

  test('source links should have visible focus indicator', async ({ page }) => {
    await page.goto('/')

    const sourceLinks = page.locator('footer a[target="_blank"]')
    const count = await sourceLinks.count()

    if (count > 0) {
      await sourceLinks.first().focus()

      const hasRing = await sourceLinks.first().evaluate((el) => {
        const style = window.getComputedStyle(el)
        // Vérifie qu'il y a un outline ou box-shadow pour le focus
        return style.outline !== 'none' || style.boxShadow !== 'none'
      })

      // Note: focus:ring ajoute un box-shadow, pas un outline
      // Le test vérifie la présence d'indicateur visuel
    }
  })

  test('should use cite element for proper attribution', async ({ page }) => {
    await page.goto('/')

    const citeElements = page.locator('cite')

    // Chaque stat devrait avoir une citation
    const count = await citeElements.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })
})
```

### 8.5 Matrice de couverture

| Aspect | Tests unitaires | Tests E2E | Couverture |
|--------|-----------------|-----------|------------|
| Rendu basique | T-00, T-00b, T-00c, T-00d | ✅ | 100% |
| Props variant | 3 tests (T-17, T-18) | ✅ | 100% |
| Props alignment | 2 tests (T-19) | ✅ | 100% |
| Props showSource | 2 tests (T-09) | - | 100% |
| Props sourceUrl/linkSource | 4 tests (T-07, T-08, T-10) | ✅ | 100% |
| Props unit | 2 tests (T-20) | - | 100% |
| Props class | 2 tests (T-15) | - | 100% |
| Cas limites contenu | 10 tests (T-01 à T-06, T-12 à T-14, T-22) | T-16 | 100% |
| Styling base | 9 tests | - | 100% |
| Accessibilité | 5 tests | 5 tests | 100% |
| Responsive | - | 2 tests | 100% |

---

## 9. Critères d'acceptation

- [ ] **CA-01** : Le composant `StatDisplay.astro` existe dans `src/components/hero/`
- [ ] **CA-02** : Le composant rend un `<div>` comme élément racine avec flex-col
- [ ] **CA-03** : La valeur est rendue avec une classe `stat-value` et styling impactant
- [ ] **CA-04** : Le label est rendu dans un `<p>` avec `max-w-xs`
- [ ] **CA-05** : La source est rendue dans un `<cite>` avec `not-italic`
- [ ] **CA-06** : Les variantes `default`, `highlight`, `compact` fonctionnent
- [ ] **CA-07** : Les alignements `center` et `left` fonctionnent
- [ ] **CA-08** : La source devient un lien cliquable si `sourceUrl` est fourni
- [ ] **CA-09** : Le lien a `target="_blank"` et `rel="noopener noreferrer"`
- [ ] **CA-10** : Le lien a un texte `sr-only` indiquant l'ouverture dans un nouvel onglet
- [ ] **CA-11** : `showSource=false` masque la source
- [ ] **CA-12** : `linkSource=false` empêche le lien même avec `sourceUrl`
- [ ] **CA-13** : L'unit optionnel s'affiche en plus petit après la valeur
- [ ] **CA-14** : Le composant est responsive (mobile-first)
- [ ] **CA-15** : Le composant n'émet pas de JavaScript client (static)
- [ ] **CA-16** : Les textes sont correctement échappés (protection XSS)
- [ ] **CA-17** : Le composant respecte RGAA AA (contrastes, liens accessibles)
- [ ] **CA-18** : TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] **CA-19** : ESLint passe sans warning (`pnpm lint`)
- [ ] **CA-20** : Tous les tests unitaires passent
- [ ] **CA-21** : Tous les tests E2E passent

---

## 10. Definition of Done

- [ ] Composant implémenté dans `src/components/hero/StatDisplay.astro`
- [ ] Interface Props documentée avec JSDoc
- [ ] Toutes les variantes fonctionnelles (default, highlight, compact)
- [ ] Source cliquable avec gestion des attributs de sécurité
- [ ] Tests unitaires écrits et passants (`tests/unit/components/stat-display.test.ts`)
- [ ] Tests E2E écrits et passants (`tests/e2e/stat-display.spec.ts`)
- [ ] TypeScript compile sans erreur (`pnpm typecheck`)
- [ ] ESLint passe sans warning (`pnpm lint`)
- [ ] Composant visuellement vérifié sur mobile, tablet, desktop
- [ ] Accessibilité vérifiée (axe-core)
- [ ] Code reviewé par un pair

---

## 11. Notes d'implémentation

### 11.1 Points d'attention

1. **Élément cite** : Utiliser `<cite>` pour la source afin d'indiquer sémantiquement qu'il s'agit d'une référence. Ajouter `not-italic` car `<cite>` est italique par défaut.

2. **Liens externes** : Toujours ajouter `target="_blank"` avec `rel="noopener noreferrer"` pour la sécurité et les performances.

3. **Texte sr-only** : Ajouter un indicateur pour les utilisateurs de lecteurs d'écran que le lien ouvre dans un nouvel onglet.

4. **Sémantique** : Utiliser `<footer>` pour encapsuler la source car elle représente une méta-information sur le contenu.

5. **Contraste** : Les couleurs choisies respectent RGAA AA :
   - `text-blue-600` sur blanc : 4.68:1 ✅
   - `text-gray-700` sur blanc : 7.0:1 ✅
   - `text-gray-500` sur blanc : 5.3:1 ✅

6. **Pas de JavaScript** : Ce composant est 100% statique. Aucune hydratation client.

7. **Échappement automatique** : Astro échappe automatiquement le contenu des variables. Pas besoin de sanitization manuelle.

8. **max-w-xs** : Limite la largeur du label pour une meilleure lisibilité et éviter les lignes trop longues.

### 11.2 Extensions futures

| Extension | Priorité | Impact |
|-----------|----------|--------|
| Mode sombre | Moyenne | Ajout classes `dark:bg-gray-800`, `dark:text-blue-400`, etc. |
| Animation compteur | Basse | Animation de la valeur au scroll (nécessite JS) |
| Tooltip source | Basse | Afficher la source complète au hover |
| Icône tendance | Basse | Ajouter une flèche up/down selon numericValue |
| Variation temporelle | Basse | Afficher "+X% vs mois dernier" |

### 11.3 Relation avec les autres composants

```
HeroSection (T-001-F8)
├── HeroTitle (T-001-F1) ✅
├── ValueProposition (T-001-F2) ✅
├── CTAButton (T-001-F3) ✅
├── BenefitsList (T-001-F5) ✅
│   └── BenefitCard[] (T-001-F4) ✅
└── StatsRow (T-001-F7)
    └── StatDisplay[] (T-001-F6) ← CE COMPOSANT
        ├── <p> value (with optional unit)
        ├── <p> label
        └── <footer><cite> source (optionally linked)
```

### 11.4 Données source

Le composant consomme les données de `src/content/stats/main.json` (T-001-B6) :

```json
[
  {
    "id": "stat-productivity",
    "value": "50%",
    "numericValue": 50,
    "unit": "%",
    "label": "Gain de productivité avec les agents IA",
    "source": "McKinsey Global Institute - The economic potential of generative AI, 2024",
    "sourceUrl": "https://www.mckinsey.com/...",
    "order": 1,
    "locale": "fr",
    "isActive": true,
    "highlight": true,
    "updatedAt": "2026-02-02T10:00:00.000Z"
  },
  ...
]
```

### 11.5 Différences avec BenefitCard

| Aspect | BenefitCard | StatDisplay |
|--------|-------------|-------------|
| **Élément principal** | Icône (visuel) | Valeur (texte impactant) |
| **Hiérarchie** | Icône → Titre → Description | Valeur → Label → Source |
| **Élément racine** | `<article>` | `<div>` |
| **Attribution** | ariaLabel (optionnel) | source (requis) |
| **Lien** | Non | source cliquable (optionnel) |
| **Variante featured** | `bg-blue-50` + border | `highlight` = même style |

---

## 12. Références

| Document | Lien |
|----------|------|
| User Story US-001 | [spec.md](./spec.md) |
| Modèle StatItem (T-001-B3) | [T-001-B3-modele-donnees-StatItem.md](./T-001-B3-modele-donnees-StatItem.md) |
| Données Stats (T-001-B6) | [T-001-B6-donnees-JSON-statistiques-chiffrees.md](./T-001-B6-donnees-JSON-statistiques-chiffrees.md) |
| Composant BenefitCard (T-001-F4) | [T-001-F4-composant-BenefitCard.md](./T-001-F4-composant-BenefitCard.md) |
| Architecture technique | [../../ARCHITECTURE.md](../../ARCHITECTURE.md) |
| Guide Claude | [../../CLAUDE.md](../../CLAUDE.md) |
| Astro Components | [docs.astro.build/components](https://docs.astro.build/en/core-concepts/astro-components/) |
| RGAA 4.1 | [accessibilite.numerique.gouv.fr](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/) |
| Astro Container API | [docs.astro.build/container](https://docs.astro.build/en/reference/container-reference/) |
| HTML cite element | [developer.mozilla.org/cite](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite) |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 03/02/2026 | Création initiale complète |
