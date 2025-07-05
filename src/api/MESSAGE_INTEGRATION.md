# Naive UI 消息系统集成文档

## 概述

本项目已成功集成 Naive UI 的消息提示系统，包括 Message、Notification、Dialog、LoadingBar 和 Modal 等组件，并与现有的主题系统完美结合。

## 文件结构

```
src/
├── utils/
│   └── message.ts           # 消息提示封装
├── api/
│   └── request.ts           # API 请求封装（已集成消息提示）
└── views/template/message/
    └── MessageExample.vue   # 消息提示示例页面
```

## 主要功能

### 1. 完整的消息 API 封装

- **messageApi**: 全局消息提示
- **notificationApi**: 右侧通知
- **dialogApi**: 模态对话框
- **loadingBarApi**: 顶部加载条
- **modalApi**: 自定义模态框

### 2. 主题系统集成

- 自动应用当前主题颜色
- 支持明暗主题切换
- 响应式主题配置

### 3. API 请求集成

- 自动显示加载状态
- 统一错误提示
- 请求成功/失败反馈

## 使用方法

### 基础使用

```typescript
import { messageApi, notificationApi, dialogApi } from '../utils/message'

// 消息提示
messageApi.success('操作成功')
messageApi.error('操作失败')
messageApi.warning('警告信息')
messageApi.info('提示信息')

// 通知
notificationApi.success('标题', '详细内容')
notificationApi.error('错误标题', '错误详情')

// 对话框
await dialogApi.confirm('确认', '确定要执行此操作吗？')
dialogApi.info('信息', '这是一条信息')
```

### 自动导入（推荐）

由于已配置自动导入，可以直接在组件中使用：

```vue
<script setup lang="ts">
// 无需手动导入，直接使用
const handleSuccess = () => {
  messageApi.success('操作成功！')
}

const handleConfirm = async () => {
  try {
    await dialogApi.confirm('确认删除', '此操作不可撤销')
    messageApi.success('删除成功')
  } catch {
    messageApi.info('已取消操作')
  }
}
</script>
```

### API 请求中的自动提示

```typescript
import { authApi } from '../api'

// API 请求会自动显示加载状态和错误提示
const login = async () => {
  try {
    const result = await authApi.login({
      username: 'admin',
      password: '123456',
    })
    // 成功后可以显示自定义消息
    messageApi.success('登录成功！')
  } catch (error) {
    // 错误已通过 API 封装自动显示
    console.log('登录失败')
  }
}
```

## 配置选项

### 自定义请求配置

```typescript
import { request } from '../api'

// 禁用自动 loading 和错误提示
const response = await request.get(
  '/api/data',
  {},
  {
    loading: false,
    showError: false,
    customErrorHandler: (error) => {
      // 自定义错误处理
      notificationApi.error('请求失败', error.message)
    },
  },
)
```

### 主题响应

所有消息组件都会自动响应主题变化：

```typescript
import { useThemeStore } from '../stores/modules/theme'

const themeStore = useThemeStore()

// 切换主题
themeStore.toggleTheme()

// 消息组件会自动应用新主题
messageApi.success('主题已切换')
```

## 示例页面

访问 `/template/message` 路由可以查看完整的示例页面，包括：

- 所有类型的消息提示演示
- 主题切换测试
- API 请求集成演示
- 自定义对话框示例

## 技术特性

- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **主题集成**: 与项目主题系统无缝集成
- ✅ **自动导入**: 支持 Vite 自动导入，无需手动引入
- ✅ **错误处理**: 统一的错误处理和用户反馈
- ✅ **加载状态**: 自动的加载状态管理
- ✅ **响应式**: 支持不同屏幕尺寸
- ✅ **可定制**: 灵活的配置选项

## 注意事项

1. **依赖关系**: 确保项目已安装 `naive-ui` 依赖
2. **主题配置**: 消息组件依赖 `useThemeStore`，确保主题 store 正常工作
3. **自动导入**: 如果自动导入不生效，请重启开发服务器
4. **错误处理**: API 请求的错误会自动显示，避免重复提示

## 更新日志

- **v1.0.0**: 初始版本，集成基础消息功能
- **v1.1.0**: 添加主题系统集成
- **v1.2.0**: 完善 API 请求集成和自动导入配置

## 相关链接

- [Naive UI 官方文档](https://www.naiveui.com/)
- [Vue 3 文档](https://vuejs.org/)
- [Pinia 状态管理](https://pinia.vuejs.org/)
