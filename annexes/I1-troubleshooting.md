# I.1 Troubleshooting

## Pourquoi cette annexe ?

Quand quelque chose ne fonctionne pas, chaque minute compte. Cette annexe fournit des solutions immédiates aux problèmes courants rencontrés avec AIAD : problèmes d'agents IA, de process, techniques ou d'équipe. Format diagnostic → cause → solution.

---

## Problèmes Agents IA

### L'agent ignore le contexte projet

**Symptômes**
- Code généré qui ne suit pas les conventions
- Import de librairies non utilisées dans le projet
- Patterns incohérents avec l'existant

**Diagnostic rapide**
```markdown
- [ ] AGENT-GUIDE existe ?
- [ ] AGENT-GUIDE chargé dans le contexte ?
- [ ] Exemples de code inclus ?
- [ ] Conventions documentées avec exemples concrets ?
```

**Solutions par cause**

| Cause | Solution | Temps |
|-------|----------|-------|
| AGENT-GUIDE absent | Créer avec template [A.3](A3-agent-guide.md) | 1h |
| AGENT-GUIDE non chargé | Vérifier configuration agent | 5min |
| Conventions vagues | Ajouter exemples concrets | 30min |
| Contexte trop long | Prioriser les sections critiques | 15min |

**Template de correction AGENT-GUIDE**
```markdown
## Conventions Obligatoires

### Nommage
- Composants : PascalCase (`UserProfile.tsx`)
- Hooks : camelCase avec prefix `use` (`useAuth.ts`)
- Utilitaires : kebab-case (`format-date.ts`)

### Exemple Concret
```typescript
// ✅ BON : suit nos conventions
export function UserProfile({ userId }: UserProfileProps) {
  const { data: user } = useUser(userId)
  return <Card>{user.name}</Card>
}

// ❌ MAUVAIS : ignore nos conventions
export default function userProfile(props: any) {
  const [user, setUser] = useState(null)
  // fetch manuel au lieu de notre hook
}
```
```

---

### L'agent génère du code de mauvaise qualité

**Symptômes**
- Code fonctionnel mais difficile à maintenir
- Types `any` partout
- Pas de gestion d'erreurs
- Duplication de code existant

**Diagnostic rapide**
```markdown
- [ ] Prompt spécifie les contraintes qualité ?
- [ ] Exemples de bon code fournis ?
- [ ] Règles de lint documentées ?
- [ ] Tests attendus mentionnés ?
```

**Comparaison prompt faible vs fort**

```markdown
❌ Prompt Faible
"Crée une fonction de filtrage des utilisateurs"

✅ Prompt Fort
"Crée une fonction de filtrage des utilisateurs qui :
- Utilise les types TypeScript stricts (pas de `any`)
- Suit le pattern de notre hook `useFilter` existant (voir src/hooks/)
- Est pure (pas d'effet de bord)
- Gère le cas liste vide
- Inclut les tests unitaires

Exemple de référence : src/hooks/useProductFilter.ts"
```

**Checklist qualité à inclure dans les prompts**
```markdown
## Contraintes Qualité

- [ ] TypeScript strict (no any, no ts-ignore)
- [ ] ESLint sans warning
- [ ] Composants < 150 lignes
- [ ] Fonctions < 30 lignes
- [ ] Un seul niveau d'abstraction par fonction
- [ ] Tests pour les cas nominaux et limites
```

---

### L'agent répète les mêmes erreurs

**Symptômes**
- Mêmes corrections demandées à chaque prompt
- L'agent "oublie" les préférences
- Patterns incorrects récurrents

**Solution : documenter les erreurs**

Ajouter une section dans AGENT-GUIDE :

```markdown
## Erreurs Fréquentes à Éviter

### 1. Ne jamais utiliser `any`
❌ `function process(data: any)`
✅ `function process(data: unknown)` puis narrowing

### 2. Ne jamais faire de fetch dans useEffect
❌ `useEffect(() => { fetch(...) }, [])`
✅ Utiliser `useQuery` de TanStack Query

### 3. Toujours utiliser nos composants UI
❌ `<button onClick={...}>`
✅ `<Button variant="primary" onClick={...}>`

### 4. Ne jamais console.log en production
❌ `console.log('debug:', data)`
✅ `logger.debug('message', { data })`
```

---

### L'agent produit trop ou pas assez de code

