<template>
  <div class="loading-overlay" :class="{ dark: isDark }">
    <div class="loading-content">
      <div class="loading-animation">
        <!-- 主加载动画 -->
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>

        <!-- 脉冲圆点 -->
        <div class="pulse-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-if="routeLoadError" class="error-section">
        <div class="error-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <n-alert type="error" :show-icon="false" class="error-alert">
          {{ routeLoadError }}
        </n-alert>
        <n-button type="primary" @click="$router.push('/login')" class="retry-btn">
          返回登录
        </n-button>
      </div>

      <!-- 正常加载状态 -->
      <div v-else class="loading-section">
        <div class="loading-text">
          <div class="main-text">正在加载...</div>
          <div class="sub-text">请稍候片刻</div>
        </div>

        <!-- 进度条 -->
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../../stores/modules/theme.ts'
import { useAppStore } from '../../stores/modules/app.ts'

const themeStore = useThemeStore()
const appStore = useAppStore()

// 获取主题状态
const isDark = computed(() => themeStore.isDark)
const routeLoadError = computed(() => appStore.routeLoadError)
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: all 0.3s ease;
}

.loading-overlay.dark {
  background: rgba(16, 16, 20, 0.95);
}

.loading-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 48px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 320px;
  max-width: 480px;
}

.loading-overlay.dark .loading-content {
  background: rgba(24, 24, 28, 0.9);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 8px 16px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 主加载动画 */
.loading-animation {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.loading-spinner {
  position: relative;
  width: 64px;
  height: 64px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #18a058;
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  border-right-color: #2080f0;
  animation-delay: 0.3s;
  width: 48px;
  height: 48px;
  top: 8px;
  left: 8px;
}

.spinner-ring:nth-child(3) {
  border-bottom-color: #f0a020;
  animation-delay: 0.6s;
  width: 32px;
  height: 32px;
  top: 16px;
  left: 16px;
}

.spinner-ring:nth-child(4) {
  border-left-color: #d03050;
  animation-delay: 0.9s;
  width: 16px;
  height: 16px;
  top: 24px;
  left: 24px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 脉冲圆点 */
.pulse-dots {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #18a058;
  animation: pulse 1.5s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.3s;
}

.dot:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes pulse {
  0%,
  80%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* 加载文本 */
.loading-section {
  animation: fadeInUp 0.6s ease-out;
}

.loading-text {
  margin-bottom: 24px;
}

.main-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.loading-overlay.dark .main-text {
  color: #fff;
}

.sub-text {
  font-size: 14px;
  color: #666;
  opacity: 0.8;
}

.loading-overlay.dark .sub-text {
  color: #ccc;
}

/* 进度条 */
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.loading-overlay.dark .progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    #18a058 0%,
    #2080f0 25%,
    #f0a020 50%,
    #d03050 75%,
    #18a058 100%
  );
  border-radius: 2px;
  animation: progressMove 2s linear infinite;
  width: 100%;
}

@keyframes progressMove {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 错误状态 */
.error-section {
  animation: fadeInUp 0.6s ease-out;
}

.error-icon {
  color: #d03050;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.error-alert {
  margin-bottom: 16px;
  border-radius: 12px;
}

.retry-btn {
  border-radius: 8px;
  padding: 8px 24px;
  font-weight: 500;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(24, 160, 88, 0.1), rgba(32, 128, 240, 0.1));
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-content {
    padding: 32px 24px;
    min-width: 280px;
    margin: 0 16px;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
  }

  .spinner-ring:nth-child(2) {
    width: 36px;
    height: 36px;
    top: 6px;
    left: 6px;
  }

  .spinner-ring:nth-child(3) {
    width: 24px;
    height: 24px;
    top: 12px;
    left: 12px;
  }

  .spinner-ring:nth-child(4) {
    width: 12px;
    height: 12px;
    top: 18px;
    left: 18px;
  }

  .main-text {
    font-size: 16px;
  }

  .circle-1 {
    width: 120px;
    height: 120px;
  }

  .circle-2 {
    width: 80px;
    height: 80px;
  }

  .circle-3 {
    width: 60px;
    height: 60px;
  }
}
</style>
