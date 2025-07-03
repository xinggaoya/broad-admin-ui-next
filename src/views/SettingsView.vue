<template>
  <div class="settings-page">
    <n-card title="系统设置" class="main-card">
      <n-tabs default-value="theme" type="line" animated>
        <!-- 主题设置 -->
        <n-tab-pane name="theme" tab="主题设置">
          <div class="settings-section">
            <n-space vertical size="large">
              <!-- 明暗模式切换 -->
              <div class="setting-item">
                <div class="setting-label">
                  <n-icon size="18" :component="BulbOutlined" />
                  <span>明暗模式</span>
                </div>
                <n-switch :value="isDark" @update:value="handleThemeToggle" size="medium">
                  <template #checked>暗黑</template>
                  <template #unchecked>明亮</template>
                </n-switch>
              </div>

              <!-- 主题颜色配置 -->
              <n-divider />
              <div class="color-section">
                <h3 class="section-title">主题颜色</h3>
                <n-grid :cols="2" :x-gap="16" :y-gap="16">
                  <n-grid-item>
                    <div class="color-picker-item">
                      <label>主色调</label>
                      <div class="color-picker-wrapper">
                        <input
                          type="color"
                          :value="themeColors.primary"
                          @input="updateThemeColor('primary', $event)"
                          class="color-picker"
                        />
                        <n-input
                          :value="themeColors.primary"
                          @update:value="
                            (val) => updateThemeColor('primary', { target: { value: val } })
                          "
                          placeholder="#18a058"
                          size="small"
                          style="flex: 1; margin-left: 8px"
                        />
                      </div>
                    </div>
                  </n-grid-item>

                  <n-grid-item>
                    <div class="color-picker-item">
                      <label>信息色</label>
                      <div class="color-picker-wrapper">
                        <input
                          type="color"
                          :value="themeColors.info"
                          @input="updateThemeColor('info', $event)"
                          class="color-picker"
                        />
                        <n-input
                          :value="themeColors.info"
                          @update:value="
                            (val) => updateThemeColor('info', { target: { value: val } })
                          "
                          placeholder="#2080f0"
                          size="small"
                          style="flex: 1; margin-left: 8px"
                        />
                      </div>
                    </div>
                  </n-grid-item>

                  <n-grid-item>
                    <div class="color-picker-item">
                      <label>成功色</label>
                      <div class="color-picker-wrapper">
                        <input
                          type="color"
                          :value="themeColors.success"
                          @input="updateThemeColor('success', $event)"
                          class="color-picker"
                        />
                        <n-input
                          :value="themeColors.success"
                          @update:value="
                            (val) => updateThemeColor('success', { target: { value: val } })
                          "
                          placeholder="#18a058"
                          size="small"
                          style="flex: 1; margin-left: 8px"
                        />
                      </div>
                    </div>
                  </n-grid-item>

                  <n-grid-item>
                    <div class="color-picker-item">
                      <label>警告色</label>
                      <div class="color-picker-wrapper">
                        <input
                          type="color"
                          :value="themeColors.warning"
                          @input="updateThemeColor('warning', $event)"
                          class="color-picker"
                        />
                        <n-input
                          :value="themeColors.warning"
                          @update:value="
                            (val) => updateThemeColor('warning', { target: { value: val } })
                          "
                          placeholder="#f0a020"
                          size="small"
                          style="flex: 1; margin-left: 8px"
                        />
                      </div>
                    </div>
                  </n-grid-item>

                  <n-grid-item>
                    <div class="color-picker-item">
                      <label>错误色</label>
                      <div class="color-picker-wrapper">
                        <input
                          type="color"
                          :value="themeColors.error"
                          @input="updateThemeColor('error', $event)"
                          class="color-picker"
                        />
                        <n-input
                          :value="themeColors.error"
                          @update:value="
                            (val) => updateThemeColor('error', { target: { value: val } })
                          "
                          placeholder="#d03050"
                          size="small"
                          style="flex: 1; margin-left: 8px"
                        />
                      </div>
                    </div>
                  </n-grid-item>
                </n-grid>

                <!-- 预设主题 -->
                <div class="preset-themes">
                  <h4>预设主题</h4>
                  <n-space>
                    <n-button
                      v-for="preset in presetThemes"
                      :key="preset.name"
                      @click="applyPresetTheme(preset)"
                      size="small"
                      :type="isCurrentPreset(preset) ? 'primary' : 'default'"
                    >
                      {{ preset.name }}
                    </n-button>
                  </n-space>
                </div>
              </div>
            </n-space>
          </div>
        </n-tab-pane>

        <!-- 动画设置 -->
        <n-tab-pane name="animation" tab="动画设置">
          <div class="settings-section">
            <n-space vertical size="large">
              <!-- 启用页面动画 -->
              <div class="setting-item">
                <div class="setting-label">
                  <n-icon size="18" :component="PlayCircleOutlined" />
                  <span>启用页面动画</span>
                </div>
                <n-switch
                  :value="enablePageAnimation"
                  @update:value="appStore.togglePageAnimation"
                  size="medium"
                />
              </div>

              <!-- 动画类型选择 -->
              <div class="setting-item" v-if="enablePageAnimation">
                <div class="setting-label">
                  <n-icon size="18" :component="ThunderboltOutlined" />
                  <span>动画类型</span>
                </div>
                <n-select
                  :value="pageAnimation"
                  @update:value="appStore.setPageAnimation"
                  :options="animationOptions"
                  style="width: 150px"
                />
              </div>

              <!-- 动画持续时间 -->
              <div class="setting-item" v-if="enablePageAnimation">
                <div class="setting-label">
                  <n-icon size="18" :component="ClockCircleOutlined" />
                  <span>动画持续时间</span>
                </div>
                <div class="slider-container">
                  <n-slider
                    :value="animationDuration"
                    @update:value="appStore.setAnimationDuration"
                    :min="100"
                    :max="1000"
                    :step="50"
                    style="flex: 1; margin-right: 16px"
                  />
                  <span class="duration-value">{{ animationDuration }}ms</span>
                </div>
              </div>

              <!-- 动画演示 -->
              <div class="animation-demo" v-if="enablePageAnimation">
                <h4>动画预览</h4>
                <div class="demo-container">
                  <transition
                    :name="`page-${pageAnimation}`"
                    mode="out-in"
                    :duration="animationDuration"
                  >
                    <div :key="demoKey" class="demo-card">
                      <n-card size="small" title="演示卡片">
                        <p>这是一个动画演示效果</p>
                        <n-button @click="triggerDemo" type="primary" size="small">
                          再次演示
                        </n-button>
                      </n-card>
                    </div>
                  </transition>
                </div>
              </div>
            </n-space>
          </div>
        </n-tab-pane>

        <!-- 缓存设置 -->
        <n-tab-pane name="cache" tab="缓存设置">
          <div class="settings-section">
            <n-space vertical size="large">
              <!-- 启用页面缓存 -->
              <div class="setting-item">
                <div class="setting-label">
                  <n-icon size="18" :component="DatabaseOutlined" />
                  <span>启用页面缓存</span>
                </div>
                <n-switch
                  :value="enableKeepAlive"
                  @update:value="appStore.toggleKeepAlive"
                  size="medium"
                />
              </div>

              <!-- 最大缓存页面数 -->
              <div class="setting-item" v-if="enableKeepAlive">
                <div class="setting-label">
                  <n-icon size="18" :component="FileOutlined" />
                  <span>最大缓存页面数</span>
                </div>
                <n-input-number
                  :value="maxCachePages"
                  @update:value="(val) => (appStore.maxCachePages = val || 10)"
                  :min="5"
                  :max="50"
                  style="width: 120px"
                />
              </div>

              <!-- 当前缓存页面 -->
              <div class="cache-info" v-if="enableKeepAlive">
                <h4>当前缓存页面 ({{ cachedPages.length }}/{{ maxCachePages }})</h4>
                <n-space v-if="cachedPages.length > 0">
                  <n-tag
                    v-for="page in cachedPages"
                    :key="page"
                    type="info"
                    closable
                    @close="appStore.removeCachedPage(page)"
                  >
                    {{ page }}
                  </n-tag>
                </n-space>
                <n-empty v-else description="暂无缓存页面" size="small" />

                <n-button
                  v-if="cachedPages.length > 0"
                  @click="appStore.clearCachedPages"
                  type="warning"
                  size="small"
                  style="margin-top: 16px"
                >
                  清空所有缓存
                </n-button>
              </div>
            </n-space>
          </div>
        </n-tab-pane>

        <!-- 其他设置 -->
        <n-tab-pane name="other" tab="其他设置">
          <div class="settings-section">
            <n-space vertical size="large">
              <!-- 重置所有设置 -->
              <div class="setting-item">
                <div class="setting-label">
                  <n-icon size="18" :component="ReloadOutlined" />
                  <span>重置所有设置</span>
                </div>
                <n-button @click="resetAllSettings" type="error" size="small"> 重置 </n-button>
              </div>

              <!-- 导出设置 -->
              <div class="setting-item">
                <div class="setting-label">
                  <n-icon size="18" :component="DownloadOutlined" />
                  <span>导出设置</span>
                </div>
                <n-button @click="exportSettings" type="primary" size="small"> 导出 </n-button>
              </div>

              <!-- 导入设置 -->
              <div class="setting-item">
                <div class="setting-label">
                  <n-icon size="18" :component="UploadOutlined" />
                  <span>导入设置</span>
                </div>
                <n-upload :show-file-list="false" accept=".json" @change="importSettings">
                  <n-button size="small">选择文件</n-button>
                </n-upload>
              </div>
            </n-space>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, type AnimationType, type ThemeColors } from '@/stores/app'
