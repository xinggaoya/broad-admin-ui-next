import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'

// 导入Naive UI样式
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化用户状态
const userStore = useUserStore()
userStore.initUserState()

app.mount('#app')
