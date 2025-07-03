<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside
      class="sidebar"
      :class="{ collapsed: sidebarCollapsed, 'mobile-open': mobileSidebarOpen }"
    >
      <Sidebar :collapsed="sidebarCollapsed" @toggle-collapse="toggleSidebarCollapse" />
    </aside>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 头部 -->
      <header class="header">
        <AppHeader
          :sidebar-collapsed="sidebarCollapsed"
          @toggle-sidebar="toggleSidebarCollapse"
          @toggle-mobile-sidebar="toggleMobileSidebar"
        />
      </header>

      <!-- 标签页 -->
      <div class="tab-bar">
        <TabBar />
      </div>

      <!-- 页面内容 -->
      <main class="content-wrapper">
        <!-- 路由容器，支持动画和缓存 -->
        <router-view v-slot="{ Component, route }">
          <transition
            :name="`page-${pageAnimation}`"
            mode="out-in"
            :duration="animationDuration"
            appear
          >
            <keep-alive
              v-if="enableKeepAlive && enablePageAnimation"
              :include="cachedPages"
              :max="maxCachePages"
            >
              <component
                :is="Component"
                :key="`keepalive-animated-${route.path}`"
                class="page-component"
              />
            </keep-alive>
            <component
              v-else-if="enablePageAnimation"
              :is="Component"
              :key="`animated-${route.path}`"
              class="page-component"
            />
            <keep-alive v-else-if="enableKeepAlive" :include="cachedPages" :max="maxCachePages">
              <component :is="Component" :key="`keepalive-${route.path}`" class="page-component" />
            </keep-alive>
            <component
              v-else
              :is="Component"
              :key="`normal-${route.path}`"
              class="page-component"
            />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- 移动端遮罩层 -->
    <div v-if="mobileSidebarOpen" class="mobile-overlay" @click="toggleMobileSidebar" />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { computed, onMounted, onUnmounted } from 'vue'
import Sidebar from './Sidebar.vue'
import AppHeader from './AppHeader.vue'
import TabBar from './TabBar.vue'

const appStore = useAppStore()

defineOptions({
  name: 'AdminLayout',
})

// 侧边栏状态
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const mobileSidebarOpen = computed(() => appStore.mobileSidebarOpen)

// 动画和缓存设置
const pageAnimation = computed(() => appStore.pageAnimation)
const animationDuration = computed(() => appStore.animationDuration)
const enablePageAnimation = computed(() => appStore.enablePageAnimation)
const enableKeepAlive = computed(() => appStore.enableKeepAlive)
const cachedPages = computed(() => appStore.cachedPages)
const maxCachePages = computed(() => appStore.maxCachePages)

// 切换侧边栏折叠状态
const toggleSidebarCollapse = () => {
  appStore.toggleSidebarCollapse()
}

// 切换移动端侧边栏显示
const toggleMobileSidebar = () => {
  appStore.toggleMobileSidebar()
}

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth > 768 && mobileSidebarOpen.value) {
    appStore.closeMobileSidebar()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh; /* 固定视口高度 */
  background: #f5f5f5;
  overflow: hidden; /* 防止整体滚动 */
}

.sidebar {
  width: 260px;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 100;
  flex-shrink: 0; /* 防止侧边栏收缩 */
}

.sidebar.collapsed {
  width: 64px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止主内容区域溢出 */
  min-width: 0; /* 解决flex子项过宽问题 */
}

.header {
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  flex-shrink: 0; /* 防止头部收缩 */
}

.tab-bar {
  height: 40px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0; /* 防止标签栏收缩 */
}

.content-wrapper {
  flex: 1;
  padding: 16px;
  overflow-y: auto; /* 只在内容区滚动 */
  overflow-x: hidden; /* 防止横向滚动 */
  background: #f5f5f5;
  position: relative;
  /* 计算精确高度：100vh - 头部60px - 标签栏40px */
  height: calc(100vh - 100px);
}

.page-component {
  width: 100%;
  /* 移除min-height: 100%，让内容自然高度 */
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: none;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -260px;
    height: 100vh;
    z-index: 100;
  }

  .sidebar.mobile-open {
    left: 0;
  }

  .mobile-overlay {
    display: block;
  }
}

/* 暗黑模式适配 */
html.dark .admin-layout {
  background: #101014;
}

html.dark .sidebar {
  background: #18181c;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
}

html.dark .header {
  background: #18181c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

html.dark .tab-bar {
  background: #101014;
  border-bottom-color: #2c2c32;
}

html.dark .content-wrapper {
  background: #101014;
}

/* 页面动画容器样式 */
.content-wrapper {
  perspective: 1000px;
}

/* 动画性能优化 */
.page-component {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

/* 自定义滚动条样式 */
.content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 暗黑模式滚动条 */
html.dark .content-wrapper::-webkit-scrollbar-track {
  background: #2c2c32;
}

html.dark .content-wrapper::-webkit-scrollbar-thumb {
  background: #48484f;
}

html.dark .content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #5a5a61;
}
</style>
