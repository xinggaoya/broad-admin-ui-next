<template>
  <div class="sidebar-container">
    <!-- Logo 区域 -->
    <div class="sidebar-header">
      <div class="logo-container">
        <img class="logo" src="@/assets/logo.svg" alt="Logo" />
        <h2 v-if="!appStore.sidebarCollapsed" class="logo-title">管理系统</h2>
      </div>
    </div>

    <!-- 菜单区域 -->
    <div class="sidebar-content">
      <n-menu
        v-model:value="selectedKeys"
        v-model:expanded-keys="expandedKeys"
        :collapsed="appStore.sidebarCollapsed"
        :collapsed-width="64"
        :collapsed-icon-size="20"
        :options="menuOptions"
        :root-indent="24"
        :indent="18"
        accordion
        @update:value="handleMenuSelect"
      />
    </div>

    <!-- 底部折叠按钮 -->
    <div class="sidebar-footer">
      <n-button
        text
        class="collapse-btn"
        :style="{ justifyContent: appStore.sidebarCollapsed ? 'center' : 'flex-start' }"
        @click="toggleSidebar"
      >
        <template #icon>
          <n-icon size="18">
            <MenuFoldOutlined v-if="!appStore.sidebarCollapsed" />
            <MenuUnfoldOutlined v-else />
          </n-icon>
        </template>
        <span v-if="!appStore.sidebarCollapsed" class="collapse-text">收起菜单</span>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd'
import type { MenuOption } from '@/utils/menuUtils'
import { useAppStore } from '@/stores/modules/app.ts'
import { useUserStore } from '@/stores/modules/user.ts'

defineOptions({
  name: 'SidebarPanel',
})

// ==================================================
// Composables & Store
// ==================================================

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

// ==================================================
// Reactive State
// ==================================================

const selectedKeys = ref<string>('')
const expandedKeys = ref<string[]>([])

// ==================================================
// Computed Properties
// ==================================================

// 菜单选项
const menuOptions = computed((): MenuOption[] => {
  return userStore.menuRoutes || []
})

// ==================================================
// Methods
// ==================================================

// 菜单选择处理
const handleMenuSelect = (key: string, item: MenuOption) => {
  console.log('🎯 菜单选择:', { key, item })

  if (item.disabled) {
    console.warn('⚠️ 菜单项已禁用:', key)
    return
  }

  // 如果有路径，则跳转
  if (item.path) {
    router.push(item.path).catch((err) => {
      console.error('❌ 路由跳转失败:', err)
    })
  }
}

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 更新选中状态
const updateSelectedKeys = () => {
  const currentPath = route.path
  console.log('🔄 更新菜单选中状态:', currentPath)

  // 查找匹配的菜单项
  const findMenuKey = (items: MenuOption[], path: string): string | null => {
    for (const item of items) {
      if (item.path === path) {
        return item.key
      }
      if (item.children) {
        const childKey = findMenuKey(item.children, path)
        if (childKey) {
          return childKey
        }
      }
    }
    return null
  }

  const matchedKey = findMenuKey(menuOptions.value, currentPath)
  if (matchedKey) {
    selectedKeys.value = matchedKey
    console.log('✅ 菜单选中状态已更新:', matchedKey)
  } else {
    console.log('⚠️ 未找到匹配的菜单项:', currentPath)
  }
}

// 自动展开父级菜单
const autoExpandParentMenus = () => {
  const currentPath = route.path

  // 查找当前路径的所有父级菜单
  const findParentKeys = (
    items: MenuOption[],
    path: string,
    parentKeys: string[] = [],
  ): string[] => {
    for (const item of items) {
      const currentParentKeys = [...parentKeys, item.key]

      if (item.path === path) {
        return parentKeys // 返回父级keys，不包含当前项
      }

      if (item.children) {
        const result = findParentKeys(item.children, path, currentParentKeys)
        if (result.length > 0) {
          return result
        }
      }
    }
    return []
  }

  const parentKeys = findParentKeys(menuOptions.value, currentPath)
  if (parentKeys.length > 0) {
    expandedKeys.value = [...new Set([...expandedKeys.value, ...parentKeys])]
    console.log('📂 自动展开父级菜单:', parentKeys)
  }
}

// ==================================================
// Watchers
// ==================================================

// 监听路由变化，更新选中状态
watch(
  () => route.path,
  () => {
    updateSelectedKeys()
    autoExpandParentMenus()
  },
  { immediate: true },
)

// 监听菜单数据变化，重新计算选中状态
watch(
  () => userStore.menuRoutes,
  () => {
    console.log('📋 菜单数据已更新，重新计算选中状态')
    updateSelectedKeys()
    autoExpandParentMenus()
  },
  { immediate: true },
)
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.logo {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}

.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

.sidebar-footer {
  padding: 8px;
  border-top: 1px solid #e8e8e8;
  flex-shrink: 0;
}

.collapse-btn {
  width: 100%;
  height: 40px;
  color: #666;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
}

.collapse-btn:hover {
  color: #1677ff;
  background: #f0f8ff;
}

.collapse-text {
  transition: opacity 0.3s ease;
}

/* 暗黑模式适配 */
html.dark .sidebar-container {
  background: #18181c;
  border-right-color: #2c2c32;
}

html.dark .sidebar-header {
  border-bottom-color: #2c2c32;
}

html.dark .logo-title {
  color: #fff;
}

html.dark .sidebar-footer {
  border-top-color: #2c2c32;
}

html.dark .collapse-btn {
  color: #ccc;
}

html.dark .collapse-btn:hover {
  color: #1677ff;
  background: rgba(22, 119, 255, 0.1);
}

html.dark .sidebar-content::-webkit-scrollbar-thumb {
  background: #48484f;
}

html.dark .sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #5a5a61;
}
</style>
