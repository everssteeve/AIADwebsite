# L'Écosystème AIAD

## Pourquoi lire cette section ?

Cette section définit qui fait quoi dans une équipe AIAD. Sans cette clarté, les responsabilités se chevauchent, les décisions traînent, et l'orchestration des agents IA reste sous-optimale.

**Temps de lecture : 12 minutes**

---

## Le principe fondamental

**Dans AIAD, il n'y a pas de "rôles" au sens traditionnel, mais des responsabilités qui doivent être assumées.**

### Ce que cela signifie concrètement

| Approche traditionnelle | Approche AIAD |
|------------------------|---------------|
| Une personne = un rôle | Une personne = plusieurs responsabilités |
| Rôle défini par un titre | Responsabilité définie par ce qui doit être fait |
| Frontières rigides | Frontières fluides selon le contexte |
| "Ce n'est pas mon job" | "Qui assume cette responsabilité ?" |

### Exemple

Dans une équipe de 3 personnes :
- Alice assume les responsabilités PM + Tech Lead
- Bob assume les responsabilités PE + QA
- Claire assume les responsabilités AE + PE

Dans une équipe de 8 personnes, chaque responsabilité peut être portée par une personne dédiée.

**L'important n'est pas qui porte quel titre, mais que chaque responsabilité soit clairement assumée.**

---

## Les cinq responsabilités clés

### 1. Product Manager — Responsable de la Valeur

**Essence** : S'assurer que l'équipe construit les bonnes choses pour les bonnes personnes.

**Pourquoi cette responsabilité existe** : Sans quelqu'un focalisé sur la valeur, les équipes construisent des fonctionnalités techniquement parfaites que personne n'utilise.

**Ce que fait le PM :**

| Action | Fréquence |
|--------|-----------|
| Définir le Product Goal (horizon 4-12 semaines) | Mensuel |
| Maintenir le backlog ordonné par valeur | Continu |
| Conduire la discovery (problème → solution → validation) | Hebdomadaire |
| Définir les Outcome Criteria de chaque fonctionnalité | Par fonctionnalité |
| Mesurer l'impact réel des releases | Post-release |
| Arbitrer les trade-offs | À la demande |

**Compétences non négociables :**

1. **Product Strategy** : Savoir où on va et pourquoi
2. **Discovery** : Identifier le vrai problème avant de construire
3. **Analytics** : Mesurer ce qui compte, décider sur des données
4. **Trade-off Mastery** : Arbitrer entre court et long terme

**Comment savoir si ça fonctionne :**

| Indicateur | Cible |
|------------|-------|
| Fonctionnalités atteignant leurs Outcome Criteria | >70% |
| Temps entre insight utilisateur et release | <2 semaines |

**Anti-pattern** : Le PM "passe-plat" qui transmet les demandes des stakeholders sans les challenger ni les prioriser.

---

### 2. Product Engineer — Responsable de l'Orchestration

**Essence** : Transformer des intentions en réalité technique en orchestrant des agents IA.

**Pourquoi cette responsabilité existe** : Les agents IA savent générer du code. Ils ne savent pas définir ce qu'il faut construire ni valider si c'est correct. Le PE fait le pont.

**Ce que fait le PE :**

| Action | Fréquence |
|--------|-----------|
| Rédiger des SPECs techniques précises | Par fonctionnalité |
| Orchestrer les agents pour générer le code | Quotidien |
| Valider la qualité du code généré | Post-génération |
| Maintenir le contexte (AGENT-GUIDE, patterns) | Continu |
| Collaborer à la discovery (prototypes, faisabilité) | À la demande |
| Gérer la dette technique | Continu |

**Compétences non négociables :**

1. **Orchestration d'Agents** : Formuler des intentions claires, structurer le contexte
2. **Architecture** : Penser système, anticiper les implications
3. **Quality Thinking** : Définir "Done", penser aux cas limites
4. **Product Thinking** : Comprendre le pourquoi, pas juste le comment

**Comment savoir si ça fonctionne :**

| Indicateur | Cible |
|------------|-------|
| First-time success rate (code généré correct du premier coup) | >70% |
| Ratio code généré / code manuel | >80/20 |
| Couverture de tests | >80% backend, >70% frontend |

