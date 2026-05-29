<template>
  <button
    class="sos-btn"
    :class="{ pressing }"
    type="button"
    @touchstart.prevent="startHold"
    @touchend.prevent="endHold"
    @mousedown="startHold"
    @mouseup="endHold"
    @mouseleave="endHold"
    @click="onClick"
  >
    <span class="sos-icon">SOS</span>
    <span class="sos-label">{{ label }}</span>
    <span v-if="holding" class="sos-hold">松开取消</span>
    <span v-else class="sos-hint">长按 3 秒呼救</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

defineProps({
  label: { type: String, default: '紧急呼救' },
})

const holding = ref(false)
const pressing = ref(false)
let timer = null

function startHold() {
  pressing.value = true
  holding.value = false
  timer = setTimeout(() => {
    holding.value = true
    triggerSos()
  }, 3000)
}

function endHold() {
  pressing.value = false
  if (timer) clearTimeout(timer)
  if (!holding.value) return
  holding.value = false
}

function onClick(e) {
  if (holding.value) e.preventDefault()
}

async function triggerSos() {
  holding.value = false
  pressing.value = false
  try {
    await ElMessageBox.confirm(
      '已检测到紧急呼救，将通知家属与社区服务人员。是否确认发送？',
      '紧急呼救',
      { confirmButtonText: '立即呼救', cancelButtonText: '取消', type: 'warning' }
    )
    ElMessage.success('呼救已发送，家属将收到通知')
  } catch {
    ElMessage.info('已取消呼救')
  }
}
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
  transition: transform 0.15s;
}
.sos-btn.pressing {
  transform: scale(0.98);
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
</style>
