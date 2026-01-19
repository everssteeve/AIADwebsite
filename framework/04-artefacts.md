# Les Artefacts

## Pourquoi lire cette section ?

Cette section définit les documents essentiels qui structurent le travail d'une équipe AIAD. Sans ces artefacts, le contexte se perd, les agents IA produisent du code générique, et l'alignement entre intention et implémentation se dégrade.

**Temps de lecture : 15 minutes**

---

## Le principe fondamental

**Les artefacts AIAD ne sont pas de la bureaucratie. Ce sont des outils de pensée et de communication.**

### Ce que cela signifie concrètement

| Approche traditionnelle | Approche AIAD |
|------------------------|---------------|
| Documentation exhaustive | Documentation minimale et actionnable |
| Écrire pour archiver | Écrire pour aligner et agir |
| Document figé une fois validé | Document vivant qui évolue |
| Rédigé par un rôle, lu par d'autres | Co-créé par l'équipe |

### Les quatre critères d'un bon artefact

| Critère | Question de validation |
|---------|------------------------|
| **Actionnable** | Peut-on agir à partir de ce document ? |
| **Vivant** | Évolue-t-il avec la compréhension ? |
| **Minimal** | Contient-il juste assez, pas plus ? |
| **Collaboratif** | A-t-il été co-créé, pas dicté ? |

**L'important n'est pas d'avoir des documents parfaits, mais des documents utiles.**

---

## Les quatre artefacts essentiels

### 1. PRD — Product Requirement Document

**Essence** : Clarifier POURQUOI et QUOI construire avant de se poser la question du COMMENT.

**Pourquoi cet artefact existe** : Sans PRD, les équipes construisent des fonctionnalités techniquement parfaites que personne n'a demandées, ou résolvent des problèmes mal compris.

**Ce que contient le PRD :**

| Section | Contenu |
|---------|---------|
| Contexte et Problème | Quel problème ? Pour qui ? Pourquoi maintenant ? |
| Outcome Criteria | Métriques mesurables de succès |
| Personas et Use Cases | Profils utilisateurs et scénarios d'usage |
| Hors Périmètre | Ce que nous NE faisons PAS (volontairement) |
| Trade-offs et Décisions | Décisions majeures et alternatives écartées |
| Dépendances et Risques | Prérequis et risques identifiés |

**Bonnes pratiques :**

1. **Commencer par le problème** : Pas par la solution
2. **Outcome-driven** : Définir les critères de succès avant de construire
3. **Collaboratif** : Rédiger avec l'équipe, pas pour l'équipe
4. **Itératif** : Le PRD évolue avec la compréhension
5. **Visuel** : Intégrer wireframes et flows quand pertinent

**Comment savoir si ça fonctionne :**

| Indicateur | Cible |
|------------|-------|
| L'équipe comprend le "pourquoi" | 100% des membres |
| Changements de scope en cours de dev | <20% |
| Outcome criteria atteints | >70% |

**Anti-pattern** : Le PRD fleuve de 50 pages que personne ne lit, ou le PRD vague type "Améliorer l'expérience utilisateur".

> 📖 *Voir Annexe A.1 pour le template complet et exemples*

---

### 2. ARCHITECTURE — Standards Techniques

**Essence** : Définir les standards techniques que les agents IA et les PE doivent respecter.

**Pourquoi cet artefact existe** : Sans document d'architecture, chaque fonctionnalité est implémentée différemment, les agents IA génèrent du code incohérent, et la dette technique s'accumule silencieusement.

**Ce que contient le document ARCHITECTURE :**

| Section | Contenu |
|---------|---------|
| Principes Architecturaux | 5 principes non-négociables |
| Vue d'Ensemble | Architecture high-level avec justification |
| Stack Technique | Technologies, versions, justifications |
| Structure du Projet | Organisation dossiers et modules |
| Conventions de Code | Nommage, formatage, imports |
| Patterns et Bonnes Pratiques | Design patterns avec exemples |
| Sécurité | Principes et pratiques obligatoires |
| Performance | Budgets et stratégies |
| ADR | Architecture Decision Records |

**Bonnes pratiques :**

1. **Évolutif** : L'architecture évolue avec le produit
2. **Justifié** : Chaque choix a une rationale explicite
3. **Pragmatique** : Pas d'over-engineering, YAGNI
4. **Communicable** : Diagrammes visuels, pas que du texte
5. **Actionnable** : Les PE peuvent s'y référer quotidiennement

