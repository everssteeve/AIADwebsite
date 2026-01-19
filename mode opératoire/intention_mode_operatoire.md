# Intention du Mode Opératoire AIAD

## Objectif du document

Ce Mode Opératoire est le **guide pratique d'implémentation** du Framework AIAD. Il traduit les principes théoriques du framework en actions concrètes, séquencées et reproductibles.

**Mission** : Permettre à une personne ou une équipe, même novice en AIAD, de mettre en œuvre le développement d'un produit logiciel assisté par agents IA, en suivant ce mode opératoire pas à pas, dans le respect intégral du framework AIAD.

---

## Documents de référence (Framework AIAD v1.3)

Le Mode Opératoire doit être en parfaite cohérence avec ces documents fondateurs :

| Document | Contenu | Lien |
|----------|---------|------|
| Préambule | Constat, principes fondateurs, ce qu'apporte AIAD | @framework/01-preambule.md |
| Vision et Philosophie | Principe cardinal, quatre piliers, manifeste | @framework/02-vision-philosophie.md |
| Écosystème | Cinq responsabilités (PM, PE, AE, QA, Tech Lead), Supporters | @framework/03-ecosysteme.md |
| Artefacts | PRD, ARCHITECTURE, AGENT-GUIDE, SPECS, DoOD, DoOuD | @framework/04-artefacts.md |
| Boucles Itératives | Initialisation, Planifier, Implémenter, Valider, Intégrer | @framework/05-boucles-iteratives.md |
| Synchronisations | 5 syncs intentionnelles (Alignment, Demo, Tech Review, Rétro, Standup) | @framework/06-synchronisations.md |
| Métriques | 5 catégories (Productivité, Qualité, Efficacité IA, Outcomes, Équipe), PDCA | @framework/07-metriques.md |

---

## Positionnement : Framework vs Mode Opératoire

| Aspect | Framework AIAD | Mode Opératoire |
|--------|----------------|-----------------|
| Nature | Principes, philosophie, concepts | Procédures, étapes, actions |
| Question | POURQUOI et QUOI | COMMENT et QUAND |
| Format | Explicatif, conceptuel | Prescriptif, séquencé |
| Lecteur | Comprendre la méthode | Appliquer la méthode |
| Ton | Pédagogique | Opérationnel |

**Règle clé** : Le Mode Opératoire ne réexplique pas les concepts du Framework. Il les applique. Pour chaque action, il peut référencer le Framework pour le "pourquoi".

---

## Règles de rédaction

### 1. Structure et organisation

#### 1.1 Hiérarchie des parties

Le Mode Opératoire suit la chronologie d'un projet :

| Partie | Alignement Framework | Contenu |
|--------|---------------------|---------|
| 00-preambule | @framework/03-ecosysteme.md | Glossaire, RACI, vue d'ensemble du processus |
| 01-initialisation | @framework/05-boucles-iteratives.md (Phase init) | Toutes les étapes pour démarrer un projet |
| 02-planification | @framework/05-boucles-iteratives.md (Boucle 1) | Comment transformer une intention en SPEC |
| 03-developpement | @framework/05-boucles-iteratives.md (Boucle 2) | Workflow quotidien, orchestration agents |
| 04-validation | @framework/05-boucles-iteratives.md (Boucle 3) | Process QA et validation PO |
| 05-deploiement | @framework/05-boucles-iteratives.md (Boucle 4) | Checklist et procédures de mise en production |
| 06-rituels-amelioration | @framework/06-synchronisations.md + @framework/07-metriques.md | Syncs et amélioration continue |
| 07-annexes | Tous | Références rapides, troubleshooting, FAQ |

#### 1.2 Structure d'une étape

Chaque étape majeure DOIT suivre ce format :

```markdown
## X.Y Étape : [Nom de l'étape]

| | |
|---|---|
| 🎭 **ACTEUR** | [Responsabilité AIAD concernée] |
| 📥 **ENTRÉES** | [Ce qui est nécessaire pour commencer] |
| 📤 **SORTIES** | [Ce qui est produit à la fin] |
| ⏱️ **DURÉE** | [Estimation] |
| 🔗 **DÉPENDANCES** | [Étapes préalables requises] |

### X.Y.1 [Sous-section]
[Contenu]
```

#### 1.3 Éléments visuels obligatoires

- **Tables** : Pour toute liste de plus de 3 éléments comparables
- **Blocs de code** : Pour tout prompt, commande ou template
- **Checklists** : Pour toute séquence de vérifications
- **Citations** : Pour les conseils (💡) et avertissements (⚠️)

