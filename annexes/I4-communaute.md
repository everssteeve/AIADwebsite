# I.4 Communauté AIAD

## Pourquoi cette annexe ?

Apprendre seul est lent, apprendre ensemble est rapide. Cette annexe présente comment rejoindre la communauté AIAD, obtenir de l'aide, contribuer au framework et participer à son évolution. La communauté est le moteur de l'amélioration continue d'AIAD.

---

## Obtenir de l'Aide

### Avant de Demander

```markdown
## Checklist Pré-Question

- [ ] Consulté la documentation ? (ce site)
- [ ] Cherché dans le troubleshooting ? ([I.1](I1-troubleshooting.md))
- [ ] Recherché dans les issues GitHub ?
- [ ] Essayé de reproduire le problème de manière isolée ?
```

Si oui à tout et toujours bloqué → demander de l'aide.

---

### Où Demander

| Canal | Usage | Temps de Réponse |
|-------|-------|------------------|
| **GitHub Issues** | Bugs, feature requests | 24-48h |
| **GitHub Discussions** | Questions, discussions ouvertes | 24-72h |
| **Discord** | Questions rapides, entraide | Minutes à heures |
| **Stack Overflow** | Questions techniques génériques | Variable |

---

### Comment Bien Poser une Question

Une bonne question obtient une bonne réponse rapidement.

```markdown
## Template de Question

### Contexte
- Version AIAD / outils utilisés
- Stack technique (Astro, React, etc.)
- Environnement (OS, Node version)

### Problème
**Ce que je veux faire :**
[Description claire de l'objectif]

**Ce que j'ai essayé :**
1. [Tentative 1]
2. [Tentative 2]

**Ce qui se passe :**
[Comportement actuel avec message d'erreur complet]

**Ce que j'attendais :**
[Comportement souhaité]

### Reproduction
[Étapes minimales pour reproduire OU lien vers repo minimal]
```

**Exemple concret**

```markdown
### Contexte
- AIAD website avec Astro 4.x
- Node 20, pnpm 8
- Windows 11

### Problème
**Ce que je veux faire :**
Générer automatiquement les SPECs depuis un PRD

**Ce que j'ai essayé :**
1. Utilisé le template A.4 manuellement
2. Demandé à Claude de découper le PRD

**Ce qui se passe :**
Les SPECs générées sont trop grosses (5-7 jours chacune)

**Ce que j'attendais :**
SPECs de 1-2 jours comme recommandé

### Question
Quel prompt utiliser pour obtenir des SPECs bien dimensionnées ?
```

---

### Anti-patterns Questions

```markdown
❌ "Ça marche pas"
   → Quoi exactement ? Message d'erreur ? Comportement ?

❌ "J'ai tout essayé"
   → Lister ce qui a été essayé précisément

❌ Question sans contexte
   → Versions, stack, OS, configuration

❌ Screenshot de code
   → Copier-coller le code en texte (formaté)

❌ Demander sans avoir cherché
   → Montrer les recherches effectuées
```

---

## Contribuer au Framework

### Types de Contributions

| Type | Difficulté | Impact | Comment Commencer |
|------|------------|--------|-------------------|
| **Corrections doc** | Facile | Moyen | Typos, liens cassés, clarifications |
| **Exemples** | Facile | Haut | Cas d'usage, templates |
| **Bug reports** | Facile | Variable | Issue détaillée avec reproduction |
| **Bug fixes** | Moyen | Haut | PR avec tests |
| **Nouvelles annexes** | Moyen | Haut | Discussion préalable requise |
| **Features framework** | Difficile | Très haut | Discussion + design préalable |

---

### Processus de Contribution

```markdown
## 1. Identifier une Contribution

### Issues "Good First Issue"
- Marquées pour les débutants
- Scope bien défini
- Support disponible

### Issues "Help Wanted"
- Plus complexes
- Besoin d'aide communauté
- Impact plus important

### Proposer une Idée
- Ouvrir une Discussion GitHub
- Expliquer le problème et la solution
- Attendre validation avant de coder

## 2. Préparer l'Environnement

```bash
# Fork et clone
git clone https://github.com/VOTRE_USERNAME/aiad-website.git
cd aiad-website
pnpm install

# Créer une branche
git checkout -b feat/ma-contribution

