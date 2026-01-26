# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Versionnement Sémantique](https://semver.org/lang/fr/).

## [Non publié]

### Ajouté

- **US-001 : Modèle de données HeroContent** (T-001-B1)
  - Interface TypeScript `HeroContent` avec documentation JSDoc complète ([src/types/hero.ts](src/types/hero.ts))
  - Types utilitaires `HeroContentInput` et `HeroContentUpdate` pour les opérations CRUD
  - Interface `HeroMetadata` pour les métadonnées SEO optionnelles
  - Schéma de validation Zod `heroContentSchema` ([src/schemas/hero.ts](src/schemas/hero.ts))
  - Schéma avec raffinements `heroContentSchemaWithRefinements` pour validation inter-champs
  - Règles métier implémentées :
    - R1 : Le titre doit contenir "AIAD"
    - R2 : La tagline ne doit pas répéter le titre (> 50% de mots significatifs)
    - R3 : La proposition de valeur doit se terminer par un point
  - Collection Astro Content pour les hero contents ([src/content/config.ts](src/content/config.ts))
  - Tests unitaires complets avec Vitest ([tests/unit/schemas/hero-content.test.ts](tests/unit/schemas/hero-content.test.ts))

- **Infrastructure projet**
  - Configuration Astro 4.x avec TypeScript strict
  - Configuration Tailwind CSS
  - Configuration Vitest pour les tests unitaires
  - Alias TypeScript (`@/*` → `src/*`)
  - Page d'accueil placeholder ([src/pages/index.astro](src/pages/index.astro))
