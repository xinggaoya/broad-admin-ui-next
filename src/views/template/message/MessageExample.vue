<template>
  <div class="message-example">
    <!-- 页面标题 -->
    <n-card class="mb-6">
      <template #header>
        <n-space align="center">
          <IconRenderer name="NotificationOutlined" />
          <span>消息提示示例</span>
        </n-space>
      </template>
      <n-text depth="3">
        演示项目中集成的 Naive UI 消息提示系统，包括 Message、Notification、Dialog、Modal
        等组件的使用方法。 所有组件都已与主题系统集成，支持明暗主题切换。
      </n-text>
    </n-card>

    <n-grid :cols="1" :x-gap="16" :y-gap="16">
      <!-- Message 消息 -->
      <n-grid-item>
        <n-card title="Message 消息" class="h-full">
          <template #header-extra>
            <n-tag type="info" size="small">全局消息</n-tag>
          </template>

          <n-space class="mb-4">
            <n-button type="success" @click="showSuccessMessage">
              <template #icon>
                <IconRenderer name="CheckCircleOutlined" />
              </template>
              成功消息
            </n-button>

            <n-button type="error" @click="showErrorMessage">
              <template #icon>
                <IconRenderer name="CloseCircleOutlined" />
              </template>
              错误消息
            </n-button>

            <n-button type="warning" @click="showWarningMessage">
              <template #icon>
                <IconRenderer name="WarningOutlined" />
              </template>
              警告消息
            </n-button>

            <n-button type="info" @click="showInfoMessage">
              <template #icon>
                <IconRenderer name="InfoCircleOutlined" />
              </template>
              信息消息
            </n-button>

            <n-button @click="showLoadingMessage">
              <template #icon>
                <IconRenderer name="LoadingOutlined" />
              </template>
              加载消息
            </n-button>
          </n-space>

          <n-space>
            <n-button type="primary" @click="testApiRequest">
              <template #icon>
                <IconRenderer name="CloudServerOutlined" />
              </template>
              测试 API 请求
            </n-button>

            <n-button @click="messageApi.destroyAll()" ghost>
              <template #icon>
                <IconRenderer name="ClearOutlined" />
              </template>
              清除所有消息
            </n-button>
          </n-space>

          <n-divider />

          <n-text depth="3" class="text-sm">
            消息会自动消失，成功消息 3 秒，错误消息 5 秒，警告消息 4 秒，信息消息 3 秒。
          </n-text>
        </n-card>
      </n-grid-item>

      <!-- Notification 通知 -->
      <n-grid-item>
        <n-card title="Notification 通知" class="h-full">
          <template #header-extra>
            <n-tag type="success" size="small">右侧通知</n-tag>
          </template>

          <n-space class="mb-4">
            <n-button type="success" @click="showSuccessNotification">
              <template #icon>
                <IconRenderer name="CheckCircleOutlined" />
              </template>
              成功通知
            </n-button>

            <n-button type="error" @click="showErrorNotification">
              <template #icon>
                <IconRenderer name="CloseCircleOutlined" />
              </template>
              错误通知
            </n-button>

            <n-button type="warning" @click="showWarningNotification">
              <template #icon>
                <IconRenderer name="WarningOutlined" />
              </template>
              警告通知
            </n-button>

            <n-button type="info" @click="showInfoNotification">
              <template #icon>
                <IconRenderer name="InfoCircleOutlined" />
              </template>
              信息通知
            </n-button>
          </n-space>

          <n-space>
            <n-button @click="notificationApi.destroyAll()" ghost>
              <template #icon>
                <IconRenderer name="ClearOutlined" />
              </template>
              清除所有通知
            </n-button>
          </n-space>

          <n-divider />

          <n-text depth="3" class="text-sm">
            通知显示在页面右上角，可以显示标题和详细内容，错误通知不会自动消失。
          </n-text>
        </n-card>
      </n-grid-item>

      <!-- Dialog 对话框 -->
      <n-grid-item>
        <n-card title="Dialog 对话框" class="h-full">
          <template #header-extra>
            <n-tag type="warning" size="small">模态对话框</n-tag>
          </template>

          <n-space class="mb-4">
            <n-button type="success" @click="showSuccessDialog">
              <template #icon>
                <IconRenderer name="CheckCircleOutlined" />
              </template>
              成功对话框
            </n-button>

            <n-button type="error" @click="showErrorDialog">
              <template #icon>
                <IconRenderer name="CloseCircleOutlined" />
              </template>
              错误对话框
            </n-button>

            <n-button type="warning" @click="showWarningDialog">
              <template #icon>
                <IconRenderer name="WarningOutlined" />
              </template>
              警告对话框
            </n-button>

            <n-button type="info" @click="showInfoDialog">
              <template #icon>
                <IconRenderer name="InfoCircleOutlined" />
              </template>
              信息对话框
            </n-button>
          </n-space>

          <n-space>
            <n-button type="primary" @click="showConfirmDialog">
              <template #icon>
                <IconRenderer name="QuestionCircleOutlined" />
              </template>
              确认对话框
            </n-button>

            <n-button @click="showCustomDialog">
              <template #icon>
                <IconRenderer name="SettingOutlined" />
              </template>
              自定义对话框
            </n-button>
          </n-space>

          <n-divider />

          <n-text depth="3" class="text-sm">
            对话框会阻塞用户操作，适合重要信息确认和用户交互。
          </n-text>
        </n-card>
      </n-grid-item>

      <!-- LoadingBar 加载条 -->
      <n-grid-item>
        <n-card title="LoadingBar 加载条" class="h-full">
          <template #header-extra>
            <n-tag type="primary" size="small">顶部加载条</n-tag>
          </template>

          <n-space class="mb-4">
            <n-button type="primary" @click="startLoading">
              <template #icon>
                <IconRenderer name="PlayCircleOutlined" />
              </template>
              开始加载
            </n-button>

            <n-button type="success" @click="finishLoading">
              <template #icon>
                <IconRenderer name="CheckCircleOutlined" />
              </template>
              完成加载
            </n-button>

            <n-button type="error" @click="errorLoading">
              <template #icon>
                <IconRenderer name="CloseCircleOutlined" />
              </template>
              错误状态
            </n-button>
          </n-space>

          <n-space>
            <n-button @click="simulateRequest">
              <template #icon>
                <IconRenderer name="ReloadOutlined" />
              </template>
              模拟请求过程
            </n-button>
          </n-space>

          <n-divider />

          <n-text depth="3" class="text-sm">
            加载条显示在页面顶部，用于指示页面或请求的加载状态。已集成到 API 请求中。
          </n-text>
        </n-card>
      </n-grid-item>

      <!-- Modal 模态框 -->
      <n-grid-item>
        <n-card title="Modal 模态框" class="h-full">
          <template #header-extra>
            <n-tag size="small">自定义模态框</n-tag>
          </template>

          <n-space class="mb-4">
            <n-button type="primary" @click="showSimpleModal">
              <template #icon>
                <IconRenderer name="AppstoreOutlined" />
              </template>
              简单模态框
            </n-button>

            <n-button @click="showFormModal">
              <template #icon>
                <IconRenderer name="FormOutlined" />
              </template>
              表单模态框
            </n-button>

            <n-button @click="showLargeModal">
              <template #icon>
                <IconRenderer name="ExpandOutlined" />
              </template>
              大型模态框
            </n-button>
          </n-space>

          <n-space>
            <n-button @click="modalApi.destroyAll()" ghost>
              <template #icon>
                <IconRenderer name="ClearOutlined" />
              </template>
              关闭所有模态框
            </n-button>
          </n-space>

          <n-divider />

          <n-text depth="3" class="text-sm">
            模态框用于复杂的用户交互，可以包含表单、列表、图表等内容。
          </n-text>
        </n-card>
      </n-grid-item>

      <!-- 主题切换测试 -->
      <n-grid-item>
        <n-card title="主题集成测试" class="h-full">
          <template #header-extra>
            <n-tag type="primary" size="small">主题响应</n-tag>
          </template>

          <n-space class="mb-4" vertical>
            <n-text> 当前主题：{{ themeStore.isDark ? '暗色主题' : '亮色主题' }} </n-text>

            <n-text depth="3">
              所有消息组件都已与主题系统集成，切换主题时会自动应用新的颜色和样式。
            </n-text>
          </n-space>

          <n-space>
            <n-button @click="themeStore.toggleTheme()">
              <template #icon>
                <IconRenderer :name="themeStore.isDark ? 'SunOutlined' : 'MoonOutlined'" />
              </template>
              切换主题
            </n-button>

            <n-button @click="testThemeMessages">
              <template #icon>
                <IconRenderer name="BgColorsOutlined" />
              </template>
              测试主题消息
            </n-button>
          </n-space>

          <n-divider />

          <n-text depth="3" class="text-sm">
            切换主题后，再次触发消息提示，观察主题的变化效果。
          </n-text>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import {
  NCard,
  NButton,
  NSpace,
  NText,
  NTag,
  NDivider,
  NGrid,
  NGridItem,
  NInput,
  NForm,
  NFormItem,
} from 'naive-ui'
import IconRenderer from '../../../components/icon/IconRenderer.vue'
import {
  messageApi,
  notificationApi,
  dialogApi,
  loadingBarApi,
  modalApi,
} from '../../../utils/message'
import { useThemeStore } from '../../../stores/modules/theme'

