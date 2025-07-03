<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-message">页面未找到</div>
      <div class="error-description">抱歉，您访问的页面不存在或已被删除。</div>
      <div class="error-actions">
        <n-button type="primary" @click="goHome"> 返回首页 </n-button>
        <n-button @click="goBack"> 返回上一页 </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({
  name: 'NotFoundView',
})

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/dashboard')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.not-found-content {
  text-align: center;
  padding: 40px;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #1890ff;
  line-height: 1;
  margin-bottom: 20px;
}

.error-message {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
}

.error-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 暗黑模式适配 */
html.dark .not-found-container {
  background: #18181c;
}

html.dark .error-code {
  color: #63e2b7;
}

html.dark .error-message {
  color: #fff;
}

html.dark .error-description {
  color: #a0a0a0;
}
</style>
