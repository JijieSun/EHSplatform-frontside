<template>
  <div class="collect-record">
    <div class="summary user-card">
      <p class="summary-num">{{ progress.answered }} / {{ progress.total }}</p>
      <p class="summary-label">累计已答题 · {{ progress.status }}</p>
      <el-progress :percentage="progress.percent" :stroke-width="10" />
    </div>

    <div v-for="item in records" :key="item.id" class="record-card user-card">
      <div class="record-head">
        <span class="record-badge">{{ item.category }}</span>
        <span class="record-date">{{ item.date }}</span>
      </div>
      <p class="record-q">{{ item.question }}</p>
      <p class="record-a">{{ item.answer }}</p>
    </div>
  </div>
</template>

<script setup>
import { collectProgress } from '@/data/demoData'

const progress = collectProgress
const records = [
  {
    id: 1,
    category: '童年记忆',
    date: '2026-05-28',
    question: '您小时候最难忘的一件事？',
    answer: '小时候住在弄堂里，夏天傍晚邻居们一起在门口摇扇子聊天…',
  },
  {
    id: 2,
    category: '婚姻家庭',
    date: '2026-05-27',
    question: '您与伴侣相识的经过？',
    answer: '和你爷爷相识于同事介绍，婚礼很简单但很热闹…',
  },
  {
    id: 3,
    category: '健康养老',
    date: '2026-05-26',
    question: '您平时如何锻炼身体？',
    answer: '每日散步 30 分钟，天气好就去公园…',
  },
]
</script>

<style scoped>
.summary { text-align: center; margin-bottom: 16px; }
.summary-num { margin: 0; font-size: 28px; font-weight: 700; color: var(--user-primary); }
.summary-label { margin: 4px 0 12px; color: var(--user-text-secondary); font-size: 14px; }
.record-card { margin-bottom: 12px; }
.record-head { display: flex; justify-content: space-between; margin-bottom: 8px; }
.record-badge {
  font-size: 12px;
  padding: 2px 8px;
  background: var(--user-primary-light);
  color: var(--user-primary);
  border-radius: 6px;
}
.record-date { font-size: 12px; color: #999; }
.record-q { font-weight: 600; margin: 0 0 8px; line-height: 1.5; }
.record-a { margin: 0; font-size: 14px; color: var(--user-text-secondary); line-height: 1.6; }
</style>
