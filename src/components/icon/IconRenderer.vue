<template>
  <n-icon
    v-if="iconComponent"
    :size="size"
    :color="color"
    :depth="depth"
    :class="className"
    v-bind="$attrs"
  >
    <component :is="iconComponent" />
  </n-icon>
  <n-icon
    v-else-if="showFallback"
    :size="size"
    :color="fallbackColor || color"
    :depth="depth"
    :class="className"
    v-bind="$attrs"
  >
    <component :is="fallbackIcon" />
  </n-icon>
  <span v-else-if="showPlaceholder" class="icon-placeholder" :style="placeholderStyle">
    {{ placeholder }}
  </span>
</template>

<script setup lang="ts">
import { computed, type Component, type CSSProperties } from 'vue'
import { NIcon } from 'naive-ui'
import { QuestionCircleOutlined } from '@vicons/antd'
import { getIconComponent } from '../../utils/iconUtils'

defineOptions({
  name: 'IconRenderer',
  inheritAttrs: false,
})

interface Props {
  /** 图标名称 */
  icon?: string
  /** 图标大小 */
  size?: number | string
  /** 图标颜色 */
  color?: string
  /** 图标深度 */
  depth?: 1 | 2 | 3 | 4 | 5
  /** 额外的CSS类名 */
  className?: string
  /** 是否显示后备图标 */
  showFallback?: boolean
  /** 后备图标 */
  fallbackIcon?: Component
  /** 后备图标颜色 */
  fallbackColor?: string
  /** 是否显示占位符 */
  showPlaceholder?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 占位符样式 */
  placeholderStyle?: CSSProperties
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  size: 16,
  color: undefined,
  depth: undefined,
  className: '',
  showFallback: true,
  fallbackIcon: () => QuestionCircleOutlined,
  fallbackColor: '#ccc',
  showPlaceholder: false,
  placeholder: '?',
  placeholderStyle: () => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    fontSize: '12px',
    color: '#999',
    backgroundColor: '#f5f5f5',
    borderRadius: '2px',
  }),
})

// 获取图标组件
const iconComponent = computed(() => {
  if (!props.icon) return null
  return getIconComponent(props.icon)
})
</script>

<style scoped>
.icon-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  user-select: none;
}
</style>
