export default defineNuxtRouteMiddleware((to, from) => {
    const { isAuthenticated, permission } = useAuth();
    console.log("hello")
    if (!isAuthenticated) {
        return navigateTo('/api/auth/login');
    }
    console.log("connected")
    const userPermission = permission.value;
    if (userPermission !== 'ADMIN' && userPermission !== 'SUPERADMIN') {
        return navigateTo('/error?code=401');
    }
})