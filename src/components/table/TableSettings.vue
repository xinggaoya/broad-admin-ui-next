<template>
  <div class="table-settings">
    <!-- 列显示设置 -->
    <div class="setting-section">
      <div class="section-title">
        <n-icon><EyeOutline /></n-icon>
        <span>列显示</span>
      </div>
      <div class="column-list" ref="columnListRef">
        <div
          v-for="(column, index) in localColumns"
          :key="column.key || index"
          class="column-item"
          :data-index="index"
        >
          <div class="column-drag-handle">
            <n-icon><ReorderThreeOutline /></n-icon>
          </div>
          <n-checkbox
            :checked="!column.hidden"
            @update:checked="(checked) => toggleColumnVisible(index, checked)"
          >
            {{ column.title || column.key }}
          </n-checkbox>
          <div class="column-width" v-if="column.resizable !== false">
            <n-input-number
              :value="column.width as number"
              :min="60"
              :max="500"
              :step="10"
              size="small"
              @update:value="(value) => updateColumnWidth(index, value)"
            >
              <template #suffix>px</template>
            </n-input-number>
          </div>
        </div>
      </div>
    </div>

    <!-- 表格密度设置 -->
    <div class="setting-section">
      <div class="section-title">
        <n-icon><ResizeOutline /></n-icon>
        <span>表格密度</span>
      </div>
      <n-radio-group
        :value="tableDensity"
        @update:value="updateTableDensity"
      >
        <n-space>
          <n-radio value="small">紧凑</n-radio>
          <n-radio value="medium">默认</n-radio>
          <n-radio value="large">宽松</n-radio>
        </n-space>
      </n-radio-group>
    </div>

    <!-- 操作按钮 -->
    <div class="setting-actions">
      <n-space>
        <n-button @click="resetSettings" ghost>
          重置
        </n-button>
        <n-button @click="applySettings" type="primary">
          应用
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { EyeOutline, ReorderThreeOutline, ResizeOutline } from '@vicons/ionicons5'
import type { DataTableColumns } from 'naive-ui'
import Sortable from 'sortablejs'

interface Props {
  columns: DataTableColumns
  density?: 'small' | 'medium' | 'large'
}

interface Emits {
  'update:columns': [columns: DataTableColumns]
  'update:density': [density: 'small' | 'medium' | 'large']
  'reset': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 本地列配置
const localColumns = ref<DataTableColumns>([])
// 表格密度
const tableDensity = ref<'small' | 'medium' | 'large'>('medium')
// 列表容器引用
const columnListRef = ref<HTMLElement>()
// Sortable 实例
let sortableInstance: Sortable | null = null

// 初始化本地列配置
const initLocalColumns = () => {
  localColumns.value = props.columns.map(column => ({
    ...column,
    hidden: column.hidden || false,
    width: column.width || 120,
    resizable: column.resizable !== false
  }))
}

// 初始化表格密度
const initTableDensity = () => {
  tableDensity.value = props.density || 'medium'
}

// 切换列显示状态
const toggleColumnVisible = (index: number, visible: boolean) => {
  localColumns.value[index].hidden = !visible
}

// 更新列宽
const updateColumnWidth = (index: number, width: number | null) => {
  if (width !== null) {
    localColumns.value[index].width = width
  }
}

// 更新表格密度
const updateTableDensity = (density: 'small' | 'medium' | 'large') => {
  tableDensity.value = density
  emit('update:density', density)
}

// 应用设置
const applySettings = () => {
  const updatedColumns = localColumns.value.map(column => {
    const { hidden, ...rest } = column
    return hidden ? { ...rest, hidden: true } : rest
  })
  emit('update:columns', updatedColumns)
}

// 重置设置
const resetSettings = () => {
  initLocalColumns()
  initTableDensity()
  emit('reset')
}

// 初始化拖拽排序
const initSortable = () => {
  if (!columnListRef.value) return

  sortableInstance = new Sortable(columnListRef.value, {
    handle: '.column-drag-handle',
    animation: 150,
    ghostClass: 'column-ghost',
    chosenClass: 'column-chosen',
    dragClass: 'column-drag',
    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt
      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
        const columns = [...localColumns.value]
        const [movedColumn] = columns.splice(oldIndex, 1)
        columns.splice(newIndex, 0, movedColumn)
        localColumns.value = columns
      }
    }
  })
}

// 销毁拖拽实例
const destroySortable = () => {
  if (sortableInstance) {
    sortableInstance.destroy()
    sortableInstance = null
  }
}

onMounted(() => {
  initLocalColumns()
  initTableDensity()
  nextTick(() => {
    initSortable()
  })
})

// 监听 props 变化
watch(() => props.columns, () => {
  initLocalColumns()
}, { deep: true })

watch(() => props.density, () => {
  initTableDensity()
})

// 组件卸载时销毁拖拽实例
onUnmounted(() => {
  destroySortable()
})
</script>

<style scoped>
.table-settings {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--n-text-color);
}

.column-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.column-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  background: var(--n-card-color);
  transition: all 0.2s ease;
}

.column-item:hover {
  border-color: var(--n-primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.column-drag-handle {
  cursor: grab;
  color: var(--n-text-color-disabled);
  display: flex;
  align-items: center;
}

.column-drag-handle:active {
  cursor: grabbing;
}

.column-width {
  margin-left: auto;
  width: 100px;
}

.column-ghost {
  opacity: 0.5;
}

.column-chosen {
  border-color: var(--n-primary-color);
}

.column-drag {
  transform: rotate(5deg);
}

.setting-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--n-border-color);
}
</style>