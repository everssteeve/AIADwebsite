# PARTIE 7 : ANNEXES

| | |
|---|---|
| 🎯 **OBJECTIF** | Fournir des références rapides pour le quotidien |
| 📖 **RÉFÉRENCES** | Tous les documents du Framework AIAD |

---

## 7.1 Commandes Claude Code essentielles

### 7.1.1 Commandes de session

| Commande | Description | Cas d'usage |
|----------|-------------|-------------|
| `/clear` | Nettoie le contexte de conversation | Avant chaque nouvelle tâche |
| `/context` | Affiche l'utilisation du contexte actuel | Vérifier l'espace disponible |
| `/rewind` | Annule les dernières actions | Corriger une erreur de l'agent |
| `/model` | Change de modèle (Haiku, Sonnet, Opus) | Adapter la puissance au besoin |
| `/init` | Initialise ou met à jour CLAUDE.md | Démarrage de projet |
| `/agents` | Gère les SubAgents | Délégation de tâches |

### 7.1.2 Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Esc` | Interrompt Claude en cours d'exécution |
| `Shift+Tab` | Change le mode d'acceptation (auto/manuel) |
| `Tab` | Accepte la suggestion courante |
| `Ctrl+C` | Annule la commande en cours |

### 7.1.3 Modes de réflexion

| Mode | Déclencheur | Usage |
|------|-------------|-------|
| Standard | Aucun | Tâches simples et directes |
| `think` | "think" dans le prompt | Tâches nécessitant réflexion |
| `think hard` | "think hard" dans le prompt | Problèmes complexes |
| `ultrathink` | "ultrathink" dans le prompt | Architecture et décisions critiques |

> 💡 **Conseil** : Utilisez `think hard` pour les SPECs complexes et `ultrathink` pour les décisions architecturales.

---

## 7.2 Troubleshooting par symptôme

### 7.2.1 Problèmes de génération de code

| Symptôme | Cause probable | Solution |
|----------|----------------|----------|
| Claude ne répond pas | Contexte saturé | `/clear` puis réessayer |
| Code hors sujet | SPEC imprécise ou contexte manquant | Reformuler SPEC avec exemples concrets |
| Code ne respecte pas les conventions | AGENT-GUIDE incomplet | Mettre à jour AGENT-GUIDE avec règles manquantes |
| Erreurs de compilation récurrentes | Stack mal documentée | Vérifier section Stack dans AGENT-GUIDE |
| Code générique, non adapté au projet | Manque de contexte métier | Enrichir vocabulaire métier dans AGENT-GUIDE |

### 7.2.2 Problèmes d'outils et intégrations

| Symptôme | Cause probable | Solution |
|----------|----------------|----------|
| MCP ne fonctionne pas | Configuration incorrecte | `claude mcp list` pour vérifier |
| SubAgent non trouvé | Chemin incorrect | Vérifier `.claude/agents/` |
| Commande non reconnue | Version Claude Code obsolète | Mettre à jour Claude Code |
| Permissions refusées | Configuration sandbox | Vérifier permissions dans settings |

### 7.2.3 Problèmes de qualité

| Symptôme | Cause probable | Solution |
|----------|----------------|----------|
| Tests échouent systématiquement | Tests mal spécifiés dans SPEC | Ajouter exemples de tests attendus |
| Régression après modification | Impact non anticipé | Exécuter suite de tests complète |
| Code dupliqué généré | Patterns non documentés | Ajouter patterns à AGENT-GUIDE |
| Performance dégradée | Budgets non définis | Définir budgets dans ARCHITECTURE |

> ⚠️ **ESCALADE** : Si un problème persiste après 3 tentatives de correction, impliquez le Tech Lead ou l'AE.

---

## 7.3 Checklist quotidienne PE

### 7.3.1 Démarrage de journée

| ✓ | Activité | Vérification |
|---|----------|--------------|
| ☐ | Participer à la synchronisation quotidienne | Blocages identifiés |
| ☐ | Consulter les tâches assignées | Backlog à jour |
| ☐ | `/clear` avant première tâche | Contexte propre |
| ☐ | Vérifier AGENT-GUIDE à jour | Dernières notes d'apprentissage |

### 7.3.2 Pour chaque tâche

