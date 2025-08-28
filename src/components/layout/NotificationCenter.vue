<template>
  <div class="notification-center">
    <div class="notification-trigger">
      <n-badge :value="unreadCount" :max="99" :show="unreadCount > 0">
        <n-button
          quaternary
          circle
          @click="showNotificationPanel = !showNotificationPanel"
        >
          <n-icon size="20">
            <BellOutlined />
          </n-icon>
        </n-button>
      </n-badge>
    </div>

    <!-- 通知面板 -->
    <n-card
      v-show="showNotificationPanel"
      class="notification-panel"
      title="通知中心"
      :bordered="false"
      closable
      @close="showNotificationPanel = false"
    >
      <template #header-extra>
        <n-button-group size="small">
          <n-button size="small" quaternary @click="markAllAsRead">
            <template #icon>
              <n-icon>
                <CheckCircleOutlined />
              </n-icon>
            </template>
            全部已读
          </n-button>
          <n-dropdown :options="filterOptions" @select="handleFilter">
            <n-button size="small" quaternary>
              <template #icon>
                <n-icon>
                  <SettingOutlined />
                </n-icon>
              </template>
              {{ activeFilter.label }}
            </n-button>
          </n-dropdown>
        </n-button-group>
      </template>

      <!-- 统计信息 -->
      <div class="notification-stats">
        <n-statistic label="未读" :value="unreadCount" />
        <n-statistic label="重要" :value="highPriorityCount" />
        <n-statistic label="总数" :value="totalNotifications" />
      </div>

      <!-- 通知列表 -->
      <n-scrollbar style="max-height: 400px">
        <div v-if="filteredNotifications.length === 0" class="empty-state">
          <n-icon size="48" :color="'#d9d9d9'">
            <BellOutlined />
          </n-icon>
          <p>暂无通知</p>
        </div>

        <div v-else class="notification-list">
          <n-list hoverable>
            <n-list-item
              v-for="notification in filteredNotifications"
              :key="notification.id"
              clickable
              @click="handleNotificationClick(notification)"
            >
              <template #prefix>
                <n-avatar
                  round
                  :size="40"
                  :style="{ backgroundColor: getNotificationColor(notification.type) }"
                >
                  {{ notification.title.charAt(0) }}
                </n-avatar>
              </template>
              
              <n-thing
                :title="notification.title"
                :description="notification.content"
              />
              
              <template #suffix>
                <div class="notification-actions">
                  <n-text depth="3" tag="div" style="font-size: 12px;">
                    {{ formatTime(notification.createdAt) }}
                  </n-text>
                  <n-button
                    text
                    size="tiny"
                    @click.stop="removeNotification(notification.id)"
                  >
                    删除
                  </n-button>
                </div>
              </template>
            </n-list-item>
          </n-list>
        </div>
      </n-scrollbar>
    </n-card>

    <!-- 通知设置弹窗 -->
    <n-modal v-model:show="showSettingsModal">
      <n-card
        style="width: 600px"
        title="通知设置"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form :model="preferences" label-placement="left" label-width="auto">
          <n-form-item label="浏览器通知">
            <n-switch v-model:value="preferences.enableBrowser" />
          </n-form-item>
          
          <n-form-item label="桌面通知">
            <n-switch v-model:value="preferences.enableDesktop" />
          </n-form-item>
          
          <n-form-item label="声音提醒">
            <n-switch v-model:value="preferences.enableSound" />
          </n-form-item>
          
          <n-form-item label="工作时间通知">
            <n-switch v-model:value="preferences.workHours.enabled" />
            <template v-if="preferences.workHours.enabled">
              <n-time-picker v-model:value="workTimeRange" type="timerange" />
            </template>
          </n-form-item>
        </n-form>
        
        <template #footer>
          <n-button-group>
            <n-button @click="savePreferences">保存设置</n-button>
            <n-button quaternary @click="resetPreferences">重置</n-button>
          </n-button-group>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  NCard, 
  NButton, 
  NIcon, 
  NBadge, 
  NScrollbar, 
  NButtonGroup, 
  NDropdown, 
  NModal,
  NForm,
  NFormItem,
  NSwitch,
  NTimePicker,
  NList,
  NListItem,
  NThing,
  NStatistic
, NAvatar, NText } from 'naive-ui'
import { BellOutlined, CheckCircleOutlined, SettingOutlined, CloseOutlined } from '@vicons/antd'
import { useNotificationStore } from '@/stores/modules/notification'
import type { NotificationItem } from '@/stores/modules/notification'
import type { NotificationType } from '@/stores/modules/notification'

