// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css'
  ],

  vite: {
    optimizeDeps: {
      exclude: ['@prisma/client', '@prisma/adapter-pg']
    }
  },

  nitro: {
    preset: process.env.VERCEL ? 'vercel' : 'node-server',
    experimental: {
      wasm: true,
    }
  },
  modules: [
    '@nuxt/eslint'
  ],
  eslint: {
    config: {
      stylistic: {
        indent: 4,
        semi: true, // Enable semicolons
        quotes: 'single'
      }
    }
  }
})