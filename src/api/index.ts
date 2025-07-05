/**
 * API 入口文件
 * 统一导出所有 API 模块和工具
 */

// 导出请求实例和工具
export { default as alovaInstance, request, tokenUtils } from './request'

// 导出类型定义
export * from './types'

// 导出 API 模块
export { authApi } from './modules/auth'
export {
  userApi,
  type UserQueryParams,
  type CreateUserParams,
  type UpdateUserParams,
} from './modules/user'

// 导出配置
export { API_CONFIG, APP_CONFIG } from '../config/env'

// 重新导入用于默认导出
import { request, tokenUtils } from './request'
import { authApi } from './modules/auth'
import { userApi } from './modules/user'

// 创建统一的 API 对象
export const api = {
  auth: authApi,
  user: userApi,
}

// 默认导出
export default {
  ...api,
  request,
  tokenUtils,
}