**Symptômes**
- Code minimal qui manque de robustesse
- Ou au contraire, sur-ingénierie massive
- Scope mal interprété

**Solution : calibrer le scope dans le prompt**

```markdown
## Template Prompt avec Scope Explicite

### Contexte
[Pourquoi cette tâche existe]

### Scope Inclus
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

### Scope Exclu
- Item A (sera fait dans SPEC-043)
- Item B (non nécessaire pour le MVP)

### Niveau de Robustesse Attendu
- Gestion d'erreurs : basique / standard / robuste
- Tests : unitaires seulement / + intégration / + E2E
- Documentation : JSDoc / + README / + Storybook
```

---

## Problèmes de Process

### SPECs qui débordent systématiquement

**Symptômes**
- "Presque fini" pendant plusieurs jours
- Scope qui grandit en cours de route
- Estimations toujours dépassées

**Diagnostic**
```markdown
- [ ] SPEC découpée en tâches < 2h ?
- [ ] DoOD défini et vérifiable ?
- [ ] Dépendances identifiées avant de commencer ?
- [ ] Périmètre figé (pas de scope creep) ?
```

**Règle du découpage**

```markdown
## Taille Optimale d'une SPEC

| Indicateur | Trop Petit | Optimal | Trop Gros |
|------------|------------|---------|-----------|
| Durée | < 2h | 4h - 2j | > 3j |
| Tâches | 1 | 3-7 | > 10 |
| Fichiers | 1 | 3-10 | > 15 |
| User Stories | 0 | 1-3 | > 5 |
```

**Exemple de découpage**

```markdown
❌ SPEC Trop Grosse
"SPEC-042 : Système complet de notifications"
- Modèle de données
- API CRUD
- WebSocket temps réel
- UI liste + détail + préférences
- Push notifications mobile
→ Durée réelle : 2 semaines de chaos

✅ SPECs Découpées
"SPEC-042a : Modèle données notifications" (1j)
"SPEC-042b : API CRUD notifications" (1j)
"SPEC-042c : UI liste notifications" (1j)
"SPEC-042d : WebSocket temps réel" (2j)
"SPEC-042e : Push notifications" (2j)
→ Durée réelle : 2 semaines, mais prévisibles
```

---

### Reviews qui bloquent le flux

**Symptômes**
- PRs en attente > 24h
- Contexte perdu quand le reviewer regarde enfin
- Frustration des deux côtés

**Solutions structurelles**

```markdown
## SLA de Review

| Type de PR | Délai 1ère review | Délai merge |
|------------|-------------------|-------------|
| Hotfix | 1h | 2h |
| Bug fix | 4h | 8h |
| Feature | 8h | 24h |
| Refactoring | 24h | 48h |
```

**Checklist avant de demander une review**
```markdown
## Prêt pour Review ?

- [ ] Tests passent (CI vert)
- [ ] Description PR complète
- [ ] Screenshots/vidéos si UI
- [ ] Self-review effectuée
- [ ] Taille raisonnable (< 400 lignes)
- [ ] Un seul sujet par PR
```

**Optimiser la taille des PRs**

```markdown
## Stratégie de Découpage

Grande feature → plusieurs PRs :

1. PR 1 : Types et interfaces (reviewable en 10min)
2. PR 2 : Logique métier + tests (reviewable en 30min)
3. PR 3 : UI composants (reviewable en 20min)
4. PR 4 : Intégration + E2E (reviewable en 15min)

Total : 4 reviews rapides > 1 review interminable
```

---

### Rétrospectives sans impact

**Symptômes**
- Mêmes problèmes discutés chaque fois
- Actions non suivies
- Équipe désengagée

**Diagnostic**
```markdown
- [ ] Actions limitées (max 3) ?
- [ ] Chaque action a un owner ?
- [ ] Actions SMART (spécifiques, mesurables) ?
- [ ] Suivi en début de rétro suivante ?
```

**Template de suivi d'actions**

```markdown
## Actions Rétro Sprint 12

| Action | Owner | Deadline | Critère Succès | Statut |
|--------|-------|----------|----------------|--------|
| Documenter les erreurs agents récurrentes | Alice | S13 | Section ajoutée dans AGENT-GUIDE | ✅ Done |
| Réduire taille max des PRs à 300 lignes | Bob | S13 | Règle PR ajoutée + config | 🔄 En cours |
| Timebox les standups à 10min | Équipe | Immédiat | Mesure sur 5 standups | ❌ Non fait |

## Revue Début Rétro S13
- Action 1 : Terminée, impact visible (moins de corrections)
- Action 2 : En cours, 80% fait
- Action 3 : Non fait → reporter ou abandonner ?
```

