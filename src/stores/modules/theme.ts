import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import { darkTheme, type GlobalThemeOverrides } from 'naive-ui'

// 主题颜色配置
export interface ThemeColors {
  primary: string
  info: string
  success: string
  warning: string
  error: string
}

// 预设主题
export const THEME_PRESETS = {
  default: {
    primary: '#18a058',
    info: '#2080f0',
    success: '#18a058',
    warning: '#f0a020',
    error: '#d03050',
  },
  blue: {
    primary: '#1890ff',
    info: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
  },
  purple: {
    primary: '#722ed1',
    info: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
  },
  orange: {
    primary: '#fa8c16',
    info: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
  },
  red: {
    primary: '#f5222d',
    info: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
  },
}

// 颜色工具函数 - 移到 store 外部避免循环依赖
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

export const useThemeStore = defineStore('theme', () => {
  // 主题状态
  const isDark = ref(false)
  const themeColors = ref<ThemeColors>(THEME_PRESETS.default)
  const currentPreset = ref<keyof typeof THEME_PRESETS>('default')

  // 计算属性
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

  // 主题操作
  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateHtmlClass()
    saveSettings()
  }

  const setTheme = (dark: boolean) => {
    isDark.value = dark
    updateHtmlClass()
    saveSettings()
  }

  // 防抖更新主题颜色
  let updateTimer: NodeJS.Timeout | null = null
  const setThemeColors = (colors: Partial<ThemeColors>) => {
    // 清除之前的定时器
    if (updateTimer) {
      clearTimeout(updateTimer)
    }
    
    // 使用防抖机制，避免频繁更新
    updateTimer = setTimeout(() => {
      try {
        // 使用 Object.assign 安全地更新响应式对象，避免直接替换引用
        Object.assign(themeColors.value, colors)
        currentPreset.value = 'default' // 自定义颜色时重置预设
        saveSettings()
      } catch (error) {
        console.warn('Theme colors update failed:', error)
      }
    }, 50) // 50ms 防抖延迟
  }

  const setThemePreset = (preset: keyof typeof THEME_PRESETS) => {
    currentPreset.value = preset
    themeColors.value = { ...THEME_PRESETS[preset] }
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

  // 初始化设置
  const initSettings = () => {
    const savedSettings = localStorage.getItem('theme-settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        isDark.value = settings.isDark || false
        themeColors.value = { ...THEME_PRESETS.default, ...(settings.themeColors || {}) }
        currentPreset.value = settings.currentPreset || 'default'
      } catch (error) {
        console.warn('Failed to parse saved theme settings:', error)
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
      currentPreset: currentPreset.value,
    }
    localStorage.setItem('theme-settings', JSON.stringify(settings))
  }

  // 获取主题覆盖配置
  const getThemeOverrides = () => {
    return themeOverrides.value
  }

  return {
    // 状态
    isDark,
    themeColors,
    currentPreset,
    currentTheme,
    themeOverrides,

    // 操作
    toggleTheme,
    setTheme,
    setThemeColors,
    setThemePreset,
    getThemeOverrides,
    initSettings,
    saveSettings,
  }
})
