<template>
  <div class="iot-page">
    <p class="page-intro">已绑定 {{ devices.length }} 台设备</p>
    <div v-for="d in devices" :key="d.id" class="device-card user-card">
      <div class="device-head">
        <span class="device-icon">{{ icons[d.type] || '📟' }}</span>
        <div><h3>{{ d.name }}</h3><p class="device-type">{{ d.type }} · {{ d.sn }}</p></div>
        <span class="status-dot" :class="d.online ? 'on' : 'off'">{{ d.online ? '在线' : '离线' }}</span>
      </div>
      <p class="last-seen">最近：{{ d.lastOnline }} · {{ d.log }}</p>
    </div>
  </div>
</template>

<script setup>
import { iotDevices } from '@/data/demoData'

const devices = iotDevices
const icons = { 门磁: '🚪', 跌倒探测仪: '📡', 烟雾报警器: '🔥' }
</script>

<style scoped>
.page-intro { font-size: 14px; color: var(--user-text-secondary); margin: 0 0 12px; }
.device-card { margin-bottom: 12px; }
.device-head { display: flex; gap: 12px; align-items: flex-start; }
.device-icon { font-size: 32px; }
.device-head h3 { margin: 0 0 4px; font-size: 17px; }
.device-type { margin: 0; font-size: 13px; color: #999; }
.status-dot { margin-left: auto; font-size: 12px; padding: 4px 10px; border-radius: 8px; font-weight: 600; }
.status-dot.on { background: #f6ffed; color: var(--user-safe); }
.status-dot.off { background: #fff1f0; color: var(--user-danger); }
.last-seen { font-size: 13px; color: var(--user-text-secondary); margin: 8px 0 0; }
</style>
