# T-001-T5 : Protocole de test utilisateur — Temps de lecture < 30s

| Metadata | Valeur |
|----------|--------|
| **Version** | 1.0 |
| **Date** | 09 fevrier 2026 |
| **Tache** | T-001-T5 |
| **User Story** | [US-001 - Comprendre AIAD rapidement](../specs/US-001/spec.md) |
| **Spec** | [T-001-T5-tests-utilisateur-temps-lecture.md](../specs/US-001/T-001-T5-tests-utilisateur-temps-lecture.md) |

---

## 1. Objectif

Valider que le hero section de la page d'accueil permet a un visiteur de **comprendre en moins de 30 secondes** ce qu'est AIAD et ses benefices principaux.

### Critere d'acceptation

> « Temps de lecture du hero < 30 secondes (valide par 5 utilisateurs tests) »

---

## 2. Vue d'ensemble

| Parametre | Valeur |
|-----------|--------|
| **Nombre de testeurs** | 5 (minimum 3 si recrutement difficile) |
| **Duree par session** | 10 minutes |
| **Format** | En personne ou visioconference avec partage d'ecran |
| **Outil de chronometrage** | Chronometre manuel ou `performance.now()` |
| **Environnement** | Desktop Chrome 1280x720 |
| **Page testee** | Page d'accueil (hero visible) |

---

## 3. Profil des testeurs

Recruter un panel diversifie :

| # | Profil souhaite | Experience IA | Justification |
|---|----------------|---------------|---------------|
| U1 | Developpeur junior/mid | Debutant | Cible principale de AIAD |
| U2 | Tech Lead / Architecte | Intermediaire | Decideur technique |
| U3 | Product Manager / PO | Aucune-Debutant | Decideur non-technique |
| U4 | Developpeur senior | Expert | Power user, compare avec l'existant |
| U5 | Profil mixte (QA, DevOps) | Variable | Verification transversale |

### Criteres d'exclusion

- Connait deja AIAD ou a participe au developpement
- Ne parle pas couramment francais
- A deja vu la page d'accueil

---

## 4. Materiel necessaire

- Navigateur Chrome/Chromium, viewport 1280x720
- Chronometre (application ou physique)
- Ce document imprime ou affiche sur un second ecran
- Formulaire de notation (section 7) pour chaque testeur
- Enregistrement d'ecran (optionnel mais recommande)

---

## 5. Deroulement d'une session

```
Phase 1 — Briefing (2 min)
  - Expliquer le contexte (sans reveler AIAD)
  - « Vous allez voir une page web. Lisez-la normalement. »
  - « Quand vous pensez avoir compris le sujet, dites STOP. »
  - Demarrer l'enregistrement d'ecran si possible
          |
          v
Phase 2 — Exposition (max 60 secondes)
  - Afficher la page d'accueil (hero visible)
  - Demarrer le chronometre immediatement
  - L'utilisateur lit a son rythme naturel
  - STOP quand l'utilisateur dit avoir compris
  - Si > 60s : arreter, noter le temps comme « 60+ »
  - Noter le temps exact : T = __ secondes
          |
          v
Phase 3 — Questionnaire (5 min)
  - Masquer la page (alt-tab ou fermer l'onglet)
  - Poser les 5 questions de comprehension (section 6)
  - Poser l'auto-evaluation de confiance
  - Recueillir les commentaires libres
          |
          v
Phase 4 — Debriefing (3 min)
  - Demander ce qui a aide a comprendre rapidement
  - Demander ce qui etait confus ou superflu
  - Demander si la structure guide bien l'oeil
  - Remercier le testeur
```

---

## 6. Questionnaire de comprehension

Chaque question vaut 1 point. Score total : 0 a 5.

