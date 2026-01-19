# B.6 Agents Engineer

## Pourquoi cette annexe ?

Cette annexe détaille les responsabilités quotidiennes de l'Agents Engineer, le rôle dédié à l'optimisation de l'écosystème d'agents IA au sein d'une équipe AIAD.

---

## Vue d'Ensemble du Rôle

### Définition

L'Agents Engineer est responsable de la configuration, de l'optimisation et de la maintenance de l'écosystème d'agents IA utilisé par l'équipe. Ce rôle assure que les agents produisent un output de qualité, cohérent avec le projet.

### Positionnement

```
┌─────────────────────────────────────────────────────────────┐
│                    Product Manager                          │
│                   (Vision, Priorités)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agents Engineer                          │
│        (Configure les agents pour le contexte projet)       │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         ┌────────┐   ┌────────┐   ┌────────┐
         │ Agent  │   │ Agent  │   │ Agent  │
         │Principal│   │Quality │   │Security│
         └────────┘   └────────┘   └────────┘
              │             │             │
              └─────────────┼─────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Product Engineers                         │
│              (Utilisent les agents configurés)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Responsabilités Principales

### 1. Configuration de l'AGENT-GUIDE

**Objectif** : Créer et maintenir le fichier de contexte projet pour les agents.

```markdown
## Activités

### Création Initiale
- Analyser la stack technique du projet
- Documenter les conventions de nommage
- Identifier les patterns existants
- Collecter des exemples de code de référence

### Maintenance Continue
- Mettre à jour après chaque décision architecturale
- Ajouter les nouveaux patterns adoptés
- Supprimer les patterns obsolètes
- Intégrer les learnings des reviews

### Validation
- Tester les prompts avec le nouvel AGENT-GUIDE
- Vérifier que l'output respecte les conventions
- Ajuster si nécessaire
```

**Template de travail** :

```markdown
## Checklist AGENT-GUIDE

### Structure Projet
- [ ] Arborescence documentée
- [ ] Points d'entrée identifiés
- [ ] Modules et leurs responsabilités

### Conventions de Code
- [ ] Nommage (fichiers, variables, fonctions)
- [ ] Style (formatage, imports)
- [ ] Patterns (hooks, services, composants)

### Exemples de Référence
- [ ] Au moins 2 exemples par pattern majeur
- [ ] Exemples de tests
- [ ] Exemples de documentation

### Contraintes
- [ ] Dépendances à utiliser/éviter
- [ ] Patterns interdits
- [ ] Règles de sécurité
```

---

### 2. Sélection et Configuration des Agents

**Objectif** : Choisir les bons agents et les configurer pour le contexte projet.

```markdown
## Matrice de Sélection

| Besoin | Agent Recommandé | Configuration |
|--------|------------------|---------------|
| Développement général | Claude/GPT-4 | AGENT-GUIDE complet |
| Sécurité | Agent Security | Règles OWASP + contexte |
| Tests | Agent Quality | Framework + conventions |
| Architecture | Agent Architecture | Patterns + contraintes |
| Documentation | Agent Documentation | Templates + style |

## Process de Configuration

1. Évaluer le besoin
   - Quel problème résoudre ?
   - Quelle fréquence d'utilisation ?
   - Quels risques ?

2. Sélectionner l'agent approprié
   - Capacités vs besoins
   - Coût vs valeur
   - Intégration existante

3. Configurer le contexte
   - Prompt système
   - Fichiers de référence
   - Permissions

4. Tester et valider
   - Cas d'usage type
   - Edge cases
   - Performance
```

---

### 3. Optimisation des Prompts

**Objectif** : Améliorer continuellement la qualité des interactions avec les agents.

```markdown
## Cycle d'Optimisation

┌─────────────┐
│  Observer   │ ← Analyser les outputs des agents
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Identifier │ ← Repérer les patterns de succès/échec
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Améliorer  │ ← Ajuster AGENT-GUIDE et prompts
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Mesurer    │ ← Vérifier l'amélioration
└──────┬──────┘
       │
       └──────────→ (retour à Observer)
