# Index des SPECs

## US-001 : Comprendre AIAD rapidement

### Backend

| ID | Titre | Status | Assigné | Spec |
|----|-------|--------|---------|------|
| T-001-B1 | Modèle de données `HeroContent` | 🟢 Terminée | - | [Spec](./US-001/T-001-B1-modele-donnees-HeroContent.md) |
| T-001-B2 | Modèle de données `BenefitItem` | 🔵 À faire | - | [Spec](./US-001/T-001-B2-modele-donnees-BenefitItem.md) |
| T-001-B3 | Modèle de données `Statistic` | 🔵 À faire | - | - |
| T-001-B4 | Fichier de contenu statique hero (JSON) | 🔵 À faire | - | - |

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

## Progression

| Métrique | Valeur |
|----------|--------|
| **Total tâches** | 19 |
| **Terminées** | 1 |
| **En cours** | 0 |
| **À faire** | 18 |
| **Avancement** | 5% |

---

## Terminées (cette itération)

| ID | Titre | Story | Date |
|----|-------|-------|------|
| T-001-B1 | Modèle de données `HeroContent` | US-001 | 26/01/2026 |

---

## Légende

- 🔵 À faire
- 🟡 En cours
- 🟢 Terminée
- 🔴 Bloquée
