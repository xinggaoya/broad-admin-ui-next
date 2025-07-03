<template>
  <div class="tab-bar-container">
    <!-- 标签页列表 -->
    <div class="tab-list" ref="tabListRef">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-item"
        :class="{ active: tab.key === activeTab }"
        @click="handleTabClick(tab.key)"
        @contextmenu.prevent="handleContextMenu($event, tab)"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <n-icon
          v-if="tab.closable && tabs.length > 1"
          class="tab-close"
          size="14"
          @click.stop="handleTabClose(tab.key)"
        >
          <CloseOutlined />
        </n-icon>
      </div>
    </div>

    <!-- 标签页操作按钮 -->
    <div class="tab-actions">
      <n-dropdown :options="tabMenuOptions" @select="handleTabMenuSelect" placement="bottom-end">
        <n-icon class="tab-menu-btn" size="16">
          <MoreOutlined />
        </n-icon>
      </n-dropdown>
    </div>

    <!-- 右键菜单 -->
    <n-dropdown
      v-model:show="showContextMenu"
      :x="contextMenuX"
      :y="contextMenuY"
      :options="contextMenuOptions"
      @select="handleContextMenuSelect"
      placement="bottom-start"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CloseOutlined, MoreOutlined } from '@vicons/antd'
import { useAppStore } from '@/stores/app'
import type { DropdownOption } from 'naive-ui'

defineOptions({
  name: 'TabBar',
})

// ==================================================
// Types & Interfaces
// ==================================================

interface Tab {
  key: string
  label: string
  path: string
  closable: boolean
}

// ==================================================
// Composables & Store
// ==================================================

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

// ==================================================
// Reactive State
// ==================================================

const tabListRef = ref<HTMLElement>()
const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const contextMenuTab = ref<Tab | null>(null)

// ==================================================
// Computed Properties
// ==================================================

const tabs = computed(() => appStore.tabs)
const activeTab = computed(() => appStore.activeTab)
const primaryColor = computed(() => appStore.themeColors.primary)

// 标签页下拉菜单选项
const tabMenuOptions = computed((): DropdownOption[] => [
  {
    label: '关闭当前',
    key: 'close-current',
    disabled: !activeTab.value || tabs.value.length <= 1,
  },
  {
    label: '关闭其他',
    key: 'close-others',
    disabled: tabs.value.length <= 1,
  },
  {
    label: '关闭右侧',
    key: 'close-right',
    disabled: !canCloseRight.value,
  },
  {
    label: '关闭左侧',
    key: 'close-left',
    disabled: !canCloseLeft.value,
  },
  {
    type: 'divider',
    key: 'divider1',
  },
  {
    label: '关闭所有',
    key: 'close-all',
    disabled: tabs.value.length === 0,
  },
  {
    label: '重新加载',
    key: 'reload',
    disabled: !activeTab.value,
  },
])

// 右键菜单选项
const contextMenuOptions = computed((): DropdownOption[] => {
  if (!contextMenuTab.value) return []

  const tab = contextMenuTab.value
  const isActive = tab.key === activeTab.value

  return [
    {
      label: '重新加载',
      key: 'reload',
      disabled: !isActive,
    },
    {
      type: 'divider',
      key: 'divider1',
    },
    {
      label: '关闭标签',
      key: 'close',
      disabled: !tab.closable || tabs.value.length <= 1,
    },
    {
      label: '关闭其他',
      key: 'close-others',
      disabled: tabs.value.length <= 1,
    },
    {
      label: '关闭右侧',
      key: 'close-right',
      disabled: !canCloseRightOfTab(tab),
    },
    {
      label: '关闭左侧',
      key: 'close-left',
      disabled: !canCloseLeftOfTab(tab),
    },
  ]
})

// 是否可以关闭右侧标签
const canCloseRight = computed(() => {
  if (!activeTab.value) return false
  const activeIndex = tabs.value.findIndex((tab) => tab.key === activeTab.value)
  return (
    activeIndex < tabs.value.length - 1 &&
    tabs.value.slice(activeIndex + 1).some((tab) => tab.closable)
  )
})

