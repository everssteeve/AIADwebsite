# Intention des Annexes AIAD

Ce document définit le cadre de rédaction pour chaque annexe du framework AIAD. Il sert de guide pour produire des contenus cohérents, pratiques et directement exploitables.

---

## Principes Fondamentaux de Rédaction

### 1. Philosophie Générale

Chaque annexe doit être **autonome** : un lecteur doit pouvoir la comprendre et l'appliquer sans avoir lu le reste de la documentation. Elle complète le framework, elle ne le répète pas.

### 2. Le Lecteur Cible

| Type de lecteur | Attente principale |
|-----------------|-------------------|
| **Praticien débutant** | Guides pas-à-pas, exemples concrets |
| **Praticien expérimenté** | Templates réutilisables, anti-patterns à éviter |
| **Décideur** | Valeur ajoutée, ROI, critères de succès |

### 3. Règles d'Écriture

- **Concision** : Aller à l'essentiel. Pas de prose inutile.
- **Actionnabilité** : Chaque section doit permettre une action concrète.
- **Exemples** : Un concept = un exemple. Pas d'abstraction sans illustration.
- **Templates** : Fournir des modèles copiables directement.
- **Anti-patterns** : Montrer ce qu'il NE faut PAS faire (avec explication).

### 4. Structure Type d'une Annexe

```markdown
# [Numéro] Titre de l'Annexe

## Pourquoi cette annexe ?
[1-3 phrases : problème résolu, valeur apportée, cas d'usage]

---

## [Section principale 1]
[Contenu structuré avec sous-sections]

## [Section principale 2]
[Contenu structuré avec sous-sections]

---

## Exemples Pratiques
[Cas concrets avec code/templates]

## Anti-patterns
[Ce qu'il faut éviter et pourquoi]

## Checklist / Résumé
[Points clés à retenir, vérifications rapides]

---

*Liens vers annexes connexes*
```

---

## Catégorie A : Templates Fondateurs

### Intention Globale
Ces templates sont les **artefacts de démarrage** de tout projet AIAD. Ils posent les fondations. Le lecteur doit pouvoir créer ces documents en moins de 2 heures.

### A.1 Template PRD

**Objectif** : Permettre à un Product Manager de rédiger un PRD complet et exploitable par les agents IA.

**Points à couvrir** :
- Structure complète du PRD avec justification de chaque section
- Exemples de PRD minimaliste vs PRD complet
- Critères d'un bon outcome (SMART appliqué au produit)
- Erreurs courantes et comment les éviter
- Template prêt à copier-coller

**Ton** : Prescriptif mais flexible. "Voici ce qui fonctionne, adaptez à votre contexte."

### A.2 Template ARCHITECTURE

**Objectif** : Permettre à un Tech Lead de documenter les décisions architecturales de manière exploitable par les agents.

**Points à couvrir** :
- Structure ADR (Architecture Decision Record)
- Comment documenter les "pourquoi" et pas seulement les "quoi"
- Niveau de détail optimal (ni trop, ni trop peu)
- Exemples de documentation pour différentes stacks
- Template avec sections commentées

**Ton** : Technique mais accessible. Éviter le jargon inutile.

### A.3 Template AGENT-GUIDE

**Objectif** : Créer un guide que les agents IA pourront exploiter pour générer du code conforme aux standards du projet.

**Points à couvrir** :
- Anatomie d'un AGENT-GUIDE efficace
- Comment formuler les conventions pour les agents
- Exemples de bons/mauvais patterns documentés
- Évolution du guide au fil du projet
- Template par type de projet (React, Node, Python...)

**Ton** : Direct et précis. Les agents ont besoin de clarté.

### A.4 Template SPECS

**Objectif** : Rédiger des spécifications qui servent à la fois aux humains et aux agents.

**Points à couvrir** :
- Structure d'une SPEC efficace
- User stories avec critères d'acceptation testables
- Niveau de détail technique approprié
- Gestion des cas limites
- Cycle de vie d'une SPEC (Draft → Ready → Done)

**Ton** : Méthodique. Chaque élément a une raison d'être.

### A.5 Template DoOD

**Objectif** : Définir des critères de "Done" clairs et mesurables.

**Points à couvrir** :
- Différence DoOD (livrable) vs DoOuD (outcome)
- Comment calibrer les critères selon le contexte
- Éviter le "DoOD theatre" (cocher des cases sans valeur)
- Exemples par type de livrable
- Template évolutif

**Ton** : Pragmatique. Le DoOD doit être utile, pas bureaucratique.