// 使用主题 store
const themeStore = useThemeStore()

// ==================== Message 消息示例 ====================
const showSuccessMessage = () => {
  messageApi.success('操作成功！数据已保存')
}

const showErrorMessage = () => {
  messageApi.error('操作失败！请检查网络连接')
}

const showWarningMessage = () => {
  messageApi.warning('警告：此操作不可撤销')
}

const showInfoMessage = () => {
  messageApi.info('提示：新版本已发布')
}

const showLoadingMessage = () => {
  const loading = messageApi.loading('正在处理中，请稍候...', 3000)

  // 3 秒后自动变为成功消息
  setTimeout(() => {
    loading.destroy()
    messageApi.success('处理完成！')
  }, 3000)
}

// 测试 API 请求（模拟）
const testApiRequest = async () => {
  try {
    // 模拟一个会失败的请求来测试错误处理
    await new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('模拟网络错误'))
      }, 1500)
    })
  } catch {
    // 错误会通过我们的 API 封装自动显示
    // 请求失败，已通过 API 封装显示错误消息
  }
}

// ==================== Notification 通知示例 ====================
const showSuccessNotification = () => {
  notificationApi.success('数据同步成功', '所有用户数据已成功同步到云端，共计 1,234 条记录')
}

const showErrorNotification = () => {
  notificationApi.error('系统错误', '连接数据库失败，请联系系统管理员或稍后重试')
}

