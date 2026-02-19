<template>
    <div class="dashboard-page">
        <div class="container-fluid px-4 py-4">
            <!-- Header -->
            <div class="dashboard-header mb-4">
                <div>
                    <h1 class="page-title">Bonjour, {{ user?.given_name || 'Collectionneur' }} 👋</h1>
                    <p class="page-subtitle">Voici un aperçu de votre portfolio BlockCheh</p>
                </div>
                <div class="d-flex gap-2">
                    <button v-if="kycStatus?.status === 'NONE'" class="btn btn-warning" @click="showKycModal = true">
                        <i class="bi bi-shield-exclamation me-2"></i>Compléter KYC
                    </button>
                    <span v-else-if="kycStatus?.status === 'PENDING'" class="badge bg-warning text-dark p-2">
                        <i class="bi bi-hourglass-split me-1"></i>KYC en attente
                    </span>
                    <span v-else-if="kycStatus?.status === 'APPROVED'" class="badge bg-success p-2">
                        <i class="bi bi-check-circle me-1"></i>KYC validé
                    </span>
                </div>
            </div>

            <!-- KYC Modal -->
            <div v-if="showKycModal" class="modal-overlay" @click.self="showKycModal = false">
                <div class="modal-card">
                    <h3>Compléter votre KYC</h3>
                    <p class="text-muted-custom">Pour accéder aux fonctionnalités de trading, complétez votre
                        vérification d'identité.</p>
                    <div class="mb-3">
                        <label class="form-label-custom">Nom complet</label>
                        <input v-model="kycForm.fullName" type="text" class="form-input" placeholder="Jean Dupont" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label-custom">Numéro de document d'identité</label>
                        <input v-model="kycForm.documentId" type="text" class="form-input" placeholder="123456789" />
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary-gradient" @click="submitKyc" :disabled="kycLoading">
                            {{ kycLoading ? 'Envoi...' : 'Soumettre' }}
                        </button>
                        <button class="btn btn-outline-light" @click="showKycModal = false">Annuler</button>
                    </div>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="row g-4 mb-4">
                <div class="col-md-6 col-xl-3">
                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <i class="bi bi-wallet2"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-label">Solde XRP</div>
                            <div class="stat-value">{{ walletData?.xrpBalance || '0' }} XRP</div>
                            <div class="stat-change neutral">
                                <i class="bi bi-currency-exchange"></i> ~{{ (parseFloat(walletData?.xrpBalance || '0') *
                                xrplPrice).toFixed(2) }}€
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xl-3">
                    <div class="stat-card">
                        <div class="stat-icon pink">
                            <i class="bi bi-collection"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-label">NFTs détenus</div>
                            <div class="stat-value">{{ myNfts?.length || 0 }}</div>
                            <div class="stat-change neutral">
                                <i class="bi bi-image"></i> Cartes de tarot
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xl-3">
                    <div class="stat-card">
                        <div class="stat-icon blue">
                            <i class="bi bi-graph-up"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-label">Tokens IoU</div>
                            <div class="stat-value">{{ walletData?.balances?.length || 0 }} types</div>
                            <div class="stat-change neutral">
                                <i class="bi bi-coin"></i> Trust lines
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-xl-3">
                    <div class="stat-card">
                        <div class="stat-icon orange">
                            <i class="bi bi-clock-history"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-label">Transactions</div>
                            <div class="stat-value">{{ userTransactions?.length || 0 }}</div>
                            <div class="stat-change neutral">
                                <i class="bi bi-arrow-repeat"></i> Historique
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-4">
                <!-- Wallet Info -->
                <div class="col-xl-8">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title">Mon Wallet</h3>
                            <span v-if="walletData?.needsFunding" class="badge bg-warning text-dark">
                                <i class="bi bi-exclamation-triangle me-1"></i>Nécessite un financement
                            </span>
                        </div>
                        <div class="card-body">
                            <div v-if="kycStatus?.walletAddress" class="mb-3">
                                <label class="form-label-custom">Adresse XRPL</label>
                                <div class="wallet-address">
                                    <code>{{ kycStatus.walletAddress }}</code>
                                    <button class="btn btn-sm btn-outline-purple" @click="copyAddress">
                                        <i class="bi bi-clipboard"></i>
                                    </button>
                                </div>
                            </div>
                            <div v-if="walletData?.balances?.length" class="mt-3">
                                <label class="form-label-custom">Tokens IoU</label>
                                <div class="token-list">
                                    <div v-for="bal in walletData.balances" :key="bal.currency" class="token-item">
                                        <div class="token-info">
                                            <span class="token-name">{{ bal.currency }}</span>
                                            <span class="token-issuer">{{ bal.issuer?.substring(0, 10) }}...</span>
                                        </div>
                                        <span class="token-balance">{{ bal.balance }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="!kycStatus?.walletAddress" class="text-center py-4">
                                <i class="bi bi-wallet2 text-purple" style="font-size: 3rem;"></i>
                                <p class="text-muted-custom mt-2">Complétez votre KYC pour obtenir un wallet</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="col-xl-4">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title">Actions rapides</h3>
                        </div>
                        <div class="card-body">
                            <div class="quick-actions">
                                <nuxt-link to="/dashboard/marketplace" class="quick-action-btn"
                                    v-if="kycStatus?.isWhitelisted">
                                    <i class="bi bi-shop"></i>
                                    <span>Marketplace</span>
                                </nuxt-link>
                                <button class="quick-action-btn" @click="refreshData">
                                    <i class="bi bi-arrow-clockwise"></i>
                                    <span>Rafraîchir</span>
                                </button>
                                <nuxt-link to="/dashboard/wallet" class="quick-action-btn">
                                    <i class="bi bi-wallet2"></i>
                                    <span>Wallet</span>
                                </nuxt-link>
                                <nuxt-link to="/docs" class="quick-action-btn">
                                    <i class="bi bi-book"></i>
                                    <span>Docs</span>
                                </nuxt-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <!-- NFTs -->
                <div class="col-xl-8">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title">Mes NFTs</h3>
                        </div>
                        <div class="card-body p-0">
                            <div v-if="myNfts?.length" class="assets-table">
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Carte</th>
                                                <th>Catégorie</th>
                                                <th>Prix</th>
                                                <th>NFToken ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="nft in myNfts" :key="nft.id" class="asset-row">
                                                <td>
                                                    <div class="asset-info">
                                                        <div class="asset-icon">🃏</div>
                                                        <div>
                                                            <div class="asset-name">{{ nft.name }}</div>
                                                            <div class="asset-id">{{ nft.description || '-' }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span class="badge-type">{{ nft.category }}</span></td>
                                                <td>{{ nft.priceXrp || '-' }} XRP</td>
                                                <td><code class="nft-id">{{ nft.nftokenId?.substring(0, 12) }}...</code>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div v-else class="text-center py-5">
                                <i class="bi bi-collection text-purple" style="font-size: 3rem;"></i>
                                <p class="text-muted-custom mt-2">Aucun NFT pour l'instant</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="col-xl-4">
                    <div class="dashboard-card" style="margin-bottom: 0;">
                        <div class="card-header">
                            <h3 class="card-title">Activité récente</h3>
                        </div>
                        <div class="card-body p-0">
                            <div class="activity-list">
                                <div v-for="tx in userTransactions" :key="tx.id" class="activity-item">
                                    <div :class="['activity-icon', getActivityClass(tx.type)]">
                                        <i :class="getActivityIcon(tx.type)"></i>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-title">{{ getActivityLabel(tx.type) }}</div>
                                        <div class="activity-time">{{ formatDate(tx.createdAt) }}</div>
                                    </div>
                                    <div class="activity-amount" :class="getActivityClass(tx.type)">
                                        {{ tx.amount }} {{ tx.assetId }}
                                    </div>
                                </div>
                                <div v-if="!userTransactions?.length" class="text-center py-4">
                                    <p class="text-muted-custom">Aucune activité</p>
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
.dashboard-page {
    min-height: 100%;
    padding-bottom: 4rem;
    background: transparent;
}

.container-fluid {
    position: relative;
    z-index: 1;
}

.row {
    margin-bottom: 0;
}

.row.g-4 {
    row-gap: 1.5rem !important;
}

[class*="col-"] {
    margin-bottom: 0;
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

.btn-primary-gradient {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    border: none;
    color: white;
    padding: 0.7rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.btn-primary-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-card {
    background: rgba(26, 31, 58, 0.98);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 16px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
}

.modal-card h3 {
    color: #fff;
    margin-bottom: 0.5rem;
}

.text-muted-custom {
    color: rgba(255, 255, 255, 0.6);
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

/* Stat Cards */
.stat-card {
    background: rgba(26, 31, 58, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    gap: 1rem;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
}

.stat-card:hover {
    transform: translateY(-5px);
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    flex-shrink: 0;
}

.stat-icon.purple {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-icon.pink {
    background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
}

.stat-icon.blue {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon.orange {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-content {
    flex: 1;
}

.stat-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.3rem;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.3rem;
}

.stat-change {
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.stat-change.positive {
    color: #10b981;
}

.stat-change.negative {
    color: #ef4444;
}

.stat-change.neutral {
    color: rgba(255, 255, 255, 0.5);
}

/* Dashboard Card */
.dashboard-card {
    background: rgba(26, 31, 58, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    overflow: hidden;
    height: 100%;
    position: relative;
    z-index: 1;
}

.card-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
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

/* Wallet */
.wallet-address {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(10, 14, 39, 0.5);
    padding: 0.75rem;
    border-radius: 10px;
}

.wallet-address code {
    color: #8b5cf6;
    flex: 1;
    word-break: break-all;
}

.btn-outline-purple {
    border: 1px solid rgba(139, 92, 246, 0.5);
    color: #8b5cf6;
}

.btn-outline-purple:hover {
    background: rgba(139, 92, 246, 0.2);
    color: #fff;
}

.text-purple {
    color: #8b5cf6 !important;
}

/* Token List */
.token-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.token-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(10, 14, 39, 0.5);
    border-radius: 10px;
}

.token-name {
    color: #fff;
    font-weight: 600;
    display: block;
}

.token-issuer {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.8rem;
}

.token-balance {
    color: #8b5cf6;
    font-weight: 700;
    font-size: 1.1rem;
}

/* Quick Actions */
.quick-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.quick-action-btn {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.quick-action-btn:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-3px);
    color: white;
}

.quick-action-btn i {
    font-size: 1.5rem;
    color: #8b5cf6;
}

/* Assets Table */
.assets-table {
    overflow-x: auto;
}

.table {
    margin: 0;
    color: #fff;
}

.table thead th {
    background: rgba(10, 14, 39, 0.5);
    color: rgba(255, 255, 255, 0.7);
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: none;
    padding: 1rem 1.5rem;
}

.table tbody tr {
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
    transition: all 0.3s ease;
}

.table tbody tr:hover {
    background: rgba(139, 92, 246, 0.05);
}

.table tbody td {
    padding: 1rem 1.5rem;
    border: none;
    vertical-align: middle;
}

.asset-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.asset-icon {
    width: 45px;
    height: 45px;
    background: rgba(139, 92, 246, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
}

.asset-name {
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.2rem;
}

.asset-id {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
}

.badge-type {
    background: rgba(139, 92, 246, 0.2);
    color: #8b5cf6;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
}

.nft-id {
    background: rgba(10, 14, 39, 0.5);
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
}

/* Activity List */
.activity-list {
    display: flex;
    flex-direction: column;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
    transition: all 0.3s ease;
}

.activity-item:hover {
    background: rgba(139, 92, 246, 0.05);
}

.activity-item:last-child {
    border-bottom: none;
}

.activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
}

.activity-icon.buy {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.activity-icon.sell {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.activity-icon.transfer {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
}

.activity-icon.neutral {
    background: rgba(139, 92, 246, 0.2);
    color: #8b5cf6;
}

.activity-content {
    flex: 1;
}

.activity-title {
    color: #fff;
    font-weight: 500;
    margin-bottom: 0.2rem;
}

.activity-time {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
}

.activity-amount {
    font-weight: 600;
    font-size: 0.95rem;
}

.activity-amount.buy {
    color: #10b981;
}

.activity-amount.sell {
    color: #ef4444;
}

.activity-amount.transfer {
    color: #3b82f6;
}

.activity-amount.neutral {
    color: #8b5cf6;
}

@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .page-title {
        font-size: 1.5rem;
    }

    .quick-actions {
        grid-template-columns: 1fr;
    }
}
</style>

<script setup>
const { user } = useAuth();
const { getXrplPrice } = useXrpl();

const xrplPrice = ref(0);
const showKycModal = ref(false);
const kycLoading = ref(false);
const kycForm = reactive({ fullName: '', documentId: '' });

definePageMeta({ middleware: 'auth' });

// Fetch data
const { data: kycStatus, refresh: refreshKyc } = useFetch('/api/kyc/status', { lazy: true, server: false });
const { data: walletData, refresh: refreshWallet } = useFetch('/api/token/balance', { lazy: true, server: false });
const { data: myNftsData, refresh: refreshNfts } = useFetch('/api/nft/my', { lazy: true, server: false });
const { data: txData, refresh: refreshTx } = useFetch('/api/user/transactions', { lazy: true, server: false });

const myNfts = computed(() => myNftsData.value?.nfts || []);
const userTransactions = computed(() => txData.value?.transactions || []);

onMounted(async () => {
    xrplPrice.value = await getXrplPrice() || 0;
});

const submitKyc = async () => {
    if (!kycForm.fullName || !kycForm.documentId) return;
    kycLoading.value = true;
    try {
        await $fetch('/api/kyc/submit', {
            method: 'POST',
            body: { fullName: kycForm.fullName, documentId: kycForm.documentId },
        });
        showKycModal.value = false;
        await refreshKyc();
    } catch (e) {
        console.error('KYC error:', e);
    } finally {
        kycLoading.value = false;
    }
};

const copyAddress = () => {
    if (kycStatus.value?.walletAddress) {
        navigator.clipboard.writeText(kycStatus.value.walletAddress);
    }
};

const refreshData = async () => {
    await Promise.all([refreshKyc(), refreshWallet(), refreshNfts(), refreshTx()]);
};

const getActivityClass = (type) => {
    if (type?.includes('BUY') || type?.includes('RECEIVE') || type === 'PAYMENT_IN') return 'buy';
    if (type?.includes('SELL') || type?.includes('SEND') || type === 'PAYMENT_OUT') return 'sell';
    if (type?.includes('TRANSFER')) return 'transfer';
    return 'neutral';
};

const getActivityIcon = (type) => {
    if (type?.includes('BUY') || type?.includes('RECEIVE') || type === 'PAYMENT_IN') return 'bi bi-box-arrow-in-down';
    if (type?.includes('SELL') || type?.includes('SEND') || type === 'PAYMENT_OUT') return 'bi bi-box-arrow-up';
    if (type?.includes('TRUST')) return 'bi bi-link-45deg';
    if (type?.includes('NFT')) return 'bi bi-image';
    return 'bi bi-arrow-left-right';
};

const getActivityLabel = (type) => {
    const labels = {
        'AMM_BUY': 'Achat via AMM', 'AMM_SELL': 'Vente via AMM',
        'TOKEN_SEND': 'Tokens envoyés', 'TOKEN_RECEIVE': 'Tokens reçus',
        'TRUST_SET': 'Trust line', 'NFT_BUY': 'Achat NFT',
        'NFT_SELL_OFFER': 'Offre NFT', 'NFT_MINT': 'Mint NFT',
        'PAYMENT_IN': 'Paiement reçu', 'PAYMENT_OUT': 'Paiement envoyé',
    };
    return labels[type] || type;
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Il y a quelques minutes';
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
};
</script>