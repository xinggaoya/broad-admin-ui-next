import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts/core'
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  SingleAxisComponent,
  BrushComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'

// 注册必要的组件
echarts.use([
  // 图表类型
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
  // 组件
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  SingleAxisComponent,
  BrushComponent,
  DatasetComponent,
  TransformComponent,
  // 功能
  LabelLayout,
  UniversalTransition,
  // 渲染器
  CanvasRenderer
])

export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

export interface SeriesData {
  name: string
  data: number[]
  type?: string
  [key: string]: any
}

/**
 * 图表 Hook
 * @param containerId 容器ID
 */
export function useCharts(containerId?: string) {
  const chartInstance = ref<echarts.ECharts | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 初始化图表
   */
  const initChart = async (container: HTMLElement | string, theme?: string) => {
    try {
      isLoading.value = true
      error.value = null

      await nextTick()
      
      const dom = typeof container === 'string' ? document.getElementById(container) : container
      if (!dom) {
        throw new Error('图表容器不存在')
      }

      // 如果已存在实例，先销毁
      if (chartInstance.value) {
        chartInstance.value.dispose()
      }

      chartInstance.value = echarts.init(dom, theme)
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize)
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : '图表初始化失败'
      console.error('图表初始化失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 设置图表配置
   */
  const setOption = (option: EChartsOption, notMerge?: boolean, lazyUpdate?: boolean) => {
    if (!chartInstance.value) {
      console.warn('图表实例未初始化')
      return
    }
    
    try {
      chartInstance.value.setOption(option, notMerge, lazyUpdate)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '设置图表配置失败'
      console.error('设置图表配置失败:', err)
    }
  }

  /**
   * 窗口大小变化处理
   */
  const handleResize = () => {
    if (chartInstance.value) {
      chartInstance.value.resize()
    }
  }

  /**
   * 显示加载动画
   */
  const showLoading = (text?: string) => {
    if (chartInstance.value) {
      chartInstance.value.showLoading('default', {
        text: text || '加载中...',
        color: '#18a058',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
      })
    }
  }

  /**
   * 隐藏加载动画
   */
  const hideLoading = () => {
    if (chartInstance.value) {
      chartInstance.value.hideLoading()
    }
  }

  /**
   * 销毁图表
   */
  const dispose = () => {
    if (chartInstance.value) {
      chartInstance.value.dispose()
      chartInstance.value = null
    }
    window.removeEventListener('resize', handleResize)
  }

  /**
   * 获取图表实例
   */
  const getInstance = () => chartInstance.value

  // 组件卸载时自动销毁
  onUnmounted(() => {
    dispose()
  })

  return {
    chartInstance,
    isLoading,
    error,
    initChart,
    setOption,
    showLoading,
    hideLoading,
    dispose,
    getInstance,
    handleResize
  }
}

/**
 * 生成常用图表配置
 */
export const chartConfigs = {
  /**
   * 柱状图配置
   */
  bar: (data: SeriesData[], categories: string[]): EChartsOption => ({
    title: {
      text: '柱状图',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: data.map(item => item.name),
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories
    },
    yAxis: {
      type: 'value'
    },
    series: data.map(item => ({
      name: item.name,
      type: 'bar',
      data: item.data,
      ...item
    }))
  }),

  /**
   * 折线图配置
   */
  line: (data: SeriesData[], categories: string[]): EChartsOption => ({
    title: {
      text: '折线图',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: data.map(item => item.name),
      top: 30
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
      data: categories
    },
    yAxis: {
      type: 'value'
    },
    series: data.map(item => ({
      name: item.name,
      type: 'line',
      data: item.data,
      smooth: true,
      ...item
    }))
  }),

  /**
   * 饼图配置
   */
  pie: (data: ChartData[], title?: string): EChartsOption => ({
    title: {
      text: title || '饼图',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: title || '数据',
        type: 'pie',
        radius: '50%',
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }),

  /**
   * 仪表盘配置
   */
  gauge: (value: number, title?: string, max?: number): EChartsOption => ({
    title: {
      text: title || '仪表盘',
      left: 'center'
    },
    series: [
      {
        name: title || '指标',
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}%'
        },
        data: [
          {
            value,
            name: title || '完成率'
          }
        ],
        max: max || 100
      }
    ]
  })
}

/**
 * 默认主题色彩
 */
export const defaultColors = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc'
]