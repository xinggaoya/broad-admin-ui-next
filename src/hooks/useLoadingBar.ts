import type { LoadingBarApi } from 'naive-ui'

let loadingBar: LoadingBarApi | null = null

/**
 * 使用Loading Bar的composable
 * 提供统一的loading bar控制方法
 */
export const useLoadingBar = () => {
  /**
   * 设置loading bar实例
   * @param instance loading bar实例
   */
  const setLoadingBar = (instance: LoadingBarApi) => {
    loadingBar = instance
  }

  /**
   * 开始loading
   */
  const start = () => {
    if (loadingBar) {
      // 开始 Loading Bar
      loadingBar.start()
    } else {
      // Loading Bar 实例未找到
    }
  }

  /**
   * 结束loading（成功）
   */
  const finish = () => {
    if (loadingBar) {
      // 完成 Loading Bar
      // 延迟一点时间确保能看到loading bar
      setTimeout(() => {
        loadingBar!.finish()
      }, 200)
    } else {
      // Loading Bar 实例未找到
    }
  }

  /**
   * 结束loading（错误）
   */
  const error = () => {
    if (loadingBar) {
      // Loading Bar 错误
      setTimeout(() => {
        loadingBar!.error()
      }, 200)
    } else {
      // Loading Bar 实例未找到
    }
  }

  return {
    setLoadingBar,
    start,
    finish,
    error,
  }
}
