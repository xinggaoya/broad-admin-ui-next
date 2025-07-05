<template>
  <div class="icon-selector">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <n-input
        v-model:value="searchKeyword"
        placeholder="搜索图标..."
        size="large"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <n-icon>
            <SearchOutlined />
          </n-icon>
        </template>
      </n-input>
    </div>

    <!-- 分类标签 -->
    <div class="category-tabs">
      <n-tabs
        v-model:value="activeCategory"
        type="line"
        size="small"
        @update:value="handleCategoryChange"
      >
        <n-tab-pane name="all" tab="全部">
          <template #tab>
            <div class="tab-content">
              <n-icon size="14">
                <AppstoreOutlined />
              </n-icon>
              <span>全部</span>
              <n-tag size="small" :bordered="false">{{ allIcons.length }}</n-tag>
            </div>
          </template>
        </n-tab-pane>

        <n-tab-pane
          v-for="(category, key) in categories"
          :key="key"
          :name="key"
          :tab="category.name"
        >
          <template #tab>
            <div class="tab-content">
              <n-icon size="14">
                <FolderOutlined />
              </n-icon>
              <span>{{ category.name }}</span>
              <n-tag size="small" :bordered="false">{{ category.icons.length }}</n-tag>
            </div>
          </template>
        </n-tab-pane>
      </n-tabs>
    </div>

    <!-- 图标网格 -->
    <div class="icon-grid-container">
      <div v-if="filteredIcons.length === 0" class="empty-state">
        <n-empty description="没有找到相关图标" />
      </div>

      <div v-else class="icon-grid">
        <n-popover
          v-for="iconName in paginatedIcons"
          :key="iconName"
          trigger="hover"
          placement="top"
          :disabled="!showPreview"
          :delay="300"
          :duration="100"
        >
          <template #trigger>
            <div
              class="icon-item"
              :class="{
                selected: isSelected(iconName),
              }"
              @click="handleSelect(iconName)"
            >
              <div class="icon-wrapper">
                <IconRenderer
                  :icon="iconName"
                  :size="24"
                  :show-fallback="false"
                  :show-placeholder="true"
                />
              </div>
              <div class="icon-name">{{ iconName }}</div>

              <!-- 选中状态指示器 -->
              <div v-if="isSelected(iconName)" class="selected-indicator">
                <n-icon size="12" color="#18a058">
                  <CheckOutlined />
                </n-icon>
              </div>
            </div>
          </template>

          <!-- 预览内容 -->
          <template #default>
            <div class="popover-preview">
              <div class="preview-header">
                <IconRenderer :icon="iconName" :size="32" />
                <span class="preview-title">{{ iconName }}</span>
              </div>
              <div class="preview-sizes">
                <span class="size-label">预览尺寸：</span>
                <div class="size-icons">
                  <IconRenderer :icon="iconName" :size="16" />
                  <IconRenderer :icon="iconName" :size="20" />
                  <IconRenderer :icon="iconName" :size="24" />
                  <IconRenderer :icon="iconName" :size="32" />
                </div>
              </div>
            </div>
          </template>
        </n-popover>
      </div>
    </div>

    <!-- 分页器 -->
    <div v-if="totalPages > 1" class="pagination">
      <n-pagination
        v-model:page="currentPage"
        :page-count="totalPages"
        :page-size="pageSize"
        :item-count="filteredIcons.length"
        show-size-picker
        :page-sizes="[24, 48, 96, 192]"
        @update:page-size="handlePageSizeChange"
      />
    </div>

    <!-- 选择状态栏 -->
    <div v-if="selectedIcons.length > 0" class="selection-bar">
      <div class="selection-info">
        <span>已选择 {{ selectedIcons.length }} 个图标</span>
        <n-button text @click="clearSelection">
          <template #icon>
            <n-icon>
              <CloseOutlined />
            </n-icon>
          </template>
          清空选择
        </n-button>
      </div>

      <div class="selected-icons">
        <div
          v-for="iconName in selectedIcons.slice(0, 5)"
          :key="iconName"
          class="selected-icon-item"
          @click="handleUnselect(iconName)"
        >
          <IconRenderer :icon="iconName" :size="16" />
          <n-icon size="12" class="remove-icon">
            <CloseOutlined />
          </n-icon>
        </div>

        <div v-if="selectedIcons.length > 5" class="more-count">
          +{{ selectedIcons.length - 5 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  NInput,
  NIcon,
  NTabs,
  NTabPane,
  NTag,
  NEmpty,
  NPagination,
  NButton,
  NPopover,
} from 'naive-ui'
import {
  SearchOutlined,
  AppstoreOutlined,
  FolderOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@vicons/antd'
import IconRenderer from './IconRenderer.vue'
import {
  getAllIcons,
  getIconCategories,
  searchIcons,
  getIconsByCategory,
} from '../../utils/iconUtils'

defineOptions({
  name: 'IconSelector',
})

interface Props {
  /** 是否多选模式 */
  multiple?: boolean
  /** 当前选中的图标 */
  modelValue?: string | string[]
  /** 每页显示数量 */
  pageSize?: number
  /** 最大选择数量（多选模式下） */
  maxCount?: number
  /** 是否显示预览 */
  showPreview?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | string[]): void
  (e: 'select', iconName: string): void
  (e: 'unselect', iconName: string): void
  (e: 'change', selectedIcons: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  modelValue: () => [],
  pageSize: 48,
  maxCount: 10,
  showPreview: true,
})

const emit = defineEmits<Emits>()

// 响应式数据
const searchKeyword = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(props.pageSize)

// 图标数据
const allIcons = getAllIcons()
const categories = getIconCategories()

// 当前选中的图标
const selectedIcons = computed({
  get: () => {
    if (props.multiple) {
      return Array.isArray(props.modelValue) ? props.modelValue : []
    } else {
      return props.modelValue ? [props.modelValue as string] : []
    }
  },
  set: (value: string[]) => {
    if (props.multiple) {
      emit('update:modelValue', value)
    } else {
      emit('update:modelValue', value[0] || '')
    }
    emit('change', value)
  },
})

// 过滤后的图标列表
const filteredIcons = computed(() => {
  let icons: string[] = []

  if (searchKeyword.value) {
    // 搜索模式
    icons = searchIcons(searchKeyword.value)
  } else if (activeCategory.value === 'all') {
    // 显示所有图标
    icons = allIcons
  } else {
    // 显示特定分类的图标
    icons = getIconsByCategory(activeCategory.value)
  }

  return icons
})

// 分页数据
const totalPages = computed(() => Math.ceil(filteredIcons.value.length / pageSize.value))
const paginatedIcons = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredIcons.value.slice(start, end)
})