```

**Techniques d'Optimisation** :

```markdown
## 1. Enrichissement du Contexte

### Avant
"Crée un composant de liste"

### Après
"Crée un composant de liste en suivant le pattern de TaskList.tsx.
Utilise notre hook useQuery et les composants du design system."

## 2. Exemples de Référence

### Pattern "Few-Shot"
"Voici comment on fait les hooks dans ce projet :
[Exemple 1]
[Exemple 2]
Crée un hook similaire pour..."

## 3. Contraintes Explicites

### Pattern "Guardrails"
"Contraintes :
- Utiliser TypeScript strict
- Pas de any
- Tests obligatoires
- Max 50 lignes par fonction"

## 4. Feedback Structuré

### Pattern "Itératif"
"Bon début. Ajuste :
1. Ligne 15 : utilise notre type Task, pas un nouveau
2. Ligne 23 : on préfère useMemo ici
3. Ajoute le cas d'erreur"
```

---

### 4. Création de SubAgents

**Objectif** : Développer des agents spécialisés pour les besoins récurrents du projet.

```markdown
## Cas d'Usage pour SubAgents

| Situation | SubAgent | Valeur |
|-----------|----------|--------|
| Migrations fréquentes | Migration Agent | Automatise le pattern |
| API standardisée | API Agent | Génère routes + tests |
| Composants UI | Component Agent | Respecte le design system |
| Tests spécifiques | Test Agent | Connaît les mocks/fixtures |

## Process de Création

### 1. Identifier le Besoin
- Tâche répétitive ?
- Pattern stable ?
- ROI positif ?

### 2. Définir le Scope
- Input attendu
- Output attendu
- Contraintes

### 3. Créer le Prompt Système
```

```markdown
# [Nom] SubAgent

## Rôle
Tu es un agent spécialisé dans [domaine].

## Contexte Projet
[Extrait pertinent de AGENT-GUIDE]

## Tâche
Quand on te demande de [action], tu dois :
1. [Étape 1]
2. [Étape 2]
3. [Étape 3]

## Contraintes
- [Contrainte 1]
- [Contrainte 2]

## Exemples
[Exemple input → output]
```

```markdown
### 4. Tester et Itérer
- Cas nominal
- Edge cases
- Intégration avec workflow
```

---

### 5. Formation et Support de l'Équipe

**Objectif** : S'assurer que l'équipe utilise efficacement les agents.

```markdown
## Activités de Formation

### Onboarding Nouveau Membre
- Présentation de l'écosystème d'agents
- Demo des cas d'usage principaux
- Bonnes pratiques de prompting
- Pièges courants à éviter

### Sessions Régulières
- "Prompt of the Week" : partage de prompts efficaces
- Retours d'expérience
- Nouvelles fonctionnalités des agents

### Documentation
- Guide d'utilisation par agent
- Catalogue de prompts validés
- FAQ et troubleshooting

## Support Quotidien

### Répondre aux Questions
- "Comment faire X avec l'agent ?"
- "L'agent ne comprend pas mon contexte"
- "L'output n'est pas bon, que faire ?"

### Pair Prompting
- Session avec un PE pour résoudre un cas complexe
- Démonstration des techniques d'optimisation

### Review des Usages
- Identifier les mauvaises pratiques
- Proposer des améliorations
```

---

## Workflow Quotidien Type

```markdown
## Matin (30 min)

### Review des Métriques
- Qualité des outputs (retours de la veille)
- Problèmes signalés
- Patterns récurrents

### Priorisation
- Quels ajustements faire aujourd'hui ?
- Support nécessaire pour qui ?

## Pendant la Journée

### Support Réactif
- Répondre aux questions dans le channel dédié
- Pair prompting si nécessaire

### Amélioration Continue
- Mettre à jour AGENT-GUIDE si nouvelle décision
- Créer/améliorer des SubAgents si besoin identifié

