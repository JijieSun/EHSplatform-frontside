<template>
  <section class="network-card user-card" :class="{ connected: network.connected, collapsed: network.connected && collapsed }">
    <template v-if="!network.connected">
      <div class="net-head">
        <span class="net-icon">📶</span>
        <div>
          <h3 class="net-title">设备未联网</h3>
          <p class="net-desc">请为陪伴机器人配置 Wi-Fi，联网后可语音对话与同步数据</p>
        </div>
      </div>
      <button type="button" class="net-btn" :disabled="pairing" @click="startPairing">
        {{ pairing ? `配网中 ${pairingStep}%…` : '开始配网联网' }}
      </button>
      <p class="net-hint">演示：点击后模拟连接家庭 Wi-Fi</p>
    </template>

    <template v-else>
      <button type="button" class="net-head net-toggle" @click="collapsed = !collapsed">
        <span class="net-icon online">✓</span>
        <div class="net-summary">
          <h3 class="net-title">设备已联网</h3>
          <p class="net-desc">{{ network.wifiName }} · 电量 {{ network.battery }}%</p>
        </div>
        <span class="status-pill">在线</span>
        <span class="collapse-icon" :class="{ open: !collapsed }">›</span>
      </button>

      <div v-show="!collapsed" class="net-details">
        <div class="status-grid">
          <div class="status-item">
            <span class="s-label">设备编号</span>
            <span class="s-value">{{ network.deviceId }}</span>
          </div>
          <div class="status-item">
            <span class="s-label">信号强度</span>
            <span class="s-value">{{ network.signal }}%</span>
          </div>
          <div class="status-item">
            <span class="s-label">电量</span>
            <span class="s-value">{{ network.battery }}%</span>
          </div>
          <div class="status-item">
            <span class="s-label">固件版本</span>
            <span class="s-value">{{ network.firmware }}</span>
          </div>
          <div class="status-item full">
            <span class="s-label">最近同步</span>
            <span class="s-value">{{ network.lastSync }}</span>
          </div>
        </div>
        <button type="button" class="net-btn outline" @click.stop="disconnect">断开网络（演示）</button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { state, connectDevice, disconnectDevice } from '@/stores/userStore'

const network = state.deviceNetwork
const pairing = ref(false)
const pairingStep = ref(0)
const collapsed = ref(true)

function startPairing() {
  pairing.value = true
  pairingStep.value = 0
  const timer = setInterval(() => {
    pairingStep.value += 20
    if (pairingStep.value >= 100) {
      clearInterval(timer)
      pairing.value = false
      connectDevice()
      collapsed.value = true
      ElMessage.success('配网成功，设备已联网')
    }
  }, 400)
}

function disconnect() {
  disconnectDevice()
  collapsed.value = false
  ElMessage.info('已断开网络连接')
}
</script>

<style scoped>
.network-card {
  margin-bottom: 16px;
  border: 2px solid #ffe58f;
  background: linear-gradient(180deg, #fffbe6, #fff);
}
.network-card.connected {
  border-color: #b7eb8f;
  background: linear-gradient(180deg, #f6ffed, #fff);
}
.network-card.collapsed {
  padding-bottom: 12px;
}
.net-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}
.network-card.collapsed .net-head {
  margin-bottom: 0;
}
.net-toggle {
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  align-items: center;
}
.net-summary {
  flex: 1;
  min-width: 0;
}
.net-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fff7e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.net-icon.online {
  background: #f6ffed;
  color: var(--user-safe);
  font-weight: 700;
}
.net-title {
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 700;
}
.net-desc {
  margin: 0;
  font-size: 13px;
  color: var(--user-text-secondary);
  line-height: 1.4;
}
.status-pill {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 8px;
  background: #f6ffed;
  color: var(--user-safe);
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}
.collapse-icon {
  font-size: 22px;
  color: #999;
  transform: rotate(90deg);
  transition: transform 0.2s;
  flex-shrink: 0;
  line-height: 1;
}
.collapse-icon.open {
  transform: rotate(-90deg);
}
.net-details {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}
.status-item {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 10px 12px;
}
.status-item.full {
  grid-column: 1 / -1;
}
.s-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 2px;
}
.s-value {
  font-size: 14px;
  font-weight: 600;
}
.net-btn {
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: 12px;
  background: var(--user-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.net-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}
.net-btn.outline {
  background: #fff;
  border: 2px solid #e8e8e8;
  color: #666;
}
.net-hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style>
