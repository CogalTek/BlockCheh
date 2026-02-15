<template>
    <div class="home-page">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6 mb-5 mb-lg-0">
                        <div class="hero-content">
                            <span class="badge-tag">🔗 Propulsé par XRP Ledger</span>
                            <h1 class="hero-title">
                                Transformez vos <span class="gradient-text">Tarots de collection</span> en actifs numériques
                            </h1>
                            <p class="hero-description">
                                BlockCheh révolutionne la gestion d'actifs réels en permettant la tokenisation, 
                                le fractionnement et l'échange sécurisé de pièces historiques uniques du Tarot.
                            </p>
                            <div class="hero-actions">
                                <nuxt-link to="/api/auth/login" external>
                                    <button class="btn btn-primary-gradient btn-lg">
                                        Commencer maintenant
                                        <i class="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </nuxt-link>
                                <a href="#features" class="btn btn-outline-light btn-lg">
                                    En savoir plus
                                </a>
                            </div>
                            <div class="hero-stats">
                                <div class="stat-item">
                                    <div class="stat-number">500+</div>
                                    <div class="stat-label">Cartes tokenisées</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-number">1M+</div>
                                    <div class="stat-label">Volume échangé</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-number">2K+</div>
                                    <div class="stat-label">Collectionneurs</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="hero-illustration">
                            <div class="floating-card card-1">🃏</div>
                            <div class="floating-card card-2">🎴</div>
                            <div class="floating-card card-3">🔮</div>
                            <div class="glow-effect"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="features-section">
            <div class="container">
                <div class="section-header text-center mb-5">
                    <span class="section-tag">Fonctionnalités</span>
                    <h2 class="section-title">Une plateforme complète pour vos actifs</h2>
                    <p class="section-description">
                        Découvrez comment BlockCheh simplifie la gestion et l'investissement dans le Tarot de collection
                    </p>
                </div>
                <div class="row g-4">
                    <div class="col-md-6 col-lg-4">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="bi bi-shield-check"></i>
                            </div>
                            <h3>Sécurité blockchain</h3>
                            <p>Chaque carte est authentifiée et sécurisée sur le XRP Ledger, garantissant traçabilité et transparence.</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="bi bi-pie-chart"></i>
                            </div>
                            <h3>Investissement fractionné</h3>
                            <p>Investissez dans des pièces rares en achetant des fractions, rendant l'investissement accessible à tous.</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="bi bi-arrow-left-right"></i>
                            </div>
                            <h3>Échanges instantanés</h3>
                            <p>Achetez et vendez vos actifs en quelques secondes grâce à notre marketplace intégrée.</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="bi bi-graph-up"></i>
                            </div>
                            <h3>Valorisation en temps réel</h3>
                            <p>Suivez la valeur de vos actifs avec des données de marché actualisées en temps réel.</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="bi bi-collection"></i>
                            </div>
                            <h3>Collection digitale</h3>
                            <p>Gérez votre collection dans un portfolio numérique élégant et facile d'utilisation.</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="bi bi-people"></i>
                            </div>
                            <h3>Communauté active</h3>
                            <p>Rejoignez une communauté passionnée de collectionneurs et d'investisseurs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6 mb-5 mb-lg-0">
                        <div class="about-image">
                            <div class="image-wrapper">
                                <div class="blockchain-illustration">⛓️</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="about-content">
                            <span class="section-tag">À propos</span>
                            <h2 class="section-title">La blockchain au service du patrimoine</h2>
                            <p class="section-description">
                                BlockCheh est né de la volonté de démocratiser l'accès aux pièces historiques du Tarot 
                                tout en préservant leur authenticité et leur valeur patrimoniale.
                            </p>
                            <div class="about-features">
                                <div class="about-feature-item">
                                    <i class="bi bi-check-circle-fill"></i>
                                    <span>Authentification certifiée de chaque pièce</span>
                                </div>
                                <div class="about-feature-item">
                                    <i class="bi bi-check-circle-fill"></i>
                                    <span>Conservation physique sécurisée</span>
                                </div>
                                <div class="about-feature-item">
                                    <i class="bi bi-check-circle-fill"></i>
                                    <span>Transparence totale des transactions</span>
                                </div>
                                <div class="about-feature-item">
                                    <i class="bi bi-check-circle-fill"></i>
                                    <span>Conforme aux réglementations RWA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <div class="container">
                <div class="cta-card">
                    <h2>Prêt à commencer votre collection ?</h2>
                    <p>Rejoignez BlockCheh dès aujourd'hui et découvrez une nouvelle façon d'investir dans le Tarot de collection.</p>
                    <nuxt-link to="/api/auth/login" external>
                        <button class="btn btn-light btn-lg">
                            Créer mon compte
                            <i class="bi bi-arrow-right ms-2"></i>
                        </button>
                    </nuxt-link>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.home-page {
    overflow-x: hidden;
}