// Store
const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)
const highPriorityCount = computed(() => notificationStore.unreadHighPriorityCount)
const totalNotifications = computed(() => notifications.value.length)
const preferences = computed(() => notificationStore.preferences)

// 状态
const showNotificationPanel = ref(false)
const showSettingsModal = ref(false)
const activeFilter = ref({ value: 'all', label: '全部' })

// 过滤器选项
const filterOptions = [
  { label: '全部', key: 'all' },
  { label: '未读', key: 'unread' },
  { label: '系统', key: 'system' },
  { label: '消息', key: 'message' },
  { label: '订单', key: 'order' },
  { label: '警告', key: 'warning' },
  { label: '错误', key: 'error' },
]

// 时间范围
const workTimeRange = ref([
  preferences.value.workHours.start,
  preferences.value.workHours.end
])

// 过滤后的通知
const filteredNotifications = computed(() => {
  switch (activeFilter.value.value) {
    case 'unread':
      return notifications.value.filter(n => !n.isRead)
    case 'system':
      return notifications.value.filter(n => n.type === 'system')
    case 'message':
      return notifications.value.filter(n => n.type === 'message')
    case 'order':
      return notifications.value.filter(n => n.type === 'order')
    case 'warning':
      return notifications.value.filter(n => n.type === 'warning')
    case 'error':
      return notifications.value.filter(n => n.type === 'error')
    default:
      return notifications.value
  }
})

// 方法
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  
  return date.toLocaleDateString()
}

const getNotificationType = (type: string): NotificationType => {
  const typeMap = {
    success: 'success' as NotificationType,
    warning: 'warning' as NotificationType,
    error: 'error' as NotificationType,
    info: 'info' as NotificationType,
  }
  return typeMap[type as keyof typeof typeMap] || 'default'
}

const removeNotification = (id: string) => {
  notificationStore.remove(id)
}

const markAllAsRead = () => {
  notificationStore.markAllAsRead()
}

const handleFilter = (key: string) => {
  const filter = filterOptions.find(f => f.key === key)
  if (filter) {
    activeFilter.value = filter
  }
}

const handleNotificationClick = (notification: NotificationItem) => {
  markNotificationAsRead(notification.id)
  showNotificationPanel.value = false
}

const markNotificationAsRead = async (id: string) => {
  notificationStore.markAsRead(id)
}

const savePreferences = () => {
  if (workTimeRange.value) {
    preferences.value.workHours.start = workTimeRange.value[0]
    preferences.value.workHours.end = workTimeRange.value[1]
  }
  notificationStore.updatePreferences(preferences.value)
  showSettingsModal.value = false
  
  // 显示保存成功通知
  // this.$message?.success?.('通知设置已保存')
}

const resetPreferences = () => {
  const defaultPreferences = {
    enableBrowser: true,
    enableDesktop: false,
    enableSound: true,
    excludeTypes: [],
    workHours: {
      enabled: false,
      start: '09:00',
      end: '18:00'
    }
  }
  notificationStore.updatePreferences(defaultPreferences)
  workTimeRange.value = [defaultPreferences.workHours.start, defaultPreferences.workHours.end]
}

const getNotificationColor = (type: string): string => {
  const colorMap = {
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#1890ff',
    system: '#722ed1',
    message: '#13c2c2',
    order: '#fa8c16',
    security: '#eb2f96'
  }
  return colorMap[type as keyof typeof colorMap] || '#1890ff'
}

const getNotificationIcon = (type: string) => {
  const iconMap = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
    system: '🔔',
    message: '💬',
    order: '📦',
    security: '🔒'
  }
  return iconMap[type as keyof typeof iconMap] || 'ℹ️'
}

// 点击外部关闭面板
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.notification-center') && showNotificationPanel.value) {
    showNotificationPanel.value = false
  }
}

// 初始化
onMounted(() => {
  notificationStore.init()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.notification-center {
  position: relative;
  display: inline-block;
}

.notification-trigger {
  cursor: pointer;
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 380px;
  max-width: 90vw;
  z-index: 1000;
  margin-top: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.notification-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #666;
}

.empty-state p {
  margin-top: 16px;
  font-size: 14px;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .notification-panel {
    width: calc(100vw - 32px);
    left: 16px;
    right: 16px;
  }
}
</style>