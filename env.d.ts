/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 应用基本信息
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_SHORT_NAME: string
  readonly VITE_APP_LOGO: string
  readonly VITE_APP_ENV: string

  // API 配置
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_PREFIX: string
  readonly VITE_API_TIMEOUT: string

  // 开发服务器配置
  readonly VITE_DEV_SERVER_HOST: string
  readonly VITE_DEV_SERVER_PORT: string
  readonly VITE_DEV_SERVER_HTTPS: string

  // 路由配置
  readonly VITE_APP_BASE_URL: string
  readonly VITE_APP_ROUTER_MODE: string

  // 主题配置
  readonly VITE_APP_THEME_COLOR: string
  readonly VITE_APP_THEME_MODE: string

  // 国际化配置
  readonly VITE_APP_LOCALE: string
  readonly VITE_APP_FALLBACK_LOCALE: string

  // 功能开关
  readonly VITE_APP_MOCK: string
  readonly VITE_APP_DEBUG: string
  readonly VITE_APP_DEVTOOLS: string
  readonly VITE_APP_CONSOLE_LOG: string

  // 安全配置
  readonly VITE_APP_ENCRYPT_KEY: string
  readonly VITE_APP_TOKEN_KEY: string

  // 上传配置
  readonly VITE_APP_UPLOAD_URL: string
  readonly VITE_APP_UPLOAD_MAX_SIZE: string

  // 代理配置
  readonly VITE_PROXY_TARGET: string

  // CDN 配置
  readonly VITE_APP_CDN_URL: string

  // 监控配置
  readonly VITE_APP_SENTRY_DSN: string
  readonly VITE_APP_ANALYTICS_ID: string

  // 构建配置
  readonly VITE_APP_BUILD_TIMESTAMP: string
  readonly VITE_APP_BUILD_HASH: string

  // 缓存配置
  readonly VITE_APP_CACHE_EXPIRES: string

  // 性能配置
  readonly VITE_APP_LAZY_LOADING: string
  readonly VITE_APP_CHUNK_SIZE_LIMIT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
