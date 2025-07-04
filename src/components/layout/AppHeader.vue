<template>
  <div class="header-container">
    <!-- 左侧区域 -->
    <div class="header-left">
      <!-- 移动端菜单按钮 -->
      <div class="mobile-menu-btn" @click="$emit('toggle-mobile-sidebar')">
        <n-icon size="20">
          <MenuOutlined />
        </n-icon>
      </div>

      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="$emit('toggle-sidebar')">
        <n-icon size="18">
          <MenuFoldOutlined v-if="!sidebarCollapsed" />
          <MenuUnfoldOutlined v-else />
        </n-icon>
      </div>

      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <n-breadcrumb>
          <n-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path">
            <template v-if="item.icon" #icon>
              <n-icon>
                <component :is="item.icon" />
              </n-icon>
            </template>
            {{ item.label }}
          </n-breadcrumb-item>
        </n-breadcrumb>
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="header-right">
      <!-- 主题切换 -->
      <div class="theme-toggle" @click="toggleTheme">
        <n-icon size="18">
          <BulbOutlined v-if="isDark" />
          <BulbOutlined v-else />
        </n-icon>
      </div>

      <!-- 通知 -->
      <div class="notification">
        <n-badge :value="3" :max="99">
          <n-icon size="18">
            <BellOutlined />
          </n-icon>
        </n-badge>
      </div>

      <!-- 全屏 -->
      <div class="fullscreen" @click="toggleFullscreen">
        <n-icon size="18">
          <FullscreenOutlined v-if="!isFullscreen" />
          <FullscreenExitOutlined v-else />
        </n-icon>
      </div>

      <!-- 用户信息 -->
      <div class="user-info">
        <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
          <div class="user-avatar">
            <n-avatar size="small" :src="user" />
            <span class="username">Admin</span>
            <n-icon size="12">
              <DownOutlined />
            </n-icon>
          </div>
        </n-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, h, onMounted } from 'vue'
import user from '@/assets/user.jpg'
import { useRouter, useRoute } from 'vue-router'
import {
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BulbOutlined,
  BellOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
} from '@vicons/antd'
import { useAppStore } from '@/stores/modules/app.ts'
import { useUserStore } from '@/stores/modules/user.ts'
import { type DropdownOption, NIcon, useMessage } from 'naive-ui'

interface Props {
  sidebarCollapsed: boolean
}

defineProps<Props>()
defineEmits<{
  'toggle-sidebar': []
  'toggle-mobile-sidebar': []
}>()

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()
const message = useMessage()

// 主题状态
const isDark = computed(() => appStore.isDark)
const isFullscreen = ref(false)

// 面包屑数据
const breadcrumbItems = computed(() => {
  const matched = route.matched.filter((item) => item.meta && item.meta.title)
  const breadcrumbs = [{ label: '首页', path: '/dashboard', icon: HomeOutlined }]

  matched.forEach((item) => {
    if (item.path !== '/dashboard') {
      breadcrumbs.push({
        label: (item.meta?.title as string) || '未知页面',
        path: item.path,
        icon: HomeOutlined,
      })
    }
  })

  return breadcrumbs
})

// 用户菜单选项
const userMenuOptions: DropdownOption[] = [
  {
    label: '个人中心',
    key: 'profile',
    icon: () => h(NIcon, null, { default: () => h(UserOutlined) }),
  },
  {
    label: '系统设置',
    key: 'settings',
    icon: () => h(NIcon, null, { default: () => h(SettingOutlined) }),
  },
  {
    type: 'divider',
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(NIcon, null, { default: () => h(LogoutOutlined) }),
  },
]

// 切换主题
const toggleTheme = () => {
  appStore.toggleTheme()
}

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 处理用户菜单选择
const handleUserMenuSelect = (key: string) => {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      // 处理登出逻辑
      userStore.logout()
      message.success('退出登录成功')
      router.push('/login')
      break
  }
}

// 监听全屏状态变化
onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})
</script>

<style scoped>
.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #fff;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-btn {
  display: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.mobile-menu-btn:hover {
  background: #f5f5f5;
}

.collapse-btn {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.collapse-btn:hover {
  background: #f5f5f5;
}

.breadcrumb {
  margin-left: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle,
.notification,
.fullscreen {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.theme-toggle:hover,
.notification:hover,
.fullscreen:hover {
  background: #f5f5f5;
}

.user-info {
  cursor: pointer;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.user-avatar:hover {
  background: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .collapse-btn {
    display: none;
  }

  .breadcrumb {
    display: none;
  }
}

/* 暗黑模式适配 */
html.dark .header-container {
  background: #18181c;
}

html.dark .mobile-menu-btn:hover,
html.dark .collapse-btn:hover,
html.dark .theme-toggle:hover,
html.dark .notification:hover,
html.dark .fullscreen:hover,
html.dark .user-avatar:hover {
  background: #2c2c32;
}

html.dark .username {
  color: #fff;
}
</style>
