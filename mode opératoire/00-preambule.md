# PARTIE 0 : PRÉAMBULE

| | |
|---|---|
| 🎭 **ACTEUR** | Tous |
| 📥 **ENTRÉES** | Décision de démarrer un projet AIAD |
| 📤 **SORTIES** | Vocabulaire commun, responsabilités attribuées, vision du processus |
| ⏱️ **DURÉE** | 30 minutes de lecture |
| 🔗 **DÉPENDANCES** | Aucune |

Cette partie fournit le vocabulaire commun, les responsabilités et la vue d'ensemble du processus. Lisez-la avant de commencer tout projet AIAD.

> 📖 Référence : @framework/03-ecosysteme.md

---

## 0.1 Glossaire complet

### 0.1.1 Termes AIAD

| Terme | Définition |
|-------|------------|
| **AIAD** | AI-Agent Iterative Development. Framework méthodologique pour le développement logiciel assisté par agents IA. |
| **Responsabilité** | Ensemble d'actions à assumer. Une personne peut porter plusieurs responsabilités. |
| **Product Manager (PM)** | Responsable de la valeur. Définit le Product Goal, maintient le backlog, valide les outcomes. |
| **Product Engineer (PE)** | Responsable de l'orchestration. Rédige les SPECs, orchestre les agents IA, valide le code généré. |
| **Agents Engineer (AE)** | Responsable de l'écosystème IA. Configure les agents, définit la gouvernance, optimise les performances. |
| **QA Engineer (QA)** | Responsable de la qualité. Définit la stratégie de tests, valide la pertinence des tests générés. |
| **Tech Lead (TL)** | Responsable de la cohérence technique. Maintient l'ARCHITECTURE, valide les décisions architecturales. |
| **Supporter** | Stakeholder qui crée les conditions de succès sans participer au quotidien. |
| **PRD** | Product Requirement Document. Capture la vision produit et les Outcome Criteria. |
| **ARCHITECTURE** | Document de référence technique définissant la structure du système. |
| **AGENT-GUIDE** | Document de configuration contextuelle de l'agent IA (ex: CLAUDE.md). |
| **SPEC** | Spécification technique détaillée pour une tâche atomique. |
| **Outcome Criteria** | Critères mesurables définissant le succès d'une fonctionnalité. |
| **DoOD** | Definition of Output Done. Critères de complétion d'une tâche. |
| **DoOuD** | Definition of Outcome Done. Critères de succès business d'une fonctionnalité. |
| **Boucle itérative** | Cycle de développement : Planifier → Implémenter → Valider → Intégrer. |
| **Synchronisation** | Réunion intentionnelle avec objectif et format définis. |

### 0.1.2 Termes Claude Code

| Terme | Définition |
|-------|------------|
| **Claude Code** | Agent IA de codage Anthropic exécuté dans le terminal. |
| **CLAUDE.md** | Fichier AGENT-GUIDE spécifique à Claude Code. |
| **MCP** | Model Context Protocol. Permet à Claude d'accéder à des outils externes. |
| **SubAgent** | Agent IA spécialisé invoqué par l'agent principal pour des tâches spécifiques. |
| **Skill** | Compétence que Claude active automatiquement selon le contexte. |
| **Hook** | Commande shell exécutée automatiquement à un moment précis du workflow. |
| **Plan Mode** | Mode de planification (Shift+Tab) pour valider une approche avant implémentation. |

### 0.1.3 Commandes Claude Code essentielles

| Commande | Action |
|----------|--------|
| `/clear` | Nettoie le contexte. Exécutez avant chaque nouvelle tâche. |
| `/context` | Affiche l'utilisation du contexte (tokens consommés). |
| `/rewind` | Annule les dernières actions de Claude. |
| `/compact` | Compacte la conversation pour libérer du contexte. |

---

## 0.2 Responsabilités AIAD

> 💡 **Principe fondamental** : Dans AIAD, il n'y a pas de "rôles" mais des **responsabilités**. Une personne peut en assumer plusieurs selon la taille de l'équipe.

### 0.2.1 Les cinq responsabilités clés

