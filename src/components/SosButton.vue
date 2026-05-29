<template>
  <button
    class="sos-btn"
    :class="{ pressing, holding }"
    type="button"
    @touchstart.prevent="startHold"
    @touchend.prevent="endHold"
    @touchcancel.prevent="endHold"
    @mousedown="startHold"
    @mouseup="endHold"
    @mouseleave="endHold"
    @click.prevent
  >
    <span class="sos-icon">SOS</span>
    <span class="sos-label">紧急呼救</span>
    <span v-if="holding" class="sos-hold">继续按住 {{ holdLeft }} 秒…</span>
    <span v-else class="sos-hint">长按 5 秒拨打紧急联系人</span>
    <div v-if="pressing" class="hold-bar">
      <div class="hold-fill" :style="{ width: holdPercent + '%' }" />
    </div>
  </button>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getEmergencyContact } from '@/stores/userStore'

const HOLD_MS = 5000
const pressing = ref(false)
const holding = ref(false)
const holdElapsed = ref(0)
let holdTimer = null
let tickTimer = null
let startAt = 0

const holdLeft = computed(() => Math.max(1, Math.ceil((HOLD_MS - holdElapsed.value) / 1000)))
const holdPercent = computed(() => Math.min(100, (holdElapsed.value / HOLD_MS) * 100))

function clearTimers() {
  if (holdTimer) {
    clearTimeout(holdTimer)
    holdTimer = null
  }
  if (tickTimer) {
    clearInterval(tickTimer)
    tickTimer = null
  }
}

function startHold() {
  if (pressing.value) return
  pressing.value = true
  holding.value = false
  holdElapsed.value = 0
  startAt = Date.now()
  tickTimer = setInterval(() => {
    holdElapsed.value = Date.now() - startAt
  }, 50)
  holdTimer = setTimeout(triggerSos, HOLD_MS)
}

function endHold() {
  if (!pressing.value) return
  const completed = holdElapsed.value >= HOLD_MS
  clearTimers()
  pressing.value = false
  holding.value = false
  holdElapsed.value = 0
  if (!completed && holdTimer !== null) {
    // released early — timer cleared above, no action
  }
}

function triggerSos() {
  clearTimers()
  pressing.value = false
  holding.value = false
  holdElapsed.value = HOLD_MS

  const contact = getEmergencyContact()
  ElMessage.warning(`正在拨打紧急联系人 ${contact.relation} ${contact.name}（${contact.phone}）`)

  const link = document.createElement('a')
  link.href = `tel:${contact.dialPhone}`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

watch(holdElapsed, (ms) => {
  if (pressing.value && ms >= 1000) holding.value = true
})
</script>

<style scoped>
.sos-btn {
  width: 100%;
  min-height: 88px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(145deg, #ff4d4f, #cf1322);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(255, 77, 79, 0.45);
  position: relative;
  overflow: hidden;
  margin: 0 0 16px;
}
.sos-btn.pressing {
  transform: scale(0.98);
}
.sos-btn.holding {
  box-shadow: 0 8px 32px rgba(255, 77, 79, 0.65);
}
.sos-icon {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 2px;
}
.sos-label {
  font-size: var(--user-font-lg);
  font-weight: 600;
}
.sos-hint,
.sos-hold {
  font-size: 13px;
  opacity: 0.9;
}
.hold-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.15);
}
.hold-fill {
  height: 100%;
  background: #fff;
  transition: width 0.05s linear;
}
</style>
