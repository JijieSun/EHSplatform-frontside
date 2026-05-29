<template>
  <div class="memoir-page">
    <div class="cover-card user-card">
      <div class="cover-art">📖</div>
      <h2>{{ progress.title }}</h2>
      <p class="cover-meta">基于 {{ progress.answered }} 道问答 · 更新于 2026-05-28</p>
      <div class="cover-actions">
        <button type="button" class="btn-primary" @click="goAdd">+ 新增</button>
        <button type="button" class="btn-outline" @click="ElMessage.success('打开预览')">预览全书</button>
        <button type="button" class="btn-outline" @click="ElMessage.info('重新生成中')">重新生成</button>
      </div>
    </div>
    <div v-for="ch in chapters" :key="ch.id" class="chapter-card user-card">
      <h3>{{ ch.title }}</h3>
      <p>{{ ch.excerpt }}</p>
      <button type="button" class="read-more" @click="ElMessage.success(ch.title)">阅读本章 →</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { collectProgress, memoirChapters } from '@/data/demoData'

const router = useRouter()
const progress = collectProgress
const chapters = memoirChapters

function goAdd() {
  router.push('/collect')
}
</script>

<style scoped>
.memoir-page {
  margin: -16px;
  padding: 16px;
  min-height: calc(100dvh - var(--user-tab-h) - 32px);
}
.cover-card { text-align: center; margin-bottom: 16px; background: linear-gradient(180deg, #fff7e6, #fff); }
.cover-art { font-size: 48px; margin-bottom: 8px; }
.cover-meta { font-size: 14px; color: var(--user-text-secondary); margin: 0 0 16px; }
.cover-actions { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.btn-primary, .btn-outline { min-height: 44px; padding: 0 16px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
.btn-primary { background: var(--user-primary); color: #fff; border: none; }
.btn-outline { background: #fff; border: 2px solid var(--user-primary); color: var(--user-primary); }
.chapter-card { margin-bottom: 12px; }
.chapter-card p { color: var(--user-text-secondary); line-height: 1.6; margin: 0 0 12px; }
.read-more { border: none; background: none; color: var(--user-primary); font-weight: 600; cursor: pointer; padding: 0; }
</style>