### Veille
- Nouvelles versions des agents
- Nouvelles techniques de prompting
- Retours communauté

## Fin de Journée (15 min)

### Documentation
- Noter les learnings
- Mettre à jour la FAQ si questions récurrentes

### Préparation Lendemain
- Actions identifiées
- Support planifié
```

---

## Métriques de Succès

```markdown
## Métriques Quantitatives

| Métrique | Cible | Mesure |
|----------|-------|--------|
| Taux de satisfaction PE | > 80% | Survey mensuel |
| Temps moyen par feature | -20% vs baseline | Tracking |
| Corrections post-génération | < 3 par output | Review |
| Questions support/jour | < 5 | Channel |

## Métriques Qualitatives

### Feedback Équipe
- "Les agents comprennent notre projet"
- "L'output est utilisable directement"
- "Je sais quand utiliser quel agent"

### Observation
- Code généré respecte les conventions
- Tests générés sont pertinents
- Documentation générée est utile
```

---

## Anti-patterns à Éviter

### 1. L'AGENT-GUIDE Statique

```markdown
❌ Anti-pattern
AGENT-GUIDE créé au début et jamais mis à jour.

✅ Solution
Mettre à jour à chaque :
- Nouvelle décision architecturale
- Nouveau pattern adopté
- Feedback négatif récurrent
```

### 2. Le Sur-Outillage

```markdown
❌ Anti-pattern
Configurer 10 agents dès le départ "au cas où".

✅ Solution
Commencer avec 1-2 agents.
Ajouter quand un besoin réel est identifié.
```

### 3. L'Absence de Mesure

```markdown
❌ Anti-pattern
"Ça a l'air de marcher" sans données.

✅ Solution
Mesurer :
- Temps de développement
- Qualité output
- Satisfaction équipe
```

### 4. Le Siloing

```markdown
❌ Anti-pattern
Agents Engineer travaille seul, équipe ne comprend pas.

✅ Solution
- Transparence sur les configurations
- Formation continue
- Équipe peut contribuer à l'AGENT-GUIDE
```

### 5. Le Prompt Magique

```markdown
❌ Anti-pattern
Chercher le "prompt parfait" qui marche pour tout.

✅ Solution
Accepter que :
- Le contexte compte plus que le prompt
- L'itération est normale
- Différents cas = différentes approches
```

---

## Collaboration avec les Autres Rôles

```markdown
## Avec Product Manager
- Comprendre les priorités pour focus l'optimisation
- Proposer des agents pour accélérer certains outcomes
- Remonter les limitations techniques des agents

## Avec Product Engineers
- Support quotidien sur l'utilisation des agents
- Collecter le feedback sur la qualité des outputs
- Pair prompting sur les cas complexes

## Avec Tech Lead
- Aligner AGENT-GUIDE avec l'architecture
- Valider les patterns documentés
- Discuter des contraintes techniques

## Avec QA Engineer
- Configurer les agents pour générer des tests
- Intégrer les critères qualité dans les prompts
- Automatiser certaines vérifications
```

---

## Évolution du Rôle

```markdown
## Démarrage (Mois 1-3)
Focus : Mise en place
- Créer l'AGENT-GUIDE initial
- Configurer les agents de base
- Former l'équipe

## Croissance (Mois 3-6)
Focus : Optimisation
- Améliorer les prompts
- Créer des SubAgents
- Mesurer et itérer

## Maturité (Mois 6+)
Focus : Scalabilité
- Documenter pour d'autres équipes
- Contribuer aux bonnes pratiques globales
- Innover sur les usages
```

---

## Ressources

- [A.3 AGENT-GUIDE Template](A3-agent-guide.md)
- [F Catalogue d'Agents](F1-agent-security.md)
- [G.6 Création de SubAgents](G6-creation-subagents.md)
- [H.1 Prompts Efficaces](H1-prompts-efficaces.md)

---

*Retour aux [Annexes](../framework/08-annexes.md)*
