# F.1 Agent Security

## Pourquoi cet agent ?

L'agent Security analyse le code pour détecter les vulnérabilités de sécurité, les secrets exposés et les problèmes de conformité OWASP.

---

## Cas d'Usage

| Situation | Utilisation |
|-----------|-------------|
| Review de code | Détecter les failles avant merge |
| Audit périodique | Scan complet de la codebase |
| Nouvelle intégration externe | Vérifier les risques |
| Pré-release | Validation de sécurité |

---

## Configuration

### System Prompt

```markdown
Tu es un expert en sécurité applicative. Ton rôle est d'analyser le code
pour identifier les vulnérabilités de sécurité selon les standards OWASP.

## Ton Approche

1. Analyser le code fourni pour les vulnérabilités
2. Prioriser par criticité (Critical > High > Medium > Low)
3. Expliquer clairement chaque vulnérabilité
4. Proposer un fix concret

## Ce que tu Recherches

### Injection (OWASP A03)
- SQL Injection
- Command Injection
- LDAP Injection
- XPath Injection

### Broken Authentication (OWASP A07)
- Credentials en dur
- Session mal gérée
- Tokens faibles

### Sensitive Data Exposure (OWASP A02)
- Secrets dans le code
- Logs de données sensibles
- Transmission non chiffrée

### XSS (OWASP A03)
- Reflected XSS
- Stored XSS
- DOM-based XSS

### Security Misconfiguration (OWASP A05)
- Headers manquants
- Debug mode en prod
- Permissions excessives

### Autres
- CSRF
- Path Traversal
- Insecure Deserialization
- Using Components with Known Vulnerabilities

## Format de Réponse

Pour chaque vulnérabilité trouvée :

### [SEVERITY] Titre

**Fichier** : path/to/file.ts:ligne
**Type** : OWASP Category
**Description** : Explication claire du problème
**Impact** : Ce qui peut arriver si exploité
**Fix** :
```code
// Code corrigé
```

Si aucune vulnérabilité : "Aucune vulnérabilité détectée dans le code analysé."
```

### Règles Spécifiques

```markdown
## Règles Security Agent

### Secrets
Patterns à détecter :
- API keys : /[a-zA-Z0-9_-]{20,}/
- AWS keys : /AKIA[0-9A-Z]{16}/
- JWT secrets en dur
- Passwords dans le code
- Connection strings avec credentials

### Input Validation
Vérifier :
- Tous les inputs utilisateur sont validés
- Validation côté serveur (pas seulement client)
- Types stricts (pas de any avec des inputs)
- Taille max pour les strings/arrays

### Authentication
Vérifier :
- Pas de comparaison de password en plaintext
- Tokens avec expiration
- Rate limiting sur les endpoints auth
- Sessions invalidées au logout

### Autorisation
Vérifier :
- Checks d'autorisation sur chaque endpoint
- Pas d'IDOR (Insecure Direct Object Reference)
- Principe du moindre privilège
```

---

## Utilisation

### Scan de PR

```markdown
## Prompt : Scan Security PR

Analyse les changements de cette PR pour détecter des vulnérabilités :

### Fichiers Modifiés
[Liste des fichiers et diff]

### Contexte
- Projet : [Description]
- Type de changement : [Feature/Fix/Refactor]

Focus sur :
1. Nouvelles entrées utilisateur
2. Changements d'authentification/autorisation
3. Nouveaux endpoints API
4. Manipulation de données sensibles
```

### Audit Complet

```markdown
## Prompt : Audit Security

Réalise un audit de sécurité complet sur les fichiers suivants :

[Liste des fichiers critiques]

Focus particulier sur :
- Authentification : src/auth/*
- API : src/api/*
- Base de données : src/db/*

Génère un rapport avec :
1. Résumé exécutif
2. Vulnérabilités par criticité
3. Recommandations prioritaires
```

### Check Pre-Release

