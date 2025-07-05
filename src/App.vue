<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from './stores/modules/app.ts'
import { useThemeStore } from './stores/modules/theme.ts'
import { useRoute } from 'vue-router'
import AdminLayout from './components/layout/AdminLayout.vue'
import LoadingOverlay from './components/layout/LoadingOverlay.vue'

const appStore = useAppStore()
const themeStore = useThemeStore()
const route = useRoute()

// 路由加载状态
const isRouteLoading = computed(() => appStore.isRouteLoading)

// 判断是否显示管理后台布局
const showAdminLayout = computed(() => {
  const noLayoutRoutes = ['/login', '/404']
  return !noLayoutRoutes.includes(route.path)
})

// 主题配置
const currentTheme = computed(() => themeStore.currentTheme)
const themeOverrides = computed(() => themeStore.themeOverrides)

// 初始化应用
onMounted(() => {
  appStore.initSettings()
  themeStore.initSettings()
})
</script>

<template>
  <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <!-- 路由加载遮罩 -->
            <LoadingOverlay v-if="isRouteLoading" />

            <!-- 根据路由显示不同布局 -->
            <AdminLayout v-else-if="showAdminLayout" />
            <router-view v-else />
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
