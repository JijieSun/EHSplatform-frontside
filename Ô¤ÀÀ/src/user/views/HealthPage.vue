<template>
  <div class="health-page">
    <div class="search-bar user-card">
      <input v-model="keyword" type="search" placeholder="搜索健康问题，如：高血压、用药" />
    </div>

    <div class="hot-tags">
      <button
        v-for="t in hotTags"
        :key="t"
        type="button"
        class="tag-btn"
        @click="ask(t)"
      >
        {{ t }}
      </button>
    </div>

    <div v-for="item in filteredList" :key="item.id" class="kb-card user-card" @click="open(item)">
      <h3>{{ item.q }}</h3>
      <p>{{ item.a }}</p>
      <span class="hits">🔥 {{ item.hits }} 人问过</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const keyword = ref('')
const hotTags = ['高血压', '糖尿病', '用药提醒', '失眠', '饮食']

const list = [
  { id: 1, q: '高血压患者饮食注意什么？', a: '低盐低脂、多吃蔬果、控制体重…', hits: 892 },
  { id: 2, q: '降压药可以一起吃吗？', a: '需遵医嘱，不可自行增减或混用…', hits: 654 },
  { id: 3, q: '忘记吃药怎么办？', a: '若接近下次服药时间勿补服，具体咨询医生…', hits: 521 },
]

const filteredList = computed(() => {
  if (!keyword.value) return list
  return list.filter(
    (i) => i.q.includes(keyword.value) || i.a.includes(keyword.value)
  )
})

function ask(t) {
  keyword.value = t
}
function open(item) {
  ElMessage.success(`正在语音播报：${item.q}`)
}
</script>

<style scoped>
.search-bar input {
  width: 100%;
  height: 44px;
  border: none;
  font-size: 16px;
  outline: none;
}
.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}
.tag-btn {
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid #e8e8e8;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
}
.kb-card {
  margin-bottom: 12px;
  cursor: pointer;
}
.kb-card h3 {
  margin: 0 0 8px;
  font-size: 16px;
}
.kb-card p {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--user-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.hits {
  font-size: 12px;
  color: var(--user-warm);
}
</style>
