# PARTIE 5 : PHASE DE DÉPLOIEMENT (INTÉGRER)

Le déploiement met le code validé en production et prépare la prochaine itération. Cette phase applique la Boucle 4 du Framework AIAD.

> 📖 Référence : @framework/05-boucles-iteratives.md - Section "Boucle 4 : Intégrer"

---

## 5.1 Vue d'ensemble du processus d'intégration

| Étape | Responsable | Focus | Durée |
|-------|-------------|-------|-------|
| Revue de code | PE | Qualité, standards | 15-30 min |
| Préparation à l'intégration | PE | Conflits, tests | 15-30 min |
| CI/CD et PR | PE | Build, validations automatisées | 15-30 min |
| Déploiement staging | PE | Vérification environnement | 15-30 min |
| Déploiement production | PE | Mise en ligne | 15-30 min |
| Vérification post-déploiement | PE + QA | Smoke tests, monitoring | 15-30 min |
| Clôture | PE | Documentation, nettoyage | 15 min |

**Ce qui déclenche cette phase** : Validation OK (Boucle 3 complète).

**Ce que produit cette phase** :
- Code en production
- Documentation mise à jour (CHANGELOG, AGENT-GUIDE)
- Contexte prêt pour la prochaine fonctionnalité

**Objectif** : Temps merge à production <1h (idéal <15min).

---

## 5.2 Étape : Revue de code

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Code validé (Boucle 3), commit local |
| 📤 **SORTIES** | Code approuvé pour intégration |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | Validation complète (04-validation.md) |

### 5.2.1 Type de revue selon la criticité

| Criticité | Type de revue | Réviseur |
|-----------|---------------|----------|
| Faible (cosmétique, refactoring mineur) | Self-review | PE auteur |
| Moyenne (feature standard) | Peer review | Autre PE |
| Haute (sécurité, données sensibles, infrastructure) | Tech Lead review | Tech Lead |

### 5.2.2 Checklist de revue de code

| ✓ | Catégorie | Vérification |
|---|-----------|--------------|
| ☐ | **Alignement** | Le code respecte la SPEC |
| ☐ | **Alignement** | Le code respecte l'ARCHITECTURE |
| ☐ | **Qualité** | Conventions de nommage respectées |
| ☐ | **Qualité** | Pas de code mort ou commenté |
| ☐ | **Qualité** | Complexité maîtrisée (fonctions <30 lignes) |
| ☐ | **Sécurité** | Pas de secrets en dur |
| ☐ | **Sécurité** | Inputs validés et sanitizés |
| ☐ | **Tests** | Tests pertinents et lisibles |
| ☐ | **Tests** | Cas limites couverts |

> 💡 **CONSEIL** : Pour le code généré par agent IA, concentrez la revue sur la logique métier et les cas limites. L'agent respecte généralement les conventions techniques.

---

## 5.3 Étape : Préparation à l'intégration

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Code approuvé |
| 📤 **SORTIES** | Branche prête à pusher |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | Revue de code OK |

### 5.3.1 Procédure de synchronisation

Exécutez les commandes suivantes dans l'ordre :

```bash
# 1. Récupérer les dernières modifications de main
git fetch origin main

# 2. Rebaser sur main pour un historique linéaire
git rebase origin/main

# 3. Résoudre les conflits éventuels
# Si conflits : éditer les fichiers, puis :
git add .
git rebase --continue

# 4. Vérifier que les tests passent toujours
npm run test

# 5. Vérifier que le build fonctionne
npm run build
```

### 5.3.2 Résolution des conflits

| Type de conflit | Action |
|-----------------|--------|
| Conflit simple (formatage, imports) | Résoudre manuellement, garder les deux |
| Conflit logique (même fonction modifiée) | Analyser avec l'agent IA, merger intelligemment |
| Conflit architectural | Escalader au Tech Lead |

**Prompt pour résolution de conflit avec agent IA** :

```
Aide-moi à résoudre ce conflit Git.

**Fichier** : [nom-du-fichier]
**Version main** :
[coller la version main]

**Ma version** :
[coller votre version]

**Contexte** : @CLAUDE.md, @docs/ARCHITECTURE.md

Propose une résolution qui :
1. Préserve les deux modifications si compatibles
2. Respecte l'architecture du projet
3. Maintient les tests fonctionnels
```

> ⚠️ **ESCALADE** : Si le conflit touche plus de 3 fichiers ou implique des changements architecturaux, impliquez le Tech Lead avant de résoudre.

