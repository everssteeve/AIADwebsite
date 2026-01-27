# US-001 : Comprendre AIAD rapidement

| Métadonnée | Valeur |
|------------|--------|
| **Complexité** | M (Medium) |
| **Statut** | 🚧 En cours |
| **Date création** | 26 janvier 2026 |

---

## 1. Description

**En tant que** visiteur découvrant AIAD pour la première fois
**Je veux** comprendre en moins d'une minute ce qu'est AIAD et ses bénéfices principaux
**Afin de** décider rapidement si ce framework est pertinent pour mon contexte

---

## 2. Critères d'acceptation

- [ ] La page d'accueil affiche un hero section avec :
  - Titre explicite (ex: "AIAD : Le framework pour développer avec des agents IA")
  - Value proposition en une phrase
  - 3 bénéfices clés sous forme de pictos + texte court
- [ ] Un CTA principal "Explorer le Framework" visible above the fold
- [ ] Temps de lecture du hero < 30 secondes (validé par 5 utilisateurs tests)
- [ ] Des statistiques chiffrées crédibles (ex: "50% de gain de productivité")

---

## 3. Décomposition en tâches

### 3.1 Backend / Données

| ID | Tâche | Durée | Dépendances | Statut |
|----|-------|-------|-------------|--------|
| T-001-B1 | Créer le modèle de données HeroContent | 2h | - | ✅ Terminée |
| T-001-B2 | Créer le modèle de données BenefitItem (picto + titre + description) | 2h | - | 📋 À faire |
| T-001-B3 | Créer le modèle de données StatItem (valeur + label + source) | 2h | - | 📋 À faire |
| T-001-B4 | Créer les données JSON hero content (français) | 1h | T-001-B1 | 📋 À faire |
| T-001-B5 | Créer les données JSON des 3 bénéfices clés | 1h | T-001-B2 | 📋 À faire |
| T-001-B6 | Créer les données JSON des statistiques chiffrées | 1h | T-001-B3 | 📋 À faire |

### 3.2 Frontend

| ID | Tâche | Durée | Dépendances | Statut |
|----|-------|-------|-------------|--------|
| T-001-F1 | Créer le composant HeroTitle (H1 + tagline) | 2h | T-001-B1 | 📋 À faire |
| T-001-F2 | Créer le composant ValueProposition | 1.5h | T-001-B1 | 📋 À faire |
| T-001-F3 | Créer le composant CTAButton ("Explorer le Framework") | 1.5h | - | 📋 À faire |
| T-001-F4 | Créer le composant BenefitCard (picto + texte individuel) | 2h | T-001-B2 | 📋 À faire |
| T-001-F5 | Créer le composant BenefitsList (grille des 3 bénéfices) | 2h | T-001-F4 | 📋 À faire |
| T-001-F6 | Créer le composant StatDisplay (stat individuelle) | 1.5h | T-001-B3 | 📋 À faire |
| T-001-F7 | Créer le composant StatsRow (ligne de statistiques) | 2h | T-001-F6 | 📋 À faire |
| T-001-F8 | Créer le composant HeroSection (assemblage complet) | 3h | T-001-F1, F2, F3, F5, F7 | 📋 À faire |
| T-001-F9 | Intégrer HeroSection dans la page d'accueil | 1h | T-001-F8, B4, B5, B6 | 📋 À faire |

### 3.3 Tests

| ID | Tâche | Durée | Dépendances | Statut |
|----|-------|-------|-------------|--------|
| T-001-T1 | Tests unitaires schémas Zod (BenefitItem, StatItem) | 2h | T-001-B2, B3 | 📋 À faire |
| T-001-T2 | Tests unitaires composants (HeroTitle, CTA, BenefitCard) | 3h | T-001-F1 à F7 | 📋 À faire |
| T-001-T3 | Tests d'intégration HeroSection | 2h | T-001-F8 | 📋 À faire |
| T-001-T4 | Test accessibilité (a11y) hero section | 2h | T-001-F9 | 📋 À faire |
| T-001-T5 | Test utilisateur temps de lecture < 30s (5 utilisateurs) | 3h | T-001-F9 | 📋 À faire |

---

## 4. Ordre d'implémentation optimal

