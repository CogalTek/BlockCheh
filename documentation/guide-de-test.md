# Guide de Test – BlockCheh (Plateforme de Tokenisation XRPL)

## Prérequis
- Docker lancé (`docker compose up -d`)
- Migration Prisma à jour (`npx prisma migrate dev`)
- `XRPL_ADMIN_SEED` configuré dans `.env` avec un wallet financé sur le testnet
- Serveur de dev lancé (`npm run dev`)
- Faucet XRPL : https://faucet.altnet.rippletest.net/

---

## 🧪 Scénario 1 – Onboarding utilisateur (KYC)

**Objectif** : Vérifier le flux complet d'inscription et de vérification d'identité.

| #   | Action                 | URL / Bouton                                              | Résultat attendu                              |
| --- | ---------------------- | --------------------------------------------------------- | --------------------------------------------- |
| 1   | Se connecter via Kinde | `http://localhost:3000/api/auth/login`                    | Redirection → Kinde → callback → `/dashboard` |
| 2   | Vérifier le dashboard  | `/dashboard`                                              | Bouton "Compléter KYC" visible en jaune       |
| 3   | Soumettre KYC          | Clic "Compléter KYC" → remplir nom + document → Soumettre | Message succès + adresse wallet XRPL affichée |
| 4   | Vérifier statut KYC    | `/dashboard/settings`                                     | Statut "En attente" avec icône orange         |
| 5   | Approuver KYC (admin)  | `/administration` → onglet KYC → Approuver                | Statut passe à "APPROVED"                     |
| 6   | Retourner au dashboard | `/dashboard`                                              | Badge "KYC validé" vert, wallet visible       |

---

## 🧪 Scénario 2 – Tokenisation NFT (XLS-20)

**Objectif** : Mint d'un NFT, affichage dans le marketplace, achat par un utilisateur.

| #   | Action                  | URL / Bouton                                           | Résultat attendu                        |
| --- | ----------------------- | ------------------------------------------------------ | --------------------------------------- |
| 1   | Mint un NFT (admin)     | `/administration` → onglet NFTs → remplir + "Mint NFT" | Message succès avec TX hash             |
| 2   | Sync si nécessaire      | Bouton "Sync blockchain"                               | NFT apparaît dans le tableau            |
| 3   | Vérifier le marketplace | `/dashboard/marketplace`                               | NFT visible avec nom, catégorie et prix |
| 4   | Filtrer par catégorie   | Menu déroulant "Catégorie"                             | Filtre fonctionne correctement          |
| 5   | Vérifier la page docs   | `/docs` → filtre "NFT"                                 | 6 endpoints NFT documentés              |

---

## 🧪 Scénario 3 – Tokens fongibles (IoU / Trust Lines)

**Objectif** : Émission de tokens, trust line, distribution et transfert.

| #   | Action                        | URL / Bouton                                                         | Résultat attendu                               |
| --- | ----------------------------- | -------------------------------------------------------------------- | ---------------------------------------------- |
| 1   | Émettre un token (admin)      | `/administration` → onglet Tokens → `TRT`, "Tarot Token", 1000000    | Message succès                                 |
| 2   | Vérifier la liste tokens      | `/docs` → GET `/api/token/list`                                      | Token TRT visible                              |
| 3   | Établir une trust line        | `/dashboard/wallet` → Trust Line → sélectionner TRT                  | Message "Trust line établie"                   |
| 4   | Distribuer des tokens (admin) | `/administration` → Distribute → code TRT, adresse wallet user, 1000 | Message succès                                 |
| 5   | Vérifier le solde             | `/dashboard/wallet`                                                  | TRT apparaît avec solde 1000                   |
| 6   | Vérifier le portfolio         | `/dashboard/portfolio`                                               | Token TRT visible dans la section "Mes Tokens" |

---

## 🧪 Scénario 4 – Trading AMM (DEX natif XRPL)

**Objectif** : Création d'un pool de liquidité et swap de tokens.

