/**
 * Naive UI 消息提示封装
 * 集成主题系统，提供统一的消息提示 API
 */

import type { ConfigProviderProps } from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { computed } from 'vue'
import { useThemeStore } from '../stores/modules/theme'

// 创建响应式的配置提供者属性
const createConfigProviderProps = () => {
  const themeStore = useThemeStore()

  return computed<ConfigProviderProps>(() => ({
    theme: themeStore.currentTheme,
    themeOverrides: themeStore.themeOverrides,
  }))
}

// 创建离散的 API 实例
const configProviderPropsRef = createConfigProviderProps()

const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
  {
    configProviderProps: configProviderPropsRef,
  },
)

// 封装常用的消息方法
export const messageApi = {
  // 成功消息
  success: (content: string, duration = 3000) => {
    return message.success(content, { duration })
  },

  // 错误消息
  error: (content: string, duration = 5000) => {
    return message.error(content, { duration })
  },

  // 警告消息
  warning: (content: string, duration = 4000) => {
    return message.warning(content, { duration })
  },

  // 信息消息
  info: (content: string, duration = 3000) => {
    return message.info(content, { duration })
  },

  // 加载消息
  loading: (content: string, duration = 0) => {
    return message.loading(content, { duration })
  },

  // 销毁所有消息
  destroyAll: () => {
    message.destroyAll()
  },
}

// 封装通知方法
export const notificationApi = {
  // 成功通知
  success: (title: string, content?: string, duration = 4500) => {
    return notification.success({
      title,
      content,
      duration,
    })
  },

  // 错误通知
  error: (title: string, content?: string, duration = 0) => {
    return notification.error({
      title,
      content,
      duration,
    })
  },

  // 警告通知
  warning: (title: string, content?: string, duration = 4500) => {
    return notification.warning({
      title,
      content,
      duration,
    })
  },

  // 信息通知
  info: (title: string, content?: string, duration = 4500) => {
    return notification.info({
      title,
      content,
      duration,
    })
  },

  // 销毁所有通知
  destroyAll: () => {
    notification.destroyAll()
  },
}

// 封装对话框方法
export const dialogApi = {
  // 信息对话框
  info: (title: string, content?: string) => {
    return dialog.info({
      title,
      content,
      positiveText: '确定',
    })
  },

  // 成功对话框
  success: (title: string, content?: string) => {
    return dialog.success({
      title,
      content,
      positiveText: '确定',
    })
  },

  // 警告对话框
  warning: (title: string, content?: string) => {
    return dialog.warning({
      title,
      content,
      positiveText: '确定',
    })
  },

  // 错误对话框
  error: (title: string, content?: string) => {
    return dialog.error({
      title,
      content,
      positiveText: '确定',
    })
  },

  // 确认对话框
  confirm: (title: string, content?: string) => {
    return dialog.warning({
      title,
      content,
      positiveText: '确定',
      negativeText: '取消',
    })
  },

  // 自定义对话框
  create: (options: Record<string, unknown>) => {
    return dialog.create(options)
  },
}

// 封装加载条方法
export const loadingBarApi = {
  // 开始加载
  start: () => {
    loadingBar.start()
  },

  // 完成加载
  finish: () => {
    loadingBar.finish()
  },

  // 错误状态
  error: () => {
    loadingBar.error()
  },
}

// 封装模态框方法
export const modalApi = {
  // 创建模态框
  create: (options: Record<string, unknown>) => {
    return modal.create(options)
  },

  // 销毁所有模态框
  destroyAll: () => {
    modal.destroyAll()
  },
}

// 统一导出
export { message, notification, dialog, loadingBar, modal }

// 默认导出常用方法
export default {
  message: messageApi,
  notification: notificationApi,
  dialog: dialogApi,
  loadingBar: loadingBarApi,
  modal: modalApi,
}