const showWarningNotification = () => {
  notificationApi.warning('存储空间不足', '当前可用存储空间仅剩 15%，建议及时清理或扩容')
}

const showInfoNotification = () => {
  notificationApi.info(
    '系统维护通知',
    '系统将于今晚 23:00-01:00 进行例行维护，届时服务可能短暂不可用',
  )
}

// ==================== Dialog 对话框示例 ====================
const showSuccessDialog = () => {
  dialogApi.success('操作成功', '用户信息已成功更新，变更将在下次登录时生效')
}

const showErrorDialog = () => {
  dialogApi.error('删除失败', '无法删除该记录，因为它被其他数据引用。请先处理相关依赖')
}

const showWarningDialog = () => {
  dialogApi.warning('权限不足', '您没有执行此操作的权限，请联系管理员申请相应权限')
}

const showInfoDialog = () => {
  dialogApi.info('功能说明', '此功能用于批量导入用户数据，支持 Excel 和 CSV 格式文件')
}

const showConfirmDialog = async () => {
  try {
    await dialogApi.confirm('确认删除', '确定要删除这 5 个用户吗？此操作不可撤销')
    messageApi.success('已删除 5 个用户')
  } catch {
    messageApi.info('已取消删除操作')
  }
}

const showCustomDialog = () => {
  dialogApi.create({
    title: '自定义对话框',
    content: () =>
      h('div', [
        h('p', '这是一个自定义内容的对话框'),
        h('ul', [
          h('li', '支持自定义内容'),
          h('li', '可以包含任意 Vue 组件'),
          h('li', '灵活的样式配置'),
        ]),
      ]),
    positiveText: '了解了',
    negativeText: '取消',
    onPositiveClick: () => {
      messageApi.success('点击了确定按钮')
    },
    onNegativeClick: () => {
      messageApi.info('点击了取消按钮')
    },
  })
}

