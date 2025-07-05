import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppRouteRecordRaw } from '../../router'
import { renderIcon, type MenuOption } from '../../utils/menuUtils.ts'
import { staticRoutes } from '../../router/StaticRoutes.ts' // 使用静态路由，修正为小写文件名

// 用户信息接口
export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  roles: string[]
  permissions: string[]
  departmentId?: string
  departmentName?: string
}

// 登录响应接口
export interface LoginResponse {
  token: string
  refreshToken: string
  userInfo: UserInfo
  routes: AppRouteRecordRaw[]
  expiresIn: number
}

// 登录请求接口
export interface LoginRequest {
  username: string
  password: string
  captcha?: string
  rememberMe?: boolean
}

// 原始路由数据接口（用于持久化存储）
export interface OriginalRouteData {
  routes: AppRouteRecordRaw[]
  timestamp: number
}

const viewModules = import.meta.glob('/src/views/**/*.vue')

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户状态
    const token = ref<string>('')
    const refreshToken = ref<string>('')
    const userInfo = ref<UserInfo | null>(null)
    const isLoggedIn = ref<boolean>(false)
    const userRoutes = ref<AppRouteRecordRaw[]>([])
    const originalRouteData = ref<OriginalRouteData | null>(null) // 存储原始路由数据

    // 模拟登录API
    const mockLogin = async (loginData: LoginRequest): Promise<LoginResponse> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟账号密码验证
          const validCredentials = [
            { username: 'admin', password: 'admin123' },
            { username: 'user', password: 'user123' },
            { username: 'test', password: 'test123' },
          ]

          const isValid = validCredentials.some(
            (cred) => cred.username === loginData.username && cred.password === loginData.password,
          )

          if (!isValid) {
            reject(new Error('用户名或密码错误'))
            return
          }

          // 模拟不同用户的角色和权限
          let userRole = 'user'
          let permissions: string[] = []

          if (loginData.username === 'admin') {
            userRole = 'admin'
            permissions = ['*'] // 超级管理员拥有所有权限
          } else if (loginData.username === 'user') {
            userRole = 'user'
            permissions = ['dashboard:view', 'user:list', 'content:view']
          } else {
            userRole = 'guest'
            permissions = ['dashboard:view']
          }

          // 模拟用户信息
          const mockUserInfo: UserInfo = {
            id: Date.now().toString(),
            username: loginData.username,
            nickname:
              loginData.username === 'admin'
                ? '超级管理员'
                : loginData.username === 'user'
                  ? '普通用户'
                  : '访客',
            avatar: ``,
            email: `${loginData.username}@example.com`,
            phone: '13800138000',
            roles: [userRole],
            permissions,
            departmentId: '1',
            departmentName: '技术部门',
          }

          // 模拟登录响应
          const response: LoginResponse = {
            token: `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            refreshToken: `mock_refresh_token_${Date.now()}`,
            userInfo: mockUserInfo,
            routes: staticRoutes,
            expiresIn: 7200, // 2小时
          }

          resolve(response)
        }, 800) // 模拟网络延迟
      })
    }

    // 获取处理后的路由
    const getRoutes = () => {
      return userRoutes.value
    }

    // 获取原始路由数据
    const getOriginalRoutes = () => {
      return originalRouteData.value?.routes || []
    }

    // 递归处理组件路径以及排序路由
    const processRoutes = (routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] => {
      return routes
        .map((route) => {
          const newRoute = { ...route }

          // 处理组件路径转换
          if (newRoute.component && typeof newRoute.component === 'string') {
            const originalComponent = newRoute.component

            // 将相对路径转换为完整路径：'dashboard/DashboardView' -> '/src/views/dashboard/DashboardView.vue'
            const componentPath = `/src/views/${originalComponent}.vue`

            if (viewModules[componentPath]) {
              // 将字符串路径转换为动态import函数
              newRoute.component = viewModules[componentPath]
            } else {
              console.warn('[组件加载] ❌ 未找到组件文件:', componentPath)
              console.log('[组件加载] 可用组件列表:', Object.keys(viewModules))
              // 删除组件属性以避免路由错误
              delete newRoute.component
            }
          } else if (typeof newRoute.component === 'function') {
            // 组件已经是函数，无需处理
            console.log('[组件加载] 组件已经是函数，跳过处理')
          }

          // 递归处理子路由
          if (newRoute.children && newRoute.children.length > 0) {
            newRoute.children = processRoutes(newRoute.children)
          }

          return newRoute
        })
        .filter((route) => {
          // 修复过滤逻辑：
          // 1. 有组件的路由保留
          // 2. 有子路由的父路由保留（即使没有组件）- 检查递归处理后的子路由
          const hasComponent = !!route.component
          const hasValidChildren = route.children && route.children.length > 0
          const isValidRoute = hasComponent || hasValidChildren

          return isValidRoute
        })
        .sort((a, b) => {
          // 按meta.sort排序，默认为999
          const sortA = a.meta?.sort || 999
          const sortB = b.meta?.sort || 999
          return sortA - sortB
        })
    }

    // 初始化路由数据（从持久化存储中恢复或处理新的路由数据）
    const initializeRoutes = () => {
      if (originalRouteData.value && originalRouteData.value.routes.length > 0) {
        console.log('[路由初始化] 从持久化存储恢复路由数据')
        userRoutes.value = processRoutes(originalRouteData.value.routes)
      } else {
        console.log('[路由初始化] 没有路由数据')
        userRoutes.value = []
      }
    }

    // 登录
    const login = async (loginData: LoginRequest) => {
      try {
        const response = await mockLogin(loginData)

        // 保存用户信息和路由数据
        token.value = response.token
        refreshToken.value = response.refreshToken
        userInfo.value = response.userInfo
        isLoggedIn.value = true

        // 保存原始路由数据到持久化存储
        originalRouteData.value = {
          routes: response.routes,
          timestamp: Date.now(),
        }

        // 处理路由组件
        userRoutes.value = processRoutes(response.routes)

        console.log('[登录成功] 用户信息和路由数据已保存到持久化存储')
        return response
      } catch (error) {
        console.error('[用户] 登录失败:', error)
        throw error
      }
    }

    // 登出
    const logout = () => {
      // 清除状态
      token.value = ''
      refreshToken.value = ''
      userInfo.value = null
      userRoutes.value = []
      originalRouteData.value = null
      isLoggedIn.value = false

      console.log('[登出] 用户状态已清除')
    }

    // 检查用户是否已登录且有有效数据
    const isUserDataValid = computed(() => {
      return !!(token.value && userInfo.value && originalRouteData.value)
    })

    // 检查权限
    const hasPermission = (permission: string): boolean => {
      if (!userInfo.value) return false

      const permissions = userInfo.value.permissions

      // 超级管理员拥有所有权限
      if (permissions.includes('*')) return true

      // 检查具体权限
      return permissions.includes(permission)
    }

    // 检查角色
    const hasRole = (role: string): boolean => {
      if (!userInfo.value) return false
      return userInfo.value.roles.includes(role)
    }

    // 更新用户信息
    const updateUserInfo = (newUserInfo: Partial<UserInfo>) => {
      if (userInfo.value) {
        userInfo.value = { ...userInfo.value, ...newUserInfo }
      }
    }

    // 将路由转换为菜单选项
    const transformRouteToMenuOption = (route: AppRouteRecordRaw, parentPath = ''): MenuOption => {
      // 计算完整路径
      let fullPath: string
      if (parentPath) {
        // 确保路径拼接正确，避免双斜杠
        const cleanParentPath = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath
        const cleanChildPath = route.path.startsWith('/') ? route.path.slice(1) : route.path
        fullPath = `${cleanParentPath}/${cleanChildPath}`
      } else {
        fullPath = route.path
      }

      const menuOption: MenuOption = {
        key: fullPath,
        label: route.meta?.title || (route.name as string),
        path: fullPath,
        icon: renderIcon(route.meta?.icon),
        disabled: false,
      }

      // 处理子菜单
      if (route.children && route.children.length > 0) {
        // 过滤掉隐藏的子菜单
        const visibleChildren = route.children.filter(
          (child: AppRouteRecordRaw) => !child.meta?.hidden,
        )

        if (visibleChildren.length > 0) {
          menuOption.children = visibleChildren.map((child: AppRouteRecordRaw) =>
            transformRouteToMenuOption(child, fullPath),
          )
        }
      }

      return menuOption
    }

    // 菜单路由（计算属性）
    const menuRoutes = computed((): MenuOption[] => {
      return userRoutes.value
        .filter((route: AppRouteRecordRaw) => !route.meta?.hidden) // 过滤隐藏的菜单
        .map((route: AppRouteRecordRaw) => transformRouteToMenuOption(route))
    })

    // 初始化路由（在store恢复后调用）
    const initRoutes = () => {
      initializeRoutes()
    }

    return {
      // 状态
      token,
      refreshToken,
      userInfo,
      isLoggedIn,
      userRoutes,
      originalRouteData,
      menuRoutes,
      isUserDataValid,
      // 方法
      login,
      logout,
      initRoutes,
      getRoutes,
      getOriginalRoutes,
      hasPermission,
      hasRole,
      updateUserInfo,
    }
  },
  {
    // 持久化存储配置
    persist: {
      key: 'user-store',
      storage: localStorage,
      // 只持久化核心数据，不持久化处理后的路由（因为包含函数）
      pick: ['token', 'refreshToken', 'userInfo', 'isLoggedIn', 'originalRouteData'],
    },
  },
)