import { computed, ref } from 'vue'
import { useMessage, useDialog, type UploadFileInfo } from 'naive-ui'
import {
  BulbOutlined,
  PlayCircleOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  FileOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@vicons/antd'

defineOptions({
  name: 'SettingsView',
})

const appStore = useAppStore()
const message = useMessage()
const dialog = useDialog()

// 主题状态
const isDark = computed(() => appStore.isDark)
const themeColors = computed(() => appStore.themeColors)

// 动画状态
const pageAnimation = computed(() => appStore.pageAnimation)
const animationDuration = computed(() => appStore.animationDuration)
const enablePageAnimation = computed(() => appStore.enablePageAnimation)

// 缓存状态
const enableKeepAlive = computed(() => appStore.enableKeepAlive)
const maxCachePages = computed(() => appStore.maxCachePages)
const cachedPages = computed(() => appStore.cachedPages)

// 动画演示状态
const demoKey = ref(0)

// 动画选项
const animationOptions = [
  { label: '淡入淡出', value: 'fade' },
  { label: '滑动', value: 'slide' },
  { label: '缩放', value: 'zoom' },
  { label: '翻转', value: 'flip' },
  { label: '无动画', value: 'none' },
]

// 预设主题
const presetThemes = [
  {
    name: '默认绿色',
    colors: {
      primary: '#18a058',
      info: '#2080f0',
      success: '#18a058',
      warning: '#f0a020',
      error: '#d03050',
    },
  },
  {
    name: '科技蓝',
    colors: {
      primary: '#1890ff',
      info: '#13c2c2',
      success: '#52c41a',
      warning: '#faad14',
      error: '#f5222d',
    },
  },
  {
    name: '商务紫',
    colors: {
      primary: '#722ed1',
      info: '#2f54eb',
      success: '#389e0d',
      warning: '#d48806',
      error: '#cf1322',
    },
  },
  {
    name: '优雅红',
    colors: {
      primary: '#eb2f96',
      info: '#1890ff',
      success: '#52c41a',
      warning: '#fa8c16',
      error: '#f5222d',
    },
  },
  {
    name: '现代橙',
    colors: {
      primary: '#fa8c16',
      info: '#13c2c2',
      success: '#52c41a',
      warning: '#fadb14',
      error: '#ff4d4f',
    },
  },
]

// 主题切换
const handleThemeToggle = (value: boolean) => {
  appStore.setTheme(value)
  message.success(value ? '已切换到暗黑模式' : '已切换到明亮模式')
}

// 更新主题颜色
const updateThemeColor = (key: keyof ThemeColors, event: any) => {
  const value = event.target.value
  if (/^#[0-9A-F]{6}$/i.test(value)) {
    appStore.setThemeColors({ [key]: value })
    message.success('主题颜色已更新')
  }
}

// 应用预设主题
const applyPresetTheme = (preset: (typeof presetThemes)[0]) => {
  appStore.setThemeColors(preset.colors)
  message.success(`已应用 ${preset.name} 主题`)
}

// 检查是否为当前预设主题
const isCurrentPreset = (preset: (typeof presetThemes)[0]) => {
  const current = themeColors.value
  return Object.keys(preset.colors).every(
    (key) => current[key as keyof ThemeColors] === preset.colors[key as keyof ThemeColors],
  )
}

// 触发动画演示
const triggerDemo = () => {
  demoKey.value++
}

// 重置所有设置
const resetAllSettings = () => {
  dialog.warning({
    title: '确认重置',
    content: '这将重置所有设置到默认值，确定要继续吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      localStorage.removeItem('app-settings')
      appStore.initSettings()
      message.success('设置已重置')
    },
  })
}

