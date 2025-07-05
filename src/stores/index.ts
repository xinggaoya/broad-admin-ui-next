import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const setupStore = (app: App) => {
  const pinia = createPinia()
  // 配置持久化存储插件
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
