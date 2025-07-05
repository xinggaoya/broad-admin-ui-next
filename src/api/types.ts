/**
 * API 相关类型定义
 */

// 基础响应结构
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

// 分页响应数据
export interface PaginationResponse<T = unknown> {
  list: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 请求配置扩展
export interface RequestConfig {
  // 是否显示加载动画
  loading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 自定义错误处理
  customErrorHandler?: (error: Error) => void
  // 是否需要认证
  auth?: boolean
}

// 上传文件响应
export interface UploadResponse {
  url: string
  filename: string
  size: number
}

// 登录参数
export interface LoginParams extends Record<string, unknown> {
  username: string
  password: string
  captcha?: string
}

// 登录响应
export interface LoginResponse {
  token: string
  refreshToken: string
  userInfo: UserInfo
}

// 用户信息
export interface UserInfo {
  id: string | number
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  roles: string[]
  permissions: string[]
}
