<template>
  <div class="history-page">
    <div v-for="group in groups" :key="group.date" class="date-group">
      <p class="date-label">{{ group.date }}</p>
      <div v-for="item in group.items" :key="item.id" class="hist-item user-card" @click="ElMessage.info(item.preview.slice(0, 30))">
        <p class="hist-preview">{{ item.preview }}</p>
        <span class="hist-meta">{{ item.time }} · {{ item.mode }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { chatHistory } from '@/data/demoData'

const groups = computed(() => {
  const map = {}
  chatHistory.forEach((item) => {
    if (!map[item.date]) map[item.date] = []
    map[item.date].push(item)
  })
  return Object.entries(map).map(([date, items]) => ({ date, items }))
})
</script>

<style scoped>
.date-label { font-size: 14px; color: #999; margin: 16px 0 8px; }
.hist-item { margin-bottom: 8px; cursor: pointer; }
.hist-preview { margin: 0 0 6px; font-size: 16px; line-height: 1.4; }
.hist-meta { font-size: 13px; color: #999; }
</style>
