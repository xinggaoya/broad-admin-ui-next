import { defineStore } from 'pinia'
import { ref } from 'vue'

// 动画类型枚举
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'flip' | 'none'

// 主题颜色配置已移至 theme.ts

export const useAppStore = defineStore('app', () => {
  // 应用加载状态
  const isRouteLoading = ref(false)
  const routeLoadError = ref<string | null>(null)

  // 侧边栏状态
  const sidebarCollapsed = ref(false)
  const mobileSidebarOpen = ref(false)

  // 主题状态已移至 theme.ts

  // 动画设置
  const pageAnimation = ref<AnimationType>('fade')
  const animationDuration = ref(300)
  const enablePageAnimation = ref(true)

  // 缓存设置
  const enableKeepAlive = ref(true)
  const maxCachePages = ref(10)
  const cachedPages = ref<string[]>([])

  // 标签页状态
  const tabs = ref<
    Array<{
      key: string
      label: string
      path: string
      closable: boolean
    }>
  >([])

  const activeTab = ref('')

  // 路由加载状态管理
  const setRouteLoading = (loading: boolean) => {
    isRouteLoading.value = loading
    if (loading) {
      routeLoadError.value = null
    }
  }

  const setRouteLoadError = (error: string | null) => {
    routeLoadError.value = error
    if (error) {
      isRouteLoading.value = false
    }
  }

  // 侧边栏操作
  const toggleSidebarCollapse = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  const toggleMobileSidebar = () => {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
  }

  const closeMobileSidebar = () => {
    mobileSidebarOpen.value = false
  }

  // 主题操作已移至 theme.ts

  // 动画操作
  const setPageAnimation = (animation: AnimationType) => {
    pageAnimation.value = animation
    saveSettings()
  }

  const setAnimationDuration = (duration: number) => {
    animationDuration.value = duration
    saveSettings()
  }

  const togglePageAnimation = () => {
    enablePageAnimation.value = !enablePageAnimation.value
    saveSettings()
  }

  // 缓存操作
  const toggleKeepAlive = () => {
    enableKeepAlive.value = !enableKeepAlive.value
    if (!enableKeepAlive.value) {
      cachedPages.value = []
    }
    saveSettings()
  }

  const addCachedPage = (routeName: string) => {
    if (!enableKeepAlive.value) return

    if (!cachedPages.value.includes(routeName)) {
      cachedPages.value.push(routeName)

      // 限制缓存页面数量
      if (cachedPages.value.length > maxCachePages.value) {
        cachedPages.value.shift()
      }
    }
  }

  const removeCachedPage = (routeName: string) => {
    const index = cachedPages.value.indexOf(routeName)
    if (index > -1) {
      cachedPages.value.splice(index, 1)
    }
  }

  const clearCachedPages = () => {
    cachedPages.value = []
  }

  // 标签页操作
  const addTab = (tab: { key: string; label: string; path: string; closable?: boolean }) => {
    const existingTab = tabs.value.find((t) => t.key === tab.key)
    if (!existingTab) {
      tabs.value.push({
        ...tab,
        closable: tab.closable !== false,
      })
    }
    activeTab.value = tab.key

    // 添加到缓存
    if (tab.key !== '/dashboard') {
      addCachedPage(tab.key.replace('/', ''))
    }
  }

  const removeTab = (key: string) => {
    const index = tabs.value.findIndex((t) => t.key === key)
    if (index > -1) {
      // 先保存下一个激活的标签
      let nextActiveKey = ''
      if (activeTab.value === key && tabs.value.length > 1) {
        if (index > 0 && index < tabs.value.length) {
          // 关闭非最后一个标签，取右侧标签（现在index已经被移除，原right变为当前index）
          nextActiveKey = tabs.value[index].key
        } else {
          // 关闭最后一个标签，取左侧标签
          nextActiveKey = tabs.value[Math.max(0, index - 1)].key
        }
      }

      tabs.value.splice(index, 1)

      // 从缓存中移除
      removeCachedPage(key.replace('/', ''))

      // 更新活动标签
      if (activeTab.value === key) {
        if (tabs.value.length > 0) {
          activeTab.value = nextActiveKey
        } else {
          activeTab.value = ''
        }
      }
    }
  }

  const setActiveTab = (key: string) => {
    activeTab.value = key
  }

  const clearTabs = () => {
    tabs.value = []
    activeTab.value = ''
    clearCachedPages()
  }

  // 初始化设置
  const initSettings = () => {
    const savedSettings = localStorage.getItem('app-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        // 主题设置现在在 theme.ts 中处理
        pageAnimation.value = settings.pageAnimation || 'fade'
        animationDuration.value = settings.animationDuration || 300
        enablePageAnimation.value = settings.enablePageAnimation !== false
        enableKeepAlive.value = settings.enableKeepAlive !== false
        maxCachePages.value = settings.maxCachePages || 10
      } catch (error) {
        console.warn('Failed to parse saved settings:', error)
      }
    }
  }

  // 保存设置到localStorage
  const saveSettings = () => {
    const settings = {
      // 主题设置现在在 theme.ts 中处理
      pageAnimation: pageAnimation.value,
      animationDuration: animationDuration.value,
      enablePageAnimation: enablePageAnimation.value,
      enableKeepAlive: enableKeepAlive.value,
      maxCachePages: maxCachePages.value,
    }
    localStorage.setItem('app-settings', JSON.stringify(settings))
  }

  return {
    // 状态
    isRouteLoading,
    routeLoadError,
    sidebarCollapsed,
    mobileSidebarOpen,
    // 主题状态已移至 theme.ts
    pageAnimation,
    animationDuration,
    enablePageAnimation,
    enableKeepAlive,
    maxCachePages,
    cachedPages,
    tabs,
    activeTab,

    // 操作
    setRouteLoading,
    setRouteLoadError,
    toggleSidebarCollapse,
    toggleSidebar: toggleSidebarCollapse, // 别名
    setSidebarCollapsed,
    toggleMobileSidebar,
    closeMobileSidebar,
    // 主题操作已移至 theme.ts
    setPageAnimation,
    setAnimationDuration,
    togglePageAnimation,
    toggleKeepAlive,
    addCachedPage,
    removeCachedPage,
    clearCachedPages,
    addTab,
    removeTab,
    setActiveTab,
    clearTabs,
    initSettings,
    saveSettings,
  }
})
