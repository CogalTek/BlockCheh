<template>
  <div class="error-page">
    <h1>Error {{ error?.statusCode }}</h1>
    <p>{{ error?.message || 'An error occurred' }}</p>
    <button @click="handleError">Go Home</button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
</style>
