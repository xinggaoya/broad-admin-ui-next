<template>
  <div class="profile-container">
    <div class="profile-layout">
      <!-- 用户信息卡片 -->
      <div class="profile-card">
        <n-card>
          <div class="user-info">
            <n-avatar size="large" src="https://via.placeholder.com/80x80" class="user-avatar" />
            <div class="user-details">
              <h2 class="username">{{ userInfo.name }}</h2>
              <p class="user-role">{{ userInfo.role }}</p>
              <p class="user-email">{{ userInfo.email }}</p>
            </div>
            <div class="user-actions">
              <n-button type="primary" @click="showEditModal = true"> 编辑资料 </n-button>
            </div>
          </div>
        </n-card>
      </div>

      <!-- 统计信息 -->
      <div class="stats-cards">
        <n-card v-for="stat in userStats" :key="stat.label" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </n-card>
      </div>

      <!-- 详细信息 -->
      <div class="detail-sections">
        <n-card title="基本信息" class="detail-card">
          <n-descriptions :column="2" label-placement="left">
            <n-descriptions-item label="用户名">
              {{ userInfo.name }}
            </n-descriptions-item>
            <n-descriptions-item label="邮箱">
              {{ userInfo.email }}
            </n-descriptions-item>
            <n-descriptions-item label="角色">
              {{ userInfo.role }}
            </n-descriptions-item>
            <n-descriptions-item label="部门">
              {{ userInfo.department }}
            </n-descriptions-item>
            <n-descriptions-item label="注册时间">
              {{ userInfo.createdAt }}
            </n-descriptions-item>
            <n-descriptions-item label="最后登录">
              {{ userInfo.lastLogin }}
            </n-descriptions-item>
          </n-descriptions>
        </n-card>

        <n-card title="最近活动" class="detail-card">
          <n-timeline>
            <n-timeline-item
              v-for="activity in recentActivities"
              :key="activity.id"
              :type="activity.type"
              :title="activity.title"
              :content="activity.content"
              :time="activity.time"
            />
          </n-timeline>
        </n-card>
      </div>
    </div>

    <!-- 编辑资料弹框 -->
    <n-modal
      v-model:show="showEditModal"
      preset="dialog"
      title="编辑个人资料"
      positive-text="保存"
      negative-text="取消"
      @positive-click="handleSave"
    >
      <n-form
        ref="formRef"
        :model="editForm"
        :rules="formRules"
        label-placement="left"
        label-width="auto"
      >
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="editForm.name" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="editForm.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item label="部门" path="department">
          <n-input v-model:value="editForm.department" placeholder="请输入部门" />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const message = useMessage()

// 用户信息
const userInfo = ref({
  name: 'Admin User',
  email: 'admin@example.com',
  role: '系统管理员',
  department: '技术部',
  createdAt: '2023-01-15',
  lastLogin: '2024-01-20 10:30:00',
})

// 用户统计
const userStats = [
  { label: '登录次数', value: '1,234' },
  { label: '操作次数', value: '5,678' },
  { label: '在线天数', value: '365' },
  { label: '创建项目', value: '12' },
]

// 最近活动
const recentActivities = [
  {
    id: 1,
    type: 'success',
    title: '登录系统',
    content: '从 192.168.1.100 登录',
    time: '2小时前',
  },
  {
    id: 2,
    type: 'info',
    title: '修改资料',
    content: '更新了个人信息',
    time: '1天前',
  },
  {
    id: 3,
    type: 'warning',
    title: '密码变更',
    content: '修改了登录密码',
    time: '3天前',
  },
]

// 编辑表单
const showEditModal = ref(false)
const formRef = ref()
const editForm = ref({
  name: userInfo.value.name,
  email: userInfo.value.email,
  department: userInfo.value.department,
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
}

// 保存编辑
const handleSave = async () => {
  try {
    await formRef.value?.validate()

    // 更新用户信息
    userInfo.value.name = editForm.value.name
    userInfo.value.email = editForm.value.email
    userInfo.value.department = editForm.value.department

    message.success('个人资料更新成功')
    showEditModal.value = false
  } catch (error) {
    message.error('请检查表单输入')
  }
}
</script>

<style scoped>
.profile-container {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-layout {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
}

.profile-card {
  grid-column: 1 / -1;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-avatar {
  flex-shrink: 0;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.user-role {
  font-size: 16px;
  color: #1890ff;
  margin: 0 0 4px 0;
}

.user-email {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.user-actions {
  flex-shrink: 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
}

.stat-content {
  padding: 8px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.detail-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.detail-card {
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-info {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail-sections {
    grid-template-columns: 1fr;
  }
}

/* 暗黑模式适配 */
html.dark .username {
  color: #fff;
}

html.dark .user-email {
  color: #ccc;
}

html.dark .stat-label {
  color: #ccc;
}
</style>
