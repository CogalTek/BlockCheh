<template>
    <div>
        <NuxtPage />
    </div>
</template>

<script setup>
	import { ref } from 'vue'

	const { isAuthenticated, user, refresh } = useAuth();

	const userFetched = ref(null);

	const userApply = async () => {
		userFetched.value = await $fetch('/api/user').catch(() => null);
	}
</script>