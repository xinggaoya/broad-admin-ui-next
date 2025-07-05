<template>
  <div class="icon-example-page">
    <n-card title="图标组件示例" class="mb-4">
      <template #header-extra>
        <n-space>
          <n-button @click="resetAll">重置所有</n-button>
        </n-space>
      </template>

      <!-- 图标渲染器示例 -->
      <section class="example-section">
        <h3>图标渲染器 (IconRenderer)</h3>
        <p class="section-description">用于渲染单个图标，支持各种配置选项</p>

        <div class="example-grid">
          <!-- 基础用法 -->
          <n-card title="基础用法" size="small">
            <div class="icon-demo">
              <IconRenderer icon="DashboardOutlined" :size="24" />
              <IconRenderer icon="UserOutlined" :size="24" />
              <IconRenderer icon="SettingOutlined" :size="24" />
            </div>
            <n-divider />
            <div class="code-example">
              <pre><code>&lt;IconRenderer icon="DashboardOutlined" :size="24" /&gt;</code></pre>
            </div>
          </n-card>

          <!-- 不同尺寸 -->
          <n-card title="不同尺寸" size="small">
            <div class="icon-demo">
              <IconRenderer icon="HeartOutlined" :size="16" />
              <IconRenderer icon="HeartOutlined" :size="20" />
              <IconRenderer icon="HeartOutlined" :size="24" />
              <IconRenderer icon="HeartOutlined" :size="32" />
              <IconRenderer icon="HeartOutlined" :size="48" />
            </div>
            <n-divider />
            <div class="code-example">
              <pre><code>&lt;IconRenderer icon="HeartOutlined" :size="16" /&gt;</code></pre>
            </div>
          </n-card>

          <!-- 不同颜色 -->
          <n-card title="不同颜色" size="small">
            <div class="icon-demo">
              <IconRenderer icon="StarOutlined" :size="24" color="#ff4d4f" />
              <IconRenderer icon="StarOutlined" :size="24" color="#52c41a" />
              <IconRenderer icon="StarOutlined" :size="24" color="#1890ff" />
              <IconRenderer icon="StarOutlined" :size="24" color="#722ed1" />
            </div>
            <n-divider />
            <div class="code-example">
              <pre><code>&lt;IconRenderer icon="StarOutlined" :size="24" color="#ff4d4f" /&gt;</code></pre>
            </div>
          </n-card>

          <!-- 错误处理 -->
          <n-card title="错误处理" size="small">
            <div class="icon-demo">
              <IconRenderer icon="NonExistentIcon" :size="24" />
              <IconRenderer icon="" :size="24" />
              <IconRenderer :size="24" :show-placeholder="true" placeholder="?" />
            </div>
            <n-divider />
            <div class="code-example">
              <pre><code>&lt;IconRenderer icon="NonExistentIcon" :size="24" /&gt;</code></pre>
            </div>
          </n-card>
        </div>
      </section>

      <!-- 图标选择器示例 -->
      <section class="example-section">
        <h3>图标选择器 (IconSelector)</h3>
        <p class="section-description">用于选择图标，支持单选和多选模式</p>

        <div class="selector-examples">
          <!-- 单选模式 -->
          <n-card title="单选模式" size="small" class="mb-4">
            <div class="selected-display mb-4">
              <div class="selected-label">当前选中：</div>
              <div class="selected-icon">
                <IconRenderer v-if="singleSelected" :icon="singleSelected" :size="32" />
                <span v-else class="no-selection">未选择</span>
              </div>
              <div class="selected-name">{{ singleSelected || '无' }}</div>
            </div>

            <n-modal
              v-model:show="showSingleModal"
              preset="dialog"
              style="width: 900px; height: 700px"
            >
              <template #header>
                <div>选择图标</div>
              </template>

              <IconSelector
                v-model="singleSelected"
                :multiple="false"
                :show-preview="true"
                style="height: 500px"
              />

              <template #action>
                <n-space>
                  <n-button @click="showSingleModal = false">取消</n-button>
                  <n-button type="primary" @click="showSingleModal = false">确定</n-button>
                </n-space>
              </template>
            </n-modal>

            <n-button @click="showSingleModal = true">选择图标</n-button>
          </n-card>

          <!-- 多选模式 -->
          <n-card title="多选模式" size="small" class="mb-4">
            <div class="selected-display mb-4">
              <div class="selected-label">当前选中 ({{ multipleSelected.length }}/5)：</div>
              <div class="selected-icons">
                <div v-for="icon in multipleSelected" :key="icon" class="selected-icon-item">
                  <IconRenderer :icon="icon" :size="24" />
                  <span class="icon-name">{{ icon }}</span>
                </div>
                <div v-if="multipleSelected.length === 0" class="no-selection">未选择任何图标</div>
              </div>
            </div>

            <n-modal
              v-model:show="showMultipleModal"
              preset="dialog"
              style="width: 900px; height: 700px"
            >
              <template #header>
                <div>选择图标 (最多5个)</div>
              </template>

              <IconSelector
                v-model="multipleSelected"
                :multiple="true"
                :max-count="5"
                :show-preview="true"
                style="height: 500px"
              />

              <template #action>
                <n-space>
                  <n-button @click="showMultipleModal = false">取消</n-button>
                  <n-button type="primary" @click="showMultipleModal = false">确定</n-button>
                </n-space>
              </template>
            </n-modal>

            <n-space>
              <n-button @click="showMultipleModal = true">选择图标</n-button>
              <n-button @click="multipleSelected = []">清空选择</n-button>
            </n-space>
          </n-card>

          <!-- 嵌入式选择器 -->
          <n-card title="嵌入式选择器" size="small">
            <p class="mb-4">直接嵌入页面中使用</p>
            <div style="height: 400px; border: 1px solid #e0e0e6; border-radius: 6px">
              <IconSelector
                v-model="embeddedSelected"
                :multiple="true"
                :max-count="3"
                :show-preview="false"
                :page-size="24"
              />
            </div>
            <div v-if="embeddedSelected.length > 0" class="mt-4">
              <n-tag v-for="icon in embeddedSelected" :key="icon" class="mr-2">
                <template #icon>
                  <IconRenderer :icon="icon" :size="14" />
                </template>
                {{ icon }}
              </n-tag>
            </div>
          </n-card>
        </div>
      </section>

      <!-- 实际应用场景 -->
      <section class="example-section">
        <h3>实际应用场景</h3>
        <p class="section-description">在实际项目中的使用示例</p>

        <div class="application-examples">
          <!-- 菜单配置 -->
          <n-card title="菜单配置" size="small" class="mb-4">
            <div class="menu-config">
              <div class="menu-item" v-for="(item, index) in menuItems" :key="index">
                <div class="menu-icon">
                  <IconRenderer :icon="item.icon" :size="20" />
                </div>
                <div class="menu-content">
                  <div class="menu-name">{{ item.name }}</div>
                  <div class="menu-path">{{ item.path }}</div>
                </div>
                <n-button size="small" @click="editMenuItem(index)"> 编辑图标 </n-button>
              </div>
            </div>

            <n-modal v-model:show="showMenuEditModal" preset="dialog" style="width: 800px">
              <template #header>
                <div>编辑菜单图标</div>
              </template>

              <div class="mb-4">
                <div class="current-menu-item">
                  <IconRenderer :icon="currentMenuItem?.icon" :size="24" />
                  <span>{{ currentMenuItem?.name }}</span>
                </div>
              </div>

              <IconSelector v-model="tempIcon" :multiple="false" style="height: 400px" />

              <template #action>
                <n-space>
                  <n-button @click="showMenuEditModal = false">取消</n-button>
                  <n-button type="primary" @click="saveMenuIcon">保存</n-button>
                </n-space>
              </template>
            </n-modal>
          </n-card>

          <!-- 按钮组合 -->
          <n-card title="按钮组合" size="small">
            <div class="button-examples">
              <n-space>
                <n-button type="primary">
                  <template #icon>
                    <IconRenderer icon="PlusOutlined" :size="16" />
                  </template>
                  新增
                </n-button>

                <n-button>
                  <template #icon>
                    <IconRenderer icon="EditOutlined" :size="16" />
                  </template>
                  编辑
                </n-button>

                <n-button type="error">
                  <template #icon>
                    <IconRenderer icon="DeleteOutlined" :size="16" />
                  </template>
                  删除
                </n-button>

                <n-button>
                  <template #icon>
                    <IconRenderer icon="ExportOutlined" :size="16" />
                  </template>
                  导出
                </n-button>
              </n-space>
            </div>
          </n-card>
        </div>
      </section>

      <!-- 代码示例 -->
      <section class="example-section">
        <h3>代码示例</h3>
        <p class="section-description">完整的使用代码示例</p>

        <n-tabs type="card">
          <n-tab-pane name="renderer" tab="图标渲染器">
            <n-code language="vue" :code="rendererCode" />
          </n-tab-pane>

          <n-tab-pane name="selector" tab="图标选择器">
            <n-code language="vue" :code="selectorCode" />
          </n-tab-pane>

          <n-tab-pane name="utils" tab="工具函数">
            <n-code language="typescript" :code="utilsCode" />
          </n-tab-pane>
        </n-tabs>
      </section>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NCard, NSpace, NButton, NDivider, NModal, NTag, NTabs, NTabPane, NCode } from 'naive-ui'
