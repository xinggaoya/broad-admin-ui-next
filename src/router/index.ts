import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 路由元信息接口
export interface RouteMeta {
  title?: string
  icon?: string
  hidden?: boolean // 是否在菜单中隐藏
  keepAlive?: boolean // 是否缓存
  sort?: number // 排序
  permission?: string // 权限标识
}

// 扩展路由记录类型
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
}

// 基础路由（不需要权限的公共路由）
const constantRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: {
      title: '页面未找到',
      hidden: true,
    },
  },
]

// 模拟从后端获取的动态路由数据
const mockAsyncRoutes: AppRouteRecordRaw[] = [
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
            component: () => import('@/views/form/AdvancedFormView.vue'),
            meta: {
              title: '基础表单',
              icon: 'FileOutlined',
              sort: 1,
            },
          },
          {
            path: '/content/form/advanced',
            name: 'AdvancedForm',
            component: () => import('@/views/form/BasicFormView.vue'),
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
            component: () => import('@/views/charts/BarChartView.vue'),
            meta: {
              title: '折线图',
              icon: 'LineChartOutlined',
              sort: 1,
            },
          },
          {
            path: '/analytics/charts/bar',
            name: 'BarChart',
            component: () => import('@/views/charts/LineChartView.vue'),
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
      hidden: true, // 不在菜单中显示
    },
  },
]

// 模拟异步获取路由的API
export const getAsyncRoutes = (): Promise<AppRouteRecordRaw[]> => {
  return new Promise((resolve) => {
    // 模拟网络请求延迟
    setTimeout(() => {
      const userStore = useUserStore()

      // 如果用户已登录，使用用户store中的路由数据
      if (userStore.isLoggedIn && userStore.userRoutes.length > 0) {
        const sortedRoutes = sortRoutes(userStore.userRoutes)
        resolve(sortedRoutes)
        return
      }

      // 否则使用默认路由（仅在开发环境）
      const userRoutes = mockAsyncRoutes.filter((route) => {
        // 这里可以根据用户权限过滤路由
        return true
      })

      // 按sort字段排序
      const sortedRoutes = sortRoutes(userRoutes)
      resolve(sortedRoutes)
    }, 300)
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

// 过滤菜单路由（用于侧边栏显示）
export const filterMenuRoutes = (routes: AppRouteRecordRaw[]): AppRouteRecordRaw[] => {
  return routes
    .filter((route) => !route.meta?.hidden)
    .map((route) => ({
      ...route,
      children: route.children ? filterMenuRoutes(route.children) : undefined,
    }))
    .filter((route) => {
      // 如果是父级路由且没有children，则过滤掉（除非有component）
      if (route.children?.length === 0 && !route.component) {
        return false
      }
      return true
    })
}

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes as RouteRecordRaw[],
})

// 动态路由状态
let isRoutesAdded = false

// 添加动态路由
export const addAsyncRoutes = async () => {
  if (isRoutesAdded) return

  try {
    const asyncRoutes = await getAsyncRoutes()

    // 将动态路由添加到路由器
    asyncRoutes.forEach((route) => {
      router.addRoute(route as RouteRecordRaw)
    })

    isRoutesAdded = true

    // 存储到全局状态，供侧边栏使用
    if (window) {
      ;(window as any).__ASYNC_ROUTES__ = asyncRoutes
    }

    return asyncRoutes
  } catch (error) {
    console.error('添加动态路由失败:', error)
    throw error
  }
}

// 获取所有菜单路由
export const getMenuRoutes = (): AppRouteRecordRaw[] => {
  const asyncRoutes = (window as any).__ASYNC_ROUTES__ || []
  return filterMenuRoutes(asyncRoutes)
}

// 重置路由（用于登出时清除动态路由）
export const resetRouter = () => {
  // 移除所有动态添加的路由
  const asyncRoutes = (window as any).__ASYNC_ROUTES__ || []
  asyncRoutes.forEach((route: AppRouteRecordRaw) => {
    if (route.name) {
      router.removeRoute(route.name as string)
    }
  })

  isRoutesAdded = false
  if (window) {
    ;(window as any).__ASYNC_ROUTES__ = []
  }
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Admin UI`
  } else {
    document.title = 'Admin UI'
  }

  const userStore = useUserStore()

  // 初始化用户状态（从本地存储恢复）
  if (!userStore.isLoggedIn) {
    userStore.initUserState()
  }

  // 白名单路由（无需登录验证）
  const whiteList = ['/login', '/404']

  if (whiteList.includes(to.path)) {
    // 如果已登录访问登录页，重定向到首页
    if (to.path === '/login' && userStore.isLoggedIn) {
      next('/dashboard')
      return
    }
    next()
    return
  }

  // 检查登录状态
  if (!userStore.isLoggedIn) {
    console.log('用户未登录，重定向到登录页')
    next('/login')
    return
  }

  // 如果已登录但路由未加载，动态加载路由
  if (!isRoutesAdded) {
    try {
      await addAsyncRoutes()
      // 重新导航到目标路由
      next({ ...to, replace: true })
    } catch (error) {
      console.error('路由守卫错误:', error)
      // 清除用户状态并跳转到登录页
      userStore.logout()
      next('/login')
    }
    return
  }

  next()
})

// 路由后置守卫
router.afterEach(() => {
  // 可以在这里处理一些后置逻辑，比如加载条结束等
})

export default router
