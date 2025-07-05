import type { Component } from 'vue'
import {
  // 通用图标
  QuestionCircleOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  TableOutlined,
  FormOutlined,
  // 图表类图标
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  // 导航类图标
  UnorderedListOutlined,
  MenuOutlined,
  HomeOutlined,
  FolderOutlined,
  AppstoreOutlined,
  // 用户类图标
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  ContactsOutlined,
  // 系统类图标
  DatabaseOutlined,
  FileOutlined,
  SafetyCertificateOutlined,
  KeyOutlined,
  // 操作类图标
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  ExportOutlined,
  ImportOutlined,
  // 状态类图标
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  // 箭头类图标
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  // 多媒体图标
  PictureOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  // 工具类图标
  ToolOutlined,
  BugOutlined,
  CodeOutlined,
  ApiOutlined,
  // 商业类图标
  ShoppingCartOutlined,
  CreditCardOutlined,
  DollarOutlined,
  BankOutlined,
  // 通讯类图标
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  NotificationOutlined,
  // 时间类图标
  ClockCircleOutlined,
  CalendarOutlined,
  HistoryOutlined,
  // 地理位置图标
  EnvironmentOutlined,
  GlobalOutlined,
  CompassOutlined,
  // 安全类图标
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  // 文档类图标
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileTextOutlined,
  // 设备类图标
  MobileOutlined,
  TabletOutlined,
  LaptopOutlined,
  DesktopOutlined,
  // 网络类图标
  WifiOutlined,
  CloudOutlined,
  LinkOutlined,
  DisconnectOutlined,
  // 其他常用图标
  HeartOutlined,
  StarOutlined,
  LikeOutlined,
  DislikeOutlined,
  GiftOutlined,
  TrophyOutlined,
  CrownOutlined,
  FireOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  RocketOutlined,
  FlagOutlined,
  TagOutlined,
  TagsOutlined,
  BookOutlined,
  ReadOutlined,
  PrinterOutlined,
  ScanOutlined,
  CameraOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  CustomerServiceOutlined,
  RobotOutlined,
  ExperimentOutlined,
  FunnelPlotOutlined,
  PartitionOutlined,
  SlackOutlined,
  SketchOutlined,
  ChromeOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  GithubOutlined,
  GitlabOutlined,
  WechatOutlined,
  QqOutlined,
  DingdingOutlined,
  AntDesignOutlined,
} from '@vicons/antd'

// 图标分类接口
export interface IconCategory {
  name: string
  icons: string[]
}

// 图标分类映射
export interface IconCategories {
  [key: string]: IconCategory
}

