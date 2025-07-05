/**
 * Alova HTTP 请求封装
 * 包含拦截器、错误处理、Token 管理等功能
 */

import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import { API_CONFIG } from '../config/env'
import type { ApiResponse, RequestConfig } from './types'
import { messageApi, loadingBarApi } from '../utils/message'

// Token 管理工具
export const tokenUtils = {
  // 获取 Token
  getToken(): string | null {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY)
  },

  // 设置 Token
  setToken(token: string): void {
    localStorage.setItem(API_CONFIG.TOKEN_KEY, token)
  },

  // 移除 Token
  removeToken(): void {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY)
    localStorage.removeItem(API_CONFIG.REFRESH_TOKEN_KEY)
  },

  // 获取刷新 Token
  getRefreshToken(): string | null {
    return localStorage.getItem(API_CONFIG.REFRESH_TOKEN_KEY)
  },

  // 设置刷新 Token
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(API_CONFIG.REFRESH_TOKEN_KEY, refreshToken)
  },
}

// 创建 alova 实例
export const alovaInstance = createAlova({
  // 基础 URL
  baseURL: API_CONFIG.BASE_URL,

  // 使用 fetch 适配器
  requestAdapter: adapterFetch(),

  // 请求超时时间
  timeout: API_CONFIG.TIMEOUT,

  // 全局请求拦截器
  beforeRequest(method) {
    // 设置通用请求头
    method.config.headers = {
      'Content-Type': 'application/json',
      ...method.config.headers,
    }

    // 添加认证 Token
    const token = tokenUtils.getToken()
    if (token) {
      method.config.headers.Authorization = `Bearer ${token}`
    }

    // 如果是上传文件，移除 Content-Type 让浏览器自动设置
    if (method.config.headers['Content-Type'] === 'multipart/form-data') {
      delete method.config.headers['Content-Type']
    }

    // 发起请求: url, method, headers, data
  },

  // 全局响应拦截器
  responded: {
    // 响应成功拦截器
    onSuccess: async (response, method) => {
      // 响应成功: url, status, statusText

      // 解析响应数据
      const data = await response.json()

      // 检查业务状态码
      if (data.code === 200 || data.success) {
        return data
      }

      // 处理业务错误
      if (data.code === 401) {
        // Token 过期，清除本地存储，跳转到登录页
        tokenUtils.removeToken()
        window.location.href = '/login'
        return Promise.reject(new Error('登录已过期，请重新登录'))
      }

      // 其他业务错误
      const error = new Error(data.message || '请求失败')
      return Promise.reject(error)
    },

    // 响应错误拦截器
    onError: (error, method) => {
      // 响应错误: url, error

      // 网络错误处理
      if (!navigator.onLine) {
        return Promise.reject(new Error('网络连接异常，请检查网络设置'))
      }

      // 根据状态码处理不同错误
      if (error.response) {
        const status = error.response.status
        switch (status) {
          case 400:
            return Promise.reject(new Error('请求参数错误'))
          case 401:
            tokenUtils.removeToken()
            window.location.href = '/login'
            return Promise.reject(new Error('登录已过期，请重新登录'))
          case 403:
            return Promise.reject(new Error('权限不足，访问被拒绝'))
          case 404:
            return Promise.reject(new Error('请求的资源不存在'))
          case 500:
            return Promise.reject(new Error('服务器内部错误'))
          case 502:
            return Promise.reject(new Error('网关错误'))
          case 503:
            return Promise.reject(new Error('服务暂时不可用'))
          default:
            return Promise.reject(new Error(`请求失败，状态码：${status}`))
        }
      }

      // 请求超时
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('请求超时，请稍后重试'))
      }

      // 其他网络错误
      return Promise.reject(new Error('网络错误，请检查网络连接'))
    },
  },
})

// 请求配置扩展处理
let loadingCount = 0

// 显示全局加载
const showLoading = () => {
  loadingCount++
  if (loadingCount === 1) {
    // 只在第一个请求时显示加载条
    loadingBarApi.start()
  }
}

// 隐藏全局加载
const hideLoading = () => {
  loadingCount--
  if (loadingCount <= 0) {
    loadingCount = 0
    // 所有请求完成时隐藏加载条
    loadingBarApi.finish()
  }
}

// 显示错误提示
const showError = (errorMessage: string) => {
  // 使用 naive-ui 的错误消息提示
  messageApi.error(errorMessage)
  // 错误状态的加载条
  loadingBarApi.error()
}

// 扩展的请求方法，支持自定义配置
export const request = {
  // GET 请求
  get: <T = unknown>(url: string, params?: Record<string, unknown>, config?: RequestConfig) => {
    const method = alovaInstance.Get<ApiResponse<T>>(url, { params })
    return executeRequest(method, config)
  },

  // POST 请求
  post: <T = unknown>(
    url: string,
    data?: Record<string, unknown> | FormData | string,
    config?: RequestConfig,
  ) => {
    const method = alovaInstance.Post<ApiResponse<T>>(url, data)
    return executeRequest(method, config)
  },

  // PUT 请求
  put: <T = unknown>(
    url: string,
    data?: Record<string, unknown> | FormData | string,
    config?: RequestConfig,
  ) => {
    const method = alovaInstance.Put<ApiResponse<T>>(url, data)
    return executeRequest(method, config)
  },

  // DELETE 请求
  delete: <T = unknown>(url: string, params?: Record<string, unknown>, config?: RequestConfig) => {
    const method = alovaInstance.Delete<ApiResponse<T>>(url, { params })
    return executeRequest(method, config)
  },

  // 上传文件
  upload: <T = unknown>(url: string, formData: FormData, config?: RequestConfig) => {
    const method = alovaInstance.Post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return executeRequest(method, config)
  },
}

// 执行请求的通用方法
async function executeRequest<T>(
  method: Promise<ApiResponse<T>>,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  try {
    // 显示加载
    if (config?.loading !== false) {
      showLoading()
    }

    // 执行请求
    const response = await method

    // 隐藏加载
    if (config?.loading !== false) {
      hideLoading()
    }

    return response
  } catch (error) {
    // 隐藏加载
    if (config?.loading !== false) {
      hideLoading()
    }

    // 错误处理
    const errorMessage = error instanceof Error ? error.message : '请求失败'

    // 自定义错误处理器
    if (config?.customErrorHandler) {
      config.customErrorHandler(error as Error)
    } else if (config?.showError !== false) {
      // 显示错误提示
      showError(errorMessage)
    }

    throw error
  }
}

export default alovaInstance