---

## 5.4 Étape : CI/CD et Pull Request

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Branche synchronisée et testée |
| 📤 **SORTIES** | PR mergée |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | Préparation à l'intégration OK |

### 5.4.1 Création de la Pull Request

```bash
# 1. Pusher la branche
git push origin feature/[nom-feature]

# 2. Créer la PR via CLI (ou interface GitHub/GitLab)
gh pr create --title "[TYPE]: Description courte" --body "
## Contexte
[Lien vers la SPEC]

## Modifications
- [Liste des changements principaux]

## Tests
- [ ] Tests unitaires passent
- [ ] Tests E2E passent
- [ ] Tests manuels effectués

## Checklist
- [ ] Code reviewé
- [ ] Documentation mise à jour si nécessaire
"
```

### 5.4.2 Conventional Commits

Utilisez le format Conventional Commits pour les messages :

| Type | Usage | Exemple |
|------|-------|---------|
| `feat` | Nouvelle fonctionnalité | `feat(auth): add password reset` |
| `fix` | Correction de bug | `fix(cart): resolve total calculation` |
| `refactor` | Refactoring sans changement fonctionnel | `refactor(api): simplify error handling` |
| `docs` | Documentation | `docs(readme): update installation` |
| `test` | Ajout/modification de tests | `test(auth): add login edge cases` |
| `chore` | Maintenance | `chore(deps): update dependencies` |

> 📖 Référence : @framework/05-boucles-iteratives.md - Annexe C.5

### 5.4.3 Attendre la validation CI

| Vérification CI | Action si échec |
|-----------------|-----------------|
| Build | Corriger les erreurs de compilation |
| Lint | Exécuter `npm run lint:fix` |
| Tests unitaires | Corriger les tests cassés |
| Tests E2E | Vérifier l'environnement CI |
| Couverture | Ajouter des tests si sous le seuil |

> ⚠️ **RÈGLE** : Ne jamais merger avec une CI en échec. Pas d'exception.

---

## 5.5 Étape : Déploiement staging

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | PR mergée, CI verte |
| 📤 **SORTIES** | Application déployée sur staging |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | CI/CD OK |

### 5.5.1 Checklist pré-déploiement staging

| ✓ | Vérification | Comment vérifier |
|---|--------------|------------------|
| ☐ | CI/CD verte | Interface GitHub Actions / GitLab CI |
| ☐ | Variables d'environnement configurées | Vérifier le dashboard d'hébergement |
| ☐ | Migrations de base de données prêtes | `npx prisma migrate status` (si applicable) |
| ☐ | Feature flags configurés | Dashboard feature flags (si applicable) |

### 5.5.2 Commandes de déploiement staging

Adaptez selon votre plateforme d'hébergement :

**Vercel** :
```bash
# Déploiement automatique sur push vers main
# Ou déploiement manuel de preview :
vercel --env preview
```

**Railway** :
```bash
railway up --environment staging
```

**Autres plateformes** :
```bash
# Adapter selon votre configuration
npm run deploy:staging
```

### 5.5.3 Vérification staging

Effectuez ces vérifications sur l'environnement staging :

```bash
# Vérifier que l'application répond
curl -I https://staging.votre-app.com/health

# Vérifier les logs pour erreurs
# (via dashboard de votre hébergeur)
```

| ✓ | Vérification | Critère |
|---|--------------|---------|
| ☐ | Health check | HTTP 200 |
| ☐ | Fonctionnalité déployée accessible | Parcours nominal fonctionne |
| ☐ | Pas d'erreurs dans les logs | 0 erreur critique |
| ☐ | Performance acceptable | Temps de réponse <3s |

---

## 5.6 Étape : Déploiement production

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Staging validé |
| 📤 **SORTIES** | Application déployée en production |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | Déploiement staging OK |

### 5.6.1 Stratégies de déploiement

Choisissez la stratégie adaptée à votre contexte :

| Stratégie | Quand l'utiliser | Risque | Rollback |
|-----------|------------------|--------|----------|
| **Continuous Deployment** | Features non-critiques, équipe mature | Faible | Automatique |
| **Staged Rollout** | Features majeures, impact utilisateur | Moyen | Manuel |
| **Feature Flags** | Expérimentales, A/B tests | Faible | Instantané (flag off) |
| **Manual Release** | Critiques, compliance, migrations | Élevé | Planifié |