| ✓ | Activité | Vérification |
|---|----------|--------------|
| ☐ | Lire SPEC complète avant de prompter | Compréhension du périmètre |
| ☐ | Demander plan avant génération | "Montre ton plan avant de coder" |
| ☐ | Valider code généré | Revue humaine systématique |
| ☐ | Exécuter les tests | 0 échec |
| ☐ | Vérifier conventions respectées | Linting OK |

### 7.3.3 Fin de journée

| ✓ | Activité | Vérification |
|---|----------|--------------|
| ☐ | Mettre à jour AGENT-GUIDE | Notes d'apprentissage ajoutées |
| ☐ | Commit et push | Code sauvegardé |
| ☐ | Mettre à jour statut des tâches | Backlog reflète réalité |
| ☐ | Documenter blocages éventuels | Prêt pour lendemain |

---

## 7.4 Checklists par responsabilité

### 7.4.1 Checklist PM (hebdomadaire)

| ✓ | Activité | Vérification |
|---|----------|--------------|
| ☐ | Revoir Outcome Criteria des fonctionnalités livrées | Métriques collectées |
| ☐ | Prioriser backlog | Valeur business ordonnée |
| ☐ | Préparer alignment sync | Objectifs semaine suivante |
| ☐ | Analyser feedback utilisateurs | Insights documentés |

### 7.4.2 Checklist Tech Lead (hebdomadaire)

| ✓ | Activité | Vérification |
|---|----------|--------------|
| ☐ | Revoir décisions architecturales en attente | ADR à jour |
| ☐ | Évaluer dette technique | Ratio dette visible |
| ☐ | Préparer tech review | Points d'attention identifiés |
| ☐ | Valider conformité code généré | >90% conforme |

### 7.4.3 Checklist AE (mensuelle)

| ✓ | Activité | Vérification |
|---|----------|--------------|
| ☐ | Auditer écosystème agents | Usage réel mesuré |
| ☐ | Revoir AGENT-GUIDE global | Pertinence des règles |
| ☐ | Explorer nouveaux agents | Veille technologique |
| ☐ | Mesurer satisfaction PE | Score >8/10 |

### 7.4.4 Checklist QA (par release)

| ✓ | Activité | Vérification |
|---|----------|--------------|
| ☐ | Valider couverture tests | Seuils atteints |
| ☐ | Conduire tests exploratoires | Scénarios edge cases |
| ☐ | Rédiger rapport validation | Décision documentée |
| ☐ | Confirmer DoOD | Tous critères cochés |

---

## 7.5 Templates de prompts rapides

### 7.5.1 Prompt de démarrage de tâche

```
Implémente la fonctionnalité suivante :

**SPEC** : @docs/specs/[nom-spec].md
**Contexte** : @CLAUDE.md
**Architecture** : @docs/ARCHITECTURE.md

Instructions :
1. Lis d'abord la SPEC complète
2. Montre ton plan avant de coder
3. Implémente étape par étape
4. Génère les tests correspondants
```

### 7.5.2 Prompt de correction

```
Le code généré a le problème suivant :
[Description précise du problème]

Erreur observée :
[Message d'erreur exact]

Comportement attendu :
[Ce qui devrait se passer]

Corrige en respectant @CLAUDE.md
```

### 7.5.3 Prompt de revue

```
Revois le code suivant et identifie :
1. Les violations de @CLAUDE.md
2. Les problèmes de sécurité potentiels
3. Les optimisations de performance possibles
4. Les tests manquants

Code à revoir :
[Code ou référence fichier]
```

### 7.5.4 Prompt de refactoring

```
Refactorise le code suivant en respectant :
- Les patterns définis dans @docs/ARCHITECTURE.md
- Les conventions de @CLAUDE.md

Objectif du refactoring :
[Amélioration ciblée]

Code source :
[Fichier ou code]
```

---

## 7.6 FAQ

### 7.6.1 Questions sur AIAD

| Question | Réponse |
|----------|---------|
| AIAD remplace-t-il les développeurs ? | Non. AIAD transforme le rôle en orchestrateur d'agents IA. Le PE reste indispensable pour la stratégie, la validation et les décisions. |
| Faut-il adopter tout AIAD d'un coup ? | Non. Commencez par les artefacts (AGENT-GUIDE, SPECs), puis ajoutez les rituels progressivement. |
| Quelle taille d'équipe minimum ? | 2-3 personnes suffisent. Les responsabilités peuvent être combinées (PM+Tech Lead, PE+QA). |
| AIAD fonctionne-t-il pour tous les projets ? | AIAD est optimisé pour le développement de produits logiciels. Les projets purement exploratoires ou R&D peuvent nécessiter des adaptations. |

