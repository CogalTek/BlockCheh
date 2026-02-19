<template>
    <div class="dashboard-page">
        <div class="container-fluid px-4 py-4">
            <div class="dashboard-header mb-4">
                <div>
                    <h1 class="page-title">Mon Portfolio 📂</h1>
                    <p class="page-subtitle">Vos NFTs et tokens fongibles</p>
                </div>
                <button class="btn btn-outline-purple" @click="refreshAll">
                    <i class="bi bi-arrow-clockwise me-1"></i>Rafraîchir
                </button>
            </div>

            <!-- NFTs Section -->
            <div class="dashboard-card mb-4">
                <div class="card-header">
                    <h3 class="card-title"><i class="bi bi-collection me-2"></i>Mes NFTs ({{ myNfts.length }})</h3>
                </div>
                <div class="card-body">
                    <div v-if="myNfts.length" class="nft-grid">
                        <div v-for="nft in myNfts" :key="nft.id" class="nft-card-mini">
                            <div class="nft-icon">🎴</div>
                            <div class="nft-info">
                                <h5>{{ nft.name }}</h5>
                                <span class="nft-cat">{{ nft.category }}</span>
                            </div>
                            <div class="nft-actions">
                                <button class="btn btn-sm btn-sell" @click="openSellModal(nft)"
                                    :disabled="!kycStatus?.isWhitelisted">
                                    <i class="bi bi-tag"></i> Vendre
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-mini">
                        <i class="bi bi-image"></i>
                        <p>Vous ne possédez aucun NFT. Visitez le <nuxt-link
                                to="/dashboard/marketplace">Marketplace</nuxt-link> !</p>
                    </div>
                </div>
            </div>

            <!-- Tokens Section -->
            <div class="dashboard-card">
                <div class="card-header">
                    <h3 class="card-title"><i class="bi bi-coin me-2"></i>Mes Tokens</h3>
                </div>
                <div class="card-body">
                    <div v-if="walletData?.balances?.length" class="token-grid">
                        <div v-for="bal in walletData.balances" :key="bal.currency" class="token-card">
                            <div class="token-icon">
                                <i class="bi bi-currency-exchange"></i>
                            </div>
                            <div class="token-details">
                                <div class="token-name">{{ bal.currency }}</div>
                                <div class="token-issuer-text">Issuer: {{ bal.issuer?.substring(0, 10) }}...</div>
                            </div>
                            <div class="token-balance-big">{{ bal.balance }}</div>
                        </div>
                    </div>
                    <div v-else class="empty-mini">
                        <i class="bi bi-coin"></i>
                        <p>Aucun token fongible. Établissez une trust line dans votre <nuxt-link
                                to="/dashboard/wallet">Wallet</nuxt-link>.</p>
                    </div>

                    <!-- XRP Balance -->
                    <div v-if="walletData?.xrpBalance" class="xrp-balance-card mt-3">
                        <div class="xrp-icon">💎</div>
                        <div>
                            <div class="xrp-label">Solde XRP</div>
                            <div class="xrp-amount">{{ walletData.xrpBalance }} XRP</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sell Modal -->
            <div v-if="sellModal" class="modal-overlay" @click.self="sellModal = null">
                <div class="modal-card">
                    <h3>Vendre {{ sellModal.name }}</h3>
                    <p class="text-muted-custom">Créer une offre de vente pour ce NFT</p>
                    <div class="mb-3">
                        <label class="form-label-custom">Prix de vente (XRP)</label>
                        <input v-model="sellPrice" type="number" class="form-input" placeholder="100" />
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary-gradient" @click="createSellOffer" :disabled="sellLoading">
                            {{ sellLoading ? 'Création...' : 'Mettre en vente' }}
                        </button>
                        <button class="btn btn-outline-light" @click="sellModal = null">Annuler</button>
                    </div>
                    <div v-if="sellResult" class="mt-3 alert-custom success">
                        <i class="bi bi-check-circle"></i> Offre créée !
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: ['auth'] });

