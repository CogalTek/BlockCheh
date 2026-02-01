<template>
    <div class="container text-center mt-5">
        <img v-if="query?.code" :src="`https://http.cat/${query.code}.jpg`" :alt="`Error ${query.code}`" class="img-fluid mb-4" style="max-width: 500px;">
        <h1 v-if="query?.code">Erreur {{ query.code }}</h1>
        <p v-if="query?.code === '401'" class="lead">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <p v-else class="lead">Une erreur s'est produite.</p>
        <nuxt-link to="/" class="btn btn-primary mt-3">Retour à l'accueil</nuxt-link>
    </div>
</template>

<script setup>
    const query = useRoute().query;
</script>