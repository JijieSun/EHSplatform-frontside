<template>
  <div class="care-page">
    <SosButton class="care-sos" />

    <section class="care-section user-card">
      <h3 class="section-title">用药提醒</h3>
      <div v-for="med in meds" :key="med.id" class="med-item">
        <div class="med-info">
          <span class="med-name">{{ med.name }}</span>
          <span class="med-time">{{ med.time }}</span>
        </div>
        <button
          type="button"
          class="med-btn"
          :class="{ done: med.done }"
          @click="med.done = !med.done"
        >
          {{ med.done ? '已服用' : '打卡' }}
        </button>
      </div>
    </section>

    <section class="care-section user-card">
      <h3 class="section-title">家人留言</h3>
      <div v-for="msg in familyMsgs" :key="msg.id" class="msg-item" @click="$router.push('/app/family-msg')">
        <span class="msg-from">{{ msg.from }}</span>
        <p class="msg-text">{{ msg.text }}</p>
        <span class="msg-time">{{ msg.time }}</span>
      </div>
      <router-link to="/app/family-msg" class="section-link">查看全部留言 →</router-link>
    </section>

    <section class="care-section user-card">
      <h3 class="section-title">社区服务</h3>
      <div class="service-grid">
        <button
          v-for="s in services"
          :key="s.name"
          type="button"
          class="service-btn"
          @click="$router.push('/app/community')"
        >
          <span class="s-icon">{{ s.icon }}</span>
          <span>{{ s.name }}</span>
        </button>
      </div>
    </section>

    <router-link to="/app/health" class="health-banner user-card">
      <span>💊 健康 & 用药知识库</span>
      <span class="arrow">→</span>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SosButton from '@/user/components/SosButton.vue'

const meds = ref([
  { id: 1, name: '降压药', time: '08:00', done: true },
  { id: 2, name: '钙片', time: '12:30', done: false },
  { id: 3, name: '降压药', time: '20:00', done: false },
])

const familyMsgs = [
  { id: 1, from: '儿子 小明', text: '妈，周末我来看您', time: '昨天' },
  { id: 2, from: '女儿 小红', text: '记得按时吃药哦', time: '3天前' },
]

const services = [
  { name: '日间照料', icon: '🏠' },
  { name: '上门体检', icon: '🩺' },
  { name: '助餐服务', icon: '🍱' },
  { name: '康复理疗', icon: '💪' },
]
</script>

<style scoped>
.care-sos {
  margin-bottom: 16px;
}
.section-title {
  font-size: var(--user-font-lg);
  margin: 0 0 12px;
}
.care-section {
  margin-bottom: 12px;
}
.med-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.med-item:last-of-type {
  border-bottom: none;
}
.med-name {
  font-weight: 600;
  display: block;
}
.med-time {
  font-size: 14px;
  color: var(--user-text-secondary);
}
.med-btn {
  min-width: 72px;
  height: 40px;
  border-radius: 20px;
  border: 2px solid var(--user-primary);
  background: #fff;
  color: var(--user-primary);
  font-weight: 600;
  cursor: pointer;
}
.med-btn.done {
  background: var(--user-safe);
  border-color: var(--user-safe);
  color: #fff;
}
.msg-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.msg-from {
  font-weight: 600;
  font-size: 15px;
}
.msg-text {
  margin: 4px 0;
  color: var(--user-text-secondary);
  font-size: 15px;
}
.msg-time {
  font-size: 12px;
  color: #999;
}
.section-link {
  display: block;
  margin-top: 8px;
  color: var(--user-primary);
  text-decoration: none;
  font-size: 15px;
}
.service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.service-btn {
  min-height: 72px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 15px;
  cursor: pointer;
}
.s-icon {
  font-size: 24px;
}
.health-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: inherit;
  font-weight: 600;
  font-size: var(--user-font-lg);
  margin-top: 4px;
}
.arrow {
  color: var(--user-primary);
}
</style>
