import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 通知类型枚举
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SYSTEM = 'system',
  MESSAGE = 'message',
  ORDER = 'order',
  SECURITY = 'security'
}

// 通知状态枚举
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

// 通知接口定义
export interface NotificationItem {
  id: string
  title: string
  content: string
  type: NotificationType
  status: NotificationStatus
  createdAt: Date
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  data?: any
  actions?: Array<{
    label: string
    key: string
    callback?: () => void
  }>
}

// 通知偏好设置
export interface NotificationPreferences {
  enableBrowser: boolean
  enableDesktop: boolean
  enableSound: boolean
  excludeTypes: NotificationType[]
  workHours: {
    enabled: boolean
    start: string // HH:MM
    end: string // HH:MM
  }
}

export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref<NotificationItem[]>([])
  const initialized = ref(false)
  const preferences = ref<NotificationPreferences>({
    enableBrowser: true,
    enableDesktop: false,
    enableSound: true,
    excludeTypes: [],
    workHours: {
      enabled: false,
      start: '09:00',
      end: '18:00'
    }
  })
  
  // 计算属性
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.isRead && n.status === NotificationStatus.UNREAD).length
  )
  
  const unreadHighPriorityCount = computed(() =>
    notifications.value.filter(n => !n.isRead && 
                                   n.status === NotificationStatus.UNREAD && 
                                   n.priority === 'high').length
  )
  
  const displayedNotifications = computed(() =>
    notifications.value.filter(n => n.status !== NotificationStatus.ARCHIVED)
  )

  // 方法
  const addNotification = (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: notification.id || `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      isRead: false,
      status: notification.status || NotificationStatus.UNREAD
    }
    
    notifications.value.unshift(newNotification)
    
    // 限制通知数量，最多保留100个
    if (notifications.value.length > 100) {
      notifications.value = notifications.value.slice(0, 100)
    }
    
    // 触发浏览器通知
    triggerBrowserNotification(newNotification)
    
    return newNotification
  }

  const markAsRead = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value[index].isRead = true
      notifications.value[index].status = NotificationStatus.READ
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.isRead = true
      notification.status = NotificationStatus.READ
    })
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value[index].status = NotificationStatus.ARCHIVED
    }
  }

  const removeAllNotifications = () => {
    notifications.value.forEach(notification => {
      notification.status = NotificationStatus.ARCHIVED
    })
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    preferences.value = { ...preferences.value, ...newPreferences }
    savePreferences()
  }

  // 发送系统通知
  const showNotification = (title: string, content: string, type: NotificationType = NotificationType.INFO) => {
    return addNotification({
      title,
      content,
      type,
      priority: type === NotificationType.ERROR ? 'high' : 'medium'
    })
  }

  // 触发浏览器通知
  const triggerBrowserNotification = async (notification: NotificationItem) => {
    if (!preferences.value.enableBrowser) return
    
    // 检查排除类型
    if (preferences.value.excludeTypes.includes(notification.type)) return
    
    // 检查工作时间
    if (preferences.value.workHours.enabled) {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      const [startHour, startMin] = preferences.value.workHours.start.split(':').map(Number)
      const [endHour, endMin] = preferences.value.workHours.end.split(':').map(Number)
      const startTime = startHour * 60 + startMin
      const endTime = endHour * 60 + endMin
      
      if (currentTime < startTime || currentTime > endTime) return
    }

    // 检查浏览器通知权限
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const browserNotification = new Notification(notification.title, {
          body: notification.content,
          icon: '/app-icon.png',
          tag: notification.id,
        })

        browserNotification.onclick = () => {
          window.focus()
          markAsRead(notification.id)
          if (notification.actions?.[0]?.callback) {
            notification.actions[0].callback()
          }
        }
      } catch (error) {
        console.error('浏览器通知失败:', error)
      }
    } else if ('Notification' in window && Notification.permission === 'default') {
      // 请求权限
      Notification.requestPermission()
    }
  }

  // 订阅服务器推送通知
  const subscribeServerNotifications = () => {
    // 这里可以集成WebSocket或SSE来获取实时通知
    // 模拟部分通知
    setTimeout(() => {
      showNotification('系统欢迎', '欢迎使用后台管理系统', NotificationType.SYSTEM)
    }, 3000)

    setTimeout(() => {
      showNotification('数据同步', '每日数据同步已完成', NotificationType.INFO)
    }, 10000)
  }

  // 过滤通知
  const getNotificationsByType = (type: NotificationType) => {
    return notifications.value.filter(n => n.type === type)
  }

  const getNotificationsByStatus = (status: NotificationStatus) => {
    return notifications.value.filter(n => n.status === status)
  }

  // 保存和加载偏好设置
  const savePreferences = () => {
    localStorage.setItem('notification-preferences', JSON.stringify(preferences.value))
  }

  const loadPreferences = () => {
    const saved = localStorage.getItem('notification-preferences')
    if (saved) {
      try {
        preferences.value = { ...preferences.value, ...JSON.parse(saved) }
      } catch (error) {
        console.error('加载通知偏好设置失败:', error)
      }
    }
  }

  // 从内存中恢复通知
  const restoreNotifications = () => {
    const saved = localStorage.getItem('notifications')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        notifications.value = parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          isRead: n.isRead || false,
          status: n.status || NotificationStatus.UNREAD
        }))
      } catch (error) {
        console.error('恢复通知失败:', error)
      }
    }
  }

  // 定期保存通知到内存
  const saveNotifications = () => {
    localStorage.setItem('notifications', JSON.stringify(notifications.value))
  }

  // 初始化
  const init = () => {
    if (initialized.value) return
    
    loadPreferences()
    restoreNotifications()
    subscribeServerNotifications()
    
    initialized.value = true
  }

  return {
    // 状态
    notifications: displayedNotifications,
    unreadCount,
    unreadHighPriorityCount,
    preferences,
    
    // 方法
    add: addNotification,
    show: showNotification,
    markAsRead,
    markAllAsRead,
    remove: removeNotification,
    removeAll: removeAllNotifications,
    clearAll: clearAllNotifications,
    updatePreferences,
    getNotificationsByType,
    getNotificationsByStatus,
    saveNotifications,
    init,
  }
})