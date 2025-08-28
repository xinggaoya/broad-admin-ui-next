<template>
  <div class="enhanced-dashboard">
    <!-- 欢迎区域 -->
    <n-card class="welcome-card" hoverable>
      <div class="welcome-content">
        <div class="welcome-info">
          <n-avatar round :size="64" :src="userInfo?.avatar || defaultAvatar" />
          <div class="welcome-text">
            <h2>👋 欢迎回来，{{ userInfo?.nickname || '管理员' }}</h2>
            <p>{{ greetingMessage }} {{ currentTime }}</p>
            <n-tag :type="weatherTagType" :bordered="false">
              {{ weatherIcon }} 今日天气：{{ weatherDetail }}
            </n-tag>
          </div>
        </div>
        <div class="quick-stats">
          <div class="stat-item">
            <div class="stat-value">{{ onlineTime }}</div>
            <div class="stat-label">在线时长</div>
          </div>
        </div>
      </div>
    </n-card>

    <!-- 统计卡片区域 -->
    <div class="stats-section">
      <n-grid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
        <n-gi v-for="card in statCards" :key="card.title">
          <StatCard
            :title="card.title"
            :value="card.value"
            :prefix="card.prefix"
            :suffix="card.suffix"
            :change="card.change"
            :changeType="card.changeType"
            :icon="card.icon"
            :color="card.color"
            :isLoading="statsLoading"
          />
        </n-gi>
      </n-grid>
    </div>

    <!-- 图表分析区域 -->
    <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen">
      <!-- 访问趋势 -->
      <n-gi :span="screenStyle.span">
        <LineChart
          title="访问趋势分析"
          :data="visitTrendData"
          x-field="date"
          :y-fields="['visitors', 'pageViews', 'newUsers']"
          :colors="['#5470c6', '#91cc75', '#fac858']"
        />
      </n-gi>

      <!-- 用户活跃度 -->
      <n-gi :span="screenStyle.span">
        <LineChart
          title="用户活跃度"
          :data="activityData"
          x-field="date"
          :y-fields="['daily', 'weekly', 'monthly']"
          :colors="['#ee6666', '#73c0de', '#3ba272']"
          :area="false"
        />
      </n-gi>

      <!-- 业务分布 -->
      <n-gi span="1">
        <PieChart
          title="业务类型分布"
          :data="businessDistributionData"
          :show-label="false"
        />
      </n-gi>

      <!-- 收入分析 -->
      <n-gi span="1">
        <PieChart
          title="收入来源分布"
          :data="revenueSourceData"
          :radius="['45%', '80%']"
        />
      </n-gi>
    </n-grid>

    <!-- 实时监控区域 -->
    <div class="monitor-section">
      <n-card title="实时监控" hoverable>
        <n-tabs type="line">
          <!-- 服务器监控 -->
          <n-tab-pane name="server" tab="服务器状态">
            <ServerMonitorPanel :servers="serverStatus" />
          </n-tab-pane>

          <!-- 用户行为 -->
          <n-tab-pane name="user" tab="用户行为">
            <UserActivityPanel :activities="userActivities" />
          </n-tab-pane>

          <!-- 交易监控 -->
          <n-tab-pane name="transaction" tab="交易记录">
            <TransactionMonitorPanel :transactions="transactions" />
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>

    <!-- 快捷操作区域 -->
    <div class="quick-actions">
      <n-card title="快捷操作" hoverable>
        <n-grid :cols="6" :x-gap="16">
          <n-gi v-for="action in quickActions" :key="action.key">
            <n-button
              :type="action.type"
              :dashed="action.dashed"
              block
              @click="handleAction(action.key)"
            >
              {{ action.label }}
            </n-button>
          </n-gi>
        </n-grid>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { useNotification } from 'naive-ui'
import StatCard from '@/components/common/StatCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import ServerMonitorPanel from '@/components/dashboard/ServerMonitorPanel.vue'
import UserActivityPanel from '@/components/dashboard/UserActivityPanel.vue'
import TransactionMonitorPanel from '@/components/dashboard/TransactionMonitorPanel.vue'

const router = useRouter()
const userStore = useUserStore()
const notification = useNotification()

// 用户信息
const userInfo = computed(() => userStore.userInfo)
const defaultAvatar = ref('/app-icon.png')

// 响应式布局
const screenStyle = computed(() => ({
  cols: 2,
  span: 1,
  pieSpan: 1,
}))

// 欢迎和天气信息
const greetingMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '深夜好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 20) return '傍晚好'
  return '晚上好'
})

const currentTime = computed(() => new Date().toLocaleString('zh-CN', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))

const weatherIcon = ref('☀️')
const weatherDetail = ref('晴朗 | 28°C | 东南风')
const weatherTagType = computed<'success' | 'warning' | 'error'>(() => 'success')

// 在线时长
const onlineTime = ref('00:00:00')
const startTime = Date.now()
let timer: number | null = null

// 数据加载状态
const statsLoading = ref(false)

// 模拟数据 - 统计卡片
const statCards = computed(() => [
  {
    title: '总用户数',
    value: 12458,
    suffix: '人',
    change: 12.5,
    changeType: 'increase' as const,
    icon: 'TeamOutlined',
    color: 'blue',
  },
  {
    title: '今日活跃用户',
    value: 3892,
    suffix: '人',
    change: 8.3,
    changeType: 'increase' as const,
    icon: 'FireOutlined',
    color: 'green',
  },
  {
    title: '今日订单',
    value: 256,
    suffix: '单',
    change: -2.4,
    changeType: 'decrease' as const,
    icon: 'ShoppingCartOutlined',
    color: 'orange',
  },
  {
    title: '今日收入',
    value: 89432.50,
    prefix: '¥',
    change: 25.6,
    changeType: 'increase' as const,
    icon: 'DollarOutlined',
    color: 'purple',
  },
])

