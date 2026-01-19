# Les Artefacts Vivants

## Principe Cardinal

Les artefacts AIAD ne sont pas de la bureaucratie. Ce sont des **outils de pensée et de communication** qui créent de l'alignement et réduisent l'ambiguïté.

**Un bon artefact AIAD est :**
- ✅ **Actionnable** : On peut agir à partir de lui
- ✅ **Vivant** : Il évolue avec la compréhension
- ✅ **Minimal** : Juste assez, pas plus
- ✅ **Collaboratif** : Co-créé, pas dicté

## Les 4 Artefacts Essentiels

### 1. Product Requirement Document (PRD)

**Objectif :** Clarifier POURQUOI et QUOI construire avant de se poser la question du COMMENT.

**Sections clés :**
- **Contexte et Problème** : Quel problème ? Pour qui ? Pourquoi maintenant ?
- **Success Criteria (Outcome Criteria)** : Métriques mesurables et observables
- **Personas et Use Cases** : Profils utilisateurs et scénarios d'usage
- **Hors Périmètre** : Ce que nous NE faisons PAS (volontairement)
- **Trade-offs et Décisions** : Décisions majeures prises et alternatives écartées
- **Dépendances et Risques** : Prérequis et risques identifiés

**Bonnes pratiques :**
1. Commencer par le problème, pas par la solution
2. Outcome-driven : Définir success criteria mesurables avant de construire
3. Collaboratif : Rédiger avec l'équipe, pas pour l'équipe
4. Itératif : Le PRD évolue avec la compréhension
5. Visuel : Intégrer wireframes, flows quand pertinent

**Anti-patterns :**
- 🚫 PRD fleuve de 50 pages que personne ne lira
- 🚫 PRD dictatorial avec solution imposée
- 🚫 PRD vague : "Améliorer l'expérience utilisateur"
- 🚫 PRD statique jamais mis à jour

> 📖 *Voir Annexe A.1 pour le template complet et exemples*

---

### 2. Document ARCHITECTURE

**Objectif :** Définir les standards techniques que les agents IA et les PE doivent respecter.

**Sections clés :**
- **Principes Architecturaux** : 5 principes non-négociables
- **Vue d'Ensemble** : Architecture high-level avec justification
- **Stack Technique** : Technologies, versions, justifications
- **Structure du Projet** : Organisation dossiers et modules
- **Conventions de Code** : Nommage, formatage, imports
- **Patterns et Bonnes Pratiques** : Design patterns avec exemples
- **Sécurité** : Principes et pratiques obligatoires
- **Performance** : Budgets de performance et stratégies
- **Qualité et Dette Technique** : Definition of Output Done, gestion dette
- **ADR (Architecture Decision Records)** : Décisions majeures documentées

**Bonnes pratiques :**
1. Évolutif, pas figé : L'architecture évolue avec le produit
2. Justifié : Chaque choix a une rationale explicite
3. Pragmatique : Pas d'over-engineering, YAGNI
4. Communicable : Diagrammes visuels, pas que du texte
5. Actionnable : Les PE peuvent s'y référer quotidiennement

**Anti-patterns :**
- 🚫 Ivory tower architecture : Décider sans connaître la réalité
- 🚫 CV-driven development : Choisir des technos pour le CV
- 🚫 Documentation obsolète qui ne reflète pas la réalité
- 🚫 Complexité prématurée pour des problèmes hypothétiques

> 📖 *Voir Annexe A.2 pour le template complet et exemples d'ADR*

---

### 3. AGENT-GUIDE (ex. CLAUDE.md)

**Objectif :** Fournir le contexte optimal aux agents IA pour qu'ils génèrent du code de qualité aligné avec les standards de l'équipe.

**Principe cardinal :** Un agent sans contexte génère du code générique. Un agent avec un contexte riche génère du code professionnel.

**Sections clés :**
- **Identité du Projet** : Nom, description, domaine métier, mission
- **Documentation de Référence** : Liens vers PRD, ARCHITECTURE, SPECs
- **Stack Technique** : Résumé des technologies utilisées
- **Règles Absolues** : TOUJOURS (obligations) et JAMAIS (interdictions)
- **Conventions de Code** : Nommage, organisation imports, structure composants
- **Vocabulaire Métier** : Termes spécifiques au domaine avec définitions
- **Configuration des Agents Spécialisés** : Règles spécifiques par agent
- **Patterns de Développement** : Approches favorisées avec exemples
- **Anti-Patterns** : Ce qu'il faut éviter avec exemples
- **Notes d'Apprentissage** : Learnings mis à jour continuellement

**Bonnes pratiques :**
1. Concret et actionnable : Exemples de code, pas juste principes abstraits
2. Évolutif : Section "Notes d'Apprentissage" mise à jour continuellement
3. Contextuel : Vocabulaire métier spécifique au domaine
4. Équilibré : Ne pas tomber dans l'excès (100+ règles = aucune règle)
5. Vivant : Review mensuelle minimum pour synchroniser avec la réalité