### A.6 Template DoOuD

**Objectif** : Définir des critères de succès orientés résultats business.

**Points à couvrir** :
- Lien entre outcomes et métriques produit
- Comment mesurer ce qui compte vraiment
- Temporalité des outcomes (court/moyen/long terme)
- Gestion de l'incertitude et des proxys
- Exemples par type d'outcome

**Ton** : Orienté impact. Relier chaque action à sa valeur.

---

## Catégorie B : Rôles Détaillés

### Intention Globale
Ces annexes transforment les descriptions de rôles du framework en **fiches de poste opérationnelles**. Le lecteur doit savoir exactement quoi faire lundi matin.

### B.1 Product Manager

**Objectif** : Maîtriser le rôle de PM dans un contexte AIAD.

**Points à couvrir** :
- Activités quotidiennes concrètes
- Livrables attendus avec templates
- Collaboration avec chaque autre rôle (PE, TL, QA)
- Anti-patterns spécifiques au PM
- Outils recommandés

**Ton** : Coaching. "Voici comment exceller dans ce rôle."

### B.2 Product Engineer

**Objectif** : Maîtriser le rôle de PE, orchestrateur des agents.

**Points à couvrir** :
- Workflow quotidien détaillé
- Techniques de prompting par situation
- Revue et validation du code généré
- Gestion du contexte avec les agents
- Progression de compétence (débutant → expert)

**Ton** : Pratique et technique. Focus sur l'exécution.

### B.3 QA Engineer

**Objectif** : Maîtriser le rôle QA adapté au contexte AIAD.

**Points à couvrir** :
- Stratégie de test avec code généré
- Automatisation vs tests manuels
- Gestion des régressions fréquentes
- Collaboration avec les agents pour les tests
- Métriques qualité à suivre

**Ton** : Rigoureux mais réaliste. La qualité au service de la vélocité.

### B.4 Tech Lead

**Objectif** : Maîtriser le rôle de garant technique dans AIAD.

**Points à couvrir** :
- Gouvernance architecture sans bureaucratie
- Review efficace du code généré
- Gestion de la dette technique avec les agents
- Mentorat technique de l'équipe
- Décisions techniques et leur documentation

**Ton** : Leadership technique. Vision et pragmatisme.

### B.5 Supporters

**Objectif** : Intégrer efficacement les rôles de support dans AIAD.

**Points à couvrir** :
- Stakeholders : comment interagir avec l'équipe AIAD
- DevOps : automatisation et déploiement
- UX/Design : collaboration avec agents pour l'UI
- Sécurité : validation du code généré
- Modalités de contribution ponctuelle vs continue

**Ton** : Inclusif. Chacun a un rôle à jouer.

### B.6 Agents Engineer

**Objectif** : Spécialisation avancée dans la gestion des agents IA.

**Points à couvrir** :
- Configuration avancée des agents
- Création de subagents spécialisés
- Optimisation des prompts système
- Debugging des comportements agents
- Veille et mise à jour des pratiques

**Ton** : Expert. Pour ceux qui veulent aller plus loin.

---

## Catégorie C : Boucles AIAD

### Intention Globale
Ces annexes sont des **guides opérationnels** pour exécuter chaque phase du cycle AIAD. Format : "Comment faire X de A à Z."

### C.1 Phase d'Initialisation

**Objectif** : Démarrer un projet AIAD de zéro en 7 jours.

**Points à couvrir** :
- Jour par jour : activités et livrables
- Checklists de validation par étape
- Pièges courants du démarrage
- Critères de succès de l'initialisation
- Templates pour chaque artefact initial

**Ton** : Guidé. Prendre par la main sans infantiliser.

### C.2 Boucle PLANIFIER

**Objectif** : Transformer une SPEC en plan d'action exécutable.

**Points à couvrir** :
- Décomposition en tâches
- Estimation et séquencement
- Identification des risques
- Préparation du contexte pour les agents
- Output attendu de la phase

**Ton** : Méthodique. La préparation détermine le succès.

### C.3 Boucle IMPLÉMENTER

**Objectif** : Produire du code de qualité avec les agents IA.

**Points à couvrir** :
- Workflow de génération (prompt → review → commit)
- Techniques de prompting par type de tâche
- Gestion des erreurs et itérations
- Bonnes pratiques de commit
- Métriques de productivité

**Ton** : Exécution. Focus sur le flow et l'efficacité.

### C.4 Boucle VALIDER

**Objectif** : S'assurer que le code produit répond aux attentes.

