<template>
    <div class="dashboard-page">
        <div class="container-fluid px-4 py-4">
            <div class="dashboard-header mb-4">
                <div>
                    <h1 class="page-title">Wallet 💎</h1>
                    <p class="page-subtitle">Gérez votre portefeuille XRPL</p>
                </div>
            </div>

            <!-- KYC Required -->
            <div v-if="!kycStatus?.walletAddress" class="empty-state">
                <i class="bi bi-wallet2"></i>
                <h3>Wallet non disponible</h3>
                <p>Complétez votre KYC pour obtenir un wallet XRPL.</p>
                <nuxt-link to="/dashboard" class="btn btn-primary-gradient mt-2">Compléter KYC</nuxt-link>
            </div>

            <template v-else>
                <!-- Wallet Info -->
                <div class="row g-4 mb-4">
                    <div class="col-lg-8">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Informations Wallet</h3>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label class="form-label-custom">Adresse XRPL</label>
                                    <div class="wallet-address-box">
                                        <code>{{ kycStatus.walletAddress }}</code>
                                        <button class="btn btn-sm btn-outline-purple" @click="copyAddress">
                                            <i class="bi bi-clipboard"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="balance-row">
                                    <div class="balance-item main">
                                        <span class="balance-label">Solde XRP</span>
                                        <span class="balance-value">{{ walletData?.xrpBalance || '0' }} XRP</span>
                                    </div>
                                    <div v-for="bal in walletData?.balances" :key="bal.currency" class="balance-item">
                                        <span class="balance-label">{{ bal.currency }}</span>
                                        <span class="balance-value">{{ bal.balance }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title">Statut</h3>
                            </div>
                            <div class="card-body">
                                <div class="status-list">
                                    <div class="status-item">
                                        <span>KYC</span>
                                        <span class="badge"
                                            :class="kycStatus?.status === 'APPROVED' ? 'bg-success' : 'bg-warning text-dark'">
                                            {{ kycStatus?.status }}
                                        </span>
                                    </div>
                                    <div class="status-item">
                                        <span>Whitelisted</span>
                                        <span class="badge"
                                            :class="kycStatus?.isWhitelisted ? 'bg-success' : 'bg-secondary'">
                                            {{ kycStatus?.isWhitelisted ? 'Oui' : 'Non' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="row g-4">
                    <!-- Trust Line -->
                    <div class="col-lg-4">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title"><i class="bi bi-link-45deg me-2"></i>Trust Line</h3>
                            </div>
                            <div class="card-body">
                                <p class="text-muted-custom small">Établir une trust line pour recevoir un token
                                    fongible</p>
                                <div class="mb-3">
                                    <label class="form-label-custom">Code devise</label>
                                    <select v-model="trustForm.currencyCode" class="form-input">
                                        <option value="">Sélectionner un token</option>
                                        <option v-for="t in availableTokens" :key="t.currencyCode"
                                            :value="t.currencyCode">
                                            {{ t.currencyCode }} - {{ t.name }}
                                        </option>
                                    </select>
                                </div>
                                <button class="btn btn-primary-gradient w-100" @click="setTrustLine"
                                    :disabled="trustLoading || !trustForm.currencyCode">
                                    {{ trustLoading ? 'Envoi...' : '🔗 Établir Trust Line' }}
                                </button>
                                <div v-if="trustResult" class="mt-2 alert-custom success">
                                    <i class="bi bi-check-circle"></i> Trust line établie !
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Swap -->
                    <div class="col-lg-4">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title"><i class="bi bi-arrow-left-right me-2"></i>Swap AMM</h3>
                            </div>
                            <div class="card-body">
                                <p class="text-muted-custom small">Échanger des tokens via l'AMM natif XRPL</p>
                                <div class="mb-3">
                                    <label class="form-label-custom">Token</label>
                                    <select v-model="swapForm.currencyCode" class="form-input">
                                        <option value="">Sélectionner</option>
                                        <option v-for="t in availableTokens" :key="t.currencyCode"
                                            :value="t.currencyCode">
                                            {{ t.currencyCode }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Direction</label>
                                    <select v-model="swapForm.direction" class="form-input">
                                        <option value="buy">Acheter (XRP → Token)</option>
                                        <option value="sell">Vendre (Token → XRP)</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Montant</label>
                                    <input v-model="swapForm.amount" type="number" class="form-input"
                                        placeholder="100" />
                                </div>
                                <button class="btn btn-primary-gradient w-100" @click="doSwap"
                                    :disabled="swapLoading || !swapForm.currencyCode || !swapForm.amount">
                                    {{ swapLoading ? 'Swap...' : '🔄 Swap' }}
                                </button>
                                <div v-if="swapResult" class="mt-2 alert-custom success">
                                    <i class="bi bi-check-circle"></i> Swap réussi !
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Transfer -->
                    <div class="col-lg-4">
                        <div class="dashboard-card">
                            <div class="card-header">
                                <h3 class="card-title"><i class="bi bi-send me-2"></i>Transfert</h3>
                            </div>
                            <div class="card-body">
                                <p class="text-muted-custom small">Envoyer des tokens à un autre utilisateur whitelisté
                                </p>
                                <div class="mb-3">
                                    <label class="form-label-custom">Code devise</label>
                                    <select v-model="transferForm.currencyCode" class="form-input">
                                        <option value="">Sélectionner</option>
                                        <option v-for="t in availableTokens" :key="t.currencyCode"
                                            :value="t.currencyCode">
                                            {{ t.currencyCode }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Email destinataire</label>
                                    <input v-model="transferForm.toEmail" type="email" class="form-input"
                                        placeholder="user@example.com" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-custom">Montant</label>
                                    <input v-model="transferForm.amount" type="number" class="form-input"
                                        placeholder="50" />
                                </div>
                                <button class="btn btn-primary-gradient w-100" @click="doTransfer"
                                    :disabled="transferLoading || !transferForm.currencyCode || !transferForm.toEmail || !transferForm.amount">
                                    {{ transferLoading ? 'Envoi...' : '📤 Envoyer' }}
                                </button>
                                <div v-if="transferResult" class="mt-2 alert-custom success">
                                    <i class="bi bi-check-circle"></i> Transfert effectué !
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: ['auth'] });

const { data: kycData } = useFetch('/api/kyc/status', { lazy: true, server: false });
const kycStatus = computed(() => kycData.value);

const { data: walletData, refresh: refreshWallet } = useFetch('/api/token/balance', { lazy: true, server: false });
const { data: tokensData } = useFetch('/api/token/list', { lazy: true, server: false });
const availableTokens = computed(() => tokensData.value?.tokens || []);

const copyAddress = () => {
    if (kycStatus.value?.walletAddress) {
        navigator.clipboard.writeText(kycStatus.value.walletAddress);
    }
};

// Trust Line
const trustForm = reactive({ currencyCode: '' });
const trustLoading = ref(false);
const trustResult = ref(null);
const setTrustLine = async () => {
    trustLoading.value = true; trustResult.value = null;
    try {
        trustResult.value = await $fetch('/api/token/trust', { method: 'POST', body: { currencyCode: trustForm.currencyCode } });
        await refreshWallet();
    } catch (e) {
        console.error(e);
        alert('Erreur: ' + (e?.data?.message || e?.message || 'Impossible d\'établir la trust line'));
    } finally { trustLoading.value = false; }
};

// Swap
const swapForm = reactive({ currencyCode: '', direction: 'buy', amount: '' });
const swapLoading = ref(false);
const swapResult = ref(null);
const doSwap = async () => {
    swapLoading.value = true; swapResult.value = null;
    try {
        swapResult.value = await $fetch('/api/amm/swap', {
            method: 'POST',
            body: { currencyCode: swapForm.currencyCode, direction: swapForm.direction, amount: swapForm.amount },
        });
        await refreshWallet();
    } catch (e) {
        console.error(e);
        alert('Erreur: ' + (e?.data?.message || e?.message || 'Swap échoué'));
    } finally { swapLoading.value = false; }
};

// Transfer
const transferForm = reactive({ currencyCode: '', toEmail: '', amount: '' });
const transferLoading = ref(false);
const transferResult = ref(null);
const doTransfer = async () => {
    transferLoading.value = true; transferResult.value = null;
    try {
        transferResult.value = await $fetch('/api/token/transfer', {
            method: 'POST',
            body: { currencyCode: transferForm.currencyCode, toEmail: transferForm.toEmail, amount: transferForm.amount },
        });
        await refreshWallet();
    } catch (e) {
        console.error(e);
        alert('Erreur: ' + (e?.data?.message || e?.message || 'Transfert échoué'));
    } finally { transferLoading.value = false; }
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
    height: 100%;
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

.wallet-address-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(10, 14, 39, 0.6);
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid rgba(139, 92, 246, 0.2);
}

.wallet-address-box code {
    flex: 1;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
    word-break: break-all;
}

.balance-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
}

.balance-item {
    padding: 1rem 1.25rem;
    background: rgba(10, 14, 39, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(139, 92, 246, 0.15);
    flex: 1;
    min-width: 120px;
}

.balance-item.main {
    border-color: rgba(139, 92, 246, 0.4);
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.05));
}

.balance-label {
    display: block;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 0.25rem;
}

.balance-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #8b5cf6;
}

.status-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(10, 14, 39, 0.5);
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.8);
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

.btn-primary-gradient {
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    border: none;
    color: #fff;
    padding: 0.7rem 1.5rem;
    border-radius: 12px;
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

.alert-custom.success {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.4);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #10b981;
    font-size: 0.9rem;
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
</style>
