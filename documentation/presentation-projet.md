# BlockCheh – Plateforme de Tokenisation d'Actifs sur XRPL

## 🤔 C'est quoi la blockchain ?

Imagine un **grand livre de comptes public**, que tout le monde peut lire, mais que personne ne peut falsifier. Chaque opération (un transfert d'argent, un achat, une création d'objet numérique) est inscrite dans ce livre et **ne peut plus être modifiée**. C'est ça la blockchain : un registre transparent et immuable.

### Analogie simple

| Système classique                        | Blockchain                                |
| ---------------------------------------- | ----------------------------------------- |
| Ta banque gère tes comptes               | Toi-même, via un "wallet"                 |
| Seule la banque connaît les transactions | Tout est public et vérifiable             |
| La banque peut bloquer ton compte        | Personne ne peut censurer une transaction |
| Tu fais confiance à la banque            | Tu fais confiance au code (contrats)      |

---

## 💎 C'est quoi le XRP Ledger (XRPL) ?

Le **XRP Ledger** est une blockchain créée en 2012, spécialement conçue pour les transactions financières. Contrairement à Bitcoin ou Ethereum :

- ⚡ **Ultra rapide** : 3 à 5 secondes par transaction (vs 10 min pour Bitcoin)
- 💸 **Quasi gratuit** : ~0.00001 XRP par transaction (~0.00001€)
- 🏦 **DEX natif** : échange de tokens intégré directement dans la blockchain (AMM)
- 🎨 **NFTs natifs** : standard XLS-20 intégré au protocole

Le **XRP** est la crypto-monnaie native du réseau (comme l'Euro pour l'Europe).

---

## 🏗️ BlockCheh – Le projet

**BlockCheh** est une plateforme web qui permet de **tokeniser des actifs** (cartes de tarot historiques de Marseille) sur le XRP Ledger. Elle offre une interface simple pour interagir avec la blockchain sans connaissances techniques.

### En langage simple

> "BlockCheh transforme des objets réels (cartes de tarot) en objets numériques uniques (NFTs) sur la blockchain, et permet de les acheter, vendre et échanger sur un marketplace."

---

## 🧩 Concepts clés

### 🎴 NFT (Non-Fungible Token)

Un **certificat numérique unique** enregistré sur la blockchain. Chaque NFT représente un objet (ici, une carte de tarot) et est **unique** : on ne peut pas le dupliquer.

- **Standard** : XLS-20 (natif au XRPL)
- **Métadonnées** : nom, description, catégorie, prix — stockées dans l'URI du NFT
- **Royalties** : 5% sur chaque revente (automatique, géré par la blockchain)

### 🪙 Token fongible (IoU)

Un **jeton numérique interchangeable** (comme des pièces de monnaie). Contrairement aux NFTs, chaque token est identique à un autre du même type.

- **Exemple** : "TRT" (Tarot Token) — 1 TRT = 1 TRT, peu importe lequel
- **Trust Line** : avant de recevoir un token, tu dois "accepter" de le recevoir (sécurité XRPL)

### 👛 Wallet

Ton **portefeuille numérique** sur la blockchain. C'est une adresse unique (ex: `rhnhFxD9Smv...`) associée à une clé secrète. Le wallet est **créé automatiquement** quand ton KYC est approuvé.

### ✅ KYC (Know Your Customer)

**Vérification d'identité** : avant d'utiliser la plateforme, tu dois prouver ton identité (nom + document). Un administrateur approuve ou rejette ta demande. C'est une exigence réglementaire pour les plateformes financières.

### 📋 Whitelist / Blacklist

- **Whitelist** : liste des utilisateurs autorisés à effectuer des transactions
- **Blacklist** : liste des utilisateurs bloqués (fraude, sanctions, etc.)

C'est la **compliance on-chain** : les règles de conformité appliquées directement sur la blockchain.

### 🔄 AMM (Automated Market Maker)

