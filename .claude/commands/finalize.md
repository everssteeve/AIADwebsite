Finalise la fonctionnalite qui vient d'etre implementee dans cette conversation.

**Etape 1 - Mise a jour de la documentation :**
- Lis le fichier `CLAUDE.md` et mets a jour la section "Etat actuel" si necessaire
- Lis le fichier `docs/specs/_index.md` et mets a jour le statut de la tache concernee
- Si la spec de la User Story contient un tableau de suivi, mets-le a jour egalement

**Etape 2 - Commit avec Conventional Commits :**
- Analyse les fichiers modifies avec `git status` et `git diff`
- Consulte les commits recents avec `git log --oneline -10` pour respecter le style existant
- Cree un commit au format Conventional Commits :
  - `feat(T-XXX)` pour une nouvelle fonctionnalite
  - `fix(T-XXX)` pour une correction
  - `docs(T-XXX)` pour de la documentation seule
  - `test(T-XXX)` pour des tests seuls
  - `refactor(T-XXX)` pour du refactoring
- Le scope doit etre le code de la tache (ex: T-004-B4)
- Le message doit etre concis et decrire le "pourquoi"

**Etape 3 - Push :**
- Push la branche courante vers le remote avec `git push -u origin <branche>`
