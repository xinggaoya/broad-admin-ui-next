<template>
  <div class="enhanced-table-example">
    <TableLayout
      :show-table-settings="true"
      :table-columns="columns"
      :table-density="tableDensity"
      @update:columns="updateColumns"
      @update:density="updateTableDensity"
      @settings-reset="resetTableSettings"
    >
      <!-- 搜索区域 -->
      <template #search>
        <n-form
          ref="searchFormRef"
          :model="searchForm"
          label-placement="left"
          label-width="80"
          :show-feedback="false"
        >
          <n-grid :cols="24" :x-gap="16">
            <n-form-item-gi :span="6" label="姓名" path="name">
              <n-input
                v-model:value="searchForm.name"
                placeholder="请输入姓名"
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" label="邮箱" path="email">
              <n-input
                v-model:value="searchForm.email"
                placeholder="请输入邮箱"
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" label="状态" path="status">
              <n-select
                v-model:value="searchForm.status"
                placeholder="请选择状态"
                clearable
                :options="statusOptions"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6">
              <n-space>
                <n-button type="primary" @click="handleSearch">
                  <template #icon>
                    <n-icon><SearchOutline /></n-icon>
                  </template>
                  搜索
                </n-button>
                <n-button @click="resetSearch">
                  <template #icon>
                    <n-icon><RefreshOutline /></n-icon>
                  </template>
                  重置
                </n-button>
              </n-space>
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </template>

      <!-- 工具栏左侧 -->
      <template #toolbar-left>
        <n-space>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon><AddOutline /></n-icon>
            </template>
            新增用户
          </n-button>
          <n-button
            type="error"
            :disabled="selectedRowKeys.length === 0"
            @click="handleBatchDelete"
          >
            <template #icon>
              <n-icon><TrashOutline /></n-icon>
            </template>
            批量删除 ({{ selectedRowKeys.length }})
          </n-button>
          <n-button @click="refreshData">
            <template #icon>
              <n-icon><RefreshOutline /></n-icon>
            </template>
            刷新
          </n-button>
        </n-space>
      </template>

      <!-- 表格内容 -->
      <template #table>
        <n-data-table
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :row-key="(row: UserData) => row.id"
          :checked-row-keys="selectedRowKeys"
          :size="tableDensity"
          :scroll-x="1200"
          :max-height="600"
          virtual-scroll
          @update:checked-row-keys="handleSelectionChange"
        />
      </template>

      <!-- 分页区域 -->
      <template #pagination>
        <n-pagination
          v-model:page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :item-count="pagination.itemCount"
          :page-sizes="pagination.pageSizes"
          :show-size-picker="pagination.showSizePicker"
          :show-quick-jumper="pagination.showQuickJumper"
          @update:page="pagination.onChange"
          @update:page-size="pagination.onUpdatePageSize"
        />
      </template>
    </TableLayout>

    <!-- 编辑对话框 -->
    <n-modal
      v-model:show="showEditModal"
      preset="dialog"
      :title="editMode === 'add' ? '新增用户' : '编辑用户'"
      :positive-text="editMode === 'add' ? '新增' : '保存'"
      negative-text="取消"
      @positive-click="handleSave"
    >
      <n-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-placement="left"
        label-width="80"
      >
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="editForm.name" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="editForm.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item label="年龄" path="age">
          <n-input-number v-model:value="editForm.age" :min="1" :max="120" />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="editForm.status"
            :options="statusOptions"
            placeholder="请选择状态"
          />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { NButton, NTag, useMessage, type DataTableColumns } from 'naive-ui'
import {
  SearchOutline,
  RefreshOutline,
  AddOutline,
  TrashOutline,
  CreateOutline,
  EyeOutline
} from '@vicons/ionicons5'
import { useTable } from '@/hooks/useTable'
import TableLayout from '@/components/table/TableLayout.vue'

// 用户数据接口
interface UserData {
  id: number
  name: string
  email: string
  age: number
  status: 'active' | 'inactive' | 'pending'
  createTime: string
}

// 搜索表单接口
interface SearchForm {
  name?: string
  email?: string
  status?: 'active' | 'inactive' | 'pending'
}

// 编辑表单接口
interface EditForm {
  id?: number
  name: string
  email: string
  age: number
  status: 'active' | 'inactive' | 'pending'
}

const message = useMessage()

// 模拟数据
const mockData: UserData[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `用户${index + 1}`,
  email: `user${index + 1}@example.com`,
  age: Math.floor(Math.random() * 50) + 20,
  status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as UserData['status'],
  createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
}))

// 状态映射
const statusMap = {
  active: { label: '激活', type: 'success' as const },
  inactive: { label: '禁用', type: 'error' as const },
  pending: { label: '待审核', type: 'warning' as const }
}

// 状态选项
const statusOptions = [
  { label: '激活', value: 'active' },
  { label: '禁用', value: 'inactive' },
  { label: '待审核', value: 'pending' }
]