---

## Problèmes Techniques

### Build échoue en CI mais pas en local

**Diagnostic systématique**

```bash
# 1. Nettoyer l'environnement local
rm -rf node_modules .next .astro dist
pnpm install --frozen-lockfile
pnpm build

# 2. Vérifier les versions exactes
node --version  # Comparer avec CI
pnpm --version  # Comparer avec CI

# 3. Reproduire l'environnement CI
# Option A : Docker
docker build -t test-build .
docker run test-build pnpm build

# Option B : act (pour GitHub Actions)
act -j build

# 4. Vérifier les variables d'environnement
# Lister celles utilisées
grep -r "process.env" src/
# Comparer avec celles définies en CI
```

**Causes fréquentes et solutions**

| Cause | Symptôme | Solution |
|-------|----------|----------|
| Lockfile outdated | Versions différentes | `pnpm install --frozen-lockfile` |
| Env vars manquantes | Undefined errors | Ajouter au CI secrets |
| Cache local | Marche après clean | Forcer fresh install en CI |
| Casing fichiers | Linux ≠ Windows | Respecter la casse exacte |
| Dépendances dev | Module not found | Vérifier `devDependencies` |

---

### Tests instables (flaky)

**Identification**

```typescript
// Ajouter temporairement pour identifier les flaky
describe('Ma suite', () => {
  it.each(Array(10).fill(null))('test répété %#', async () => {
    // Test suspect
  })
})
```

**Solutions par type de flaky**

```typescript
// ❌ Problème : timing arbitraire
await new Promise(r => setTimeout(r, 1000))
expect(element).toBeVisible()

// ✅ Solution : attendre la condition
await waitFor(() => {
  expect(element).toBeVisible()
}, { timeout: 5000 })

// ❌ Problème : état partagé entre tests
let globalState = []

// ✅ Solution : reset dans beforeEach
beforeEach(() => {
  globalState = []
  jest.clearAllMocks()
})

// ❌ Problème : ordre des tests dépendant
it('test 1', () => { sharedData = 'set' })
it('test 2', () => { expect(sharedData).toBe('set') })

// ✅ Solution : tests indépendants
it('test 1', () => {
  const localData = 'set'
  expect(localData).toBe('set')
})

// ❌ Problème : dates/heures dynamiques
expect(result.createdAt).toBe(new Date())

// ✅ Solution : mocker le temps
jest.useFakeTimers()
jest.setSystemTime(new Date('2024-01-15'))
```

---

### Performance dégradée

**Diagnostic rapide**

```markdown
## Checklist Performance

### Frontend
- [ ] Bundle size vérifié ? (`pnpm analyze`)
- [ ] Lazy loading des routes ?
- [ ] Images optimisées (WebP, lazy) ?
- [ ] Re-renders excessifs ? (React DevTools)
- [ ] Requêtes N+1 côté client ?

### Backend
- [ ] Requêtes DB avec EXPLAIN ANALYZE ?
- [ ] Index manquants ?
- [ ] Caching en place ?
- [ ] Pagination implémentée ?
```

**Solutions communes**

```typescript
// 1. Réduire les re-renders React
const MemoizedComponent = memo(ExpensiveComponent)
const cachedValue = useMemo(() => heavyComputation(data), [data])
const stableCallback = useCallback(() => doSomething(), [])

// 2. Optimiser le data fetching
const { data } = useQuery({
  queryKey: ['users'],
  staleTime: 5 * 60 * 1000,  // Cache 5 min
  gcTime: 30 * 60 * 1000,    // Garde en mémoire 30 min
})

// 3. Lazy loading des composants
const HeavyChart = lazy(() => import('./HeavyChart'))

// Dans le JSX
<Suspense fallback={<ChartSkeleton />}>
  <HeavyChart data={data} />
</Suspense>

// 4. Virtualisation des longues listes
import { useVirtualizer } from '@tanstack/react-virtual'

const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 35,
})
```

---

## Problèmes d'Équipe

### Silos de connaissance

