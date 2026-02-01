<template>
    <div class="p-3 container text-center">
        <h1>Bonjour {{ user.given_name }}</h1>
    </div>
</template>

<script setup>
    const { user } = useAuth();

    definePageMeta({
        middleware: 'auth'
    })
</script>