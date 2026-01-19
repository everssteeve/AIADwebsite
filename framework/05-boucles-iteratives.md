# Les Boucles Itératives Continues

## Philosophie : Au-delà des Cérémonies

**La rigidité tue l'adaptabilité.**

AIAD abandonne complètement les Sprints Scrum au profit de **boucles itératives fluides**.

**Caractéristiques des boucles :**
- **Flux continu** : Dès qu'une fonctionnalité est intégrée, la prochaine démarre
- **Durée variable** : Une fonctionnalité peut prendre 2h ou 3 jours selon sa complexité
- **Priorité dynamique** : La prochaine fonctionnalité peut changer en fonction du feedback
- **Focus absolu** : Une seule fonctionnalité à la fois par PE (pas de multitasking)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   PLANIFIER → IMPLÉMENTER → VALIDER → INTÉGRER          │
│       ↑                                          ↓        │
│       └──────────────────────────────────────────        │
│                                                          │
│   Feedback utilisateur → Ajustement priorités           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Phase d'Initialisation (Une fois par produit)

**Durée totale :** 4-7 jours
**Fréquence :** Une seule fois au début (ou à chaque pivot majeur)

**Objectifs globaux :**
1. Établir la vision produit et le Product Goal initial
2. Définir l'architecture technique et le stack
3. Configurer l'environnement de développement
4. Initialiser l'écosystème d'agents IA
5. Préparer la première fonctionnalité

**Livrables attendus :**
- [ ] Product Vision et Product Goal documentés
- [ ] PRD initial créé
- [ ] Document ARCHITECTURE complet
- [ ] AGENT-GUIDE (CLAUDE.md) complet
- [ ] Definition of Output Done (DoOD) défini
- [ ] Definition of Outcome Done (DoOuD) défini
- [ ] Repository Git initialisé avec CI/CD
- [ ] Environnements staging/production créés
- [ ] Agents spécialisés sélectionnés et configurés
- [ ] Première SPEC prête pour implémentation

> 📖 *Voir Annexe C.1 pour le process détaillé jour par jour*

---

## Les 4 Boucles Continues

### Boucle 1 : PLANIFIER LA FONCTIONNALITÉ

**Déclencheur :** Fonctionnalité précédente intégrée OU nouvelle priorité critique

**Participants :** PM + PE (+ QA si complexe, + Tech Lead si impacte architecture)

**Durée :** 30 min - 4h (selon complexité)

**Objectif :** Transformer une intention métier en SPEC actionnable pour les agents IA

**Étapes clés :**
1. PM présente la prochaine priorité (contexte, user story, outcomes)
2. PE questionne et clarifie (cas limites, dépendances, risques, complexité)
3. Décision de décomposition (simple/complexe/très complexe)
4. Rédaction collaborative de la SPEC
5. Validation finale

**Livrables :**
- [ ] SPEC détaillée dans `/docs/specs/SPEC-XXX.md`
- [ ] Outcome Criteria définis (si feature majeure)
- [ ] Compréhension partagée de l'objectif

**Indicateur de qualité :**
- ✅ Un agent IA peut comprendre et implémenter à partir de cette SPEC seule
- ✅ Les tests attendus sont clairs et actionnables
- ✅ Tous les cas limites sont documentés

> 📖 *Voir Annexe C.2 pour le process détaillé et exemples*

---

### Boucle 2 : IMPLÉMENTER

**Déclencheur :** SPEC validée et prête

**Participants :** PE + Agents IA (+ Agents Engineer si problème)

**Durée :** Variable (2h - 3 jours)

**Objectif :** Transformer la SPEC en code fonctionnel de qualité professionnelle

**Étapes clés :**
1. Préparation du contexte (/clear, lecture SPEC/PRD/ARCHITECTURE/AGENT-GUIDE)
2. Orchestration de l'implémentation (prompt structuré, validation du plan)
3. Validation continue (compilation, linting, conformité SPEC, types)
4. Génération des tests (Agent Quality, vérification couverture)
5. Corrections itératives (max 3 itérations)
6. Finalisation (tous tests passent, DoOD respecté, commit local)

**Livrables :**
- [ ] Code fonctionnel respectant le Definition of Output Done
- [ ] Tests automatisés passant (couverture >80%)
- [ ] Documentation mise à jour si nécessaire
- [ ] Commit prêt (pas encore poussé)