// ==================== LoadingBar 加载条示例 ====================
const startLoading = () => {
  loadingBarApi.start()
  messageApi.info('加载条已开始')
}

const finishLoading = () => {
  loadingBarApi.finish()
  messageApi.success('加载条已完成')
}

const errorLoading = () => {
  loadingBarApi.error()
  messageApi.error('加载条显示错误状态')
}

const simulateRequest = async () => {
  loadingBarApi.start()

  try {
    // 模拟请求过程
    await new Promise((resolve) => setTimeout(resolve, 2000))
    loadingBarApi.finish()
    messageApi.success('模拟请求完成')
  } catch {
    loadingBarApi.error()
    messageApi.error('模拟请求失败')
  }
}

// ==================== Modal 模态框示例 ====================
const showSimpleModal = () => {
  modalApi.create({
    title: '简单模态框',
    content: '这是一个简单的模态框内容，用于显示信息或进行简单的用户交互。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      messageApi.success('确定操作')
    },
  })
}

const showFormModal = () => {
  const formData = { name: '', email: '' }

  modalApi.create({
    title: '用户信息表单',
    content: () =>
      h(
        NForm,
        {
          model: formData,
          labelPlacement: 'left',
          labelWidth: 80,
        },
        {
          default: () => [
            h(
              NFormItem,
              { label: '姓名', path: 'name' },
              {
                default: () =>
                  h(NInput, {
                    value: formData.name,
                    'onUpdate:value': (value) => (formData.name = value),
                    placeholder: '请输入姓名',
                  }),
              },
            ),
            h(
              NFormItem,
              { label: '邮箱', path: 'email' },
              {
                default: () =>
                  h(NInput, {
                    value: formData.email,
                    'onUpdate:value': (value) => (formData.email = value),
                    placeholder: '请输入邮箱',
                  }),
              },
            ),
          ],
        },
      ),
    positiveText: '保存',
    negativeText: '取消',
    onPositiveClick: () => {
      if (formData.name && formData.email) {
        messageApi.success(`用户 ${formData.name} 信息已保存`)
        return true
      } else {
        messageApi.error('请填写完整信息')
        return false
      }
    },
  })
}

const showLargeModal = () => {
  modalApi.create({
    title: '大型内容模态框',
    style: {
      width: '80vw',
      maxWidth: '800px',
    },
    content: () =>
      h('div', [
        h('h3', '功能特性'),
        h('ul', [
          h('li', '响应式设计：适配不同屏幕尺寸'),
          h('li', '主题集成：支持明暗主题切换'),
          h('li', '类型安全：完整的 TypeScript 类型定义'),
          h('li', '易于使用：简洁的 API 设计'),
          h('li', '高度可定制：支持自定义样式和行为'),
        ]),
        h('h3', '技术栈'),
        h('p', 'Vue 3 + TypeScript + Naive UI + Pinia + Vite'),
        h('h3', '项目结构'),
        h(
          'pre',
          `
src/
├── api/           # API 接口封装
├── components/    # 通用组件
├── stores/        # 状态管理
├── utils/         # 工具函数
├── views/         # 页面组件
└── router/        # 路由配置
      `,
        ),
      ]),
    positiveText: '知道了',
  })
}

// ==================== 主题测试 ====================
const testThemeMessages = () => {
  messageApi.success('主题色彩测试 - 成功')

  setTimeout(() => {
    notificationApi.info(
      '主题集成测试',
      `当前主题：${themeStore.isDark ? '暗色' : '亮色'}，所有组件都会自动应用主题样式`,
    )
  }, 500)
}
</script>

<style scoped>
.message-example {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.h-full {
  height: 100%;
}

.text-sm {
  font-size: 12px;
}
</style>
