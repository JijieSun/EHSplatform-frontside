<template>
  <div class="user-home">
    <NetworkStatusCard />

    <section class="greet-card user-card">
      <p class="greet-time">{{ greet }}，{{ displayName }}</p>
      <p class="greet-tip">祝您今天心情舒畅</p>
    </section>

    <section class="weather-card user-card">
      <div class="weather-main">
        <span class="weather-icon">{{ weather.icon }}</span>
        <div>
          <p class="weather-temp">{{ weather.temp }}°C</p>
          <p class="weather-desc">{{ weather.condition }}</p>
        </div>
      </div>
      <div class="weather-meta">
        <span>{{ weather.city }}</span>
        <span class="dot">·</span>
        <span>湿度 {{ weather.humidity }}%</span>
        <span class="dot">·</span>
        <span>{{ weather.wind }}</span>
      </div>
      <p class="weather-tip">{{ weather.tip }}</p>
    </section>

    <section class="med-card user-card">
      <div class="card-head">
        <h3 class="card-title">今日用药提醒</h3>
        <span class="med-badge" v-if="pendingMeds">{{ pendingMeds }} 次待服</span>
      </div>
      <div v-if="medications.length === 0" class="empty-tip">暂无用药计划</div>
      <div v-for="med in medications" :key="med.id" class="med-row">
        <div class="med-info">
          <span class="med-name">{{ med.name }}</span>
          <span class="med-meta">{{ formatMedSchedule(med) }} · {{ med.dose }}</span>
        </div>
        <button
          type="button"
          class="med-btn"
          :class="{ done: med.done }"
          @click="toggleMedicationDone(med.id)"
        >
          {{ med.done ? '已服用' : '打卡' }}
        </button>
      </div>
      <router-link to="/care" class="card-link">前往守护查看留言与设备 →</router-link>
    </section>

    <section class="task-card user-card">
      <div class="task-head">
        <span class="task-title">信息采集 · {{ progress.status }}</span>
        <router-link to="/collect" class="task-link">继续答题 →</router-link>
      </div>
      <el-progress :percentage="progressPercent" :stroke-width="12" :show-text="false" />
      <p class="task-desc">已完成 {{ progress.answered }} / {{ progress.total }} 题</p>
      <p class="task-hint">在此完成问答采集，内容将整理进回忆录</p>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import NetworkStatusCard from '@/components/NetworkStatusCard.vue'
import { currentUser, collectProgress, greeting } from '@/data/demoData'
import { formatMedSchedule } from '@/data/medicationConfig'
import { state, toggleMedicationDone } from '@/stores/userStore'

const progress = collectProgress
const greet = computed(() => greeting())
const displayName = computed(() =>
  state.isLoggedIn ? state.user.displayName : currentUser.displayName
)
const medications = computed(() => state.medications)
const pendingMeds = computed(() => state.medications.filter((m) => !m.done).length)
const progressPercent = computed(() =>
  Math.round((progress.answered / progress.total) * 1000) / 10
)

const weather = {
  icon: '☀️',
  temp: 22,
  condition: '晴',
  city: '上海',
  humidity: 58,
  wind: '东南风 2 级',
  tip: '天气舒适，适合户外散步，注意补充水分。',
}
</script>

<style scoped>
.greet-card {
  background: linear-gradient(135deg, #2b7de9, #69b1ff);
  color: #fff;
  margin-bottom: 12px;
}
.greet-time {
  font-size: var(--user-font-xl);
  font-weight: 700;
  margin: 0 0 6px;
}
.greet-tip {
  margin: 0;
  font-size: 15px;
  opacity: 0.95;
}
.weather-card {
  margin-bottom: 12px;
  background: linear-gradient(180deg, #e8f7ff, #fff);
}
.weather-main {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;
}
.weather-icon {
  font-size: 48px;
  line-height: 1;
}
.weather-temp {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--user-primary);
}
.weather-desc {
  margin: 2px 0 0;
  font-size: 16px;
  color: #666;
}
.weather-meta {
  font-size: 13px;
  color: var(--user-text-secondary);
}
.dot {
  margin: 0 6px;
}
.weather-tip {
  margin: 10px 0 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
}
.med-card {
  margin-bottom: 12px;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.card-title {
  margin: 0;
  font-size: var(--user-font-lg);
  font-weight: 600;
}
.med-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 10px;
  background: #fff7e6;
  color: var(--user-warm);
  font-weight: 600;
}
.empty-tip {
  text-align: center;
  padding: 16px;
  color: #999;
  font-size: 14px;
}
.med-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  gap: 8px;
}
.med-row:last-of-type {
  border-bottom: none;
}
.med-name {
  display: block;
  font-weight: 600;
  font-size: 16px;
}
.med-meta {
  font-size: 13px;
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
  flex-shrink: 0;
}
.med-btn.done {
  background: var(--user-safe);
  border-color: var(--user-safe);
  color: #fff;
}
.card-link {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: var(--user-primary);
  text-decoration: none;
  font-weight: 600;
  text-align: center;
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
.task-hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: #999;
  line-height: 1.5;
}
</style>
