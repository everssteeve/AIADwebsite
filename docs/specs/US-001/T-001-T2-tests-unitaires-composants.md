# T-001-T2 : Tests unitaires composants (HeroTitle, ValueProposition, CTAButton, BenefitCard, BenefitsList, StatDisplay, StatsRow)

| Métadonnée | Valeur |
|------------|--------|
| **Version** | 1.0 |
| **Date** | 05 février 2026 |
| **Statut** | ✅ Terminé |
| **User Story** | [US-001 - Comprendre AIAD rapidement](./spec.md) |
| **Dépendances** | T-001-F1 à T-001-F7 (composants atomiques et composés) |
| **Bloque** | T-001-T3 (tests intégration HeroSection) |

---

## 1. Objectif

Valider de manière exhaustive les **7 composants Astro** de la hero section par des tests unitaires couvrant :

- **Rendu HTML correct** : Chaque composant génère le markup attendu (balises sémantiques, hiérarchie, structure)
- **Props et valeurs par défaut** : Chaque prop produit les classes CSS et attributs corrects, les défauts sont appliqués
- **Variantes visuelles** : Toutes les combinaisons de variantes (size, variant, alignment, emphasis, etc.) sont testées
- **Accessibilité (a11y)** : ARIA attributes, rôles, balises sémantiques, focus styles, liens externes sécurisés
- **Cas limites** : Contenus longs/courts, caractères spéciaux, accents français, emojis, injection HTML (XSS)
- **Composition** : Les composants conteneurs (BenefitsList, StatsRow) propagent correctement les props à leurs enfants
- **Rendu conditionnel** : Éléments affichés/masqués selon les props (showTagline, showSource, showTitle, etc.)

### Composants sous test

| Composant | Type | Fichier source | Fichier test |
|-----------|------|---------------|--------------|
| **HeroTitle** | Atomique | `src/components/hero/HeroTitle.astro` | `tests/unit/components/hero-title.test.ts` |
| **ValueProposition** | Atomique | `src/components/hero/ValueProposition.astro` | `tests/unit/components/value-proposition.test.ts` |
| **CTAButton** | Atomique | `src/components/common/CTAButton.astro` | `tests/unit/components/cta-button.test.ts` |
| **BenefitCard** | Atomique | `src/components/hero/BenefitCard.astro` | `tests/unit/components/benefit-card.test.ts` |
| **BenefitsList** | Composé | `src/components/hero/BenefitsList.astro` | `tests/unit/components/benefits-list.test.ts` |
| **StatDisplay** | Atomique | `src/components/hero/StatDisplay.astro` | `tests/unit/components/stat-display.test.ts` |
| **StatsRow** | Composé | `src/components/hero/StatsRow.astro` | `tests/unit/components/stats-row.test.ts` |

---

## 2. Contexte technique

### 2.1 Stack de test

