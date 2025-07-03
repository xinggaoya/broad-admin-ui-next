<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <n-card v-for="stat in statsData" :key="stat.title" class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" :style="{ background: stat.color }">
            <n-icon size="24" color="white">
              <component :is="stat.icon" />
            </n-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-trend">
              <n-icon :color="stat.trend > 0 ? '#52c41a' : '#ff4d4f'" size="12">
                <ArrowUpOutlined v-if="stat.trend > 0" />
                <ArrowDownOutlined v-else />
              </n-icon>
              <span :style="{ color: stat.trend > 0 ? '#52c41a' : '#ff4d4f' }">
                {{ Math.abs(stat.trend) }}%
              </span>
            </div>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <n-card title="访问量趋势" class="chart-card">
        <div class="chart-placeholder">
          <n-empty description="图表组件待实现" />
        </div>
      </n-card>

      <n-card title="用户分布" class="chart-card">
        <div class="chart-placeholder">
          <n-empty description="图表组件待实现" />
        </div>
      </n-card>
    </div>

    <!-- 最近活动 -->
    <div class="activity-section">
      <n-card title="最近活动">
        <n-timeline>
          <n-timeline-item
            v-for="activity in recentActivities"
            :key="activity.id"
            :type="activity.type"
            :title="activity.title"
            :content="activity.content"
            :time="activity.time"
          />
        </n-timeline>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@vicons/antd'

defineOptions({
  name: 'DashboardView',
})

// 统计数据
const statsData = [
  {
    title: '总用户数',
    value: '12,568',
    icon: UserOutlined,
    color: '#1890ff',
    trend: 12.5,
  },
  {
    title: '总订单数',
    value: '8,429',
    icon: ShoppingCartOutlined,
    color: '#52c41a',
    trend: 8.2,
  },
  {
    title: '总收入',
    value: '¥186,429',
    icon: DollarOutlined,
    color: '#faad14',
    trend: -2.1,
  },
  {
    title: '页面浏览量',
    value: '98,764',
    icon: EyeOutlined,
    color: '#f759ab',
    trend: 15.8,
  },
]

// 最近活动
const recentActivities = [
  {
    id: 1,
    type: 'success',
    title: '用户注册',
    content: '新用户 John Doe 完成注册',
    time: '2分钟前',
  },
  {
    id: 2,
    type: 'info',
    title: '系统更新',
    content: '系统版本已更新至 v2.1.0',
    time: '1小时前',
  },
  {
    id: 3,
    type: 'warning',
    title: '服务器监控',
    content: '服务器CPU使用率达到80%',
    time: '3小时前',
  },
  {
    id: 4,
    type: 'error',
    title: '错误日志',
    content: '发现3个新的错误日志',
    time: '5小时前',
  },
]
</script>

<style scoped>
.dashboard-container {
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.chart-card {
  border-radius: 8px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-section {
  margin-bottom: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .stat-content {
    gap: 12px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
  }

  .stat-value {
    font-size: 20px;
  }
}

/* 暗黑模式适配 */
html.dark .stat-value {
  color: #fff;
}

html.dark .stat-title {
  color: #ccc;
}
</style>
