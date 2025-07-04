<template>
  <div class="table-example-container">
    <n-card title="表格示例" class="table-card">
      <!-- 搜索栏 -->
      <div class="search-section">
        <n-form
          ref="searchFormRef"
          :model="searchForm"
          label-placement="left"
          label-width="auto"
          class="search-form"
        >
          <n-grid :cols="4" :x-gap="16" :y-gap="8">
            <n-gi>
              <n-form-item label="用户名">
                <n-input
                  v-model:value="searchForm.username"
                  placeholder="请输入用户名"
                  clearable
                  @keyup.enter="handleSearch"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="邮箱">
                <n-input
                  v-model:value="searchForm.email"
                  placeholder="请输入邮箱"
                  clearable
                  @keyup.enter="handleSearch"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="状态">
                <n-select
                  v-model:value="searchForm.status"
                  placeholder="请选择状态"
                  clearable
                  :options="statusOptions"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="部门">
                <n-select
                  v-model:value="searchForm.department"
                  placeholder="请选择部门"
                  clearable
                  :options="departmentOptions"
                />
              </n-form-item>
            </n-gi>
          </n-grid>
          
          <div class="search-actions">
            <n-space>
              <n-button type="primary" @click="handleSearch">
                <template #icon>
                  <n-icon>
                    <SearchOutline />
                  </n-icon>
                </template>
                搜索
              </n-button>
              <n-button @click="resetSearch">
                <template #icon>
                  <n-icon>
                    <RefreshOutline />
                  </n-icon>
                </template>
                重置
              </n-button>
              <n-button type="success" @click="handleAdd">
                <template #icon>
                  <n-icon>
                    <AddOutline />
                  </n-icon>
                </template>
                新增
              </n-button>
              <n-button 
                type="error" 
                :disabled="selectedRowKeys.length === 0"
                @click="handleBatchDelete"
              >
                <template #icon>
                  <n-icon>
                    <TrashOutline />
                  </n-icon>
                </template>
                批量删除 ({{ selectedRowKeys.length }})
              </n-button>
            </n-space>
          </div>
        </n-form>
      </div>

      <!-- 表格 -->
      <div class="table-section">
        <n-data-table
          :columns="columns"
          :data="data"
          :loading="loading"
          :pagination="pagination"
          :row-key="(row) => row.id"
          :checked-row-keys="selectedRowKeys"
          @update:checked-row-keys="handleSelectionChange"
          :scroll-x="1200"
          striped
          size="small"
        />
      </div>

      <!-- 操作提示 -->
      <div class="tips-section">
        <n-alert type="info" :show-icon="false">
          <template #header>
            <n-icon>
              <InformationCircleOutline />
            </n-icon>
            使用提示
          </template>
          <ul>
            <li>支持多条件搜索，输入关键词后点击搜索或按回车键</li>
            <li>支持批量选择和批量操作</li>
            <li>支持分页大小调整和快速跳转</li>
            <li>表格列可以拖拽调整顺序（开发中）</li>
            <li>点击操作按钮可以编辑或删除单条记录</li>
          </ul>
        </n-alert>
      </div>
    </n-card>

    <!-- 编辑对话框 -->
    <n-modal v-model:show="showEditModal" preset="dialog" title="编辑用户">
      <n-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-placement="left"
        label-width="80px"
      >
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="editForm.username" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="editForm.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item label="手机号" path="phone">
          <n-input v-model:value="editForm.phone" placeholder="请输入手机号" />
        </n-form-item>
        <n-form-item label="部门" path="department">
          <n-select
            v-model:value="editForm.department"
            placeholder="请选择部门"
            :options="departmentOptions"
          />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="editForm.status"
            placeholder="请选择状态"
            :options="statusOptions"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="showEditModal = false">取消</n-button>
          <n-button type="primary" @click="handleSave">保存</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { useTable, createMockApi, createColumns } from '@/hooks/useTable'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import {
  SearchOutline,
  RefreshOutline,
  AddOutline,
  TrashOutline,
  CreateOutline,
  InformationCircleOutline
} from '@vicons/ionicons5'

defineOptions({
  name: 'TableExample'
})

// 用户数据接口
interface UserData {
  id: number
  username: string
  email: string
  phone: string
  department: string
  status: 'active' | 'inactive' | 'pending'
  createTime: string
  lastLogin: string
}