**Points à couvrir** :
- Stratégie de test multi-niveaux
- Validation du DoOD
- Gestion des bugs découverts
- Documentation des tests
- Critères de passage à l'intégration

**Ton** : Qualité. Pas de raccourci sur la validation.

### C.5 Boucle INTÉGRER

**Objectif** : Fusionner le code et le déployer en confiance.

**Points à couvrir** :
- Process de PR et review
- CI/CD avec code généré
- Gestion des conflits
- Déploiement et rollback
- Communication de la release

**Ton** : Fiabilité. L'intégration continue est un filet de sécurité.

---

## Catégorie D : Rituels

### Intention Globale
Ces annexes transforment les rituels en **sessions productives et concrètes**. Chaque rituel doit avoir un objectif clair et un output mesurable.

### D.1 Alignment Stratégique

**Objectif** : Aligner l'équipe sur les priorités et prendre les décisions clés.

**Points à couvrir** :
- Template d'ordre du jour
- Préparation requise par rôle
- Prise de décision efficace
- Documentation des décisions
- Anti-patterns de réunion

**Ton** : Efficace. Chaque minute compte.

### D.2 Demo & Feedback

**Objectif** : Présenter le travail accompli et collecter du feedback.

**Points à couvrir** :
- Structure d'une démo efficace
- Gestion du feedback (constructif vs destructif)
- Actions post-demo
- Fréquence et durée optimales
- Enregistrement et partage

**Ton** : Communication. La démo est un moment de vérité.

### D.3 Tech Review

**Objectif** : Maintenir la qualité technique et partager les connaissances.

**Points à couvrir** :
- Sujets à traiter en tech review
- Format de présentation
- Décisions techniques à documenter
- Suivi des actions techniques
- Éviter le bikeshedding

**Ton** : Technique mais accessible. Apprentissage collectif.

### D.4 Rétrospective

**Objectif** : Améliorer continuellement le fonctionnement de l'équipe.

**Points à couvrir** :
- Formats de rétro variés
- Facilitation efficace
- Transformation en actions concrètes
- Suivi des améliorations
- Sécurité psychologique

**Ton** : Bienveillant mais exigeant. L'amélioration est non-négociable.

### D.5 Standup

**Objectif** : Synchroniser l'équipe quotidiennement de manière efficace.

**Points à couvrir** :
- Format adapté au contexte AIAD
- Ce qui doit être partagé
- Gestion des blocages
- Durée et timing
- Alternative asynchrone

**Ton** : Bref. 15 minutes max, pas de digression.

---

## Catégorie E : Métriques et Dashboards

### Intention Globale
Ces annexes aident à **mesurer ce qui compte** et à visualiser la progression. Data-driven mais pas data-obsessed.

### E.1 Exemples de Dashboards

**Objectif** : Visualiser les métriques clés du projet AIAD.

**Points à couvrir** :
- Dashboard par rôle (PM, PE, TL)
- Métriques de vélocité avec agents
- Métriques de qualité du code généré
- Visualisations recommandées
- Outils et implémentation

**Ton** : Visuel et pratique. Les dashboards doivent aider, pas distraire.

### E.2 Revue Trimestrielle

**Objectif** : Prendre du recul sur la performance à long terme.

**Points à couvrir** :
- Métriques de niveau strategic
- Comparaison avant/après AIAD
- Identification des tendances
- Décisions de pivot ou d'ajustement
- Communication aux stakeholders

**Ton** : Stratégique. Vision à long terme.

---

## Catégorie F : Agents Spécialisés

### Intention Globale
Ces annexes décrivent des **agents configurés pour des tâches spécifiques**. Format : configuration + usage + exemples.

### F.1 Agent Security

**Objectif** : Détecter les vulnérabilités dans le code généré.

**Points à couvrir** :
- System prompt complet
- Catégories de vulnérabilités couvertes
- Intégration CI/CD
- Rapport type
- Limites et compléments (SAST, etc.)

**Ton** : Sécurité sans paranoïa. Risques proportionnés.

### F.2 Agent Quality

**Objectif** : Maintenir les standards de qualité du code.

**Points à couvrir** :
- Critères de qualité évalués
- Suggestions d'amélioration
- Intégration dans le workflow PE
- Métriques de qualité
- Calibration selon le contexte

**Ton** : Qualité pragmatique. 80/20 appliqué.

### F.3 Agent Architecture

**Objectif** : Valider les décisions architecturales.

**Points à couvrir** :
- Principes architecturaux à vérifier
- Détection des anti-patterns
- Suggestions de refactoring
- Documentation des décisions
- Review d'architecture

