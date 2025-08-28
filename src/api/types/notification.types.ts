import type { NotificationType, NotificationStatus } from '@/stores/modules/notification'

export interface NotificationMessage {
  id: string
  title: string
  content: string
  type: NotificationType
  priority: 'low' | 'medium' | 'high'
  data?: {
    [key: string]: any
  }
  actions?: NotificationAction[]
  createTime: string
}

export interface NotificationAction {
  label: string
  key: string
  url?: string
  callback?: string
}

export interface NotificationStats {
  total: number
  unread: number
  low: number
  medium: number
  high: number
}

export interface NotificationList {
  list: NotificationMessage[]
  total: number
  page: number
  pages: number
}