/* Hero Section */
.hero-section {
    padding: 6rem 0;
    position: relative;
}

.badge-tag {
    display: inline-block;
    padding: 0.5rem 1.2rem;
    background: rgba(139, 92, 246, 0.2);
    border: 1px solid rgba(139, 92, 246, 0.4);
    border-radius: 50px;
    color: #d946ef;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    color: #fff;
}

.gradient-text {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-description {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2rem;
    line-height: 1.8;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.btn-primary-gradient {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    border: none;
    color: white;
    padding: 0.9rem 2rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.btn-primary-gradient:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(139, 92, 246, 0.6);
}

.btn-outline-light {
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.9rem 2rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-outline-light:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #fff;
    color: white;
}

.hero-stats {
    display: flex;
    gap: 3rem;
    flex-wrap: wrap;
}

.stat-item {
    text-align: left;
}

.stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #8b5cf6;
    margin-bottom: 0.3rem;
}

.stat-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
}

.hero-illustration {
    position: relative;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.floating-card {
    position: absolute;
    font-size: 8rem;
    animation: float 3s ease-in-out infinite;
    filter: drop-shadow(0 10px 30px rgba(139, 92, 246, 0.5));
}

.card-1 {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
}

.card-2 {
    top: 40%;
    right: 15%;
    animation-delay: 1s;
}

.card-3 {
    bottom: 15%;
    left: 30%;
    animation-delay: 2s;
}

.glow-effect {
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    animation: glow 4s ease-in-out infinite;
}

@keyframes glow {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 0.8; }
}

/* Features Section */
.features-section {
    padding: 6rem 0;
    background: rgba(26, 31, 58, 0.5);
}

.section-tag {
    display: inline-block;
    padding: 0.4rem 1rem;
    background: rgba(139, 92, 246, 0.2);
    border-radius: 50px;
    color: #8b5cf6;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1rem;
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 1rem;
}

.section-description {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.6);
    max-width: 600px;
    margin: 0 auto;
}

.feature-card {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    padding: 2rem;
    height: 100%;
    transition: all 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-10px);
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
}

.feature-icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
    margin-bottom: 1.5rem;
}

.feature-card h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 1rem;
}

.feature-card p {
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin: 0;
}

/* About Section */
.about-section {
    padding: 6rem 0;
}

.about-image {
    position: relative;
}

.image-wrapper {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 24px;
    padding: 4rem;
    text-align: center;
}

.blockchain-illustration {
    font-size: 12rem;
    filter: drop-shadow(0 10px 30px rgba(139, 92, 246, 0.5));
    animation: float 3s ease-in-out infinite;
}

.about-content {
    padding-left: 2rem;
}

.about-features {
    margin-top: 2rem;
}

.about-feature-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.05rem;
}

.about-feature-item i {
    color: #8b5cf6;
    font-size: 1.3rem;
}

/* CTA Section */
.cta-section {
    padding: 6rem 0;
}

.cta-card {
    background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
    border-radius: 24px;
    padding: 4rem;
    text-align: center;
    box-shadow: 0 20px 60px rgba(139, 92, 246, 0.4);
}

.cta-card h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
}

.cta-card p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.cta-card .btn-light {
    background: white;
    color: #8b5cf6;
    border: none;
    padding: 0.9rem 2rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.cta-card .btn-light:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
    color: #8b5cf6;
}

/* Responsive */
@media (max-width: 992px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-illustration {
        height: 300px;
    }
    
    .floating-card {
        font-size: 5rem;
    }
    
    .about-content {
        padding-left: 0;
        margin-top: 2rem;
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .hero-actions {
        flex-direction: column;
    }
    
    .hero-actions .btn {
        width: 100%;
    }
    
    .cta-card {
        padding: 2rem;
    }
    
    .cta-card h2 {
        font-size: 1.8rem;
    }
}
</style>

<script setup>
    definePageMeta({
        layout: 'custom'
    })
</script>