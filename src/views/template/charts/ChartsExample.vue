<template>
  <div class="charts-template-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <n-page-header title="图表模板" subtitle="展示各种图表组件的使用方法">
        <template #extra>
          <n-space>
            <n-button @click="refreshCharts" type="primary">
              <template #icon>
                <n-icon>
                  <RefreshOutline />
                </n-icon>
              </template>
              刷新图表
            </n-button>
            <n-button @click="exportCharts">
              <template #icon>
                <n-icon>
                  <DownloadOutline />
                </n-icon>
              </template>
              导出数据
            </n-button>
          </n-space>
        </template>
      </n-page-header>
    </div>

    <!-- 图表展示区域 -->
    <div class="charts-grid">
      <!-- 基础图表 -->
      <n-card title="基础图表" class="chart-card">
        <n-tabs type="line" animated>
          <n-tab-pane name="line" tab="折线图">
            <div ref="lineChart" class="chart-container"></div>
          </n-tab-pane>
          <n-tab-pane name="bar" tab="柱状图">
            <div ref="barChart" class="chart-container"></div>
          </n-tab-pane>
          <n-tab-pane name="pie" tab="饼图">
            <div ref="pieChart" class="chart-container"></div>
          </n-tab-pane>
        </n-tabs>
      </n-card>

      <!-- 高级图表 -->
      <n-card title="高级图表" class="chart-card">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-gi>
            <n-card title="雷达图" size="small">
              <div ref="radarChart" class="small-chart-container"></div>
            </n-card>
          </n-gi>
          <n-gi>
            <n-card title="仪表盘" size="small">
              <div ref="gaugeChart" class="small-chart-container"></div>
            </n-card>
          </n-gi>
          <n-gi>
            <n-card title="散点图" size="small">
              <div ref="scatterChart" class="small-chart-container"></div>
            </n-card>
          </n-gi>
          <n-gi>
            <n-card title="热力图" size="small">
              <div ref="heatmapChart" class="small-chart-container"></div>
            </n-card>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 实时数据图表 -->
      <n-card title="实时数据" class="chart-card">
        <template #header-extra>
          <n-switch v-model:value="isRealTimeEnabled" @update:value="toggleRealTime">
            <template #checked>实时更新</template>
            <template #unchecked>停止更新</template>
          </n-switch>
        </template>
        <div ref="realTimeChart" class="chart-container"></div>
      </n-card>

      <!-- 数据配置 -->
      <n-card title="数据配置" class="chart-card">
        <n-form :model="chartConfig" label-placement="left" label-width="auto">
          <n-form-item label="数据点数量">
            <n-input-number v-model:value="chartConfig.dataPoints" :min="5" :max="50" />
          </n-form-item>
          <n-form-item label="更新间隔(秒)">
            <n-input-number v-model:value="chartConfig.updateInterval" :min="1" :max="10" />
          </n-form-item>
          <n-form-item label="图表主题">
            <n-select
              v-model:value="chartConfig.theme"
              :options="themeOptions"
              @update:value="updateTheme"
            />
          </n-form-item>
          <n-form-item label="动画效果">
            <n-switch v-model:value="chartConfig.animation" @update:value="updateAnimation" />
          </n-form-item>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useCharts, chartConfigs, type ChartData, type SeriesData } from '@/hooks/useCharts'
import { useMessage } from 'naive-ui'
import { RefreshOutline, DownloadOutline } from '@vicons/ionicons5'
import type { EChartsOption } from 'echarts'

defineOptions({
  name: 'ChartsExample',
})

const message = useMessage()

// 图表引用
const lineChart = ref<HTMLElement>()
const barChart = ref<HTMLElement>()
const pieChart = ref<HTMLElement>()
const radarChart = ref<HTMLElement>()
const gaugeChart = ref<HTMLElement>()
const scatterChart = ref<HTMLElement>()
const heatmapChart = ref<HTMLElement>()
const realTimeChart = ref<HTMLElement>()

// 图表实例
const lineChartInstance = useCharts()
const barChartInstance = useCharts()
const pieChartInstance = useCharts()
const radarChartInstance = useCharts()
const gaugeChartInstance = useCharts()
const scatterChartInstance = useCharts()
const heatmapChartInstance = useCharts()
const realTimeChartInstance = useCharts()

