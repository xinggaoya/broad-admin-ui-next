<template>
  <n-card :title="title" hoverable>
    <div class="chart-container">
      <VChart
        :option="chartOption"
        :loading="loading"
        :loading-options="loadingOptions"
        :autoresize="true"
        class="chart"
      />
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard } from 'naive-ui'
import { useThemeStore } from '../../stores/modules/theme'
import type { PieChartData } from '../../api/types/dashboard.types'
import VChart from 'vue-echarts'

interface Props {
  title: string
  data: PieChartData[]
  radius?: [string, string] | string
  showLabel?: boolean
  showLegend?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  radius: ['40%', '70%'],
  showLabel: true,
  showLegend: true,
  loading: false,
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
    backgroundColor: isDark.value ? '#18181C' : '#fff',
    textStyle: {
      color: isDark.value ? '#fff' : '#333'
    },
    borderWidth: 0,
    borderRadius: 4,
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    show: props.showLegend,
    textStyle: {
      color: isDark.value ? '#fff' : '#333'
    },
  },
  series: [
    {
      name: props.title,
      type: 'pie',
      radius: props.radius,
      data: props.data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: isDark.value ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)'
        }
      },
      label: {
        show: props.showLabel,
        formatter: '{b}: {d}%',
        color: isDark.value ? '#fff' : '#333'
      },
      labelLine: {
        show: props.showLabel,
        length: isDark.value ? '#fff' : '#333'
      },
      itemStyle: {
        borderRadius: 8,
        borderColor: isDark.value ? '#18181C' : '#fff',
        borderWidth: 2
      }
    }
  ]
}))

const loadingOptions = {
  text: '数据加载中...',
  color: '#1890ff',
  textColor: '#000',
  maskColor: 'rgba(255, 255, 255, 0.8)',
  zlevel: 0,
}
</script>

<style scoped>
.chart-container {
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>