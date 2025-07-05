# 环境变量配置指南

## 概述

本项目使用 Vite 的环境变量功能来管理不同环境下的配置。环境变量文件遵循 Vite 的命名约定，支持开发环境、生产环境和本地环境的配置。

## 环境变量文件

### 文件类型说明

| 文件名             | 作用             | 是否提交到版本控制 |
| ------------------ | ---------------- | ------------------ |
| `env.example`      | 配置示例模板     | ✅ 是              |
| `env.development`  | 开发环境配置模板 | ✅ 是              |
| `env.production`   | 生产环境配置模板 | ✅ 是              |
| `.env.local`       | 本地环境配置     | ❌ 否              |
| `.env.development` | 开发环境配置     | ❌ 否              |
| `.env.production`  | 生产环境配置     | ❌ 否              |

### 快速开始

1. **复制配置文件**

   ```bash
   # 复制开发环境配置
   cp env.development .env.development

   # 复制生产环境配置
   cp env.production .env.production

   # 复制本地环境配置（可选）
   cp env.example .env.local
   ```

2. **修改配置**

   - 根据实际环境修改 API 地址、数据库连接等配置
   - 修改安全相关配置（加密密钥、token 等）
   - 调整功能开关和调试选项

3. **运行项目**

   ```bash
   # 开发环境
   npm run dev

   # 生产环境构建
   npm run build
   ```

## 环境变量说明

### 应用基本信息

| 变量名                 | 说明       | 示例值                                 |
| ---------------------- | ---------- | -------------------------------------- |
| `VITE_APP_NAME`        | 应用名称   | `Broad Admin UI Next`                  |
| `VITE_APP_VERSION`     | 应用版本   | `1.0.0`                                |
| `VITE_APP_DESCRIPTION` | 应用描述   | `基于 Vue 3 + Naive UI 的后台管理系统` |
| `VITE_APP_TITLE`       | 应用标题   | `Broad Admin`                          |
| `VITE_APP_SHORT_NAME`  | 应用短名称 | `BroadAdmin`                           |
| `VITE_APP_LOGO`        | 应用 Logo  | `/logo.png`                            |

### API 配置

| 变量名              | 说明                 | 示例值                  |
| ------------------- | -------------------- | ----------------------- |
| `VITE_API_BASE_URL` | API 基础地址         | `http://localhost:8080` |
| `VITE_API_PREFIX`   | API 前缀             | `/api/v1`               |
| `VITE_API_TIMEOUT`  | API 超时时间（毫秒） | `10000`                 |

### 开发服务器配置

| 变量名                  | 说明           | 示例值      |
| ----------------------- | -------------- | ----------- |
| `VITE_DEV_SERVER_HOST`  | 开发服务器主机 | `localhost` |
| `VITE_DEV_SERVER_PORT`  | 开发服务器端口 | `5173`      |
| `VITE_DEV_SERVER_HTTPS` | 是否启用 HTTPS | `false`     |

### 主题配置

| 变量名                 | 说明     | 示例值    |
| ---------------------- | -------- | --------- |
| `VITE_APP_THEME_COLOR` | 主题颜色 | `#18a058` |
| `VITE_APP_THEME_MODE`  | 主题模式 | `auto`    |

### 功能开关

| 变量名                 | 说明               | 示例值 |
| ---------------------- | ------------------ | ------ |
| `VITE_APP_MOCK`        | 是否启用 Mock 数据 | `true` |
| `VITE_APP_DEBUG`       | 是否启用调试模式   | `true` |
| `VITE_APP_DEVTOOLS`    | 是否启用开发者工具 | `true` |
| `VITE_APP_CONSOLE_LOG` | 是否启用控制台日志 | `true` |

### 安全配置

| 变量名                 | 说明             | 示例值                  |
| ---------------------- | ---------------- | ----------------------- |
| `VITE_APP_ENCRYPT_KEY` | 加密密钥         | `your-encrypt-key-here` |
| `VITE_APP_TOKEN_KEY`   | Token 请求头名称 | `Authorization`         |

### 上传配置

| 变量名                     | 说明                     | 示例值                         |
| -------------------------- | ------------------------ | ------------------------------ |
| `VITE_APP_UPLOAD_URL`      | 上传服务地址             | `http://localhost:8080/upload` |
| `VITE_APP_UPLOAD_MAX_SIZE` | 上传文件最大大小（字节） | `10485760`                     |

## 使用方式

### 在 Vue 组件中使用

```typescript
// 获取环境变量
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const appName = import.meta.env.VITE_APP_NAME
const isDebug = import.meta.env.VITE_APP_DEBUG === 'true'

// 使用示例
console.log('API Base URL:', apiBaseUrl)
console.log('App Name:', appName)
console.log('Debug Mode:', isDebug)
```

### 在 Vite 配置中使用

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      host: env.VITE_DEV_SERVER_HOST || 'localhost',
      port: parseInt(env.VITE_DEV_SERVER_PORT) || 5173,
      https: env.VITE_DEV_SERVER_HTTPS === 'true',
    },
    // 其他配置...
  }
})
```

## 环境变量类型声明

在 `env.d.ts` 中添加类型声明：

```typescript
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_DEBUG: string
  // 添加其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 注意事项

1. **安全性**：不要在环境变量中存储敏感信息，如密码、私钥等
2. **命名规范**：客户端可访问的环境变量必须以 `VITE_` 开头
3. **类型转换**：环境变量都是字符串类型，使用时需要进行类型转换
4. **本地配置**：`.env.local` 文件优先级最高，用于本地开发时的个性化配置
5. **版本控制**：只提交模板文件，实际配置文件应该被 `.gitignore` 忽略

## 常见问题

### Q: 为什么我的环境变量没有生效？

A: 检查以下几点：

- 环境变量名是否以 `VITE_` 开头
- 文件名是否正确（`.env.development`、`.env.production`）
- 是否重启了开发服务器
- 是否有语法错误（如多余的空格、引号等）

### Q: 如何在不同环境使用不同的配置？

A: 创建对应环境的配置文件：

- 开发环境：`.env.development`
- 生产环境：`.env.production`
- 本地环境：`.env.local`

### Q: 如何调试环境变量？

A: 在代码中添加以下代码查看所有环境变量：

```typescript
console.log('Environment variables:', import.meta.env)
```
