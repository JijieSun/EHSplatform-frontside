<template>
  <div class="chat-page">
    <div class="chat-mode-bar">
      <span
        v-for="m in modes"
        :key="m.key"
        class="mode-tag"
        :class="{ active: mode === m.key }"
        @click="mode = m.key"
      >
        {{ m.label }}
      </span>
    </div>

    <div ref="listRef" class="chat-list">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="chat-bubble"
        :class="msg.role"
      >
        <div v-if="msg.role === 'bot'" class="avatar">伴</div>
        <div class="bubble-body">
          <p>{{ msg.text }}</p>
          <span v-if="msg.voice" class="voice-tag">🔊 语音播报</span>
        </div>
      </div>
    </div>

    <div class="chat-input-bar">
      <button type="button" class="input-voice" :class="{ on: recording }" @click="toggleRecord">
        <el-icon :size="28"><Microphone /></el-icon>
      </button>
      <input
        v-model="inputText"
        type="text"
        class="input-text"
        placeholder="打字也可以和我说…"
        @keyup.enter="send"
      />
      <button type="button" class="input-send" @click="send">发送</button>
    </div>

    <p class="chat-hint">支持普通话 / 沪语 · 说「小伴小伴」随时唤醒</p>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const mode = ref('free')
const recording = ref(false)
const inputText = ref('')
const listRef = ref(null)

const modes = [
  { key: 'free', label: '自由对话' },
  { key: 'kb', label: '知识库问答' },
]

const messages = ref([
  { id: 1, role: 'bot', text: '张阿姨下午好！今天想聊点什么？', voice: true },
  { id: 2, role: 'user', text: '高血压平时要注意什么？' },
  {
    id: 3,
    role: 'bot',
    text: '根据健康知识库：要低盐饮食、规律服药、每天测血压。需要帮您设置用药提醒吗？',
    voice: true,
  },
])

function toggleRecord() {
  recording.value = !recording.value
  if (recording.value) {
    setTimeout(() => {
      recording.value = false
      inputText.value = '今天血压有点高怎么办'
      send()
    }, 1200)
  }
}

async function send() {
  const text = inputText.value.trim()
  if (!text) return
  messages.value.push({ id: Date.now(), role: 'user', text })
  inputText.value = ''
  await nextTick()
  listRef.value?.scrollTo({ top: listRef.value.scrollHeight, behavior: 'smooth' })
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      role: 'bot',
      text:
        mode.value === 'kb'
          ? '【知识库】已为您匹配标准答案，详见健康管理建议。'
          : '好的，我记下了。您最近睡眠怎么样？',
      voice: true,
    })
    nextTick(() =>
      listRef.value?.scrollTo({ top: listRef.value.scrollHeight, behavior: 'smooth' })
    )
  }, 600)
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 52px - 64px - 32px);
  min-height: 480px;
  margin: -16px;
  padding: 0;
}
.chat-mode-bar {
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.mode-tag {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 14px;
  background: #f5f5f5;
  cursor: pointer;
}
.mode-tag.active {
  background: var(--user-primary-light);
  color: var(--user-primary);
  font-weight: 600;
}
.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.chat-bubble {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.chat-bubble.user {
  flex-direction: row-reverse;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--user-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}
.bubble-body {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.chat-bubble.user .bubble-body {
  background: var(--user-primary);
  color: #fff;
}
.bubble-body p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}
.voice-tag {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
}
.chat-input-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #eee;
  align-items: center;
}
.input-voice {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.input-voice.on {
  background: var(--user-danger);
  color: #fff;
  animation: pulse 1s infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.85;
  }
}
.input-text {
  flex: 1;
  height: 44px;
  border: 1px solid #e8e8e8;
  border-radius: 22px;
  padding: 0 16px;
  font-size: 16px;
  outline: none;
}
.input-send {
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 22px;
  background: var(--user-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.chat-hint {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin: 0;
  padding: 4px;
  background: #fafafa;
}
</style>
