<template>
    <div class="app-wrapper">
        <header class="main-header">
            <nav class="navbar navbar-expand-lg">
                <div class="container">
                    <nuxt-link to="/" class="navbar-brand">
                        <div class="brand-logo">
                            <span class="logo-icon">🃏</span>
                            <span class="logo-text">BlockCheh</span>
                        </div>
                    </nuxt-link>
                    
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto align-items-center">
                            <li class="nav-item">
                                <nuxt-link to="/docs" class="nav-link">Documentation</nuxt-link>
                            </li>
                            <li class="nav-item">
                                <a href="#features" class="nav-link">Fonctionnalités</a>
                            </li>
                            <li class="nav-item">
                                <a href="#about" class="nav-link">À propos</a>
                            </li>
                            <li class="nav-item ms-3">
                                <nuxt-link to="/api/auth/login" external v-if="!isAuthenticated">
                                    <button class="btn btn-gradient">Se connecter</button>
                                </nuxt-link>
                                <div v-else class="dropdown">
                                    <button
                                        class="btn btn-link p-0 dropdown-toggle"
                                        type="button"
                                        id="userDropdown"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <div class="avatar-circle">
                                            <img v-if="user?.picture" :src="user.picture" :alt="user?.given_name || 'User'" class="avatar-img" />
                                            <span v-else>{{ user?.given_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U' }}</span>
                                        </div>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                        <li>
                                            <h6 class="dropdown-header">{{ user?.given_name }} {{ user?.family_name }}</h6>
                                        </li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li>
                                            <nuxt-link to="/dashboard" class="dropdown-item">
                                                <i class="bi bi-speedometer2 me-2"></i>Dashboard
                                            </nuxt-link>
                                        </li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li>
                                            <nuxt-link to="/api/auth/logout" external class="dropdown-item text-danger">
                                                <i class="bi bi-box-arrow-right me-2"></i>Se déconnecter
                                            </nuxt-link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>

        <main class="main-content">
            <NuxtPage />
        </main>

        <footer class="main-footer">
            <div class="container">
                <div class="row py-5">
                    <div class="col-md-4 mb-4">
                        <div class="footer-brand mb-3">
                            <span class="logo-icon">🃏</span>
                            <span class="logo-text">BlockCheh</span>
                        </div>
                        <p class="footer-description">
                            Plateforme de gestion d'actifs réels spécialisée dans le Tarot de collection, construite sur le XRP Ledger.
                        </p>
                    </div>
                    <div class="col-md-2 mb-4">
                        <h5 class="footer-title">Produit</h5>
                        <ul class="footer-links">
                            <li><a href="#features">Fonctionnalités</a></li>
                            <li><a href="#">Marketplace</a></li>
                            <li><a href="#">Collection</a></li>
                        </ul>
                    </div>
                    <div class="col-md-2 mb-4">
                        <h5 class="footer-title">Ressources</h5>
                        <ul class="footer-links">
                            <li><nuxt-link to="/docs">Documentation</nuxt-link></li>
                            <li><a href="#">API</a></li>
                            <li><a href="#">Support</a></li>
                        </ul>
                    </div>
                    <div class="col-md-2 mb-4">
                        <h5 class="footer-title">Légal</h5>
                        <ul class="footer-links">
                            <li><a href="#">CGU</a></li>
                            <li><a href="#">Confidentialité</a></li>
                            <li><a href="#">Mentions légales</a></li>
                        </ul>
                    </div>
                    <div class="col-md-2 mb-4">
                        <h5 class="footer-title">Suivez-nous</h5>
                        <div class="social-links">
                            <a href="#" class="social-link"><i class="bi bi-twitter"></i></a>
                            <a href="#" class="social-link"><i class="bi bi-discord"></i></a>
                            <a href="#" class="social-link"><i class="bi bi-github"></i></a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom py-3">
                    <p class="text-center mb-0">&copy; 2026 BlockCheh. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.app-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%);
    color: #fff;
}

.main-header {
    background: rgba(10, 14, 39, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
}

.navbar {
    padding: 1rem 0;
}

.brand-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    transition: all 0.3s ease;
}

.logo-icon {
    font-size: 2rem;
    filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.logo-text {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.navbar-brand:hover .logo-icon {
    transform: scale(1.1) rotate(5deg);
}

.nav-link {
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #8b5cf6, #d946ef);
    transition: width 0.3s ease;
}

.nav-link:hover {
    color: #fff;
}

.nav-link:hover::after {
    width: 80%;
}

.btn-gradient {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    border: none;
    color: white;
    padding: 0.6rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.btn-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
    color: white;
}

.avatar-circle {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
    border: 2px solid rgba(139, 92, 246, 0.5);
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-circle:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
}

.dropdown-toggle::after {
    display: none;
}

.dropdown-menu {
    background: rgba(26, 31, 58, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    margin-top: 0.5rem;
}

.dropdown-item {
    color: rgba(255, 255, 255, 0.8);
    padding: 0.7rem 1.2rem;
    transition: all 0.3s ease;
}

.dropdown-item:hover {
    background: rgba(139, 92, 246, 0.2);
    color: #fff;
}

.dropdown-header {
    color: #fff;
    font-weight: 600;
}

.main-content {
    flex: 1;
}

.main-footer {
    background: rgba(10, 14, 39, 0.95);
    border-top: 1px solid rgba(139, 92, 246, 0.2);
    margin-top: 4rem;
}

.footer-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 700;
}

.footer-description {
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
}

.footer-title {
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.footer-links {
    list-style: none;
    padding: 0;
}

.footer-links li {
    margin-bottom: 0.5rem;
}

.footer-links a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: all 0.3s ease;
}

.footer-links a:hover {
    color: #8b5cf6;
    padding-left: 5px;
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-link {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8b5cf6;
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-link:hover {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    color: white;
    transform: translateY(-3px);
}

.footer-bottom {
    border-top: 1px solid rgba(139, 92, 246, 0.2);
    color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
    .navbar-nav {
        text-align: center;
        padding-top: 1rem;
    }
    
    .nav-item {
        margin: 0.5rem 0;
    }
}
</style>

<script setup>
    const { isAuthenticated, user } = useAuth();

    // Debug pour voir la structure de l'objet user
    watchEffect(() => {
        if (user.value) {
            console.log('User object:', user.value);
        }
    });
</script>