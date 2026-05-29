<template>
  <div class="memoir-page">
    <div class="cover-card user-card">
      <div class="cover-art">📖</div>
      <h2 class="cover-title">张阿姨的人生回忆录</h2>
      <p class="cover-meta">基于 34 道采集问答自动生成 · 更新于 2026-05-20</p>
      <div class="cover-actions">
        <button type="button" class="btn-primary" @click="preview">预览全书</button>
        <button type="button" class="btn-outline" @click="regen">重新生成</button>
      </div>
    </div>

    <div v-for="ch in chapters" :key="ch.id" class="chapter-card user-card">
      <h3>{{ ch.title }}</h3>
      <p class="ch-excerpt">{{ ch.excerpt }}</p>
      <button type="button" class="read-more" @click="read(ch)">阅读本章 →</button>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const chapters = [
  { id: 1, title: '第一章 · 弄堂里的夏天', excerpt: '小时候住在上海弄堂，傍晚邻居们一起在门口摇扇子…' },
  { id: 2, title: '第二章 · 第一份工', excerpt: '十八岁那年进了纺织厂，师傅待我很好…' },
  { id: 3, title: '第三章 · 成家', excerpt: '和你爷爷相识于同事介绍，婚礼很简单但很热闹…' },
]

function preview() {
  ElMessage.success('正在打开回忆录预览（演示）')
}
function regen() {
  ElMessage.info('将根据最新采集内容重新生成')
}
function read(ch) {
  ElMessage.success(`打开：${ch.title}`)
}
</script>

<style scoped>
.cover-card {
  text-align: center;
  margin-bottom: 16px;
  background: linear-gradient(180deg, #fff7e6, #fff);
}
.cover-art {
  font-size: 48px;
  margin-bottom: 8px;
}
.cover-title {
  margin: 0 0 8px;
  font-size: var(--user-font-xl);
}
.cover-meta {
  font-size: 14px;
  color: var(--user-text-secondary);
  margin: 0 0 16px;
}
.cover-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.btn-primary,
.btn-outline {
  min-height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.btn-primary {
  background: var(--user-primary);
  color: #fff;
  border: none;
}
.btn-outline {
  background: #fff;
  border: 2px solid var(--user-primary);
  color: var(--user-primary);
}
.chapter-card h3 {
  margin: 0 0 8px;
  font-size: 17px;
}
.ch-excerpt {
  color: var(--user-text-secondary);
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 12px;
}
.read-more {
  border: none;
  background: none;
  color: var(--user-primary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}
.chapter-card {
  margin-bottom: 12px;
}
</style>
