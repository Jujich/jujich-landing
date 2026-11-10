export default defineNuxtConfig({
  compatibilityDate: '2026-10-19',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    baseUrl: 'https://jujich.dev',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' }
    ],
    langDir: 'locales'
  },
  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#f7f7f2' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=k-olive' }]
    }
  },
  nitro: { prerender: { crawlLinks: true, routes: ['/', '/ru'] } },
  typescript: { strict: true }
})
