<template>
  <div class="activity-panel">
    <n-list hoverable clickable>
      <n-list-item v-for="activity in activities" :key="activity.user + activity.time">
        <template #prefix>
          <n-avatar
            round
            :size="32"
            :style="{ backgroundColor: getActivityColor(activity.type) }"
          >
            {{ activity.user.charAt(0) }}
          </n-avatar>
        </template>
        
        <n-thing>
          <template #header-extra>
            <n-time :time="new Date(Date.now() - getTimeOffset(activity.time))" type="relative" />
          </template>
          
          <template #header>
            <span class="user-name">{{ activity.user }}</span>
          </template>
          
          <template #description>
            <n-text :depth="3">
              {{ activity.action }}
            </n-text>
          </template>
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>

<script setup lang="ts">
import { NList, NListItem, NThing, NAvatar, NText, NTime } from 'naive-ui'

interface UserActivity {
  user: string
  action: string
  time: string
  type: 'login' | 'order' | 'update' | 'payment'
}

interface Props {
  activities: UserActivity[]
}

defineProps<Props>()

// 获取活动类型对应的颜色
const getActivityColor = (type: string): string => {
  const colorMap = {
    login: '#52c41a',
    order: '#1890ff',
    update: '#faad14',
    payment: '#722ed1',
  }
  return colorMap[type as keyof typeof colorMap] || '#666'
}

// 计算时间偏移量（用于演示）
const getTimeOffset = (time: string): number => {
  const units = {
    '分钟前': 60 * 1000,
    '小时前': 60 * 60 * 1000,
    '天前': 24 * 60 * 60 * 1000,
  }
  
  const match = time.match(/(\d+)\s*(分钟|小时|天)前/)
  if (match) {
    const [, num, unit] = match
    const multiplier = units[`${unit}前` as keyof typeof units]
    return parseInt(num) * multiplier
  }
  return 0
}
</script>

<style scoped>
.activity-panel {
  max-height: 400px;
  overflow-y: auto;
}

.user-name {
  font-weight: 600;
  color: var(--n-text-color);
}

:deep(.n-list-item:hover) {
  background-color: transparent;
}

/* 自定义滚动条 */
.activity-panel::-webkit-scrollbar {
  width: 4px;
}

.activity-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.activity-panel::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.activity-panel::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>