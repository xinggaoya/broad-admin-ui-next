import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../stores/modules/user.ts'
import { useAppStore } from '../stores/modules/app.ts'
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

let isAddRoutes = false
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


    console.log('动态路由添加完成:', filteredRoutes.length, '个路由')
    return routes
  } catch (error) {
    console.error('添加动态路由失败:', error)
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


// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const appStore = useAppStore()

  console.log(`[路由] 导航: ${from.path} → ${to.path}`, {
    isLoggedIn: userStore.isLoggedIn,
    userRoutesLength: userStore.userRoutes.length,
    fromName: from.name,
    toName: to.name,
  })

  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Admin UI`
  } else {
    document.title = 'Admin UI'
  }

  // 白名单路由（无需登录验证的页面）
  const whiteList = ['/login', '/404']

  // 检查登录状态
  const token = localStorage.getItem('token')

  // 如果是白名单路由，直接通过
  if (whiteList.includes(to.path)) {
    // 如果已登录用户访问登录页，重定向到首页
    if (to.path === '/login' && token) {
      next('/dashboard')
      return
    }
    next()
    return
  }
  if (!token) {
    console.log('[路由] 用户未登录，重定向到登录页')
    next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    return
  }

  // 用户已登录，检查动态路由是否已加载
  if (!isAddRoutes) {
    // 如果用户有路由数据但路由未加载，先加载路由
    if (userStore.userRoutes.length > 0) {
      try {
        appStore.setRouteLoading(true)

        await addAsyncRoutes(userStore.getRoutes())

        appStore.setRouteLoading(false)

        isAddRoutes = true
        // 重新导航到目标路由，使用replace避免历史记录堆叠
        next({ path: to.path, query: to.query, hash: to.hash, replace: true })
        return
      } catch (error) {
        console.error('[路由] 动态路由加载失败:', error)
        appStore.setRouteLoadError(error instanceof Error ? error.message : '路由加载失败')
        appStore.setRouteLoading(false)

        // 加载失败，跳转到登录页
        userStore.logout()
        isAddRoutes = true
        next('/login')
        return
      }
    } else {
      // 用户已登录但没有路由数据，可能是刷新页面导致状态丢失
      console.log('[路由] 用户路由数据为空，可能需要重新登录')
      isAddRoutes = true
      userStore.logout()
      next('/login')
      return
    }
  }


  // 路由已加载，直接通过
  appStore.setRouteLoading(false)
  next()
})

export default router
