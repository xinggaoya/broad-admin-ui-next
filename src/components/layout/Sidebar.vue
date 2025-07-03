<template>
  <div class="sidebar-container">
    <!-- Logo区域 -->
    <div class="logo-container">
      <div class="logo" :class="{ collapsed }">
        <img src="/favicon.ico" alt="Logo" class="logo-image" />
        <transition name="fade">
          <span v-if="!collapsed" class="logo-text">Admin UI</span>
        </transition>
      </div>
    </div>

    <!-- 菜单区域 -->
    <div class="menu-container">
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="activeKey"
        @update:value="handleMenuSelect"
      />
    </div>

    <!-- 折叠按钮 -->
    <div class="collapse-trigger" @click="$emit('toggle-collapse')">
      <n-icon size="16">
        <MenuFoldOutlined v-if="!collapsed" />
        <MenuUnfoldOutlined v-else />
      </n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd'
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TableOutlined,
  FormOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  DatabaseOutlined,
  FileOutlined,
  LineChartOutlined,
  PieChartOutlined,
  MenuOutlined,
  HomeOutlined,
  FolderOutlined,
} from '@vicons/antd'
import { NIcon } from 'naive-ui'
import { h, computed, type Component, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import { getMenuRoutes, type AppRouteRecordRaw } from '@/router'

interface Props {
  collapsed: boolean
}

defineProps<Props>()
defineEmits<{
  'toggle-collapse': []
}>()

defineOptions({
  name: 'SideBar',
})

const router = useRouter()
const route = useRoute()

// 图标映射表
const iconMap: Record<string, Component> = {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TableOutlined,
  FormOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  DatabaseOutlined,
  FileOutlined,
  LineChartOutlined,
  PieChartOutlined,
  MenuOutlined,
  HomeOutlined,
  FolderOutlined,
}

// 菜单数据
const menuRoutes = ref<AppRouteRecordRaw[]>([])

// 当前激活的菜单项
const activeKey = computed(() => {
  return route.path
})

// 渲染图标
const renderIcon = (iconName?: string) => {
  if (!iconName || !iconMap[iconName]) {
    return () => h(NIcon, null, { default: () => h(FolderOutlined) })
  }
  const IconComponent = iconMap[iconName]
  return () => h(NIcon, null, { default: () => h(IconComponent) })
}

// 将路由配置转换为菜单选项
const transformRouteToMenuOption = (route: AppRouteRecordRaw): MenuOption => {
  const menuOption: MenuOption = {
    label: route.meta?.title || (route.name as string),
    key: route.path,
    icon: renderIcon(route.meta?.icon),
  }

  // 处理子菜单
  if (route.children && route.children.length > 0) {
    // 过滤掉隐藏的子菜单
    const visibleChildren = route.children.filter((child) => !child.meta?.hidden)

    if (visibleChildren.length > 0) {
      menuOption.children = visibleChildren.map((child) => transformRouteToMenuOption(child))
    }
  }

  return menuOption
}

// 菜单选项
const menuOptions = computed(() => {
  return menuRoutes.value
    .filter((route) => !route.meta?.hidden) // 过滤隐藏的菜单
    .map((route) => transformRouteToMenuOption(route))
})

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  // 找到对应的路由
  const findRoute = (routes: AppRouteRecordRaw[], targetKey: string): AppRouteRecordRaw | null => {
    for (const route of routes) {
      if (route.path === targetKey) {
        return route
      }
      if (route.children) {
        const found = findRoute(route.children, targetKey)
        if (found) return found
      }
    }
    return null
  }

  const targetRoute = findRoute(menuRoutes.value, key)

  // 如果路由有组件，直接跳转；否则可能是目录，不跳转
  if (targetRoute?.component) {
    router.push(key)
  }
}

// 加载菜单数据
const loadMenuData = () => {
  try {
    const routes = getMenuRoutes()
    menuRoutes.value = routes
  } catch (error) {
    console.error('加载菜单数据失败:', error)
    menuRoutes.value = []
  }
}

// 监听路由变化，重新加载菜单（用于动态路由添加后刷新菜单）
watch(
  () => route.path,
  () => {
    loadMenuData()
  },
  { immediate: true },
)

// 监听全局路由状态变化
watch(
  () => (window as any).__ASYNC_ROUTES__,
  () => {
    loadMenuData()
  },
  { deep: true },
)
</script>

<style scoped>
.sidebar-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e8e8e8;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  transition: all 0.3s ease;
}

.logo.collapsed {
  padding: 0;
  justify-content: center;
}

.logo-image {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
  white-space: nowrap;
}

.menu-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.collapse-trigger {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.collapse-trigger:hover {
  background: #f5f5f5;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义菜单容器滚动条 */
.menu-container::-webkit-scrollbar {
  width: 4px;
}

.menu-container::-webkit-scrollbar-track {
  background: transparent;
}

.menu-container::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 2px;
}

.menu-container::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* 暗黑模式适配 */
html.dark .logo-container {
  border-bottom-color: #2c2c32;
}

html.dark .collapse-trigger {
  border-top-color: #2c2c32;
}

html.dark .collapse-trigger:hover {
  background: #2c2c32;
}

html.dark .logo-text {
  color: #63e2b7;
}

html.dark .menu-container::-webkit-scrollbar-thumb {
  background: #48484f;
}

html.dark .menu-container::-webkit-scrollbar-thumb:hover {
  background: #5a5a61;
}
</style>
