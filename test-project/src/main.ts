
import { createApp } from 'vue'
import App from './App.vue'
import MicrosoftAuth, { ApiClientPlugin } from '@twymai/vue-twymx'

const app = createApp(App)

// Install API Client plugin first
app.use(ApiClientPlugin, {
  baseUrl: 'http://localhost:3000' // Your test backend URL
})

// Then install Microsoft Auth plugin
app.use(MicrosoftAuth, {
  autoRefresh: true
})

app.mount('#app')
