Cree une branche Git pour la tache suivante :

**Tache :** $ARGUMENTS

**Instructions :**
1. A partir du libelle fourni, genere un nom de branche au format : `feature/T-XXX-slug-tache`
   - Conserve le code tache tel quel (ex: T-004-B4)
   - Convertis le reste du libelle en kebab-case minuscule
   - Supprime les accents et caracteres speciaux
   - Exemple : "T-004-B4 Helpers navigation" → `feature/T-004-B4-helpers-navigation`
2. Execute `git checkout -b <nom-de-branche>` depuis la branche courante
3. Confirme la creation de la branche