// 配置
const chartConfig = reactive({
  dataPoints: 20,
  updateInterval: 3,
  theme: 'default',
  animation: true,
})

const themeOptions = [
  { label: '默认', value: 'default' },
  { label: '暗黑', value: 'dark' },
  { label: '复古', value: 'vintage' },
]

// 实时更新控制
const isRealTimeEnabled = ref(false)
let realTimeTimer: number | null = null
const realTimeData = ref<number[]>([])
const realTimeCategories = ref<string[]>([])

// 生成随机数据
const generateRandomData = (count: number, min = 0, max = 100): number[] => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

// 生成时间标签
const generateTimeLabels = (count: number): string[] => {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(now.getTime() - (count - 1 - i) * 1000)
    return time.toLocaleTimeString()
  })
}

// 基础数据
const lineData: SeriesData[] = [
  { name: '销售额', data: generateRandomData(7, 100, 500) },
  { name: '利润', data: generateRandomData(7, 50, 200) },
]
const categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const barData: SeriesData[] = [
  { name: '2023年', data: generateRandomData(12, 200, 800) },
  { name: '2024年', data: generateRandomData(12, 250, 900) },
]
const monthCategories = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

const pieData: ChartData[] = [
  { name: '移动端', value: 335 },
  { name: 'PC端', value: 310 },
  { name: '平板', value: 234 },
  { name: '其他', value: 135 },
]