### 2. Ton et style

#### 2.1 Voix

- **Impératif** pour les instructions : "Créez", "Exécutez", "Vérifiez"
- **Présent** pour les descriptions : "Cette étape produit...", "L'agent génère..."
- **Éviter** le conditionnel sauf pour les options : "Vous pourriez aussi..."

#### 2.2 Précision

| À éviter | Préférer |
|----------|----------|
| "Configurez correctement" | "Configurez avec les valeurs suivantes : [liste]" |
| "Testez bien" | "Exécutez `npm run test` et vérifiez 0 erreurs" |
| "Documentez si nécessaire" | "Ajoutez une entrée dans CHANGELOG.md" |
| "Environ X jours" | "1-2 jours" ou "2-4 heures" |

#### 2.3 Actionnable

Chaque section doit répondre à : **"Qu'est-ce que je fais concrètement maintenant ?"**

- Fournir les commandes exactes à exécuter
- Fournir les prompts exacts à utiliser avec l'agent
- Fournir les templates complets, pas des résumés

### 3. Cohérence avec le Framework

#### 3.1 Terminologie

Utiliser EXCLUSIVEMENT les termes définis dans le Framework :

| Terme correct | Termes à éviter |
|---------------|-----------------|
| Product Engineer (PE) | Développeur, Dev |
| SPEC | Ticket, Story technique |
| Boucle itérative | Sprint, Cycle |
| Synchronisation | Cérémonie, Meeting |
| AGENT-GUIDE | CLAUDE.md (sauf contexte Claude Code spécifique) |
| Outcome | Output (sauf contexte DoOD) |
| Definition of Output Done (DoOD) | Definition of Done |

#### 3.2 Responsabilités

Chaque action doit être attribuée à la bonne responsabilité AIAD :

| Responsabilité | Actions typiques |
|----------------|------------------|
| **PM** | PRD, Outcome Criteria, priorisation backlog, validation métier |
| **PE** | SPEC, orchestration agent, code review, intégration |
| **AE** | Configuration agents, AGENT-GUIDE, écosystème IA |
| **QA** | Stratégie tests, validation fonctionnelle, rapport QA |
| **Tech Lead** | ARCHITECTURE, décisions architecturales, dette technique |

#### 3.3 Références croisées

Lorsqu'un concept du Framework est appliqué, référencer le document source :

```markdown
> 📖 Référence : @framework/04-artefacts.md - Section "SPECS"
```

### 4. Prompts et templates

#### 4.1 Format des prompts

Tout prompt destiné à un agent IA doit :

1. Être dans un bloc de code avec langage approprié
2. Inclure les références aux artefacts (@PRD.md, @ARCHITECTURE.md, etc.)
3. Être prêt à copier-coller sans modification
4. Indiquer le mode de réflexion si pertinent (think, think hard, ultrathink)

```markdown
```
Implémente la fonctionnalité suivante :

**SPEC** : @docs/specs/[nom-spec].md
**Contexte** : @CLAUDE.md
**Architecture** : @docs/ARCHITECTURE.md

Instructions :
1. [Instruction précise 1]
2. [Instruction précise 2]

Montre ton plan avant de coder.
```
```

#### 4.2 Format des templates

Tout template doit :

1. Être complet et utilisable immédiatement
2. Inclure des placeholders explicites : `[Nom du projet]`, `[Description]`
3. Inclure des exemples concrets entre parenthèses si utile

### 5. Checklists et validations

#### 5.1 Format des checklists

```markdown
| ✓ | Élément | Vérification |
|---|---------|--------------|
| ☐ | [Élément 1] | [Comment vérifier] |
| ☐ | [Élément 2] | [Comment vérifier] |
```

#### 5.2 Critères de sortie

Chaque partie DOIT se terminer par une checklist de validation permettant de confirmer que la partie est complète avant de passer à la suivante.

### 6. Gestion des erreurs et troubleshooting

#### 6.1 Problèmes courants

Chaque partie complexe doit inclure une section :

```markdown
## Problèmes courants

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| [Symptôme] | [Cause] | [Action corrective] |
```

#### 6.2 Points d'escalade

Indiquer clairement quand escalader et vers qui :

```markdown
> ⚠️ **ESCALADE** : Si [condition], impliquez le Tech Lead avant de continuer.
```

---

## Règles spécifiques par partie

### 00-preambule.md

