# Les Boucles Itératives

## Pourquoi lire cette section ?

Cette section décrit le cycle de travail quotidien d'une équipe AIAD. Sans ce rythme fluide, les équipes retombent dans les cérémonies rigides ou le chaos complet. Les boucles itératives sont le moteur qui transforme les intentions en valeur livrée.

**Temps de lecture : 12 minutes**

---

## Le principe fondamental

**Les boucles AIAD ne sont pas des Sprints. Ce sont des cycles naturels de création de valeur.**

### Ce que cela signifie concrètement

| Approche Sprint | Approche Boucles |
|-----------------|------------------|
| Durée fixe (2 semaines) | Durée variable (2h à 3 jours) |
| Planification batch | Planification au fil de l'eau |
| Engagement de scope | Engagement de qualité |
| Vélocité mesurée en points | Valeur mesurée en outcomes |

### Les quatre caractéristiques d'une boucle

| Caractéristique | Description |
|-----------------|-------------|
| **Flux continu** | Dès qu'une fonctionnalité est intégrée, la prochaine démarre |
| **Durée variable** | La complexité dicte la durée, pas le calendrier |
| **Priorité dynamique** | Le feedback peut réorienter la prochaine fonctionnalité |
| **Focus absolu** | Une seule fonctionnalité à la fois par PE |

**L'important n'est pas de suivre un calendrier, mais de livrer de la valeur en continu.**

---

## La phase d'initialisation

### Essence

Poser les fondations avant de construire. Cette phase n'a lieu qu'une fois par produit (ou à chaque pivot majeur).

### Pourquoi cette phase existe

Sans initialisation structurée, les équipes démarrent dans le flou. Les agents IA génèrent du code sans contexte, l'architecture émerge par accident, et la dette technique s'accumule dès le premier jour.

### Ce que produit l'initialisation

| Livrable | Responsable |
|----------|-------------|
| Vision produit et Product Goal | PM |
| PRD initial | PM |
| Document ARCHITECTURE | Tech Lead |
| AGENT-GUIDE | AE + PE |
| Definitions of Done (DoOD, DoOuD) | Équipe |
| Repository avec CI/CD | PE |
| Première SPEC prête | PM + PE |

### Comment savoir si c'est réussi

| Indicateur | Cible |
|------------|-------|
| L'équipe peut démarrer l'implémentation | Jour 5-7 |
| Tous les artefacts essentiels existent | 100% |
| Premier commit possible | Fin de phase |

**Anti-pattern** : L'initialisation qui s'éternise pendant des semaines, ou le démarrage précipité sans artefacts.

> *Voir Annexe C.1 pour le process jour par jour*

---

## Les quatre boucles

### Boucle 1 : Planifier

**Essence** : Transformer une intention métier en SPEC que les agents IA peuvent implémenter.

**Pourquoi cette boucle existe** : Sans planification explicite, le PE interprète l'intention du PM. Cette interprétation diverge. Le code livré ne correspond pas au besoin.

**Comment ça se passe :**

| Étape | Action |
|-------|--------|
| 1 | PM présente la prochaine priorité |
| 2 | PE questionne et clarifie |
| 3 | Décision de décomposition |
| 4 | Rédaction collaborative de la SPEC |
| 5 | Validation finale |

**Ce qui déclenche cette boucle** : Fonctionnalité précédente intégrée ou nouvelle priorité critique.

**Ce que produit cette boucle :**

- SPEC détaillée prête pour implémentation
- Outcome Criteria définis (si feature majeure)
- Compréhension partagée entre PM et PE

**Comment savoir si c'est réussi :**

| Indicateur | Cible |
|------------|-------|
| Agent IA peut implémenter sans clarification | Oui |
| Tests attendus sont explicites | 100% |
| Cas limites documentés | Tous |

**Anti-pattern** : La planification marathon de 4 heures, ou la SPEC de 3 lignes type "Ajouter le login".

> *Voir Annexe C.2 pour le process détaillé*

---

### Boucle 2 : Implémenter

**Essence** : Orchestrer les agents IA pour transformer la SPEC en code fonctionnel.

**Pourquoi cette boucle existe** : C'est là que la valeur se matérialise. Un PE qui orchestre bien produit plus qu'une équipe traditionnelle de cinq développeurs.

**Comment ça se passe :**

| Étape | Action |
|-------|--------|
| 1 | Préparer le contexte (SPEC, ARCHITECTURE, AGENT-GUIDE) |
| 2 | Demander le plan à l'agent avant de coder |
| 3 | Valider en continu (compilation, linting, types) |
| 4 | Générer les tests |
| 5 | Itérer si nécessaire (max 3 fois) |
| 6 | Finaliser (tous tests passent, commit local) |

**Ce qui déclenche cette boucle** : SPEC validée et prête.

**Ce que produit cette boucle :**

- Code fonctionnel respectant le DoOD
- Tests automatisés passants
- Commit prêt (pas encore poussé)

**Les pratiques qui font la différence :**