### 7.6.2 Questions sur les résultats

| Question | Réponse |
|----------|---------|
| En combien de temps voit-on des résultats ? | 2-4 semaines pour les premiers gains de productivité. 2-3 mois pour une adoption complète. |
| Quel gain de productivité attendre ? | Ratio code généré/manuel >80/20 avec first-time success rate >70% une fois l'écosystème calibré. |
| Comment mesurer le succès ? | Suivez les métriques définies dans @framework/07-metriques.md : productivité, qualité, efficacité IA, outcomes, équipe. |

### 7.6.3 Questions sur les outils

| Question | Réponse |
|----------|---------|
| Claude Code est-il obligatoire ? | Non. AIAD fonctionne avec tout agent IA capable de générer du code (Cursor, Copilot, etc.). Claude Code est recommandé pour son intégration native. |
| Peut-on utiliser plusieurs agents ? | Oui. L'AE configure l'écosystème avec agents spécialisés (sécurité, qualité, documentation). Voir @framework/03-ecosysteme.md. |
| Comment choisir entre les modèles ? | Haiku pour tâches simples et rapides, Sonnet pour le quotidien, Opus pour architecture et décisions complexes. |

### 7.6.4 Questions sur les artefacts

| Question | Réponse |
|----------|---------|
| Quelle longueur pour une SPEC ? | Une SPEC doit être atomique (réalisable en <4h). Si elle dépasse 2 pages, découpez-la. |
| À quelle fréquence mettre à jour AGENT-GUIDE ? | Après chaque session de développement pour les notes d'apprentissage. Revue complète mensuelle. |
| Qui rédige le PRD ? | Le PM rédige, mais en collaboration avec l'équipe. Un PRD isolé est souvent déconnecté de la réalité. |

---

## 7.7 Glossaire rapide

| Terme | Définition |
|-------|------------|
| **AGENT-GUIDE** | Document de contexte pour les agents IA (ex: CLAUDE.md) |
| **AE** | Agents Engineer - Responsable de l'écosystème IA |
| **Boucle itérative** | Cycle Planifier → Implémenter → Valider → Intégrer |
| **DoOD** | Definition of Output Done - Critères pour qu'un incrément soit "Done" |
| **DoOuD** | Definition of Outcome Done - Critères pour qu'un outcome soit atteint |
| **MCP** | Model Context Protocol - Protocole d'extension des capacités agent |
| **Outcome** | Résultat de valeur pour les utilisateurs (vs Output = livrable technique) |
| **PE** | Product Engineer - Responsable de l'orchestration des agents |
| **PM** | Product Manager - Responsable de la valeur produit |
| **PRD** | Product Requirement Document - Document de vision produit |
| **QA** | Quality Assurance - Responsable de la qualité |
| **SPEC** | Spécification technique atomique pour un agent IA |
| **SubAgent** | Agent spécialisé délégué pour une tâche spécifique |
| **Synchronisation** | Rituel d'alignement d'équipe (vs "meeting" ou "cérémonie") |
| **Tech Lead** | Responsable de la cohérence technique et de l'architecture |

---

## 7.8 Références croisées

### 7.8.1 Par activité → Document

| Activité | Document de référence |
|----------|----------------------|
| Comprendre les responsabilités | @framework/03-ecosysteme.md |
| Créer PRD, ARCHITECTURE, SPEC | @framework/04-artefacts.md |
| Comprendre les boucles de travail | @framework/05-boucles-iteratives.md |
| Organiser les synchronisations | @framework/06-synchronisations.md |
| Mesurer la performance | @framework/07-metriques.md |

### 7.8.2 Par problème → Mode Opératoire

| Problème | Section du Mode Opératoire |
|----------|---------------------------|
| Démarrer un nouveau projet | @mode-operatoire/01-initialisation.md |
| Transformer intention en SPEC | @mode-operatoire/02-planification.md |
| Orchestrer un agent pour coder | @mode-operatoire/03-developpement.md |
| Valider une fonctionnalité | @mode-operatoire/04-validation.md |
| Déployer en production | @mode-operatoire/05-deploiement.md |
| Améliorer continuellement | @mode-operatoire/06-rituels-amelioration.md |

---

> 📖 **Référence** : Ce document synthétise les éléments de tous les documents du Framework AIAD pour un accès rapide au quotidien.

---

*Version 1.0 - Janvier 2026*