**Objectif** : Fournir le vocabulaire commun et la vue d'ensemble du processus.

**Doit contenir** :
- Glossaire complet (termes AIAD + termes outils)
- Matrice RACI alignée sur @framework/03-ecosysteme.md
- Diagramme visuel du processus (ASCII art)
- Configuration des postes par rôle

**Références principales** : @framework/03-ecosysteme.md

### 01-initialisation.md

**Objectif** : Guider pas à pas la mise en place des fondations d'un projet.

**Doit contenir** :
- Étapes séquencées avec dépendances explicites
- Prompts exacts pour créer PRD et ARCHITECTURE avec un LLM
- Template CLAUDE.md/AGENT-GUIDE complet
- Configuration des permissions, MCPs, SubAgents
- Checklist de fin d'initialisation bloquante

**Références principales** : @framework/04-artefacts.md, @framework/05-boucles-iteratives.md (Phase init)

### 02-planification.md

**Objectif** : Transformer une intention métier en SPEC exploitable par un agent IA.

**Doit contenir** :
- Process du rituel de planning
- Critères d'atomicité d'une tâche
- Template SPEC complet avec tous les champs
- Checklist qualité SPEC

**Références principales** : @framework/04-artefacts.md (SPECS), @framework/05-boucles-iteratives.md (Boucle 1)

### 03-developpement.md

**Objectif** : Décrire le workflow quotidien d'orchestration des agents IA.

**Doit contenir** :
- Workflow horaire type
- Cycle complet d'une fonctionnalité (7 étapes)
- Prompts structurés pour chaque étape
- Gestion des problèmes et règle des 3 itérations max

**Références principales** : @framework/05-boucles-iteratives.md (Boucle 2)

### 04-validation.md

**Objectif** : Assurer la qualité avant intégration.

**Doit contenir** :
- Process de validation QA (types de tests, niveaux)
- Template rapport de validation
- Process de validation PO
- Critères de décision (VALIDÉ / CORRECTIONS / REJET)

**Références principales** : @framework/04-artefacts.md (DoOD), @framework/05-boucles-iteratives.md (Boucle 3)

### 05-deploiement.md

**Objectif** : Livrer le code en production de manière contrôlée.

**Doit contenir** :
- Checklist pré-déploiement
- Commandes de déploiement staging/production
- Procédure de rollback
- Vérifications post-déploiement

**Références principales** : @framework/05-boucles-iteratives.md (Boucle 4)

### 06-rituels-amelioration.md

**Objectif** : Maintenir le rythme d'amélioration continue.

**Doit contenir** :
- Les 5 synchronisations avec format et fréquence
- Questions clés de la rétrospective IA
- Métriques essentielles par catégorie
- Process PDCA simplifié

**Références principales** : @framework/06-synchronisations.md, @framework/07-metriques.md

### 07-annexes.md

**Objectif** : Fournir des références rapides.

**Doit contenir** :
- Commandes Claude Code essentielles
- Troubleshooting par symptôme
- Checklist quotidienne PE
- FAQ

**Références principales** : Tous les documents du Framework

---

## Critères de qualité globaux

### Complétude

- [ ] Toutes les étapes d'un projet sont couvertes (init → production)
- [ ] Aucune étape ne nécessite de connaissance implicite
- [ ] Tous les templates sont fournis en entier
- [ ] Tous les prompts sont prêts à l'emploi

### Cohérence

- [ ] Terminologie 100% alignée avec le Framework
- [ ] Responsabilités correctement attribuées
- [ ] Références croisées vers le Framework présentes
- [ ] Pas de contradiction avec les principes AIAD

### Praticité

- [ ] Un novice peut suivre le guide sans aide externe
- [ ] Les durées estimées sont réalistes
- [ ] Les checklists permettent l'auto-validation
- [ ] Les problèmes courants sont anticipés

### Maintenabilité

- [ ] Structure modulaire (1 fichier = 1 partie)
- [ ] Références explicites facilitant les mises à jour
- [ ] Versioning clair (v1.0, v1.1, etc.)

---

## Process de réécriture

Pour réécrire une partie du Mode Opératoire :

1. **Lire** le fichier Framework correspondant (voir tableau de la section "Hiérarchie des parties")
2. **Identifier** les concepts clés à traduire en actions
3. **Rédiger** en respectant les règles de cette intention
4. **Vérifier** avec la checklist de qualité
5. **Référencer** les documents Framework utilisés

---

*Version 1.0 - Janvier 2026*
