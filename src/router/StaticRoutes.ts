// 静态路由配置，支持嵌套路由和菜单分组，component为字符串，供import.meta.glob动态加载
// 后续stores/modules/user.ts可用import.meta.glob('/src/views/**/*.vue')自动匹配

import type { AppRouteRecordRaw } from './index'

export const staticRoutes: AppRouteRecordRaw[] = [
  // 仪表盘 - 使用子目录中的文件
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: 'dashboard/DashboardView',
    meta: { title: '仪表盘', icon: 'DashboardOutlined', sort: 1 },
  },
  // 系统管理
  {
    path: '/system',
    name: 'System',
    meta: { title: '系统管理', icon: 'SettingOutlined', sort: 3 },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: 'users/UserListView',
        meta: { title: '用户列表', icon: 'TeamOutlined' },
      },
      {
        path: 'roles',
        name: 'UserRoles',
        component: 'users/UserRolesView',
        meta: { title: '用户角色', icon: 'SafetyCertificateOutlined' },
      },
      {
        path: 'menu',
        name: 'MenuManagement',
        component: 'system/MenuManagementView',
        meta: { title: '菜单管理', icon: 'MenuOutlined' },
      },
    ],
  },
  // 模板示例
  {
    path: '/template',
    name: 'Template',
    meta: { title: '模板示例', icon: 'TemplateOutlined', sort: 4 },
    children: [
      // 表格示例
      {
        path: 'table',
        name: 'Table',
        meta: { title: '表格示例', icon: 'TableOutlined', sort: 1 },
        children: [
          {
            path: 'basic',
            name: 'BasicTableExample',
            component: 'template/table/BasicTableExample',
            meta: { title: '基础表格', icon: 'UnorderedListOutlined' },
          },
          {
            path: 'advanced',
            name: 'AdvancedTableExample',
            component: 'template/table/AdvancedTableExample',
            meta: { title: '高级表格', icon: 'SettingOutlined' },
          },
        ],
      },
      // 图表示例
      {
        path: 'charts',
        name: 'ChartsExample',
        component: 'template/charts/ChartsExample',
        meta: { title: '图表示例', icon: 'BarChartOutlined', sort: 2 },
      },
      // 消息示例
      {
        path: 'message',
        name: 'MessageExample',
        component: 'template/message/MessageExample',
        meta: { title: '消息示例', icon: 'NotificationOutlined', sort: 3 },
      },
      // 图标示例
      {
        path: 'icon',
        name: 'IconExample',
        component: 'template/icon/IconExample',
        meta: { title: '图标示例', icon: 'AppstoreOutlined', sort: 4 },
      },
    ],
  },

  // 设置 - 使用子目录中的文件
  {
    path: '/settings',
    name: 'Settings',
    component: 'settings/SettingsView',
    meta: { title: '设置', icon: 'ToolOutlined', sort: 7, hidden: true },
  },
  // 个人中心
  {
    path: '/profile',
    name: 'Profile',
    component: 'profile/ProfileView',
    meta: { title: '个人中心', icon: 'UserOutlined', sort: 8, hidden: true },
  },
  // 登录（隐藏）
  {
    path: '/login',
    name: 'Login',
    component: 'auth/LoginView',
    meta: { title: '登录', hidden: true },
  },
  // 404页面（隐藏）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: 'error/NotFoundView',
    meta: { title: '页面未找到', hidden: true },
  },
]
