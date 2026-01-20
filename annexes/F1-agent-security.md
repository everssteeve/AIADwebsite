# F.1 Agent Security

## Pourquoi cette annexe ?

Le code généré par les agents IA peut contenir des vulnérabilités de sécurité. L'Agent Security détecte les failles OWASP, les secrets exposés et les problèmes de conformité **avant** qu'ils n'atteignent la production. Cette annexe fournit la configuration complète, les prompts et les patterns d'intégration CI/CD.

---

## System Prompt Complet

```markdown
Tu es un expert en sécurité applicative. Ton rôle est d'analyser le code
pour identifier les vulnérabilités de sécurité selon les standards OWASP Top 10.

## Ton Approche

1. Analyser le code fourni méthodiquement
2. Prioriser par criticité (Critical > High > Medium > Low)
3. Expliquer clairement chaque vulnérabilité et son impact
4. Proposer un fix concret et testable

## Catégories de Vulnérabilités (OWASP 2021)

### A01 - Broken Access Control
- Élévation de privilèges
- IDOR (Insecure Direct Object Reference)
- Contournement des contrôles d'accès
- Manipulation de tokens/sessions

### A02 - Cryptographic Failures
- Données sensibles en clair
- Algorithmes de chiffrement faibles
- Gestion incorrecte des clés
- Transmission non chiffrée (HTTP)

### A03 - Injection
- SQL Injection
- Command Injection
- XSS (Reflected, Stored, DOM-based)
- LDAP/XPath Injection
- Template Injection

### A04 - Insecure Design
- Absence de contrôles de sécurité
- Logique métier vulnérable
- Manque de rate limiting

### A05 - Security Misconfiguration
- Headers de sécurité manquants
- Debug mode en production
- Permissions excessives
- Stack traces exposées

### A06 - Vulnerable Components
- Dépendances avec CVE connues
- Composants non maintenus

### A07 - Authentication Failures
- Credentials en dur dans le code
- Sessions mal gérées
- Tokens sans expiration
- Absence de MFA sur des opérations critiques

### A08 - Software and Data Integrity Failures
- Désérialisation non sécurisée
- CI/CD sans vérification d'intégrité

### A09 - Security Logging Failures
- Logs insuffisants sur les événements de sécurité
- Logs contenant des données sensibles

### A10 - Server-Side Request Forgery (SSRF)
- URLs non validées côté serveur
- Accès à des ressources internes

## Patterns de Secrets à Détecter

- API keys : /[a-zA-Z0-9_-]{20,}/
- AWS keys : /AKIA[0-9A-Z]{16}/
- JWT secrets en dur
- Connection strings avec credentials
- Tokens GitHub/GitLab
- Private keys (RSA, SSH)

## Format de Rapport

Pour chaque vulnérabilité :

### [SEVERITY] Titre Court

**Fichier** : path/to/file.ts:ligne
**Catégorie** : OWASP AXX - Nom
**CWE** : CWE-XXX (si applicable)

**Description**
Explication claire du problème et comment il peut être exploité.

**Impact**
Ce qui peut arriver si exploité (data breach, RCE, etc.).

**Code Vulnérable**
```code
// Extrait du code problématique
```

**Fix Recommandé**
```code
// Code corrigé
```

**Test de Validation**
Comment vérifier que le fix fonctionne.

---

Si aucune vulnérabilité : "Aucune vulnérabilité détectée dans le scope analysé."
```

---

## Utilisation par Contexte

### Scan de Pull Request

```markdown
## Contexte
Analyse les changements de cette PR pour détecter des vulnérabilités.

## Fichiers Modifiés
[Coller le diff ou les fichiers modifiés]

## Type de Changement
- [ ] Nouvelle feature
- [ ] Modification d'authentification/autorisation
- [ ] Nouvel endpoint API
- [ ] Manipulation de données utilisateur
- [ ] Intégration externe

## Focus Prioritaire
1. Nouvelles entrées utilisateur non validées
2. Changements de contrôle d'accès
3. Manipulation de données sensibles
4. Appels à des services externes
```

### Audit de Sécurité Complet

```markdown
## Contexte
Audit de sécurité complet pour [nom du projet].

## Périmètre
- Authentification : src/auth/*
- API : src/api/*
- Base de données : src/db/*
- Configuration : *.config.* .env*

## Stack Technique
- Runtime : Node.js 20 / Python 3.11 / etc.
- Framework : Express / FastAPI / etc.
- Base de données : PostgreSQL / MongoDB / etc.

## Rapport Attendu
1. Executive summary (1 paragraphe)
2. Vulnérabilités classées par criticité
3. Quick wins (fixes < 1h)
4. Recommandations moyen terme
```

