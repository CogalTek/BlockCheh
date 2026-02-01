<template>
    <header class="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h1>Damgwenn</h1>
        <div>
            <nuxt-link to="/api/auth/login" external v-if="!isAuthenticated">
                <button class="btn btn-primary">Se connecter</button>
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
        </div>
    </header>

    <main>
        <NuxtPage />
    </main>

    <footer>

    </footer>
</template>

<style scoped>
.avatar-circle {
    width: 5vw;
    height: 5vw;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.2s;
    overflow: hidden;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-circle:hover {
    transform: scale(1.05);
}

.dropdown-toggle::after {
    display: none;
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