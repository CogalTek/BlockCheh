<template>
    <div class="dashboard-page">
        <div class="container-fluid px-4 py-4">
            <div class="dashboard-header mb-4">
                <div>
                    <h1 class="page-title">Transactions 📋</h1>
                    <p class="page-subtitle">Historique de vos opérations on-chain</p>
                </div>
                <button class="btn btn-outline-purple" @click="refreshTx">
                    <i class="bi bi-arrow-clockwise me-1"></i>Rafraîchir
                </button>
            </div>

            <!-- Filters -->
            <div class="filter-bar mb-4">
                <button v-for="f in filters" :key="f.value" class="filter-chip"
                    :class="{ active: selectedFilter === f.value }" @click="selectedFilter = f.value">
                    {{ f.label }}
                </button>
            </div>

            <!-- Transactions List -->
            <div class="dashboard-card">
                <div class="card-body p-0">
                    <div v-if="filteredTx.length" class="tx-list">
                        <div v-for="tx in filteredTx" :key="tx.id" class="tx-item">
                            <div class="tx-icon" :class="getTxColor(tx.type)">
                                <i :class="getTxIcon(tx.type)"></i>
                            </div>
                            <div class="tx-info">
                                <div class="tx-type">{{ getTxLabel(tx.type) }}</div>
                                <div class="tx-date">{{ formatDate(tx.createdAt) }}</div>
                            </div>
                            <div class="tx-amount" v-if="tx.amount">
                                {{ tx.amount }} {{ tx.currency || 'XRP' }}
                            </div>
                            <div class="tx-hash">
                                <a v-if="tx.xrplTxHash" :href="`https://testnet.xrpl.org/transactions/${tx.xrplTxHash}`"
                                    target="_blank" class="hash-link">
                                    {{ tx.xrplTxHash.substring(0, 10) }}...
                                    <i class="bi bi-box-arrow-up-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-state">
                        <i class="bi bi-clock-history"></i>
                        <h3>Aucune transaction</h3>
                        <p>Vos transactions XRPL apparaîtront ici.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: ['auth'] });

const { data: txData, refresh: refreshTx } = useFetch('/api/user/transactions', { lazy: true, server: false });
const transactions = computed(() => txData.value?.transactions || []);

const filters = [
    { label: 'Tout', value: '' },
    { label: 'Paiements', value: 'Payment' },
    { label: 'NFT Mint', value: 'NFTokenMint' },
    { label: 'Trust Line', value: 'TrustSet' },
    { label: 'AMM', value: 'AMMDeposit' },
];
const selectedFilter = ref('');

const filteredTx = computed(() => {
    if (!selectedFilter.value) return transactions.value;
    return transactions.value.filter(tx => tx.type === selectedFilter.value);
});

const getTxIcon = (type) => {
    const icons = {
        Payment: 'bi bi-arrow-left-right',
        NFTokenMint: 'bi bi-plus-circle',
        NFTokenCreateOffer: 'bi bi-tag',
        NFTokenAcceptOffer: 'bi bi-cart-check',
        TrustSet: 'bi bi-link-45deg',
        AMMCreate: 'bi bi-water',
        AMMDeposit: 'bi bi-box-arrow-in-down',
    };
    return icons[type] || 'bi bi-arrow-left-right';
};

const getTxColor = (type) => {
    const colors = { Payment: 'purple', NFTokenMint: 'pink', TrustSet: 'blue', AMMCreate: 'orange', AMMDeposit: 'orange' };
    return colors[type] || 'purple';
};

const getTxLabel = (type) => {
    const labels = {
        Payment: 'Paiement',
        NFTokenMint: 'Mint NFT',
        NFTokenCreateOffer: 'Offre NFT',
        NFTokenAcceptOffer: 'Achat NFT',
        TrustSet: 'Trust Line',
        AMMCreate: 'Création AMM',
        AMMDeposit: 'Dépôt AMM',
    };
    return labels[type] || type;
};

const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
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

.filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.filter-chip {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid rgba(139, 92, 246, 0.3);
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
}

.filter-chip:hover {
    border-color: rgba(139, 92, 246, 0.5);
    color: #fff;
}

.filter-chip.active {
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    border-color: transparent;
    color: #fff;
    font-weight: 600;
}

.dashboard-card {
    background: rgba(26, 31, 58, 0.8);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    overflow: hidden;
}

.card-body {
    padding: 1.5rem;
}

.tx-list {
    display: flex;
    flex-direction: column;
}

.tx-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
    transition: background 0.2s ease;
}

.tx-item:last-child {
    border-bottom: none;
}

.tx-item:hover {
    background: rgba(139, 92, 246, 0.05);
}

.tx-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    color: #fff;
    flex-shrink: 0;
}

.tx-icon.purple {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.tx-icon.pink {
    background: linear-gradient(135deg, #ec4899, #d946ef);
}

.tx-icon.blue {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.tx-icon.orange {
    background: linear-gradient(135deg, #f59e0b, #d97706);
}

.tx-info {
    flex: 1;
}

.tx-type {
    font-weight: 600;
    font-size: 0.95rem;
}

.tx-date {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
}

.tx-amount {
    font-weight: 700;
    color: #8b5cf6;
    font-size: 0.95rem;
    white-space: nowrap;
}

.tx-hash {
    min-width: 120px;
    text-align: right;
}

.hash-link {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    font-size: 0.8rem;
    font-family: monospace;
    transition: color 0.3s ease;
}

.hash-link:hover {
    color: #8b5cf6;
}

.hash-link i {
    margin-left: 0.3rem;
    font-size: 0.7rem;
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

@media (max-width: 768px) {
    .tx-item {
        flex-wrap: wrap;
    }

    .tx-hash {
        width: 100%;
        text-align: left;
        margin-top: 0.5rem;
    }
}
</style>
