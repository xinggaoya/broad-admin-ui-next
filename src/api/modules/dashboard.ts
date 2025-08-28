import { request } from '../request'
import type {
  StatCardData,
  ChartData,
  LineChartData,
  PieChartData,
  DashboardStats,
  TrendItem,
  RealTimeData
} from '../types/dashboard.types'

// 获取仪表盘统计数据
export const getDashboardStats = () => {
  return request.get<DashboardStats>('/api/dashboard/stats')
}

// 获取用户趋势数据
export const getUserTrendData = () => {
  return request.get<LineChartData[]>('/api/dashboard/user-trend')
}

// 获取订单趋势数据
export const getOrderTrendData = () => {
  return request.get<LineChartData[]>('/api/dashboard/order-trend')
}

// 获取用户分布数据
export const getUserDistribution = () => {
  return request.get<PieChartData[]>('/api/dashboard/user-distribution')
}

// 获取业务分布数据
export const getBusinessDistribution = () => {
  return request.get<PieChartData[]>('/api/dashboard/business-distribution')
}

// 获取趋势排行榜
export const getTrendRanking = () => {
  return request.get<TrendItem[]>('/api/dashboard/trend-ranking')
}

// 获取实时数据
export const getRealTimeData = () => {
  return request.get<RealTimeData>('/api/dashboard/real-time')
}

// 获取服务器监控数据
export const getServerMonitorData = () => {
  return request.get<RealTimeData['servers']>('/api/dashboard/server-monitor')
}

// 获取交易统计
export const getTransactionStats = () => {
  return request.get<RealTimeData['transactions']>('/api/dashboard/transactions')
}