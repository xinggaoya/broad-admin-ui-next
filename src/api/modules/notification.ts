import { request } from '../request'
import type { NotificationList, NotificationStats, NotificationMessage } from '../types/notification.types'

// 获取通知列表
export const getNotifications = (params: {
  page?: number
  size?: number
  type?: string
  status?: string
  priority?: string
}) => {
  return request.get<NotificationList>('/api/notifications', { params })
}

// 获取通知统计
export const getNotificationStats = () => {
  return request.get<NotificationStats>('/api/notifications/stats')
}

// 标记通知已读
export const markNotificationAsRead = (id: string) => {
  return request.patch(`/api/notifications/${id}/read`)
}

// 标记所有通知已读
export const markAllNotificationsAsRead = () => {
  return request.patch('/api/notifications/read-all')
}

// 删除通知
export const deleteNotification = (id: string) => {
  return request.delete(`/api/notifications/${id}`)
}

// 删除所有通知
export const deleteAllNotifications = () => {
  return request.delete('/api/notifications')
}

// 创建新通知
export const createNotification = (data: {
  title: string
  content: string
  type: string
  priority: string
  data?: object
}) => {
  return request.post<NotificationMessage>('/api/notifications', data)
}

// 发送系统通知
export const sendSystemNotification = (data: {
  title: string
  content: string
  target: 'all' | 'admin' | 'user'
  priority?: string
}) => {
  return request.post('/api/notifications/system', data)
}