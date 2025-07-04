<template>
  <div class="table-layout">
    <!-- 搜索区域 -->
    <div v-if="$slots.search" class="table-search">
      <n-card :bordered="false" class="search-card">
        <slot name="search" />
      </n-card>
    </div>

    <!-- 工具栏区域 -->
    <div class="table-toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left" />
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right">
          <!-- 默认表格设置按钮 -->
          <n-button
            v-if="showTableSettings"
            quaternary
            circle
            @click="handleTableSettings"
          >
            <template #icon>
              <n-icon><SettingsOutline /></n-icon>
            </template>
          </n-button>
        </slot>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-content">
      <n-card :bordered="false" class="table-card">
        <slot name="table" />
      </n-card>
    </div>

    <!-- 分页区域 -->
    <div v-if="$slots.pagination" class="table-pagination">
      <slot name="pagination" />
    </div>

    <!-- 表格设置抽屉 -->
    <n-drawer
      v-model:show="showSettingsDrawer"
      :width="320"
      placement="right"
      :mask-closable="true"
    >
      <n-drawer-content title="表格设置" closable>
        <TableSettings
          v-if="tableColumns"
          :columns="tableColumns"
          :density="tableDensity"
          @update:columns="handleColumnsUpdate"
          @update:density="handleDensityUpdate"
          @reset="handleSettingsReset"
        />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SettingsOutline } from '@vicons/ionicons5'
import type { DataTableColumns } from 'naive-ui'
import TableSettings from './TableSettings.vue'

interface Props {
  // 是否显示表格设置按钮
  showTableSettings?: boolean
  // 表格列配置（用于设置功能）
  tableColumns?: DataTableColumns
  // 表格密度
  tableDensity?: 'small' | 'medium' | 'large'
}

interface Emits {
  // 列配置更新事件
  'update:columns': [columns: DataTableColumns]
  // 密度更新事件
  'update:density': [density: 'small' | 'medium' | 'large']
  // 设置重置事件
  'settings-reset': []
}

withDefaults(defineProps<Props>(), {
  showTableSettings: true
})

const emit = defineEmits<Emits>()

// 表格设置抽屉显示状态
const showSettingsDrawer = ref(false)

// 打开表格设置
const handleTableSettings = () => {
  showSettingsDrawer.value = true
}

// 处理列配置更新
const handleColumnsUpdate = (columns: DataTableColumns) => {
  emit('update:columns', columns)
}

// 处理密度更新
const handleDensityUpdate = (density: 'small' | 'medium' | 'large') => {
  emit('update:density', density)
}

// 处理设置重置
const handleSettingsReset = () => {
  emit('settings-reset')
}
</script>

<style scoped>
.table-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.table-search {
  flex-shrink: 0;
}

.search-card {
  border-radius: 8px;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  min-height: 40px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-content {
  flex: 1;
  min-height: 0;
}

.table-card {
  height: 100%;
  border-radius: 8px;
}

.table-card :deep(.n-card__content) {
  height: 100%;
  padding: 0;
}

.table-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>