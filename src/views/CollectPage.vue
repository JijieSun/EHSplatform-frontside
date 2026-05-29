<template>
  <div class="collect-page">
    <div class="progress-card user-card">
      <p class="progress-label">信息采集 · {{ collectProgress.status }}</p>
      <el-progress type="dashboard" :percentage="answeredPercent" :width="120" />
      <p class="progress-num">{{ answeredCount }} / {{ collectProgress.total }} 题</p>
      <p v-if="activeCategory" class="filter-hint">当前分类：{{ activeCategory }}（{{ filteredList.length }} 题）</p>
    </div>

    <!-- 分类筛选 -->
    <section class="filter-section user-card">
      <p class="filter-label">按分类筛选</p>
      <div class="category-tags">
        <button
          type="button"
          class="cat-tag"
          :class="{ active: !activeCategory }"
          @click="setCategory(null)"
        >
          全部
        </button>
        <button
          v-for="c in memoirCategories"
          :key="c"
          type="button"
          class="cat-tag"
          :class="{ active: activeCategory === c }"
          @click="setCategory(c)"
        >
          {{ c }}
          <span class="cat-count">{{ categoryStats[c] }}</span>
        </button>
      </div>
    </section>

    <div class="question-card user-card">
      <div class="q-nav-top">
        <span class="q-badge">第 {{ currentQuestion.id }} 题 · {{ currentQuestion.category }}</span>
        <span class="q-pos">{{ currentPos }} / {{ filteredList.length }}</span>
      </div>
      <h2 class="q-title">{{ currentQuestion.content }}</h2>
      <p class="q-hint">请用语音或文字回答，小伴会帮您记录到回忆录</p>
      <textarea
        v-model="answer"
        rows="4"
        placeholder="例如：小时候住在弄堂里…"
      />
      <div class="nav-row">
        <button
          type="button"
          class="btn-nav"
          :disabled="!hasPrev"
          @click="goPrev"
        >
          ← 上一题
        </button>
        <button
          type="button"
          class="btn-nav"
          :disabled="!hasNext"
          @click="goNext"
        >
          下一题 →
        </button>
      </div>
      <div class="action-row">
        <button type="button" class="btn-skip" @click="skip">跳过</button>
        <button type="button" class="btn-voice" @click="record">
          <el-icon><Microphone /></el-icon>
          语音
        </button>
        <button type="button" class="btn-submit" @click="submit">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  memoirCategories,
  collectQuestionBank,
  collectProgress,
  demoAnswers,
  getCategoryStats,
} from '@/data/collectQuestions'

const categoryStats = getCategoryStats(collectQuestionBank)
const activeCategory = ref(null)
const currentIndex = ref(0)
const answers = ref({ ...demoAnswers })
const answer = ref('')

const filteredList = computed(() => {
  if (!activeCategory.value) return collectQuestionBank
  return collectQuestionBank.filter((q) => q.category === activeCategory.value)
})

const currentQuestion = computed(() => filteredList.value[currentIndex.value] || collectQuestionBank[0])
const currentPos = computed(() => currentIndex.value + 1)
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < filteredList.value.length - 1)

const answeredCount = computed(() => {
  const base = collectProgress.answered
  const local = Object.keys(answers.value).length
  return Math.max(base, local)
})

const answeredPercent = computed(() =>
  Math.min(100, Math.round((answeredCount.value / collectProgress.total) * 1000) / 10)
)

function loadAnswerForCurrent() {
  const q = currentQuestion.value
  answer.value = answers.value[q.id] || ''
}

watch(currentQuestion, loadAnswerForCurrent, { immediate: true })

function setCategory(cat) {
  activeCategory.value = cat
  currentIndex.value = 0
  loadAnswerForCurrent()
}

function saveCurrentAnswer() {
  const q = currentQuestion.value
  if (answer.value.trim()) {
    answers.value[q.id] = answer.value.trim()
  }
}

function goPrev() {
  if (!hasPrev.value) return
  saveCurrentAnswer()
  currentIndex.value -= 1
}

function goNext() {
  if (!hasNext.value) return
  saveCurrentAnswer()
  currentIndex.value += 1
}

function submit() {
  saveCurrentAnswer()
  ElMessage.success('已保存')
  if (hasNext.value) {
    currentIndex.value += 1
  }
}

function skip() {
  ElMessage.info('已跳过本题')
  if (hasNext.value) {
    currentIndex.value += 1
  } else {
    answer.value = ''
  }
}

function record() {
  ElMessage.success('语音识别中…（演示）')
  answer.value = '小时候住在弄堂里，夏天傍晚邻居们一起在门口摇扇子聊天。'
}
</script>

<style scoped>
.progress-card {
  text-align: center;
  margin-bottom: 12px;
}
.progress-label {
  font-weight: 600;
  margin: 0 0 8px;
}
.progress-num {
  font-size: var(--user-font-xl);
  font-weight: 700;
  color: var(--user-primary);
  margin: 8px 0 4px;
}
.filter-hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--user-text-secondary);
}
.filter-section {
  margin-bottom: 12px;
}
.filter-label {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 600;
}
.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.cat-tag {
  padding: 8px 14px;
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.cat-tag.active {
  background: var(--user-primary-light);
  border-color: var(--user-primary);
  color: var(--user-primary);
  font-weight: 600;
}
.cat-count {
  font-size: 11px;
  background: rgba(0, 0, 0, 0.06);
  padding: 1px 6px;
  border-radius: 8px;
}
.cat-tag.active .cat-count {
  background: rgba(43, 125, 233, 0.15);
}
.q-nav-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}
.q-badge {
  display: inline-block;
  padding: 4px 12px;
  background: var(--user-primary-light);
  color: var(--user-primary);
  border-radius: 8px;
  font-size: 13px;
}
.q-pos {
  font-size: 13px;
  color: #999;
  white-space: nowrap;
}
.q-title {
  font-size: var(--user-font-lg);
  line-height: 1.5;
  margin: 0 0 8px;
}
.q-hint {
  font-size: 14px;
  color: var(--user-text-secondary);
  margin: 0 0 16px;
}
textarea {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  resize: none;
  box-sizing: border-box;
}
.nav-row {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.btn-nav {
  flex: 1;
  min-height: 44px;
  border-radius: 12px;
  border: 2px solid var(--user-primary);
  background: #fff;
  color: var(--user-primary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.btn-nav:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  border-color: #e8e8e8;
  color: #ccc;
}
.action-row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.action-row button {
  flex: 1;
  min-height: 48px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.btn-skip {
  background: #f5f5f5;
  color: #666;
  flex: 0.8;
}
.btn-voice {
  background: var(--user-warm);
  color: #fff;
}
.btn-submit {
  background: var(--user-primary);
  color: #fff;
}
</style>