**Indicateurs de qualité :**
- ✅ First-time success >70%
- ✅ Ratio code généré / manuel : >80/20
- ✅ Couverture de tests : >80% backend, >70% frontend
- ✅ Aucun warning linter

**Pratiques clés d'orchestration :**
1. Contexte optimal : Toujours référencer @SPEC, @CLAUDE.md, @ARCHITECTURE.md
2. Validation du plan : Demander le plan AVANT de coder
3. Itération progressive : Implémenter par morceaux si complexe
4. Utilisation agents spécialisés : Quality, Security, Architecture
5. Mise à jour AGENT-GUIDE : Documenter learnings au fil de l'eau

> 📖 *Voir Annexe C.3 pour le workflow détaillé et prompt patterns*

---

### Boucle 3 : VALIDER

**Déclencheur :** Code implémenté et tests passent localement

**Participants :** QA + PE (+ PM si feature critique)

**Durée :** 1h - 4h (selon criticité)

**Objectif :** S'assurer que la fonctionnalité répond aux attentes métier ET aux standards de qualité

**Étapes clés :**
1. Validation Technique (PE) : Tests CI, couverture, linting, DoOD
2. Validation Fonctionnelle (QA) : Deploy test, tests fonctionnels, acceptance criteria
3. Validation Utilisabilité (QA + PM) : Interface, UX, accessibilité, performance
4. Validation Agents Spécialisés : Security, Architecture, Quality, Performance
5. Validation Métier (PM si majeure) : Démo, vérification intention, outcomes
6. Décision : VALIDÉ / CORRECTIONS MINEURES / REJET

**Livrables :**
- [ ] Rapport de validation QA
- [ ] Liste de corrections mineures (si applicable)
- [ ] Validation PM (si feature majeure)
- [ ] Feu vert pour intégration

**Indicateurs de qualité :**
- ✅ Taux de validation au premier essai : >70%
- ✅ Temps moyen de validation : <2h
- ✅ Bugs critiques détectés : 0
- ✅ Bugs mineurs : <3 par feature

> 📖 *Voir Annexe C.4 pour le template de rapport QA et process détaillé*

---

### Boucle 4 : INTÉGRER & SAUVEGARDER

**Déclencheur :** Validation OK (tous les feux verts)

**Participants :** PE (+ DevOps si problème de déploiement)

**Durée :** 30min - 2h

**Objectif :** Intégrer le code dans la branche principale, déployer, et préparer la prochaine itération

**Étapes clés :**
1. Revue de Code (self ou peer selon criticité)
2. Préparation au Merge (pull main, résolution conflits, tests)
3. Push et Merge (PR, CI/CD, auto-merge ou manuel)
4. Déploiement (auto-deploy staging, smoke tests, release production)
5. Vérification Post-Déploiement (monitoring, logs, métriques)
6. Documentation et Traçabilité (commit structuré, CHANGELOG, tag)
7. Préparation Prochaine Itération (/clear, update AGENT-GUIDE, fermeture ticket)

**Livrables :**
- [ ] Code mergé dans branche principale
- [ ] Déployé en staging (minimum)
- [ ] Idéalement : déployé en production (livraison continue)
- [ ] CHANGELOG mis à jour (si release)
- [ ] Contexte agent nettoyé
- [ ] AGENT-GUIDE mis à jour (si learnings)

**Stratégies de Déploiement :**

| Stratégie | Quand | Risque | Vitesse feedback |
|-----------|-------|--------|------------------|
| **Continuous Deployment** | Features non-critiques | Bas | Maximum |
| **Staged Rollout** | Features majeures | Moyen | Rapide |
| **Feature Flags** | Expérimentales, A/B | Très bas | Maximum |
| **Manual Release** | Critiques, compliance | Très bas | Lent |

**Recommandation AIAD :** Viser Continuous Deployment avec Feature Flags.

**Indicateurs de qualité :**
- ✅ Temps merge à production : <1h (idéalement <15min)
- ✅ Taux de rollback : <5%
- ✅ Downtime lors déploiements : 0
- ✅ MTTR : <15min

> 📖 *Voir Annexe C.5 pour Conventional Commits et stratégies de déploiement*