**Comment savoir si ça fonctionne :**

| Indicateur | Cible |
|------------|-------|
| Décisions architecturales revisitées | <10% par an |
| Code généré conforme aux standards | >90% |
| Temps d'onboarding technique | <1 semaine |

**Anti-pattern** : L'architecture "ivory tower" décidée sans connaître la réalité du terrain, ou le CV-driven development qui choisit des technos pour impressionner.

> 📖 *Voir Annexe A.2 pour le template complet et exemples d'ADR*

---

### 3. AGENT-GUIDE — Contexte pour les Agents IA

**Essence** : Fournir le contexte optimal aux agents IA pour qu'ils génèrent du code de qualité aligné avec les standards de l'équipe.

**Pourquoi cet artefact existe** : Un agent sans contexte génère du code générique. Un agent avec un contexte riche génère du code professionnel adapté au projet.

**Ce que contient l'AGENT-GUIDE :**

| Section | Contenu |
|---------|---------|
| Identité du Projet | Nom, description, domaine métier, mission |
| Documentation de Référence | Liens vers PRD, ARCHITECTURE, SPECs |
| Stack Technique | Résumé des technologies utilisées |
| Règles Absolues | TOUJOURS (obligations) et JAMAIS (interdictions) |
| Conventions de Code | Nommage, imports, structure composants |
| Vocabulaire Métier | Termes spécifiques au domaine |
| Patterns de Développement | Approches favorisées avec exemples |
| Anti-Patterns | Ce qu'il faut éviter avec exemples |
| Notes d'Apprentissage | Learnings mis à jour continuellement |

**Bonnes pratiques :**

1. **Concret** : Exemples de code, pas juste principes abstraits
2. **Évolutif** : Section "Notes d'Apprentissage" mise à jour continuellement
3. **Contextuel** : Vocabulaire métier spécifique au domaine
4. **Équilibré** : Ne pas tomber dans l'excès (100+ règles = aucune règle)
5. **Vivant** : Review mensuelle minimum

**Comment savoir si ça fonctionne :**

| Indicateur | Cible |
|------------|-------|
| First-time success rate du code généré | >70% |
| Conformité aux conventions | >90% |
| Temps de correction post-génération | <20% du temps total |

**Anti-pattern** : Le guide encyclopédique de 50 pages jamais mis à jour, ou le guide vague type "Écrire du bon code".

> 📖 *Voir Annexe A.3 pour le template complet avec exemples de règles*

---

### 4. SPECS — Spécifications Techniques

**Essence** : Faire le pont entre l'intention métier (PRD) et l'implémentation concrète par les agents IA.

**Pourquoi cet artefact existe** : Une SPEC de qualité permet à un agent IA de générer 80%+ du code correct du premier coup. Sans SPEC, le PE passe plus de temps à corriger qu'à orchestrer.

**Ce que contient une SPEC :**

| Section | Contenu |
|---------|---------|
| Contexte | Référence User Story, objectif, outcome attendu |
| Périmètre | In Scope / Out of Scope explicites |
| Fichiers Impactés | À créer / À modifier |
| Interface Technique | API endpoints, types, schémas DB |
| Comportement Détaillé | Flow nominal et cas limites |
| Validation Rules | Règles de validation avec schémas |
| Business Rules | Règles métier à appliquer |
| Tests Attendus | Scénarios de test à implémenter |
| Exemples d'Usage | Exemples concrets requête/réponse |
| Definition of Done | Critères de "Done" |

**Les quatre critères d'une SPEC de qualité :**

| Critère | Bon Exemple | Mauvais Exemple |
|---------|-------------|-----------------|
| **Atomicité** | "Implémenter création tâche via API" | "Faire module gestion de tâches" |
| **Précision** | "Retourner 400 si title vide ou >200 chars" | "Gérer les erreurs" |
| **Testabilité** | "Accepter 'test@example.com', rejeter 'invalid'" | "Tester la validation" |
| **Complétude** | Inclut types, validation, edge cases, tests | "Créer endpoint POST" |

**Comment savoir si ça fonctionne :**

| Indicateur | Cible |
|------------|-------|
| Code généré correct du premier coup | >80% |
| Temps de rédaction SPEC vs. correction code | Ratio >1:3 |
| Questions de clarification pendant l'implémentation | <2 par SPEC |

**Anti-pattern** : La SPEC tentaculaire avec 20 fonctionnalités, ou la SPEC vague type "Améliorer la performance".