**Symptômes**
- "Seul X sait comment ça marche"
- Bus factor = 1
- Blocage quand quelqu'un est absent

**Actions correctives**

```markdown
## Plan Anti-Silos

### Court terme (cette semaine)
- [ ] Identifier les 3 zones les plus risquées
- [ ] Planifier 1 session pair programming par zone

### Moyen terme (ce mois)
- [ ] Rotation des reviewers obligatoire
- [ ] Documentation des décisions critiques (ADR)
- [ ] Mob programming sur les nouvelles features complexes

### Long terme (ce trimestre)
- [ ] Chaque zone a 2+ personnes compétentes
- [ ] README technique par module
- [ ] Onboarding documenté pour chaque zone
```

**Template ADR pour décisions critiques**

```markdown
# ADR-003 : Choix de TanStack Query pour le data fetching

## Statut
Accepté (2024-01-15)

## Contexte
Besoin de gérer le cache et les états de chargement de manière cohérente.

## Décision
Utiliser TanStack Query pour tout le data fetching côté client.

## Conséquences
- ✅ Cache automatique
- ✅ États loading/error standardisés
- ⚠️ Courbe d'apprentissage pour l'équipe
- ⚠️ Dépendance externe

## Personnes Impliquées
@alice, @bob, @charlie
```

---

### Résistance à l'adoption AIAD

**Symptômes**
- "On a toujours fait autrement"
- Adoption superficielle (checkbox)
- Retour aux anciennes habitudes

**Stratégie d'adoption progressive**

```markdown
## Plan d'Adoption

### Phase 1 : Quick Wins (2 semaines)
- Commencer par UN seul aspect (ex: AGENT-GUIDE)
- Mesurer avant/après
- Célébrer les succès

### Phase 2 : Expansion (1 mois)
- Ajouter les SPECs sur 1 projet pilote
- Former l'équipe
- Collecter le feedback

### Phase 3 : Standardisation (2 mois)
- Étendre aux autres projets
- Adapter au contexte spécifique
- Documenter les learnings

## Métriques d'Adoption

| Métrique | Avant | Après 1 mois | Objectif |
|----------|-------|--------------|----------|
| Temps moyen par feature | 5j | 3j | -40% |
| Bugs en production | 8/mois | 5/mois | -50% |
| Satisfaction équipe | 6/10 | 7/10 | 8/10 |
```

---

## Anti-patterns Troubleshooting

### Ce qu'il NE faut PAS faire

```markdown
❌ Changer plusieurs choses à la fois
   → Change une seule variable, vérifie, répète

❌ Blâmer l'outil/le framework
   → Le problème est probablement dans ton code

❌ Passer des heures sans demander d'aide
   → 30min bloqué = demander de l'aide

❌ Contourner sans comprendre
   → Le hack reviendra te hanter

❌ Corriger sans documenter
   → Le prochain (ou toi dans 3 mois) refera la même erreur
```

---

## Checklist de Diagnostic Universel

```markdown
## Quand Quelque Chose Ne Va Pas

### 1. Identifier
- [ ] Quel est le symptôme exact ?
- [ ] Depuis quand ?
- [ ] Qui/quoi est affecté ?
- [ ] Est-ce reproductible ?

### 2. Isoler
- [ ] Qu'est-ce qui a changé récemment ?
- [ ] Le problème existe-t-il dans un environnement minimal ?
- [ ] Les logs disent quoi ?

### 3. Résoudre
- [ ] Solution trouvée dans cette annexe ?
- [ ] Solution trouvée en ligne (Stack Overflow, GitHub issues) ?
- [ ] Besoin d'escalader ?

### 4. Vérifier
- [ ] Fix testé localement ?
- [ ] Fix déployé et vérifié ?
- [ ] Pas de régression introduite ?

### 5. Documenter
- [ ] Cause racine comprise ?
- [ ] Solution documentée (ici ou dans le code) ?
- [ ] Prévention mise en place ?
```

---

## Ressources Connexes

- [A.3 Template AGENT-GUIDE](A3-agent-guide.md) - Prévenir les problèmes d'agents
- [A.4 Template SPECS](A4-specs.md) - Structurer correctement les SPECs
- [D.4 Rétrospective](D4-retrospective.md) - Améliorer continuellement
- [H.3 Anti-patterns](H3-anti-patterns.md) - Éviter les erreurs courantes

---

*Dernière mise à jour : Janvier 2025*
