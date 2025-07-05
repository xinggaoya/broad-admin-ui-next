/**
 * 用户管理相关 API
 */

import { request } from '../request'
import type { UserInfo, PaginationParams, PaginationResponse } from '../types'

// 用户查询参数
export interface UserQueryParams extends PaginationParams, Record<string, unknown> {
  username?: string
  nickname?: string
  email?: string
  phone?: string
  status?: number
  roleId?: string | number
}

// 用户创建参数
export interface CreateUserParams extends Record<string, unknown> {
  username: string
  password: string
  nickname: string
  email?: string
  phone?: string
  avatar?: string
  roleIds: (string | number)[]
}

// 用户更新参数
export interface UpdateUserParams extends Record<string, unknown> {
  id: string | number
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  status?: number
  roleIds?: (string | number)[]
}

// 用户管理 API
export const userApi = {
  /**
   * 获取用户列表
   * @param params 查询参数
   */
  getUserList(params: UserQueryParams) {
    return request.get<PaginationResponse<UserInfo>>('/users', params)
  },

  /**
   * 获取用户详情
   * @param id 用户ID
   */
  getUserDetail(id: string | number) {
    return request.get<UserInfo>(`/users/${id}`)
  },

  /**
   * 创建用户
   * @param params 用户信息
   */
  createUser(params: CreateUserParams) {
    return request.post<UserInfo>('/users', params)
  },

  /**
   * 更新用户信息
   * @param params 用户信息
   */
  updateUser(params: UpdateUserParams) {
    const { id, ...data } = params
    return request.put<UserInfo>(`/users/${id}`, data)
  },

  /**
   * 删除用户
   * @param id 用户ID
   */
  deleteUser(id: string | number) {
    return request.delete(`/users/${id}`)
  },

  /**
   * 批量删除用户
   * @param ids 用户ID数组
   */
  batchDeleteUsers(ids: (string | number)[]) {
    return request.post('/users/batch-delete', { ids })
  },

  /**
   * 重置用户密码
   * @param id 用户ID
   * @param newPassword 新密码
   */
  resetPassword(id: string | number, newPassword: string) {
    return request.post(`/users/${id}/reset-password`, { newPassword })
  },

  /**
   * 启用/禁用用户
   * @param id 用户ID
   * @param status 状态：1-启用，0-禁用
   */
  updateUserStatus(id: string | number, status: number) {
    return request.put(`/users/${id}/status`, { status })
  },

  /**
   * 获取用户角色列表
   * @param id 用户ID
   */
  getUserRoles(id: string | number) {
    return request.get<{ roleId: string | number; roleName: string }[]>(`/users/${id}/roles`)
  },

  /**
   * 分配用户角色
   * @param id 用户ID
   * @param roleIds 角色ID数组
   */
  assignRoles(id: string | number, roleIds: (string | number)[]) {
    return request.post(`/users/${id}/roles`, { roleIds })
  },
}