import IconRenderer from '../components/icon/IconRenderer.vue'
import IconSelector from '../components/icon/IconSelector.vue'

defineOptions({
  name: 'IconExample',
})

// 响应式数据
const singleSelected = ref('DashboardOutlined')
const multipleSelected = ref<string[]>(['UserOutlined', 'SettingOutlined'])
const embeddedSelected = ref<string[]>([])

const showSingleModal = ref(false)
const showMultipleModal = ref(false)
const showMenuEditModal = ref(false)

const currentMenuItemIndex = ref(-1)
const tempIcon = ref('')

// 菜单配置示例
const menuItems = reactive([
  { name: '仪表盘', path: '/dashboard', icon: 'DashboardOutlined' },
  { name: '用户管理', path: '/users', icon: 'UserOutlined' },
  { name: '系统设置', path: '/settings', icon: 'SettingOutlined' },
  { name: '数据分析', path: '/analytics', icon: 'BarChartOutlined' },
])

const currentMenuItem = ref<(typeof menuItems)[0] | null>(null)

// 方法
const resetAll = () => {
  singleSelected.value = ''
  multipleSelected.value = []
  embeddedSelected.value = []
}

const editMenuItem = (index: number) => {
  currentMenuItemIndex.value = index
  currentMenuItem.value = menuItems[index]
  tempIcon.value = menuItems[index].icon
  showMenuEditModal.value = true
}

