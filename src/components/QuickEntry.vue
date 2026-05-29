<template>
  <div class="quick-grid">
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      class="quick-item"
      @click="$emit('select', item)"
    >
      <span class="quick-icon" :style="{ background: item.bg }">{{ item.icon }}</span>
      <span class="quick-label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } })
defineEmits(['select'])
</script>

<style scoped>
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.quick-item {
  border: none;
  background: var(--user-card);
  border-radius: 14px;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: var(--user-touch-min);
}
.quick-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.quick-label {
  font-size: 13px;
  line-height: 1.2;
}
</style>
