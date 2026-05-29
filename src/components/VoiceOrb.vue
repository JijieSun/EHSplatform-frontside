<template>
  <div class="voice-orb" :class="{ active: listening }" @click="$emit('tap')">
    <div class="orb-ring ring-1" />
    <div class="orb-ring ring-2" />
    <div class="orb-core">
      <el-icon :size="36"><Microphone /></el-icon>
    </div>
    <p class="orb-text">{{ listening ? '正在聆听…' : hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  listening: Boolean,
  hint: { type: String, default: '点击或说「小伴小伴」' },
})
defineEmits(['tap'])
</script>

<style scoped>
.voice-orb {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  cursor: pointer;
  position: relative;
}
.orb-core {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--user-primary), #69b1ff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  box-shadow: 0 8px 28px rgba(43, 125, 233, 0.4);
}
.orb-ring {
  position: absolute;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 2px solid var(--user-primary);
  opacity: 0;
}
.voice-orb.active .orb-ring {
  animation: ripple 1.5s infinite;
}
.ring-2 { animation-delay: 0.5s; }
@keyframes ripple {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
}
.orb-text {
  margin-top: 16px;
  font-size: 16px;
  color: var(--user-text-secondary);
}
.voice-orb.active .orb-text {
  color: var(--user-primary);
  font-weight: 600;
}
</style>
