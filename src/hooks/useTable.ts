import { ref, reactive, computed, watch, h } from 'vue'
import type { Ref } from 'vue'
import type { DataTableColumns, DataTableRowKey, PaginationProps } from 'naive-ui'

// 搜索表单接口
export interface SearchForm {
  [key: string]: any
}

// 表格数据接口
export interface TableData {
  [key: string]: any
}

// API 响应接口
export interface ApiResponse<T = any> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// API 请求参数接口
export interface ApiParams {
  page: number
  pageSize: number
  [key: string]: any
}

// 表格 Hook 返回值接口
export interface UseTableReturn {
  // 数据相关
  tableData: Ref<TableData[]>
  loading: Ref<boolean>
  total: Ref<number>

  // 分页相关
  pagination: Ref<PaginationProps>

  // 搜索相关
  searchForm: Ref<SearchForm>
  handleReset: () => void
  handleSearch: () => void

  // 选择相关
  selectedRowKeys: Ref<DataTableRowKey[]>
  selectedRows: Ref<TableData[]>
  handleSelectionChange: (rowKeys: DataTableRowKey[], rows: TableData[]) => void
  clearSelection: () => void

  // 刷新相关
  refreshData: () => Promise<void>

  // 列拖拽相关
  columns: Ref<DataTableColumns>
  handleColumnDrop: (dragKey: string, dropKey: string, position: 'before' | 'after') => void

  // 表格设置相关
  tableDensity: Ref<'small' | 'medium' | 'large'>
  tableSettings: Ref<TableConfig['settings']>
  updateColumns: (newColumns: DataTableColumns) => void
  updateTableDensity: (density: 'small' | 'medium' | 'large') => void
  resetTableSettings: () => void
}

// 新的表格配置接口
export interface TableConfig<T = any> {
  api: (params: ApiParams) => Promise<ApiResponse<T>>
  columns: DataTableColumns
  searchForm?: SearchForm
  pagination?: Partial<PaginationProps>
  immediate?: boolean
  settings?: {
    columnSettings?: boolean
    densitySettings?: boolean
    defaultDensity?: 'small' | 'medium' | 'large'
  }
}

/**
 * 表格通用 Hook
 * @param config 表格配置
 * @returns 表格相关状态和方法
 */
