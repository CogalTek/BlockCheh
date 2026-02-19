<template>
    <div class="dashboard-page">
        <div class="container-fluid px-4 py-4">
            <div class="dashboard-header mb-4">
                <div>
                    <h1 class="page-title">Marketplace 🎴</h1>
                    <p class="page-subtitle">Parcourez et achetez des NFTs tokenisés</p>
                </div>
                <div class="d-flex gap-2 align-items-center">
                    <select v-model="selectedCategory" class="form-input form-input-sm">
                        <option value="">Toutes catégories</option>
                        <option value="historique">Historique</option>
                        <option value="edition_limitee">Édition limitée</option>
                        <option value="moderne">Moderne</option>
                        <option value="rare">Rare</option>
                    </select>
                    <button class="btn btn-outline-purple btn-sm" @click="refreshNfts">
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                </div>
            </div>

            <!-- KYC Warning -->
            <div v-if="!kycStatus?.isWhitelisted" class="alert-banner mb-4">
                <i class="bi bi-shield-exclamation"></i>
                <span>Vous devez compléter votre KYC pour acheter des NFTs.</span>
                <nuxt-link to="/dashboard" class="btn btn-sm btn-warning ms-2">Compléter KYC</nuxt-link>
            </div>

            <!-- NFT Grid -->
            <div v-if="filteredNfts.length" class="nft-grid">
                <div v-for="nft in filteredNfts" :key="nft.id" class="nft-card">
                    <div class="nft-image">
                        <img v-if="nft.imageUrl" :src="nft.imageUrl" :alt="nft.name" />
                        <div v-else class="nft-placeholder">
                            <i class="bi bi-image"></i>
                        </div>
                        <span class="nft-category-badge">{{ nft.category }}</span>
                    </div>
                    <div class="nft-details">
                        <h4 class="nft-name">{{ nft.name }}</h4>
                        <p v-if="nft.description" class="nft-desc">{{ nft.description }}</p>
                        <div class="nft-footer">
                            <div class="nft-price">
                                <i class="bi bi-currency-exchange"></i>
                                <span>{{ nft.priceXrp || '-' }} XRP</span>
                            </div>
                            <button v-if="kycStatus?.isWhitelisted && nft.priceXrp"
                                class="btn btn-sm btn-primary-gradient" @click="buyNft(nft)"
                                :disabled="buyLoading === nft.id">
                                {{ buyLoading === nft.id ? '...' : 'Acheter' }}
                            </button>
                        </div>
                    </div>
                    <div class="nft-id">
                        <code>{{ nft.nftokenId?.substring(0, 12) }}...</code>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
                <i class="bi bi-shop"></i>
                <h3>Aucun NFT disponible</h3>
                <p>Les administrateurs n'ont pas encore minté de NFTs sur le marketplace.</p>
            </div>

            <!-- Buy Result -->
            <div v-if="buyResult" class="modal-overlay" @click.self="buyResult = null">
                <div class="modal-card text-center">
                    <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                    <h3 class="mt-3">NFT acheté !</h3>
                    <p class="text-muted-custom">Transaction: {{ buyResult.txHash?.substring(0, 20) }}...</p>
                    <button class="btn btn-primary-gradient" @click="buyResult = null">Fermer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: ['auth'] });

const { data: kycData } = useFetch('/api/kyc/status', { lazy: true, server: false });
const kycStatus = computed(() => kycData.value);

const { data: nftsData, refresh: refreshNfts } = useFetch('/api/nft/list', { lazy: true, server: false });
const allNfts = computed(() => nftsData.value?.nfts || []);

const selectedCategory = ref('');
const filteredNfts = computed(() => {
    if (!selectedCategory.value) return allNfts.value;
    return allNfts.value.filter(n => n.category === selectedCategory.value);
});

const buyLoading = ref(null);
const buyResult = ref(null);

const buyNft = async (nft) => {
    buyLoading.value = nft.id;
    try {
        // D'abord créer une offre, puis l'accepter
        const offer = await $fetch('/api/nft/create-offer', {
            method: 'POST',
            body: { nftokenId: nft.nftokenId, priceXrp: nft.priceXrp },
        });
        buyResult.value = await $fetch('/api/nft/accept-offer', {
            method: 'POST',
            body: { offerId: offer.offerId },
        });
        await refreshNfts();
    } catch (e) {
        console.error('Erreur achat NFT:', e);
        alert('Erreur: ' + (e?.data?.message || e?.message || 'Impossible d\'acheter ce NFT'));
    } finally {
        buyLoading.value = null;
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

.form-input-sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
    background: rgba(10, 14, 39, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 8px;
    color: #fff;
}

.form-input-sm:focus {
    outline: none;
    border-color: #8b5cf6;
}

.alert-banner {
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.4);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #fbbf24;
}

.nft-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.nft-card {
    background: rgba(26, 31, 58, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.nft-card:hover {
    transform: translateY(-5px);
    border-color: rgba(139, 92, 246, 0.5);
    box-shadow: 0 15px 40px rgba(139, 92, 246, 0.2);
}

.nft-image {
    position: relative;
    height: 200px;
    background: rgba(10, 14, 39, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
}

.nft-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.nft-placeholder {
    font-size: 4rem;
    color: rgba(139, 92, 246, 0.3);
}

.nft-category-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: rgba(139, 92, 246, 0.8);
    color: #fff;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: capitalize;
}

.nft-details {
    padding: 1.25rem;
}

.nft-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.nft-desc {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.nft-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

.nft-price {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: #8b5cf6;
    font-weight: 700;
    font-size: 1.1rem;
}

.nft-id {
    padding: 0 1.25rem 1rem;
}

.nft-id code {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
}

.btn-primary-gradient {
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    border: none;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
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

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
}

.empty-state i {
    font-size: 4rem;
    color: rgba(139, 92, 246, 0.3);
}

.empty-state h3 {
    color: #fff;
    margin-top: 1rem;
}

.empty-state p {
    color: rgba(255, 255, 255, 0.5);
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
}

.text-muted-custom {
    color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 576px) {
    .nft-grid {
        grid-template-columns: 1fr;
    }
}
</style>
