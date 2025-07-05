import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { setupStore } from './stores'

// 导入Naive UI样式
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

const app = createApp(App)

setupStore(app)

app.use(router)

app.mount('#app')