// 方法
const handleSearch = () => {
  currentPage.value = 1
  activeCategory.value = 'all' // 搜索时切换到全部分类
}

const handleCategoryChange = () => {
  currentPage.value = 1
  searchKeyword.value = '' // 切换分类时清空搜索
}

const handlePageSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handleSelect = (iconName: string) => {
  if (props.multiple) {
    const currentSelected = [...selectedIcons.value]
    const index = currentSelected.indexOf(iconName)

    if (index > -1) {
      // 取消选择
      currentSelected.splice(index, 1)
      emit('unselect', iconName)
    } else {
      // 添加选择
      if (currentSelected.length < props.maxCount) {
        currentSelected.push(iconName)
        emit('select', iconName)
      }
    }

    selectedIcons.value = currentSelected
  } else {
    // 单选模式
    selectedIcons.value = [iconName]
    emit('select', iconName)
  }
}

const handleUnselect = (iconName: string) => {
  const currentSelected = [...selectedIcons.value]
  const index = currentSelected.indexOf(iconName)

  if (index > -1) {
    currentSelected.splice(index, 1)
    selectedIcons.value = currentSelected
    emit('unselect', iconName)
  }
}

const isSelected = (iconName: string) => {
  return selectedIcons.value.includes(iconName)
}

const clearSelection = () => {
  selectedIcons.value = []
}

// 监听筛选变化，重置页码
watch([searchKeyword, activeCategory], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.icon-selector {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.search-bar {
  margin-bottom: 16px;
}

.category-tabs {
  margin-bottom: 16px;
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-grid-container {
  flex: 1;
  min-height: 400px;
  max-height: 450px;
  overflow-y: auto;
  margin-bottom: 16px;
  padding-right: 4px;
}

/* 滚动条样式 */
.icon-grid-container::-webkit-scrollbar {
  width: 6px;
}

.icon-grid-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.icon-grid-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.icon-grid-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.icon-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 1px solid #e0e0e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}

.icon-item:hover {
  border-color: #18a058;
  background: #f0f9f4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 160, 88, 0.15);
}

.icon-item.selected {
  border-color: #18a058;
  background: #18a058;
  color: #fff;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
}

.icon-name {
  font-size: 12px;
  text-align: center;
  line-height: 1.2;
  word-break: break-all;
  max-width: 100%;
}

.selected-indicator {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: #18a058;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

/* Popover 预览样式 */
.popover-preview {
  width: 250px;
  padding: 8px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.preview-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.preview-sizes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.size-label {
  font-size: 12px;
  color: #666;
}

.size-icons {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 6px;
}

.selection-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f0f9f4;
  border: 1px solid #18a058;
  border-radius: 8px;
  margin-top: auto;
  position: relative;
  z-index: 2;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #18a058;
}

.selected-icons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-icon-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #18a058;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.selected-icon-item:hover {
  background: #f0f9f4;
}

.selected-icon-item .remove-icon {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.selected-icon-item:hover .remove-icon {
  opacity: 1;
}

.more-count {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #e0e0e6;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
}

/* 暗黑模式适配 */
html.dark .icon-item {
  border-color: #2c2c32;
  background: #18181c;
  color: #fff;
}

html.dark .icon-item:hover {
  border-color: #63e2b7;
  background: #2a4a3a;
}

html.dark .icon-item.selected {
  border-color: #63e2b7;
  background: #63e2b7;
  color: #000;
}

html.dark .selection-bar {
  background: #2a4a3a;
  border-color: #63e2b7;
}

html.dark .selection-info {
  color: #63e2b7;
}

html.dark .selected-icon-item {
  border-color: #63e2b7;
  background: #18181c;
}

html.dark .selected-icon-item:hover {
  background: #2a4a3a;
}

html.dark .more-count {
  background: #2c2c32;
  color: #fff;
}

/* 暗黑模式滚动条样式 */
html.dark .icon-grid-container::-webkit-scrollbar-track {
  background: #2c2c32;
}

html.dark .icon-grid-container::-webkit-scrollbar-thumb {
  background: #4c4c54;
}

html.dark .icon-grid-container::-webkit-scrollbar-thumb:hover {
  background: #6c6c74;
}

/* 暗黑模式 Popover 预览样式 */
html.dark .preview-title {
  color: #fff;
}

html.dark .size-label {
  color: #ccc;
}

html.dark .size-icons {
  background: #2c2c32;
}
</style>
