<template>
  <div class="transaction-panel">
    <n-data-table
      :columns="columns"
      :data="transactions"
      :pagination="pagination"
      :bordered="false"
      :single-line="false"
      size="small"
      striped
    />
  </div>
</template>

<script setup lang="ts">
import { NDataTable, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

interface Transaction {
  id: string
  user: string
  amount: number
  status: 'success' | 'pending' | 'failed'
  time: string
}

interface Props {
  transactions: Transaction[]
}

defineProps<Props>()

interface ColumnData {
  id: string
  user: string
  amount: number
  status: string
  time: string
}

const columns: DataTableColumns<ColumnData> = [
  {
    title: '订单号',
    key: 'id',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '用户',
    key: 'user',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '金额',
    key: 'amount',
    width: 100,
    render: (row) => {
      return `¥${row.amount.toFixed(2)}`
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) => {
      const typeMap = {
        success: 'success' as const,
        pending: 'warning' as const,
        failed: 'error' as const,
      }
      const textMap = {
        success: '成功',
        pending: '处理中',
        failed: '失败',
      }
      return h(NTag, {
        type: typeMap[row.status as keyof typeof typeMap],
        size: 'small',
      }, () => textMap[row.status as keyof typeof textMap])
    },
  },
  {
    title: '时间',
    key: 'time',
    width: 100,
  },
]

const pagination = {
  pageSize: 10,
}
</script>

<style scoped>
.transaction-panel {
  max-height: 400px;
  overflow-y: auto;
}

:deep(.n-data-table-wrapper) {
  border-radius: 8px;
}

/* 自定义表格样式 */
:deep(.n-data-table-td) {
  padding: 12px 16px !important;
}

:deep(.n-data-table-th) {
  padding: 12px 16px !important;
  background-color: #fafafa !important;
  font-weight: 600 !important;
}

html.dark :deep(.n-data-table-th) {
  background-color: #2c2c32 !important;
}
</style>