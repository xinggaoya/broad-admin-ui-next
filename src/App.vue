<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { darkTheme, type GlobalThemeOverrides } from 'naive-ui'
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const appStore = useAppStore()
const route = useRoute()

// 判断是否显示管理后台布局
const showAdminLayout = computed(() => {
  const noLayoutRoutes = ['/login', '/404']
  return !noLayoutRoutes.includes(route.path)
})

// 主题状态
const isDark = computed(() => appStore.isDark)
const themeColors = computed(() => appStore.themeColors)

// 当前主题
const currentTheme = computed(() => (isDark.value ? darkTheme : null))

// 自定义主题覆盖配置
const themeOverrides = computed<GlobalThemeOverrides>(() => {
  const colors = themeColors.value

  return {
    common: {
      primaryColor: colors.primary,
      primaryColorHover: lightenColor(colors.primary, 0.1),
      primaryColorPressed: darkenColor(colors.primary, 0.1),
      primaryColorSuppl: colors.primary,

      infoColor: colors.info,
      infoColorHover: lightenColor(colors.info, 0.1),
      infoColorPressed: darkenColor(colors.info, 0.1),
      infoColorSuppl: colors.info,

      successColor: colors.success,
      successColorHover: lightenColor(colors.success, 0.1),
      successColorPressed: darkenColor(colors.success, 0.1),
      successColorSuppl: colors.success,

      warningColor: colors.warning,
      warningColorHover: lightenColor(colors.warning, 0.1),
      warningColorPressed: darkenColor(colors.warning, 0.1),
      warningColorSuppl: colors.warning,

      errorColor: colors.error,
      errorColorHover: lightenColor(colors.error, 0.1),
      errorColorPressed: darkenColor(colors.error, 0.1),
      errorColorSuppl: colors.error,

      // 边框和背景色
      borderRadius: '6px',
      borderRadiusSmall: '4px',

      // 字体
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSizeMini: '12px',
      fontSizeTiny: '12px',
      fontSizeSmall: '14px',
      fontSizeMedium: '14px',
      fontSizeLarge: '15px',
      fontSizeHuge: '16px',
    },
    Button: {
      borderRadiusMedium: '6px',
      borderRadiusSmall: '4px',
      borderRadiusLarge: '8px',
    },
    Card: {
      borderRadius: '8px',
      paddingMedium: '16px',
      paddingLarge: '20px',
      paddingSmall: '12px',
    },
    Input: {
      borderRadius: '6px',
    },
    Select: {
      peers: {
        InternalSelection: {
          borderRadius: '6px',
        },
      },
    },
    Menu: {
      borderRadius: '6px',
      itemBorderRadius: '6px',
    },
    Layout: {
      siderBorderColor: isDark.value ? '#2c2c32' : '#e8e8e8',
    },
  }
})

// 颜色工具函数
const lightenColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  const newR = Math.min(255, Math.round(r + (255 - r) * amount))
  const newG = Math.min(255, Math.round(g + (255 - g) * amount))
  const newB = Math.min(255, Math.round(b + (255 - b) * amount))

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

const darkenColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  const newR = Math.max(0, Math.round(r * (1 - amount)))
  const newG = Math.max(0, Math.round(g * (1 - amount)))
  const newB = Math.max(0, Math.round(b * (1 - amount)))

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// 初始化应用
onMounted(() => {
  appStore.initSettings()
})

// 监听主题变化并保存
watch(
  () => appStore.isDark,
  () => {
    appStore.saveSettings()
  },
)

// 监听主题颜色变化
watch(
  () => appStore.themeColors,
  () => {
    appStore.saveSettings()
  },
  { deep: true },
)
</script>

<template>
  <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <!-- 根据路由显示不同布局 -->
            <AdminLayout v-if="showAdminLayout" />
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
