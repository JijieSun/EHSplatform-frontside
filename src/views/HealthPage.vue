<template>
  <div class="health-page">
    <div class="search-bar user-card">
      <input v-model="keyword" type="search" placeholder="搜索健康问题，如：高血压、用药" />
    </div>
    <div class="hot-tags">
      <button v-for="t in hotTags" :key="t" type="button" class="tag-btn" @click="keyword = t">{{ t }}</button>
    </div>
    <div v-for="item in filtered" :key="item.id" class="kb-card user-card" @click="ElMessage.success('语音播报：' + item.q)">
      <h3>{{ item.q }}</h3>
      <p>{{ item.a }}</p>
      <span class="hits">🔥 {{ item.hits }} 人问过</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { knowledgeList } from '@/data/demoData'

const keyword = ref('')
const hotTags = ['高血压', '用药提醒', '失眠', '饮食']
const filtered = computed(() => keyword.value ? knowledgeList.filter((i) => i.q.includes(keyword.value) || i.a.includes(keyword.value)) : knowledgeList)
</script>

<style scoped>
.search-bar input { width: 100%; height: 44px; border: none; font-size: 16px; outline: none; }
.hot-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }
.tag-btn { padding: 8px 14px; border-radius: 20px; border: 1px solid #e8e8e8; background: #fff; font-size: 14px; cursor: pointer; }
.kb-card { margin-bottom: 12px; cursor: pointer; }
.kb-card h3 { margin: 0 0 8px; font-size: 16px; }
.kb-card p { margin: 0 0 8px; font-size: 14px; color: var(--user-text-secondary); line-height: 1.5; }
.hits { font-size: 12px; color: var(--user-warm); }
</style>
