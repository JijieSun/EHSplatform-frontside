<template>
  <div class="user-home">
    <section class="greet-card user-card">
      <p class="greet-time">{{ greeting }}，{{ userName }}</p>
      <p class="greet-tip">我是小伴，随时陪您聊天、记故事、守健康</p>
      <div class="weather-row">
        <span>☀️ 晴 22°C</span>
        <span class="dot">·</span>
        <span>今日用药 2 次待提醒</span>
      </div>
    </section>

    <VoiceOrb :listening="listening" @tap="toggleListen" />

    <section class="mode-switch">
      <button
        v-for="m in modes"
        :key="m.key"
        type="button"
        class="mode-chip"
        :class="{ active: chatMode === m.key }"
        @click="chatMode = m.key"
      >
        {{ m.label }}
      </button>
    </section>

    <QuickEntry :items="quickItems" @select="onQuick" />

    <section class="sos-section">
      <SosButton />
    </section>

    <section class="task-card user-card">
      <div class="task-head">
        <span class="task-title">今日信息采集</span>
        <router-link to="/app/collect" class="task-link">继续答题 →</router-link>
      </div>
      <el-progress :percentage="68" :stroke-width="12" :show-text="false" />
      <p class="task-desc">已完成 34 / 50 题，再答 16 题即可生成回忆录素材</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import VoiceOrb from '@/user/components/VoiceOrb.vue'
import QuickEntry from '@/user/components/QuickEntry.vue'
import SosButton from '@/user/components/SosButton.vue'

const router = useRouter()
const userName = '张阿姨'
const listening = ref(false)
const chatMode = ref('free')

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return '早上好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const modes = [
  { key: 'free', label: '自由聊天' },
  { key: 'kb', label: '知识问答' },
]

const quickItems = [
  { key: 'chat', label: '语音聊天', icon: '💬', bg: '#e8f3ff' },
  { key: 'collect', label: '今日问卷', icon: '📝', bg: '#fff7e6' },
  { key: 'memoir', label: '回忆录', icon: '📖', bg: '#f6ffed' },
  { key: 'health', label: '健康问答', icon: '💊', bg: '#fff1f0' },
  { key: 'family', label: '家人留言', icon: '👨‍👩‍👧', bg: '#f9f0ff' },
  { key: 'community', label: '社区服务', icon: '🏘️', bg: '#e6fffb' },
  { key: 'history', label: '对话记录', icon: '🕐', bg: '#f5f5f5' },
  { key: 'settings', label: '语音设置', icon: '⚙️', bg: '#f0f0f0' },
]

function toggleListen() {
  listening.value = !listening.value
  if (listening.value) {
    setTimeout(() => {
      listening.value = false
      router.push('/app/chat')
    }, 800)
  }
}

function onQuick(item) {
  const map = {
    chat: '/app/chat',
    collect: '/app/collect',
    memoir: '/app/memoir',
    health: '/app/health',
    family: '/app/family-msg',
    community: '/app/community',
    history: '/app/history',
    settings: '/app/settings',
  }
  if (map[item.key]) router.push(map[item.key])
}
</script>

<style scoped>
.greet-card {
  background: linear-gradient(135deg, #2b7de9 0%, #69b1ff 100%);
  color: #fff;
}
.greet-time {
  font-size: var(--user-font-xl);
  font-weight: 700;
  margin: 0 0 8px;
}
.greet-tip {
  margin: 0 0 12px;
  opacity: 0.95;
  font-size: 15px;
}
.weather-row {
  font-size: 14px;
  opacity: 0.9;
}
.dot {
  margin: 0 6px;
}
.mode-switch {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 16px;
}
.mode-chip {
  padding: 10px 20px;
  border-radius: 24px;
  border: 2px solid #d9d9d9;
  background: #fff;
  font-size: 16px;
  cursor: pointer;
}
.mode-chip.active {
  border-color: var(--user-primary);
  background: var(--user-primary-light);
  color: var(--user-primary);
  font-weight: 600;
}
.sos-section {
  margin: 20px 0;
}
.task-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.task-title {
  font-weight: 600;
  font-size: var(--user-font-lg);
}
.task-link {
  color: var(--user-primary);
  text-decoration: none;
  font-size: 15px;
}
.task-desc {
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--user-text-secondary);
}
</style>