// 模拟 API
const mockApi = async (params: any) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let filteredData = [...mockData]
  
  // 搜索过滤
  if (params.name) {
    filteredData = filteredData.filter(item => 
      item.name.toLowerCase().includes(params.name.toLowerCase())
    )
  }
  if (params.email) {
    filteredData = filteredData.filter(item => 
      item.email.toLowerCase().includes(params.email.toLowerCase())
    )
  }
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  // 分页
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const data = filteredData.slice(start, end)
  
  return {
    data,
    total: filteredData.length
  }
}

// 表格列配置
const createColumns = (): DataTableColumns<UserData> => [
  {
    type: 'selection',
    width: 50
  },
  {
    title: 'ID',
    key: 'id',
    width: 80,
    sorter: true
  },
  {
    title: '姓名',
    key: 'name',
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '邮箱',
    key: 'email',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '年龄',
    key: 'age',
    width: 80,
    sorter: true
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) => {
      const status = statusMap[row.status]
      return h(NTag, { type: status.type }, { default: () => status.label })
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 120,
    sorter: true
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render: (row) => {
      return h('div', { class: 'flex gap-2' }, [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            ghost: true,
            onClick: () => handleEdit(row)
          },
          { default: () => '编辑', icon: () => h(CreateOutline) }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            ghost: true,
            onClick: () => handleView(row)
          },
          { default: () => '查看', icon: () => h(EyeOutline) }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            ghost: true,
            onClick: () => handleDelete(row)
          },
          { default: () => '删除', icon: () => h(TrashOutline) }
        )
      ])
    }
  }
]

// 使用表格 Hook
const {
  searchForm,
  tableData,
  pagination,
  selectedRowKeys,
  columns,
  loading,
  tableDensity,
  tableSettings,
  handleSearch,
  handleReset: resetSearch,
  handleSelectionChange,
  clearSelection,
  refreshData,
  updateColumns,
  updateTableDensity,
  resetTableSettings
} = useTable<UserData>({
  api: mockApi,
  columns: createColumns(),
  searchForm: {},
  settings: {
    columnSettings: true,
    densitySettings: true,
    defaultDensity: 'medium'
  }
})

// 编辑相关状态
const showEditModal = ref(false)
const editMode = ref<'add' | 'edit'>('add')
const editForm = ref<EditForm>({
  name: '',
  email: '',
  age: 20,
  status: 'active'
})
const editFormRef = ref()

// 编辑表单验证规则
const editRules = {
  name: {
    required: true,
    message: '请输入姓名',
    trigger: ['input', 'blur']
  },
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: ['input', 'blur']
  },
  age: {
    required: true,
    type: 'number',
    message: '请输入年龄',
    trigger: ['input', 'blur']
  },
  status: {
    required: true,
    message: '请选择状态',
    trigger: ['change', 'blur']
  }
}

// 新增用户
const handleAdd = () => {
  editMode.value = 'add'
  editForm.value = {
    name: '',
    email: '',
    age: 20,
    status: 'active'
  }
  showEditModal.value = true
}

// 编辑用户
const handleEdit = (row: UserData) => {
  editMode.value = 'edit'
  editForm.value = { ...row }
  showEditModal.value = true
}

// 查看用户
const handleView = (row: UserData) => {
  message.info(`查看用户：${row.name}`)
}

// 删除用户
const handleDelete = (row: UserData) => {
  message.warning(`删除用户：${row.name}`)
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的数据')
    return
  }
  message.warning(`批量删除 ${selectedRowKeys.value.length} 条数据`)
  clearSelection()
}

// 保存
const handleSave = async () => {
  try {
    await editFormRef.value?.validate()
    message.success(editMode.value === 'add' ? '新增成功' : '保存成功')
    showEditModal.value = false
    refreshData()
  } catch (error) {
    message.error('请检查表单数据')
  }
}
</script>

<style scoped>
.enhanced-table-example {
  height: 100%;
  padding: 16px;
}

.flex {
  display: flex;
}

.gap-2 {
  gap: 8px;
}

/* 优化表格滚动条样式 */
:deep(.n-data-table-wrapper) {
  border-radius: 8px;
  position: relative;
}

:deep(.n-data-table) {
  border-radius: 8px;
}

/* 自定义滚动条样式 */
:deep(.n-scrollbar-rail) {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.05);
}

:deep(.n-scrollbar-rail--horizontal) {
  height: 8px;
}

:deep(.n-scrollbar-rail--vertical) {
  width: 8px;
}

:deep(.n-scrollbar-handle) {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  transition: background-color 0.2s ease;
}

:deep(.n-scrollbar-handle:hover) {
  background-color: rgba(0, 0, 0, 0.4);
}

/* 表格容器优化 */
:deep(.n-data-table-base-table-body) {
  overflow: auto;
}

/* 滚动条不覆盖内容的解决方案 */
:deep(.n-data-table-base-table) {
  box-sizing: border-box;
}

:deep(.n-data-table-table) {
  width: calc(100% - 8px);
}

/* 表格头部样式优化 */
:deep(.n-data-table-thead) {
  background-color: #fafafa;
}

/* 表格行悬停效果 */
:deep(.n-data-table-tr:hover) {
  background-color: #f5f5f5;
}
</style>