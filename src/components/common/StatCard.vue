<template>
  <n-card :style="computedStyle" hoverable>
    <div class="stat-card">
      <div class="stat-icon-wrapper" :style="{ backgroundColor: iconBgColor }">
        <n-icon :class="['stat-icon', color]">
          <component :is="icon" />
        </n-icon>
      </div>
      <div class="stat-content">
        <div class="stat-value">
          <span v-if="prefix" class="stat-prefix">{{ prefix }}</span>
          <n-number-animation
            :from="0"
            :to="numericValue"
            :duration="1500"
            :precision="precision"
          />
          <span v-if="suffix" class="stat-suffix">{{ suffix }}</span>
        </div>
        <div class="stat-title">{{ title }}</div>
        <div v-if="change !== undefined" class="stat-change" :class="changeType">
          <n-icon size="14" :color="changeType === 'increase' ? '#52c41a' : '#f5222d'">
            {{ changeType === 'increase' ? '↗' : '↘' }}
          </n-icon>
          <span>{{ Math.abs(change) }}%</span>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NIcon, NNumberAnimation } from 'naive-ui'

interface Props {
  title: string
  value: number | string
  prefix?: string
  suffix?: string
  change?: number
  changeType?: 'increase' | 'decrease'
  icon: string
  color?: string
}

const props = defineProps<Props>()


// 计算数值
const numericValue = computed(() => {
  if (typeof props.value === 'string') {
    const num = parseFloat(props.value.replace(/[^\d.-]/g, ''))
    return isNaN(num) ? 0 : num
  }
  return props.value
})

// 精度计算
const precision = computed(() => {
  if (numericValue.value % 1 === 0) return 0
  const str = numericValue.value.toString()
  const dotIndex = str.indexOf('.')
  return dotIndex === -1 ? 0 : str.length - dotIndex - 1
})

// 计算样式
const computedStyle = computed(() => ({
  backgroundColor: 'var(--n-color)',
  borderRadius: '8px',
}))

const iconBgColor = computed(() => {
  const colorMap: Record<string, string> = {
    green: '#52c41a',
    blue: '#1890ff',
    purple: '#722ed1',
    orange: '#fa8c16',
    red: '#f5222d',
  }
  return colorMap[props.color || 'blue'] + '1A'
})
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.stat-icon {
  font-size: 24px;
  transition: all 0.3s ease;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.2;
  color: var(--n-text-color);
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-prefix,
.stat-suffix {
  font-size: 18px;
  font-weight: 500;
  color: #666;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  margin-top: 8px;
}

.stat-change.increase {
  color: #52c41a;
}

.stat-change.decrease {
  color: #f5222d;
}

.green {
  color: #52c41a;
}

.blue {
  color: #1890ff;
}

.purple {
  color: #722ed1;
}

.orange {
  color: #fa8c16;
}

.red {
  color: #f5222d;
}
</style>