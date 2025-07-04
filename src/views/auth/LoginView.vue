<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-background">
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- Logo和标题 -->
      <div class="login-header">
        <div class="logo">
          <img src="../../assets/app-icon.png" alt="Logo" class="logo-image" />
          <h1 class="logo-title">Admin UI</h1>
        </div>
        <p class="login-subtitle">现代化后台管理系统</p>
      </div>

      <!-- 登录表单 -->
      <n-form
        ref="formRef"
        :model="loginForm"
        :rules="formRules"
        class="login-form"
        size="large"
        @submit.prevent="handleLogin"
      >
        <n-form-item path="username" :show-label="false">
          <n-input
            v-model:value="loginForm.username"
            placeholder="请输入用户名"
            :input-props="{ autocomplete: 'username' }"
            @keydown.enter="handleLogin"
          >
            <template #prefix>
              <n-icon>
                <UserOutlined />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="password" :show-label="false">
          <n-input
            v-model:value="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="click"
            :input-props="{ autocomplete: 'current-password' }"
            @keydown.enter="handleLogin"
          >
            <template #prefix>
              <n-icon>
                <LockOutlined />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item :show-label="false">
          <div class="login-options">
            <n-checkbox v-model:checked="loginForm.rememberMe"> 记住我 </n-checkbox>
            <n-button text type="primary" size="small"> 忘记密码？ </n-button>
          </div>
        </n-form-item>

        <n-form-item :show-label="false">
          <n-button
            type="primary"
            size="large"
            :loading="loading"
            :disabled="!isFormValid"
            block
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </n-button>
        </n-form-item>
      </n-form>

      <!-- 测试账号提示 -->
      <div class="test-accounts">
        <n-divider>测试账号</n-divider>
        <div class="account-list">
          <div class="account-item" @click="fillAccount('admin', 'admin123')">
            <n-tag type="error" size="small">管理员</n-tag>
            <span>admin / admin123</span>
          </div>
          <div class="account-item" @click="fillAccount('user', 'user123')">
            <n-tag type="info" size="small">普通用户</n-tag>
            <span>user / user123</span>
          </div>
          <div class="account-item" @click="fillAccount('test', 'test123')">
            <n-tag type="warning" size="small">访客</n-tag>
            <span>test / test123</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="login-footer">
      <p>&copy; 2024 Admin UI. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@vicons/antd'
import { useUserStore } from '@/stores/modules/user.ts'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import type { LoginRequest } from '@/stores/modules/user.ts'

defineOptions({
  name: 'LoginView',
})

const router = useRouter()
const userStore = useUserStore()
const message = useMessage()

// 表单引用
const formRef = ref<FormInst>()
const loading = ref(false)

// 登录表单数据
const loginForm = ref<LoginRequest>({
  username: '',
  password: '',
  rememberMe: false,
})

// 表单验证规则
const formRules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 20,
      message: '用户名长度在3-20个字符',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      min: 6,
      max: 20,
      message: '密码长度在6-20个字符',
      trigger: 'blur',
    },
  ],
}

// 表单是否有效
const isFormValid = computed(() => {
  return loginForm.value.username.length >= 3 && loginForm.value.password.length >= 6
})

// 填充测试账号
const fillAccount = (username: string, password: string) => {
  loginForm.value.username = username
  loginForm.value.password = password
}

// 处理登录
const handleLogin = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    loading.value = true

    // 调用登录API
    const response = await userStore.login(loginForm.value)

    message.success(`欢迎回来，${response.userInfo.nickname}！`)

    // 跳转到首页
    await router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error)

    if (error instanceof Error) {
      message.error(error.message)
    } else {
      message.error('登录失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

// 页面初始化
onMounted(() => {
  // 如果已经登录，直接跳转到首页
  if (userStore.isLoggedIn) {
    router.push('/dashboard')
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.background-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: -2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: -4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.logo-image {
  width: 40px;
  height: 40px;
}

.logo-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.login-form {
  margin-bottom: 24px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.test-accounts {
  margin-top: 24px;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
}

.account-item:hover {
  background: #f5f5f5;
  border-color: #1890ff;
}

.login-footer {
  position: absolute;
  bottom: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.login-footer p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    margin: 20px;
    padding: 24px;
  }

  .logo-title {
    font-size: 24px;
  }

  .shape-1,
  .shape-2,
  .shape-3 {
    display: none;
  }
}

/* 暗黑模式适配 */
html.dark .login-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

html.dark .login-card {
  background: rgba(24, 24, 28, 0.95);
  border: 1px solid #2c2c32;
}

html.dark .login-subtitle {
  color: #a0a0a0;
}

html.dark .account-item {
  background: #18181c;
  border-color: #2c2c32;
  color: #fff;
}

html.dark .account-item:hover {
  background: #2c2c32;
  border-color: #63e2b7;
}

html.dark .login-footer {
  color: rgba(255, 255, 255, 0.6);
}
</style>
