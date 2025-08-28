# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🛠️ Development Commands

### Core Commands
```bash
# 开发环境启动
pnpm dev

# 生产构建
pnpm build

# 代码检查与格式化
pnpm lint          # 运行所有 lint 检查
pnpm lint:eslint   # ESLint 检查
pnpm lint:oxlint   # Oxlint 快速检查
pnpm format        # Prettier 格式化

# 类型检查
pnpm type-check

# 预览构建结果
pnpm preview
```

### 快捷操作
- `Ctrl+S` 保存时自动格式化 (已配置 ESLint + Prettier)
- 组件自动导入：无需手动 import 组件和常用 API
- 路由基于文件自动解析

## 🏗️ Architecture Overview

### 技术栈
- **框架**: Vue 3.5+ (Composition API)
- **构建**: Vite 7.0+ 
- **UI**: Naive UI 2.42+ (基于 Vue3 的组件库)
- **状态管理**: Pinia 3.0+ (模块化 store)
- **路由**: Vue Router 4.5+ (动态路由)
- **网络请求**: Alova.js (轻量级 HTTP 客户端)
- **图标**: @vicons 系列 (Ant Design, Ionicons5)
- **样式**: CSS Modules + Naive UI 样式系统
- **代码规范**: ESLint + Prettier + Oxlint

### 项目结构
```
src/
├── api/               # API 接口定义
│   ├── modules/       # 业务模块 API
│   ├── request.ts     # 请求拦截配置
│   └── types.ts       # 类型定义
├── components/        # 公共组件
│   ├── layout/        # 布局组件 (Sidebar, Header等)
│   ├── table/         # 表格相关组件
│   └── icon/          # 图标组件
├── stores/            # Pinia 状态管理
│   ├── modules/       # 分模块状态
│   │   ├── app.ts     # 应用级状态 (侧边栏,动画等)
│   │   ├── theme.ts   # 主题配置
│   │   └── user.ts    # 用户状态
├── views/             # 页面组件
│   ├── auth/          # 认证页面
│   ├── dashboard/     # 仪表盘
│   ├── system/        # 系统管理
│   ├── template/      # 示例模板页面
│   └── ...            # 其他业务页面
├── hooks/             # 组合式函数
├── utils/             # 工具函数
└── router/            # 路由配置
```

## 🎯 Key Features

### 动态路由系统
- **懒加载**: 路由按需加载，优化首屏性能
- **权限控制**: 基于用户角色的动态路由加载
- **缓存管理**: 页面缓存机制和标签页管理
- **自动导入**: 自动解析组件和 API 导入

### 主题系统
- **暗黑/亮色模式**: 一键切换主题
- **自定义主色调**: 支持多种预置主题色
- **动画配置**: 页面切换动画自定义
- **布局配置**: 侧边栏折叠、标签页开关

### 权限管理
- **用户状态**: user.ts 管理用户信息和权限
- **路由守卫**: router/index.ts 实现登录验证
- **动态菜单**: 基于权限的菜单渲染
- **持久化存储**: localStorage 保存用户偏好设置

## 📁 Key Files & Patterns

### API 调用规范
```typescript
// 在 api/modules/ 定义业务 API
export const getUserList = (params: UserQuery) => 
  request.get<PageResult<User>>('/api/users', { params })

// 在组件中使用
const { data, loading, error } = useRequest(() => getUserList(queryParams))
```

### 状态管理模式
```typescript
// 使用组合式 store
export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const toggleSidebar = () => sidebarCollapsed.value = !sidebarCollapsed.value
  return { sidebarCollapsed, toggleSidebar }
})
```

### 组件开发规范
```vue
<script setup lang="ts">
// 自动导入: ref, computed, useRouter 等无需手动引入
// 自动导入: Naive UI 组件可直接使用 (n-button, n-input等)

const props = defineProps<{
  name: string
}>()

const emit = defineEmits<{
  update: [value: string]
}>()
</script>

<template>
  <div class="component-class">
    <n-button>{{ props.name }}</n-button>
  </div>
</template>

<style scoped>
.component-class {
  /* 样式使用 kebab-case */
}
</style>
```

## 🔧 Configuration Files

- **vite.config.ts**: 构建配置，自动导入、路径别名
- **tsconfig.json**: TypeScript 配置，严格模式启用
- **eslint.config.ts**: ESLint 规则配置
- **auto-imports.d.ts**: 自动导入的类型声明
- **components.d.ts**: 自动注册的组件声明

## 🎨 Theme & Layout

### 主题配置文件
- **配色系统**: 基于 Naive UI 的主题 token
- **自定义变量**: CSS 自定义属性支持主题切换
- **组件样式**: 统一使用 Naive UI 设计规范

### 布局响应式
- **断点**: desktop (≥1024px), tablet (768-1023px), mobile (<768px)
- **侧边栏**: 桌面端可折叠，移动端抽屉式
- **内容区**: 自适应宽度，移动端滚动优化

## 🚀 Development Tips

### IDE 设置
- **推荐扩展**: Vue Language Features (Volar)
- **TypeScript**: 确保使用 workspace 版本的 typescript
- **ESLint**: 安装 "ESLint" 扩展进行实时检查

### 调试工具
- **Vue DevTools**: vite-plugin-vue-devtools 已集成
- **Pinia DevTools**: 状态管理调试面板
- **网络监控**: Alova.js 请求日志

### 常见操作
1. **添加新页面**: 在 views/ 下创建组件 → router/ 中添加路由
2. **添加 API**: 在 api/modules/ 定义 → 组件中直接使用
3. **状态管理**: 在 stores/modules/ 创建 store → 自动导入使用
4. **主题配置**: 修改 stores/modules/theme.ts 中的配置
5. **权限控制**: 在 user.ts 的用户角色中配置权限标识