**Ton** : Architecture évolutive. Pas de sur-ingénierie.

### F.4 Agent Documentation

**Objectif** : Générer et maintenir la documentation.

**Points à couvrir** :
- Types de documentation (API, README, inline)
- Style et ton de documentation
- Synchronisation doc/code
- Génération automatique
- Revue de documentation

**Ton** : Documentation vivante. Utile et à jour.

### F.5 Agent Performance

**Objectif** : Identifier et corriger les problèmes de performance.

**Points à couvrir** :
- Métriques de performance analysées
- Suggestions d'optimisation
- Profiling et benchmarks
- Priorisation des corrections
- Trade-offs performance/maintenabilité

**Ton** : Performance mesurée. Pas d'optimisation prématurée.

### F.6 Agent Code Review

**Objectif** : Pré-review le code avant la review humaine.

**Points à couvrir** :
- Critères de review automatisée
- Commentaires constructifs
- Intégration avec les PR
- Calibration de la sévérité
- Complémentarité avec review humaine

**Ton** : Assistant de review. Augmente, ne remplace pas.

### F.7 Autres Agents

**Objectif** : Catalogue d'agents spécialisés additionnels.

**Points à couvrir** :
- Agent Test : génération de tests
- Agent Migration : aide aux migrations
- Agent Debugging : analyse des bugs
- Agent Refactoring : suggestions de refactoring
- Comment créer son propre agent

**Ton** : Catalogue. Inspiration et templates.

---

## Catégorie G : Configuration Technique

### Intention Globale
Ces annexes sont des **guides techniques pas-à-pas**. Le lecteur doit pouvoir suivre et reproduire en autonomie.

### G.1 Configuration Environnement

**Objectif** : Mettre en place un environnement de développement AIAD.

**Points à couvrir** :
- Structure de projet recommandée
- Configuration TypeScript/ESLint/Prettier
- Scripts utilitaires
- Configuration IDE
- Checklist de vérification

**Ton** : Tutoriel. Étape par étape.

### G.2 Installation Agents IA

**Objectif** : Installer et configurer les agents de développement.

**Points à couvrir** :
- Agents supportés (Claude, GPT, etc.)
- Installation par plateforme
- Configuration de base
- Vérification de fonctionnement
- Troubleshooting courant

**Ton** : Installation. Simple et reproductible.

### G.3 Setup CI/CD

**Objectif** : Configurer l'intégration et le déploiement continu.

**Points à couvrir** :
- GitHub Actions / GitLab CI
- Pipeline de qualité (lint, test, build)
- Déploiement automatique
- Environnements (staging, prod)
- Secrets et sécurité

**Ton** : DevOps. Automatisation fiable.

### G.4 Configuration Permissions

**Objectif** : Gérer les permissions des agents et de l'équipe.

**Points à couvrir** :
- Permissions fichiers pour les agents
- Gestion des secrets
- Accès repo et services
- Principe du moindre privilège
- Audit trail

**Ton** : Sécurité. Accès contrôlé.

### G.5 Installation MCP/Plugins

**Objectif** : Étendre les capacités des agents avec des plugins.

**Points à couvrir** :
- MCP (Model Context Protocol)
- Plugins recommandés
- Installation et configuration
- Développement de plugins custom
- Compatibilité et limites

**Ton** : Extension. Personnalisation avancée.

### G.6 Création de Subagents

**Objectif** : Créer des agents spécialisés pour le projet.

**Points à couvrir** :
- Architecture de subagents
- System prompts efficaces
- Chaînage d'agents
- Test et validation
- Maintenance et évolution

**Ton** : Avancé. Pour les praticiens expérimentés.

---

## Catégorie H : Bonnes Pratiques

### Intention Globale
Ces annexes capitalisent les **apprentissages et patterns** qui fonctionnent. Base de connaissances évolutive.

### H.1 Prompts Efficaces

**Objectif** : Maîtriser l'art du prompting pour les agents de code.

**Points à couvrir** :
- Anatomie d'un bon prompt
- Prompts par type de tâche
- Patterns avancés (step-by-step, etc.)
- Anti-patterns à éviter
- Checklist avant envoi

**Ton** : Maîtrise. Le prompt est un outil à affûter.

### H.2 Patterns de Code

**Objectif** : Documenter les patterns de code qui fonctionnent.

**Points à couvrir** :
- Patterns par langage/framework
- Patterns spécifiques AIAD
- Quand utiliser quel pattern
- Exemples implémentés
- Anti-patterns associés