const saveMenuIcon = () => {
  if (currentMenuItemIndex.value >= 0 && tempIcon.value) {
    menuItems[currentMenuItemIndex.value].icon = tempIcon.value
  }
  showMenuEditModal.value = false
}

// 代码示例
const rendererCode = `<template>
  <!-- 基础用法 -->
  <IconRenderer icon="DashboardOutlined" :size="24" />

  <!-- 自定义颜色和大小 -->
  <IconRenderer
    icon="HeartOutlined"
    :size="32"
    color="#ff4d4f"
  />

  <!-- 错误处理 -->
  <IconRenderer
    icon="NonExistentIcon"
    :size="24"
    :show-fallback="true"
    fallback-color="#ccc"
  />
</template>

<script setup>
import IconRenderer from '@/components/icon/IconRenderer.vue'
<\/script>`

const selectorCode = `<template>
  <!-- 单选模式 -->
  <IconSelector
    v-model="selectedIcon"
    :multiple="false"
    :show-preview="true"
  />

  <!-- 多选模式 -->
  <IconSelector
    v-model="selectedIcons"
    :multiple="true"
    :max-count="5"
    :page-size="48"
    @select="handleSelect"
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import IconSelector from '@/components/icon/IconSelector.vue'

const selectedIcon = ref('')
const selectedIcons = ref([])

const handleSelect = (iconName) => {
  // 选中图标: iconName
}

const handleChange = (icons) => {
  // 图标列表变化
}
<\/script>`

const utilsCode = `// 导入工具函数
import {
  getAllIcons,
  getIconCategories,
  searchIcons,
  hasIcon,
  getIconComponent
} from '@/utils/iconUtils'

// 获取所有图标
const allIcons = getAllIcons()
  // 总图标数量: allIcons.length

// 获取图标分类
const categories = getIconCategories()
  // 分类: Object.keys(categories)

// 搜索图标
const searchResults = searchIcons('user')
  // 搜索结果: searchResults

// 检查图标是否存在
const exists = hasIcon('DashboardOutlined')
  // 图标存在: exists

// 获取图标组件
const component = getIconComponent('UserOutlined')
  // 图标组件: component`
</script>

<style scoped>
.icon-example-page {
  padding: 20px;
}

.example-section {
  margin-bottom: 32px;
}

.example-section h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.section-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.icon-demo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.code-example {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #333;
  overflow-x: auto;
}

.selector-examples {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.selected-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.selected-label {
  font-weight: 500;
  color: #333;
}

.selected-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e6;
  border-radius: 6px;
  background: #fff;
}

.selected-name {
  font-size: 14px;
  color: #666;
}

.no-selection {
  color: #999;
  font-style: italic;
}

.selected-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.selected-icon-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e0e0e6;
  border-radius: 6px;
}

.icon-name {
  font-size: 12px;
  color: #666;
}

.application-examples {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e0e0e6;
  border-radius: 6px;
  background: #fafafa;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.menu-content {
  flex: 1;
}

.menu-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.menu-path {
  font-size: 12px;
  color: #666;
}

.current-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f0f9f4;
  border: 1px solid #18a058;
  border-radius: 6px;
  font-weight: 500;
}

.button-examples {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mr-2 {
  margin-right: 8px;
}

.mt-4 {
  margin-top: 16px;
}

/* 暗黑模式适配 */
html.dark .code-example {
  background: #2c2c32;
  color: #fff;
}

html.dark .selected-display {
  background: #2c2c32;
}

html.dark .selected-label {
  color: #fff;
}

html.dark .selected-icon {
  border-color: #2c2c32;
  background: #18181c;
}

html.dark .selected-icon-item {
  background: #18181c;
  border-color: #2c2c32;
}

html.dark .menu-item {
  border-color: #2c2c32;
  background: #18181c;
}

html.dark .menu-name {
  color: #fff;
}

html.dark .current-menu-item {
  background: #2a4a3a;
  border-color: #63e2b7;
  color: #fff;
}

html.dark .button-examples {
  background: #2c2c32;
}
</style>