| Responsabilité | Question centrale | Focus principal |
|----------------|-------------------|-----------------|
| **PM** | Construit-on la bonne chose ? | Valeur |
| **PE** | L'agent produit-il le bon résultat ? | Orchestration |
| **AE** | L'écosystème est-il optimal ? | Configuration |
| **QA** | Le résultat est-il fiable ? | Qualité |
| **Tech Lead** | Le système reste-t-il cohérent ? | Architecture |

### 0.2.2 Combinaisons par taille d'équipe

**Équipe de 2-3 personnes :**

| Personne | Responsabilités |
|----------|-----------------|
| A | PM + Tech Lead |
| B | PE + QA + AE |

**Équipe de 4-6 personnes :**

| Personne | Responsabilités |
|----------|-----------------|
| A | PM |
| B | PE + Tech Lead |
| C | PE + AE |
| D | QA |

**Équipe de 7+ personnes :**

Chaque responsabilité peut être portée par une personne dédiée.

> ⚠️ **Règle d'or** : Quelle que soit la taille de l'équipe, chaque responsabilité doit avoir un porteur clairement identifié.

---

## 0.3 Matrice RACI

**Légende** : R = Réalise, A = Approuve, C = Consulté, I = Informé

### 0.3.1 Phase d'Initialisation

| Activité | PM | TL | PE | AE | QA |
|----------|----|----|----|----|-----|
| Cadrage initial (Product Goal) | R/A | C | I | I | I |
| Rédaction PRD | R/A | C | C | I | I |
| Document ARCHITECTURE | C | R/A | C | I | I |
| Création AGENT-GUIDE | I | C | C | R/A | I |
| Stratégie de tests | I | I | C | I | R/A |

### 0.3.2 Phase de Développement

| Activité | PM | TL | PE | AE | QA |
|----------|----|----|----|----|-----|
| Rédaction SPEC | C | C | R/A | I | C |
| Orchestration agent IA | I | I | R/A | C | I |
| Validation code généré | I | C | R/A | I | C |
| Code review | I | A | R | I | C |
| Génération tests | I | I | R | I | A/C |

### 0.3.3 Phase de Validation

| Activité | PM | TL | PE | AE | QA |
|----------|----|----|----|----|-----|
| Tests automatisés | I | I | R | I | A |
| Tests exploratoires | I | I | I | I | R/A |
| Validation Outcome Criteria | R/A | I | C | I | C |
| Rapport de validation | I | I | C | I | R/A |

### 0.3.4 Phase de Déploiement

| Activité | PM | TL | PE | AE | QA |
|----------|----|----|----|----|-----|
| Checklist pré-déploiement | I | A | R | I | C |
| Déploiement staging | I | I | R/A | I | C |
| Déploiement production | A | C | R | I | I |
| Vérification post-déploiement | I | I | R | I | A |

---

## 0.4 Vue d'ensemble du processus

### 0.4.1 Diagramme des phases

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PROCESSUS AIAD                               │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│ 1. INITIALISATION│
│                  │
│ PRD              │
│ ARCHITECTURE     │
│ AGENT-GUIDE      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ 2. PLANIFIER     │────▶│ 3. IMPLÉMENTER   │────▶│ 4. VALIDER       │
│                  │     │                  │     │                  │
│ Backlog          │     │ Orchestration    │     │ Tests            │
│ SPECs            │     │ Code généré      │     │ Review           │
│ DoOD             │     │ Tests générés    │     │ Outcome Criteria │
└──────────────────┘     └──────────────────┘     └────────┬─────────┘
         ▲                                                  │
         │                                                  ▼
         │                                        ┌──────────────────┐
         │                                        │ 5. INTÉGRER      │
         │                                        │                  │
         │◀───────────────────────────────────────│ Merge            │
         │         Nouvelle itération             │ Déploiement      │
         │                                        │ Monitoring       │
         │                                        └──────────────────┘
