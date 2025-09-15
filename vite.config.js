
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueTwymx',
      fileName: (format) => `@twymai/vue-twymx.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'axios'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          axios: 'axios'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'styles.css') {
            return 'styles.css'
          }
          if (assetInfo.name?.endsWith('.vue')) {
            return 'components/[name].[ext]'
          }
          return '[name].[ext]'
        }
      }
    },
    copyPublicDir: false,
    sourcemap: false
  }
})