| Pratique | Impact |
|----------|--------|
| Toujours référencer les artefacts | Contexte optimal pour l'agent |
| Valider le plan avant le code | Évite les impasses |
| Implémenter par morceaux si complexe | Contrôle progressif |
| Documenter les learnings au fil de l'eau | AGENT-GUIDE toujours à jour |

**Comment savoir si c'est réussi :**

| Indicateur | Cible |
|------------|-------|
| Code correct du premier coup | >70% |
| Ratio code généré / manuel | >80/20 |
| Couverture de tests | >80% backend, >70% frontend |

**Anti-pattern** : Le PE qui corrige 80% du code généré, ou qui génère sans contexte et espère que ça marche.

> *Voir Annexe C.3 pour les prompt patterns*

---

### Boucle 3 : Valider

**Essence** : S'assurer que le code répond aux attentes métier ET aux standards de qualité.

**Pourquoi cette boucle existe** : Le code qui compile n'est pas forcément le code qui fonctionne. Le code qui fonctionne n'est pas forcément le code qui apporte de la valeur.

**Comment ça se passe :**

| Étape | Responsable | Focus |
|-------|-------------|-------|
| 1. Validation technique | PE | CI, couverture, linting, DoOD |
| 2. Validation fonctionnelle | QA | Tests, acceptance criteria |
| 3. Validation utilisabilité | QA + PM | UX, accessibilité, performance |
| 4. Validation métier | PM | Intention respectée, outcomes |
| 5. Décision | Équipe | VALIDÉ / CORRECTIONS / REJET |

**Ce qui déclenche cette boucle** : Code implémenté et tests passent localement.

**Ce que produit cette boucle :**

- Rapport de validation
- Liste de corrections mineures (si applicable)
- Feu vert pour intégration

**Comment savoir si c'est réussi :**

| Indicateur | Cible |
|------------|-------|
| Validation au premier essai | >70% |
| Bugs critiques détectés | 0 |
| Bugs mineurs par feature | <3 |

**Anti-pattern** : La validation bâclée "ça a l'air de marcher", ou le ping-pong interminable entre QA et PE.

> *Voir Annexe C.4 pour le template de rapport QA*

---

### Boucle 4 : Intégrer

**Essence** : Mettre le code en production et préparer la prochaine itération.

**Pourquoi cette boucle existe** : Le code non déployé n'a aucune valeur. Plus le délai entre merge et production est long, plus le feedback est tardif.

**Comment ça se passe :**

| Étape | Action |
|-------|--------|
| 1 | Revue de code (self ou peer selon criticité) |
| 2 | Pull main, résolution conflits, tests |
| 3 | Push, PR, CI/CD |
| 4 | Déploiement staging puis production |
| 5 | Vérification post-déploiement |
| 6 | Mise à jour CHANGELOG et AGENT-GUIDE |
| 7 | Nettoyage contexte, fermeture ticket |

**Ce qui déclenche cette boucle** : Validation OK.

**Ce que produit cette boucle :**

- Code en production (idéalement)
- Documentation mise à jour
- Contexte prêt pour la prochaine fonctionnalité

**Stratégies de déploiement :**

| Stratégie | Quand l'utiliser |
|-----------|------------------|
| Continuous Deployment | Features non-critiques |
| Staged Rollout | Features majeures |
| Feature Flags | Expérimentales, A/B tests |
| Manual Release | Critiques, compliance |

**Recommandation** : Viser Continuous Deployment avec Feature Flags.

**Comment savoir si c'est réussi :**

| Indicateur | Cible |
|------------|-------|
| Temps merge à production | <1h (idéal <15min) |
| Taux de rollback | <5% |
| Downtime lors déploiements | 0 |

**Anti-pattern** : Le code qui attend des jours avant d'être mergé, ou le déploiement manuel stressant du vendredi soir.

> *Voir Annexe C.5 pour Conventional Commits et stratégies de déploiement*

---

## Erreurs fréquentes

### "On planifie tout en début de semaine"

**Le problème** : Retour au mode batch. Les priorités changent mais le plan est figé.

**La réalité** : Planifier juste avant d'implémenter. Le contexte est frais, les décisions sont pertinentes.

### "L'implémentation prend toujours plus longtemps que prévu"

**Le problème** : SPECs insuffisantes ou contexte agent mal préparé.

**La réalité** : Investir 30 minutes de plus en planification économise des heures en implémentation.

### "On valide à la fin, juste avant la release"

**Le problème** : Les bugs s'accumulent, la validation devient un goulot d'étranglement.

**La réalité** : Valider chaque fonctionnalité immédiatement. Le feedback rapide permet de corriger vite.

---

## En résumé

| Boucle | Question centrale | Durée typique |
|--------|-------------------|---------------|
| **Planifier** | Que construire et pourquoi ? | 30min - 4h |
| **Implémenter** | Comment le construire ? | 2h - 3 jours |
| **Valider** | Est-ce que ça fonctionne ? | 1h - 4h |
| **Intégrer** | Est-ce en production ? | 30min - 2h |

---

*Prochaine section : [Les Synchronisations](06-synchronisations.md)*