**Anti-pattern** : Le PE qui réécrit systématiquement le code des agents au lieu d'améliorer ses SPECs et son contexte.

---

### 3. Agents Engineer — Responsable de l'Écosystème IA

**Essence** : Construire et optimiser l'écosystème d'agents qui démultiplie les capacités de l'équipe.

**Pourquoi cette responsabilité existe** : Un agent mal configuré produit du code générique. Un écosystème bien calibré produit du code adapté au contexte. La différence ? L'investissement dans la configuration.

**Ce que fait l'AE :**

| Action | Fréquence |
|--------|-----------|
| Sélectionner les agents pertinents | Mensuel |
| Configurer et calibrer chaque agent | Initial + itératif |
| Définir la gouvernance (supervision, validation) | Initial |
| Former l'équipe à l'utilisation efficace | Continu |
| Monitorer les performances | Hebdomadaire |
| Expérimenter avec nouveaux agents | Mensuel |

**L'écosystème d'agents : approche par niveaux**

```
┌─────────────────────────────────────────────────────┐
│        Niveau 1 : Gouvernance                       │
│        Security, Compliance, Architecture           │
│        → Droit de veto sur le code généré           │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│        Niveau 2 : Qualité                           │
│        Tests, Code Review, Performance              │
│        → Avertissements et recommandations          │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│        Niveau 3 : Productivité                      │
│        Documentation, Refactoring, Migration        │
│        → Suggestions d'amélioration                 │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│        Agent Principal                              │
│        Claude Code / Cursor / Copilot               │
│        → Génération de code                         │
└─────────────────────────────────────────────────────┘
```

**Principe de sélection :**

1. **Commencer minimal** : Agent principal + Security + Quality
2. **Ajouter par douleur** : Un problème récurrent ? Chercher un agent
3. **Retirer par obsolescence** : Agent non utilisé depuis 1 mois ? Supprimer
4. **Optimiser par mesure** : Suivre l'usage et l'efficacité réelle

**Comment savoir si ça fonctionne :**

| Indicateur | Cible |
|------------|-------|
| Taux d'adoption des agents par l'équipe | >90% |
| Taux de faux positifs des agents | <20% |
| Satisfaction PE sur l'écosystème | >8/10 |

**Anti-pattern** : L'AE qui accumule des agents "au cas où" sans mesurer leur utilité réelle.

---

### 4. QA Engineer — Responsable de la Qualité

**Essence** : Garantir que la qualité est intégrée dès le départ, pas vérifiée à la fin.

**Pourquoi cette responsabilité existe** : Les agents génèrent des tests, mais ils ne savent pas penser comme un utilisateur frustré ni anticiper les cas limites métier.

**Ce que fait le QA :**

| Action | Fréquence |
|--------|-----------|
| Définir la stratégie de tests globale | Initial + revue trimestrielle |
| Contribuer au Definition of Done | Par fonctionnalité |
| Valider la pertinence des tests générés | Post-génération |
| Conduire les tests exploratoires | Pré-release |
| Mesurer et communiquer la qualité | Hebdomadaire |

**Les quatre niveaux de validation :**

| Niveau | Qui | Automatisation |
|--------|-----|----------------|
| Unitaire | Agents IA + PE | 100% |
| Intégration | PE + Agent Quality | 90% |
| Fonctionnel | QA + Agent Quality | 70% |
| Exploratoire | QA (humain) | 0% |

**Pourquoi le niveau exploratoire reste 100% humain** : Un agent suit des scénarios. Un humain trouve ce qui ne va pas en dehors des scénarios prévus.

**Comment savoir si ça fonctionne :**

| Indicateur | Cible |
|------------|-------|
| Bugs en production | Tendance décroissante |
| Temps de détection d'un bug | <24h |
| Taux de régression | <5% |

**Anti-pattern** : Le QA qui teste uniquement à la fin du cycle au lieu de contribuer à la définition de "Done" dès le départ.

---

### 5. Tech Lead — Responsable de la Cohérence Technique

**Essence** : Garantir que les décisions techniques d'aujourd'hui ne bloquent pas les évolutions de demain.

