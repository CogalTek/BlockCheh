<template>
    <div style="padding: 1%;">
        <h1>API Swagger</h1>
        <div class="api-nav mb-4">
            <button v-for="cat in categories" :key="cat" class="cat-chip" :class="{ active: selectedCat === cat }"
                @click="selectedCat = cat">
                {{ cat }}
            </button>
        </div>
        <docsItem v-for="item in filteredRoutes" :item="item" :id="item.name" />
    </div>
</template>

<script setup>
const categories = ['Tout', 'Auth', 'User', 'KYC', 'Blacklist', 'NFT', 'Token', 'AMM', 'Indexer', 'Oracle'];
const selectedCat = ref('Tout');

const rt = [
    // === Auth ===
    { name: "Login", cat: "Auth", description: "Initie le processus de connexion via Kinde avec un état aléatoire", path: "/api/auth/login", method: "GET", parameters: [], responses: [{ status: 302, description: "Redirection vers Kinde pour l'authentification" }] },
    { name: "Callback", cat: "Auth", description: "Gère le callback après authentification Kinde. Crée ou met à jour l'utilisateur en base de données", path: "/api/auth/callback", method: "GET", parameters: [], responses: [{ status: 302, description: "Redirection vers la page post-login" }, { status: 500, description: "Erreur d'authentification" }] },
    { name: "Logout", cat: "Auth", description: "Déconnecte l'utilisateur, détruit la session locale et redirige", path: "/api/auth/logout", method: "GET", parameters: [], responses: [{ status: 302, description: "Redirection vers l'URL de déconnexion Kinde" }] },
    { name: "Me", cat: "Auth", description: "Vérifie l'authentification et retourne les informations de l'utilisateur Kinde", path: "/api/auth/me", method: "GET", parameters: [], responses: [{ status: 200, description: "État d'authentification et données utilisateur", schema: "{ authenticated: boolean, user: KindeUser | null }" }] },

    // === User ===
    { name: "Get User", cat: "User", description: "Récupère l'utilisateur Kinde actuel et son profil en base de données", path: "/api/user", method: "GET", parameters: [], responses: [{ status: 200, description: "Utilisateur Kinde et profil BDD", schema: "{ user: KindeUser, dbUser: User | null }" }, { status: 401, description: "Non authentifié" }] },
    { name: "Get Permission", cat: "User", description: "Récupère le rôle/permission de l'utilisateur (par défaut: USER)", path: "/api/user/permission", method: "GET", parameters: [], responses: [{ status: 200, description: "Permission utilisateur", schema: "{ permission: string }" }] },
    { name: "List Users (Admin)", cat: "User", description: "Liste tous les utilisateurs de la plateforme. Admin requis.", path: "/api/user/all", method: "GET", parameters: [], responses: [{ status: 200, description: "Liste des utilisateurs", schema: "{ users: User[] }" }] },
    { name: "Transactions", cat: "User", description: "Liste les transactions de l'utilisateur courant avec pagination", path: "/api/user/transactions", method: "GET", parameters: [{ name: "take", type: "number", description: "Nombre de résultats (défaut: 50)" }, { name: "skip", type: "number", description: "Offset (défaut: 0)" }], responses: [{ status: 200, description: "Transactions paginées", schema: "{ transactions: Transaction[] }" }] },

    // === KYC ===
    { name: "KYC Submit", cat: "KYC", description: "Soumet une demande KYC. Génère automatiquement un wallet XRPL pour l'utilisateur.", path: "/api/kyc/submit", method: "POST", parameters: [{ name: "fullName", type: "string", description: "Nom complet" }, { name: "documentId", type: "string", description: "Numéro de document d'identité" }], responses: [{ status: 200, description: "Demande KYC créée + wallet généré", schema: "{ kycRequest, walletAddress }" }] },
    { name: "KYC Status", cat: "KYC", description: "Retourne le statut KYC de l'utilisateur courant", path: "/api/kyc/status", method: "GET", parameters: [], responses: [{ status: 200, description: "Statut KYC", schema: "{ status, walletAddress, isWhitelisted, isBlacklisted }" }] },
    { name: "KYC List (Admin)", cat: "KYC", description: "Liste toutes les demandes KYC avec filtre optionnel par statut. Admin requis.", path: "/api/kyc/list", method: "GET", parameters: [{ name: "status", type: "string", description: "Filtrer par statut: PENDING, APPROVED, REJECTED" }], responses: [{ status: 200, description: "Liste des demandes KYC", schema: "{ requests: KycRequest[] }" }] },
    { name: "KYC Approve (Admin)", cat: "KYC", description: "Approuve une demande KYC → whitelist l'utilisateur on-chain. Admin requis.", path: "/api/kyc/approve", method: "POST", parameters: [{ name: "requestId", type: "number", description: "ID de la demande KYC" }], responses: [{ status: 200, description: "KYC approuvé" }] },
    { name: "KYC Reject (Admin)", cat: "KYC", description: "Rejette une demande KYC. Admin requis.", path: "/api/kyc/reject", method: "POST", parameters: [{ name: "requestId", type: "number", description: "ID de la demande KYC" }], responses: [{ status: 200, description: "KYC rejeté" }] },

    // === Blacklist ===
    { name: "Blacklist Add (Admin)", cat: "Blacklist", description: "Ajoute un utilisateur au blacklist (isBlacklisted=true, isWhitelisted=false). Admin requis.", path: "/api/blacklist/add", method: "POST", parameters: [{ name: "userId", type: "number", description: "ID de l'utilisateur" }], responses: [{ status: 200, description: "Utilisateur blacklisté" }] },
    { name: "Blacklist Remove (Admin)", cat: "Blacklist", description: "Retire un utilisateur du blacklist. Admin requis.", path: "/api/blacklist/remove", method: "POST", parameters: [{ name: "userId", type: "number", description: "ID de l'utilisateur" }], responses: [{ status: 200, description: "Utilisateur retiré du blacklist" }] },

    // === NFT ===
    { name: "NFT Mint (Admin)", cat: "NFT", description: "Mint un NFT XLS-20 sur XRPL avec métadonnées. Admin requis. Royalties 5%.", path: "/api/nft/mint", method: "POST", parameters: [{ name: "name", type: "string", description: "Nom du NFT" }, { name: "description", type: "string", description: "Description (optionnel)" }, { name: "category", type: "string", description: "Catégorie: historique, edition_limitee, moderne, rare" }, { name: "priceXrp", type: "number", description: "Prix en XRP (optionnel)" }], responses: [{ status: 200, description: "NFT minté", schema: "{ nft, txHash, nftokenId }" }] },
    { name: "NFT List", cat: "NFT", description: "Liste tous les NFTs mintés. Filtre optionnel par catégorie.", path: "/api/nft/list", method: "GET", parameters: [{ name: "category", type: "string", description: "Filtrer par catégorie" }], responses: [{ status: 200, description: "Liste des NFTs", schema: "{ nfts: NftAsset[] }" }] },
    { name: "NFT My", cat: "NFT", description: "Retourne les NFTs de l'utilisateur courant.", path: "/api/nft/my", method: "GET", parameters: [], responses: [{ status: 200, description: "NFTs de l'utilisateur", schema: "{ nfts: NftAsset[] }" }] },
    { name: "NFT Create Offer", cat: "NFT", description: "Crée une offre de vente NFT sur XRPL via NFTokenCreateOffer. Whitelist requis.", path: "/api/nft/create-offer", method: "POST", parameters: [{ name: "nftokenId", type: "string", description: "NFTokenID" }, { name: "priceXrp", type: "number", description: "Prix en XRP" }], responses: [{ status: 200, description: "Offre créée", schema: "{ offerId, txHash }" }] },
    { name: "NFT Accept Offer", cat: "NFT", description: "Accepte une offre NFT sur XRPL via NFTokenAcceptOffer. Met à jour le propriétaire en DB.", path: "/api/nft/accept-offer", method: "POST", parameters: [{ name: "offerId", type: "string", description: "ID de l'offre XRPL" }], responses: [{ status: 200, description: "Offre acceptée", schema: "{ txHash }" }] },
    { name: "NFT Sync (Admin)", cat: "NFT", description: "Synchronise les NFTs on-chain avec la base de données. Récupère les NFTs manquants depuis le ledger.", path: "/api/nft/sync", method: "POST", parameters: [], responses: [{ status: 200, description: "Résultat de la synchronisation", schema: "{ created, alreadyExists, totalOnChain }" }] },

    // === Token ===
    { name: "Token Issue (Admin)", cat: "Token", description: "Émet un token fongible IoU sur XRPL. Admin requis.", path: "/api/token/issue", method: "POST", parameters: [{ name: "currencyCode", type: "string", description: "Code devise (3 lettres, e.g. TRT)" }, { name: "name", type: "string", description: "Nom du token" }, { name: "totalSupply", type: "string", description: "Supply totale" }], responses: [{ status: 200, description: "Token émis", schema: "{ token, txHash }" }] },
    { name: "Token Trust", cat: "Token", description: "Établit une trust line XRPL pour recevoir un token. Whitelist requis.", path: "/api/token/trust", method: "POST", parameters: [{ name: "currencyCode", type: "string", description: "Code devise du token" }], responses: [{ status: 200, description: "Trust line établie", schema: "{ txHash }" }] },
    { name: "Token Transfer", cat: "Token", description: "Transfert de tokens entre utilisateurs whitelistés.", path: "/api/token/transfer", method: "POST", parameters: [{ name: "currencyCode", type: "string", description: "Code devise" }, { name: "toEmail", type: "string", description: "Email du destinataire" }, { name: "amount", type: "string", description: "Montant" }], responses: [{ status: 200, description: "Transfert effectué", schema: "{ txHash }" }] },
    { name: "Token Distribute (Admin)", cat: "Token", description: "Admin distribue des tokens depuis le wallet issuer.", path: "/api/token/distribute", method: "POST", parameters: [{ name: "currencyCode", type: "string", description: "Code devise" }, { name: "destination", type: "string", description: "Adresse XRPL destinataire" }, { name: "amount", type: "string", description: "Montant" }], responses: [{ status: 200, description: "Distribution effectuée", schema: "{ txHash }" }] },
    { name: "Token Balance", cat: "Token", description: "Récupère le solde XRP et les trust lines de l'utilisateur.", path: "/api/token/balance", method: "GET", parameters: [], responses: [{ status: 200, description: "Soldes", schema: "{ xrpBalance, balances: [{currency, balance, issuer}] }" }] },
    { name: "Token List", cat: "Token", description: "Liste tous les tokens fongibles émis sur la plateforme.", path: "/api/token/list", method: "GET", parameters: [], responses: [{ status: 200, description: "Tokens émis", schema: "{ tokens: FungibleToken[] }" }] },

    // === AMM ===
    { name: "AMM Create (Admin)", cat: "AMM", description: "Crée un pool AMM natif XRPL entre un token IoU et XRP. Admin requis.", path: "/api/amm/create", method: "POST", parameters: [{ name: "currencyCode", type: "string", description: "Code devise du token" }, { name: "tokenAmount", type: "string", description: "Montant de tokens" }, { name: "xrpAmount", type: "string", description: "Montant XRP" }, { name: "tradingFee", type: "number", description: "Frais (0-1000, optionnel)" }], responses: [{ status: 200, description: "Pool AMM créé", schema: "{ txHash }" }] },
    { name: "AMM Deposit", cat: "AMM", description: "Dépose de la liquidité dans un pool AMM. Whitelist requis.", path: "/api/amm/deposit", method: "POST", parameters: [{ name: "currencyCode", type: "string", description: "Code devise du token" }, { name: "tokenAmount", type: "string", description: "Montant tokens" }, { name: "xrpAmount", type: "string", description: "Montant XRP" }], responses: [{ status: 200, description: "Dépôt effectué", schema: "{ txHash }" }] },
    { name: "AMM Swap", cat: "AMM", description: "Swap via AMM natif: acheter (XRP→Token) ou vendre (Token→XRP).", path: "/api/amm/swap", method: "POST", parameters: [{ name: "currencyCode", type: "string", description: "Code devise" }, { name: "direction", type: "string", description: "buy ou sell" }, { name: "amount", type: "string", description: "Montant" }], responses: [{ status: 200, description: "Swap effectué", schema: "{ txHash }" }] },
    { name: "AMM Info", cat: "AMM", description: "Info du pool AMM: soldes, LP tokens, frais de trading.", path: "/api/amm/info", method: "GET", parameters: [{ name: "currencyCode", type: "string", description: "Code devise (optionnel, sinon liste tous les tokens)" }], responses: [{ status: 200, description: "Information AMM", schema: "{ pool: { token, xrp, lpToken, tradingFee } }" }] },

    // === Indexer ===
    { name: "Indexer Sync (Admin)", cat: "Indexer", description: "Déclenche la synchronisation manuelle de l'indexer on-chain. Admin requis.", path: "/api/indexer/sync", method: "POST", parameters: [], responses: [{ status: 200, description: "Résultat", schema: "{ result: { transactions, nfts } }" }] },

    // === Oracle ===
    { name: "Oracle Price", cat: "Oracle", description: "Prix des actifs: XRP/EUR (CoinGecko) + tokens via ratios AMM on-chain.", path: "/api/oracle/price", method: "GET", parameters: [{ name: "asset", type: "string", description: "Filtrer par asset (optionnel)" }, { name: "refresh", type: "boolean", description: "Forcer le rafraîchissement (optionnel)" }], responses: [{ status: 200, description: "Prix oracle", schema: "{ prices: OraclePrice[] }" }] },
];

const filteredRoutes = computed(() => {
    if (selectedCat.value === 'Tout') return rt;
    return rt.filter(r => r.cat === selectedCat.value);
});
</script>

<style scoped>
.api-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.cat-chip {
    padding: 0.4rem 0.9rem;
    border-radius: 20px;
    border: 1px solid rgba(139, 92, 246, 0.3);
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
}

.cat-chip:hover {
    border-color: rgba(139, 92, 246, 0.5);
    color: #fff;
}

.cat-chip.active {
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    border-color: transparent;
    color: #fff;
    font-weight: 600;
}
</style>