> 📖 *Voir Annexe A.4 pour le template complet et exemples de SPECs*

---

## Les Definitions of Done

### Definition of Output Done (DoOD)

**Essence** : Standard de qualité uniforme pour qu'un incrément soit considéré comme "Done" et livrable.

**Pourquoi cette définition existe** : Sans DoOD partagée, "Done" signifie quelque chose de différent pour chaque membre de l'équipe. Le code "fini" revient constamment avec des bugs ou des manques.

**Les catégories de critères :**

| Catégorie | Critères |
|-----------|----------|
| **Techniques** | Conventions respectées, linting OK, types complets, tests passent |
| **Sécurité** | Scan passé, pas de secrets, validation inputs |
| **Performance** | Budgets respectés, queries optimisées |
| **Fonctionnels** | Spec respectée, acceptance criteria validés |
| **Déploiement** | Build réussit, déployé staging, smoke tests OK |
| **Review** | Code review faite, QA validé |

**Ce qui N'est PAS "Done" :**

| Affirmation | Pourquoi ce n'est pas Done |
|-------------|---------------------------|
| "Le code compile" | Compiler ≠ fonctionner |
| "Ça marche sur ma machine" | L'environnement de prod est différent |
| "Les tests passent localement" | CI peut révéler d'autres problèmes |
| "Done à 90%" | 90% = pas done |
| "On testera plus tard" | Plus tard = jamais |

**Principe non-négociable** : Une fonctionnalité n'est "Done" que si TOUS les critères sont satisfaits. Pas d'exception.

> 📖 *Voir Annexe A.5 pour la checklist complète*

---

### Definition of Outcome Done (DoOuD)

**Essence** : Mesurer si la valeur attendue a été réalisée pour les stakeholders.

**Pourquoi cette définition existe** : L'output (code livré) n'est que le moyen. L'outcome (valeur réalisée) est le but. Une fonctionnalité livrée mais non adoptée n'est pas un succès.

**Les catégories de métriques :**

| Catégorie | Exemples de métriques |
|-----------|----------------------|
| **User Outcomes** | NPS, CSAT, adoption, time to value, retention |
| **Business Outcomes** | MRR, conversions, efficacité opérationnelle |
| **Learning Outcomes** | Hypothèses validées/invalidées, insights découverts |

**Le process de mesure :**

| Étape | Action |
|-------|--------|
| 1. Définir | Outcomes AVANT de construire |
| 2. Mesurer | À des jalons définis (1 sem, 1 mois, 3 mois) |
| 3. Comparer | Attendu vs. réalisé |
| 4. Décider | Continuer / Itérer / Sunset |
| 5. Documenter | Learnings pour l'équipe |

**Comment savoir si ça fonctionne :**

| Indicateur | Cible |
|------------|-------|
| Fonctionnalités avec outcomes mesurés | 100% |
| Outcomes atteignant leurs cibles | >70% |
| Décisions basées sur données vs. intuition | >80% |

> 📖 *Voir Annexe A.6 pour le template complet et exemples de métriques*

---

## Erreurs fréquentes

### "On n'a pas le temps de rédiger des SPECs"

**Le problème** : Le PE passe 80% de son temps à corriger le code généré au lieu de 20%.

**La réalité** : Une heure de SPEC bien rédigée économise plusieurs heures de correction.

### "Notre AGENT-GUIDE fait 100 pages"

**Le problème** : L'agent ignore la plupart des règles car le contexte est trop large.

**La réalité** : Un guide concis et priorisé est plus efficace qu'une encyclopédie.

### "Le PRD est validé, on ne le touche plus"

**Le problème** : La compréhension évolue, mais le document reste figé. L'équipe construit sur des hypothèses obsolètes.

**La réalité** : Le PRD est un document vivant. Il évolue avec les learnings.

---

## En résumé

| Artefact | Question centrale | Responsable principal |
|----------|-------------------|----------------------|
| **PRD** | Pourquoi et quoi construire ? | PM |
| **ARCHITECTURE** | Quels standards techniques ? | Tech Lead |
| **AGENT-GUIDE** | Quel contexte pour les agents ? | AE + PE |
| **SPECS** | Comment implémenter précisément ? | PE |
| **DoOD** | L'output est-il vraiment "Done" ? | QA + PE |
| **DoOuD** | L'outcome est-il atteint ? | PM |

---

*Prochaine section : [Les Boucles Itératives](05-boucles.md)*
