<template>
  <div class="user-list-container">
    <n-card title="用户列表" class="user-list-card">
      <template #header-extra>
        <n-space>
          <n-button type="primary">
            <template #icon>
              <n-icon><PlusOutlined /></n-icon>
            </template>
            新增用户
          </n-button>
        </n-space>
      </template>

      <!-- 搜索区域 -->
      <div class="search-area">
        <n-space>
          <n-input
            v-model:value="searchKeyword"
            placeholder="搜索用户名或邮箱"
            clearable
            style="width: 200px"
          >
            <template #prefix>
              <n-icon><SearchOutlined /></n-icon>
            </template>
          </n-input>
          <n-select
            v-model:value="statusFilter"
            placeholder="选择状态"
            :options="statusOptions"
            clearable
            style="width: 120px"
          />
          <n-button @click="handleSearch">搜索</n-button>
          <n-button @click="handleReset">重置</n-button>
        </n-space>
      </div>

      <!-- 用户表格 -->
      <n-data-table
        :columns="columns"
        :data="userData"
        :pagination="pagination"
        :loading="loading"
        striped
        size="small"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined, SearchOutlined } from '@vicons/antd'
import type { DataTableColumns } from 'naive-ui'

// 搜索参数
const searchKeyword = ref('')
const statusFilter = ref(null)
const loading = ref(false)

// 状态选项
const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
]

// 表格列定义
const columns: DataTableColumns = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '用户名',
    key: 'username',
  },
  {
    title: '邮箱',
    key: 'email',
  },
  {
    title: '角色',
    key: 'role',
  },
  {
    title: '状态',
    key: 'status',
    render(row: any) {
      return h(
        'n-tag',
        {
          type: row.status === 'active' ? 'success' : 'error',
        },
        row.status === 'active' ? '启用' : '禁用',
      )
    },
  },
  {
    title: '创建时间',
    key: 'createdAt',
  },
  {
    title: '操作',
    key: 'actions',
    render() {
      return h('n-space', [
        h('n-button', { size: 'small', type: 'primary' }, '编辑'),
        h('n-button', { size: 'small', type: 'error' }, '删除'),
      ])
    },
  },
]

// 模拟用户数据
const userData = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: '管理员',
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    role: '普通用户',
    status: 'active',
    createdAt: '2024-01-02',
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    role: '普通用户',
    status: 'inactive',
    createdAt: '2024-01-03',
  },
])

// 分页配置
const pagination = {
  page: 1,
  pageSize: 10,
  itemCount: userData.value.length,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  prefix: ({ itemCount }: any) => `共 ${itemCount} 条`,
}

// 搜索处理
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 重置处理
const handleReset = () => {
  searchKeyword.value = ''
  statusFilter.value = null
}
</script>

<style scoped>
.user-list-container {
  padding: 16px;
}

.user-list-card {
  border-radius: 8px;
}

.search-area {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

/* 暗黑模式适配 */
html.dark .search-area {
  background: #18181c;
}
</style>