**Anti-patterns :**
- 🚫 Guide encyclopédique de 50 pages que personne ne lit
- 🚫 Guide obsolète écrit au début puis jamais mis à jour
- 🚫 Guide vague : "Écrire du bon code" (pas actionnable)
- 🚫 Guide dictatorial avec trop de règles rigides

> 📖 *Voir Annexe A.3 pour le template complet avec exemples de règles*

---

### 4. Document SPECS (Spécifications Techniques)

**Objectif :** Bridge entre l'intention métier (PRD) et l'implémentation concrète par les agents IA.

**Principe cardinal :** Une SPEC de qualité permet à un agent IA de générer 80%+ du code correct du premier coup.

**Sections clés :**
- **Contexte** : Référence User Story, objectif, outcome attendu
- **Périmètre** : In Scope / Out of Scope explicites
- **Fichiers Impactés** : À créer / À modifier
- **Interface Technique** : API endpoints, types, schémas DB
- **Comportement Détaillé** : Flow nominal et cas limites
- **Validation Rules** : Règles de validation avec schémas
- **Business Rules** : Règles métier à appliquer
- **Tests Attendus** : Scénarios de test à implémenter
- **Exemples d'Usage** : Exemples concrets requête/réponse
- **Outcome Criteria** : Comment mesurer le succès (si applicable)
- **Dépendances** : Pré-requis et impacts downstream
- **Definition of Output Done Checklist** : Critères de "Done"

**Critères d'une SPEC de qualité :**

| Critère | Bon Exemple | Mauvais Exemple |
|---------|-------------|-----------------|
| **Atomicité** | "Implémenter création tâche via API" | "Faire module gestion de tâches" |
| **Précision** | "Retourner 400 si title vide ou >200 chars" | "Gérer les erreurs" |
| **Testabilité** | "Accepter 'test@example.com', rejeter 'invalid'" | "Tester la validation" |
| **Complétude** | Inclut types, validation, edge cases, tests | "Créer endpoint POST" |

**Anti-patterns :**
- 🚫 SPEC vague : "Améliorer la performance" (non actionnable)
- 🚫 SPEC tentaculaire : 20 fonctionnalités dans une SPEC
- 🚫 SPEC code : Écrire le code directement dans la SPEC
- 🚫 SPEC obsolète jamais mise à jour avec les learnings

> 📖 *Voir Annexe A.4 pour le template complet et exemples de SPECs*

---

## Definitions of Done

### Definition of Output Done (DoOD)

**Objectif :** Standard de qualité uniforme et non-négociable pour qu'un incrément soit considéré comme "Done" et livrable.

**Principe :** Une fonctionnalité n'est "Done" que si TOUS les critères sont satisfaits. Pas d'exception. Pas de "Done à 90%".

**Catégories de critères :**

**Critères Techniques :**
- Code Quality (conventions, linting, types, complexité, commentaires)
- Testing (couverture, tous tests passent, edge cases, pas de flaky tests)
- Security (scan passé, pas de secrets, validation inputs, gestion erreurs)
- Performance (budgets respectés, queries optimisées, monitoring)

**Critères Fonctionnels :**
- Conformité (spec respectée, acceptance criteria validés)
- Documentation (API, README, CHANGELOG)

**Critères de Déploiement :**
- CI/CD (build réussit, déployé staging, smoke tests, rollback plan)
- Review (code review, QA validation, PM validation si pertinent)

**Critères de Qualité Long-Terme :**
- Maintenabilité (pas de dette ou dette documentée, architecture cohérente)

**Ce qui N'est PAS "Done" :**
- ❌ "Le code compile"
- ❌ "Ça marche sur ma machine"
- ❌ "Les tests passent localement"
- ❌ "Done à 90%"
- ❌ "On testera/documentera plus tard"

> 📖 *Voir Annexe A.5 pour la checklist complète et exemples*

---

### Definition of Outcome Done (DoOuD)

**Objectif :** Définir comment mesurer si la valeur attendue a été réalisée pour les stakeholders.

**Principe :** L'output (code livré) n'est que le moyen. L'outcome (valeur réalisée) est le but.

**Catégories de métriques :**

**User Outcomes :**
- Satisfaction utilisateur (NPS, CSAT)
- Adoption fonctionnalité
- Time to Value
- Retention

**Business Outcomes :**
- Impact business (MRR, conversions, etc.)
- Efficacité opérationnelle
- Réduction coûts

**Learning Outcomes :**
- Hypothèses validées/invalidées
- Insights utilisateur découverts
- Learnings techniques

**Process de mesure :**
1. Définir outcomes AVANT de construire
2. Mesurer à des jalons définis (1 sem, 1 mois, 3 mois)
3. Comparer attendu vs. réalisé
4. Décider : Continuer / Itérer / Sunset
5. Documenter learnings

> 📖 *Voir Annexe A.6 pour le template complet et exemples de métriques*