**Ton** : Référence. Catalogue consultable.

### H.3 Anti-patterns

**Objectif** : Documenter ce qu'il NE faut PAS faire.

**Points à couvrir** :
- Anti-patterns de prompting
- Anti-patterns de code généré
- Anti-patterns de process
- Détection et correction
- Prévention

**Ton** : Avertissement. Apprendre des erreurs.

### H.4 Cas d'Usage Spécifiques

**Objectif** : Guides pour des situations particulières.

**Points à couvrir** :
- Projet legacy avec AIAD
- Migration vers AIAD
- Équipe distribuée
- Projet solo
- Contextes réglementés

**Ton** : Contextuel. Adapter le framework.

### H.5 Notes d'Apprentissage

**Objectif** : Capitaliser les découvertes et retours d'expérience.

**Points à couvrir** :
- Structure d'une note d'apprentissage
- Partage au sein de l'équipe
- Intégration dans la documentation
- Revue périodique
- Base de connaissances

**Ton** : Apprentissage continu. Le savoir se partage.

---

## Catégorie I : Ressources

### Intention Globale
Ces annexes fournissent des **ressources de référence** : glossaire, troubleshooting, bibliographie, communauté.

### I.1 Troubleshooting

**Objectif** : Résoudre les problèmes courants rapidement.

**Points à couvrir** :
- Problèmes agents IA
- Problèmes de process
- Problèmes techniques
- Problèmes d'équipe
- Checklist de diagnostic

**Ton** : Support. Solutions rapides.

### I.2 Glossaire

**Objectif** : Définir les termes clés du framework.

**Points à couvrir** :
- Termes AIAD spécifiques
- Termes techniques courants
- Acronymes
- Liens vers contexte détaillé
- Index alphabétique

**Ton** : Référence. Clarté des définitions.

### I.3 Bibliographie

**Objectif** : Ressources pour approfondir.

**Points à couvrir** :
- Livres recommandés
- Articles et blogs
- Vidéos et podcasts
- Outils et services
- Communautés

**Ton** : Curation. Le meilleur de chaque catégorie.

### I.4 Communauté

**Objectif** : Rejoindre et contribuer à la communauté AIAD.

**Points à couvrir** :
- Canaux de communication
- Contribution au framework
- Événements et meetups
- Partage de retours d'expérience
- Support et entraide

**Ton** : Communautaire. Ensemble on va plus loin.

---

## Gouvernance des Annexes

### Évolution du Contenu

| Action | Responsable | Fréquence |
|--------|-------------|-----------|
| Revue de cohérence | Tech Lead | Mensuelle |
| Mise à jour templates | PM + PE | Continue |
| Ajout de nouveaux exemples | Équipe | Continue |
| Validation des patterns | Tech Lead | Par cycle |
| Nettoyage des contenus obsolètes | PM | Trimestrielle |

### Critères de Qualité

Chaque annexe doit :
- [ ] Être autonome (compréhensible seule)
- [ ] Contenir au moins un exemple concret
- [ ] Inclure une section anti-patterns
- [ ] Fournir une checklist ou un résumé actionnable
- [ ] Être à jour avec la dernière version du framework
- [ ] Avoir des liens vers les annexes connexes

### Processus de Contribution

1. **Identifier** un manque ou une amélioration
2. **Proposer** via une issue ou discussion
3. **Rédiger** en suivant ce guide d'intention
4. **Review** par un pair + le responsable de catégorie
5. **Intégrer** et communiquer le changement

---

## Checklist de Rédaction

Avant de publier une annexe :

```markdown
## Checklist Annexe

### Contenu
- [ ] L'objectif est clair dès l'introduction
- [ ] Le problème résolu est explicité
- [ ] Des exemples concrets illustrent chaque concept
- [ ] Les anti-patterns sont documentés
- [ ] Une checklist ou résumé conclut l'annexe

### Format
- [ ] Structure respectée (titre, sections, exemples)
- [ ] Markdown valide et lisible
- [ ] Code formaté et syntaxiquement correct
- [ ] Liens fonctionnels vers annexes connexes

### Qualité
- [ ] Relu par un pair
- [ ] Testé (si code/commandes)
- [ ] Cohérent avec le reste du framework
- [ ] Ton approprié à la catégorie

### Maintenance
- [ ] Date de dernière mise à jour visible
- [ ] Responsable de maintenance identifié
```

---

*Ce document est la référence pour la rédaction et la maintenance des annexes AIAD.*
