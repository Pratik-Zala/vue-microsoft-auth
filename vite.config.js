
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue({
      isProduction: true,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueTwymx',
      fileName: (format) => `@twymai/vue-twymx.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'axios'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          axios: 'axios'
        },
        exports: 'named'
      }
    },
    copyPublicDir: false,
    sourcemap: false,
    minify: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
