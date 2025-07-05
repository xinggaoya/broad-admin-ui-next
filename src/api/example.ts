/**
 * API 使用示例
 * 展示如何在组件中使用封装的 API
 */

import { authApi, userApi, request, tokenUtils } from './index'
import type { LoginParams, UserQueryParams } from './index'

// ==================== 基础使用示例 ====================

// 1. 直接使用 API 模块
export const loginExample = async () => {
  try {
    const loginData: LoginParams = {
      username: 'admin',
      password: '123456',
    }

    const response = await authApi.login(loginData)

    if (response.success) {
      // 保存 token
      tokenUtils.setToken(response.data.token)
      tokenUtils.setRefreshToken(response.data.refreshToken)

      // 登录成功
      return response.data
    }
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

// 2. 使用用户管理 API
export const getUserListExample = async () => {
  try {
    const params: UserQueryParams = {
      page: 1,
      pageSize: 10,
      username: 'admin',
    }

    const response = await userApi.getUserList(params)

    if (response.success) {
      // 用户列表和分页信息
      return response.data
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    throw error
  }
}

// ==================== 自定义配置示例 ====================

// 3. 使用自定义配置（不显示 loading，自定义错误处理）
export const customConfigExample = async () => {
  try {
    const response = await request.get(
      '/custom-api',
      {},
      {
        loading: false, // 不显示全局 loading
        showError: false, // 不显示默认错误提示
        customErrorHandler: (error) => {
          // 自定义错误处理
          // 自定义错误处理
          // 这里可以使用 naive-ui 的 message 组件显示错误
        },
      },
    )

    return response.data
  } catch (error) {
    console.error('请求失败:', error)
  }
}

// ==================== 文件上传示例 ====================

// 4. 文件上传示例
export const uploadFileExample = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'avatar')

    const response = await request.upload('/upload', formData, {
      loading: true,
      showError: true,
    })

    if (response.success) {
      // 上传成功
      return response.data
    }
  } catch (error) {
    console.error('上传失败:', error)
    throw error
  }
}

// ==================== Vue 组合式 API 中的使用示例 ====================

// 5. 在 Vue 组件中使用的示例（伪代码）
/*
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { authApi, userApi, type UserInfo } from '../api'

const message = useMessage()
const loading = ref(false)
const userList = ref<UserInfo[]>([])

// 登录方法
const handleLogin = async (loginData) => {
  loading.value = true
  try {
    const response = await authApi.login(loginData)
    message.success('登录成功')
    // 跳转到首页
  } catch (error) {
    message.error('登录失败')
  } finally {
    loading.value = false
  }
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    const response = await userApi.getUserList({
      page: 1,
      pageSize: 10
    })
    userList.value = response.data.list
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

onMounted(() => {
  fetchUserList()
})
</script>
*/

// ==================== 错误处理示例 ====================

// 6. 统一错误处理示例
export const errorHandlingExample = async () => {
  try {
    // 这个请求会自动处理 401 错误（跳转登录页）
    const response = await authApi.getUserInfo()
    return response.data
  } catch (error) {
    // 这里只需要处理业务逻辑相关的错误
    // 网络错误、401 等已经在拦截器中处理了
    console.error('获取用户信息失败:', error)
  }
}

// ==================== Token 管理示例 ====================

// 7. Token 管理示例
export const tokenManagementExample = () => {
  // 检查是否有 token
  const hasToken = !!tokenUtils.getToken()

  if (!hasToken) {
    // 用户未登录
    // 跳转到登录页
    window.location.href = '/login'
    return
  }

  // 清除 token（退出登录）
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      // 无论请求是否成功都清除本地 token
      tokenUtils.removeToken()
      window.location.href = '/login'
    }
  }

  return { logout }
}