// 是否可以关闭左侧标签
const canCloseLeft = computed(() => {
  if (!activeTab.value) return false
  const activeIndex = tabs.value.findIndex((tab) => tab.key === activeTab.value)
  return activeIndex > 0 && tabs.value.slice(0, activeIndex).some((tab) => tab.closable)
})

// ==================================================
// Methods
// ==================================================

// 检查指定标签右侧是否可以关闭
const canCloseRightOfTab = (targetTab: Tab): boolean => {
  const targetIndex = tabs.value.findIndex((tab) => tab.key === targetTab.key)
  return (
    targetIndex < tabs.value.length - 1 &&
    tabs.value.slice(targetIndex + 1).some((tab) => tab.closable)
  )
}

// 检查指定标签左侧是否可以关闭
const canCloseLeftOfTab = (targetTab: Tab): boolean => {
  const targetIndex = tabs.value.findIndex((tab) => tab.key === targetTab.key)
  return targetIndex > 0 && tabs.value.slice(0, targetIndex).some((tab) => tab.closable)
}

// 处理标签页点击
const handleTabClick = (key: string) => {
  if (key === activeTab.value) return

  appStore.setActiveTab(key)
  const tab = tabs.value.find((t: Tab) => t.key === key)
  if (tab) {
    router.push(tab.path).catch((err) => {
      console.error('路由跳转失败:', err)
    })
  }
}

// 处理标签页关闭
const handleTabClose = (key: string) => {
  const tab = tabs.value.find((t: Tab) => t.key === key)
  if (!tab || !tab.closable) return

  appStore.removeTab(key)

  // 如果关闭的是当前标签，需要切换到其他标签
  if (key === activeTab.value && tabs.value.length > 0) {
    const newActiveTab = tabs.value[0]
    router.push(newActiveTab.path).catch((err) => {
      console.error('路由跳转失败:', err)
    })
  }
}

// 处理右键菜单
const handleContextMenu = (event: MouseEvent, tab: Tab) => {
  event.preventDefault()
  contextMenuTab.value = tab
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  showContextMenu.value = true
}

// 处理标签页菜单选择
const handleTabMenuSelect = (key: string) => {
  executeTabAction(key, activeTab.value)
}

// 处理右键菜单选择
const handleContextMenuSelect = (key: string) => {
  executeTabAction(key, contextMenuTab.value?.key)
  showContextMenu.value = false
  contextMenuTab.value = null
}

// 执行标签页操作
const executeTabAction = (action: string, targetTabKey?: string) => {
  switch (action) {
    case 'close-current':
    case 'close':
      if (targetTabKey) {
        handleTabClose(targetTabKey)
      }
      break

    case 'close-others':
      closeOtherTabs(targetTabKey)
      break

    case 'close-right':
      closeTabsToRight(targetTabKey)
      break

    case 'close-left':
      closeTabsToLeft(targetTabKey)
      break

    case 'close-all':
      closeAllTabs()
      break

    case 'reload':
      reloadCurrentPage()
      break
  }
}

// 关闭其他标签
const closeOtherTabs = (keepTabKey?: string) => {
  const keepKey = keepTabKey || activeTab.value
  if (!keepKey) return

  const keepTab = tabs.value.find((tab) => tab.key === keepKey)
  if (keepTab) {
    appStore.clearTabs()
    appStore.addTab(keepTab)
    if (keepKey !== activeTab.value) {
      router.push(keepTab.path).catch((err) => {
        console.error('路由跳转失败:', err)
      })
    }
  }
}

// 关闭右侧标签
const closeTabsToRight = (targetTabKey?: string) => {
  const targetKey = targetTabKey || activeTab.value
  if (!targetKey) return

  const targetIndex = tabs.value.findIndex((tab) => tab.key === targetKey)
  if (targetIndex >= 0) {
    const tabsToClose = tabs.value.slice(targetIndex + 1).filter((tab) => tab.closable)
    tabsToClose.forEach((tab) => {
      appStore.removeTab(tab.key)
    })
  }
}

