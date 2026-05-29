<template>
  <div class="chat-history-layout">
    <!-- 左侧：按日期的新对话列表 -->
    <aside class="session-sidebar">
      <p class="sidebar-title">历史</p>
      <div v-for="group in sessionGroups" :key="group.date" class="sidebar-group">
        <p class="sidebar-date">{{ group.date }}</p>
        <button
          v-for="session in group.sessions"
          :key="session.id"
          type="button"
          class="session-item"
          :class="{ active: activeId === session.id }"
          @click="activeId = session.id"
        >
          <span class="sess-time">{{ session.time }}</span>
          <span class="sess-title">{{ session.title }}</span>
        </button>
      </div>
    </aside>

    <!-- 右侧：逐句对话气泡 -->
    <main class="message-panel">
      <header v-if="activeSession" class="panel-header">
        <h3 class="panel-title">{{ activeSession.title }}</h3>
        <span class="panel-meta">{{ activeSession.date }} {{ activeSession.time }} · {{ activeSession.mode }}</span>
      </header>

      <div ref="listRef" class="message-list">
        <div
          v-for="msg in activeSession?.messages || []"
          :key="msg.id"
          class="msg-row"
          :class="msg.role"
        >
          <span class="msg-avatar">{{ msg.role === 'bot' ? botName[0] : '我' }}</span>
          <div class="msg-bubble">
            <p>{{ msg.text }}</p>
            <span v-if="msg.voice && msg.role === 'bot'" class="voice-hint">🔊 语音播报</span>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { chatSessions, groupChatSessions } from '@/data/chatSessions'
import { state } from '@/stores/userStore'

const botName = computed(() => state.settings.nickname || '小伴')
const sessionGroups = computed(() => groupChatSessions(chatSessions))
const activeId = ref(chatSessions[0]?.id || '')
const listRef = ref(null)

const activeSession = computed(() => chatSessions.find((s) => s.id === activeId.value))

watch(activeId, async () => {
  await nextTick()
  listRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(async () => {
  await nextTick()
  listRef.value?.scrollTo({ top: listRef.value.scrollHeight })
})
</script>

<style scoped>
.chat-history-layout {
  display: flex;
  height: calc(100dvh - var(--user-tab-h));
  margin: -16px;
  background: #f7f8fa;
  overflow: hidden;
}
.session-sidebar {
  width: 92px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #ebebeb;
  overflow-y: auto;
  padding: 10px 6px;
  -webkit-overflow-scrolling: touch;
}
.sidebar-title {
  margin: 0 0 10px;
  padding: 0 4px;
  font-size: 13px;
  font-weight: 700;
  color: #333;
}
.sidebar-group {
  margin-bottom: 12px;
}
.sidebar-date {
  margin: 0 0 6px;
  padding: 0 4px;
  font-size: 11px;
  color: #999;
  font-weight: 600;
}
.session-item {
  width: 100%;
  border: none;
  background: #f5f6f8;
  border-radius: 10px;
  padding: 8px 6px;
  margin-bottom: 6px;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.session-item.active {
  background: var(--user-primary-light);
  box-shadow: inset 0 0 0 1.5px var(--user-primary);
}
.sess-time {
  font-size: 11px;
  color: #999;
}
.session-item.active .sess-time {
  color: var(--user-primary);
}
.sess-title {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.message-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.panel-header {
  padding: 12px 14px;
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  flex-shrink: 0;
}
.panel-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
}
.panel-meta {
  font-size: 12px;
  color: #999;
}
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 14px 12px;
  -webkit-overflow-scrolling: touch;
}
.msg-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  align-items: flex-start;
}
.msg-row.user {
  flex-direction: row-reverse;
}
.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--user-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}
.msg-row.user .msg-avatar {
  background: #8bc34a;
}
.msg-bubble {
  max-width: 78%;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.msg-row.user .msg-bubble {
  background: #d9f7be;
}
.msg-bubble p {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: #1a1a1a;
}
.voice-hint {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: #888;
}
.msg-time {
  display: block;
  margin-top: 4px;
  font-size: 10px;
  color: #bbb;
  text-align: right;
}
</style>
