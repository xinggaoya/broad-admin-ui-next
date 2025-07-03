# Broad Admin UI Next

🚀 一个基于 Vue 3 + Naive UI 的现代化管理后台系统，采用最新的前端技术栈构建，提供完整的企业级管理解决方案。

## ✨ 特性

- 🎨 **现代化设计** - 基于 Naive UI 组件库，提供美观简洁的界面
- 🌙 **主题切换** - 支持明暗主题切换，多种主题色彩配置
- 📱 **响应式布局** - 完美适配桌面端和移动端
- 🔐 **权限管理** - 完整的用户权限和角色管理系统
- 📊 **数据可视化** - 丰富的图表组件和数据展示
- 🎯 **TypeScript** - 全面的 TypeScript 支持，提供更好的开发体验
- ⚡ **性能优化** - 路由懒加载、组件缓存、代码分割
- 🔧 **开发友好** - 热重载、自动导入、ESLint 代码规范

## 🛠️ 技术栈

- **框架**: Vue 3.5+ (Composition API)
- **构建工具**: Vite 6.0+
- **UI 组件库**: Naive UI 2.42+
- **状态管理**: Pinia 3.0+
- **路由**: Vue Router 4.5+
- **语言**: TypeScript 5.8+
- **图标**: @vicons (Ant Design, Material, Tabler, Ionicons)
- **代码规范**: ESLint + Prettier + Oxlint

## 📦 功能模块

### 🏠 仪表盘
- 数据概览和统计图表
- 实时数据监控
- 快捷操作入口

### 👥 用户管理
- 用户列表管理
- 用户角色权限
- 用户信息编辑

### 📋 内容管理
- **表格管理**
  - 基础表格展示
  - 高级表格功能（排序、筛选、分页）
- **表单管理**
  - 基础表单组件
  - 高级表单验证

### 📊 数据分析
- 折线图分析
- 柱状图展示
- 数据可视化图表

### ⚙️ 系统管理
- 菜单管理
- 系统设置
- 个人资料管理

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 开发环境启动

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 代码检查和格式化

```bash
# ESLint 检查
pnpm lint

# 代码格式化
pnpm format
```

### 类型检查

```bash
pnpm type-check
```

## 📁 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
│   └── layout/      # 布局组件
├── router/          # 路由配置
├── stores/          # Pinia 状态管理
├── views/           # 页面组件
│   ├── auth/        # 认证相关页面
│   ├── charts/      # 图表页面
│   ├── dashboard/   # 仪表盘
│   ├── error/       # 错误页面
│   ├── form/        # 表单页面
│   ├── profile/     # 个人资料
│   ├── settings/    # 设置页面
│   ├── system/      # 系统管理
│   ├── table/       # 表格页面
│   └── users/       # 用户管理
├── App.vue          # 根组件
└── main.ts          # 应用入口
```

## 🎨 主题配置

系统支持多种主题配置：

- **明暗主题切换**：支持明亮和暗黑两种主题模式
- **主题色彩**：可自定义主色调、成功色、警告色、错误色等
- **动画效果**：支持多种页面切换动画（淡入淡出、滑动、缩放等）
- **布局配置**：侧边栏折叠、移动端适配等

## 📱 响应式设计

- **桌面端**：完整的管理界面，支持侧边栏折叠
- **平板端**：自适应布局调整
- **移动端**：抽屉式侧边栏，触摸友好的交互

## 🔧 开发工具配置

### 推荐 IDE

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### VSCode 扩展

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📞 联系

如有问题或建议，请通过 GitHub Issues 联系我们。
