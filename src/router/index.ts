import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../stores/modules/user.ts'
import { useAppStore } from '../stores/modules/app.ts'
import { useLoadingBar } from '../hooks/useLoadingBar.ts'

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
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children' | 'component'> {
  meta?: RouteMeta
  component?: string | (() => Promise<unknown>) // 修复组件类型定义
  children?: AppRouteRecordRaw[]
}

// 路由加载状态
let isRouteLoaded = false

// 基础路由（不需要权限的公共路由）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  // 404页面 - 放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/error/NotFoundView.vue'),
    meta: {
      title: '页面未找到',
      hidden: true,
    },
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

// 添加动态路由
export const addAsyncRoutes = async (routes: AppRouteRecordRaw[]) => {
  try {
    // 过滤掉已存在的基础路由
    const filteredRoutes = routes.filter(
      (route) => !constantRoutes.some((baseRoute) => baseRoute.path === route.path),
    )

    // 将动态路由添加到路由器
    filteredRoutes.forEach((route) => {
      router.addRoute(route as RouteRecordRaw)
    })

    // 动态路由添加完成
    return routes
  } catch (error) {
    console.error('[动态路由] 添加失败:', error)
    throw error
  }
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

// 重置路由加载状态
export const resetRouteLoadState = () => {
  isRouteLoaded = false
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const { start, finish, error } = useLoadingBar()

  // 路由守卫导航: ${from.path} → ${to.path}

  // 开始loading bar
  start()
  // 路由守卫：开始Loading Bar

  const title = import.meta.env.VITE_APP_NAME
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - ${title}`
  } else {
    document.title = title
  }

  // 白名单路由（无需登录验证的页面）
  const whiteList = ['/login', '/404']

  // 如果是白名单路由，直接通过
  if (whiteList.includes(to.path)) {
    // 如果已登录用户访问登录页，重定向到首页
    if (to.path === '/login' && userStore.isUserDataValid) {
      // 已登录用户访问登录页，重定向到首页
      setTimeout(() => finish(), 100)
      next('/dashboard')
      return
    }
    setTimeout(() => finish(), 100)
    next()
    return
  }

  // 检查登录状态
  if (!userStore.isUserDataValid) {
    // 用户未登录或数据无效，重定向到登录页
    setTimeout(() => finish(), 100)
    next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    return
  }

  // 用户已登录，检查动态路由是否已加载
  if (!isRouteLoaded) {
    try {
      // 开始加载动态路由
      appStore.setRouteLoading(true)
      // 初始化路由（从持久化存储中恢复）
      userStore.initRoutes()

      // 获取处理后的路由
      const processedRoutes = userStore.getRoutes()

      if (processedRoutes.length === 0) {
        // 没有可用的路由数据
        appStore.setRouteLoadError('没有可用的路由数据')
        setTimeout(() => {
          appStore.setRouteLoading(false)
        }, 300)
        userStore.logout()
        error()
        next('/login')
        return
      }

      // 添加动态路由
      await addAsyncRoutes(processedRoutes)

      // 标记路由已加载
      isRouteLoaded = true
      setTimeout(() => {
        appStore.setRouteLoading(false)
      }, 300)

      // 动态路由加载完成，重新导航
      // 重新导航到目标路由，使用replace避免历史记录堆叠
      setTimeout(() => finish(), 300)
      next({ path: to.path, query: to.query, hash: to.hash, replace: true })
      return
    } catch (err) {
      console.error('[路由守卫] 动态路由加载失败:', err)
      appStore.setRouteLoadError(err instanceof Error ? err.message : '路由加载失败')
      // appStore.setRouteLoading(false)

      // 加载失败，清除状态并跳转到登录页
      userStore.logout()
      resetRouteLoadState()
      error()
      next('/login')
      return
    }
  }

  // 路由已加载，直接通过
  setTimeout(() => {
    appStore.setRouteLoading(false)
  }, 300)
  setTimeout(() => finish(), 200)
  next()
})

// 监听登出事件，重置路由状态
router.beforeResolve((to) => {
  const userStore = useUserStore()

  // 如果用户已登出，重置路由加载状态
  if (!userStore.isUserDataValid && isRouteLoaded) {
    // 用户已登出，重置路由状态
    resetRouteLoadState()
  }
})

export default router