| Outil | Version | Rôle |
|-------|---------|------|
| **Vitest** | 1.x | Framework de test (via `getViteConfig` d'Astro) |
| **Astro Container API** | experimental | Rendu serveur des composants `.astro` en string HTML |
| **TypeScript** | 5.x | Typage des props, fixtures et assertions |

### 2.2 Approche de test

Les composants Astro sont testés via l'**Astro Container API** (`experimental_AstroContainer`). Cette API permet de :
- Rendre un composant `.astro` en HTML string côté serveur
- Passer des props typées au composant
- Vérifier le HTML de sortie via des assertions string/regex

```typescript
import { experimental_AstroContainer as AstroContainer } from 'astro/container'

const container = await AstroContainer.create()
const result = await container.renderToString(Component, { props: { ... } })
```

**Limites connues :**
- Pas d'interaction (click, hover) — couvert par E2E (T-001-T3)
- Pas de JavaScript client — couvert par E2E
- L'échappement HTML Astro transforme `'` en `&#39;`, `&` en `&amp;`, `<` en `&lt;`
- Les composants avec `import('astro:content')` dynamique nécessitent que les données soient passées via props en test

### 2.3 Configuration Vitest

```typescript
// vitest.config.ts
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
    },
  },
})
```

### 2.4 Structure des fichiers de test

```
tests/
└── unit/
    └── components/
        ├── hero-title.test.ts           # Tests HeroTitle
        ├── value-proposition.test.ts    # Tests ValueProposition
        ├── cta-button.test.ts           # Tests CTAButton
        ├── benefit-card.test.ts         # Tests BenefitCard
        ├── benefits-list.test.ts        # Tests BenefitsList
        ├── stat-display.test.ts         # Tests StatDisplay
        └── stats-row.test.ts            # Tests StatsRow
```

### 2.5 Types importés

```typescript
// Types nécessaires pour les fixtures
import type { BenefitItem, BenefitIcon } from '@/types'
import type { StatItem } from '@/types'
import type { HeroContent } from '@/types'
```

---

## 3. Spécifications fonctionnelles

### 3.1 Périmètre des tests

T-001-T2 couvre les tests unitaires de rendu de chaque composant individuel. La tâche consolide et vérifie les fichiers de test existants (créés lors de T-001-F1 à T-001-F7).

**Inclus :**
1. **Tests de rendu de base** : Structure HTML correcte, balises sémantiques
2. **Tests de props** : Chaque prop modifie le rendu comme attendu
3. **Tests de variantes** : Toutes les valeurs d'enum produisent les classes correctes
4. **Tests d'accessibilité** : ARIA, rôles, hiérarchie de titres, focus visible
5. **Tests de cas limites** : Contenus aux bornes, XSS, caractères spéciaux
6. **Tests de composition** : Propagation des props dans les composants conteneurs

**Exclu (couvert par T-001-T3 et T-001-T4) :**
- Tests d'intégration HeroSection (assemblage complet)
- Tests d'interaction utilisateur (JavaScript client)
- Tests Lighthouse/performance
- Tests de responsive design visuels

### 3.2 Matrice des tests par composant

#### 3.2.1 HeroTitle (`hero-title.test.ts`)

| Catégorie | ID | Description | Assertion principale |
|-----------|----|-------------|---------------------|
| **Rendu** | HT-00 | Rendu du titre dans `<h1>` | `toContain('<h1')` et contient le texte |
| **Rendu** | HT-00b | Rendu de la tagline dans `<p>` | `toContain('<p')` et contient le texte |
| **Rendu** | HT-01 | Un seul `<h1>` dans le composant | Compte des `<h1` === 1 |
| **Props** | HT-02 | `align='center'` par défaut | `toContain('text-center')` |
| **Props** | HT-03 | `align='left'` applique `text-left` | `toContain('text-left')`, `not.toContain('text-center')` |
| **Props** | HT-04 | `align='right'` applique `text-right` | `toContain('text-right')` |
| **Props** | HT-05 | `align='center'` ajoute `mx-auto` à la tagline | `toContain('mx-auto')` |
| **Props** | HT-06 | `size='lg'` par défaut (classes `lg:text-5xl`) | `toContain('lg:text-5xl')` |
| **Props** | HT-07 | `size='sm'` applique `text-2xl md:text-3xl` | `toContain('text-2xl')`, `toContain('md:text-3xl')` |
| **Props** | HT-08 | `size='md'` applique `text-3xl md:text-4xl` | `toContain('text-3xl')` |
| **Props** | HT-09 | Gap correct par taille (`sm→gap-2`, `md→gap-3`, `lg→gap-4`) | `toContain('gap-N')` |
| **Props** | HT-10 | `showTagline=false` masque la tagline | `not.toContain('<p')` |
| **Props** | HT-11 | `showTagline=true` par défaut | `toContain('<p')` |
| **Props** | HT-12 | `class` ajoutée au conteneur | `toContain('my-custom-class')` |
| **Props** | HT-13 | Classes par défaut préservées avec `class` custom | `toContain('flex')` et `toContain('my-custom-class')` |
| **Props** | HT-14 | `id` appliqué au `<h1>` | `toContain('id="hero-title"')` |
| **Style** | HT-15 | `font-bold` sur le titre | `toMatch(/<h1[^>]*class="[^"]*font-bold/)` |
| **Style** | HT-16 | `text-gray-900` sur le titre | `toMatch(/<h1[^>]*class="[^"]*text-gray-900/)` |
| **Style** | HT-17 | `tracking-tight` sur le titre | `toMatch(/<h1[^>]*class="[^"]*tracking-tight/)` |
| **Style** | HT-18 | `text-gray-600` sur la tagline | `toMatch(/<p[^>]*class="[^"]*text-gray-600/)` |
| **CL** | HT-CL-01 | Titre long (80 caractères) | Contient le texte complet |
| **CL** | HT-CL-02 | Titre court (10 caractères) | Contient le texte complet |
| **CL** | HT-CL-03 | Tagline longue (120 caractères) | Contient le texte + `max-w-2xl` |
| **CL** | HT-CL-04 | Tagline vide avec `showTagline=true` | Rendu `<p>` vide |
| **CL** | HT-CL-05 | Caractères spéciaux dans le titre | `&#39;` pour apostrophes, `&amp;` pour `&` |
| **CL** | HT-CL-06 | Emoji dans le titre | Contient l'emoji |
| **CL** | HT-CL-07 | Injection HTML dans le titre | `&lt;script&gt;`, pas `<script>` |

#### 3.2.2 ValueProposition (`value-proposition.test.ts`)

| Catégorie | ID | Description | Assertion principale |
|-----------|----|-------------|---------------------|
| **Rendu** | VP-00 | Rendu du texte dans `<p>` | `toContain('<p')` et contient le texte |
| **Rendu** | VP-01 | Un seul `<p>` dans le composant | Compte des `<p` === 1 |
| **Rendu** | VP-02 | Pas de balise heading | `not.toMatch(/<h[1-6]/)` |
| **Props** | VP-03 | `align='center'` par défaut avec `mx-auto` | `toContain('text-center')`, `toContain('mx-auto')` |
| **Props** | VP-04 | `align='left'` sans `mx-auto` | `toContain('text-left')`, `not.toContain('mx-auto')` |
| **Props** | VP-05 | `align='right'` avec `ml-auto` | `toContain('text-right')`, `toContain('ml-auto')` |
| **Props** | VP-06 | `size='md'` par défaut | `toContain('text-base')`, `toContain('md:text-lg')` |
| **Props** | VP-07 | `size='sm'` applique `text-sm md:text-base` | Classes correctes |
| **Props** | VP-08 | `size='lg'` applique `text-lg md:text-xl` | Classes correctes |
| **Props** | VP-09 | `emphasis='normal'` par défaut | `toContain('text-gray-600')`, `toContain('font-normal')` |
| **Props** | VP-10 | `emphasis='subtle'` applique `text-gray-500` | Classes correctes |
| **Props** | VP-11 | `emphasis='strong'` applique `text-gray-700 font-medium` | Classes correctes |
| **Props** | VP-12 | `maxWidth='lg'` par défaut (`max-w-3xl`) | `toContain('max-w-3xl')` |
| **Props** | VP-13 | `maxWidth='sm'` applique `max-w-xl` | `toContain('max-w-xl')` |
| **Props** | VP-14 | `maxWidth='md'` applique `max-w-2xl` | `toContain('max-w-2xl')` |
| **Props** | VP-15 | `maxWidth='full'` pas de max-width | `not.toContain('max-w-')` |
| **Props** | VP-16 | `class` custom préserve les défauts | `toContain('leading-relaxed')` + custom |
| **Style** | VP-17 | `leading-relaxed` toujours présent | `toMatch(/<p[^>]*class="[^"]*leading-relaxed/)` |
| **CL** | VP-CL-01 | Texte long (200 caractères) | Contient le texte + `max-w-3xl` |
| **CL** | VP-CL-02 | Texte court (20 caractères) | Contient le texte |
| **CL** | VP-CL-03 | Texte vide | Rendu `<p>` vide |
| **CL** | VP-CL-04 | Caractères spéciaux (apostrophe, &) | Échappement HTML correct |
| **CL** | VP-CL-05 | Emoji dans le texte | Contient l'emoji |
| **CL** | VP-CL-06 | Injection HTML | `&lt;script&gt;` échappé |
| **CL** | VP-CL-07 | Toutes props par défaut appliquées | Vérification complète des 5 défauts |

#### 3.2.3 CTAButton (`cta-button.test.ts`)

| Catégorie | ID | Description | Assertion principale |
|-----------|----|-------------|---------------------|
| **Rendu** | CTA-00 | Rendu comme `<a>` par défaut | `toContain('<a')`, `toContain('href=')` |
| **Rendu** | CTA-00b | Texte dans `<span>` | `toMatch(/<span[^>]*>.../)` |
| **Rendu** | CTA-01 | Icône arrow par défaut (SVG) | `toContain('<svg')`, `toContain('aria-hidden')` |
| **Rendu** | CTA-02 | Un seul `<a>` ou `<button>` | Somme des comptages === 1 |
| **Props** | CTA-03 | `variant='primary'` par défaut | `bg-blue-600`, `text-white`, `hover:bg-blue-700` |
| **Props** | CTA-04 | `variant='secondary'` | `bg-gray-100`, `text-gray-900` |
| **Props** | CTA-05 | `variant='outline'` | `bg-transparent`, `border-2`, `border-blue-600` |
| **Props** | CTA-06 | `variant='ghost'` | `bg-transparent`, pas de `border-2` |
| **Props** | CTA-07 | `size='lg'` par défaut | `md:text-lg`, `md:px-8`, `md:py-4` |
| **Props** | CTA-08 | `size='md'` | `text-base`, `px-6`, `py-3` |
| **Props** | CTA-09 | `size='sm'` | `text-sm`, `px-4`, `py-2` |
| **Props** | CTA-10 | `as='button'` rendu `<button>` | `toContain('<button')`, `not.toContain('<a')` |
| **Props** | CTA-11 | `type='submit'` sur `<button>` | `toContain('type="submit"')` |
| **Props** | CTA-12 | `type` ignoré sur `<a>` | `not.toContain('type="submit"')` |
| **Props** | CTA-13 | `icon='external'` change le SVG | Path SVG `M10 6H6` |
| **Props** | CTA-14 | `icon='none'` pas de SVG | `not.toContain('<svg')` |
| **Props** | CTA-15 | `iconPosition='left'` : SVG avant span | Index SVG < index span |
| **Props** | CTA-16 | `iconPosition='right'` (défaut) : SVG après span | Index SVG > index `</span>` |
| **Props** | CTA-17 | `newTab=false` : pas de `target="_blank"` | `not.toContain('target="_blank"')` |
| **Props** | CTA-18 | `newTab=true` : `target="_blank"` + `rel="noopener noreferrer"` | Les deux attributs présents |
| **Props** | CTA-19 | `disabled=true` (lien) : classes + aria-disabled, pas de href | `opacity-50`, `cursor-not-allowed`, `aria-disabled="true"` |
| **Props** | CTA-20 | `disabled=true` (bouton) : attribut `disabled` | `toContain('disabled')` |
| **Props** | CTA-21 | `fullWidth=true` ajoute `w-full` | `toContain('w-full')` |
| **Props** | CTA-22 | `fullWidth=false` (défaut) pas de `w-full` | `not.toContain('w-full')` |
| **Props** | CTA-23 | `ariaLabel` appliqué | `toContain('aria-label="..."')` |
| **Props** | CTA-24 | Pas de `ariaLabel` → pas d'attribut | `not.toContain('aria-label=')` |
| **Props** | CTA-25 | `class` custom préserve les défauts | `inline-flex`, `rounded-lg` + custom |
| **Style** | CTA-26 | Classes de base : `inline-flex items-center justify-center` | Présentes |
| **Style** | CTA-27 | `rounded-lg` | Présent |
| **Style** | CTA-28 | `transition-all duration-200` | Présentes |
| **Style** | CTA-29 | Focus ring : `focus:ring-2 focus:ring-offset-2` | Présentes |
| **CL** | CTA-CL-01 | Texte long (50 caractères) | Contient le texte |
| **CL** | CTA-CL-02 | Texte court (2 caractères) | Contient le texte |
| **CL** | CTA-CL-03 | `href` vide → défaut `#` | `toContain('href="#"')` |
| **CL** | CTA-CL-04 | `href` undefined → défaut `#` | `toContain('href="#"')` |
| **CL** | CTA-CL-05 | Caractères spéciaux dans le texte | Échappement HTML correct |
| **CL** | CTA-CL-06 | Injection HTML dans le texte | `&lt;script&gt;` échappé |

#### 3.2.4 BenefitCard (`benefit-card.test.ts`)

| Catégorie | ID | Description | Assertion principale |
|-----------|----|-------------|---------------------|
| **Rendu** | BC-00 | Rendu dans `<article>` | `toContain('<article')` |
| **Rendu** | BC-00b | Titre dans `<h3>` | `toContain('<h3')` |
| **Rendu** | BC-00c | Description dans `<p>` | `toContain('<p')` |
| **Rendu** | BC-01 | Icône rendue en SVG avec `text-blue-600` | `toContain('<svg')`, `toContain('text-blue-600')` |
| **Rendu** | BC-02 | Conteneur d'icône avec `bg-blue-100` | `toContain('bg-blue-100')` |
| **Props** | BC-03 | `variant='default'` : `bg-white p-6` | Classes correctes |
| **Props** | BC-04 | `variant='compact'` : `bg-white p-4` | `toContain('p-4')` |
| **Props** | BC-05 | `variant='featured'` : `bg-blue-50 border border-blue-100 rounded-xl` | Classes correctes |
| **Props** | BC-06 | `iconPosition='top'` (défaut) : `flex-col items-center text-center` | Classes correctes |
| **Props** | BC-07 | `iconPosition='left'` : `flex-row items-start text-left` | Classes correctes |
| **Props** | BC-08 | `iconSize='md'` (défaut) : `w-10 h-10 md:w-12 md:h-12` | Classes correctes |
| **Props** | BC-09 | `iconSize='sm'` : `w-8 h-8` | Classes correctes |
| **Props** | BC-10 | `iconSize='lg'` : `w-14 h-14 md:w-16 md:h-16` | Classes correctes |
| **Props** | BC-11 | `ariaLabel` fourni → `aria-label` sur conteneur icône, pas de `role="presentation"` | Attributs corrects |
| **Props** | BC-12 | Sans `ariaLabel` → `role="presentation"` sur conteneur icône | `toContain('role="presentation"')` |
| **Props** | BC-13 | SVG toujours `aria-hidden="true"` | `toContain('aria-hidden="true"')` |
| **Props** | BC-14 | `class` custom appliquée | Custom class présente |
| **Props** | BC-15 | 10 icônes testées (échantillon représentatif) | Chaque icône produit un SVG |
| **Style** | BC-16 | `font-semibold` sur le titre | Présent |
| **Style** | BC-17 | `text-gray-900` sur le titre | Présent |
| **Style** | BC-18 | `text-gray-600 leading-relaxed` sur la description | Présentes |
| **Style** | BC-19 | `rounded-xl` sur conteneur d'icône | Présent |
| **a11y** | BC-20 | Exactement un `<article>` | Comptage === 1 |
| **a11y** | BC-21 | `<h3>` uniquement (pas h2 ni h4) | `toContain('<h3')`, `not.toContain('<h2')` |
| **CL** | BC-CL-01 | Titre long (50 caractères) | Contient le texte |
| **CL** | BC-CL-02 | Titre court (5 caractères) | Contient le texte |
| **CL** | BC-CL-03 | Description longue (150 caractères) | Contient le texte |
| **CL** | BC-CL-04 | Description courte (20 caractères) | Contient le texte |
| **CL** | BC-CL-05 | Caractères spéciaux dans le titre | Échappement correct |
| **CL** | BC-CL-06 | Injection HTML dans la description | `&lt;script&gt;` |
| **CL** | BC-CL-07 | Emoji dans le titre | Contient l'emoji |
| **CL** | BC-CL-08 | Accents français | Rendus correctement |
| **CL** | BC-CL-09 | Newline dans la description | Texte préservé |
| **CL** | BC-CL-10 | `variant='compact'` réduit la taille titre/description | `text-base md:text-lg` vs `text-lg md:text-xl` |

#### 3.2.5 BenefitsList (`benefits-list.test.ts`)

| Catégorie | ID | Description | Assertion principale |
|-----------|----|-------------|---------------------|
| **Rendu** | BL-00 | Rendu dans `<section>` | `toContain('<section')` |
| **Rendu** | BL-00b | `aria-labelledby` sur section | Attribut présent |
| **Rendu** | BL-00c | `<h2>` pour le titre de section | `toContain('<h2')` |
| **Rendu** | BL-01 | Nombre correct de `<article>` (BenefitCards) | Comptage === nombre de benefits |
| **Rendu** | BL-02 | Conteneur `grid` | `toContain('class="grid')` |
| **Props** | BL-03 | `columns='auto'` (défaut) : `grid-cols-1 md:grid-cols-3` | Classes correctes |
| **Props** | BL-04 | `columns=1` : `grid-cols-1` sans `md:grid-cols-*` | Classes correctes |
| **Props** | BL-05 | `columns=2` : `grid-cols-1 md:grid-cols-2` | Classes correctes |
| **Props** | BL-06 | `columns=3` : `grid-cols-1 md:grid-cols-3` | Classes correctes |
| **Props** | BL-07 | `gap='md'` (défaut) : `gap-6 md:gap-8` | Classes correctes |
| **Props** | BL-08 | `gap='sm'` : `gap-4 md:gap-5` | Classes correctes |
| **Props** | BL-09 | `gap='lg'` : `gap-8 md:gap-12` | Classes correctes |
| **Props** | BL-10 | `showTitle=false` (défaut) : titre `sr-only` | `toContain('sr-only')` |
| **Props** | BL-11 | `showTitle=true` : titre visible avec styles | `text-2xl`, `font-bold`, pas `sr-only` |
| **Props** | BL-12 | `title` custom | Contient le texte custom |
| **Props** | BL-13 | `cardVariant='default'` propagé (bg-white) | `toContain('bg-white')` |
| **Props** | BL-14 | `cardVariant='featured'` propagé | `bg-blue-50`, `border-blue-100` |
| **Props** | BL-15 | `cardVariant='compact'` propagé | `toContain('p-4')` |
| **Props** | BL-16 | `centered=true` (défaut) : `mx-auto` | `toContain('mx-auto')` |
| **Props** | BL-17 | `centered=false` : pas de `mx-auto` | `not.toContain('mx-auto')` |
| **Props** | BL-18 | `maxWidth` par défaut `max-w-6xl` | `toContain('max-w-6xl')` |
| **Props** | BL-19 | `maxWidth` custom | Contient la valeur custom |
| **Props** | BL-20 | `class` custom | Custom class présente |
| **Props** | BL-21 | `id` custom → section et title ids corrects | `id="custom"`, `aria-labelledby="custom-title"` |
| **Props** | BL-22 | `iconPosition='left'` propagé aux cartes | `toContain('flex-row')` |
| **Props** | BL-23 | `iconSize='lg'` propagé aux cartes | `toContain('w-14')` |
| **CL** | BL-CL-01 | Liste vide → pas de `<section>` | `not.toContain('<section')` |
| **CL** | BL-CL-02 | 1 bénéfice → 1 `<article>` | Comptage === 1 |
| **CL** | BL-CL-03 | 2 bénéfices | Comptage === 2 |
| **CL** | BL-CL-04 | 5 bénéfices (limite haute) | Comptage === 5 |
| **CL** | BL-CL-05 | 6 bénéfices (dépassement) | Rendus malgré tout (pas de crash) |
| **CL** | BL-CL-06 | Bénéfices pré-filtrés (actifs uniquement) | Nombre correct |
| **CL** | BL-CL-07 | Ordre des bénéfices respecté | Index texte 1 < texte 2 < texte 3 |
| **a11y** | BL-A-01 | `<section>` unique | Comptage === 1 |
| **a11y** | BL-A-02 | `aria-labelledby` pointe vers l'id du `<h2>` | Cohérence des IDs |
| **a11y** | BL-A-03 | `<h2>` pour le titre (pas h1) | `toContain('<h2')`, `not.toContain('<h1')` |
| **a11y** | BL-A-04 | `<h3>` dans chaque BenefitCard | Comptage h3 === nombre de benefits |

#### 3.2.6 StatDisplay (`stat-display.test.ts`)

| Catégorie | ID | Description | Assertion principale |
|-----------|----|-------------|---------------------|
| **Rendu** | SD-00 | Rendu dans `<div>` avec `flex flex-col` | Structure correcte |
| **Rendu** | SD-00b | Valeur rendue avec classe `stat-value` | `toContain('stat-value')` |
| **Rendu** | SD-00c | Label dans `<p>` | `toContain('<p')` |
| **Rendu** | SD-00d | Source dans `<cite>` (par défaut) | `toContain('<cite')` |
| **Props** | SD-01 | `variant='default'` : `bg-transparent p-4 text-3xl text-blue-600` | Classes correctes |
| **Props** | SD-02 | `variant='highlight'` : `bg-blue-50 border border-blue-100 rounded-xl text-4xl text-blue-700` | Classes correctes |
| **Props** | SD-03 | `variant='compact'` : `bg-transparent p-2 text-2xl` | Classes correctes |
| **Props** | SD-04 | `alignment='center'` (défaut) : `text-center items-center` | Classes correctes |
| **Props** | SD-05 | `alignment='left'` : `text-left items-start` | Classes correctes |
| **Props** | SD-06 | `showSource=true` (défaut) : `<cite>` présent | `toContain('<cite')` |
| **Props** | SD-07 | `showSource=false` : pas de `<cite>` ni `<footer>` | `not.toContain('<cite')`, `not.toContain('<footer')` |
| **Props** | SD-08 | `sourceUrl` fourni → source en lien `<a>` | `toContain('<a')`, `target="_blank"` |
| **Props** | SD-09 | Sans `sourceUrl` → source en texte `<cite>` | `not.toContain('<a')`, `toContain('<cite')` |
| **Props** | SD-10 | `linkSource=false` avec `sourceUrl` → texte plain | `not.toContain('<a')` |
| **Props** | SD-11 | `unit` fourni → affiché séparément (`text-[0.6em]`) | `toContain('text-[0.6em]')` |
| **Props** | SD-12 | Sans `unit` → pas de span séparé | `not.toContain('text-[0.6em]')` |
| **Props** | SD-13 | `class` custom | Custom class présente |
| **Style** | SD-14 | `font-bold` sur la valeur | Présent |
| **Style** | SD-15 | `leading-none` sur la valeur | Présent |
| **Style** | SD-16 | `text-gray-700` sur le label | Présent |
| **Style** | SD-17 | `max-w-xs` sur le label | Présent |
| **Style** | SD-18 | Source non-lien : `text-gray-500` | Présent |
| **Style** | SD-19 | Source lien : `text-blue-500` | Présent |
| **Style** | SD-20 | `not-italic` sur `<cite>` | Présent |
| **a11y** | SD-A-01 | `sr-only` "nouvel onglet" sur les liens externes | `toContain('sr-only')` + texte |
| **a11y** | SD-A-02 | `focus:ring-2` sur les liens sources | Présent |
| **a11y** | SD-A-03 | `rel="noopener noreferrer"` sur les liens | Présent |
| **CL** | SD-CL-01 | Valeur longue (20 caractères) | Contient la valeur |
| **CL** | SD-CL-02 | Valeur minimale (1 caractère) | `toContain('>5<')` |
| **CL** | SD-CL-03 | Label long (100 caractères) | Contient + `max-w-xs` |
| **CL** | SD-CL-04 | Label minimal (10 caractères) | Contient le texte |
| **CL** | SD-CL-05 | Source longue (150 caractères) | Contient le texte |
| **CL** | SD-CL-06 | Source minimale (5 caractères) | Contient le texte |
| **CL** | SD-CL-07 | Valeur avec symboles (`>90%`) | Rendu correct (échappé si nécessaire) |
| **CL** | SD-CL-08 | Injection HTML dans le label | `&lt;script&gt;` |
| **CL** | SD-CL-09 | Accents français dans le label | Rendus correctement |
| **CL** | SD-CL-10 | Ampersand dans la source | `&amp;` ou texte correct |
| **CL** | SD-CL-11 | Valeur sans chiffre (`+++`) | Rendu correct |
| **Combo** | SD-CO-01 | `variant='highlight'` + `alignment='left'` | `bg-blue-50` + `text-left items-start` |
| **Combo** | SD-CO-02 | `variant='compact'` + `sourceUrl` | `p-2` + `<a>` |
| **Combo** | SD-CO-03 | `unit` + `variant='highlight'` | `text-[0.6em]` + `text-blue-700` + `bg-blue-50` |

#### 3.2.7 StatsRow (`stats-row.test.ts`)

| Catégorie | ID | Description | Assertion principale |
|-----------|----|-------------|---------------------|
| **Rendu** | SR-00 | Rendu dans `<section>` | `toContain('<section')` |
| **Rendu** | SR-00b | `aria-labelledby` sur section | Attribut présent |
| **Rendu** | SR-00c | `<h2>` pour le titre de section | `toContain('<h2')` |
| **Rendu** | SR-01 | Nombre correct de StatDisplay (`stat-value`) | Comptage === nombre de stats |
| **Rendu** | SR-02 | Conteneur `grid` | `toContain('grid')` |
| **Rendu** | SR-03 | Toutes les valeurs rendues | Contient chaque valeur |
| **Rendu** | SR-04 | Tous les labels rendus | Contient chaque label |
| **Rendu** | SR-05 | Toutes les sources rendues | Contient chaque source |
| **Props** | SR-06 | `columns='auto'` (défaut) | `grid-cols-1 md:grid-cols-3` |
| **Props** | SR-07 | `columns=1` | `grid-cols-1` uniquement |
| **Props** | SR-08 | `columns=2` | `grid-cols-1 md:grid-cols-2` |
| **Props** | SR-09 | `gap='md'` (défaut) : `gap-6 md:gap-8` | Classes correctes |
| **Props** | SR-10 | `gap='sm'` : `gap-4 md:gap-5` | Classes correctes |
| **Props** | SR-11 | `gap='lg'` : `gap-8 md:gap-12` | Classes correctes |
| **Props** | SR-12 | `showTitle=false` (défaut) : titre `sr-only` | `toContain('sr-only')` |
| **Props** | SR-13 | `showTitle=true` : titre visible | Classes titre visibles, pas `sr-only` sur h2 |
| **Props** | SR-14 | `title` custom | Contient le texte custom |
| **Props** | SR-15 | `showDividers=true` (défaut) : séparateurs présents | `border-t`, `border-gray-200`, `md:border-l` |
| **Props** | SR-16 | `showDividers=false` : pas de séparateurs | Pas de classes séparateur |
| **Props** | SR-17 | Pas de séparateur sur la première stat | 2 séparateurs pour 3 stats |
| **Props** | SR-18 | `statVariant` override `highlight` auto | Toutes les stats avec même variante |
| **Props** | SR-19 | Auto-détection `highlight` depuis `stat.highlight` | `bg-blue-50` uniquement sur stat highlight |
| **Props** | SR-20 | Mix `highlight` et `default` : 1 seul `bg-blue-50` | Comptage === 1 |
| **Props** | SR-21 | `showSources=true` (défaut) : sources présentes | `<cite>` présent |
| **Props** | SR-22 | `showSources=false` : pas de sources | `not.toContain('<cite')` |
| **Props** | SR-23 | `linkSources=true` (défaut) : liens sur sources | `<a>`, `target="_blank"` |
| **Props** | SR-24 | `linkSources=false` : sources texte plain | `not.toContain('target="_blank"')` |
| **Props** | SR-25 | `centered=true` (défaut) : `mx-auto` | Présent |
| **Props** | SR-26 | `centered=false` : pas de `mx-auto` | `not.toContain('mx-auto')` |
| **Props** | SR-27 | `maxWidth` par défaut `max-w-5xl` | Présent |
| **Props** | SR-28 | `maxWidth` custom | Contient la valeur custom |
| **Props** | SR-29 | `class` custom | Custom class présente |
| **Props** | SR-30 | `id` custom → section et title ids corrects | IDs cohérents |
| **CL** | SR-CL-01 | Liste vide → pas de `<section>` | `not.toContain('<section')` |
| **CL** | SR-CL-02 | 1 stat → pas de séparateur | Pas de `border-t border-gray-200` |
| **CL** | SR-CL-03 | 2 stats → 1 séparateur | Comptage === 1 |
| **CL** | SR-CL-04 | 4 stats | Comptage stat-value === 4 |
| **CL** | SR-CL-05 | 6 stats (limite haute) | Comptage stat-value === 6 |
| **CL** | SR-CL-06 | Ordre des stats respecté | Index texte 1 < texte 2 < texte 3 |
| **a11y** | SR-A-01 | `<section>` unique | Comptage === 1 |
| **a11y** | SR-A-02 | `aria-labelledby` cohérent avec `<h2>` id | IDs liés |
| **a11y** | SR-A-03 | `<h2>` (pas h1) | Correct |
| **a11y** | SR-A-04 | `<cite>` pour chaque source | Comptage === nombre de stats |
| **a11y** | SR-A-05 | `rel="noopener noreferrer"` sur chaque lien source | Comptage correct |
| **a11y** | SR-A-06 | `sr-only` "nouvel onglet" sur chaque lien | Comptage correct |

---

## 4. Spécifications techniques

### 4.1 Types TypeScript pour les props de test

```typescript
// Types utilisés dans les fixtures de test

import type { BenefitItem, BenefitIcon, StatItem } from '@/types'

// ── HeroTitle Props ──────────────────────────────────────────

interface HeroTitleProps {
  title: string
  tagline: string
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  class?: string
  id?: string
}

// ── ValueProposition Props ───────────────────────────────────

interface ValuePropositionProps {
  text: string
  align?: 'left' | 'center' | 'right'
  size?: 'sm' | 'md' | 'lg'
  emphasis?: 'subtle' | 'normal' | 'strong'
  maxWidth?: 'sm' | 'md' | 'lg' | 'full'
  class?: string
}

// ── CTAButton Props ──────────────────────────────────────────

interface CTAButtonProps {
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

// ── BenefitCard Props ────────────────────────────────────────

interface BenefitCardProps {
  icon: BenefitIcon
  title: string
  description: string
  ariaLabel?: string
  variant?: 'default' | 'compact' | 'featured'
  iconPosition?: 'top' | 'left'
  iconSize?: 'sm' | 'md' | 'lg'
  class?: string
}

// ── BenefitsList Props ───────────────────────────────────────

interface BenefitsListProps {
  benefits?: BenefitItem[]
  columns?: 1 | 2 | 3 | 'auto'
  gap?: 'sm' | 'md' | 'lg'
  cardVariant?: 'default' | 'compact' | 'featured'
  iconPosition?: 'top' | 'left'
  iconSize?: 'sm' | 'md' | 'lg'
  title?: string
  showTitle?: boolean
  centered?: boolean
  maxWidth?: string
  class?: string
  id?: string
}

// ── StatDisplay Props ────────────────────────────────────────

interface StatDisplayProps {
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

// ── StatsRow Props ───────────────────────────────────────────

interface StatsRowProps {
  stats?: StatItem[]
  columns?: 1 | 2 | 3 | 'auto'
  gap?: 'sm' | 'md' | 'lg'
  statVariant?: 'default' | 'highlight' | 'compact'
  showDividers?: boolean
  title?: string
  showTitle?: boolean
  showSources?: boolean
  linkSources?: boolean
  centered?: boolean
  maxWidth?: string
  class?: string
  id?: string
}
```

### 4.2 Fixtures de test

```typescript
// ── HeroTitle ────────────────────────────────────────────────

const heroTitleProps: HeroTitleProps = {
  title: 'AIAD : Le framework pour développer avec des agents IA',
  tagline: 'Structurez votre collaboration avec l\'intelligence artificielle',
}

// ── ValueProposition ─────────────────────────────────────────

const valuePropProps: ValuePropositionProps = {
  text: 'Une méthodologie éprouvée pour intégrer les agents IA dans votre workflow de développement et multiplier votre productivité.',
}

// ── CTAButton ────────────────────────────────────────────────

const ctaButtonProps: CTAButtonProps = {
  text: 'Explorer le Framework',
  href: '/framework',
}

// ── BenefitCard ──────────────────────────────────────────────

const benefitCardProps: BenefitCardProps = {
  icon: 'trending-up',
  title: 'Productivité décuplée',
  description: 'Automatisez les tâches répétitives et concentrez-vous sur la valeur ajoutée de votre code.',
}

// ── BenefitsList ─────────────────────────────────────────────

const mockBenefits: BenefitItem[] = [
  {
    id: 'benefit-1',
    icon: 'trending-up',
    title: 'Productivité décuplée',
    description: 'Automatisez les tâches répétitives et concentrez-vous sur la valeur.',
    order: 1,
    locale: 'fr',
    isActive: true,
    updatedAt: new Date('2026-02-02'),
  },
  {
    id: 'benefit-2',
    icon: 'check-circle',
    title: 'Qualité garantie',
    description: 'Des standards de code et des validations intégrés.',
    order: 2,
    locale: 'fr',
    isActive: true,
    updatedAt: new Date('2026-02-02'),
  },
  {
    id: 'benefit-3',
    icon: 'users',
    title: 'Collaboration fluide',
    description: 'Une méthodologie claire pour structurer le travail.',
    order: 3,
    locale: 'fr',
    isActive: true,
    updatedAt: new Date('2026-02-02'),
  },
]

// ── StatDisplay ──────────────────────────────────────────────

const statDisplayProps: StatDisplayProps = {
  value: '50%',
  label: 'Gain de productivité avec les agents IA',
  source: 'McKinsey Global Institute, 2024',
}

// ── StatsRow ─────────────────────────────────────────────────

const mockStats: StatItem[] = [
  {
    id: 'stat-productivity',
    value: '50%',
    numericValue: 50,
    unit: '%',
    label: 'Gain de productivité avec les agents IA',
    source: 'McKinsey Global Institute, 2024',
    sourceUrl: 'https://www.mckinsey.com/example',
    order: 1,
    locale: 'fr',
    isActive: true,
    highlight: true,
    updatedAt: new Date('2026-02-02'),
  },
  {
    id: 'stat-speed',
    value: '3x',
    numericValue: 3,
    unit: 'x',
    label: 'Plus rapide pour coder avec assistance IA',
    source: 'GitHub Copilot Research, 2023',
    sourceUrl: 'https://github.blog/example',
    order: 2,
    locale: 'fr',
    isActive: true,
    highlight: false,
    updatedAt: new Date('2026-02-02'),
  },
  {
    id: 'stat-satisfaction',
    value: '>90%',
    numericValue: 90,
    unit: '%',
    label: "Des développeurs satisfaits de l'IA",
    source: 'Stack Overflow Developer Survey 2024',
    sourceUrl: 'https://survey.stackoverflow.co/2024/ai',
    order: 3,
    locale: 'fr',
    isActive: true,
    highlight: false,
    updatedAt: new Date('2026-02-02'),
  },
]
```

### 4.3 Pattern de test standard

Chaque fichier de test suit la même structure :

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import Component from '@components/path/Component.astro'

describe('Component', () => {
  let container: AstroContainer

  beforeEach(async () => {
    container = await AstroContainer.create()
  })

  const defaultProps = { /* ... */ }

  describe('Rendu de base', () => { /* ... */ })
  describe('Props: propName', () => { /* ... */ })
  describe('Cas limites: Contenu', () => { /* ... */ })
  describe('Styling: Classes Tailwind', () => { /* ... */ })
  describe('Accessibilité', () => { /* ... */ })
})
```

---

## 5. Cas limites et gestion d'erreurs

### 5.1 Cas limites transversaux (tous composants)

| ID | Cas limite | Entrée | Comportement attendu | Composants concernés |
|----|------------|--------|---------------------|---------------------|
| CL-T-01 | Injection HTML (XSS) | `<script>alert('xss')</script>` | Échappé en `&lt;script&gt;` | Tous |
| CL-T-02 | Apostrophe française | `L'IA et l'avenir` | Échappé en `L&#39;IA` | Tous |
| CL-T-03 | Ampersand | `McKinsey & Company` | Échappé en `&amp;` | Tous |
| CL-T-04 | Emoji | `Productivité 🚀` | Rendu tel quel | Tous |
| CL-T-05 | Accents français | `éàùçêô` | Rendus correctement | Tous |
| CL-T-06 | Newline dans le texte | `Ligne 1\nLigne 2` | Texte préservé (rendu inline) | BC, VP |
| CL-T-07 | Chaîne vide | `''` | Composant rendu sans crash | HT (tagline), VP, CTA (href) |

### 5.2 Cas limites HeroTitle

| ID | Cas limite | Entrée | Comportement attendu |
|----|------------|--------|---------------------|
| HT-CL-01 | Titre au maximum de 80 chars | `'AIAD : ' + 'A'.repeat(73)` | Rendu complet |
| HT-CL-02 | Titre au minimum de 10 chars | `'AIAD : Dev'` | Rendu complet |
| HT-CL-03 | Tagline au maximum de 120 chars | `'A'.repeat(120)` | Rendu + `max-w-2xl` |
| HT-CL-04 | Tagline vide + `showTagline=true` | `tagline: ''` | `<p>` vide rendu |
| HT-CL-05 | Combinaison `size='sm' + align='right'` | Props combinées | Les deux groupes de classes appliqués |

### 5.3 Cas limites CTAButton

| ID | Cas limite | Entrée | Comportement attendu |
|----|------------|--------|---------------------|
| CTA-CL-01 | Texte au maximum de 50 chars | Texte long | Rendu complet |
| CTA-CL-02 | Texte au minimum de 2 chars | `'OK'` | Rendu complet |
| CTA-CL-03 | `href` vide string | `href: ''` | Défaut `href="#"` |
| CTA-CL-04 | `href` undefined | Absent des props | Défaut `href="#"` |
| CTA-CL-05 | `as='button'` + `href` fourni | Props contradictoires | Pas de `href` dans le HTML |
| CTA-CL-06 | `disabled=true` + `as='link'` | Props combinées | Pas de `href`, `aria-disabled="true"` |

### 5.4 Cas limites BenefitCard

| ID | Cas limite | Entrée | Comportement attendu |
|----|------------|--------|---------------------|
| BC-CL-01 | Titre long (50 chars) | 50 caractères | Rendu complet |
| BC-CL-02 | Titre court (5 chars) | `'Gains'` | Rendu complet |
| BC-CL-03 | Description longue (150 chars) | `'A'.repeat(145) + '.'` | Rendu complet |
| BC-CL-04 | Description courte (20 chars) | `'Gagnez du temps vite.'` | Rendu complet |
| BC-CL-05 | 10 icônes différentes | Itération sur échantillon | SVG rendu pour chacune |
| BC-CL-06 | `variant='compact'` change taille texte | Props | `text-base md:text-lg` vs `text-lg md:text-xl` |

### 5.5 Cas limites BenefitsList

| ID | Cas limite | Entrée | Comportement attendu |
|----|------------|--------|---------------------|
| BL-CL-01 | Liste vide | `benefits: []` | Pas de `<section>` rendu |
| BL-CL-02 | 1 seul bénéfice | 1 élément | 1 `<article>` |
| BL-CL-03 | 5 bénéfices (max recommandé) | 5 éléments | 5 `<article>` |
| BL-CL-04 | 6 bénéfices (au-delà du max) | 6 éléments | 6 `<article>` (pas de crash) |

### 5.6 Cas limites StatDisplay

| ID | Cas limite | Entrée | Comportement attendu |
|----|------------|--------|---------------------|
| SD-CL-01 | Valeur longue (20 chars) | `'12345678901234567890'` | Rendu complet |
| SD-CL-02 | Valeur minimale (1 char) | `'5'` | Rendu avec `>5<` |
| SD-CL-03 | Label long (100 chars) | `'A'.repeat(100)` | Rendu + `max-w-xs` |
| SD-CL-04 | Source longue (150 chars) | `'S'.repeat(150)` | Rendu complet |
| SD-CL-05 | Valeur avec opérateur `>` | `'>90%'` | Rendu correct (échappé `&gt;`) |
| SD-CL-06 | Valeur symbolique `+++` | `'+++'` | Rendu complet |

### 5.7 Cas limites StatsRow

| ID | Cas limite | Entrée | Comportement attendu |
|----|------------|--------|---------------------|
| SR-CL-01 | Liste vide | `stats: []` | Pas de `<section>` rendu |
| SR-CL-02 | 1 stat → 0 séparateur | 1 élément | Pas de `border-t border-gray-200` |
| SR-CL-03 | 2 stats → 1 séparateur | 2 éléments | 1 `border-t border-gray-200` |
| SR-CL-04 | 3 stats → 2 séparateurs | 3 éléments | 2 `border-t border-gray-200` |
| SR-CL-05 | 6 stats (max recommandé) | 6 éléments | 6 `stat-value` rendus |

---

## 6. Exemples entrée/sortie

### 6.1 HeroTitle - Rendu par défaut

**Entrée (props) :**
```typescript
{
  title: 'AIAD : Le framework pour développer avec des agents IA',
  tagline: 'Structurez votre collaboration avec l\'IA',
}
```

**Sortie (HTML simplifié) :**
```html
<div class="flex flex-col gap-4 text-center">
  <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
    AIAD : Le framework pour développer avec des agents IA
  </h1>
  <p class="text-lg md:text-xl lg:text-2xl font-normal text-gray-600 max-w-2xl mx-auto">
    Structurez votre collaboration avec l&#39;IA
  </p>
</div>
```

### 6.2 CTAButton - Rendu comme bouton désactivé

**Entrée (props) :**
```typescript
{
  text: 'Explorer le Framework',
  href: '/framework',
  as: 'button',
  disabled: true,
  variant: 'primary',
}
```

**Sortie (HTML simplifié) :**
```html
<button
  class="inline-flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 gap-2.5 font-semibold opacity-50 cursor-not-allowed pointer-events-none"
  type="button"
  disabled
  aria-disabled="true"
>
  <span>Explorer le Framework</span>
  <svg class="w-5 h-5" aria-hidden="true">...</svg>
</button>
```

### 6.3 BenefitCard - Variante featured avec icône à gauche

**Entrée (props) :**
```typescript
{
  icon: 'trending-up',
  title: 'Productivité décuplée',
  description: 'Automatisez les tâches répétitives.',
  variant: 'featured',
  iconPosition: 'left',
  iconSize: 'lg',
}
```

**Sortie (HTML simplifié) :**
```html
<article class="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-row items-start text-left gap-4">
  <div class="flex items-center justify-center rounded-xl bg-blue-100 w-18 h-18 md:w-20 md:h-20 flex-shrink-0" role="presentation">
    <svg class="w-14 h-14 md:w-16 md:h-16 text-blue-600" aria-hidden="true">...</svg>
  </div>
  <div class="space-y-1">
    <h3 class="font-semibold text-gray-900 text-lg md:text-xl">Productivité décuplée</h3>
    <p class="text-gray-600 leading-relaxed text-sm md:text-base">Automatisez les tâches répétitives.</p>
  </div>
</article>
```

### 6.4 StatDisplay - Highlight avec lien source et unité séparée

**Entrée (props) :**
```typescript
{
  value: '50',
  unit: '%',
  label: 'Gain de productivité avec les agents IA',
  source: 'McKinsey Global Institute, 2024',
  sourceUrl: 'https://www.mckinsey.com/example',
  variant: 'highlight',
}
```

**Sortie (HTML simplifié) :**
```html
<div class="flex flex-col bg-blue-50 border border-blue-100 rounded-xl p-5 md:p-8 text-center items-center">
  <p class="font-bold leading-none text-4xl md:text-5xl text-blue-700">
    <span class="stat-value">50</span>
    <span class="text-[0.6em] font-semibold ml-0.5 opacity-80">%</span>
  </p>
  <p class="mt-2 font-medium text-gray-700 leading-snug max-w-xs text-base md:text-lg">
    Gain de productivité avec les agents IA
  </p>
  <footer class="mt-3">
    <a href="https://www.mckinsey.com/example" target="_blank" rel="noopener noreferrer"
       class="text-xs text-blue-500 hover:text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors">
      <cite class="not-italic">McKinsey Global Institute, 2024</cite>
      <span class="sr-only">(ouvre dans un nouvel onglet)</span>
    </a>
  </footer>
</div>
```

### 6.5 BenefitsList - Liste vide

**Entrée (props) :**
```typescript
{
  benefits: [],
}
```

**Sortie (HTML) :**
```html
<!-- Rien n'est rendu (condition benefits.length > 0) -->
```

### 6.6 StatsRow - Avec séparateurs et auto-highlight

**Entrée (props) :**
```typescript
{
  stats: [
    { ...stat1, highlight: true },   // → variant='highlight'
    { ...stat2, highlight: false },   // → variant='default'
    { ...stat3, highlight: false },   // → variant='default'
  ],
  showDividers: true,
}
```

**Sortie (structure simplifiée) :**
```html
<section id="stats-section" aria-labelledby="stats-section-title">
  <h2 id="stats-section-title" class="sr-only">Chiffres clés</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
    <div class="">
      <!-- StatDisplay variant="highlight" : bg-blue-50 -->
    </div>
    <div class="border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
      <!-- StatDisplay variant="default" : bg-transparent -->
    </div>
    <div class="border-t border-gray-200 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
      <!-- StatDisplay variant="default" : bg-transparent -->
    </div>
  </div>
</section>
```

---

## 7. Tests

### 7.1 Récapitulatif quantitatif

| Composant | Fichier de test | Nb tests estimé |
|-----------|----------------|----------------|
| HeroTitle | `tests/unit/components/hero-title.test.ts` | ~25 |
| ValueProposition | `tests/unit/components/value-proposition.test.ts` | ~22 |
| CTAButton | `tests/unit/components/cta-button.test.ts` | ~35 |
| StatDisplay | `tests/unit/components/stat-display.test.ts` | ~38 |
| BenefitCard | `tests/unit/components/benefit-card.test.ts` | ~30 |
| BenefitsList | `tests/unit/components/benefits-list.test.ts` | ~30 |
| StatsRow | `tests/unit/components/stats-row.test.ts` | ~35 |
| **Total** | **7 fichiers** | **~215 tests** |

### 7.2 Critères de couverture

| Critère | Objectif | Mesure |
|---------|----------|--------|
| **Tests passants** | 100% | Tous les tests doivent passer |
| **Couverture des props** | 100% | Chaque prop testée avec au moins valeur par défaut + 1 valeur alternative |
| **Couverture des variantes** | 100% | Chaque valeur d'enum testée (variant, size, align, etc.) |
| **Cas limites** | ≥ 80% | Bornes min/max, chaînes vides, XSS, caractères spéciaux |
| **Accessibilité** | 100% | Chaque attribut ARIA et balise sémantique vérifiés |
| **Rendu conditionnel** | 100% | Chaque condition (showTagline, showSource, etc.) testée true/false |

### 7.3 Commande d'exécution

```bash
# Exécuter tous les tests composants
pnpm vitest run tests/unit/components/

# Exécuter un fichier spécifique
pnpm vitest run tests/unit/components/hero-title.test.ts

# Mode watch
pnpm vitest tests/unit/components/

# Avec couverture
pnpm vitest run tests/unit/components/ --coverage
```

### 7.4 Assertions types utilisées

| Assertion | Usage | Exemple |
|-----------|-------|---------|
| `expect(result).toContain(string)` | Vérifie la présence d'un texte/classe | `toContain('text-center')` |
| `expect(result).not.toContain(string)` | Vérifie l'absence | `not.toContain('<script>')` |
| `expect(result).toMatch(regex)` | Vérifie un pattern dans le HTML | `toMatch(/<h1[^>]*class="[^"]*font-bold/)` |
| `expect(count).toBe(number)` | Vérifie le comptage exact | Nombre de `<article>` |
| `expect(count).toHaveLength(n)` | Vérifie la longueur d'un tableau de matches | `toHaveLength(3)` |
| `expect(index).toBeLessThan(other)` | Vérifie l'ordre dans le HTML | Ordre des éléments |

### 7.5 Exemple de test complet - StatDisplay

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

  const defaultProps = {
    value: '50%',
    label: 'Gain de productivité avec les agents IA',
    source: 'McKinsey Global Institute, 2024',
  }

  describe('Rendu de base', () => {
    it('SD-00: devrait rendre un conteneur div avec flex flex-col', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<div')
      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
    })

    it('SD-00b: devrait rendre la valeur avec la classe stat-value', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('50%')
      expect(result).toContain('stat-value')
    })

    it('SD-00c: devrait rendre le label dans un p', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<p')
      expect(result).toContain('Gain de productivité avec les agents IA')
    })

    it('SD-00d: devrait rendre la source dans un cite', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: defaultProps,
      })

      expect(result).toContain('<cite')
      expect(result).toContain('McKinsey Global Institute, 2024')
      expect(result).toContain('</cite>')
    })
  })

  describe('Props: variant', () => {
    it('SD-01: devrait appliquer les classes default par défaut', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'default' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('p-4')
      expect(result).toContain('text-3xl')
      expect(result).toContain('text-blue-600')
    })

    it('SD-02: devrait appliquer les classes highlight', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'highlight' },
      })

      expect(result).toContain('bg-blue-50')
      expect(result).toContain('border')
      expect(result).toContain('border-blue-100')
      expect(result).toContain('rounded-xl')
      expect(result).toContain('text-4xl')
      expect(result).toContain('text-blue-700')
    })

    it('SD-03: devrait appliquer les classes compact', async () => {
      const result = await container.renderToString(StatDisplay, {
        props: { ...defaultProps, variant: 'compact' },
      })

      expect(result).toContain('bg-transparent')
      expect(result).toContain('p-2')
      expect(result).toContain('text-2xl')
    })
  })

  // ... (suite des tests selon la matrice section 3.2.6)
})
```

---

## 8. Critères d'acceptation

- [ ] Les 7 fichiers de test existent dans `tests/unit/components/`
- [ ] Tous les tests passent avec `pnpm vitest run tests/unit/components/`
- [ ] Chaque composant a au minimum les groupes de tests : Rendu de base, Props, Cas limites, Accessibilité
- [ ] Chaque prop de chaque composant est testée (valeur par défaut + au moins 1 valeur alternative)
- [ ] Les cas limites XSS (injection HTML) sont testés pour chaque composant avec du contenu textuel
- [ ] Les caractères spéciaux français (accents, apostrophes) sont testés
- [ ] Les composants conteneurs (BenefitsList, StatsRow) vérifient la propagation des props aux enfants
- [ ] Le rendu conditionnel (showTagline, showSource, showTitle, etc.) est testé true ET false
- [ ] La hiérarchie de titres est vérifiée (h1 pour HeroTitle, h2 pour sections, h3 pour cartes)
- [ ] Les attributs ARIA sont vérifiés (aria-labelledby, aria-hidden, aria-label, role)
- [ ] Les liens externes ont `rel="noopener noreferrer"` et `target="_blank"`

---

## 9. Notes d'implémentation

### 9.1 Contraintes de l'Astro Container API

- **`experimental_AstroContainer`** : L'API est expérimentale et peut changer entre les versions d'Astro
- **Échappement HTML** : Astro échappe automatiquement les caractères spéciaux (`'` → `&#39;`, `&` → `&amp;`, `<` → `&lt;`). Les assertions doivent en tenir compte
- **Import dynamique** : Les composants utilisant `import('astro:content')` (BenefitsList, StatsRow) chargent les données dynamiquement. En test, les données doivent être passées via props pour éviter les erreurs
- **Attributs data-astro** : Astro peut ajouter des attributs `data-astro-*` aux éléments rendus. Les assertions doivent utiliser des patterns flexibles (ex: `toMatch(/<span[^>]*>Text/)` plutôt que `toContain('<span>Text')`)

### 9.2 Ordre de développement recommandé

1. **Composants atomiques d'abord** : HeroTitle, ValueProposition, CTAButton (pas de dépendances enfants)
2. **BenefitCard et StatDisplay** : Composants atomiques avec plus de variantes
3. **Composants composés ensuite** : BenefitsList (utilise BenefitCard), StatsRow (utilise StatDisplay)

### 9.3 Relation avec les autres tâches de test

| Tâche | Relation |
|-------|----------|
| T-001-T1 (tests schémas Zod) | Valide les données d'entrée des composants |
| **T-001-T2 (cette tâche)** | Valide le rendu individuel de chaque composant |
| T-001-T3 (tests intégration) | Valide l'assemblage HeroSection complet |
| T-001-T4 (tests a11y) | Valide l'accessibilité via axe-core + Playwright |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 05/02/2026 | Création initiale - Spécification complète des 7 composants |
