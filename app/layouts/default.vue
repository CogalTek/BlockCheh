<template>
    <div class="dashboard-layout">
        <!-- Sidebar -->
        <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
            <div class="sidebar-header">
                <nuxt-link to="/" class="sidebar-brand">
                    <span class="logo-icon">🃏</span>
                    <span class="logo-text">BlockCheh</span>
                </nuxt-link>
                <button class="close-sidebar" @click="sidebarOpen = false">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <nav class="sidebar-nav">
                <nuxt-link to="/dashboard" class="nav-item" active-class="active">
                    <i class="bi bi-speedometer2"></i>
                    <span>Dashboard</span>
                </nuxt-link>
                <nuxt-link to="/dashboard/portfolio" class="nav-item" active-class="active">
                    <i class="bi bi-collection"></i>
                    <span>Mon Portfolio</span>
                </nuxt-link>
                <nuxt-link to="/dashboard/marketplace" class="nav-item" active-class="active">
                    <i class="bi bi-shop"></i>
                    <span>Marketplace</span>
                </nuxt-link>
                <nuxt-link to="/dashboard/transactions" class="nav-item" active-class="active">
                    <i class="bi bi-arrow-left-right"></i>
                    <span>Transactions</span>
                </nuxt-link>
                <nuxt-link to="/dashboard/wallet" class="nav-item" active-class="active">
                    <i class="bi bi-wallet2"></i>
                    <span>Wallet</span>
                </nuxt-link>
                <div class="nav-divider"></div>
                <nuxt-link to="/dashboard/settings" class="nav-item" active-class="active">
                    <i class="bi bi-gear"></i>
                    <span>Paramètres</span>
                </nuxt-link>
                <nuxt-link v-if="isAdmin" to="/administration" class="nav-item admin-nav" active-class="active">
                    <i class="bi bi-shield-lock"></i>
                    <span>Administration</span>
                </nuxt-link>
                <nuxt-link to="/docs" class="nav-item" active-class="active">
                    <i class="bi bi-book"></i>
                    <span>Documentation</span>
                </nuxt-link>
            </nav>

            <div class="sidebar-footer">
                <div class="user-info">
                    <div class="user-avatar">
                        <img v-if="user?.picture" :src="user.picture" :alt="user?.given_name" />
                        <span v-else>{{ user?.given_name?.[0]?.toUpperCase() || 'U' }}</span>
                    </div>
                    <div class="user-details">
                        <div class="user-name">{{ user?.given_name }} {{ user?.family_name }}</div>
                        <div class="user-email">{{ user?.email }}</div>
                    </div>
                </div>
                <nuxt-link to="/api/auth/logout" external class="logout-btn">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Déconnexion</span>
                </nuxt-link>
            </div>
        </aside>

        <!-- Mobile Overlay -->
        <div class="sidebar-overlay" :class="{ 'active': sidebarOpen }" @click="sidebarOpen = false"></div>

        <!-- Main Content -->
        <div class="main-wrapper">
            <!-- Top Bar -->
            <header class="top-bar">
                <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
                    <i class="bi bi-list"></i>
                </button>
                <div class="top-bar-actions">
                    <button class="top-bar-btn">
                        <i class="bi bi-bell"></i>
                        <span class="notification-badge">3</span>
                    </button>
                    <nuxt-link to="/" class="top-bar-btn">
                        <i class="bi bi-house"></i>
                    </nuxt-link>
                </div>
            </header>

            <main class="main-content">
                <NuxtPage />
            </main>
        </div>
    </div>
</template>

<style scoped>
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    height: 100%;
    background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
    background-attachment: fixed;
}

/* Sidebar */
.sidebar {
    width: 280px;
    background: rgba(26, 31, 58, 0.95);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(139, 92, 246, 0.2);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transition: transform 0.3s ease;
}

.sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    font-size: 1.3rem;
    font-weight: 700;
}

.logo-icon {
    font-size: 1.8rem;
    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
}

.logo-text {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.close-sidebar {
    display: none;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.3s ease;
}

.close-sidebar:hover {
    color: #fff;
}

/* Sidebar Navigation */
.sidebar-nav {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1rem;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    border-radius: 10px;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
    font-weight: 500;
}

.nav-item i {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
}

.nav-item:hover {
    background: rgba(139, 92, 246, 0.1);
    color: #fff;
    transform: translateX(5px);
}

.nav-item.active {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(217, 70, 239, 0.2) 100%);
    border-left: 3px solid #8b5cf6;
    color: #fff;
}

.nav-divider {
    height: 1px;
    background: rgba(139, 92, 246, 0.2);
    margin: 1rem 0;
}

/* Sidebar Footer */
.sidebar-footer {
    padding: 1rem;
    border-top: 1px solid rgba(139, 92, 246, 0.2);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(139, 92, 246, 0.1);
    border-radius: 10px;
    margin-bottom: 0.75rem;
}

.user-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    overflow: hidden;
    flex-shrink: 0;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-details {
    flex: 1;
    min-width: 0;
}

.user-name {
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-email {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 10px;
    color: #ef4444;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.logout-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
    color: #fff;
}

/* Sidebar Overlay (Mobile) */
.sidebar-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.sidebar-overlay.active {
    opacity: 1;
}

/* Main Wrapper */
.main-wrapper {
    flex: 1;
    margin-left: 280px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100%;
}

/* Top Bar */
.top-bar {
    height: 70px;
    background: rgba(26, 31, 58, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
}

.menu-toggle {
    display: none;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    transition: color 0.3s ease;
}

.menu-toggle:hover {
    color: #fff;
}

.top-bar-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.top-bar-btn {
    position: relative;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: rgba(255, 255, 255, 0.8);
    width: 45px;
    height: 45px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
}

.top-bar-btn:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
    color: #fff;
}

.notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 600;
    border: 2px solid rgba(26, 31, 58, 0.95);
}

/* Main Content */
.main-content {
    flex: 1;
    min-height: calc(100vh - 70px);
    height: 100%;
    background: transparent;
}

/* Responsive */
@media (max-width: 992px) {
    .sidebar {
        transform: translateX(-100%);
    }

    .sidebar.sidebar-open {
        transform: translateX(0);
    }

    .sidebar-overlay {
        display: block;
    }

    .close-sidebar {
        display: block;
    }

    .main-wrapper {
        margin-left: 0;
    }

    .menu-toggle {
        display: block;
    }

    .top-bar {
        padding: 0 1rem;
    }
}

@media (max-width: 576px) {
    .sidebar {
        width: 100%;
    }

    .user-name,
    .user-email {
        font-size: 0.85rem;
    }
}
</style>

<script setup>
import { ref } from 'vue'

const { isAuthenticated, user, permission, refresh } = useAuth();
const sidebarOpen = ref(false);

const isAdmin = computed(() => permission.value === 'ADMIN' || permission.value === 'SUPERADMIN');

const userFetched = ref(null);

const userApply = async () => {
    userFetched.value = await $fetch('/api/user').catch(() => null);
}
</script>