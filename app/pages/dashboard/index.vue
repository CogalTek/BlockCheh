<template>
    <div class="dashboard-page">
        <div class="container-fluid px-4 py-4">
            <!-- Header -->
            <div class="dashboard-header mb-4">
                <div>
                    <h1 class="page-title">Bonjour, {{ user?.given_name || 'Collectionneur' }} 👋</h1>
                    <p class="page-subtitle">Voici un aperçu de votre portfolio BlockCheh</p>
                </div>
                <button class="btn btn-primary-gradient">
                    <i class="bi bi-plus-circle me-2"></i>Ajouter un actif
                </button>
            </div>

            <!-- Stats Cards -->
            <div class="row g-4 mb-4">
                <div class="col-md-6 col-xl-3">
                    <div class="stat-card">
                        <div class="stat-icon purple">
                            <i class="bi bi-wallet2"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-label">Valeur totale</div>
                            <div class="stat-value">42,85 XRP ({{ (42.85 * xrplPrice).toFixed(2) }}€)</div>
                            <div class="stat-change positive">
                                <i class="bi bi-arrow-up"></i> +12.5%
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
                            <div class="stat-label">Actifs détenus</div>
                            <div class="stat-value">24</div>
                            <div class="stat-change neutral">
                                <i class="bi bi-dash"></i> Aucun changement
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
                            <div class="stat-label">Rendement</div>
                            <div class="stat-value">+18.7%</div>
                            <div class="stat-change positive">
                                <i class="bi bi-arrow-up"></i> +3.2% ce mois
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
                            <div class="stat-label">Dernière transaction</div>
                            <div class="stat-value">Il y a 2h</div>
                            <div class="stat-change neutral">
                                <i class="bi bi-arrow-repeat"></i> Achat
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <!-- Portfolio Chart -->
                <div class="col-xl-8">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title">Évolution du portfolio</h3>
                            <div class="time-filters">
                                <button class="time-filter">1J</button>
                                <button class="time-filter">1S</button>
                                <button class="time-filter active">1M</button>
                                <button class="time-filter">3M</button>
                                <button class="time-filter">1A</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="chart-placeholder">
                                <canvas id="portfolioChart"></canvas>
                                <div class="chart-overlay">
                                    <i class="bi bi-graph-up-arrow"></i>
                                    <p>Graphique d'évolution du portfolio</p>
                                    <small>Intégration avec Chart.js à venir</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions & Stats -->
                <div class="col-xl-4">
                    <div class="dashboard-card mb-4">
                        <div class="card-header">
                            <h3 class="card-title">Actions rapides</h3>
                        </div>
                        <div class="card-body">
                            <div class="quick-actions">
                                <button class="quick-action-btn">
                                    <i class="bi bi-box-arrow-in-down"></i>
                                    <span>Acheter</span>
                                </button>
                                <button class="quick-action-btn">
                                    <i class="bi bi-box-arrow-up"></i>
                                    <span>Vendre</span>
                                </button>
                                <button class="quick-action-btn">
                                    <i class="bi bi-arrow-left-right"></i>
                                    <span>Échanger</span>
                                </button>
                                <button class="quick-action-btn">
                                    <i class="bi bi-send"></i>
                                    <span>Transférer</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="dashboard-card" style="margin-bottom: 0;">
                        <div class="card-header">
                            <h3 class="card-title">Distribution</h3>
                        </div>
                        <div class="card-body">
                            <div class="distribution-chart">
                                <div class="donut-placeholder">🥧</div>
                                <div class="distribution-legend">
                                    <div class="legend-item">
                                        <span class="legend-dot purple"></span>
                                        <span class="legend-label">Tarot historiques</span>
                                        <span class="legend-value">45%</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-dot pink"></span>
                                        <span class="legend-label">Éditions limitées</span>
                                        <span class="legend-value">30%</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-dot blue"></span>
                                        <span class="legend-label">Modernes</span>
                                        <span class="legend-value">15%</span>
                                    </div>
                                    <div class="legend-item">
                                        <span class="legend-dot orange"></span>
                                        <span class="legend-label">Autres</span>
                                        <span class="legend-value">10%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <!-- Assets List -->
                <div class="col-xl-8">
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3 class="card-title">Mes actifs</h3>
                            <nuxt-link to="#" class="view-all-link">Voir tout <i class="bi bi-arrow-right"></i></nuxt-link>
                        </div>
                        <div class="card-body p-0">
                            <div class="assets-table">
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Actif</th>
                                                <th>Type</th>
                                                <th>Quantité</th>
                                                <th>Prix d'achat</th>
                                                <th>Valeur actuelle</th>
                                                <th>Performance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="asset in sampleAssets" :key="asset.id" class="asset-row">
                                                <td>
                                                    <div class="asset-info">
                                                        <div class="asset-icon">{{ asset.icon }}</div>
                                                        <div>
                                                            <div class="asset-name">{{ asset.name }}</div>
                                                            <div class="asset-id">{{ asset.id }}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span class="badge-type">{{ asset.type }}</span></td>
                                                <td>{{ asset.quantity }}</td>
                                                <td>{{ asset.buyPrice }} XRP</td>
                                                <td>{{ asset.currentValue }} XRP</td>
                                                <td>
                                                    <span :class="['performance-badge', asset.performance > 0 ? 'positive' : 'negative']">
                                                        <i :class="asset.performance > 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                                                        {{ Math.abs(asset.performance) }}%
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
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
                                <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                                    <div :class="['activity-icon', activity.type]">
                                        <i :class="activity.iconClass"></i>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-title">{{ activity.title }}</div>
                                        <div class="activity-time">{{ activity.time }}</div>
                                    </div>
                                    <div class="activity-amount" :class="activity.type">
                                        {{ activity.amount }}
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