// 导出设置
const exportSettings = () => {
  const settings = {
    isDark: appStore.isDark,
    themeColors: appStore.themeColors,
    pageAnimation: appStore.pageAnimation,
    animationDuration: appStore.animationDuration,
    enablePageAnimation: appStore.enablePageAnimation,
    enableKeepAlive: appStore.enableKeepAlive,
    maxCachePages: appStore.maxCachePages,
  }

  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `admin-settings-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)

  message.success('设置已导出')
}

// 导入设置
const importSettings = ({ file }: { file: UploadFileInfo }) => {
  const fileObj = file.file
  if (!fileObj) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const settings = JSON.parse(e.target?.result as string)

      // 验证设置格式
      if (typeof settings === 'object' && settings !== null) {
        // 应用设置
        if (typeof settings.isDark === 'boolean') {
          appStore.setTheme(settings.isDark)
        }
        if (settings.themeColors) {
          appStore.setThemeColors(settings.themeColors)
        }
        if (settings.pageAnimation) {
          appStore.setPageAnimation(settings.pageAnimation)
        }
        if (typeof settings.animationDuration === 'number') {
          appStore.setAnimationDuration(settings.animationDuration)
        }
        if (typeof settings.enablePageAnimation === 'boolean') {
          appStore.enablePageAnimation = settings.enablePageAnimation
        }
        if (typeof settings.enableKeepAlive === 'boolean') {
          appStore.enableKeepAlive = settings.enableKeepAlive
        }
        if (typeof settings.maxCachePages === 'number') {
          appStore.maxCachePages = settings.maxCachePages
        }

        appStore.saveSettings()
        message.success('设置已导入')
      } else {
        message.error('设置文件格式错误')
      }
    } catch (error) {
      message.error('设置文件解析失败')
    }
  }
  reader.readAsText(fileObj)
}
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
}

.main-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.settings-section {
  padding: 16px 0;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.color-section {
  margin-top: 16px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.color-picker-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-picker-item label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
}

.color-picker {
  width: 40px;
  height: 32px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.preset-themes {
  margin-top: 24px;
}

.preset-themes h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
}

.slider-container {
  display: flex;
  align-items: center;
  width: 250px;
}

.duration-value {
  font-size: 14px;
  color: #666;
  min-width: 50px;
  text-align: right;
}

.animation-demo {
  margin-top: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.animation-demo h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 500;
}

.demo-container {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-card {
  width: 200px;
}

.cache-info {
  margin-top: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.cache-info h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
}

/* 暗黑模式适配 */
html.dark .animation-demo,
html.dark .cache-info {
  background: #18181c;
}

html.dark .color-picker-item label {
  color: #ccc;
}

html.dark .color-picker {
  border-color: #404040;
}

html.dark .duration-value {
  color: #ccc;
}
</style>
