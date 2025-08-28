<template>
  <div class="server-panel">
    <n-grid :cols="3" :x-gap="16" :y-gap="16" responsive="screen">
      <n-gi v-for="server in servers" :key="server.name">
        <n-card hoverable :class="['server-card', server.status]">
          <div class="server-header">
            <n-icon size="24" :color="getStatusColor(server.status)">
              <ServerOutline />
            </n-icon>
            <span class="server-name">{{ server.name }}</span>
            <n-tag :type="getStatusType(server.status)" size="small">
              {{ getStatusText(server.status) }}
            </n-tag>
          </div>
          
          <div class="server-metrics">
            <div class="metric">
              <span class="metric-label">CPU使用率</span>
              <n-progress
                type="line"
                :percentage="server.cpu"
                :color="getMetricColor(server.cpu)"
                indicator-placement="inside"
                status="default"
              />
            </div>
            
            <div class="metric">
              <span class="metric-label">内存占用率</span>
              <n-progress
                type="line"
                :percentage="server.memory"
                :color="getMetricColor(server.memory)"
                indicator-placement="inside"
                status="default"
              />
            </div>
            
            <div class="metric">
              <span class="metric-label">磁盘使用率</span>
              <n-progress
                type="circle"
                :percentage="server.disk"
                :color="getMetricColor(server.disk)"
                :stroke-width="6"
                :show-indicator="false"
                size="small"
              />
              <span class="metric-value">{{ server.disk }}%</span>
            </div>
            
            <div class="metric">
              <span class="metric-label">网络带宽</span>
              <div class="network-info">
                <n-icon size="16" class="network-icon">
                  <CloudDownloadOutline />
                </n-icon>
                <span>{{ server.network }} MB/s</span>
              </div>
            </div>
          </div>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { NCard, NIcon, NTag, NProgress, NGrid, NGi } from 'naive-ui'
import { ServerOutline, CloudDownloadOutline } from '@vicons/ionicons5'

interface Server {
  name: string
  status: 'running' | 'warning' | 'error'
  cpu: number
  memory: number
  disk: number
  network: number
}

interface Props {
  servers: Server[]
}

defineProps<Props>()

// 状态相关方法
const getStatusColor = (status: string): string => {
  const colorMap = {
    running: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
  }
  return colorMap[status as keyof typeof colorMap] || '#666'
}

const getStatusType = (status: string) => {
  const typeMap = {
    running: 'success' as const,
    warning: 'warning' as const,
    error: 'error' as const,
  }
  return typeMap[status as keyof typeof typeMap] || 'default'
}

const getStatusText = (status: string) => {
  const textMap = {
    running: '运行中',
    warning: '告警',
    error: '故障',
  }
  return textMap[status as keyof typeof textMap]
}

const getMetricColor = (value: number): string => {
  if (value < 30) return '#52c41a'
  if (value < 70) return '#faad14'
  if (value < 90) return '#ff7a45'
  return '#f5222d'
}
</script>

<style scoped>
.server-panel {
  width: 100%;
}

.server-card {
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.server-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.server-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.server-name {
  font-weight: 600;
  font-size: 16px;
  flex: 1;
}

.server-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-label {
  font-size: 12px;
  color: #666;
  min-width: 60px;
}

.network-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.network-icon {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.metric-value {
  font-size: 12px;
  color: #666;
  margin-left: 8px;
}

html.dark .server-card:hover {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

html.dark .server-header {
  border-bottom-color: #2c2c32;
}
</style>