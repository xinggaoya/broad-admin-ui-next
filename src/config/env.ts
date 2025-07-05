/**
 * 环境配置文件
 * 管理不同环境下的配置信息
 */

// 获取环境变量
export const getEnvValue = (key: string, defaultValue: string = '') => {
  return import.meta.env[key] || defaultValue
}

// API 配置
export const API_CONFIG = {
  // API 基础地址
  BASE_URL: getEnvValue('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  // 请求超时时间（毫秒）
  TIMEOUT: 15000,
  // Token 存储键名
  TOKEN_KEY: 'auth_token',
  // 刷新 Token 存储键名
  REFRESH_TOKEN_KEY: 'refresh_token',
}

// 应用配置
export const APP_CONFIG = {
  // 应用名称
  TITLE: getEnvValue('VITE_APP_TITLE', '管理后台'),
  // 应用版本
  VERSION: getEnvValue('VITE_APP_VERSION', '1.0.0'),
  // 环境
  ENV: getEnvValue('VITE_APP_ENV', 'development'),
}

// 判断是否为开发环境
export const isDev = APP_CONFIG.ENV === 'development'

// 判断是否为生产环境
export const isProd = APP_CONFIG.ENV === 'production'
