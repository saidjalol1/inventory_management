// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  router: {
    middleware: ['auth']
  },
  head: {
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.min.js', defer: true }
    ]
  },
  alias : {
    "@": resolve(__dirname, "/"),
    "config": resolve(__dirname,"config.js")
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
