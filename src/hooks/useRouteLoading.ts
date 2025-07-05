import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { useLoadingBar } from './useLoadingBar.ts'

/**
 * 路由跳转loading状态管理hook
 * 提供带loading状态的路由跳转方法
 */
export const useRouteLoading = () => {
  const router = useRouter()
  const { start, finish, error } = useLoadingBar()

  /**
   * 带loading状态的路由跳转
   * @param to 目标路由
   * @param options 跳转选项
   */
  const navigateWithLoading = async (to: RouteLocationRaw, options?: { replace?: boolean }) => {
    try {
      start()

      // 添加最小延迟确保能看到loading bar
      await new Promise((resolve) => setTimeout(resolve, 100))

      if (options?.replace) {
        await router.replace(to)
      } else {
        await router.push(to)
      }

      // 确保loading bar显示足够时间
      await new Promise((resolve) => setTimeout(resolve, 300))

      finish()
    } catch (err) {
      console.error('路由跳转失败:', err)
      error()
      throw err
    }
  }

  /**
   * 带loading状态的路由返回
   */
  const goBackWithLoading = () => {
    try {
      start()
      router.go(-1)
      // 延迟结束loading，因为go方法是同步的
      setTimeout(() => {
        finish()
      }, 300)
    } catch (err) {
      console.error('路由返回失败:', err)
      error()
      throw err
    }
  }

  return {
    navigateWithLoading,
    goBackWithLoading,
    // 暴露原始方法，以便在需要时使用
    push: router.push,
    replace: router.replace,
    go: router.go,
    back: router.back,
    forward: router.forward,
  }
}
