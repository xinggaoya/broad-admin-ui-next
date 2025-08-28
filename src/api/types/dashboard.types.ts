// Dashboard 数据类型定义

export interface StatCardData {
  title: string
  value: number | string
  prefix?: string
  suffix?: string
  change?: number
  changeType?: 'increase' | 'decrease'
  isLoading?: boolean
  icon: string
  color: string
  bodyStyle?: Record<string, string>
}

export interface ChartData {
  name: string
  value: number | string
  [key: string]: any
}

export interface LineChartData {
  date: string
  [key: string]: any
}

export interface PieChartData {
  name: string
  value: number
  percent?: number
  itemStyle?: {
    color: string
  }
}

export interface DashboardStats {
  totalUsers: number
  totalVisits: number
  totalOrders: number
  totalRevenue: number
  userGrowth: number
  visitGrowth: number
  orderGrowth: number
  revenueGrowth: number
}

export interface TrendItem {
  key: string
  name: string
  value: number
  trend: 'up' | 'down' | 'flat'
  percentage: number
}

export interface RealTimeData {
  users: {
    online: number
    registered: number
    active: number
  }
  servers: {
    cpu: number
    memory: number
    disk: number
    network: number
  }
  transactions: {
    total: number
    success: number
    failed: number
    pending: number
  }
}