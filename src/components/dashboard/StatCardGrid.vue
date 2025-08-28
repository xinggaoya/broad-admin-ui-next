<template>
  <n-grid :cols="4" :x-gap="16" :y-gap="16" responsive="screen">
    <n-gi v-for="card in cards" :key="card.title">
      <StatCard
        :title="card.title"
        :value="card.value"
        :prefix="card.prefix"
        :suffix="card.suffix"
        :change="card.change"
        :changeType="card.changeType"
        :icon="card.icon"
        :color="card.color"
        :isLoading="loading"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import StatCard from '@/components/common/StatCard.vue'
import type { StatCardData } from '@/api/types/dashboard.types'

interface Props {
  cards: StatCardData[]
  loading?: boolean
}

defineProps<Props>()
</script>

<style scoped>
/* 确保响应式布局 */
@media (max-width: 1280px) {
  :deep(.n-grid) {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }
}
</style>