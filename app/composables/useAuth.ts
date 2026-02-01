export const useAuth = () => {
    const { data: auth, refresh, status } = useFetch('/api/auth/me', {
        lazy: true,
        server: false,
    })

    const { data: permissionData } = useFetch('/api/user/permission', {
        lazy: true,
        server: false,
    })

    const isAuthenticated = computed(() => auth.value?.authenticated ?? false)
    const user = computed(() => auth.value?.user ?? null)
    const permission = computed(() => permissionData.value?.permission || null)

    return {
        isAuthenticated,
        user,
        refresh,
        permission,
        status
    }
}