```markdown
## Prompt : Security Checklist Pre-Release

Vérifie que cette release respecte la checklist de sécurité :

### Checklist
- [ ] Pas de secrets dans le code
- [ ] Tous les inputs validés
- [ ] HTTPS enforced
- [ ] Headers de sécurité configurés
- [ ] Dépendances sans vulnérabilités connues
- [ ] Logs sans données sensibles
- [ ] Rate limiting en place
- [ ] CORS correctement configuré

### Fichiers de Configuration
[Config files à vérifier]

### Output Attendu
Pour chaque item : ✅ OK ou ❌ Problème détecté avec détails
```

---

## Rapport Type

```markdown
# Rapport Security Audit - [Date]

## Résumé Exécutif

| Sévérité | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 1 |
| 🟡 Medium | 3 |
| 🔵 Low | 2 |

**Status Global** : ⚠️ Issues à corriger avant release

---

## Vulnérabilités

### 🟠 HIGH - SQL Injection dans UserService

**Fichier** : src/services/user.service.ts:45
**Type** : OWASP A03 - Injection

**Code Vulnérable**
```typescript
const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`)
```

**Description**
L'ID utilisateur est interpolé directement dans la requête SQL sans paramétrage,
permettant une injection SQL.

**Impact**
Un attaquant peut :
- Extraire toutes les données de la base
- Modifier ou supprimer des données
- Potentiellement exécuter des commandes système

**Fix**
```typescript
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId])
```

**Priorité** : Corriger immédiatement

---

### 🟡 MEDIUM - XSS dans TaskCard

**Fichier** : src/components/TaskCard.tsx:23
**Type** : OWASP A03 - XSS

**Code Vulnérable**
```tsx
<div dangerouslySetInnerHTML={{ __html: task.description }} />
```

**Description**
Le contenu HTML de task.description est rendu sans sanitization.

**Impact**
Un attaquant peut injecter du JavaScript exécuté dans le navigateur des victimes.

**Fix**
```tsx
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.description) }} />
```

Ou mieux, ne pas permettre HTML :
```tsx
<div>{task.description}</div>
```

---

## Recommandations

### Court Terme (avant release)
1. Corriger l'injection SQL - CRITIQUE
2. Sanitizer ou supprimer dangerouslySetInnerHTML

### Moyen Terme
1. Ajouter un scan de sécurité automatique en CI
2. Former l'équipe aux vulnérabilités OWASP
3. Revoir la gestion des secrets

### Long Terme
1. Mettre en place un bug bounty
2. Audit externe annuel
```

---

## Intégration CI

```yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Scan des secrets
      - name: Detect secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main

      # Scan des dépendances
      - name: Audit dependencies
        run: pnpm audit --audit-level=high

      # Scan statique (semgrep)
      - name: Static analysis
        uses: returntocorp/semgrep-action@v1
        with:
          config: p/security-audit

      # Custom AI Security Review (optionnel)
      - name: AI Security Review
        if: github.event_name == 'pull_request'
        run: |
          # Script appelant l'agent security sur les fichiers modifiés
          ./scripts/ai-security-review.sh
```

---

## Bonnes Pratiques

### Quand Utiliser l'Agent Security

| Moment | Scope | Automatique |
|--------|-------|-------------|
| Chaque PR | Diff uniquement | Oui (CI) |
| Weekly | Fichiers critiques | Oui (cron) |
| Pre-release | Full audit | Manuel |
| Post-incident | Zone concernée | Manuel |

### Limites de l'Agent

L'agent IA est complémentaire aux outils traditionnels :
- ✅ Bon pour : détecter des patterns, expliquer les risques
- ⚠️ Limité pour : vulnérabilités logiques complexes
- ❌ Pas suffisant pour : audit de conformité formel

### Combinaison Recommandée

```markdown
## Stack Security

1. **Agent IA** : Review contextuelle, explication
2. **SAST** (Semgrep, CodeQL) : Scan exhaustif automatique
3. **Dependency Audit** (npm audit, Snyk) : Vulnérabilités deps
4. **Secret Scanner** (TruffleHog, git-secrets) : Leaks
5. **Pentest Manuel** : Audit humain périodique
```

---

*Retour aux [Annexes](../framework/08-annexes.md)*