> 💡 **RECOMMANDATION** : Visez le Continuous Deployment avec Feature Flags pour la plupart des fonctionnalités.

### 5.6.2 Checklist pré-déploiement production

| ✓ | Vérification | Responsable |
|---|--------------|-------------|
| ☐ | Staging validé et stable | PE |
| ☐ | Variables d'environnement production configurées | PE |
| ☐ | Backup de la base de données effectué | PE |
| ☐ | Procédure de rollback documentée | PE |
| ☐ | Équipe informée du déploiement | PE |
| ☐ | Créneau de déploiement approprié | PE |

> ⚠️ **RÈGLE** : Ne jamais déployer en production un vendredi après-midi ou avant un jour férié.

### 5.6.3 Commandes de déploiement production

**Avec tag de version** :
```bash
# Créer un tag de version
git tag -a v1.X.X -m "Release v1.X.X: [description]"
git push origin v1.X.X

# Déployer (adapter selon plateforme)
vercel --prod
# ou
railway up --environment production
```

**Vérification immédiate** :
```bash
# Health check production
curl -I https://votre-app.com/health

# Vérifier la version déployée (si endpoint disponible)
curl https://votre-app.com/api/version
```

---

## 5.7 Étape : Vérification post-déploiement

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer + QA |
| 📥 **ENTRÉES** | Application déployée en production |
| 📤 **SORTIES** | Confirmation de bon fonctionnement |
| ⏱️ **DURÉE** | 15-30 min |
| 🔗 **DÉPENDANCES** | Déploiement production OK |

### 5.7.1 Smoke tests production

Exécutez les vérifications critiques immédiatement après déploiement :

| ✓ | Vérification | Action |
|---|--------------|--------|
| ☐ | Application accessible | Charger la page d'accueil |
| ☐ | Authentification fonctionne | Tester login/logout |
| ☐ | Fonctionnalité déployée accessible | Parcours nominal |
| ☐ | API répond | Health check endpoint |
| ☐ | Pas d'erreurs critiques dans les logs | Vérifier dashboard monitoring |

### 5.7.2 Monitoring à surveiller

| Métrique | Seuil d'alerte | Outil |
|----------|----------------|-------|
| Taux d'erreur | >1% | Sentry, LogRocket |
| Temps de réponse | >3s | DataDog, New Relic |
| Disponibilité | <99.9% | UptimeRobot, Pingdom |
| Utilisation CPU/mémoire | >80% | Dashboard hébergeur |

### 5.7.3 Période de surveillance

| Période | Action |
|---------|--------|
| 0-15 min | Surveillance active, prêt à rollback |
| 15-60 min | Surveillance régulière (toutes les 15 min) |
| 1-24h | Surveillance normale, vérifier les métriques |

---

## 5.8 Étape : Rollback (si nécessaire)

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Problème détecté en production |
| 📤 **SORTIES** | Version stable restaurée |
| ⏱️ **DURÉE** | 5-15 min |
| 🔗 **DÉPENDANCES** | Décision de rollback |

### 5.8.1 Critères de déclenchement du rollback

| Situation | Décision |
|-----------|----------|
| Erreur critique empêchant l'utilisation | **ROLLBACK IMMÉDIAT** |
| Dégradation majeure des performances (>10s) | **ROLLBACK IMMÉDIAT** |
| Perte de données | **ROLLBACK IMMÉDIAT** |
| Bug majeur affectant >10% utilisateurs | **ROLLBACK** |
| Bug mineur, contournement possible | **HOTFIX** (pas de rollback) |

### 5.8.2 Procédure de rollback

```bash
# Option 1 : Rollback via plateforme
vercel rollback
# ou
railway rollback --environment production

# Option 2 : Rollback via Git
git revert HEAD
git push origin main
# Attendre le redéploiement automatique

# Option 3 : Déployer une version spécifique
git checkout v1.X.X-1  # Version précédente
vercel --prod
```

### 5.8.3 Actions post-rollback

| ✓ | Action | Responsable |
|---|--------|-------------|
| ☐ | Vérifier que la version stable fonctionne | PE |
| ☐ | Informer l'équipe du rollback | PE |
| ☐ | Créer un ticket pour investiguer le problème | PE |
| ☐ | Documenter l'incident | PE |
| ☐ | Planifier la correction | PM + PE |

> ⚠️ **ESCALADE** : Tout rollback doit être suivi d'une analyse post-mortem avec le Tech Lead.

