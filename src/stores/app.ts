import { defineStore } from 'pinia'
import { ref } from 'vue'

// 动画类型枚举
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'flip' | 'none'

// 主题颜色配置
export interface ThemeColors {
  primary: string
  info: string
  success: string
  warning: string
  error: string
}

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebarCollapsed = ref(false)
  const mobileSidebarOpen = ref(false)

  // 主题状态
  const isDark = ref(false)
  const themeColors = ref<ThemeColors>({
    primary: '#18a058', // 现代化绿色
    info: '#2080f0', // 蓝色
    success: '#18a058', // 成功绿色
    warning: '#f0a020', // 警告橙色
    error: '#d03050', // 错误红色
  })

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

  // 主题操作
  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateHtmlClass()
  }

  const setTheme = (dark: boolean) => {
    isDark.value = dark
    updateHtmlClass()
  }

  const setThemeColors = (colors: Partial<ThemeColors>) => {
    themeColors.value = { ...themeColors.value, ...colors }
    saveSettings()
  }

  const updateHtmlClass = () => {
    const html = document.documentElement
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

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
      tabs.value.splice(index, 1)

      // 从缓存中移除
      removeCachedPage(key.replace('/', ''))

      // 如果删除的是当前活动标签，切换到其他标签
      if (activeTab.value === key) {
        if (tabs.value.length > 0) {
          const nextTab = tabs.value[Math.max(0, index - 1)]
          activeTab.value = nextTab.key
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
        isDark.value = settings.isDark || false
        themeColors.value = { ...themeColors.value, ...(settings.themeColors || {}) }
        pageAnimation.value = settings.pageAnimation || 'fade'
        animationDuration.value = settings.animationDuration || 300
        enablePageAnimation.value = settings.enablePageAnimation !== false
        enableKeepAlive.value = settings.enableKeepAlive !== false
        maxCachePages.value = settings.maxCachePages || 10
      } catch (error) {
        console.warn('Failed to parse saved settings:', error)
      }
    } else {
      // 检测系统主题偏好
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateHtmlClass()
  }

  // 保存设置到localStorage
  const saveSettings = () => {
    const settings = {
      isDark: isDark.value,
      themeColors: themeColors.value,
      pageAnimation: pageAnimation.value,
      animationDuration: animationDuration.value,
      enablePageAnimation: enablePageAnimation.value,
      enableKeepAlive: enableKeepAlive.value,
      maxCachePages: maxCachePages.value,
    }
    localStorage.setItem('app-settings', JSON.stringify(settings))
  }

  // 兼容旧的方法名
  const initTheme = initSettings
  const saveTheme = saveSettings

  return {
    // 状态
    sidebarCollapsed,
    mobileSidebarOpen,
    isDark,
    themeColors,
    pageAnimation,
    animationDuration,
    enablePageAnimation,
    enableKeepAlive,
    maxCachePages,
    cachedPages,
    tabs,
    activeTab,

    // 操作
    toggleSidebarCollapse,
    setSidebarCollapsed,
    toggleMobileSidebar,
    closeMobileSidebar,
    toggleTheme,
    setTheme,
    setThemeColors,
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

    // 兼容旧方法
    initTheme,
    saveTheme,
  }
})