// 初始化图表
const initCharts = async () => {
  try {
    // 折线图
    if (lineChart.value) {
      await lineChartInstance.initChart(lineChart.value)
      const lineOption = chartConfigs.line(lineData, categories)
      lineChartInstance.setOption(lineOption)
    }

    // 柱状图
    if (barChart.value) {
      await barChartInstance.initChart(barChart.value)
      const barOption = chartConfigs.bar(barData, monthCategories)
      barChartInstance.setOption(barOption)
    }

    // 饼图
    if (pieChart.value) {
      await pieChartInstance.initChart(pieChart.value)
      const pieOption = chartConfigs.pie(pieData, '访问来源')
      pieChartInstance.setOption(pieOption)
    }

    // 雷达图
    if (radarChart.value) {
      await radarChartInstance.initChart(radarChart.value)
      const radarOption: EChartsOption = {
        title: {
          text: '技能雷达图',
          left: 'center',
        },
        radar: {
          indicator: [
            { name: 'Vue', max: 100 },
            { name: 'React', max: 100 },
            { name: 'Angular', max: 100 },
            { name: 'Node.js', max: 100 },
            { name: 'Python', max: 100 },
            { name: 'Java', max: 100 },
          ],
        },
        series: [
          {
            name: '技能水平',
            type: 'radar',
            data: [
              {
                value: [90, 75, 60, 85, 70, 80],
                name: '当前水平',
              },
            ],
          },
        ],
      }
      radarChartInstance.setOption(radarOption)
    }

    // 仪表盘
    if (gaugeChart.value) {
      await gaugeChartInstance.initChart(gaugeChart.value)
      const gaugeOption = chartConfigs.gauge(78, 'CPU使用率')
      gaugeChartInstance.setOption(gaugeOption)
    }

    // 散点图
    if (scatterChart.value) {
      await scatterChartInstance.initChart(scatterChart.value)
      const scatterOption: EChartsOption = {
        title: {
          text: '身高体重分布',
          left: 'center',
        },
        xAxis: {
          name: '身高(cm)',
          type: 'value',
          scale: true,
        },
        yAxis: {
          name: '体重(kg)',
          type: 'value',
          scale: true,
        },
        series: [
          {
            type: 'scatter',
            data: Array.from({ length: 50 }, () => [
              Math.random() * 50 + 150,
              Math.random() * 50 + 50,
            ]),
          },
        ],
      }
      scatterChartInstance.setOption(scatterOption)
    }

    // 热力图
    if (heatmapChart.value) {
      await heatmapChartInstance.initChart(heatmapChart.value)
      const heatmapData = []
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 24; j++) {
          heatmapData.push([j, i, Math.random() * 100])
        }
      }
      const heatmapOption: EChartsOption = {
        title: {
          text: '一周活跃时间',
          left: 'center',
        },
        tooltip: {
          position: 'top',
        },
        grid: {
          height: '50%',
          top: '10%',
        },
        xAxis: {
          type: 'category',
          data: Array.from({ length: 24 }, (_, i) => i + '时'),
          splitArea: {
            show: true,
          },
        },
        yAxis: {
          type: 'category',
          data: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          splitArea: {
            show: true,
          },
        },
        visualMap: {
          min: 0,
          max: 100,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%',
        },
        series: [
          {
            name: '活跃度',
            type: 'heatmap',
            data: heatmapData,
            label: {
              show: false,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
      heatmapChartInstance.setOption(heatmapOption)
    }

    // 实时图表
    if (realTimeChart.value) {
      await realTimeChartInstance.initChart(realTimeChart.value)
      initRealTimeChart()
    }
  } catch (error) {
    console.error('图表初始化失败:', error)
    message.error('图表初始化失败')
  }
}

// 初始化实时图表
const initRealTimeChart = () => {
  realTimeData.value = generateRandomData(chartConfig.dataPoints, 0, 100)
  realTimeCategories.value = generateTimeLabels(chartConfig.dataPoints)

  const option = chartConfigs.line(
    [{ name: '实时数据', data: realTimeData.value }],
    realTimeCategories.value,
  )
  if (option.title && !Array.isArray(option.title)) {
    option.title.text = '实时数据监控'
  }
  realTimeChartInstance.setOption(option)
}

// 更新实时数据
const updateRealTimeData = () => {
  // 移除第一个数据点，添加新的数据点
  realTimeData.value.shift()
  realTimeData.value.push(Math.floor(Math.random() * 100))

  // 更新时间标签
  realTimeCategories.value.shift()
  realTimeCategories.value.push(new Date().toLocaleTimeString())

  const option = chartConfigs.line(
    [{ name: '实时数据', data: realTimeData.value }],
    realTimeCategories.value,
  )
  if (option.title && !Array.isArray(option.title)) {
    option.title.text = '实时数据监控'
  }
  realTimeChartInstance.setOption(option)
}

// 切换实时更新
const toggleRealTime = (enabled: boolean) => {
  if (enabled) {
    realTimeTimer = window.setInterval(updateRealTimeData, chartConfig.updateInterval * 1000)
    message.success('实时更新已开启')
  } else {
    if (realTimeTimer) {
      clearInterval(realTimeTimer)
      realTimeTimer = null
    }
    message.info('实时更新已停止')
  }
}

// 刷新图表
const refreshCharts = () => {
  message.loading('正在刷新图表...', { duration: 1000 })
  setTimeout(() => {
    initCharts()
    message.success('图表刷新完成')
  }, 1000)
}

// 导出数据
const exportCharts = () => {
  const data = {
    lineData,
    barData,
    pieData,
    realTimeData: realTimeData.value,
    timestamp: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `charts-data-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)

  message.success('数据导出成功')
}

// 更新主题
const updateTheme = (theme: string) => {
  message.info(`主题已切换为: ${theme}`)
  // 这里可以实现主题切换逻辑
}

// 更新动画
const updateAnimation = (enabled: boolean) => {
  message.info(`动画效果已${enabled ? '开启' : '关闭'}`)
  // 这里可以实现动画切换逻辑
}

// 生命周期
onMounted(() => {
  initCharts()
})

onUnmounted(() => {
  if (realTimeTimer) {
    clearInterval(realTimeTimer)
  }
})
</script>

<style scoped>
.charts-template-container {
  padding: 16px;
}

.page-header {
  margin-bottom: 16px;
}

.charts-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-card {
  width: 100%;
}

.chart-container {
  width: 100%;
  height: 400px;
  min-height: 400px;
}

.small-chart-container {
  width: 100%;
  height: 200px;
  min-height: 200px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .charts-template-container {
    padding: 12px;
  }

  .chart-container {
    height: 300px;
    min-height: 300px;
  }

  .small-chart-container {
    height: 150px;
    min-height: 150px;
  }
}
</style>