| # | Question | Reponse attendue | Critere de validation |
|---|----------|-----------------|----------------------|
| Q1 | « De quoi parle cette page ? Resumez en une phrase. » | AIAD est un framework pour developper avec des agents IA | Mentionne « framework » ou « methodologie » ET « IA » ou « agents IA » |
| Q2 | « A qui s'adresse ce produit/service ? » | Aux developpeurs qui travaillent avec l'IA | Mentionne « developpeurs » ou « equipes de developpement » |
| Q3 | « Citez au moins 2 benefices mentionnes. » | Productivite, Qualite, Collaboration (2 sur 3) | Cite au moins 2 benefices (paraphrase acceptee) |
| Q4 | « Quel chiffre vous a le plus marque ? » | 50%, 3x, ou >90% (n'importe lequel) | Cite au moins 1 statistique (valeur ou contexte) |
| Q5 | « Quelle action vous est proposee ? » | Explorer le Framework / en savoir plus | Mentionne l'action principale (CTA) |

---

## 7. Grille de notation

A remplir pour chaque testeur :

```
Testeur : U__ (U1 a U5)
Date : ____-__-__
Profil : ____________
Experience IA : ____________

=== MESURES ===

Temps de lecture : __ secondes

Score de comprehension : __/5
  Q1 : [ ] Correct  [ ] Incorrect
  Q2 : [ ] Correct  [ ] Incorrect
  Q3 : [ ] Correct  [ ] Incorrect
  Q4 : [ ] Correct  [ ] Incorrect
  Q5 : [ ] Correct  [ ] Incorrect

Score de confiance (auto-evaluation) : __/5
  1 = Pas du tout confiant
  2 = Peu confiant
  3 = Moyennement confiant
  4 = Confiant
  5 = Tres confiant

=== EVALUATIONS ===

Resume correct : [ ] Oui  [ ] Non
Identifie benefices (>= 2/3) : [ ] Oui  [ ] Non
Identifie la cible : [ ] Oui  [ ] Non

=== COMMENTAIRES ===

Ce qui a aide a comprendre :
_______________________________________________

Ce qui etait confus ou superflu :
_______________________________________________

La structure guide-t-elle bien l'oeil ?
_______________________________________________

Notes supplementaires :
_______________________________________________
```

---

## 8. Criteres de reussite de la campagne

| Critere | Seuil | Obligatoire |
|---------|-------|-------------|
| >= 4/5 testeurs lisent en < 30 secondes | 80% | **Oui** |
| Temps de lecture moyen < 30 secondes | < 30s | **Oui** |
| Temps de lecture median < 30 secondes | < 30s | **Oui** |
| Score de comprehension moyen >= 3.5/5 | >= 3.5 | **Oui** |
| >= 4/5 testeurs peuvent resumer correctement | 80% | **Oui** |
| >= 4/5 testeurs identifient au moins 2 benefices | 80% | Non (souhaitable) |
| Score de confiance moyen >= 3/5 | >= 3 | Non (souhaitable) |

---

## 9. Interpretation des resultats

| Temps | Interpretation |
|-------|---------------|
| < 15s | Scan rapide, retient l'essentiel (excellent) |
| 15-25s | Lecture naturelle d'un hero bien structure (bon) |
| 25-30s | Lecture complete incluant les sources (acceptable) |
| 30-45s | Contenu trop dense ou structure non guidante (action requise) |
| > 45s | Probleme majeur de densite ou hierarchie visuelle |

---

## 10. Actions correctives si echec

| Probleme identifie | Action corrective | Impact estime |
|--------------------|--------------------|---------------|
| Temps > 30s, trop de texte | Reduire la VP a 1 phrase courte (< 15 mots) | -5s |
| Temps > 30s, descriptions benefices longues | Raccourcir chaque description a < 12 mots | -3s |
| Faible comprehension, titre ambigu | Reformuler le titre pour etre plus explicite | +1 point comprehension |
| Statistiques non remarquees | Augmenter la taille des valeurs stat | +1 stat retenue |
| CTA non identifie | Augmenter le contraste/taille du CTA | +1 point Q5 |
| Sources confusent la lecture | Reduire la taille ou masquer les sources | -2s |
| Structure non guidante | Augmenter l'espacement entre sections | Meilleur scan |

---

## 11. Fichier de resultats

Les resultats sont a consigner dans `docs/tests/T-001-T5-resultats-utilisateur.json` avec le format suivant :

```json
{
  "campaign": {
    "date": "2026-02-XX",
    "tester": "Nom du facilitateur",
    "environment": "Desktop Chrome 1280x720",
    "pageVersion": "commit-hash"
  },
  "results": [
    {
      "userId": "U1",
      "profile": {
        "role": "developer",
        "experienceWithAI": "beginner",
        "ageRange": "26-35"
      },
      "readingTimeSeconds": 22,
      "comprehensionScore": 4,
      "confidenceScore": 4,
      "canSummarizeCorrectly": true,
      "identifiesBenefits": true,
      "identifiesTarget": true,
      "notes": "Structure claire. Les icones aident."
    }
  ],
  "summary": {
    "totalUsers": 5,
    "averageReadingTime": 0,
    "medianReadingTime": 0,
    "percentageUnder30s": 0,
    "averageComprehension": 0,
    "percentageCorrectSummary": 0,
    "isValidated": false
  }
}
```

---

## 12. Cas limites du protocole

| ID | Cas | Traitement |
|----|-----|------------|
| CL-UT-01 | Utilisateur lit en moins de 5 secondes | Verifier le score de comprehension — un temps < 5s avec comprehension >= 4/5 est valide |
| CL-UT-02 | Utilisateur depasse 60 secondes | Arreter le chronometre a 60s, noter comme echec, recueillir le feedback qualitatif |
| CL-UT-03 | Utilisateur connait deja AIAD | Exclure de l'echantillon, recruter un remplacant |
| CL-UT-04 | Utilisateur non francophone | Exclure de l'echantillon (tests en francais uniquement pour le MVP) |
| CL-UT-05 | Moins de 5 utilisateurs disponibles | Minimum 3 utilisateurs requis, documenter le motif |

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 09/02/2026 | Creation initiale |
