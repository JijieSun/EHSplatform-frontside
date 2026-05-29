<template>
  <div class="family-msg-page">
    <div v-for="msg in messages" :key="msg.id" class="msg-card user-card" :class="{ pinned: msg.pinned }">
      <div class="msg-head">
        <span class="from">{{ msg.from }}</span>
        <span v-if="msg.pinned" class="pin">置顶</span>
      </div>
      <p class="content">{{ msg.content }}</p>
      <div class="msg-foot">
        <span class="time">{{ msg.time }}</span>
        <button type="button" class="reply-btn" @click="reply(msg)">语音回复</button>
      </div>
    </div>

    <div class="compose-bar">
      <input v-model="draft" type="text" placeholder="给家人留言…" />
      <button type="button" @click="send">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const draft = ref('')
const messages = ref([
  { id: 1, from: '儿子 小明', content: '妈，周末我来看您，想吃什么跟我说。', time: '昨天 18:30', pinned: true },
  { id: 2, from: '女儿 小红', content: '记得按时吃药，血压仪不会用随时打电话给我。', time: '3天前', pinned: false },
  { id: 3, from: '孙子 小宝', content: '奶奶我想您了！', time: '上周', pinned: false },
])

function reply() {
  ElMessage.success('开始录音回复（演示）')
}
function send() {
  if (!draft.value.trim()) return
  messages.value.unshift({
    id: Date.now(),
    from: '我',
    content: draft.value,
    time: '刚刚',
    pinned: false,
  })
  draft.value = ''
  ElMessage.success('留言已发送')
}
</script>

<style scoped>
.msg-card {
  margin-bottom: 12px;
}
.msg-card.pinned {
  border-left: 4px solid var(--user-warm);
}
.msg-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.from {
  font-weight: 600;
  font-size: 16px;
}
.pin {
  font-size: 12px;
  background: #fff7e6;
  color: var(--user-warm);
  padding: 2px 8px;
  border-radius: 4px;
}
.content {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 12px;
}
.msg-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.time {
  font-size: 13px;
  color: #999;
}
.reply-btn {
  border: none;
  background: var(--user-primary-light);
  color: var(--user-primary);
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.compose-bar {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 8px;
  padding: 12px 0;
  background: var(--user-bg);
}
.compose-bar input {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  border: 1px solid #e8e8e8;
  padding: 0 16px;
  font-size: 16px;
}
.compose-bar button {
  height: 44px;
  padding: 0 20px;
  border: none;
  border-radius: 22px;
  background: var(--user-primary);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
</style>
