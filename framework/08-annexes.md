# Les Annexes

## Pourquoi lire cette section ?

Les annexes rassemblent les ressources détaillées pour mettre AIAD en pratique. Le framework principal donne les principes et la structure ; les annexes fournissent les templates, exemples et guides d'implémentation.

**Usage recommandé** : consulter les annexes au moment où vous en avez besoin, pas en lecture linéaire.

**Temps de lecture : 5 minutes** (pour la table des matières, les annexes individuelles varient)

---

## Comment utiliser les annexes

| Situation | Annexe à consulter |
|-----------|-------------------|
| Démarrer un nouveau projet | A.1 (PRD), A.2 (ARCHITECTURE), A.3 (AGENT-GUIDE) |
| Rédiger une spécification | A.4 (SPECS), H.4 (exemples concrets) |
| Configurer l'écosystème d'agents | F (Catalogue d'Agents), G.2 (Installation) |
| Préparer une synchronisation | D (Synchronisations Détaillées) |
| Améliorer les métriques | E (Dashboards), E.2 (Revue trimestrielle) |
| Former un nouveau membre | C.1 (Initialisation), H.1 (Prompts efficaces) |
| Résoudre un problème | I.1 (Troubleshooting), I.2 (Glossaire) |

---

## Annexe A : Templates et Structures

**Essence** : Les documents fondamentaux d'un projet AIAD, prêts à l'emploi.

| Template | Usage | Responsable principal |
|----------|-------|----------------------|
| **A.1 PRD** | Définir la vision produit et les outcomes | Product Manager |
| **A.2 ARCHITECTURE** | Documenter les décisions techniques | Tech Lead |
| **A.3 AGENT-GUIDE** | Configurer le contexte pour les agents IA | Agents Engineer |
| **A.4 SPECS** | Spécifier une fonctionnalité | Product Engineer |
| **A.5 DoOD** | Checklist de validation output | Équipe |
| **A.6 DoOuD** | Critères de succès outcome | Product Manager |

**Conseil pratique** : ne pas remplir tous les champs au démarrage. Commencer par l'essentiel, enrichir au fil du projet.

---

## Annexe B : Détails des Responsabilités

**Essence** : Approfondir ce que chaque responsabilité implique au quotidien.

| Section | Contenu |
|---------|---------|
| **B.1 Product Manager** | Anti-patterns discovery, exemples de PRD efficaces |
| **B.2 Product Engineer** | Workflow quotidien type, patterns d'orchestration |
| **B.3 QA Engineer** | Stratégies de test par contexte, automatisation |
| **B.4 Tech Lead** | Conduite des design reviews, dette technique |
| **B.5 Supporters** | Quand intervenir, anti-patterns de sur-intervention |

**Pourquoi ces détails existent** : le framework principal définit les responsabilités, mais le quotidien demande des exemples concrets et des cas limites documentés.

---

## Annexe C : Processus Opérationnels Détaillés

**Essence** : Le détail étape par étape des boucles et de l'initialisation.

| Section | Contenu |
|---------|---------|
| **C.1 Phase d'Initialisation** | Les 7 premiers jours détaillés, checklist jour par jour |
| **C.2 Boucle PLANIFIER** | Process complet, critères d'entrée/sortie |
| **C.3 Boucle IMPLÉMENTER** | Workflow d'orchestration, prompt patterns |
| **C.4 Boucle VALIDER** | Template rapport QA, critères de régression |
| **C.5 Boucle INTÉGRER** | Conventional Commits, stratégies de merge |

**Quand consulter** : lors de l'adoption initiale ou quand une boucle dysfonctionne et nécessite un recadrage.

---

## Annexe D : Synchronisations Détaillées

**Essence** : Formats, templates et exemples pour chaque type de synchronisation.

| Section | Contenu |
|---------|---------|
| **D.1 Alignment Stratégique** | Template d'ordre du jour, exemples de décisions |
| **D.2 Demo & Feedback** | Questions type pour collecter du feedback utile |
| **D.3 Tech Review** | Critères de priorisation de la dette technique |
| **D.4 Rétrospective** | Formats de facilitation (Start/Stop/Continue, 4L, etc.) |
| **D.5 Standup** | Exemples de standups efficaces vs inefficaces |

**Rappel** : les synchronisations sont à la demande, pas prescrites. Ces templates aident quand on décide d'en tenir une.

---

## Annexe E : Métriques et Dashboards

**Essence** : Visualiser et analyser les métriques AIAD.

| Section | Contenu |
|---------|---------|
| **E.1 Exemples de dashboards** | Maquettes pour dashboard hebdomadaire et mensuel |
| **E.2 Template revue trimestrielle** | Questions, format, participants, outputs attendus |

**Lien avec le framework** : la section Métriques définit *quoi* mesurer ; cette annexe montre *comment* le présenter.

---

## Annexe F : Catalogue d'Agents Spécialisés

**Essence** : Configuration et règles pour chaque type d'agent.

| Section | Agent | Cas d'usage principal |
|---------|-------|----------------------|
| **F.1** | Security | Audit de vulnérabilités, OWASP, secrets |
| **F.2** | Quality | Couverture de tests, standards de code |
| **F.3** | Architecture | Cohérence patterns, détection de dette |
| **F.4** | Documentation | Génération et mise à jour de docs |
| **F.5** | Performance | Profiling, optimisation, benchmarks |
| **F.6** | Code Review | Revue automatisée, suggestions |
| **F.7** | Autres | Product Management, Refactoring, Migration |

**Conseil pratique** : commencer avec 2-3 agents, ajouter progressivement selon les besoins réels.

---

## Annexe G : Guides d'Implémentation

**Essence** : Instructions techniques pour mettre en place l'environnement AIAD.

| Section | Contenu |
|---------|---------|
| **G.1 Configuration environnement** | Commandes bash, structure de projet |
| **G.2 Installation agents IA** | Setup des principaux agents du marché |
| **G.3 Setup CI/CD** | Intégration des agents dans le pipeline |
| **G.4 Configuration permissions** | Droits et accès pour les agents |
| **G.5 Installation MCP et plugins** | Extensions et intégrations |
| **G.6 Création de SubAgents** | Agents spécialisés sur mesure |

**Avertissement** : ces guides évoluent rapidement avec les outils. Vérifier les versions et la documentation officielle des outils.

---

## Annexe H : Exemples et Patterns

**Essence** : Apprendre par l'exemple.

| Section | Contenu |
|---------|---------|
| **H.1 Prompts efficaces** | Exemples de prompts qui produisent du code de qualité |
| **H.2 Patterns de code** | Structures recommandées par contexte |
| **H.3 Anti-patterns** | Erreurs courantes avec exemples à éviter |
| **H.4 Cas d'usage SPECs** | SPECs réelles commentées |
| **H.5 Notes d'apprentissage** | Learnings issus de projets réels |

**Valeur principale** : raccourcir la courbe d'apprentissage en montrant ce qui fonctionne (et ce qui ne fonctionne pas).

---

## Annexe I : Outils et Références

**Essence** : Ressources de support et référence.

| Section | Contenu |
|---------|---------|
| **I.1 Troubleshooting** | FAQ et solutions aux problèmes courants |
| **I.2 Glossaire** | Définitions complètes de tous les termes AIAD |
| **I.3 Bibliographie** | Sources et lectures complémentaires |
| **I.4 Communauté** | Canaux de support et contribution |

---

## Disponibilité des annexes

| Statut | Signification |
|--------|---------------|
| Disponible | Annexe rédigée et utilisable |
| En cours | Annexe en rédaction |
| Planifié | Annexe prévue pour une version future |

Les annexes sont développées progressivement selon les retours terrain. Les templates essentiels (A.1 à A.6) sont prioritaires.

---

## Fin du Framework AIAD v1.3

**La méthodologie de référence pour le développement produit à l'ère des agents IA.**

Version 1.3 - Janvier 2026

---

## Prochaines étapes pour adopter AIAD

| Étape | Action |
|-------|--------|
| 1 | Lire le framework : comprendre les concepts et principes |
| 2 | Planifier l'adoption : identifier les quick wins et blockers potentiels |
| 3 | Former l'équipe : workshop d'introduction AIAD |
| 4 | Phase d'initialisation : suivre le guide sur 4-7 jours (voir Annexe C.1) |
| 5 | Premiers cycles : livrer les 3 premières fonctionnalités en mode AIAD |
| 6 | Première rétrospective : adapter le framework au contexte |
| 7 | Amélioration continue : itérer sur le framework lui-même |

---

## Erreurs fréquentes à l'adoption

### "On va tout mettre en place d'un coup"

**Le problème** : surcharge de changements, équipe perdue, abandon rapide.

**La réalité** : commencer par les artefacts essentiels (PRD, AGENT-GUIDE), ajouter les boucles progressivement.

### "On adapte AIAD à nos processus actuels"

**Le problème** : garder les cérémonies Scrum et ajouter AIAD par-dessus crée de la friction.

**La réalité** : AIAD remplace les frameworks existants, il ne s'additionne pas.

### "Les annexes, c'est pour plus tard"

**Le problème** : réinventer les templates au lieu d'utiliser ceux qui existent.

**La réalité** : les templates (Annexe A) sont le point de départ le plus concret pour démarrer.

---

*Retour au début : [Préambule](01-preambule.md)*