---

## 5.9 Étape : Clôture et documentation

| | |
|---|---|
| 🎭 **ACTEUR** | Product Engineer |
| 📥 **ENTRÉES** | Déploiement validé |
| 📤 **SORTIES** | Documentation à jour, contexte propre |
| ⏱️ **DURÉE** | 15 min |
| 🔗 **DÉPENDANCES** | Vérification post-déploiement OK |

### 5.9.1 Mise à jour du CHANGELOG

Ajoutez une entrée dans `CHANGELOG.md` :

```markdown
## [1.X.X] - YYYY-MM-DD

### Ajouté
- [Description de la nouvelle fonctionnalité]

### Modifié
- [Description des modifications]

### Corrigé
- [Description des bugs corrigés]
```

### 5.9.2 Mise à jour de l'AGENT-GUIDE

Si l'implémentation a révélé des learnings utiles pour l'agent IA :

```markdown
## Learnings récents

### [Date] - [Nom de la feature]
- [Pattern découvert ou contrainte importante]
- [Décision architecturale prise]
```

> 📖 Référence : @framework/04-artefacts.md - Section "AGENT-GUIDE"

### 5.9.3 Nettoyage du contexte

| ✓ | Action |
|---|--------|
| ☐ | Supprimer la branche feature locale et distante |
| ☐ | Fermer/archiver le ticket de la SPEC |
| ☐ | Mettre à jour le board (si utilisé) |
| ☐ | Archiver les artefacts temporaires |

```bash
# Supprimer la branche locale
git branch -d feature/[nom-feature]

# Supprimer la branche distante
git push origin --delete feature/[nom-feature]
```

---

## 5.10 Métriques de déploiement

### 5.10.1 Indicateurs à suivre

| Indicateur | Cible | Fréquence |
|------------|-------|-----------|
| Temps merge à production | <1h (idéal <15min) | Par déploiement |
| Taux de rollback | <5% | Mensuelle |
| Downtime lors déploiements | 0 | Par déploiement |
| Fréquence de déploiement | >1/jour | Hebdomadaire |
| Temps moyen de rollback | <15min | Par incident |

> 📖 Référence : @framework/07-metriques.md

### 5.10.2 Comment améliorer les métriques

| Problème | Cause probable | Action corrective |
|----------|----------------|-------------------|
| Temps de déploiement trop long | Pipeline CI lent | Optimiser les jobs, paralléliser |
| Taux de rollback élevé | Validation insuffisante | Renforcer la Boucle 3 (Valider) |
| Downtime fréquent | Déploiement non zero-downtime | Implémenter blue-green ou rolling |
| Déploiements rares | Peur du déploiement | Automatiser, réduire la taille des lots |

---

## 5.11 Problèmes courants

| Problème | Cause probable | Solution |
|----------|----------------|----------|
| CI qui échoue après merge | Conflits non détectés | Toujours rebaser et tester avant merge |
| Déploiement staging OK, production KO | Variables d'env différentes | Vérifier la parité des environnements |
| Rollback impossible | Pas de version précédente | Toujours taguer les releases |
| Migrations qui échouent | Migration non testée | Tester les migrations sur staging |
| Feature non visible en prod | Cache non invalidé | Purger le cache après déploiement |

> ⚠️ **ESCALADE** : Si le temps de déploiement dépasse régulièrement 2h, organisez une session d'optimisation avec le Tech Lead.

---

## 5.12 Checklist de fin de phase

Avant de considérer la Boucle 4 (Intégrer) comme terminée :

| ✓ | Élément | Vérification |
|---|---------|--------------|
| ☐ | Revue de code | Approuvée |
| ☐ | CI/CD | Tous les checks passent |
| ☐ | Déploiement staging | Validé |
| ☐ | Déploiement production | Effectué |
| ☐ | Smoke tests | Passent |
| ☐ | Monitoring | Pas d'anomalie |
| ☐ | CHANGELOG | Mis à jour |
| ☐ | AGENT-GUIDE | Mis à jour si nécessaire |
| ☐ | Branche | Supprimée |
| ☐ | Ticket | Fermé |

> 💡 **CONSEIL** : Le code non déployé n'a aucune valeur. Visez le déploiement le jour même de la validation.

---

*Étape suivante : [06-rituels-amelioration.md](06-rituels-amelioration.md) — Maintenir le rythme d'amélioration continue*
