<template>
  <div class="dashboard-container">
    <n-h1>欢迎使用后台管理系统</n-h1>
    <n-p>所有功能已经成功集成！</n-p>
  </div>
</template>

<script setup>
defineOptions({
  name: 'DashboardView'
})
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>