// 模拟数据
const mockUsers: UserData[] = Array.from({ length: 156 }, (_, index) => ({
  id: index + 1,
  username: `user${index + 1}`,
  email: `user${index + 1}@example.com`,
  phone: `138${String(index + 1).padStart(8, '0')}`,
  department: ['技术部', '产品部', '运营部', '市场部', '人事部'][index % 5],
  status: ['active', 'inactive', 'pending'][index % 3] as 'active' | 'inactive' | 'pending',
  createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}))

// 创建模拟 API
const mockApi = createMockApi(mockUsers, 800)

// 状态映射
const statusMap = {
  active: { label: '激活', type: 'success' },
  inactive: { label: '禁用', type: 'error' },
  pending: { label: '待审核', type: 'warning' }
}

// 选项数据
const statusOptions = [
  { label: '激活', value: 'active' },
  { label: '禁用', value: 'inactive' },
  { label: '待审核', value: 'pending' }
]

const departmentOptions = [
  { label: '技术部', value: '技术部' },
  { label: '产品部', value: '产品部' },
  { label: '运营部', value: '运营部' },
  { label: '市场部', value: '市场部' },
  { label: '人事部', value: '人事部' }
]

// 表格列配置
const initialColumns: DataTableColumns<UserData> = [
  createColumns.text('用户名', 'username', 120),
  createColumns.text('邮箱', 'email', 200),
  createColumns.text('手机号', 'phone', 130),
  createColumns.text('部门', 'department', 100),
  createColumns.status('状态', 'status', statusMap),
  createColumns.date('创建时间', 'createTime'),
  createColumns.date('最后登录', 'lastLogin'),
  createColumns.actions('操作', [
    {
      label: '编辑',
      onClick: (row: UserData) => handleEdit(row),
      type: 'primary'
    },
    {
      label: '删除',
      onClick: (row: UserData) => handleDelete(row),
      type: 'error'
    }
  ])
]

// 使用表格 Hook
const {
  data,
  loading,
  total,
  pagination,
  searchForm,
  resetSearch,
  handleSearch,
  selectedRowKeys,
  selectedRows,
  handleSelectionChange,
  clearSelection,
  refresh,
  columns
} = useTable(mockApi, initialColumns, {
  showPagination: true,
  showIndex: true,
  showSelection: true,
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100]
})

// 消息和对话框
const message = useMessage()
const dialog = useDialog()

// 编辑相关
const showEditModal = ref(false)
const editForm = ref<Partial<UserData>>({})
const editFormRef = ref<FormInst>()
const searchFormRef = ref<FormInst>()

// 表单验证规则
const editRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 新增用户
const handleAdd = () => {
  editForm.value = {
    username: '',
    email: '',
    phone: '',
    department: '',
    status: 'pending'
  }
  showEditModal.value = true
}

// 编辑用户
const handleEdit = (row: UserData) => {
  editForm.value = { ...row }
  showEditModal.value = true
}

// 删除用户
const handleDelete = (row: UserData) => {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除用户 "${row.username}" 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      // 这里应该调用删除 API
      message.success(`已删除用户 "${row.username}"`)
      refresh()
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的数据')
    return
  }
  
  dialog.warning({
    title: '确认批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条数据吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      // 这里应该调用批量删除 API
      message.success(`已删除 ${selectedRowKeys.value.length} 条数据`)
      clearSelection()
      refresh()
    }
  })
}

// 保存用户
const handleSave = () => {
  editFormRef.value?.validate((errors) => {
    if (!errors) {
      // 这里应该调用保存 API
      const isEdit = !!editForm.value.id
      message.success(isEdit ? '编辑成功' : '新增成功')
      showEditModal.value = false
      refresh()
    }
  })
}

// 初始化
onMounted(() => {
  refresh()
})
</script>

<style scoped>
.table-example-container {
  padding: 16px;
}

.table-card {
  margin-bottom: 16px;
}

.search-section {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.search-form {
  margin-bottom: 0;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.table-section {
  margin-bottom: 16px;
}

.tips-section {
  margin-top: 16px;
}

.tips-section ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.tips-section li {
  margin-bottom: 4px;
  color: #666;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-example-container {
    padding: 8px;
  }
  
  .search-section {
    padding: 12px;
  }
  
  .search-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .search-actions .n-space {
    width: 100%;
    justify-content: stretch;
  }
  
  .search-actions .n-button {
    flex: 1;
  }
}
</style>