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

const viewModules = import.meta.glob('/src/views/**/*.vue')

export const useUserStore = defineStore('user', () => {
  // 用户状态
  const token = ref<string>('')
  const refreshToken = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = ref<boolean>(false)
  const userRoutes = ref<AppRouteRecordRaw[]>([])

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

        userRoutes.value = staticRoutes
        // 模拟登录响应
        const response: LoginResponse = {
          token: `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          refreshToken: `mock_refresh_token_${Date.now()}`,
          userInfo: mockUserInfo,
          routes: userRoutes.value,
          expiresIn: 7200, // 2小时
        }

        resolve(response)
      }, 800) // 模拟网络延迟
    })
  }

  // 获取路由
  const getRoutes = () => {
    return filterRoutes(staticRoutes)
  }

  // 递归处理组件路径以及排序路由
  const filterRoutes = (routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] => {
    return routes
      .map((route) => {
        const newRoute = { ...route }

        // 处理组件路径转换
        if (newRoute.component && typeof newRoute.component === 'string') {
          const originalComponent = newRoute.component

          // 将相对路径转换为完整路径：'dashboard/DashboardView' -> '/src/views/dashboard/DashboardView.vue'
          const componentPath = `/src/views/${originalComponent}.vue`

          console.log('[组件加载] 处理组件路径:', {
            original: originalComponent,
            converted: componentPath,
            exists: !!viewModules[componentPath],
          })

          if (viewModules[componentPath]) {
            // 将字符串路径转换为动态import函数
            newRoute.component = viewModules[componentPath]
            console.log('[组件加载] ✅ 组件加载成功:', componentPath)
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
          newRoute.children = filterRoutes(newRoute.children)
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

        if (!isValidRoute) {
          console.warn('[路由过滤] 移除无效路由:', route.path, '(无组件且无子路由)')
        } else {
          console.log('[路由保留] 保留路由:', route.path, {
            hasComponent,
            hasValidChildren,
            childrenCount: route.children?.length || 0,
          })
        }

        return isValidRoute
      })
      .sort((a, b) => {
        // 按meta.sort排序，默认为999
        const sortA = a.meta?.sort || 999
        const sortB = b.meta?.sort || 999
        return sortA - sortB
      })
  }

  // 登录
  const login = async (loginData: LoginRequest) => {
    try {
      const response = await mockLogin(loginData)

      // 保存用户信息
      token.value = response.token
      refreshToken.value = response.refreshToken
      userInfo.value = response.userInfo
      // 处理动态路由组件
      userRoutes.value = filterRoutes(response.routes)
      isLoggedIn.value = true

      // 持久化存储（注意：只保存静态路由配置，不保存处理后的函数）
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('userInfo', JSON.stringify(response.userInfo))
      // 保存原始静态路由配置，而不是处理后的路由
      localStorage.setItem('userRoutes', JSON.stringify(response.routes))

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
    isLoggedIn.value = false

    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userRoutes')
  }

  // 初始化用户状态（从本地存储恢复）
  const initUserState = () => {
    const savedToken = localStorage.getItem('token')
    const savedUserInfo = localStorage.getItem('userInfo')
    const savedUserRoutes = localStorage.getItem('userRoutes')
    const savedRefreshToken = localStorage.getItem('refreshToken')

    if (savedToken && savedUserInfo) {
      try {
        token.value = savedToken
        refreshToken.value = savedRefreshToken || ''
        userInfo.value = JSON.parse(savedUserInfo)

        // 恢复路由数据
        if (savedUserRoutes) {
          // 从localStorage恢复原始路由，并重新处理组件
          const originalRoutes = JSON.parse(savedUserRoutes)
          userRoutes.value = filterRoutes(originalRoutes)
        } else {
          // 如果没有保存的路由数据，使用静态路由重新生成
          userRoutes.value = filterRoutes(staticRoutes)
        }

        isLoggedIn.value = true
      } catch (error) {
        console.error('[用户] 用户状态恢复失败:', error)
        logout() // 清除无效数据
      }
    } else {
      console.log('[用户] 未找到保存的用户状态')
    }
  }

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
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
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

  // 自动初始化（在store创建时执行）
  initUserState()

  return {
    // 状态
    token,
    refreshToken,
    userInfo,
    isLoggedIn,
    userRoutes,
    menuRoutes,
    getRoutes,
    // 方法
    login,
    logout,
    initUserState,
    hasPermission,
    hasRole,
    updateUserInfo,
  }
})
