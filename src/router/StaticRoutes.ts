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
      // 表单页
      {
        path: 'form',
        name: 'Form',
        meta: { title: '表单页', icon: 'FormOutlined', sort: 4 },
        children: [
          {
            path: 'basic',
            name: 'BasicForm',
            component: 'template/form/BasicFormView',
            meta: { title: '基础表单', icon: 'EditOutlined' },
          },
          {
            path: 'advanced',
            name: 'AdvancedForm',
            component: 'template/form/AdvancedFormView',
            meta: { title: '高级表单', icon: 'FormOutlined' },
          },
        ],
      },
      // 表格页
      {
        path: 'table',
        name: 'Table',
        meta: { title: '表格页', icon: 'TableOutlined', sort: 5 },
        children: [
          {
            path: 'example',
            name: 'TableExample',
            component: 'template/table/TableExample',
            meta: { title: '表格示例', icon: 'TableOutlined' },
          },
          {
            path: 'enhanced',
            name: 'EnhancedTableExample',
            component: 'template/table/EnhancedTableExample',
            meta: { title: '增强表格', icon: 'SettingOutlined' },
          },
          {
            path: 'basic',
            name: 'BasicTable',
            component: 'template/table/BasicTableView',
            meta: { title: '基础表格', icon: 'UnorderedListOutlined' },
          },
          {
            path: 'advanced',
            name: 'AdvancedTable',
            component: 'template/table/AdvancedTableView',
            meta: { title: '高级表格', icon: 'TableOutlined' },
          },
        ],
      },
      // 图表页
      {
        path: 'charts',
        name: 'Charts',
        meta: { title: '图表页', icon: 'BarChartOutlined', sort: 6 },
        children: [
          {
            path: 'template',
            name: 'ChartsTemplate',
            component: 'template/charts/ChartsTemplate',
            meta: { title: '图表模板', icon: 'DashboardOutlined' },
          },
          {
            path: 'bar',
            name: 'BarChart',
            component: 'template/charts/BarChartView',
            meta: { title: '柱状图', icon: 'BarChartOutlined' },
          },
          {
            path: 'line',
            name: 'LineChart',
            component: 'template/charts/LineChartView',
            meta: { title: '折线图', icon: 'LineChartOutlined' },
          },
        ],
      },
      // 消息提示
      {
        path: 'message',
        name: 'MessageExample',
        component: 'template/message/MessageExample',
        meta: { title: '消息提示', icon: 'NotificationOutlined' },
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
