# A.1 Template PRD (Product Requirements Document)

## Pourquoi ce template ?

Le PRD est le document fondateur d'un projet AIAD. Il définit la vision produit, les outcomes attendus et le cadre dans lequel l'équipe va opérer. Un PRD bien rédigé permet aux agents IA de comprendre le contexte et de générer du code aligné avec les objectifs business.

**Responsable principal** : Product Manager

---

## Structure du PRD

### 1. Vision Produit

```markdown
## Vision

[Une phrase qui capture l'essence du produit et sa valeur unique]

### Problème adressé
[Description du problème utilisateur que le produit résout]

### Solution proposée
[Comment le produit résout ce problème]

### Utilisateurs cibles
[Personas ou segments d'utilisateurs principaux]
```

### 2. Outcomes Attendus

```markdown
## Outcomes

### Outcome Principal
[L'objectif business mesurable que le produit doit atteindre]

### Métriques de Succès
| Métrique | Baseline | Cible | Échéance |
|----------|----------|-------|----------|
| [Métrique 1] | [Valeur actuelle] | [Valeur cible] | [Date] |
| [Métrique 2] | [Valeur actuelle] | [Valeur cible] | [Date] |

### Critères de Succès Outcome (DoOuD)
- [ ] [Critère 1]
- [ ] [Critère 2]
- [ ] [Critère 3]
```

### 3. Périmètre

```markdown
## Périmètre

### Dans le scope
- [Fonctionnalité 1]
- [Fonctionnalité 2]
- [Fonctionnalité 3]

### Hors scope
- [Ce qui ne sera pas fait]
- [Ce qui est reporté à plus tard]

### Dépendances
- [Dépendance technique ou organisationnelle]
```

### 4. Contraintes

```markdown
## Contraintes

### Techniques
- [Stack technologique imposée]
- [Intégrations requises]
- [Contraintes de performance]

### Business
- [Budget]
- [Délais]
- [Ressources disponibles]

### Réglementaires
- [Conformité RGPD, accessibilité, etc.]
```

### 5. Risques

```markdown
## Risques

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| [Risque 1] | Haute/Moyenne/Basse | Haut/Moyen/Bas | [Action] |
| [Risque 2] | Haute/Moyenne/Basse | Haut/Moyen/Bas | [Action] |
```

---

## Exemple de PRD Minimal

```markdown
# PRD : Application de Gestion de Tâches

## Vision
Une application simple qui permet aux équipes de suivre leurs tâches quotidiennes avec un minimum de friction.

### Problème adressé
Les équipes perdent du temps à synchroniser leurs tâches entre plusieurs outils et canaux de communication.

### Solution proposée
Une interface unique où chaque membre peut voir, créer et mettre à jour les tâches de l'équipe en temps réel.

### Utilisateurs cibles
- Équipes de 3-10 personnes
- Contexte startup/PME
- Utilisateurs familiers avec les outils numériques

## Outcomes

### Outcome Principal
Réduire le temps passé en coordination de 30% sur 3 mois.

### Métriques de Succès
| Métrique | Baseline | Cible | Échéance |
|----------|----------|-------|----------|
| Temps de coordination hebdo | 5h | 3.5h | M+3 |
| Tâches complétées/semaine | 20 | 25 | M+2 |

## Périmètre

### Dans le scope
- Création/édition/suppression de tâches
- Assignation à un membre
- Vue liste et vue kanban
- Notifications basiques

### Hors scope
- Intégration calendrier (v2)
- Application mobile native (v2)
- Rapports avancés (v2)

## Contraintes

### Techniques
- Stack : React + Node.js + PostgreSQL
- Hébergement : Vercel/Railway
- Budget infra : < 50€/mois

### Business
- MVP en 4 semaines
- Équipe : 1 Product Engineer + agents IA
```

---

## Conseils d'utilisation

### Ce qui rend un PRD efficace

1. **Clarté** : Chaque section doit être compréhensible sans contexte additionnel
2. **Mesurabilité** : Les outcomes doivent être quantifiables
3. **Priorisation** : Le scope doit clairement distinguer l'essentiel du secondaire

### Erreurs courantes

- **Trop de détails techniques** : Le PRD définit le "quoi" et le "pourquoi", pas le "comment"
- **Outcomes vagues** : "Améliorer l'expérience utilisateur" n'est pas mesurable
- **Scope trop large** : Mieux vaut un MVP livré qu'un produit parfait jamais terminé

### Évolution du PRD

Le PRD n'est pas figé. Il évolue avec le projet :
- **Semaine 1** : Version initiale minimale
- **En continu** : Ajustements basés sur les learnings
- **Chaque cycle** : Revue lors de l'Alignment Stratégique

---

*Retour aux [Annexes](../framework/08-annexes.md)*
