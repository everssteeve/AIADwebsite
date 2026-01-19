# PARTIE 5 : PHASE DE DÉPLOIEMENT

Le déploiement livre le code validé en production de manière contrôlée.

## 5.1 Checklist pré-déploiement

| ✓ | Vérification | Commande |
|---|--------------|----------|
| ☐ | Tests passent | `npm run test` |
| ☐ | Build réussi | `npm run build` |
| ☐ | Variables d'env configurées | Vérifier .env.production |
| ☐ | Migrations prêtes | `npx prisma migrate status` |
| ☐ | Rollback documenté | Procédure en place |

## 5.2 Déploiement

```bash
# Staging
git tag -a v1.0.0-rc1 -m "Release candidate 1"
git push origin v1.0.0-rc1
railway up --environment staging

# Vérification
curl https://staging.app.com/health

# Production (après validation staging)
railway up --environment production
curl https://app.com/health

# Rollback si problème
railway rollback --environment production
```
