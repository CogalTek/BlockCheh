<template>
    <div class="admin-page">
        <div class="container-fluid px-4 py-4">
            <div class="dashboard-header mb-4">
                <div>
                    <h1 class="page-title">Administration 🛡️</h1>
                    <p class="page-subtitle">Gestion de la plateforme BlockCheh</p>
                </div>
            </div>

            <!-- Tabs -->
            <div class="admin-tabs mb-4">
                <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }"
                    @click="activeTab = tab.id">
                    <i :class="tab.icon"></i>
                    <span>{{ tab.label }}</span>
                </button>
            </div>

            <!-- KYC Tab -->
            <div v-if="activeTab === 'kyc'" class="admin-section">
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">Demandes KYC</h3>
                        <div class="d-flex gap-2">
                            <button v-for="f in ['ALL', 'PENDING', 'APPROVED', 'REJECTED']" :key="f" class="filter-btn"
                                :class="{ active: kycFilter === f }" @click="kycFilter = f; refreshKyc()">
                                {{ f === 'ALL' ? 'Tous' : f }}
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Utilisateur</th>
                                        <th>Nom</th>
                                        <th>Document</th>
                                        <th>Wallet</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="kyc in filteredKycList" :key="kyc.id">
                                        <td>{{ kyc.user?.email }}</td>
                                        <td>{{ kyc.fullName }}</td>
                                        <td><code>{{ kyc.documentId }}</code></td>
                                        <td><code
                                                class="wallet-code">{{ kyc.user?.walletAddress?.substring(0, 12) }}...</code>
                                        </td>
                                        <td>
                                            <span class="status-badge" :class="kyc.status.toLowerCase()">{{ kyc.status
                                            }}</span>
                                        </td>
                                        <td>
                                            <div v-if="kyc.status === 'PENDING'" class="d-flex gap-2">
                                                <button class="btn btn-sm btn-success-custom"
                                                    @click="approveKyc(kyc.id)">
                                                    <i class="bi bi-check-lg"></i> Approuver
                                                </button>
                                                <button class="btn btn-sm btn-danger-custom" @click="rejectKyc(kyc.id)">
                                                    <i class="bi bi-x-lg"></i> Rejeter
                                                </button>
                                            </div>
                                            <span v-else class="text-muted-custom">Traité</span>
                                        </td>
                                    </tr>
                                    <tr v-if="!filteredKycList?.length">
                                        <td colspan="6" class="text-center py-4 text-muted-custom">Aucune demande KYC
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- NFT Mint Tab -->
            <div v-if="activeTab === 'nft'" class="admin-section">
                <div class="row g-4">
                    <div class="col-lg-5">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Mint un NFT</h3>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label class="form-label-custom">Nom de la carte</label>
                                    <input v-model="nftForm.name" type="text" class="form-input"
                                        placeholder="Le Mat - Marseille 1760" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Description</label>
                                    <textarea v-model="nftForm.description" class="form-input" rows="3"
                                        placeholder="Carte de tarot historique..."></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Catégorie</label>
                                    <select v-model="nftForm.category" class="form-input">
                                        <option value="historique">Historique</option>
                                        <option value="edition_limitee">Édition limitée</option>
                                        <option value="moderne">Moderne</option>
                                        <option value="rare">Rare</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Prix (XRP)</label>
                                    <input v-model="nftForm.priceXrp" type="number" class="form-input"
                                        placeholder="100" />
                                </div>
                                <button class="btn btn-primary-gradient w-100" @click="mintNft" :disabled="mintLoading">
                                    {{ mintLoading ? 'Minting...' : '🎴 Mint NFT' }}
                                </button>
                                <div v-if="mintResult" class="mt-3 alert-custom success">
                                    <i class="bi bi-check-circle"></i> NFT minté ! TX: {{
                                        mintResult.txHash?.substring(0, 16) }}...
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">NFTs mintés</h3>
                                <button class="btn btn-sm btn-outline-purple" @click="syncNfts"
                                    :disabled="syncNftLoading">
                                    <i class="bi bi-arrow-repeat"></i> {{ syncNftLoading ? 'Sync...' : 'Sync blockchain'
                                    }}
                                </button>
                            </div>
                            <div v-if="syncNftResult" class="px-3 pt-2">
                                <div class="alert-custom success"><i class="bi bi-check-circle"></i> {{
                                    syncNftResult.message }}</div>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Nom</th>
                                                <th>Catégorie</th>
                                                <th>Prix</th>
                                                <th>NFToken ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="nft in allNfts" :key="nft.id">
                                                <td>{{ nft.name }}</td>
                                                <td><span class="badge-type">{{ nft.category }}</span></td>
                                                <td>{{ nft.priceXrp || '-' }} XRP</td>
                                                <td><code>{{ nft.nftokenId?.substring(0, 16) }}...</code></td>
                                            </tr>
                                            <tr v-if="!allNfts?.length">
                                                <td colspan="4" class="text-center py-4 text-muted-custom">Aucun NFT
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tokens Tab -->
            <div v-if="activeTab === 'tokens'" class="admin-section">
                <div class="row g-4">
                    <div class="col-lg-5">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Émettre un token</h3>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label class="form-label-custom">Code devise (3 chars)</label>
                                    <input v-model="tokenForm.currencyCode" type="text" class="form-input"
                                        placeholder="TRT" maxlength="3" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Nom</label>
                                    <input v-model="tokenForm.name" type="text" class="form-input"
                                        placeholder="Tarot Token" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Total Supply</label>
                                    <input v-model="tokenForm.totalSupply" type="text" class="form-input"
                                        placeholder="1000000" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Description</label>
                                    <textarea v-model="tokenForm.description" class="form-input" rows="2"
                                        placeholder="Token de propriété fractionnée..."></textarea>
                                </div>
                                <button class="btn btn-primary-gradient w-100" @click="issueToken"
                                    :disabled="tokenLoading">
                                    {{ tokenLoading ? 'Émission...' : '🪙 Émettre le token' }}
                                </button>
                                <div v-if="tokenResult" class="mt-3 alert-custom success">
                                    <i class="bi bi-check-circle"></i> {{ tokenResult.message }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div class="dashboard-card mb-4">
                            <div class="card-header">
                                <h3 class="card-title">Tokens émis</h3>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>Nom</th>
                                                <th>Supply</th>
                                                <th>Issuer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="t in ammInfo?.tokens" :key="t.id">
                                                <td><strong>{{ t.currencyCode }}</strong></td>
                                                <td>{{ t.name }}</td>
                                                <td>{{ t.totalSupply }}</td>
                                                <td><code>{{ t.issuerAddress?.substring(0, 12) }}...</code></td>
                                            </tr>
                                            <tr v-if="!ammInfo?.tokens?.length">
                                                <td colspan="4" class="text-center py-4 text-muted-custom">Aucun token
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <!-- Distribute tokens -->
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Distribuer des tokens</h3>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label class="form-label-custom">Code devise</label>
                                    <input v-model="distForm.currencyCode" type="text" class="form-input"
                                        placeholder="TRT" maxlength="3" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Adresse de destination XRPL</label>
                                    <input v-model="distForm.destination" type="text" class="form-input"
                                        placeholder="rXXX..." />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Montant</label>
                                    <input v-model="distForm.amount" type="text" class="form-input"
                                        placeholder="1000" />
                                </div>
                                <button class="btn btn-primary-gradient w-100" @click="distributeTokens"
                                    :disabled="distLoading">
                                    {{ distLoading ? 'Distribution...' : '📤 Distribuer' }}
                                </button>
                                <div v-if="distResult" class="mt-3 alert-custom success">
                                    <i class="bi bi-check-circle"></i> {{ distResult.message }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AMM Tab -->
            <div v-if="activeTab === 'amm'" class="admin-section">
                <div class="row g-4">
                    <div class="col-lg-5">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Créer un pool AMM</h3>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label class="form-label-custom">Code devise du token</label>
                                    <input v-model="ammForm.currencyCode" type="text" class="form-input"
                                        placeholder="TRT" maxlength="3" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Montant tokens</label>
                                    <input v-model="ammForm.tokenAmount" type="text" class="form-input"
                                        placeholder="10000" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Montant XRP</label>
                                    <input v-model="ammForm.xrpAmount" type="text" class="form-input"
                                        placeholder="1000" />
                                </div>
                                <button class="btn btn-primary-gradient w-100" @click="createAmm"
                                    :disabled="ammLoading">
                                    {{ ammLoading ? 'Création...' : '🏊 Créer le pool' }}
                                </button>
                                <div v-if="ammResult" class="mt-3 alert-custom success">
                                    <i class="bi bi-check-circle"></i> {{ ammResult.message }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Info Pool AMM</h3>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <div class="d-flex gap-2">
                                        <input v-model="ammQueryCode" type="text" class="form-input"
                                            placeholder="Code devise (ex: TRT)" />
                                        <button class="btn btn-primary-gradient" @click="fetchAmmInfo">Info</button>
                                    </div>
                                </div>
                                <div v-if="ammPoolData?.exists" class="pool-info">
                                    <div class="pool-stat"><span>Token Balance</span><strong>{{
                                        JSON.stringify(ammPoolData.pool?.tokenBalance) }}</strong></div>
                                    <div class="pool-stat"><span>XRP Balance</span><strong>{{
                                        JSON.stringify(ammPoolData.pool?.xrpBalance) }}</strong></div>
                                    <div class="pool-stat"><span>Trading Fee</span><strong>{{
                                        ammPoolData.pool?.tradingFee }}‱</strong></div>
                                </div>
                                <div v-else-if="ammPoolData" class="text-muted-custom text-center py-3">
                                    {{ ammPoolData.message }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Blacklist Tab -->
            <div v-if="activeTab === 'blacklist'" class="admin-section">
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">Gestion des utilisateurs</h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Nom</th>
                                        <th>Wallet</th>
                                        <th>Whitelisté</th>
                                        <th>Blacklisté</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="u in allUsers" :key="u.id">
                                        <td>{{ u.email }}</td>
                                        <td>{{ u.name || '-' }}</td>
                                        <td><code>{{ u.walletAddress?.substring(0, 12) || '-' }}...</code></td>
                                        <td><span
                                                :class="u.isWhitelisted ? 'status-badge approved' : 'status-badge rejected'">{{
                                                    u.isWhitelisted ? 'Oui' : 'Non' }}</span></td>
                                        <td><span
                                                :class="u.isBlacklisted ? 'status-badge rejected' : 'status-badge approved'">{{
                                                    u.isBlacklisted ? 'Oui' : 'Non' }}</span></td>
                                        <td>
                                            <button v-if="!u.isBlacklisted" class="btn btn-sm btn-danger-custom"
                                                @click="blacklistUser(u.id)">
                                                <i class="bi bi-slash-circle"></i> Blacklist
                                            </button>
                                            <button v-else class="btn btn-sm btn-success-custom"
                                                @click="unblacklistUser(u.id)">
                                                <i class="bi bi-check-circle"></i> Retirer
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Indexer Tab -->
            <div v-if="activeTab === 'indexer'" class="admin-section">
                <div class="dashboard-card">
                    <div class="card-header">
                        <h3 class="card-title">Indexer & Oracle</h3>
                    </div>
                    <div class="card-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <h5 class="text-white mb-3">Indexer</h5>
                                <p class="text-muted-custom">L'indexer synchronise les transactions on-chain avec la
                                    base de données toutes les 60 secondes.</p>
                                <button class="btn btn-primary-gradient" @click="triggerSync" :disabled="syncLoading">
                                    {{ syncLoading ? 'Synchronisation...' : '🔄 Synchroniser maintenant' }}
                                </button>
                                <div v-if="syncResult" class="mt-3 alert-custom success">
                                    <i class="bi bi-check-circle"></i> {{ syncResult.message }} ({{ syncResult.timestamp
                                    }})
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h5 class="text-white mb-3">Oracle</h5>
                                <p class="text-muted-custom">Récupère les prix en temps réel depuis CoinGecko et les
                                    ratios AMM.</p>
                                <button class="btn btn-primary-gradient" @click="refreshOracle"
                                    :disabled="oracleLoading">
                                    {{ oracleLoading ? 'Rafraîchissement...' : '📊 Rafraîchir les prix' }}
                                </button>
                                <div v-if="oraclePrices?.prices?.length" class="mt-3">
                                    <div v-for="p in oraclePrices.prices" :key="p.id" class="pool-stat">
                                        <span>{{ p.asset }}</span>
                                        <strong>{{ p.priceXrp }} XRP / {{ p.priceEur }}€</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-page {
    min-height: 100%;
    padding-bottom: 4rem;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.page-subtitle {
    color: rgba(255, 255, 255, 0.6);
    margin: 0.5rem 0 0 0;
}

.admin-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.tab-btn {
    background: rgba(26, 31, 58, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: rgba(255, 255, 255, 0.7);
    padding: 0.7rem 1.2rem;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tab-btn:hover {
    border-color: rgba(139, 92, 246, 0.5);
    color: #fff;
}

.tab-btn.active {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(217, 70, 239, 0.3) 100%);
    border-color: #8b5cf6;
    color: #fff;
}

.filter-btn {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: rgba(255, 255, 255, 0.6);
    padding: 0.3rem 0.8rem;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn.active {
    background: #8b5cf6;
    color: #fff;
    border-color: #8b5cf6;
}

.dashboard-card {
    background: rgba(26, 31, 58, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    overflow: hidden;
}

.card-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.card-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
}

.card-body {
    padding: 1.5rem;
}

.table {
    margin: 0;
    color: #fff;
}

.table thead th {
    background: rgba(10, 14, 39, 0.5);
    color: rgba(255, 255, 255, 0.7);
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: none;
    padding: 0.8rem 1rem;
}

.table tbody tr {
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}

.table tbody td {
    padding: 0.8rem 1rem;
    border: none;
    vertical-align: middle;
}

.status-badge {
    padding: 0.3rem 0.7rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
}

.status-badge.pending {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
}

.status-badge.approved {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.status-badge.rejected {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.btn-success-custom {
    background: rgba(16, 185, 129, 0.2);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: #10b981;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.btn-success-custom:hover {
    background: rgba(16, 185, 129, 0.4);
    color: #fff;
}

.btn-danger-custom {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.4);
    color: #ef4444;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.btn-danger-custom:hover {
    background: rgba(239, 68, 68, 0.4);
    color: #fff;
}

.btn-primary-gradient {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    border: none;
    color: white;
    padding: 0.7rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
    transition: all 0.3s ease;
}

.btn-primary-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
}

.btn-primary-gradient:disabled {
    opacity: 0.5;
    transform: none;
}

.form-label-custom {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    margin-bottom: 0.5rem;
    display: block;
}

.form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(10, 14, 39, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 10px;
    color: #fff;
    font-size: 0.95rem;
}

.form-input:focus {
    outline: none;
    border-color: #8b5cf6;
}

.form-input option {
    background: #1a1f3a;
    color: #fff;
}

.text-muted-custom {
    color: rgba(255, 255, 255, 0.6);
}

.alert-custom {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.alert-custom.success {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #10b981;
}

.badge-type {
    background: rgba(139, 92, 246, 0.2);
    color: #8b5cf6;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
}

.wallet-code {
    background: rgba(10, 14, 39, 0.5);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
}

.pool-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.pool-stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(10, 14, 39, 0.5);
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.7);
}

.pool-stat strong {
    color: #8b5cf6;
}

.btn-outline-purple {
    border: 1px solid rgba(139, 92, 246, 0.5);
    color: #8b5cf6;
    background: transparent;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.btn-outline-purple:hover {
    background: rgba(139, 92, 246, 0.2);
    color: #fff;
}

@media (max-width: 768px) {
    .admin-tabs {
        flex-direction: column;
    }

    .page-title {
        font-size: 1.5rem;
    }
}
</style>

<script setup>
definePageMeta({ middleware: 'admin' });

const activeTab = ref('kyc');
const tabs = [
    { id: 'kyc', label: 'KYC', icon: 'bi bi-shield-check' },
    { id: 'nft', label: 'NFTs', icon: 'bi bi-image' },
    { id: 'tokens', label: 'Tokens', icon: 'bi bi-coin' },
    { id: 'amm', label: 'AMM', icon: 'bi bi-water' },
    { id: 'blacklist', label: 'Blacklist', icon: 'bi bi-slash-circle' },
    { id: 'indexer', label: 'Indexer & Oracle', icon: 'bi bi-arrow-repeat' },
];

// === KYC ===
const kycFilter = ref('ALL');
const { data: kycData, refresh: refreshKyc } = useFetch(() => `/api/kyc/list${kycFilter.value !== 'ALL' ? `?status=${kycFilter.value}` : ''}`, { lazy: true, server: false });
const filteredKycList = computed(() => kycData.value?.kycRequests || []);

const approveKyc = async (id) => {
    await $fetch('/api/kyc/approve', { method: 'POST', body: { kycRequestId: id } });
    await refreshKyc();
};
const rejectKyc = async (id) => {
    await $fetch('/api/kyc/reject', { method: 'POST', body: { kycRequestId: id } });
    await refreshKyc();
};

// === NFT ===
const nftForm = reactive({ name: '', description: '', category: 'historique', priceXrp: '' });
const mintLoading = ref(false);
const mintResult = ref(null);
const { data: nftsData, refresh: refreshNfts } = useFetch('/api/nft/list', { lazy: true, server: false });
const allNfts = computed(() => nftsData.value?.nfts || []);

const mintNft = async () => {
    if (!nftForm.name) return;
    mintLoading.value = true; mintResult.value = null;
    try {
        mintResult.value = await $fetch('/api/nft/mint', { method: 'POST', body: { ...nftForm } });
        nftForm.name = ''; nftForm.description = ''; nftForm.priceXrp = '';
        await refreshNfts();
    } catch (e) { console.error(e); }
    finally { mintLoading.value = false; }
};

const syncNftLoading = ref(false);
const syncNftResult = ref(null);
const syncNfts = async () => {
    syncNftLoading.value = true; syncNftResult.value = null;
    try {
        syncNftResult.value = await $fetch('/api/nft/sync', { method: 'POST' });
        await refreshNfts();
    } catch (e) { console.error(e); }
    finally { syncNftLoading.value = false; }
};

// === Tokens ===
const tokenForm = reactive({ currencyCode: '', name: '', totalSupply: '', description: '' });
const tokenLoading = ref(false);
const tokenResult = ref(null);
const distForm = reactive({ currencyCode: '', destination: '', amount: '' });
const distLoading = ref(false);
const distResult = ref(null);

const issueToken = async () => {
    if (!tokenForm.currencyCode || !tokenForm.name || !tokenForm.totalSupply) return;
    tokenLoading.value = true; tokenResult.value = null;
    try {
        tokenResult.value = await $fetch('/api/token/issue', { method: 'POST', body: { ...tokenForm } });
        tokenForm.currencyCode = ''; tokenForm.name = ''; tokenForm.totalSupply = ''; tokenForm.description = '';
        await refreshAmm();
    } catch (e) { console.error(e); }
    finally { tokenLoading.value = false; }
};

const distributeTokens = async () => {
    if (!distForm.currencyCode || !distForm.destination || !distForm.amount) return;
    distLoading.value = true; distResult.value = null;
    try {
        distResult.value = await $fetch('/api/token/distribute', { method: 'POST', body: { ...distForm } });
        distForm.amount = '';
    } catch (e) { console.error(e); }
    finally { distLoading.value = false; }
};

// === AMM ===
const ammForm = reactive({ currencyCode: '', tokenAmount: '', xrpAmount: '' });
const ammLoading = ref(false);
const ammResult = ref(null);
const ammQueryCode = ref('');
const ammPoolData = ref(null);
const { data: ammInfo, refresh: refreshAmm } = useFetch('/api/amm/info', { lazy: true, server: false });

const createAmm = async () => {
    if (!ammForm.currencyCode || !ammForm.tokenAmount || !ammForm.xrpAmount) return;
    ammLoading.value = true; ammResult.value = null;
    try {
        ammResult.value = await $fetch('/api/amm/create', { method: 'POST', body: { ...ammForm } });
        ammForm.currencyCode = ''; ammForm.tokenAmount = ''; ammForm.xrpAmount = '';
    } catch (e) { console.error(e); }
    finally { ammLoading.value = false; }
};

const fetchAmmInfo = async () => {
    if (!ammQueryCode.value) return;
    try { ammPoolData.value = await $fetch(`/api/amm/info?currencyCode=${ammQueryCode.value}`); }
    catch (e) { console.error(e); }
};

// === Blacklist ===
const { data: usersData, refresh: refreshUsers } = useFetch('/api/user/all', { lazy: true, server: false });
const allUsers = computed(() => usersData.value?.users || []);

const blacklistUser = async (userId) => {
    await $fetch('/api/blacklist/add', { method: 'POST', body: { userId } });
    await refreshUsers();
};
const unblacklistUser = async (userId) => {
    await $fetch('/api/blacklist/remove', { method: 'POST', body: { userId } });
    await refreshUsers();
};

// === Indexer & Oracle ===
const syncLoading = ref(false);
const syncResult = ref(null);
const oracleLoading = ref(false);
const oraclePrices = ref(null);

const triggerSync = async () => {
    syncLoading.value = true; syncResult.value = null;
    try { syncResult.value = await $fetch('/api/indexer/sync', { method: 'POST' }); }
    catch (e) { console.error(e); }
    finally { syncLoading.value = false; }
};

const refreshOracle = async () => {
    oracleLoading.value = true;
    try { oraclePrices.value = await $fetch('/api/oracle/price?refresh=true'); }
    catch (e) { console.error(e); }
    finally { oracleLoading.value = false; }
};
</script>