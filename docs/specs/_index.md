# Index des SPECs

## US-001 : Comprendre AIAD rapidement

### Backend

| ID | Titre | Status | Assigné | Spec |
|----|-------|--------|---------|------|
| T-001-B1 | Modèle de données `HeroContent` | 🟢 Terminée | - | [Spec](./US-001/T-001-B1-modele-donnees-HeroContent.md) |
| T-001-B2 | Modèle de données `BenefitItem` | 🟢 Terminée | - | [Spec](./US-001/T-001-B2-modele-donnees-BenefitItem.md) |
| T-001-B3 | Modèle de données `StatItem` | 🟢 Terminée | - | [Spec](./US-001/T-001-B3-modele-donnees-StatItem.md) |
| T-001-B4 | Fichier de contenu statique hero (JSON) | 🟢 Terminée | - | [Spec](./US-001/T-001-B4-donnees-JSON-hero-content-francais.md) |

### Frontend

| ID | Titre | Status | Assigné | Dépendances |
|----|-------|--------|---------|-------------|
| T-001-F1 | Composant `HeroTitle` | 🔵 À faire | - | T-001-B4 |
| T-001-F2 | Composant `BenefitCard` | 🔵 À faire | - | T-001-B4 |
| T-001-F3 | Composant `BenefitsGrid` | 🔵 À faire | - | T-001-F2 |
| T-001-F4 | Composant `StatisticBadge` | 🔵 À faire | - | T-001-B4 |
| T-001-F5 | Composant `CTAButton` | 🔵 À faire | - | - |
| T-001-F6 | Assemblage `HeroSection` | 🔵 À faire | - | T-001-F1, F3, F4, F5 |
| T-001-F7 | Responsive design (mobile/tablet/desktop) | 🔵 À faire | - | T-001-F6 |
| T-001-F8 | Intégration page d'accueil | 🔵 À faire | - | T-001-F6 |

### Tests

| ID | Titre | Status | Assigné | Dépendances |
|----|-------|--------|---------|-------------|
| T-001-T1 | Tests unitaires `HeroTitle` | 🔵 À faire | - | T-001-F1 |
| T-001-T2 | Tests unitaires `BenefitCard` | 🔵 À faire | - | T-001-F2 |
| T-001-T3 | Tests unitaires `CTAButton` | 🔵 À faire | - | T-001-F5 |
| T-001-T4 | Test d'intégration `HeroSection` | 🔵 À faire | - | T-001-F6 |
| T-001-T5 | Tests d'accessibilité WCAG AA | 🔵 À faire | - | T-001-F6 |
| T-001-T6 | Test performance Lighthouse (LCP) | 🔵 À faire | - | T-001-F8 |
| T-001-T7 | Protocole test utilisateur (< 30s) | 🔵 À faire | - | T-001-F8 |

---

## US-004 : Naviguer facilement dans le framework

### Backend / Données

| ID | Titre | Status | Assigné | Spec |
|----|-------|--------|---------|------|
| T-004-B1 | Types TypeScript navigation | 🟢 Terminée | - | [Spec](./US-004/T-004-B1-types-typescript-navigation.md) |
| T-004-B2 | Schémas Zod navigation | 🟢 Terminée | - | [Spec](./US-004/T-004-B2-schemas-zod-navigation.md) |
| T-004-B3 | Configuration navigation | 🟢 Terminée | - | [Spec](./US-004/T-004-B3-configuration-navigation.md) |
| T-004-B4 | Helpers navigation | 🟢 Terminée | - | [Spec](./US-004/T-004-B4-helpers-navigation.md) |

### Frontend

| ID | Titre | Status | Assigné | Spec |
|----|-------|--------|---------|------|
| T-004-F1 | Composant `BaseLayout` | 🟢 Terminée | - | [Spec](./US-004/T-004-F1-composant-BaseLayout.md) |
| T-004-F2 | Composant `NavLink` | 🟢 Terminée | - | [Spec](./US-004/T-004-F2-composant-NavLink.md) |
| T-004-F6 | Composant `Breadcrumb` | 🟢 Terminée | - | [Spec](./US-004/T-004-F6-composant-Breadcrumb.md) |
| T-004-F7 | Composant `TableOfContents` | 🟢 Terminée | - | [Spec](./US-004/T-004-F7-composant-TableOfContents.md) |
| T-004-F3 | Composant `DropdownMenu` | 🟢 Terminée | - | [Spec](./US-004/T-004-F3-composant-DropdownMenu.md) |
| T-004-F8 | Composant `PrevNextLinks` | 🟢 Terminée | - | [Spec](./US-004/T-004-F8-composant-PrevNextLinks.md) |
| T-004-F5 | Composant `MobileMenu` | 🟢 Terminée | - | [Spec](./US-004/T-004-F5-composant-MobileMenu.md) |
| T-004-F9 | Composant `Sidebar` | 🟢 Terminée | - | [Spec](./US-004/T-004-F9-composant-Sidebar.md) |
| T-004-F4 | Composant `Header` | 🟢 Terminée | - | [Spec](./US-004/T-004-F4-composant-Header.md) |
| T-004-F10 | Layout `DocsLayout` | 🟢 Terminée | - | [Spec](./US-004/T-004-F10-layout-DocsLayout.md) |
| T-004-F11 | Intégration pages navigation | 🟢 Terminée | - | [Spec](./US-004/T-004-F11-integration-pages-navigation.md) |

---

## Progression

| Métrique | Valeur |
|----------|--------|
| **Total tâches** | 28 |
| **Terminées** | 19 |
| **En cours** | 0 |
| **À faire** | 9 |
| **Avancement** | 68% |

---

## Terminées (cette itération)

| ID | Titre | Story | Date |
|----|-------|-------|------|
| T-001-B1 | Modèle de données `HeroContent` | US-001 | 26/01/2026 |
| T-001-B2 | Modèle de données `BenefitItem` | US-001 | 27/01/2026 |
| T-001-B3 | Modèle de données `StatItem` | US-001 | 02/02/2026 |
| T-001-B4 | Fichier de contenu statique hero (JSON) | US-001 | 02/02/2026 |
| T-004-B1 | Types TypeScript navigation | US-004 | 09/02/2026 |
| T-004-B2 | Schémas Zod navigation | US-004 | 09/02/2026 |
| T-004-B3 | Configuration navigation | US-004 | 09/02/2026 |
| T-004-B4 | Helpers navigation | US-004 | 09/02/2026 |
| T-004-F1 | Composant BaseLayout | US-004 | 10/02/2026 |
| T-004-F2 | Composant NavLink | US-004 | 10/02/2026 |
| T-004-F7 | Composant TableOfContents | US-004 | 11/02/2026 |
| T-004-F6 | Composant Breadcrumb | US-004 | 11/02/2026 |
| T-004-F8 | Composant PrevNextLinks | US-004 | 11/02/2026 |
| T-004-F3 | Composant DropdownMenu | US-004 | 11/02/2026 |
| T-004-F5 | Composant MobileMenu | US-004 | 12/02/2026 |
| T-004-F9 | Composant Sidebar | US-004 | 12/02/2026 |
| T-004-F4 | Composant Header | US-004 | 12/02/2026 |
| T-004-F10 | Layout DocsLayout | US-004 | 12/02/2026 |
| T-004-F11 | Intégration pages navigation | US-004 | 12/02/2026 |

---

## Légende

- 🔵 À faire
- 🟡 En cours
- 🟢 Terminée
- 🔴 Bloquée
