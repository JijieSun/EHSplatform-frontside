<template>
  <div class="collect-page">
    <div class="progress-card user-card">
      <p class="progress-label">信息采集进度</p>
      <el-progress type="dashboard" :percentage="68" :width="120" />
      <p class="progress-num">34 / 50 题</p>
      <p class="progress-tip">完成后可自动生成回忆录章节</p>
    </div>

    <div class="question-card user-card">
      <span class="q-badge">第 35 题 · 童年回忆</span>
      <h2 class="q-title">{{ currentQuestion }}</h2>
      <p class="q-hint">请用语音或文字回答，小伴会帮您记录</p>

      <div class="answer-area">
        <textarea
          v-model="answer"
          rows="4"
          placeholder="例如：小时候住在弄堂里，夏天邻居一起摇扇子…"
        />
      </div>

      <div class="action-row">
        <button type="button" class="btn-skip" @click="skip">跳过</button>
        <button type="button" class="btn-voice" @click="record">
          <el-icon><Microphone /></el-icon>
          语音回答
        </button>
        <button type="button" class="btn-submit" @click="submit">下一题</button>
      </div>
    </div>

    <div class="category-tags">
      <span v-for="c in categories" :key="c" class="cat-tag">{{ c }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const currentQuestion = ref('您小时候最难忘的一件事是什么？')
const answer = ref('')
const categories = ['基本信息', '童年', '工作', '家庭', '爱好', '健康']

const pool = [
  '您最擅长的家常菜是哪道？',
  '年轻时最喜欢去哪里玩？',
  '对您影响最大的人是谁？',
]

function submit() {
  ElMessage.success('已保存，进入下一题')
  currentQuestion.value = pool[Math.floor(Math.random() * pool.length)]
  answer.value = ''
}

function skip() {
  ElMessage.info('已跳过本题')
  submit()
}

function record() {
  ElMessage.success('语音识别中…（演示）')
  answer.value = '小时候住在弄堂里，夏天傍晚邻居们一起在门口摇扇子聊天。'
}
</script>

<style scoped>
.progress-card {
  text-align: center;
  margin-bottom: 16px;
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
.progress-tip {
  font-size: 14px;
  color: var(--user-text-secondary);
  margin: 0;
}
.q-badge {
  display: inline-block;
  padding: 4px 12px;
  background: var(--user-primary-light);
  color: var(--user-primary);
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 12px;
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
.answer-area textarea {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  resize: none;
  box-sizing: border-box;
}
.action-row {
  display: flex;
  gap: 8px;
  margin-top: 16px;
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
.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.cat-tag {
  padding: 6px 12px;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  color: #666;
}
</style>
