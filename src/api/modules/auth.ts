/**
 * 认证相关 API
 */

import { request } from '../request'
import type { LoginParams, LoginResponse, UserInfo } from '../types'

// 认证 API
export const authApi = {
  /**
   * 用户登录
   * @param params 登录参数
   */
  login(params: LoginParams) {
    return request.post<LoginResponse>('/auth/login', params)
  },

  /**
   * 用户退出登录
   */
  logout() {
    return request.post('/auth/logout')
  },

  /**
   * 刷新 Token
   * @param refreshToken 刷新令牌
   */
  refreshToken(refreshToken: string) {
    return request.post<{ token: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    })
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo() {
    return request.get<UserInfo>('/auth/user')
  },

  /**
   * 修改密码
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  changePassword(oldPassword: string, newPassword: string) {
    return request.post('/auth/change-password', {
      oldPassword,
      newPassword,
    })
  },

  /**
   * 发送验证码
   * @param phone 手机号
   */
  sendVerifyCode(phone: string) {
    return request.post('/auth/send-code', { phone })
  },

  /**
   * 手机号登录
   * @param phone 手机号
   * @param code 验证码
   */
  loginByPhone(phone: string, code: string) {
    return request.post<LoginResponse>('/auth/login-by-phone', {
      phone,
      code,
    })
  },
}