**Pourquoi cette responsabilité existe** : Sans vision technique long-terme, chaque fonctionnalité est optimisée localement mais le système global devient incohérent.

**Ce que fait le Tech Lead :**

| Action | Fréquence |
|--------|-----------|
| Définir et maintenir le document ARCHITECTURE | Initial + évolutif |
| Valider les décisions architecturales majeures | À la demande |
| Conduire les design reviews | Par fonctionnalité majeure |
| Établir les standards de qualité | Initial |
| Gérer la dette technique (visibilité + priorisation) | Continu |
| Coacher les PE sur sujets complexes | À la demande |

**Le rôle dans les décisions :**

| Type de décision | Rôle du Tech Lead |
|------------------|-------------------|
| **Stratégique** (architecture globale, choix stack) | Décide avec input équipe |
| **Tactique** (patterns, libraries) | Guide, l'équipe décide |
| **Opérationnelle** (implémentation spécifique) | N'intervient pas |

**Comment savoir si ça fonctionne :**

| Indicateur | Cible |
|------------|-------|
| Dette technique | Tendance stable ou décroissante |
| Décisions architecturales revisitées | <10% par an |
| Temps de design review | <2h |

**Anti-pattern** : Le Tech Lead "super développeur" qui code plus qu'il ne guide, créant un goulot d'étranglement.

---

## Les Supporters : facilitateurs de succès

### Définition

Les Supporters sont des stakeholders qui créent les conditions de succès de l'équipe sans faire partie du quotidien.

### Ce qu'ils font

| Action | Impact |
|--------|--------|
| Créer un environnement psychologiquement sûr | L'équipe ose expérimenter et échouer |
| Lever les obstacles organisationnels | L'équipe n'est pas bloquée par la bureaucratie |
| Faciliter l'accès aux ressources | L'équipe a ce dont elle a besoin |

### Ce qu'ils ne font pas

- Définir le backlog (c'est le PM)
- Valider les décisions techniques (c'est le Tech Lead)
- Participer aux synchronisations quotidiennes

---

## Combiner les responsabilités

### Équipe de 2-3 personnes

| Personne | Responsabilités |
|----------|-----------------|
| A | PM + Tech Lead |
| B | PE + QA + AE |

### Équipe de 4-6 personnes

| Personne | Responsabilités |
|----------|-----------------|
| A | PM |
| B | PE + Tech Lead |
| C | PE + AE |
| D | QA |

### Équipe de 7+ personnes

Chaque responsabilité peut être portée par une personne dédiée.

### Règle d'or

**Quelle que soit la taille de l'équipe, chaque responsabilité doit avoir un porteur clairement identifié.**

---

## Erreurs fréquentes

### "On n'a pas besoin d'Agents Engineer, chacun gère ses agents"

**Le problème** : Chaque PE configure différemment, l'écosystème devient incohérent, les bonnes pratiques ne se partagent pas.

**La réalité** : Même à temps partiel, quelqu'un doit avoir la vision globale de l'écosystème IA.

### "Le Tech Lead décide de tout ce qui est technique"

**Le problème** : Goulot d'étranglement, PE déresponsabilisés, frustration générale.

**La réalité** : Le Tech Lead guide les décisions stratégiques. Les décisions opérationnelles appartiennent aux PE.

### "Le PM n'a pas besoin de comprendre la technique"

**Le problème** : Trade-offs mal arbitrés, fonctionnalités impossibles promisées, dette technique ignorée.

**La réalité** : Le PM n'a pas besoin de coder, mais il doit comprendre les implications techniques de ses décisions.

---

## En résumé

| Responsabilité | Question centrale | Focus |
|----------------|-------------------|-------|
| **PM** | Construit-on la bonne chose ? | Valeur |
| **PE** | L'agent produit-il le bon résultat ? | Orchestration |
| **AE** | L'écosystème est-il optimal ? | Configuration |
| **QA** | Le résultat est-il fiable ? | Qualité |
| **Tech Lead** | Le système reste-t-il cohérent ? | Architecture |

---

*Prochaine section : [Les Artefacts](04-artefacts.md)*