// 图标映射表
export const iconMap = new Map<string, Component>([
  // 通用图标
  ['QuestionCircleOutlined', QuestionCircleOutlined],
  ['DashboardOutlined', DashboardOutlined],
  ['UserOutlined', UserOutlined],
  ['SettingOutlined', SettingOutlined],
  ['TableOutlined', TableOutlined],
  ['FormOutlined', FormOutlined],

  // 图表类图标
  ['BarChartOutlined', BarChartOutlined],
  ['LineChartOutlined', LineChartOutlined],
  ['PieChartOutlined', PieChartOutlined],
  ['AreaChartOutlined', AreaChartOutlined],

  // 导航类图标
  ['UnorderedListOutlined', UnorderedListOutlined],
  ['MenuOutlined', MenuOutlined],
  ['HomeOutlined', HomeOutlined],
  ['FolderOutlined', FolderOutlined],
  ['AppstoreOutlined', AppstoreOutlined],

  // 用户类图标
  ['TeamOutlined', TeamOutlined],
  ['UserAddOutlined', UserAddOutlined],
  ['UserDeleteOutlined', UserDeleteOutlined],
  ['ContactsOutlined', ContactsOutlined],

  // 系统类图标
  ['DatabaseOutlined', DatabaseOutlined],
  ['FileOutlined', FileOutlined],
  ['SafetyCertificateOutlined', SafetyCertificateOutlined],
  ['KeyOutlined', KeyOutlined],

  // 操作类图标
  ['SearchOutlined', SearchOutlined],
  ['PlusOutlined', PlusOutlined],
  ['EditOutlined', EditOutlined],
  ['DeleteOutlined', DeleteOutlined],
  ['CopyOutlined', CopyOutlined],
  ['ExportOutlined', ExportOutlined],
  ['ImportOutlined', ImportOutlined],

  // 状态类图标
  ['CheckCircleOutlined', CheckCircleOutlined],
  ['CloseCircleOutlined', CloseCircleOutlined],
  ['InfoCircleOutlined', InfoCircleOutlined],
  ['WarningOutlined', WarningOutlined],

  // 箭头类图标
  ['ArrowUpOutlined', ArrowUpOutlined],
  ['ArrowDownOutlined', ArrowDownOutlined],
  ['ArrowLeftOutlined', ArrowLeftOutlined],
  ['ArrowRightOutlined', ArrowRightOutlined],

  // 多媒体图标
  ['PictureOutlined', PictureOutlined],
  ['PlayCircleOutlined', PlayCircleOutlined],
  ['PauseCircleOutlined', PauseCircleOutlined],
  ['SoundOutlined', SoundOutlined],

  // 工具类图标
  ['ToolOutlined', ToolOutlined],
  ['BugOutlined', BugOutlined],
  ['CodeOutlined', CodeOutlined],
  ['ApiOutlined', ApiOutlined],

  // 商业类图标
  ['ShoppingCartOutlined', ShoppingCartOutlined],
  ['CreditCardOutlined', CreditCardOutlined],
  ['DollarOutlined', DollarOutlined],
  ['BankOutlined', BankOutlined],

  // 通讯类图标
  ['MailOutlined', MailOutlined],
  ['PhoneOutlined', PhoneOutlined],
  ['MessageOutlined', MessageOutlined],
  ['NotificationOutlined', NotificationOutlined],

  // 时间类图标
  ['ClockCircleOutlined', ClockCircleOutlined],
  ['CalendarOutlined', CalendarOutlined],
  ['HistoryOutlined', HistoryOutlined],

  // 地理位置图标
  ['EnvironmentOutlined', EnvironmentOutlined],
  ['GlobalOutlined', GlobalOutlined],
  ['CompassOutlined', CompassOutlined],

  // 安全类图标
  ['LockOutlined', LockOutlined],
  ['UnlockOutlined', UnlockOutlined],
  ['EyeOutlined', EyeOutlined],
  ['EyeInvisibleOutlined', EyeInvisibleOutlined],

  // 文档类图标
  ['FilePdfOutlined', FilePdfOutlined],
  ['FileWordOutlined', FileWordOutlined],
  ['FileExcelOutlined', FileExcelOutlined],
  ['FileImageOutlined', FileImageOutlined],
  ['FileTextOutlined', FileTextOutlined],

  // 设备类图标
  ['MobileOutlined', MobileOutlined],
  ['TabletOutlined', TabletOutlined],
  ['LaptopOutlined', LaptopOutlined],
  ['DesktopOutlined', DesktopOutlined],

  // 网络类图标
  ['WifiOutlined', WifiOutlined],
  ['CloudOutlined', CloudOutlined],
  ['LinkOutlined', LinkOutlined],
  ['DisconnectOutlined', DisconnectOutlined],

  // 其他常用图标
  ['HeartOutlined', HeartOutlined],
  ['StarOutlined', StarOutlined],
  ['LikeOutlined', LikeOutlined],
  ['DislikeOutlined', DislikeOutlined],
  ['GiftOutlined', GiftOutlined],
  ['TrophyOutlined', TrophyOutlined],
  ['CrownOutlined', CrownOutlined],
  ['FireOutlined', FireOutlined],
  ['ThunderboltOutlined', ThunderboltOutlined],
  ['BulbOutlined', BulbOutlined],
  ['RocketOutlined', RocketOutlined],
  ['FlagOutlined', FlagOutlined],
  ['TagOutlined', TagOutlined],
  ['TagsOutlined', TagsOutlined],
  ['BookOutlined', BookOutlined],
  ['ReadOutlined', ReadOutlined],
  ['PrinterOutlined', PrinterOutlined],
  ['ScanOutlined', ScanOutlined],
  ['CameraOutlined', CameraOutlined],
  ['VideoCameraOutlined', VideoCameraOutlined],
  ['AudioOutlined', AudioOutlined],
  ['CustomerServiceOutlined', CustomerServiceOutlined],
  ['RobotOutlined', RobotOutlined],
  ['ExperimentOutlined', ExperimentOutlined],
  ['FunnelPlotOutlined', FunnelPlotOutlined],
  ['PartitionOutlined', PartitionOutlined],
  ['SlackOutlined', SlackOutlined],
  ['SketchOutlined', SketchOutlined],
  ['ChromeOutlined', ChromeOutlined],
  ['YoutubeOutlined', YoutubeOutlined],
  ['FacebookOutlined', FacebookOutlined],
  ['TwitterOutlined', TwitterOutlined],
  ['InstagramOutlined', InstagramOutlined],
  ['LinkedinOutlined', LinkedinOutlined],
  ['GithubOutlined', GithubOutlined],
  ['GitlabOutlined', GitlabOutlined],
  ['WechatOutlined', WechatOutlined],
  ['QqOutlined', QqOutlined],
  ['DingdingOutlined', DingdingOutlined],
  ['AntDesignOutlined', AntDesignOutlined],
])

// 获取所有可用的图标
export const getAllIcons = (): string[] => {
  return Array.from(iconMap.keys()).sort()
}

