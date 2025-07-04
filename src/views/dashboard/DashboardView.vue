<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <n-card>
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>欢迎回来，{{ userInfo?.nickname || '用户' }}！</h2>
            <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
          </div>
          <div class="welcome-avatar">
            <n-avatar :size="80" :src="userInfo?.avatar" fallback-src="/favicon.ico" />
          </div>
        </div>
      </n-card>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <n-grid :cols="4" :x-gap="16" responsive="screen">
        <n-gi>
          <n-card>
            <n-statistic label="总用户数" :value="1234">
              <template #prefix>
                <n-icon>
                  <UserOutlined />
                </n-icon>
              </template>
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="今日访问" :value="5678" value-style="color: #18a058;">
              <template #prefix>
                <n-icon color="#18a058">
                  <EyeOutlined />
                </n-icon>
              </template>
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="订单数量" :value="987" value-style="color: #2080f0;">
              <template #prefix>
                <n-icon color="#2080f0">
                  <ShoppingCartOutlined />
                </n-icon>
              </template>
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="销售额" :value="12345" :precision="2" value-style="color: #f0a020;">
              <template #prefix>
                <n-icon color="#f0a020">
                  <DollarOutlined />
                </n-icon>
              </template>
              <template #suffix>
                <span style="font-size: 14px">元</span>
              </template>
            </n-statistic>
          </n-card>
        </n-gi>
      </n-grid>
    </div>

    <!-- 快捷操作 -->
    <div class="actions-section">
      <n-card title="快捷操作">
        <n-grid :cols="3" :x-gap="16">
          <n-gi>
            <n-button block type="primary" @click="goToUsers">
              <template #icon>
                <n-icon>
                  <UserOutlined />
                </n-icon>
              </template>
              用户管理
            </n-button>
          </n-gi>
          <n-gi>
            <n-button block @click="goToSettings">
              <template #icon>
                <n-icon>
                  <SettingOutlined />
                </n-icon>
              </template>
              系统设置
            </n-button>
          </n-gi>
          <n-gi>
            <n-button block @click="goToProfile">
              <template #icon>
                <n-icon>
                  <EditOutlined />
                </n-icon>
              </template>
              个人资料
            </n-button>
          </n-gi>
        </n-grid>
      </n-card>
    </div>

    <!-- 系统信息 -->
    <div class="info-section">
      <n-grid :cols="2" :x-gap="16">
        <n-gi>
          <n-card title="用户信息">
            <n-descriptions :column="1" bordered>
              <n-descriptions-item label="用户名">
                {{ userInfo?.username }}
              </n-descriptions-item>
              <n-descriptions-item label="角色">
                <n-tag v-for="role in userInfo?.roles" :key="role" type="info" size="small">
                  {{ role }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="邮箱">
                {{ userInfo?.email }}
              </n-descriptions-item>
              <n-descriptions-item label="部门">
                {{ userInfo?.departmentName }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card title="系统状态">
            <n-descriptions :column="1" bordered>
              <n-descriptions-item label="系统版本"> Admin UI v1.0.0 </n-descriptions-item>
              <n-descriptions-item label="运行状态">
                <n-tag type="success">正常</n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="最后登录">
                {{ formatDate(new Date()) }}
              </n-descriptions-item>
              <n-descriptions-item label="在线时长">
                {{ onlineTime }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user.ts'
import {
  UserOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  SettingOutlined,
  EditOutlined,
} from '@vicons/antd'

defineOptions({
  name: 'DashboardView',
})

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
})

// 在线时长
const onlineTime = ref('00:00:00')
const startTime = Date.now()
let timer: number | null = null

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleString('zh-CN')
}

// 更新在线时长
const updateOnlineTime = () => {
  const elapsed = Date.now() - startTime
  const hours = Math.floor(elapsed / (1000 * 60 * 60))
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)

  onlineTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 导航到不同页面
const goToUsers = () => {
  router.push('/user/list')
}

const goToSettings = () => {
  router.push('/system/settings')
}

const goToProfile = () => {
  router.push('/profile')
}

// 生命周期
onMounted(() => {
  // 每秒更新在线时长
  timer = window.setInterval(updateOnlineTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.welcome-section {
  margin-bottom: 8px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.welcome-text p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.stats-section,
.actions-section,
.info-section {
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 12px;
  }

  .welcome-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .welcome-text h2 {
    font-size: 20px;
  }
}

/* 暗黑模式适配 */
html.dark .welcome-text h2 {
  color: #fff;
}

html.dark .welcome-text p {
  color: #a0a0a0;
}
</style>