export function useTable<T = any>(config: TableConfig<T>): UseTableReturn {
  const {
    api,
    columns: initialColumns = [],
    searchForm: initialSearchForm = {},
    pagination: paginationConfig = {},
    immediate = true,
    settings = {},
  } = config
  // 数据状态
  const data = ref<TableData[]>([])
  const loading = ref(false)
  const total = ref(0)

  // 搜索表单
  const searchForm = ref<SearchForm>(initialSearchForm)

  // 分页配置
  const pagination = ref<PaginationProps>({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100],
    showQuickJumper: true,
    itemCount: 0,
    ...paginationConfig,
    onUpdatePage: (page: number) => {
      pagination.value.page = page
      loadData()
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.value.pageSize = pageSize
      pagination.value.page = 1
      loadData()
    },
  })

  // 选择状态
  const selectedRowKeys = ref<DataTableRowKey[]>([])
  const selectedRows = ref<TableData[]>([])

  // 列配置
  const columns = ref<DataTableColumns>([...initialColumns])
  const originalColumns = ref<DataTableColumns>([...initialColumns])

  // 表格设置
  const tableDensity = ref<'small' | 'medium' | 'large'>(settings?.defaultDensity || 'medium')
  const tableSettings = ref(settings)

  // 加载数据
  const loadData = async () => {
    try {
      loading.value = true
      const params: ApiParams = {
        page: pagination.value.page!,
        pageSize: pagination.value.pageSize!,
        ...searchForm.value,
      }

      const response = await api(params)

      data.value = response.data
      total.value = response.total
      pagination.value.itemCount = response.total
    } catch (error) {
      console.error('加载数据失败:', error)
      data.value = []
      total.value = 0
      pagination.value.itemCount = 0
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    pagination.value.page = 1
    loadData()
  }

  // 重置搜索
  const resetSearch = () => {
    searchForm.value = {}
    pagination.value.page = 1
    loadData()
  }

  // 处理选择变化
  const handleSelectionChange = (rowKeys: DataTableRowKey[], rows: TableData[]) => {
    selectedRowKeys.value = rowKeys
    selectedRows.value = rows
  }

  // 清空选择
  const clearSelection = () => {
    selectedRowKeys.value = []
    selectedRows.value = []
  }

  // 刷新数据
  const refresh = async () => {
    await loadData()
  }

  // 列拖拽处理
  const handleColumnDrop = (dragKey: string, dropKey: string, position: 'before' | 'after') => {
    const dragIndex = columns.value.findIndex((col) => col.key === dragKey)
    const dropIndex = columns.value.findIndex((col) => col.key === dropKey)

    if (dragIndex === -1 || dropIndex === -1) return

    const newColumns = [...columns.value]
    const [dragColumn] = newColumns.splice(dragIndex, 1)

    const insertIndex = position === 'before' ? dropIndex : dropIndex + 1
    newColumns.splice(insertIndex, 0, dragColumn)

    columns.value = newColumns
  }

  // 更新列配置
  const updateColumns = (newColumns: DataTableColumns) => {
    columns.value = newColumns
  }

  // 更新表格密度
  const updateTableDensity = (density: 'small' | 'medium' | 'large') => {
    tableDensity.value = density
  }

  // 重置表格设置
  const resetTableSettings = () => {
    columns.value = [...originalColumns.value]
    tableDensity.value = tableSettings.value?.defaultDensity || 'medium'
  }

  // 监听分页变化
  watch(
    () => pagination.value.itemCount,
    (newCount) => {
      total.value = newCount || 0
    },
  )

  // 初始化加载数据
  if (immediate) {
    loadData()
  }

  return {
    // 数据相关
    tableData: data,
    loading,
    total,

    // 分页相关
    pagination,

    // 搜索相关
    searchForm,
    handleReset: resetSearch,
    handleSearch,

    // 选择相关
    selectedRowKeys,
    selectedRows,
    handleSelectionChange,
    clearSelection,

    // 刷新相关
    refreshData: refresh,

    // 列拖拽相关
    columns,
    handleColumnDrop,

    // 表格设置相关
    tableDensity,
    tableSettings,
    updateColumns,
    updateTableDensity,
    resetTableSettings,
  }
}

// 创建模拟 API 函数的工厂函数
export function createMockApi<T = TableData>(
  mockData: T[],
  delay: number = 500,
): (params: ApiParams) => Promise<ApiResponse<T>> {
  return async (params: ApiParams): Promise<ApiResponse<T>> => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, delay))

    let filteredData = [...mockData]

    // 模拟搜索过滤
    Object.keys(params).forEach((key) => {
      if (key !== 'page' && key !== 'pageSize' && params[key]) {
        filteredData = filteredData.filter((item) => {
          const value = (item as any)[key]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(params[key].toLowerCase())
          }
          return value === params[key]
        })
      }
    })

    const total = filteredData.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const data = filteredData.slice(start, end)

    return {
      data,
      total,
      page: params.page,
      pageSize: params.pageSize,
    }
  }
}

// 常用列配置生成器
export const createColumns = {
  // 文本列
  text: (title: string, key: string, width?: number) => ({
    title,
    key,
    width,
    ellipsis: {
      tooltip: true,
    },
  }),

  // 状态列
  status: (
    title: string,
    key: string,
    statusMap: Record<string, { label: string; type: string }>,
  ) => ({
    title,
    key,
    render: (row: any) => {
      const status = statusMap[row[key]]
      return status ? h('n-tag', { type: status.type }, { default: () => status.label }) : '-'
    },
  }),

  // 日期列
  date: (title: string, key: string, format: string = 'YYYY-MM-DD HH:mm:ss') => ({
    title,
    key,
    render: (row: any) => {
      const date = row[key]
      return date ? new Date(date).toLocaleString() : '-'
    },
  }),

  // 操作列
  actions: (
    title: string = '操作',
    actions: Array<{ label: string; onClick: (row: any) => void; type?: string }>,
  ) => ({
    title,
    key: 'actions',
    width: actions.length * 80,
    render: (row: any) => {
      return h(
        'div',
        { style: 'display: flex; gap: 8px;' },
        actions.map((action) =>
          h(
            'n-button',
            {
              size: 'small',
              type: action.type || 'primary',
              onClick: () => action.onClick(row),
            },
            { default: () => action.label },
          ),
        ),
      )
    },
  }),
}
