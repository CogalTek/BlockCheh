<template>
    <div class="dashboard-page">
        <div class="container-fluid px-4 py-4">
            <div class="dashboard-header mb-4">
                <div>
                    <h1 class="page-title">Paramètres ⚙️</h1>
                    <p class="page-subtitle">Profil et vérification d'identité</p>
                </div>
            </div>

            <div class="row g-4">
                <!-- Profile -->
                <div class="col-lg-6">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title"><i class="bi bi-person me-2"></i>Profil</h3>
                        </div>
                        <div class="card-body">
                            <div class="profile-info">
                                <div class="profile-avatar">
                                    <img v-if="user?.picture" :src="user.picture" :alt="user?.given_name" />
                                    <span v-else>{{ user?.given_name?.[0]?.toUpperCase() || 'U' }}</span>
                                </div>
                                <div class="profile-details">
                                    <h4>{{ user?.given_name }} {{ user?.family_name }}</h4>
                                    <p>{{ user?.email }}</p>
                                </div>
                            </div>
                            <div class="info-list mt-4">
                                <div class="info-item">
                                    <span class="info-label">Email</span>
                                    <span class="info-value">{{ user?.email || '-' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Prénom</span>
                                    <span class="info-value">{{ user?.given_name || '-' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Nom</span>
                                    <span class="info-value">{{ user?.family_name || '-' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- KYC Status -->
                <div class="col-lg-6">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title"><i class="bi bi-shield-check me-2"></i>KYC</h3>
                        </div>
                        <div class="card-body">
                            <div class="kyc-status-block">
                                <div class="kyc-icon" :class="kycStatusClass">
                                    <i :class="kycIconClass"></i>
                                </div>
                                <div class="kyc-info">
                                    <h4>{{ kycStatusLabel }}</h4>
                                    <p>{{ kycStatusDesc }}</p>
                                </div>
                            </div>

                            <div v-if="kycStatus?.walletAddress" class="info-list mt-4">
                                <div class="info-item">
                                    <span class="info-label">Wallet XRPL</span>
                                    <span class="info-value mono">{{ kycStatus.walletAddress?.substring(0, 20)
                                        }}...</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Whitelisted</span>
                                    <span class="badge"
                                        :class="kycStatus?.isWhitelisted ? 'bg-success' : 'bg-secondary'">
                                        {{ kycStatus?.isWhitelisted ? 'Oui' : 'Non' }}
                                    </span>
                                </div>
                            </div>

                            <!-- Resubmit KYC if rejected -->
                            <div v-if="kycStatus?.status === 'REJECTED'" class="mt-4">
                                <p class="text-warning small"><i class="bi bi-exclamation-triangle me-1"></i>Votre KYC a
                                    été rejeté. Vous pouvez resoumettre.</p>
                                <nuxt-link to="/dashboard" class="btn btn-primary-gradient">Resoumettre KYC</nuxt-link>
                            </div>
                            <div v-if="kycStatus?.status === 'NONE'" class="mt-4">
                                <nuxt-link to="/dashboard" class="btn btn-primary-gradient">Compléter KYC</nuxt-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: ['auth'] });

const { user } = useAuth();

const { data: kycData } = useFetch('/api/kyc/status', { lazy: true, server: false });
const kycStatus = computed(() => kycData.value);

const kycStatusClass = computed(() => {
    const status = kycStatus.value?.status;
    if (status === 'APPROVED') return 'success';
    if (status === 'PENDING') return 'warning';
    if (status === 'REJECTED') return 'danger';
    return 'neutral';
});

const kycIconClass = computed(() => {
    const status = kycStatus.value?.status;
    if (status === 'APPROVED') return 'bi bi-check-circle-fill';
    if (status === 'PENDING') return 'bi bi-hourglass-split';
    if (status === 'REJECTED') return 'bi bi-x-circle-fill';
    return 'bi bi-shield-exclamation';
});

const kycStatusLabel = computed(() => {
    const labels = { APPROVED: 'KYC Validé', PENDING: 'En attente', REJECTED: 'Rejeté', NONE: 'Non soumis' };
    return labels[kycStatus.value?.status] || 'Non soumis';
});

const kycStatusDesc = computed(() => {
    const descs = {
        APPROVED: 'Votre identité a été vérifiée. Vous avez accès à toutes les fonctionnalités.',
        PENDING: 'Votre demande est en cours de vérification par un administrateur.',
        REJECTED: 'Votre demande a été rejetée. Vous pouvez resoumettre.',
        NONE: 'Complétez votre vérification d\'identité pour accéder aux fonctionnalités.',
    };
    return descs[kycStatus.value?.status] || descs.NONE;
});
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
}

.card-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
}

.card-body {
    padding: 1.5rem;
}

.profile-info {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.profile-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    overflow: hidden;
    flex-shrink: 0;
}

.profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-details h4 {
    margin: 0;
    font-size: 1.2rem;
}

.profile-details p {
    margin: 0.25rem 0 0;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: rgba(10, 14, 39, 0.5);
    border-radius: 10px;
}

.info-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
}

.info-value {
    color: #fff;
    font-weight: 500;
    font-size: 0.9rem;
}

.info-value.mono {
    font-family: monospace;
    font-size: 0.8rem;
}

.kyc-status-block {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.25rem;
    background: rgba(10, 14, 39, 0.5);
    border-radius: 12px;
}

.kyc-icon {
    width: 55px;
    height: 55px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #fff;
    flex-shrink: 0;
}

.kyc-icon.success {
    background: linear-gradient(135deg, #10b981, #059669);
}

.kyc-icon.warning {
    background: linear-gradient(135deg, #f59e0b, #d97706);
}

.kyc-icon.danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
}

.kyc-icon.neutral {
    background: linear-gradient(135deg, #6b7280, #4b5563);
}

.kyc-info h4 {
    margin: 0;
    font-size: 1rem;
}

.kyc-info p {
    margin: 0.25rem 0 0;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.85rem;
}

.btn-primary-gradient {
    background: linear-gradient(135deg, #8b5cf6, #d946ef);
    border: none;
    color: #fff;
    padding: 0.7rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
}

.btn-primary-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}
</style>