```
Phase 1 - Modèles de données (parallélisable)
├── T-001-B2 (BenefitItem)      ──┬── T-001-B5 (données bénéfices)
├── T-001-B3 (StatItem)         ──┴── T-001-B6 (données stats)
└── T-001-B4 (données hero)     ←── dépend de B1 ✅

Phase 2 - Composants atomiques (parallélisable)
├── T-001-F1 (HeroTitle)
├── T-001-F2 (ValueProposition)
├── T-001-F3 (CTAButton)
├── T-001-F4 (BenefitCard)
└── T-001-F6 (StatDisplay)

Phase 3 - Composants composés
├── T-001-F5 (BenefitsList)     ←── dépend de F4
└── T-001-F7 (StatsRow)         ←── dépend de F6

Phase 4 - Assemblage
├── T-001-F8 (HeroSection)      ←── dépend de F1, F2, F3, F5, F7
└── T-001-F9 (Intégration)      ←── dépend de F8 + toutes données

Phase 5 - Tests
├── T-001-T1 (tests schémas)    ←── parallèle avec Phase 2
├── T-001-T2 (tests composants) ←── après Phase 3
├── T-001-T3 (tests intégration)←── après Phase 4
├── T-001-T4 (tests a11y)       ←── après Phase 4
└── T-001-T5 (tests utilisateur)←── après Phase 4
```

---

## 5. Diagramme de dépendances

```mermaid
graph TD
    subgraph "Phase 1 - Données"
        B1[T-001-B1<br/>HeroContent ✅]
        B2[T-001-B2<br/>BenefitItem]
        B3[T-001-B3<br/>StatItem]
        B4[T-001-B4<br/>Données Hero]
        B5[T-001-B5<br/>Données Bénéfices]
        B6[T-001-B6<br/>Données Stats]
    end

    subgraph "Phase 2 - Composants atomiques"
        F1[T-001-F1<br/>HeroTitle]
        F2[T-001-F2<br/>ValueProposition]
        F3[T-001-F3<br/>CTAButton]
        F4[T-001-F4<br/>BenefitCard]
        F6[T-001-F6<br/>StatDisplay]
    end

    subgraph "Phase 3 - Composants composés"
        F5[T-001-F5<br/>BenefitsList]
        F7[T-001-F7<br/>StatsRow]
    end

    subgraph "Phase 4 - Assemblage"
        F8[T-001-F8<br/>HeroSection]
        F9[T-001-F9<br/>Intégration]
    end

    subgraph "Phase 5 - Tests"
        T1[T-001-T1<br/>Tests schémas]
        T2[T-001-T2<br/>Tests composants]
        T3[T-001-T3<br/>Tests intégration]
        T4[T-001-T4<br/>Tests a11y]
        T5[T-001-T5<br/>Tests utilisateur]
    end

    B1 --> B4
    B1 --> F1
    B1 --> F2
    B2 --> B5
    B2 --> F4
    B3 --> B6
    B3 --> F6

    F4 --> F5
    F6 --> F7

    F1 --> F8
    F2 --> F8
    F3 --> F8
    F5 --> F8
    F7 --> F8

    F8 --> F9
    B4 --> F9
    B5 --> F9
    B6 --> F9

    B2 --> T1
    B3 --> T1
    F7 --> T2
    F8 --> T3
    F9 --> T4
    F9 --> T5
```

---

## 6. Estimation globale

| Catégorie | Nb tâches | Durée estimée |
|-----------|-----------|---------------|
| Backend/Données | 5 (+1 ✅) | 7h |
| Frontend | 9 | 16.5h |
| Tests | 5 | 12h |
| **Total** | **19** | **35.5h** |

**Chemin critique :** B1 ✅ → B4 → F1 → F8 → F9 → T5

---

## 7. Fichiers de spécification détaillée

| Tâche | Fichier de spec |
|-------|-----------------|
| T-001-B1 | [T-001-B1-modele-donnees-HeroContent.md](./T-001-B1-modele-donnees-HeroContent.md) |
| T-001-B2 | [T-001-B2-modele-donnees-BenefitItem.md](./T-001-B2-modele-donnees-BenefitItem.md) |
| T-001-B3 | [T-001-B3-modele-donnees-StatItem.md](./T-001-B3-modele-donnees-StatItem.md) |
| T-001-F1 | À créer |
| ... | ... |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 26/01/2026 | Création initiale avec décomposition en 20 tâches |
