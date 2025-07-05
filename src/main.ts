import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { setupStore } from '@/stores'
import { useUserStore } from './stores/modules/user.ts'

// 导入Naive UI样式
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

const app = createApp(App)

setupStore(app)

app.use(router)

// 初始化用户状态
const userStore = useUserStore()
userStore.initUserState()

app.mount('#app')