# Vérifier que tout marche
pnpm dev
pnpm test
```

## 3. Développer

- Suivre les conventions du projet (voir CLAUDE.md)
- Ajouter des tests si code
- Mettre à jour la documentation si nécessaire
- Committer régulièrement avec messages clairs

## 4. Soumettre

```bash
# Push
git push origin feat/ma-contribution
```

- Créer une PR sur GitHub
- Remplir le template de PR
- Attendre la review (répondre aux commentaires)
- Merger après approbation
```

---

### Guide de Style Contributions

```markdown
## Code

- TypeScript strict (no any)
- ESLint sans warning
- Prettier formaté
- Tests pour les nouvelles fonctionnalités

## Documentation

- Français pour le contenu
- Markdown valide
- Exemples concrets pour chaque concept
- Liens vers annexes connexes

## Commits

Format : type(scope): description

Types :
- feat: nouvelle fonctionnalité
- fix: correction de bug
- docs: documentation uniquement
- style: formatage (pas de changement logique)
- refactor: restructuration sans changement fonctionnel
- test: ajout ou modification de tests
- chore: maintenance, dépendances

Exemples :
- feat(annexes): add security agent template
- docs(glossary): clarify DoOD definition
- fix(search): correct index generation
```

---

### Template Pull Request

```markdown
## Description
[Résumé concis de ce que fait cette PR]

## Motivation
[Pourquoi ce changement est nécessaire]

## Changements
- [Changement 1]
- [Changement 2]
- [Changement 3]

## Tests
- [ ] Tests existants passent
- [ ] Nouveaux tests ajoutés (si applicable)
- [ ] Testé manuellement

## Checklist
- [ ] Code suit les conventions du projet
- [ ] Documentation mise à jour
- [ ] Pas de console.log ou code de debug
- [ ] Self-review effectuée

## Screenshots
[Si changements visuels]

## Issue liée
Closes #[numéro]
```

---

## Événements et Rencontres

### Types d'Événements

| Événement | Format | Fréquence | Pour Qui |
|-----------|--------|-----------|----------|
| **Office Hours** | Q&A en ligne | Bi-mensuel | Tous niveaux |
| **Workshops** | Pratique guidée | Mensuel | Débutants à intermédiaires |
| **Meetups** | Présentations + networking | Mensuel | Tous |
| **Conférence AIAD** | Journée complète | Annuel | Tous |

---

### Participer aux Événements

```markdown
## Comment Rester Informé

1. S'abonner à la newsletter (site web)
2. Rejoindre le Discord (#events)
3. Suivre le repo GitHub (releases)

## Proposer un Talk

1. Soumettre via le formulaire
2. Format : 15min, 30min ou workshop
3. Sujets appréciés :
   - Retours d'expérience
   - Cas d'usage spécifiques
   - Tips et astuces
   - Intégrations avec d'autres outils
```

---

## Programme Ambassadeur

### Qu'est-ce qu'un Ambassadeur ?

Les ambassadeurs AIAD sont des membres actifs qui :
- Partagent leur expérience AIAD
- Aident les nouveaux membres
- Organisent des événements locaux
- Contribuent à la documentation
- Font le lien entre communauté et core team

---

### Avantages

| Avantage | Description |
|----------|-------------|
| **Accès anticipé** | Preview des nouvelles versions |
| **Badge** | Reconnaissance sur GitHub et Discord |
| **Réseau** | Accès au groupe privé ambassadeurs |
| **Événements** | Invitations aux événements exclusifs |
| **Influence** | Input direct sur la roadmap |

---

### Comment Devenir Ambassadeur

```markdown
## Critères

1. **Activité** : Membre actif depuis 6+ mois
2. **Contributions** : Au moins une contribution significative
   - Code/documentation
   - Réponses dans la communauté
   - Organisation d'événement
3. **Engagement** : Volonté de s'investir régulièrement

## Processus

1. Postuler via le formulaire
2. Review par l'équipe core
3. Entretien (30min)
4. Période d'essai (3 mois)
5. Confirmation ou feedback
```

---

## Ressources Communautaires

### Templates Partagés

La communauté maintient des templates additionnels :