// 关闭左侧标签
const closeTabsToLeft = (targetTabKey?: string) => {
  const targetKey = targetTabKey || activeTab.value
  if (!targetKey) return

  const targetIndex = tabs.value.findIndex((tab) => tab.key === targetKey)
  if (targetIndex > 0) {
    const tabsToClose = tabs.value.slice(0, targetIndex).filter((tab) => tab.closable)
    tabsToClose.forEach((tab) => {
      appStore.removeTab(tab.key)
    })
  }
}

// 关闭所有标签
const closeAllTabs = () => {
  appStore.clearTabs()
  router.push('/dashboard').catch((err) => {
    console.error('路由跳转失败:', err)
  })
}

// 重新加载当前页面
const reloadCurrentPage = () => {
  // 通过改变路由的query参数来触发页面重新加载
  const currentRoute = route
  router
    .replace({
      path: currentRoute.path,
      query: {
        ...currentRoute.query,
        _t: Date.now(),
      },
    })
    .catch((err) => {
      console.error('页面重新加载失败:', err)
    })
}

// 滚动到激活的标签
const scrollToActiveTab = () => {
  nextTick(() => {
    if (!tabListRef.value) return

    const activeTabElement = tabListRef.value.querySelector('.tab-item.active') as HTMLElement
    if (activeTabElement) {
      activeTabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  })
}

// ==================================================
// Watchers
// ==================================================

// 监听路由变化，自动添加标签页
watch(
  () => route.path,
  () => {
    if (route.meta?.title) {
      appStore.addTab({
        key: route.path,
        label: route.meta.title as string,
        path: route.path,
        closable: route.path !== '/dashboard', // 首页不可关闭
      })

      // 滚动到新激活的标签
      scrollToActiveTab()
    }
  },
  { immediate: true },
)

// 监听激活标签变化，滚动到激活位置
watch(activeTab, () => {
  scrollToActiveTab()
})
</script>

<style scoped>
.tab-bar-container {
  height: 100%;
  display: flex;
  align-items: center;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 12px;
}

.tab-list {
  flex: 1;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scroll-behavior: smooth;
}

.tab-list::-webkit-scrollbar {
  height: 3px;
}

.tab-list::-webkit-scrollbar-track {
  background: transparent;
}

.tab-list::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 2px;
}

.tab-list::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  margin-right: 4px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 0;
  flex-shrink: 0;
  position: relative;
  user-select: none;
}

.tab-item:hover {
  background: #f0f0f0;
  border-color: #d9d9d9;
}

.tab-item.active {
  background: v-bind(primaryColor);
  border-color: v-bind(primaryColor);
  color: #fff;
  font-weight: 500;
}

.tab-label {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  line-height: 1.2;
}

.tab-close {
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s ease;
  display: none;
  transform: scale(0.8);
  padding: 1px;
}

/* 鼠标悬停时显示关闭按钮 */
.tab-item:hover .tab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
}

.tab-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.tab-actions {
  margin-left: 8px;
  flex-shrink: 0;
}

.tab-menu-btn {
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.tab-menu-btn:hover {
  background: #e8e8e8;
}

/* 暗黑模式适配 */
html.dark .tab-bar-container {
  background: #101014;
  border-bottom-color: #2c2c32;
}

html.dark .tab-item {
  background: #18181c;
  border-color: #2c2c32;
  color: #fff;
}

html.dark .tab-item:hover {
  background: #2c2c32;
  border-color: #404040;
}

html.dark .tab-item.active {
  background: v-bind(primaryColor);
  border-color: v-bind(primaryColor);
  color: #fff;
}

html.dark .tab-menu-btn:hover {
  background: #2c2c32;
}

html.dark .tab-list::-webkit-scrollbar-thumb {
  background: #48484f;
}

html.dark .tab-list::-webkit-scrollbar-thumb:hover {
  background: #5a5a61;
}
</style>
