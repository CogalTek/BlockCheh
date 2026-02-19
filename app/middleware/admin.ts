export default defineNuxtRouteMiddleware(async (to, from) => {
    const { isAuthenticated, permission, refresh, status } = useAuth();

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

    // Attendre que la permission soit chargée
    let attempts = 0;
    while (permission.value === null && attempts < 40) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }

    if (permission.value !== 'ADMIN' && permission.value !== 'SUPERADMIN') {
        return navigateTo('/error?code=401');
    }
})