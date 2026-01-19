# I.1 Troubleshooting

## Pourquoi cette annexe ?

Cette annexe fournit des solutions aux problèmes courants rencontrés avec le framework AIAD, organisées par catégorie.

---

## Problèmes avec les Agents IA

### Agent ne comprend pas le contexte du projet

**Symptôme**
L'agent génère du code qui ne suit pas les patterns du projet.

**Causes possibles**
1. AGENT-GUIDE incomplet ou absent
2. Contexte projet non chargé
3. Exemples de référence manquants

**Solutions**
```markdown
1. Vérifier que AGENT-GUIDE existe et est complet
   - Conventions de nommage documentées ?
   - Patterns avec exemples de code ?
   - Structure de projet décrite ?

2. S'assurer que l'agent charge le contexte
   - Fichier AGENT-GUIDE référencé dans le prompt système ?
   - Fichiers d'exemple inclus ?

3. Ajouter des exemples concrets
   - "Voici comment on fait X dans notre projet : [code]"
   - Inclure 2-3 exemples de chaque pattern
```

---

### Agent génère du code de mauvaise qualité

**Symptôme**
Code fonctionnel mais mal structuré, non idiomatique, ou difficile à maintenir.

**Causes possibles**
1. Prompt trop vague
2. Pas de contraintes de qualité spécifiées
3. Pas de feedback itératif

**Solutions**
```markdown
1. Améliorer les prompts
   ❌ "Crée une fonction de filtrage"
   ✅ "Crée une fonction de filtrage qui :
       - Utilise les types TypeScript stricts
       - Suit notre pattern de hook existant
       - Est testable (pas d'effets de bord)"

2. Spécifier les contraintes qualité
   - "Le code doit passer ESLint sans warning"
   - "Complexité cyclomatique < 10"
   - "Couverture de test > 80%"

3. Itérer plutôt que recommencer
   - Demander des corrections spécifiques
   - Pointer vers les lignes problématiques
```

---

### Agent fait des erreurs répétitives

**Symptôme**
L'agent refait les mêmes erreurs malgré les corrections.

**Solutions**
```markdown
1. Documenter les erreurs dans AGENT-GUIDE
   ## Erreurs à Éviter
   - Ne pas utiliser `any` (utiliser `unknown` si nécessaire)
   - Ne pas faire de console.log en production
   - Toujours utiliser notre Button, jamais <button> natif

2. Créer une checklist de validation
   Avant de soumettre, vérifier :
   - [ ] Pas de `any`
   - [ ] Pas de console.log
   - [ ] Composants UI du design system utilisés

3. Mettre à jour les exemples de référence
   Remplacer les mauvais exemples par des bons
```

---

## Problèmes de Process

### SPECs trop longues à implémenter

**Symptôme**
Les SPECs prennent systématiquement plus de temps que prévu.

**Causes possibles**
1. SPECs trop grosses
2. DoOD mal défini
3. Dépendances non identifiées

**Solutions**
```markdown
1. Découper les SPECs
   Règle : une SPEC = 1-2 jours max

   ❌ "SPEC-042 : Système complet de notifications"
   ✅ "SPEC-042a : Modèle de données notifications"
      "SPEC-042b : API notifications"
      "SPEC-042c : UI liste notifications"
      "SPEC-042d : Push notifications"

2. Clarifier le DoOD avant de commencer
   - Chaque item doit être vérifiable
   - Pas d'ambiguïté sur "c'est fini"

3. Identifier les dépendances
   - Lister explicitement les prérequis
   - Bloquer la SPEC tant que dépendances non prêtes
```

---

### Reviews qui traînent

**Symptôme**
Les PRs restent en review pendant des jours.

**Solutions**
```markdown
1. Définir un SLA de review
   "Toute PR doit avoir une première review dans les 4h"

2. Limiter la taille des PRs
   - Max 400 lignes de changement
   - Découper si plus gros

3. Rotation des reviewers
   - Pas toujours les mêmes personnes
   - Tout le monde review

4. Review asynchrone efficace
   - Description de PR complète
   - Screenshots/vidéos pour UI
   - Tests qui passent avant review
```

---

### Rétrospectives inefficaces

**Symptôme**
Les mêmes problèmes reviennent, les actions ne sont pas suivies.

**Solutions**
```markdown
1. Structurer la rétro
   - Timebox chaque section
   - Facilitation tournante
   - Format varié (pas toujours le même)

2. Limiter les actions
   - Max 3 actions par rétro
   - Chaque action a un owner
   - Actions SMART (spécifiques, mesurables)

3. Suivre les actions
   - Revue des actions précédentes en début de rétro
   - Tracker visible (board dédié)
```

---

## Problèmes Techniques

### Build qui échoue en CI mais pas en local

**Symptôme**
"Ça marche sur ma machine" mais le CI est rouge.

**Causes courantes**
1. Versions de dépendances différentes
2. Variables d'environnement manquantes
3. Cache local masque un problème
4. Différences OS (Windows vs Linux)

**Solutions**
```bash
# 1. Nettoyer le cache local
rm -rf node_modules
rm -rf .next  # ou équivalent
pnpm install
pnpm build

# 2. Vérifier les versions exactes
# Utiliser un lockfile strict
pnpm install --frozen-lockfile

# 3. Reproduire l'environnement CI
# Utiliser Docker ou act pour GitHub Actions
act -j build

# 4. Vérifier les variables d'environnement
# S'assurer que toutes les vars sont dans le CI
cat .env.example  # Toutes doivent être dans CI secrets
```

