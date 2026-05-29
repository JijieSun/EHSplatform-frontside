<template>
  <el-drawer
    :model-value="open"
    direction="rtl"
    size="100%"
    :with-header="false"
    class="wechat-drawer"
    @update:model-value="$emit('update:open', $event)"
    @opened="onOpened"
  >
    <div class="wechat-chat">
      <header class="chat-header">
        <button type="button" class="back-btn" @click="$emit('update:open', false)">‹</button>
        <div class="header-info">
          <span class="header-name">{{ member?.relation }} {{ member?.name }}</span>
          <span class="header-status">{{ member?.online ? '在线' : '离线' }}</span>
        </div>
        <span class="header-spacer" />
      </header>

      <div ref="listRef" class="chat-body">
        <div
          v-for="msg in thread"
          :key="msg.id"
          class="bubble-row"
          :class="isSelf(msg) ? 'self' : 'other'"
        >
          <span
            v-if="!isSelf(msg)"
            class="avatar"
            :style="{ background: avatarColor }"
          >
            {{ member?.name?.[0] }}
          </span>
          <div class="bubble">
            <p>{{ msg.text }}</p>
            <span v-if="msg.isVoice" class="voice-tag">🎤 语音消息</span>
          </div>
          <span v-if="isSelf(msg)" class="avatar self-avatar">我</span>
        </div>
      </div>

      <footer class="chat-footer">
        <button type="button" class="mode-toggle" @click="inputMode = inputMode === 'text' ? 'voice' : 'text'">
          {{ inputMode === 'text' ? '🎤' : '⌨️' }}
        </button>

        <div v-if="inputMode === 'text'" class="text-input-wrap">
          <textarea
            v-model="draft"
            rows="1"
            placeholder="发消息…"
            @keydown.enter.exact.prevent="sendText"
          />
          <button type="button" class="send-btn" :disabled="!draft.trim()" @click="sendText">发送</button>
        </div>

        <button
          v-else
          type="button"
          class="hold-talk"
          :class="{ recording }"
          @touchstart.prevent="startRecord"
          @touchend.prevent="endRecord"
          @mousedown="startRecord"
          @mouseup="endRecord"
          @mouseleave="onMouseLeave"
        >
          {{ recording ? '松开 发送' : '按住 说话' }}
        </button>
      </footer>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getFamilyChat,
  sendFamilyChatMessage,
  markMemberChatRead,
  getMemberAvatarColor,
} from '@/stores/userStore'

const props = defineProps({
  open: { type: Boolean, default: false },
  member: { type: Object, default: null },
  /** user=长辈端守护页；family=家人端留言页 */
  senderRole: { type: String, default: 'user' },
  memberIndex: { type: Number, default: 0 },
})

defineEmits(['update:open'])

const inputMode = ref('text')
const draft = ref('')
const recording = ref(false)
const listRef = ref(null)
let mouseDown = false

const thread = computed(() => (props.member ? getFamilyChat(props.member.id) : []))
const avatarColor = computed(() => getMemberAvatarColor(props.memberIndex))

const voiceSamples = [
  '好的，我知道了',
  '今天身体还不错',
  '记得周末来看我',
]

function isSelf(msg) {
  return msg.role === props.senderRole
}

watch(
  () => props.open,
  async (v) => {
    if (v) {
      await nextTick()
      scrollBottom()
    }
  }
)

watch(thread, async () => {
  await nextTick()
  scrollBottom()
}, { deep: true })

function onOpened() {
  if (props.member) markMemberChatRead(props.member.id)
  scrollBottom()
}

async function scrollBottom() {
  await nextTick()
  listRef.value?.scrollTo({ top: listRef.value.scrollHeight, behavior: 'smooth' })
}

function nowTime() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}`
}

function sendText() {
  const text = draft.value.trim()
  if (!text || !props.member) return
  sendFamilyChatMessage(props.member.id, {
    role: props.senderRole,
    text,
    isVoice: false,
    time: nowTime(),
  })
  draft.value = ''
}

function startRecord() {
  if (recording.value) return
  mouseDown = true
  recording.value = true
}

function endRecord() {
  if (!recording.value || !props.member) return
  mouseDown = false
  recording.value = false
  const text = props.senderRole === 'user'
    ? voiceSamples[Math.floor(Math.random() * voiceSamples.length)]
    : ['妈，记得按时吃药', '周末我来看您', '血压测了吗？'][Math.floor(Math.random() * 3)]
  sendFamilyChatMessage(props.member.id, {
    role: props.senderRole,
    text,
    isVoice: true,
    time: nowTime(),
  })
  ElMessage.success('语音已发送')
}

function onMouseLeave() {
  if (mouseDown && recording.value) endRecord()
}
</script>

<style scoped>
.wechat-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ededed;
}
.chat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #ededed;
  border-bottom: 1px solid #d9d9d9;
  flex-shrink: 0;
}
.back-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  color: #333;
  cursor: pointer;
}
.header-info {
  flex: 1;
  text-align: center;
}
.header-name {
  display: block;
  font-size: 16px;
  font-weight: 700;
}
.header-status {
  font-size: 11px;
  color: #888;
}
.header-spacer {
  width: 36px;
}
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  -webkit-overflow-scrolling: touch;
}
.bubble-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  align-items: flex-end;
}
.bubble-row.self {
  justify-content: flex-end;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}
.self-avatar {
  background: #8bc34a;
  font-size: 13px;
}
.bubble {
  max-width: 72%;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fff;
  position: relative;
}
.bubble-row.self .bubble {
  background: #95ec69;
}
.bubble p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  word-break: break-word;
}
.voice-tag {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.75;
}
.chat-footer {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
  background: #f7f7f7;
  border-top: 1px solid #ddd;
  flex-shrink: 0;
}
.mode-toggle {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #fff;
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;
}
.text-input-wrap {
  flex: 1;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}
.text-input-wrap textarea {
  flex: 1;
  min-height: 40px;
  max-height: 100px;
  border: none;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 16px;
  resize: none;
  font-family: inherit;
  outline: none;
}
.send-btn {
  min-height: 40px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  background: var(--user-primary);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
}
.send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.hold-talk {
  flex: 1;
  min-height: 44px;
  border: none;
  border-radius: 8px;
  background: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.hold-talk.recording {
  background: #c8c8c8;
  color: #333;
}
</style>

<style>
.wechat-drawer .el-drawer__body {
  padding: 0;
}
</style>
