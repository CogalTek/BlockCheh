export default defineNuxtRouteMiddleware(async (to, from) => {
    const { isAuthenticated, refresh, status } = useAuth();

    // Si les données ne sont pas encore chargées, attendre
    if (status.value === 'idle') {
        await refresh();
    }

    // Attendre que le chargement soit terminé
    while (status.value === 'pending') {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    if (!isAuthenticated.value) {
        return navigateTo('/api/auth/login');
    }
})