---

### Tests flaky

**Symptôme**
Tests qui passent parfois et échouent parfois.

**Causes courantes**
1. Dépendance au timing
2. État partagé entre tests
3. Mocks incomplets
4. Tests d'intégration fragiles

**Solutions**
```typescript
// 1. Éviter les timeouts arbitraires
// ❌
await new Promise(r => setTimeout(r, 1000))
expect(element).toBeVisible()

// ✅
await waitFor(() => {
  expect(element).toBeVisible()
})

// 2. Isoler l'état entre tests
beforeEach(() => {
  // Reset complet de l'état
  jest.clearAllMocks()
  queryClient.clear()
})

// 3. Mocker de manière déterministe
// ❌ Dépendre d'une vraie API
// ✅ MSW pour mocker les requêtes
const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(ctx.json(mockTasks))
  })
)

// 4. Retry automatique pour tests instables (temporaire)
// Configurer dans vitest.config.ts
{
  test: {
    retry: 2,  // Retry tests flaky
  }
}
// MAIS : identifier et fixer la cause racine
```

---

### Performance dégradée

**Symptôme**
Application lente, temps de réponse augmentés.

**Diagnostic**
```typescript
// 1. Identifier les goulots d'étranglement
// Frontend : React DevTools Profiler
// Backend : Logging des temps de réponse

// 2. Vérifier les requêtes N+1
// Logger les queries SQL
const prisma = new PrismaClient({
  log: ['query'],
})

// 3. Mesurer le bundle size
// npx vite-bundle-analyzer
// npx @next/bundle-analyzer

// 4. Profiler en production
// Utiliser les outils du framework (Next.js analytics, etc.)
```

**Solutions courantes**
```typescript
// 1. Ajouter des indexes manquants
// Identifier avec EXPLAIN ANALYZE
await prisma.$queryRaw`EXPLAIN ANALYZE SELECT * FROM tasks WHERE...`

// 2. Implémenter du caching
// TanStack Query côté client
const { data } = useQuery({
  queryKey: ['tasks'],
  staleTime: 5 * 60 * 1000,  // 5 min
})

// 3. Lazy loading des composants
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// 4. Optimiser les re-renders
const MemoizedComponent = memo(MyComponent)
const cachedValue = useMemo(() => expensiveCalculation(), [deps])
```

---

## Problèmes d'Équipe

### Silos de connaissance

**Symptôme**
Une seule personne comprend certaines parties du code.

**Solutions**
```markdown
1. Pair programming régulier
   - Rotation des pairs
   - Notamment sur les parties critiques

2. Documentation vivante
   - ADRs pour les décisions
   - README par module
   - Commentaires "pourquoi" pas "quoi"

3. Mob programming occasionnel
   - Pour les features complexes
   - Pour onboarder sur une zone

4. Review croisées
   - Pas toujours le même reviewer
   - Questions encouragées en review
```

---

### Communication défaillante

**Symptôme**
Malentendus fréquents, travail en double, frustration.

**Solutions**
```markdown
1. Canaux de communication clairs
   - Sync : meetings, calls
   - Async : Slack/Teams, commentaires PR
   - Documentation : Notion/Confluence

2. Conventions de communication
   - Réponse async < 4h
   - Urgence = call, pas message
   - Tout le monde lit les PRs

3. Standups efficaces
   - Max 15 min
   - Focus sur les blocages
   - Discussions détaillées après

4. Documentation des décisions
   - Pas de décision orale uniquement
   - Résumé écrit après discussion
```

---

### Résistance au framework

**Symptôme**
L'équipe n'adopte pas les pratiques AIAD.

**Solutions**
```markdown
1. Comprendre les résistances
   - Écouter les objections
   - Identifier les freins (temps, complexité, habitudes)

2. Démontrer la valeur
   - Commencer petit (un projet pilote)
   - Mesurer avant/après
   - Célébrer les succès

3. Adapter au contexte
   - Pas besoin de tout appliquer
   - Customiser pour l'équipe
   - Évolution progressive

4. Former et accompagner
   - Sessions de formation
   - Mentoring entre pairs
   - Support disponible
```

---

## Checklist de Diagnostic

```markdown
## Quand quelque chose ne va pas

### 1. Identifier le symptôme
- [ ] Quel est le problème exact ?
- [ ] Depuis quand ?
- [ ] Qui est affecté ?
- [ ] Quelle est la fréquence ?

### 2. Chercher la cause racine
- [ ] 5 Whys : pourquoi ? (5 fois)
- [ ] Qu'est-ce qui a changé récemment ?
- [ ] Le problème est-il reproductible ?

### 3. Trouver une solution
- [ ] Solution existe dans ce guide ?
- [ ] L'équipe a-t-elle déjà rencontré ça ?
- [ ] Besoin d'aide externe ?

### 4. Implémenter et vérifier
- [ ] Solution testée en local
- [ ] Solution déployée
- [ ] Problème résolu vérifié

### 5. Documenter
- [ ] Cause documentée
- [ ] Solution documentée
- [ ] Ajouté à ce guide si pertinent
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
