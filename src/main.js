import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Define the global variable
app.provide('API_SERVER', 'http://localhost:3000')

app.use(createPinia())
app.use(router)

app.mount('#app')