// 模拟图表数据
const visitTrendData = ref([
  { date: '周一', visitors: 1200, pageViews: 3200, newUsers: 45 },
  { date: '周二', visitors: 1458, pageViews: 3890, newUsers: 67 },
  { date: '周三', visitors: 986, pageViews: 2100, newUsers: 34 },
  { date: '周四', visitors: 1687, pageViews: 4567, newUsers: 89 },
  { date: '周五', visitors: 2103, pageViews: 5890, newUsers: 123 },
  { date: '周六', visitors: 1789, pageViews: 4321, newUsers: 78 },
  { date: '周日', visitors: 1543, pageViews: 3678, newUsers: 56 },
])

const activityData = ref([
  { date: '1月', daily: 320, weekly: 1840, monthly: 6720 },
  { date: '2月', daily: 245, weekly: 1421, monthly: 5187 },
  { date: '3月', daily: 567, weekly: 3283, monthly: 11991 },
  { date: '4月', daily: 432, weekly: 2504, monthly: 9139 },
  { date: '5月', daily: 687, weekly: 3981, monthly: 14519 },
  { date: '6月', daily: 789, weekly: 4572, monthly: 16678 },
  { date: '7月', daily: 654, weekly: 3793, monthly: 13820 },
])

const businessDistributionData = ref([
  { name: '电商平台', value: 435, itemStyle: { color: '#5470c6' } },
  { name: '社交媒体', value: 310, itemStyle: { color: '#91cc75' } },
  { name: '金融服务', value: 234, itemStyle: { color: '#fac858' } },
  { name: '教育培训', value: 135, itemStyle: { color: '#ee6666' } },
  { name: '医疗健康', value: 1548, itemStyle: { color: '#73c0de' } },
])

const revenueSourceData = ref([
  { name: '商品销售', value: 45, itemStyle: { color: '#5470c6' } },
  { name: '会员服务', value: 25, itemStyle: { color: '#91cc75' } },
  { name: '广告收入', value: 20, itemStyle: { color: '#fac858' } },
  { name: '增值服务', value: 10, itemStyle: { color: '#ee6666' } },
])

// 服务器状态数据
const serverStatus = ref([
  {
    name: 'Web服务器',
    status: 'running' as const,
    cpu: 32,
    memory: 58,
    disk: 23,
    network: 1.2,
  },
  {
    name: '数据库',
    status: 'running' as const,
    cpu: 45,
    memory: 68,
    disk: 78,
    network: 2.1,
  },
  {
    name: '缓存服务',
    status: 'warning' as const,
    cpu: 78,
    memory: 82,
    disk: 15,
    network: 5.4,
  },
])

// 用户活动数据
const userActivities = ref([
  { user: '张三', action: '登录系统', time: '2分钟前', type: 'login' as const },
  { user: '李四', action: '创建新订单 #OX-2024-001', time: '5分钟前', type: 'order' as const },
  { user: '王五', action: '修改个人资料', time: '10分钟前', type: 'update' as const },
  { user: '赵六', action: '支付成功 ¥299.00', time: '15分钟前', type: 'payment' as const },
])

// 交易数据
const transactions = ref([
  { id: 'T001', user: '用户A', amount: 299.00, status: 'success' as const, time: '1分钟前' },
  { id: 'T002', user: '用户B', amount: 158.50, status: 'pending' as const, time: '3分钟前' },
  { id: 'T003', user: '用户C', amount: 68.00, status: 'failed' as const, time: '5分钟前' },
])

// 快捷操作
const quickActions = ref([
  { key: 'add-user', label: '添加用户', type: 'primary' as const, dashed: false },
  { key: 'add-order', label: '创建订单', type: 'info' as const, dashed: false },
  { key: 'settings', label: '系统设置', type: 'warning' as const, dashed: false },
  { key: 'analytics', label: '数据分析', type: 'default' as const, dashed: true },
  { key: 'security', label: '安全配置', type: 'default' as const, dashed: true },
  { key: 'backup', label: '数据备份', type: 'default' as const, dashed: true },
])

// 处理操作
const handleAction = (key: string) => {
  switch (key) {
    case 'add-user':
      router.push('/users/create')
      break
    case 'add-order':
      router.push('/orders/create')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'analytics':
      router.push('/analytics')
      break
    case 'security':
      router.push('/security')
      break
    case 'backup':
      notification.info({
        title: '数据备份',
        content: '开始执行系统数据备份...',
        duration: 3000,
      })
      break
  }
}

// 更新在线时长
const updateOnlineTime = () => {
  const elapsed = Date.now() - startTime
  const hours = Math.floor(elapsed / (1000 * 60 * 60))
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)
  onlineTime.value = [hours, minutes, seconds].map(n => n.toString().padStart(2, '0')).join(':')
}

// 初始化
onMounted(() => {
  timer = window.setInterval(updateOnlineTime, 1000)
  
  // 显示欢迎通知
  notification.success({
    title: '欢迎回来',
    content: `欢迎回到 ${import.meta.env.VITE_APP_NAME}，今天也要加油工作哦！`,
    duration: 3000,
  })
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.enhanced-dashboard {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-text h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.welcome-text p {
  margin: 0 0 8px 0;
  font-size: 14px;
  opacity: 0.9;
}

.quick-stats {
  text-align: right;
}

.stat-item {
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.stats-section {
  margin: 16px 0;
}

.monitor-section {
  margin: 24px 0;
}

.quick-actions {
  margin: 16px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .enhanced-dashboard {
    padding: 12px;
  }
  
  .welcome-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .welcome-info {
    flex-direction: column;
  }
  
  .quick-stats {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .welcome-text h2 {
    font-size: 20px;
  }
}
</style>