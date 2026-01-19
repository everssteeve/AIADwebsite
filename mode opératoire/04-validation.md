# PARTIE 4 : PHASE DE VALIDATION

La validation assure que le code répond aux exigences du PRD et aux standards de qualité.

## 4.1 Validation QA

| | |
|---|---|
| 🎭 **ACTEUR** | QA Engineer |
| 📥 **ENTRÉES** | Code mergé, critères d'acceptation |
| 📤 **SORTIES** | Rapport de validation |
| ⏱️ **DURÉE** | Variable |
| 🔗 **DÉPENDANCES** | Code mergé |

| Type de test | Objectif | Automatisation |
|--------------|----------|----------------|
| Fonctionnel | Vérifier critères d'acceptation | 70% |
| Régression | Rien n'est cassé | 100% |
| Exploratoire | Trouver bugs non anticipés | 0% |

### 4.1.1 Template rapport

```markdown
# Rapport de Validation - US-001

## Résumé
| Critère | Statut |
|---------|--------|
| AC-001-1 | ✅ Validé |
| AC-001-2 | ✅ Validé |
| AC-001-3 | ⚠️ Mineur |

## Bugs
| ID | Sévérité | Description |
|----|----------|-------------|
| BUG-042 | Mineur | [Description] |

## Conclusion
**VALIDÉ avec réserves**
```

## 4.2 Validation PO

| | |
|---|---|
| 🎭 **ACTEUR** | Product Owner |
| 📥 **ENTRÉES** | Validation QA OK |
| 📤 **SORTIES** | Acceptation ou refus |
| ⏱️ **DURÉE** | 30 min - 1h |
| 🔗 **DÉPENDANCES** | Validation QA |

1. PE prépare l'environnement de démo
2. PE présente la fonctionnalité
3. PO vérifie chaque critère d'acceptation
4. PO teste lui-même
5. PO donne son verdict