```

### 0.4.2 Séquence des phases

| Phase | Durée indicative | Livrables clés | Acteur principal |
|-------|------------------|----------------|------------------|
| **Initialisation** | 3-7 jours | PRD, ARCHITECTURE, AGENT-GUIDE | PM, TL, AE |
| **Planifier** | 2-4 heures | SPECs priorisées, DoOD | PM, PE |
| **Implémenter** | 80% de l'itération | Code, tests | PE |
| **Valider** | Variable | Rapport QA, validation PM | QA, PM |
| **Intégrer** | 0.5-1 jour | Application déployée | PE |

### 0.4.3 Les 4 boucles itératives

```
Boucle 1 : PLANIFIER    │ Intention → SPEC validée
Boucle 2 : IMPLÉMENTER  │ SPEC → Code + Tests
Boucle 3 : VALIDER      │ Code → Validation QA + PM
Boucle 4 : INTÉGRER     │ Code validé → Production
```

> 📖 Référence : @framework/05-boucles-iteratives.md

---

## 0.5 Configuration des postes par responsabilité

### 0.5.1 Product Engineer (PE)

| Catégorie | Outil | Utilisation |
|-----------|-------|-------------|
| **Terminal** | Warp / iTerm2 | Exécution Claude Code |
| **IDE** | VS Code / Cursor | Visualisation et édition code |
| **Agent IA** | Claude Code | Orchestration principale |
| **MCP** | Context7, Playwright | Extensions contextuelles |
| **Versioning** | Git + GitHub/GitLab | Gestion du code |

**Vérification de l'installation :**

```bash
claude --version   # Vérifiez que Claude Code est installé
git --version      # Vérifiez que Git est installé
```

### 0.5.2 Agents Engineer (AE)

| Catégorie | Outil | Utilisation |
|-----------|-------|-------------|
| **Configuration** | Éditeur de code | Modification AGENT-GUIDE |
| **MCPs** | Serveurs MCP | Extensions de capacités |
| **Monitoring** | Dashboard Claude | Suivi des performances |
| **Documentation** | Markdown | Patterns et bonnes pratiques |

### 0.5.3 Product Manager (PM)

| Catégorie | Outil | Utilisation |
|-----------|-------|-------------|
| **Documentation** | Notion / Confluence | PRD, backlog |
| **Collaboration** | Figma / Miro | Maquettes, workshops |
| **Analytics** | Outils métier | Mesure des outcomes |

### 0.5.4 Tech Lead (TL)

| Catégorie | Outil | Utilisation |
|-----------|-------|-------------|
| **Architecture** | Draw.io / Mermaid | Diagrammes |
| **Documentation** | Markdown | Document ARCHITECTURE |
| **Review** | GitHub/GitLab | Code review, PR |

### 0.5.5 QA Engineer (QA)

| Catégorie | Outil | Utilisation |
|-----------|-------|-------------|
| **Tests auto** | Framework projet | Exécution tests |
| **Tests manuels** | Navigateur | Tests exploratoires |
| **Reporting** | Markdown | Rapports de validation |

---

## 0.6 Checklist de validation du préambule

Avant de passer à la partie suivante, vérifiez :

| ✓ | Élément | Vérification |
|---|---------|--------------|
| ☐ | Vocabulaire | Tous les termes du glossaire sont compris |
| ☐ | Responsabilités | Chaque responsabilité a un porteur identifié |
| ☐ | RACI | La matrice est validée par l'équipe |
| ☐ | Processus | La vue d'ensemble est comprise |
| ☐ | Postes | Les outils sont installés et configurés |

---

## Problèmes courants

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| Confusion sur qui fait quoi | Responsabilités non attribuées explicitement | Remplissez le tableau de combinaison selon votre taille d'équipe |
| Terminologie incohérente | Utilisation de termes hors glossaire | Affichez le glossaire et référencez-le systématiquement |
| Outils manquants | Installation incomplète | Suivez la checklist de configuration du poste |

> ⚠️ **ESCALADE** : Si les responsabilités ne peuvent pas être attribuées clairement (personne indisponible, compétences manquantes), impliquez un Supporter avant de continuer.

---

*Partie suivante : [01-initialisation.md](01-initialisation.md)*
