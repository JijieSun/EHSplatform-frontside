<template>
  <div class="community-page">
    <div v-for="s in services" :key="s.id" class="service-card user-card">
      <div class="s-head">
        <span class="s-icon">{{ s.icon }}</span>
        <div><h3>{{ s.name }}</h3><p class="s-provider">{{ s.provider }}</p></div>
        <span class="s-tag" :class="s.status">{{ s.statusText }}</span>
      </div>
      <p class="s-desc">{{ s.desc }}</p>
      <button type="button" class="order-btn" @click="order(s)">预约服务</button>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { communityServices } from '@/data/demoData'

const services = communityServices

async function order(s) {
  try {
    await ElMessageBox.confirm(`确认预约「${s.name}」？工作人员将电话联系您。`, '预约确认')
    ElMessage.success('预约成功')
  } catch { /* cancel */ }
}
</script>

<style scoped>
.service-card { margin-bottom: 12px; }
.s-head { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 8px; }
.s-icon { font-size: 32px; }
.s-head h3 { margin: 0 0 4px; font-size: 17px; }
.s-provider { margin: 0; font-size: 13px; color: #999; }
.s-tag { margin-left: auto; font-size: 12px; padding: 4px 10px; border-radius: 8px; white-space: nowrap; }
.s-tag.online { background: #f6ffed; color: var(--user-safe); }
.s-tag.busy { background: #fff7e6; color: var(--user-warm); }
.s-desc { font-size: 15px; color: var(--user-text-secondary); line-height: 1.5; margin: 0 0 12px; }
.order-btn { width: 100%; min-height: 44px; border: none; border-radius: 12px; background: var(--user-primary); color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; }
</style>
