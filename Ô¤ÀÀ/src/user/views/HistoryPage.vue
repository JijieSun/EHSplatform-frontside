<template>
  <div class="history-page">
    <div v-for="group in groups" :key="group.date" class="date-group">
      <p class="date-label">{{ group.date }}</p>
      <div
        v-for="item in group.items"
        :key="item.id"
        class="hist-item user-card"
        @click="open(item)"
      >
        <p class="hist-preview">{{ item.preview }}</p>
        <span class="hist-meta">{{ item.time }} · {{ item.mode }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const groups = [
  {
    date: '今天',
    items: [
      { id: 1, preview: '高血压平时要注意什么？', time: '14:32', mode: '知识问答' },
      { id: 2, preview: '今天天气真好，想出去走走', time: '10:15', mode: '自由对话' },
    ],
  },
  {
    date: '昨天',
    items: [
      { id: 3, preview: '帮我记一下明天要买菜', time: '16:20', mode: '自由对话' },
      { id: 4, preview: '钙片什么时候吃比较好？', time: '09:00', mode: '知识问答' },
    ],
  },
]

function open(item) {
  ElMessage.info(`查看对话：${item.preview}`)
}
</script>

<style scoped>
.date-label {
  font-size: 14px;
  color: #999;
  margin: 16px 0 8px;
}
.hist-item {
  margin-bottom: 8px;
  cursor: pointer;
}
.hist-preview {
  margin: 0 0 6px;
  font-size: 16px;
  line-height: 1.4;
}
.hist-meta {
  font-size: 13px;
  color: #999;
}
</style>