Un **mécanisme d'échange automatique** : au lieu d'acheter à quelqu'un, tu échanges directement avec un "pool de liquidité" (une réserve de tokens). Le prix est calculé mathématiquement en fonction de l'offre et la demande.

### 📊 Oracle

Un service qui récupère les **prix depuis le monde extérieur** (ex: prix du XRP en euros via CoinGecko) et les rend accessibles dans l'application.

### 🔍 Indexer

Un programme qui **surveille la blockchain en continu** (toutes les 60 secondes) et synchronise les transactions dans la base de données de l'application.

---

## 👤 Fonctionnalités Utilisateur

| Page             | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| **Dashboard**    | Vue d'ensemble : solde XRP, NFTs, tokens, actions rapides      |
| **Marketplace**  | Parcourir les NFTs disponibles, filtrer par catégorie, acheter |
| **Portfolio**    | Mes NFTs (avec option de vente) + mes tokens fongibles         |
| **Wallet**       | Gérer son portefeuille : trust lines, swaps AMM, transferts    |
| **Transactions** | Historique de toutes les opérations on-chain                   |
| **Paramètres**   | Profil, statut KYC, adresse wallet                             |

### Parcours utilisateur type

```
1. Connexion via Kinde (SSO)
2. Soumission KYC (nom + document)
3. Approbation par un admin → wallet XRPL créé
4. Parcourir le marketplace → acheter un NFT
5. Établir une trust line → recevoir des tokens TRT
6. Swap AMM : échanger XRP ↔ TRT
7. Transférer des tokens à un autre utilisateur
```

---

## 🔒 Fonctionnalités Administrateur

| Section              | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| **KYC**              | Approuver / rejeter les demandes de vérification d'identité |
| **Blacklist**        | Bloquer / débloquer des utilisateurs                        |
| **NFTs**             | Mint de nouveaux NFTs, synchronisation blockchain           |
| **Tokens**           | Émettre de nouveaux tokens, distribuer aux utilisateurs     |
| **AMM**              | Créer des pools de liquidité, consulter les infos           |
| **Indexer & Oracle** | Sync manuelle, rafraîchir les prix                          |

---

## 🏛️ Architecture technique

```
┌─────────────────────────────────────────────┐
│            Frontend (Nuxt 4 / Vue 3)        │
│  Pages : Dashboard, Marketplace, Wallet...  │
├─────────────────────────────────────────────┤
│           Backend (Nitro / API)              │
│  28 endpoints : Auth, KYC, NFT, Token, AMM  │
├─────────────────────────────────────────────┤
│         Base de données (PostgreSQL)         │
│  Prisma ORM : Users, NFTs, Tokens, KYC...   │
├─────────────────────────────────────────────┤
│         XRP Ledger (Testnet)                 │
│  Transactions réelles sur la blockchain      │
└─────────────────────────────────────────────┘
```

| Technologie     | Rôle                                                   |
| --------------- | ------------------------------------------------------ |
| **Nuxt 4**      | Framework frontend + backend (Vue 3 + Nitro)           |
| **Prisma**      | ORM pour la base de données PostgreSQL                 |
| **xrpl.js**     | Librairie officielle pour interagir avec le XRP Ledger |
| **Kinde Auth**  | Authentification SSO (Google, email, etc.)             |
| **Docker**      | Conteneur pour la base de données PostgreSQL           |
| **Bootstrap 5** | Framework CSS pour le design de base                   |

---

## 🌐 Testnet vs Mainnet

BlockCheh utilise le **testnet** du XRP Ledger :

|            | Testnet                       | Mainnet                   |
| ---------- | ----------------------------- | ------------------------- |
| **Argent** | Faux (XRP gratuit via faucet) | Vrai argent               |
| **Usage**  | Développement et tests        | Production                |
| **Risque** | Aucun                         | Perte financière possible |
| **URL**    | `s.altnet.rippletest.net`     | `s1.ripple.com`           |

Pour obtenir du XRP testnet gratuit : [Faucet XRPL](https://faucet.altnet.rippletest.net/)
