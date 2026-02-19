# BlockCheh 🎴

Plateforme de tokenisation d'actifs sur le XRP Ledger – Cartes de tarot historiques de Marseille.

> Pour une présentation complète du projet et de ses concepts, voir [documentation/presentation-projet.md](documentation/presentation-projet.md)

---

## Prérequis

- **Node.js** ≥ 18
- **Docker** (pour PostgreSQL)
- **npm**
- Un compte [Kinde](https://kinde.com/) (authentification)

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd BlockCheh
```

### 2. Configurer l'environnement

Copier le `.env.example` ou créer un fichier `.env` à la racine :

```env
# Kinde Auth
NUXT_KINDE_CLIENT_ID=<ton_client_id>
NUXT_KINDE_CLIENT_SECRET=<ton_client_secret>
NUXT_KINDE_AUTH_DOMAIN=https://<ton_domaine>.kinde.com
NUXT_KINDE_REDIRECT_URL=http://localhost:3000/api/auth/callback
NUXT_KINDE_LOGOUT_REDIRECT_URL=http://localhost:3000
NUXT_KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# Docker Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=blockcheh
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blockcheh?schema=public"

# XRPL Testnet
XRPL_ADMIN_SEED=<seed_de_ton_wallet_admin>
XRPL_NETWORK=wss://s.altnet.rippletest.net:51233
```

> **💡 Wallet admin** : génère un wallet testnet sur https://faucet.altnet.rippletest.net/ et copie le `seed` dans `XRPL_ADMIN_SEED`.

### 3. Lancer l'installation complète

```bash
npm run init
```

Cette commande fait tout automatiquement :
1. 🐳 Lance PostgreSQL via Docker (`docker-compose up -d`)
2. 📦 Installe les dépendances (`npm install`)
3. 🗃️ Exécute les migrations Prisma (`prisma migrate dev`)
4. ⚙️ Génère le client Prisma (`prisma generate`)
5. 🚀 Lance le serveur de développement (`npm run dev`)

L'application est disponible sur **http://localhost:3000**

---

## Commandes utiles

| Commande                 | Description                                 |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | Lancer le serveur de développement          |
| `npm run build`          | Build de production                         |
| `npm run preview`        | Prévisualiser le build de production        |
| `npm run lint`           | Lancer ESLint                               |
| `npx prisma studio`      | Interface graphique pour la base de données |
| `npx prisma migrate dev` | Appliquer les migrations en dev             |
| `docker-compose up -d`   | Démarrer PostgreSQL                         |
| `docker-compose down`    | Arrêter PostgreSQL                          |

---

## Structure du projet

```
BlockCheh/
├── app/
│   ├── components/          # Composants Vue réutilisables
│   ├── composables/         # Logique partagée (useAuth)
│   ├── layouts/             # Layout principal (sidebar)
│   ├── middleware/           # Middleware auth et admin
│   └── pages/
│       ├── dashboard/       # Pages utilisateur
│       │   ├── index.vue        # Dashboard principal
│       │   ├── marketplace.vue  # Marketplace NFTs
│       │   ├── portfolio.vue    # Mon portfolio
│       │   ├── wallet.vue       # Wallet XRPL
│       │   ├── transactions.vue # Historique
│       │   └── settings.vue     # Paramètres
│       ├── administration/  # Pages admin
│       └── docs/            # Documentation API (Swagger-like)
├── server/
│   ├── api/                 # 28 endpoints API
│   │   ├── auth/            # Login, Callback, Logout, Me
│   │   ├── user/            # Profil, Permission, All, Transactions
│   │   ├── kyc/             # Submit, Status, List, Approve, Reject
│   │   ├── blacklist/       # Add, Remove
│   │   ├── nft/             # Mint, List, My, CreateOffer, AcceptOffer, Sync
│   │   ├── token/           # Issue, Trust, Transfer, Distribute, Balance, List
│   │   ├── amm/             # Create, Deposit, Swap, Info
│   │   ├── indexer/         # Sync
│   │   └── oracle/          # Price
│   └── utils/               # Client XRPL, Auth guard, Indexer, Oracle
├── prisma/                  # Schéma et migrations
├── documentation/           # Docs du projet
├── docker-compose.yml       # PostgreSQL
└── .env                     # Variables d'environnement
```

---

## Stack technique

| Technologie | Version | Rôle                                |
| ----------- | ------- | ----------------------------------- |
| Nuxt        | 4.3     | Framework fullstack (Vue 3 + Nitro) |
| Vue         | 3.5     | Framework frontend réactif          |
| Prisma      | 7.3     | ORM base de données                 |
| PostgreSQL  | 15      | Base de données relationnelle       |
| xrpl.js     | 4.5     | SDK XRP Ledger                      |
| Kinde Auth  | -       | Authentification SSO                |
| Bootstrap   | 5.3     | CSS framework                       |
| Docker      | -       | Conteneurisation BDD                |

---

## Documentation

- 📖 [Présentation du projet](documentation/presentation-projet.md) – Concepts blockchain pour débutants
- 🧪 [Guide de test](documentation/guide-de-test.md) – 7 scénarios de test complets
- 📚 Documentation API interactive : `/docs` (dans l'application)