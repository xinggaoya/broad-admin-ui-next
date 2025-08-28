<template>
  <n-card :title="title" hoverable>
    <div class="chart-container">
      <VChart
        :option="chartOption"
        :loading="!data || data.length === 0"
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
import type { LineChartData } from '../../api/types/dashboard.types'
import VChart from 'vue-echarts'

interface Props {
  title: string
  data: LineChartData[]
  xField: string
  yFields: string[]
  colors?: string[]
  smooth?: boolean
  area?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  smooth: true,
  area: true,
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: isDark.value ? '#18181C' : '#fff',
    textStyle: {
      color: isDark.value ? '#fff' : '#333'
    },
    borderWidth: 0,
    borderRadius: 4,
  },
  legend: {
    data: props.yFields,
    textStyle: {
      color: isDark.value ? '#fff' : '#333'
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.data?.map(item => item[props.xField]) || [],
    axisLine: {
      lineStyle: {
        color: isDark.value ? '#4C4D4F' : '#E5E6EB'
      }
    },
    axisLabel: {
      color: isDark.value ? '#C9CDD4' : '#8B8B8B'
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: isDark.value ? '#4C4D4F' : '#E5E6EB'
      }
    },
    axisLabel: {
      color: isDark.value ? '#C9CDD4' : '#8B8B8B'
    },
    splitLine: {
      lineStyle: {
        color: isDark.value ? '#2E2E32' : '#F3F3F5'
      }
    }
  },
  series: props.yFields.map((field, index) => {
    const baseSeries = {
      name: field,
      type: 'line',
      smooth: props.smooth,
      data: props.data?.map(item => item[field]) || [],
      itemStyle: {
        color: props.colors?.[index] || ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'][index]
      },
      emphasis: {
        focus: 'series'
      },
    }

    return props.area ? {
      ...baseSeries,
      areaStyle: {
        opacity: 0.3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: (props.colors?.[index] || ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'][index]) + '80' },
            { offset: 1, color: (props.colors?.[index] || ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'][index]) + '00' }
          ]
        }
      }
    } : baseSeries
  })
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