<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { LoadingBarApi } from 'naive-ui'
import { useAppStore } from './stores/modules/app.ts'
import { useThemeStore } from './stores/modules/theme.ts'
import { useUserStore } from './stores/modules/user.ts'
import { useRoute } from 'vue-router'
import { useLoadingBar } from './hooks/useLoadingBar.ts'
import AdminLayout from './components/layout/AdminLayout.vue'
import LoadingOverlay from './components/layout/LoadingOverlay.vue'

const appStore = useAppStore()
const themeStore = useThemeStore()
const userStore = useUserStore()
const route = useRoute()
const { setLoadingBar } = useLoadingBar()

// 应用初始化状态
const isAppInitialized = ref(false)

// 判断是否显示管理后台布局
const showAdminLayout = computed(() => {
  // 如果应用还未初始化完成，不显示任何布局
  if (!isAppInitialized.value) {
    return false
  }
  
  const noLayoutRoutes = ['/login', '/404']
  const isNoLayoutRoute = noLayoutRoutes.includes(route.path)
  
  // 如果是登录页面，直接返回false
  if (isNoLayoutRoute) {
    return false
  }
  
  // 如果用户未登录，也不显示管理后台布局
  if (!userStore.isUserDataValid) {
    return false
  }
  
  return true
})

// 判断是否显示路由视图（登录页面等）
const showRouterView = computed(() => {
  if (!isAppInitialized.value) {
    return false
  }
  
  const noLayoutRoutes = ['/login', '/404']
  return noLayoutRoutes.includes(route.path)
})

// 主题配置
const currentTheme = computed(() => themeStore.currentTheme)
const themeOverrides = computed(() => themeStore.themeOverrides)

// loading bar实例引用
const loadingBarInstRef = ref<LoadingBarApi | null>(null)

// 监听loading bar实例
watch(
  loadingBarInstRef,
  (inst: LoadingBarApi | null) => {
    if (inst) {
      setLoadingBar(inst)
      // Loading bar实例已设置
    }
  },
  { immediate: true },
)

// 初始化应用
onMounted(async () => {
  try {
    // 初始化应用设置
    appStore.initSettings()
    themeStore.initSettings()
    
    // 等待一个tick确保store完全初始化
    await new Promise(resolve => setTimeout(resolve, 0))
    
    // 标记应用已初始化
    isAppInitialized.value = true
  } catch (error) {
    console.error('App initialization failed:', error)
    // 即使初始化失败，也要标记为已初始化，避免无限加载
    isAppInitialized.value = true
  }
})
</script>

<template>
  <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
    <n-loading-bar-provider ref="loadingBarInstRef">
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <!-- 应用初始化加载遮罩 -->
            <LoadingOverlay v-if="!isAppInitialized" />
            
            <!-- 路由加载遮罩 -->
            <LoadingOverlay v-else-if="appStore.isRouteLoading" />

            <!-- 根据路由显示不同布局 -->
            <AdminLayout v-else-if="showAdminLayout" />
            <router-view v-else-if="showRouterView" />
            
            <!-- 如果都不匹配，显示加载状态 -->
            <LoadingOverlay v-else />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
/* 全局样式已在main.css中定义 */

/* 页面动画样式 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.3s ease;
}

.page-slide-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.page-slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.page-zoom-enter-active,
.page-zoom-leave-active {
  transition: all 0.3s ease;
}

.page-zoom-enter-from {
  transform: scale(0.95);
  opacity: 0;
}

.page-zoom-leave-to {
  transform: scale(1.05);
  opacity: 0;
}

.page-flip-enter-active,
.page-flip-leave-active {
  transition: all 0.4s ease;
}

.page-flip-enter-from {
  transform: rotateY(-90deg);
  opacity: 0;
}

.page-flip-leave-to {
  transform: rotateY(90deg);
  opacity: 0;
}
</style>