.row > [class*="col-"] .dashboard-card {
    margin-bottom: 0;
}

.row.g-4 {
    margin-bottom: 1.5rem;
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

.view-all-link {
    color: #8b5cf6;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
}

.view-all-link:hover {
    color: #d946ef;
    gap: 0.5rem;
}

.card-body {
    padding: 1.5rem;
}

/* Time Filters */
.time-filters {
    display: flex;
    gap: 0.5rem;
}

.time-filter {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: rgba(255, 255, 255, 0.6);
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.time-filter:hover,
.time-filter.active {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    border-color: transparent;
    color: white;
}

/* Chart Placeholder */
.chart-placeholder {
    height: 300px;
    position: relative;
    background: rgba(10, 14, 39, 0.5);
    border-radius: 12px;
    overflow: hidden;
}

#portfolioChart {
    width: 100%;
    height: 100%;
}

.chart-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.4);
}

.chart-overlay i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #8b5cf6;
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
}

.quick-action-btn:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
    transform: translateY(-3px);
}

.quick-action-btn i {
    font-size: 1.5rem;
    color: #8b5cf6;
}

/* Distribution Chart */
.distribution-chart {
    text-align: center;
    padding: 1rem 0;
}

.donut-placeholder {
    font-size: 5rem;
    margin: 1rem 0;
    filter: drop-shadow(0 5px 15px rgba(139, 92, 246, 0.3));
}

.distribution-legend {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 0 0.5rem;
    margin-top: 1rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
}

.legend-dot.purple {
    background: #8b5cf6;
}

.legend-dot.pink {
    background: #d946ef;
}

.legend-dot.blue {
    background: #3b82f6;
}

.legend-dot.orange {
    background: #f59e0b;
}

.legend-label {
    flex: 1;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
}

.legend-value {
    color: #fff;
    font-weight: 600;
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

.performance-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.85rem;
}

.performance-badge.positive {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.performance-badge.negative {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
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

/* Responsive */
@media (max-width: 1200px) {
    .chart-placeholder {
        height: 250px;
    }
    
    .dashboard-card {
        margin-bottom: 1.5rem;
    }
}

@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .page-title {
        font-size: 1.5rem;
    }

    .btn-primary-gradient {
        width: 100%;
    }

    .quick-actions {
        grid-template-columns: 1fr;
    }

    .time-filters {
        flex-wrap: wrap;
    }

    .assets-table {
        font-size: 0.85rem;
    }

    .table thead th,
    .table tbody td {
        padding: 0.8rem;
    }
}
</style>

<script setup>
const { user } = useAuth();
const { getXrplPrice } = useXrpl();

const xrplPrice = ref(0);

onMounted(async () => {
    xrplPrice.value = await getXrplPrice();
});

definePageMeta({
    middleware: 'auth'
})

// Sample data for demonstration
const sampleAssets = [
    {
        id: 'TRT-001',
        name: 'Le Mat - Marseille 1760',
        icon: '🃏',
        type: 'Historique',
        quantity: '0.25',
        buyPrice: '2,500',
        currentValue: '3,200',
        performance: 28.0
    },
    {
        id: 'TRT-042',
        name: 'L\'Étoile - Visconti',
        icon: '⭐',
        type: 'Édition limitée',
        quantity: '1.00',
        buyPrice: '5,800',
        currentValue: '6,400',
        performance: 10.3
    },
    {
        id: 'TRT-078',
        name: 'La Lune - Rider-Waite',
        icon: '🌙',
        type: 'Moderne',
        quantity: '0.50',
        buyPrice: '1,200',
        currentValue: '1,150',
        performance: -4.2
    },
    {
        id: 'TRT-021',
        name: 'Le Monde - Thoth',
        icon: '🌍',
        type: 'Historique',
        quantity: '0.75',
        buyPrice: '4,100',
        currentValue: '4,850',
        performance: 18.3
    }
];

const recentActivities = [
    {
        id: 1,
        type: 'buy',
        iconClass: 'bi bi-box-arrow-in-down',
        title: 'Achat de L\'Étoile - Visconti',
        time: 'Il y a 2 heures',
        amount: '+1.00'
    },
    {
        id: 2,
        type: 'sell',
        iconClass: 'bi bi-box-arrow-up',
        title: 'Vente de Le Soleil',
        time: 'Il y a 1 jour',
        amount: '-0.50'
    },
    {
        id: 3,
        type: 'transfer',
        iconClass: 'bi bi-arrow-left-right',
        title: 'Transfert vers wallet externe',
        time: 'Il y a 2 jours',
        amount: '1,500 XRP'
    },
    {
        id: 4,
        type: 'buy',
        iconClass: 'bi bi-box-arrow-in-down',
        title: 'Achat de La Lune',
        time: 'Il y a 3 jours',
        amount: '+0.50'
    },
    {
        id: 5,
        type: 'buy',
        iconClass: 'bi bi-box-arrow-in-down',
        title: 'Achat de Le Mat',
        time: 'Il y a 5 jours',
        amount: '+0.25'
    }
];
</script>