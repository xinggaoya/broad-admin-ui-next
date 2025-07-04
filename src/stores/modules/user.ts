import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppRouteRecordRaw } from '@/router'
import { renderIcon, type MenuOption } from '@/utils/menuUtils'

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

        const mockRoutes: AppRouteRecordRaw[] = [
          {
            path: '/dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/DashboardView.vue'),
            meta: {
              title: '仪表盘',
              icon: 'DashboardOutlined',
              sort: 1,
            },
          },
          {
            path: '/user',
            name: 'UserManagement',
            meta: {
              title: '用户管理',
              icon: 'UserOutlined',
              sort: 2,
            },
            children: [
              {
                path: '/user/list',
                name: 'UserList',
                component: () => import('@/views/users/UserListView.vue'),
                meta: {
                  title: '用户列表',
                  icon: 'UnorderedListOutlined',
                  sort: 1,
                },
              },
              {
                path: '/user/roles',
                name: 'UserRoles',
                component: () => import('@/views/users/UserRolesView.vue'),
                meta: {
                  title: '用户角色',
                  icon: 'TeamOutlined',
                  sort: 2,
                },
              },
            ],
          },
          {
            path: '/content',
            name: 'ContentManagement',
            meta: {
              title: '内容管理',
              icon: 'FileOutlined',
              sort: 3,
            },
            children: [
              {
                path: '/content/table',
                name: 'TableManagement',
                meta: {
                  title: '表格管理',
                  icon: 'TableOutlined',
                },
                children: [
                  {
                    path: '/content/table/basic',
                    name: 'BasicTable',
                    component: () => import('@/views/table/BasicTableView.vue'),
                    meta: {
                      title: '基础表格',
                      icon: 'DatabaseOutlined',
                      sort: 1,
                    },
                  },
                  {
                    path: '/content/table/advanced',
                    name: 'AdvancedTable',
                    component: () => import('@/views/table/AdvancedTableView.vue'),
                    meta: {
                      title: '高级表格',
                      icon: 'TableOutlined',
                      sort: 2,
                    },
                  },
                ],
              },
              {
                path: '/content/form',
                name: 'FormManagement',
                meta: {
                  title: '表单管理',
                  icon: 'FormOutlined',
                },
                children: [
                  {
                    path: '/content/form/basic',
                    name: 'BasicForm',
                    component: () => import('@/views/form/BasicFormView.vue'),
                    meta: {
                      title: '基础表单',
                      icon: 'FileOutlined',
                      sort: 1,
                    },
                  },
                  {
                    path: '/content/form/advanced',
                    name: 'AdvancedForm',
                    component: () => import('@/views/form/AdvancedFormView.vue'),
                    meta: {
                      title: '高级表单',
                      icon: 'FormOutlined',
                      sort: 2,
                    },
                  },
                ],
              },
            ],
          },
          {
            path: '/analytics',
            name: 'Analytics',
            meta: {
              title: '数据分析',
              icon: 'BarChartOutlined',
              sort: 4,
            },
            children: [
              {
                path: '/analytics/charts',
                name: 'Charts',
                meta: {
                  title: '图表分析',
                  icon: 'LineChartOutlined',
                },
                children: [
                  {
                    path: '/analytics/charts/line',
                    name: 'LineChart',
                    component: () => import('@/views/charts/LineChartView.vue'),
                    meta: {
                      title: '折线图',
                      icon: 'LineChartOutlined',
                      sort: 1,
                    },
                  },
                  {
                    path: '/analytics/charts/bar',
                    name: 'BarChart',
                    component: () => import('@/views/charts/BarChartView.vue'),
                    meta: {
                      title: '柱状图',
                      icon: 'PieChartOutlined',
                      sort: 2,
                    },
                  },
                ],
              },
            ],
          },
          {
            path: '/system',
            name: 'SystemManagement',
            meta: {
              title: '系统管理',
              icon: 'SettingOutlined',
              sort: 5,
            },
            children: [
              {
                path: '/system/menu',
                name: 'MenuManagement',
                component: () => import('@/views/system/MenuManagementView.vue'),
                meta: {
                  title: '菜单管理',
                  icon: 'UnorderedListOutlined',
                  sort: 1,
                },
              },
              {
                path: '/system/settings',
                name: 'SystemSettings',
                component: () => import('@/views/settings/SettingsView.vue'),
                meta: {
                  title: '系统设置',
                  icon: 'SettingOutlined',
                  sort: 2,
                },
              },
            ],
          },
          {
            path: '/profile',
            name: 'Profile',
            component: () => import('@/views/profile/ProfileView.vue'),
            meta: {
              title: '个人中心',
              icon: 'UserOutlined',
              sort: 6,
              hidden: true,
            },
          },
        ]

        // 路由排序
        const sortedRoutes = sortRoutes(mockRoutes)

        // 模拟登录响应
        const response: LoginResponse = {
          token: `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          refreshToken: `mock_refresh_token_${Date.now()}`,
          userInfo: mockUserInfo,
          routes: sortedRoutes,
          expiresIn: 7200, // 2小时
        }

        resolve(response)
      }, 800) // 模拟网络延迟
    })
  }

  // 路由排序函数
  const sortRoutes = (routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] => {
    return routes
      .sort((a, b) => {
        const sortA = a.meta?.sort || 999
        const sortB = b.meta?.sort || 999
        return sortA - sortB
      })
      .map((route) => ({
        ...route,
        children: route.children ? sortRoutes(route.children) : undefined,
      }))
  }

  // 登录
  const login = async (loginData: LoginRequest) => {
    try {
      console.log('[用户] 开始登录...')
      const response = await mockLogin(loginData)

      // 保存用户信息
      token.value = response.token
      refreshToken.value = response.refreshToken
      userInfo.value = response.userInfo
      userRoutes.value = response.routes
      isLoggedIn.value = true

      // 持久化存储
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('userInfo', JSON.stringify(response.userInfo))
      localStorage.setItem('userRoutes', JSON.stringify(response.routes))

      console.log('[用户] 登录成功，路由数量:', response.routes.length)
      return response
    } catch (error) {
      console.error('[用户] 登录失败:', error)
      throw error
    }
  }

  // 登出
  const logout = () => {
    console.log('[用户] 开始登出...')

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

    // 重置路由（需要动态导入避免循环引用）
    import('@/router').then(({ resetRouter }) => {
      resetRouter()
    })

    console.log('[用户] 登出完成')
  }

  // 初始化用户状态（从本地存储恢复）
  const initUserState = () => {
    console.log('[用户] 初始化用户状态...')

    const savedToken = localStorage.getItem('token')
    const savedUserInfo = localStorage.getItem('userInfo')
    const savedUserRoutes = localStorage.getItem('userRoutes')
    const savedRefreshToken = localStorage.getItem('refreshToken')

    if (savedToken && savedUserInfo) {
      try {
        token.value = savedToken
        refreshToken.value = savedRefreshToken || ''
        userInfo.value = JSON.parse(savedUserInfo)
        userRoutes.value = savedUserRoutes ? JSON.parse(savedUserRoutes) : []
        isLoggedIn.value = true

        console.log('[用户] 用户状态恢复成功，路由数量:', userRoutes.value.length)
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
  const transformRouteToMenuOption = (route: AppRouteRecordRaw): MenuOption => {
    const menuOption: MenuOption = {
      key: route.path,
      label: route.meta?.title || (route.name as string),
      path: route.path,
      icon: renderIcon(route.meta?.icon),
      disabled: false,
    }

    // 处理子菜单
    if (route.children && route.children.length > 0) {
      // 过滤掉隐藏的子菜单
      const visibleChildren = route.children.filter((child) => !child.meta?.hidden)

      if (visibleChildren.length > 0) {
        menuOption.children = visibleChildren.map((child) => transformRouteToMenuOption(child))
      }
    }

    return menuOption
  }

  // 菜单路由（计算属性）
  const menuRoutes = computed((): MenuOption[] => {
    return userRoutes.value
      .filter((route) => !route.meta?.hidden) // 过滤隐藏的菜单
      .map((route) => transformRouteToMenuOption(route))
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

    // 方法
    login,
    logout,
    initUserState,
    hasPermission,
    hasRole,
    updateUserInfo,
  }
})