// 获取图标分类
export const getIconCategories = (): IconCategories => {
  return {
    general: {
      name: '通用',
      icons: [
        'DashboardOutlined',
        'UserOutlined',
        'SettingOutlined',
        'TableOutlined',
        'FormOutlined',
      ],
    },
    chart: {
      name: '图表',
      icons: ['BarChartOutlined', 'LineChartOutlined', 'PieChartOutlined', 'AreaChartOutlined'],
    },
    navigation: {
      name: '导航',
      icons: [
        'UnorderedListOutlined',
        'MenuOutlined',
        'HomeOutlined',
        'FolderOutlined',
        'AppstoreOutlined',
      ],
    },
    user: {
      name: '用户',
      icons: ['TeamOutlined', 'UserAddOutlined', 'UserDeleteOutlined', 'ContactsOutlined'],
    },
    system: {
      name: '系统',
      icons: ['DatabaseOutlined', 'FileOutlined', 'SafetyCertificateOutlined', 'KeyOutlined'],
    },
    action: {
      name: '操作',
      icons: [
        'SearchOutlined',
        'PlusOutlined',
        'EditOutlined',
        'DeleteOutlined',
        'CopyOutlined',
        'ExportOutlined',
        'ImportOutlined',
      ],
    },
    status: {
      name: '状态',
      icons: [
        'CheckCircleOutlined',
        'CloseCircleOutlined',
        'InfoCircleOutlined',
        'WarningOutlined',
      ],
    },
    arrow: {
      name: '箭头',
      icons: ['ArrowUpOutlined', 'ArrowDownOutlined', 'ArrowLeftOutlined', 'ArrowRightOutlined'],
    },
    media: {
      name: '多媒体',
      icons: ['PictureOutlined', 'PlayCircleOutlined', 'PauseCircleOutlined', 'SoundOutlined'],
    },
    tool: {
      name: '工具',
      icons: ['ToolOutlined', 'BugOutlined', 'CodeOutlined', 'ApiOutlined'],
    },
    business: {
      name: '商业',
      icons: ['ShoppingCartOutlined', 'CreditCardOutlined', 'DollarOutlined', 'BankOutlined'],
    },
    communication: {
      name: '通讯',
      icons: ['MailOutlined', 'PhoneOutlined', 'MessageOutlined', 'NotificationOutlined'],
    },
    time: {
      name: '时间',
      icons: ['ClockCircleOutlined', 'CalendarOutlined', 'HistoryOutlined'],
    },
    location: {
      name: '位置',
      icons: ['EnvironmentOutlined', 'GlobalOutlined', 'CompassOutlined'],
    },
    security: {
      name: '安全',
      icons: ['LockOutlined', 'UnlockOutlined', 'EyeOutlined', 'EyeInvisibleOutlined'],
    },
    document: {
      name: '文档',
      icons: [
        'FilePdfOutlined',
        'FileWordOutlined',
        'FileExcelOutlined',
        'FileImageOutlined',
        'FileTextOutlined',
      ],
    },
    device: {
      name: '设备',
      icons: ['MobileOutlined', 'TabletOutlined', 'LaptopOutlined', 'DesktopOutlined'],
    },
    network: {
      name: '网络',
      icons: ['WifiOutlined', 'CloudOutlined', 'LinkOutlined', 'DisconnectOutlined'],
    },
    social: {
      name: '社交',
      icons: [
        'YoutubeOutlined',
        'FacebookOutlined',
        'TwitterOutlined',
        'InstagramOutlined',
        'LinkedinOutlined',
        'GithubOutlined',
        'GitlabOutlined',
        'WechatOutlined',
        'QqOutlined',
        'DingdingOutlined',
      ],
    },
    others: {
      name: '其他',
      icons: [
        'HeartOutlined',
        'StarOutlined',
        'LikeOutlined',
        'DislikeOutlined',
        'GiftOutlined',
        'TrophyOutlined',
        'CrownOutlined',
        'FireOutlined',
        'ThunderboltOutlined',
        'BulbOutlined',
        'RocketOutlined',
        'FlagOutlined',
        'TagOutlined',
        'TagsOutlined',
        'BookOutlined',
        'ReadOutlined',
        'PrinterOutlined',
        'ScanOutlined',
        'CameraOutlined',
        'VideoCameraOutlined',
        'AudioOutlined',
        'CustomerServiceOutlined',
        'RobotOutlined',
        'ExperimentOutlined',
        'FunnelPlotOutlined',
        'PartitionOutlined',
        'SlackOutlined',
        'SketchOutlined',
        'ChromeOutlined',
        'AntDesignOutlined',
      ],
    },
  }
}

// 检查图标是否存在
export const hasIcon = (iconName: string): boolean => {
  return iconMap.has(iconName)
}

// 获取图标组件
export const getIconComponent = (iconName: string): Component | null => {
  return iconMap.get(iconName) || null
}

// 搜索图标
export const searchIcons = (keyword: string): string[] => {
  if (!keyword) return getAllIcons()

  const lowerKeyword = keyword.toLowerCase()
  return getAllIcons().filter((iconName) => iconName.toLowerCase().includes(lowerKeyword))
}

// 根据分类获取图标
export const getIconsByCategory = (categoryKey: string): string[] => {
  const categories = getIconCategories()
  return categories[categoryKey]?.icons || []
}