```markdown
## Par Stack

| Template | Maintenu par | Lien |
|----------|--------------|------|
| aiad-template-nextjs | @contributor1 | github.com/... |
| aiad-template-remix | @contributor2 | github.com/... |
| aiad-template-vue | @contributor3 | github.com/... |
| aiad-template-svelte | @contributor4 | github.com/... |

## Par Cas d'Usage

| Template | Description |
|----------|-------------|
| aiad-template-saas | SaaS avec auth, billing |
| aiad-template-ecommerce | E-commerce basique |
| aiad-template-blog | Blog avec CMS |
| aiad-template-dashboard | Admin dashboard |
```

---

### Agents Communautaires

```markdown
## Agents Spécialisés

| Agent | Spécialité | Créé par |
|-------|------------|----------|
| agent-db-migrations | Migrations DB | @contributor |
| agent-api-docs | Documentation OpenAPI | @contributor |
| agent-a11y | Audit accessibilité | @contributor |
| agent-i18n | Internationalisation | @contributor |
| agent-perf-audit | Audit performance | @contributor |

## Proposer un Agent

1. Créer un repo avec le format agent-[nom]
2. Inclure README avec usage
3. Inclure system prompt documenté
4. Soumettre pour review communautaire
```

---

### Case Studies

```markdown
## Études de Cas Publiées

| Entreprise | Contexte | Résultats |
|------------|----------|-----------|
| Startup A | MVP en 6 semaines | 3x plus rapide qu'estimé |
| Agence B | Migration legacy | -40% bugs post-deploy |
| Scale-up C | Équipe de 8 PE | Onboarding en 2 semaines |

## Partager Votre Case Study

1. Remplir le template case study
2. Faire valider par votre entreprise
3. Soumettre pour publication
4. Review et publication

Intérêt : visibilité, contribution communauté
```

---

## Code de Conduite

### Nos Valeurs

```markdown
## Bienveillance
- Supposer la bonne foi
- Aider plutôt que critiquer
- Accueillir les débutants

## Respect
- Respecter les opinions différentes
- Pas de discrimination
- Communication professionnelle

## Collaboration
- Partager ses connaissances
- Créditer les contributions des autres
- Construire ensemble
```

---

### Comportements Attendus

```markdown
✅ Utiliser un langage inclusif
✅ Respecter les points de vue différents
✅ Accepter les critiques constructives
✅ Se concentrer sur le meilleur pour la communauté
✅ Faire preuve d'empathie
```

---

### Comportements Inacceptables

```markdown
❌ Harcèlement sous toute forme
❌ Langage ou images offensants
❌ Trolling ou commentaires désobligeants
❌ Publication d'informations privées
❌ Comportement inapproprié en contexte professionnel
```

---

### Signalement

```markdown
## En Cas de Problème

1. Signaler à conduct@aiad.dev (exemple)
2. Décrire la situation factuellement
3. Inclure des preuves si possible

## Traitement

1. Accusé de réception sous 24h
2. Investigation
3. Action appropriée
4. Suivi avec le rapporteur
```

---

## Anti-patterns Communauté

### Ce qu'il NE faut PAS faire

```markdown
❌ Poser une question sans avoir cherché
   → Montrer les recherches effectuées

❌ Ignorer le code de conduite
   → Le lire et l'appliquer

❌ Contribuer sans suivre les guidelines
   → Lire CONTRIBUTING.md avant

❌ S'attendre à une réponse immédiate
   → La communauté est bénévole

❌ Critiquer sans proposer d'alternative
   → Suggestion constructive ou PR

❌ Disparaître après avoir reçu de l'aide
   → Confirmer que le problème est résolu
```

---

## Checklist Nouveau Membre

```markdown
## Première Semaine

- [ ] Lire le README du projet
- [ ] Parcourir la documentation
- [ ] Rejoindre Discord
- [ ] Se présenter dans #introductions
- [ ] Lire le code de conduite

## Premier Mois

- [ ] Poser au moins une question
- [ ] Répondre à une question si possible
- [ ] Identifier une contribution potentielle
- [ ] Suivre les annonces

## Contribution

- [ ] Lire CONTRIBUTING.md
- [ ] Faire une première contribution (typo, doc)
- [ ] Participer à une discussion
- [ ] Proposer une amélioration
```

---

## Ressources Connexes

- [I.1 Troubleshooting](I1-troubleshooting.md) - Résoudre les problèmes courants
- [I.3 Bibliographie](I3-bibliographie.md) - Ressources pour approfondir
- [H.5 Notes d'Apprentissage](H5-notes-apprentissage.md) - Capitaliser et partager

---

*Dernière mise à jour : Janvier 2025*
