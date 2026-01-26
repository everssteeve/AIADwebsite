# Product Requirement Document (PRD)
## Site Web Framework AIAD

**Version:** 1.1
**Date:** 21 janvier 2026
**Auteur:** Product Manager
**Statut:** Validé pour implémentation

---

## Table des matières

1. [Contexte](#contexte)
2. [Objectifs](#objectifs)
3. [Personas](#personas)
4. [User Stories](#user-stories)
5. [Hors Périmètre](#hors-périmètre)
6. [Risques](#risques)
7. [Planning et Livrables](#planning-et-livrables)
8. [Annexes](#annexes)

---

## CONTEXTE

### Problème

Le Framework AIAD (AI-Agent Iterative Development) et son Mode Opératoire Exhaustif existent uniquement sous forme de fichiers markdown (de 50+ fichiers), créant plusieurs obstacles majeurs :

1. **Accessibilité limitée** : Format document difficile à partager, consulter et maintenir à jour
2. **Découvrabilité nulle** : Impossible à trouver via les moteurs de recherche
3. **Expérience utilisateur médiocre** : Navigation linéaire peu adaptée à une consultation rapide par besoin
4. **Absence de versioning visible** : Difficile de suivre les évolutions du framework
5. **Pas de communauté** : Aucun moyen de fédérer les utilisateurs et contributeurs
6. **Mode opératoire inaccessible** : Le guide pratique détaillé reste enfermé dans un document
7. **Annexes riches mais fragmentées** : 45 annexes détaillées (templates, guides, bonnes pratiques) non exploitées

Les équipes de développement adoptent les agents IA de codage (Claude Code, Cursor, etc.) de manière empirique, sans méthodologie structurée pour :
- Redéfinir les rôles et responsabilités
- Maintenir la cohérence architecturale
- Garantir la qualité du code généré
- Mesurer et optimiser les gains de productivité

### Opportunité

Créer **la plateforme de référence mondiale pour le développement logiciel assisté par agents IA**, positionnée comme "le Scrum du développement avec IA".

**Impact attendu :**
- Accélérer l'adoption d'une méthodologie structurée pour les agents IA
- Réduire la courbe d'apprentissage de plusieurs semaines à quelques jours
- Fédérer une communauté de praticiens partageant bonnes pratiques et retours d'expérience
- Établir AIAD comme standard de facto dans le domaine
- Fournir un guide opérationnel concret (Mode Opératoire) en complément du framework théorique
- Rendre accessibles les 45 annexes détaillées (templates, guides techniques, bonnes pratiques)

---

## OBJECTIFS

### Objectifs Business (6 mois)

| Objectif | Métrique | Cible | Méthode de mesure |
|----------|----------|-------|-------------------|
| **Adoption du framework** | Visiteurs uniques mensuels | 5 000 | Google Analytics |
| **Engagement utilisateur** | Temps moyen sur site | > 4 min | Google Analytics |
| **Conversion documentation** | Téléchargements templates | 500/mois | Event tracking |
| **Référencement** | Position Google "AI coding framework" | Top 10 | SEMrush/Ahrefs |
| **Communauté** | Abonnés newsletter | 1 000 | Mailchimp |
| **Satisfaction** | Net Promoter Score (NPS) | > 50 | Survey trimestrielle |
| **Partage social** | Partages LinkedIn/Twitter | 200/mois | Buffer/Analytics |
| **Utilisation Mode Opératoire** | Pages Mode Opératoire consultées | > 40% du total | Analytics |

### Objectifs Produit par Phase

#### MVP (4 semaines)
- ✅ 100% du Framework AIAD (8 chapitres) accessible en ligne
- ✅ 100% du Mode Opératoire (8 chapitres) accessible en ligne
- ✅ 100% des Annexes (45 fichiers, 9 catégories A-I) accessibles en ligne
- ✅ Navigation intuitive (< 3 clics pour accéder à n'importe quelle section)
- ✅ Templates téléchargeables (Markdown + PDF) depuis les Annexes catégorie A
- ✅ Score Lighthouse > 90 sur tous les critères
- ✅ Site responsive (mobile, tablette, desktop)
- ✅ SEO optimisé (sitemap, meta tags, structure sémantique)

#### V1 (+4 semaines)
- Parcours "Getting Started" interactif
- Pages rôles AIAD enrichies (6 rôles - catégorie B des annexes)
- Pages agents spécialisés (7 agents - catégorie F des annexes)
- FAQ enrichie (30+ questions - basée sur annexe I1-Troubleshooting)
- Newsletter opérationnelle
- 3 études de cas publiées
- Documentation communication par audience (basée sur dossier Communication)

#### Plus tard (non daté)
- Assistant IA "AIAD CoPilot"
- Calculateur ROI interactif
- Forum communautaire
- Plateforme de certification
- Workspace personnel utilisateur
- API publique

### Métriques de Succès MVP (1 mois post-lancement)

| Métrique | Cible | Impact |
|----------|-------|--------|
| Visiteurs uniques | > 500 | Adoption initiale |
| Pages vues / session | > 4 | Engagement contenu |
| Temps moyen sur site | > 3 min | Profondeur consultation |
| Taux de rebond | < 60% | Qualité expérience |
| Téléchargements templates | > 50 | Utilisation concrète |
| Score Lighthouse | > 90 | Qualité technique |

---

## PERSONAS

### Persona 1 : Marie - Product Engineer 🎯 [PRINCIPAL]

#### Profil
- **Âge :** 28-35 ans
- **Rôle :** Développeuse senior / Lead developer
- **Entreprise :** Scale-up tech (50-500 employés)
- **Équipe :** 3-8 développeurs
- **Expérience :** 5-10 ans de développement
- **Outils :** VS Code, GitHub, Claude Code ou Cursor

#### Contexte
Utilise déjà des agents IA de codage mais cherche une méthodologie structurée pour optimiser son workflow et éviter les itérations inutiles.

#### Besoins prioritaires
1. Guidance opérationnelle immédiate : "Comment structurer ma journée avec Claude Code ?"
2. Templates prêts à l'emploi : "Exemple de SPECS pour démarrer"
3. Bonnes pratiques validées : "Erreurs courantes à éviter"
4. Mode opératoire détaillé : "Comment installer, configurer et utiliser Claude Code avec AIAD ?"

#### Frustrations
- Perte de temps avec code généré à refaire
- Manque de structure pour décomposer les tâches
- Difficulté à maintenir cohérence du code généré
- Documentation technique éparpillée

#### Citations
> "J'utilise Claude Code tous les jours mais j'ai l'impression de ne pas exploiter tout son potentiel."

> "J'ai le framework AIAD mais je ne sais pas concrètement comment l'implémenter avec Claude Code au quotidien."

#### Critères de succès
- Trouve un template SPECS en < 30 secondes
- Comprend le workflow Product Engineer en < 10 minutes
- Accède au mode opératoire détaillé pour chaque phase
- Applique AIAD dès le lendemain

---

### Persona 2 : Thomas - Tech Lead / CTO

#### Profil
- **Âge :** 32-45 ans
- **Rôle :** Tech Lead, Engineering Manager ou CTO
- **Entreprise :** Scale-up, PME innovante, grand groupe
- **Équipe :** 5-20 développeurs
- **Expérience :** 10-20 ans dans la tech

#### Contexte
Cherche à moderniser les pratiques de son équipe et justifier l'investissement dans les agents IA avec du ROI mesurable.

#### Besoins prioritaires
1. Vue d'ensemble stratégique : "AIAD est-il adapté à mon contexte ?"
2. Impact organisationnel : "Comment redéfinir les rôles ?"
3. Business case : "Quel ROI attendre ? Comment le mesurer ?"
4. Plan d'adoption : "Par où commencer ? Quelle roadmap ?"
5. Guide d'implémentation : "Étapes concrètes pour déployer AIAD"

#### Frustrations
- Résistance au changement dans l'équipe
- Difficulté à évaluer objectivement les nouveaux outils
- Crainte de perdre le contrôle qualité
- Écart entre théorie (framework) et pratique (implémentation)

#### Citations
> "Comment AIAD s'intègre avec nos pratiques Scrum actuelles ?"

> "Le framework est intéressant, mais comment le déployer concrètement dans mon équipe ?"

#### Critères de succès
- Évalue pertinence AIAD en < 15 minutes
- Dispose d'un plan d'adoption concret
- Convainc direction avec données chiffrées
- Lance pilote sous 1 mois

---

### Persona 3 : Sophie - Product Owner / Manager

#### Profil
- **Âge :** 30-40 ans
- **Rôle :** Product Owner, Product Manager
- **Entreprise :** Startup, scale-up, ESN
- **Équipe :** 1-3 équipes de développement
- **Expérience :** 5-12 ans en product management

#### Contexte
Gère un backlog chargé et cherche à accélérer le time-to-market tout en maintenant la qualité.

#### Besoins prioritaires
1. Impact sur delivery : "Comment AIAD accélère le time-to-market ?"
2. Nouvelle façon de travailler : "Comment rédiger des PRD adaptés aux agents IA ?"
3. Mesure de performance : "Comment suivre la vélocité avec AIAD ?"
4. Alignement équipe : "Comment assurer l'alignement tech/product ?"

#### Frustrations
- Incompréhension des contraintes techniques
- Estimations imprécises malgré nouveaux outils
- Difficulté à prioriser dans ce nouveau paradigme

#### Citations
> "Si les développeurs utilisent des agents IA, est-ce que je dois changer ma façon d'écrire les user stories ?"

#### Critères de succès
- Comprend impact sur son rôle en < 10 minutes
- Adapte ses PRD avec guidelines AIAD
- Mesure amélioration vélocité
- Maintient qualité livrables

---

### Persona 4 : David - Consultant / Coach Agile

#### Profil
- **Âge :** 35-50 ans
- **Rôle :** Consultant indépendant ou cabinet de conseil
- **Clients :** ETI, grands groupes, scale-ups
- **Expertise :** Scrum, SAFe, DevOps, Lean
- **Expérience :** 12-25 ans, dont 5-10 ans en conseil

#### Contexte
Accompagne les transformations d'organisations et cherche des frameworks éprouvés à proposer à ses clients.

#### Besoins prioritaires
1. Documentation complète : "Puis-je recommander AIAD en confiance ?"
2. Crédibilité : "Y a-t-il des études de cas ?"
3. Ressources de formation : "Puis-je former mes clients avec ce contenu ?"
4. Complémentarité : "Comment AIAD s'articule avec SAFe, Scrum ?"
5. Guide pratique : "Comment accompagner clients dans l'implémentation ?"

#### Frustrations
- Manque de frameworks structurés pour l'IA
- Clients demandeurs mais sans vision claire
- Absence de guide d'implémentation opérationnel

#### Citations
> "Mes clients me demandent comment intégrer les agents IA dans leurs équipes Scrum. AIAD pourrait être la réponse."

> "Un mode opératoire détaillé me permettrait d'accompagner mes clients pas à pas."

#### Critères de succès
- Valide solidité méthodologique AIAD
- Dispose de supports de formation (Framework + Mode Opératoire)
- Recommande AIAD à ses clients
- Contribue à l'évolution du framework

---

## USER STORIES

### MVP - Phase 1 (4 semaines) - 17 User Stories

#### EPIC 1 : Découvrir AIAD

##### US-001 : Comprendre AIAD rapidement
**En tant que** visiteur découvrant AIAD pour la première fois  
**Je veux** comprendre en moins d'une minute ce qu'est AIAD et ses bénéfices principaux  
**Afin de** décider rapidement si ce framework est pertinent pour mon contexte

**Complexité :** M (Medium)

**Critères d'acceptation :**
- [ ] La page d'accueil affiche un hero section avec :
  - Titre explicite (ex: "AIAD : Le framework pour développer avec des agents IA")
  - Value proposition en une phrase
  - 3 bénéfices clés sous forme de pictos + texte court
- [ ] Un CTA principal "Explorer le Framework" visible above the fold
- [ ] Temps de lecture du hero < 30 secondes (validé par 5 utilisateurs tests)
- [ ] Des statistiques chiffrées crédibles (ex: "50% de gain de productivité")

---

##### US-002 : Évaluer la pertinence pour mon équipe
**En tant que** Tech Lead  
**Je veux** visualiser rapidement les pré-requis et le contexte d'applicabilité d'AIAD  
**Afin de** déterminer si AIAD est adapté à ma situation (taille équipe, maturité, stack)

**Complexité :** M

**Critères d'acceptation :**
- [ ] Page "Pour qui ?" accessible depuis le menu principal
- [ ] Matrice de pertinence selon :
  - Taille d'équipe (1-3 / 4-10 / 10+)
  - Maturité Agile (débutant / intermédiaire / avancé)
  - Contexte (startup / scale-up / entreprise)
- [ ] Liste des pré-requis techniques (accès à un agent IA, autonomie équipe, etc.)
- [ ] Section "AIAD n'est pas pour vous si..." (honnêteté sur les limites)
- [ ] Liens vers des cas d'usage par type d'organisation

---

##### US-003 : Comparer avec d'autres approches
**En tant que** CTO  
**Je veux** voir comment AIAD se positionne par rapport à d'autres méthodologies  
**Afin de** comprendre sa valeur ajoutée spécifique

**Complexité :** M

**Critères d'acceptation :**
- [ ] Tableau comparatif AIAD vs développement traditionnel vs "vibe coding"
- [ ] Points de différenciation clairs (approche itérative, documentation vivante, etc.)
- [ ] Section "Compatibilité avec Scrum/SAFe/Kanban"
- [ ] FAQ dédiée aux comparaisons

---

#### EPIC 2 : Consulter le Framework

##### US-004 : Naviguer facilement dans le framework ⚠️ CRITIQUE
**En tant que** Product Engineer  
**Je veux** accéder rapidement à n'importe quelle section du framework ou du mode opératoire  
**Afin de** trouver l'information dont j'ai besoin sans perdre de temps

**Complexité :** L (Large)

**Critères d'acceptation :**
- [ ] Menu de navigation principal avec :
  - Les 8 chapitres du Framework AIAD (Préambule à Annexes)
  - Les 8 chapitres du Mode Opératoire (Préambule à Annexes)
  - Les 9 catégories d'Annexes (A-I : Templates, Rôles, Boucles, Rituels, Métriques, Agents, Configuration, Bonnes Pratiques, Ressources)
  - Séparation visuelle claire entre Framework, Mode Opératoire et Annexes
- [ ] Sous-menu déroulant pour chaque partie (ex: Framework > Partie 1 > Rôles > Product Engineer)
- [ ] Breadcrumb sur toutes les pages (ex: Accueil > Framework > Partie 1 > Rôles > Product Engineer)
- [ ] Navigation clavier fonctionnelle (Tab, Shift+Tab, Enter)
- [ ] Liens "Précédent/Suivant" en bas de chaque page
- [ ] Table des matières sticky sur les pages longues
- [ ] Temps pour atteindre une page spécifique < 3 clics (validé par tests utilisateurs)

---

##### US-005 : Rechercher du contenu efficacement
**En tant que** utilisateur cherchant une information précise  
**Je veux** utiliser une barre de recherche performante  
**Afin de** trouver rapidement ce que je cherche sans parcourir tout le site

**Complexité :** M

**Critères d'acceptation :**
- [ ] Barre de recherche accessible depuis toutes les pages (header)
- [ ] Raccourci clavier pour focus (ex: Ctrl+K ou Cmd+K)
- [ ] Recherche full-text sur Framework AIAD + Mode Opératoire + Annexes
- [ ] Affichage des résultats avec :
  - Titre de la page
  - Extrait de contexte (snippet)
  - Chemin de navigation (breadcrumb)
  - Badge indiquant source (Framework / Mode Opératoire / Annexes)
- [ ] Résultats classés par pertinence
- [ ] Temps de recherche < 500ms
- [ ] Affichage "Aucun résultat" avec suggestions alternatives

---

##### US-006 : Lire le contenu confortablement
**En tant que** utilisateur consultant le framework ou le mode opératoire  
**Je veux** une expérience de lecture optimale  
**Afin de** comprendre le contenu sans effort et sans fatigue visuelle

**Complexité :** M

**Critères d'acceptation :**
- [ ] Typographie lisible (fonte, taille, interligne)
- [ ] Largeur de colonne optimale (max 75 caractères par ligne)
- [ ] Contraste WCAG AA minimum (4.5:1 pour texte normal)
- [ ] Hiérarchie visuelle claire (H1, H2, H3 différenciés)
- [ ] Espacement généreux entre sections
- [ ] Code blocks avec syntax highlighting
- [ ] Tableaux responsives (scroll horizontal sur mobile)
- [ ] Temps de lecture estimé affiché en haut de chaque article
- [ ] Indicateur de progression de lecture (barre ou pourcentage)

---

##### US-007 : Consulter le glossaire
**En tant que** utilisateur découvrant des termes spécifiques  
**Je veux** accéder rapidement au glossaire AIAD  
**Afin de** comprendre le vocabulaire du framework et du mode opératoire

**Complexité :** S (Small)

**Critères d'acceptation :**
- [ ] Page Glossaire accessible depuis le menu principal (basée sur annexe I2-glossaire.md)
- [ ] Termes du Framework AIAD + termes Claude Code du Mode Opératoire
- [ ] Termes classés par ordre alphabétique
- [ ] Recherche/filtrage des termes
- [ ] Tooltips sur les termes techniques dans le contenu (hover affiche définition)
- [ ] Liens depuis les définitions vers les pages détaillées
- [ ] Possibilité de lier directement à un terme (ex: /glossaire#product-engineer)

---

#### EPIC 3 : Utiliser les Templates

##### US-008 : Découvrir les templates disponibles
**En tant que** Tech Lead démarrant avec AIAD  
**Je veux** voir la liste complète des templates disponibles  
**Afin de** comprendre quels outils je peux utiliser immédiatement

**Complexité :** S

**Critères d'acceptation :**
- [ ] Page "Templates" accessible depuis le menu principal (basée sur Annexes catégorie A)
- [ ] Liste des 6 templates fondateurs (Annexes A1-A6) :
  - A1 : PRD (Product Requirement Document)
  - A2 : ARCHITECTURE
  - A3 : AGENT-GUIDE (CLAUDE.md)
  - A4 : SPECS
  - A5 : DoOD (Definition of Obviously Done)
  - A6 : DoOuD (Definition of Obviously Undone)
- [ ] Liens vers templates complémentaires dans autres catégories :
  - Catégorie C : Guides des boucles AIAD (C1-C5)
  - Catégorie D : Guides des rituels (D1-D5)
  - Catégorie G : Guides de configuration technique (G1-G6)
- [ ] Pour chaque template :
  - Nom et description courte
  - Cas d'usage (quand l'utiliser)
  - Aperçu visuel (screenshot ou extrait)
  - Formats disponibles (Markdown, PDF)
- [ ] Filtrage par rôle (Product Manager, Product Engineer, Tech Lead, QA Engineer, etc.)
- [ ] Filtrage par catégorie d'annexe (A-I)

---

##### US-009 : Télécharger un template
**En tant que** Product Engineer  
**Je veux** télécharger un template de SPECS ou une checklist du mode opératoire  
**Afin de** l'adapter à mon projet

**Complexité :** S

**Critères d'acceptation :**
- [ ] Bouton "Télécharger" visible sur chaque fiche template
- [ ] Choix du format au clic (Markdown / PDF)
- [ ] Téléchargement immédiat sans inscription
- [ ] Nom de fichier explicite (ex: aiad-template-specs.md, aiad-checklist-initialisation.md)
- [ ] Tracking analytics du téléchargement
- [ ] Possibilité de copier le contenu directement (bouton "Copier")

---

##### US-011 : Prévisualiser un template avant téléchargement
**En tant que** visiteur hésitant  
**Je veux** prévisualiser le contenu d'un template  
**Afin de** vérifier qu'il correspond à mes besoins avant de le télécharger

**Complexité :** S

**Critères d'acceptation :**
- [ ] Bouton "Aperçu" sur chaque fiche template
- [ ] Modale ou page affichant le template complet
- [ ] Possibilité de copier des sections spécifiques
- [ ] Bouton "Télécharger" accessible depuis l'aperçu

---

#### EPIC 5 : Accéder au Mode Opératoire

##### US-015 : Comprendre la structure du Mode Opératoire
**En tant que** Product Engineer
**Je veux** visualiser les 8 chapitres du Mode Opératoire
**Afin de** comprendre comment l'utiliser au quotidien

**Complexité :** M

**Critères d'acceptation :**
- [ ] Page "Mode Opératoire" accessible depuis le menu principal
- [ ] Vue d'ensemble avec les 8 chapitres :
  - 00-preambule : Préambule (glossaire, RACI, vue d'ensemble)
  - 01-initialisation : Phase d'initialisation (Démarrage projet)
  - 02-planification : Phase de planification (PLANIFIER)
  - 03-developpement : Phase de développement (IMPLÉMENTER)
  - 04-validation : Phase de validation (VALIDER)
  - 05-deploiement : Phase de déploiement (INTÉGRER)
  - 06-rituels-amelioration : Rituels et amélioration continue
  - 07-annexes : Annexes et références
- [ ] Correspondance avec les boucles AIAD (Annexes C1-C5)
- [ ] Indication du temps nécessaire pour chaque chapitre
- [ ] Navigation directe vers chaque chapitre
- [ ] Badge "Essentiel" sur les chapitres critiques (01, 02, 03)

---

##### US-015b : Naviguer dans les Annexes
**En tant que** utilisateur cherchant des ressources détaillées
**Je veux** accéder facilement aux 45 annexes organisées par catégorie
**Afin de** trouver rapidement templates, guides et bonnes pratiques

**Complexité :** M

**Critères d'acceptation :**
- [ ] Page "Annexes" accessible depuis le menu principal
- [ ] Vue d'ensemble des 9 catégories :
  - Catégorie A : Templates Fondateurs (A1-A6 : PRD, Architecture, Agent-Guide, Specs, DoOD, DoOuD)
  - Catégorie B : Rôles Détaillés (B1-B6 : PM, PE, QA, Tech Lead, Supporters, Agents Engineer)
  - Catégorie C : Boucles AIAD (C1-C5 : Initialisation, Planifier, Implémenter, Valider, Intégrer)
  - Catégorie D : Rituels (D1-D5 : Alignment, Demo, Tech Review, Rétro, Standup)
  - Catégorie E : Métriques et Dashboards (E1-E2)
  - Catégorie F : Agents Spécialisés (F1-F7 : Security, Quality, Architecture, Documentation, Performance, Code Review, Autres)
  - Catégorie G : Configuration Technique (G1-G6 : Environnement, Agents IA, CI/CD, Permissions, MCP, SubAgents)
  - Catégorie H : Bonnes Pratiques (H1-H5 : Prompts, Patterns, Anti-patterns, Cas d'usage, Notes)
  - Catégorie I : Ressources (I1-I4 : Troubleshooting, Glossaire, Bibliographie, Communauté)
- [ ] Navigation par catégorie avec filtres
- [ ] Liens croisés vers Framework et Mode Opératoire
- [ ] Badge indiquant le type de contenu (Template, Guide, Référence)

---

##### US-018 : Utiliser les commandes Claude Code
**En tant que** utilisateur de Claude Code  
**Je veux** consulter la liste complète des commandes  
**Afin de** maîtriser l'outil efficacement

**Complexité :** S

**Critères d'acceptation :**
- [ ] Page "Commandes Claude Code" avec :
  - Tableau de toutes les commandes (/clear, /context, /rewind, etc.)
  - Description de chaque commande
  - Cas d'usage recommandés
  - Raccourcis clavier (Esc, Shift+Tab)
- [ ] Exemples d'utilisation en contexte
- [ ] Lien vers la documentation officielle Claude Code
- [ ] Possibilité de filtrer par catégorie (Contexte, Navigation, Configuration, etc.)

---

#### EPIC 8 : Performance et Accessibilité

##### US-026 : Charger le site rapidement ⚠️ CRITIQUE
**En tant qu'** utilisateur  
**Je veux** que le site se charge en moins de 2 secondes  
**Afin de** ne pas être frustré par l'attente

**Complexité :** M

**Critères d'acceptation :**
- [ ] Temps de chargement (Largest Contentful Paint) < 2 secondes sur 4G
- [ ] Score Lighthouse Performance > 90
- [ ] Images optimisées (WebP, lazy loading)
- [ ] CSS et JS minifiés
- [ ] Mise en cache efficace (CDN ou caching headers)
- [ ] Pas de fonts externes bloquantes (ou optimisées)

---

##### US-027 : Naviguer au clavier
**En tant qu'** utilisateur avec handicap moteur  
**Je veux** pouvoir naviguer sur tout le site au clavier  
**Afin d'** accéder au contenu sans souris

**Complexité :** M

**Critères d'acceptation :**
- [ ] Navigation avec Tab/Shift+Tab fonctionnelle
- [ ] Ordre de tabulation logique
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Pas de piège au clavier (focus loops)
- [ ] Raccourcis clavier documentés (ex: / pour recherche)
- [ ] Menu déroulant accessible au clavier (flèches)
- [ ] Score Lighthouse Accessibility > 90

---

##### US-028 : Consulter sur mobile ⚠️ CRITIQUE
**En tant qu'** utilisateur mobile  
**Je veux** une expérience optimale sur smartphone  
**Afin de** consulter AIAD en déplacement

**Complexité :** L

**Critères d'acceptation :**
- [ ] Design responsive (mobile-first)
- [ ] Menu hamburger fonctionnel
- [ ] Texte lisible sans zoom (taille min 16px)
- [ ] Boutons suffisamment grands (min 44x44px)
- [ ] Tableaux scrollables horizontalement
- [ ] Pas de contenu coupé ou débordant
- [ ] Tests sur iOS Safari, Chrome Android, Samsung Internet

---

##### US-029 : Respecter les critères RGAA et RGESN
**En tant que** responsable accessibilité et écoconception  
**Je veux** que le site respecte les normes RGAA (niveau AA) et RGESN  
**Afin de** garantir l'accès à tous et limiter l'impact environnemental

**Complexité :** M

**Critères d'acceptation :**
- [ ] **RGAA :** Contraste minimum 4.5:1 (texte normal)
- [ ] **RGAA :** Contraste minimum 3:1 (texte large, éléments UI)
- [ ] **RGAA :** Textes alternatifs sur toutes les images
- [ ] **RGAA :** Balises sémantiques HTML5 (header, nav, main, footer, article)
- [ ] **RGAA :** Hiérarchie de titres respectée (H1 unique, H2-H6 ordonnés)
- [ ] **RGAA :** Formulaires accessibles (labels, erreurs explicites)
- [ ] **RGAA :** Pas de contenu uniquement en couleur
- [ ] **RGESN :** Images optimisées (WebP, compression)
- [ ] **RGESN :** Lazy loading des images et vidéos
- [ ] **RGESN :** Minification CSS/JS
- [ ] **RGESN :** Hébergement éco-responsable (Vercel/Netlify avec énergies renouvelables)
- [ ] **RGESN :** Pas de tracking tiers excessif

---

#### EPIC 9 : SEO et Visibilité

##### US-030 : Être référencé sur Google
**En tant que** visiteur potentiel  
**Je veux** trouver le site AIAD en cherchant "framework développement IA"  
**Afin d'** accéder facilement à la ressource

**Complexité :** M

**Critères d'acceptation :**
- [ ] Sitemap XML généré et soumis à Google Search Console
- [ ] Robots.txt configuré
- [ ] Meta title et description sur toutes les pages
- [ ] URLs propres et sémantiques (ex: /framework/roles/product-engineer, /mode-operatoire/initialisation)
- [ ] Balises Open Graph pour partage social (LinkedIn, Twitter)
- [ ] Schema.org markup (Article, BreadcrumbList)
- [ ] Score Lighthouse SEO > 90
- [ ] Position Google "framework AIAD" dans top 3 (objectif 3 mois)

---

##### US-031 : Partager sur les réseaux sociaux
**En tant qu'** utilisateur enthousiasmé  
**Je veux** partager une page AIAD sur LinkedIn  
**Afin de** recommander la ressource à mon réseau

**Complexité :** S

**Critères d'acceptation :**
- [ ] Boutons de partage social sur les pages principales
- [ ] Preview social optimisé (Open Graph) :
  - Image attractive (1200x630px)
  - Titre explicite
  - Description engageante
- [ ] Partage possible sur : LinkedIn, Twitter/X
- [ ] Tracking des partages (analytics)

---

### V1 - Phase 2 (+4 semaines) - 11 User Stories

#### EPIC 3 : Utiliser les Templates

##### US-010 : Comprendre comment utiliser un template
**En tant que** utilisateur ayant téléchargé un template  
**Je veux** accéder à des instructions et exemples d'utilisation  
**Afin de** l'adapter correctement à mon contexte

**Complexité :** M

**Critères d'acceptation :**
- [ ] Page de détail pour chaque template avec :
  - Description complète du template
  - Quand et pourquoi l'utiliser
  - Instructions étape par étape
  - Exemple rempli avec annotations
  - Erreurs courantes à éviter
- [ ] Section "Personnalisation" avec conseils spécifiques
- [ ] Lien vers le chapitre correspondant du framework ou mode opératoire (ex: template SPECS → Framework Partie 2.4 + Mode Opératoire Partie 2.3)
- [ ] Possibilité de commenter/poser des questions

---

#### EPIC 4 : Comprendre les Rôles

##### US-012 : Visualiser les rôles AIAD
**En tant que** Manager d'équipe
**Je veux** voir une vue d'ensemble des rôles définis dans AIAD
**Afin de** comprendre comment organiser mon équipe

**Complexité :** L

**Critères d'acceptation :**
- [ ] Page "Rôles et Responsabilités" avec :
  - Schéma visuel des 6 rôles (basé sur Annexes B1-B6) :
    - B1 : Product Manager
    - B2 : Product Engineer
    - B3 : QA Engineer
    - B4 : Tech Lead
    - B5 : Supporters (DevOps, Design, etc.)
    - B6 : Agents Engineer
  - Vue d'ensemble des interactions entre rôles
  - Mention des 7 Agents Spécialisés (Annexes F1-F7)
- [ ] Matrice RACI simplifiée (Responsable, Consulté, Informé par activité clé)
- [ ] Comparaison "Avant AIAD" vs "Avec AIAD" pour chaque rôle
- [ ] Indicateur du rôle le plus impacté (Product Engineer)

---

##### US-013 : Comprendre le rôle de Product Engineer
**En tant que** développeur senior
**Je veux** comprendre en détail le rôle de Product Engineer
**Afin de** savoir si cette évolution m'intéresse et comment m'y préparer

**Complexité :** M

**Critères d'acceptation :**
- [ ] Page dédiée "Product Engineer" (basée sur Annexe B2-product-engineer.md) avec :
  - Mission principale (orchestrateur d'agent IA)
  - Responsabilités clés (liste des 5 responsabilités du framework)
  - Compétences requises (hard skills + soft skills)
  - Workflow type d'une journée
  - Livrables attendus
- [ ] Section "Évolution de carrière" (d'où on vient, où on va)
- [ ] Lien vers le workflow quotidien du Mode Opératoire (03-developpement.md)
- [ ] Témoignage ou interview d'un Product Engineer
- [ ] Quiz d'auto-évaluation "Suis-je prêt·e à devenir Product Engineer ?"

---

##### US-014 : Voir les interactions entre rôles
**En tant que** Tech Lead  
**Je veux** visualiser comment les rôles collaborent  
**Afin de** identifier les points de synchronisation nécessaires

**Complexité :** M

**Critères d'acceptation :**
- [ ] Diagramme de flux des interactions principales
- [ ] Tableau "De → Vers" avec :
  - Qui interagit avec qui
  - À quelle fréquence
  - Artefacts échangés
  - Outils de collaboration recommandés
- [ ] Exemples de communication (templates de messages Slack, emails, etc.)
- [ ] Lien vers la Matrice RACI du Mode Opératoire (Partie 0.2)

---

#### EPIC 5 : Accéder au Mode Opératoire

##### US-016 : Suivre la phase d'initialisation ⚠️ CRITIQUE V1
**En tant que** Tech Lead démarrant un projet AIAD  
**Je veux** suivre pas à pas la phase d'initialisation  
**Afin de** configurer correctement mon environnement Claude Code + AIAD

**Complexité :** L

**Critères d'acceptation :**
- [ ] Page "Phase d'initialisation" avec 10 étapes détaillées :
  1. Cadrage initial
  2. Création PRD
  3. Architecture technique
  4. Configuration environnement (Warp, Claude Code)
  5. Création CLAUDE.md
  6. Configuration permissions
  7. Installation MCP et Plugins
  8. Configuration SubAgents
  9. Initialisation OpenSpec
  10. Génération readme.md
- [ ] Chaque étape avec :
  - Acteur responsable (RACI)
  - Entrées/Sorties
  - Durée estimée
  - Instructions détaillées
  - Exemples de code/configuration
  - Checklist de validation
- [ ] Checklist globale de fin d'initialisation (10 points)
- [ ] Téléchargement de tous les templates nécessaires
- [ ] Liens vers les ressources externes (Warp, Claude Code, etc.)

---

##### US-017 : Appliquer le workflow quotidien
**En tant que** Product Engineer  
**Je veux** consulter le workflow quotidien recommandé  
**Afin de** structurer ma journée de développement avec Claude Code

**Complexité :** M

**Critères d'acceptation :**
- [ ] Page "Workflow quotidien" avec :
  - Planning type d'une journée (9h-17h)
  - Activités heure par heure
  - Durée de chaque activité
- [ ] Section "Cycle d'une fonctionnalité" avec 7 étapes :
  1. Lancement (prompts, /clear, /context)
  2. Validation (checklist)
  3. Correction (prompts de correction)
  4. Tests (génération, exécution)
  5. Revue (code reviewer)
  6. Documentation
  7. Merge (Git)
- [ ] Exemples de prompts pour chaque étape
- [ ] Section "Gestion des problèmes" (troubleshooting)
- [ ] Téléchargement "Checklist quotidienne PE"

---

##### US-019 : Configurer les MCPs et Plugins
**En tant que** Product Engineer
**Je veux** savoir quels MCPs et Plugins installer
**Afin d'** optimiser Claude Code pour mon projet

**Complexité :** M

**Critères d'acceptation :**
- [ ] Page "MCPs et Plugins" (basée sur Annexe G5-installation-mcp-plugins.md) avec :
  - Liste des MCPs recommandés (Context7, Playwright, etc.)
  - Description et cas d'usage de chaque MCP
  - Instructions d'installation (commandes exactes)
  - Configuration dans CLAUDE.md
- [ ] Liste des Plugins recommandés (OpenSpec, frontend-design, playwright-skill)
- [ ] Liens vers les repositories GitHub officiels
- [ ] Section "Troubleshooting" pour problèmes courants (basée sur Annexe I1-troubleshooting.md)

---

##### US-020 : Créer et utiliser des SubAgents
**En tant que** Tech Lead
**Je veux** comprendre le concept de SubAgents et savoir en créer
**Afin de** déléguer des tâches expertes à des agents spécialisés

**Complexité :** L

**Critères d'acceptation :**
- [ ] Page "SubAgents" (basée sur Annexe G6-creation-subagents.md) avec :
  - Concept et vision
  - Différence SubAgent vs Skill vs Hook (tableau comparatif)
  - Catalogue des 7 Agents Spécialisés (Annexes F1-F7) :
    - F1 : Agent Security
    - F2 : Agent Quality
    - F3 : Agent Architecture
    - F4 : Agent Documentation
    - F5 : Agent Performance
    - F6 : Agent Code Review
    - F7 : Autres Agents (Test, Migration, Debug, etc.)
- [ ] Pour chaque SubAgent :
  - Rôle et mission
  - Instructions de création
  - Template de configuration (.md)
  - Exemples d'utilisation
- [ ] Section "Créer un SubAgent personnalisé"
- [ ] Téléchargement des templates SubAgents
- [ ] Lien vers les Annexes F (Agents Spécialisés)

---

#### EPIC 6 : Mesurer l'Impact

##### US-022 : Consulter des études de cas
**En tant que** consultant  
**Je veux** lire des études de cas d'organisations ayant adopté AIAD  
**Afin de** valider l'applicabilité et les bénéfices réels du framework

**Complexité :** M

**Critères d'acceptation :**
- [ ] Page "Études de cas" avec minimum 3 cas réels :
  - Contexte de l'organisation (taille, secteur, problématique)
  - Approche d'implémentation AIAD
  - Résultats mesurés (métriques avant/après)
  - Difficultés rencontrées et solutions
  - Témoignage d'un responsable
- [ ] Filtrage par taille d'organisation, secteur, contexte
- [ ] Possibilité de proposer son propre cas d'usage (formulaire)

---

#### EPIC 7 : Se Former et Progresser

##### US-023 : Suivre un parcours "Getting Started" ⚠️ CRITIQUE V1
**En tant que** Product Engineer débutant avec AIAD  
**Je veux** suivre un parcours guidé étape par étape  
**Afin de** démarrer rapidement sans être perdu

**Complexité :** L

**Critères d'acceptation :**
- [ ] Page "Démarrer avec AIAD" structurée en 7 étapes :
  - Étape 1 : Comprendre les bases (Framework overview)
  - Étape 2 : Évaluer votre contexte
  - Étape 3 : Installer Claude Code (lien Mode Opératoire Partie 1.4)
  - Étape 4 : Suivre la phase d'initialisation (lien Mode Opératoire Partie 1)
  - Étape 5 : Télécharger les templates
  - Étape 6 : Lancer votre premier sprint AIAD (lien Mode Opératoire Partie 2-3)
  - Étape 7 : Mesurer et ajuster (lien Framework Partie 4)
- [ ] Checklist interactive (cocher les étapes complétées)
- [ ] Temps estimé pour chaque étape
- [ ] Liens vers les ressources nécessaires
- [ ] Sauvegarde de la progression (local storage, pas de compte)

---

##### US-024 : Accéder à la FAQ
**En tant que** utilisateur ayant des questions  
**Je veux** consulter une FAQ complète  
**Afin de** trouver rapidement des réponses aux questions courantes

**Complexité :** S

**Critères d'acceptation :**
- [ ] Page "FAQ" avec les 15 questions du Framework AIAD + questions Mode Opératoire
- [ ] Questions classées par thématique :
  - Général (Qu'est-ce qu'AIAD ? Pour qui ?)
  - Mise en œuvre (Comment démarrer ? Combien de temps ?)
  - Outils et compatibilité (Claude Code, Cursor, etc.)
  - Résultats et ROI
  - Technique (Installation, configuration)
- [ ] Recherche dans les questions
- [ ] Format accordéon (clic pour déplier la réponse)
- [ ] Possibilité de lier directement à une question (ancre)
- [ ] Formulaire "Poser une question" en bas de page

---

##### US-025 : Rejoindre la communauté
**En tant que** praticien AIAD  
**Je veux** m'abonner à la newsletter  
**Afin de** rester informé des évolutions et bonnes pratiques

**Complexité :** S

**Critères d'acceptation :**
- [ ] Formulaire d'inscription newsletter visible sur plusieurs pages :
  - Footer du site
  - Page d'accueil
  - Fin des articles de blog
- [ ] Champs : Email + Prénom (optionnel)
- [ ] Checkbox RGPD (consentement)
- [ ] Confirmation d'inscription (double opt-in)
- [ ] Email de bienvenue automatique avec ressources
- [ ] Intégration Mailchimp ou similaire

---

### Plus tard - Phase 3+ - Fonctionnalités avancées

#### Outils Interactifs
- **Assistant IA "AIAD CoPilot"** : Chatbot contextuel sur Framework + Mode Opératoire (utilisation API Anthropic)
- **Calculateur ROI** : Estimation gains par équipe avec paramètres personnalisables
- **Évaluateur maturité AIAD** : Quiz interactif + score + recommandations personnalisées

#### Plateforme Communautaire
- **Forum/Discussion** : Espace Q&A communautaire avec modération
- **Contributions** : Système de partage templates personnalisés et propositions d'amélioration

#### Fonctionnalités Avancées
- **Certification AIAD** : Parcours de certification + quiz de validation + badges et certificats
- **Workspace personnel** : Compte utilisateur, sauvegarde templates, suivi progression, partage équipe
- **Générateur documentation** : Outils guidés pour générer ARCHITECTURE.md, CLAUDE.md, SPECS

#### Intégrations
- **API publique** : REST API pour accès programmatique au contenu, webhooks, documentation OpenAPI

---

## HORS PÉRIMÈTRE

### Fonctionnalités Commerciales
- ❌ Marketplace payant pour services ou formations
- ❌ Vente de consulting ou accompagnement
- ❌ Modèle freemium ou premium
- ❌ Publicité (Google Ads, bannières)

**Justification :** Framework open-source et gratuit pour maximiser adoption.

### Plateforme de Collaboration
- ❌ Système de gestion de projet (type Jira, Trello)
- ❌ Outil de workflow intégré
- ❌ Hébergement de code ou repositories
- ❌ Mise en relation consultants/clients

**Justification :** Le site documente la méthodologie, pas un outil opérationnel.

### Contenu Multimédia Complexe
- ❌ Plateforme vidéo complète (type Udemy)
- ❌ Webinars en direct intégrés
- ❌ Podcasts hébergés
- ❌ Formations certifiantes payantes (MVP/V1)

**Justification :** Complexité technique/budgétaire. Vidéos peuvent être sur YouTube.

### Internationalisation (MVP et V1)
- ❌ Versions anglaise, espagnole, etc. (français uniquement)
- ❌ Système de traduction automatique

**Justification :** Focus marché français pour valider concept.

### Authentification et Données Personnelles
- ❌ Création compte utilisateur (MVP/V1)
- ❌ Profil personnalisé
- ❌ Sauvegarde cloud progression
- ❌ SSO (Single Sign-On)

**Justification :** Éviter complexité RGPD. Progression en local (localStorage).

### Fonctionnalités Sociales Avancées
- ❌ Système de commentaires intégré
- ❌ Chat en direct ou support 24/7
- ❌ Forum interne (lien Discord/Slack externe en V1)
- ❌ Notation ou reviews de contenu

**Justification :** Modération trop chronophage pour équipe réduite.

### Intégrations Techniques Avancées
- ❌ Plugin pour IDE (VS Code, Cursor)
- ❌ API GraphQL
- ❌ Intégration Zapier ou Make
- ❌ Webhooks ou notifications push

**Justification :** Développement complexe, non essentiel MVP.

### Analytics Avancés
- ❌ Dashboards temps réel visiteurs
- ❌ Heatmaps ou session replay (Hotjar)
- ❌ A/B testing automatisé

**Justification :** Google Analytics suffit pour MVP.

---

## RISQUES

### Risque 1 : Contenu trop dense, navigation confuse
**Probabilité :** Élevée (Framework + Mode Opératoire = beaucoup de contenu)  
**Impact :** Élevé (abandon utilisateurs)

**Mitigation :**
- ✅ 5 tests utilisateurs minimum avant lancement MVP
- ✅ Navigation progressive (overview → détails)
- ✅ Séparation visuelle claire Framework vs Mode Opératoire
- ✅ Indicateurs visuels (temps lecture, progression)
- ✅ Refonte navigation basée sur analytics post-lancement

**KPI suivi :** Taux rebond < 60%, Temps moyen > 3 min

---

### Risque 2 : Surcharge cognitive utilisateur
**Probabilité :** Moyenne  
**Impact :** Moyen (confusion, abandon)

**Mitigation :**
- ✅ Parcours "Getting Started" guidant clairement
- ✅ Badges distinguant Framework (théorie) vs Mode Opératoire (pratique)
- ✅ Section "Comment utiliser ce site" sur page d'accueil
- ✅ Recherche performante pour trouver info rapidement
- ✅ Liens croisés Framework ↔ Mode Opératoire

**KPI suivi :** Taux complétion "Getting Started" > 30%, Temps moyen > 4 min

---

### Risque 3 : Mauvais référencement initial
**Probabilité :** Élevée  
**Impact :** Moyen (peu de trafic organique)

**Mitigation :**
- ✅ SEO technique dès MVP (sitemap, meta tags, structure)
- ✅ Stratégie contenu (blog, articles invités Medium/Dev.to)
- ✅ Backlinks (LinkedIn, GitHub créateurs)
- ✅ Partage communautés (Reddit r/devops, r/programming)
- ✅ Agents Spécialisés AIAD pour créer contenu SEO

**KPI suivi :** Trafic organique > 30% du total à M+3

---

### Risque 4 : Complexité technique sous-estimée
**Probabilité :** Moyenne  
**Impact :** Moyen (retard, dette technique)

**Mitigation :**
- ✅ Architecture simple (SSG/JAMstack : Next.js ou Astro)
- ✅ Pas d'over-engineering (KISS principle)
- ✅ Stack connue de l'équipe
- ✅ Découpage petites itérations validées
- ✅ Buffer 20% sur estimations
- ✅ Focus MVP : Framework + Mode Opératoire uniquement

**KPI suivi :** Respect planning (±1 semaine max)

---

### Risque 5 : Manque de trafic au lancement
**Probabilité :** Élevée  
**Impact :** Faible (pas de business model dépendant)

**Mitigation :**
- ✅ Stratégie lancement (LinkedIn, Hacker News, Reddit)
- ✅ Newsletters tech (TLDR, Frontend Focus)
- ✅ Outreach influenceurs tech français
- ✅ Présentation meetups/conférences
- ✅ Email early adopters (si liste existe)

**KPI suivi :** 500 visiteurs uniques premier mois

---

### Risque 6 : Contenu pas à jour avec évolutions framework
**Probabilité :** Faible (court terme) / Moyenne (long terme)  
**Impact :** Élevé (perte de crédibilité)

**Mitigation :**
- ✅ Versioning visible (ex: "AIAD v1.0")
- ✅ Process mise à jour documenté
- ✅ Git pour contenu (historique, pull requests)
- ✅ Contribution communautaire (V1)
- ✅ Changelog public

**KPI suivi :** Temps mise à jour framework → publication < 1 semaine

---

### Risque 7 : Problèmes performance/disponibilité
**Probabilité :** Faible  
**Impact :** Moyen (frustration utilisateurs)

**Mitigation :**
- ✅ Hébergement fiable (Vercel/Netlify, 99.9% uptime)
- ✅ Monitoring (Uptime Robot)
- ✅ CDN pour assets statiques
- ✅ Tests performance réguliers (Lighthouse CI)

**KPI suivi :** Uptime > 99.5%, Temps chargement < 2s (P95)

---

### Risque 8 : Duplication avec autres ressources
**Probabilité :** Moyenne  
**Impact :** Moyen (différenciation floue)

**Mitigation :**
- ✅ Veille concurrentielle continue
- ✅ Positionnement clair : "Le Scrum du développement avec IA"
- ✅ Focus méthodologie complète (Framework) + guide pratique (Mode Opératoire)
- ✅ Qualité et exhaustivité du contenu
- ✅ Intégration communautaire (cas d'usage réels)

**KPI suivi :** Position unique "framework agent IA codage"

---

### Risque 9 : Résistance/critiques communauté
**Probabilité :** Faible  
**Impact :** Moyen (mauvaise réputation initiale)

**Mitigation :**
- ✅ Transparence sur limites et contexte applicabilité
- ✅ Ouverture feedbacks (formulaire, GitHub Discussions V1)
- ✅ Études de cas réelles
- ✅ Éviter marketing agressif/trompeur
- ✅ Disclaimer : "Framework en évolution, contributions bienvenues"

**KPI suivi :** Sentiment analysis mentions (LinkedIn, Twitter)

---

## PLANNING ET LIVRABLES

### Vue d'ensemble

| Phase | Durée | User Stories | Effort estimé | Objectif principal |
|-------|-------|--------------|---------------|-------------------|
| **MVP** | 4 semaines (2 sprints) | 17 US | 40-50 points | Framework + Mode Opératoire accessibles en ligne |
| **V1** | +4 semaines (2 sprints) | 11 US | 50-60 points | Enrichissement contenu + Communauté |
| **Plus tard** | À définir | 8+ features | 200+ points | Fonctionnalités avancées et interactives |

---

### Sprint 1 (Semaines 1-2) - Fondations MVP

**Objectif :** Infrastructure technique + Navigation + Page d'accueil

**User Stories prioritaires :**
1. US-004 : Navigation (L) - 🔴 PRIORITÉ MAX
2. US-001 : Page d'accueil (M)
3. US-026 : Performance (M)
4. US-030 : SEO de base (M)
5. US-006 : Lecture confortable (M)

**Livrables Sprint 1 :**
- [ ] Architecture Next.js/Astro déployée sur Vercel/Netlify
- [ ] Navigation principale Framework + Mode Opératoire fonctionnelle
- [ ] Page d'accueil avec hero section attractif
- [ ] Template de page de contenu responsive
- [ ] SEO technique (sitemap, meta tags, robots.txt)
- [ ] Score Lighthouse > 85 (objectif 90 en fin Sprint 2)

---

### Sprint 2 (Semaines 3-4) - Contenu MVP + Templates

**Objectif :** Publier Framework + Mode Opératoire + Templates + Finaliser qualité

**User Stories prioritaires :**
1. US-005 : Recherche (M)
2. US-007 : Glossaire (S)
3. US-015 : Structure Mode Opératoire (M)
4. US-008 : Découvrir templates (S)
5. US-009 : Télécharger templates (S)
6. US-011 : Prévisualiser templates (S)
7. US-018 : Commandes Claude Code (S)
8. US-002 : Évaluer pertinence (M)
9. US-003 : Comparaisons (M)
10. US-028 : Mobile responsive (L) - 🔴 PRIORITÉ
11. US-027 : Navigation clavier (M)
12. US-029 : RGAA/RGESN (M)
13. US-031 : Partage social (S)

**Livrables Sprint 2 :**
- [ ] 100% Framework AIAD (8 chapitres) publié et navigable
- [ ] 100% Mode Opératoire (8 chapitres) publié et navigable
- [ ] 100% Annexes (45 fichiers, 9 catégories) publiées et navigables
- [ ] 6 templates fondateurs téléchargeables (Annexes A1-A6 : PRD, ARCHITECTURE, CLAUDE.md, SPECS, DoOD, DoOuD)
- [ ] Recherche full-text opérationnelle (Framework + Mode Opératoire + Annexes)
- [ ] Glossaire complet (basé sur Annexe I2-glossaire.md)
- [ ] Site mobile-friendly (tests iOS/Android)
- [ ] Score Lighthouse > 90 sur tous les critères
- [ ] Pages "Pour qui ?" et "Comparaisons" publiées
- [ ] Boutons de partage social fonctionnels

**Critères de validation MVP :**
- [ ] Tous les critères d'acceptation des 17 US MVP validés
- [ ] 5 tests utilisateurs réalisés avec feedback positif
- [ ] Performance : temps de chargement < 2s
- [ ] Accessibilité : navigation clavier complète
- [ ] SEO : sitemap soumis à Google Search Console
- [ ] Responsive : tests réussis sur mobile/tablette/desktop

---

### Sprint 3 (Semaines 5-6) - Enrichissement V1

**Objectif :** Guides détaillés + Rôles + Getting Started

**User Stories prioritaires :**
1. US-023 : Getting Started (L) - 🔴 PRIORITÉ V1
2. US-016 : Phase initialisation (L) - 🔴 PRIORITÉ V1
3. US-012 : Rôles AIAD (L)
4. US-013 : Product Engineer (M)
5. US-014 : Interactions rôles (M)
6. US-024 : FAQ (S)

**Livrables Sprint 3 :**
- [ ] Parcours "Getting Started" complet et interactif
- [ ] Guide phase d'initialisation détaillé (basé sur Mode Opératoire 01-initialisation.md + Annexe C1)
- [ ] Pages dédiées aux 6 rôles AIAD (Annexes B1-B6) publiées
- [ ] Page Product Engineer avec workflow détaillé (Annexe B2)
- [ ] Diagramme des interactions entre rôles
- [ ] FAQ enrichie (30+ questions basée sur Annexe I1-troubleshooting.md)

---

### Sprint 4 (Semaines 7-8) - Communauté + Mode Opératoire avancé

**Objectif :** Communauté + Guides pratiques avancés

**User Stories prioritaires :**
1. US-017 : Workflow quotidien (M)
2. US-019 : MCPs et Plugins (M)
3. US-020 : SubAgents (L)
4. US-010 : Utiliser templates (M)
5. US-025 : Newsletter (S)
6. US-022 : Études de cas (M)

**Livrables Sprint 4 :**
- [ ] Guide workflow quotidien détaillé avec exemples de prompts (basé sur Annexe H1-prompts-efficaces.md)
- [ ] Documentation MCPs/Plugins complète (basée sur Annexe G5-installation-mcp-plugins.md)
- [ ] Documentation SubAgents complète (basée sur Annexes G6 + F1-F7)
- [ ] 7 pages Agents Spécialisés téléchargeables (Annexes F1-F7)
- [ ] Instructions détaillées d'utilisation pour chaque template
- [ ] Newsletter opérationnelle (formulaire + intégration Mailchimp)
- [ ] 3 études de cas minimum publiées
- [ ] Page Communication Décideurs publiée (basée sur communication/decideur.md)

**Critères de validation V1 :**
- [ ] Tous les critères d'acceptation des 11 US V1 validés
- [ ] Parcours "Getting Started" testé et validé
- [ ] 100+ abonnés newsletter
- [ ] Trafic : 1000 visiteurs uniques cumulés
- [ ] Engagement : temps moyen sur site > 3 min

---

### Plus tard - Fonctionnalités avancées (non daté)

**Fonctionnalités à développer après validation MVP et V1 :**

#### Priorité 1 - Outils d'aide à la décision
- Calculateur ROI interactif
- Évaluateur de maturité AIAD
- US-021 : Comprendre les métriques AIAD (page interactive)

#### Priorité 2 - Intelligence artificielle
- Assistant IA "AIAD CoPilot" (chatbot contextuel)

#### Priorité 3 - Communauté avancée
- Forum/Discussion (intégration Discourse ou GitHub Discussions)
- Système de contributions communautaires

#### Priorité 4 - Fonctionnalités avancées
- Plateforme de certification
- Workspace personnel utilisateur
- Générateur de documentation automatisé

#### Priorité 5 - Intégrations
- API publique REST
- Webhooks et notifications

---

## ANNEXES

### Glossaire Projet

| Terme | Définition |
|-------|-----------|
| **AIAD** | AI-Agent Iterative Development - Framework méthodologique pour le développement assisté par agents IA |
| **Product Engineer** | Rôle pivot AIAD : développeur orchestrant un agent IA plutôt que codant directement |
| **Agent IA de codage** | Assistant IA capable de générer du code à partir d'instructions (ex: Claude Code, Cursor) |
| **SPECS** | Spécifications techniques détaillées pour une tâche, traduites en instructions pour l'agent IA |
| **AGENT-GUIDE** | Document de configuration contextuelle guidant l'agent IA (fichier CLAUDE.md) |
| **PRD** | Product Requirement Document - Document d'exigences produit |
| **Mode Opératoire** | Guide pratique exhaustif détaillant l'implémentation concrète d'AIAD avec Claude Code |
| **MVP** | Minimum Viable Product - Version minimale fonctionnelle du produit |
| **SSG** | Static Site Generator - Générateur de site statique (ex: Next.js, Astro) |
| **JAMstack** | Architecture moderne : JavaScript, APIs, Markup (pré-généré) |
| **MCP** | Model Context Protocol - Permet à Claude d'accéder à des outils externes |
| **SubAgent** | Agent IA spécialisé invoqué pour des tâches spécifiques (ex: Code Reviewer, Test Writer) |

---

### Références et Inspiration

**Sites analysés pour la structure et l'UX :**
- https://scaledagileframework.com/ - Structure de framework, navigation hiérarchique
- https://tailwindcss.com/docs - Documentation technique exemplaire, recherche performante
- https://stripe.com/docs - Expérience de navigation et design system

**Frameworks de référence :**
- SAFe (Scaled Agile Framework) - Modèle de présentation et exhaustivité
- Scrum.org - Simplicité et clarté du contenu
- LeSS (Large Scale Scrum) - Documentation concise et accessible

---


### Ressources Nécessaires

**Contenu :**
- ✅ Framework AIAD (8 chapitres en Markdown dans /framework/)
- ✅ Mode Opératoire (8 chapitres en Markdown dans /mode opératoire/)
- ✅ Annexes (45 fichiers en Markdown dans /annexes/, catégories A-I)
- ✅ Communication (1 fichier decideur.md dans /communication/)
- ✅ Référentiels de navigation (referentiel.md dans chaque dossier)
- ✅ Guides d'intention (intention.md, intention-annexes.md, intention_mode_operatoire.md)
- 🔲 Charte graphique et logo
- 🔲 Illustrations / diagrammes (Figma, Excalidraw)
- 🔲 Photos d'équipe (optionnel)


**Légal :**
- 🔲 Mentions légales
- 🔲 Politique de confidentialité (RGPD)
- 🔲 Conditions d'utilisation

---

### Structure du Contenu

**Framework AIAD (8 chapitres) :**
- 01-preambule.md : Introduction au framework, contexte, objectifs
- 02-vision-philosophie.md : Principes fondateurs, valeurs, approche AIAD
- 03-ecosysteme.md : Rôles (PM, PE, TL, QA), interactions, responsabilités
- 04-artefacts.md : PRD, SPECS, ARCHITECTURE, AGENT-GUIDE, DoOD/DoOuD
- 05-boucles-iteratives.md : PLANIFIER, IMPLÉMENTER, VALIDER, INTÉGRER
- 06-synchronisations.md : Rituels d'équipe, alignement, communication
- 07-metriques.md : KPIs, mesure de performance, dashboards
- 08-annexes.md : Index vers les annexes détaillées

**Mode Opératoire (8 chapitres) :**
- 00-preambule.md : Préambule (glossaire, RACI, vue d'ensemble)
- 01-initialisation.md : Phase d'initialisation (Démarrage projet)
- 02-planification.md : Phase de planification (PLANIFIER)
- 03-developpement.md : Phase de développement (IMPLÉMENTER)
- 04-validation.md : Phase de validation (VALIDER)
- 05-deploiement.md : Phase de déploiement (INTÉGRER)
- 06-rituels-amelioration.md : Rituels et amélioration continue
- 07-annexes.md : Annexes et références

**Annexes (45 fichiers, 9 catégories) :**
- **Catégorie A** : Templates Fondateurs (6 fichiers)
  - A1-prd.md, A2-architecture.md, A3-agent-guide.md, A4-specs.md, A5-dood.md, A6-dooud.md
- **Catégorie B** : Rôles Détaillés (6 fichiers)
  - B1-product-manager.md, B2-product-engineer.md, B3-qa-engineer.md, B4-tech-lead.md, B5-supporters.md, B6-agents-engineer.md
- **Catégorie C** : Boucles AIAD (5 fichiers)
  - C1-phase-initialisation.md, C2-boucle-planifier.md, C3-boucle-implementer.md, C4-boucle-valider.md, C5-boucle-integrer.md
- **Catégorie D** : Rituels (5 fichiers)
  - D1-alignment-strategique.md, D2-demo-feedback.md, D3-tech-review.md, D4-retrospective.md, D5-standup.md
- **Catégorie E** : Métriques et Dashboards (2 fichiers)
  - E1-exemples-dashboards.md, E2-revue-trimestrielle.md
- **Catégorie F** : Agents Spécialisés (7 fichiers)
  - F1-agent-security.md, F2-agent-quality.md, F3-agent-architecture.md, F4-agent-documentation.md, F5-agent-performance.md, F6-agent-code-review.md, F7-autres-agents.md
- **Catégorie G** : Configuration Technique (6 fichiers)
  - G1-configuration-environnement.md, G2-installation-agents-ia.md, G3-setup-ci-cd.md, G4-configuration-permissions.md, G5-installation-mcp-plugins.md, G6-creation-subagents.md
- **Catégorie H** : Bonnes Pratiques (5 fichiers)
  - H1-prompts-efficaces.md, H2-patterns-code.md, H3-anti-patterns.md, H4-cas-usage-specs.md, H5-notes-apprentissage.md
- **Catégorie I** : Ressources (4 fichiers)
  - I1-troubleshooting.md, I2-glossaire.md, I3-bibliographie.md, I4-communaute.md

**Communication (1 fichier) :**
- decideur.md : Argumentaire pour convaincre les décideurs d'adopter AIAD
- *À créer* : tech-lead.md, developpeurs.md, product-managers.md

---

### Contact et Validation

**Pour toute question sur ce PRD :**
- Product Manager : Steeve Evers
- Tech Lead : Steeve Evers
- Date de validation : 16/01/2026


---

**Document vivant - Version 1.1**
*Ce PRD sera mis à jour au fil de l'avancement du projet et des apprentissages.*

**Changelog :**
- v1.1 (21 janvier 2026) : Mise à jour structure contenu selon référentiels réels
  - Framework : 8 chapitres (au lieu de 4 parties)
  - Mode Opératoire : 8 chapitres (au lieu de 7 parties)
  - Ajout des 45 Annexes organisées en 9 catégories (A-I)
  - Ajout section Communication (decideur.md)
  - Nouvelle US-015b : Naviguer dans les Annexes
  - Mise à jour des références aux annexes dans toutes les US
  - Mise à jour des livrables des sprints
- v1.0 (16 janvier 2026) : Version initiale validée pour implémentation