### Checklist Pre-Release

```markdown
## Checklist Sécurité Pre-Release

Vérifie que cette release respecte les critères de sécurité :

### Configuration
- [ ] Pas de secrets dans le code source
- [ ] Variables d'environnement pour les credentials
- [ ] HTTPS enforced
- [ ] Headers de sécurité (CSP, HSTS, X-Frame-Options)

### Input/Output
- [ ] Tous les inputs utilisateur validés côté serveur
- [ ] Output encoding pour prévenir XSS
- [ ] Requêtes SQL paramétrées

### Authentification
- [ ] Tokens avec expiration
- [ ] Rate limiting sur endpoints auth
- [ ] Sessions invalidées au logout

### Dépendances
- [ ] `npm audit` / `pip audit` sans vulnérabilités high/critical
- [ ] Dépendances à jour

### Logs
- [ ] Pas de données sensibles dans les logs
- [ ] Événements de sécurité loggés

## Fichiers de Configuration à Vérifier
[Liste des fichiers]
```

---

## Exemples Pratiques

### Exemple 1 : SQL Injection Détectée

**Input analysé :**
```typescript
async function getUser(userId: string) {
  return db.query(`SELECT * FROM users WHERE id = '${userId}'`)
}
```

**Output de l'Agent :**

### 🔴 CRITICAL - SQL Injection dans getUser

**Fichier** : src/services/user.service.ts:23
**Catégorie** : OWASP A03 - Injection
**CWE** : CWE-89

**Description**
L'ID utilisateur est interpolé directement dans la requête SQL sans échappement ni paramétrage. Un attaquant peut injecter du SQL arbitraire.

**Impact**
- Extraction complète de la base de données
- Modification/suppression de données
- Contournement d'authentification
- Potentiellement : exécution de commandes système (selon le SGBD)

**Vecteur d'attaque**
```
userId = "' OR '1'='1' --"
→ SELECT * FROM users WHERE id = '' OR '1'='1' --'
```

**Code Vulnérable**
```typescript
return db.query(`SELECT * FROM users WHERE id = '${userId}'`)
```

**Fix Recommandé**
```typescript
return db.query('SELECT * FROM users WHERE id = $1', [userId])
```

**Test de Validation**
```typescript
// Ce test doit retourner null, pas tous les users
const result = await getUser("' OR '1'='1")
expect(result).toBeNull()
```

---

### Exemple 2 : Secret Détecté

**Input analysé :**
```typescript
const stripe = new Stripe('sk_live_XXXXXXXXXXXXXXXXXXXX')
```

**Output de l'Agent :**

### 🔴 CRITICAL - Secret Stripe en Dur

**Fichier** : src/payment/stripe.ts:5
**Catégorie** : OWASP A02 - Cryptographic Failures
**CWE** : CWE-798

**Description**
La clé API Stripe live est exposée en clair dans le code source. Cette clé sera visible dans le repository git et potentiellement dans les bundles clients.

**Impact**
- Accès complet au compte Stripe
- Fraude financière possible
- Violation de conformité PCI-DSS

**Fix Recommandé**
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
```

**Actions Immédiates**
1. Révoquer immédiatement cette clé dans le dashboard Stripe
2. Générer une nouvelle clé
3. Configurer via variable d'environnement
4. Scanner l'historique git (la clé y reste même après suppression)

---

## Rapport Type

```markdown
# Rapport Security Audit - [Projet] - [Date]

## Executive Summary

Audit réalisé sur [périmètre]. **[X] vulnérabilités** identifiées dont
**[Y] critiques** nécessitant une correction immédiate avant mise en production.

| Sévérité | Count | Action |
|----------|-------|--------|
| 🔴 Critical | 2 | Bloquer le déploiement |
| 🟠 High | 3 | Corriger cette semaine |
| 🟡 Medium | 5 | Planifier correction |
| 🟢 Low | 2 | À évaluer |

**Verdict** : ❌ Non prêt pour production

---

## Vulnérabilités Critiques

[Détail de chaque vulnérabilité critique...]

## Vulnérabilités High

[Détail...]

## Quick Wins

Corrections rapides (< 1h chacune) :
1. Ajouter helmet.js pour les headers de sécurité
2. Activer HTTPS strict
3. Supprimer console.log contenant des tokens

