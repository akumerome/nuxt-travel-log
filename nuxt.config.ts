import tailwindcss from "@tailwindcss/vite";
import env from "./lib/env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "nuxt-auth-utils",
    "nuxt-csurf",
    "@pinia/nuxt",
    "nuxt-maplibre",
  ],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      s3BucketUrl: env.S3_BUCKET_URL
    }
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ["./docker-data/*"]
      }
    }
  },
});