const { data: kycData } = useFetch('/api/kyc/status', { lazy: true, server: false });
const kycStatus = computed(() => kycData.value);

const { data: nftsResult, refresh: refreshNfts } = useFetch('/api/nft/my', { lazy: true, server: false });
const myNfts = computed(() => nftsResult.value?.nfts || []);

const { data: walletData, refresh: refreshWallet } = useFetch('/api/token/balance', { lazy: true, server: false });

const refreshAll = async () => {
    await Promise.all([refreshNfts(), refreshWallet()]);
};

// Sell flow
const sellModal = ref(null);
const sellPrice = ref('');
const sellLoading = ref(false);
const sellResult = ref(null);

const openSellModal = (nft) => {
    sellModal.value = nft;
    sellPrice.value = nft.priceXrp || '';
    sellResult.value = null;
};

const createSellOffer = async () => {
    if (!sellPrice.value || !sellModal.value) return;
    sellLoading.value = true;
    try {
        sellResult.value = await $fetch('/api/nft/create-offer', {
            method: 'POST',
            body: { nftokenId: sellModal.value.nftokenId, priceXrp: sellPrice.value },
        });
    } catch (e) {
        console.error(e);
        alert('Erreur: ' + (e?.data?.message || e?.message || 'Impossible de créer l\'offre'));
    } finally {
        sellLoading.value = false;
    }
};
</script>

<style scoped>
.dashboard-page {
    color: #fff;
}

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
}

.page-title {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.page-subtitle {
    color: rgba(255, 255, 255, 0.6);
    margin-top: 0.3rem;
}

.dashboard-card {
    background: rgba(26, 31, 58, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    overflow: hidden;
}

.card-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(139, 92, 246, 0.15);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
}

.card-body {
    padding: 1.5rem;
}

.nft-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.nft-card-mini {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(10, 14, 39, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(139, 92, 246, 0.15);
    transition: all 0.3s ease;
}

.nft-card-mini:hover {
    border-color: rgba(139, 92, 246, 0.4);
}

.nft-icon {
    font-size: 2rem;
}

.nft-info {
    flex: 1;
}

.nft-info h5 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
}

.nft-cat {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: capitalize;
}

.btn-sell {
    background: rgba(245, 158, 11, 0.2);
    border: 1px solid rgba(245, 158, 11, 0.5);
    color: #fbbf24;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.btn-sell:hover {
    background: rgba(245, 158, 11, 0.3);
    color: #fff;
}

.token-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.token-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(10, 14, 39, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(59, 130, 246, 0.2);
}

.token-icon {
    width: 45px;
    height: 45px;
    border-radius: 10px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.2rem;
}

.token-details {
    flex: 1;
}

.token-name {
    font-weight: 600;
    font-size: 1rem;
}

.token-issuer-text {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
}

.token-balance-big {
    font-size: 1.3rem;
    font-weight: 700;
    color: #8b5cf6;
}

.xrp-balance-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(217, 70, 239, 0.1));
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 12px;
}

.xrp-icon {
    font-size: 2rem;
}

.xrp-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
}

.xrp-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #8b5cf6;
}

.empty-mini {
    text-align: center;
    padding: 2rem;
}

.empty-mini i {
    font-size: 2.5rem;
    color: rgba(139, 92, 246, 0.3);
    display: block;
    margin-bottom: 0.5rem;
}

.empty-mini p {
    color: rgba(255, 255, 255, 0.5);
}

.empty-mini a {
    color: #8b5cf6;
}

.btn-outline-purple {
    border: 1px solid rgba(139, 92, 246, 0.5);
    color: #8b5cf6;
    background: transparent;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
}

.btn-outline-purple:hover {
    background: rgba(139, 92, 246, 0.2);
    color: #fff;
}

.btn-primary-gradient {
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    border: none;
    color: #fff;
    padding: 0.7rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
}

.btn-primary-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

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
}

.form-input:focus {
    outline: none;
    border-color: #8b5cf6;
}

.alert-custom.success {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.4);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #10b981;
}
</style>