## Recommandations Long Terme

1. Mettre en place SAST en CI (Semgrep, CodeQL)
2. Audit externe annuel
3. Formation équipe OWASP Top 10
```

---

## Intégration CI/CD

### GitHub Actions

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # Scan des secrets
      - name: Detect secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}

      # Audit des dépendances
      - name: Audit dependencies
        run: npm audit --audit-level=high

      # Analyse statique SAST
      - name: SAST with Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/secrets
            p/owasp-top-ten

      # Review IA sur les PRs
      - name: AI Security Review
        if: github.event_name == 'pull_request'
        run: ./scripts/ai-security-review.sh
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Script de Review IA

```bash
#!/bin/bash
# scripts/ai-security-review.sh

# Récupérer les fichiers modifiés
CHANGED_FILES=$(git diff --name-only origin/$GITHUB_BASE_REF...HEAD)

# Filtrer les fichiers pertinents (code source uniquement)
CODE_FILES=$(echo "$CHANGED_FILES" | grep -E '\.(ts|js|py|go|java)$')

if [ -z "$CODE_FILES" ]; then
  echo "No code files changed, skipping AI review"
  exit 0
fi

# Construire le prompt avec le diff
DIFF=$(git diff origin/$GITHUB_BASE_REF...HEAD -- $CODE_FILES)

# Appeler l'API Claude avec le system prompt Security Agent
# [Implémentation selon votre setup]
```

---

## Anti-patterns

### ❌ Scanner tout le code à chaque PR

**Problème** : Temps de review trop long, bruit dans les résultats.

**Solution** : Scanner uniquement le diff de la PR. Réserver les scans complets aux releases.

### ❌ Ignorer les faux positifs sans documenter

**Problème** : On perd la trace de pourquoi c'était un faux positif.

**Solution** : Utiliser des commentaires `// security-ignore: raison` ou un fichier `.security-ignore.json` documenté.

### ❌ Se fier uniquement à l'Agent IA

**Problème** : L'IA peut manquer des vulnérabilités logiques complexes.

**Solution** : Combiner avec SAST, audit de dépendances et pentest manuel.

### ❌ Bloquer sur chaque finding "Medium"

**Problème** : Ralentit excessivement le delivery.

**Solution** : Définir des seuils clairs :
- Critical/High : Bloquant
- Medium : Ticket créé, correction dans le sprint
- Low : Backlog

### ❌ Stocker le rapport de sécurité dans le repo public

**Problème** : Expose les vulnérabilités aux attaquants.

**Solution** : Rapports dans un channel privé, tickets dans un board restreint.

---

## Checklist Agent Security

### Configuration
- [ ] System prompt adapté au contexte projet
- [ ] Catégories OWASP pertinentes activées
- [ ] Patterns de secrets du projet ajoutés

### Intégration
- [ ] Scan automatique sur chaque PR
- [ ] Seuils de blocage définis (critical/high)
- [ ] Rapport envoyé dans le bon channel

### Compléments
- [ ] SAST (Semgrep/CodeQL) configuré
- [ ] Audit dépendances (`npm audit`, Snyk)
- [ ] Secret scanner (TruffleHog, git-secrets)

### Process
- [ ] Procédure de réponse aux vulnérabilités documentée
- [ ] Équipe formée à l'interprétation des rapports
- [ ] Revue des faux positifs planifiée

---

## Limites de l'Agent

| Capacité | Agent IA | Outil SAST | Pentest Manuel |
|----------|----------|------------|----------------|
| Détection patterns connus | ✅ Bon | ✅ Excellent | ✅ Bon |
| Explication pédagogique | ✅ Excellent | ❌ Limité | ✅ Variable |
| Vulnérabilités logiques | ⚠️ Limité | ❌ Non | ✅ Excellent |
| Exhaustivité | ⚠️ Variable | ✅ Complet | ⚠️ Scope limité |
| Conformité formelle | ❌ Non | ✅ Avec config | ✅ Certifiable |
| Coût | 💰 Faible | 💰💰 Moyen | 💰💰💰 Élevé |

**Recommandation** : Utiliser l'Agent Security en première ligne (feedback rapide, pédagogie), complété par SAST pour l'exhaustivité et pentest annuel pour la validation formelle.

---

*Voir aussi : [F.2 Agent Quality](./F2-agent-quality.md) • [F.6 Agent Code Review](./F6-agent-code-review.md) • [B.4 Tech Lead](./B4-tech-lead.md)*
