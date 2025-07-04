import { h, type Component, type VNode } from 'vue'
import { NIcon } from 'naive-ui'
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TableOutlined,
  FormOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  DatabaseOutlined,
  FileOutlined,
  LineChartOutlined,
  PieChartOutlined,
  MenuOutlined,
  HomeOutlined,
  FolderOutlined,
} from '@vicons/antd'

/**
 * 菜单选项接口
 */
export interface MenuOption {
  key: string
  label: string
  path?: string
  icon?: () => VNode
  disabled?: boolean
  children?: MenuOption[]
}

/**
 * 图标映射表
 */
const iconMap: Record<string, Component> = {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TableOutlined,
  FormOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  DatabaseOutlined,
  FileOutlined,
  LineChartOutlined,
  PieChartOutlined,
  MenuOutlined,
  HomeOutlined,
  FolderOutlined,
}

/**
 * 渲染菜单图标
 * @param iconName 图标名称
 * @returns 图标渲染函数
 */
export const renderIcon = (iconName?: string) => {
  if (!iconName || !iconMap[iconName]) {
    return () => h(NIcon, null, { default: () => h(FolderOutlined) })
  }
  const IconComponent = iconMap[iconName]
  return () => h(NIcon, null, { default: () => h(IconComponent) })
}