| #   | Action                    | URL / Bouton                                                | Résultat attendu                   |
| --- | ------------------------- | ----------------------------------------------------------- | ---------------------------------- |
| 1   | Créer un pool AMM (admin) | `/administration` → onglet AMM → TRT, 5000 tokens, 100 XRP  | Message succès                     |
| 2   | Vérifier info AMM         | Onglet AMM → "Consulter"                                    | Soldes token/XRP et frais affichés |
| 3   | Swap utilisateur (achat)  | `/dashboard/wallet` → Swap AMM → TRT, "Acheter", montant 10 | Message "Swap réussi"              |
| 4   | Vérifier solde après swap | `/dashboard/wallet`                                         | Solde TRT augmenté, XRP diminué    |
| 5   | Swap utilisateur (vente)  | Swap AMM → TRT, "Vendre", montant 5                         | Solde TRT diminué, XRP augmenté    |

---

## 🧪 Scénario 5 – Compliance on-chain (Whitelist / Blacklist)

**Objectif** : Vérifier que les règles de conformité bloquent les utilisateurs non autorisés.

| #   | Action                       | URL / Bouton                                                           | Résultat attendu                        |
| --- | ---------------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| 1   | Blacklister un user (admin)  | `/administration` → onglet Blacklist → sélectionner user → Blacklister | Message succès                          |
| 2   | User tente un swap           | `/dashboard/wallet` → Swap                                             | Erreur "Non whitelisté" ou accès bloqué |
| 3   | Retirer du blacklist (admin) | Onglet Blacklist → Retirer                                             | Message succès                          |
| 4   | User retente le swap         | `/dashboard/wallet` → Swap                                             | Fonctionne à nouveau                    |

---

## 🧪 Scénario 6 – Indexer & Oracle

**Objectif** : Vérifier la synchronisation on-chain et les prix oracle.

| #   | Action                    | URL / Bouton                                          | Résultat attendu                         |
| --- | ------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| 1   | Trigger l'indexer (admin) | `/administration` → Indexer & Oracle → "Sync Indexer" | Nombre de transactions traitées          |
| 2   | Vérifier les transactions | `/dashboard/transactions`                             | Transactions indexées visibles           |
| 3   | Rafraîchir les prix       | "Rafraîchir les prix"                                 | Prix XRP/EUR affiché (CoinGecko)         |
| 4   | Vérifier l'auto-sync      | Attendre 60 secondes                                  | Log serveur : "Synchronisation terminée" |

---

## 🧪 Scénario 7 – Documentation API

**Objectif** : Vérifier que la documentation est complète et fonctionnelle.

| #   | Action              | URL                   | Résultat attendu           |
| --- | ------------------- | --------------------- | -------------------------- |
| 1   | Ouvrir la doc       | `/docs`               | 35 endpoints listés        |
| 2   | Filtrer par "NFT"   | Clic sur chip "NFT"   | 6 endpoints NFT affichés   |
| 3   | Filtrer par "Token" | Clic sur chip "Token" | 6 endpoints Token affichés |
| 4   | Filtrer par "AMM"   | Clic sur chip "AMM"   | 4 endpoints AMM affichés   |
| 5   | Revenir à "Tout"    | Clic sur chip "Tout"  | Tous les 35 endpoints      |

---

## ✅ Checklist finale

- [ ] Onboarding : Login → KYC → Approve → Wallet créé
- [ ] NFT : Mint → Marketplace → Achat (si applicable)
- [ ] Tokens : Issue → Trust line → Distribution → Solde mis à jour
- [ ] AMM : Pool créé → Swap achat → Swap vente → Soldes corrects
- [ ] Compliance : Blacklist bloque → Retirer restaure l'accès
- [ ] Indexer : Sync manuelle + auto 60s
- [ ] Oracle : Prix XRP/EUR depuis CoinGecko
- [ ] Docs : 35 endpoints avec filtres par catégorie
- [ ] Navigation : Toutes les pages de la sidebar fonctionnent
